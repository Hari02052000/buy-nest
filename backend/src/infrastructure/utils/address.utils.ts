import { createAddressRquestType } from "@/domain/interfaces/services";
import { addressUtilsInterface } from "@/domain/interfaces/utils/address.utills.interface";
import { createAddressValidator } from "./validator";
import { ValidationError } from "@/domain/entities";

const validateCreateAddressRequest = (reqBody: any): createAddressRquestType => {
  const { error } = createAddressValidator.validate(reqBody);
  if (error) throw new ValidationError(error.details[0].message);
  else
    return {
      fullName: reqBody.fullName,
      addressLine1: reqBody.addressLine1,
      city: reqBody.city,
      state: reqBody.state,
      zipCode: reqBody.zipCode,
      country: reqBody.country,
      phone: reqBody.phone,
    };
};

export const addressUtils: addressUtilsInterface = {
  validateCreateAddressRequest,
};
