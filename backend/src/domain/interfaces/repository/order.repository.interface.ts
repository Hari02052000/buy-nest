import { Order } from "@/domain/entities/order";

export interface OrderRepositoryInterface {
  create(order: Order): Promise<Order>;
  findById(id: string): Promise<Order | null>;
  findByUserId(userId: string): Promise<Order[]>;
  findByStatus(status: string): Promise<Order[]>;
  update(order: Order): Promise<Order | null>;
  delete(id: string): Promise<boolean>;
  getAllOrders(
    limit: number,
    skip: number,
    paymentStatus?: "pending" | "processing" | "completed" | "failed" | "refunded",
    orderStatus?: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled",
    paymentMethod?: "cod" | "online",
    appliedCoupon?: string,
  ): Promise<Order[]>;
  mapToOrder(orderDb: unknown): Order;
}
