import Joi from "joi";

const getLogsQuerySchema = Joi.object({
  vehicleid: Joi.alternatives().try(
    Joi.number().integer(),
    Joi.string().trim(),
  ),
  vehicleId: Joi.alternatives().try(
    Joi.number().integer(),
    Joi.string().trim(),
  ),
  errorCode: Joi.string().trim(),
  severity: Joi.string().trim(),
  fromDate: Joi.date().iso(),
  toDate: Joi.date().iso(),
  limit: Joi.number().integer().min(1).max(100000).default(10),
  offset: Joi.number().integer().min(0).default(0),
  sortBy: Joi.string()
    .valid("dateTimeCreated", "vehicleId", "logType", "code")
    .default("dateTimeCreated"),
  sortOrder: Joi.string().valid("asc", "desc").default("desc"),
});

export { getLogsQuerySchema };
