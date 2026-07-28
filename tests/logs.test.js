import { getLogsQuerySchema } from "../src/validations/user.validation.js";

describe("getLogsQuerySchema", () => {
  test("accepts valid query values", () => {
    const { error } = getLogsQuerySchema.validate({
      vehicleId: 101,
      code: "P0420",
      from: "2024-01-01T00:00:00.000Z",
      to: "2024-01-02T00:00:00.000Z",
    });

    expect(error).toBeUndefined();
  });

  test("rejects invalid dates", () => {
    const { error } = getLogsQuerySchema.validate({
      from: "not-a-date",
    });

    expect(error).toBeDefined();
  });
});
