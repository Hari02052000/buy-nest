import "reflect-metadata";
import { container } from "tsyringe";
import { SHARED_TOKENS } from "./tokens";
import { authUtils } from "./utils/auth.utils";
import { cloudUtils } from "./utils/cloud.utils";
import { paymentUtils } from "./utils/payment.utils";

export function configureContainer(): void {
  container.registerInstance(SHARED_TOKENS.AuthUtils, authUtils);
  container.registerInstance(SHARED_TOKENS.CloudUtils, cloudUtils);
  container.registerInstance(SHARED_TOKENS.PaymentUtils, paymentUtils);
}
