import { APIError, Category, categoryProperties, ValidationError } from "@/domain/entities";
import { categoryRepositoryInterface } from "@/domain/interfaces/repository";
import CategoryModel, { Icategory } from "../model/category.model";

export class categoryRepository implements categoryRepositoryInterface {
  async getCategoryByName(name: string): Promise<Category | null> {
    try {
      const category = await CategoryModel.findOne({ name });
      if (!category) return null;
      return this.mapToCategory(category);
    } catch (error) {
      console.log(error);

      throw new APIError();
    }
  }
  async getCategoryById(id: string): Promise<Category> {
    try {
      const category = await CategoryModel.findById(id);
      if (!category) throw new ValidationError("invalid category Id");
      return this.mapToCategory(category);
    } catch (error) {
      throw new APIError();
    }
  }
  async createCategory(category: Category): Promise<Category> {
    try {
      const dbCategory = new CategoryModel({
        name: category.name,
        image: category.image,
        parentId: category.parentId || null,
        ancestors: category.ancestors || [],
        level: category.level || 0,
      });
      await dbCategory.save();
      return this.mapToCategory(dbCategory);
    } catch (error) {
      throw new APIError();
    }
  }
  async getCategory(limit: number, skip: number): Promise<Category[]> {
    try {
      const categorys = await CategoryModel.find().limit(limit).skip(skip);
      return categorys.map((category) => this.mapToCategory(category));
    } catch (error) {
      throw new APIError();
    }
  }
  async getSubCategory(id: string): Promise<Category[]> {
    try {
      const subCategorys = await CategoryModel.find({ parentId: id });
      return subCategorys.map((subcategory) => this.mapToCategory(subcategory));
    } catch (error) {
      throw new APIError();
    }
  }
  async editCategory(category: Category): Promise<Category> {
    try {
      const modifiedFields = category.modifiedFields;
      if (Object.keys(modifiedFields).length === 0) throw new ValidationError();
      const updatedFields: Record<keyof Omit<categoryProperties, "id">, any> = {} as Record<
        keyof Omit<categoryProperties, "id">,
        any
      >;
      for (const key in modifiedFields) {
        if (modifiedFields.hasOwnProperty(key)) {
          const fieldKey = key as keyof Omit<categoryProperties, "id">;
          if (modifiedFields[fieldKey]) {
            updatedFields[fieldKey] = category[fieldKey];
          }
        }
      }
      if (updatedFields.updatedAt) delete updatedFields.updatedAt;
      await CategoryModel.findByIdAndUpdate(category.id, updatedFields);
      category.clearModifiedFields;
      const updatedCategory = await CategoryModel.findById(category.id);
      return this.mapToCategory(updatedCategory!);
    } catch (error) {
      throw new APIError();
    }
  }
  mapToCategory(categoryDb: Icategory): Category {
    const category = new Category(
      categoryDb.id,
      categoryDb.name,
      categoryDb.image,
      categoryDb.parentId?.toString(),
    );
    category.isListed = categoryDb.isListed;
    category.createdAt = categoryDb.createdAt;
    category.updatedAt = categoryDb.updatedAt;
    return category;
  }
}
