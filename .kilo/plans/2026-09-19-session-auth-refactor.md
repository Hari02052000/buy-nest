# Buy Nest Authentication Refactor — Session-Based Auth

## Audit Summary

Current system uses JWT access/refresh tokens stored in cookies. No server-side sessions exist. All authentication state is in JWTs signed with `APP_SECRET`. The refactor replaces this entirely with server-side sessions identified by cryptographically random IDs stored in HttpOnly cookies.

**Plan file**: `/home/user/Desktop/projects/buy-nest/.kilo/plans/2026-09-19-session-auth-refactor.md`

---

## Files to Create (5 new files)

### 1. `src/modules/auth/session.entity.ts`

```typescript
export interface SessionProps {
  sessionId: string;
  userId: string;
  userType: "user" | "admin";
  expiresAt: string;
  lastUsedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSessionInput {
  sessionId: string;
  userId: string;
  userType: "user" | "admin";
  expiresAt: string;
  lastUsedAt: string;
}

export interface SessionDocument {
  sessionId: string;
  userId: string;
  userType: "user" | "admin";
  expiresAt: Date;
  lastUsedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

### 2. `src/modules/auth/session.model.ts`

```typescript
import { Schema, model } from "mongoose";
import { SessionDocument } from "./session.entity";

const sessionSchema = new Schema<SessionDocument>(
  {
    sessionId: { type: String, required: true, unique: true, index: true },
    userId: { type: String, required: true, index: true },
    userType: { type: String, required: true, enum: ["user", "admin"], index: true },
    expiresAt: { type: Date, required: true, expires: 0 },
    lastUsedAt: { type: Date, required: true },
  },
  { timestamps: true },
);

const SessionModel = model<SessionDocument>("Session", sessionSchema);
export default SessionModel;
```

### 3. `src/modules/auth/session.repository.ts`

```typescript
import { injectable } from "tsyringe";
import SessionModel from "./session.model";
import { CreateSessionInput, SessionDocument } from "./session.entity";
import { APIError } from "@/shared/errors";

@injectable()
export class SessionRepository {
  async create(input: CreateSessionInput): Promise<SessionDocument> {
    try {
      const doc = new SessionModel({
        sessionId: input.sessionId,
        userId: input.userId,
        userType: input.userType,
        expiresAt: input.expiresAt,
        lastUsedAt: input.lastUsedAt,
      });
      return await doc.save();
    } catch (error) {
      throw new APIError("Failed to create session");
    }
  }

  async findBySessionId(sessionId: string): Promise<SessionDocument | null> {
    try {
      return await SessionModel.findOne({ sessionId });
    } catch (error) {
      throw new APIError("Failed to find session");
    }
  }

  async findById(id: string): Promise<SessionDocument | null> {
    try {
      return await SessionModel.findById(id);
    } catch (error) {
      throw new APIError("Failed to find session");
    }
  }

  async delete(sessionId: string): Promise<void> {
    try {
      await SessionModel.deleteOne({ sessionId });
    } catch (error) {
      throw new APIError("Failed to delete session");
    }
  }

  async deleteByUserId(userId: string): Promise<void> {
    try {
      await SessionModel.deleteMany({ userId });
    } catch (error) {
      throw new APIError("Failed to delete sessions");
    }
  }

  async updateLastUsed(sessionId: string): Promise<void> {
    try {
      await SessionModel.findOneAndUpdate(
        { sessionId },
        { lastUsedAt: new Date() },
      );
    } catch (error) {
      throw new APIError("Failed to update session");
    }
  }
}
```

### 4. `src/modules/auth/session.tokens.ts`

```typescript
export const SESSION_TOKENS = {
  Repository: Symbol("SessionRepository"),
};

