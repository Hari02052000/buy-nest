"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const wishlist_controller_1 = require("../../../../presentation/controller/wishlist/wishlist.controller");
const auth_middleware_1 = require("../../../../presentation/middleware/auth.middleware");
const router = (0, express_1.Router)();
const wishlistController = new wishlist_controller_1.WishlistController();
// Apply authentication middleware to all wishlist routes
router.use(auth_middleware_1.authenticateUser);
// Add item to wishlist
router.post("/add", wishlistController.addToWishlist.bind(wishlistController));
// Get user's wishlist
router.get("/", wishlistController.getWishlist.bind(wishlistController));
// Remove item from wishlist
router.delete("/remove/:productId", wishlistController.removeFromWishlist.bind(wishlistController));
// Clear entire wishlist
router.delete("/clear", wishlistController.clearWishlist.bind(wishlistController));
exports.default = router;
