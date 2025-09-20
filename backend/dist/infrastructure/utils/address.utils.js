"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addressUtils = void 0;
const validator_1 = require("./validator");
const entities_1 = require("../../domain/entities");
const validateCreateAddressRequest = (reqBody) => {
    const { error } = validator_1.createAddressValidator.validate(reqBody);
    if (error)
        throw new entities_1.ValidationError(error.details[0].message);
    else
        return {
            fullName: reqBody.fullName,
            addressLine1: reqBody.addressLine1,
            city: reqBody.city,
            state: reqBody.state,
            zipCode: reqBody.zipCode,
            country: reqBody.country,
            phone: reqBody.phone,
        };
};
exports.addressUtils = {
    validateCreateAddressRequest,
};
