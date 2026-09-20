import { injectable, inject } from "tsyringe";
import { Request, Response, NextFunction } from "express";
import { AuthService } from "./auth.service";
import { AUTH_TOKENS } from "./auth.tokens";
import { SESSION_TOKENS } from "./session.tokens";
import { ResponseUtils } from "@/shared/utils/response.utils";
import { ValidationError } from "@/shared/errors";
import { SessionRepository } from "./session.repository";

@injectable()
export class AuthController {
  constructor(
    @inject(AUTH_TOKENS.Service) private authService: AuthService,
    @inject(SESSION_TOKENS.Repository) private sessionRepo: SessionRepository,
  ) {}

  userLogin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email, password } = req.body;
      const result = await this.authService.login(email, password);
      this.setSessionCookie(res, result.sessionId);
      res.status(200).json(ResponseUtils.success({ user: result.user }, "Login successful"));
    } catch (error) {
      next(error);
    }
  };

  adminLogin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email, password } = req.body;
      const result = await this.authService.adminLogin(email, password);
      this.setSessionCookie(res, result.sessionId);
      res.status(200).json(ResponseUtils.success({ admin: result.admin }, "Admin login successful"));
    } catch (error) {
      next(error);
    }
  };

  userMe = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const sessionId = req.cookies.session_id;
      if (!sessionId) throw new ValidationError("No session");
      const session = await this.authService.getSession(sessionId);
      if (!session) throw new ValidationError("Session expired or invalid");
      const user = await this.authService.getUserById(session.userId);
      res.status(200).json(ResponseUtils.success({ user }));
    } catch (error) {
      next(error);
    }
  };

  adminMe = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const sessionId = req.cookies.session_id;
      if (!sessionId) throw new ValidationError("No session");
      const session = await this.authService.getSession(sessionId);
      if (!session) throw new ValidationError("Session expired or invalid");
      const admin = await this.authService.getAdminById(session.userId);
      res.status(200).json(ResponseUtils.success({ admin }));
    } catch (error) {
      next(error);
    }
  };

  userLogout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const sessionId = req.cookies.session_id;
      if (sessionId) {
        await this.authService.logout(sessionId);
      }
      this.clearSessionCookie(res);
      res.status(200).json(ResponseUtils.success({ isLogout: true }, "Logout successful"));
    } catch (error) {
      next(error);
    }
  };

  adminLogout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const sessionId = req.cookies.session_id;
      if (sessionId) {
        await this.authService.logout(sessionId);
      }
      this.clearSessionCookie(res);
      res.status(200).json(ResponseUtils.success({ isLogout: true }, "Admin logout successful"));
    } catch (error) {
      next(error);
    }
  };

  googleLoginSuccess = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const passportUser = req.user as any;
      if (!passportUser?.id) throw new ValidationError("Google login failed");
      const result = await this.authService.googleSuccess(passportUser.id);
      this.setSessionCookie(res, result.sessionId);
      res.redirect(process.env.frontend_url_home || "http://localhost:5174");
    } catch (error) {
      next(error);
    }
  };

  private setSessionCookie(res: Response, sessionId: string): void {
    res.cookie("session_id", sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
  }

  private clearSessionCookie(res: Response): void {
    res.cookie("session_id", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      expires: new Date(0),
    });
  }
}
