const STORAGE_KEY = "private-trade-journal-v1";
const REMOTE_DB_URL =
  "https://script.google.com/macros/s/AKfycbzDQd69vlW_T4kcOQjnysea-SvltWCVCAP6yhzfWFWLfRp7A0JJ1BN2ZPyDIWGtCrms/exec";
const HISTORICAL_IMPORT_KEY = "private-trade-journal-btc-history-v1-imported";
const ALL_HISTORY_IMPORT_KEY = "private-trade-journal-all-history-v2-imported";
const LOCAL_LEGACY_RR_MIGRATION_KEY = "private-trade-journal-legacy-5usd-rr-local-v1";
const REMOTE_LEGACY_RR_MIGRATION_KEY = "private-trade-journal-legacy-5usd-rr-remote-v1";
const LEGACY_RR_CUTOFF_DATE = "2026-06-18";
const ONE_R_VALUE = 10;
const LEGACY_ONE_R_VALUE = 5;

const seedTrades = [
  { date: "2026-07-17", pair: "XAU", direction: "SHORT", result: "LOSS", profit: -10, rr: -1, note: "" },
  { date: "2026-07-20", pair: "XAU", direction: "SHORT", result: "LOSS", profit: -10, rr: -1, note: "thuận EMA M15 H1, nằm giữa EMA H4" },
  { date: "2026-07-20", pair: "XAU", direction: "LONG", result: "LOSS", profit: -10, rr: -1, note: "" },
  { date: "2026-07-20", pair: "XAU", direction: "SHORT", result: "LOSS", profit: -10, rr: -1, note: "" },
  { date: "2026-07-23", pair: "XAU", direction: "LONG", result: "LOSS", profit: -10, rr: -1, note: "" },
  { date: "2026-07-28", pair: "XAU", direction: "SHORT", result: "WIN", profit: 5, rr: 0.5, note: "" },
  { date: "2026-07-29", pair: "XAU", direction: "SHORT", result: "LOSS", profit: -10, rr: -1, note: "" },
  { date: "2026-07-29", pair: "XAU", direction: "SHORT", result: "WIN", profit: 4, rr: 0.4, note: "" },
  { date: "2026-07-30", pair: "XAU", direction: "LONG", result: "WIN", profit: 3, rr: 0.3, note: "" },
  { date: "2026-07-30", pair: "XAU", direction: "LONG", result: "WIN", profit: 3, rr: 0.3, note: "" },
  { date: "2026-07-31", pair: "XAU", direction: "LONG", result: "LOSS", profit: -9, rr: -0.9, note: "" },
].map((trade, index) => ({ ...trade, id: crypto.randomUUID(), createdAt: index }));

