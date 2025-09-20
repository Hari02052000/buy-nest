"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const orderItemSchema = new mongoose_1.Schema({
    productId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
    },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
}, { _id: false });
const paymentInfoSchema = new mongoose_1.Schema({
    method: {
        type: String,
        enum: ["cod", "online"],
        required: true,
    },
    paymentStatus: {
        type: String,
        enum: ["pending", "processing", "completed", "failed", "refunded"],
        default: "pending",
    },
    payableAmount: { type: Number, required: true },
    transactionId: { type: String },
    paymentIntentId: { type: String },
}, { _id: false });
const OrderSchema = new mongoose_1.Schema({
    items: {
        type: [orderItemSchema],
        required: true,
    },
    address: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Address",
        required: true,
    },
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    paymentInfo: {
        type: paymentInfoSchema,
        required: true,
    },
    orderStatus: {
        type: String,
        enum: ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"],
        default: "pending",
    },
    appliedCoupon: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Coupon",
        default: null,
    },
}, {
    timestamps: true,
});
const OrderModel = (0, mongoose_1.model)("Order", OrderSchema);
exports.default = OrderModel;
