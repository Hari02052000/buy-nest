// import { Order, CreateOrderRequest } from '@/domain/entities/order';
// import { createPaymentResponse, paymentUtillsInterface, verifyPaymentResponse } from '@/domain/interfaces/utils';
// import { OrderRepository } from '@/infrastructure/repository/order.repository';
// import { CartRepository } from '@/infrastructure/repository';
// import { CustomError, ValidationError } from '@/domain/entities/errors';
// import { STATUS_CODES } from '@/domain/entities/status.code';

import {
  addressProperties,
  AuthorizeError,
  Order,
  orderItem,
  orderProperties,
  productProperties,
  ValidationError,
} from "@/domain/entities";
import { cartRepositoryInterface, productRepositoryInterface } from "@/domain/interfaces/repository";
import { OrderRepositoryInterface } from "@/domain/interfaces/repository/order.repository.interface";
import { OrderServiceInterface } from "@/domain/interfaces/services";
import {
  createPaymentResponse,
  paymentUtillsInterface,
  tokenValidationUtillsInterface,
} from "@/domain/interfaces/utils";
import { orderUtillsInterface } from "@/domain/interfaces/utils/order.utills.interface";

// import { invoiceUtils } from '@/infrastructure/utils';

// export class OrderService {
//   private orderRepository: OrderRepository;
//   private cartRepository: CartRepository;
//   private paymentUtils:paymentUtillsInterface
//   constructor(orderRepository: OrderRepository, cartRepository: CartRepository,paymentUtils:paymentUtillsInterface) {
//     this.orderRepository = orderRepository;
//     this.cartRepository = cartRepository;
//     this.paymentUtils = paymentUtils;
//   }

//   async createOrder(userId: string, orderData: CreateOrderRequest): Promise<Order|createPaymentResponse> {
//     try {
//       this.validateOrderData(orderData);
//       // const order = await this.orderRepository.createOrder({
//       //   ...orderData,
//       //   userId
//       // });

//      if(orderData.paymentMethod === "online"){
//       // const response = await this.paymentUtils.createPayment(orderData.totalAmount,order.orderId,userId)
//       // return response
//      }
//      else{

//       await this.cartRepository.deleteCart(userId);
//       return order;
//      }

//     } catch (error) {
//       throw new CustomError(
//         'Failed to create order',
//         STATUS_CODES.INTERNAL_ERROR,
//         error instanceof Error ? error.message : 'Unknown error'
//       );
//     }
//   }
//   async verifyOnlinePayment(userId: string, paymentId:string,orderId:string):Promise<verifyPaymentResponse>{
//     if(!userId || !paymentId || !orderId) throw new ValidationError()
//    const response = await this.paymentUtils.verifyPayment(paymentId)
//   if(response.isPayed){
//    await this.cartRepository.deleteCart(userId)
//    const order = await this.orderRepository.getOrderById(orderId)
//    if(!order) throw new ValidationError("invalid order Id")
//    if (order.deliveryMethod === 'delivery') {
//         const estimatedDate = new Date();
//         estimatedDate.setDate(estimatedDate.getDate() + 7);
//       }

//   }
//    return response
//   }

//   async getOrderById(orderId: string, userId?: string): Promise<Order> {
//     const order = await this.orderRepository.getOrderById(orderId);

//     if (!order) {
//       throw new CustomError(
//         'Order not found',
//         STATUS_CODES.NOT_FOUND,
//         `Order with ID ${orderId} does not exist`
//       );
//     }

//     // If userId is provided, ensure the order belongs to the user
//     if (userId && order.userId !== userId) {
//       throw new CustomError(
//         'Unauthorized access to order',
//         STATUS_CODES.FORBIDDEN,
//         'You do not have permission to view this order'
//       );
//     }

//     return order;
//   }

//   async getUserOrders(userId: string, limit: number = 10, skip: number = 0): Promise<Order[]> {
//     return await this.orderRepository.getOrdersByUserId(userId, limit, skip);
//   }

