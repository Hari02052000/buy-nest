import bcrypt from "bcrypt";
import crypto from "crypto";
import { ValidationError } from "../errors";

export interface AuthUtils {
  getSalt(): Promise<string>;
  getHashedPassword(password: string, salt: string): Promise<string>;
  validatePassword(enteredPassword: string, savedPassword: string): Promise<boolean>;
  generateSessionId(): string;
}

export const authUtils: AuthUtils = {
  async getSalt(): Promise<string> {
    return bcrypt.genSalt();
  },

  async getHashedPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  },

  async validatePassword(enteredPassword: string, savedPassword: string): Promise<boolean> {
    return bcrypt.compare(enteredPassword, savedPassword);
  },

  generateSessionId(): string {
    return crypto.randomBytes(32).toString("hex");
  },
};
