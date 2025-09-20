"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoryService = void 0;
const entities_1 = require("../../../domain/entities");
class categoryService {
    constructor(categoryRepo, cloudUtils, tokenUtils, categoryUtils) {
        this.categoryRepo = categoryRepo;
        this.cloudUtils = cloudUtils;
        this.tokenUtils = tokenUtils;
        this.categoryUtils = categoryUtils;
    }
    getSingleCategory(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const category = yield this.categoryRepo.getCategoryById(id);
            return category.sanitizeCategory();
        });
    }
    createCategory(file, body, adminToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const isAdmin = this.tokenUtils.isValidAdminToken(adminToken);
            if (!isAdmin)
                throw new entities_1.AuthorizeError();
            if (!file)
                throw new entities_1.ValidationError("category image not found");
            const categoryProperties = this.categoryUtils.validateCreateCategoryRequest(body);
            let ancestors = [];
            let level = 0;
            if (categoryProperties.parentId) {
                const parentCategory = yield this.categoryRepo.getCategoryById(categoryProperties.parentId);
                ancestors = [...(parentCategory.ancestors || []), parentCategory.id];
                level = parentCategory.level + 1;
            }
            const isExistCategory = yield this.categoryRepo.getCategoryByName(categoryProperties.name);
            if (isExistCategory)
                throw new entities_1.ValidationError("category name allredy exist");
            const image = yield this.cloudUtils.uploadSingleFile(file);
            const category = new entities_1.Category("", categoryProperties.name, image, categoryProperties.parentId);
            category.ancestors = ancestors;
            category.level = level;
            const savedCategory = yield this.categoryRepo.createCategory(category);
            return savedCategory.sanitizeCategory();
        });
    }
    getCategory(limit, page, adminToken) {
        return __awaiter(this, void 0, void 0, function* () {
            if (adminToken) {
                const isAdmin = this.tokenUtils.isValidAdminToken(adminToken);
                if (!isAdmin)
                    throw new entities_1.AuthorizeError();
            }
            const skip = (page - 1) * limit;
            const allCategories = yield this.categoryRepo.getCategory(limit, skip);
            let categories;
            if (!adminToken) {
                categories = allCategories.filter((category) => category.isListed);
            }
            else {
                categories = allCategories;
            }
            const catProperties = categories.map((cat) => cat.sanitizeCategory());
            const categorieMap = {};
            catProperties.forEach((category) => {
                categorieMap[category.id] = Object.assign(Object.assign({}, category), { children: [] });
            });
            const tree = [];
            catProperties.forEach((category) => {
                if (category.parentId) {
                    categorieMap[category.parentId].children.push(categorieMap[category.id]);
                }
                else {
                    tree.push(categorieMap[category.id]);
                }
            });
            return tree;
        });
    }
    getSubCategory(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const subCategorys = yield this.categoryRepo.getSubCategory(id);
            return subCategorys.map((subCategory) => subCategory.sanitizeCategory());
        });
    }
    editCategory(id, reqBody, adminToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const isAdmin = this.tokenUtils.isValidAdminToken(adminToken);
            if (!isAdmin)
                throw new entities_1.AuthorizeError();
            const category = yield this.categoryRepo.getCategoryById(id);
            const categoryProperties = this.categoryUtils.validateEditCategoryRequest(reqBody);
            if (categoryProperties.name && category.name !== categoryProperties.name) {
                const isExistCategory = yield this.categoryRepo.getCategoryByName(categoryProperties.name);
                if (isExistCategory)
                    throw new entities_1.ValidationError("name allredy exist");
                category.setName(categoryProperties.name);
                const updatedCategory = yield this.categoryRepo.editCategory(category);
                return updatedCategory.sanitizeCategory();
            }
            throw new entities_1.ValidationError("name is not valid or allredy exist");
        });
    }
    changeListStatus(id, isListed, adminToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const isAdmin = this.tokenUtils.isValidAdminToken(adminToken);
            if (!isAdmin)
                throw new entities_1.AuthorizeError();
            const category = yield this.categoryRepo.getCategoryById(id);
            category.setIsListed(isListed);
            const updatedCategory = yield this.categoryRepo.editCategory(category);
            return updatedCategory.sanitizeCategory();
        });
    }
    editCategoryImage(id, file, adminToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const isAdmin = this.tokenUtils.isValidAdminToken(adminToken);
            if (!isAdmin)
                throw new entities_1.AuthorizeError();
            if (!file)
                throw new entities_1.ValidationError("image not found");
            const category = yield this.categoryRepo.getCategoryById(id);
            const image = yield this.cloudUtils.uploadSingleFile(file);
            yield this.cloudUtils.deleteImage(category.image.id);
            category.setImage(image);
            const updatedCategory = yield this.categoryRepo.editCategory(category);
            return updatedCategory.sanitizeCategory();
        });
    }
}
exports.categoryService = categoryService;
