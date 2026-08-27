import { injectable } from "tsyringe";
import AddressModel from "./address.model";
import { Address, AddressDocument } from "./address.entity";
import { APIError, NotFoundError } from "@/shared/errors";

@injectable()
export class AddressRepository {
  async save(address: Address): Promise<Address> {
    try {
      const doc = new AddressModel({
        fullName: address.fullName,
        addressLine1: address.addressLine1,
        addressLine2: address.addressLine2,
        city: address.city,
        state: address.state,
        zipCode: address.zipCode,
        country: address.country,
        phone: address.phone,
        user: address.user,
      });
      const saved = await doc.save();
      return Address.fromDocument(saved);
    } catch (error) {
      throw new APIError("Failed to save address");
    }
  }

  async findById(id: string): Promise<Address | null> {
    try {
      const doc = await AddressModel.findById(id);
      if (!doc) return null;
      return Address.fromDocument(doc);
    } catch (error) {
      throw new APIError("Failed to find address");
    }
  }

  async findByUserId(userId: string): Promise<Address[]> {
    try {
      const docs = await AddressModel.find({ user: userId });
      return docs.map((doc) => Address.fromDocument(doc));
    } catch (error) {
      throw new APIError("Failed to fetch addresses");
    }
  }

  async update(id: string, data: Partial<Address>): Promise<Address | null> {
    try {
      const doc = await AddressModel.findByIdAndUpdate(id, { $set: data }, { new: true });
      if (!doc) return null;
      return Address.fromDocument(doc);
    } catch (error) {
      throw new APIError("Failed to update address");
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      const result = await AddressModel.findByIdAndDelete(id);
      return !!result;
    } catch (error) {
      throw new APIError("Failed to delete address");
    }
  }
}
