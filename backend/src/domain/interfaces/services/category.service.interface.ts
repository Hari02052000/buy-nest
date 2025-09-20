import { categorieTreeItem, categoryProperties, productProperties } from "@/domain/entities";

export interface categoryServiceInterface {
  createCategory(file: any, body: any, adminToken: string): Promise<Partial<categoryProperties>>;
  getCategory(limit: number, page: number, adminToken?: string): Promise<Partial<categorieTreeItem>[]>;
  getSingleCategory(id: string): Promise<Partial<categoryProperties>>;
  getSubCategory(id: string): Promise<Partial<categoryProperties>[]>;
  editCategory(id: string, reqBody: any, adminToken: string): Promise<Partial<categoryProperties>>;
  changeListStatus(id: string, isListed: boolean, adminToken: string): Promise<Partial<productProperties>>;
  editCategoryImage(id: string, file: any, adminToken: string): Promise<Partial<categoryProperties>>;
}
