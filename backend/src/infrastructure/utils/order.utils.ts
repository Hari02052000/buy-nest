import { ValidationError } from "@/domain/entities";
import { orderUtillsInterface } from "@/domain/interfaces/utils/order.utills.interface";
import { createOrderRequest } from "@/domain/types";
import { createOrderSchema, editOrderRequestSchema } from "./validator";
import { editOrderRequestType } from "@/domain/types/edit.order.request.type";

const createOrderRequestValidator = (reqBoy: any): createOrderRequest => {
  const { error } = createOrderSchema.validate(reqBoy);
  if (error) throw new ValidationError(error.details[0].message);
  else
    return {
      addressId: reqBoy.addressId,
      paymentMethod: reqBoy.paymentMethod,
      coupon: reqBoy.coupon,
    };
};

const editOrderRequestValidator = (reqBoy: any): editOrderRequestType => {
  const { error } = editOrderRequestSchema.validate(reqBoy);
  if (error) throw new ValidationError(error.details[0].message);
  else
    return {
      orderStatus: reqBoy.orderStatus,
      paymentIntentId: reqBoy.paymentIntentId,
      paymentStatus: reqBoy.paymentStatus,
      transactionId: reqBoy.transactionId,
    };
};

export const orderUtils: orderUtillsInterface = {
  createOrderRequestValidator,
  editOrderRequestValidator,
};
