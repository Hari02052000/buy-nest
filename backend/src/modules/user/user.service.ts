import { injectable, inject } from "tsyringe";
import { UserRepository } from "./user.repository";
import { User as UserEntity } from "./user.entity";
import type { CreateUserInput } from "./user.entity";
import { ValidationError, APIError } from "@/shared/errors";

@injectable()
export class UserService {
  constructor(private userRepo: UserRepository) {}

  async login(email: string, password: string): Promise<{ user: ReturnType<UserEntity["sanitize"]> }> {
    const user = await this.userRepo.findByEmail(email);
    if (!user) throw new ValidationError("Invalid email or password");
    if (user.isGoogleProvided && user.googleId) {
      throw new ValidationError("Account registered via Google. Use Google login.");
    }
    return { user: user.sanitize() };
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

  async googleSuccess(userId: string): Promise<{ user: ReturnType<UserEntity["sanitize"]> }> {
    const user = await this.userRepo.findById(userId);
    if (!user) throw new ValidationError("User not found");
    return { user: user.sanitize() };
  }

  async getUser(userId: string): Promise<UserEntity> {
    const user = await this.userRepo.findById(userId);
    if (!user) throw new ValidationError("User not found");
    return user;
  }

  async logout(userId: string): Promise<boolean> {
    return true;
  }

  async updateProfile(userId: string, data: { userName?: string; profile?: string }): Promise<UserEntity> {
    const user = await this.userRepo.update(userId, data);
    if (!user) throw new ValidationError("User not found");
    return user;
  }
}
