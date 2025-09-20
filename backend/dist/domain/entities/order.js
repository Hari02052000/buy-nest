"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Order = void 0;
class Order {
    constructor(id = "", items, address, user, paymentMethod, payableAmount, appliedCoupon) {
        this.paymentInfo = {};
        this._modifiedFields = {};
        this.id = id;
        this.items = items;
        this.address = address;
        this.user = user;
        this.paymentInfo.method = paymentMethod;
        this.paymentInfo.payableAmount = payableAmount;
        this.orderStatus = "pending";
        if (appliedCoupon)
            this.appliedCoupon;
        this.createdAt = new Date().toISOString();
        this.updatedAt = new Date().toISOString();
    }
    setPaymentStatus(paymentStatus) {
        this.paymentInfo.paymentStatus = paymentStatus;
        this.updatedAt = new Date().toISOString();
        this._modifiedFields.paymentInfo = true;
        this._modifiedFields.updatedAt = true;
    }
    setTransactionId(transactionId) {
        this.paymentInfo.transactionId = transactionId;
        this.updatedAt = new Date().toISOString();
        this._modifiedFields.paymentInfo = true;
        this._modifiedFields.updatedAt = true;
    }
    setPaymentIntentId(paymentIntentId) {
        this.paymentInfo.paymentIntentId = paymentIntentId;
        this.updatedAt = new Date().toISOString();
        this._modifiedFields.paymentInfo = true;
        this._modifiedFields.updatedAt = true;
    }
    setOrderStatus(orderStatus) {
        this.orderStatus = orderStatus;
        this.updatedAt = new Date().toISOString();
        this._modifiedFields.orderStatus = true;
        this._modifiedFields.updatedAt = true;
    }
    sanitizeOrder() {
        const order = {};
        order.id = this.id;
        order.createdAt = this.createdAt;
        order.orderStatus = this.orderStatus;
        order.items = this.items;
        order.address = this.address;
        order.appliedCoupon = this.appliedCoupon;
        order.paymentInfo = this.paymentInfo;
        order.user = this.user;
        return order;
    }
    get modifiedFields() {
        return this._modifiedFields;
    }
    get clearModifiedFields() {
        this._modifiedFields = {};
        return this._modifiedFields;
    }
}
exports.Order = Order;
