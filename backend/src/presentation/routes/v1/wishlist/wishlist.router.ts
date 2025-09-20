import { Router } from "express";
import { WishlistController } from "@/presentation/controller/wishlist/wishlist.controller";
import { authenticateUser } from "@/presentation/middleware/auth.middleware";

const router = Router();
const wishlistController = new WishlistController();

// Apply authentication middleware to all wishlist routes
router.use(authenticateUser);

// Add item to wishlist
router.post("/add", wishlistController.addToWishlist.bind(wishlistController));

// Get user's wishlist
router.get("/", wishlistController.getWishlist.bind(wishlistController));

// Remove item from wishlist
router.delete("/remove/:productId", wishlistController.removeFromWishlist.bind(wishlistController));

// Clear entire wishlist
router.delete("/clear", wishlistController.clearWishlist.bind(wishlistController));

export default router;
