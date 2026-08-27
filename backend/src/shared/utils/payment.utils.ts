import Stripe from "stripe";
import { env } from "../config/environment";
import { APIError } from "../errors";

export interface CreatePaymentResponse {
  secret: string;
  amount: number;
  publish_key: string;
  orderId: string;
  userId: string;
}

export interface VerifyPaymentResponse {
  isPaid: boolean;
  paymentResponse: Stripe.PaymentIntent;
  orderId: string;
}

let stripeClient: Stripe | null = null;

function getStripe(): Stripe {
  if (!stripeClient) {
    if (!env.stripe_secret_key) {
      throw new APIError("Stripe secret key not configured");
    }
    stripeClient = new Stripe(env.stripe_secret_key, {
      apiVersion: "2025-08-27.basil",
    });
  }
  return stripeClient;
}

export interface PaymentUtils {
  createPayment(amount: number, orderId: string, userId: string): Promise<CreatePaymentResponse>;
  verifyPayment(paymentId: string): Promise<VerifyPaymentResponse>;
}

export const paymentUtils: PaymentUtils = {
  async createPayment(amount: number, orderId: string, userId: string): Promise<CreatePaymentResponse> {
    try {
      const stripe = getStripe();
      const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency: "inr",
        metadata: { orderId, userId },
        description: `Transaction for order #${orderId}`,
      });

      return {
        amount: paymentIntent.amount,
        orderId,
        publish_key: env.stripe_publish_key,
        secret: paymentIntent.client_secret!,
        userId,
      };
    } catch (error) {
      throw new APIError("Payment creation failed");
    }
  },

  async verifyPayment(paymentId: string): Promise<VerifyPaymentResponse> {
    try {
      const stripe = getStripe();
      const paymentResponse = await stripe.paymentIntents.retrieve(paymentId);
      const orderId = paymentResponse.metadata.orderId || "";
      const isPaid = paymentResponse.status === "succeeded";
      return { isPaid, paymentResponse, orderId };
    } catch (error) {
      throw new APIError("Payment verification failed");
    }
  },
};
