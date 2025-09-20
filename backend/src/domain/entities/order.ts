import { addressProperties } from "./address";
import { Coupon } from "./coupon";
import { productProperties } from "./product";
import { userProperties } from "./user";

export interface orderItem {
  productId: string | Partial<productProperties>;
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

export class Order {
  id: string;
  items: orderItem[];
  address: string | Partial<addressProperties>;
  user: string | Partial<userProperties>;
  paymentInfo: PaymentInfo = {} as PaymentInfo;
  orderStatus: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled";
  appliedCoupon: string | undefined | Partial<Coupon>;
  createdAt: string;
  updatedAt: string;

  private _modifiedFields = {} as modifiedFields;
  constructor(
    id: string = "",
    items: orderItem[],
    address: string | Partial<addressProperties>,
    user: string | Partial<userProperties>,
    paymentMethod: "cod" | "online",
    payableAmount: number,
    appliedCoupon?: string | Partial<Coupon>,
  ) {
    this.id = id;
    this.items = items;
    this.address = address;
    this.user = user;
    this.paymentInfo.method = paymentMethod;
    this.paymentInfo.payableAmount = payableAmount;
    this.orderStatus = "pending";
    if (appliedCoupon) this.appliedCoupon;
    this.createdAt = new Date().toISOString();
    this.updatedAt = new Date().toISOString();
  }
  setPaymentStatus(paymentStatus: "pending" | "processing" | "completed" | "failed" | "refunded") {
    this.paymentInfo.paymentStatus = paymentStatus;
    this.updatedAt = new Date().toISOString();
    this._modifiedFields.paymentInfo = true;
    this._modifiedFields.updatedAt = true;
  }
  setTransactionId(transactionId: string) {
    this.paymentInfo.transactionId = transactionId;
    this.updatedAt = new Date().toISOString();
    this._modifiedFields.paymentInfo = true;
    this._modifiedFields.updatedAt = true;
  }
  setPaymentIntentId(paymentIntentId: string) {
    this.paymentInfo.paymentIntentId = paymentIntentId;
    this.updatedAt = new Date().toISOString();
    this._modifiedFields.paymentInfo = true;
    this._modifiedFields.updatedAt = true;
  }
  setOrderStatus(
    orderStatus: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled",
  ) {
    this.orderStatus = orderStatus;
    this.updatedAt = new Date().toISOString();
    this._modifiedFields.orderStatus = true;
    this._modifiedFields.updatedAt = true;
  }
  sanitizeOrder() {
    const order = {} as orderProperties;
    order.id = this.id;
    order.createdAt = this.createdAt;
    order.orderStatus = this.orderStatus;
    order.items = this.items;
    order.address = this.address;
    order.appliedCoupon = this.appliedCoupon;
    order.paymentInfo = this.paymentInfo;
    order.user = this.user;
    return order;
  }
  get modifiedFields(): modifiedFields {
    return this._modifiedFields;
  }

  get clearModifiedFields(): modifiedFields {
    this._modifiedFields = {} as modifiedFields;
    return this._modifiedFields;
  }
}
export type orderProperties = Omit<
  Order,
  | "setPaymentStatus"
  | "setTransactionId"
  | "setPaymentIntentId"
  | "sanitizeOrder"
  | "setOrderStatus"
  | "modifiedFields"
  | "clearModifiedFields"
>;
type modifiedFields = {
  [K in keyof Omit<orderProperties, "id">]: boolean;
};
