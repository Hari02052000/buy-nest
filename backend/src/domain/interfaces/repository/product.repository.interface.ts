import { Product } from "@/domain/entities";
import { ProductSearchFilters, ProductSearchResult } from "@/domain/types/product.request.type";

export interface productRepositoryInterface {
  saveProduct(product: Product): Promise<Product>;
  getProducts(limit: number, skip: number, category?: string): Promise<Product[]>;
  searchProducts(
    query?: string,
    category?: string,
    minPrice?: number,
    maxPrice?: number,
    brand?: string,
    model?: string,
    limit?: number,
    skip?: number,
  ): Promise<Product[]>;
  countProducts(
    query?: string,
    category?: string,
    minPrice?: number,
    maxPrice?: number,
    brand?: string,
    model?: string,
  ): Promise<number>;
  editProduct(Product: Product): Promise<Product>;
  getSingleProduct(id: string): Promise<Product>;
  getUniqueProduct(name: string, brand: string, model: string): Promise<Product | null>;
  mapToProduct(productDb: unknown): Product;
  getPopulatedProduct(productId: string): Promise<Product>;
  getPopulatedProducts(
    limit: number,
    skip: number,
    category?: string,
    search?: string,
    brand?: string,
    model?: string,
    minPrice?: number,
    maxPrice?: number,
  ): Promise<Product[]>;
  getProductByIds(productIds: string[]): Promise<Product[]>;
}
