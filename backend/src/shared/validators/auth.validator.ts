import Joi from "joi";
import { ValidationError } from "../errors";

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  email: string;
  password: string;
  confirmPassword: string;
}

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  confirmPassword: Joi.string().valid(Joi.ref("password")).required(),
});

export function validateLoginInput(data: unknown): LoginInput {
  const { error, value } = loginSchema.validate(data);
  if (error) throw new ValidationError(error.details[0].message);
  return value;
}

export function validateRegisterInput(data: unknown): RegisterInput {
  const { error, value } = registerSchema.validate(data);
  if (error) throw new ValidationError(error.details[0].message);
  return value;
}
