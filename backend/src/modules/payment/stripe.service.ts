import { injectable } from "tsyringe";
import Stripe from "stripe";
import { env } from "@/shared/config/environment";
import { APIError } from "@/shared/errors";

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

@injectable()
export class StripeService {
  private stripe: Stripe | null = null;

  private getClient(): Stripe {
    if (!this.stripe) {
      if (!env.stripe_secret_key) {
        throw new APIError("STRIPE_SECRET_KEY is required");
      }
      this.stripe = new Stripe(env.stripe_secret_key);
    }
    return this.stripe;
  }

  async createPaymentIntent(data: CreatePaymentIntentRequest): Promise<PaymentIntentResponse> {
    try {
      const stripe = this.getClient();
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(data.amount * 100),
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
      throw new APIError(
        `Payment intent creation failed: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  }

  async retrievePaymentIntent(paymentIntentId: string): Promise<Stripe.PaymentIntent> {
    try {
      const stripe = this.getClient();
      return await stripe.paymentIntents.retrieve(paymentIntentId);
    } catch (error) {
      throw new APIError(
        `Payment retrieval failed: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  }

  async handleWebhook(payload: string, signature: string): Promise<Stripe.Event> {
    try {
      const stripe = this.getClient();
      const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
      if (!webhookSecret) {
        throw new APIError("STRIPE_WEBHOOK_SECRET is required");
      }
      return stripe.webhooks.constructEvent(payload, signature, webhookSecret);
    } catch (error) {
      throw new APIError(
        `Webhook verification failed: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  }

  async createCustomer(email: string, name?: string): Promise<Stripe.Customer> {
    try {
      const stripe = this.getClient();
      return await stripe.customers.create({ email, name });
    } catch (error) {
      throw new APIError(
        `Customer creation failed: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  }

  async refundPayment(paymentIntentId: string, amount?: number): Promise<Stripe.Refund> {
    try {
      const stripe = this.getClient();
      return await stripe.refunds.create({
        payment_intent: paymentIntentId,
        amount: amount ? Math.round(amount * 100) : undefined,
      });
    } catch (error) {
      throw new APIError(
        `Refund failed: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  }
}
