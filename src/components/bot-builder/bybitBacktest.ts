/**
 * 🟠 Bybit Backtester — чистая логика (без UI).
 *
 * Тянем исторические свечи через public REST Bybit (без авторизации, без ключей)
 * и прогоняем те же индикаторы что в сгенерированном Python-боте.
 *
 * Цель: показать юзеру **до запуска** примерные WR / P/L / просадку.
 * Это НЕ замена реальному тестнету — это первичный фильтр «есть ли смысл вообще».
 */
import type { BybitBotConfig } from "./BybitBotTypes"

export interface Candle {
  ts: number
  open: number
  high: number
  low: number
  close: number
  volume: number
}

export interface BacktestTrade {
  ts: number
  side: "BUY" | "SELL"
  entry: number
  exit: number
  result: "WIN" | "LOSS"
  pnlUsdt: number
  bars: number
}

export interface BacktestResult {
  candles: number
  trades: BacktestTrade[]
  wins: number
  losses: number
  winRate: number
  totalPnl: number
  maxDrawdown: number
  finalBalance: number
  startBalance: number
  bestTrade: number
  worstTrade: number
  avgWin: number
  avgLoss: number
  profitFactor: number
  durationDays: number
}

// ═══════════════════════════════════════════════════════════════════
// Загрузка исторических свечей с Bybit public API
// ═══════════════════════════════════════════════════════════════════

/**
 * Запрашивает свечи с api.bybit.com (без авторизации).
 * Bybit ограничивает 1000 свечей за запрос → крутим пагинацию.
 */
export async function fetchBybitHistory(
  symbol: string,
  category: "spot" | "linear",
  intervalMin: number,
  totalCandles: number = 5000,
  onProgress?: (loaded: number, total: number) => void,
): Promise<Candle[]> {
  const baseUrl = "https://api.bybit.com/v5/market/kline"
  const cleanSymbol = symbol.replace("/", "")
  const interval = String(intervalMin)
  const limit = 1000

  const all: Candle[] = []
  let endTime: number | undefined = undefined
  const maxIterations = Math.ceil(totalCandles / limit) + 1

  for (let i = 0; i < maxIterations && all.length < totalCandles; i++) {
    const url = new URL(baseUrl)
    url.searchParams.set("category", category)
    url.searchParams.set("symbol", cleanSymbol)
    url.searchParams.set("interval", interval)
    url.searchParams.set("limit", String(limit))
    if (endTime) url.searchParams.set("end", String(endTime))

    const resp = await fetch(url.toString())
    if (!resp.ok) throw new Error(`Bybit API: HTTP ${resp.status}`)
    const data = await resp.json()
    if (data.retCode !== 0) throw new Error(`Bybit API: ${data.retMsg}`)

    const rows: string[][] = data.result?.list || []
    if (rows.length === 0) break

    // Bybit отдаёт от новых к старым
    const batch: Candle[] = rows.map((k) => ({
      ts: Number(k[0]),
      open: Number(k[1]),
      high: Number(k[2]),
      low: Number(k[3]),
      close: Number(k[4]),
      volume: Number(k[5]),
    }))
    // Самая старая свеча в этой партии — endTime для следующей итерации
    endTime = batch[batch.length - 1].ts - 1
    all.push(...batch)
    onProgress?.(all.length, totalCandles)

    if (rows.length < limit) break // больше истории нет
  }

  // Сортируем от старых к новым и обрезаем
  all.sort((a, b) => a.ts - b.ts)
  return all.slice(-totalCandles)
}

// ═══════════════════════════════════════════════════════════════════
// Индикаторы — реплика тех что в Python-боте
// ═══════════════════════════════════════════════════════════════════

function rsi(closes: number[], period: number): number {
  if (closes.length < period + 1) return 50
  let gains = 0, losses = 0
  for (let i = closes.length - period; i < closes.length; i++) {
    const d = closes[i] - closes[i - 1]
    if (d > 0) gains += d
    else losses -= d
  }
  const ag = gains / period || 0.0001
  const al = losses / period || 0.0001
  const rs = ag / al
  return 100 - 100 / (1 + rs)
}

function ema(closes: number[], period: number): number {
  if (closes.length < period) return closes[closes.length - 1]
  const k = 2 / (period + 1)
  let e = 0
  for (let i = 0; i < period; i++) e += closes[i]
  e /= period
  for (let i = period; i < closes.length; i++) e = closes[i] * k + e * (1 - k)
  return e
}

