import { Server } from "http";
import mongoose from "mongoose";
import logger from "./logger";

export function setupGracefulShutdown(server: Server): void {
  const shutdown = async (signal: string) => {
    logger.info(`${signal} received — starting graceful shutdown`);

    server.close(async () => {
      logger.info("HTTP server closed");

      try {
        if (mongoose.connection.readyState === 1) {
          await mongoose.connection.close(false);
          logger.info("MongoDB connection closed");
        }
      } catch (err) {
        logger.error({ err }, "Error closing MongoDB connection");
      }

      logger.info("Graceful shutdown complete");
      process.exit(0);
    });

    setTimeout(() => {
      logger.error("Shutdown timed out — forcing exit");
      process.exit(1);
    }, 30000);
  };

  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));
}
