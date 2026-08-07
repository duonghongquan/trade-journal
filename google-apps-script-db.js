const SHEET_NAME = "trades";
const HEADERS = ["id", "date", "pair", "direction", "result", "profit", "rr", "note", "createdAt"];

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

  return json({ ok: true, trades }, e);
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

  return json({ ok: true }, e);
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
