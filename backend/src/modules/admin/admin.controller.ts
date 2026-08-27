import { injectable, inject } from "tsyringe";
import { Request, Response, NextFunction } from "express";
import { AdminService } from "./admin.service";
import { ADMIN_TOKENS } from "./admin.tokens";
import { ResponseUtils } from "@/shared/utils/response.utils";

@injectable()
export class AdminController {
  constructor(
    @inject(ADMIN_TOKENS.Service) private adminService: AdminService,
  ) {}

  login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email, password } = req.body;
      const result = await this.adminService.login(email, password);

      res.cookie("access_token_admin", result.access_token, {
        httpOnly: true,
        sameSite: "lax",
        maxAge: 15 * 60 * 1000,
      });
      res.cookie("refresh_token_admin", result.refresh_token, {
        httpOnly: true,
        sameSite: "lax",
        maxAge: 24 * 60 * 60 * 1000,
      });

      res.json(ResponseUtils.success({ admin: result.admin }));
    } catch (error) {
      next(error);
    }
  };

  logout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.adminService.logout(req.user!.id);
      res.clearCookie("access_token_admin");
      res.clearCookie("refresh_token_admin");
      res.json(ResponseUtils.success({ isLogout: true }));
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

  refreshToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.adminService.refreshToken(req.user!.id);

      res.cookie("access_token_admin", result.access_token, {
        httpOnly: true,
        sameSite: "lax",
        maxAge: 15 * 60 * 1000,
      });
      res.cookie("refresh_token_admin", result.refresh_token, {
        httpOnly: true,
        sameSite: "lax",
        maxAge: 24 * 60 * 60 * 1000,
      });

      res.json(ResponseUtils.success({ admin: result.admin }));
    } catch (error) {
      next(error);
    }
  };
}
