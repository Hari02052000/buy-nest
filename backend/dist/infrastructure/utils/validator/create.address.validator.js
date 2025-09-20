"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAddressValidator = void 0;
const joi_1 = __importDefault(require("joi"));
exports.createAddressValidator = joi_1.default.object({
    fullName: joi_1.default.string().required(),
    addressLine1: joi_1.default.string().required(),
    city: joi_1.default.string().required(),
    state: joi_1.default.string().required(),
    zipCode: joi_1.default.string().required(),
    country: joi_1.default.string().required(),
    phone: joi_1.default.string().required(),
    addressLine2: joi_1.default.string(),
});
