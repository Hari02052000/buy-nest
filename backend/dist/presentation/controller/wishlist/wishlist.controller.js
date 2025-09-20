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
exports.WishlistController = void 0;
const services_1 = require("../../../application/services");
const repository_1 = require("../../../infrastructure/repository");
const utils_1 = require("../../../infrastructure/utils");
class WishlistController {
    constructor() {
        const wishlistRepository = new repository_1.WishlistRepository();
        const productRepo = new repository_1.productRepository();
        this.wishlistService = new services_1.WishlistService(wishlistRepository, productRepo, utils_1.tokenUtils);
    }
    addToWishlist(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { productId } = req.body;
                const user = req.user;
                const userId = user === null || user === void 0 ? void 0 : user.id;
                if (!userId) {
                    return res.status(401).json({ message: "User not authenticated" });
                }
                if (!productId) {
                    return res.status(400).json({ message: "Product ID is required" });
                }
                const wishlist = yield this.wishlistService.addToWishlist(userId, productId);
                res.status(200).json(wishlist);
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    message: error.message || "Failed to add item to wishlist",
                });
            }
        });
    }
    getWishlist(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = req.user;
                const userId = user === null || user === void 0 ? void 0 : user.id;
                if (!userId) {
                    return res.status(401).json({ message: "User not authenticated" });
                }
                const wishlist = yield this.wishlistService.getWishlist(userId);
                res.status(200).json(wishlist);
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    message: error.message || "Failed to get wishlist",
                });
            }
        });
    }
    removeFromWishlist(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { productId } = req.params;
                const user = req.user;
                const userId = user === null || user === void 0 ? void 0 : user.id;
                if (!userId) {
                    return res.status(401).json({ message: "User not authenticated" });
                }
                if (!productId) {
                    return res.status(400).json({ message: "Product ID is required" });
                }
                const wishlist = yield this.wishlistService.removeFromWishlist(userId, productId);
                res.status(200).json(wishlist);
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    message: error.message || "Failed to remove item from wishlist",
                });
            }
        });
    }
    clearWishlist(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = req.user;
                const userId = user === null || user === void 0 ? void 0 : user.id;
                if (!userId) {
                    return res.status(401).json({ message: "User not authenticated" });
                }
                const wishlist = yield this.wishlistService.clearWishlist(userId);
                res.status(200).json(wishlist);
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    message: error.message || "Failed to clear wishlist",
                });
            }
        });
    }
}
exports.WishlistController = WishlistController;
