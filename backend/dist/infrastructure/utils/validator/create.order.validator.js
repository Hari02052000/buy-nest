"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOrderSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.createOrderSchema = joi_1.default.object({
    addressId: joi_1.default.string().required(),
    paymentMethod: joi_1.default.string().valid("cod", "online").required(),
    coupon: joi_1.default.object({
        isApplied: joi_1.default.boolean().required(),
        couponId: joi_1.default.when("isApplied", {
            is: true,
            then: joi_1.default.string().required().disallow(""),
            otherwise: joi_1.default.string().allow("", null),
        }),
        discount: joi_1.default.when("isApplied", {
            is: true,
            then: joi_1.default.string().required().disallow(""),
            otherwise: joi_1.default.string().allow("", null),
        }),
    }).required(),
});
