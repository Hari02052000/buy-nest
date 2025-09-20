"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderUtils = void 0;
const entities_1 = require("../../domain/entities");
const validator_1 = require("./validator");
const createOrderRequestValidator = (reqBoy) => {
    const { error } = validator_1.createOrderSchema.validate(reqBoy);
    if (error)
        throw new entities_1.ValidationError(error.details[0].message);
    else
        return {
            addressId: reqBoy.addressId,
            paymentMethod: reqBoy.paymentMethod,
            coupon: reqBoy.coupon,
        };
};
const editOrderRequestValidator = (reqBoy) => {
    const { error } = validator_1.editOrderRequestSchema.validate(reqBoy);
    if (error)
        throw new entities_1.ValidationError(error.details[0].message);
    else
        return {
            orderStatus: reqBoy.orderStatus,
            paymentIntentId: reqBoy.paymentIntentId,
            paymentStatus: reqBoy.paymentStatus,
            transactionId: reqBoy.transactionId,
        };
};
exports.orderUtils = {
    createOrderRequestValidator,
    editOrderRequestValidator,
};
