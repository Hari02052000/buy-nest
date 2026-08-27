import { injectable, inject } from "tsyringe";
import { UserRepository } from "./user.repository";
import { User as UserEntity } from "./user.entity";
import type { CreateUserInput } from "./user.entity";
import { SHARED_TOKENS } from "@/shared/tokens";
import type { AuthUtils } from "@/shared/utils/auth.utils";
import { ValidationError, APIError } from "@/shared/errors";

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
  user: ReturnType<UserEntity["sanitize"]>;
}

@injectable()
export class UserService {
  constructor(
    private userRepo: UserRepository,
    @inject(SHARED_TOKENS.AuthUtils) private authUtils: AuthUtils,
  ) {}

  async register(email: string, password: string): Promise<AuthTokens> {
    const existing = await this.userRepo.findByEmail(email);
    if (existing) throw new ValidationError("Email already exists");

    const salt = await this.authUtils.getSalt();
    const hashedPassword = await this.authUtils.getHashedPassword(password, salt);
    const user = UserEntity.create({ email, password: hashedPassword, salt });
    const savedUser = await this.userRepo.save(user);

    const access_token = this.authUtils.generateAccessToken(savedUser.email, savedUser.id);
    const refresh_token = this.authUtils.generateRefreshToken(savedUser.id);
    await this.userRepo.update(savedUser.id, { refresh_token });

    return { access_token, refresh_token, user: savedUser.sanitize() };
  }

  async login(email: string, password: string): Promise<AuthTokens> {
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

  async loginViaGoogle(email: string, googleId: string, name: string, profile: string): Promise<ReturnType<UserEntity["sanitize"]>> {
    let user = await this.userRepo.findByEmail(email);
    if (!user) {
      user = UserEntity.create({ email, password: "", salt: "", userName: name, isGoogleProvided: true, googleId, profile });
      user = await this.userRepo.save(user);
    } else {
      user = await this.userRepo.update(user.id, { googleId, profile, isGoogleProvided: true }) || user;
    }
    return user.sanitize();
  }

  async googleSuccess(userId: string): Promise<AuthTokens> {
    const user = await this.userRepo.findById(userId);
    if (!user) throw new ValidationError("User not found");

    const access_token = this.authUtils.generateAccessToken(user.email, user.id);
    const refresh_token = this.authUtils.generateRefreshToken(user.id);
    await this.userRepo.update(user.id, { refresh_token });

    return { access_token, refresh_token, user: user.sanitize() };
  }

  async getUser(userId: string): Promise<UserEntity> {
    const user = await this.userRepo.findById(userId);
    if (!user) throw new ValidationError("User not found");
    return user;
  }

  async logout(userId: string): Promise<boolean> {
    await this.userRepo.update(userId, { refresh_token: "" });
    return true;
  }

  async refreshToken(userId: string): Promise<AuthTokens> {
    const user = await this.userRepo.findById(userId);
    if (!user) throw new ValidationError("User not found");

    const access_token = this.authUtils.generateAccessToken(user.email, user.id);
    const refresh_token = this.authUtils.generateRefreshToken(user.id);
    await this.userRepo.update(user.id, { refresh_token });

    return { access_token, refresh_token, user: user.sanitize() };
  }

  async updateProfile(userId: string, data: { userName?: string; profile?: string }): Promise<UserEntity> {
    const user = await this.userRepo.update(userId, data);
    if (!user) throw new ValidationError("User not found");
    return user;
  }
}
