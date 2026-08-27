import { container } from "tsyringe";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";

export const AUTH_TOKENS = {
  Service: Symbol("AuthService"),
  Controller: Symbol("AuthController"),
};

export const ADMIN_TOKENS = {
  Repository: Symbol("AdminRepository"),
  Service: Symbol("AdminService"),
};

export function registerAuthModule(): void {
  container.register(AUTH_TOKENS.Service, { useClass: AuthService });
  container.register(AUTH_TOKENS.Controller, { useClass: AuthController });
}
