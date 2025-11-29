"use client";

import { useState, useEffect, useMemo } from "react";

// -------------------- Shared mock data --------------------

const BOTS = [
  {
    id: "aggressive",
    name: "Aggressive Bot",
    description:
      "High-risk, momentum strategy targeting short-term gains on PSX stocks.",
    riskProfile: "aggressive",
  },
  {
    id: "balanced",
    name: "Growth / Balanced Bot",
    description:
      "Growth-focused trend follower with position and risk constraints.",
    riskProfile: "balanced",
  },
  {
    id: "defensive",
    name: "Defensive Bot",
    description:
      "Capital preservation bot with lower volatility and higher cash buffers.",
    riskProfile: "defensive",
  },
  {
    id: "market-normal",
    name: "Market Normal Bot",
    description:
      "Tracks the broader PSX market or maintains market-neutral exposure.",
    riskProfile: "market-normal",
  },
];

const MOCK_PORTFOLIO = {
  id: "psx-demo-1",
  name: "Main PSX Demo",
  baseCurrency: "PKR",
  cash: 250000,
  holdings: [
    { symbol: "MCB", name: "MCB Bank", quantity: 120, lastPrice: 155, prevClose: 150 },
    { symbol: "OGDC", name: "Oil & Gas Dev", quantity: 300, lastPrice: 105, prevClose: 104 },
    { symbol: "HBL", name: "Habib Bank", quantity: 80, lastPrice: 95, prevClose: 97 },
  ],
};

const MOCK_BOT_INSTANCES = [
  {
    id: "bot-1",
    name: "Aggressive PSX Momentum",
    type: "aggressive",
    portfolioId: "psx-demo-1",
    status: "running",
    since: "2025-01-10",
    returnPct: 13.4,
  },
  {
    id: "bot-2",
    name: "Defensive Core",
    type: "defensive",
    portfolioId: "psx-demo-1",
    status: "paused",
    since: "2025-02-02",
    returnPct: 4.1,
  },
];

const MOCK_BOT_PROGRESS = [
  {
    id: "bot-1",
    name: "Aggressive PSX Momentum",
    type: "aggressive",
    portfolioId: "psx-demo-1",
    status: "running",
    since: "2025-01-10",
    returnPct: 13.4,
    maxDrawdownPct: -8.2,
    tradesCount: 62,
  },
  {
    id: "bot-2",
    name: "Balanced Trend Follower",
    type: "balanced",
    portfolioId: "psx-demo-1",
    status: "running",
    since: "2025-02-01",
    returnPct: 7.1,
    maxDrawdownPct: -4.4,
    tradesCount: 34,
  },
  {
    id: "bot-3",
    name: "Defensive Core",
    type: "defensive",
    portfolioId: "psx-demo-1",
    status: "paused",
    since: "2025-02-15",
    returnPct: 4.1,
    maxDrawdownPct: -2.3,
    tradesCount: 18,
  },
  {
    id: "bot-4",
    name: "Market Normal PSX",
    type: "market-normal",
    portfolioId: "psx-demo-1",
    status: "stopped",
    since: "2025-01-05",
    returnPct: 2.0,
    maxDrawdownPct: -3.1,
    tradesCount: 20,
  },
];

// -------------------- Dashboard view --------------------

