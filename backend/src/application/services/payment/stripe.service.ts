import Stripe from "stripe";
import { CustomError } from "@/domain/entities/errors";
import { STATUS_CODES } from "@/domain/entities/status.code";

interface CreatePaymentIntentRequest {
  amount: number;
  currency: string;
  orderId: string;
  customerId?: string;
  metadata?: Record<string, string>;
}

interface PaymentIntentResponse {
  clientSecret: string;
  paymentIntentId: string;
}

export class StripeService {
  private stripe: Stripe;

  constructor() {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error("STRIPE_SECRET_KEY is required");
    }
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  }

  async createPaymentIntent(data: CreatePaymentIntentRequest): Promise<PaymentIntentResponse> {
    try {
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: Math.round(data.amount * 100), // Convert to cents
        currency: data.currency || "usd",
        customer: data.customerId,
        metadata: {
          orderId: data.orderId,
          ...data.metadata,
        },
        automatic_payment_methods: {
          enabled: true,
        },
      });

      return {
        clientSecret: paymentIntent.client_secret!,
        paymentIntentId: paymentIntent.id,
      };
    } catch (error) {
      throw new CustomError(
        "Payment intent creation failed",
        STATUS_CODES.INTERNAL_ERROR,
        error instanceof Error ? error.message : "Unknown error",
      );
    }
  }

  async confirmPayment(paymentIntentId: string): Promise<Stripe.PaymentIntent> {
    try {
      const paymentIntent = await this.stripe.paymentIntents.retrieve(paymentIntentId);
      return paymentIntent;
    } catch (error) {
      throw new CustomError(
        "Payment confirmation failed",
        STATUS_CODES.INTERNAL_ERROR,
        error instanceof Error ? error.message : "Unknown error",
      );
    }
  }

  async handleWebhook(payload: string, signature: string): Promise<Stripe.Event> {
    try {
      const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
      if (!webhookSecret) {
        throw new Error("STRIPE_WEBHOOK_SECRET is required");
      }

      const event = this.stripe.webhooks.constructEvent(payload, signature, webhookSecret);
      return event;
    } catch (error) {
      throw new CustomError(
        "Webhook verification failed",
        STATUS_CODES.BAD_REQUEST,
        error instanceof Error ? error.message : "Unknown error",
      );
    }
  }

  async createCustomer(email: string, name?: string): Promise<Stripe.Customer> {
    try {
      const customer = await this.stripe.customers.create({
        email,
        name,
      });
      return customer;
    } catch (error) {
      throw new CustomError(
        "Customer creation failed",
        STATUS_CODES.INTERNAL_ERROR,
        error instanceof Error ? error.message : "Unknown error",
      );
    }
  }

  async refundPayment(paymentIntentId: string, amount?: number): Promise<Stripe.Refund> {
    try {
      const refund = await this.stripe.refunds.create({
        payment_intent: paymentIntentId,
        amount: amount ? Math.round(amount * 100) : undefined,
      });
      return refund;
    } catch (error) {
      throw new CustomError(
        "Refund failed",
        STATUS_CODES.INTERNAL_ERROR,
        error instanceof Error ? error.message : "Unknown error",
      );
    }
  }
}
