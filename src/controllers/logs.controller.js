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
      code: value.code,
      from: value.from,
      to: value.to,
    };

    const logs = await getLogsData(filters);
    return sendSuccess(res, logs);
  } catch (error) {
    const message = error.message || "internal server error";
    const status = error.status || 500;

    if (status >= 500) {
      console.error(error);
    }

    return res.status(status).json({ error: message });
  }
}

export { getLogs };
