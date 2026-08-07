import { jest } from "@jest/globals";
import { authMiddleware } from "../../src/middleware/auth.middleware.js";

describe("auth middleware", () => {
  test("positive: allows the request when the configured token matches", () => {
    process.env.API_TOKEN = "secret";
    const req = { headers: { authorization: "Bearer secret" } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();

    authMiddleware(req, res, next);

    expect(next).toHaveBeenCalled();
  });

  test("negative: rejects requests with an invalid token", () => {
    process.env.API_TOKEN = "secret";
    const req = { headers: { authorization: "Bearer wrong" } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();

    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: "Unauthorized" });
  });

  test("borderline: skips auth when no API token is configured", () => {
    delete process.env.API_TOKEN;
    const req = { headers: {} };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();

    authMiddleware(req, res, next);

    expect(next).toHaveBeenCalled();
  });
});
