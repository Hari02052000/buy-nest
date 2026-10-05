import { container } from "tsyringe";
import { UserRepository } from "./user.repository";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { USER_TOKENS } from "./user.tokens";

export function registerUserModule(): void {
  container.register(USER_TOKENS.Repository, { useClass: UserRepository });
  container.register(USER_TOKENS.Service, { useClass: UserService });
  container.register(USER_TOKENS.Controller, { useClass: UserController });
}
