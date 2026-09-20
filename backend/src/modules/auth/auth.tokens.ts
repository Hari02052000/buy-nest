import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { SessionRepository } from "./session.repository";
import { SESSION_TOKENS } from "./session.tokens";
import { container } from "tsyringe";

export const AUTH_TOKENS = {
  Service: Symbol("AuthService"),
  Controller: Symbol("AuthController"),
};

export function registerAuthModule(): void {
  container.register(AUTH_TOKENS.Service, { useClass: AuthService });
  container.register(AUTH_TOKENS.Controller, { useClass: AuthController });
  container.register(SESSION_TOKENS.Repository, { useClass: SessionRepository });
}
