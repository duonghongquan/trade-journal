const SHEET_NAME = "trades";
const SETTINGS_SHEET_NAME = "settings";
const HEADERS = ["id", "date", "pair", "direction", "result", "profit", "rr", "note", "createdAt"];
const DEFAULT_RR_RULES = [
  { startDate: "2026-01-01", value: 5 },
  { startDate: "2026-06-19", value: 10 },
];

function doGet(e) {
  const sheet = getSheet();
  const values = sheet.getDataRange().getValues();
  const rows = values.slice(1);
  const trades = rows
    .filter((row) => row[0])
    .map((row) => ({
      id: row[0],
      date: formatSheetDate(row[1]),
      pair: row[2],
      direction: row[3],
      result: row[4],
      profit: Number(row[5]),
      rr: Number(row[6]),
      note: row[7] || "",
      createdAt: Number(row[8]) || Date.now(),
    }));

  return json({ ok: true, trades, rrRules: getRrRules() }, e);
}

function doPost(e) {
  const payload = JSON.parse(e.postData.contents || "{}");
  const sheet = getSheet();

  if (payload.action === "upsert") {
    upsertTrade(sheet, payload.trade);
  }

  if (payload.action === "delete") {
    deleteTrade(sheet, payload.id);
  }

  if (payload.action === "replaceAll") {
    replaceAll(sheet, payload.trades || []);
  }

  if (payload.action === "saveRrRules") {
    saveRrRules(payload.rrRules || []);
  }

  return json({ ok: true }, e);
}

function getSettingsSheet() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = spreadsheet.getSheetByName(SETTINGS_SHEET_NAME) || spreadsheet.insertSheet(SETTINGS_SHEET_NAME);

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(["key", "value"]);
  }

  return sheet;
}

function getRrRules() {
  const sheet = getSettingsSheet();
  const values = sheet.getDataRange().getValues();
  const row = values.find((item) => item[0] === "rrRules");

  if (!row || !row[1]) return DEFAULT_RR_RULES;

  try {
    const parsed = JSON.parse(row[1]);
    return Array.isArray(parsed) && parsed.length ? parsed : DEFAULT_RR_RULES;
  } catch {
    return DEFAULT_RR_RULES;
  }
}

function saveRrRules(rules) {
  const sheet = getSettingsSheet();
  const normalizedRules = (Array.isArray(rules) && rules.length ? rules : DEFAULT_RR_RULES)
    .map((rule) => ({
      startDate: String(rule.startDate || "").slice(0, 10),
      value: Number(rule.value),
    }))
    .filter((rule) => rule.startDate && rule.value > 0)
    .sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
  const values = sheet.getDataRange().getValues();
  const index = values.findIndex((item) => item[0] === "rrRules");
  const row = ["rrRules", JSON.stringify(normalizedRules.length ? normalizedRules : DEFAULT_RR_RULES)];

  if (index >= 0) {
    sheet.getRange(index + 1, 1, 1, 2).setValues([row]);
  } else {
    sheet.appendRow(row);
  }
}

function getSheet() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = spreadsheet.getSheetByName(SHEET_NAME) || spreadsheet.insertSheet(SHEET_NAME);

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
  }

  return sheet;
}

function upsertTrade(sheet, trade) {
  if (!trade || !trade.id) return;

  const row = [
    trade.id,
    trade.date,
    trade.pair,
    trade.direction,
    trade.result,
    Number(trade.profit),
    Number(trade.rr),
    trade.note || "",
    Number(trade.createdAt) || Date.now(),
  ];
  const ids = sheet.getRange(2, 1, Math.max(sheet.getLastRow() - 1, 1), 1).getValues().flat();
  const index = ids.findIndex((id) => String(id) === String(trade.id));

  if (index >= 0) {
    sheet.getRange(index + 2, 1, 1, row.length).setValues([row]);
  } else {
    sheet.appendRow(row);
  }
}

function deleteTrade(sheet, id) {
  const ids = sheet.getRange(2, 1, Math.max(sheet.getLastRow() - 1, 1), 1).getValues().flat();
  const index = ids.findIndex((value) => String(value) === String(id));

  if (index >= 0) {
    sheet.deleteRow(index + 2);
  }
}

function replaceAll(sheet, trades) {
  sheet.clear();
  sheet.appendRow(HEADERS);
  trades.forEach((trade) => upsertTrade(sheet, trade));
}

function formatSheetDate(value) {
  if (Object.prototype.toString.call(value) === "[object Date]" && !Number.isNaN(value.getTime())) {
    return Utilities.formatDate(value, Session.getScriptTimeZone(), "yyyy-MM-dd");
  }

  return String(value || "").slice(0, 10);
}

function json(data, e) {
  const callback = e && e.parameter && e.parameter.callback;
  const output = callback ? `${callback}(${JSON.stringify(data)})` : JSON.stringify(data);
  const mimeType = callback ? ContentService.MimeType.JAVASCRIPT : ContentService.MimeType.JSON;

  return ContentService.createTextOutput(output).setMimeType(mimeType);
}
