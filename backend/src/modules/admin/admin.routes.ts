import { Router } from "express";
import { container } from "tsyringe";
import { ADMIN_TOKENS } from "./admin.tokens";
import { AdminController } from "./admin.controller";
import { authenticateAdmin } from "@/shared/middleware/auth.middleware";

const router = Router();
const controller = container.resolve<AdminController>(ADMIN_TOKENS.Controller);

// Public routes
router.post("/login", controller.login);
router.post("/refresh-token", controller.refreshToken);

// Protected routes
router.post("/logout", authenticateAdmin, controller.logout);
router.get("/me", authenticateAdmin, controller.getCurrentAdmin);

export default router;
