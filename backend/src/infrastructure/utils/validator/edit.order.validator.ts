import Joi from "joi";

export const editOrderRequestSchema = Joi.object({
  orderStatus: Joi.string().valid("pending", "confirmed", "processing", "shipped", "delivered", "cancelled"),
  paymentStatus: Joi.string().valid("pending", "processing", "completed", "failed", "refunded"),
  transactionId: Joi.string(),
  paymentIntentId: Joi.string(),
});