function DashboardView() {
  const portfolio = MOCK_PORTFOLIO;

  const { holdingsValue, total } = useMemo(() => {
    const holdingsVal = portfolio.holdings.reduce(
      (sum, h) => sum + h.quantity * h.lastPrice,
      0
    );
    return { holdingsValue: holdingsVal, total: holdingsVal + portfolio.cash };
  }, [portfolio]);

  const dailyPnL = useMemo(() => {
    return portfolio.holdings.reduce((sum, h) => {
      if (typeof h.prevClose !== "number") return sum;
      const diff = h.lastPrice - h.prevClose;
      return sum + diff * h.quantity;
    }, 0);
  }, [portfolio]);

  const runningBots = MOCK_BOT_INSTANCES.filter((b) => b.status === "running").length;
  const avgBotReturn =
    MOCK_BOT_INSTANCES.reduce((sum, b) => sum + b.returnPct, 0) /
    MOCK_BOT_INSTANCES.length;

  const dailyPnLSign = dailyPnL >= 0 ? "+" : "-";
  const dailyPnLColor = dailyPnL >= 0 ? "text-emerald-400" : "text-rose-400";

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex flex-col">
      <header className="border-b border-slate-800 bg-slate-950/90 backdrop-blur sticky top-0 z-0">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold">Account Dashboard</h1>
            <p className="text-xs text-slate-400">
              Overview of your PSX demo account, portfolios and trading bots.
            </p>
          </div>
          <div className="text-right text-xs text-slate-400">
            <div>Signed in as demo@psx-bots.com</div>
            <div className="text-[10px] text-slate-500">Demo environment</div>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
          {/* Summary cards */}
          <section className="grid gap-4 md:grid-cols-4">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
              <p className="text-xs text-slate-400 mb-1">Total Account Value</p>
              <p className="text-2xl font-semibold">
                {portfolio.baseCurrency} {total.toLocaleString()}
              </p>
              <p className="text-[11px] text-slate-500 mt-1">
                Holdings: {portfolio.baseCurrency} {holdingsValue.toLocaleString()}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
              <p className="text-xs text-slate-400 mb-1">Today&apos;s P&amp;L</p>
              <p className={`text-2xl font-semibold ${dailyPnLColor}`}>
                {dailyPnLSign}
                {Math.abs(dailyPnL).toLocaleString(undefined, {
                  maximumFractionDigits: 0,
                })}{" "}
                {portfolio.baseCurrency}
              </p>
              <p className="text-[11px] text-slate-500 mt-1">
                Based on intraday changes in holdings.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
              <p className="text-xs text-slate-400 mb-1">Available Cash</p>
              <p className="text-2xl font-semibold">
                {portfolio.baseCurrency} {portfolio.cash.toLocaleString()}
              </p>
              <p className="text-[11px] text-slate-500 mt-1">
                Ready for bot deployment or manual trades.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
              <p className="text-xs text-slate-400 mb-1">Active Bots</p>
              <p className="text-2xl font-semibold">{runningBots}</p>
              <p className="text-[11px] text-slate-500 mt-1">
                Avg bot return: {avgBotReturn.toFixed(1)}%
              </p>
            </div>
          </section>

          {/* Portfolio + bots */}
          <section className="grid gap-4 md:grid-cols-3">
            {/* Portfolio holdings */}
            <div className="md:col-span-2 rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-semibold">Portfolio holdings</h2>
                <span className="text-[11px] text-slate-500">
                  {portfolio.id} · {portfolio.baseCurrency}
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="text-slate-400 border-b border-slate-800">
                      <th className="text-left py-2">Symbol</th>
                      <th className="text-left py-2">Name</th>
                      <th className="text-right py-2">Qty</th>
                      <th className="text-right py-2">Last</th>
                      <th className="text-right py-2">Value</th>
                      <th className="text-right py-2">Day %</th>
                    </tr>
                  </thead>
                  <tbody>
                    {portfolio.holdings.map((h) => {
                      const value = h.quantity * h.lastPrice;
                      const prevClose = h.prevClose ?? h.lastPrice;
                      const dayPct = ((h.lastPrice - prevClose) / prevClose) * 100;
                      const pctColor =
                        dayPct >= 0 ? "text-emerald-400" : "text-rose-400";
                      return (
                        <tr key={h.symbol} className="border-b border-slate-900/60">
                          <td className="py-2 font-medium">{h.symbol}</td>
                          <td className="py-2 text-slate-300">{h.name}</td>
                          <td className="py-2 text-right">{h.quantity}</td>
                          <td className="py-2 text-right">
                            {h.lastPrice.toFixed(2)}
                          </td>
                          <td className="py-2 text-right">
                            {value.toLocaleString()}
                          </td>
                          <td className={`py-2 text-right ${pctColor}`}>
                            {dayPct >= 0 ? "+" : ""}
                            {dayPct.toFixed(2)}%
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Bots summary */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-semibold">Bot performance</h2>
                <span className="text-[11px] text-slate-500">Demo only</span>
              </div>
              <div className="space-y-3">
                {MOCK_BOT_INSTANCES.map((bot) => {
                  const statusColor =
                    bot.status === "running"
                      ? "text-emerald-400"
                      : bot.status === "paused"
                      ? "text-amber-300"
                      : "text-slate-400";
                  const returnColor =
                    bot.returnPct >= 0 ? "text-emerald-400" : "text-rose-400";
                  return (
                    <div
                      key={bot.id}
                      className="rounded-xl border border-slate-800 bg-slate-950/40 p-3"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-xs font-medium">{bot.name}</p>
                        <span className={`text-[10px] ${statusColor}`}>
                          {bot.status.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mb-2">
                        Since {bot.since} · {bot.type.toUpperCase()}
                      </p>
                      <div className="flex items-center justify-between text-[11px]">
                        <span className={returnColor}>
                          {bot.returnPct >= 0 ? "+" : ""}
                          {bot.returnPct.toFixed(1)}% total return
                        </span>
                        <span className="text-slate-500">PSX demo</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

// -------------------- Bots view --------------------

function BotsView() {
  const [selectedBot, setSelectedBot] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mode, setMode] = useState("portfolio");
  const [portfolioId, setPortfolioId] = useState("");
  const [symbol, setSymbol] = useState("");
  const [maxExposure, setMaxExposure] = useState(25);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    setMessage("");
  }, [selectedBot, mode]);

  const openDeploy = (bot) => {
    setSelectedBot(bot);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedBot(null);
    setSymbol("");
    setPortfolioId("");
  };

  const handleDeploy = async () => {
    if (!selectedBot) return;

    if (mode === "portfolio" && !portfolioId) {
      setMessage("Please enter a portfolio ID.");
      return;
    }
    if (mode === "single-stock" && !symbol) {
      setMessage("Please enter a PSX stock symbol.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      // For now, just simulate deployment
      await new Promise((resolve) => setTimeout(resolve, 600));
      setMessage("Bot deployed successfully in demo mode (preview).");
    } catch (err) {
      setMessage("Error deploying bot: " + (err?.message || "Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex flex-col">
      <header className="border-b border-slate-800 bg-slate-950/90 backdrop-blur sticky top-0 z-0">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold">PSX Smart Bots</h1>
            <p className="text-xs text-slate-400">
              Pakistan Stock Exchange – automated trading styles for every risk
              profile.
            </p>
          </div>
          <span className="text-[10px] px-2 py-1 rounded-full border border-emerald-500/60 text-emerald-300">
            DEMO PREVIEW
          </span>
        </div>
      </header>

      <main className="flex-1">
        <div className="max-w-5xl mx-auto px-4 py-8">
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-2">
              Choose your PSX trading bot
            </h2>
            <p className="text-sm text-slate-300 max-w-2xl">
              Deploy a bot on your simulated portfolio or a specific PSX stock.
              Each bot has a different risk profile and decision logic.
            </p>
          </section>

          <section className="grid gap-4 md:grid-cols-2">
            {BOTS.map((bot) => (
              <article
                key={bot.id}
                className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 flex flex-col justify-between shadow-lg shadow-slate-950/40"
              >
                <div>
                  <h3 className="text-lg font-semibold mb-1">{bot.name}</h3>
                  <span className="inline-block text-[10px] tracking-wide rounded-full border border-slate-700 px-2 py-0.5 mb-3 text-slate-300">
                    {bot.riskProfile.toUpperCase()}
                  </span>
                  <p className="text-sm text-slate-300 mb-3">
                    {bot.description}
                  </p>
                  <ul className="text-[11px] text-slate-400 list-disc list-inside space-y-1">
                    {bot.id === "aggressive" && (
                      <>
                        <li>Short-term momentum &amp; breakout entries.</li>
                        <li>Higher max position size and turnover.</li>
                        <li>Tight stop-loss with aggressive profit targets.</li>
                      </>
                    )}
                    {bot.id === "balanced" && (
                      <>
                        <li>Trend-following with capped position sizes.</li>
                        <li>Maintains a reasonable cash buffer.</li>
                        <li>Aims for smoother equity curve.</li>
                      </>
                    )}
                    {bot.id === "defensive" && (
                      <>
                        <li>Focuses on capital preservation.</li>
                        <li>Higher cash levels in volatile markets.</li>
                        <li>Lower maximum exposure per stock.</li>
                      </>
                    )}
                    {bot.id === "market-normal" && (
                      <>
                        <li>Seeks to follow overall PSX market behavior.</li>
                        <li>Can be configured as market-neutral (advanced).</li>
                        <li>Useful as a core benchmark-style allocation.</li>
                      </>
                    )}
                  </ul>
                </div>

                <button
                  onClick={() => openDeploy(bot)}
                  className="mt-4 inline-flex items-center justify-center rounded-xl border border-emerald-500 px-3 py-1.5 text-xs font-medium hover:bg-emerald-500 hover:text-slate-950 transition"
                >
                  Deploy Bot (Preview)
                </button>
              </article>
            ))}
          </section>
        </div>
      </main>

      <footer className="border-t border-slate-800 text-[11px] text-slate-500 py-3 text-center">
        Demo only – no real PSX orders are sent from this preview.
      </footer>

      {isModalOpen && selectedBot && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-700 p-6 shadow-xl shadow-black/50">
            <h4 className="text-base font-semibold mb-1">
              Deploy {selectedBot.name}
            </h4>
            <p className="text-xs text-slate-400 mb-4">
              Configure how this bot will manage your simulated PSX exposure.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium mb-1">
                  Deployment mode
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    className={`flex-1 rounded-lg border px-3 py-1.5 text-xs ${
                      mode === "portfolio"
                        ? "border-emerald-500 bg-emerald-500/10"
                        : "border-slate-700"
                    }`}
                    onClick={() => setMode("portfolio")}
                  >
                    Portfolio
                  </button>
                  <button
                    type="button"
                    className={`flex-1 rounded-lg border px-3 py-1.5 text-xs ${
                      mode === "single-stock"
                        ? "border-emerald-500 bg-emerald-500/10"
                        : "border-slate-700"
                    }`}
                    onClick={() => setMode("single-stock")}
                  >
                    Single stock
                  </button>
                </div>
              </div>

              {mode === "portfolio" && (
                <div>
                  <label className="block text-xs font-medium mb-1">
                    Portfolio ID (demo)
                  </label>
                  <input
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs"
                    placeholder="e.g. psx-demo-1"
                    value={portfolioId}
                    onChange={(e) => setPortfolioId(e.target.value)}
                  />
                </div>
              )}

              {mode === "single-stock" && (
                <div>
                  <label className="block text-xs font-medium mb-1">
                    PSX stock symbol
                  </label>
                  <input
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs"
                    placeholder="e.g. MCB, HBL, OGDC"
                    value={symbol}
                    onChange={(e) => setSymbol(e.target.value.toUpperCase())}
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-medium mb-1">
                  Max exposure per stock (% of portfolio)
                </label>
                <input
                  type="number"
                  min={1}
                  max={100}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs"
                  value={maxExposure}
                  onChange={(e) => setMaxExposure(Number(e.target.value))}
                />
                <p className="mt-1 text-[10px] text-slate-400">
                  The bot will not allocate more than this percentage of your
                  portfolio to any single PSX stock in this demo.
                </p>
              </div>

              {message && (
                <p className="text-[10px] text-emerald-300 border border-emerald-500/40 rounded-lg px-3 py-2 bg-emerald-500/5">
                  {message}
                </p>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-lg border border-slate-700 px-3 py-1.5 text-xs"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDeploy}
                  className="rounded-lg border border-emerald-500 bg-emerald-500/10 px-3 py-1.5 text-xs font-medium hover:bg-emerald-500 hover:text-slate-950 transition disabled:opacity-50"
                  disabled={loading}
                >
                  {loading ? "Deploying…" : "Deploy (demo)"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// -------------------- Bots progress view --------------------

function statusColor(status) {
  if (status === "running") return "text-emerald-400 border-emerald-500/60";
  if (status === "paused") return "text-amber-300 border-amber-400/60";
  return "text-slate-400 border-slate-500/60";
}

function typeLabel(type) {
  if (type === "aggressive") return "Aggressive";
  if (type === "balanced") return "Growth / Balanced";
  if (type === "defensive") return "Defensive";
  return "Market Normal";
}

function BotsProgressView() {
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = MOCK_BOT_PROGRESS.filter(
    (b) => statusFilter === "all" || b.status === statusFilter
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex flex-col">
      <header className="border-b border-slate-800 bg-slate-950/90 backdrop-blur sticky top-0 z-0">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold">Bots progress</h1>
            <p className="text-xs text-slate-400">
              Track performance, drawdowns and activity of your PSX trading bots.
            </p>
          </div>
          <span className="text-[11px] text-slate-500">Demo performance only</span>
        </div>
      </header>

      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-4 py-6 space-y-4">
          {/* Filters */}
          <section className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex gap-2 text-[11px]">
              <button
                onClick={() => setStatusFilter("all")}
                className={`px-3 py-1.5 rounded-full border ${
                  statusFilter === "all"
                    ? "border-emerald-500 bg-emerald-500/10"
                    : "border-slate-700"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setStatusFilter("running")}
                className={`px-3 py-1.5 rounded-full border ${
                  statusFilter === "running"
                    ? "border-emerald-500 bg-emerald-500/10"
                    : "border-slate-700"
                }`}
              >
                Running
              </button>
              <button
                onClick={() => setStatusFilter("paused")}
                className={`px-3 py-1.5 rounded-full border ${
                  statusFilter === "paused"
                    ? "border-emerald-500 bg-emerald-500/10"
                    : "border-slate-700"
                }`}
              >
                Paused
              </button>
              <button
                onClick={() => setStatusFilter("stopped")}
                className={`px-3 py-1.5 rounded-full border ${
                  statusFilter === "stopped"
                    ? "border-emerald-500 bg-emerald-500/10"
                    : "border-slate-700"
                }`}
              >
                Stopped
              </button>
            </div>
            <p className="text-[11px] text-slate-500">
              {filtered.length} bots · Demo only
            </p>
          </section>

          {/* Table */}
          <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="text-slate-400 border-b border-slate-800">
                  <th className="text-left py-2">Bot</th>
                  <th className="text-left py-2">Type</th>
                  <th className="text-left py-2">Portfolio</th>
                  <th className="text-left py-2">Since</th>
                  <th className="text-right py-2">Total return</th>
                  <th className="text-right py-2">Max drawdown</th>
                  <th className="text-right py-2">Trades</th>
                  <th className="text-right py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((bot) => {
                  const returnColor =
                    bot.returnPct >= 0 ? "text-emerald-400" : "text-rose-400";
                  const ddColor =
                    bot.maxDrawdownPct <= -8
                      ? "text-rose-400"
                      : "text-amber-300";

                  const pctNormalized = Math.min(
                    1,
                    Math.max(0, bot.returnPct / 30)
                  );

                  return (
                    <tr key={bot.id} className="border-b border-slate-900/60">
                      <td className="py-3">
                        <div className="flex flex-col">
                          <span className="font-medium">{bot.name}</span>
                          <span className="text-[10px] text-slate-500">
                            ID: {bot.id}
                          </span>
                        </div>
                      </td>
                      <td className="py-3">
                        <span className="text-[11px] text-slate-300">
                          {typeLabel(bot.type)}
                        </span>
                      </td>
                      <td className="py-3">
                        <span className="text-[11px] text-slate-300">
                          {bot.portfolioId}
                        </span>
                      </td>
                      <td className="py-3">
                        <span className="text-[11px] text-slate-300">
                          {bot.since}
                        </span>
                      </td>
                      <td className={`py-3 text-right ${returnColor}`}>
                        {bot.returnPct >= 0 ? "+" : ""}
                        {bot.returnPct.toFixed(1)}%
                        <div className="mt-1 h-1.5 rounded-full bg-slate-800 overflow-hidden">
                          <div
                            className="h-full bg-emerald-500"
                            style={{ width: `${pctNormalized * 100}%` }}
                          />
                        </div>
                      </td>
                      <td className={`py-3 text-right ${ddColor}`}>
                        {bot.maxDrawdownPct.toFixed(1)}%
                      </td>
                      <td className="py-3 text-right">{bot.tradesCount}</td>
                      <td className="py-3 text-right">
                        <span
                          className={`inline-flex items-center justify-center px-2 py-0.5 rounded-full border text-[10px] ${statusColor(
                            bot.status
                          )}`}
                        >
                          {bot.status.toUpperCase()}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </section>
        </div>
      </main>
    </div>
  );
}

// -------------------- Portfolio view --------------------

function PortfolioView() {
  const p = MOCK_PORTFOLIO;

  const holdingsWithValue = p.holdings.map((h) => ({
    ...h,
    value: h.quantity * h.lastPrice,
  }));

  const holdingsValue = holdingsWithValue.reduce((sum, h) => sum + h.value, 0);
  const totalValue = holdingsValue + p.cash;

  const itemsForBar = [
    ...holdingsWithValue.map((h) => ({
      label: h.symbol,
      value: h.value,
      type: "stock",
    })),
    {
      label: "CASH",
      value: p.cash,
      type: "cash",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex flex-col">
      <header className="border-b border-slate-800 bg-slate-950/90 backdrop-blur sticky top-0 z-0">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold">Portfolio value</h1>
            <p className="text-xs text-slate-400">
              Breakdown of your PSX demo portfolio by symbol and cash.
            </p>
          </div>
          <span className="text-[11px] text-slate-500">{p.id}</span>
        </div>
      </header>

      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
          {/* Summary */}
          <section className="grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
              <p className="text-xs text-slate-400 mb-1">Total value</p>
              <p className="text-2xl font-semibold">
                {p.baseCurrency} {totalValue.toLocaleString()}
              </p>
              <p className="text-[11px] text-slate-500 mt-1">
                Holdings: {p.baseCurrency} {holdingsValue.toLocaleString()}
              </p>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
              <p className="text-xs text-slate-400 mb-1">Cash</p>
              <p className="text-2xl font-semibold">
                {p.baseCurrency} {p.cash.toLocaleString()}
              </p>
              <p className="text-[11px] text-slate-500 mt-1">
                {((p.cash / totalValue) * 100).toFixed(1)}% of portfolio
              </p>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
              <p className="text-xs text-slate-400 mb-1">Number of positions</p>
              <p className="text-2xl font-semibold">{p.holdings.length}</p>
              <p className="text-[11px] text-slate-500 mt-1">Portfolio ID: {p.id}</p>
            </div>
          </section>

          {/* Allocation bar */}
          <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
            <h2 className="text-sm font-semibold mb-3">Allocation</h2>

            <div className="w-full h-4 rounded-full bg-slate-900 overflow-hidden mb-3 flex">
              {itemsForBar.map((item) => {
                const pct = item.value / totalValue;
                if (!pct || pct <= 0) return null;
                const isCash = item.type === "cash";
                return (
                  <div
                    key={item.label}
                    className={`h-full ${
                      isCash ? "bg-slate-500" : "bg-emerald-500"
                    }`}
                    style={{ width: `${pct * 100}%` }}
                    title={`${item.label} ${(pct * 100).toFixed(1)}%`}
                  />
                );
              })}
            </div>

            <div className="flex flex-wrap gap-3 text-[11px] text-slate-300">
              {itemsForBar.map((item) => {
                const pct = (item.value / totalValue) * 100;
                return (
                  <div
                    key={item.label}
                    className="flex items-center gap-1 rounded-full border border-slate-700 px-2 py-1"
                  >
                    <span
                      className={`inline-block w-2 h-2 rounded-full ${
                        item.type === "cash" ? "bg-slate-500" : "bg-emerald-500"
                      }`}
                    />
                    <span>{item.label}</span>
                    <span className="text-slate-500">
                      {pct.toFixed(1)}% · {p.baseCurrency}{" "}
                      {item.value.toLocaleString()}
                    </span>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Holdings table */}
          <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 overflow-x-auto">
            <h2 className="text-sm font-semibold mb-3">Holdings detail</h2>
            <table className="w-full text-xs">
              <thead>
                <tr className="text-slate-400 border-b border-slate-800">
                  <th className="text-left py-2">Symbol</th>
                  <th className="text-left py-2">Name</th>
                  <th className="text-right py-2">Quantity</th>
                  <th className="text-right py-2">Last price</th>
                  <th className="text-right py-2">Value</th>
                  <th className="text-right py-2">% of portfolio</th>
                </tr>
              </thead>
              <tbody>
                {holdingsWithValue.map((h) => {
                  const pct = (h.value / totalValue) * 100;
                  return (
                    <tr key={h.symbol} className="border-b border-slate-900/60">
                      <td className="py-2 font-medium">{h.symbol}</td>
                      <td className="py-2 text-slate-300">{h.name}</td>
                      <td className="py-2 text-right">{h.quantity}</td>
                      <td className="py-2 text-right">
                        {h.lastPrice.toFixed(2)}
                      </td>
                      <td className="py-2 text-right">
                        {h.value.toLocaleString()}
                      </td>
                      <td className="py-2 text-right">{pct.toFixed(2)}%</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </section>
        </div>
      </main>
    </div>
  );
}

// -------------------- Root app with bottom navigation --------------------

export default function PSXTradingBotsPreview() {
  const [view, setView] = useState("dashboard");

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-50">
      {/* Render the selected view */}
      {view === "dashboard" && <DashboardView />}
      {view === "bots" && <BotsView />}
      {view === "progress" && <BotsProgressView />}
      {view === "portfolio" && <PortfolioView />}

      {/* Bottom navigation to switch between views */}
      <nav className="fixed bottom-3 inset-x-0 flex justify-center z-50">
        <div className="inline-flex items-center gap-1 rounded-full border border-slate-700 bg-slate-900/90 px-2 py-1 text-[11px] shadow-lg shadow-black/50">
          <button
            onClick={() => setView("dashboard")}
            className={`px-3 py-1.5 rounded-full border text-xs ${
              view === "dashboard"
                ? "border-emerald-500 bg-emerald-500/10 text-emerald-300"
                : "border-transparent text-slate-300"
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setView("bots")}
            className={`px-3 py-1.5 rounded-full border text-xs ${
              view === "bots"
                ? "border-emerald-500 bg-emerald-500/10 text-emerald-300"
                : "border-transparent text-slate-300"
            }`}
          >
            Bots
          </button>
          <button
            onClick={() => setView("progress")}
            className={`px-3 py-1.5 rounded-full border text-xs ${
              view === "progress"
                ? "border-emerald-500 bg-emerald-500/10 text-emerald-300"
                : "border-transparent text-slate-300"
            }`}
          >
            Bots progress
          </button>
          <button
            onClick={() => setView("portfolio")}
            className={`px-3 py-1.5 rounded-full border text-xs ${
              view === "portfolio"
                ? "border-emerald-500 bg-emerald-500/10 text-emerald-300"
                : "border-transparent text-slate-300"
            }`}
          >
            Portfolio
          </button>
        </div>
      </nav>
    </div>
  );
}
