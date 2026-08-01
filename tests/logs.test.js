import { getLogsQuerySchema } from "../src/validations/logs.validation.js";

describe("getLogsQuerySchema", () => {
  test("accepts valid query values", () => {
    const { error, value } = getLogsQuerySchema.validate({
      vehicleId: 101,
      errorCode: "P0420",
      severity: "ERROR",
      fromDate: "2024-01-01T00:00:00.000Z",
      toDate: "2024-01-02T00:00:00.000Z",
      limit: 100000,
      offset: 0,
      sortedBy: "vehicleId",
      sortedOrder: "asc",
    });

    expect(error).toBeUndefined();
    expect(value.limit).toBe(100000);
    expect(value.offset).toBe(0);
    expect(value.sortedBy).toBe("vehicleId");
    expect(value.sortedOrder).toBe("asc");
  });

  test("applies default pagination and sorting values", () => {
    const { error, value } = getLogsQuerySchema.validate({});

    expect(error).toBeUndefined();
    expect(value.limit).toBe(10);
    expect(value.offset).toBe(0);
    expect(value.sortedBy).toBe("dateTimeCreated");
    expect(value.sortedOrder).toBe("desc");
  });

  test("rejects invalid dates", () => {
    const { error } = getLogsQuerySchema.validate({
      fromDate: "not-a-date",
    });

    expect(error).toBeDefined();
  });

  test("rejects invalid pagination values", () => {
    const { error } = getLogsQuerySchema.validate({
      limit: 100001,
      offset: -1,
    });

    expect(error).toBeDefined();
  });

  test("rejects invalid sorting values", () => {
    const { error } = getLogsQuerySchema.validate({
      sortedBy: "message",
      sortedOrder: "descending",
    });

    expect(error).toBeDefined();
  });
});
