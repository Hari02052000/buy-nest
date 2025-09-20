export interface createProductRequest {
  name: string;
  description: string;
  price: string;
  category: string;
  brand: string;
  model: string;
  stock: number;
}
export interface editProductReuest {
  name?: string;
  description?: string;
  price?: string;
  brand?: string;
  model?: string;
  stock?: number;
}

export interface ProductSearchFilters {
  query?: string;
  category?: string;
  brand?: string;
  model?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: "name" | "price" | "createdAt" | "rating";
  sortOrder?: "asc" | "desc";
  limit?: number;
  skip?: number;
}

export interface ProductSearchResult {
  products: any[];
  total: number;
  pageSize: number;
  skip: number;
  success?: boolean;
  message?: string;
  data?: any[];
}