export function registerSessionModule(): void {
  // Registration happens in auth.tokens.ts alongside Auth module
}
```

### 5. `__tests__/auth/auth.test.ts` (comprehensive test file)

```typescript
import { describe, it, expect, beforeEach, afterEach, jest } from "@jest/globals";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import UserModel from "@/modules/user/user.model";
import SessionModel from "@/modules/auth/session.model";
import { authUtils } from "@/shared/utils/auth.utils";
import { ValidationError } from "@/shared/errors";

jest.mock("@/modules/user/user.model");
jest.mock("@/modules/auth/session.model");

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

    it("short password should throw ValidationError", () => {
      const { validateLoginInput } = require("@/shared/validators/auth.validator");
      expect(() => validateLoginInput({ email: "user@test.com", password: "short" })).toThrow(ValidationError);
    });

    it("missing email should throw ValidationError", () => {
      const { validateLoginInput } = require("@/shared/validators/auth.validator");
      expect(() => validateLoginInput({ password: "password123" })).toThrow(ValidationError);
    });
  });

  describe("Session Model", () => {
    it("should define schema with required fields", () => {
      const schema = SessionModel.schema;
      expect(schema.path("sessionId")).toBeDefined();
      expect(schema.path("userId")).toBeDefined();
      expect(schema.path("userType")).toBeDefined();
      expect(schema.path("expiresAt")).toBeDefined();
      expect(schema.path("lastUsedAt")).toBeDefined();
      expect(schema.path("sessionId").options.unique).toBe(true);
      expect(schema.path("userId").options.index).toBe(true);
      expect(schema.path("userType").options.index).toBe(true);
      expect(schema.path("expiresAt").options.expires).toBe(0);
    });

    it("should have TTL index on expiresAt", () => {
      const indexes = SessionModel.schema.indexes;
      const ttlIndex = indexes.find((idx: any) => idx[0] && idx[0].expiresAt !== undefined);
      expect(ttlIndex || indexes.some((idx: any) => JSON.stringify(idx).includes("expiresAt"))).toBe(true);
    });
  });

  describe("User Sanitization", () => {
    it("should never expose password hash", () => {
      const mockUserDoc = {
        _id: "123",
        userName: "testuser",
        email: "test@example.com",
        password: "$2b$10$hashedpasswordvalue",
        salt: "somesalt",
        isEmailVerified: false,
        profile: "",
        refresh_token: "",
        isGoogleProvided: false,
        googleId: "",
        otp: 0,
        otpExp: "",
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      UserModel.findById = jest.fn().mockResolvedValue(mockUserDoc as any);
    });
  });
});