//   async updateOrderStatus(orderId: string, status: Order['orderStatus']): Promise<Order> {
//     const updatedOrder = await this.orderRepository.updateOrderStatus(orderId, status);

//     if (!updatedOrder) {
//       throw new CustomError(
//         'Order not found',
//         STATUS_CODES.NOT_FOUND,
//         `Order with ID ${orderId} does not exist`
//       );
//     }

//     return updatedOrder;
//   }

//   async updatePaymentStatus(
//     orderId: string,
//     paymentStatus: Order['paymentInfo']['paymentStatus'],
//     transactionId?: string
//   ): Promise<Order> {
//     const updatedOrder = await this.orderRepository.updatePaymentStatus(
//       orderId,
//       paymentStatus,
//       transactionId
//     );

//     if (!updatedOrder) {
//       throw new CustomError(
//         'Order not found',
//         STATUS_CODES.NOT_FOUND,
//         `Order with ID ${orderId} does not exist`
//       );
//     }

//     // If payment is completed, update order status to confirmed
//     if (paymentStatus === 'completed' && updatedOrder.orderStatus === 'pending') {
//       await this.orderRepository.updateOrderStatus(orderId, 'confirmed');
//     }

//     return updatedOrder;
//   }

//   async addTrackingNumber(orderId: string, trackingNumber: string): Promise<Order> {
//     const updatedOrder = await this.orderRepository.addTrackingNumber(orderId, trackingNumber);

//     if (!updatedOrder) {
//       throw new CustomError(
//         'Order not found',
//         STATUS_CODES.NOT_FOUND,
//         `Order with ID ${orderId} does not exist`
//       );
//     }

//     return updatedOrder;
//   }

//   async getOrdersByStatus(status: Order['orderStatus']): Promise<Order[]> {
//     return await this.orderRepository.getOrdersByStatus(status);
//   }

//   async generateInvoiceData(orderId: string): Promise<any> {
//     const order = await this.getOrderById(orderId);
//     return invoiceUtils.generateInvoiceData(order);
//   }

//   async generateInvoicePDF(orderId: string): Promise<Buffer> {
//     const order = await this.getOrderById(orderId);
//     return await invoiceUtils.generateInvoicePDF(order);
//   }

//   async saveInvoiceToFile(orderId: string, filePath: string): Promise<string> {
//     const order = await this.getOrderById(orderId);
//     const pdfBuffer = await invoiceUtils.generateInvoicePDF(order);
//     await import('fs/promises').then(fs => fs.writeFile(filePath, pdfBuffer));
//     return filePath;
//   }

//   async getInvoiceFilename(orderId: string): Promise<string> {
//     const order = await this.getOrderById(orderId);
//     return invoiceUtils.generateInvoiceFilename(order);
//   }

//   // Add new methods for Stripe integration
//   async updatePaymentIntentId(orderId: string, paymentIntentId: string): Promise<Order> {
//     const updatedOrder = await this.orderRepository.updatePaymentIntentId(orderId, paymentIntentId);

//     if (!updatedOrder) {
//       throw new CustomError(
//         'Order not found',
//         STATUS_CODES.NOT_FOUND,
//         `Order with ID ${orderId} does not exist`
//       );
//     }

//     return updatedOrder;
//   }

//   async sendOrderConfirmationEmail(orderId: string): Promise<void> {
//     try {
//       const order = await this.getOrderById(orderId);

//       // Import email utils
//       const { emailUtils } = await import('@/infrastructure/utils/email.utils.js');

//       // Get customer email from order (assuming userId contains email or you have a user service)
//       const customerEmail = order.userId; // You might need to get actual email from user service

//       // Send email with order and customer email
//       await emailUtils.sendOrderConfirmationEmail(order, customerEmail);
//     } catch (error) {
//       console.error('Failed to send order confirmation email:', error);
//       // Don't throw error as this shouldn't block the payment process
//     }
//   }

