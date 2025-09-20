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
exports.authenticateAdmin = exports.authenticateUser = void 0;
const token_utils_1 = require("../../infrastructure/utils/token.utils");
const errors_1 = require("../../domain/entities/errors");
const authenticateUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        // Get token from Authorization header
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.startsWith("Bearer ") ? authHeader.substring(7) : req.cookies.access_token; // Fallback to cookie
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Access token is required",
            });
        }
        // Verify token
        const { payload, isVerified } = token_utils_1.tokenUtils.isValidUserToken(token);
        if (!isVerified || !payload.id) {
            return res.status(401).json({
                success: false,
                message: "Invalid or expired token",
            });
        }
        // Attach user info to request
        req.user = {
            id: payload.id,
            userName: payload.userName || "",
            email: payload.email || "",
            isEmailVerified: (_a = payload.isEmailVerified) !== null && _a !== void 0 ? _a : false,
            profile: payload.profile || "",
            createdAt: payload.createdAt || "",
            updatedAt: payload.updatedAt || "",
        };
        next();
    }
    catch (error) {
        if (error instanceof errors_1.AuthorizeError) {
            return res.status(401).json({
                success: false,
                message: error.message,
            });
        }
        return res.status(500).json({
            success: false,
            message: "Authentication failed",
        });
    }
});
exports.authenticateUser = authenticateUser;
const authenticateAdmin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.cookies.access_token_admin;
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Admin access token is required",
            });
        }
        const { payload, isVerified } = token_utils_1.tokenUtils.isValidAdminToken(token);
        if (!isVerified || !payload.id) {
            return res.status(401).json({
                success: false,
                message: "Invalid or expired admin token",
            });
        }
        // Attach admin info to request (you might want to extend Express.Request type for admin)
        req.user = {
            id: payload.id,
            userName: payload.userName || "",
            email: payload.email || "",
            isEmailVerified: true,
            profile: "",
            createdAt: payload.createdAt || "",
            updatedAt: payload.updatedAt || "",
        };
        next();
    }
    catch (error) {
        if (error instanceof errors_1.AuthorizeError) {
            return res.status(401).json({
                success: false,
                message: error.message,
            });
        }
        return res.status(500).json({
            success: false,
            message: "Admin authentication failed",
        });
    }
});
exports.authenticateAdmin = authenticateAdmin;
