import { Schema, model } from "mongoose";
import { OrderDocument } from "./order.entity";

const orderItemSchema = new Schema<OrderDocument["items"][number]>(
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

const paymentInfoSchema = new Schema<OrderDocument["paymentInfo"]>(
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

const orderSchema = new Schema<OrderDocument>(
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

const OrderModel = model<OrderDocument>("Order", orderSchema);
export default OrderModel;