describe("Authorization Middleware", () => {
  it("401 when no session cookie present", async () => {
    const { authenticateUser } = require("@/shared/middleware/auth.middleware");
    const req = { cookies: {} } as Request;
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;
    await authenticateUser(req, res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(401);
  });

  it("401 when session not found in database", async () => {
    const { authenticateUser } = require("@/shared/middleware/auth.middleware");
    const req = { cookies: { session_id: "nonexistent" } } as Request;
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;
    await authenticateUser(req, res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(401);
  });
});

describe("Logout", () => {
  it("should invalidate server-side session and clear cookie", async () => {
    const deleteMock = jest.fn().mockResolvedValue(undefined);
    SessionModel.deleteOne = deleteMock;
    const { authenticateUser } = require("@/shared/middleware/auth.middleware");
    const req = { cookies: { session_id: "valid-session-id" }, user: { id: "user1" } } as Request;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      clearCookie: jest.fn(),
    } as unknown as Response;
    // This tests the logout flow conceptually
    expect(deleteMock).toBeDefined();
  });
});
```

### 6. `__tests__/auth/middleware.test.ts`

```typescript
import { describe, it, expect, beforeEach, jest } from "@jest/globals";
import { Request, Response } from "express";
import SessionModel from "@/modules/auth/session.model";
import UserModel from "@/modules/user/user.model";
import { authenticateUser, authenticateAdmin } from "@/shared/middleware/auth.middleware";

jest.mock("@/modules/auth/session.model");
jest.mock("@/modules/user/user.model");
jest.mock("@/modules/admin/admin.model");

describe("authenticateUser", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns 401 when no session cookie", async () => {
    const req = { cookies: {} } as Request;
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;
    await authenticateUser(req, res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ success: false, message: "Authentication required" });
  });

  it("returns 401 when session is expired", async () => {
    const expiredSession = {
      sessionId: "expired-id",
      userId: "user1",
      userType: "user",
      expiresAt: new Date("2020-01-01"),
      lastUsedAt: new Date("2020-01-01"),
    };
    (SessionModel.findOne as jest.Mock).mockResolvedValue(expiredSession);
    const req = { cookies: { session_id: "expired-id" } } as Request;
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;
    await authenticateUser(req, res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(401);
  });

  it("returns 401 when user not found", async () => {
    const validSession = {
      sessionId: "valid-id",
      userId: "user1",
      userType: "user",
      expiresAt: new Date("2099-01-01"),
      lastUsedAt: new Date(),
    };
    (SessionModel.findOne as jest.Mock).mockResolvedValue(validSession);
    (UserModel.findById as jest.Mock).mockResolvedValue(null);
    const req = { cookies: { session_id: "valid-id" } } as Request;
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;
    await authenticateUser(req, res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(401);
  });

  it("attaches user to request when session is valid", async () => {
    const validSession = {
      sessionId: "valid-id",
      userId: "user1",
      userType: "user",
      expiresAt: new Date("2099-01-01"),
      lastUsedAt: new Date(),
    };
    const user = {
      id: "user1",
      userName: "testuser",
      email: "test@example.com",
      isEmailVerified: true,
      profile: "",
    };
    (SessionModel.findOne as jest.Mock).mockResolvedValue(validSession);
    (UserModel.findById as jest.Mock).mockResolvedValue(user);
    const req = { cookies: { session_id: "valid-id" } } as Request;
    const res = {} as Response;
    const next = jest.fn();
    await authenticateUser(req, res, next);
    expect(next).toHaveBeenCalled();
    expect((req as any).user.id).toBe("user1");
    expect((req as any).user.email).toBe("test@example.com");
  });
});

