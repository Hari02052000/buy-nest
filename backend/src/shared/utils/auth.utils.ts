import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { ValidationError } from "../errors";
import { env } from "../config/environment";

export interface AuthUtils {
  getSalt(): Promise<string>;
  getHashedPassword(password: string, salt: string): Promise<string>;
  validatePassword(enteredPassword: string, savedPassword: string): Promise<boolean>;
  generateAccessToken(email: string, id: string): string;
  generateRefreshToken(id: string): string;
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

  generateAccessToken(email: string, id: string): string {
    return jwt.sign({ id, email, type: "access" }, env.APP_SECRET, { expiresIn: "15m" });
  },

  generateRefreshToken(id: string): string {
    return jwt.sign({ id, type: "refresh" }, env.APP_SECRET, { expiresIn: "1d" });
  },
};
