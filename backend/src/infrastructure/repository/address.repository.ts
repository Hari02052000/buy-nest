import { Address, APIError, userProperties } from "@/domain/entities";
import { AddressRepositoryInterface } from "@/domain/interfaces/repository/address.repository.Interface";
import AddressModel, { IAddress } from "../model/address.model";

export class AddressRepository implements AddressRepositoryInterface {
  async saveAddress(address: Address): Promise<Address> {
    try {
      const addressDb = new AddressModel({
        fullName: address.fullName,
        addressLine1: address.addressLine1,
        addressLine2: address.addressLine2,
        user: address.user,
        city: address.city,
        state: address.state,
        zipCode: address.zipCode,
        country: address.country,
        phone: address.phone,
      });
      await addressDb.save();
      return this.mapToAddress(addressDb);
    } catch (error) {
      throw new APIError(
        `Failed to save address: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  }
  async getAddress(userId: string): Promise<Address[]> {
    try {
      const address = await AddressModel.find({ user: userId });
      return address.map((addr) => this.mapToAddress(addr));
    } catch (error) {
      throw new APIError();
    }
  }
  editAddress(Product: Address): Promise<Address> {
    throw new Error("Method not implemented.");
  }
  mapToAddress(addresstDb: IAddress): Address {
    let userValue;
    if (typeof addresstDb.user === "object" && addresstDb.user !== null && "userName" in addresstDb.user) {
      userValue = {} as Partial<userProperties>;
      userValue.id = addresstDb.user.id;
      userValue.email = addresstDb.user.email;
    } else {
      userValue = addresstDb.user.toString();
    }
    const address = new Address(
      addresstDb.id,
      addresstDb.fullName,
      addresstDb.addressLine1,
      userValue,
      addresstDb.city,
      addresstDb.state,
      addresstDb.zipCode,
      addresstDb.country,
      addresstDb.phone,
      addresstDb.addressLine2,
    );
    address.createdAt = addresstDb.createdAt;
    address.updatedAt = addresstDb.updatedAt;
    return address;
  }
  getPopulatedAddress(userId: string): Promise<Address[]> {
    throw new Error("Method not implemented.");
  }
}
