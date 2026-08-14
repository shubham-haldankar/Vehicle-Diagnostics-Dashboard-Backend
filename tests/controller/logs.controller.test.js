import { jest } from "@jest/globals";

const validationMocks = {
  getLogsQuerySchema: {
    validate: jest.fn(),
  },
};

const serviceMocks = {
  getLogsData: jest.fn(),
};

const responseMocks = {
  sendSuccess: jest.fn(),
};

jest.unstable_mockModule("../../src/validations/logs.validation.js", () => validationMocks);
jest.unstable_mockModule("../../src/services/logs.service.js", () => serviceMocks);
jest.unstable_mockModule("../../src/utils/response.js", () => responseMocks);

const { getLogs } = await import("../../src/controllers/logs.controller.js");

describe("logs controller", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("positive: sends success payload for valid queries", async () => {
    const req = { query: { vehicleId: 7, limit: 5 } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();

    validationMocks.getLogsQuerySchema.validate.mockReturnValue({
      error: undefined,
      value: { vehicleId: 7, limit: 5 },
    });
    serviceMocks.getLogsData.mockResolvedValue({ records: [{ id: 1 }], stats: { total: 1 } });
    responseMocks.sendSuccess.mockReturnValue({ ok: true });

    await getLogs(req, res, next);

    expect(responseMocks.sendSuccess).toHaveBeenCalledWith(res, expect.objectContaining({ records: [{ id: 1 }] }));
    expect(next).not.toHaveBeenCalled();
  });

  test("negative: forwards validation errors to the next middleware", async () => {
    const req = { query: { limit: 100001 } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();

    validationMocks.getLogsQuerySchema.validate.mockReturnValue({
      error: { details: [{ message: "limit must be less than 100000" }] },
    });

    await getLogs(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.objectContaining({ status: 400 }));
  });

  test("borderline: uses default values when the query is empty", async () => {
    const req = { query: {} };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();

    validationMocks.getLogsQuerySchema.validate.mockReturnValue({
      error: undefined,
      value: {},
    });
    serviceMocks.getLogsData.mockResolvedValue({ records: [], stats: { total: 0 } });
    responseMocks.sendSuccess.mockReturnValue({ ok: true });

    await getLogs(req, res, next);

    expect(responseMocks.sendSuccess).toHaveBeenCalled();
    expect(next).not.toHaveBeenCalled();
  });
});
