import { Document } from "mongoose";

export interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
  totalPrice: number;
}

export interface PaymentInfo {
  method: "cod" | "online";
  paymentStatus: "pending" | "processing" | "completed" | "failed" | "refunded";
  payableAmount: number;
  transactionId?: string;
  paymentIntentId?: string;
}

export interface OrderProps {
  id: string;
  items: OrderItem[];
  address: string;
  user: string;
  paymentInfo: PaymentInfo;
  orderStatus: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled";
  appliedCoupon?: string;
  createdAt: string;
  updatedAt: string;
}

export type SanitizedOrder = Omit<OrderProps, "updatedAt">;

export class Order {
  constructor(private props: OrderProps) {}

  static create(data: {
    items: OrderItem[];
    address: string;
    user: string;
    paymentMethod: "cod" | "online";
    payableAmount: number;
    appliedCoupon?: string;
  }): Order {
    return new Order({
      id: "",
      items: data.items,
      address: data.address,
      user: data.user,
      paymentInfo: {
        method: data.paymentMethod,
        paymentStatus: "pending",
        payableAmount: data.payableAmount,
      },
      orderStatus: "pending",
      appliedCoupon: data.appliedCoupon,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }

  static fromDocument(doc: OrderDocument): Order {
    return new Order({
      id: (doc._id as any).toString(),
      items: doc.items.map((item) => ({
        productId: item.productId?.toString?.() ?? item.productId as string,
        quantity: item.quantity,
        price: item.price,
        totalPrice: item.totalPrice,
      })),
      address: doc.address?.toString?.() ?? doc.address as string,
      user: doc.user?.toString?.() ?? doc.user as string,
      paymentInfo: {
        method: doc.paymentInfo.method,
        paymentStatus: doc.paymentInfo.paymentStatus,
        payableAmount: doc.paymentInfo.payableAmount,
        transactionId: doc.paymentInfo.transactionId,
        paymentIntentId: doc.paymentInfo.paymentIntentId,
      },
      orderStatus: doc.orderStatus,
      appliedCoupon: doc.appliedCoupon?.toString?.(),
      createdAt: doc.createdAt?.toISOString?.() || new Date().toISOString(),
      updatedAt: doc.updatedAt?.toISOString?.() || new Date().toISOString(),
    });
  }

  get id(): string { return this.props.id; }
  get items(): OrderItem[] { return this.props.items; }
  get address(): string { return this.props.address; }
  get user(): string { return this.props.user; }
  get paymentInfo(): PaymentInfo { return this.props.paymentInfo; }
  get orderStatus(): OrderProps["orderStatus"] { return this.props.orderStatus; }
  get appliedCoupon(): string | undefined { return this.props.appliedCoupon; }
  get createdAt(): string { return this.props.createdAt; }
  get updatedAt(): string { return this.props.updatedAt; }

  setOrderStatus(status: string): void {
    this.props.orderStatus = status as OrderProps["orderStatus"];
    this.props.updatedAt = new Date().toISOString();
  }

  setPaymentStatus(status: string): void {
    this.props.paymentInfo.paymentStatus = status as PaymentInfo["paymentStatus"];
    this.props.updatedAt = new Date().toISOString();
  }

  setTransactionId(transactionId: string): void {
    this.props.paymentInfo.transactionId = transactionId;
    this.props.updatedAt = new Date().toISOString();
  }

  setPaymentIntentId(paymentIntentId: string): void {
    this.props.paymentInfo.paymentIntentId = paymentIntentId;
    this.props.updatedAt = new Date().toISOString();
  }

  sanitize(): SanitizedOrder {
    const { updatedAt, ...safe } = this.props;
    return safe;
  }

  toObject(): OrderProps {
    return { ...this.props };
  }
}

export interface OrderDocument extends Document {
  items: Array<{
    productId: any;
    quantity: number;
    price: number;
    totalPrice: number;
  }>;
  address: any;
  user: any;
  paymentInfo: {
    method: "cod" | "online";
    paymentStatus: "pending" | "processing" | "completed" | "failed" | "refunded";
    payableAmount: number;
    transactionId?: string;
    paymentIntentId?: string;
  };
  orderStatus: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled";
  appliedCoupon?: any;
  createdAt: Date;
  updatedAt: Date;
}
