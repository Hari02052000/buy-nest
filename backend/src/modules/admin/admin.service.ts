import { injectable, inject } from "tsyringe";
import type { AdminRepository } from "./admin.repository";
import type { Admin, CreateAdminInput } from "./admin.entity";
import { ADMIN_TOKENS } from "./admin.tokens";
import { ValidationError, APIError } from "@/shared/errors";

@injectable()
export class AdminService {
  constructor(
    @inject(ADMIN_TOKENS.Repository) private adminRepo: AdminRepository,
  ) {}

  async login(email: string, password: string): Promise<{ admin: ReturnType<Admin["sanitize"]> }> {
    const admin = await this.adminRepo.findByEmail(email);
    if (!admin) throw new ValidationError("Invalid email or password");

    return { admin: admin.sanitize() as any };
  }

  async logout(adminId: string): Promise<boolean> {
    return true;
  }

  async getCurrentAdmin(adminId: string): Promise<Admin> {
    const admin = await this.adminRepo.findById(adminId);
    if (!admin) throw new ValidationError("Admin not found");
    return admin;
  }
}
