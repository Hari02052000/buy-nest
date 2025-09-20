import { createOrderRequest } from "@/domain/types";
import { editOrderRequestType } from "@/domain/types/edit.order.request.type";

export interface orderUtillsInterface {
  createOrderRequestValidator(reqBoy: any): createOrderRequest;
  editOrderRequestValidator(reqBoy: any): editOrderRequestType;
}
