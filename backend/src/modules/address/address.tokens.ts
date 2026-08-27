import { container } from "tsyringe";
import { AddressRepository } from "./address.repository";
import { AddressService } from "./address.service";
import { AddressController } from "./address.controller";

export const ADDRESS_TOKENS = {
  Repository: Symbol("AddressRepository"),
  Service: Symbol("AddressService"),
  Controller: Symbol("AddressController"),
};

export function registerAddressModule(): void {
  container.register(ADDRESS_TOKENS.Repository, { useClass: AddressRepository });
  container.register(ADDRESS_TOKENS.Service, { useClass: AddressService });
  container.register(ADDRESS_TOKENS.Controller, { useClass: AddressController });
}
