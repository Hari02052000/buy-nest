import { injectable } from "tsyringe";
import CategoryModel from "./category.model";
import { Category } from "./category.entity";
import { APIError, ValidationError } from "@/shared/errors";

@injectable()
export class CategoryRepository {
  async findByName(name: string): Promise<Category | null> {
    try {
      const doc = await CategoryModel.findOne({ name });
      if (!doc) return null;
      return Category.fromDocument(doc);
    } catch (error) {
      throw new APIError("Failed to find category by name");
    }
  }

  async findById(id: string): Promise<Category> {
    try {
      const doc = await CategoryModel.findById(id);
      if (!doc) throw new ValidationError("Invalid category id");
      return Category.fromDocument(doc);
    } catch (error) {
      if (error instanceof ValidationError) throw error;
      throw new APIError("Failed to find category");
    }
  }

  async save(category: Category): Promise<Category> {
    try {
      const doc = new CategoryModel({
        name: category.name,
        image: category.image,
        parentId: category.parentId || null,
        ancestors: category.ancestors || [],
        level: category.level || 0,
        isListed: category.isListed,
      });
      const saved = await doc.save();
      return Category.fromDocument(saved);
    } catch (error) {
      throw new APIError("Failed to save category");
    }
  }

  async findAll(limit: number, skip: number): Promise<Category[]> {
    try {
      const docs = await CategoryModel.find().limit(limit).skip(skip);
      return docs.map((doc) => Category.fromDocument(doc));
    } catch (error) {
      throw new APIError("Failed to fetch categories");
    }
  }

  async findSubCategories(parentId: string): Promise<Category[]> {
    try {
      const docs = await CategoryModel.find({ parentId });
      return docs.map((doc) => Category.fromDocument(doc));
    } catch (error) {
      throw new APIError("Failed to fetch subcategories");
    }
  }

  async update(id: string, data: Partial<Category>): Promise<Category> {
    try {
      const updateFields: Record<string, any> = {};
      if (data.name !== undefined) updateFields.name = data.name;
      if (data.image !== undefined) updateFields.image = data.image;
      if (data.parentId !== undefined) updateFields.parentId = data.parentId;
      if (data.ancestors !== undefined) updateFields.ancestors = data.ancestors;
      if (data.level !== undefined) updateFields.level = data.level;
      if (data.isListed !== undefined) updateFields.isListed = data.isListed;

      await CategoryModel.findByIdAndUpdate(id, updateFields);
      const doc = await CategoryModel.findById(id);
      if (!doc) throw new ValidationError("Category not found after update");
      return Category.fromDocument(doc);
    } catch (error) {
      if (error instanceof ValidationError) throw error;
      throw new APIError("Failed to update category");
    }
  }
}
