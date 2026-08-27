import { Document } from "mongoose";

export interface CouponProps {
  id: string;
  code: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  minimumOrderAmount: number;
  maxDiscountAmount: number;
  expiryDate: string;
  usageLimit: number;
  usedCount: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCouponInput {
  code: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  minimumOrderAmount?: number;
  maxDiscountAmount?: number;
  expiryDate: string;
  usageLimit?: number;
}

export class Coupon {
  constructor(private props: CouponProps) {
    Object.assign(this, props);
  }

  static create(data: CreateCouponInput): Coupon {
    return new Coupon({
      id: "",
      code: data.code.toUpperCase(),
      discountType: data.discountType,
      discountValue: data.discountValue,
      minimumOrderAmount: data.minimumOrderAmount ?? 0,
      maxDiscountAmount: data.maxDiscountAmount ?? 0,
      expiryDate: data.expiryDate,
      usageLimit: data.usageLimit ?? 1,
      usedCount: 0,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }

  static fromDocument(doc: CouponDocument): Coupon {
    return new Coupon({
      id: (doc._id as any).toString(),
      code: doc.code,
      discountType: doc.discountType,
      discountValue: doc.discountValue,
      minimumOrderAmount: doc.minimumOrderAmount,
      maxDiscountAmount: doc.maxDiscountAmount || 0,
      expiryDate: doc.expiryDate.toISOString(),
      usageLimit: doc.usageLimit,
      usedCount: doc.usedCount,
      isActive: doc.isActive,
      createdAt: doc.createdAt?.toISOString?.() || new Date().toISOString(),
      updatedAt: doc.updatedAt?.toISOString?.() || new Date().toISOString(),
    });
  }

  get id(): string { return this.props.id; }
  get code(): string { return this.props.code; }
  get discountType(): "percentage" | "fixed" { return this.props.discountType; }
  get discountValue(): number { return this.props.discountValue; }
  get minimumOrderAmount(): number { return this.props.minimumOrderAmount; }
  get maxDiscountAmount(): number { return this.props.maxDiscountAmount; }
  get expiryDate(): string { return this.props.expiryDate; }
  get usageLimit(): number { return this.props.usageLimit; }
  get usedCount(): number { return this.props.usedCount; }
  get isActive(): boolean { return this.props.isActive; }
  get createdAt(): string { return this.props.createdAt; }
  get updatedAt(): string { return this.props.updatedAt; }

  get isExpired(): boolean {
    return new Date(this.props.expiryDate) < new Date();
  }

  get canBeUsed(): boolean {
    return this.props.isActive && !this.isExpired && this.props.usedCount < this.props.usageLimit;
  }

  toObject(): CouponProps {
    return { ...this.props };
  }
}

export interface CouponDocument extends Document {
  code: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  minimumOrderAmount: number;
  maxDiscountAmount?: number;
  expiryDate: Date;
  usageLimit: number;
  usedCount: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
