import Joi from "joi";

export const createProductValidator = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().required(),
  price: Joi.string().required(),
  category: Joi.string().required(),
  brand: Joi.string().required(),
  model: Joi.string().required(),
  stock: Joi.number().required(),
});
