import {
  AuthorizeError,
  Category,
  categoryProperties,
  productProperties,
  categorieTreeItem,
  ValidationError,
} from "@/domain/entities";
import { categoryRepositoryInterface } from "@/domain/interfaces/repository";
import { categoryServiceInterface } from "@/domain/interfaces/services";
import { cloudUtillsInterface } from "@/domain/interfaces/utils";
import { categoryUtillsInterface } from "@/domain/interfaces/utils";
import { tokenValidationUtillsInterface } from "@/domain/interfaces/utils";

export class categoryService implements categoryServiceInterface {
  constructor(
    private categoryRepo: categoryRepositoryInterface,
    private cloudUtils: cloudUtillsInterface,
    private tokenUtils: tokenValidationUtillsInterface,
    private categoryUtils: categoryUtillsInterface,
  ) {}
  async getSingleCategory(id: string): Promise<Partial<categoryProperties>> {
    const category = await this.categoryRepo.getCategoryById(id);
    return category.sanitizeCategory();
  }
  async createCategory(file: any, body: any, adminToken: string): Promise<Partial<categoryProperties>> {
    const isAdmin = this.tokenUtils.isValidAdminToken(adminToken);
    if (!isAdmin) throw new AuthorizeError();
    if (!file) throw new ValidationError("category image not found");
    const categoryProperties = this.categoryUtils.validateCreateCategoryRequest(body);
    let ancestors: string[] = [];
    let level = 0;
    if (categoryProperties.parentId) {
      const parentCategory = await this.categoryRepo.getCategoryById(categoryProperties.parentId);
      ancestors = [...(parentCategory.ancestors || []), parentCategory.id];
      level = parentCategory.level + 1;
    }
    const isExistCategory = await this.categoryRepo.getCategoryByName(categoryProperties.name);
    if (isExistCategory) throw new ValidationError("category name allredy exist");
    const image = await this.cloudUtils.uploadSingleFile(file);
    const category = new Category("", categoryProperties.name, image, categoryProperties.parentId);
    category.ancestors = ancestors;
    category.level = level;
    const savedCategory = await this.categoryRepo.createCategory(category);
    return savedCategory.sanitizeCategory();
  }

  async getCategory(
    limit: number,
    page: number,
    adminToken?: string,
  ): Promise<Partial<categoryProperties>[]> {
    if (adminToken) {
      const isAdmin = this.tokenUtils.isValidAdminToken(adminToken);
      if (!isAdmin) throw new AuthorizeError();
    }
    const skip = (page - 1) * limit;
    const allCategories = await this.categoryRepo.getCategory(limit, skip);
    let categories;
    if (!adminToken) {
      categories = allCategories.filter((category) => category.isListed);
    } else {
      categories = allCategories;
    }
    const catProperties = categories.map((cat) => cat.sanitizeCategory());
    const categorieMap: Record<any, any> = {};
    catProperties.forEach((category) => {
      categorieMap[category.id!] = { ...category, children: [] };
    });
    const tree = [] as categorieTreeItem[];
    catProperties.forEach((category) => {
      if (category.parentId) {
        categorieMap[category.parentId].children.push(categorieMap[category.id!]);
      } else {
        tree.push(categorieMap[category.id!]);
      }
    });
    return tree;
  }
  async getSubCategory(id: string): Promise<Partial<categoryProperties>[]> {
    const subCategorys = await this.categoryRepo.getSubCategory(id);
    return subCategorys.map((subCategory) => subCategory.sanitizeCategory());
  }
  async editCategory(id: string, reqBody: any, adminToken: string): Promise<Partial<categoryProperties>> {
    const isAdmin = this.tokenUtils.isValidAdminToken(adminToken);
    if (!isAdmin) throw new AuthorizeError();
    const category = await this.categoryRepo.getCategoryById(id);
    const categoryProperties = this.categoryUtils.validateEditCategoryRequest(reqBody);
    if (categoryProperties.name && category.name !== categoryProperties.name) {
      const isExistCategory = await this.categoryRepo.getCategoryByName(categoryProperties.name);
      if (isExistCategory) throw new ValidationError("name allredy exist");
      category.setName(categoryProperties.name);
      const updatedCategory = await this.categoryRepo.editCategory(category);
      return updatedCategory.sanitizeCategory();
    }
    throw new ValidationError("name is not valid or allredy exist");
  }
  async changeListStatus(
    id: string,
    isListed: boolean,
    adminToken: string,
  ): Promise<Partial<categoryProperties>> {
    const isAdmin = this.tokenUtils.isValidAdminToken(adminToken);
    if (!isAdmin) throw new AuthorizeError();
    const category = await this.categoryRepo.getCategoryById(id);
    category.setIsListed(isListed);
    const updatedCategory = await this.categoryRepo.editCategory(category);
    return updatedCategory.sanitizeCategory();
  }

  async editCategoryImage(id: string, file: any, adminToken: string): Promise<Partial<categoryProperties>> {
    const isAdmin = this.tokenUtils.isValidAdminToken(adminToken);
    if (!isAdmin) throw new AuthorizeError();
    if (!file) throw new ValidationError("image not found");
    const category = await this.categoryRepo.getCategoryById(id);
    const image = await this.cloudUtils.uploadSingleFile(file);
    await this.cloudUtils.deleteImage(category.image.id);
    category.setImage(image);
    const updatedCategory = await this.categoryRepo.editCategory(category);
    return updatedCategory.sanitizeCategory();
  }
}
