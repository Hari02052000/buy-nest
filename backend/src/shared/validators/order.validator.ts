import Joi from "joi";
import { ValidationError } from "../errors";

export interface CreateOrderInput {
  addressId: string;
  paymentMethod: "cod" | "online";
  coupon: {
    isApplied: boolean;
    couponId?: string;
    discount?: string;
  };
}

export interface EditOrderInput {
  orderStatus?: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled";
  paymentStatus?: "pending" | "processing" | "completed" | "failed" | "refunded";
  transactionId?: string;
  paymentIntentId?: string;
}

const createOrderSchema = Joi.object({
  addressId: Joi.string().required(),
  paymentMethod: Joi.string().valid("cod", "online").required(),
  coupon: Joi.object({
    isApplied: Joi.boolean().required(),
    couponId: Joi.when("isApplied", {
      is: true,
      then: Joi.string().required().disallow(""),
      otherwise: Joi.string().allow("", null),
    }),
    discount: Joi.when("isApplied", {
      is: true,
      then: Joi.string().required().disallow(""),
      otherwise: Joi.string().allow("", null),
    }),
  }).required(),
});

const editOrderSchema = Joi.object({
  orderStatus: Joi.string().valid("pending", "confirmed", "processing", "shipped", "delivered", "cancelled"),
  paymentStatus: Joi.string().valid("pending", "processing", "completed", "failed", "refunded"),
  transactionId: Joi.string(),
  paymentIntentId: Joi.string(),
});

export function validateCreateOrder(data: unknown): CreateOrderInput {
  const { error, value } = createOrderSchema.validate(data);
  if (error) throw new ValidationError(error.details[0].message);
  return value;
}

export function validateEditOrder(data: unknown): EditOrderInput {
  const { error, value } = editOrderSchema.validate(data);
  if (error) throw new ValidationError(error.details[0].message);
  return value;
}
