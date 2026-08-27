import { Router } from "express";
import { container } from "tsyringe";
import { ORDER_TOKENS } from "./order.tokens";
import { OrderController } from "./order.controller";
import { authenticateUser, authenticateAdmin } from "@/shared/middleware/auth.middleware";

const router = Router();
const controller = container.resolve<OrderController>(ORDER_TOKENS.Controller);

// User routes
router.post("/", authenticateUser, controller.createOrder);
router.post("/verify-payment", authenticateUser, controller.verifyOnlinePayment);
router.get("/", authenticateUser, controller.getUserOrders);
router.get("/:orderId", authenticateUser, controller.getOrderById);
router.patch("/:orderId/cancel", authenticateUser, controller.cancelOrder);

// Admin routes
router.get("/admin/all", authenticateAdmin, controller.getAllOrders);
router.get("/admin/:id", authenticateAdmin, controller.getSingleOrder);
router.patch("/:orderId/status", authenticateAdmin, controller.changeOrderStatus);
router.patch("/:orderId/payment-status", authenticateAdmin, controller.changePaymentStatus);
router.put("/:orderId", authenticateAdmin, controller.editOrder);

export default router;