function macdHist(closes: number[]): number {
  if (closes.length < 35) return 0
  return ema(closes, 12) - ema(closes, 26)
}

function bollinger(closes: number[], period = 20, mult = 2): { upper: number; lower: number } {
  if (closes.length < period) {
    const last = closes[closes.length - 1]
    return { upper: last, lower: last }
  }
  const win = closes.slice(-period)
  const sma = win.reduce((a, b) => a + b, 0) / period
  const variance = win.reduce((a, b) => a + (b - sma) ** 2, 0) / period
  const std = Math.sqrt(variance)
  return { upper: sma + mult * std, lower: sma - mult * std }
}

function atr(candles: Candle[], period = 14): number {
  if (candles.length < period + 1) return 0
  const trs: number[] = []
  for (let i = candles.length - period; i < candles.length; i++) {
    const tr = Math.max(
      candles[i].high - candles[i].low,
      Math.abs(candles[i].high - candles[i - 1].close),
      Math.abs(candles[i].low - candles[i - 1].close),
    )
    trs.push(tr)
  }
  return trs.reduce((a, b) => a + b, 0) / period
}

// ═══════════════════════════════════════════════════════════════════
// Сигнал — повторяет get_signal() из Python-генератора
// ═══════════════════════════════════════════════════════════════════

function getSignal(slice: Candle[], cfg: BybitBotConfig): "BUY" | "SELL" | null {
  const minBars = Math.max(cfg.emaSlow, cfg.rsiPeriod) + 5
  if (slice.length < minBars) return null
  const closes = slice.map((c) => c.close)

  let votesBuy = 0, votesSell = 0, total = 0

  if (cfg.comboStrategies.includes("rsi_reversal")) {
    total++
    const r = rsi(closes, cfg.rsiPeriod)
    if (r < cfg.rsiOversold) votesBuy++
    else if (r > cfg.rsiOverbought) votesSell++
  }

  if (cfg.comboStrategies.includes("ema_cross") || cfg.comboStrategies.includes("ema_trend")) {
    total++
    const fast = ema(closes, cfg.emaFast)
    const slow = ema(closes, cfg.emaSlow)
    if (fast > slow) votesBuy++
    else if (fast < slow) votesSell++
  }

  if (cfg.bybitUseMacd) {
    total++
    const h = macdHist(closes)
    if (h > 0) votesBuy++
    else if (h < 0) votesSell++
  }

  if (cfg.bybitUseBollinger) {
    total++
    const { upper, lower } = bollinger(closes)
    const last = closes[closes.length - 1]
    if (last <= lower) votesBuy++
    else if (last >= upper) votesSell++
  }

  if (cfg.bybitUseAtrFilter) {
    const a = atr(slice, 14)
    const avg = closes.slice(-20).reduce((s, c) => s + c, 0) / 20
    const atrPct = avg ? (a / avg) * 100 : 0
    if (atrPct < 0.1) return null
  }

  if (total === 0) return null
  if (cfg.comboLogic === "AND") {
    if (votesBuy === total) return "BUY"
    if (votesSell === total) return "SELL"
  } else {
    if (votesBuy > votesSell) return "BUY"
    if (votesSell > votesBuy) return "SELL"
  }
  return null
}

// ═══════════════════════════════════════════════════════════════════
// Главный движок симуляции
// ═══════════════════════════════════════════════════════════════════