const historicalBtcTrades = [
  { date: "2026-04-10", direction: "SHORT", profit: -6, note: "Ngược xu hướng" },
  { date: "2026-04-10", direction: "LONG", profit: 5, note: "" },
  { date: "2026-04-11", direction: "SHORT", profit: -5, note: "Ngược xu hướng" },
  { date: "2026-04-12", direction: "LONG", profit: 6.5, note: "" },
  { date: "2026-04-13", direction: "SHORT", profit: -9, note: "" },
  { date: "2026-04-13", direction: "LONG", profit: 15, note: "" },
  { date: "2026-04-15", direction: "SHORT", profit: -5, note: "Ngược xu hướng" },
  { date: "2026-04-15", direction: "LONG", profit: -5, note: "" },
  { date: "2026-04-15", direction: "SHORT", profit: -5, note: "Ngược xu hướng" },
  { date: "2026-04-17", direction: "LONG", profit: 12.5, note: "" },
  { date: "2026-04-19", direction: "SHORT", profit: 5, note: "Ngược xu hướng" },
  { date: "2026-04-20", direction: "LONG", profit: 1.5, note: "" },
  { date: "2026-04-22", direction: "SHORT", profit: 1.5, note: "Ngược xu hướng" },
  { date: "2026-04-23", direction: "LONG", profit: -5.5, note: "" },
  { date: "2026-04-23", direction: "SHORT", profit: -6, note: "Ngược xu hướng" },
  { date: "2026-04-27", direction: "SHORT", profit: 5, note: "" },
  { date: "2026-04-30", direction: "SHORT", profit: -8, note: "" },
  { date: "2026-05-01", direction: "LONG", profit: 7, note: "" },
  { date: "2026-05-02", direction: "LONG", profit: 9.5, note: "" },
  { date: "2026-05-03", direction: "SHORT", profit: -5.5, note: "" },
  { date: "2026-05-07", direction: "SHORT", profit: 5, note: "" },
  { date: "2026-05-13", direction: "SHORT", profit: -5.5, note: "" },
  { date: "2026-05-16", direction: "SHORT", profit: 6, note: "" },
  { date: "2026-05-21", direction: "SHORT", profit: -6, note: "" },
  { date: "2026-05-26", direction: "SHORT", profit: -5.5, note: "" },
  { date: "2026-05-27", direction: "SHORT", profit: 15, note: "" },
  { date: "2026-06-01", direction: "SHORT", profit: 10.5, note: "" },
  { date: "2026-06-02", direction: "LONG", profit: -5.5, note: "bắt đáy" },
  { date: "2026-06-02", direction: "LONG", profit: -5, note: "bắt đáy" },
  { date: "2026-06-03", direction: "LONG", profit: -6, note: "bắt đáy" },
  { date: "2026-06-07", direction: "LONG", profit: 10, note: "ngược xu hướng, M15 có cấu trúc tăng" },
  { date: "2026-06-08", direction: "LONG", profit: -5, note: "ngược xu hướng" },
  { date: "2026-06-18", direction: "SHORT", profit: 5, note: "" },
  { date: "2026-06-20", direction: "SHORT", profit: -10, note: "" },
  { date: "2026-06-23", direction: "SHORT", profit: 4.5, note: "" },
  { date: "2026-06-24", direction: "SHORT", profit: 15, note: "" },
  { date: "2026-06-26", direction: "LONG", profit: 7, note: "ngược xu hướng" },
  { date: "2026-06-28", direction: "SHORT", profit: -10.5, note: "" },
  { date: "2026-06-28", direction: "SHORT", profit: 15, note: "" },
  { date: "2026-06-29", direction: "LONG", profit: -10, note: "ngược xu hướng" },
  { date: "2026-06-29", direction: "SHORT", profit: -10, note: "" },
  { date: "2026-06-30", direction: "SHORT", profit: 10, note: "" },
  { date: "2026-06-30", direction: "SHORT", profit: -10, note: "" },
  { date: "2026-07-01", direction: "SHORT", profit: -10, note: "" },
  { date: "2026-07-02", direction: "LONG", profit: 10, note: "thuận EMA M15 H1, nằm giữa EMA H4" },
  { date: "2026-07-03", direction: "LONG", profit: 5, note: "" },
  { date: "2026-07-04", direction: "LONG", profit: 10, note: "" },
  { date: "2026-07-07", direction: "LONG", profit: 5, note: "" },
  { date: "2026-07-08", direction: "SHORT", profit: -10, note: "" },
  { date: "2026-07-09", direction: "LONG", profit: 20, note: "" },
  { date: "2026-07-11", direction: "LONG", profit: -10.5, note: "" },
  { date: "2026-07-13", direction: "SHORT", profit: 10.5, note: "thuận EMA M15 H1, nằm giữa EMA H4" },
  { date: "2026-07-14", direction: "SHORT", profit: -10, note: "ngược M15" },
  { date: "2026-07-15", direction: "LONG", profit: -10, note: "" },
  { date: "2026-07-19", direction: "LONG", profit: -10.5, note: "" },
  { date: "2026-07-20", direction: "SHORT", profit: -9.5, note: "thuận EMA M15 H1, nằm giữa EMA H4" },
  { date: "2026-07-24", direction: "SHORT", profit: 8, note: "thuận EMA M15 H1, nằm giữa EMA H4" },
  { date: "2026-07-26", direction: "LONG", profit: 10.5, note: "" },
  { date: "2026-07-27", direction: "LONG", profit: -10, note: "" },
  { date: "2026-07-28", direction: "SHORT", profit: 6, note: "" },
  { date: "2026-07-29", direction: "SHORT", profit: -10, note: "" },
  { date: "2026-07-30", direction: "SHORT", profit: -10.5, note: "" },
  { date: "2026-07-31", direction: "LONG", profit: -17, note: "" },
  { date: "2026-07-31", direction: "SHORT", profit: 6.5, note: "" },
].map((trade, index) => {
  const sourceId = `btc-history-2026-${String(index + 1).padStart(3, "0")}`;
  return {
    ...trade,
    id: sourceId,
    sourceId,
    pair: "BTC",
    result: profitToResult(trade.profit),
    rr: profitToRByDate(trade.profit, trade.date),
    createdAt: 10000 + index,
  };
});

