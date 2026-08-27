import { injectable, inject } from "tsyringe";
import { Request, Response, NextFunction } from "express";
import { PAYMENT_TOKENS } from "./payment.tokens";
import { ResponseUtils } from "@/shared/utils/response.utils";

// TODO: Inject OrderService to verify orders and update payment status
@injectable()
export class PaymentController {
  // TODO: Inject StripeService and OrderService
  constructor() {}

  // TODO: Implement createPaymentIntent
  // - Verify order exists and belongs to user
  // - Check if payment already completed
  // - Create payment intent via StripeService
  // - Update order with payment intent ID
  createPaymentIntent = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // TODO: Implement
      res.status(501).json(ResponseUtils.error("Not implemented"));
    } catch (error) {
      next(error);
    }
  };

  // TODO: Implement confirmPayment
  // - Retrieve payment intent from Stripe
  // - Update order payment status if succeeded
  confirmPayment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // TODO: Implement
      res.status(501).json(ResponseUtils.error("Not implemented"));
    } catch (error) {
      next(error);
    }
  };

  // TODO: Implement handleWebhook
  // - Verify webhook signature
  // - Handle payment_intent.succeeded and payment_intent.payment_failed events
  handleWebhook = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // TODO: Implement
      res.status(501).json(ResponseUtils.error("Not implemented"));
    } catch (error) {
      next(error);
    }
  };
}
