import { Cart, cartProperties } from "@/domain/entities";

export interface cartServiceInterface {
  addToCart(userToken: string, productId: string, quantity: number): Promise<Partial<cartProperties>>;
  getCart(userToken: string): Promise<Partial<cartProperties>>;
  updateCartItem(userToken: string, productId: string, quantity: number): Promise<Partial<cartProperties>>;
  removeFromCart(userToken: string, productId: string): Promise<Partial<cartProperties>>;
  clearCart(userToken: string): Promise<Partial<cartProperties>>;
}
