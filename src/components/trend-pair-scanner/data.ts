import { useEffect, useState } from "react"
import func2url from "../../../backend/func2url.json"

export interface Pair {
  symbol: string
  type: "Forex" | "OTC" | "Crypto" | "Commodity"
  session: "Asia" | "Europe" | "US" | "24/7"
  apiSymbol?: string
  adx: number
  atrPips: number
  rsi: number
  emaSlope: "up" | "down" | "flat"
  spreadPo: string
  payoutPo: number
  trendScore: number
  comment: string
}

export interface LiveQuote {
  symbol: string
  price?: number
  change_pct?: number
  rsi?: number
  atr?: number
  adx?: number
  trend?: "up" | "down" | "flat"
  error?: string
}

export type FilterType = "all" | "OTC" | "Forex" | "Crypto"
export type SortType = "trend" | "adx" | "atr"

export const pairs: Pair[] = [
  {
    symbol: "EUR/USD OTC",
    type: "OTC",
    session: "24/7",
    apiSymbol: "EURUSD",
    adx: 32,
    atrPips: 9,
    rsi: 58,
    emaSlope: "up",
    spreadPo: "0.0",
    payoutPo: 92,
    trendScore: 88,
    comment: "Алгоритмическая пара — чистые тренды, минимум шума. Топ для трендовой стратегии на выходных.",
  },
  {
    symbol: "GBP/USD OTC",
    type: "OTC",
    session: "24/7",
    apiSymbol: "GBPUSD",
    adx: 38,
    atrPips: 14,
    rsi: 64,
    emaSlope: "up",
    spreadPo: "0.0",
    payoutPo: 90,
    trendScore: 91,
    comment: "Самая трендовая OTC-пара. Высокая ATR, чёткие импульсы. Топ-1 для EMA-trend.",
  },
  {
    symbol: "USD/JPY OTC",
    type: "OTC",
    session: "24/7",
    apiSymbol: "USDJPY",
    adx: 28,
    atrPips: 11,
    rsi: 52,
    emaSlope: "up",
    spreadPo: "0.0",
    payoutPo: 91,
    trendScore: 78,
    comment: "Тренд средней силы, но очень стабильный. Хорошо отрабатывает MACD и Supertrend.",
  },
  {
    symbol: "AUD/CAD OTC",
    type: "OTC",
    session: "24/7",
    apiSymbol: "AUDCAD",
    adx: 41,
    atrPips: 12,
    rsi: 67,
    emaSlope: "up",
    spreadPo: "0.0",
    payoutPo: 93,
    trendScore: 93,
    comment: "Хайповая OTC-пара у профи. ADX 40+ почти всегда — настоящая фабрика трендов.",
  },
  {
    symbol: "EUR/JPY OTC",
    type: "OTC",
    session: "24/7",
    apiSymbol: "EURJPY",
    adx: 35,
    atrPips: 16,
    rsi: 61,
    emaSlope: "up",
    spreadPo: "0.0",
    payoutPo: 92,
    trendScore: 86,
    comment: "Высокая ATR + чистый тренд. Подходит для экспирации 3–5 минут.",
  },
  {
    symbol: "EUR/USD",
    type: "Forex",
    session: "Europe",
    apiSymbol: "EURUSD",
    adx: 24,
    atrPips: 8,
    rsi: 55,
    emaSlope: "up",
    spreadPo: "0.6",
    payoutPo: 87,
    trendScore: 72,
    comment: "Лучше всего работает 10:00–18:00 МСК. До открытия Лондона — флэт, не лезь.",
  },
  {
    symbol: "GBP/USD",
    type: "Forex",
    session: "Europe",
    apiSymbol: "GBPUSD",
    adx: 31,
    atrPips: 13,
    rsi: 59,
    emaSlope: "up",
    spreadPo: "0.9",
    payoutPo: 85,
    trendScore: 81,
    comment: "Кабель — король трендов. Сильные импульсы, но и шум выше. Stop-hunt частый.",
  },
  {
    symbol: "USD/JPY",
    type: "Forex",
    session: "Asia",
    apiSymbol: "USDJPY",
    adx: 27,
    atrPips: 10,
    rsi: 53,
    emaSlope: "up",
    spreadPo: "0.7",
    payoutPo: 86,
    trendScore: 75,
    comment: "Главная азиатская пара. Тренды по новостям BoJ. Утром — топ.",
  },
  {
    symbol: "BTC/USD",
    type: "Crypto",
    session: "US",
    apiSymbol: "BTCUSDT",
    adx: 36,
    atrPips: 850,
    rsi: 62,
    emaSlope: "up",
    spreadPo: "8.0",
    payoutPo: 78,
    trendScore: 84,
    comment: "Тренды мощные, но рваные. Лучшее окно — 15:30–22:00 МСК (открытие фонды США).",
  },
  {
    symbol: "ETH/USD",
    type: "Crypto",
    session: "US",
    apiSymbol: "ETHUSDT",
    adx: 33,
    atrPips: 95,
    rsi: 60,
    emaSlope: "up",
    spreadPo: "0.4",
    payoutPo: 80,
    trendScore: 80,
    comment: "Ходит за BTC с усилением. ATR в % больше — пробои масштабнее.",
  },
  {
    symbol: "XAU/USD (Gold)",
    type: "Commodity",
    session: "Europe",
    adx: 29,
    atrPips: 220,
    rsi: 57,
    emaSlope: "flat",
    spreadPo: "0.5",
    payoutPo: 82,
    trendScore: 73,
    comment: "Реагирует на DXY и геополитику. Тренды короткие, но мощные.",
  },
  {
    symbol: "AUD/USD",
    type: "Forex",
    session: "Asia",
    apiSymbol: "AUDUSD",
    adx: 22,
    atrPips: 6,
    rsi: 48,
    emaSlope: "flat",
    spreadPo: "0.8",
    payoutPo: 84,
    trendScore: 58,
    comment: "Тренды слабые. Подходит для разворотных стратегий, не для тренд-следования.",
  },
]

