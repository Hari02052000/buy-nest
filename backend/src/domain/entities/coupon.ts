import { userProperties } from "./user";

export class Coupon {
  id: string;
  code: string;
  discountPercent: number;
  minimumOrderAmount: number;
  maxDiscountAmount: number;
  expiryDate: string;
  usageLimit: number;
  appliedUsers: string[] | Partial<userProperties>[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  private _modifiedFields = {} as modifiedFields;

  constructor(
    id: string = "",
    code: string,
    discountPercent: number,
    minimumOrderAmount: number = 0,
    expiryDate: string,
    usageLimit: number = 1,
    maxDiscountAmount: number,
  ) {
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

  setDiscountPercent(discount: number) {
    this.discountPercent = discount;
    this.updatedAt = new Date().toISOString();
    this._modifiedFields.discountPercent = true;
    this._modifiedFields.updatedAt = true;
  }
  setMinimumOrderAmount(amount: number) {
    this.minimumOrderAmount = amount;
    this.updatedAt = new Date().toISOString();
    this._modifiedFields.minimumOrderAmount = true;
    this._modifiedFields.updatedAt = true;
  }
  setMaxDiscountAmount(amount: number) {
    this.maxDiscountAmount = amount;
    this.updatedAt = new Date().toISOString();
    this._modifiedFields.maxDiscountAmount = true;
    this._modifiedFields.updatedAt = true;
  }

  setExpiryDate(date: string) {
    this.expiryDate = date;
    this.updatedAt = new Date().toISOString();
    this._modifiedFields.expiryDate = true;
    this._modifiedFields.updatedAt = true;
  }

  setUsageLimit(maxUsers: number) {
    this.usageLimit = maxUsers;
    this.updatedAt = new Date().toISOString();
    this.modifiedFields.usageLimit = true;
    this._modifiedFields.updatedAt = true;
  }
  setAppliedUsers(userId: string) {
    this.appliedUsers.push(userId);
    this.updatedAt = new Date().toISOString();
    this.modifiedFields.appliedUsers = true;
    this._modifiedFields.updatedAt = true;
  }
  setIsActive(isActive: boolean) {
    this.isActive = isActive;
    this.updatedAt = new Date().toISOString();
    this._modifiedFields.isActive = true;
    this.modifiedFields.updatedAt = true;
  }
  sanitizeCoupon() {
    const coupon = {} as Partial<couponProperties>;
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
  get modifiedFields(): modifiedFields {
    return this._modifiedFields;
  }

  get clearModifiedFields(): modifiedFields {
    this._modifiedFields = {} as modifiedFields;
    return this._modifiedFields;
  }
}

export type couponProperties = Omit<
  Coupon,
  | "setDiscountPercent"
  | "setMinimumOrderAmount"
  | "setMaxDiscountAmount"
  | "setExpiryDate"
  | "setUsageLimit"
  | "setAppliedUsers"
  | "modifiedFields"
  | "clearModifiedFields"
  | "sanitizeCoupon"
  | "setIsActive"
>;
type modifiedFields = {
  [K in keyof Omit<couponProperties, "id" | "code">]: boolean;
};
