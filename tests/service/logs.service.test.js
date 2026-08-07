import { jest } from "@jest/globals";
import fs from "fs";

const repositoryMocks = {
  getLogsByFilters: jest.fn(),
  hasAnyLogs: jest.fn(),
  insertLogEntry: jest.fn(),
};

jest.unstable_mockModule("../../src/repositories/logs.repository.js", () => repositoryMocks);

const { getLogsData, importLogsIfEmpty } = await import("../../src/services/logs.service.js");

describe("logs service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("positive: returns normalized logs payload from the repository", async () => {
    repositoryMocks.getLogsByFilters.mockResolvedValue({
      records: [{ id: 1, message: "ok" }],
      stats: { total: 1, errors: 0, warns: 0, infos: 1, vehicles: 1, codes: 1 },
    });

    const result = await getLogsData({
      sortBy: "vehicleId",
      sortOrder: "asc",
      limit: 20,
      offset: 0,
    });

    expect(result.sortedBy).toBe("vehicleId");
    expect(result.records).toHaveLength(1);
    expect(result.stats.total).toBe(1);
    expect(result.stats.errors).toBe(0);
  });

  test("negative: returns zeroed stats when repository omits stats", async () => {
    repositoryMocks.getLogsByFilters.mockResolvedValue({ records: [], stats: {} });

    const result = await getLogsData({ sortBy: "dateTimeCreated", sortOrder: "desc", limit: 10, offset: 0 });

    expect(result.stats.total).toBe(0);
    expect(result.stats.errors).toBe(0);
    expect(result.stats.warns).toBe(0);
    expect(result.stats.infos).toBe(0);
    expect(result.stats.vehicles).toBe(0);
    expect(result.stats.codes).toBe(0);
  });

  test("borderline: imports logs only when the table is empty", async () => {
    repositoryMocks.hasAnyLogs.mockResolvedValue(false);
    jest.spyOn(fs, "readFileSync").mockReturnValue("[2024-01-01T00:00:00.000Z] [VEHICLE_ID:101] [ERROR] [CODE:P0420] [test message]\n");

    await importLogsIfEmpty("dummy.log");

    expect(repositoryMocks.hasAnyLogs).toHaveBeenCalled();
    expect(repositoryMocks.insertLogEntry).toHaveBeenCalledWith(
      expect.objectContaining({ vehicleId: 101, code: "P0420" }),
    );

    fs.readFileSync.mockRestore();
  });
});