//   private validateOrderData(orderData: CreateOrderRequest): void {
//     if (!orderData.items || orderData.items.length === 0) {
//       throw new CustomError(
//         'Invalid order data',
//         STATUS_CODES.BAD_REQUEST,
//         'Order must contain at least one item'
//       );
//     }

//     if (!orderData.addressId) {
//       throw new CustomError(
//         'Invalid order data',
//         STATUS_CODES.BAD_REQUEST,
//         'Shipping address is required'
//       );
//     }

//     if (!orderData.paymentMethod) {
//       throw new CustomError(
//         'Invalid order data',
//         STATUS_CODES.BAD_REQUEST,
//         'Payment information is required'
//       );
//     }

//     if (orderData.totalAmount <= 0) {
//       throw new CustomError(
//         'Invalid order data',
//         STATUS_CODES.BAD_REQUEST,
//         'Order total must be greater than zero'
//       );
//     }
//   }
// }
export class orderService implements OrderServiceInterface {
  private orderUtils: orderUtillsInterface;
  private paymentUtils: paymentUtillsInterface;
  private orederRepo: OrderRepositoryInterface;
  private cartRepo: cartRepositoryInterface;
  private productRepo: productRepositoryInterface;
  private tokenUtils: tokenValidationUtillsInterface;
  constructor(
    orderUtils: orderUtillsInterface,
    paymentUtils: paymentUtillsInterface,
    orederRepo: OrderRepositoryInterface,
    cartRepo: cartRepositoryInterface,
    tokenUtils: tokenValidationUtillsInterface,
    productRepo: productRepositoryInterface,
  ) {
    this.cartRepo = cartRepo;
    this.orderUtils = orderUtils;
    this.paymentUtils = paymentUtils;
    this.orederRepo = orederRepo;
    this.tokenUtils = tokenUtils;
    this.productRepo = productRepo;
  }
  async getAdminSingleOrder(adminToken: string, orderId: string): Promise<orderProperties> {
    const isValidToken = this.tokenUtils.isValidAdminToken(adminToken);
    if (isValidToken && isValidToken.isVerified) {
      const order = await this.orederRepo.findById(orderId);
      if (!order) throw new ValidationError();
      return order.sanitizeOrder();
    }
    throw new AuthorizeError();
  }
  async getAdminAllOrders(
    adminToken: string,
    limit: number,
    page: number,
    paymentStatus?: "pending" | "processing" | "completed" | "failed" | "refunded",
    orderStatus?: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled",
    paymentMethod?: "cod" | "online",
    appliedCoupon?: string,
  ): Promise<orderProperties[]> {
    const isValidToken = this.tokenUtils.isValidAdminToken(adminToken);
    if (isValidToken && isValidToken.isVerified) {
      const orders = await this.orederRepo.getAllOrders(0, 0, paymentStatus, orderStatus, paymentMethod);
      return orders.map((order) => order.sanitizeOrder());
    }
    throw new AuthorizeError();
  }
  async getCurentUserOrder(userToken: string): Promise<orderProperties[]> {
    const isValidUser = this.tokenUtils.isValidUserToken(userToken);
    if (isValidUser && isValidUser.isVerified) {
      const orders = await this.orederRepo.findByUserId(isValidUser.payload.id!);
      return orders.map((order) => order.sanitizeOrder());
    }
    throw new AuthorizeError();
  }
  async cancelOrderId(userToken: string, orderId: string): Promise<orderProperties> {
    const isValidUser = this.tokenUtils.isValidUserToken(userToken);
    if (isValidUser && isValidUser.isVerified) {
      const order = await this.orederRepo.findById(orderId);
      if (order) {
        let orderdUserId;
        if (typeof order.user === "string") orderdUserId = order.user;
        if (typeof order.user === "object") orderdUserId = order.user.id!;
        if (
          orderdUserId == isValidUser.payload.id &&
          (order.orderStatus === "pending" || order.orderStatus === "processing")
        ) {
          const productIds = order.items.map((order) =>
            typeof order.productId === "string" ? order.productId : order.productId.id!,
          );
          const products = await this.productRepo.getProductByIds(productIds);
          for (const orderItem of order.items) {
            let productId: string;
            if (typeof orderItem.productId === "string") productId = orderItem.productId;
            if (typeof orderItem.productId === "object") productId = orderItem.productId.id!;
            const product = products.find((prod) => prod.id == productId);
            if (product) {
              const stock = product.stock;
              const incresedStock = stock + orderItem.quantity;
              product.setStock(incresedStock);
              await this.productRepo.saveProduct(product);
            }
          }
          order.setOrderStatus("cancelled");
          const cancelledOrder = await this.orederRepo.update(order);
          if (cancelledOrder) return cancelledOrder.sanitizeOrder();
        }
      }
    }
    throw new AuthorizeError();
  }
  async editOrderId(adminToken: string, orderId: string, orderProp: unknown): Promise<orderProperties> {
    const isValidAdmin = this.tokenUtils.isValidAdminToken(adminToken);
    if (isValidAdmin && isValidAdmin.isVerified) {
      const updatedDetails = this.orderUtils.editOrderRequestValidator(orderProp);
      const order = await this.orederRepo.findById(orderId);
      if (order && updatedDetails) {
        if (updatedDetails.orderStatus) {
          if (updatedDetails.orderStatus === "cancelled") {
            if (order.paymentInfo.method === "online" && order.paymentInfo.paymentStatus === "completed") {
              throw new AuthorizeError("you cant cancel the users payed order");
            }
            const productIds = order.items.map((order) =>
              typeof order.productId === "string" ? order.productId : order.productId.id!,
            );
            const products = await this.productRepo.getProductByIds(productIds);
            for (const orderItem of order.items) {
              let productId: string;
              if (typeof orderItem.productId === "string") productId = orderItem.productId;
              if (typeof orderItem.productId === "object") productId = orderItem.productId.id!;
              const product = products.find((prod) => prod.id == productId);
              if (product) {
                const stock = product.stock;
                const incresedStock = stock + orderItem.quantity;
                product.setStock(incresedStock);
                await this.productRepo.saveProduct(product);
              }
            }
            order.setOrderStatus("cancelled");
          } else {
            order.setOrderStatus(updatedDetails.orderStatus);
          }
        }
        if (updatedDetails.paymentStatus) {
          if (
            updatedDetails.paymentStatus === "failed" &&
            order.paymentInfo.method === "online" &&
            order.paymentInfo.paymentStatus === "completed"
          ) {
            throw new AuthorizeError("the user is alredy payed via online");
          }
          order.setPaymentStatus(updatedDetails.paymentStatus);
        }

        if (updatedDetails.paymentIntentId) {
          order.setPaymentIntentId(updatedDetails.paymentIntentId);
        }
        if (updatedDetails.transactionId) {
          order.setTransactionId(updatedDetails.transactionId);
        }
        const updatedOrder = await this.orederRepo.update(order);
        if (!updatedOrder) throw new ValidationError();
        return updatedOrder.sanitizeOrder();
      }
    }
    throw new AuthorizeError();
  }
  async getOrderById(userToken: string, orderId: string): Promise<orderProperties> {
    const isValidToken = this.tokenUtils.isValidUserToken(userToken);
    if (isValidToken) {
      const curentUser = isValidToken.payload.id;
      const order = await this.orederRepo.findById(orderId);
      if (!order) throw new ValidationError();
      let orderUser;
      typeof order.user === "string" ? (orderUser = order.user) : (orderUser = order.user.id);
      if (orderUser == curentUser) return order.sanitizeOrder();
    }
    throw new ValidationError();
  }
  async verifyOnlinePayment(userToken: string, paymentId: string): Promise<orderProperties> {
    if (!paymentId || paymentId.trim().length === 0) throw new ValidationError();
    const isValidToken = this.tokenUtils.isValidUserToken(userToken);
    if (isValidToken) {
      const paymentInfo = await this.paymentUtils.verifyPayment(paymentId);
      if (paymentInfo.isPayed && paymentInfo.paymentResponse && paymentInfo.orderId) {
        const order = await this.orederRepo.findById(paymentInfo.orderId);
        if (!order) throw new ValidationError();
        order.setPaymentIntentId(paymentId);
        order.setPaymentStatus("completed");
        await this.orederRepo.update(order);
        await this.cartRepo.deleteCart(isValidToken.payload.id!);
        return order.sanitizeOrder();
      } else {
        throw new ValidationError("payment failed re order again");
      }
    }
    throw new ValidationError();
  }
  async createOrder(userToken: string, reqBody: unknown): Promise<orderProperties | createPaymentResponse> {
    const isValidToken = this.tokenUtils.isValidUserToken(userToken);
    if (isValidToken.isVerified && isValidToken.payload) {
      const isValidInput = this.orderUtils.createOrderRequestValidator(reqBody);
      if (isValidInput) {
        const userid = isValidToken.payload.id!;
        const userCart = await this.cartRepo.getCartByUserId(userid);
        if (!userCart) throw new ValidationError("cart not found");
        const productsWithQuantity = userCart.items.map((item) => ({
          productid: typeof item.product === "string" ? item.product : item.product.id!,
          quantity: item.quantity,
        }));
        const products = await this.productRepo.getProductByIds(
          productsWithQuantity.map((item) => item.productid),
        );
        for (const { productid, quantity } of productsWithQuantity) {
          const product = products.find((produ) => produ.id == productid);
          if (!product) throw new ValidationError("requested product not found");
          if (product.stock < quantity)
            throw new ValidationError(`${product.name} have limited stock cant process your order`);
          const oldStock = product.stock;
          const reducedStock = oldStock - quantity;
          product.setStock(reducedStock);
        }
        //find cart totel
        const cartTotel = userCart.totalAmount;
        //check coupon is applied or not
        let totalAmountPayable;
        let couponId;
        if (isValidInput.coupon.couponId && isValidInput.coupon.isApplied) {
          //if aplied reduce the amount as discount
          totalAmountPayable = cartTotel;
          couponId = isValidInput.coupon.couponId;
        } else {
          totalAmountPayable = cartTotel;
        }
        const orderItems = [] as orderItem[];
        userCart.items.forEach((item) => {
          const orderItem = {} as orderItem;
          orderItem.price = item.price;
          orderItem.productId = typeof item.product === "string" ? item.product : item.product.id!;
          orderItem.quantity = item.quantity;
          orderItem.totalPrice = item.totalPrice;
          orderItems.push(orderItem);
        });
        const addressId = isValidInput.addressId;
        const paymentMethod = isValidInput.paymentMethod;
        const order = new Order(
          "",
          orderItems,
          addressId,
          userid,
          paymentMethod,
          totalAmountPayable,
          couponId,
        );
        const OrderDb = await this.orederRepo.create(order);
        await Promise.all(
          products.map(async (product) => {
            await this.productRepo.editProduct(product);
          }),
        );
        if (isValidInput.paymentMethod === "cod") {
          await this.cartRepo.deleteCart(userid);
          return OrderDb.sanitizeOrder();
        }
        if (isValidInput.paymentMethod === "online") {
          const address = OrderDb.address as Partial<addressProperties>;
          const response = await this.paymentUtils.createPayment(
            OrderDb.paymentInfo.payableAmount,
            OrderDb.id,
            userid,
          );
          return response;
        }
      }
    }
    throw new ValidationError("invalid request give all details");
  }
}
