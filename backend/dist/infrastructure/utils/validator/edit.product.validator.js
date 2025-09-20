"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.editProductValidator = void 0;
const joi_1 = __importDefault(require("joi"));
exports.editProductValidator = joi_1.default.object({
    name: joi_1.default.string(),
    description: joi_1.default.string(),
    price: joi_1.default.string(),
    brand: joi_1.default.string(),
    model: joi_1.default.string(),
    stock: joi_1.default.number(),
});
