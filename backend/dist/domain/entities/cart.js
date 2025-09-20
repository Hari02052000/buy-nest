"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cart = void 0;
class Cart {
    constructor(id = "", userId, items = [], totalAmount = 0, itemCount = 0) {
        this._modifiedFields = {};
        this.id = id;
        this.userId = userId;
        this.items = items;
        this.totalAmount = totalAmount;
        this.itemCount = itemCount;
        this.createdAt = new Date().toISOString();
        this.updatedAt = new Date().toISOString();
        this.discountAmount = 0;
    }
    setItem(items) {
        this.items = items;
        this.updatedAt = new Date().toISOString();
        this.modifiedFields.items = true;
        this.modifiedFields.updatedAt = true;
    }
    setTotalAmount(amount) {
        this.totalAmount = amount;
        this.updatedAt = new Date().toISOString();
        this.modifiedFields.totalAmount = true;
        this.modifiedFields.updatedAt = true;
    }
    // addItem(productId: string, quantity: number, price: number) {
    //   const existingItem = this.items.find((item) => typeof item.product === 'string' ? item.product == productId : item.product.id == productId);
    //   if (existingItem) {
    //     existingItem.quantity += quantity;
    //     existingItem.totalPrice = existingItem.quantity * existingItem.price;
    //   } else {
    //     const newItem: CartItem = {
    //       product : productId,
    //       quantity,
    //       price,
    //       totalPrice: price * quantity,
    //     };
    //     this.items.push(newItem);
    //   }
    //   this.updateTotals();
    //   this.updatedAt = new Date().toISOString();
    //   this._modifiedFields.items = true;
    //   this._modifiedFields.totalAmount = true;
    //   this._modifiedFields.itemCount = true;
    //   this._modifiedFields.updatedAt = true;
    // }
    // updateItemQuantity(productId: string, quantity: number) {
    //   const item = this.items.find((item) => typeof item.product === 'string' ? item.product == productId : item.product.id == productId);
    //   if (item) {
    //     if (quantity <= 0) {
    //       this.removeItem(productId);
    //     } else {
    //       item.quantity = quantity;
    //       item.totalPrice = item.quantity * item.price;
    //       this.updateTotals();
    //       this.updatedAt = new Date().toISOString();
    //       this._modifiedFields.items = true;
    //       this._modifiedFields.totalAmount = true;
    //       this._modifiedFields.itemCount = true;
    //       this._modifiedFields.updatedAt = true;
    //     }
    //   }
    // }
    // removeItem(productId: string) {
    //   this.items = this.items.filter((item) => typeof item.product === 'string' ? item.product !== productId : item.product.id !== productId);
    //   this.updateTotals();
    //   this.updatedAt = new Date().toISOString();
    //   this._modifiedFields.items = true;
    //   this._modifiedFields.totalAmount = true;
    //   this._modifiedFields.itemCount = true;
    //   this._modifiedFields.updatedAt = true;
    // }
    // clearCart() {
    //   this.items = [];
    //   this.updateTotals();
    //   this.updatedAt = new Date().toISOString();
    //   this._modifiedFields.items = true;
    //   this._modifiedFields.totalAmount = true;
    //   this._modifiedFields.itemCount = true;
    //   this._modifiedFields.updatedAt = true;
    // }
    // private updateTotals() {
    //   const subtotal = this.items.reduce((sum, item) => sum + item.totalPrice, 0);
    //   this.totalAmount = subtotal - this.discountAmount;
    //   this.itemCount = this.items.reduce((sum, item) => sum + item.quantity, 0);
    // }
    sanitizeCart() {
        const cart = {};
        cart.id = this.id;
        cart.userId = this.userId;
        cart.items = this.items;
        cart.totalAmount = this.totalAmount;
        cart.itemCount = this.itemCount;
        cart.appliedCoupon = this.appliedCoupon;
        cart.discountAmount = this.discountAmount;
        cart.createdAt = this.createdAt;
        cart.updatedAt = this.updatedAt;
        return cart;
    }
    get modifiedFields() {
        return this._modifiedFields;
    }
    get clearModifiedFields() {
        this._modifiedFields = {};
        return this._modifiedFields;
    }
}
exports.Cart = Cart;
