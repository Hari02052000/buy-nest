import { injectable, inject } from "tsyringe";
import { Request, Response, NextFunction } from "express";
import { OrderService } from "./order.service";
import { ORDER_TOKENS } from "./order.tokens";
import { ResponseUtils } from "@/shared/utils/response.utils";

@injectable()
export class OrderController {
  constructor(
    @inject(ORDER_TOKENS.Service) private orderService: OrderService,
  ) {}

  createOrder = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const order = await this.orderService.createOrder(req.user!.id, req.body);
      res.status(201).json(ResponseUtils.success({ order }));
    } catch (error) {
      next(error);
    }
  };

  verifyOnlinePayment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const order = await this.orderService.verifyOnlinePayment(req.user!.id, req.body.paymentId);
      res.status(200).json(ResponseUtils.success({ order }));
    } catch (error) {
      next(error);
    }
  };

  getOrderById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const order = await this.orderService.getOrderById(req.user!.id, req.params.orderId);
      res.status(200).json(ResponseUtils.success({ order }));
    } catch (error) {
      next(error);
    }
  };

  cancelOrder = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const order = await this.orderService.cancelOrder(req.user!.id, req.params.orderId);
      res.status(200).json(ResponseUtils.success({ order }));
    } catch (error) {
      next(error);
    }
  };

  changeOrderStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const order = await this.orderService.editOrder(req.params.orderId, req.body);
      res.status(200).json(ResponseUtils.success({ order }));
    } catch (error) {
      next(error);
    }
  };

  changePaymentStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const order = await this.orderService.editOrder(req.params.orderId, req.body);
      res.status(200).json(ResponseUtils.success({ order }));
    } catch (error) {
      next(error);
    }
  };

  editOrder = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const order = await this.orderService.editOrder(req.params.orderId, req.body);
      res.status(200).json(ResponseUtils.success({ order }));
    } catch (error) {
      next(error);
    }
  };

  getUserOrders = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const orders = await this.orderService.getCurrentUserOrders(req.user!.id);
      res.status(200).json(ResponseUtils.success({ orders }));
    } catch (error) {
      next(error);
    }
  };

  getAllOrders = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const page = req.query.page ? parseInt(req.query.page as string) : 1;
      const paymentStatus = req.query.paymentStatus as string | undefined;
      const orderStatus = req.query.orderStatus as string | undefined;
      const paymentMethod = req.query.paymentMethod as string | undefined;
      const appliedCoupon = req.query.appliedCoupon as string | undefined;

      const orders = await this.orderService.getAdminAllOrders(limit, page, {
        paymentStatus, orderStatus, paymentMethod, appliedCoupon,
      });
      res.status(200).json(ResponseUtils.success({ orders }));
    } catch (error) {
      next(error);
    }
  };

  getSingleOrder = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const order = await this.orderService.getAdminSingleOrder(req.params.id);
      res.status(200).json(ResponseUtils.success({ order }));
    } catch (error) {
      next(error);
    }
  };
}
