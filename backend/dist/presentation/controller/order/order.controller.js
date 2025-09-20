"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSingleOrder = exports.getAllOrders = exports.getUserOrders = exports.editOrder = exports.cancelOrder = exports.changePaymentStatus = exports.changeOrderStatus = exports.verifyOnlineOrder = exports.createOrder = void 0;
const order_repository_1 = require("../../../infrastructure/repository/order.repository");
const order_service_1 = require("../../../application/services/order/order.service");
const utils_1 = require("../../../infrastructure/utils");
const utils_2 = require("../../../infrastructure/utils");
const repository_1 = require("../../../infrastructure/repository");
const repository_2 = require("../../../infrastructure/repository");
const order_utils_1 = require("../../../infrastructure/utils/order.utils");
const orderRepo = new order_repository_1.OrderRepository();
const cartRepo = new repository_1.CartRepository();
const productRepo = new repository_2.productRepository();
const orderServ = new order_service_1.orderService(order_utils_1.orderUtils, utils_2.paymentUtills, orderRepo, cartRepo, utils_1.tokenUtils, productRepo);
const createOrder = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.cookies.access_token;
        const order = yield orderServ.createOrder(token, req.body);
        return res.status(200).json({ order });
    }
    catch (error) {
        next(error);
    }
});
exports.createOrder = createOrder;
const verifyOnlineOrder = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.cookies.access_token;
        const order = yield orderServ.verifyOnlinePayment(token, req.body.paymentId);
        return res.status(200).json({ order });
    }
    catch (error) {
        next(error);
    }
});
exports.verifyOnlineOrder = verifyOnlineOrder;
const changeOrderStatus = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.cookies.access_token;
        const order = yield orderServ.verifyOnlinePayment(token, req.body.paymentId);
        return res.status(200).json({ order });
    }
    catch (error) {
        next(error);
    }
});
exports.changeOrderStatus = changeOrderStatus;
const changePaymentStatus = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.cookies.access_token;
        const order = yield orderServ.verifyOnlinePayment(token, req.body.paymentId);
        return res.status(200).json({ order });
    }
    catch (error) {
        next(error);
    }
});
exports.changePaymentStatus = changePaymentStatus;
const cancelOrder = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.cookies.access_token;
        const orderId = req.params.orderId;
        const order = yield orderServ.cancelOrderId(token, orderId);
        return res.status(200).json({ order });
    }
    catch (error) {
        next(error);
    }
});
exports.cancelOrder = cancelOrder;
const editOrder = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.cookies.access_token_admin;
        const oredrId = req.params.orderId;
        const order = yield orderServ.editOrderId(token, oredrId, req.body);
        return res.status(200).json({ order });
    }
    catch (error) {
        next(error);
    }
});
exports.editOrder = editOrder;
const getUserOrders = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.cookies.access_token;
        const orders = yield orderServ.getCurentUserOrder(token);
        return res.status(200).json({ orders });
    }
    catch (error) {
        next(error);
    }
});
exports.getUserOrders = getUserOrders;
const getAllOrders = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.cookies.access_token_admin;
        const orders = yield orderServ.getAdminAllOrders(token, 0, 0);
        return res.status(200).json({ orders });
    }
    catch (error) {
        next(error);
    }
});
exports.getAllOrders = getAllOrders;
const getSingleOrder = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.cookies.access_token_admin;
        const orderId = req.params.id;
        const order = yield orderServ.getAdminSingleOrder(token, orderId);
        return res.status(200).json({ order });
    }
    catch (error) {
        next(error);
    }
});
exports.getSingleOrder = getSingleOrder;
// async getOrderById(req: Request, res: Response, next: NextFunction) {
//   try {
//     const { orderId } = req.params;
//     const user = req.user as any;
//     const userId = user?.id;
//     const order = await this.orderService.getOrderById(orderId, userId);
//     res.status(200).json(
//       ResponseUtils.success(order, 'Order retrieved successfully')
//     );
//   } catch (error) {
//     next(error);
//   }
// }
// async getUserOrders(req: Request, res: Response, next: NextFunction) {
//   try {
//     const user = req.user as any;
//     const userId = user?.id;
//     if (!userId) {
//       return res.status(401).json({
//         success: false,
//         message: 'User not authenticated'
//       });
//     }
//     const limit = parseInt(req.query.limit as string) || 10;
//     const skip = parseInt(req.query.skip as string) || 0;
//     const orders = await this.orderService.getUserOrders(userId, limit, skip);
//     res.status(200).json(
//       ResponseUtils.success(orders, 'Orders retrieved successfully')
//     );
//   } catch (error) {
//     next(error);
//   }
// }
// async updateOrderStatus(req: Request, res: Response, next: NextFunction) {
//   try {
//     const { orderId } = req.params;
//     const { status } = req.body;
//     const order = await this.orderService.updateOrderStatus(orderId, status);
//     res.status(200).json(
//       ResponseUtils.success(order, 'Order status updated successfully')
//     );
//   } catch (error) {
//     next(error);
//   }
// }
// async updatePaymentStatus(req: Request, res: Response, next: NextFunction) {
//   try {
//     const { orderId } = req.params;
//     const { paymentStatus, transactionId } = req.body;
//     const order = await this.orderService.updatePaymentStatus(
//       orderId,
//       paymentStatus,
//       transactionId
//     );
//     res.status(200).json(
//       ResponseUtils.success(order, 'Payment status updated successfully')
//     );
//   } catch (error) {
//     next(error);
//   }
// }
// async addTrackingNumber(req: Request, res: Response, next: NextFunction) {
//   try {
//     const { orderId } = req.params;
//     const { trackingNumber } = req.body;
//     const order = await this.orderService.addTrackingNumber(orderId, trackingNumber);
//     res.status(200).json(
//       ResponseUtils.success(order, 'Tracking number added successfully')
//     );
//   } catch (error) {
//     next(error);
//   }
// }
// async getOrderInvoice(req: Request, res: Response, next: NextFunction) {
//   try {
//     const { orderId } = req.params;
//     const user = req.user as any;
//     const userId = user?.id;
//     // Verify user owns this order
//     const order = await this.orderService.getOrderById(orderId, userId);
//     const invoiceData = await this.orderService.generateInvoiceData(orderId);
//     res.status(200).json(
//       ResponseUtils.success(invoiceData, 'Invoice data retrieved successfully')
//     );
//   } catch (error) {
//     next(error);
//   }
// }
// async downloadInvoicePDF(req: Request, res: Response, next: NextFunction) {
//   try {
//     const { orderId } = req.params;
//     const user = req.user as any;
//     const userId = user?.id;
//     // Verify user owns this order
//     await this.orderService.getOrderById(orderId, userId);
//     const pdfBuffer = await this.orderService.generateInvoicePDF(orderId);
//     const filename = await this.orderService.getInvoiceFilename(orderId);
//     res.setHeader('Content-Type', 'application/pdf');
//     res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
//     res.setHeader('Content-Length', pdfBuffer.length);
//     res.send(pdfBuffer);
//   } catch (error) {
//     next(error);
//   }
// }
// async viewInvoicePDF(req: Request, res: Response, next: NextFunction) {
//   try {
//     const { orderId } = req.params;
//     const user = req.user as any;
//     const userId = user?.id;
//     // Verify user owns this order
//     await this.orderService.getOrderById(orderId, userId);
//     const pdfBuffer = await this.orderService.generateInvoicePDF(orderId);
//     const filename = await this.orderService.getInvoiceFilename(orderId);
//     res.setHeader('Content-Type', 'application/pdf');
//     res.setHeader('Content-Disposition', `inline; filename="${filename}"`);
//     res.setHeader('Content-Length', pdfBuffer.length);
//     res.send(pdfBuffer);
//   } catch (error) {
//     next(error);
//   }
// }
// // Admin endpoint for downloading any invoice
// async adminDownloadInvoice(req: Request, res: Response, next: NextFunction) {
//   try {
//     const { orderId } = req.params;
//     const pdfBuffer = await this.orderService.generateInvoicePDF(orderId);
//     const filename = await this.orderService.getInvoiceFilename(orderId);
//     res.setHeader('Content-Type', 'application/pdf');
//     res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
//     res.setHeader('Content-Length', pdfBuffer.length);
//     res.send(pdfBuffer);
//   } catch (error) {
//     next(error);
//   }
// }
// // Admin endpoints
// async getOrdersByStatus(req: Request, res: Response, next: NextFunction) {
//   try {
//     const { status } = req.params;
//     const orders = await this.orderService.getOrdersByStatus(status as any);
//     res.status(200).json(
//       ResponseUtils.success(orders, `Orders with status '${status}' retrieved successfully`)
//     );
//   } catch (error) {
//     next(error);
//   }
// }
