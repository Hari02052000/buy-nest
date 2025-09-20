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
exports.getSubCategory = exports.uploadCategoryImage = exports.getCategoryById = exports.getCategory = exports.listCategory = exports.updateCategory = exports.createCategory = void 0;
const services_1 = require("../../../application/services");
const repository_1 = require("../../../infrastructure/repository");
const category_utils_1 = require("../../../infrastructure/utils/category.utils");
const cloud_utils_1 = require("../../../infrastructure/utils/cloud.utils");
const token_utils_1 = require("../../../infrastructure/utils/token.utils");
const categoryRepo = new repository_1.categoryRepository();
const categoryServ = new services_1.categoryService(categoryRepo, cloud_utils_1.cloudUtills, token_utils_1.tokenUtils, category_utils_1.categoryUtils);
const createCategory = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.cookies.access_token_admin;
        const category = yield categoryServ.createCategory(req.file, req.body, token);
        return res.status(201).json({ category });
    }
    catch (error) {
        next(error);
    }
});
exports.createCategory = createCategory;
const updateCategory = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.cookies.access_token_admin;
        const id = req.params.id;
        const category = yield categoryServ.editCategory(id, req.body, token);
        return res.status(200).json({ category });
    }
    catch (error) {
        next(error);
    }
});
exports.updateCategory = updateCategory;
const listCategory = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const token = req.cookies.access_token_admin;
        let isList;
        req.body.isList === "false" ? (isList = false) : (isList = true);
        const category = yield categoryServ.changeListStatus(id, isList, token);
        return res.status(200).json({ category });
    }
    catch (error) {
        next(error);
    }
});
exports.listCategory = listCategory;
const getCategory = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let limit;
        let page;
        req.query.limit ? (limit = parseInt(req.query.limit)) : (limit = 10);
        req.query.page ? (page = parseInt(req.query.page)) : (page = 1);
        const token = req.cookies.access_token_admin;
        const categories = yield categoryServ.getCategory(limit, page, token);
        return res.status(200).json({ categories });
    }
    catch (error) {
        next(error);
    }
});
exports.getCategory = getCategory;
const getCategoryById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const category = yield categoryServ.getSingleCategory(id);
        return res.status(200).json({ category });
    }
    catch (error) {
        next();
    }
});
exports.getCategoryById = getCategoryById;
const uploadCategoryImage = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const token = req.cookies.access_token_admin;
        const category = yield categoryServ.editCategoryImage(id, req.file, token);
        return res.status(200).json({ category });
    }
    catch (error) {
        next(error);
    }
});
exports.uploadCategoryImage = uploadCategoryImage;
const getSubCategory = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const categorys = yield categoryServ.getSubCategory(id);
        return res.status(200).json({ categorys });
    }
    catch (error) {
        next(error);
    }
});
exports.getSubCategory = getSubCategory;
