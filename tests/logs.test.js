import { getLogsQuerySchema } from "../src/validations/logs.validation.js";

describe("getLogsQuerySchema", () => {
  test("accepts valid query values", () => {
    const { error } = getLogsQuerySchema.validate({
      vehicleId: 101,
      errorCode: "P0420",
      fromDate: "2024-01-01T00:00:00.000Z",
      toDate: "2024-01-02T00:00:00.000Z",
    });

    expect(error).toBeUndefined();
  });

  test("rejects invalid dates", () => {
    const { error } = getLogsQuerySchema.validate({
      fromDate: "not-a-date",
    });

    expect(error).toBeDefined();
  });
});