const historicalOtherTrades = [
  { date: "2026-04-01", pair: "ETH", direction: "SHORT", profit: -6, note: "Ngược xu hướng" },
  { date: "2026-04-02", pair: "SOL", direction: "SHORT", profit: -5, note: "" },
  { date: "2026-04-03", pair: "ETH", direction: "SHORT", profit: -5, note: "" },
  { date: "2026-04-06", pair: "ETH", direction: "SHORT", profit: -6, note: "Ngược xu hướng" },
  { date: "2026-04-10", pair: "XAU", direction: "LONG", profit: -5, note: "" },
  { date: "2026-04-13", pair: "XAU", direction: "SHORT", profit: 5.5, note: "kéo bot" },
  { date: "2026-04-14", pair: "XAU", direction: "SHORT", profit: -5, note: "kéo bot" },
  { date: "2026-04-14", pair: "XAU", direction: "LONG", profit: 5, note: "" },
  { date: "2026-04-15", pair: "XAU", direction: "LONG", profit: 7.5, note: "" },
  { date: "2026-04-15", pair: "XAU", direction: "LONG", profit: -3.5, note: "" },
  { date: "2026-04-17", pair: "XAU", direction: "LONG", profit: 5, note: "" },
  { date: "2026-04-21", pair: "XAU", direction: "SHORT", profit: -5, note: "" },
  { date: "2026-04-21", pair: "XAU", direction: "SHORT", profit: 7.5, note: "" },
  { date: "2026-04-22", pair: "XAU", direction: "SHORT", profit: 9, note: "" },
  { date: "2026-04-23", pair: "XAU", direction: "LONG", profit: -4.5, note: "" },
  { date: "2026-04-23", pair: "XAU", direction: "SHORT", profit: 9, note: "" },
  { date: "2026-04-24", pair: "XAU", direction: "LONG", profit: 5, note: "Ngược xu hướng" },
  { date: "2026-04-29", pair: "XAU", direction: "LONG", profit: -5, note: "Ngược xu hướng" },
  { date: "2026-04-29", pair: "XAU", direction: "SHORT", profit: 9.5, note: "" },
  { date: "2026-04-30", pair: "XAU", direction: "SHORT", profit: -5, note: "" },
  { date: "2026-05-05", pair: "XAU", direction: "LONG", profit: -2.5, note: "" },
  { date: "2026-05-05", pair: "XAU", direction: "SHORT", profit: -7.5, note: "" },
  { date: "2026-05-05", pair: "XAU", direction: "LONG", profit: 10, note: "" },
].map((trade, index) => {
  const sourceId = `other-history-2026-${String(index + 1).padStart(3, "0")}`;
  return {
    ...trade,
    id: sourceId,
    sourceId,
    result: profitToResult(trade.profit),
    rr: profitToRByDate(trade.profit, trade.date),
    createdAt: 20000 + index,
  };
});

const historicalTrades = [...historicalBtcTrades, ...historicalOtherTrades];

const state = {
  trades: loadTrades(),
  chartMode: "profit",
  sortOrder: "newest",
  monthFilterInitialized: false,
  chartPoints: [],
  activeChartIndex: null,
};

if (localStorage.getItem(LOCAL_LEGACY_RR_MIGRATION_KEY) !== "true") {
  state.trades = applyLegacyRrRule(state.trades);
  localStorage.setItem(LOCAL_LEGACY_RR_MIGRATION_KEY, "true");
}
localStorage.setItem(STORAGE_KEY, JSON.stringify(state.trades));
localStorage.setItem(HISTORICAL_IMPORT_KEY, "true");
localStorage.setItem(ALL_HISTORY_IMPORT_KEY, "true");

const elements = {
  form: document.querySelector("#tradeForm"),
  formTitle: document.querySelector("#formTitle"),
  tradeId: document.querySelector("#tradeId"),
  tradeDate: document.querySelector("#tradeDate"),
  pair: document.querySelector("#pair"),
  direction: document.querySelector("#direction"),
  result: document.querySelector("#result"),
  profit: document.querySelector("#profit"),
  rr: document.querySelector("#rr"),
  note: document.querySelector("#note"),
  submitTrade: document.querySelector("#submitTrade"),
  resetForm: document.querySelector("#resetForm"),
  totalProfit: document.querySelector("#totalProfit"),
  totalR: document.querySelector("#totalR"),
  winrate: document.querySelector("#winrate"),
  tradeCount: document.querySelector("#tradeCount"),
  avgWin: document.querySelector("#avgWin"),
  avgLoss: document.querySelector("#avgLoss"),
  growthChart: document.querySelector("#growthChart"),
  tradeRows: document.querySelector("#tradeRows"),
  monthFilter: document.querySelector("#monthFilter"),
  pairFilter: document.querySelector("#pairFilter"),
  noteFilter: document.querySelector("#noteFilter"),
  monthSortToggle: document.querySelector("#monthSortToggle"),
  monthSortIcon: document.querySelector("#monthSortIcon"),
  filterSummary: document.querySelector("#filterSummary"),
  exportExcel: document.querySelector("#exportExcel"),
  backupData: document.querySelector("#backupData"),
  importData: document.querySelector("#importData"),
  importDataFile: document.querySelector("#importDataFile"),
  clearAll: document.querySelector("#clearAll"),
};

function loadTrades() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return mergeHistoricalTrades(normalizeTrades(seedTrades));

  try {
    const parsed = JSON.parse(saved);
    const trades = Array.isArray(parsed) ? normalizeTrades(parsed) : normalizeTrades(seedTrades);
    if (localStorage.getItem(ALL_HISTORY_IMPORT_KEY) === "true") return trades;
    return Array.isArray(parsed)
      ? mergeHistoricalTrades(trades)
      : mergeHistoricalTrades(normalizeTrades(seedTrades));
  } catch {
    return mergeHistoricalTrades(normalizeTrades(seedTrades));
  }
}

function saveTrades() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.trades));
}