export function getAdxStatus(adx: number) {
  if (adx >= 40) return { label: "СИЛЬНЫЙ", color: "bg-green-500", text: "text-green-400" }
  if (adx >= 25) return { label: "ТРЕНД", color: "bg-yellow-500", text: "text-yellow-400" }
  return { label: "ФЛЭТ", color: "bg-gray-500", text: "text-gray-400" }
}

export function getScoreColor(score: number) {
  if (score >= 85) return "text-green-400 border-green-500/40"
  if (score >= 70) return "text-yellow-400 border-yellow-500/40"
  return "text-gray-400 border-zinc-700"
}

const SCANNER_URL = (func2url as Record<string, string>)["scanner-proxy"]
const REFRESH_MS = 30_000

const scannerCache: { ts: number; etag: string; data: Record<string, LiveQuote> } = {
  ts: 0,
  etag: "",
  data: {},
}
let scannerInFlight: Promise<Record<string, LiveQuote>> | null = null

async function loadScannerQuotes(symbols: string[], force = false): Promise<Record<string, LiveQuote>> {
  const fresh = Date.now() - scannerCache.ts < REFRESH_MS
  if (!force && fresh && Object.keys(scannerCache.data).length) return scannerCache.data
  if (scannerInFlight) return scannerInFlight

  scannerInFlight = (async () => {
    try {
      const headers: Record<string, string> = {}
      if (scannerCache.etag) headers["If-None-Match"] = scannerCache.etag
      const res = await fetch(`${SCANNER_URL}?mode=quote&symbols=${symbols.join(",")}`, { headers })
      if (res.status === 304) {
        scannerCache.ts = Date.now()
        return scannerCache.data
      }
      const etag = res.headers.get("ETag")
      if (etag) scannerCache.etag = etag
      const json = await res.json()
      scannerCache.data = json.quotes || {}
      scannerCache.ts = Date.now()
      return scannerCache.data
    } finally {
      scannerInFlight = null
    }
  })()
  return scannerInFlight
}

export function useScannerQuotes() {
  const [quotes, setQuotes] = useState<Record<string, LiveQuote>>({})
  const [loading, setLoading] = useState(false)
  const [lastUpdate, setLastUpdate] = useState<number>(0)

  useEffect(() => {
    let canceled = false
    const symbolsSet = new Set<string>()
    for (const p of pairs) {
      if (p.apiSymbol) symbolsSet.add(p.apiSymbol)
    }
    const symbols = Array.from(symbolsSet)

    const tick = async (force = false) => {
      if (document.hidden) return
      setLoading(true)
      try {
        const data = await loadScannerQuotes(symbols, force)
        if (!canceled) {
          setQuotes({ ...data })
          setLastUpdate(scannerCache.ts)
        }
      } catch {
        // ignore
      } finally {
        if (!canceled) setLoading(false)
      }
    }

    tick()
    const id = window.setInterval(() => tick(true), REFRESH_MS)
    const onVisible = () => { if (!document.hidden) tick(true) }
    document.addEventListener("visibilitychange", onVisible)

    return () => {
      canceled = true
      window.clearInterval(id)
      document.removeEventListener("visibilitychange", onVisible)
    }
  }, [])

  return { quotes, loading, lastUpdate }
}

export function applyLiveQuote(p: Pair, q?: LiveQuote): Pair {
  if (!q || q.error || q.price === undefined) return p
  const adx = q.adx !== undefined ? Math.round(q.adx) : p.adx
  const rsi = q.rsi !== undefined ? Math.round(q.rsi) : p.rsi
  const atrPips =
    q.atr !== undefined
      ? p.type === "Crypto" || p.type === "Commodity"
        ? Math.round(q.atr)
        : Math.round(q.atr * 10000)
      : p.atrPips
  const emaSlope = q.trend ?? p.emaSlope
  const trendScore = q.adx !== undefined
    ? Math.max(0, Math.min(100, Math.round(q.adx * 1.8 + (rsi > 50 ? 10 : 0) + (emaSlope === "up" || emaSlope === "down" ? 10 : 0))))
    : p.trendScore
  return { ...p, adx, rsi, atrPips, emaSlope, trendScore }
}