export function runBacktest(candles: Candle[], cfg: BybitBotConfig): BacktestResult {
  const startBalance = 1000
  let balance = startBalance
  let peak = balance
  let maxDD = 0
  const trades: BacktestTrade[] = []

  const tpPct = cfg.bybitTpPercent / 100
  const slPct = cfg.bybitSlPercent / 100
  const bet = cfg.betAmount
  const allowShort = cfg.bybitMode === "futures" && cfg.bybitAllowShort
  const leverage = cfg.bybitMode === "futures" ? cfg.bybitLeverage : 1
  const dirFilter = cfg.tradeDirection
  const feeRate = 0.001 // 0.1% taker

  let openTrade: { side: "BUY" | "SELL"; entry: number; tp: number; sl: number; openIdx: number } | null = null
  let pauseUntilIdx = 0
  let consecLosses = 0
  const pauseAfter = cfg.pauseAfterLossesEnabled ?? true
  const pauseCount = cfg.pauseAfterLossesCount ?? 3
  // Прибл. длительность паузы в свечах:
  const pauseBars = Math.round(((cfg.pauseAfterLossesMinutes ?? 10) * 60) / (cfg.bybitTimeframeMin * 60))

  const minBars = Math.max(cfg.emaSlow, cfg.rsiPeriod) + 10

  for (let i = minBars; i < candles.length; i++) {
    const c = candles[i]

    // Проверка открытой сделки на этой свече
    if (openTrade) {
      const hitTp =
        (openTrade.side === "BUY" && c.high >= openTrade.tp) ||
        (openTrade.side === "SELL" && c.low <= openTrade.tp)
      const hitSl =
        (openTrade.side === "BUY" && c.low <= openTrade.sl) ||
        (openTrade.side === "SELL" && c.high >= openTrade.sl)

      if (hitTp || hitSl) {
        const exit = hitTp ? openTrade.tp : openTrade.sl
        const move = openTrade.side === "BUY" ? exit - openTrade.entry : openTrade.entry - exit
        const ret = (move / openTrade.entry) * leverage
        const fee = bet * feeRate * 2 // вход + выход
        const pnl = bet * ret - fee
        balance += pnl
        if (balance > peak) peak = balance
        const dd = peak - balance
        if (dd > maxDD) maxDD = dd

        trades.push({
          ts: c.ts,
          side: openTrade.side,
          entry: openTrade.entry,
          exit,
          result: pnl > 0 ? "WIN" : "LOSS",
          pnlUsdt: pnl,
          bars: i - openTrade.openIdx,
        })

        if (pnl < 0) {
          consecLosses++
          if (pauseAfter && consecLosses >= pauseCount) {
            pauseUntilIdx = i + pauseBars
            consecLosses = 0
          }
        } else {
          consecLosses = 0
        }
        openTrade = null
        continue
      }
    }

    if (openTrade) continue
    if (i < pauseUntilIdx) continue
    if (balance <= 0) break

    // Ищем сигнал на закрытой свече
    const slice = candles.slice(0, i + 1)
    const sig = getSignal(slice, cfg)
    if (!sig) continue

    if (sig === "BUY" && dirFilter === "put_only") continue
    if (sig === "SELL" && dirFilter === "call_only") continue
    if (sig === "SELL" && !allowShort && cfg.bybitMode === "spot") continue

    const entry = c.close
    const tp = sig === "BUY" ? entry * (1 + tpPct) : entry * (1 - tpPct)
    const sl = sig === "BUY" ? entry * (1 - slPct) : entry * (1 + slPct)
    openTrade = { side: sig, entry, tp, sl, openIdx: i }
  }

  const wins = trades.filter((t) => t.result === "WIN").length
  const losses = trades.filter((t) => t.result === "LOSS").length
  const totalPnl = balance - startBalance
  const winRate = trades.length ? (wins / trades.length) * 100 : 0
  const winPnls = trades.filter((t) => t.pnlUsdt > 0).map((t) => t.pnlUsdt)
  const lossPnls = trades.filter((t) => t.pnlUsdt < 0).map((t) => t.pnlUsdt)
  const sumWins = winPnls.reduce((a, b) => a + b, 0)
  const sumLosses = Math.abs(lossPnls.reduce((a, b) => a + b, 0))
  const profitFactor = sumLosses > 0 ? sumWins / sumLosses : sumWins > 0 ? 999 : 0

  const durMs = candles.length > 1 ? candles[candles.length - 1].ts - candles[0].ts : 0
  const durationDays = durMs / (1000 * 60 * 60 * 24)

  return {
    candles: candles.length,
    trades,
    wins,
    losses,
    winRate,
    totalPnl,
    maxDrawdown: maxDD,
    finalBalance: balance,
    startBalance,
    bestTrade: trades.length ? Math.max(...trades.map((t) => t.pnlUsdt)) : 0,
    worstTrade: trades.length ? Math.min(...trades.map((t) => t.pnlUsdt)) : 0,
    avgWin: winPnls.length ? sumWins / winPnls.length : 0,
    avgLoss: lossPnls.length ? -sumLosses / lossPnls.length : 0,
    profitFactor,
    durationDays,
  }
}