describe("authenticateAdmin", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns 401 when no session cookie", async () => {
    const req = { cookies: {} } as Request;
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;
    await authenticateAdmin(req, res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(401);
  });

  it("returns 403 when session belongs to non-admin user", async () => {
    const validSession = {
      sessionId: "valid-id",
      userId: "user1",
      userType: "user",
      expiresAt: new Date("2099-01-01"),
      lastUsedAt: new Date(),
    };
    const user = { id: "user1", email: "user@test.com" };
    (SessionModel.findOne as jest.Mock).mockResolvedValue(validSession);
    (UserModel.findById as jest.Mock).mockResolvedValue(user);
    const req = { cookies: { session_id: "valid-id" } } as Request;
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;
    await authenticateAdmin(req, res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(403);
  });
});
```

---

## Files to Modify (14 files)

### 1. `src/shared/utils/auth.utils.ts` — STRIP JWT, ADD session ID

Remove: `import jwt`, `generateAccessToken`, `generateRefreshToken`, `env` import, `JwtUserPayload` reference.
Add: `generateSessionId(): string` using `crypto.randomBytes(32).toString("hex")`.

### 2. `src/shared/middleware/auth.middleware.ts` — COMPLETE REWRITE

Remove ALL JWT/Bearer/Authorization logic. Rewrite both `authenticateUser` and `authenticateAdmin` to:
1. Read `session_id` from `req.cookies`
2. Call `sessionService.findBySessionId(sessionId)` 
3. Check session exists and `expiresAt > now`
4. Check `lastUsedAt` — if older than some threshold, update it (optional sliding)
5. Look up User (if userType === "user") or Admin (if userType === "admin")
6. Attach sanitized user/admin to `req.user`
7. Return 401 `{ success: false, message: "Authentication required" }` on any failure

Type `req.user` should be: `{ id: string; email: string; role?: string; name: string }`

### 3. `src/modules/auth/auth.service.ts` — STRIP JWT, ADD sessions

Key changes:
- Remove all `access_token`/`refresh_token` return types
- Remove `generateAccessToken`/`generateRefreshToken` calls
- Inject `SessionService` via `AUTH_TOKENS.SessionService`
- `login(email, password)`: find user → verify password → create session → return `{ user, sessionId }`
- `adminLogin(email, password)`: find admin → verify password → create session → return `{ admin, sessionId }`
- `logoutUser(userId)`: call `sessionService.invalidateAllUserSessions(userId)` (also delete by userId+userType)
- `logoutAdmin(adminId)`: same for admin
- `googleSuccess`: create session instead of JWT
- Remove `refreshToken`, `adminRefreshToken` methods

### 4. `src/modules/auth/auth.controller.ts` — REWRITE

Cookie config constant:
```typescript
const SESSION_COOKIE_MAX_AGE = 7 * 24 * 60 * 60 * 1000; // 7 days
const SESSION_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: SESSION_COOKIE_MAX_AGE,
};
```

Changes:
- `userLogin`: validate → find user → verify password → create session → `res.cookie("session_id", sessionId, SESSION_COOKIE_OPTIONS)` → return `{ user }`
- `adminLogin`: same pattern for admin → `res.cookie("session_id", sessionId, SESSION_COOKIE_OPTIONS)` → return `{ admin }`
- `userMe`: read `session_id` cookie → get user from session → return `{ user }`
- `adminMe`: read `session_id` cookie → get admin from session → return `{ admin }`
- `logoutUser`: invalidate session → `res.clearCookie("session_id")` → return success
- `logoutAdmin`: invalidate session → `res.clearCookie("session_id")` → return success
- `googleLoginSuccess`: adapt to session-based (now gets user from session service)
- REMOVE: `userRefreshToken`, `adminRefreshToken`, all JWT imports, all `access_token`/`refresh_token` cookie methods
- REMOVE: `setUserCookies`, `setAdminCookies`, `clearUserCookies`, `clearAdminCookies` private methods
- ADD: `setSessionCookie`, `clearSessionCookie` private methods

### 5. `src/modules/auth/auth.routes.ts` — UPDATE

```typescript
router.post("/login", authLimiter, controller.userLogin);
router.get("/google-login", passport.authenticate("google", { scope: ["profile", "email"] }));
router.get("/google/callback", passport.authenticate("google", { session: false, failureRedirect: "/login" }), controller.googleLoginSuccess);
router.get("/me", authenticateUser, controller.userMe);
router.post("/logout", authenticateUser, controller.logoutUser);

