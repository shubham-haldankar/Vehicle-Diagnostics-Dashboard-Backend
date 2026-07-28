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
  fromDate: Joi.date().iso(),
  toDate: Joi.date().iso(),
});

export { getLogsQuerySchema };
