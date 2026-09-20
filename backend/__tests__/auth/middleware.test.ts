import "reflect-metadata";
import { describe, it, expect, jest } from "@jest/globals";
import { Request, Response } from "express";

jest.mock("@/modules/user/user.model", () => ({
  default: { findById: jest.fn().mockResolvedValue(null) },
}));

jest.mock("@/modules/admin/admin.model", () => ({
  default: { findById: jest.fn().mockResolvedValue(null) },
}));

jest.mock("tsyringe", () => ({
  __esModule: true,
  container: {
    resolve: jest.fn().mockReturnValue({ findBySessionId: jest.fn() }),
  },
  injectable: () => (target: any) => target,
  inject: () => (target: any, propertyKey: string | symbol) => {},
  injectAll: () => (target: any, propertyKey: string | symbol) => {},
  forwardRef: () => (target: any) => target,
}));

describe("authenticateUser middleware", () => {
  it("returns 401 when no session cookie", async () => {
    const { authenticateUser } = require("@/shared/middleware/auth.middleware");
    const req = { cookies: {} } as Request;
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;
    await authenticateUser(req, res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(401);
  });

  it("returns 401 when session is expired", async () => {
    const { authenticateUser } = require("@/shared/middleware/auth.middleware");
    const container = require("tsyringe").container;
    (container.resolve as jest.Mock).mockReturnValueOnce({
      findBySessionId: jest.fn().mockResolvedValue({ expiresAt: new Date("2020-01-01") }),
    });
    const req = { cookies: { session_id: "expired" } } as Request;
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;
    await authenticateUser(req, res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(401);
  });

  it("returns 401 when user not found", async () => {
    const { authenticateUser } = require("@/shared/middleware/auth.middleware");
    const container = require("tsyringe").container;
    (container.resolve as jest.Mock).mockReturnValueOnce({
      findBySessionId: jest.fn().mockResolvedValue({ expiresAt: new Date("2099-01-01"), userType: "user" }),
    });
    const UserModel = require("@/modules/user/user.model").default;
    UserModel.findById = jest.fn().mockResolvedValue(null);
    const req = { cookies: { session_id: "valid-id" } } as Request;
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;
    await authenticateUser(req, res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(401);
  });

  it("returns 401 for non-user session type", async () => {
    const { authenticateUser } = require("@/shared/middleware/auth.middleware");
    const container = require("tsyringe").container;
    (container.resolve as jest.Mock).mockReturnValueOnce({
      findBySessionId: jest.fn().mockResolvedValue({ expiresAt: new Date("2099-01-01"), userType: "admin" }),
    });
    const req = { cookies: { session_id: "admin-id" } } as Request;
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;
    await authenticateUser(req, res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(401);
  });
});

describe("authenticateAdmin middleware", () => {
  it("returns 401 when no session cookie", async () => {
    const { authenticateAdmin } = require("@/shared/middleware/auth.middleware");
    const req = { cookies: {} } as Request;
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;
    await authenticateAdmin(req, res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(401);
  });

  it("returns 401 when session expired", async () => {
    const { authenticateAdmin } = require("@/shared/middleware/auth.middleware");
    const container = require("tsyringe").container;
    (container.resolve as jest.Mock).mockReturnValueOnce({
      findBySessionId: jest.fn().mockResolvedValue({ expiresAt: new Date("2020-01-01") }),
    });
    const req = { cookies: { session_id: "expired" } } as Request;
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;
    await authenticateAdmin(req, res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(401);
  });

  it("returns 403 for non-admin session type", async () => {
    const { authenticateAdmin } = require("@/shared/middleware/auth.middleware");
    const container = require("tsyringe").container;
    (container.resolve as jest.Mock).mockReturnValueOnce({
      findBySessionId: jest.fn().mockResolvedValue({ expiresAt: new Date("2099-01-01"), userType: "user" }),
    });
    const req = { cookies: { session_id: "user-session" } } as Request;
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;
    await authenticateAdmin(req, res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(403);
  });

  it("returns 401 when admin not found", async () => {
    const { authenticateAdmin } = require("@/shared/middleware/auth.middleware");
    const container = require("tsyringe").container;
    (container.resolve as jest.Mock).mockReturnValueOnce({
      findBySessionId: jest.fn().mockResolvedValue({ expiresAt: new Date("2099-01-01"), userType: "admin", userId: "admin1" }),
    });
    const AdminModel = require("@/modules/admin/admin.model").default;
    AdminModel.findById = jest.fn().mockResolvedValue(null);
    const req = { cookies: { session_id: "admin-id" } } as Request;
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;
    await authenticateAdmin(req, res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(401);
  });
});
