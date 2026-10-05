import { Request, Response, NextFunction } from "express";
import { container } from "tsyringe";
import { AUTH_TOKENS } from "@/modules/auth/auth.tokens";
import type { AuthService } from "@/modules/auth/auth.service";

export const authenticateUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const sessionId = req.cookies.session_id || null;
    if (!sessionId) {
      res.status(401).json({ success: false, message: "Authentication required" });
      return;
    }

    const authService = container.resolve<AuthService>(AUTH_TOKENS.Service);
    const session = await authService.getSession(sessionId);
    if (!session) {
      res.status(401).json({ success: false, message: "Session expired" });
      return;
    }

    if (session.userType !== "user") {
      res.status(401).json({ success: false, message: "Authentication required" });
      return;
    }

    const user = await authService.getUserById(session.userId);

    req.user = {
      id: user.id,
      email: user.email,
      name: user.userName,
    };

    next();
  } catch {
    res.status(401).json({ success: false, message: "Authentication required" });
  }
};

export const authenticateAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const sessionId = req.cookies.session_id || null;
    if (!sessionId) {
      res.status(401).json({ success: false, message: "Authentication required" });
      return;
    }

    const authService = container.resolve<AuthService>(AUTH_TOKENS.Service);
    const session = await authService.getSession(sessionId);
    if (!session) {
      res.status(401).json({ success: false, message: "Session expired" });
      return;
    }

    if (session.userType !== "admin") {
      res.status(403).json({ success: false, message: "Admin access required" });
      return;
    }

    const admin = await authService.getAdminById(session.userId);

    req.user = {
      email: admin.email,
      id: admin.id,
      name: admin.userName,
     };

    next();
  } catch (error) {
    res.status(401).json({ success: false, message: (error as Error).message });
  }
};
