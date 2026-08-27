import { Router } from "express";
import { container } from "tsyringe";
import { UserController } from "./user.controller";
import { USER_TOKENS } from "./user.tokens";
import { authenticateUser } from "@/shared/middleware/auth.middleware";

const router = Router();
const controller = container.resolve<UserController>(USER_TOKENS.Controller);

router.get("/", authenticateUser, controller.getUserProfile);
router.put("/", authenticateUser, controller.updateUserProfile);
router.post("/logout", authenticateUser, controller.logout);

export default router;
