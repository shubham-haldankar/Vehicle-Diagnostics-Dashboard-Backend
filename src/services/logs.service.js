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
  return getLogsByFilters(filters);
}

export { getLogsData, importLogsIfEmpty };
