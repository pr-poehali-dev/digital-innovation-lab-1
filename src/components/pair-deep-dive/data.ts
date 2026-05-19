import { useEffect, useState } from "react"
import func2url from "../../../backend/func2url.json"

export interface LiveQuote {
  symbol: string
  price?: number
  change_pct?: number
  high_24h?: number
  low_24h?: number
  rsi?: number
  atr?: number
  adx?: number
  trend?: "up" | "down" | "flat"
  error?: string
}

export interface Level {
  price: string
  type: "R" | "S" | "Pivot"
  strength: "сильный" | "средний" | "слабый"
  note: string
}

export interface NewsItem {
  date: string
  title: string
  impact: "high" | "medium" | "low"
  result: string
  color: string
}

export interface DeepDive {
  key: "eurusd-otc" | "btc-usd"
  symbol: string
  emoji: string
  accent: string
  border: string
  glow: string
  summary: string
  currentPrice: string
  change: string
  changePositive: boolean
  bias: "Бычий" | "Медвежий" | "Нейтральный"
  biasColor: string
  levels: Level[]
  news: NewsItem[]
  scenarios: { title: string; condition: string; action: string; tone: "bull" | "bear" }[]
  metrics: { label: string; value: string; hint?: string }[]
}

export const dives: DeepDive[] = [
  {
    key: "eurusd-otc",
    symbol: "EUR/USD OTC",
    emoji: "🇪🇺",
    accent: "text-red-400",
    border: "border-red-500/40",
    glow: "shadow-red-500/20",
    summary:
      "Алгоритмическая пара Pocket Option. Двигается по генерируемому ценовому потоку, копирующему Forex с задержкой ~30 сек. На выходных идёт по собственному движку. Подходит для трендовых стратегий и торговли от уровней.",
    currentPrice: "1.0842",
    change: "+0.18%",
    changePositive: true,
    bias: "Бычий",
    biasColor: "bg-green-500/20 text-green-400 border-green-500/30",
    metrics: [
      { label: "ADX (H1)", value: "32", hint: "Тренд средней силы" },
      { label: "RSI (M15)", value: "58", hint: "Зона роста, без перекупленности" },
      { label: "ATR (M5)", value: "9 pips", hint: "Стандартная вола" },
      { label: "Spread", value: "0.0", hint: "OTC без спреда" },
      { label: "Payout", value: "92%", hint: "Высокая выплата" },
      { label: "Активность", value: "24/7", hint: "Включая выходные" },
    ],
    levels: [
      { price: "1.0920", type: "R", strength: "сильный", note: "Максимум прошлой недели, тройное касание" },
      { price: "1.0880", type: "R", strength: "средний", note: "Локальное сопротивление, скопление ордеров" },
      { price: "1.0850", type: "Pivot", strength: "сильный", note: "Точка разворота дня, психологический уровень" },
      { price: "1.0820", type: "S", strength: "средний", note: "Поддержка от EMA-50 на H1" },
      { price: "1.0780", type: "S", strength: "сильный", note: "Минимум недели, ключевой уровень для лонга" },
    ],
    news: [
      {
        date: "вчера, 15:30",
        title: "Core CPI USA 0.3% (прогноз 0.3%)",
        impact: "high",
        result: "EUR/USD OTC: +35 пунктов за час. Алгоритм скопировал движение Forex с лагом 40 сек.",
        color: "bg-green-500/10 border-green-500/30",
      },
      {
        date: "позавчера, 17:00",
        title: "Решение ЕЦБ по ставке: без изменений",
        impact: "high",
        result: "Резкая свеча вниз −22 пунктов, далее откат вверх. Идеально для пробойной стратегии.",
        color: "bg-red-500/10 border-red-500/30",
      },
      {
        date: "3 дня назад",
        title: "NFP USA: 187k (прогноз 170k)",
        impact: "high",
        result: "Доллар укрепился, EUR/USD OTC ушёл с 1.0890 на 1.0810. Тренд продержался 4 часа.",
        color: "bg-red-500/10 border-red-500/30",
      },
      {
        date: "выходные",
        title: "OTC-режим (Forex закрыт)",
        impact: "medium",
        result: "Пара ходила в канале 1.0820–1.0880. Алгоритм давал чистые отбои от границ.",
        color: "bg-purple-500/10 border-purple-500/30",
      },
    ],
    scenarios: [
      {
        title: "Сценарий №1 — Лонг от поддержки",
        condition: "Цена касается 1.0820 + RSI < 40 + бычий пин-бар на M5",
        action: "Покупка call, экспирация 3–5 минут. Цель — возврат к 1.0850.",
        tone: "bull",
      },
      {
        title: "Сценарий №2 — Пробой вверх",
        condition: "Закрепление выше 1.0880 на двух свечах H1 + растущий ADX",
        action: "Call на откате к 1.0880, экспирация 10–15 минут. Цель 1.0920.",
        tone: "bull",
      },
      {
        title: "Сценарий №3 — Шорт от сопротивления",
        condition: "Касание 1.0920 + RSI > 70 + медвежья поглощающая",
        action: "Put, экспирация 5–7 минут. Цель 1.0880.",
        tone: "bear",
      },
    ],
  },
  {
    key: "btc-usd",
    symbol: "BTC/USD",
    emoji: "₿",
    accent: "text-yellow-400",
    border: "border-yellow-500/40",
    glow: "shadow-yellow-500/20",
    summary:
      "Крипта №1. Торгуется 24/7, но реальные движения и тренды формируются в часы открытия фондового рынка США (15:30–22:00 МСК). Сильно коррелирует с NASDAQ (+0.65). На Pocket Option — рабочий инструмент для тренд-стратегий и новостной торговли.",
    currentPrice: "67 420",
    change: "+1.84%",
    changePositive: true,
    bias: "Бычий",
    biasColor: "bg-green-500/20 text-green-400 border-green-500/30",
    metrics: [
      { label: "ADX (H1)", value: "36", hint: "Уверенный тренд" },
      { label: "RSI (M15)", value: "62", hint: "Бычья зона, ещё есть запас" },
      { label: "ATR (M15)", value: "$850", hint: "Высокая вола" },
      { label: "Spread", value: "$8", hint: "Норма для крипты" },
      { label: "Payout", value: "78%", hint: "Ниже Forex" },
      { label: "Funding rate", value: "+0.012%", hint: "Лонги платят шортам" },
    ],
    levels: [
      { price: "$72 000", type: "R", strength: "сильный", note: "ATH 2024, психологическая отметка" },
      { price: "$69 500", type: "R", strength: "средний", note: "Уровень consolidation последних недель" },
      { price: "$67 000", type: "Pivot", strength: "сильный", note: "Точка разворота — EMA-200 на H4" },
      { price: "$64 800", type: "S", strength: "сильный", note: "Минимум недели + объёмная зона" },
      { price: "$61 500", type: "S", strength: "сильный", note: "Гэп ликвидности, цель для шортов" },
    ],
    news: [
      {
        date: "вчера, 16:30",
        title: "Spot BTC ETF: приток $230M за день",
        impact: "high",
        result: "BTC рванул с $66 200 до $67 900 за 3 часа. Идеальный тренд для call на 15-минутках.",
        color: "bg-green-500/10 border-green-500/30",
      },
      {
        date: "вчера, 21:00",
        title: "FOMC Minutes: ястребиная риторика",
        impact: "high",
        result: "BTC откатился с $68 000 до $66 800. Резкая свеча — стопы и ликвидации.",
        color: "bg-red-500/10 border-red-500/30",
      },
      {
        date: "3 дня назад",
        title: "Hashrate обновил ATH (700 EH/s)",
        impact: "medium",
        result: "Среднесрочно бычий сигнал. Кратковременная реакция в виде роста на 1.2%.",
        color: "bg-green-500/10 border-green-500/30",
      },
      {
        date: "неделя",
        title: "Halving + ETF flows = новый цикл",
        impact: "high",
        result: "Структурный бычий драйвер. Тренд H4 устойчиво вверх, откаты выкупаются.",
        color: "bg-green-500/10 border-green-500/30",
      },
    ],
    scenarios: [
      {
        title: "Сценарий №1 — Покупка от Pivot",
        condition: "Касание $67 000 + бычья дивергенция по RSI + рост объёмов",
        action: "Call, экспирация 15 минут. Цель — возврат к $69 500.",
        tone: "bull",
      },
      {
        title: "Сценарий №2 — Пробой ATH",
        condition: "Закрепление выше $72 000 на дневке + Funding < 0.02%",
        action: "Тренд-следование. Call на откатах к $72 000, экспирация 30 минут–1 час.",
        tone: "bull",
      },
      {
        title: "Сценарий №3 — Шорт на ликвидацию",
        condition: "Отбой от $69 500 + перегретый Funding + RSI > 75",
        action: "Put на M15, цель $67 000. Стоп выше $70 000 (для CFD).",
        tone: "bear",
      },
    ],
  },
]

