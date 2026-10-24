export interface CategoryImage {
  url: string;
  id: string;
}

export interface Category {
  id: string;
  name: string;
  image: CategoryImage;
  parentId: string | null;
  ancestors: string[];
  level: number;
  isListed: boolean;
  createdAt: string;
  updatedAt: string;
  children?: Category[];
}

export interface CategoryTreeItem extends Category {
  children: CategoryTreeItem[];
}

export interface CreateCategoryInput {
  name: string;
  parentId?: string;
  image: File;
}

export interface UpdateCategoryInput {
  name: string;
}

export interface CategoryListParams {
  limit?: number;
  page?: number;
  isAdmin?: boolean;
}

export interface CategoryListResponse {
  categories: CategoryTreeItem[];
}

export interface SingleCategoryResponse {
  category: Category;
}

export interface CategoryActionResponse {
  category: Category;
}