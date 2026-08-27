import { container } from "tsyringe";
import { CouponRepository } from "./coupon.repository";

export const COUPON_TOKENS = {
  Repository: Symbol("CouponRepository"),
};

export function registerCouponModule(): void {
  container.register(COUPON_TOKENS.Repository, { useClass: CouponRepository });
}
