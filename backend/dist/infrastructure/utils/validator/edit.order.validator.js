"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.editOrderRequestSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.editOrderRequestSchema = joi_1.default.object({
    orderStatus: joi_1.default.string().valid("pending", "confirmed", "processing", "shipped", "delivered", "cancelled"),
    paymentStatus: joi_1.default.string().valid("pending", "processing", "completed", "failed", "refunded"),
    transactionId: joi_1.default.string(),
    paymentIntentId: joi_1.default.string(),
});
