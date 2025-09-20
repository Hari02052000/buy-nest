"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cloudUtills = void 0;
const entities_1 = require("../../domain/entities");
const cloudinary_1 = require("cloudinary");
const environment_1 = require("../../infrastructure/config/environment");
const cloudinary = cloudinary_1.v2;
cloudinary.config({
    cloud_name: environment_1.env.cloud_name,
    api_key: environment_1.env.api_key,
    api_secret: environment_1.env.api_secret,
});
const uploadMultiFiles = (imageFiles) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const images = [];
        yield Promise.all(imageFiles.map((image) => __awaiter(void 0, void 0, void 0, function* () {
            const base64String = image.buffer.toString("base64");
            const dataUri = `data:${image.mimetype};base64,${base64String}`;
            yield cloudinary.uploader.upload(dataUri, {
                resource_type: "auto",
                folder: "buy-nest/products",
            }, (err, url) => {
                if (url) {
                    images.push({ url: url.secure_url, id: url.public_id });
                }
                else
                    throw new entities_1.APIError("image upload failed");
            });
        })));
        return images;
    }
    catch (error) {
        console.log(error);
        throw new entities_1.APIError();
    }
});
const uploadSingleFile = (imageFile) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const base64String = imageFile.buffer.toString("base64");
        const dataUri = `data:${imageFile.mimetype};base64,${base64String}`;
        const url = yield cloudinary.uploader.upload(dataUri, {
            resource_type: "auto",
            folder: "buy-nest/category",
        });
        return {
            url: url.secure_url,
            id: url.public_id,
        };
    }
    catch (error) {
        console.log(error);
        throw new entities_1.APIError();
    }
});
const deleteImage = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield cloudinary.uploader.destroy(id);
        return true;
    }
    catch (error) {
        throw new entities_1.APIError();
    }
});
exports.cloudUtills = {
    uploadMultiFiles,
    uploadSingleFile,
    deleteImage,
};
