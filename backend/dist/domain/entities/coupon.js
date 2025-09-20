"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Coupon = void 0;
class Coupon {
    constructor(id = "", code, discountPercent, minimumOrderAmount = 0, expiryDate, usageLimit = 1, maxDiscountAmount) {
        this._modifiedFields = {};
        this.id = id;
        this.code = code.toUpperCase();
        this.discountPercent = discountPercent;
        this.minimumOrderAmount = minimumOrderAmount;
        this.maxDiscountAmount = maxDiscountAmount;
        this.expiryDate = expiryDate;
        this.usageLimit = usageLimit;
        this.appliedUsers = [];
        this.isActive = true;
        this.createdAt = new Date().toISOString();
        this.updatedAt = new Date().toISOString();
    }
    setDiscountPercent(discount) {
        this.discountPercent = discount;
        this.updatedAt = new Date().toISOString();
        this._modifiedFields.discountPercent = true;
        this._modifiedFields.updatedAt = true;
    }
    setMinimumOrderAmount(amount) {
        this.minimumOrderAmount = amount;
        this.updatedAt = new Date().toISOString();
        this._modifiedFields.minimumOrderAmount = true;
        this._modifiedFields.updatedAt = true;
    }
    setMaxDiscountAmount(amount) {
        this.maxDiscountAmount = amount;
        this.updatedAt = new Date().toISOString();
        this._modifiedFields.maxDiscountAmount = true;
        this._modifiedFields.updatedAt = true;
    }
    setExpiryDate(date) {
        this.expiryDate = date;
        this.updatedAt = new Date().toISOString();
        this._modifiedFields.expiryDate = true;
        this._modifiedFields.updatedAt = true;
    }
    setUsageLimit(maxUsers) {
        this.usageLimit = maxUsers;
        this.updatedAt = new Date().toISOString();
        this.modifiedFields.usageLimit = true;
        this._modifiedFields.updatedAt = true;
    }
    setAppliedUsers(userId) {
        this.appliedUsers.push(userId);
        this.updatedAt = new Date().toISOString();
        this.modifiedFields.appliedUsers = true;
        this._modifiedFields.updatedAt = true;
    }
    setIsActive(isActive) {
        this.isActive = isActive;
        this.updatedAt = new Date().toISOString();
        this._modifiedFields.isActive = true;
        this.modifiedFields.updatedAt = true;
    }
    sanitizeCoupon() {
        const coupon = {};
        coupon.id = this.id;
        coupon.code = this.code;
        coupon.appliedUsers = this.appliedUsers;
        coupon.isActive = this.isActive;
        coupon.maxDiscountAmount = this.maxDiscountAmount;
        coupon.minimumOrderAmount = this.minimumOrderAmount;
        coupon.discountPercent = this.discountPercent;
        coupon.isActive = this.isActive;
        coupon.createdAt = this.createdAt;
        coupon.updatedAt = this.updatedAt;
        return coupon;
    }
    get modifiedFields() {
        return this._modifiedFields;
    }
    get clearModifiedFields() {
        this._modifiedFields = {};
        return this._modifiedFields;
    }
}
exports.Coupon = Coupon;
