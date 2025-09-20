import { Address, addressProperties, APIError, ValidationError } from "@/domain/entities";
import { AddressRepositoryInterface } from "@/domain/interfaces/repository/address.repository.Interface";
import { AddressServiceInterface, createAddressRquestType } from "@/domain/interfaces/services";
import { tokenValidationUtillsInterface } from "@/domain/interfaces/utils";
import { addressUtilsInterface } from "@/domain/interfaces/utils/address.utills.interface";

export class addressService implements AddressServiceInterface {
  private addressRepo: AddressRepositoryInterface;
  private addressUtils: addressUtilsInterface;
  private tokenUtils: tokenValidationUtillsInterface;
  constructor(
    addressRepo: AddressRepositoryInterface,
    addressUtils: addressUtilsInterface,
    tokenUtils: tokenValidationUtillsInterface,
  ) {
    this.addressRepo = addressRepo;
    this.addressUtils = addressUtils;
    this.tokenUtils = tokenUtils;
  }

  async createAddress(
    reqBody: createAddressRquestType,
    userToken: string,
  ): Promise<Partial<addressProperties>> {
    if (!userToken) throw new ValidationError();
    const isValidUserToken = this.tokenUtils.isValidUserToken(userToken);
    const isValidReq = this.addressUtils.validateCreateAddressRequest(reqBody);
    if (isValidReq && isValidUserToken) {
      const userId = isValidUserToken.payload.id;
      const address = new Address(
        "",
        isValidReq.fullName,
        isValidReq.addressLine1,
        userId!,
        isValidReq.city,
        isValidReq.state,
        isValidReq.zipCode,
        isValidReq.country,
        isValidReq.phone,
        isValidReq.addressLine2,
      );
      const addressDb = await this.addressRepo.saveAddress(address);
      return addressDb;
    }
    throw new ValidationError();
  }
  async getAddress(userToken: string): Promise<Partial<addressProperties>[]> {
    const isValidUserToken = this.tokenUtils.isValidUserToken(userToken);
    if (isValidUserToken) {
      const userId = isValidUserToken.payload.id;
      const address = this.addressRepo.getAddress(userId!);
      return address;
    }
    throw new APIError();
  }
  editAddress(id: string, reqBody: any, userToken: string): Promise<Partial<addressProperties>> {
    throw new Error("Method not implemented.");
  }
  deleteAddress(id: string, userToken: string): Promise<Partial<boolean>> {
    throw new Error("Method not implemented.");
  }
}
