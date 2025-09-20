import {
  addressProperties,
  APIError,
  Order,
  orderItem,
  orderProperties,
  productProperties,
  userProperties,
  ValidationError,
} from "@/domain/entities";
import { OrderRepositoryInterface } from "@/domain/interfaces/repository/order.repository.interface";
import OrderModel, { IOrder } from "../model/order.model";
import { IProduct, IUser } from "../model";
import { IAddress } from "../model/address.model";

export class OrderRepository implements OrderRepositoryInterface {
  async getAllOrders(
    limit: number,
    skip: number,
    paymentStatus?: "pending" | "processing" | "completed" | "failed" | "refunded",
    orderStatus?: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled",
    paymentMethod?: "cod" | "online",
    appliedCoupon?: string,
  ): Promise<Order[]> {
    try {
      const query: any = {};

      if (paymentStatus) {
        query["paymentInfo.paymentStatus"] = paymentStatus;
      }

      if (orderStatus) {
        query["orderStatus"] = orderStatus;
      }

      if (paymentMethod) {
        query["paymentInfo.method"] = paymentMethod;
      }

      if (appliedCoupon) {
        query["appliedCoupon"] = appliedCoupon;
      }

      const orders = await OrderModel.find(query).limit(limit).skip(skip);
      return orders.map((order) => this.mapToOrder(order));
    } catch (error) {
      throw new APIError();
    }
  }

  async create(order: Order): Promise<Order> {
    try {
      const newOrder = new OrderModel({
        items: order.items,
        address: order.address,
        user: order.user,
        paymentInfo: order.paymentInfo,
        orderStatus: order.orderStatus,
        appliedCoupon: order.appliedCoupon,
      });
      await newOrder.save();
      const populatedOrder = await OrderModel.findById(newOrder.id).populate("address").populate("user");
      return this.mapToOrder(populatedOrder!);
    } catch (error) {
      throw new APIError();
    }
  }
  async findById(id: string): Promise<Order | null> {
    const order = await OrderModel.findById(id)
      .populate("user")
      .populate("items.productId")
      .populate("address");
    if (!order) throw new ValidationError();
    return this.mapToOrder(order);
  }
  async findByUserId(userId: string): Promise<Order[]> {
    try {
      const orders = await OrderModel.find({
        user: userId,
      })
        .populate("items.productId")
        .populate("address")
        .sort({ createdAt: -1 });

      return orders.map((order) => this.mapToOrder(order));
    } catch (error) {
      throw new APIError();
    }
  }
  findByStatus(status: string): Promise<Order[]> {
    throw new Error("Method not implemented.");
  }
  async update(order: Order): Promise<Order | null> {
    try {
      const modifiedFields = order.modifiedFields;
      if (Object.keys(modifiedFields).length === 0) throw new ValidationError();
      const updatedFields: Record<keyof Omit<orderProperties, "id" | "user" | "items">, any> = {} as Record<
        keyof Omit<orderProperties, "id" | "user" | "items">,
        any
      >;
      for (const key in modifiedFields) {
        if (modifiedFields.hasOwnProperty(key)) {
          const fieldKey = key as keyof Omit<orderProperties, "id" | "user" | "items">;
          if (modifiedFields[fieldKey]) {
            updatedFields[fieldKey] = order[fieldKey];
          }
        }
      }
      if (updatedFields.updatedAt) delete updatedFields.updatedAt;
      await OrderModel.findByIdAndUpdate(order.id, updatedFields);
      order.clearModifiedFields;
      const updatedOrder = await this.findById(order.id);
      return updatedOrder;
    } catch (error) {
      throw new APIError();
    }
  }
  delete(id: string): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
  mapToOrder(orderDb: IOrder): Order {
    const items: orderItem[] = orderDb.items.map((item) => {
      const orderItem: orderItem = {
        price: item.price,
        quantity: item.quantity,
        totalPrice: item.totalPrice,
        productId: (() => {
          const product = item.productId;
          if (
            typeof product === "object" &&
            product !== null &&
            "brandName" in product &&
            "modelName" in product &&
            "price" in product
          ) {
            const dbItem = product as IProduct;

            return {
              id: dbItem.id ?? dbItem._id?.toString(),
              brandName: dbItem.brandName,
              modelName: dbItem.modelName,
              images: dbItem.images,
              price: dbItem.price,
              description: dbItem.description,
            } as Partial<productProperties>;
          }

          return product.toString(); // fallback: unpopulated ObjectId
        })(),
      };

      return orderItem;
    });

    const address: string | Partial<addressProperties> = (() => {
      const addr = orderDb.address;

      if (
        typeof addr === "object" &&
        addr !== null &&
        "addressLine1" in addr &&
        "city" in addr &&
        "country" in addr
      ) {
        const dbAddress = addr as IAddress;

        return {
          id: dbAddress.id ?? dbAddress._id?.toString(),
          addressLine1: dbAddress.addressLine1,
          city: dbAddress.city,
          country: dbAddress.country,
          fullName: dbAddress.fullName,
        };
      }

      return addr.toString();
    })();

    const user: string | Partial<userProperties> = (() => {
      const usr = orderDb.user;

      if (typeof usr === "object" && usr !== null && "email" in usr) {
        const dbUser = usr as IUser;

        return {
          id: dbUser.id ?? dbUser._id?.toString(),
          email: dbUser.email,
        };
      }

      return usr.toString();
    })();

    const order = new Order(
      orderDb.id,
      items,
      address,
      user,
      orderDb.paymentInfo.method,
      orderDb.paymentInfo.payableAmount,
    );

    order.paymentInfo = orderDb.paymentInfo;
    order.orderStatus = orderDb.orderStatus;
    return order;
  }

