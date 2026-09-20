import { Router } from "express";
import passport from "./passport.config";
import { container } from "tsyringe";
import { AUTH_TOKENS } from "./auth.tokens";
import { AuthController } from "./auth.controller";
import { authenticateUser, authenticateAdmin } from "@/shared/middleware/auth.middleware";
import { authLimiter } from "@/shared/middleware/rate-limiter";

const router = Router();
const controller = container.resolve<AuthController>(AUTH_TOKENS.Controller);

router.post("/login", authLimiter, controller.userLogin);
router.post("/admin/login", authLimiter, controller.adminLogin);

router.get("/google-login", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false, failureRedirect: "/login" }),
  controller.googleLoginSuccess,
);

router.get("/me", authenticateUser, controller.userMe);
router.get("/admin/me", authenticateAdmin, controller.adminMe);

router.post("/logout", authenticateUser, controller.userLogout);
router.post("/admin/logout", authenticateAdmin, controller.adminLogout);

export default router;
