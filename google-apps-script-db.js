const SHEET_NAME = "trades";
const SETTINGS_SHEET_NAME = "settings";
const HISTORY_SHEET_NAME = "history";
const BACKUP_PREFIX = "_backup_";
const HEADERS = ["id", "date", "pair", "direction", "result", "profit", "rr", "note", "createdAt", "updatedAt", "method", "deleted", "version"];
const HISTORY_HEADERS = ["timestamp", "action", "id", "version", "payload"];
const DEFAULT_RR_RULES = [
  { startDate: "2026-01-01", value: 5 },
  { startDate: "2026-06-19", value: 10 },
];

function doGet(e) {
  const sheet = getSheet();
  const values = sheet.getDataRange().getValues();
  const rows = values.slice(1).filter((row) => row[0]);
  const deletedTradeIds = rows.filter((row) => isDeleted(row[11])).map((row) => String(row[0]));
  const trades = rows
    .filter((row) => !isDeleted(row[11]))
    .map((row) => ({
      id: String(row[0]),
      date: formatSheetDate(row[1]),
      pair: row[2],
      direction: row[3],
      result: row[4],
      profit: Number(row[5]),
      rr: Number(row[6]),
      note: row[7] || "",
      createdAt: Number(row[8]) || Date.now(),
      updatedAt: Number(row[9]) || Number(row[8]) || Date.now(),
      method: row[10] || "",
      version: Number(row[12]) || 1,
    }));

  return json({
    ok: true,
    trades,
    deletedTradeIds,
    rrRules: getRrRules(),
    methods: getMethods(),
    tradeRules: getTradeRules(),
    serverTime: Date.now(),
  }, e);
}

function doPost(e) {
  const payload = JSON.parse((e.postData && e.postData.contents) || "{}");
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);

  try {
    const sheet = getSheet();
    let result = { ok: true };

    if (payload.action === "upsert") result = upsertTrade(sheet, payload.trade);
    if (payload.action === "delete") result = deleteTrade(sheet, payload.id, payload.updatedAt);
    if (payload.action === "replaceAll") {
      (payload.trades || []).forEach((trade) => upsertTrade(sheet, trade));
      result = { ok: true, migrated: true };
    }
    if (payload.action === "saveRrRules") saveRrRules(payload.rrRules || []);
    if (payload.action === "saveMethods") saveMethods(payload.methods || []);
    if (payload.action === "saveTradeRules") saveTradeRules(payload.tradeRules);

    return json(result, e);
  } finally {
    lock.releaseLock();
  }
}

function getSettingsSheet() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = spreadsheet.getSheetByName(SETTINGS_SHEET_NAME) || spreadsheet.insertSheet(SETTINGS_SHEET_NAME);
  if (sheet.getLastRow() === 0) sheet.appendRow(["key", "value"]);
  return sheet;
}

function getRrRules() {
  const row = getSettingsSheet().getDataRange().getValues().find((item) => item[0] === "rrRules");
  if (!row || !row[1]) return DEFAULT_RR_RULES;
  try {
    const parsed = JSON.parse(row[1]);
    return Array.isArray(parsed) && parsed.length ? parsed : DEFAULT_RR_RULES;
  } catch {
    return DEFAULT_RR_RULES;
  }
}

function getTradeRules() {
  const row = getSettingsSheet().getDataRange().getValues().find((item) => item[0] === "tradeRules");
  if (!row || !row[1]) return null;
  try {
    const parsed = JSON.parse(row[1]);
    return parsed && typeof parsed === "object" ? parsed : null;
  } catch {
    return null;
  }
}

function saveTradeRules(tradeRules) {
  if (tradeRules && typeof tradeRules === "object") saveSetting("tradeRules", tradeRules);
}

function getMethods() {
  const row = getSettingsSheet().getDataRange().getValues().find((item) => item[0] === "methods");
  if (!row || !row[1]) return [];
  try {
    const parsed = JSON.parse(row[1]);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveMethods(methods) {
  const normalized = [...new Set((Array.isArray(methods) ? methods : [])
    .map((method) => String(method || "").trim())
    .filter(Boolean))].sort((a, b) => a.localeCompare(b));
  saveSetting("methods", normalized);
}

function saveRrRules(rules) {
  const normalized = (Array.isArray(rules) && rules.length ? rules : DEFAULT_RR_RULES)
    .map((rule) => ({ startDate: String(rule.startDate || "").slice(0, 10), value: Number(rule.value) }))
    .filter((rule) => rule.startDate && rule.value > 0)
    .sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
  saveSetting("rrRules", normalized.length ? normalized : DEFAULT_RR_RULES);
}

function saveSetting(key, value) {
  const sheet = getSettingsSheet();
  const values = sheet.getDataRange().getValues();
  const index = values.findIndex((item) => item[0] === key);
  const row = [key, JSON.stringify(value)];
  if (index >= 0) sheet.getRange(index + 1, 1, 1, 2).setValues([row]);
  else sheet.appendRow(row);
}

function getSheet() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = spreadsheet.getSheetByName(SHEET_NAME) || spreadsheet.insertSheet(SHEET_NAME);
  if (sheet.getLastRow() === 0) sheet.appendRow(HEADERS);
  else sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
  return sheet;
}

function getHistorySheet() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = spreadsheet.getSheetByName(HISTORY_SHEET_NAME) || spreadsheet.insertSheet(HISTORY_SHEET_NAME);
  if (sheet.getLastRow() === 0) sheet.appendRow(HISTORY_HEADERS);
  return sheet;
}

