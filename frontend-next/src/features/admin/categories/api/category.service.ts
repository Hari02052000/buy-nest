import { apiClient } from "@/lib/api/client";
import type {
  Category,
  CategoryTreeItem,
  CategoryListParams,
  CategoryListResponse,
  SingleCategoryResponse,
  CreateCategoryInput,
  UpdateCategoryInput,
  CategoryActionResponse,
} from "./category.types";

export const categoryApi = {
  async getCategories(params: CategoryListParams = {}): Promise<CategoryTreeItem[]> {
    const searchParams = new URLSearchParams();
    if (params.limit) searchParams.set("limit", params.limit.toString());
    if (params.page) searchParams.set("page", params.page.toString());
    if (params.isAdmin) searchParams.set("isAdmin", "true");

    const query = searchParams.toString();
    const path = `/api/category${query ? `?${query}` : ""}`;

    const response = await apiClient.get<CategoryListResponse>(path);
    return response.categories;
  },

  async getCategory(id: string): Promise<Category> {
    const response = await apiClient.get<SingleCategoryResponse>(`/api/category/${id}`);
    return response.category;
  },

  async getSubCategories(parentId: string): Promise<Category[]> {
    const response = await apiClient.get<{ categories: Category[] }>(`/api/category/sub/${parentId}`);
    return response.categories;
  },

  async createCategory(input: CreateCategoryInput): Promise<Category> {
    const formData = new FormData();
    formData.append("name", input.name);
    if (input.parentId) formData.append("parentId", input.parentId);
    formData.append("image", input.image);

    const response = await apiClient.post<CategoryActionResponse>("/api/category", formData, {
      headers: {},
    });
    return response.category;
  },

  async updateCategory(id: string, input: UpdateCategoryInput): Promise<Category> {
    const response = await apiClient.put<CategoryActionResponse>(`/api/category/${id}`, input);
    return response.category;
  },

  async toggleListStatus(id: string, isListed: boolean): Promise<Category> {
    const response = await apiClient.patch<CategoryActionResponse>(`/api/category/${id}/list-status`, { isListed });
    return response.category;
  },

  async updateCategoryImage(id: string, image: File): Promise<Category> {
    const formData = new FormData();
    formData.append("image", image);

    const response = await apiClient.put<CategoryActionResponse>(`/api/category/${id}/image`, formData, {
      headers: {},
    });
    return response.category;
  },
};