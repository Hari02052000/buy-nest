"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
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
    },
    isEmailVerified: {
        type: Boolean,
        default: false,
    },
    profile: String,
    salt: String,
    refresh_token: String,
    isGoogleProvided: {
        type: Boolean,
        default: false,
    },
    googleId: String,
    otp: Number,
    otpExp: String,
}, {
    timestamps: true,
});
const UserModel = (0, mongoose_1.model)("User", userSchema);
exports.default = UserModel;
