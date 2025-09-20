"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.multerUpload = void 0;
const multer_1 = __importDefault(require("multer"));
const entities_1 = require("../../domain/entities");
exports.multerUpload = (0, multer_1.default)({
    fileFilter(req, file, callback) {
        if (file.mimetype.startsWith("image"))
            callback(null, true);
        else
            callback(new entities_1.ValidationError("only images can upload"));
    },
    limits: {
        fileSize: 5 * 1024 * 1024, // 5 MB limit per file
    },
    storage: multer_1.default.memoryStorage(),
});
