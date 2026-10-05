import { container } from "tsyringe";
import { CouponRepository } from "./coupon.repository";
import { COUPON_TOKENS } from "./coupon.tokens";

export function registerCouponModule(): void {
  container.register(COUPON_TOKENS.Repository, { useClass: CouponRepository });
}
