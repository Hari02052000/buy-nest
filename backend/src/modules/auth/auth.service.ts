import { injectable, inject } from "tsyringe";
import type { UserRepository } from "@/modules/user/user.repository";
import type { AdminRepository } from "@/modules/admin/admin.repository";
import { User } from "@/modules/user/user.entity";
import { USER_TOKENS } from "@/modules/user/user.tokens";
import { ADMIN_TOKENS } from "@/modules/admin/admin.tokens";
import { SHARED_TOKENS } from "@/shared/tokens";
import type { AuthUtils } from "@/shared/utils/auth.utils";
import { ValidationError } from "@/shared/errors";
import { SESSION_TOKENS } from "./session.tokens";
import type { SessionRepository } from "./session.repository";

export interface UserSessionResult {
  user: {
    id: string;
    name: string;
    email: string;
    role?: string;
  };
  sessionId: string;
}

export interface AdminSessionResult {
  admin: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
  sessionId: string;
}

const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000;

@injectable()
export class AuthService {
  constructor(
    @inject(USER_TOKENS.Repository) private userRepo: UserRepository,
    @inject(ADMIN_TOKENS.Repository) private adminRepo: AdminRepository,
    @inject(SHARED_TOKENS.AuthUtils) private authUtils: AuthUtils,
    @inject(SESSION_TOKENS.Repository) private sessionRepo: SessionRepository,
  ) {}

  async login(email: string, password: string): Promise<UserSessionResult> {
    const normalizedEmail = email.trim().toLowerCase();
    const user = await this.userRepo.findByEmail(normalizedEmail);
    if (!user) throw new ValidationError("Invalid email or password.");
    if (user.isGoogleProvided && user.googleId) {
      throw new ValidationError("Account registered via Google. Use Google login.");
    }

    const isValid = await this.authUtils.validatePassword(password, user.password || "");
    if (!isValid) throw new ValidationError("Invalid email or password.");

    const sessionId = await this.createSession(user.id, "user");

    return {
      user: {
        id: user.id,
        name: user.userName,
        email: user.email,
      },
      sessionId,
    };
  }

  async adminLogin(email: string, password: string): Promise<AdminSessionResult> {
    const normalizedEmail = email.trim().toLowerCase();
    const admin = await this.adminRepo.findByEmail(normalizedEmail);
    if (!admin) throw new ValidationError("Invalid email or password.");

    const isValid = await this.authUtils.validatePassword(password, admin.password || "");
    if (!isValid) throw new ValidationError("Invalid email or password.");

    const sessionId = await this.createSession(admin.id, "admin");

    return {
      admin: {
        id: admin.id,
        name: admin.userName,
        email: admin.email,
        role: "ADMIN",
      },
      sessionId,
    };
  }

  async loginViaGoogle(email: string, googleId: string, name: string, profile: string): Promise<User> {
    let user = await this.userRepo.findByEmail(email);
    if (!user) {
      user = User.create({ email, password: "", salt: "", userName: name, isGoogleProvided: true, googleId, profile });
      user = await this.userRepo.save(user);
    } else {
      user = await this.userRepo.update(user.id, { googleId, profile, isGoogleProvided: true }) || user;
    }
    return user;
  }

  async googleSuccess(passportUserId: string): Promise<UserSessionResult> {
    const user = await this.userRepo.findById(passportUserId);
    if (!user) throw new ValidationError("User not found");

    const sessionId = await this.createSession(user.id, "user");

    return {
      user: {
        id: user.id,
        name: user.userName,
        email: user.email,
      },
      sessionId,
    };
  }

  async getUserById(id: string) {
    const user = await this.userRepo.findById(id);
    if (!user) throw new ValidationError("User not found");
    return user.sanitize();
  }

  async getAdminById(id: string) {
    const admin = await this.adminRepo.findById(id);
    if (!admin) throw new ValidationError("Admin not found");
    return admin.sanitize() as any;
  }

  async getSession(sessionId: string): Promise<{ sessionId: string; userId: string; userType: "user" | "admin"; expiresAt: string; lastUsedAt: string; createdAt: string; updatedAt: string } | null> {
    const session = await this.sessionRepo.findBySessionId(sessionId);
    if (!session) return null;
    if (new Date(session.expiresAt) <= new Date()) {
      await this.sessionRepo.delete(sessionId);
      return null;
    }
    return session;
  }

  async logout(sessionId: string): Promise<boolean> {
    await this.sessionRepo.delete(sessionId);
    return true;
  }

  async logoutByUserId(userId: string): Promise<boolean> {
    await this.sessionRepo.deleteByUserId(userId);
    return true;
  }

  private async createSession(userId: string, userType: "user" | "admin"): Promise<string> {
    const sessionId = this.authUtils.generateSessionId();
    const now = new Date();
    const expiresAt = new Date(now.getTime() + SESSION_DURATION_MS);

    await this.sessionRepo.create({
      sessionId,
      userId,
      userType,
      expiresAt: expiresAt.toISOString(),
      lastUsedAt: now.toISOString(),
    });

    return sessionId;
  }
}
