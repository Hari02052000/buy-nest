import "reflect-metadata";
import { describe, it, expect, jest, beforeEach } from "@jest/globals";
import type { Response } from "express";

const mockAuthService = {
  getSession: jest.fn<(sessionId: string) => Promise<any>>(),
  getUserById: jest.fn<(id: string) => Promise<any>>(),
  getAdminById: jest.fn<(id: string) => Promise<any>>(),
};

// Stub the tokens module so importing the middleware does not pull the whole DI graph.
jest.mock("@/modules/auth/auth.tokens", () => ({
  AUTH_TOKENS: { Service: Symbol("AuthService"), Controller: Symbol("AuthController") },
}));

jest.mock("tsyringe", () => ({
  __esModule: true,
  container: { resolve: jest.fn(() => mockAuthService) },
  injectable: () => (target: any) => target,
  inject: () => () => {},
}));

import { authenticateUser, authenticateAdmin } from "@/shared/middleware/auth.middleware";

const makeReq = (cookies: Record<string, string> = {}) => ({ cookies }) as any;
const makeRes = () =>
  ({ status: jest.fn().mockReturnThis(), json: jest.fn() }) as unknown as Response;

beforeEach(() => {
  mockAuthService.getSession.mockReset();
  mockAuthService.getUserById.mockReset();
  mockAuthService.getAdminById.mockReset();
});

describe("authenticateUser middleware", () => {
  it("returns 401 when no session cookie", async () => {
    const res = makeRes();
    await authenticateUser(makeReq(), res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(401);
    expect(mockAuthService.getSession).not.toHaveBeenCalled();
  });

  it("returns 401 when session is missing or expired", async () => {
    mockAuthService.getSession.mockResolvedValue(null);
    const res = makeRes();
    await authenticateUser(makeReq({ session_id: "expired" }), res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(401);
  });

  it("returns 401 for non-user session type", async () => {
    mockAuthService.getSession.mockResolvedValue({ userId: "a1", userType: "admin" });
    const res = makeRes();
    await authenticateUser(makeReq({ session_id: "admin-id" }), res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(401);
    expect(mockAuthService.getUserById).not.toHaveBeenCalled();
  });

  it("returns 401 when user lookup fails", async () => {
    mockAuthService.getSession.mockResolvedValue({ userId: "u1", userType: "user" });
    mockAuthService.getUserById.mockRejectedValue(new Error("User not found"));
    const res = makeRes();
    await authenticateUser(makeReq({ session_id: "valid" }), res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(401);
  });

  it("populates req.user and calls next for a valid user session", async () => {
    mockAuthService.getSession.mockResolvedValue({ userId: "u1", userType: "user" });
    mockAuthService.getUserById.mockResolvedValue({ id: "u1", email: "u@x.com", userName: "u" });
    const req = makeReq({ session_id: "valid" });
    const next = jest.fn();
    await authenticateUser(req, makeRes(), next);
    expect(next).toHaveBeenCalled();
    expect(req.user).toEqual({ id: "u1", email: "u@x.com", name: "u" });
  });
});

describe("authenticateAdmin middleware", () => {
  it("returns 401 when no session cookie", async () => {
    const res = makeRes();
    await authenticateAdmin(makeReq(), res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(401);
  });

  it("returns 401 when session is missing or expired", async () => {
    mockAuthService.getSession.mockResolvedValue(null);
    const res = makeRes();
    await authenticateAdmin(makeReq({ session_id: "expired" }), res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(401);
  });

  it("returns 403 for non-admin session type", async () => {
    mockAuthService.getSession.mockResolvedValue({ userId: "u1", userType: "user" });
    const res = makeRes();
    await authenticateAdmin(makeReq({ session_id: "user-session" }), res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(403);
    expect(mockAuthService.getAdminById).not.toHaveBeenCalled();
  });

  it("returns 401 when admin lookup fails", async () => {
    mockAuthService.getSession.mockResolvedValue({ userId: "a1", userType: "admin" });
    mockAuthService.getAdminById.mockRejectedValue(new Error("Admin not found"));
    const res = makeRes();
    await authenticateAdmin(makeReq({ session_id: "admin-id" }), res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(401);
  });

  it("populates req.user and calls next for a valid admin session", async () => {
    mockAuthService.getSession.mockResolvedValue({ userId: "a1", userType: "admin" });
    mockAuthService.getAdminById.mockResolvedValue({ id: "a1", email: "a@x.com", userName: "adm" });
    const req = makeReq({ session_id: "admin-id" });
    const next = jest.fn();
    await authenticateAdmin(req, makeRes(), next);
    expect(next).toHaveBeenCalled();
    expect(req.user).toEqual({ id: "a1", email: "a@x.com", name: "adm" });
  });
});