async function initializeRemoteStore() {
  const remoteTrades = await loadRemoteTrades();

  if (remoteTrades.length) {
    state.trades =
      localStorage.getItem(REMOTE_LEGACY_RR_MIGRATION_KEY) === "true"
        ? normalizeTrades(remoteTrades)
        : applyLegacyRrRule(remoteTrades);
    saveTrades();
    render();
    if (localStorage.getItem(REMOTE_LEGACY_RR_MIGRATION_KEY) !== "true") {
      await sendRemoteAction("replaceAll", { trades: sortedTrades(state.trades).map(remoteTradePayload) });
      localStorage.setItem(REMOTE_LEGACY_RR_MIGRATION_KEY, "true");
    }
    return;
  }

  await sendRemoteAction("replaceAll", { trades: sortedTrades(state.trades).map(remoteTradePayload) });
  localStorage.setItem(REMOTE_LEGACY_RR_MIGRATION_KEY, "true");
}

async function loadRemoteTrades() {
  try {
    const response = await fetch(REMOTE_DB_URL);
    const data = await response.json();
    return Array.isArray(data.trades) ? data.trades : [];
  } catch {
    return loadRemoteTradesJsonp();
  }
}

function loadRemoteTradesJsonp() {
  return new Promise((resolve) => {
    const callbackName = `tradeJournalCallback_${Date.now()}`;
    const script = document.createElement("script");
    const cleanup = () => {
      delete window[callbackName];
      script.remove();
    };

    window[callbackName] = (data) => {
      cleanup();
      resolve(Array.isArray(data.trades) ? data.trades : []);
    };

    script.addEventListener("error", () => {
      cleanup();
      resolve([]);
    });

    script.src = `${REMOTE_DB_URL}?callback=${callbackName}`;
    document.body.appendChild(script);
  });
}

async function sendRemoteAction(action, payload) {
  try {
    await fetch(REMOTE_DB_URL, {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "text/plain;charset=utf-8",
      },
      body: JSON.stringify({ action, ...payload }),
    });
  } catch {
    // LocalStorage remains the offline fallback if Google Sheets is unavailable.
  }
}

function remoteTradePayload(trade) {
  return {
    id: trade.id,
    date: trade.date,
    pair: trade.pair,
    direction: trade.direction,
    result: trade.result,
    profit: Number(trade.profit),
    rr: Number(trade.rr),
    note: trade.note || "",
    createdAt: Number(trade.createdAt) || Date.now(),
  };
}

function mergeTradesById(currentTrades, importedTrades) {
  const map = new Map(currentTrades.map((trade) => [trade.id, trade]));
  normalizeTrades(importedTrades).forEach((trade) => {
    if (!trade.id) trade.id = crypto.randomUUID();
    map.set(trade.id, trade);
  });
  return [...map.values()];
}

function normalizeTrades(trades) {
  return trades.map((trade) => ({
    ...trade,
    date: normalizeDateValue(trade.date),
    result: profitToResult(trade.profit),
    rr: normalizeRValue(trade),
  }));
}

function normalizeRValue(trade) {
  const rr = Number(trade.rr);
  return Number.isFinite(rr) ? rr : profitToRByDate(trade.profit, trade.date);
}

function applyLegacyRrRule(trades) {
  return normalizeTrades(trades).map((trade) => {
    if (!isLegacyRrTrade(trade)) return trade;

    return {
      ...trade,
      rr: profitToRByDate(trade.profit, trade.date),
    };
  });
}

function isLegacyRrTrade(trade) {
  return normalizeDateValue(trade.date) <= LEGACY_RR_CUTOFF_DATE;
}

