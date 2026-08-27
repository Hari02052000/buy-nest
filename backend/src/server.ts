import "reflect-metadata";
import express from "express";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import cors from "cors";
import compression from "compression";
import rateLimit from "express-rate-limit";

import v1Router from "@/routes/v1/index";
import { handleError } from "@/shared/middleware/error.middleware";
import { requestId } from "@/shared/middleware/request-id";
import { requestLogger } from "@/shared/middleware/request-logger";
import { env } from "@/shared/config/environment";
import logger from "@/shared/config/logger";

export function createServer(): express.Express {
  const app = express();

  // Security
  app.use(helmet());
  app.use(cors({
    origin: [env.frontend_url, "http://localhost:3000", "http://localhost:5173", "http://localhost:5174"],
    credentials: true,
  }));

  // Compression
  app.use(compression());

  // Body parsing with size limits
  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ extended: true, limit: "1mb" }));
  app.use(cookieParser());

  // Request ID + logging
  app.use(requestId);
  app.use(requestLogger);

  // Global rate limit
  app.use(rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: "Too many requests, please try again later" },
  }));

  // Health check
  app.get("/api/health", (_req, res) => {
    res.status(200).json({
      success: true,
      message: "OK",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    });
  });

  // API v1 routes
  app.use("/api/v1", v1Router);

  // Error handler
  app.use(handleError);

  logger.info("Server configured");
  return app;
}
