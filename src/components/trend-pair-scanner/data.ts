export interface Pair {
  symbol: string
  type: "Forex" | "OTC" | "Crypto" | "Commodity"
  session: "Asia" | "Europe" | "US" | "24/7"
  adx: number
  atrPips: number
  rsi: number
  emaSlope: "up" | "down" | "flat"
  spreadPo: string
  payoutPo: number
  trendScore: number
  comment: string
}

export type FilterType = "all" | "OTC" | "Forex" | "Crypto"
export type SortType = "trend" | "adx" | "atr"

export const pairs: Pair[] = [
  {
    symbol: "EUR/USD OTC",
    type: "OTC",
    session: "24/7",
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
