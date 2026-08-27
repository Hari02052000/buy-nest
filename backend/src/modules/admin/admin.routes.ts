import { Router } from "express";
import { container } from "tsyringe";
import { ADMIN_TOKENS } from "./admin.tokens";
import { AdminController } from "./admin.controller";
import { authenticateAdmin } from "@/shared/middleware/auth.middleware";

const router = Router();
const controller = container.resolve<AdminController>(ADMIN_TOKENS.Controller);

router.post("/login", controller.login);
router.post("/logout", authenticateAdmin, controller.logout);
router.get("/me", authenticateAdmin, controller.getCurrentAdmin);
router.post("/refresh-token", authenticateAdmin, controller.refreshToken);

export default router;
