import { Address } from "@/domain/entities";

export interface AddressRepositoryInterface {
  saveAddress(address: Address): Promise<Address>;
  getAddress(userId: string): Promise<Address[]>;
  editAddress(Product: Address): Promise<Address>;
  mapToAddress(addresstDb: unknown): Address;
  getPopulatedAddress(userId: string): Promise<Address[]>;
}
