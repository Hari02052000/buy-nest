"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const couponSchema = new mongoose_1.Schema({
    code: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
        trim: true,
    },
    discountType: {
        type: String,
        required: true,
        enum: ["percentage", "fixed"],
    },
    discountValue: {
        type: Number,
        required: true,
        min: 0,
    },
    minimumOrderAmount: {
        type: Number,
        default: 0,
        min: 0,
    },
    maxDiscountAmount: {
        type: Number,
        min: 0,
    },
    expiryDate: {
        type: Date,
        required: true,
    },
    usageLimit: {
        type: Number,
        default: 1,
        min: 1,
    },
    usedCount: {
        type: Number,
        default: 0,
        min: 0,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
}, {
    timestamps: true,
});
// Add index for better query performance
couponSchema.index({ isActive: 1, expiryDate: 1 });
const CouponModel = (0, mongoose_1.model)("Coupon", couponSchema);
exports.default = CouponModel;
