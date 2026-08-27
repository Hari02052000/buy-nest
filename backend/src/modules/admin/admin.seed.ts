import { container } from "tsyringe";
import AdminModel from "./admin.model";
import logger from "@/shared/config/logger";
import { AuthUtils } from "@/shared/utils/auth.utils";
import { SHARED_TOKENS } from "@/shared/tokens";

export async function createAdmin(): Promise<void> {
  try {
    const existingAdmin = await AdminModel.findOne({ email: "admin@buynest.com" });
    if (existingAdmin) {
      logger.info("Admin already exists — skipping seed");
      return;
    }

    const authUtils = container.resolve<AuthUtils>(SHARED_TOKENS.AuthUtils);
    const salt = await authUtils.getSalt();
    const hashedPassword = await authUtils.getHashedPassword("Admin@123", salt);

    const admin = new AdminModel({
      userName: "admin",
      email: "admin@buynest.com",
      password: hashedPassword,
      salt,
    });
    await admin.save();
    logger.info("Admin seeded successfully");
  } catch (error) {
    logger.error({ err: error }, "Failed to seed admin");
  }
}
