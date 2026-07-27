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
  code: Joi.string().trim(),
  from: Joi.date().iso(),
  to: Joi.date().iso(),
});

export { getLogsQuerySchema };
