import { productUtilsInterface } from "@/domain/interfaces/utils";
import { createProductRequest, editProductReuest } from "@/domain/types";
import { createProductValidator, editProductValidator } from "./validator";
import { ValidationError } from "@/domain/entities";

const validateCreateProductRequest = (reqBody: any): createProductRequest => {
  const { error } = createProductValidator.validate(reqBody);
  if (error) throw new ValidationError(error.details[0].message);
  else
    return {
      name: reqBody.name,
      brand: reqBody.brand,
      category: reqBody.category,
      description: reqBody.description,
      model: reqBody.model,
      price: reqBody.price,
      stock: reqBody.stock,
    };
};
const validateEditCategoryRequest = (reqBody: any): editProductReuest => {
  const { error } = editProductValidator.validate(reqBody);
  if (error) throw new ValidationError(error.details[0].message);
  else
    return {
      name: reqBody.name,
      brand: reqBody.brand,
      description: reqBody.description,
      model: reqBody.model,
      price: reqBody.price,
      stock: reqBody.stock,
    };
};

export const productUtills: productUtilsInterface = {
  validateCreateProductRequest,
  validateEditCategoryRequest,
};
