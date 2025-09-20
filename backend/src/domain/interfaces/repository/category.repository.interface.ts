import { Category } from "@/domain/entities";

export interface categoryRepositoryInterface {
  createCategory(category: Category): Promise<Category>;
  getCategory(limit: number, skip: number): Promise<Category[]>;
  getCategoryByName(name: string): Promise<Category | null>;
  getCategoryById(id: string): Promise<Category>;
  getSubCategory(id: string): Promise<Category[]>;
  editCategory(category: Category): Promise<Category>;
  mapToCategory(categoryDb: unknown): Category;
}
