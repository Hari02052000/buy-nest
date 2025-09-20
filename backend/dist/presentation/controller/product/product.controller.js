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
exports.uploadProductImages = exports.editProduct = exports.deleteProductImage = exports.getProductById = exports.searchProducts = exports.getProducts = exports.createProduct = void 0;
const services_1 = require("../../../application/services");
const repository_1 = require("../../../infrastructure/repository");
const cloud_utils_1 = require("../../../infrastructure/utils/cloud.utils");
const product_utils_1 = require("../../../infrastructure/utils/product.utils");
const token_utils_1 = require("../../../infrastructure/utils/token.utils");
const response_utils_1 = require("../../../infrastructure/utils/response.utils");
const productRepo = new repository_1.productRepository();
const productServ = new services_1.productService(productRepo, product_utils_1.productUtills, token_utils_1.tokenUtils, cloud_utils_1.cloudUtills);
const createProduct = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.cookies.access_token_admin;
        const product = yield productServ.createProduct(req.files, req.body, token);
        return res.status(201).json({ product });
    }
    catch (error) {
        next(error);
    }
});
exports.createProduct = createProduct;
const getProducts = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const limit = parseInt(req.query.limit) || 20;
        const skip = parseInt(req.query.skip) || 0;
        const category = req.query.category || undefined;
        const search = req.query.search || undefined;
        const brand = req.query.brand || undefined;
        const model = req.query.model || undefined;
        let minPrice;
        let maxPrice;
        if (typeof req.query.minPrice === "string") {
            minPrice = parseFloat(req.query.minPrice);
        }
        if (typeof req.query.maxPrice === "string") {
            maxPrice = parseFloat(req.query.maxPrice);
        }
        const token = req.cookies.access_token_admin || undefined;
        const products = yield productServ.getProducts(limit, skip, category, search, token, brand, model, minPrice, maxPrice);
        return res.status(200).json({ products });
    }
    catch (error) {
        next(error);
    }
});
exports.getProducts = getProducts;
// Add new search endpoint
const searchProducts = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { query, category, brand, model, minPrice, maxPrice, sortBy = "createdAt", sortOrder = "desc", limit = 20, skip = 0, } = req.query;
        const searchFilters = {
            query: query,
            category: category,
            brand: brand,
            model: model,
            minPrice: minPrice ? parseFloat(minPrice) : undefined,
            maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
            sortBy: sortBy,
            sortOrder: sortOrder,
            limit: parseInt(limit),
            skip: parseInt(skip),
        };
        const result = yield productServ.searchProducts(searchFilters);
        return res.status(200).json(response_utils_1.ResponseUtils.success(result, "Products searched successfully"));
    }
    catch (error) {
        next(error);
    }
});
exports.searchProducts = searchProducts;
const getProductById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const product = yield productServ.getSingleProduct(id);
        return res.status(200).json(response_utils_1.ResponseUtils.success(product, "Product fetched successfully"));
    }
    catch (error) {
        next(error);
    }
});
exports.getProductById = getProductById;
const deleteProductImage = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.cookies.access_token_admin;
        const image = req.body.image;
        const id = req.params.id;
        const product = yield productServ.deletemage(id, image, token);
        return res.status(200).json({ product });
    }
    catch (error) {
        next(error);
    }
});
exports.deleteProductImage = deleteProductImage;
const editProduct = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.cookies.access_token_admin;
        const id = req.params.id;
        const product = yield productServ.editProduct(id, req.body, token);
        return res.status(200).json({ product });
    }
    catch (error) {
        next(error);
    }
});
exports.editProduct = editProduct;
const uploadProductImages = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.cookies.access_token_admin;
        const id = req.params.id;
        const product = yield productServ.uploadImages(id, req.files, token);
        return res.status(200).json({ product });
    }
    catch (error) {
        next(error);
    }
});
exports.uploadProductImages = uploadProductImages;
