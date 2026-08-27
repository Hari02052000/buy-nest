import mongoose from "mongoose";
import { env } from "./environment";
import logger from "./logger";

const connectDb = async (): Promise<void> => {
  try {
    await mongoose.connect(env.DB_URL);
    logger.info("Database connected");
  } catch (error) {
    logger.error({ err: error }, "Database connection failed");
    process.exit(1);
  }
};

export default connectDb;
