import { createCategoryRequest } from "@/domain/types";

export interface categoryUtillsInterface {
  validateCreateCategoryRequest(reqBody: any): createCategoryRequest;
  validateEditCategoryRequest(reqBody: any): { name?: string };
}
