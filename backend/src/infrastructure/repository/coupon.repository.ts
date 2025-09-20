import { Coupon } from "@/domain/entities/coupon";
import { CouponRepositoryInterface } from "@/domain/interfaces/repository/coupon.repository.interface";
import { APIError, ValidationError } from "@/domain/entities";
import CouponModel, { ICoupon } from "../model/coupon.model";

export class CouponRepository implements CouponRepositoryInterface {
  getCouponByCode(code: string): Promise<Coupon | null> {
    throw new Error("Method not implemented.");
  }
  getCouponById(id: string): Promise<Coupon | null> {
    throw new Error("Method not implemented.");
  }
  createCoupon(coupon: Coupon): Promise<Coupon> {
    throw new Error("Method not implemented.");
  }
  updateCoupon(id: string, coupon: Partial<Coupon>): Promise<Coupon | null> {
    throw new Error("Method not implemented.");
  }
  // async getCouponByCode(code: string): Promise<Coupon | null> {
  //   try {
  //     const couponDb = await CouponModel.findOne({
  //       code: code.toUpperCase(),
  //       isActive: true,
  //     });
  //     if (!couponDb) return null;
  //     return this.mapToCoupon(couponDb);
  //   } catch (error) {
  //     console.error("Error getting coupon by code:", error);
  //     throw new APIError();
  //   }
  // }

  // async getCouponById(id: string): Promise<Coupon | null> {
  //   try {
  //     const couponDb = await CouponModel.findById(id);
  //     if (!couponDb) return null;
  //     return this.mapToCoupon(couponDb);
  //   } catch (error) {
  //     console.error("Error getting coupon by id:", error);
  //     throw new APIError();
  //   }
  // }

  // async createCoupon(coupon: Coupon): Promise<Coupon> {
  //   try {
  //     const couponDb = new CouponModel({
  //       code: coupon.code,
  //       discountType: coupon.discountType,
  //       discountValue: coupon.discountValue,
  //       minimumOrderAmount: coupon.minimumOrderAmount,
  //       maxDiscountAmount: coupon.maxDiscountAmount,
  //       expiryDate: new Date(coupon.expiryDate),
  //       usageLimit: coupon.usageLimit,
  //       usedCount: coupon.usedCount,
  //       isActive: coupon.isActive,
  //     });
  //     await couponDb.save();
  //     return this.mapToCoupon(couponDb);
  //   } catch (error) {
  //     console.error("Error creating coupon:", error);
  //     if ((error as any).code === 11000) {
  //       throw new ValidationError("Coupon code already exists");
  //     }
  //     throw new APIError();
  //   }
  // }

  // async updateCoupon(id: string, couponData: Partial<Coupon>): Promise<Coupon | null> {
  //   try {
  //     const updateData: any = {};

  //     if (couponData.code) updateData.code = couponData.code;
  //     if (couponData.discountType) updateData.discountType = couponData.discountType;
  //     if (couponData.discountValue !== undefined) updateData.discountValue = couponData.discountValue;
  //     if (couponData.minimumOrderAmount !== undefined)
  //       updateData.minimumOrderAmount = couponData.minimumOrderAmount;
  //     if (couponData.maxDiscountAmount !== undefined)
  //       updateData.maxDiscountAmount = couponData.maxDiscountAmount;
  //     if (couponData.expiryDate) updateData.expiryDate = new Date(couponData.expiryDate);
  //     if (couponData.usageLimit !== undefined) updateData.usageLimit = couponData.usageLimit;
  //     if (couponData.usedCount !== undefined) updateData.usedCount = couponData.usedCount;
  //     if (couponData.isActive !== undefined) updateData.isActive = couponData.isActive;

  //     const couponDb = await CouponModel.findByIdAndUpdate(id, updateData, { new: true });

  //     if (!couponDb) return null;
  //     return this.mapToCoupon(couponDb);
  //   } catch (error) {
  //     console.error("Error updating coupon:", error);
  //     throw new APIError();
  //   }
  // }

  // async deleteCoupon(id: string): Promise<boolean> {
  //   try {
  //     const result = await CouponModel.findByIdAndDelete(id);
  //     return !!result;
  //   } catch (error) {
  //     console.error("Error deleting coupon:", error);
  //     throw new APIError();
  //   }
  // }

  // async incrementUsageCount(id: string): Promise<void> {
  //   try {
  //     await CouponModel.findByIdAndUpdate(id, { $inc: { usedCount: 1 } });
  //   } catch (error) {
  //     console.error("Error incrementing usage count:", error);
  //     throw new APIError();
  //   }
  // }

  // async getAllCoupons(): Promise<Coupon[]> {
  //   try {
  //     const coupons = await CouponModel.find().sort({ createdAt: -1 });
  //     return coupons.map((coupon) => this.mapToCoupon(coupon));
  //   } catch (error) {
  //     console.error("Error getting all coupons:", error);
  //     throw new APIError();
  //   }
  // }

  // async getActiveCoupons(): Promise<Coupon[]> {
  //   try {
  //     const coupons = await CouponModel.find({
  //       isActive: true,
  //       expiryDate: { $gte: new Date() },
  //     }).sort({ createdAt: -1 });
  //     return coupons.map((coupon) => this.mapToCoupon(coupon));
  //   } catch (error) {
  //     console.error("Error getting active coupons:", error);
  //     throw new APIError();
  //   }
  // }

  // private mapToCoupon(couponDb: ICoupon): Coupon {
  //   const coupon = new Coupon(
  //     (couponDb._id as any).toString(),
  //     couponDb.code,
  //     couponDb.discountType,
  //     couponDb.discountValue,
  //     couponDb.minimumOrderAmount,
  //     couponDb.expiryDate.toISOString(),
  //     couponDb.usageLimit,
  //     couponDb.maxDiscountAmount,
  //   );

  //   // Set additional properties that aren't in constructor
  //   coupon.usedCount = couponDb.usedCount;
  //   coupon.isActive = couponDb.isActive;
  //   coupon.createdAt = (couponDb as any).createdAt?.toISOString() || new Date().toISOString();
  //   coupon.updatedAt = (couponDb as any).updatedAt?.toISOString() || new Date().toISOString();

  //   return coupon;
  // }
}
