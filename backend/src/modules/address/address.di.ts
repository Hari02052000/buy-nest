import { container } from "tsyringe";
import { AddressRepository } from "./address.repository";
import { AddressService } from "./address.service";
import { AddressController } from "./address.controller";
import { ADDRESS_TOKENS } from "./address.tokens";

export function registerAddressModule(): void {
  container.register(ADDRESS_TOKENS.Repository, { useClass: AddressRepository });
  container.register(ADDRESS_TOKENS.Service, { useClass: AddressService });
  container.register(ADDRESS_TOKENS.Controller, { useClass: AddressController });
}
