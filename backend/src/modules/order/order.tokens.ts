import { container } from "tsyringe";
import { OrderRepository } from "./order.repository";
import { OrderService } from "./order.service";
import { OrderController } from "./order.controller";
import { CartRepository } from "@/modules/cart/cart.repository";
import { ProductRepository } from "@/modules/product/product.repository";
import { CouponRepository } from "@/modules/coupon/coupon.repository";

export const ORDER_TOKENS = {
  Repository: Symbol("OrderRepository"),
  Service: Symbol("OrderService"),
  Controller: Symbol("OrderController"),
  CartRepository: Symbol("CartRepository"),
  ProductRepository: Symbol("ProductRepository"),
  CouponRepository: Symbol("CouponRepository"),
};

export function registerOrderModule(): void {
  container.register(ORDER_TOKENS.Repository, { useClass: OrderRepository });
  container.register(ORDER_TOKENS.CartRepository, { useClass: CartRepository });
  container.register(ORDER_TOKENS.ProductRepository, { useClass: ProductRepository });
  container.register(ORDER_TOKENS.CouponRepository, { useClass: CouponRepository });
  container.register(ORDER_TOKENS.Service, { useClass: OrderService });
  container.register(ORDER_TOKENS.Controller, { useClass: OrderController });
}
