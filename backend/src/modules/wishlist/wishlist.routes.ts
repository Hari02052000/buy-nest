import { Router } from "express";
import { container } from "tsyringe";
import { WISHLIST_TOKENS } from "./wishlist.tokens";
import { WishlistController } from "./wishlist.controller";
import { authenticateUser } from "@/shared/middleware/auth.middleware";

const router = Router();
const controller = container.resolve<WishlistController>(WISHLIST_TOKENS.Controller);

router.get("/", authenticateUser, controller.getWishlist);
router.post("/:productId", authenticateUser, controller.addToWishlist);
router.delete("/:productId", authenticateUser, controller.removeFromWishlist);
router.delete("/", authenticateUser, controller.clearWishlist);

export default router;
