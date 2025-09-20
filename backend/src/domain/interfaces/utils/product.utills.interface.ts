import { createProductRequest, editProductReuest } from "@/domain/types";

export interface productUtilsInterface {
  validateCreateProductRequest(reqBody: any): createProductRequest;
  validateEditCategoryRequest(reqBody: any): editProductReuest;
}
