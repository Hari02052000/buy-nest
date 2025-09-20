"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartService = void 0;
const entities_1 = require("../../../domain/entities");
class CartService {
    constructor(cartRepository, productRepository, tokenUtils) {
        this.cartRepository = cartRepository;
        this.productRepository = productRepository;
        this.tokenUtils = tokenUtils;
    }
    addToCart(userToken, productId, quantity) {
        return __awaiter(this, void 0, void 0, function* () {
            const isValidUser = this.tokenUtils.isValidUserToken(userToken);
            if (isValidUser.isVerified && isValidUser.payload) {
                const userId = isValidUser.payload.id;
                const product = yield this.productRepository.getSingleProduct(productId);
                if (!product) {
                    throw new entities_1.ValidationError("productId not exist");
                }
                let cart = yield this.cartRepository.getCartByUserId(userId);
                if (!cart) {
                    cart = new entities_1.Cart("", userId);
                    const savedCart = yield this.cartRepository.saveCart(cart);
                    cart = savedCart;
                }
                const updatedItems = [...cart.items];
                const existingItemIndex = updatedItems.findIndex((item) => typeof item.product === "string" ? item.product === productId : item.product.id === productId);
                if (existingItemIndex !== -1) {
                    const existingItem = updatedItems[existingItemIndex];
                    existingItem.quantity += quantity;
                    if (existingItem.quantity > product.stock)
                        throw new entities_1.ValidationError("sorry! the required unit of product not available please reduce the quantity and try again");
                    existingItem.totalPrice = existingItem.quantity * existingItem.price;
                }
                else {
                    const newItem = {
                        product: productId,
                        quantity,
                        price: product.price,
                        totalPrice: product.price * quantity,
                    };
                    updatedItems.push(newItem);
                }
                const totalCartAmount = updatedItems.reduce((sum, item) => sum + item.totalPrice, 0);
                const normalizedItems = updatedItems.map(item => (Object.assign(Object.assign({}, item), { product: typeof item.product === 'string' ? item.product : item.product.id })));
                cart.setItem(normalizedItems);
                cart.setTotalAmount(totalCartAmount);
                const newCart = yield this.cartRepository.updateCart(cart);
                return newCart.sanitizeCart();
            }
            throw new entities_1.AuthorizeError();
        });
    }
    getCart(userToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const isValidUser = this.tokenUtils.isValidUserToken(userToken);
            if (isValidUser.isVerified && isValidUser.payload) {
                const userId = isValidUser.payload.id;
                let cart = yield this.cartRepository.getCartByUserId(userId);
                if (!cart) {
                    const newCart = new entities_1.Cart("", userId);
                    cart = yield this.cartRepository.saveCart(newCart);
                }
                return cart.sanitizeCart();
            }
            throw new entities_1.AuthorizeError();
        });
    }
    updateCartItem(userToken, productId, quantity) {
        return __awaiter(this, void 0, void 0, function* () {
            const isValidUser = this.tokenUtils.isValidUserToken(userToken);
            if (isValidUser.isVerified && isValidUser.payload) {
                const userId = isValidUser.payload.id;
                const cart = yield this.cartRepository.getCartByUserId(userId);
                if (!cart)
                    throw new entities_1.ValidationError();
                const updatedItems = [...cart.items];
                const itemIndex = updatedItems.findIndex((item) => typeof item.product === "string" ? item.product === productId : item.product.id === productId);
                if (itemIndex === -1)
                    throw new entities_1.ValidationError("Item not found in cart");
                if (quantity <= 0) {
                    updatedItems.splice(itemIndex, 1);
                }
                else {
                    const item = updatedItems[itemIndex];
                    if (typeof item.product === "object") {
                        if (quantity > item.product.stock)
                            throw new entities_1.ValidationError("sorry! the required unit of product not available please reduce the quantity and try again");
                    }
                    item.quantity = quantity;
                    item.totalPrice = item.price * quantity;
                }
                const totalCartAmount = updatedItems.reduce((sum, item) => sum + item.totalPrice, 0);
                const normalizedItems = updatedItems.map(item => (Object.assign(Object.assign({}, item), { product: typeof item.product === 'string' ? item.product : item.product.id })));
                cart.setItem(normalizedItems);
                cart.setTotalAmount(totalCartAmount);
                const newCart = yield this.cartRepository.updateCart(cart);
                return newCart.sanitizeCart();
            }
            throw new entities_1.AuthorizeError();
        });
    }
    removeFromCart(userToken, productId) {
        return __awaiter(this, void 0, void 0, function* () {
            const isValidUser = this.tokenUtils.isValidUserToken(userToken);
            if (isValidUser.isVerified && isValidUser.payload) {
                const userId = isValidUser.payload.id;
                const cart = yield this.cartRepository.getCartByUserId(userId);
                if (!cart)
                    throw new entities_1.ValidationError("Cart not found");
                const updatedItems = [...cart.items];
                const itemIndex = updatedItems.findIndex((item) => typeof item.product === "string" ? item.product === productId : item.product.id === productId);
                if (itemIndex === -1)
                    throw new entities_1.ValidationError("Item not found in cart");
                updatedItems.splice(itemIndex, 1);
                const totalCartAmount = updatedItems.reduce((sum, item) => sum + item.totalPrice, 0);
                cart.setItem(updatedItems);
                cart.setTotalAmount(totalCartAmount);
                const newCart = yield this.cartRepository.updateCart(cart);
                return newCart.sanitizeCart();
            }
            throw new entities_1.AuthorizeError();
        });
    }
    clearCart(userToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const isValidUser = this.tokenUtils.isValidUserToken(userToken);
            if (isValidUser.isVerified && isValidUser.payload) {
                const userId = isValidUser.payload.id;
                const cart = yield this.cartRepository.getCartByUserId(userId);
                if (!cart)
                    throw new entities_1.ValidationError("Cart not found");
                cart.setItem([]);
                cart.setTotalAmount(0);
                const newCart = yield this.cartRepository.updateCart(cart);
                return newCart.sanitizeCart();
            }
            throw new entities_1.AuthorizeError();
        });
    }
}
exports.CartService = CartService;
