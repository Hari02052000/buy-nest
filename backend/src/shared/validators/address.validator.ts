import Joi from "joi";
import { ValidationError } from "../errors";

export interface CreateAddressInput {
  fullName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
}

const createAddressSchema = Joi.object({
  fullName: Joi.string().required(),
  addressLine1: Joi.string().required(),
  addressLine2: Joi.string().optional(),
  city: Joi.string().required(),
  state: Joi.string().required(),
  zipCode: Joi.string().required(),
  country: Joi.string().required(),
  phone: Joi.string().required(),
});

export function validateCreateAddress(data: unknown): CreateAddressInput {
  const { error, value } = createAddressSchema.validate(data);
  if (error) throw new ValidationError(error.details[0].message);
  return value;
}
