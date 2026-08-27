import { Router } from "express";
import { container } from "tsyringe";
import { CART_TOKENS } from "./cart.tokens";
import { CartController } from "./cart.controller";
import { authenticateUser } from "@/shared/middleware/auth.middleware";

const router = Router();
const controller = container.resolve<CartController>(CART_TOKENS.Controller);

router.post("/add", authenticateUser, controller.addToCart);
router.get("/", authenticateUser, controller.getCart);
router.put("/update", authenticateUser, controller.updateCartItem);
router.delete("/remove/:productId", authenticateUser, controller.removeFromCart);
router.delete("/clear", authenticateUser, controller.clearCart);

export default router;
