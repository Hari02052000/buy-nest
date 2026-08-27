import { injectable, inject } from "tsyringe";
import type { OrderRepository } from "./order.repository";
import { Order as OrderEntity } from "./order.entity";
import type { OrderItem, SanitizedOrder } from "./order.entity";
import { ORDER_TOKENS } from "./order.tokens";
import type { CartRepository } from "@/modules/cart/cart.repository";
import type { ProductRepository } from "@/modules/product/product.repository";
import type { CouponRepository } from "@/modules/coupon/coupon.repository";
import { ValidationError, AuthorizeError } from "@/shared/errors";
import { validateCreateOrder } from "@/shared/validators/order.validator";

interface OrderFilters {
  paymentStatus?: string;
  orderStatus?: string;
  paymentMethod?: string;
  appliedCoupon?: string;
}

@injectable()
export class OrderService {
  constructor(
    @inject(ORDER_TOKENS.Repository) private orderRepo: OrderRepository,
    @inject(ORDER_TOKENS.CartRepository) private cartRepo: CartRepository,
    @inject(ORDER_TOKENS.ProductRepository) private productRepo: ProductRepository,
    @inject(ORDER_TOKENS.CouponRepository) private couponRepo: CouponRepository,
  ) {}

  async createOrder(userId: string, reqBody: unknown): Promise<SanitizedOrder> {
    const input = validateCreateOrder(reqBody);

    const userCart = await this.cartRepo.findByUserId(userId);
    if (!userCart) throw new ValidationError("Cart not found");
    if (userCart.items.length === 0) throw new ValidationError("Cart is empty");

    const productIds = userCart.items.map((item) => item.product);
    const products = await this.productRepo.findByIds(productIds);

    for (const item of userCart.items) {
      const product = products.find((p) => p.id === item.product);
      if (!product) throw new ValidationError(`Product not found: ${item.product}`);
      if (product.stock < item.quantity) {
        throw new ValidationError(`${product.name} has insufficient stock`);
      }
    }

    // Use current product prices instead of stale cart prices
    let totalAmountPayable = 0;
    const orderItems: OrderItem[] = userCart.items.map((item) => {
      const product = products.find((p) => p.id === item.product);
      const currentPrice = product ? product.price : item.price;
      const totalPrice = currentPrice * item.quantity;
      totalAmountPayable += totalPrice;
      return {
        productId: item.product,
        quantity: item.quantity,
        price: currentPrice,
        totalPrice,
      };
    });

    // Apply coupon discount if applicable
    let discountAmount = 0;
    let couponId: string | undefined;

    if (input.coupon?.isApplied && input.coupon.couponId) {
      const coupon = await this.couponRepo.findById(input.coupon.couponId);
      if (coupon && coupon.canBeUsed && totalAmountPayable >= coupon.minimumOrderAmount) {
        if (coupon.discountType === "percentage") {
          discountAmount = (totalAmountPayable * coupon.discountValue) / 100;
          if (coupon.maxDiscountAmount > 0) {
            discountAmount = Math.min(discountAmount, coupon.maxDiscountAmount);
          }
        } else {
          discountAmount = Math.min(coupon.discountValue, totalAmountPayable);
        }
        couponId = coupon.id;
        await this.couponRepo.incrementUsageCount(coupon.id);
      }
    }

    const finalAmount = totalAmountPayable - discountAmount;

    const order = OrderEntity.create({
      items: orderItems,
      address: input.addressId,
      user: userId,
      paymentMethod: input.paymentMethod,
      payableAmount: finalAmount,
      appliedCoupon: couponId,
    });

    const savedOrder = await this.orderRepo.create(order);

    // Decrease stock
    for (const item of userCart.items) {
      const product = products.find((p) => p.id === item.product);
      if (product) {
        const newStock = product.stock - item.quantity;
        await this.productRepo.update(product.id, { stock: newStock });
      }
    }

    // Clear cart for all payment methods
    await this.cartRepo.delete(userId);

    return savedOrder.sanitize();
  }

  async verifyOnlinePayment(userId: string, paymentId: string): Promise<SanitizedOrder> {
    if (!paymentId || paymentId.trim().length === 0) {
      throw new ValidationError("Payment ID is required");
    }

    // TODO: Implement Stripe payment verification
    throw new ValidationError("Online payment verification not yet implemented");
  }

