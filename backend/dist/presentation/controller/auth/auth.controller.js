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
exports.LogOutUser = exports.googleLoginSucessController = exports.adminRefreshToken = exports.adminLogin = exports.userRefreshToken = exports.userRegister = exports.userLogin = void 0;
const services_1 = require("../../../application/services");
const repository_1 = require("../../../infrastructure/repository");
const utils_1 = require("../../../infrastructure/utils");
const token_utils_1 = require("../../../infrastructure/utils/token.utils");
const admin_repository_1 = require("../../../infrastructure/repository/admin.repository");
const admin_service_1 = require("../../../application/services/admin/admin.service");
const entities_1 = require("../../../domain/entities");
const userRepo = new repository_1.userRepository();
const userServ = new services_1.userService(userRepo, utils_1.authUtills, token_utils_1.tokenUtils);
const adminRepo = new admin_repository_1.adminRepository();
const adminServ = new admin_service_1.adminService(adminRepo, token_utils_1.tokenUtils, utils_1.authUtills);
const userLogin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield userServ.loginUser(req.body);
        const { access_token, refresh_token, user } = result;
        res.cookie("access_token", access_token, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        res.cookie("refresh_token", refresh_token, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        res.cookie("access_token_admin", "", {
            httpOnly: true,
            expires: new Date(0),
        });
        res.cookie("refresh_token_admin", "", {
            httpOnly: true,
            expires: new Date(0),
        });
        return res.status(200).json({ user });
    }
    catch (error) {
        next(error);
    }
});
exports.userLogin = userLogin;
const userRegister = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield userServ.registerUser(req.body);
        const { access_token, refresh_token, user } = result;
        res.cookie("access_token", access_token, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        res.cookie("refresh_token", refresh_token, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        res.cookie("access_token_admin", "", {
            httpOnly: true,
            expires: new Date(0),
        });
        res.cookie("refresh_token_admin", "", {
            httpOnly: true,
            expires: new Date(0),
        });
        return res.status(201).json({ user });
    }
    catch (error) {
        next(error);
    }
});
exports.userRegister = userRegister;
const userRefreshToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.cookies.refresh_token; // Expects from cookies
        const result = yield userServ.refreshToken(token);
        const { access_token, refresh_token, user } = result;
        res.cookie("access_token", access_token, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        res.cookie("refresh_token", refresh_token, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        res.cookie("access_token_admin", "", {
            httpOnly: true,
            expires: new Date(0),
        });
        res.cookie("refresh_token_admin", "", {
            httpOnly: true,
            expires: new Date(0),
        });
        return res.status(200).json({ user });
    }
    catch (error) {
        next(error);
    }
});
exports.userRefreshToken = userRefreshToken;
const adminLogin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield adminServ.loginAdmin(req.body);
        const { access_token, refresh_token, admin } = result;
        res.cookie("access_token_admin", access_token, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        res.cookie("refresh_token_admin", refresh_token, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        res.cookie("access_token", "", {
            httpOnly: true,
            expires: new Date(0),
        });
        res.cookie("refresh_token", "", {
            httpOnly: true,
            expires: new Date(0),
        });
        return res.status(200).json({ admin });
    }
    catch (error) {
        next(error);
    }
});
exports.adminLogin = adminLogin;
const adminRefreshToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.cookies.refresh_token_admin;
        const result = yield adminServ.adminRefreshToken(token);
        const { access_token, refresh_token, admin } = result;
        res.cookie("access_token_admin", access_token, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        res.cookie("refresh_token_admin", refresh_token, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        res.cookie("access_token", "", {
            httpOnly: true,
            expires: new Date(0),
        });
        res.cookie("refresh_token", "", {
            httpOnly: true,
            expires: new Date(0),
        });
        return res.status(200).json({ admin });
    }
    catch (error) {
        res.cookie("access_token_admin", "", {
            httpOnly: true,
            expires: new Date(0),
        });
        res.cookie("refresh_token_admin", "", {
            httpOnly: true,
            expires: new Date(0),
        });
        next(error);
    }
});
exports.adminRefreshToken = adminRefreshToken;
const googleLoginSucessController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const passportUser = req.user;
        if (!passportUser)
            throw new entities_1.ValidationError("failed to login");
        const result = yield userServ.googleSucessess(passportUser);
        const { access_token, refresh_token, user } = result;
        res.cookie("access_token", access_token, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        res.cookie("refresh_token", refresh_token, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        res.cookie("access_token_admin", "", {
            httpOnly: true,
            expires: new Date(0),
        });
        res.cookie("refresh_token_admin", "", {
            httpOnly: true,
            expires: new Date(0),
        });
        return res.redirect("http://localhost:5173/");
    }
    catch (error) {
        next(error);
    }
});
exports.googleLoginSucessController = googleLoginSucessController;
const LogOutUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.cookies.access_token;
        const isLogout = yield userServ.LogoutUser(token);
        res.cookie("access_token", "", {
            httpOnly: true,
            expires: new Date(0),
        });
        res.cookie("refresh_token", "", {
            httpOnly: true,
            expires: new Date(0),
        });
        return res.status(200).json({ isLogout });
    }
    catch (error) {
        next(error);
    }
});
exports.LogOutUser = LogOutUser;