  // async createOrder(orderData: CreateOrderRequest & { userId: string }): Promise<Order> {
  //   const order = new OrderModel({
  //     ...orderData,
  //     orderDate: new Date(),
  //     paymentInfo: {
  //       ...orderData.paymentInfo,
  //       paymentDate: new Date()
  //     }
  //   });

  //   const savedOrder = await order.save();
  //   return savedOrder.toObject();
  // }

  // async getOrderById(orderId: string): Promise<Order | null> {
  //   const order = await OrderModel.findOne({ orderId }).lean();
  //   return order;
  // }

  // async getOrdersByUserId(userId: string, limit: number = 10, skip: number = 0): Promise<Order[]> {
  //   const orders = await OrderModel
  //     .find({ userId })
  //     .sort({ orderDate: -1 })
  //     .limit(limit)
  //     .skip(skip)
  //     .lean();
  //   return orders;
  // }

  // async updateOrderStatus(orderId: string, status: Order['orderStatus']): Promise<Order | null> {
  //   const updatedOrder = await OrderModel
  //     .findOneAndUpdate(
  //       { orderId },
  //       { orderStatus: status },
  //       { new: true }
  //     )
  //     .lean();
  //   return updatedOrder;
  // }

  // async updatePaymentStatus(
  //   orderId: string,
  //   paymentStatus: Order['paymentInfo']['paymentStatus'],
  //   transactionId?: string
  // ): Promise<Order | null> {
  //   const updateData: any = { 'paymentInfo.paymentStatus': paymentStatus };
  //   if (transactionId) {
  //     updateData['paymentInfo.transactionId'] = transactionId;
  //   }

  //   const updatedOrder = await OrderModel
  //     .findOneAndUpdate(
  //       { orderId },
  //       updateData,
  //       { new: true }
  //     )
  //     .lean();
  //   return updatedOrder;
  // }

  // async addTrackingNumber(orderId: string, trackingNumber: string): Promise<Order | null> {
  //   const updatedOrder = await OrderModel
  //     .findOneAndUpdate(
  //       { orderId },
  //       { trackingNumber, orderStatus: 'shipped' },
  //       { new: true }
  //     )
  //     .lean();
  //   return updatedOrder;
  // }

  // async updatePaymentIntentId(orderId: string, paymentIntentId: string): Promise<Order | null> {
  //   const updatedOrder = await OrderModel
  //     .findOneAndUpdate(
  //       { orderId },
  //       {
  //         'paymentInfo.paymentIntentId': paymentIntentId,
  //         'paymentInfo.paymentStatus': 'processing'
  //       },
  //       { new: true }
  //     )
  //     .lean();
  //   return updatedOrder;
  // }

  // async getOrdersByStatus(status: Order['orderStatus'], limit: number = 50): Promise<Order[]> {
  //   const orders = await OrderModel
  //     .find({ orderStatus: status })
  //     .sort({ orderDate: -1 })
  //     .limit(limit)
  //     .lean();
  //   return orders;
  // }

  // async getTotalOrdersCount(userId?: string): Promise<number> {
  //   const filter = userId ? { userId } : {};
  //   return await OrderModel.countDocuments(filter);
  // }

  // async getTotalRevenue(startDate?: Date, endDate?: Date): Promise<number> {
  //   const matchStage: any = {
  //     'paymentInfo.paymentStatus': 'completed'
  //   };

  //   if (startDate || endDate) {
  //     matchStage.orderDate = {};
  //     if (startDate) matchStage.orderDate.$gte = startDate;
  //     if (endDate) matchStage.orderDate.$lte = endDate;
  //   }

  //   const result = await OrderModel.aggregate([
  //     { $match: matchStage },
  //     { $group: { _id: null, total: { $sum: '$orderSummary.total' } } }
  //   ]);

  //   return result[0]?.total || 0;
  // }
}
