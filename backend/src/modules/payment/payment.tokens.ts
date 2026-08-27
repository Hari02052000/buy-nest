import { container } from "tsyringe";
import { StripeService } from "./stripe.service";
import { PaymentController } from "./payment.controller";

export const PAYMENT_TOKENS = {
  StripeService: Symbol("StripeService"),
  Controller: Symbol("PaymentController"),
};

export function registerPaymentModule(): void {
  container.register(PAYMENT_TOKENS.StripeService, { useClass: StripeService });
  container.register(PAYMENT_TOKENS.Controller, { useClass: PaymentController });
}
