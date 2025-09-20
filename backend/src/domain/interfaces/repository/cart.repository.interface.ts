import { Cart } from "@/domain/entities";

export interface cartRepositoryInterface {
  saveCart(cart: Cart): Promise<Cart>;
  getCartByUserId(userId: string): Promise<Cart | null>;
  updateCart(cart: Cart): Promise<Cart>;
  deleteCart(userId: string): Promise<boolean>;
  mapToCart(cartDb: unknown): Cart;
}
