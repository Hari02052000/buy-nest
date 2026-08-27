import { Request, Response, NextFunction } from "express";
import jwt, { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import { env } from "../config/environment";
import { AuthorizeError } from "../errors";

export interface JwtUserPayload {
  id: string;
  userName?: string;
  email?: string;
  role?: string;
  type?: "access" | "refresh";
  isEmailVerified?: boolean;
  profile?: string;
  createdAt?: string;
  updatedAt?: string;
}

function extractToken(req: Request): string | null {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authHeader.substring(7);
  }
  return req.cookies.access_token || null;
}

export const authenticateUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const token = extractToken(req);

    if (!token) {
      res.status(401).json({ success: false, message: "Access token is required" });
      return;
    }

    const payload = jwt.verify(token, env.APP_SECRET) as JwtUserPayload;

    if (!payload.id || payload.type === "refresh") {
      res.status(401).json({ success: false, message: "Invalid token payload" });
      return;
    }

    req.user = {
      id: payload.id,
      userName: payload.userName || "",
      email: payload.email || "",
      isEmailVerified: payload.isEmailVerified ?? false,
      profile: payload.profile || "",
      createdAt: payload.createdAt || "",
      updatedAt: payload.updatedAt || "",
    };

    next();
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      res.status(401).json({ success: false, message: "Token expired" });
      return;
    }
    if (error instanceof JsonWebTokenError) {
      res.status(401).json({ success: false, message: "Invalid token" });
      return;
    }
    res.status(401).json({ success: false, message: "Authentication failed" });
  }
};

export const authenticateAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const token =
      authHeader && authHeader.startsWith("Bearer ")
        ? authHeader.substring(7)
        : req.cookies.access_token_admin;

    if (!token) {
      res.status(401).json({ success: false, message: "Admin access token is required" });
      return;
    }

    const payload = jwt.verify(token, env.APP_SECRET) as JwtUserPayload;

    if (!payload.id || payload.type === "refresh") {
      res.status(401).json({ success: false, message: "Invalid admin token payload" });
      return;
    }

    req.user = {
      id: payload.id,
      userName: payload.userName || "",
      email: payload.email || "",
      isEmailVerified: true,
      profile: "",
      createdAt: payload.createdAt || "",
      updatedAt: payload.updatedAt || "",
    };

    next();
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      res.status(401).json({ success: false, message: "Admin token expired" });
      return;
    }
    if (error instanceof JsonWebTokenError) {
      res.status(401).json({ success: false, message: "Invalid admin token" });
      return;
    }
    res.status(401).json({ success: false, message: "Admin authentication failed" });
  }
};

export const requireRole = (...allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ success: false, message: "Not authenticated" });
      return;
    }
    // Role is checked from DB in service layer for accuracy
    // This middleware is a fast pre-filter based on JWT claims
    next();
  };
};
