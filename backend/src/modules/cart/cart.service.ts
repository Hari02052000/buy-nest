import { injectable, inject } from "tsyringe";
import { CartRepository } from "./cart.repository";
import { Cart as CartEntity } from "./cart.entity";
import type { CartItem, SanitizedCart } from "./cart.entity";
import { ProductRepository } from "@/modules/product/product.repository";
import { PRODUCT_TOKENS } from "@/modules/product/product.tokens";
import { ValidationError, NotFoundError } from "@/shared/errors";

@injectable()
export class CartService {
  constructor(
    private cartRepo: CartRepository,
    @inject(PRODUCT_TOKENS.Repository) private productRepo: ProductRepository,
  ) {}

  async addToCart(userId: string, productId: string, quantity: number): Promise<SanitizedCart> {
    const product = await this.productRepo.findById(productId);
    if (!product) throw new ValidationError("Product not found");
    if (!product.isListed) throw new ValidationError("Product is not available");
    if (quantity > product.stock) {
      throw new ValidationError("Insufficient stock available");
    }

    let cart = await this.cartRepo.findByUserId(userId);
    if (!cart) {
      cart = CartEntity.create({ userId });
      cart = await this.cartRepo.save(cart);
    }

    const items = [...cart.items];
    const existingIndex = items.findIndex((item) => item.product === productId);

    if (existingIndex !== -1) {
      const existingItem = items[existingIndex];
      const newQuantity = existingItem.quantity + quantity;
      if (newQuantity > product.stock) {
        throw new ValidationError("Insufficient stock available");
      }
      items[existingIndex] = {
        ...existingItem,
        quantity: newQuantity,
        totalPrice: existingItem.price * newQuantity,
      };
    } else {
      items.push({
        product: productId,
        quantity,
        price: product.price,
        totalPrice: product.price * quantity,
      });
    }

    this.applyCartUpdates(cart, items);
    const updated = await this.cartRepo.update(cart);
    return updated.sanitize();
  }

  async getCart(userId: string): Promise<SanitizedCart> {
    let cart = await this.cartRepo.findByUserId(userId);
    if (!cart) {
      cart = CartEntity.create({ userId });
      cart = await this.cartRepo.save(cart);
    }
    return cart.sanitize();
  }

  async updateCartItem(userId: string, productId: string, quantity: number): Promise<SanitizedCart> {
    const cart = await this.cartRepo.findByUserId(userId);
    if (!cart) throw new NotFoundError("Cart not found");

    const items = [...cart.items];
    const itemIndex = items.findIndex((item) => item.product === productId);
    if (itemIndex === -1) throw new ValidationError("Item not found in cart");

    if (quantity <= 0) {
      items.splice(itemIndex, 1);
    } else {
      const product = await this.productRepo.findById(productId);
      if (!product) throw new ValidationError("Product not found");
      if (quantity > product.stock) {
        throw new ValidationError("Insufficient stock available");
      }

      items[itemIndex] = {
        ...items[itemIndex],
        quantity,
        totalPrice: items[itemIndex].price * quantity,
      };
    }

    this.applyCartUpdates(cart, items);
    const updated = await this.cartRepo.update(cart);
    return updated.sanitize();
  }

  async removeFromCart(userId: string, productId: string): Promise<SanitizedCart> {
    const cart = await this.cartRepo.findByUserId(userId);
    if (!cart) throw new NotFoundError("Cart not found");

    const items = [...cart.items];
    const itemIndex = items.findIndex((item) => item.product === productId);
    if (itemIndex === -1) throw new ValidationError("Item not found in cart");

    items.splice(itemIndex, 1);

    this.applyCartUpdates(cart, items);
    const updated = await this.cartRepo.update(cart);
    return updated.sanitize();
  }

  async clearCart(userId: string): Promise<SanitizedCart> {
    const cart = await this.cartRepo.findByUserId(userId);
    if (!cart) throw new NotFoundError("Cart not found");

    this.applyCartUpdates(cart, []);
    cart.setAppliedCoupon(null);
    cart.setDiscountAmount(0);
    const updated = await this.cartRepo.update(cart);
    return updated.sanitize();
  }

  private applyCartUpdates(cart: CartEntity, items: CartItem[]): void {
    const totalAmount = items.reduce((sum, item) => sum + item.totalPrice, 0);
    cart.setItems(items);
    cart.setTotalAmount(totalAmount);
  }
}
