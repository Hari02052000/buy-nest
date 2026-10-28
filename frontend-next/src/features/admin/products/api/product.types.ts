export interface ProductImage {
  url: string;
  id: string;
}

export interface ProductCategory {
  id: string;
  name: string;
  ancestors: string[];
  isListed: boolean;
}

export type ProductCategoryValue = string | ProductCategory;

export interface Product {
  id: string;
  name: string;
  images: ProductImage[];
  description: string;
  price: number;
  category: ProductCategoryValue;
  brandName: string;
  modelName: string;
  isListed: boolean;
  stock: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProductListResponse {
  products: Product[];
}

export interface SingleProductResponse {
  product: Product;
}

export interface ProductActionResponse {
  product: Product;
}

export interface CreateProductInput {
  name: string;
  description: string;
  price: number;
  category: string;
  brandName: string;
  modelName: string;
  stock: number;
  images: File[];
}

export interface UpdateProductInput {
  name?: string;
  description?: string;
  price?: number;
  brandName?: string;
  modelName?: string;
  stock?: number;
}

export interface ProductListParams {
  limit?: number;
  skip?: number;
  category?: string;
  search?: string;
  brand?: string;
  model?: string;
  minPrice?: number;
  maxPrice?: number;
  isAdmin?: boolean;
}