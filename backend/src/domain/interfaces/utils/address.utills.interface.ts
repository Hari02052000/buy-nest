import { createAddressRquestType } from "@/domain/interfaces/services";

export interface addressUtilsInterface {
  validateCreateAddressRequest(reqBody: any): createAddressRquestType;
}
