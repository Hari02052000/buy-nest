import { injectable, inject } from "tsyringe";
import { Request, Response, NextFunction } from "express";
import { AdminService } from "./admin.service";
import { ADMIN_TOKENS } from "./admin.tokens";
import { ResponseUtils } from "@/shared/utils/response.utils";
import { ValidationError } from "@/shared/errors";

@injectable()
export class AdminController {
  constructor(
    @inject(ADMIN_TOKENS.Service) private adminService: AdminService,
  ) {}

  login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email, password } = req.body;
      const result = await this.adminService.login(email, password);
      res.json(ResponseUtils.success({ admin: result.admin }, "Admin login successful"));
    } catch (error) {
      next(error);
    }
  };

  logout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.adminService.logout(req.user!.id);
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
}
