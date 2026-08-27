import { Router } from "express";
import passport from "./passport.config";
import { container } from "tsyringe";
import { AUTH_TOKENS } from "./auth.tokens";
import { AuthController } from "./auth.controller";
import { authenticateUser, authenticateAdmin } from "@/shared/middleware/auth.middleware";

const router = Router();
const controller = container.resolve<AuthController>(AUTH_TOKENS.Controller);

router.post("/register", controller.userRegister);
router.post("/login", controller.userLogin);
router.post("/refresh-token", controller.userRefreshToken);

router.get("/google-login", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false, failureRedirect: "/login" }),
  controller.googleLoginSuccess,
);

router.post("/admin/login", controller.adminLogin);
router.post("/admin/refresh-token", controller.adminRefreshToken);

router.post("/logout", authenticateUser, controller.logoutUser);
router.post("/admin/logout", authenticateAdmin, controller.logoutAdmin);

export default router;
