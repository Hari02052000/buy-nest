import { injectable, inject } from "tsyringe";
import { Request, Response, NextFunction } from "express";
import { AuthService } from "@/modules/auth/auth.service";
import { AUTH_TOKENS } from "@/modules/auth/auth.tokens";
import { AdminService } from "./admin.service";
import { ADMIN_TOKENS } from "./admin.tokens";
import { ResponseUtils } from "@/shared/utils/response.utils";
import { ValidationError } from "@/shared/errors";

const SESSION_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
};

@injectable()
export class AdminController {
  constructor(
    @inject(ADMIN_TOKENS.Service) private adminService: AdminService,
    @inject(AUTH_TOKENS.Service) private authService: AuthService,
  ) {}

  logout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const sessionId = req.cookies.session_id;
      if (sessionId) {
        await this.authService.logout(sessionId);
      }
      res.cookie("session_id", "", {
        ...SESSION_COOKIE_OPTIONS,
        expires: new Date(0),
      });
      res.json(ResponseUtils.success({ isLogout: true }, "Admin logout successful"));
    } catch (error) {
      next(error);
    }
  };

  getCurrentAdmin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const admin = await this.adminService.getCurrentAdmin(req.user!.id);
      res.json(ResponseUtils.success({ admin: admin.sanitize() }));
    } catch (error) {
      next(error);
    }
  };
}
