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
exports.productRepository = void 0;
const entities_1 = require("../../domain/entities");
const product_model_1 = __importDefault(require("../model/product.model"));
const mongoose_1 = require("mongoose");
const category_model_1 = __importDefault(require("../model/category.model"));
class productRepository {
    getProductByIds(productIds) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const products = yield product_model_1.default.find({
                    _id: { $in: productIds },
                });
                return products.map((product) => this.mapToProduct(product));
            }
            catch (error) {
                throw new entities_1.APIError();
            }
        });
    }
    getPopulatedProduct(productId) {
        throw new Error("Method not implemented.");
    }
    getPopulatedProducts(limit, skip, category, search, brand, model, minPrice, maxPrice) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = {};
                if (category) {
                    const categoryId = new mongoose_1.Types.ObjectId(category);
                    const allCategories = yield category_model_1.default.find({
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
                    if (minPrice)
                        query.price.$gte = minPrice;
                    if (maxPrice)
                        query.price.$lte = maxPrice;
                }
                const products = yield product_model_1.default.find(query).populate("category").limit(limit).skip(skip);
                return products.map((product) => this.mapToProduct(product));
            }
            catch (error) {
                throw new entities_1.APIError();
            }
        });
    }
    getUniqueProduct(name, brand, model) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const product = yield product_model_1.default.findOne({
                    name: name,
                    brandName: brand,
                    modelName: model,
                });
                if (!product)
                    return null;
                return this.mapToProduct(product);
            }
            catch (error) {
                console.error("Error in getUniqueProduct:", error);
                throw new entities_1.APIError(`Failed to get unique product: ${error instanceof Error ? error.message : "Unknown error"}`);
            }
        });
    }
    saveProduct(product) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const productDb = new product_model_1.default({
                    name: product.name,
                    images: product.images,
                    description: product.description,
                    price: product.price,
                    category: product.category,
                    brandName: product.brandName,
                    modelName: product.modelName,
                    stock: product.stock,
                });
                yield productDb.save();
                return this.mapToProduct(productDb);
            }
            catch (error) {
                console.error("Error in saveProduct:", error);
                throw new entities_1.APIError(`Failed to save product: ${error instanceof Error ? error.message : "Unknown error"}`);
            }
        });
    }
    getProducts(limit, skip, category) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = { isListed: true };
                if (category) {
                    query.category = category;
                }
                const products = yield product_model_1.default.find(query).populate("category", "name").limit(limit).skip(skip);
                return products.map((product) => this.mapToProduct(product));
            }
            catch (error) {
                console.error("Error in getProducts:", error);
                throw new entities_1.APIError(`Failed to get products: ${error instanceof Error ? error.message : "Unknown error"}`);
            }
        });
    }
    searchProducts(query_1, category_1, minPrice_1, maxPrice_1, brand_1, model_1) {
        return __awaiter(this, arguments, void 0, function* (query, category, minPrice, maxPrice, brand, model, limit = 20, skip = 0) {
            try {
                // Build query object
                const queryObj = { isListed: true };
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
                    if (minPrice !== undefined)
                        queryObj.price.$gte = minPrice;
                    if (maxPrice !== undefined)
                        queryObj.price.$lte = maxPrice;
                }
                // Execute query with pagination
                const products = yield product_model_1.default.find(queryObj)
                    .populate("category", "name")
                    .sort({ createdAt: -1 })
                    .limit(limit)
                    .skip(skip);
                return products.map((product) => this.mapToProduct(product));
            }
            catch (error) {
                throw new entities_1.APIError();
            }
        });
    }
    countProducts(query, category, minPrice, maxPrice, brand, model) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Build query object
                const queryObj = { isListed: true };
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
                    if (minPrice !== undefined)
                        queryObj.price.$gte = minPrice;
                    if (maxPrice !== undefined)
                        queryObj.price.$lte = maxPrice;
                }
                return yield product_model_1.default.countDocuments(queryObj);
            }
            catch (error) {
                throw new entities_1.APIError();
            }
        });
    }
    editProduct(product) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const modifiedFields = product.modifiedFields;
                if (Object.keys(modifiedFields).length === 0)
                    throw new entities_1.ValidationError();
                const updatedFields = {};
                for (const key in modifiedFields) {
                    if (modifiedFields.hasOwnProperty(key)) {
                        const fieldKey = key;
                        if (modifiedFields[fieldKey]) {
                            updatedFields[fieldKey] = product[fieldKey];
                        }
                    }
                }
                if (updatedFields.updatedAt)
                    delete updatedFields.updatedAt;
                yield product_model_1.default.findByIdAndUpdate(product.id, updatedFields);
                product.clearModifiedFields;
                const updatedProduct = yield this.getSingleProduct(product.id);
                return updatedProduct;
            }
            catch (error) {
                throw new entities_1.APIError();
            }
        });
    }
    getSingleProduct(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const product = yield product_model_1.default.findById(id).populate("category");
                if (!product)
                    throw new entities_1.ValidationError("product id didnt exist");
                return this.mapToProduct(product);
            }
            catch (error) {
                if (error instanceof entities_1.ValidationError) {
                    throw error; // Re-throw validation errors as-is
                }
                console.error("Error in getSingleProduct:", error);
                throw new entities_1.APIError(`Failed to get single product: ${error instanceof Error ? error.message : "Unknown error"}`);
            }
        });
    }
    mapToProduct(productDb) {
        // Handle populated category (object with name) or ObjectId
        let categoryValue;
        if (typeof productDb.category === "object" &&
            productDb.category !== null &&
            "name" in productDb.category) {
            categoryValue = {};
            categoryValue.ancestors = productDb.category.ancestors.map((ance) => ance.toString());
            categoryValue.isListed = productDb.category.isListed;
            categoryValue.name = productDb.category.name;
            categoryValue.id = productDb.category.id;
        }
        else {
            categoryValue = productDb.category.toString();
        }
        const product = new entities_1.Product(productDb.id, productDb.name, productDb.images, productDb.description, productDb.price, categoryValue, productDb.brandName, productDb.modelName, productDb.stock);
        product.isListed = productDb.isListed;
        product.createdAt = productDb.createdAt;
        product.updatedAt = productDb.updatedAt;
        return product;
    }
}
exports.productRepository = productRepository;
