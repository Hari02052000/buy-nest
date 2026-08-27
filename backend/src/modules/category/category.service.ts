import { injectable, inject } from "tsyringe";
import { CategoryRepository } from "./category.repository";
import { Category as CategoryEntity } from "./category.entity";
import type { SanitizedCategory, CategoryTreeItem } from "./category.entity";
import { SHARED_TOKENS } from "@/shared/tokens";
import type { CloudUtils } from "@/shared/utils/cloud.utils";
import { validateCreateCategory, validateEditCategory } from "@/shared/validators/category.validator";
import { ValidationError, AuthorizeError } from "@/shared/errors";

@injectable()
export class CategoryService {
  constructor(
    private categoryRepo: CategoryRepository,
    @inject(SHARED_TOKENS.CloudUtils) private cloudUtils: CloudUtils,
  ) {}

  async createCategory(
    file: Express.Multer.File,
    body: any,
    adminToken: string,
  ): Promise<SanitizedCategory> {
    if (!file) throw new ValidationError("Category image not found");

    const input = validateCreateCategory(body);

    let ancestors: string[] = [];
    let level = 0;
    if (input.parentId) {
      const parentCategory = await this.categoryRepo.findById(input.parentId);
      ancestors = [...(parentCategory.ancestors || []), parentCategory.id];
      level = parentCategory.level + 1;
    }

    const existing = await this.categoryRepo.findByName(input.name);
    if (existing) throw new ValidationError("Category name already exists");

    const image = await this.cloudUtils.uploadSingleFile(file);
    const category = CategoryEntity.create({
      name: input.name,
      image,
      parentId: input.parentId,
      ancestors,
      level,
    });

    const saved = await this.categoryRepo.save(category);
    return saved.sanitize();
  }

  async getCategory(
    limit: number,
    page: number,
    adminToken?: string,
  ): Promise<CategoryTreeItem[]> {
    const skip = (page - 1) * limit;
    const allCategories = await this.categoryRepo.findAll(limit, skip);

    const categories = adminToken
      ? allCategories
      : allCategories.filter((cat) => cat.isListed);

    const sanitized = categories.map((cat) => cat.sanitize());
    const categoryMap: Record<string, CategoryTreeItem> = {};

    sanitized.forEach((cat) => {
      categoryMap[cat.id] = { ...cat, children: [] };
    });

    const tree: CategoryTreeItem[] = [];
    sanitized.forEach((cat) => {
      if (cat.parentId && categoryMap[cat.parentId]) {
        categoryMap[cat.parentId].children.push(categoryMap[cat.id]);
      } else {
        tree.push(categoryMap[cat.id]);
      }
    });

    return tree;
  }

  async getSingleCategory(id: string): Promise<SanitizedCategory> {
    const category = await this.categoryRepo.findById(id);
    return category.sanitize();
  }

  async getSubCategory(id: string): Promise<SanitizedCategory[]> {
    const subCategories = await this.categoryRepo.findSubCategories(id);
    return subCategories.map((sub) => sub.sanitize());
  }

  async editCategory(id: string, reqBody: any, adminToken: string): Promise<SanitizedCategory> {
    const input = validateEditCategory(reqBody);
    const category = await this.categoryRepo.findById(id);

    if (category.name !== input.name) {
      const existing = await this.categoryRepo.findByName(input.name);
      if (existing) throw new ValidationError("Category name already exists");
      category.setName(input.name);
    }

    const updated = await this.categoryRepo.update(id, category);
    return updated.sanitize();
  }

  async changeListStatus(
    id: string,
    isListed: boolean,
    adminToken: string,
  ): Promise<SanitizedCategory> {
    const category = await this.categoryRepo.findById(id);
    category.setIsListed(isListed);
    const updated = await this.categoryRepo.update(id, category);
    return updated.sanitize();
  }

  async editCategoryImage(
    id: string,
    file: Express.Multer.File,
    adminToken: string,
  ): Promise<SanitizedCategory> {
    if (!file) throw new ValidationError("Image not found");

    const category = await this.categoryRepo.findById(id);
    const image = await this.cloudUtils.uploadSingleFile(file);
    await this.cloudUtils.deleteImage(category.image.id);
    category.setImage(image);

    const updated = await this.categoryRepo.update(id, category);
    return updated.sanitize();
  }
}
