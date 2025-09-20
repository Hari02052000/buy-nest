import { adminProperties, APIError, AuthorizeError, ValidationError } from "@/domain/entities";
import { adminRepositoryInterface } from "@/domain/interfaces/repository";
import { adminServiceInterface } from "@/domain/interfaces/services/admin.service.interface";
import { authUtillsInterface } from "@/domain/interfaces/utils/";
import { tokenValidationUtillsInterface } from "@/domain/interfaces/utils/token.validation.utills.interface";
import { validAdminResponseType } from "@/domain/types";

export class adminService implements adminServiceInterface {
  constructor(
    private adminRepo: adminRepositoryInterface,
    private tokenUtils: tokenValidationUtillsInterface,
    private authUtils: authUtillsInterface,
  ) {}
  async logOutAdmin(admin_token: string): Promise<Partial<adminProperties>> {
    if (!admin_token) throw new ValidationError("token not found");
    const tokenProps = this.tokenUtils.isValidAdminToken(admin_token);
    if (tokenProps.isVerified && tokenProps.payload.id) {
      const admin = await this.adminRepo.getAdminById(tokenProps.payload.id);
      admin.setRefreshToken("");
      const newAdmin = await this.adminRepo.editAdmin(admin);
      return newAdmin.sanitizeAdmin();
    }
    throw new APIError();
  }
  async getcurentAdmin(admin_token: string): Promise<Partial<adminProperties>> {
    if (!admin_token) throw new ValidationError("token not found");
    const tokenProps = this.tokenUtils.isValidAdminToken(admin_token);
    if (tokenProps.isVerified && tokenProps.payload.id) {
      const admin = await this.adminRepo.getAdminById(tokenProps.payload.id);
      return admin.sanitizeAdmin();
    }
    throw new APIError();
  }
  async loginAdmin(RequestBody: unknown): Promise<validAdminResponseType> {
    const Input = this.authUtils.validateAdminLoginInput(RequestBody);
    const admin = await this.adminRepo.getAdminByEmail(Input.email);
    if (!admin) throw new ValidationError("invalid email or password");
    const isPasswordValid = await this.authUtils.validatePassword(
      Input.password,
      admin.password,
      admin.salt!,
    );
    if (!isPasswordValid) throw new ValidationError("invalid email or password");
    const access_token = this.authUtils.generateAcessToken(admin.email, admin.id);
    const refresh_token = this.authUtils.generateRefreshToken(admin.id);
    admin.setRefreshToken(refresh_token);
    await this.adminRepo.editAdmin(admin);
    return {
      access_token,
      refresh_token,
      admin: admin.sanitizeAdmin(),
    };
  }

  async adminRefreshToken(refresh_token: string): Promise<validAdminResponseType> {
    const tokenProps = this.tokenUtils.isValidAdminToken(refresh_token);
    if (tokenProps.isVerified && tokenProps.payload.id) {
      const admin = await this.adminRepo.getAdminById(tokenProps.payload.id);
      const access_token = this.authUtils.generateAcessToken(admin.email, admin.id);
      const refresh_token = this.authUtils.generateRefreshToken(admin.id);
      return {
        access_token,
        refresh_token,
        admin: admin.sanitizeAdmin(),
      };
    }
    throw new AuthorizeError();
  }
}