function findTradeRow(sheet, id) {
  if (sheet.getLastRow() < 2) return 0;
  const ids = sheet.getRange(2, 1, sheet.getLastRow() - 1, 1).getValues().flat();
  const index = ids.findIndex((value) => String(value) === String(id));
  return index >= 0 ? index + 2 : 0;
}

function upsertTrade(sheet, trade) {
  if (!trade || !trade.id) return { ok: false, error: "missing-id" };

  const rowNumber = findTradeRow(sheet, trade.id);
  const current = rowNumber ? sheet.getRange(rowNumber, 1, 1, HEADERS.length).getValues()[0] : null;
  const currentUpdatedAt = current ? Number(current[9]) || 0 : 0;
  const incomingUpdatedAt = Number(trade.updatedAt) || Number(trade.createdAt) || Date.now();

  if (current && incomingUpdatedAt < currentUpdatedAt) {
    return { ok: true, stale: true, id: String(trade.id), version: Number(current[12]) || 1 };
  }

  const version = (current ? Number(current[12]) || 1 : 0) + 1;
  const createdAt = current ? Number(current[8]) || Number(trade.createdAt) || incomingUpdatedAt : Number(trade.createdAt) || incomingUpdatedAt;
  const row = [
    String(trade.id),
    trade.date,
    trade.pair || "",
    trade.direction || "",
    trade.result || "",
    Number(trade.profit),
    Number(trade.rr),
    trade.note || "",
    createdAt,
    incomingUpdatedAt,
    trade.method || "",
    false,
    version,
  ];

  if (rowNumber) sheet.getRange(rowNumber, 1, 1, row.length).setValues([row]);
  else sheet.appendRow(row);
  appendHistory("upsert", trade.id, version, row);
  return { ok: true, id: String(trade.id), version, updatedAt: incomingUpdatedAt };
}

function deleteTrade(sheet, id, requestedUpdatedAt) {
  if (!id) return { ok: false, error: "missing-id" };

  const rowNumber = findTradeRow(sheet, id);
  const current = rowNumber ? sheet.getRange(rowNumber, 1, 1, HEADERS.length).getValues()[0] : null;
  const currentUpdatedAt = current ? Number(current[9]) || 0 : 0;
  const deletedAt = Number(requestedUpdatedAt) || Date.now();

  if (current && deletedAt < currentUpdatedAt) {
    return { ok: true, stale: true, id: String(id), version: Number(current[12]) || 1 };
  }

  const version = (current ? Number(current[12]) || 1 : 0) + 1;
  const row = current || [String(id), "", "", "", "", "", "", "", deletedAt, deletedAt, "", true, version];
  row[0] = String(id);
  row[9] = deletedAt;
  row[11] = true;
  row[12] = version;

  if (rowNumber) sheet.getRange(rowNumber, 1, 1, HEADERS.length).setValues([row]);
  else sheet.appendRow(row);
  appendHistory("delete", id, version, row);
  return { ok: true, id: String(id), version, updatedAt: deletedAt };
}

function appendHistory(action, id, version, payload) {
  getHistorySheet().appendRow([new Date(), action, String(id), version, JSON.stringify(payload)]);
}

function isDeleted(value) {
  return value === true || String(value).toLowerCase() === "true";
}

function createDailyBackup() {
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    const source = getSheet();
    const timezone = Session.getScriptTimeZone();
    const name = BACKUP_PREFIX + Utilities.formatDate(new Date(), timezone, "yyyy-MM-dd");
    const existing = spreadsheet.getSheetByName(name);
    if (existing) spreadsheet.deleteSheet(existing);
    source.copyTo(spreadsheet).setName(name);

    const backups = spreadsheet.getSheets()
      .filter((sheet) => sheet.getName().indexOf(BACKUP_PREFIX) === 0)
      .sort((a, b) => b.getName().localeCompare(a.getName()));
    backups.slice(14).forEach((sheet) => spreadsheet.deleteSheet(sheet));
  } finally {
    lock.releaseLock();
  }
}

function setupDailyBackupTrigger() {
  ScriptApp.getProjectTriggers()
    .filter((trigger) => trigger.getHandlerFunction() === "createDailyBackup")
    .forEach((trigger) => ScriptApp.deleteTrigger(trigger));
  ScriptApp.newTrigger("createDailyBackup").timeBased().everyDays(1).atHour(2).create();
  createDailyBackup();
}

function formatSheetDate(value) {
  if (Object.prototype.toString.call(value) === "[object Date]" && !Number.isNaN(value.getTime())) {
    return Utilities.formatDate(value, Session.getScriptTimeZone(), "yyyy-MM-dd");
  }
  const text = String(value || "");
  const formulaDate = text.match(/^="(\d{4}-\d{2}-\d{2})"$/);
  return formulaDate ? formulaDate[1] : text.slice(0, 10);
}

function json(data, e) {
  const callback = e && e.parameter && e.parameter.callback;
  const output = callback ? `${callback}(${JSON.stringify(data)})` : JSON.stringify(data);
  const mimeType = callback ? ContentService.MimeType.JAVASCRIPT : ContentService.MimeType.JSON;
  return ContentService.createTextOutput(output).setMimeType(mimeType);
}
