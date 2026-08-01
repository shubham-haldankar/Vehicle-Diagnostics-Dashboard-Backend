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

  let statsSql = `
  SELECT
      COUNT(*)::int AS "total",
      COUNT(*) FILTER (WHERE logtype = 'ERROR')::int AS "errors",
      COUNT(*) FILTER (WHERE logtype = 'WARN')::int AS "warns",
      COUNT(*) FILTER (WHERE logtype = 'INFO')::int AS "infos",
      COUNT(DISTINCT vehicleid)::int AS "vehicles",
      COUNT(DISTINCT code)::int AS "codes"
  FROM vehicle_diagnostics_logs
  WHERE 1=1
  `;

  const params = [];
  let i = 1;

  if (filters.vehicleId) {
    sql += ` AND vehicleid = $${i}`;
    statsSql += ` AND vehicleid = $${i++}`;
    params.push(Number(filters.vehicleId));
  }

  if (filters.errorCode) {
    sql += ` AND code = $${i}`;
    statsSql += ` AND code = $${i++}`;
    params.push(filters.errorCode);
  }

  if (filters.severity) {
    sql += ` AND logtype = $${i}`;
    statsSql += ` AND logtype = $${i++}`;
    params.push(filters.severity);
  }

  if (filters.fromDate) {
    sql += ` AND datetimecreated >= $${i}`;
    statsSql += ` AND datetimecreated >= $${i++}`;
    params.push(filters.fromDate.toISOString());
  }

  if (filters.toDate) {
    sql += ` AND datetimecreated <= $${i}`;
    statsSql += ` AND datetimecreated <= $${i++}`;
    params.push(filters.toDate.toISOString());
  }

  sql += ` ORDER BY ${filters.sortBy} ${filters.sortOrder}, id DESC`;
  sql += ` LIMIT $${i++} OFFSET $${i++}`;
  params.push(filters.limit, filters.offset);

  const { rows: records } = await db.query(sql, params);
  const { rows: statsRows } = await db.query(statsSql, params.slice(0, -2));

  return {
    records,
    stats: {
      total: statsRows[0]?.total ?? 0,
      errors: statsRows[0]?.errors ?? 0,
      warns: statsRows[0]?.warns ?? 0,
      infos: statsRows[0]?.infos ?? 0,
      vehicles: statsRows[0]?.vehicles ?? 0,
      codes: statsRows[0]?.codes ?? 0,
    },
  };
}

export { getLogsByFilters, hasAnyLogs, insertLogEntry };
