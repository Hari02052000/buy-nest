import { Request, Response, NextFunction } from "express";
import { tokenUtils } from "@/infrastructure/utils/token.utils";
import { AuthorizeError } from "@/domain/entities/errors";

export const authenticateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    const token =
      authHeader && authHeader.startsWith("Bearer ") ? authHeader.substring(7) : req.cookies.access_token; // Fallback to cookie

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access token is required",
      });
    }

    // Verify token
    const { payload, isVerified } = tokenUtils.isValidUserToken(token);

    if (!isVerified || !payload.id) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token",
      });
    }

    // Attach user info to request
    req.user = {
      id: payload.id!,
      userName: payload.userName || "",
      email: payload.email || "",
      isEmailVerified: (payload as any).isEmailVerified ?? false,
      profile: payload.profile || "",
      createdAt: payload.createdAt || "",
      updatedAt: payload.updatedAt || "",
    };

    next();
  } catch (error) {
    if (error instanceof AuthorizeError) {
      return res.status(401).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Authentication failed",
    });
  }
};

export const authenticateAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.access_token_admin;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Admin access token is required",
      });
    }

    const { payload, isVerified } = tokenUtils.isValidAdminToken(token);

    if (!isVerified || !payload.id) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired admin token",
      });
    }

    // Attach admin info to request (you might want to extend Express.Request type for admin)
    req.user = {
      id: payload.id!,
      userName: payload.userName || "",
      email: payload.email || "",
      isEmailVerified: true,
      profile: "",
      createdAt: payload.createdAt || "",
      updatedAt: payload.updatedAt || "",
    };

    next();
  } catch (error) {
    if (error instanceof AuthorizeError) {
      return res.status(401).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Admin authentication failed",
    });
  }
};
