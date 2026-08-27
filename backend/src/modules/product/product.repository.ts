import { injectable } from "tsyringe";
import { Types } from "mongoose";
import ProductModel from "./product.model";
import CategoryModel from "@/modules/category/category.model";
import { Product, ProductDocument, ProductCategoryValue, ProductCategory } from "./product.entity";
import { APIError, ValidationError } from "@/shared/errors";

@injectable()
export class ProductRepository {
  async save(product: Product): Promise<Product> {
    try {
      const doc = new ProductModel({
        name: product.name,
        images: product.images,
        description: product.description,
        price: product.price,
        category: product.category,
        brandName: product.brandName,
        modelName: product.modelName,
        stock: product.stock,
        isListed: product.isListed,
      });
      const saved = await doc.save();
      return Product.fromDocument(saved);
    } catch (error) {
      throw new APIError("Failed to save product");
    }
  }

  async findById(id: string): Promise<Product | null> {
    try {
      const doc = await ProductModel.findById(id).populate("category");
      if (!doc) return null;
      return Product.fromDocument(doc);
    } catch (error) {
      throw new APIError("Failed to find product");
    }
  }

  async findByIds(productIds: string[]): Promise<Product[]> {
    try {
      const docs = await ProductModel.find({ _id: { $in: productIds } });
      return docs.map((doc) => Product.fromDocument(doc));
    } catch (error) {
      throw new APIError("Failed to find products by ids");
    }
  }

  async findByUnique(
    name: string,
    brandName: string,
    modelName: string,
  ): Promise<Product | null> {
    try {
      const doc = await ProductModel.findOne({ name, brandName, modelName });
      if (!doc) return null;
      return Product.fromDocument(doc);
    } catch (error) {
      throw new APIError("Failed to find product by unique fields");
    }
  }

  async update(id: string, fields: Partial<Omit<Product, "id" | "createdAt" | "updatedAt">>): Promise<Product | null> {
    try {
      const doc = await ProductModel.findByIdAndUpdate(id, { $set: fields }, { new: true }).populate("category");
      if (!doc) return null;
      return Product.fromDocument(doc);
    } catch (error) {
      throw new APIError("Failed to update product");
    }
  }

  async search(
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
      const queryObj: Record<string, unknown> = { isListed: true };

      if (query) {
        queryObj.$or = [
          { name: { $regex: query, $options: "i" } },
          { description: { $regex: query, $options: "i" } },
          { brandName: { $regex: query, $options: "i" } },
        ];
      }

      if (category) {
        queryObj.category = { $regex: category, $options: "i" };
      }

      if (brand) {
        queryObj.brandName = { $regex: brand, $options: "i" };
      }

      if (model) {
        queryObj.modelName = { $regex: model, $options: "i" };
      }

      if (minPrice !== undefined || maxPrice !== undefined) {
        queryObj.price = {} as Record<string, number>;
        if (minPrice !== undefined) (queryObj.price as Record<string, number>).$gte = minPrice;
        if (maxPrice !== undefined) (queryObj.price as Record<string, number>).$lte = maxPrice;
      }

      const docs = await ProductModel.find(queryObj)
        .populate("category", "name")
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(skip);

      return docs.map((doc) => Product.fromDocument(doc));
    } catch (error) {
      throw new APIError("Failed to search products");
    }
  }

  async count(
    query?: string,
    category?: string,
    minPrice?: number,
    maxPrice?: number,
    brand?: string,
    model?: string,
  ): Promise<number> {
    try {
      const queryObj: Record<string, unknown> = { isListed: true };

      if (query) {
        queryObj.$or = [
          { name: { $regex: query, $options: "i" } },
          { description: { $regex: query, $options: "i" } },
          { brandName: { $regex: query, $options: "i" } },
        ];
      }

      if (category) {
        queryObj.category = { $regex: category, $options: "i" };
      }

      if (brand) {
        queryObj.brandName = { $regex: brand, $options: "i" };
      }

      if (model) {
        queryObj.modelName = { $regex: model, $options: "i" };
      }

      if (minPrice !== undefined || maxPrice !== undefined) {
        queryObj.price = {} as Record<string, number>;
        if (minPrice !== undefined) (queryObj.price as Record<string, number>).$gte = minPrice;
        if (maxPrice !== undefined) (queryObj.price as Record<string, number>).$lte = maxPrice;
      }

      return await ProductModel.countDocuments(queryObj);
    } catch (error) {
      throw new APIError("Failed to count products");
    }
  }

  async getPopulated(
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
      const query: Record<string, unknown> = {};

      if (category) {
        const categoryId = new Types.ObjectId(category);
        const allCategories = await CategoryModel.find({
          $or: [{ _id: categoryId }, { ancestors: categoryId }],
        }).select("_id");
        const categoryIds = allCategories.map((cat: any) => cat._id);
        query.category = { $in: categoryIds };
      }

      if (search) {
        query.$or = [
          { name: { $regex: search, $options: "i" } },
          { brandName: { $regex: search, $options: "i" } },
          { modelName: { $regex: search, $options: "i" } },
        ];
      }

      if (brand) {
        query.brandName = { $regex: brand, $options: "i" };
      }

      if (model) {
        query.modelName = { $regex: model, $options: "i" };
      }

      if (minPrice !== undefined || maxPrice !== undefined) {
        query.price = {} as Record<string, number>;
        if (minPrice !== undefined) (query.price as Record<string, number>).$gte = minPrice;
        if (maxPrice !== undefined) (query.price as Record<string, number>).$lte = maxPrice;
      }

      const docs = await ProductModel.find(query)
        .populate("category")
        .limit(limit)
        .skip(skip);

      return docs.map((doc) => Product.fromDocument(doc));
    } catch (error) {
      throw new APIError("Failed to get populated products");
    }
  }
}
