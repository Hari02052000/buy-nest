import { Document } from "mongoose";

export interface CartItem {
  product: string;
  quantity: number;
  price: number;
  totalPrice: number;
}

export interface AppliedCoupon {
  code: string;
  discountPercent: number;
}

export interface CartProps {
  id: string;
  userId: string;
  items: CartItem[];
  totalAmount: number;
  itemCount: number;
  appliedCoupon: AppliedCoupon | null;
  discountAmount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCartInput {
  userId: string;
  items?: CartItem[];
  totalAmount?: number;
  itemCount?: number;
  appliedCoupon?: AppliedCoupon | null;
  discountAmount?: number;
}

export type SanitizedCart = Omit<CartProps, "updatedAt">;

export class Cart {
  constructor(private props: CartProps) {
    Object.assign(this, props);
  }

  static create(data: CreateCartInput): Cart {
    return new Cart({
      id: "",
      userId: data.userId,
      items: data.items || [],
      totalAmount: data.totalAmount || 0,
      itemCount: data.itemCount || 0,
      appliedCoupon: data.appliedCoupon || null,
      discountAmount: data.discountAmount || 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }

  static fromDocument(doc: CartDocument): Cart {
    return new Cart({
      id: (doc._id as any).toString(),
      userId: doc.userId,
      items: (doc.items || []).map((item) => ({
        product: item.product.toString(),
        quantity: item.quantity,
        price: item.price,
        totalPrice: item.totalPrice,
      })),
      totalAmount: doc.totalAmount || 0,
      itemCount: doc.itemCount || 0,
      appliedCoupon: doc.appliedCoupon || null,
      discountAmount: doc.discountAmount || 0,
      createdAt: doc.createdAt?.toISOString?.() || new Date().toISOString(),
      updatedAt: doc.updatedAt?.toISOString?.() || new Date().toISOString(),
    });
  }

  get id(): string { return this.props.id; }
  get userId(): string { return this.props.userId; }
  get items(): CartItem[] { return this.props.items; }
  get totalAmount(): number { return this.props.totalAmount; }
  get itemCount(): number { return this.props.itemCount; }
  get appliedCoupon(): AppliedCoupon | null { return this.props.appliedCoupon; }
  get discountAmount(): number { return this.props.discountAmount; }
  get createdAt(): string { return this.props.createdAt; }
  get updatedAt(): string { return this.props.updatedAt; }

  setItems(items: CartItem[]): void {
    this.props.items = items;
    this.props.itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
    this.props.updatedAt = new Date().toISOString();
  }

  setTotalAmount(amount: number): void {
    this.props.totalAmount = amount;
    this.props.updatedAt = new Date().toISOString();
  }

  setAppliedCoupon(coupon: AppliedCoupon | null): void {
    this.props.appliedCoupon = coupon;
    this.props.updatedAt = new Date().toISOString();
  }

  setDiscountAmount(amount: number): void {
    this.props.discountAmount = amount;
    this.props.updatedAt = new Date().toISOString();
  }

  sanitize(): SanitizedCart {
    const { updatedAt, ...safe } = this.props;
    return safe;
  }

  toObject(): CartProps {
    return { ...this.props };
  }
}

export interface CartDocument extends Document {
  userId: string;
  items: CartItem[];
  totalAmount: number;
  itemCount: number;
  appliedCoupon: AppliedCoupon | null;
  discountAmount: number;
  createdAt: Date;
  updatedAt: Date;
}
