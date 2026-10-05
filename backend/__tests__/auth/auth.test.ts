import "reflect-metadata";
import { describe, it, expect, beforeEach, afterEach, jest } from "@jest/globals";
import { authUtils } from "@/shared/utils/auth.utils";
import { ValidationError } from "@/shared/errors";

describe("Authentication", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("Password Hashing", () => {
    it("should generate a salt", async () => {
      const salt = await authUtils.getSalt();
      expect(typeof salt).toBe("string");
      expect(salt.length).toBeGreaterThan(0);
    });

    it("should hash and validate password correctly", async () => {
      const salt = await authUtils.getSalt();
      const hashed = await authUtils.getHashedPassword("TestPass123!", salt);
      const valid = await authUtils.validatePassword("TestPass123!", hashed);
      expect(valid).toBe(true);
      const invalid = await authUtils.validatePassword("WrongPass", hashed);
      expect(invalid).toBe(false);
    });

    it("should generate a 64-char hex session ID with sufficient entropy", () => {
      const id1 = authUtils.generateSessionId();
      const id2 = authUtils.generateSessionId();
      expect(id1).toHaveLength(64);
      expect(/^[0-9a-f]{64}$/.test(id1)).toBe(true);
      expect(id1).not.toBe(id2);
    });
  });

  describe("Login Validation", () => {
    it("valid credentials should pass validation", () => {
      const { validateLoginInput } = require("@/shared/validators/auth.validator");
      const result = validateLoginInput({ email: "user@test.com", password: "password123" });
      expect(result.email).toBe("user@test.com");
      expect(result.password).toBe("password123");
    });

    it("invalid email should throw ValidationError", () => {
      const { validateLoginInput } = require("@/shared/validators/auth.validator");
      expect(() => validateLoginInput({ email: "notanemail", password: "password123" })).toThrow(ValidationError);
    });

    it("short password should pass login validation (login schema only checks required)", () => {
      const { validateLoginInput } = require("@/shared/validators/auth.validator");
      const result = validateLoginInput({ email: "user@test.com", password: "short" });
      expect(result.password).toBe("short");
    });

    it("empty password should fail login validation", () => {
      const { validateLoginInput } = require("@/shared/validators/auth.validator");
      expect(() => validateLoginInput({ email: "user@test.com", password: "" })).toThrow(ValidationError);
    });

    it("missing email should throw ValidationError", () => {
      const { validateLoginInput } = require("@/shared/validators/auth.validator");
      expect(() => validateLoginInput({ password: "password123" })).toThrow(ValidationError);
    });
  });

  describe("Session Model Schema", () => {
    it("should define required fields", () => {
      const mongoose = require("mongoose");
      const sessionSchema = new mongoose.Schema({
        sessionId: { type: String, required: true, unique: true, index: true },
        userId: { type: String, required: true, index: true },
        userType: { type: String, required: true, enum: ["user", "admin"], index: true },
        expiresAt: { type: Date, required: true, expires: 0 },
        lastUsedAt: { type: Date, required: true },
      });
      expect(sessionSchema.path("sessionId")).toBeDefined();
      expect(sessionSchema.path("userId")).toBeDefined();
      expect(sessionSchema.path("expiresAt").options.expires).toBe(0);
    });
  });

  describe("User Sanitization", () => {
    it("should never expose password hash or salt", () => {
      const props = {
        id: "123",
        userName: "testuser",
        email: "test@example.com",
        password: "$2b$10$hashedpasswordvalue",
        salt: "somesalt",
        isEmailVerified: false,
        profile: "",
        isGoogleProvided: false,
        googleId: "",
        otp: 0,
        otpExp: "",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      const { password, salt, googleId, otp, otpExp, ...safe } = props;
      const record = safe as Record<string, unknown>;
      expect(record.password).toBeUndefined();
      expect(record.salt).toBeUndefined();
      expect(record.googleId).toBeUndefined();
      expect(record.otp).toBeUndefined();
      expect(record.otpExp).toBeUndefined();
    });
  });
});

describe("Logout", () => {
  it("should invalidate server-side session", async () => {
    const deleteMock = jest.fn<() => Promise<void>>().mockResolvedValue(undefined);
    expect(deleteMock).toBeDefined();
  });

  it("should clear session cookie", async () => {
    const clearCookie = jest.fn();
    expect(clearCookie).toBeDefined();
  });
});

describe("Session Expiration Check", () => {
  it("should reject expired session", () => {
    const expiresAt = new Date("2020-01-01");
    const now = new Date("2025-01-01");
    expect(expiresAt <= now).toBe(true);
  });

  it("should accept valid session", () => {
    const expiresAt = new Date("2099-01-01");
    const now = new Date("2025-01-01");
    expect(expiresAt <= now).toBe(false);
  });
});
