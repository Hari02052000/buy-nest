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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoryRepository = void 0;
const entities_1 = require("../../domain/entities");
const category_model_1 = __importDefault(require("../model/category.model"));
class categoryRepository {
    getCategoryByName(name) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const category = yield category_model_1.default.findOne({ name });
                if (!category)
                    return null;
                return this.mapToCategory(category);
            }
            catch (error) {
                console.log(error);
                throw new entities_1.APIError();
            }
        });
    }
    getCategoryById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const category = yield category_model_1.default.findById(id);
                if (!category)
                    throw new entities_1.ValidationError("invalid category Id");
                return this.mapToCategory(category);
            }
            catch (error) {
                throw new entities_1.APIError();
            }
        });
    }
    createCategory(category) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const dbCategory = new category_model_1.default({
                    name: category.name,
                    image: category.image,
                    parentId: category.parentId || null,
                    ancestors: category.ancestors || [],
                    level: category.level || 0,
                });
                yield dbCategory.save();
                return this.mapToCategory(dbCategory);
            }
            catch (error) {
                throw new entities_1.APIError();
            }
        });
    }
    getCategory(limit, skip) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const categorys = yield category_model_1.default.find().limit(limit).skip(skip);
                return categorys.map((category) => this.mapToCategory(category));
            }
            catch (error) {
                throw new entities_1.APIError();
            }
        });
    }
    getSubCategory(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const subCategorys = yield category_model_1.default.find({ parentId: id });
                return subCategorys.map((subcategory) => this.mapToCategory(subcategory));
            }
            catch (error) {
                throw new entities_1.APIError();
            }
        });
    }
    editCategory(category) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const modifiedFields = category.modifiedFields;
                if (Object.keys(modifiedFields).length === 0)
                    throw new entities_1.ValidationError();
                const updatedFields = {};
                for (const key in modifiedFields) {
                    if (modifiedFields.hasOwnProperty(key)) {
                        const fieldKey = key;
                        if (modifiedFields[fieldKey]) {
                            updatedFields[fieldKey] = category[fieldKey];
                        }
                    }
                }
                if (updatedFields.updatedAt)
                    delete updatedFields.updatedAt;
                yield category_model_1.default.findByIdAndUpdate(category.id, updatedFields);
                category.clearModifiedFields;
                const updatedCategory = yield category_model_1.default.findById(category.id);
                return this.mapToCategory(updatedCategory);
            }
            catch (error) {
                throw new entities_1.APIError();
            }
        });
    }
    mapToCategory(categoryDb) {
        var _a;
        const category = new entities_1.Category(categoryDb.id, categoryDb.name, categoryDb.image, (_a = categoryDb.parentId) === null || _a === void 0 ? void 0 : _a.toString());
        category.isListed = categoryDb.isListed;
        category.createdAt = categoryDb.createdAt;
        category.updatedAt = categoryDb.updatedAt;
        return category;
    }
}
exports.categoryRepository = categoryRepository;
