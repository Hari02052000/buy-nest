import mongoose, { Schema, Document, Types, model } from "mongoose";
import { IProduct } from "./product.model";
import { IAddress } from "./address.model";
import { ICoupon } from "./coupon.model";
import { IUser } from "./user.model";

type OrderItem = {
  productId: Types.ObjectId | IProduct;
  quantity: number;
  price: number;
  totalPrice: number;
};
type PaymentInfo = {
  method: "cod" | "online";
  paymentStatus: "pending" | "processing" | "completed" | "failed" | "refunded";
  payableAmount: number;
  transactionId?: string;
  paymentIntentId?: string;
};
export interface IOrder extends Document {
  items: OrderItem[];
  address: Types.ObjectId | IAddress;
  user: Types.ObjectId | IUser;
  paymentInfo: PaymentInfo;
  orderStatus: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled";
  appliedCoupon?: Types.ObjectId | ICoupon;
  createdAt: Date;
  updatedAt: Date;
}

const orderItemSchema = new Schema<OrderItem>(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
  },
  { _id: false },
);

const paymentInfoSchema = new Schema<PaymentInfo>(
  {
    method: {
      type: String,
      enum: ["cod", "online"],
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "processing", "completed", "failed", "refunded"],
      default: "pending",
    },
    payableAmount: { type: Number, required: true },
    transactionId: { type: String },
    paymentIntentId: { type: String },
  },
  { _id: false },
);

const OrderSchema = new Schema<IOrder>(
  {
    items: {
      type: [orderItemSchema],
      required: true,
    },
    address: {
      type: Schema.Types.ObjectId,
      ref: "Address",
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    paymentInfo: {
      type: paymentInfoSchema,
      required: true,
    },
    orderStatus: {
      type: String,
      enum: ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
    appliedCoupon: {
      type: Schema.Types.ObjectId,
      ref: "Coupon",
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

const OrderModel = model<IOrder>("Order", OrderSchema);

export default OrderModel;
