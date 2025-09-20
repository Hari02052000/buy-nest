import { Router } from "express";
import { CartController } from "@/presentation/controller/cart/cart.controller";
import { authenticateUser } from "@/presentation/middleware/auth.middleware";

const router = Router();
const cartController = new CartController();

// Apply authentication middleware to all cart routes
router.use(authenticateUser);

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

export default router;
