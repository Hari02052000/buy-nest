import { addressProperties } from "@/domain/entities";

export type createAddressRquestType = Omit<addressProperties, "id" | "createdAt" | "updatedAt" | "user">;
export interface AddressServiceInterface {
  createAddress(reqBody: createAddressRquestType, userToken: string): Promise<Partial<addressProperties>>;
  getAddress(userToken: string): Promise<Partial<addressProperties>[]>;
  editAddress(id: string, reqBody: any, userToken: string): Promise<Partial<addressProperties>>;
  deleteAddress(id: string, userToken: string): Promise<Partial<boolean>>;
}
