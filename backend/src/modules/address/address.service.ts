import { injectable, inject } from "tsyringe";
import { AddressRepository } from "./address.repository";
import { Address, CreateAddressInput } from "./address.entity";
import { ValidationError } from "@/shared/errors";

@injectable()
export class AddressService {
  constructor(private addressRepo: AddressRepository) {}

  async createAddress(userId: string, data: CreateAddressInput): Promise<Address> {
    const address = Address.create({ ...data, user: userId });
    return this.addressRepo.save(address);
  }

  async getAddresses(userId: string): Promise<Address[]> {
    return this.addressRepo.findByUserId(userId);
  }

  async getAddressById(id: string): Promise<Address> {
    const address = await this.addressRepo.findById(id);
    if (!address) throw new ValidationError("Address not found");
    return address;
  }

  async updateAddress(id: string, userId: string, data: Partial<CreateAddressInput>): Promise<Address> {
    const existing = await this.addressRepo.findById(id);
    if (!existing) throw new ValidationError("Address not found");
    if (existing.user !== userId) throw new ValidationError("Not authorized to update this address");

    const updated = await this.addressRepo.update(id, data as Partial<Address>);
    if (!updated) throw new ValidationError("Failed to update address");
    return updated;
  }

  async deleteAddress(id: string, userId: string): Promise<boolean> {
    const existing = await this.addressRepo.findById(id);
    if (!existing) throw new ValidationError("Address not found");
    if (existing.user !== userId) throw new ValidationError("Not authorized to delete this address");

    return this.addressRepo.delete(id);
  }
}
