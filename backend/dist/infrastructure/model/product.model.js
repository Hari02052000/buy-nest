"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const productSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    images: [
        {
            url: {
                type: String,
                required: true,
            },
            id: {
                type: String,
                required: true,
            },
        },
    ],
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    category: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Category",
    },
    brandName: {
        type: String,
        required: true,
    },
    isListed: {
        type: Boolean,
        default: true,
    },
    stock: {
        type: Number,
        required: true,
    },
    modelName: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
});
const ProductModel = (0, mongoose_1.model)("Product", productSchema);
exports.default = ProductModel;
