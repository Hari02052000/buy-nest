import { Request, Response, NextFunction } from "express";
import { OrderRepository } from "@/infrastructure/repository/order.repository";
import { orderService } from "@/application/services/order/order.service";
import { tokenUtils } from "@/infrastructure/utils";
import { paymentUtills } from "@/infrastructure/utils";
import { CartRepository } from "@/infrastructure/repository";
import { productRepository } from "@/infrastructure/repository";
import { orderUtils } from "@/infrastructure/utils/order.utils";

const orderRepo = new OrderRepository();
const cartRepo = new CartRepository();
const productRepo = new productRepository();
const orderServ = new orderService(orderUtils, paymentUtills, orderRepo, cartRepo, tokenUtils, productRepo);

export const createOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.access_token;
    const order = await orderServ.createOrder(token, req.body);
    return res.status(200).json({ order });
  } catch (error) {
    next(error);
  }
};
export const verifyOnlineOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.access_token;
    const order = await orderServ.verifyOnlinePayment(token, req.body.paymentId);
    return res.status(200).json({ order });
  } catch (error) {
    next(error);
  }
};
export const changeOrderStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.access_token;
    const order = await orderServ.verifyOnlinePayment(token, req.body.paymentId);
    return res.status(200).json({ order });
  } catch (error) {
    next(error);
  }
};
export const changePaymentStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.access_token;
    const order = await orderServ.verifyOnlinePayment(token, req.body.paymentId);
    return res.status(200).json({ order });
  } catch (error) {
    next(error);
  }
};
export const cancelOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.access_token;
    const orderId = req.params.orderId;
    const order = await orderServ.cancelOrderId(token, orderId);
    return res.status(200).json({ order });
  } catch (error) {
    next(error);
  }
};
export const editOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.access_token_admin;
    const oredrId = req.params.orderId;
    const order = await orderServ.editOrderId(token, oredrId, req.body);
    return res.status(200).json({ order });
  } catch (error) {
    next(error);
  }
};
export const getUserOrders = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.access_token;
    const orders = await orderServ.getCurentUserOrder(token);
    return res.status(200).json({ orders });
  } catch (error) {
    next(error);
  }
};
export const getAllOrders = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.access_token_admin;
    const orders = await orderServ.getAdminAllOrders(token, 0, 0);
    return res.status(200).json({ orders });
  } catch (error) {
    next(error);
  }
};
export const getSingleOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.access_token_admin;
    const orderId = req.params.id;
    const order = await orderServ.getAdminSingleOrder(token, orderId);
    return res.status(200).json({ order });
  } catch (error) {
    next(error);
  }
};

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
