import fs from "fs";
import {
  getLogsByFilters,
  hasAnyLogs,
  insertLogEntry,
} from "../repositories/logs.repository.js";

function parseLogLine(line) {
  const match = line.match(
    /\[(.*?)\] \[VEHICLE_ID:(.*?)] \[(.*?)\] \[CODE:(.*?)\] \[(.*?)\]/,
  );

  if (!match) return null;

  const [, dateTimeCreated, vehicleId, logType, code, message] = match;

  return {
    dateTimeCreated,
    vehicleId: Number(vehicleId),
    logType,
    code,
    message,
  };
}

async function importLogsIfEmpty(file = "vehicle_diagnostics_logs.txt") {
  const alreadyHasLogs = await hasAnyLogs();
  if (alreadyHasLogs) return;

  const lines = fs.readFileSync(file, "utf8").split("\n").filter(Boolean);

  for (const line of lines) {
    const entry = parseLogLine(line);
    if (!entry) continue;
    await insertLogEntry(entry);
  }

  console.log("Logs imported successfully");
}

async function getLogsData(filters) {
  const { records, stats } = await getLogsByFilters(filters);

  return {
    sortedBy: filters.sortedBy,
    sortedOrder: filters.sortedOrder,
    limit: filters.limit,
    offset: filters.offset,
    records,
    stats: {
      total: stats.total,
      errors: stats.errors,
      warns: stats.warns,
      infos: stats.infos,
      vehicles: stats.vehicles,
      codes: stats.codes,
    },
  };
}

export { getLogsData, importLogsIfEmpty };
