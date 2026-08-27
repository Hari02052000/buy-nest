import { Schema, model } from "mongoose";
import { CouponDocument } from "./coupon.entity";

const couponSchema = new Schema<CouponDocument>(
  {
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    discountType: { type: String, required: true, enum: ["percentage", "fixed"] },
    discountValue: { type: Number, required: true, min: 0 },
    minimumOrderAmount: { type: Number, default: 0, min: 0 },
    maxDiscountAmount: { type: Number, min: 0 },
    expiryDate: { type: Date, required: true },
    usageLimit: { type: Number, default: 1, min: 1 },
    usedCount: { type: Number, default: 0, min: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

couponSchema.index({ isActive: 1, expiryDate: 1 });

const CouponModel = model<CouponDocument>("Coupon", couponSchema);
export default CouponModel;
