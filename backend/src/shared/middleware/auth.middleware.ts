import { Request, Response, NextFunction } from "express";
import UserModel from "@/modules/user/user.model";
import AdminModel from "@/modules/admin/admin.model";
import { SESSION_TOKENS } from "@/modules/auth/session.tokens";
import { container } from "tsyringe";
import { SessionRepository } from "@/modules/auth/session.repository";

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

    const sessionRepo = container.resolve<SessionRepository>(SESSION_TOKENS.Repository);
    const session = await sessionRepo.findBySessionId(sessionId);
    if (!session || new Date(session.expiresAt) <= new Date()) {
      res.status(401).json({ success: false, message: "Session expired" });
      return;
    }

    if (session.userType !== "user") {
      res.status(401).json({ success: false, message: "Authentication required" });
      return;
    }

    const user = await UserModel.findById(session.userId);
    if (!user) {
      res.status(401).json({ success: false, message: "User not found" });
      return;
    }

    req.user = {
      id: user._id.toString(),
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

    const sessionRepo = container.resolve<SessionRepository>(SESSION_TOKENS.Repository);
    const session = await sessionRepo.findBySessionId(sessionId);
    if (!session || new Date(session.expiresAt) <= new Date()) {
      res.status(401).json({ success: false, message: "Session expired" });
      return;
    }

    if (session.userType !== "admin") {
      res.status(403).json({ success: false, message: "Admin access required" });
      return;
    }

    const admin = await AdminModel.findById(session.userId);
    if (!admin) {
      res.status(401).json({ success: false, message: "Admin not found" });
      return;
    }

    req.user = {
      id: admin._id.toString(),
      email: admin.email,
      name: admin.userName,
      role: "ADMIN",
    };

    next();
  } catch (error) {
    res.status(401).json({ success: false, message: (error as Error).message });
  }
};
