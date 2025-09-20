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
exports.adminLogout = exports.getCurentAdmin = void 0;
const utils_1 = require("../../../infrastructure/utils");
const token_utils_1 = require("../../../infrastructure/utils/token.utils");
const admin_repository_1 = require("../../../infrastructure/repository/admin.repository");
const admin_service_1 = require("../../../application/services/admin/admin.service");
const adminRepo = new admin_repository_1.adminRepository();
const adminServ = new admin_service_1.adminService(adminRepo, token_utils_1.tokenUtils, utils_1.authUtills);
const getCurentAdmin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.cookies.access_token_admin;
        const admin = yield adminServ.getcurentAdmin(token);
        return res.status(200).json({ admin });
    }
    catch (error) {
        next(error);
    }
});
exports.getCurentAdmin = getCurentAdmin;
const adminLogout = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.cookies.access_token_admin;
        const admin = yield adminServ.logOutAdmin(token);
        res.cookie("access_token_admin", "", {
            httpOnly: true,
            expires: new Date(0),
        });
        res.cookie("refresh_token_admin", "", {
            httpOnly: true,
            expires: new Date(0),
        });
        return res.status(200).json({ admin });
    }
    catch (error) {
        next(error);
    }
});
exports.adminLogout = adminLogout;
