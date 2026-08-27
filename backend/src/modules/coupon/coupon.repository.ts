import { injectable } from "tsyringe";
import CouponModel from "./coupon.model";
import { Coupon, CouponDocument } from "./coupon.entity";
import { APIError } from "@/shared/errors";

@injectable()
export class CouponRepository {
  async findByCode(code: string): Promise<Coupon | null> {
    try {
      const doc = await CouponModel.findOne({ code: code.toUpperCase(), isActive: true });
      if (!doc) return null;
      return Coupon.fromDocument(doc);
    } catch (error) {
      throw new APIError("Failed to find coupon");
    }
  }

  async findById(id: string): Promise<Coupon | null> {
    try {
      const doc = await CouponModel.findById(id);
      if (!doc) return null;
      return Coupon.fromDocument(doc);
    } catch (error) {
      throw new APIError("Failed to find coupon");
    }
  }

  async create(coupon: Coupon): Promise<Coupon> {
    try {
      const doc = new CouponModel({
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        minimumOrderAmount: coupon.minimumOrderAmount,
        maxDiscountAmount: coupon.maxDiscountAmount,
        expiryDate: coupon.expiryDate,
        usageLimit: coupon.usageLimit,
        usedCount: coupon.usedCount,
        isActive: coupon.isActive,
      });
      const saved = await doc.save();
      return Coupon.fromDocument(saved);
    } catch (error) {
      throw new APIError("Failed to create coupon");
    }
  }

  async update(id: string, data: Partial<Coupon>): Promise<Coupon | null> {
    try {
      const doc = await CouponModel.findByIdAndUpdate(id, { $set: data }, { new: true });
      if (!doc) return null;
      return Coupon.fromDocument(doc);
    } catch (error) {
      throw new APIError("Failed to update coupon");
    }
  }

  async incrementUsageCount(id: string): Promise<void> {
    try {
      await CouponModel.findByIdAndUpdate(id, { $inc: { usedCount: 1 } });
    } catch (error) {
      throw new APIError("Failed to increment coupon usage");
    }
  }

  async findAll(): Promise<Coupon[]> {
    try {
      const docs = await CouponModel.find().sort({ createdAt: -1 });
      return docs.map((doc) => Coupon.fromDocument(doc));
    } catch (error) {
      throw new APIError("Failed to fetch coupons");
    }
  }

  async findActiveCoupons(): Promise<Coupon[]> {
    try {
      const docs = await CouponModel.find({
        isActive: true,
        expiryDate: { $gte: new Date() },
      });
      return docs.map((doc) => Coupon.fromDocument(doc));
    } catch (error) {
      throw new APIError("Failed to fetch active coupons");
    }
  }
}
