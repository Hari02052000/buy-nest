import { container } from "tsyringe";
import { CartRepository } from "./cart.repository";
import { CartService } from "./cart.service";
import { CartController } from "./cart.controller";
import { CART_TOKENS } from "./cart.tokens";

export function registerCartModule(): void {
  container.register(CART_TOKENS.Repository, { useClass: CartRepository });
  container.register(CART_TOKENS.Service, { useClass: CartService });
  container.register(CART_TOKENS.Controller, { useClass: CartController });
}
