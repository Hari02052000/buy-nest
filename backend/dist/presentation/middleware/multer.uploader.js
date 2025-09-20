"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadProfile = exports.uploadProduct = exports.uploadCategory = void 0;
const entities_1 = require("../../domain/entities");
const multer_upload_1 = require("../../infrastructure/config/multer.upload");
const uploadCategory = (req, res, next) => {
    try {
        const result = multer_upload_1.multerUpload.single("image");
        result(req, res, (err) => {
            if (err)
                next(new entities_1.APIError(`image not uploaded ${err}`));
            else
                next();
        });
    }
    catch (error) {
        next(error);
    }
};
exports.uploadCategory = uploadCategory;
const uploadProduct = (req, res, next) => {
    const result = multer_upload_1.multerUpload.array("images", 10);
    result(req, res, (err) => {
        if (err)
            throw new entities_1.APIError(`image not uploaded ${err}`);
        else {
            next();
        }
    });
};
exports.uploadProduct = uploadProduct;
const uploadProfile = (req, res, next) => { };
exports.uploadProfile = uploadProfile;
