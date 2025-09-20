"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.env = {
    DB_URL: process.env.DB_URL,
    PORT: process.env.PORT,
    APP_SCERET: process.env.APP_SCERET,
    cloud_name: process.env.cloudinary_cloud_name,
    api_key: process.env.cloudinary_api_key,
    api_secret: process.env.cloudinary_api_secret,
    google_client_id: process.env.google_client_id,
    google_client_secret: process.env.google_client_secret,
    google_callback_url: process.env.google_callback_url,
    stripe_publish_key: process.env.STRIPE_PUBLISHABLE_KEY,
    stripe_secret_key: process.env.STRIPE_SECRET_KEY,
};
