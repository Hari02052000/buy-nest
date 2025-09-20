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
exports.productService = void 0;
const entities_1 = require("../../../domain/entities");
class productService {
    constructor(productRepo, productUtils, tokenUtils, cloudUtils) {
        this.productRepo = productRepo;
        this.productUtils = productUtils;
        this.tokenUtils = tokenUtils;
        this.cloudUtils = cloudUtils;
    }
    createProduct(files, reqBody, adminToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const isAdmin = this.tokenUtils.isValidAdminToken(adminToken);
            if (!isAdmin)
                throw new entities_1.AuthorizeError();
            if (!files || files.length === 0)
                throw new entities_1.ValidationError("images is empty");
            const productProperties = this.productUtils.validateCreateProductRequest(reqBody);
            const existingProduct = yield this.productRepo.getUniqueProduct(productProperties.name, productProperties.brand, productProperties.model);
            if (existingProduct)
                throw new entities_1.ValidationError("product with same name,brand,model is exist");
            const images = yield this.cloudUtils.uploadMultiFiles(files);
            const product = new entities_1.Product("", productProperties.name, images, productProperties.description, parseFloat(productProperties.price), productProperties.category, productProperties.brand, productProperties.model, productProperties.stock);
            const savedProduct = yield this.productRepo.saveProduct(product);
            return savedProduct.sanitizeProduct();
        });
    }
    getProducts() {
        return __awaiter(this, arguments, void 0, function* (limit = 20, skip = 0, category, search, adminToken, brand, model, minPrice, maxPrice) {
            const allProducts = yield this.productRepo.getPopulatedProducts(limit, skip, category, search, brand, model, minPrice, maxPrice);
            let products;
            let totelPages;
            if (adminToken) {
                const isAdmin = this.tokenUtils.isValidAdminToken(adminToken);
                if (!isAdmin)
                    throw new entities_1.AuthorizeError();
                products = allProducts;
            }
            else {
                products = allProducts.filter((product) => product.isListed && typeof product.category === "object" && product.category.isListed);
            }
            return products.map((product) => product.sanitizeProduct());
        });
    }
    editProduct(id, reqBody, adminToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const isAdmin = this.tokenUtils.isValidAdminToken(adminToken);
            if (!isAdmin)
                throw new entities_1.AuthorizeError();
            const editCatProps = this.productUtils.validateEditCategoryRequest(reqBody);
            const product = yield this.productRepo.getSingleProduct(id);
            if (editCatProps.brand && editCatProps.brand !== product.brandName) {
                const existingProduct = yield this.productRepo.getUniqueProduct(product.name, editCatProps.brand, product.modelName);
                if (existingProduct)
                    throw new entities_1.ValidationError("product with same name,brand,model is exist");
                product.setBrand(editCatProps.brand);
            }
            if (editCatProps.description && editCatProps.description !== product.description) {
                product.setDescription(editCatProps.description);
            }
            if (editCatProps.model && editCatProps.model !== product.modelName) {
                const existingProduct = yield this.productRepo.getUniqueProduct(product.name, product.brandName, editCatProps.model);
                if (existingProduct)
                    throw new entities_1.ValidationError("product with same name,brand,model is exist");
                product.setModel(editCatProps.model);
            }
            if (editCatProps.name && editCatProps.name !== product.name) {
                const existingProduct = yield this.productRepo.getUniqueProduct(editCatProps.name, product.brandName, product.modelName);
                if (existingProduct)
                    throw new entities_1.ValidationError("product with same name,brand,model is exist");
                product.setName(editCatProps.name);
            }
            if (editCatProps.price && parseFloat(editCatProps.price) !== product.price) {
                product.setPrice(parseFloat(editCatProps.price));
            }
            if (editCatProps.stock && editCatProps.stock !== product.stock) {
                product.setStock(editCatProps.stock);
            }
            const updatedProduct = yield this.productRepo.editProduct(product);
            return updatedProduct.sanitizeProduct();
        });
    }
    uploadImages(id, files, adminToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const isAdmin = this.tokenUtils.isValidAdminToken(adminToken);
            if (!isAdmin)
                throw new entities_1.AuthorizeError();
            if (!files || files.length === 0)
                throw new entities_1.ValidationError("images is empty");
            const product = yield this.productRepo.getSingleProduct(id);
            const images = yield this.cloudUtils.uploadMultiFiles(files);
            const concatImages = [...product.images, ...images];
            product.setImages(concatImages);
            const updatedProduct = yield this.productRepo.editProduct(product);
            return updatedProduct.sanitizeProduct();
        });
    }
    deletemage(id, image, adminToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const isAdmin = this.tokenUtils.isValidAdminToken(adminToken);
            if (!isAdmin)
                throw new entities_1.AuthorizeError();
            if (!image || !image.id || !image.url)
                throw new entities_1.ValidationError("image not found");
            const product = yield this.productRepo.getSingleProduct(id);
            yield this.cloudUtils.deleteImage(image.id);
            const updatedImages = product.images.filter((productImage) => productImage.id !== image.id);
            product.setImages(updatedImages);
            const updatedProduct = yield this.productRepo.editProduct(product);
            return updatedProduct.sanitizeProduct();
        });
    }
    changeListStaus(id, isListed, adminToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const isAdmin = this.tokenUtils.isValidAdminToken(adminToken);
            if (!isAdmin)
                throw new entities_1.AuthorizeError();
            const product = yield this.productRepo.getSingleProduct(id);
            product.setIsListed(isListed);
            const updatedProduct = yield this.productRepo.editProduct(product);
            return updatedProduct.sanitizeProduct();
        });
    }
    searchProducts(filters) {
        return __awaiter(this, void 0, void 0, function* () {
            const { query, category, minPrice, maxPrice, brand, model, limit = 20, skip = 0 } = filters;
            const products = yield this.productRepo.searchProducts(query, category, minPrice, maxPrice, brand, model, limit, skip);
            const totalProducts = yield this.productRepo.countProducts(query, category, minPrice, maxPrice, brand, model);
            return {
                products: products.map((product) => product.sanitizeProduct()),
                total: totalProducts,
                pageSize: limit,
                skip,
            };
        });
    }
    getSingleProduct(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const product = yield this.productRepo.getSingleProduct(id);
            return product.sanitizeProduct();
        });
    }
}
exports.productService = productService;
