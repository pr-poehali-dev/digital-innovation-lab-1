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
    adx: 26,
    atrPips: 8,
    rsi: 54,
    emaSlope: "flat",
    spreadPo: "0.0",
    payoutPo: 92,
    trendScore: 76,
    comment: "Май 2026: пара во флэте 1.0800–1.0950. Лучше работают разворотные стратегии от границ канала.",
  },
  {
    symbol: "GBP/USD OTC",
    type: "OTC",
    session: "24/7",
    apiSymbol: "GBPUSD",
    adx: 40,
    atrPips: 15,
    rsi: 66,
    emaSlope: "up",
    spreadPo: "0.0",
    payoutPo: 90,
    trendScore: 93,
    comment: "Топ-1 OTC мая 2026. ADX стабильно выше 38, чёткие импульсы по 1.2700-1.2900.",
  },
  {
    symbol: "USD/JPY OTC",
    type: "OTC",
    session: "24/7",
    apiSymbol: "USDJPY",
    adx: 34,
    atrPips: 13,
    rsi: 58,
    emaSlope: "up",
    spreadPo: "0.0",
    payoutPo: 91,
    trendScore: 84,
    comment: "Йена в стадии укрепления после интервенций BoJ. Тренды чище, ATR подросла.",
  },
  {
    symbol: "AUD/CAD OTC",
    type: "OTC",
    session: "24/7",
    apiSymbol: "AUDCAD",
    adx: 21,
    atrPips: 7,
    rsi: 53,
    emaSlope: "flat",
    spreadPo: "0.0",
    payoutPo: 93,
    trendScore: 64,
    comment: "Май 2026: пара остыла, ADX упал до 20-25. Сейчас рабочая для возврата к среднему, не тренда.",
  },
  {
    symbol: "EUR/JPY OTC",
    type: "OTC",
    session: "24/7",
    apiSymbol: "EURJPY",
    adx: 37,
    atrPips: 18,
    rsi: 63,
    emaSlope: "up",
    spreadPo: "0.0",
    payoutPo: 92,
    trendScore: 89,
    comment: "Топ по ATR в OTC — 18 pips. Чистый тренд + кроссовая пара = идеально для 3-5 мин экспирации.",
  },
  {
    symbol: "EUR/USD",
    type: "Forex",
    session: "Europe",
    apiSymbol: "EURUSD",
    adx: 22,
    atrPips: 7,
    rsi: 53,
    emaSlope: "flat",
    spreadPo: "0.6",
    payoutPo: 87,
    trendScore: 68,
    comment: "Май 2026: летняя коробка 1.08–1.095. Чистые сетапы 10:00–18:00 МСК, иначе флэт.",
  },
  {
    symbol: "GBP/USD",
    type: "Forex",
    session: "Europe",
    apiSymbol: "GBPUSD",
    adx: 33,
    atrPips: 14,
    rsi: 61,
    emaSlope: "up",
    spreadPo: "0.9",
    payoutPo: 85,
    trendScore: 83,
    comment: "Кабель в восходящем тренде после данных по UK GDP. ADX 33+, сильные импульсы.",
  },
  {
    symbol: "USD/JPY",
    type: "Forex",
    session: "Asia",
    apiSymbol: "USDJPY",
    adx: 31,
    atrPips: 12,
    rsi: 57,
    emaSlope: "up",
    spreadPo: "0.7",
    payoutPo: 86,
    trendScore: 80,
    comment: "Йена под давлением интервенций. Утренний слот 03:00-08:00 МСК — лучший.",
  },
  {
    symbol: "BTC/USD",
    type: "Crypto",
    session: "US",
    apiSymbol: "BTCUSDT",
    adx: 38,
    atrPips: 1250,
    rsi: 63,
    emaSlope: "up",
    spreadPo: "12.0",
    payoutPo: 78,
    trendScore: 87,
    comment: "Май 2026: бычий цикл, BTC у $94-98k. ATR выросла до $1250. Окно 15:30-22:00 МСК — пик.",
  },
  {
    symbol: "ETH/USD",
    type: "Crypto",
    session: "US",
    apiSymbol: "ETHUSDT",
    adx: 35,
    atrPips: 140,
    rsi: 62,
    emaSlope: "up",
    spreadPo: "0.6",
    payoutPo: 80,
    trendScore: 83,
    comment: "ETH у $3.4-3.8k, ходит за BTC с усилением. ETF-приток усилил тренд.",
  },
  {
    symbol: "XAU/USD (Gold)",
    type: "Commodity",
    session: "Europe",
    adx: 34,
    atrPips: 280,
    rsi: 64,
    emaSlope: "up",
    spreadPo: "0.5",
    payoutPo: 82,
    trendScore: 81,
    comment: "Золото у $3300+. Сильный тренд на фоне геополитики и ослабления доллара. ATR выросла.",
  },
  {
    symbol: "AUD/USD",
    type: "Forex",
    session: "Asia",
    apiSymbol: "AUDUSD",
    adx: 25,
    atrPips: 8,
    rsi: 52,
    emaSlope: "up",
    spreadPo: "0.8",
    payoutPo: 84,
    trendScore: 65,
    comment: "AUD оживился после данных RBA. Слабые-средние тренды, лучше брать в азиатскую сессию.",
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

export async function loadScannerQuotes(symbols: string[], force = false): Promise<Record<string, LiveQuote>> {
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