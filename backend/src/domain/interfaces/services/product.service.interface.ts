import { productProperties } from "@/domain/entities";
import { ProductSearchFilters, ProductSearchResult } from "@/domain/types/product.request.type";

export interface ProductServiceInterface {
  createProduct(files: any, reqBody: any, adminToken: string): Promise<Partial<productProperties>>;
  getProducts(
    limit?: number,
    skip?: number,
    category?: string,
    search?: string,
    adminToken?: string,
    brand?: string,
    model?: string,
    minPrice?: number,
    maxPrice?: number,
  ): Promise<Partial<productProperties>[]>;
  searchProducts(filters: ProductSearchFilters): Promise<ProductSearchResult>;
  editProduct(id: string, reqBody: any, adminToken: string): Promise<Partial<productProperties>>;
  uploadImages(id: string, files: any, adminToken: string): Promise<Partial<productProperties>>;
  deletemage(
    id: string,
    image: { id: string; url: string },
    adminToken: string,
  ): Promise<Partial<productProperties>>;
  changeListStaus(id: string, isListed: boolean, adminToken: string): Promise<Partial<productProperties>>;
  getSingleProduct(id: string): Promise<Partial<productProperties>>;
}
