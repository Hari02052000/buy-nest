import Joi from "joi";

export const RegisterValidator = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  conformPassword: Joi.string().valid(Joi.ref("password")).required(),
});
