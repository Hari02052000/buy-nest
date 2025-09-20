"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const order_controller_1 = require("../../../../presentation/controller/order/order.controller");
const router = (0, express_1.Router)();
router.post("/", order_controller_1.createOrder);
router.post("/verify-online-order", order_controller_1.verifyOnlineOrder);
router.put("/:orderId", order_controller_1.editOrder);
router.put("/cancel-order/:orderId", order_controller_1.cancelOrder);
router.get("/admin", order_controller_1.getAllOrders);
router.get("/:id", order_controller_1.getSingleOrder);
router.get("/", order_controller_1.getUserOrders);
// Initialize services
// const orderRepository = new OrderRepository();
// const cartRepository = new CartRepository();
// const userRepositoryInstance = new userRepository();
// const orderService = new OrderService(orderRepository, cartRepository,paymentUtills);
// const orderController = new OrderController();
// Order routes
// router.post('/', authenticateUser, (req, res, next) =>
//   orderController.createOrder(req, res, next)
// );
// router.get('/', authenticateUser, (req, res, next) =>
//   orderController.getUserOrders(req, res, next)
// );
// router.get('/:orderId', authenticateUser, (req, res, next) =>
//   orderController.getOrderById(req, res, next)
// );
// router.patch('/:orderId/status', authenticateUser, (req, res, next) =>
//   orderController.updateOrderStatus(req, res, next)
// );
// router.patch('/:orderId/payment-status', authenticateUser, (req, res, next) =>
//   orderController.updatePaymentStatus(req, res, next)
// );
// router.post('/:orderId/tracking', authenticateUser, (req, res, next) =>
//   orderController.addTrackingNumber(req, res, next)
// );
// router.get('/:orderId/invoice', authenticateUser, (req, res, next) =>
//   orderController.getOrderInvoice(req, res, next)
// );
exports.default = router;
