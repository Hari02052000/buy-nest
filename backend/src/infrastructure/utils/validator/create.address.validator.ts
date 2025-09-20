import Joi from "joi";

export const createAddressValidator = Joi.object({
  fullName: Joi.string().required(),
  addressLine1: Joi.string().required(),
  city: Joi.string().required(),
  state: Joi.string().required(),
  zipCode: Joi.string().required(),
  country: Joi.string().required(),
  phone: Joi.string().required(),
  addressLine2: Joi.string(),
});
