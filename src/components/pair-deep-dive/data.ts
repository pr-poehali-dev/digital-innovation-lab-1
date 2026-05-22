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
  key: "eurusd-otc" | "btc-usd" | "audcad-otc"
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
    currentPrice: "1.0865",
    change: "+0.18%",
    changePositive: true,
    bias: "Нейтральный",
    biasColor: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    metrics: [
      { label: "ADX (H1)", value: "26", hint: "Слабый тренд, ближе к флэту" },
      { label: "RSI (M15)", value: "54", hint: "Нейтральная зона" },
      { label: "ATR (M5)", value: "9 pips", hint: "Стандартная вола мая 2026" },
      { label: "Spread", value: "0.0", hint: "OTC без спреда" },
      { label: "Payout", value: "92%", hint: "Высокая выплата" },
      { label: "Активность", value: "24/7", hint: "Включая выходные" },
    ],
    levels: [
      { price: "1.0950", type: "R", strength: "сильный", note: "Максимум мая, тройное касание + скопление стопов" },
      { price: "1.0910", type: "R", strength: "средний", note: "EMA-200 на H4 — зона продавцов" },
      { price: "1.0885", type: "R", strength: "слабый", note: "Ближайший потолок M15, часто пробивается" },
      { price: "1.0865", type: "Pivot", strength: "сильный", note: "Дневной pivot + центр недельного канала" },
      { price: "1.0840", type: "S", strength: "средний", note: "EMA-50 на H1, частые отбои" },
      { price: "1.0800", type: "S", strength: "сильный", note: "Психологический круглый уровень" },
      { price: "1.0750", type: "S", strength: "сильный", note: "Минимум мая, объёмная зона — цель медведей" },
    ],
    news: [
      {
        date: "21 мая 2026, 15:30",
        title: "Core PCE USA 0.2% (прогноз 0.3%)",
        impact: "high",
        result: "EUR/USD OTC: +35 пунктов за 2 часа. Алгоритм скопировал движение Forex с лагом ~40 сек.",
        color: "bg-green-500/10 border-green-500/30",
      },
      {
        date: "20 мая 2026, 14:15",
        title: "ЕЦБ Лагард: 'ставку держим, инфляция под контролем'",
        impact: "high",
        result: "Резкая свеча вверх +28 пунктов, далее консолидация. Хороший вход на откате.",
        color: "bg-green-500/10 border-green-500/30",
      },
      {
        date: "19 мая 2026, 15:30",
        title: "NFP USA: 142k (прогноз 175k) — слабые данные",
        impact: "high",
        result: "Доллар ослаб, EUR/USD OTC рванул с 1.0810 на 1.0890. Тренд держался 5 часов.",
        color: "bg-green-500/10 border-green-500/30",
      },
      {
        date: "17-18 мая 2026, выходные",
        title: "OTC-режим (Forex закрыт)",
        impact: "medium",
        result: "Пара ходила в канале 1.0830–1.0890. Алгоритм давал чистые отбои от границ.",
        color: "bg-purple-500/10 border-purple-500/30",
      },
    ],
    scenarios: [
      {
        title: "Сценарий №1 — Лонг от поддержки",
        condition: "Цена касается 1.0840 + RSI < 40 + бычий пин-бар на M5",
        action: "Покупка call, экспирация 3–5 минут. Цель — возврат к 1.0885.",
        tone: "bull",
      },
      {
        title: "Сценарий №2 — Пробой вверх",
        condition: "Закрепление выше 1.0910 на двух свечах H1 + растущий ADX",
        action: "Call на откате к 1.0910, экспирация 10–15 минут. Цель 1.0950.",
        tone: "bull",
      },
      {
        title: "Сценарий №3 — Шорт от сопротивления",
        condition: "Касание 1.0950 + RSI > 70 + медвежья поглощающая",
        action: "Put, экспирация 5–7 минут. Цель 1.0885.",
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
    currentPrice: "94 850",
    change: "+2.15%",
    changePositive: true,
    bias: "Бычий",
    biasColor: "bg-green-500/20 text-green-400 border-green-500/30",
    metrics: [
      { label: "ADX (H1)", value: "38", hint: "Уверенный восходящий тренд" },
      { label: "RSI (M15)", value: "63", hint: "Бычья зона, без перегрева" },
      { label: "ATR (M15)", value: "$1 250", hint: "Высокая вола, типично для 2026" },
      { label: "Spread", value: "$12", hint: "Норма для крипты на PO" },
      { label: "Payout", value: "78%", hint: "Ниже Forex" },
      { label: "Funding rate", value: "+0.018%", hint: "Лонги платят шортам, но не критично" },
    ],
    levels: [
      { price: "$108 000", type: "R", strength: "сильный", note: "ATH 2025 — психологическая отметка цикла" },
      { price: "$98 500", type: "R", strength: "средний", note: "Верх диапазона мая, зона распределения" },
      { price: "$96 000", type: "R", strength: "слабый", note: "Локальное сопротивление H1, частые ретесты" },
      { price: "$94 800", type: "Pivot", strength: "сильный", note: "Дневной pivot + EMA-200 на H4" },
      { price: "$92 000", type: "S", strength: "средний", note: "Объёмная зона + EMA-50 на H1" },
      { price: "$88 500", type: "S", strength: "сильный", note: "Минимум мая, ключевая точка для лонга" },
      { price: "$82 000", type: "S", strength: "сильный", note: "Гэп ликвидности + круглый уровень — цель медведей" },
    ],
    news: [
      {
        date: "21 мая 2026, 16:30",
        title: "Spot BTC ETF: чистый приток $420M за день",
        impact: "high",
        result: "BTC рванул с $93 100 до $95 200 за 4 часа. Идеальный тренд для call на 15-минутках.",
        color: "bg-green-500/10 border-green-500/30",
      },
      {
        date: "20 мая 2026, 21:00",
        title: "FOMC Минутки: дискуссия о снижении ставки в июле",
        impact: "high",
        result: "BTC вырос с $93 500 до $95 800. Сильная свеча +2.4%, голубиный сигнал поддержал крипту.",
        color: "bg-green-500/10 border-green-500/30",
      },
      {
        date: "19 мая 2026, утро",
        title: "MicroStrategy докупил 5 000 BTC ($475M)",
        impact: "medium",
        result: "Бычий сигнал. BTC +1.8% за час, объём вырос на 35%. Хороший вход на откате.",
        color: "bg-green-500/10 border-green-500/30",
      },
      {
        date: "17 мая 2026, вечер",
        title: "Hashrate новый ATH — 920 EH/s",
        impact: "medium",
        result: "Структурно бычий драйвер. Тренд H4 устойчиво вверх, откаты выкупаются за часы.",
        color: "bg-green-500/10 border-green-500/30",
      },
    ],
    scenarios: [
      {
        title: "Сценарий №1 — Покупка от Pivot",
        condition: "Касание $94 800 + бычья дивергенция по RSI + рост объёмов",
        action: "Call, экспирация 15 минут. Цель — возврат к $96 000.",
        tone: "bull",
      },
      {
        title: "Сценарий №2 — Пробой к ATH",
        condition: "Закрепление выше $98 500 на дневке + Funding < 0.025%",
        action: "Тренд-следование. Call на откатах к $98 500, экспирация 30 минут – 1 час. Цель $108k.",
        tone: "bull",
      },
      {
        title: "Сценарий №3 — Шорт на ликвидацию",
        condition: "Отбой от $98 500 + перегретый Funding > 0.03% + RSI > 75",
        action: "Put на M15, цель $94 800. Стоп выше $99 500 (для CFD).",
        tone: "bear",
      },
    ],
  },
  {
    key: "audcad-otc",
    symbol: "AUD/CAD OTC",
    emoji: "🇦🇺",
    accent: "text-emerald-400",
    border: "border-emerald-500/40",
    glow: "shadow-emerald-500/20",
    summary:
      "Спокойная кросс-пара Pocket Option. Низкая волатильность и узкий канал делают её идеальной для торговли от уровней и стратегий возврата к среднему. Без сильной реакции на доллар США — фокус на сырьевых данных Австралии и Канады (железная руда, нефть).",
    currentPrice: "0.9215",
    change: "+0.12%",
    changePositive: true,
    bias: "Нейтральный",
    biasColor: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    metrics: [
      { label: "ADX (H1)", value: "21", hint: "Слабый тренд — ближе к флэту" },
      { label: "RSI (M15)", value: "53", hint: "Нейтральная зона" },
      { label: "ATR (M5)", value: "7 pips", hint: "Низкая вола — идеально для скальпа" },
      { label: "Spread", value: "0.0", hint: "OTC без спреда" },
      { label: "Payout", value: "87%", hint: "Чуть ниже EUR/USD" },
      { label: "Активность", value: "24/7", hint: "Включая выходные" },
    ],
    levels: [
      { price: "0.9270", type: "R", strength: "сильный", note: "Верх канала мая, тройной отбой" },
      { price: "0.9245", type: "R", strength: "средний", note: "Локальное сопротивление H1" },
      { price: "0.9230", type: "R", strength: "слабый", note: "Психологический уровень, часто протыкается" },
      { price: "0.9215", type: "Pivot", strength: "сильный", note: "Центр канала + дневной pivot" },
      { price: "0.9200", type: "S", strength: "средний", note: "EMA-50 на H1, отбои на M15" },
      { price: "0.9180", type: "S", strength: "сильный", note: "Минимум недели, ключевая поддержка" },
      { price: "0.9150", type: "S", strength: "сильный", note: "Объёмная зона + цель медведей на пробое" },
    ],
    news: [
      {
        date: "21 мая 2026, 04:30",
        title: "RBA: ставка без изменений (3.85%)",
        impact: "high",
        result: "AUD/CAD OTC: +15 пунктов за час. Алгоритм отыграл новость с задержкой ~45 сек.",
        color: "bg-green-500/10 border-green-500/30",
      },
      {
        date: "20 мая 2026, 15:30",
        title: "Канада CPI: 2.4% (прогноз 2.5%)",
        impact: "high",
        result: "CAD ослаб → AUD/CAD вырос с 0.9180 до 0.9230. Тренд держался ~3 часа.",
        color: "bg-green-500/10 border-green-500/30",
      },
      {
        date: "19 мая 2026, день",
        title: "Нефть Brent −1.8% на новостях ОПЕК+",
        impact: "medium",
        result: "Слабый CAD → AUD/CAD ушёл вверх на +22 пункта. Корреляция с нефтью обратная.",
        color: "bg-green-500/10 border-green-500/30",
      },
      {
        date: "17-18 мая 2026, выходные",
        title: "OTC-режим (Forex закрыт)",
        impact: "medium",
        result: "Чёткий канал 0.9200–0.9245. Идеальные условия для торговли от границ.",
        color: "bg-purple-500/10 border-purple-500/30",
      },
    ],
    scenarios: [
      {
        title: "Сценарий №1 — Лонг от нижней границы",
        condition: "Цена касается 0.9200 + RSI < 35 + бычий пин-бар на M5",
        action: "Call, экспирация 3–5 минут. Цель — возврат к Pivot 0.9215.",
        tone: "bull",
      },
      {
        title: "Сценарий №2 — Шорт от верхней границы",
        condition: "Касание 0.9245 + RSI > 65 + медвежья поглощающая на M5",
        action: "Put, экспирация 3–5 минут. Цель 0.9215. Идеально при ADX < 20 (флэт).",
        tone: "bear",
      },
      {
        title: "Сценарий №3 — Пробой канала",
        condition: "Закрепление выше 0.9270 ИЛИ ниже 0.9180 на двух свечах H1 + рост ADX до 25+",
        action: "По направлению пробоя, экспирация 15 минут. Цель — следующий ключевой уровень.",
        tone: "bull",
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

export async function loadQuotes(force = false): Promise<Record<string, LiveQuote>> {
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