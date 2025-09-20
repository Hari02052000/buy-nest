import { APIError, categoryProperties, Product, productProperties, ValidationError } from "@/domain/entities";
import { productRepositoryInterface } from "@/domain/interfaces/repository";
import { ProductSearchFilters, ProductSearchResult } from "@/domain/types/product.request.type";
import ProductModel, { IProduct } from "../model/product.model";
import { Types } from "mongoose";
import CategoryModel from "../model/category.model";

export class productRepository implements productRepositoryInterface {
  async getProductByIds(productIds: string[]): Promise<Product[]> {
    try {
      const products = await ProductModel.find({
        _id: { $in: productIds },
      });
      return products.map((product) => this.mapToProduct(product));
    } catch (error) {
      throw new APIError();
    }
  }
  getPopulatedProduct(productId: string): Promise<Product> {
    throw new Error("Method not implemented.");
  }
  async getPopulatedProducts(
    limit: number,
    skip: number,
    category?: string,
    search?: string,
    brand?: string,
    model?: string,
    minPrice?: number,
    maxPrice?: number,
  ): Promise<Product[]> {
    try {
      const query: any = {};
      if (category) {
        const categoryId = new Types.ObjectId(category);
        const allCategories = await CategoryModel.find({
          $or: [{ _id: categoryId }, { ancestors: categoryId }],
        }).select("_id");
        const categoryIds = allCategories.map((cat) => cat._id);
        query.category = { $in: categoryIds };
      }
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: "i" } },
          { brand: { $regex: search, $options: "i" } },
          { model: { $regex: search, $options: "i" } },
        ];
      }
      if (minPrice || maxPrice) {
        query.price = {};
        if (minPrice) query.price.$gte = minPrice;
        if (maxPrice) query.price.$lte = maxPrice;
      }
      const products = await ProductModel.find(query).populate("category").limit(limit).skip(skip);
      return products.map((product) => this.mapToProduct(product));
    } catch (error) {
      throw new APIError();
    }
  }
  async getUniqueProduct(name: string, brand: string, model: string): Promise<Product | null> {
    try {
      const product = await ProductModel.findOne({
        name: name,
        brandName: brand,
        modelName: model,
      });
      if (!product) return null;
      return this.mapToProduct(product);
    } catch (error) {
      console.error("Error in getUniqueProduct:", error);
      throw new APIError(
        `Failed to get unique product: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  }

  async saveProduct(product: Product): Promise<Product> {
    try {
      const productDb = new ProductModel({
        name: product.name,
        images: product.images,
        description: product.description,
        price: product.price,
        category: product.category,
        brandName: product.brandName,
        modelName: product.modelName,
        stock: product.stock,
      });
      await productDb.save();
      return this.mapToProduct(productDb);
    } catch (error) {
      console.error("Error in saveProduct:", error);
      throw new APIError(
        `Failed to save product: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  }

  async getProducts(limit: number, skip: number, category?: string): Promise<Product[]> {
    try {
      const query: any = { isListed: true };
      if (category) {
        query.category = category;
      }
      const products = await ProductModel.find(query).populate("category", "name").limit(limit).skip(skip);
      return products.map((product) => this.mapToProduct(product));
    } catch (error) {
      console.error("Error in getProducts:", error);
      throw new APIError(
        `Failed to get products: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  }

  async searchProducts(
    query?: string,
    category?: string,
    minPrice?: number,
    maxPrice?: number,
    brand?: string,
    model?: string,
    limit: number = 20,
    skip: number = 0,
  ): Promise<Product[]> {
    try {
      // Build query object
      const queryObj: any = { isListed: true };

      // Text search across name, description, and brand
      if (query) {
        queryObj.$or = [
          { name: { $regex: query, $options: "i" } },
          { description: { $regex: query, $options: "i" } },
          { brandName: { $regex: query, $options: "i" } },
        ];
      }

      // Category filter
      if (category) {
        queryObj.category = { $regex: category, $options: "i" };
      }

      // Brand filter
      if (brand) {
        queryObj.brandName = { $regex: brand, $options: "i" };
      }

      // Model filter
      if (model) {
        queryObj.modelName = { $regex: model, $options: "i" };
      }

      // Price range filter
      if (minPrice !== undefined || maxPrice !== undefined) {
        queryObj.price = {};
        if (minPrice !== undefined) queryObj.price.$gte = minPrice;
        if (maxPrice !== undefined) queryObj.price.$lte = maxPrice;
      }

      // Execute query with pagination
      const products = await ProductModel.find(queryObj)
        .populate("category", "name")
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(skip);

      return products.map((product) => this.mapToProduct(product));
    } catch (error) {
      throw new APIError();
    }
  }

  async countProducts(
    query?: string,
    category?: string,
    minPrice?: number,
    maxPrice?: number,
    brand?: string,
    model?: string,
  ): Promise<number> {
    try {
      // Build query object
      const queryObj: any = { isListed: true };

      // Text search across name, description, and brand
      if (query) {
        queryObj.$or = [
          { name: { $regex: query, $options: "i" } },
          { description: { $regex: query, $options: "i" } },
          { brandName: { $regex: query, $options: "i" } },
        ];
      }

      // Category filter
      if (category) {
        queryObj.category = { $regex: category, $options: "i" };
      }

      // Brand filter
      if (brand) {
        queryObj.brandName = { $regex: brand, $options: "i" };
      }

      // Model filter
      if (model) {
        queryObj.modelName = { $regex: model, $options: "i" };
      }

      // Price range filter
      if (minPrice !== undefined || maxPrice !== undefined) {
        queryObj.price = {};
        if (minPrice !== undefined) queryObj.price.$gte = minPrice;
        if (maxPrice !== undefined) queryObj.price.$lte = maxPrice;
      }

      return await ProductModel.countDocuments(queryObj);
    } catch (error) {
      throw new APIError();
    }
  }
  async editProduct(product: Product): Promise<Product> {
    try {
      const modifiedFields = product.modifiedFields;
      if (Object.keys(modifiedFields).length === 0) throw new ValidationError();
      const updatedFields: Record<keyof Omit<productProperties, "id">, any> = {} as Record<
        keyof Omit<productProperties, "id">,
        any
      >;
      for (const key in modifiedFields) {
        if (modifiedFields.hasOwnProperty(key)) {
          const fieldKey = key as keyof Omit<productProperties, "id">;
          if (modifiedFields[fieldKey]) {
            updatedFields[fieldKey] = product[fieldKey];
          }
        }
      }
      if (updatedFields.updatedAt) delete updatedFields.updatedAt;
      await ProductModel.findByIdAndUpdate(product.id, updatedFields);
      product.clearModifiedFields;
      const updatedProduct = await this.getSingleProduct(product.id);
      return updatedProduct;
    } catch (error) {
      throw new APIError();
    }
  }
  async getSingleProduct(id: string): Promise<Product> {
    try {
      const product = await ProductModel.findById(id).populate("category");
      if (!product) throw new ValidationError("product id didnt exist");
      return this.mapToProduct(product);
    } catch (error) {
      if (error instanceof ValidationError) {
        throw error; // Re-throw validation errors as-is
      }
      console.error("Error in getSingleProduct:", error);
      throw new APIError(
        `Failed to get single product: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  }
  mapToProduct(productDb: IProduct): Product {
    // Handle populated category (object with name) or ObjectId
    let categoryValue;
    if (
      typeof productDb.category === "object" &&
      productDb.category !== null &&
      "name" in productDb.category
    ) {
      categoryValue = {} as Partial<categoryProperties>;
      categoryValue.ancestors = productDb.category.ancestors.map((ance) => ance.toString());
      categoryValue.isListed = productDb.category.isListed;
      categoryValue.name = productDb.category.name;
      categoryValue.id = productDb.category.id;
    } else {
      categoryValue = productDb.category.toString();
    }

    const product = new Product(
      productDb.id,
      productDb.name,
      productDb.images,
      productDb.description,
      productDb.price,
      categoryValue,
      productDb.brandName,
      productDb.modelName,
      productDb.stock,
    );
    product.isListed = productDb.isListed;
    product.createdAt = productDb.createdAt;
    product.updatedAt = productDb.updatedAt;
    return product;
  }
}
