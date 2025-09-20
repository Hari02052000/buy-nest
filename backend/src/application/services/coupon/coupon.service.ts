import { Coupon } from "@/domain/entities/coupon";
import { CouponRepositoryInterface } from "@/domain/interfaces/repository/coupon.repository.interface";

export class CouponService {
  constructor(private couponRepository: CouponRepositoryInterface) {}

  async validateCoupon(code: string): Promise<Coupon | null> {
    const coupon = await this.couponRepository.getCouponByCode(code);

    // if (!coupon || !coupon.isValid()) {
    //   return null;
    // }

    return coupon;
  }

  async applyCoupon(code: string): Promise<Coupon> {
    const coupon = await this.validateCoupon(code);

    if (!coupon) {
      throw new Error("Invalid or expired coupon code");
    }

    return coupon;
  }

  async incrementUsage(couponId: string): Promise<void> {
    // await this.couponRepository.incrementUsageCount(couponId);
  }
}
