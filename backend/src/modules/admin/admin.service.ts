import { injectable, inject } from "tsyringe";
import type { AdminRepository } from "./admin.repository";
import type { Admin, CreateAdminInput } from "./admin.entity";
import { ADMIN_TOKENS } from "./admin.tokens";
import { SHARED_TOKENS } from "@/shared/tokens";
import type { AuthUtils } from "@/shared/utils/auth.utils";
import { ValidationError, APIError, AuthorizeError } from "@/shared/errors";

export interface AdminAuthTokens {
  access_token: string;
  refresh_token: string;
  admin: ReturnType<Admin["sanitize"]>;
}

@injectable()
export class AdminService {
  constructor(
    @inject(ADMIN_TOKENS.Repository) private adminRepo: AdminRepository,
    @inject(SHARED_TOKENS.AuthUtils) private authUtils: AuthUtils,
  ) {}

  async login(email: string, password: string): Promise<AdminAuthTokens> {
    const admin = await this.adminRepo.findByEmail(email);
    if (!admin) throw new ValidationError("Invalid email or password");

    const isValid = await this.authUtils.validatePassword(password, admin.password || "");
    if (!isValid) throw new ValidationError("Invalid email or password");

    const access_token = this.authUtils.generateAccessToken(admin.email, admin.id);
    const refresh_token = this.authUtils.generateRefreshToken(admin.id);
    await this.adminRepo.update(admin.id, { refresh_token } as Partial<Admin>);

    return { access_token, refresh_token, admin: admin.sanitize() };
  }

  async logout(adminId: string): Promise<boolean> {
    await this.adminRepo.update(adminId, { refresh_token: "" } as Partial<Admin>);
    return true;
  }

  async getCurrentAdmin(adminId: string): Promise<Admin> {
    const admin = await this.adminRepo.findById(adminId);
    if (!admin) throw new ValidationError("Admin not found");
    return admin;
  }

  async refreshToken(adminId: string): Promise<AdminAuthTokens> {
    const admin = await this.adminRepo.findById(adminId);
    if (!admin) throw new ValidationError("Admin not found");

    const access_token = this.authUtils.generateAccessToken(admin.email, admin.id);
    const refresh_token = this.authUtils.generateRefreshToken(admin.id);
    await this.adminRepo.update(admin.id, { refresh_token } as Partial<Admin>);

    return { access_token, refresh_token, admin: admin.sanitize() };
  }
}
