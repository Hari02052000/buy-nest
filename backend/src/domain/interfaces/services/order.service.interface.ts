import { orderProperties } from "@/domain/entities";
import { createPaymentResponse } from "../utils";

export interface OrderServiceInterface {
  createOrder(userToken: string, reqBody: unknown): Promise<orderProperties | createPaymentResponse>;
  verifyOnlinePayment(userToken: string, paymentId: string): Promise<orderProperties>;
  getOrderById(userToken: string, orderId: string): Promise<orderProperties>;
  cancelOrderId(userToken: string, orderId: string): Promise<orderProperties>;
  editOrderId(adminToken: string, orderId: string, orderProp: unknown): Promise<orderProperties>;
  getAdminSingleOrder(adminToken: string, orderId: string): Promise<orderProperties>;
  getAdminAllOrders(
    adminToken: string,
    limit: number,
    page: number,
    paymentStatus?: "pending" | "processing" | "completed" | "failed" | "refunded",
    orderStatus?: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled",
    paymentMethod?: "cod" | "online",
    appliedCoupon?: string,
  ): Promise<orderProperties[]>;
  getCurentUserOrder(userToken: string): Promise<orderProperties[]>;
}
