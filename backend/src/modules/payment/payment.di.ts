import { container } from "tsyringe";
import { StripeService } from "./stripe.service";
import { PaymentController } from "./payment.controller";
import { PAYMENT_TOKENS } from "./payment.tokens";

export function registerPaymentModule(): void {
  container.register(PAYMENT_TOKENS.StripeService, { useClass: StripeService });
  container.register(PAYMENT_TOKENS.Controller, { useClass: PaymentController });
}
