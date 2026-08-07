import { jest } from "@jest/globals";
import { sendCreated, sendSuccess } from "../../src/utils/response.js";

describe("response helpers", () => {
  test("positive: sendSuccess returns a JSON response with status", () => {
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    sendSuccess(res, { ok: true });

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ ok: true });
  });

  test("negative: sendCreated returns created status", () => {
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    sendCreated(res, { ok: true });

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ ok: true });
  });

  test("borderline: sendSuccess accepts a custom status code", () => {
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    sendSuccess(res, { ok: true }, 202);

    expect(res.status).toHaveBeenCalledWith(202);
  });
});
