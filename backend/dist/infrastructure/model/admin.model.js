"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const adminSchema = new mongoose_1.Schema({
    userName: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate: {
            validator: (v) => /^\S+@\S+\.\S+$/.test(v),
            message: "Invalid email address",
        },
    },
    password: {
        type: String,
        minlength: 6,
        required: true,
    },
    profile: String,
    salt: {
        type: String,
        unique: true,
        required: true,
    },
    refresh_token: {
        type: String,
        unique: true,
    },
}, {
    timestamps: true,
});
const AdminModel = (0, mongoose_1.model)("Admin", adminSchema);
exports.default = AdminModel;