  async getOrderById(userId: string, orderId: string): Promise<SanitizedOrder> {
    const order = await this.orderRepo.findById(orderId);
    if (!order) throw new ValidationError("Order not found");

    const orderUserId = typeof order.user === "string" ? order.user : (order.user as any).id;
    if (orderUserId !== userId) {
      throw new ValidationError("Unauthorized access");
    }

    return order.sanitize();
  }

  async cancelOrder(userId: string, orderId: string): Promise<SanitizedOrder> {
    const order = await this.orderRepo.findById(orderId);
    if (!order) throw new ValidationError("Order not found");

    const orderUserId = typeof order.user === "string" ? order.user : (order.user as any).id;
    if (orderUserId !== userId) {
      throw new AuthorizeError("Unauthorized");
    }

    if (order.orderStatus !== "pending" && order.orderStatus !== "processing") {
      throw new ValidationError("Order cannot be cancelled at this stage");
    }

    // Restore stock
    const productIds = order.items.map((item) => item.productId);
    const products = await this.productRepo.findByIds(productIds);

    for (const orderItem of order.items) {
      const product = products.find((p) => p.id === orderItem.productId);
      if (product) {
        const newStock = product.stock + orderItem.quantity;
        await this.productRepo.update(product.id, { stock: newStock });
      }
    }

    order.setOrderStatus("cancelled");
    const cancelledOrder = await this.orderRepo.update(order);
    if (!cancelledOrder) throw new ValidationError("Failed to cancel order");

    return cancelledOrder.sanitize();
  }

  async editOrder(orderId: string, updates: {
    orderStatus?: string;
    paymentStatus?: string;
    paymentIntentId?: string;
    transactionId?: string;
  }): Promise<SanitizedOrder> {
    const order = await this.orderRepo.findById(orderId);
    if (!order) throw new ValidationError("Order not found");

    if (updates.orderStatus) {
      if (updates.orderStatus === "cancelled") {
        if (order.paymentInfo.method === "online" && order.paymentInfo.paymentStatus === "completed") {
          throw new AuthorizeError("Cannot cancel a paid online order");
        }
        // Restore stock
        const productIds = order.items.map((item) => item.productId);
        const products = await this.productRepo.findByIds(productIds);
        for (const orderItem of order.items) {
          const product = products.find((p) => p.id === orderItem.productId);
          if (product) {
            const newStock = product.stock + orderItem.quantity;
            await this.productRepo.update(product.id, { stock: newStock });
          }
        }
      }
      order.setOrderStatus(updates.orderStatus);
    }

    if (updates.paymentStatus) {
      if (
        updates.paymentStatus === "failed" &&
        order.paymentInfo.method === "online" &&
        order.paymentInfo.paymentStatus === "completed"
      ) {
        throw new AuthorizeError("Cannot mark paid online order as failed");
      }
      order.setPaymentStatus(updates.paymentStatus);
    }

    if (updates.paymentIntentId) {
      order.setPaymentIntentId(updates.paymentIntentId);
    }
    if (updates.transactionId) {
      order.setTransactionId(updates.transactionId);
    }

    const updatedOrder = await this.orderRepo.update(order);
    if (!updatedOrder) throw new ValidationError("Failed to update order");

    return updatedOrder.sanitize();
  }

  async getAdminSingleOrder(orderId: string): Promise<SanitizedOrder> {
    const order = await this.orderRepo.findById(orderId);
    if (!order) throw new ValidationError("Order not found");
    return order.sanitize();
  }

  async getAdminAllOrders(
    limit: number,
    page: number,
    filters: OrderFilters,
  ): Promise<SanitizedOrder[]> {
    const skip = (page - 1) * limit;
    const orders = await this.orderRepo.getAll(limit, skip, filters);
    return orders.map((order) => order.sanitize());
  }

  async getCurrentUserOrders(userId: string): Promise<SanitizedOrder[]> {
    const orders = await this.orderRepo.findByUserId(userId);
    return orders.map((order) => order.sanitize());
  }
}
