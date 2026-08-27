import { injectable, inject } from "tsyringe";
import type { UserRepository } from "@/modules/user/user.repository";
import { User } from "@/modules/user/user.entity";
import type { AdminRepository } from "@/modules/admin/admin.repository";
import { USER_TOKENS } from "@/modules/user/user.tokens";
import { ADMIN_TOKENS } from "@/modules/admin/admin.tokens";
import { SHARED_TOKENS } from "@/shared/tokens";
import type { AuthUtils } from "@/shared/utils/auth.utils";
import { ValidationError, APIError } from "@/shared/errors";

export interface UserAuthTokens {
  access_token: string;
  refresh_token: string;
  user: {
    id: string;
    userName: string;
    email: string;
    isEmailVerified: boolean;
    profile: string;
    isGoogleProvided: boolean;
    createdAt: string;
    updatedAt: string;
  };
}

export interface AdminAuthTokens {
  access_token: string;
  refresh_token: string;
  admin: {
    id: string;
    userName: string;
    email: string;
    role: string;
    createdAt: string;
    updatedAt: string;
  };
}

@injectable()
export class AuthService {
  constructor(
    @inject(USER_TOKENS.Repository) private userRepo: UserRepository,
    @inject(ADMIN_TOKENS.Repository) private adminRepo: AdminRepository,
    @inject(SHARED_TOKENS.AuthUtils) private authUtils: AuthUtils,
  ) {}

  async register(email: string, password: string): Promise<UserAuthTokens> {
    const existing = await this.userRepo.findByEmail(email);
    if (existing) throw new ValidationError("Email already exists");

    const salt = await this.authUtils.getSalt();
    const hashedPassword = await this.authUtils.getHashedPassword(password, salt);
    const user = User.create({ email, password: hashedPassword, salt });
    const savedUser = await this.userRepo.save(user);

    const access_token = this.authUtils.generateAccessToken(savedUser.email, savedUser.id);
    const refresh_token = this.authUtils.generateRefreshToken(savedUser.id);
    await this.userRepo.update(savedUser.id, { refresh_token });

    return { access_token, refresh_token, user: savedUser.sanitize() };
  }

  async login(email: string, password: string): Promise<UserAuthTokens> {
    const user = await this.userRepo.findByEmail(email);
    if (!user) throw new ValidationError("Invalid email or password");
    if (user.isGoogleProvided && user.googleId) {
      throw new ValidationError("Account registered via Google. Use Google login.");
    }

    const isValid = await this.authUtils.validatePassword(password, user.password || "");
    if (!isValid) throw new ValidationError("Invalid email or password");

    const access_token = this.authUtils.generateAccessToken(user.email, user.id);
    const refresh_token = this.authUtils.generateRefreshToken(user.id);
    await this.userRepo.update(user.id, { refresh_token });

    return { access_token, refresh_token, user: user.sanitize() };
  }

  async refreshToken(userId: string): Promise<UserAuthTokens> {
    const user = await this.userRepo.findById(userId);
    if (!user) throw new ValidationError("User not found");

    const access_token = this.authUtils.generateAccessToken(user.email, user.id);
    const refresh_token = this.authUtils.generateRefreshToken(user.id);
    await this.userRepo.update(user.id, { refresh_token });

    return { access_token, refresh_token, user: user.sanitize() };
  }

  async loginViaGoogle(email: string, googleId: string, name: string, profile: string) {
    let user = await this.userRepo.findByEmail(email);
    if (!user) {
      user = User.create({ email, password: "", salt: "", userName: name, isGoogleProvided: true, googleId, profile });
      user = await this.userRepo.save(user);
    } else {
      user = await this.userRepo.update(user.id, { googleId, profile, isGoogleProvided: true }) || user;
    }
    return user.sanitize();
  }

  async googleSuccess(userId: string): Promise<UserAuthTokens> {
    const user = await this.userRepo.findById(userId);
    if (!user) throw new ValidationError("User not found");

    const access_token = this.authUtils.generateAccessToken(user.email, user.id);
    const refresh_token = this.authUtils.generateRefreshToken(user.id);
    await this.userRepo.update(user.id, { refresh_token });

    return { access_token, refresh_token, user: user.sanitize() };
  }

  async adminLogin(email: string, password: string): Promise<AdminAuthTokens> {
    const admin = await this.adminRepo.findByEmail(email);
    if (!admin) throw new ValidationError("Invalid email or password");

    const isValid = await this.authUtils.validatePassword(password, admin.password || "");
    if (!isValid) throw new ValidationError("Invalid email or password");

    const access_token = this.authUtils.generateAccessToken(admin.email, admin.id);
    const refresh_token = this.authUtils.generateRefreshToken(admin.id);
    await this.adminRepo.update(admin.id, { refresh_token } as any);

    return { access_token, refresh_token, admin: admin.sanitize() as any };
  }

  async adminRefreshToken(userId: string): Promise<AdminAuthTokens> {
    const admin = await this.adminRepo.findById(userId);
    if (!admin) throw new ValidationError("Admin not found");

    const access_token = this.authUtils.generateAccessToken(admin.email, admin.id);
    const refresh_token = this.authUtils.generateRefreshToken(admin.id);
    await this.adminRepo.update(admin.id, { refresh_token } as any);

    return { access_token, refresh_token, admin: admin.sanitize() as any };
  }

  async logoutUser(userId: string): Promise<boolean> {
    await this.userRepo.update(userId, { refresh_token: "" });
    return true;
  }

  async logoutAdmin(userId: string): Promise<boolean> {
    await this.adminRepo.update(userId, { refresh_token: "" } as any);
    return true;
  }
}
