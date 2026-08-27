import { injectable } from "tsyringe";
import OrderModel from "./order.model";
import { Order } from "./order.entity";
import { APIError, ValidationError } from "@/shared/errors";

@injectable()
export class OrderRepository {
  async create(order: Order): Promise<Order> {
    try {
      const doc = new OrderModel({
        items: order.items,
        address: order.address,
        user: order.user,
        paymentInfo: order.paymentInfo,
        orderStatus: order.orderStatus,
        appliedCoupon: order.appliedCoupon || null,
      });
      const saved = await doc.save();
      const populated = await OrderModel.findById(saved._id)
        .populate("address")
        .populate("user");
      return Order.fromDocument(populated!);
    } catch (error) {
      throw new APIError("Failed to create order");
    }
  }

  async findById(id: string): Promise<Order | null> {
    try {
      const doc = await OrderModel.findById(id)
        .populate("user")
        .populate("items.productId")
        .populate("address");
      if (!doc) return null;
      return Order.fromDocument(doc);
    } catch (error) {
      throw new APIError("Failed to find order");
    }
  }

  async findByUserId(userId: string): Promise<Order[]> {
    try {
      const docs = await OrderModel.find({ user: userId })
        .populate("items.productId")
        .populate("address")
        .sort({ createdAt: -1 });
      return docs.map((doc) => Order.fromDocument(doc));
    } catch (error) {
      throw new APIError("Failed to find orders by user");
    }
  }

  async update(order: Order): Promise<Order | null> {
    try {
      const updateData: Record<string, any> = {};
      if (order.orderStatus) updateData.orderStatus = order.orderStatus;
      if (order.paymentInfo) updateData.paymentInfo = order.paymentInfo;
      if (order.appliedCoupon !== undefined) updateData.appliedCoupon = order.appliedCoupon;

      await OrderModel.findByIdAndUpdate(order.id, updateData);
      const updated = await this.findById(order.id);
      return updated;
    } catch (error) {
      throw new APIError("Failed to update order");
    }
  }

  async getAll(
    limit: number,
    skip: number,
    filters?: {
      paymentStatus?: string;
      orderStatus?: string;
      paymentMethod?: string;
      appliedCoupon?: string;
    },
  ): Promise<Order[]> {
    try {
      const query: Record<string, any> = {};
      if (filters?.paymentStatus) query["paymentInfo.paymentStatus"] = filters.paymentStatus;
      if (filters?.orderStatus) query.orderStatus = filters.orderStatus;
      if (filters?.paymentMethod) query["paymentInfo.method"] = filters.paymentMethod;
      if (filters?.appliedCoupon) query.appliedCoupon = filters.appliedCoupon;

      const docs = await OrderModel.find(query)
        .populate("user")
        .populate("items.productId")
        .populate("address")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);
      return docs.map((doc) => Order.fromDocument(doc));
    } catch (error) {
      throw new APIError("Failed to fetch orders");
    }
  }

  async populate(order: Order): Promise<Order> {
    try {
      const doc = await OrderModel.findById(order.id)
        .populate("user")
        .populate("items.productId")
        .populate("address");
      if (!doc) throw new ValidationError("Order not found after populate");
      return Order.fromDocument(doc);
    } catch (error) {
      if (error instanceof ValidationError) throw error;
      throw new APIError("Failed to populate order");
    }
  }
}
