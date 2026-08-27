import { container } from "tsyringe";
import { UserRepository } from "./user.repository";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { SHARED_TOKENS } from "@/shared/tokens";
import { authUtils } from "@/shared/utils/auth.utils";

export const USER_TOKENS = {
  Repository: Symbol("UserRepository"),
  Service: Symbol("UserService"),
  Controller: Symbol("UserController"),
};

export function registerUserModule(): void {
  container.register(USER_TOKENS.Repository, { useClass: UserRepository });
  container.register(USER_TOKENS.Service, { useClass: UserService });
  container.register(USER_TOKENS.Controller, { useClass: UserController });
}
