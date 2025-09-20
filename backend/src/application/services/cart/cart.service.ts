import { AuthorizeError, Cart, CartItem, cartProperties, ValidationError } from "@/domain/entities";
import { cartServiceInterface } from "@/domain/interfaces/services";
import { productRepositoryInterface, cartRepositoryInterface } from "@/domain/interfaces/repository";
import { tokenValidationUtillsInterface } from "@/domain/interfaces/utils";

export class CartService implements cartServiceInterface {
  constructor(
    private cartRepository: cartRepositoryInterface,
    private productRepository: productRepositoryInterface,
    private tokenUtils: tokenValidationUtillsInterface,
  ) {}

  async addToCart(userToken: string, productId: string, quantity: number): Promise<Partial<cartProperties>> {
    const isValidUser = this.tokenUtils.isValidUserToken(userToken);
    if (isValidUser.isVerified && isValidUser.payload) {
      const userId = isValidUser.payload.id!;
      const product = await this.productRepository.getSingleProduct(productId);
      if (!product) {
        throw new ValidationError("productId not exist");
      }
      let cart = await this.cartRepository.getCartByUserId(userId);
      if (!cart) {
        cart = new Cart("", userId);
        const savedCart = await this.cartRepository.saveCart(cart);
        cart = savedCart;
      }
      const updatedItems = [...cart.items];
      const existingItemIndex = updatedItems.findIndex((item) =>
        typeof item.product === "string" ? item.product === productId : item.product.id === productId,
      );

      if (existingItemIndex !== -1) {
        const existingItem = updatedItems[existingItemIndex];
        existingItem.quantity += quantity;
        if(existingItem.quantity > product.stock ) throw new ValidationError("sorry! the required unit of product not available please reduce the quantity and try again")
        existingItem.totalPrice = existingItem.quantity * existingItem.price;
      } else {
        const newItem: CartItem = {
          product: productId,
          quantity,
          price: product.price,
          totalPrice: product.price * quantity,
        };
        updatedItems.push(newItem);
      }
      const totalCartAmount = updatedItems.reduce((sum, item) => sum + item.totalPrice, 0);
      const normalizedItems: CartItem[] = updatedItems.map(item => ({
       ...item,
      product: typeof item.product === 'string' ? item.product : item.product.id!
      }));
      cart.setItem(normalizedItems);
      cart.setTotalAmount(totalCartAmount);
      const newCart = await this.cartRepository.updateCart(cart);
      return newCart.sanitizeCart();
    }
    throw new AuthorizeError();
  }
  async getCart(userToken: string): Promise<Partial<cartProperties>> {
    const isValidUser = this.tokenUtils.isValidUserToken(userToken);
    if (isValidUser.isVerified && isValidUser.payload) {
      const userId = isValidUser.payload.id!;
      let cart = await this.cartRepository.getCartByUserId(userId);
      if (!cart) {
        const newCart = new Cart("", userId);
        cart = await this.cartRepository.saveCart(newCart);
      }
      return cart.sanitizeCart();
    }
    throw new AuthorizeError();
  }

  async updateCartItem(
    userToken: string,
    productId: string,
    quantity: number,
  ): Promise<Partial<cartProperties>> {
    const isValidUser = this.tokenUtils.isValidUserToken(userToken);
    if (isValidUser.isVerified && isValidUser.payload) {
      const userId = isValidUser.payload.id!;
      const cart = await this.cartRepository.getCartByUserId(userId);
      if (!cart) throw new ValidationError();
      const updatedItems = [...cart.items];
      const itemIndex = updatedItems.findIndex((item) =>
        typeof item.product === "string" ? item.product === productId : item.product.id === productId,
      );
      if (itemIndex === -1) throw new ValidationError("Item not found in cart");

      if (quantity <= 0) {
        updatedItems.splice(itemIndex, 1);
      } else {
        const item = updatedItems[itemIndex];
        if(typeof item.product === "object"){
         if(quantity > item.product.stock! ) throw new ValidationError("sorry! the required unit of product not available please reduce the quantity and try again")
        }
        item.quantity = quantity;
        item.totalPrice = item.price * quantity;
      }
      const totalCartAmount = updatedItems.reduce((sum, item) => sum + item.totalPrice, 0);
      const normalizedItems: CartItem[] = updatedItems.map(item => ({
       ...item,
      product: typeof item.product === 'string' ? item.product : item.product.id!
      }));

      cart.setItem(normalizedItems);
      cart.setTotalAmount(totalCartAmount);
      const newCart = await this.cartRepository.updateCart(cart);
      return newCart.sanitizeCart();
    }
    throw new AuthorizeError();
  }

  async removeFromCart(userToken: string, productId: string): Promise<Partial<cartProperties>> {
    const isValidUser = this.tokenUtils.isValidUserToken(userToken);
    if (isValidUser.isVerified && isValidUser.payload) {
      const userId = isValidUser.payload.id!;
      const cart = await this.cartRepository.getCartByUserId(userId);
      if (!cart) throw new ValidationError("Cart not found");
      const updatedItems = [...cart.items];
      const itemIndex = updatedItems.findIndex((item) =>
        typeof item.product === "string" ? item.product === productId : item.product.id === productId,
      );
      if (itemIndex === -1) throw new ValidationError("Item not found in cart");
      updatedItems.splice(itemIndex, 1);
      const totalCartAmount = updatedItems.reduce((sum, item) => sum + item.totalPrice, 0);
      cart.setItem(updatedItems);
      cart.setTotalAmount(totalCartAmount);
      const newCart = await this.cartRepository.updateCart(cart);
      return newCart.sanitizeCart();
    }
    throw new AuthorizeError();
  }

  async clearCart(userToken: string): Promise<Partial<cartProperties>> {
    const isValidUser = this.tokenUtils.isValidUserToken(userToken);
    if (isValidUser.isVerified && isValidUser.payload) {
      const userId = isValidUser.payload.id!;
      const cart = await this.cartRepository.getCartByUserId(userId);
      if (!cart) throw new ValidationError("Cart not found");
      cart.setItem([]);
      cart.setTotalAmount(0);
      const newCart = await this.cartRepository.updateCart(cart);
      return newCart.sanitizeCart();
    }
    throw new AuthorizeError();
  }
}