function normalizeDateValue(value) {
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) return value;

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return String(value || "").slice(0, 10);

  const year = parsed.getFullYear();
  const month = String(parsed.getMonth() + 1).padStart(2, "0");
  const day = String(parsed.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function mergeHistoricalTrades(trades) {
  const existingSourceIds = new Set(trades.map((trade) => trade.sourceId).filter(Boolean));
  const newHistoricalTrades = historicalTrades.filter((trade) => !existingSourceIds.has(trade.sourceId));
  return [...trades, ...newHistoricalTrades];
}

function money(value) {
  const absolute = Math.abs(value);
  const formatted = absolute % 1 === 0 ? absolute.toFixed(0) : absolute.toFixed(2);
  return `${value < 0 ? "-" : ""}$${formatted}`;
}

function formatR(value) {
  const normalized = Number(value.toFixed(2));
  return `${normalized.toString().replace(".", ",")}R`;
}

function profitToR(profit) {
  return Number((Number(profit) / ONE_R_VALUE).toFixed(2));
}

function profitToRByDate(profit, date) {
  const oneR = normalizeDateValue(date) <= LEGACY_RR_CUTOFF_DATE ? LEGACY_ONE_R_VALUE : ONE_R_VALUE;
  return Number((Number(profit) / oneR).toFixed(2));
}

function profitToResult(profit) {
  return Number(profit) >= 0 ? "WIN" : "LOSS";
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function monthLabel(date) {
  const parsed = new Date(`${date}T00:00:00`);
  return `${String(parsed.getDate()).padStart(2, "0")}/${String(parsed.getMonth() + 1).padStart(2, "0")}`;
}

function monthKey(date) {
  const parsed = new Date(`${date}T00:00:00`);
  return `${parsed.getFullYear()}-${String(parsed.getMonth() + 1).padStart(2, "0")}`;
}

function currentMonthKey() {
  const today = new Date();
  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`;
}

function sortedTrades(trades = state.trades) {
  return [...trades].sort((a, b) => {
    const dateDiff = new Date(a.date) - new Date(b.date);
    return dateDiff || a.createdAt - b.createdAt;
  });
}

function newestFirstTrades(trades) {
  return [...trades].sort((a, b) => {
    const dateDiff = new Date(b.date) - new Date(a.date);
    return dateDiff || b.createdAt - a.createdAt;
  });
}

function orderedDisplayTrades(trades) {
  return state.sortOrder === "oldest" ? sortedTrades(trades) : newestFirstTrades(trades);
}

function filteredTrades() {
  const selectedMonth = elements.monthFilter.value;
  const selectedPair = elements.pairFilter.value;
  const selectedNote = elements.noteFilter.value;

  return sortedTrades().filter((trade) => {
    const monthMatch = selectedMonth === "all" || monthKey(trade.date) === selectedMonth;
    const pairMatch = selectedPair === "all" || trade.pair === selectedPair;
    const hasNote = Boolean((trade.note || "").trim());
    const noteMatch =
      selectedNote === "all" ||
      (selectedNote === "with" && hasNote) ||
      (selectedNote === "without" && !hasNote);
    return monthMatch && pairMatch && noteMatch;
  });
}

function calculateStats(trades) {
  const wins = trades.filter((trade) => trade.result === "WIN");
  const losses = trades.filter((trade) => trade.result === "LOSS");
  const totalProfit = trades.reduce((sum, trade) => sum + Number(trade.profit), 0);
  const totalR = trades.reduce((sum, trade) => sum + Number(trade.rr), 0);
  const avgWin = wins.length ? wins.reduce((sum, trade) => sum + Number(trade.profit), 0) / wins.length : 0;
  const avgLoss = losses.length ? losses.reduce((sum, trade) => sum + Number(trade.profit), 0) / losses.length : 0;
  const winrate = trades.length ? (wins.length / trades.length) * 100 : 0;

  return { totalProfit, totalR, avgWin, avgLoss, winrate, count: trades.length };
}

function updateMetrics(trades) {
  const stats = calculateStats(trades);
  elements.totalProfit.textContent = money(stats.totalProfit);
  elements.totalProfit.className = stats.totalProfit >= 0 ? "positive" : "negative";
  elements.totalR.textContent = formatR(stats.totalR);
  elements.winrate.textContent = `${stats.winrate.toFixed(1).replace(".", ",")}%`;
  elements.tradeCount.textContent = `${stats.count} lệnh`;
  elements.avgWin.textContent = money(stats.avgWin);
  elements.avgLoss.textContent = money(stats.avgLoss);
}

function updateSortIcon() {
  elements.monthSortIcon.textContent = state.sortOrder === "oldest" ? "↑" : "↓";
  elements.monthSortToggle.title =
    state.sortOrder === "oldest" ? "Đang sắp xếp từ đầu tháng" : "Đang sắp xếp từ cuối tháng";
}

function updateFilters() {
  const currentMonth = elements.monthFilter.value;
  const currentPair = elements.pairFilter.value;
  const months = [...new Set([currentMonthKey(), ...sortedTrades().map((trade) => monthKey(trade.date))])];
  const pairs = [...new Set(sortedTrades().map((trade) => trade.pair))];

  elements.monthFilter.innerHTML = `<option value="all">Tất cả</option>`;
  months.forEach((month) => {
    const option = document.createElement("option");
    option.value = month;
    option.textContent = month;
    elements.monthFilter.appendChild(option);
  });

  elements.pairFilter.innerHTML = `<option value="all">Tất cả</option>`;
  pairs.forEach((pair) => {
    const option = document.createElement("option");
    option.value = pair;
    option.textContent = pair;
    elements.pairFilter.appendChild(option);
  });

  if (!state.monthFilterInitialized) {
    elements.monthFilter.value = currentMonthKey();
    state.monthFilterInitialized = true;
  } else {
    elements.monthFilter.value = months.includes(currentMonth) ? currentMonth : "all";
  }
  elements.pairFilter.value = pairs.includes(currentPair) ? currentPair : "all";
}

function renderRows(trades) {
  elements.tradeRows.innerHTML = "";

  if (!trades.length) {
    elements.tradeRows.innerHTML = `<tr><td class="empty-state" colspan="9">Chưa có lệnh phù hợp với bộ lọc.</td></tr>`;
    return;
  }

  trades.forEach((trade, index) => {
    const row = document.createElement("tr");
    const profitClass = Number(trade.profit) >= 0 ? "positive" : "negative";
    const rrClass = Number(trade.rr) >= 0 ? "positive" : "negative";
    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${monthLabel(trade.date)}</td>
      <td>${escapeHtml(trade.pair)}</td>
      <td><span class="tag ${trade.direction.toLowerCase()}">${trade.direction}</span></td>
      <td><span class="tag ${trade.result.toLowerCase()}">${trade.result}</span></td>
      <td class="${profitClass}">${money(Number(trade.profit))}</td>
      <td class="${rrClass}">${formatR(Number(trade.rr))}</td>
      <td>${escapeHtml(trade.note || "")}</td>
      <td>
        <div class="row-actions">
          <button class="icon-button" type="button" title="Sửa lệnh" data-action="edit" data-id="${trade.id}">Sửa</button>
          <button class="icon-button" type="button" title="Xóa lệnh" data-action="delete" data-id="${trade.id}">Xóa</button>
        </div>
      </td>
    `;
    elements.tradeRows.appendChild(row);
  });
}

