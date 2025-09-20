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
exports.CartController = void 0;
const services_1 = require("../../../application/services");
const repository_1 = require("../../../infrastructure/repository");
const coupon_repository_1 = require("../../../infrastructure/repository/coupon.repository");
const coupon_service_1 = require("../../../application/services/coupon/coupon.service");
const utils_1 = require("../../../infrastructure/utils");
class CartController {
    constructor() {
        const cartRepository = new repository_1.CartRepository();
        const productRepo = new repository_1.productRepository();
        const couponRepository = new coupon_repository_1.CouponRepository();
        const couponService = new coupon_service_1.CouponService(couponRepository);
        this.cartService = new services_1.CartService(cartRepository, productRepo, utils_1.tokenUtils);
    }
    addToCart(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { productId, quantity } = req.body;
                const user = req.user;
                const userId = user === null || user === void 0 ? void 0 : user.id;
                if (!userId) {
                    return res.status(401).json({ message: "User not authenticated" });
                }
                if (!productId || !quantity || quantity <= 0) {
                    return res.status(400).json({ message: "Invalid product ID or quantity" });
                }
                const cart = yield this.cartService.addToCart(userId, productId, quantity);
                res.status(200).json(cart);
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    message: error.message || "Failed to add item to cart",
                });
            }
        });
    }
    getCart(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = req.user;
                const userId = user === null || user === void 0 ? void 0 : user.id;
                if (!userId) {
                    return res.status(401).json({ message: "User not authenticated" });
                }
                const cart = yield this.cartService.getCart(userId);
                res.status(200).json(cart);
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    message: error.message || "Failed to get cart",
                });
            }
        });
    }
    updateCartItem(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { productId, quantity } = req.body;
                const user = req.user;
                const userId = user === null || user === void 0 ? void 0 : user.id;
                if (!userId) {
                    return res.status(401).json({ message: "User not authenticated" });
                }
                if (!productId || quantity === undefined || quantity < 0) {
                    return res.status(400).json({ message: "Invalid product ID or quantity" });
                }
                const cart = yield this.cartService.updateCartItem(userId, productId, quantity);
                res.status(200).json(cart);
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    message: error.message || "Failed to update cart item",
                });
            }
        });
    }
    removeFromCart(req, res) {
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
                const cart = yield this.cartService.removeFromCart(userId, productId);
                res.status(200).json(cart);
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    message: error.message || "Failed to remove item from cart",
                });
            }
        });
    }
    clearCart(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = req.user;
                const userId = user === null || user === void 0 ? void 0 : user.id;
                if (!userId) {
                    return res.status(401).json({ message: "User not authenticated" });
                }
                const cart = yield this.cartService.clearCart(userId);
                res.status(200).json(cart);
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    message: error.message || "Failed to clear cart",
                });
            }
        });
    }
    applyCoupon(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                //   const { couponCode } = req.body;
                //   const user = req.user as any;
                //   const userId = user?.id;
                //   if (!userId) {
                //     return res.status(401).json({ message: "User not authenticated" });
                //   }
                //   if (!couponCode) {
                //     return res.status(400).json({ message: "Coupon code is required" });
                //   }
                //   const cart = await this.cartService.applyCoupon(userId, couponCode);
                //   res.status(200).json({
                //     success: true,
                //     message: "Coupon applied successfully",
                //     data: cart.sanitizeCart(),
                //   });
            }
            catch (error) {
                //   res.status(400).json({
                //     success: false,
                //     message: error.message || "Failed to apply coupon",
                //   });
            }
        });
    }
    removeCoupon(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // const user = req.user as any;
                // const userId = user?.id;
                // if (!userId) {
                //   return res.status(401).json({ message: "User not authenticated" });
                // }
                // const cart = await this.cartService.removeCoupon(userId);
                // res.status(200).json({
                //   success: true,
                //   message: "Coupon removed successfully",
                //   data: cart.sanitizeCart(),
                // });
            }
            catch (error) {
                //   res.status(500).json({
                //     success: false,
                //     message: error.message || "Failed to remove coupon",
                //   });
            }
        });
    }
}
exports.CartController = CartController;
