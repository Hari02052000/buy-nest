import Joi from "joi";
import { ValidationError } from "../errors";

export interface CreateCategoryInput {
  name: string;
  parentId?: string;
}

export interface EditCategoryInput {
  name: string;
}

const createCategorySchema = Joi.object({
  name: Joi.string().required(),
  parentId: Joi.string().optional(),
});

const editCategorySchema = Joi.object({
  name: Joi.string().required(),
});

export function validateCreateCategory(data: unknown): CreateCategoryInput {
  const { error, value } = createCategorySchema.validate(data);
  if (error) throw new ValidationError(error.details[0].message);
  return value;
}

export function validateEditCategory(data: unknown): EditCategoryInput {
  const { error, value } = editCategorySchema.validate(data);
  if (error) throw new ValidationError(error.details[0].message);
  return value;
}
