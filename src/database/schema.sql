CREATE TABLE IF NOT EXISTS vehicle_diagnostics_logs (
    id SERIAL PRIMARY KEY,
    dateTimeCreated TEXT NOT NULL,
    vehicleId INTEGER NOT NULL,
    logType TEXT NOT NULL,
    code TEXT NOT NULL,
    message TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_logs_datetimecreated
    ON vehicle_diagnostics_logs (dateTimeCreated DESC);

CREATE INDEX IF NOT EXISTS idx_logs_vehicleid_datetime
    ON vehicle_diagnostics_logs (vehicleId, dateTimeCreated DESC);

CREATE INDEX IF NOT EXISTS idx_logs_logtype_datetime
    ON vehicle_diagnostics_logs (logType, dateTimeCreated DESC);

CREATE INDEX IF NOT EXISTS idx_logs_code_datetime
    ON vehicle_diagnostics_logs (code, dateTimeCreated DESC);