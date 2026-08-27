import { Request, Response, NextFunction } from "express";
import jwt, { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import { env } from "../config/environment";
import { AuthorizeError } from "../errors";

export interface JwtUserPayload {
  id: string;
  userName?: string;
  email?: string;
  isEmailVerified?: boolean;
  profile?: string;
  createdAt?: string;
  updatedAt?: string;
}

export const authenticateUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const token =
      authHeader && authHeader.startsWith("Bearer ")
        ? authHeader.substring(7)
        : req.cookies.access_token;

    if (!token) {
      res.status(401).json({ success: false, message: "Access token is required" });
      return;
    }

    const payload = jwt.verify(token, env.APP_SECRET) as JwtUserPayload;

    if (!payload.id) {
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
    const token = req.cookies.access_token_admin;

    if (!token) {
      res.status(401).json({ success: false, message: "Admin access token is required" });
      return;
    }

    const payload = jwt.verify(token, env.APP_SECRET) as JwtUserPayload;

    if (!payload.id) {
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
