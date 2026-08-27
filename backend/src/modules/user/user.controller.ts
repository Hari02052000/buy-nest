import { injectable, inject } from "tsyringe";
import { Request, Response, NextFunction } from "express";
import { UserService } from "./user.service";
import { USER_TOKENS } from "./user.tokens";
import { ResponseUtils } from "@/shared/utils/response.utils";

@injectable()
export class UserController {
  constructor(
    @inject(USER_TOKENS.Service) private userService: UserService,
  ) {}

  getUserProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = await this.userService.getUser(req.user!.id);
      res.json(ResponseUtils.success({ user: user.sanitize() }));
    } catch (error) {
      next(error);
    }
  };

  updateUserProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { userName } = req.body;
      const user = await this.userService.updateProfile(req.user!.id, { userName });
      res.json(ResponseUtils.success({ user: user.sanitize() }, "Profile updated"));
    } catch (error) {
      next(error);
    }
  };

  logout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.userService.logout(req.user!.id);
      res.clearCookie("access_token");
      res.clearCookie("refresh_token");
      res.json(ResponseUtils.success({ isLogout: true }));
    } catch (error) {
      next(error);
    }
  };
}
