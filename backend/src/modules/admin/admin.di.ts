import { container } from "tsyringe";
import { AdminRepository } from "./admin.repository";
import { AdminService } from "./admin.service";
import { AdminController } from "./admin.controller";
import { SHARED_TOKENS } from "@/shared/tokens";
import { authUtils } from "@/shared/utils/auth.utils";
import { ADMIN_TOKENS } from "./admin.tokens";

export function registerAdminModule(): void {
  container.register(SHARED_TOKENS.AuthUtils, { useValue: authUtils });
  container.register(ADMIN_TOKENS.Repository, { useClass: AdminRepository });
  container.register(ADMIN_TOKENS.Service, { useClass: AdminService });
  container.register(ADMIN_TOKENS.Controller, { useClass: AdminController });
}
