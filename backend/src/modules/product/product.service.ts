import { injectable, inject } from "tsyringe";
import type { ProductRepository } from "./product.repository";
import { Product as ProductEntity, type CreateProductInput, type ProductImage, type SanitizedProduct } from "./product.entity";
import { SHARED_TOKENS } from "@/shared/tokens";
import type { CloudUtils } from "@/shared/utils/cloud.utils";
import { ValidationError } from "@/shared/errors";

export interface ProductSearchFilters {
  query?: string;
  category?: string;
  brand?: string;
  model?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: "name" | "price" | "createdAt";
  sortOrder?: "asc" | "desc";
  limit?: number;
  skip?: number;
}

export interface ProductSearchResult {
  products: SanitizedProduct[];
  total: number;
  pageSize: number;
  skip: number;
}

@injectable()
export class ProductService {
  constructor(
    private productRepo: ProductRepository,
    @inject(SHARED_TOKENS.CloudUtils) private cloudUtils: CloudUtils,
  ) {}

  async createProduct(
    files: Express.Multer.File[],
    reqBody: Record<string, unknown>,
  ): Promise<SanitizedProduct> {
    if (!files || files.length === 0) throw new ValidationError("images is empty");

    const input = this.validateCreateInput(reqBody);
    const existing = await this.productRepo.findByUnique(input.name, input.brandName, input.modelName);
    if (existing) throw new ValidationError("product with same name, brand, model already exists");

    const images = await this.cloudUtils.uploadMultiFiles(files);
    const product = ProductEntity.create({ ...input, images });
    const saved = await this.productRepo.save(product);
    return saved.sanitize();
  }

  async getProducts(
    limit: number = 20,
    skip: number = 0,
    category?: string,
    search?: string,
    isAdmin?: boolean,
    brand?: string,
    model?: string,
    minPrice?: number,
    maxPrice?: number,
  ): Promise<SanitizedProduct[]> {
    const allProducts = await this.productRepo.getPopulated(limit, skip, category, search, brand, model, minPrice, maxPrice);

    let products: ProductEntity[];
    if (isAdmin) {
      products = allProducts;
    } else {
      products = allProducts.filter(
        (p) => p.isListed && typeof p.category === "object" && p.category.isListed,
      );
    }

    return products.map((p) => p.sanitize());
  }

  async searchProducts(filters: ProductSearchFilters): Promise<ProductSearchResult> {
    const { query, category, minPrice, maxPrice, brand, model, limit = 20, skip = 0 } = filters;

    const products = await this.productRepo.search(query, category, minPrice, maxPrice, brand, model, limit, skip);
    const total = await this.productRepo.count(query, category, minPrice, maxPrice, brand, model);

    return {
      products: products.map((p) => p.sanitize()),
      total,
      pageSize: limit,
      skip,
    };
  }

  async editProduct(
    id: string,
    reqBody: Record<string, unknown>,
  ): Promise<SanitizedProduct> {
    const editFields = this.validateEditInput(reqBody);
    const product = await this.productRepo.findById(id);
    if (!product) throw new ValidationError("product not found");

    if (editFields.brandName && editFields.brandName !== product.brandName) {
      const existing = await this.productRepo.findByUnique(product.name, editFields.brandName, product.modelName);
      if (existing) throw new ValidationError("product with same name, brand, model already exists");
      product.setBrand(editFields.brandName);
    }

    if (editFields.description && editFields.description !== product.description) {
      product.setDescription(editFields.description);
    }

    if (editFields.modelName && editFields.modelName !== product.modelName) {
      const existing = await this.productRepo.findByUnique(product.name, product.brandName, editFields.modelName);
      if (existing) throw new ValidationError("product with same name, brand, model already exists");
      product.setModel(editFields.modelName);
    }

    if (editFields.name && editFields.name !== product.name) {
      const existing = await this.productRepo.findByUnique(editFields.name, product.brandName, product.modelName);
      if (existing) throw new ValidationError("product with same name, brand, model already exists");
      product.setName(editFields.name);
    }

    if (editFields.price !== undefined && editFields.price !== product.price) {
      product.setPrice(editFields.price);
    }

    if (editFields.stock !== undefined && editFields.stock !== product.stock) {
      product.setStock(editFields.stock);
    }

    const updated = await this.productRepo.update(id, {
      name: product.name,
      description: product.description,
      price: product.price,
      brandName: product.brandName,
      modelName: product.modelName,
      stock: product.stock,
      images: product.images,
      isListed: product.isListed,
      category: product.category,
    });

    if (!updated) throw new ValidationError("failed to update product");
    return updated.sanitize();
  }

  async uploadImages(
    id: string,
    files: Express.Multer.File[],
  ): Promise<SanitizedProduct> {
    if (!files || files.length === 0) throw new ValidationError("images is empty");

    const product = await this.productRepo.findById(id);
    if (!product) throw new ValidationError("product not found");

    const newImages = await this.cloudUtils.uploadMultiFiles(files);
    const concatImages = [...product.images, ...newImages];

    const updated = await this.productRepo.update(id, { images: concatImages });
    if (!updated) throw new ValidationError("failed to upload images");
    return updated.sanitize();
  }

  async deleteImage(
    id: string,
    image: ProductImage,
  ): Promise<SanitizedProduct> {
    if (!image || !image.id || !image.url) throw new ValidationError("image not found");

    const product = await this.productRepo.findById(id);
    if (!product) throw new ValidationError("product not found");

    await this.cloudUtils.deleteImage(image.id);
    const updatedImages = product.images.filter((img) => img.id !== image.id);

    const updated = await this.productRepo.update(id, { images: updatedImages });
    if (!updated) throw new ValidationError("failed to delete image");
    return updated.sanitize();
  }

  async changeListStatus(
    id: string,
    isListed: boolean,
  ): Promise<SanitizedProduct> {
    const updated = await this.productRepo.update(id, { isListed });
    if (!updated) throw new ValidationError("product not found");
    return updated.sanitize();
  }

  async getSingleProduct(id: string): Promise<SanitizedProduct> {
    const product = await this.productRepo.findById(id);
    if (!product) throw new ValidationError("product not found");
    return product.sanitize();
  }

  private validateCreateInput(body: Record<string, unknown>): CreateProductInput {
    const name = body.name as string;
    const description = body.description as string;
    const price = parseFloat(body.price as string);
    const category = body.category as string;
    const brandName = body.brandName as string;
    const modelName = body.modelName as string;
    const stock = parseInt(body.stock as string, 10);

    if (!name || !description || isNaN(price) || !category || !brandName || !modelName || isNaN(stock)) {
      throw new ValidationError("invalid product data");
    }

    return { name, description, price, category, brandName, modelName, stock };
  }

  private validateEditInput(
    body: Record<string, unknown>,
  ): Partial<Omit<CreateProductInput, "category">> {
    const result: Partial<Omit<CreateProductInput, "category">> = {};

    if (body.name !== undefined) result.name = body.name as string;
    if (body.description !== undefined) result.description = body.description as string;
    if (body.price !== undefined) {
      const price = parseFloat(body.price as string);
      if (isNaN(price) || price < 0) throw new ValidationError("invalid price");
      result.price = price;
    }
    if (body.brandName !== undefined) result.brandName = body.brandName as string;
    if (body.modelName !== undefined) result.modelName = body.modelName as string;
    if (body.stock !== undefined) {
      const stock = parseInt(body.stock as string, 10);
      if (isNaN(stock) || stock < 0) throw new ValidationError("invalid stock");
      result.stock = stock;
    }

    return result;
  }
}
