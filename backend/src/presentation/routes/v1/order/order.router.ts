import { Router } from "express";
import {
  createOrder,
  verifyOnlineOrder,
  cancelOrder,
  editOrder,
  getUserOrders,
  getAllOrders,
  getSingleOrder,
} from "@/presentation/controller/order/order.controller";

const router = Router();
router.post("/", createOrder);
router.post("/verify-online-order", verifyOnlineOrder);
router.put("/:orderId", editOrder);
router.put("/cancel-order/:orderId", cancelOrder);
router.get("/admin", getAllOrders);
router.get("/:id", getSingleOrder);
router.get("/", getUserOrders);
export default router;
