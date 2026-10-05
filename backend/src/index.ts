import "reflect-metadata";
import { configureContainer } from "@/shared/container";
import { registerUserModule } from "@/modules/user/user.di";
import { registerAdminModule } from "@/modules/admin/admin.di";
import { registerAuthModule } from "@/modules/auth/auth.di";
import { registerProductModule } from "@/modules/product/product.di";
import { registerCategoryModule } from "@/modules/category/category.di";
import { registerCartModule } from "@/modules/cart/cart.di";
import { registerOrderModule } from "@/modules/order/order.di";
import { registerAddressModule } from "@/modules/address/address.di";
import { registerWishlistModule } from "@/modules/wishlist/wishlist.di";
import { registerCouponModule } from "@/modules/coupon/coupon.di";
import { registerPaymentModule } from "@/modules/payment/payment.di";

import connectDb from "@/shared/config/database";
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

  // 4. Create Express server (required lazily so route modules resolve
  //    their controllers from the container only after registration above)
  const { createServer } = require("@/server") as typeof import("@/server");
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
