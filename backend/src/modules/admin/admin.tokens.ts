import { container } from "tsyringe";
import { AdminRepository } from "./admin.repository";
import { AdminService } from "./admin.service";
import { AdminController } from "./admin.controller";
import { SHARED_TOKENS } from "@/shared/tokens";
import { authUtils } from "@/shared/utils/auth.utils";

export const ADMIN_TOKENS = {
  Repository: Symbol("AdminRepository"),
  Service: Symbol("AdminService"),
  Controller: Symbol("AdminController"),
};

export function registerAdminModule(): void {
  container.register(SHARED_TOKENS.AuthUtils, { useValue: authUtils });
  container.register(ADMIN_TOKENS.Repository, { useClass: AdminRepository });
  container.register(ADMIN_TOKENS.Service, { useClass: AdminService });
  container.register(ADMIN_TOKENS.Controller, { useClass: AdminController });
}
