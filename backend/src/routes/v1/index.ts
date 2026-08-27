import { Router } from "express";
import { authLimiter } from "@/shared/middleware/rate-limiter";
import authRoutes from "@/modules/auth/auth.routes";
import userRoutes from "@/modules/user/user.routes";
import adminRoutes from "@/modules/admin/admin.routes";
import productRoutes from "@/modules/product/product.routes";
import categoryRoutes from "@/modules/category/category.routes";
import cartRoutes from "@/modules/cart/cart.routes";
import orderRoutes from "@/modules/order/order.routes";
import addressRoutes from "@/modules/address/address.routes";
import wishlistRoutes from "@/modules/wishlist/wishlist.routes";
import couponRoutes from "@/modules/coupon/coupon.routes";
import paymentRoutes from "@/modules/payment/payment.routes";

const router = Router();

router.use("/auth", authLimiter, authRoutes);
router.use("/user", userRoutes);
router.use("/admin", adminRoutes);
router.use("/product", productRoutes);
router.use("/category", categoryRoutes);
router.use("/cart", cartRoutes);
router.use("/order", orderRoutes);
router.use("/address", addressRoutes);
router.use("/wishlist", wishlistRoutes);
router.use("/coupon", couponRoutes);
router.use("/payment", paymentRoutes);

export default router;
