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
exports.removeProfileImage = exports.uploadProfileImage = exports.getUserProfile = exports.updateUserProfile = void 0;
const services_1 = require("../../../application/services");
const repository_1 = require("../../../infrastructure/repository");
const utils_1 = require("../../../infrastructure/utils");
const token_utils_1 = require("../../../infrastructure/utils/token.utils");
const userRepo = new repository_1.userRepository();
const userServ = new services_1.userService(userRepo, utils_1.authUtills, token_utils_1.tokenUtils);
const updateUserProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }
        const user = yield userRepo.getUserById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        // Update user fields
        const { userName } = req.body;
        if (userName) {
            user.setUserName(userName);
        }
        const updatedUser = yield userRepo.editUser(user);
        const sanitizedUser = updatedUser.sanitizeUser();
        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            data: { user: sanitizedUser },
        });
    }
    catch (error) {
        next(error);
    }
});
exports.updateUserProfile = updateUserProfile;
const getUserProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.cookies.access_token;
        const user = yield userServ.getCurentUser(token);
        return res.status(200).json({ user });
    }
    catch (error) {
        next(error);
    }
});
exports.getUserProfile = getUserProfile;
const uploadProfileImage = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }
        // Handle file upload logic here (using multer or similar)
        // For now, assuming the image URL is provided
        const imageUrl = req.body.imageUrl; // This would come from your file upload service
        const user = yield userRepo.getUserById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        user.setProfile(imageUrl);
        const updatedUser = yield userRepo.editUser(user);
        const sanitizedUser = updatedUser.sanitizeUser();
        return res.status(200).json({
            success: true,
            message: "Profile image updated successfully",
            data: {
                user: sanitizedUser,
                imageUrl,
            },
        });
    }
    catch (error) {
        next(error);
    }
});
exports.uploadProfileImage = uploadProfileImage;
const removeProfileImage = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }
        const user = yield userRepo.getUserById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        user.setProfile(""); // Remove profile image
        const updatedUser = yield userRepo.editUser(user);
        const sanitizedUser = updatedUser.sanitizeUser();
        return res.status(200).json({
            success: true,
            message: "Profile image removed successfully",
            user: sanitizedUser,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.removeProfileImage = removeProfileImage;
