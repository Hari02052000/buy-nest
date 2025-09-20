import Joi from "joi";

export const editProductValidator = Joi.object({
  name: Joi.string(),
  description: Joi.string(),
  price: Joi.string(),
  brand: Joi.string(),
  model: Joi.string(),
  stock: Joi.number(),
});
