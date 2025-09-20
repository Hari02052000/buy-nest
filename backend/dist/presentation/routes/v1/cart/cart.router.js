"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const cart_controller_1 = require("../../../../presentation/controller/cart/cart.controller");
const auth_middleware_1 = require("../../../../presentation/middleware/auth.middleware");
const router = (0, express_1.Router)();
const cartController = new cart_controller_1.CartController();
// Apply authentication middleware to all cart routes
router.use(auth_middleware_1.authenticateUser);
// Add item to cart
router.post("/add", cartController.addToCart.bind(cartController));
// Get user's cart
router.get("/", cartController.getCart.bind(cartController));
// Update cart item quantity
router.put("/update", cartController.updateCartItem.bind(cartController));
// Remove item from cart
router.delete("/remove/:productId", cartController.removeFromCart.bind(cartController));
// Clear entire cart
router.delete("/clear", cartController.clearCart.bind(cartController));
// Apply coupon to cart
router.post("/coupon/apply", cartController.applyCoupon.bind(cartController));
// Remove coupon from cart
router.delete("/coupon/remove", cartController.removeCoupon.bind(cartController));
exports.default = router;
