import { apiClient } from "@/lib/api/client";
import type {
  Product,
  ProductListParams,
  CreateProductInput,
  UpdateProductInput,
  ProductImage,
  ProductListResponse,
  SingleProductResponse,
  ProductActionResponse,
} from "./product.types";

export const productApi = {
  async getProducts(params: ProductListParams = {}): Promise<Product[]> {
    const searchParams = new URLSearchParams();
    if (params.limit) searchParams.set("limit", params.limit.toString());
    if (params.skip) searchParams.set("skip", params.skip.toString());
    if (params.category) searchParams.set("category", params.category);
    if (params.search) searchParams.set("search", params.search);
    if (params.brand) searchParams.set("brand", params.brand);
    if (params.model) searchParams.set("model", params.model);
    if (params.minPrice !== undefined)
      searchParams.set("minPrice", params.minPrice.toString());
    if (params.maxPrice !== undefined)
      searchParams.set("maxPrice", params.maxPrice.toString());
    if (params.isAdmin) searchParams.set("isAdmin", "true");

    const query = searchParams.toString();
    const path = `/api/product${query ? `?${query}` : ""}`;

    const response = await apiClient.get<ProductListResponse>(path);
    return response.products;
  },

  async getProduct(id: string): Promise<Product> {
    const response = await apiClient.get<SingleProductResponse>(
      `/api/product/${id}`
    );
    return response.product;
  },

  async createProduct(input: CreateProductInput): Promise<Product> {
    const formData = new FormData();
    formData.append("name", input.name);
    formData.append("description", input.description);
    formData.append("price", input.price.toString());
    formData.append("category", input.category);
    formData.append("brandName", input.brandName);
    formData.append("modelName", input.modelName);
    formData.append("stock", input.stock.toString());
    input.images.forEach((file) => formData.append("images", file));

    const response = await apiClient.post<ProductActionResponse>(
      "/api/product",
      formData,
      { headers: {} }
    );
    return response.product;
  },

  async updateProduct(
    id: string,
    input: UpdateProductInput
  ): Promise<Product> {
    const response = await apiClient.put<ProductActionResponse>(
      `/api/product/${id}`,
      input
    );
    return response.product;
  },

  async uploadProductImages(
    id: string,
    files: File[]
  ): Promise<Product> {
    const formData = new FormData();
    files.forEach((file) => formData.append("images", file));

    const response = await apiClient.put<ProductActionResponse>(
      `/api/product/upload-image/${id}`,
      formData,
      { headers: {} }
    );
    return response.product;
  },

  async deleteProductImage(
    id: string,
    image: ProductImage
  ): Promise<Product> {
    const response = await apiClient.delete<ProductActionResponse>(
      `/api/product/delete-image/${id}`,
      { body: JSON.stringify({ image }) }
    );
    return response.product;
  },

  async toggleListStatus(
    id: string,
    isListed: boolean
  ): Promise<Product> {
    const response = await apiClient.patch<ProductActionResponse>(
      `/api/product/toggle-list/${id}`,
      { isListed }
    );
    return response.product;
  },
};