"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProductValidator = void 0;
const joi_1 = __importDefault(require("joi"));
exports.createProductValidator = joi_1.default.object({
    name: joi_1.default.string().required(),
    description: joi_1.default.string().required(),
    price: joi_1.default.string().required(),
    category: joi_1.default.string().required(),
    brand: joi_1.default.string().required(),
    model: joi_1.default.string().required(),
    stock: joi_1.default.number().required(),
});
