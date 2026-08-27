import Joi from "joi";
import { ValidationError } from "../errors";

export interface CreateProductInput {
  name: string;
  description: string;
  price: string;
  category: string;
  brand: string;
  model: string;
  stock: number;
}

export interface EditProductInput {
  name?: string;
  description?: string;
  price?: string;
  brand?: string;
  model?: string;
  stock?: number;
}

const createProductSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().required(),
  price: Joi.string().required(),
  category: Joi.string().required(),
  brand: Joi.string().required(),
  model: Joi.string().required(),
  stock: Joi.number().required(),
});

const editProductSchema = Joi.object({
  name: Joi.string(),
  description: Joi.string(),
  price: Joi.string(),
  brand: Joi.string(),
  model: Joi.string(),
  stock: Joi.number(),
});

export function validateCreateProduct(data: unknown): CreateProductInput {
  const { error, value } = createProductSchema.validate(data);
  if (error) throw new ValidationError(error.details[0].message);
  return value;
}

export function validateEditProduct(data: unknown): EditProductInput {
  const { error, value } = editProductSchema.validate(data);
  if (error) throw new ValidationError(error.details[0].message);
  return value;
}
