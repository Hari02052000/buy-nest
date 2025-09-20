import { Request, Response, NextFunction } from "express";
import { StripeService } from "@/application/services/payment/stripe.service";
import {  } from "@/application/services/order/order.service";
import { ResponseUtils } from "@/infrastructure/utils/response.utils";
import { CustomError } from "@/domain/entities/errors";
import { STATUS_CODES } from "@/domain/entities/status.code";

export class PaymentController {
  // private stripeService: StripeService;
  // private orderService: OrderService;

  // constructor(stripeService: StripeService, orderService: OrderService) {
  //   this.stripeService = stripeService;
  //   this.orderService = orderService;
  // }

  // async createPaymentIntent(req: Request, res: Response, next: NextFunction) {
  //   try {
  //     const { orderId, amount, currency = "usd" } = req.body;
  //     const user = req.user as any;

  //     if (!orderId || !amount) {
  //       throw new CustomError(
  //         "Missing required fields",
  //         STATUS_CODES.BAD_REQUEST,
  //         "orderId and amount are required",
  //       );
  //     }

  //     // Verify order exists and belongs to user
  //     const order = await this.orderService.getOrderById(orderId, user?.id);

  //     if (order.paymentInfo.paymentStatus === "completed") {
  //       throw new CustomError(
  //         "Payment already completed",
  //         STATUS_CODES.BAD_REQUEST,
  //         "This order has already been paid",
  //       );
  //     }

  //     const paymentIntent = await this.stripeService.createPaymentIntent({
  //       amount,
  //       currency,
  //       orderId,
  //       customerId: user?.stripeCustomerId,
  //       metadata: {
  //         userId: user?.id,
  //         orderNumber: order.orderId,
  //       },
  //     });

  //     // Update order with payment intent ID
  //     await this.orderService.updatePaymentIntentId(orderId, paymentIntent.paymentIntentId);

  //     res.status(200).json(ResponseUtils.success(paymentIntent, "Payment intent created successfully"));
  //   } catch (error) {
  //     next(error);
  //   }
  // }

  // async confirmPayment(req: Request, res: Response, next: NextFunction) {
  //   try {
  //     const { paymentIntentId } = req.body;

  //     if (!paymentIntentId) {
  //       throw new CustomError(
  //         "Missing payment intent ID",
  //         STATUS_CODES.BAD_REQUEST,
  //         "paymentIntentId is required",
  //       );
  //     }

  //     const paymentIntent = await this.stripeService.confirmPayment(paymentIntentId);

  //     if (paymentIntent.status === "succeeded") {
  //       // Update order payment status
  //       const orderId = paymentIntent.metadata.orderId;
  //       if (orderId) {
  //         await this.orderService.updatePaymentStatus(orderId, "completed", paymentIntent.id);
  //       }
  //     }

  //     res
  //       .status(200)
  //       .json(
  //         ResponseUtils.success(
  //           { status: paymentIntent.status, paymentIntentId: paymentIntent.id },
  //           "Payment status retrieved successfully",
  //         ),
  //       );
  //   } catch (error) {
  //     next(error);
  //   }
  // }

  // async handleWebhook(req: Request, res: Response, next: NextFunction) {
  //   try {
  //     const signature = req.headers["stripe-signature"] as string;
  //     const payload = req.body;

  //     const event = await this.stripeService.handleWebhook(payload, signature);

  //     // Handle different event types
  //     switch (event.type) {
  //       case "payment_intent.succeeded":
  //         const paymentIntent = event.data.object as any;
  //         const orderId = paymentIntent.metadata.orderId;

  //         if (orderId) {
  //           await this.orderService.updatePaymentStatus(orderId, "completed", paymentIntent.id);

  //           // Send order confirmation email
  //           await this.orderService.sendOrderConfirmationEmail(orderId);
  //         }
  //         break;

  //       case "payment_intent.payment_failed":
  //         const failedPayment = event.data.object as any;
  //         const failedOrderId = failedPayment.metadata.orderId;

  //         if (failedOrderId) {
  //           await this.orderService.updatePaymentStatus(failedOrderId, "failed");
  //         }
  //         break;

  //       default:
  //         console.log(`Unhandled event type: ${event.type}`);
  //     }

  //     res.status(200).json({ received: true });
  //   } catch (error) {
  //     next(error);
  //   }
  // }

  // async createCustomer(req: Request, res: Response, next: NextFunction) {
  //   try {
  //     const { email, name } = req.body;

  //     if (!email) {
  //       throw new CustomError("Missing email", STATUS_CODES.BAD_REQUEST, "email is required");
  //     }

  //     const customer = await this.stripeService.createCustomer(email, name);

  //     res
  //       .status(200)
  //       .json(ResponseUtils.success({ customerId: customer.id }, "Customer created successfully"));
  //   } catch (error) {
  //     next(error);
  //   }
  // }
}
