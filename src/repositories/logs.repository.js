import { db } from "../config/database.js";

async function hasAnyLogs() {
  const result = await db.query(
    "SELECT 1 FROM vehicle_diagnostics_logs LIMIT 1",
  );
  return result.rows.length > 0;
}

async function insertLogEntry(entry) {
  await db.query(
    `
    INSERT INTO vehicle_diagnostics_logs
      (dateTimeCreated, vehicleId, logType, code, message)
    VALUES ($1, $2, $3, $4, $5)
    `,
    [
      entry.dateTimeCreated,
      entry.vehicleId,
      entry.logType,
      entry.code,
      entry.message,
    ],
  );
}

async function getLogsByFilters(filters) {
  let sql = `
    SELECT
      id,
      datetimecreated AS "dateTimeCreated",
      vehicleid AS "vehicleId",
      logtype AS "type",
      code,
      message
    FROM vehicle_diagnostics_logs
    WHERE 1=1
  `;

  const params = [];
  let i = 1;

  if (filters.vehicleId) {
    sql += ` AND vehicleid = $${i++}`;
    params.push(Number(filters.vehicleId));
  }

  if (filters.errorCode) {
    sql += ` AND code = $${i++}`;
    params.push(filters.errorCode);
  }

  if (filters.fromDate) {
    sql += ` AND datetimecreated >= $${i++}`;
    params.push(filters.fromDate.toISOString());
  }

  if (filters.toDate) {
    sql += ` AND datetimecreated <= $${i++}`;
    params.push(filters.toDate.toISOString());
  }

  const { rows } = await db.query(sql, params);
  return rows;
}

export { getLogsByFilters, hasAnyLogs, insertLogEntry };
