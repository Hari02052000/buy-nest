"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productUtills = void 0;
const validator_1 = require("./validator");
const entities_1 = require("../../domain/entities");
const validateCreateProductRequest = (reqBody) => {
    const { error } = validator_1.createProductValidator.validate(reqBody);
    if (error)
        throw new entities_1.ValidationError(error.details[0].message);
    else
        return {
            name: reqBody.name,
            brand: reqBody.brand,
            category: reqBody.category,
            description: reqBody.description,
            model: reqBody.model,
            price: reqBody.price,
            stock: reqBody.stock,
        };
};
const validateEditCategoryRequest = (reqBody) => {
    const { error } = validator_1.editProductValidator.validate(reqBody);
    if (error)
        throw new entities_1.ValidationError(error.details[0].message);
    else
        return {
            name: reqBody.name,
            brand: reqBody.brand,
            description: reqBody.description,
            model: reqBody.model,
            price: reqBody.price,
            stock: reqBody.stock,
        };
};
exports.productUtills = {
    validateCreateProductRequest,
    validateEditCategoryRequest,
};
