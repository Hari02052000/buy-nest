import { injectable } from "tsyringe";
import { Coupon, CouponDocument } from "./coupon.entity";
import { APIError } from "@/shared/errors";

// TODO: Implement repository methods with CouponModel
@injectable()
export class CouponRepository {
  async findByCode(code: string): Promise<Coupon | null> {
    // TODO: Implement using CouponModel.findOne({ code: code.toUpperCase(), isActive: true })
    throw new APIError("Not implemented");
  }

  async findById(id: string): Promise<Coupon | null> {
    // TODO: Implement using CouponModel.findById(id)
    throw new APIError("Not implemented");
  }

  async create(coupon: Coupon): Promise<Coupon> {
    // TODO: Implement using CouponModel.create()
    throw new APIError("Not implemented");
  }

  async update(id: string, data: Partial<Coupon>): Promise<Coupon | null> {
    // TODO: Implement using CouponModel.findByIdAndUpdate()
    throw new APIError("Not implemented");
  }

  async incrementUsageCount(id: string): Promise<void> {
    // TODO: Implement using CouponModel.findByIdAndUpdate(id, { $inc: { usedCount: 1 } })
    throw new APIError("Not implemented");
  }

  async findAll(): Promise<Coupon[]> {
    // TODO: Implement using CouponModel.find().sort({ createdAt: -1 })
    throw new APIError("Not implemented");
  }

  async findActiveCoupons(): Promise<Coupon[]> {
    // TODO: Implement using CouponModel.find({ isActive: true, expiryDate: { $gte: new Date() } })
    throw new APIError("Not implemented");
  }

  private mapToCoupon(doc: CouponDocument): Coupon {
    return Coupon.fromDocument(doc);
  }
}