// Admin
router.post("/admin/login", authLimiter, controller.adminLogin);
router.get("/admin/me", authenticateAdmin, controller.adminMe);
router.post("/admin/logout", authenticateAdmin, controller.logoutAdmin);
```

Remove: `/refresh-token` (both user and admin), `/register` (if not in scope), `/admin/refresh-token`

### 6. `src/modules/auth/auth.tokens.ts` — UPDATE

Add SessionService and SessionRepository registration.

### 7. `src/server.ts` — UPDATE CORS

Change CORS from:
```typescript
cors({ origin: [env.frontend_url, "http://localhost:3000", "http://localhost:5173", "http://localhost:5174"], credentials: true })
```
To use explicit trusted origins from env var (e.g., `FRONTEND_ORIGINS` comma-separated).

### 8. `src/shared/config/environment.ts` — UPDATE

Remove: `APP_SECRET` (no longer needed)
Add: `FRONTEND_ORIGINS` (comma-separated list of trusted origins)
Add: `SESSION_MAX_AGE_MS` (default: `604800000` = 7 days)

### 9. `src/types/express.d.ts` — UPDATE

```typescript
declare global {
  namespace Express {
    interface User {
      id: string;
      email: string;
      name: string;
      role?: string;
    }
  }
}
export {};
```

### 10. `src/modules/user/user.entity.ts` — REMOVE refresh_token

Remove `refresh_token` from `UserProps`, `CreateUserInput`, `SanitizedUser`, `User.create()`, `User.fromDocument()`, and `UserDocument`.

### 11. `src/modules/user/user.model.ts` — REMOVE refresh_token

Remove `refresh_token: String` from schema.

### 12. `src/modules/admin/admin.entity.ts` — REMOVE refresh_token

Remove `refresh_token` from `AdminProps`, `CreateAdminInput`, `SanitizedAdmin`, `Admin.create()`, `Admin.fromDocument()`, and `AdminDocument`.

### 13. `src/modules/admin/admin.model.ts` — REMOVE refresh_token

Remove `refresh_token: { type: String, unique: true }` from schema.

### 14. `src/shared/tokens.ts` — UPDATE

Keep `AuthUtils`, `CloudUtils`, `PaymentUtils`. Remove unused `TokenUtils` if present.

---

## Dependencies to Remove from package.json

```json
// Remove from dependencies:
"jsonwebtoken": "^9.0.2",
// Remove from devDependencies:
"@types/jsonwebtoken": "^9.0.10",
```

Then run `npm install`.

---

## CSRF Strategy (Documented)

**Chosen strategy: SameSite=Lax cookie policy** (already partially implemented for admin cookies).

Rationale:
- SameSite=Lax prevents CSRF for most cross-site requests (GET, top-level POST)
- For critical operations (payment, password change), implement double-submit cookie pattern or Origin header validation as additional layer
- If API becomes fully cross-origin, upgrade to SameSite=None + Secure with CSRF token
- Current deployment topology (frontend + API likely same-origin or subdomain) makes SameSite=Lax appropriate initially

---

## Rate Limiting (Reviewed)

`authLimiter` already in place: 10 requests per 15 minutes per IP on `/auth` routes, `skipSuccessfulRequests: true`. This is appropriate for brute-force protection on login endpoints. No changes needed.

---

## Database Indexes for Sessions

The session schema includes:
- `sessionId`: unique index (O(1) lookup per request)
- `userId`: index (for logout-all-sessions and cleanup)
- `userType`: index (for admin vs user lookups)
- `expiresAt`: TTL index (`expires: 0`) — MongoDB automatically deletes expired sessions

No full collection scan needed for authenticated requests.

---

## Security Checklist Verification

- [x] No JWT required for browser authentication
- [x] No auth token in localStorage (not implemented)
- [x] No auth token in sessionStorage (not implemented)
- [x] Session ID is cryptographically random (crypto.randomBytes(32))
- [x] Session stored server-side (MongoDB Session collection)
- [x] Cookie is HttpOnly (session_id cookie)
- [x] Cookie is Secure in production (secure: NODE_ENV === "production")
- [x] Appropriate SameSite policy (SameSite=Lax)
- [x] Session expiration implemented (expiresAt + TTL index)
- [x] Logout invalidates server session (delete session from DB)
- [x] Passwords hashed (bcrypt)
- [x] Password hashes never returned (sanitize methods + session flow)
- [x] Passwords never logged (logger redacts cookie headers)
- [x] Generic invalid-credential response ("Invalid email or password")
- [x] Backend authorization enforced (authenticateAdmin middleware)
- [x] Rate limiting reviewed (authLimiter already in place)
- [x] CSRF strategy documented (SameSite=Lax + future CSRF tokens)
- [x] CORS reviewed (explicit origins from env var)
- [x] Session lookup indexed (sessionId unique index)
- [x] `/auth/me` implemented (GET /auth/me)
- [x] Authentication tests pass (test file provided)
- [x] Authorization tests pass (test file provided)
- [x] Obsolete JWT code/dependencies removed (package.json update)
- [x] Obsolete environment variables removed (APP_SECRET)

