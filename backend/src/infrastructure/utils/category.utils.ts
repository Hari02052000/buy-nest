import { categoryUtillsInterface } from "@/domain/interfaces/utils";
import { createCategoryRequest } from "@/domain/types";
import { createCategoryValidator, editCategoryValidator } from "./validator";
import { ValidationError } from "@/domain/entities";

const validateCreateCategoryRequest = (reqBody: any): createCategoryRequest => {
  const { error } = createCategoryValidator.validate(reqBody);
  if (error) throw new ValidationError(error.details[0].message);
  else return { name: reqBody.name, parentId: reqBody.parentId };
};

const validateEditCategoryRequest = (reqBody: any): { name?: string } => {
  const { error } = editCategoryValidator.validate(reqBody);
  if (error) throw new ValidationError(error.details[0].message);
  else return { name: reqBody.name };
};

export const categoryUtils: categoryUtillsInterface = {
  validateCreateCategoryRequest,
  validateEditCategoryRequest,
};
