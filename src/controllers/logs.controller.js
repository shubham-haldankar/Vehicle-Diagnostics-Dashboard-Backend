import { getLogsQuerySchema } from "../validations/logs.validation.js";
import { getLogsData } from "../services/logs.service.js";
import { sendSuccess } from "../utils/response.js";

async function getLogs(req, res, next) {
  try {
    const { error, value } = getLogsQuerySchema.validate(req.query, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const validationError = new Error(
        error.details.map((d) => d.message).join(", "),
      );
      validationError.status = 400;
      throw validationError;
    }

    const filters = {
      vehicleId: value.vehicleId ?? value.vehicleid,
      errorCode: value.errorCode,
      severity: value.severity,
      fromDate: value.fromDate,
      toDate: value.toDate,
      limit: value.limit,
      offset: value.offset,
      sortBy: value.sortBy,
      sortOrder: value.sortOrder,
    };

    const logs = await getLogsData(filters);
    return sendSuccess(res, logs);
  } catch (error) {
    return next(error);
  }
}

export { getLogs };
