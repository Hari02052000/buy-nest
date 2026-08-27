import { injectable, inject } from "tsyringe";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AuthService } from "./auth.service";
import { AUTH_TOKENS } from "./auth.tokens";
import { ResponseUtils } from "@/shared/utils/response.utils";
import { ValidationError } from "@/shared/errors";
import { env } from "@/shared/config/environment";

const COOKIE_MAX_AGE = 7 * 24 * 60 * 60 * 1000;

@injectable()
export class AuthController {
  constructor(
    @inject(AUTH_TOKENS.Service) private authService: AuthService,
  ) {}

  userRegister = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email, password } = req.body;
      const result = await this.authService.register(email, password);

      this.setUserCookies(res, result.access_token, result.refresh_token);
      this.clearAdminCookies(res);

      res.status(201).json(ResponseUtils.success({ user: result.user }, "Registration successful"));
    } catch (error) {
      next(error);
    }
  };

  userLogin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email, password } = req.body;
      const result = await this.authService.login(email, password);

      this.setUserCookies(res, result.access_token, result.refresh_token);
      this.clearAdminCookies(res);

      res.status(200).json(ResponseUtils.success({ user: result.user }, "Login successful"));
    } catch (error) {
      next(error);
    }
  };

  userRefreshToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const refreshToken = req.cookies.refresh_token;
      if (!refreshToken) throw new ValidationError("Refresh token required");

      const payload = jwt.verify(refreshToken, env.APP_SECRET) as { id: string; type?: string };
      if (payload.type !== "refresh") throw new ValidationError("Invalid token type");

      const result = await this.authService.refreshToken(payload.id);

      this.setUserCookies(res, result.access_token, result.refresh_token);
      this.clearAdminCookies(res);

      res.status(200).json(ResponseUtils.success({ user: result.user }));
    } catch (error) {
      next(error);
    }
  };

  adminLogin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email, password } = req.body;
      const result = await this.authService.adminLogin(email, password);

      this.setAdminCookies(res, result.access_token, result.refresh_token);
      this.clearUserCookies(res);

      res.status(200).json(ResponseUtils.success({ admin: result.admin }, "Admin login successful"));
    } catch (error) {
      next(error);
    }
  };

  adminRefreshToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const refreshToken = req.cookies.refresh_token_admin;
      if (!refreshToken) throw new ValidationError("Admin refresh token required");

      const payload = jwt.verify(refreshToken, env.APP_SECRET) as { id: string; type?: string };
      if (payload.type !== "refresh") throw new ValidationError("Invalid token type");

      const result = await this.authService.adminRefreshToken(payload.id);

      this.setAdminCookies(res, result.access_token, result.refresh_token);
      this.clearUserCookies(res);

      res.status(200).json(ResponseUtils.success({ admin: result.admin }));
    } catch (error) {
      next(error);
    }
  };

  googleLoginSuccess = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const passportUser = req.user as any;
      if (!passportUser?.id) throw new ValidationError("Google login failed");

      const result = await this.authService.googleSuccess(passportUser.id);

      this.setUserCookies(res, result.access_token, result.refresh_token);
      this.clearAdminCookies(res);

      res.redirect(env.frontend_url_home);
    } catch (error) {
      next(error);
    }
  };

  logoutUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user?.id;
      if (!userId) throw new ValidationError("User not authenticated");

      await this.authService.logoutUser(userId);
      this.clearUserCookies(res);

      res.status(200).json(ResponseUtils.success({ isLogout: true }, "Logout successful"));
    } catch (error) {
      next(error);
    }
  };

  logoutAdmin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user?.id;
      if (!userId) throw new ValidationError("Admin not authenticated");

      await this.authService.logoutAdmin(userId);
      this.clearAdminCookies(res);

      res.status(200).json(ResponseUtils.success({ isLogout: true }, "Admin logout successful"));
    } catch (error) {
      next(error);
    }
  };

  private setUserCookies(res: Response, accessToken: string, refreshToken: string): void {
    res.cookie("access_token", accessToken, { httpOnly: true, maxAge: COOKIE_MAX_AGE });
    res.cookie("refresh_token", refreshToken, { httpOnly: true, maxAge: COOKIE_MAX_AGE });
  }

  private setAdminCookies(res: Response, accessToken: string, refreshToken: string): void {
    res.cookie("access_token_admin", accessToken, { httpOnly: true, maxAge: COOKIE_MAX_AGE });
    res.cookie("refresh_token_admin", refreshToken, { httpOnly: true, maxAge: COOKIE_MAX_AGE });
  }

  private clearUserCookies(res: Response): void {
    res.cookie("access_token", "", { httpOnly: true, expires: new Date(0) });
    res.cookie("refresh_token", "", { httpOnly: true, expires: new Date(0) });
  }

  private clearAdminCookies(res: Response): void {
    res.cookie("access_token_admin", "", { httpOnly: true, expires: new Date(0) });
    res.cookie("refresh_token_admin", "", { httpOnly: true, expires: new Date(0) });
  }
}