function exportTradesToExcel() {
  const trades = orderedDisplayTrades(filteredTrades());
  if (!trades.length) {
    alert("Không có lệnh nào để xuất.");
    return;
  }

  const rows = [
    ["STT", "Ngày", "Cặp", "Long/Short", "Win/Loss", "Profit", "R:R", "Ghi chú"],
    ...trades.map((trade, index) => [
      index + 1,
      monthLabel(trade.date),
      trade.pair,
      trade.direction,
      trade.result,
      Number(trade.profit),
      formatR(Number(trade.rr)),
      trade.note || "",
    ]),
  ];
  const totalProfit = trades.reduce((sum, trade) => sum + Number(trade.profit), 0);
  const totalR = trades.reduce((sum, trade) => sum + Number(trade.rr), 0);
  rows.push(["TỔNG", "", "", "", "", totalProfit, formatR(totalR), ""]);

  const csv = rows.map((row) => row.map(csvCell).join(",")).join("\r\n");
  const blob = new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  const monthPart = elements.monthFilter.value === "all" ? "tat-ca" : elements.monthFilter.value;
  const pairPart = elements.pairFilter.value === "all" ? "tat-ca-cap" : elements.pairFilter.value.toLowerCase();
  const notePart =
    elements.noteFilter.value === "with"
      ? "co-ghi-chu"
      : elements.noteFilter.value === "without"
        ? "khong-ghi-chu"
        : "tat-ca-ghi-chu";

  link.href = url;
  link.download = `trade-journal-${monthPart}-${pairPart}-${notePart}.csv`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function csvCell(value) {
  const text = String(value ?? "");
  return `"${text.replaceAll('"', '""')}"`;
}

function backupTradeData() {
  const payload = {
    exportedAt: new Date().toISOString(),
    version: 1,
    trades: sortedTrades(state.trades),
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = `trade-journal-backup-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function importTradeData(file) {
  const reader = new FileReader();
  reader.addEventListener("load", async () => {
    try {
      const payload = JSON.parse(reader.result);
      const importedTrades = Array.isArray(payload) ? payload : payload.trades;
      if (!Array.isArray(importedTrades)) throw new Error("Invalid backup");

      state.trades = mergeTradesById(state.trades, importedTrades);
      saveTrades();
      await sendRemoteAction("replaceAll", { trades: sortedTrades(state.trades).map(remoteTradePayload) });
      render();
      alert("Đã nhập dữ liệu thành công.");
    } catch {
      alert("File dữ liệu không hợp lệ.");
    } finally {
      elements.importDataFile.value = "";
    }
  });
  reader.readAsText(file);
}

function drawChart(trades) {
  const canvas = elements.growthChart;
  const context = canvas.getContext("2d");
  const ratio = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  canvas.width = rect.width * ratio;
  canvas.height = rect.height * ratio;
  context.setTransform(ratio, 0, 0, ratio, 0, 0);

  const width = rect.width;
  const height = rect.height;
  const padding = { top: 28, right: 28, bottom: 42, left: 58 };
  const plotWidth = width - padding.left - padding.right;
  const plotHeight = height - padding.top - padding.bottom;

  context.clearRect(0, 0, width, height);
  context.fillStyle = "#0d141b";
  context.fillRect(0, 0, width, height);

  const values = trades.reduce(
    (points, trade) => {
      const next = points[points.length - 1] + Number(trade[state.chartMode]);
      points.push(next);
      return points;
    },
    [0],
  );

  if (values.length <= 1) {
    state.chartPoints = [];
    context.fillStyle = "#91a19b";
    context.font = "700 15px Inter, system-ui, sans-serif";
    context.textAlign = "center";
    context.fillText("Nhập lệnh để xem biểu đồ tăng trưởng", width / 2, height / 2);
    return;
  }

  const minValue = Math.min(...values, 0);
  const maxValue = Math.max(...values, 0);
  const spread = maxValue - minValue || 1;
  const zeroY = padding.top + ((maxValue - 0) / spread) * plotHeight;

  context.strokeStyle = "#24313b";
  context.lineWidth = 1;
  context.font = "700 12px Inter, system-ui, sans-serif";
  context.fillStyle = "#91a19b";
  context.textAlign = "right";

  for (let i = 0; i <= 4; i += 1) {
    const value = maxValue - (spread / 4) * i;
    const y = padding.top + (plotHeight / 4) * i;
    context.beginPath();
    context.moveTo(padding.left, y);
    context.lineTo(width - padding.right, y);
    context.stroke();
    context.fillText(state.chartMode === "profit" ? money(value) : formatR(value), padding.left - 10, y + 4);
  }

  context.strokeStyle = "#3a4650";
  context.beginPath();
  context.moveTo(padding.left, zeroY);
  context.lineTo(width - padding.right, zeroY);
  context.stroke();

  const toX = (index) => padding.left + (plotWidth / (values.length - 1)) * index;
  const toY = (value) => padding.top + ((maxValue - value) / spread) * plotHeight;
  state.chartPoints = values.map((value, index) => ({
    x: toX(index),
    y: toY(value),
    value,
    index,
    trade: trades[index - 1] || null,
  }));

  const gradient = context.createLinearGradient(0, padding.top, 0, height - padding.bottom);
  gradient.addColorStop(0, "rgba(53, 201, 135, 0.24)");
  gradient.addColorStop(1, "rgba(53, 201, 135, 0)");

  context.beginPath();
  values.forEach((value, index) => {
    const x = toX(index);
    const y = toY(value);
    if (index === 0) context.moveTo(x, y);
    else context.lineTo(x, y);
  });
  context.lineTo(toX(values.length - 1), height - padding.bottom);
  context.lineTo(padding.left, height - padding.bottom);
  context.closePath();
  context.fillStyle = gradient;
  context.fill();

  context.beginPath();
  values.forEach((value, index) => {
    const x = toX(index);
    const y = toY(value);
    if (index === 0) context.moveTo(x, y);
    else context.lineTo(x, y);
  });
  context.strokeStyle = "#35c987";
  context.lineWidth = 3;
  context.lineJoin = "round";
  context.lineCap = "round";
  context.stroke();

  values.forEach((value, index) => {
    const x = toX(index);
    const y = toY(value);
    context.beginPath();
    context.arc(x, y, 4, 0, Math.PI * 2);
    context.fillStyle = value >= 0 ? "#35c987" : "#ff6b6b";
    context.fill();
    context.strokeStyle = "#0d141b";
    context.lineWidth = 2;
    context.stroke();
  });

  context.fillStyle = "#eef5ef";
  context.textAlign = "center";
  context.fillText("Bắt đầu", padding.left, height - 14);
  context.fillText("Lệnh gần nhất", width - padding.right, height - 14);
  drawChartTooltip(context, width, height);
}

function drawChartTooltip(context, width, height) {
  const point = state.chartPoints[state.activeChartIndex];
  if (!point) return;

  context.save();
  context.beginPath();
  context.arc(point.x, point.y, 7, 0, Math.PI * 2);
  context.fillStyle = point.value >= 0 ? "#35c987" : "#ff6b6b";
  context.fill();
  context.strokeStyle = "#eef5ef";
  context.lineWidth = 2;
  context.stroke();

  const pnl = point.trade ? Number(point.trade.profit) : 0;
  const lines = point.trade
    ? [`Lệnh ${point.index}`, `Ngày: ${monthLabel(point.trade.date)}`, `PnL: ${money(pnl)}`]
    : ["Bắt đầu", "Ngày: --", "PnL: $0"];
  const tooltipWidth = Math.max(...lines.map((line) => context.measureText(line).width)) + 24;
  const tooltipHeight = 70;
  const x = Math.min(Math.max(point.x - tooltipWidth / 2, 10), width - tooltipWidth - 10);
  const y = point.y > 95 ? point.y - tooltipHeight - 14 : point.y + 16;

  context.fillStyle = "rgba(8, 13, 18, 0.94)";
  context.strokeStyle = "#35c987";
  context.lineWidth = 1;
  context.beginPath();
  context.roundRect(x, y, tooltipWidth, tooltipHeight, 8);
  context.fill();
  context.stroke();

  context.textAlign = "left";
  context.fillStyle = "#eef5ef";
  context.font = "800 12px Inter, system-ui, sans-serif";
  context.fillText(lines[0], x + 12, y + 22);
  context.fillStyle = "#91a19b";
  context.font = "700 12px Inter, system-ui, sans-serif";
  context.fillText(lines[1], x + 12, y + 43);
  context.fillStyle = pnl >= 0 ? "#35c987" : "#ff6b6b";
  context.font = "900 14px Inter, system-ui, sans-serif";
  context.fillText(lines[2], x + 12, y + 62);
  context.restore();
}

function resetForm() {
  elements.form.reset();
  elements.tradeId.value = "";
  elements.tradeDate.value = new Date().toISOString().slice(0, 10);
  elements.pair.value = "XAU";
  elements.result.value = "LOSS";
  elements.rr.value = "";
  elements.formTitle.textContent = "Nhập lệnh trade";
  elements.submitTrade.textContent = "Lưu lệnh";
}

function syncDerivedFields() {
  if (elements.profit.value === "") {
    elements.rr.value = "";
    elements.result.value = "LOSS";
    return;
  }

  const profit = Number(elements.profit.value);
  if (elements.rr.value === "") {
    elements.rr.value = profitToRByDate(profit, elements.tradeDate.value);
  }
  elements.result.value = profitToResult(profit);
}

function render() {
  updateFilters();
  const trades = filteredTrades();
  if (state.activeChartIndex !== null && state.activeChartIndex > trades.length) {
    state.activeChartIndex = null;
  }
  updateSortIcon();
  updateMetrics(trades);
  renderRows(orderedDisplayTrades(trades));
  drawChart(trades);

  const monthText = elements.monthFilter.value === "all" ? "tất cả tháng" : `tháng ${elements.monthFilter.value}`;
  const pairText = elements.pairFilter.value === "all" ? "tất cả cặp" : elements.pairFilter.value;
  const noteText =
    elements.noteFilter.value === "with"
      ? "có ghi chú"
      : elements.noteFilter.value === "without"
        ? "không ghi chú"
        : "tất cả ghi chú";
  elements.filterSummary.textContent = `Đang hiển thị ${trades.length} lệnh: ${monthText}, ${pairText}, ${noteText}.`;
}

elements.form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const payload = {
    id: elements.tradeId.value || crypto.randomUUID(),
    date: elements.tradeDate.value,
    pair: elements.pair.value.trim().toUpperCase(),
    direction: elements.direction.value,
    result: profitToResult(elements.profit.value),
    profit: Number(elements.profit.value),
    rr: Number(elements.rr.value),
    note: elements.note.value.trim(),
    createdAt: Date.now(),
  };

  if (elements.tradeId.value) {
    state.trades = state.trades.map((trade) =>
      trade.id === elements.tradeId.value ? { ...trade, ...payload, createdAt: trade.createdAt } : trade,
    );
  } else {
    state.trades.push(payload);
  }

  saveTrades();
  await sendRemoteAction("upsert", { trade: remoteTradePayload(payload) });
  resetForm();
  render();
});

elements.resetForm.addEventListener("click", resetForm);
elements.profit.addEventListener("input", syncDerivedFields);
elements.monthFilter.addEventListener("change", render);
elements.pairFilter.addEventListener("change", render);
elements.noteFilter.addEventListener("change", render);
elements.monthSortToggle.addEventListener("click", () => {
  state.sortOrder = state.sortOrder === "oldest" ? "newest" : "oldest";
  render();
});
elements.exportExcel.addEventListener("click", exportTradesToExcel);
elements.backupData.addEventListener("click", backupTradeData);
elements.importData.addEventListener("click", () => elements.importDataFile.click());
elements.importDataFile.addEventListener("change", () => {
  const [file] = elements.importDataFile.files;
  if (file) importTradeData(file);
});

elements.growthChart.addEventListener("mousemove", (event) => {
  const rect = elements.growthChart.getBoundingClientRect();
  const mouseX = event.clientX - rect.left;
  const mouseY = event.clientY - rect.top;
  let nearestIndex = null;
  let nearestDistance = Infinity;

  state.chartPoints.forEach((point, index) => {
    const distance = Math.hypot(point.x - mouseX, point.y - mouseY);
    if (distance < nearestDistance) {
      nearestDistance = distance;
      nearestIndex = index;
    }
  });

  const nextIndex = nearestDistance <= 16 ? nearestIndex : null;
  if (state.activeChartIndex === nextIndex) return;
  state.activeChartIndex = nextIndex;
  drawChart(filteredTrades());
});

elements.growthChart.addEventListener("mouseleave", () => {
  if (state.activeChartIndex === null) return;
  state.activeChartIndex = null;
  drawChart(filteredTrades());
});

document.querySelectorAll(".toggle").forEach((button) => {
  button.addEventListener("click", () => {
    state.chartMode = button.dataset.chart;
    document.querySelectorAll(".toggle").forEach((item) => item.classList.toggle("active", item === button));
    drawChart(filteredTrades());
  });
});

elements.tradeRows.addEventListener("click", async (event) => {
  const button = event.target.closest("button");
  if (!button) return;

  const trade = state.trades.find((item) => item.id === button.dataset.id);
  if (!trade) return;

  if (button.dataset.action === "delete") {
    const ok = confirm("Xóa lệnh trade này?");
    if (!ok) return;
    state.trades = state.trades.filter((item) => item.id !== trade.id);
    saveTrades();
    await sendRemoteAction("delete", { id: trade.id });
    render();
    return;
  }

  elements.tradeId.value = trade.id;
  elements.tradeDate.value = trade.date;
  elements.pair.value = trade.pair;
  elements.direction.value = trade.direction;
  elements.result.value = trade.result;
  elements.profit.value = trade.profit;
  elements.rr.value = trade.rr;
  elements.note.value = trade.note;
  elements.formTitle.textContent = "Sửa lệnh trade";
  elements.submitTrade.textContent = "Cập nhật lệnh";
  elements.form.scrollIntoView({ behavior: "smooth", block: "start" });
});

elements.clearAll.addEventListener("click", async () => {
  const ok = confirm("Xóa tất cả lệnh đang lưu trên trình duyệt này?");
  if (!ok) return;
  state.trades = [];
  saveTrades();
  await sendRemoteAction("replaceAll", { trades: [] });
  resetForm();
  render();
});

window.addEventListener("resize", () => drawChart(filteredTrades()));

resetForm();
render();
initializeRemoteStore();