const SCANNER_URL = (func2url as Record<string, string>)["scanner-proxy"]
const REFRESH_MS = 30_000
const SYMBOLS = "BTCUSDT,EURUSD"

const quotesCache: { ts: number; etag: string; data: Record<string, LiveQuote> } = {
  ts: 0,
  etag: "",
  data: {},
}

let inFlight: Promise<Record<string, LiveQuote>> | null = null

async function loadQuotes(force = false): Promise<Record<string, LiveQuote>> {
  const fresh = Date.now() - quotesCache.ts < REFRESH_MS
  if (!force && fresh && Object.keys(quotesCache.data).length) return quotesCache.data
  if (inFlight) return inFlight

  inFlight = (async () => {
    try {
      const headers: Record<string, string> = {}
      if (quotesCache.etag) headers["If-None-Match"] = quotesCache.etag
      const res = await fetch(`${SCANNER_URL}?mode=quote&symbols=${SYMBOLS}`, { headers })
      if (res.status === 304) {
        quotesCache.ts = Date.now()
        return quotesCache.data
      }
      const etag = res.headers.get("ETag")
      if (etag) quotesCache.etag = etag
      const json = await res.json()
      quotesCache.data = json.quotes || {}
      quotesCache.ts = Date.now()
      return quotesCache.data
    } finally {
      inFlight = null
    }
  })()
  return inFlight
}

export function useLiveQuote(active: DeepDive["key"]) {
  const [live, setLive] = useState<LiveQuote | null>(null)
  const [loading, setLoading] = useState(false)
  const [lastUpdate, setLastUpdate] = useState<number>(0)

  useEffect(() => {
    let canceled = false
    const symbol = active === "btc-usd" ? "BTCUSDT" : "EURUSD"

    const tick = async (force = false) => {
      if (document.hidden) return
      setLoading(true)
      try {
        const quotes = await loadQuotes(force)
        if (!canceled && quotes[symbol]) {
          setLive(quotes[symbol])
          setLastUpdate(quotesCache.ts)
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
  }, [active])

  return { live, loading, lastUpdate }
}
