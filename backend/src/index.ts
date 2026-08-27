import "reflect-metadata";
import { configureContainer } from "@/shared/container";
import { registerUserModule } from "@/modules/user/user.tokens";
import { registerAdminModule } from "@/modules/admin/admin.tokens";
import { registerAuthModule } from "@/modules/auth/auth.tokens";
import { registerProductModule } from "@/modules/product/product.tokens";
import { registerCategoryModule } from "@/modules/category/category.tokens";
import { registerCartModule } from "@/modules/cart/cart.tokens";
import { registerOrderModule } from "@/modules/order/order.tokens";
import { registerAddressModule } from "@/modules/address/address.tokens";
import { registerWishlistModule } from "@/modules/wishlist/wishlist.tokens";
import { registerCouponModule } from "@/modules/coupon/coupon.tokens";
import { registerPaymentModule } from "@/modules/payment/payment.tokens";

import connectDb from "@/shared/config/database";
import { createServer } from "@/server";
import { setupGracefulShutdown } from "@/shared/config/graceful-shutdown";
import { createAdmin } from "@/modules/admin/admin.seed";
import { env } from "@/shared/config/environment";
import logger from "@/shared/config/logger";

async function bootstrap(): Promise<void> {
  // 1. Register DI containers
  configureContainer();
  registerUserModule();
  registerAdminModule();
  registerAuthModule();
  registerProductModule();
  registerCategoryModule();
  registerCartModule();
  registerOrderModule();
  registerAddressModule();
  registerWishlistModule();
  registerCouponModule();
  registerPaymentModule();
  logger.info("DI containers registered");

  // 2. Connect to database
  await connectDb();

  // 3. Seed admin
  await createAdmin();

  // 4. Create Express server
  const app = createServer();

  // 5. Start listening
  const port = env.PORT;
  const server = app.listen(port, () => {
    logger.info(`Server running on port ${port} [${env.NODE_ENV}]`);
  });

  // 6. Graceful shutdown
  setupGracefulShutdown(server);
}

bootstrap().catch((err) => {
  logger.error({ err }, "Failed to start server");
  process.exit(1);
});
