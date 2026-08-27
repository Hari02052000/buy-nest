import { Schema, model } from "mongoose";
import { CartDocument } from "./cart.entity";

const cartItemSchema = new Schema(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    price: {
      type: Number,
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
  },
  { _id: false },
);

const cartSchema = new Schema<CartDocument>(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    items: {
      type: [cartItemSchema],
      default: [],
    },
    totalAmount: {
      type: Number,
      default: 0,
    },
    itemCount: {
      type: Number,
      default: 0,
    },
    appliedCoupon: {
      type: {
        code: { type: String, required: true },
        discountPercent: { type: Number, required: true },
      },
      default: null,
    },
    discountAmount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

const CartModel = model<CartDocument>("Cart", cartSchema);
export default CartModel;
