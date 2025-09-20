"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoryUtils = void 0;
const validator_1 = require("./validator");
const entities_1 = require("../../domain/entities");
const validateCreateCategoryRequest = (reqBody) => {
    const { error } = validator_1.createCategoryValidator.validate(reqBody);
    if (error)
        throw new entities_1.ValidationError(error.details[0].message);
    else
        return { name: reqBody.name, parentId: reqBody.parentId };
};
const validateEditCategoryRequest = (reqBody) => {
    const { error } = validator_1.editCategoryValidator.validate(reqBody);
    if (error)
        throw new entities_1.ValidationError(error.details[0].message);
    else
        return { name: reqBody.name };
};
exports.categoryUtils = {
    validateCreateCategoryRequest,
    validateEditCategoryRequest,
};
