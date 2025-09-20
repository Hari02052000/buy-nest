import Joi from "joi";

export const createOrderSchema = Joi.object({
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
