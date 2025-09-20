"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Product = void 0;
class Product {
    constructor(id = "", name, images, description, price, category, brand, model, stock) {
        this.isListed = true;
        this._modifiedFields = {};
        this.id = id;
        this.name = name;
        this.images = images;
        this.description = description;
        this.price = price;
        this.category = category;
        this.brandName = brand;
        this.modelName = model;
        this.stock = stock;
        this.createdAt = new Date().toISOString();
        this.updatedAt = new Date().toISOString();
    }
    setName(name) {
        this.name = name;
        this.updatedAt = new Date().toISOString();
        this._modifiedFields.name = true;
        this._modifiedFields.updatedAt = true;
    }
    setImages(images) {
        this.images = images;
        this.updatedAt = new Date().toISOString();
        this._modifiedFields.images = true;
        this._modifiedFields.updatedAt = true;
    }
    setDescription(description) {
        this.description = description;
        this.updatedAt = new Date().toISOString();
        this._modifiedFields.description = true;
        this._modifiedFields.updatedAt = true;
    }
    setPrice(price) {
        this.price = price;
        this.updatedAt = new Date().toISOString();
        this._modifiedFields.price = true;
        this._modifiedFields.updatedAt = true;
    }
    setCategory(category) {
        this.category = category;
        this.updatedAt = new Date().toISOString();
        this._modifiedFields.category = true;
        this._modifiedFields.updatedAt = true;
    }
    setBrand(brand) {
        this.brandName = brand;
        this.updatedAt = new Date().toISOString();
        this._modifiedFields.brandName = true;
    }
    setModel(model) {
        this.modelName = model;
        this.updatedAt = new Date().toISOString();
        this._modifiedFields.modelName = true;
        this._modifiedFields.updatedAt = true;
    }
    setIsListed(isListed) {
        this.isListed = isListed;
        this.updatedAt = new Date().toISOString();
        this._modifiedFields.isListed = true;
        this._modifiedFields.updatedAt = true;
    }
    setStock(stock) {
        this.stock = stock;
        this.updatedAt = new Date().toISOString();
        this._modifiedFields.stock = true;
        this._modifiedFields.updatedAt = true;
    }
    sanitizeProduct() {
        const product = {};
        product.id = this.id;
        product.images = this.images;
        product.description = this.description;
        product.isListed = this.isListed;
        product.price = this.price;
        product.brandName = this.brandName;
        product.modelName = this.modelName;
        product.stock = this.stock;
        product.name = this.name;
        product.createdAt = this.createdAt;
        product.updatedAt = this.updatedAt;
        if (typeof this.category === "object") {
            product.category = {};
            product.category.ancestors = this.category.ancestors;
            product.category.id = this.category.id;
            product.category.level = this.category.level;
            product.category.name = this.category.name;
            product.category.parentId = this.category.parentId;
        }
        else {
            product.category = this.category;
        }
        return product;
    }
    get modifiedFields() {
        return this._modifiedFields;
    }
    get clearModifiedFields() {
        this._modifiedFields = {};
        return this._modifiedFields;
    }
}
exports.Product = Product;
