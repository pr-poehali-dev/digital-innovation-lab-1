export type POStrategy = "rsi_reversal" | "ema_cross" | "ema_trend" | "martingale" | "candle_pattern" | "support_resistance"
export type POExpiry = "1" | "2" | "3" | "5" | "15" | "30" | "45" | "60"
export type POComboLogic = "AND" | "OR"
export type POEmaTrendMode = "ema9_21" | "ema20_50" | "ema50_200" | "custom"
export type POEmaMode = "cross" | "trend" | "trend_with_cross"

export interface POBotConfig {
  botName: string
  strategy: POStrategy
  // combo
  comboMode: boolean
  comboStrategies: POStrategy[]
  comboLogic: POComboLogic
  asset: string
  expiry: POExpiry
  betAmount: number
  betPercent: boolean
  martingaleEnabled: boolean
  martingaleMultiplier: number
  martingaleSteps: number
  takeProfitRub: number
  stopLossRub: number
  dailyLimit: number
  rsiPeriod: number
  rsiOverbought: number
  rsiOversold: number
  emaFast: number
  emaSlow: number
  emaTrendMode: POEmaTrendMode
  /** Режим EMA: cross — только пересечение | trend — позиция fast vs slow | trend_with_cross — гибрид (вход после кросса, держим по тренду) */
  emaMode: POEmaMode
  trendMode: "same" | "reverse" | "any"
  trendFollow: "follow" | "reverse" | "combo"
  useOTC: boolean
  autoRestart: boolean
  isDemo: boolean
  currency: string
  tgToken: string
  tgChatId: string
  tgEnabled: boolean
  tgProxy: string
  tgNotifyMode: "all" | "bets_only"
  checkInterval: number
  payoutRate: number
  tradeDirection: "all" | "call_only" | "put_only"
  hedgeEnabled: boolean
  hedgePipThreshold: number
  hedgeSimplePipThreshold: number
  hedgePowerMultiplier: number
  hedgeCheckInterval: number
  /** % от ATR(14) — порог "цена ушла далеко" для срабатывания хеджа */
  hedgeAtrPercent: number
  /** Мин. % времени экспирации до хеджа (раньше — рано) */
  hedgeTimeMinPercent: number
  /** Макс. % времени экспирации до хеджа (позже — поздно) */
  hedgeTimeMaxPercent: number
  /** Кол-во подтверждающих тиков подряд (защита от шума) */
  hedgeConfirmTicks: number
  /** Каскадный хедж: новая модель — 3 уровня страховки в цикле основной сделки */
  hedgeCascadeEnabled?: boolean
  /** Размер хеджа-1 как множитель от основной (X). Открывается сразу с основной, противоположное направление, та же экспирация */
  hedgeCascadeM1?: number
  /** Размер хеджа-2 как множитель от основной (X). Открывается после 1/2 экспирации в момент коррекции, противоположное направление */
  hedgeCascadeM2?: number
  /** Размер хеджа-3 как множитель от основной (X). Открывается при первом пересечении страйка ценой, СОВПАДАЕТ с основной */
  hedgeCascadeM3?: number
  /** Откат цены от пика в пипсах для детекции момента коррекции (хедж-2) */
  hedgeCascadePullbackPips?: number
  /** Минимум % экспирации до момента, когда H2 разрешён (по умолчанию 50%) */
  hedgeCascadeMinTimePercent?: number
  /** Минимум удаления цены от страйка в пипсах для триггера H2 (по умолчанию 0 — без ограничения) */
  hedgeCascadeMinPeakPips?: number
  /** Открывать H2 только если основная сделка В ПЛЮСЕ (цена ушла В сторону основной) */
  hedgeCascadeRequireProfit?: boolean
  pipSize: number
  profitExtEnabled: boolean
  profitExtPips: number
  profitExtMode: "trend" | "rebound" | "both"
  profitExtMultiplier: number
  profitExtCheckInterval: number
  srManualLevels: string
  srStep: number
  srWindow: number
  candleTimeframe: 60 | 300 | 900 | 3600
  warmupCandles?: number
  requireStrongTrendOnStart?: boolean
  strongTrendCandles?: number
  resetTrendAfterLoss?: boolean
  pauseAfterLossesEnabled?: boolean
  pauseAfterLossesCount?: number
  pauseAfterLossesMinutes?: number
  safetyMaxBetPercent?: number
  safetyMinReservePercent?: number
  /** Время автоотправки JSONL-отчёта в TG (HH:MM, по локальному времени). Пусто = выключено */
  tgAutoReportTime?: string

  // ═══════════════════════════════════════════════════════════════════
  // ФИЛЬТРЫ TRADE BASE (по методике из учебника)
  // ═══════════════════════════════════════════════════════════════════

  /** MA200-фильтр (Пол Тюдор Джонс): CALL только если цена > MA200, PUT только если < MA200 */
  ma200FilterEnabled?: boolean
  /** Период MA для глобального фильтра (по умолчанию 200) */
  ma200Period?: number

  /** RSI-дивергенция: вход по RSI только если есть бычья/медвежья дивергенция с ценой */
  rsiDivergenceEnabled?: boolean
  /** Окно поиска дивергенции (свечей назад, обычно 5-10) */
  rsiDivergenceLookback?: number

  /** MTF-фильтр (Тройной экран Элдера): подтверждать сигнал старшим таймфреймом */
  mtfFilterEnabled?: boolean
  /** Множитель старшего ТФ относительно текущего (3 = торгуем 5m, фильтр 15m) */
  mtfMultiplier?: number

  /** Подтверждение свечных паттернов: ждать следующую свечу в направлении паттерна */
  candleConfirmEnabled?: boolean

  /** Сила уровней S/R: фильтровать только сильные (≥ N касаний) */
  srStrengthEnabled?: boolean
  /** Минимальное число касаний для "сильного" уровня */
  srMinTouches?: number

  /** Объём-прокси через range свечи (high-low): отбрасывать слабые свечи */
  volumeProxyEnabled?: boolean
  /** Минимальный множитель range относительно среднего (1.0 = равно среднему, 0.5 = вполовину) */
  volumeProxyMinRatio?: number
}

export interface StrategyMeta {
  label: string
  description: string
  color: string
  risk: string
  icon: string
  winrateEst: string
  signalsPerDay: string
  bestExpiry: string
  bestAssets: string
  pros: string[]
  cons: string[]
  combosWith: POStrategy[]
}

export const PO_STRATEGIES: Record<POStrategy, StrategyMeta> = {
  rsi_reversal: {
    label: "RSI Разворот",
    description: "Покупаем CALL при перепроданности, PUT при перекупленности",
    color: "bg-blue-500/20 border-blue-500/40 text-blue-400",
    risk: "Средний",
    icon: "📊",
    winrateEst: "52–60%",
    signalsPerDay: "10–25",
    bestExpiry: "1–5 мин",
    bestAssets: "EUR/USD OTC, GBP/USD OTC",
    pros: [
      "Универсален для любого рынка",
      "Работает на флете и слабом тренде",
      "Легко настраивается под стиль торговли",
    ],
    cons: [
      "Даёт ложные сигналы при сильном тренде",
      "Нужна правильная калибровка уровней",
    ],
    combosWith: ["ema_cross", "candle_pattern", "support_resistance"],
  },
  ema_cross: {
    label: "EMA (3 режима)",
    description: "Cross — по пересечению | Trend — по позиции EMA | Trend+Cross — снайперский гибрид",
    color: "bg-green-500/20 border-green-500/40 text-green-400",
    risk: "Низкий",
    icon: "📈",
    winrateEst: "55–65%",
    signalsPerDay: "5–15",
    bestExpiry: "3–5 мин",
    bestAssets: "USD/JPY OTC, EUR/USD OTC",
    pros: [
      "Лучшая стратегия для новичков",
      "Чёткие и понятные сигналы",
      "Хорошо работает при трендовом рынке",
    ],
    cons: [
      "Запаздывает при резких разворотах",
      "Мало сигналов в боковике",
    ],
    combosWith: ["rsi_reversal", "candle_pattern"],
  },
  martingale: {
    label: "Мартингейл",
    description: "Удвоение ставки после проигрыша до достижения профита",
    color: "bg-red-500/20 border-red-500/40 text-red-400",
    risk: "Высокий",
    icon: "🎰",
    winrateEst: "40–55%",
    signalsPerDay: "20–50",
    bestExpiry: "1–2 мин",
    bestAssets: "Любые OTC-пары",
    pros: [
      "Компенсирует убытки при первом выигрыше",
      "Не требует анализа рынка",
      "Прост в реализации",
    ],
    cons: [
      "Серия из 6–7 потерь уничтожает депозит",
      "Требует большого буфера капитала",
      "Не рекомендован новичкам",
    ],
    combosWith: ["rsi_reversal", "ema_cross"],
  },
  candle_pattern: {
    label: "Паттерны свечей",
    description: "Молот, поглощение, доджи — разворотные паттерны японских свечей",
    color: "bg-yellow-500/20 border-yellow-500/40 text-yellow-400",
    risk: "Средний",
    icon: "🕯️",
    winrateEst: "55–68%",
    signalsPerDay: "3–10",
    bestExpiry: "5–15 мин",
    bestAssets: "EUR/USD, GBP/USD, Gold OTC",
    pros: [
      "Высокая точность при правильном паттерне",
      "Хорошо работает на разворотах тренда",
      "Легко комбинируется с другими стратегиями",
    ],
    cons: [
      "Мало сигналов — нужно терпение",
      "Требует чистого ценового движения",
    ],
    combosWith: ["rsi_reversal", "support_resistance", "ema_cross"],
  },
  support_resistance: {
    label: "Поддержка / Сопротивление",
    description: "Вход от уровней поддержки и сопротивления с подтверждением",
    color: "bg-purple-500/20 border-purple-500/40 text-purple-400",
    risk: "Средний",
    icon: "🧱",
    winrateEst: "58–70%",
    signalsPerDay: "2–8",
    bestExpiry: "5–15 мин",
    bestAssets: "EUR/USD OTC, USD/JPY OTC, Gold OTC",
    pros: [
      "Самый высокий потенциальный winrate",
      "Работает на любом таймфрейме",
      "Уровни видны без индикаторов",
    ],
    cons: [
      "Очень мало сигналов — нужно ждать",
      "Требует минимум 30 свечей для расчёта",
    ],
    combosWith: ["candle_pattern", "rsi_reversal"],
  },
  ema_trend: {
    label: "EMA Тренд",
    description: "CALL пока быстрая EMA выше медленной, PUT пока ниже — без ожидания пересечения",
    color: "bg-emerald-500/20 border-emerald-500/40 text-emerald-400",
    risk: "Низкий",
    icon: "📉",
    winrateEst: "54–63%",
    signalsPerDay: "15–40",
    bestExpiry: "1–5 мин",
    bestAssets: "EUR/USD OTC, USD/JPY OTC, BTC/USD",
    pros: [
      "Даёт сигналы постоянно пока идёт тренд",
      "Не пропускает движение после пересечения",
      "Идеален для трендовых активов",
    ],
    cons: [
      "Много сигналов в боковике — нужен фильтр тренда",
      "Не определяет точку входа — только направление",
    ],
    combosWith: ["rsi_reversal", "candle_pattern"],
  },
}

export const PO_ASSETS = [
  // Forex — основные (реальный рынок)
  "EUR/USD", "GBP/USD", "USD/JPY", "USD/CHF", "USD/CAD", "AUD/USD", "NZD/USD",
  // Forex OTC — основные
  "EUR/USD (OTC)", "GBP/USD (OTC)", "USD/JPY (OTC)", "AUD/USD (OTC)", "USD/CAD (OTC)", "USD/CHF (OTC)", "NZD/USD (OTC)",
  // Forex OTC — кросс-пары (AUD/CAD только в OTC — нет на реальном рынке PO)
  "EUR/GBP (OTC)", "EUR/JPY (OTC)", "EUR/CHF (OTC)", "EUR/NZD (OTC)",
  "GBP/JPY (OTC)", "GBP/CHF (OTC)", "GBP/AUD (OTC)", "GBP/CAD (OTC)", "GBP/NZD (OTC)",
  "AUD/JPY (OTC)", "AUD/CAD (OTC)", "AUD/CHF (OTC)", "AUD/NZD (OTC)",
  "CAD/CHF (OTC)", "CAD/JPY (OTC)", "CHF/JPY (OTC)",
  "NZD/CAD (OTC)", "NZD/CHF (OTC)", "NZD/JPY (OTC)",
  // Криптовалюты
  "BTC/USD", "ETH/USD", "DASH/USD", "DOT/USD", "LINK/USD",
  "BTC/GBP", "BTC/JPY", "BCH/EUR", "BCH/GBP", "BCH/JPY",
  // Криптовалюты OTC
  "BTC/USD (OTC)", "ETH/USD (OTC)", "LTC/USD (OTC)", "DOT/USD (OTC)", "LINK/USD (OTC)",
  // Товары (реальный рынок)
  "Gold", "Silver", "Brent Oil", "WTI Oil", "Natural Gas", "Platinum", "Palladium",
  // Товары OTC
  "Gold (OTC)", "Silver (OTC)", "Brent Oil (OTC)", "WTI Oil (OTC)", "Natural Gas (OTC)", "Platinum (OTC)", "Palladium (OTC)",
  // Акции OTC
  "Apple (OTC)", "Tesla (OTC)", "Nvidia (OTC)", "Amazon (OTC)", "Microsoft (OTC)",
  "Google (OTC)", "Meta (OTC)", "Netflix (OTC)", "VISA (OTC)", "GameStop (OTC)",
  "ExxonMobil (OTC)", "McDonald's (OTC)", "Intel (OTC)", "Boeing (OTC)",
  // Индексы (реальный рынок)
  "S&P 500", "NASDAQ", "Dow Jones", "Nikkei 225", "DAX", "EURO STOXX 50",
  "CAC 40", "IBEX 35", "FTSE 100", "AUS 200", "CAC 40", "AEX 25", "SMI 20", "Hang Seng",
  // Индексы OTC
  "S&P 500 (OTC)", "NASDAQ (OTC)", "Dow Jones (OTC)", "AUS 200 (OTC)",
  "FTSE 100 (OTC)", "DAX (OTC)", "CAC 40 (OTC)", "Nikkei 225 (OTC)",
  "EURO STOXX 50 (OTC)", "IBEX 35 (OTC)",
]

export const PO_ASSETS_GROUPS = [
  {
    label: "💱 Forex — основные",
    assets: ["EUR/USD", "GBP/USD", "USD/JPY", "USD/CHF", "USD/CAD", "AUD/USD", "NZD/USD"],
  },
  {
    label: "💱 Forex OTC — основные",
    assets: ["EUR/USD (OTC)", "GBP/USD (OTC)", "USD/JPY (OTC)", "AUD/USD (OTC)", "USD/CAD (OTC)", "USD/CHF (OTC)", "NZD/USD (OTC)"],
  },
  {
    label: "💱 Forex OTC — кросс-пары",
    assets: [
      "EUR/GBP (OTC)", "EUR/JPY (OTC)", "EUR/CHF (OTC)", "EUR/NZD (OTC)",
      "GBP/JPY (OTC)", "GBP/CHF (OTC)", "GBP/AUD (OTC)", "GBP/CAD (OTC)", "GBP/NZD (OTC)",
      "AUD/JPY (OTC)", "AUD/CAD (OTC)", "AUD/CHF (OTC)", "AUD/NZD (OTC)",
      "CAD/CHF (OTC)", "CAD/JPY (OTC)", "CHF/JPY (OTC)",
      "NZD/CAD (OTC)", "NZD/CHF (OTC)", "NZD/JPY (OTC)",
    ],
  },
  {
    label: "₿ Крипто",
    assets: ["BTC/USD", "ETH/USD", "DASH/USD", "DOT/USD", "LINK/USD", "BTC/GBP", "BTC/JPY", "BCH/EUR", "BCH/GBP", "BCH/JPY"],
  },
  {
    label: "₿ Крипто OTC",
    assets: ["BTC/USD (OTC)", "ETH/USD (OTC)", "LTC/USD (OTC)", "DOT/USD (OTC)", "LINK/USD (OTC)"],
  },
  {
    label: "🏅 Товары",
    assets: ["Gold", "Silver", "Brent Oil", "WTI Oil", "Natural Gas", "Platinum", "Palladium"],
  },
  {
    label: "🏅 Товары OTC",
    assets: ["Gold (OTC)", "Silver (OTC)", "Brent Oil (OTC)", "WTI Oil (OTC)", "Natural Gas (OTC)", "Platinum (OTC)", "Palladium (OTC)"],
  },
  {
    label: "📈 Акции OTC",
    assets: [
      "Apple (OTC)", "Tesla (OTC)", "Nvidia (OTC)", "Amazon (OTC)", "Microsoft (OTC)",
      "Google (OTC)", "Meta (OTC)", "Netflix (OTC)", "VISA (OTC)", "GameStop (OTC)",
      "ExxonMobil (OTC)", "McDonald's (OTC)", "Intel (OTC)", "Boeing (OTC)",
    ],
  },
  {
    label: "📊 Индексы",
    assets: ["S&P 500", "NASDAQ", "Dow Jones", "Nikkei 225", "DAX", "EURO STOXX 50", "IBEX 35", "FTSE 100", "AUS 200", "AEX 25", "SMI 20", "Hang Seng"],
  },
  {
    label: "📊 Индексы OTC",
    assets: ["S&P 500 (OTC)", "NASDAQ (OTC)", "Dow Jones (OTC)", "AUS 200 (OTC)", "FTSE 100 (OTC)", "DAX (OTC)", "CAC 40 (OTC)", "Nikkei 225 (OTC)", "EURO STOXX 50 (OTC)", "IBEX 35 (OTC)"],
  },
]

export const PO_EXPIRY_LABELS: Record<POExpiry, string> = {
  "1": "1 минута",
  "2": "2 минуты",
  "3": "3 минуты",
  "5": "5 минут",
  "15": "15 минут",
  "30": "30 минут",
  "45": "45 минут",
  "60": "1 час",
}

export const PO_DEFAULT_CONFIG: POBotConfig = {
  botName: "КЛЕЩ",
  strategy: "rsi_reversal",
  comboMode: true,
  comboStrategies: ["rsi_reversal", "ema_cross", "support_resistance"],
  comboLogic: "OR",
  asset: "EUR/USD (OTC)",
  expiry: "5",
  betAmount: 80,
  betPercent: false,
  martingaleEnabled: true,
  martingaleMultiplier: 2.5,
  martingaleSteps: 4,
  takeProfitRub: 30000,
  stopLossRub: 15000,
  dailyLimit: 20,
  rsiPeriod: 14,
  rsiOverbought: 70,
  rsiOversold: 30,
  emaFast: 9,
  emaSlow: 21,
  emaTrendMode: "ema9_21",
  emaMode: "cross",
  trendMode: "any",
  trendFollow: "follow",
  useOTC: true,
  autoRestart: false,
  isDemo: true,
  currency: "RUB",
  tgToken: "8631657463:AAGvuSF2Anw7OBgRg_LJsX6YqW9OwEmbKz4",
  tgChatId: "7533507918",
  tgEnabled: true,
  tgNotifyMode: "all",
  tgProxy: "",
  checkInterval: 10,
  payoutRate: 92,
  tradeDirection: "all",
  hedgeEnabled: true,
  hedgePipThreshold: 8,
  hedgeSimplePipThreshold: 1,
  hedgePowerMultiplier: 2.0,
  hedgeCheckInterval: 2,
  hedgeAtrPercent: 70,
  hedgeTimeMinPercent: 30,
  hedgeTimeMaxPercent: 70,
  hedgeConfirmTicks: 2,
  hedgeCascadeEnabled: false,
  hedgeCascadeM1: 1.0,
  hedgeCascadeM2: 1.5,
  hedgeCascadeM3: 2.0,
  hedgeCascadePullbackPips: 3,
  pipSize: 0.0001,
  profitExtEnabled: true,
  profitExtPips: 5,
  profitExtMode: "trend",
  profitExtMultiplier: 1.0,
  profitExtCheckInterval: 5,
  srManualLevels: "",
  srStep: 0,
  srWindow: 10,
  candleTimeframe: 60,
  warmupCandles: 2,
  requireStrongTrendOnStart: true,
  strongTrendCandles: 2,
  resetTrendAfterLoss: true,
  pauseAfterLossesEnabled: true,
  pauseAfterLossesCount: 3,
  pauseAfterLossesMinutes: 10,
  safetyMaxBetPercent: 20,
  safetyMinReservePercent: 30,
  tgAutoReportTime: "09:00",
  // === Фильтры Trade Base (выключены по умолчанию для обратной совместимости) ===
  ma200FilterEnabled: false,
  ma200Period: 200, // 200 = "авто" — подбирается под таймфрейм (50/100/150/200)
  rsiDivergenceEnabled: false,
  rsiDivergenceLookback: 8,
  mtfFilterEnabled: false,
  mtfMultiplier: 3,
  candleConfirmEnabled: false,
  srStrengthEnabled: false,
  srMinTouches: 3,
  volumeProxyEnabled: false,
  volumeProxyMinRatio: 0.7,
}

// Helper to avoid TS template literal conflicts with Python f-strings
const S = "$"

// ═══════════════════════════════════════════════════════════════════
// TRADE BASE FILTERS — фильтры по методике учебника Trade Base
// ═══════════════════════════════════════════════════════════════════
// Возвращает Python-блок с функциями 6-ти фильтров. Если ни один
// фильтр не включён — возвращает пустую строку (бот работает как раньше).
// ═══════════════════════════════════════════════════════════════════
export function buildTradeBaseFiltersBlock(cfg: POBotConfig): string {
  const anyEnabled =
    cfg.ma200FilterEnabled ||
    cfg.rsiDivergenceEnabled ||
    cfg.mtfFilterEnabled ||
    cfg.candleConfirmEnabled ||
    cfg.srStrengthEnabled ||
    cfg.volumeProxyEnabled
  if (!anyEnabled) return ""

  // 🛸 Авто-подбор периода MA в зависимости от таймфрейма свечей.
  // На быстрых ТФ ждать 200 свечей слишком долго, поэтому уменьшаем период.
  // Логика: чем меньше ТФ — тем меньше период (но не меньше 50, иначе MA теряет смысл).
  const tfSec = cfg.candleTimeframe ?? 60
  let autoMaPeriod = 200
  if (tfSec <= 60) autoMaPeriod = 50           // 1m → 50 свечей (~50 мин)
  else if (tfSec <= 180) autoMaPeriod = 100    // 3m → 100 свечей (~5 ч)
  else if (tfSec <= 300) autoMaPeriod = 150    // 5m → 150 свечей (~12.5 ч)
  else autoMaPeriod = 200                      // 15m+ → классические 200
  // Если пользователь явно задал период — уважаем его выбор
  const finalMaPeriod = cfg.ma200Period && cfg.ma200Period !== 200 ? cfg.ma200Period : autoMaPeriod

  // 🛸 Авто-подбор окна поиска RSI-дивергенции под ТФ.
  // На быстрых ТФ дивергенция ловится на коротких окнах (5-6 свечей),
  // на медленных — нужно больше истории (10-14 свечей).
  let autoRsiLookback = 8
  if (tfSec <= 60) autoRsiLookback = 6        // 1m → 6 свечей (~6 мин)
  else if (tfSec <= 180) autoRsiLookback = 8  // 3m → 8 свечей (~24 мин)
  else if (tfSec <= 300) autoRsiLookback = 10 // 5m → 10 свечей (~50 мин)
  else autoRsiLookback = 14                   // 15m+ → 14 свечей (классика Уайлдера)
  // 8 = "авто" — подбирается. Любое другое значение = ручная установка
  const finalRsiLookback = cfg.rsiDivergenceLookback && cfg.rsiDivergenceLookback !== 8
    ? cfg.rsiDivergenceLookback
    : autoRsiLookback

  return `
# ═══════════════════════════════════════════════════════════════════
# TRADE BASE FILTERS — фильтры по методике учебника
# Авто-подбор: ТФ ${tfSec}с → MA${finalMaPeriod}, RSI-див окно ${finalRsiLookback}
# ═══════════════════════════════════════════════════════════════════
TB_MA200_ENABLED       = ${cfg.ma200FilterEnabled ? "True" : "False"}
TB_MA200_PERIOD        = ${finalMaPeriod}
TB_RSI_DIV_ENABLED     = ${cfg.rsiDivergenceEnabled ? "True" : "False"}
TB_RSI_DIV_LOOKBACK    = ${finalRsiLookback}
TB_MTF_ENABLED         = ${cfg.mtfFilterEnabled ? "True" : "False"}
TB_MTF_MULTIPLIER      = ${cfg.mtfMultiplier ?? 3}
TB_CANDLE_CONFIRM      = ${cfg.candleConfirmEnabled ? "True" : "False"}
TB_SR_STRENGTH_ENABLED = ${cfg.srStrengthEnabled ? "True" : "False"}
TB_SR_MIN_TOUCHES      = ${cfg.srMinTouches ?? 3}
TB_VOLUME_PROXY        = ${cfg.volumeProxyEnabled ? "True" : "False"}
TB_VOL_MIN_RATIO       = ${cfg.volumeProxyMinRatio ?? 0.7}

# Хранилище данных старшего ТФ (для MTF-фильтра) — обновляется фоном
_tb_higher_tf_candles = []
_tb_higher_tf_last_update = 0

def _tb_calc_sma(prices, period):
    """Простая скользящая средняя для MA200-фильтра."""
    if len(prices) < period:
        return None
    return sum(prices[-period:]) / period

def _tb_calc_ema(prices, period):
    if len(prices) < period:
        return None
    k = 2 / (period + 1)
    ema = prices[0]
    for p in prices[1:]:
        ema = p * k + ema * (1 - k)
    return ema

def tb_filter_ma200(signal, prices):
    """Фильтр Пола Тюдора Джонса: CALL только если цена > MA200, PUT только если <.
    Returns (allow: bool, reason: str)."""
    if not TB_MA200_ENABLED:
        return True, ""
    ma = _tb_calc_sma(prices, TB_MA200_PERIOD)
    if ma is None:
        return True, f"MA{TB_MA200_PERIOD}=недостаточно данных, фильтр пропущен"
    cur = prices[-1]
    if signal == "CALL" and cur < ma:
        return False, f"❌ MA{TB_MA200_PERIOD}={ma:.5f} > цена={cur:.5f} — CALL запрещён (медвежий рынок)"
    if signal == "PUT" and cur > ma:
        return False, f"❌ MA{TB_MA200_PERIOD}={ma:.5f} < цена={cur:.5f} — PUT запрещён (бычий рынок)"
    return True, f"✅ MA{TB_MA200_PERIOD}={ma:.5f} согласуется"

def _tb_calc_rsi_series(prices, period=14):
    """Возвращает список значений RSI для построения дивергенций."""
    if len(prices) < period + 1:
        return []
    rsi_values = []
    for end in range(period, len(prices)):
        window = prices[end - period:end + 1]
        deltas = [window[i] - window[i-1] for i in range(1, len(window))]
        gains = [d if d > 0 else 0 for d in deltas]
        losses = [-d if d < 0 else 0 for d in deltas]
        ag = sum(gains) / period
        al = sum(losses) / period
        if al == 0:
            rsi_values.append(100)
        else:
            rs = ag / al
            rsi_values.append(100 - (100 / (1 + rs)))
    return rsi_values

def tb_filter_rsi_divergence(signal, prices):
    """Фильтр RSI-дивергенции (главный сигнал RSI по Trade Base).
    Бычья (для CALL): цена ↓ новый минимум, RSI ↑ выше предыдущего минимума.
    Медвежья (для PUT): цена ↑ новый максимум, RSI ↓ ниже предыдущего максимума."""
    if not TB_RSI_DIV_ENABLED:
        return True, ""
    lookback = TB_RSI_DIV_LOOKBACK
    if len(prices) < lookback + 15:
        return True, "RSI-див: мало данных"
    rsi_series = _tb_calc_rsi_series(prices, 14)
    if len(rsi_series) < lookback + 2:
        return True, "RSI-див: мало RSI"
    # Берём последние lookback свечей
    p_window = prices[-lookback:]
    r_window = rsi_series[-lookback:]
    if signal == "CALL":
        # Бычья: цена сделала более низкий минимум, RSI — более высокий
        idx_min_p = p_window.index(min(p_window))
        idx_min_r = r_window.index(min(r_window))
        # Сравним последний минимум цены с минимумом первой половины окна
        half = lookback // 2
        first_low_p = min(p_window[:half]) if half > 0 else p_window[0]
        last_low_p  = min(p_window[half:])
        first_low_r = min(r_window[:half]) if half > 0 else r_window[0]
        last_low_r  = min(r_window[half:])
        bullish_div = last_low_p < first_low_p and last_low_r > first_low_r
        if bullish_div:
            return True, f"✅ Бычья дивергенция RSI: цена↓ {first_low_p:.5f}→{last_low_p:.5f}, RSI↑ {first_low_r:.1f}→{last_low_r:.1f}"
        return False, f"❌ Нет бычьей дивергенции RSI (CALL отменён)"
    if signal == "PUT":
        half = lookback // 2
        first_high_p = max(p_window[:half]) if half > 0 else p_window[0]
        last_high_p  = max(p_window[half:])
        first_high_r = max(r_window[:half]) if half > 0 else r_window[0]
        last_high_r  = max(r_window[half:])
        bearish_div = last_high_p > first_high_p and last_high_r < first_high_r
        if bearish_div:
            return True, f"✅ Медвежья дивергенция RSI: цена↑ {first_high_p:.5f}→{last_high_p:.5f}, RSI↓ {first_high_r:.1f}→{last_high_r:.1f}"
        return False, f"❌ Нет медвежьей дивергенции RSI (PUT отменён)"
    return True, ""

async def tb_update_higher_tf(client, asset_name):
    """Запросить свечи старшего ТФ для MTF-фильтра. Кэшируем на 60 сек."""
    global _tb_higher_tf_candles, _tb_higher_tf_last_update
    if not TB_MTF_ENABLED:
        return
    import time as _t
    now = _t.time()
    if now - _tb_higher_tf_last_update < 60:
        return  # кэш ещё свежий
    higher_tf = EXPIRY_SEC * TB_MTF_MULTIPLIER
    try:
        raw = await client.get_candles(asset=asset_name, timeframe=higher_tf, count=50)
        if raw:
            _tb_higher_tf_candles = [(c.open, c.high, c.low, c.close) for c in raw]
            _tb_higher_tf_last_update = now
            print(f"[TB-MTF] Старший ТФ ({higher_tf}с) обновлён: {len(_tb_higher_tf_candles)} свечей")
    except Exception as _me:
        print(f"[TB-MTF] Ошибка запроса старшего ТФ: {_me}")

def tb_filter_mtf(signal):
    """MTF-фильтр Элдера: сигнал должен совпадать с трендом старшего ТФ."""
    if not TB_MTF_ENABLED:
        return True, ""
    if len(_tb_higher_tf_candles) < 21:
        return True, "MTF: данные старшего ТФ ещё не загружены"
    closes = [c[3] for c in _tb_higher_tf_candles]
    ema9_h  = _tb_calc_ema(closes, 9)
    ema21_h = _tb_calc_ema(closes, 21)
    if ema9_h is None or ema21_h is None:
        return True, "MTF: мало EMA-данных"
    higher_trend = "UP" if ema9_h > ema21_h else "DOWN"
    if signal == "CALL" and higher_trend == "DOWN":
        return False, f"❌ MTF: старший ТФ DOWN — CALL против тренда отменён"
    if signal == "PUT" and higher_trend == "UP":
        return False, f"❌ MTF: старший ТФ UP — PUT против тренда отменён"
    return True, f"✅ MTF старший ТФ: {higher_trend}"

def tb_filter_candle_confirm(signal, candles):
    """Подтверждение свечного паттерна: последняя закрытая свеча должна
    идти в направлении сигнала (для CALL — зелёная, для PUT — красная)."""
    if not TB_CANDLE_CONFIRM:
        return True, ""
    if not candles or len(candles) < 2:
        return True, "Confirm: мало свечей"
    last = candles[-2] if len(candles) >= 2 else candles[-1]  # последняя закрытая
    o, c = last[0], last[3]
    is_green = c > o
    if signal == "CALL" and not is_green:
        return False, f"❌ Подтверждения нет: последняя свеча 🔴 (нужна 🟢 для CALL)"
    if signal == "PUT" and is_green:
        return False, f"❌ Подтверждения нет: последняя свеча 🟢 (нужна 🔴 для PUT)"
    color = "🟢" if is_green else "🔴"
    return True, f"✅ Свеча подтверждает: {color}"

def tb_filter_sr_strength(prices):
    """Сила уровней S/R: считаем сколько раз цена касалась локальных min/max.
    Возвращаем (allow, reason). Используется как информационный фильтр —
    если цена близка к слабому уровню, отбрасываем сигнал."""
    if not TB_SR_STRENGTH_ENABLED:
        return True, ""
    if len(prices) < 50:
        return True, "S/R-strength: мало истории"
    cur = prices[-1]
    threshold = cur * 0.0015  # 0.15% — зона касания
    # Найдём все локальные минимумы/максимумы за последние 100 свечей
    window = prices[-100:] if len(prices) >= 100 else prices
    levels = []
    for i in range(3, len(window) - 3):
        # локальный минимум
        if window[i] == min(window[i-3:i+4]):
            levels.append(window[i])
        # локальный максимум
        if window[i] == max(window[i-3:i+4]):
            levels.append(window[i])
    # Группируем близкие уровни (если разница < threshold — это один уровень)
    grouped = []
    for lvl in sorted(levels):
        placed = False
        for g in grouped:
            if abs(g["price"] - lvl) < threshold:
                g["touches"] += 1
                placed = True
                break
        if not placed:
            grouped.append({"price": lvl, "touches": 1})
    # Цена сейчас рядом с каким-то уровнем?
    near = None
    for g in grouped:
        if abs(g["price"] - cur) < threshold:
            near = g; break
    if near is None:
        return True, "S/R-strength: цена не у уровня"
    if near["touches"] < TB_SR_MIN_TOUCHES:
        return False, f"❌ Уровень {near['price']:.5f} слабый ({near['touches']} касаний < {TB_SR_MIN_TOUCHES})"
    return True, f"✅ Сильный уровень {near['price']:.5f} ({near['touches']} касаний)"

def tb_filter_volume_proxy(candles):
    """Объём-прокси через range свечи (high-low). Если последняя свеча
    'слабая' (range < min_ratio * среднее за 20 свечей), отбрасываем."""
    if not TB_VOLUME_PROXY:
        return True, ""
    if not candles or len(candles) < 21:
        return True, "Vol-proxy: мало свечей"
    ranges = [c[1] - c[2] for c in candles[-21:-1]]  # последние 20 закрытых
    avg_range = sum(ranges) / len(ranges) if ranges else 0
    if avg_range == 0:
        return True, "Vol-proxy: avg=0"
    last_closed = candles[-2] if len(candles) >= 2 else candles[-1]
    last_range = last_closed[1] - last_closed[2]
    ratio = last_range / avg_range
    if ratio < TB_VOL_MIN_RATIO:
        return False, f"❌ Слабая свеча: range={last_range:.5f} ({ratio:.2f}x от среднего, нужно ≥{TB_VOL_MIN_RATIO})"
    return True, f"✅ Range {ratio:.2f}x от среднего"

def apply_tradebase_filters(signal, prices, candles):
    """Применяет ВСЕ включённые фильтры Trade Base.
    Возвращает (final_signal, info_lines).
    Если хоть один фильтр запрещает — final_signal = None."""
    info_lines = []
    if not signal:
        return None, info_lines
    checks = [
        tb_filter_ma200(signal, prices),
        tb_filter_rsi_divergence(signal, prices),
        tb_filter_mtf(signal),
        tb_filter_candle_confirm(signal, candles),
        tb_filter_sr_strength(prices),
        tb_filter_volume_proxy(candles),
    ]
    for allow, reason in checks:
        if reason:
            info_lines.append(reason)
        if not allow:
            return None, info_lines
    return signal, info_lines
# ═══════════════════════════════════════════════════════════════════
`
}

export function generatePOCode(cfg: POBotConfig): string {
  const strategyLabel = PO_STRATEGIES[cfg.strategy].label

  const strategyFunctions: Record<POStrategy, string> = {
    rsi_reversal: `
def calculate_rsi(prices, period=${cfg.rsiPeriod}):
    """RSI индикатор"""
    deltas = [prices[i] - prices[i-1] for i in range(1, len(prices))]
    gains = [d if d > 0 else 0 for d in deltas]
    losses = [-d if d < 0 else 0 for d in deltas]
    avg_gain = sum(gains[-period:]) / period
    avg_loss = sum(losses[-period:]) / period
    if avg_loss == 0:
        return 100
    rs = avg_gain / avg_loss
    return 100 - (100 / (1 + rs))

def get_signal(prices, candles=None):
    """Сигнал по RSI${cfg.trendFollow === "follow" ? " — по тренду (перепроданность=CALL, перекупленность=PUT)" : cfg.trendFollow === "reverse" ? " — против тренда (перепроданность=PUT, перекупленность=CALL)" : " — комбо (без фильтрации)"}"""
    prices = prices[:-1]
    if len(prices) < ${cfg.rsiPeriod} + 1:
        return None, ""
    rsi = calculate_rsi(prices)
    oversold  = rsi <= ${cfg.rsiOversold}
    overbought = rsi >= ${cfg.rsiOverbought}
    info = f"RSI(${cfg.rsiPeriod}): {rsi:.1f}"
    print(f"[СИГНАЛ] RSI({cfg.rsiPeriod}) = {rsi:.2f} | перепроданность ≤{cfg.rsiOversold}: {'✅' if oversold else '❌'} | перекупленность ≥{cfg.rsiOverbought}: {'✅' if overbought else '❌'}")
    if oversold:
        sig = ("CALL" if ${cfg.trendFollow !== "reverse" ? "True" : "False"} else "PUT")
        print(f"[СИГНАЛ] → {sig} (RSI {rsi:.1f} ≤ ${cfg.rsiOversold}, перепроданность)")
        return sig, f"{info} ≤ ${cfg.rsiOversold} (перепроданность)"
    if overbought:
        sig = ("PUT" if ${cfg.trendFollow !== "reverse" ? "True" : "False"} else "CALL")
        print(f"[СИГНАЛ] → {sig} (RSI {rsi:.1f} ≥ ${cfg.rsiOverbought}, перекупленность)")
        return sig, f"{info} ≥ ${cfg.rsiOverbought} (перекупленность)"
    print(f"[СИГНАЛ] → нет сигнала (RSI {rsi:.1f} в нейтральной зоне {cfg.rsiOversold}–{cfg.rsiOverbought})")
    return None, info`,

    ema_cross: `
def calculate_ema(prices, period):
    """EMA индикатор"""
    k = 2 / (period + 1)
    ema = [prices[0]]
    for price in prices[1:]:
        ema.append(price * k + ema[-1] * (1 - k))
    return ema

# EMA_MODE: "cross" (только пересечение) | "trend" (по позиции) | "trend_with_cross" (гибрид: тренд + свежий кросс)
EMA_MODE = "${cfg.emaMode ?? "cross"}"
EMA_CROSS_LOOKBACK = 5  # сколько последних свечей считать "свежим кроссом" для гибрида

def get_signal(prices, candles=None):
    """EMA-сигнал | режим: ${cfg.emaMode ?? "cross"} | EMA${cfg.emaFast}/${cfg.emaSlow}${cfg.trendFollow === "follow" ? " (по тренду)" : cfg.trendFollow === "reverse" ? " (против)" : " (комбо)"}"""
    prices = prices[:-1]
    if len(prices) < ${cfg.emaSlow} + 2:
        return None, ""
    ema_fast = calculate_ema(prices, ${cfg.emaFast})
    ema_slow = calculate_ema(prices, ${cfg.emaSlow})
    above = ema_fast[-1] > ema_slow[-1]
    cross_up   = above and ema_fast[-2] <= ema_slow[-2]
    cross_down = (not above) and ema_fast[-2] >= ema_slow[-2]
    info = f"EMA${cfg.emaFast}={ema_fast[-1]:.5f}/EMA${cfg.emaSlow}={ema_slow[-1]:.5f}"
    diff = ema_fast[-1] - ema_slow[-1]
    print(f"[СИГНАЛ-EMA] режим={EMA_MODE} | {info} | Δ={diff:+.5f} | ↑кросс:{'✅' if cross_up else '❌'} ↓кросс:{'✅' if cross_down else '❌'} | позиция:{'выше' if above else 'ниже'}")
    # ── РЕЖИМ 1: CROSS — сигнал только в момент пересечения ──
    if EMA_MODE == "cross":
        if cross_up:
            sig = "${cfg.trendFollow !== "reverse" ? "CALL" : "PUT"}"
            return sig, f"{info} (пересечение вверх ↑)"
        if cross_down:
            sig = "${cfg.trendFollow !== "reverse" ? "PUT" : "CALL"}"
            return sig, f"{info} (пересечение вниз ↓)"
        return None, info
    # ── РЕЖИМ 2: TREND — сигнал постоянно по позиции EMA ──
    if EMA_MODE == "trend":
        if above:
            return "${cfg.trendFollow !== "reverse" ? "CALL" : "PUT"}", f"{info} (EMA${cfg.emaFast} > EMA${cfg.emaSlow} ↑)"
        else:
            return "${cfg.trendFollow !== "reverse" ? "PUT" : "CALL"}", f"{info} (EMA${cfg.emaFast} < EMA${cfg.emaSlow} ↓)"
    # ── РЕЖИМ 3: TREND_WITH_CROSS — гибрид: торгуем по тренду, но только если в последние N свечей был свежий кросс ──
    if EMA_MODE == "trend_with_cross":
        # ищем свежий кросс в направлении текущего тренда
        recent_cross = False
        lookback = min(EMA_CROSS_LOOKBACK, len(ema_fast) - 1)
        for i in range(1, lookback + 1):
            if above and ema_fast[-i-1] <= ema_slow[-i-1] and ema_fast[-i] > ema_slow[-i]:
                recent_cross = True; break
            if (not above) and ema_fast[-i-1] >= ema_slow[-i-1] and ema_fast[-i] < ema_slow[-i]:
                recent_cross = True; break
        if not recent_cross:
            return None, f"{info} (нет свежего кросса за последние {lookback} свечей)"
        if above:
            return "${cfg.trendFollow !== "reverse" ? "CALL" : "PUT"}", f"{info} (тренд↑ + свежий кросс)"
        else:
            return "${cfg.trendFollow !== "reverse" ? "PUT" : "CALL"}", f"{info} (тренд↓ + свежий кросс)"
    return None, info`,

    ema_trend: `
def calculate_ema(prices, period):
    """EMA индикатор"""
    k = 2 / (period + 1)
    ema = [prices[0]]
    for price in prices[1:]:
        ema.append(price * k + ema[-1] * (1 - k))
    return ema

def get_signal(prices, candles=None):
    """[АЛИАС] EMA Тренд → теперь режим управляется через emaMode='trend'${cfg.trendFollow === "follow" ? " (по тренду)" : cfg.trendFollow === "reverse" ? " (против)" : " (комбо)"}"""
    prices = prices[:-1]
    if len(prices) < ${cfg.emaSlow} + 1:
        return None, ""
    ema_fast = calculate_ema(prices, ${cfg.emaFast})
    ema_slow = calculate_ema(prices, ${cfg.emaSlow})
    above = ema_fast[-1] > ema_slow[-1]
    info = f"EMA${cfg.emaFast}={ema_fast[-1]:.5f}/EMA${cfg.emaSlow}={ema_slow[-1]:.5f}"
    if above:
        return "${cfg.trendFollow !== "reverse" ? "CALL" : "PUT"}", f"{info} (EMA${cfg.emaFast} > EMA${cfg.emaSlow} ↑)"
    return "${cfg.trendFollow !== "reverse" ? "PUT" : "CALL"}", f"{info} (EMA${cfg.emaFast} < EMA${cfg.emaSlow} ↓)"`,

    martingale: `
def get_signal(prices, candles=None):
    """Мартингейл: направление по последним 3 свечам (большинство голосует за одно направление)"""
    prices = prices[:-1]
    if len(prices) < 4:
        return None, ""
    moves = []
    for i in range(-3, 0):
        if prices[i] < prices[i - 1]:
            moves.append("CALL")
        elif prices[i] > prices[i - 1]:
            moves.append("PUT")
    calls = moves.count("CALL")
    puts  = moves.count("PUT")
    info  = f"Свечи: {calls} вверх / {puts} вниз из 3"
    print(f"[СИГНАЛ] Мартингейл: последние 3 свечи — вверх={calls}, вниз={puts}")
    if calls >= 2:
        print(f"[СИГНАЛ] → CALL (большинство вверх {calls}/3)")
        return "CALL", f"{info} → большинство вверх"
    if puts >= 2:
        print(f"[СИГНАЛ] → PUT (большинство вниз {puts}/3)")
        return "PUT", f"{info} → большинство вниз"
    print(f"[СИГНАЛ] → нет сигнала (ничья {calls}/{puts})")
    return None, info`,

    candle_pattern: `
def get_signal(prices, candles=None):
    """Паттерны японских свечей"""
    if candles is None or len(candles) < 3:
        return None, ""
    closed = candles[:-1]
    o1, h1, l1, c1 = closed[-2]
    o2, h2, l2, c2 = closed[-1]
    body2 = abs(c2 - o2)
    lower_shadow = min(o2, c2) - l2
    upper_shadow = h2 - max(o2, c2)
    e1 = "🟢" if c1 >= o1 else "🔴"
    e2 = "🟢" if c2 >= o2 else "🔴"
    print(f"[СИГНАЛ] Паттерны: свеча-2={e1} o={o1:.5f} c={c1:.5f} | свеча-1={e2} o={o2:.5f} c={c2:.5f} | тело={body2:.5f} нижн.фитиль={lower_shadow:.5f} верхн.фитиль={upper_shadow:.5f}")
    # Молот — разворот вверх
    if lower_shadow > body2 * 2 and upper_shadow < body2 * 0.5 and c1 < o1:
        print(f"[СИГНАЛ] → CALL (🔨 Молот: нижний фитиль {lower_shadow:.5f} > тело*2 {body2*2:.5f})")
        return "CALL", "Паттерн: 🔨 Молот (разворот вверх)"
    # Падающая звезда — разворот вниз
    if upper_shadow > body2 * 2 and lower_shadow < body2 * 0.5 and c1 > o1:
        print(f"[СИГНАЛ] → PUT (⭐ Падающая звезда: верхний фитиль {upper_shadow:.5f} > тело*2 {body2*2:.5f})")
        return "PUT", "Паттерн: ⭐ Падающая звезда (разворот вниз)"
    # Бычье поглощение
    if c1 < o1 and c2 > o2 and c2 > o1 and o2 < c1:
        print(f"[СИГНАЛ] → CALL (🟢 Бычье поглощение: c2={c2:.5f} > o1={o1:.5f})")
        return "CALL", "Паттерн: 🟢 Бычье поглощение"
    # Медвежье поглощение
    if c1 > o1 and c2 < o2 and c2 < o1 and o2 > c1:
        print(f"[СИГНАЛ] → PUT (🔴 Медвежье поглощение: c2={c2:.5f} < o1={o1:.5f})")
        return "PUT", "Паттерн: 🔴 Медвежье поглощение"
    print(f"[СИГНАЛ] → нет паттерна")
    return None, ""`,

    support_resistance: `
# ===== УРОВНИ ПОДДЕРЖКИ / СОПРОТИВЛЕНИЯ =====
SR_WINDOW       = ${cfg.srWindow || 10}       # Окно поиска локальных экстремумов
SR_STEP         = ${cfg.srStep || 0}          # Шаг сетки (0 = авто по свечам)
SR_MANUAL_RAW   = "${cfg.srManualLevels || ""}"  # Ручные уровни через запятую (напр. "1.0850,1.0900,1.0950")

# Типичные уровни для пары (подсказка, используются если нет ручных и мало свечей)
_SR_PRESET: dict = {
    "EURUSD": [1.0500,1.0600,1.0700,1.0800,1.0900,1.1000],
    "EURUSD_otc": [1.0500,1.0600,1.0700,1.0800,1.0900,1.1000],
    "GBPUSD": [1.2200,1.2400,1.2600,1.2800,1.3000,1.3200],
    "GBPUSD_otc": [1.2200,1.2400,1.2600,1.2800,1.3000,1.3200],
    "USDJPY": [145.0,147.0,149.0,150.0,151.0,153.0],
    "USDJPY_otc": [145.0,147.0,149.0,150.0,151.0,153.0],
    "USDCHF": [0.8800,0.8900,0.9000,0.9100,0.9200],
    "USDCAD": [1.3300,1.3500,1.3700,1.3900],
    "AUDUSD": [0.6200,0.6400,0.6500,0.6600,0.6800],
    "NZDUSD": [0.5800,0.6000,0.6100,0.6200],
    "XAUUSD": [1900,1950,2000,2050,2100,2150,2200,2300,2400],
    "XAUUSD_otc": [1900,1950,2000,2050,2100,2150,2200,2300,2400],
    "XAGUSD": [22.0,24.0,25.0,26.0,28.0,30.0],
    "BTCUSD": [60000,65000,70000,75000,80000,90000,100000],
    "ETHUSD": [2500,3000,3500,4000,4500],
    "SP500": [4500,4700,5000,5200,5500],
    "NASUSD": [17000,18000,19000,20000,21000],
    "DJI30": [38000,39000,40000,41000,42000],
}

def _parse_manual_levels(raw):
    if not raw.strip():
        return []
    try:
        return [float(x.strip()) for x in raw.split(",") if x.strip()]
    except Exception:
        return []

def _build_step_levels(center, step, count=10):
    """Строит сетку уровней с заданным шагом вокруг текущей цены"""
    base = round(center / step) * step
    return [round(base + step * i, 8) for i in range(-count//2, count//2 + 1)]

def find_levels(prices, window=None):
    """Поиск уровней поддержки и сопротивления из свечей"""
    if window is None:
        window = SR_WINDOW
    supports, resistances = [], []
    for i in range(window, len(prices) - window):
        if prices[i] == min(prices[i-window:i+window]):
            supports.append(prices[i])
        if prices[i] == max(prices[i-window:i+window]):
            resistances.append(prices[i])
    return supports[-5:], resistances[-5:]

def get_signal(prices, candles=None):
    """Вход от уровней поддержки/сопротивления (авто + ручные + сетка)"""
    prices = prices[:-1]
    if len(prices) < 2:
        return None, ""
    current = prices[-1]
    # 1. Ручные уровни (наивысший приоритет)
    manual = _parse_manual_levels(SR_MANUAL_RAW)
    # 2. Автоуровни из свечей
    auto_sup, auto_res = (find_levels(prices) if len(prices) >= 30 else ([], []))
    # 3. Сетка по шагу
    step_levels = _build_step_levels(current, SR_STEP) if SR_STEP > 0 else []
    # 4. Пресет для пары (если мало свечей и нет ручных)
    preset = _SR_PRESET.get((_resolved_asset or ASSET), []) if not manual and len(prices) < 30 else []
    all_supports    = sorted(set([l for l in (manual + auto_sup + step_levels + preset) if l < current]))
    all_resistances = sorted(set([l for l in (manual + auto_res + step_levels + preset) if l > current]))
    nearest_sup = max(all_supports) if all_supports else None
    nearest_res = min(all_resistances) if all_resistances else None
    threshold = max(current * 0.0008, 0.00005)
    sup_info = f"{nearest_sup:.5f}" if nearest_sup else "нет"
    res_info = f"{nearest_res:.5f}" if nearest_res else "нет"
    sup_dist = f"{abs(current-nearest_sup):.5f}" if nearest_sup else "—"
    res_dist = f"{abs(current-nearest_res):.5f}" if nearest_res else "—"
    print(f"[СИГНАЛ] S/R: цена={current:.5f} | ближ.поддержка={sup_info} (расст.={sup_dist}) | ближ.сопротивление={res_info} (расст.={res_dist}) | порог={threshold:.5f}")
    if nearest_sup and abs(current - nearest_sup) < threshold:
        src = "ручной" if nearest_sup in manual else ("сетка" if SR_STEP > 0 and nearest_sup in step_levels else "авто")
        print(f"[СИГНАЛ] → CALL (цена {current:.5f} у поддержки {nearest_sup:.5f} [{src}], расстояние {abs(current-nearest_sup):.5f} < порог {threshold:.5f})")
        return "CALL", f"Цена {current:.5f} у поддержки {nearest_sup:.5f} [{src}] → отскок вверх"
    if nearest_res and abs(current - nearest_res) < threshold:
        src = "ручной" if nearest_res in manual else ("сетка" if SR_STEP > 0 and nearest_res in step_levels else "авто")
        print(f"[СИГНАЛ] → PUT (цена {current:.5f} у сопротивления {nearest_res:.5f} [{src}], расстояние {abs(current-nearest_res):.5f} < порог {threshold:.5f})")
        return "PUT", f"Цена {current:.5f} у сопротивления {nearest_res:.5f} [{src}] → отскок вниз"
    print(f"[СИГНАЛ] → нет сигнала (цена далеко от уровней)")
    return None, f"Цена {current:.5f} | ближ.sup={sup_info} res={res_info}"`,
  }

  const martingaleBlock = cfg.martingaleEnabled
    ? `
# === МАРТИНГЕЙЛ ===
current_bet = BASE_BET
loss_streak = 0

def adjust_bet(won):
    global current_bet, loss_streak
    # 🛡️ ЖЁСТКАЯ ЗАЩИТА: если мартингейл отключён — всегда базовая
    if not MARTINGALE:
        current_bet = BASE_BET
        loss_streak = 0
        return BASE_BET
    if won:
        current_bet = BASE_BET
        loss_streak = 0
    else:
        loss_streak += 1
        if loss_streak <= MARTINGALE_STEPS:
            current_bet = round(current_bet * MARTINGALE_MULT, 2)
        else:
            current_bet = BASE_BET
            loss_streak = 0
    return current_bet
`
    : `
current_bet = BASE_BET

def adjust_bet(won, profit=0.0, bet=0.0):
    """Без мартингейла — всегда возвращаем базовую ставку (profit/bet принимаем для совместимости)."""
    return BASE_BET
`

  const assetMap: Record<string, string> = {
    // Forex — основные (реальный рынок)
    "EUR/USD":          "EURUSD",
    "GBP/USD":          "GBPUSD",
    "USD/JPY":          "USDJPY",
    "USD/CHF":          "USDCHF",
    "USD/CAD":          "USDCAD",
    "AUD/USD":          "AUDUSD",
    "NZD/USD":          "NZDUSD",
    // Forex OTC — основные
    "EUR/USD (OTC)":    "EURUSD_otc",
    "GBP/USD (OTC)":    "GBPUSD_otc",
    "USD/JPY (OTC)":    "USDJPY_otc",
    "AUD/USD (OTC)":    "AUDUSD_otc",
    "USD/CAD (OTC)":    "USDCAD_otc",
    "USD/CHF (OTC)":    "USDCHF_otc",
    "NZD/USD (OTC)":    "NZDUSD_otc",
    // Forex OTC — кросс-пары
    "EUR/GBP (OTC)":    "EURGBP_otc",
    "EUR/JPY (OTC)":    "EURJPY_otc",
    "EUR/CHF (OTC)":    "EURCHF_otc",
    "EUR/NZD (OTC)":    "EURNZD_otc",
    "GBP/JPY (OTC)":    "GBPJPY_otc",
    "GBP/CHF (OTC)":    "GBPCHF_otc",
    "GBP/AUD (OTC)":    "GBPAUD_otc",
    "GBP/CAD (OTC)":    "GBPCAD_otc",
    "GBP/NZD (OTC)":    "GBPNZD_otc",
    "AUD/JPY (OTC)":    "AUDJPY_otc",
    "AUD/CAD (OTC)":    "AUDCAD_otc",
    "AUD/CHF (OTC)":    "AUDCHF_otc",
    "AUD/NZD (OTC)":    "AUDNZD_otc",
    "CAD/CHF (OTC)":    "CADCHF_otc",
    "CAD/JPY (OTC)":    "CADJPY_otc",
    "CHF/JPY (OTC)":    "CHFJPY_otc",
    "NZD/CAD (OTC)":    "NZDCAD_otc",
    "NZD/CHF (OTC)":    "NZDCHF_otc",
    "NZD/JPY (OTC)":    "NZDJPY_otc",
    // Криптовалюты
    "BTC/USD":          "BTCUSD",
    "ETH/USD":          "ETHUSD",
    "DASH/USD":         "DASH_USD",
    "DOT/USD":          "DOTUSD",
    "LINK/USD":         "LNKUSD",
    "BTC/GBP":          "BTCGBP",
    "BTC/JPY":          "BTCJPY",
    "BCH/EUR":          "BCHEUR",
    "BCH/GBP":          "BCHGBP",
    "BCH/JPY":          "BCHJPY",
    // Криптовалюты OTC
    "BTC/USD (OTC)":    "BTCUSD_otc",
    "ETH/USD (OTC)":    "ETHUSD_otc",
    "LTC/USD (OTC)":    "LTCUSD_otc",
    "DOT/USD (OTC)":    "DOTUSD",
    "LINK/USD (OTC)":   "LNKUSD",
    // Товары (реальный рынок)
    "Gold":             "XAUUSD",
    "Silver":           "XAGUSD",
    "Brent Oil":        "UKBrent",
    "WTI Oil":          "USCrude",
    "Natural Gas":      "XNGUSD",
    "Platinum":         "XPTUSD",
    "Palladium":        "XPDUSD",
    // Товары OTC
    "Gold (OTC)":       "XAUUSD_otc",
    "Silver (OTC)":     "XAGUSD_otc",
    "Brent Oil (OTC)":  "UKBrent_otc",
    "WTI Oil (OTC)":    "USCrude_otc",
    "Natural Gas (OTC)":"XNGUSD_otc",
    "Platinum (OTC)":   "XPTUSD_otc",
    "Palladium (OTC)":  "XPDUSD_otc",
    // Акции OTC
    "Apple (OTC)":      "#AAPL_otc",
    "Tesla (OTC)":      "#TSLA_otc",
    "Nvidia (OTC)":     "#NVDA_otc",
    "Amazon (OTC)":     "#AMZN_otc",
    "Microsoft (OTC)":  "#MSFT_otc",
    "Google (OTC)":     "#GOOG_otc",
    "Meta (OTC)":       "#META_otc",
    "Netflix (OTC)":    "#NFLX_otc",
    "VISA (OTC)":       "#V_otc",
    "GameStop (OTC)":   "#GME_otc",
    "ExxonMobil (OTC)": "#XOM_otc",
    "McDonald's (OTC)": "#MCD_otc",
    "Intel (OTC)":      "#INTC_otc",
    "Boeing (OTC)":     "#BA_otc",
    // Индексы (реальный рынок)
    "S&P 500":          "SP500",
    "NASDAQ":           "NASUSD",
    "Dow Jones":        "DJI30",
    "Nikkei 225":       "JPN225",
    "DAX":              "D30EUR",
    "EURO STOXX 50":    "E50EUR",
    "IBEX 35":          "E35EUR",
    "FTSE 100":         "100GBP",
    "AUS 200":          "AUS200",
    "CAC 40":           "CAC40",
    "AEX 25":           "AEX25",
    "SMI 20":           "SMI20",
    "Hang Seng":        "H33HKD",
    // Индексы OTC
    "S&P 500 (OTC)":    "SP500_otc",
    "NASDAQ (OTC)":     "NASUSD_otc",
    "Dow Jones (OTC)":  "DJI30_otc",
    "AUS 200 (OTC)":        "AUS200_otc",
    "FTSE 100 (OTC)":       "100GBP_otc",
    "DAX (OTC)":            "D30EUR_otc",
    "CAC 40 (OTC)":         "F40EUR_otc",
    "Nikkei 225 (OTC)":     "JPN225_otc",
    "EURO STOXX 50 (OTC)":  "E50EUR_otc",
    "IBEX 35 (OTC)":        "E35EUR_otc",
  }
  const assetSymbol = assetMap[cfg.asset] ?? cfg.asset.replace("/", "").replace(" (OTC)", "_otc").replace(/\s/g, "")

  const _buildVersion = `v2.1-${new Date().toISOString().slice(0, 10)}`
  return (
`#!/usr/bin/env python3
"""
Pocket Option Bot — ${strategyLabel}
Сгенерировано: TradeBase Bot Builder (${_buildVersion})

════════════════════════════════════════
  КОНФИГУРАЦИЯ БОТА
════════════════════════════════════════
  Стратегия  : ${strategyLabel}
  Актив      : ${assetSymbol}
  Экспирация : ${cfg.expiry} мин
  Ставка     : ${cfg.betAmount}${cfg.betPercent ? "% от баланса" : " " + cfg.currency}
  Режим      : ${cfg.isDemo ? "ДЕМО-СЧЁТ" : "РЕАЛЬНЫЙ СЧЁТ"}
  Направление: ${cfg.trendFollow === "follow" ? "По тренду ↗" : cfg.trendFollow === "reverse" ? "Против тренда ↙" : "Комбо ↗↙"}
  Режим свечей: ${(cfg.trendMode ?? "same") === "same" ? "Одинаковые (2 зелёных=CALL / 2 красных=PUT)" : (cfg.trendMode === "reverse") ? "Разворот (красн+зел=PUT / зел+красн=CALL)" : "Любой паттерн (UP=CALL, DOWN=PUT)"}
  Таймфрейм  : ${(cfg.candleTimeframe ?? 60) === 60 ? "1 мин  (60 свечей = 1 час истории)" : (cfg.candleTimeframe ?? 60) === 300 ? "5 мин  (60 свечей = 5 часов истории)" : (cfg.candleTimeframe ?? 60) === 900 ? "15 мин (60 свечей = 15 часов истории)" : "1 час  (60 свечей = 2.5 дня истории)"}
  Take Profit: ${cfg.takeProfitRub} ${cfg.currency}
  Stop Loss  : ${cfg.stopLossRub} ${cfg.currency}
  Лимит/день : ${cfg.dailyLimit} сделок
  Мартингейл : ${cfg.martingaleEnabled ? `x${cfg.martingaleMultiplier} до ${cfg.martingaleSteps} шагов` : "выкл"}
════════════════════════════════════════

Установка зависимостей:
    pip install pocketoptionapi-async websockets msgpack
"""

import asyncio
import os
import builtins as _builtins
from datetime import datetime, timedelta, timezone
from pocketoptionapi_async import AsyncPocketOptionClient, OrderDirection

# ===== ТАЙМЗОНЫ ДЛЯ ШПИОН-ЛОГА =====
MSK_TZ = timezone(timedelta(hours=3))   # время как на Pocket Option (Москва)
# Локальное время — автоматом из системы (не хардкодим!)
LOCAL_TZ = datetime.now().astimezone().tzinfo
_local_offset = datetime.now().astimezone().utcoffset()
_local_hours = int(_local_offset.total_seconds() // 3600) if _local_offset else 0
_msk_diff = _local_hours - 3  # разница с Москвой

# ===== ВРЕМЯ В ЛОГАХ =====
# Перехватываем print глобально — каждая строка лога получает префикс [HH:MM:SS]
_original_print = _builtins.print
def _print_with_time(*args, **kwargs):
    _ts = datetime.now().strftime("%H:%M:%S")
    _original_print(f"[{_ts}]", *args, **kwargs)
_builtins.print = _print_with_time

# ===== НАСТРОЙКИ =====
ASSET        = os.environ.get("PO_ASSET", "${assetSymbol}")
EXPIRY_SEC   = ${String(parseInt(cfg.expiry) * 60)}             # Экспирация в секундах
BASE_BET     = ${cfg.betAmount}          # Базовая ставка ₽
BET_PERCENT  = ${cfg.betPercent ? "True" : "False"}        # True = % от баланса
IS_DEMO      = ${cfg.isDemo ? "True" : "False"}                   # True = демо, False = реальный счёт
SAFETY_MAX_BET_PCT = ${cfg.safetyMaxBetPercent ?? 30}      # Защита: макс. % ставки от баланса
SAFETY_MIN_RESERVE_PCT = ${cfg.safetyMinReservePercent ?? 30}  # Защита: % баланса который ВСЕГДА должен оставаться нетронутым (0 = выкл)

CURRENCY     = "${cfg.currency}"         # Валюта счёта
TAKE_PROFIT  = ${cfg.takeProfitRub}      # Стоп профит за сессию
STOP_LOSS    = ${cfg.stopLossRub}        # Стоп лосс за сессию
DAILY_LIMIT  = ${cfg.dailyLimit}         # Макс. сделок в день
AUTO_RESTART = ${cfg.autoRestart ? "True" : "False"}       # Перезапуск после TP/SL

MARTINGALE       = ${cfg.martingaleEnabled ? "True" : "False"}
MARTINGALE_MULT  = ${cfg.martingaleMultiplier}
MARTINGALE_STEPS = ${cfg.martingaleSteps}

CHECK_INTERVAL   = ${cfg.checkInterval}      # Интервал проверки сигнала (сек)
TREND_MODE       = "${cfg.trendMode ?? "same"}"     # "same" = 2 одинаковых, "reverse" = разворот, "any" = любой паттерн
TREND_FOLLOW     = "${cfg.trendFollow}"              # "follow" = по тренду, "reverse" = против, "combo" = без фильтра

try:
    from dotenv import load_dotenv; load_dotenv()
except ImportError:
    pass

SESSION_ID = os.environ.get("PO_SESSION_ID", "")
if not SESSION_ID:
    _env = os.path.join(os.path.dirname(os.path.abspath(__file__)), ".env")
    if os.path.exists(_env):
        with open(_env, encoding="utf-8") as _f:
            for _line in _f:
                if _line.startswith("PO_SESSION_ID="):
                    SESSION_ID = _line.split("=", 1)[1].strip().strip('"').strip("'")
                    break
if not SESSION_ID:
    print("[ERROR] Не задан PO_SESSION_ID.")
    print("Создайте файл .env рядом с bot.py:")
    print('  PO_SESSION_ID=42["auth",{"session":"...","isDemo":0,"uid":...}]')
    exit(1)

print(f"[INFO] SESSION_ID загружен, длина: {len(SESSION_ID)} символов")

# ===== ЗАПУСК АВТО-ОТЧЁТА (фоновый поток) =====
def _start_auto_report_bg():
    try:
        if "${cfg.tgAutoReportTime || ''}".strip() and ${cfg.tgEnabled ? "True" : "False"}:
            import threading as _athr
            _athr.Thread(target=_auto_report_scheduler, daemon=True).start()
    except Exception as _ae:
        print(f"[AUTOREPORT] start err: {_ae}")

# ===== АВТООПРЕДЕЛЕНИЕ ДЕМО/РЕАЛ из SESSION_ID =====
try:
    import re as _re
    _m = _re.search('"isDemo"[ ]*:[ ]*([0-9]+)', SESSION_ID)
    IS_DEMO = bool(int(_m.group(1))) if _m else IS_DEMO
    _u = _re.search('"uid"[ ]*:[ ]*([0-9]+)', SESSION_ID)
    _uid = _u.group(1) if _u else "неизвестен"
    print(f"[INFO] Аккаунт UID: {_uid} | Режим: {'ДЕМО' if IS_DEMO else 'РЕАЛЬНЫЙ'}")
except Exception:
    print(f"[INFO] Режим (из настроек): {'ДЕМО' if IS_DEMO else 'РЕАЛЬНЫЙ'}")

# ===== TELEGRAM =====
BOT_NAME        = "${cfg.botName || "Бот"}"
TG_TOKEN   = "${cfg.tgToken}"
TG_CHAT_ID = "${cfg.tgChatId}"
TG_ENABLED      = ${cfg.tgEnabled ? "True" : "False"} and bool(TG_TOKEN and TG_CHAT_ID)
TG_NOTIFY_MODE  = "${cfg.tgNotifyMode ?? "all"}"

def _tg_send(text, retries=5, delay=5, reply_markup=None, action="send", message_id=None, _result_holder=None):
    """Отправка/редактирование/удаление сообщений через прокси-функцию (без VPN).
    Если передан _result_holder (list) — кладёт туда ответ Telegram (для получения message_id)."""
    import urllib.request, json, time
    url = "https://functions.poehali.dev/fb70e0a6-b6c1-49e2-b148-c37dab50f024"
    payload_data = {"token": TG_TOKEN, "chat_id": TG_CHAT_ID, "action": action}
    if text is not None:
        payload_data["text"] = text
    if reply_markup is not None:
        payload_data["reply_markup"] = reply_markup
    if message_id is not None:
        payload_data["message_id"] = message_id
    payload = json.dumps(payload_data).encode()
    req = urllib.request.Request(url, data=payload, headers={"Content-Type": "application/json"}, method="POST")
    _t0 = time.time()
    _has_markup = reply_markup is not None
    _text_len = len(text) if text else 0
    for attempt in range(1, retries + 1):
        try:
            resp = urllib.request.urlopen(req, timeout=20)
            _resp_data = None
            try:
                _resp_data = json.loads(resp.read().decode())
            except Exception:
                pass
            if _result_holder is not None and _resp_data is not None:
                _result_holder.append(_resp_data)
            _elapsed = int((time.time() - _t0) * 1000)
            if _resp_data is not None:
                _ok = _resp_data.get("ok", False)
                _out_id = _resp_data.get("message_id", "—")
                if _ok:
                    print(f"[TG_API] ✅ action={action} msg_id={message_id or '—'}→{_out_id} text_len={_text_len} markup={_has_markup} elapsed={_elapsed}ms")
                else:
                    _err = _resp_data.get("error", "?")
                    print(f"[TG_API] ⚠️  action={action} msg_id={message_id or '—'} elapsed={_elapsed}ms err={_err}")
            else:
                print(f"[TG_API] ✅ action={action} msg_id={message_id or '—'} text_len={_text_len} markup={_has_markup} elapsed={_elapsed}ms (no body)")
            return
        except Exception as e:
            if attempt < retries:
                print(f"[TG_API] 🔄 retry {attempt}/{retries} action={action} err={e}")
                time.sleep(delay)
            else:
                _elapsed = int((time.time() - _t0) * 1000)
                print(f"[TG_API] 💥 FAIL action={action} msg_id={message_id or '—'} elapsed={_elapsed}ms err={e}")

def tg(text):
    """Отправка уведомления о ставке (всегда, если TG включён)"""
    if not TG_ENABLED:
        return
    import threading
    threading.Thread(target=_tg_send, args=(text,), daemon=True).start()

def tg_info(text):
    """Информационное уведомление (запуск/тренд/ошибки) — только в режиме all"""
    _notify_mode = globals().get("TG_NOTIFY_MODE", "all")
    if _notify_mode == "bets_only":
        return
    tg(text)

# ===== СИСТЕМА ОТЧЁТНОСТИ (JSONL) =====
import json as _json_rep
_REPORTS_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "reports")
try:
    os.makedirs(_REPORTS_DIR, exist_ok=True)
except Exception as _re:
    print(f"[REPORT] ⚠️ Не могу создать папку reports: {_re}")

def report_log(event_type, data):
    """Записывает событие в JSONL-файл текущего дня.
    event_type: 'trade' | 'cascade' | 'hedge' | 'session_start' | 'session_end' | 'strategy_error'
    """
    try:
        _today = datetime.now().strftime("%Y-%m-%d")
        _file = os.path.join(_REPORTS_DIR, f"trades_{_today}.jsonl")
        _entry = {
            "ts": datetime.now().isoformat(timespec='seconds'),
            "type": event_type,
            "asset": ASSET,
            "bot": globals().get('BOT_NAME', '?'),
            **data
        }
        with open(_file, "a", encoding="utf-8") as _f:
            _f.write(_json_rep.dumps(_entry, ensure_ascii=False, default=str) + "\\n")
    except Exception as _re:
        print(f"[REPORT] ⚠️ Не могу записать отчёт: {_re}")

def calc_pips_distance(symbol, price_a, price_b):
    """Расстояние между ценами в пипах (учитывает тип пары)"""
    try:
        _pip_div = {
            "EURUSD": 0.0001, "GBPUSD": 0.0001, "AUDUSD": 0.0001, "NZDUSD": 0.0001,
            "USDCHF": 0.0001, "USDCAD": 0.0001, "EURGBP": 0.0001, "EURCHF": 0.0001,
            "EURNZD": 0.0001, "EURAUD": 0.0001, "EURCAD": 0.0001, "GBPAUD": 0.0001,
            "GBPCAD": 0.0001, "GBPCHF": 0.0001, "GBPNZD": 0.0001, "AUDCAD": 0.0001,
            "AUDCHF": 0.0001, "AUDNZD": 0.0001, "CADCHF": 0.0001, "NZDCAD": 0.0001,
            "NZDCHF": 0.0001,
            "USDJPY": 0.01, "EURJPY": 0.01, "GBPJPY": 0.01, "AUDJPY": 0.01,
            "CHFJPY": 0.01, "CADJPY": 0.01, "NZDJPY": 0.01,
            "XAUUSD": 0.1, "XAGUSD": 0.001,
            "BTCUSD": 1.0, "ETHUSD": 0.1, "LTCUSD": 0.1,
        }
        _sym_clean = symbol.replace("_otc", "").replace("/", "").upper()
        _pip = _pip_div.get(_sym_clean, 0.0001)
        return round(abs(price_a - price_b) / _pip, 1)
    except Exception:
        return 0.0

def calc_pct_move(price_a, price_b):
    """Процентное изменение цены"""
    try:
        if price_a == 0: return 0.0
        return round((price_b - price_a) / price_a * 100, 4)
    except Exception:
        return 0.0

AUTO_REPORT_TIME = "${cfg.tgAutoReportTime || ''}"  # HH:MM или пусто = выкл

def _auto_report_scheduler():
    """Фоновый поток: каждый день в AUTO_REPORT_TIME отправляет в TG отчёт за ВЧЕРА"""
    if not AUTO_REPORT_TIME or not TG_ENABLED:
        return
    try:
        _hh, _mm = AUTO_REPORT_TIME.split(":")
        _hh = int(_hh); _mm = int(_mm)
    except Exception:
        print(f"[AUTOREPORT] ❌ Неверный формат времени: {AUTO_REPORT_TIME}")
        return
    print(f"[AUTOREPORT] ⏰ Планировщик запущен: ежедневно в {AUTO_REPORT_TIME} (отчёт за вчера)")
    import time as _t
    _last_sent_date = None
    while not globals().get("_tg_stopped", False):
        try:
            _now = datetime.now()
            _today_str = _now.strftime("%Y-%m-%d")
            if (_now.hour == _hh and _now.minute == _mm and _last_sent_date != _today_str):
                _yesterday = (_now - timedelta(days=1)).strftime("%Y-%m-%d")
                print(f"[AUTOREPORT] 🚀 Отправка отчёта за {_yesterday}")
                _ok = tg_send_report_file(_yesterday, caption=(
                    f"🌅 <b>[{BOT_NAME}] Автоотчёт</b>\\n"
                    f"📅 За: {_yesterday}\\n"
                    f"<i>Перетащи файл в /bot-report для анализа</i>"
                ))
                _last_sent_date = _today_str
                if not _ok:
                    print(f"[AUTOREPORT] ⚠️ Не удалось отправить отчёт за {_yesterday}")
            _t.sleep(30)
        except Exception as _e:
            print(f"[AUTOREPORT] err: {_e}")
            _t.sleep(60)

def tg_send_report_file(date_str=None, caption=None):
    """Отправляет JSONL-отчёт за день как документ в Telegram"""
    if not TG_ENABLED:
        return False
    import urllib.request, json as _j, base64 as _b64, time as _t
    if date_str is None:
        date_str = datetime.now().strftime("%Y-%m-%d")
    _file = os.path.join(_REPORTS_DIR, f"trades_{date_str}.jsonl")
    if not os.path.exists(_file):
        try: tg(f"📭 Отчёт за {date_str} ещё не создан (нет сделок).")
        except: pass
        return False
    try:
        with open(_file, "rb") as _f:
            _bytes = _f.read()
        if len(_bytes) == 0:
            tg(f"📭 Файл отчёта за {date_str} пуст.")
            return False
        _b64s = _b64.b64encode(_bytes).decode()
        # Подсчёт строк своего бота для caption
        _lines = _bytes.decode("utf-8", errors="ignore").split("\\n")
        _my_lines = sum(1 for _l in _lines if _l and ('"bot": "' + BOT_NAME + '"') in _l)
        if not caption:
            caption = (
                f"📊 <b>[{BOT_NAME}] Отчёт {date_str}</b>\\n"
                f"Размер: {len(_bytes)} байт | Записей бота: {_my_lines}\\n"
                f"<i>Перетащи в /bot-report для анализа</i>"
            )
        _payload = _j.dumps({
            "token": TG_TOKEN, "chat_id": TG_CHAT_ID,
            "action": "document",
            "file_b64": _b64s,
            "file_name": f"trades_{date_str}.jsonl",
            "caption": caption,
        }).encode()
        _url = "https://functions.poehali.dev/fb70e0a6-b6c1-49e2-b148-c37dab50f024"
        _req = urllib.request.Request(_url, data=_payload, headers={"Content-Type": "application/json"}, method="POST")
        for _att in range(1, 4):
            try:
                _r = urllib.request.urlopen(_req, timeout=60)
                _resp = _j.loads(_r.read().decode())
                if _resp.get("ok"):
                    print(f"[REPORT] ✅ Файл отчёта {date_str} отправлен в TG")
                    return True
                print(f"[REPORT] ⚠️ TG err: {_resp.get('error')}")
                if _att < 3: _t.sleep(3)
            except Exception as _e:
                print(f"[REPORT] retry {_att}: {_e}")
                if _att < 3: _t.sleep(3)
        return False
    except Exception as _e:
        print(f"[REPORT] ❌ Ошибка отправки файла: {_e}")
        return False

# Запустить планировщик автоотчётов (фоновый поток)
try:
    _start_auto_report_bg()
except Exception as _se:
    print(f"[AUTOREPORT] init err: {_se}")

# ===== ID последнего меню (чтобы не плодить и удалять старые) =====
_tg_last_menu_id = None
# Состояние подтверждения FORCE: { "pattern": "UP_UP", "ts": time }, либо None
_tg_pending_force = None

def tg_send_menu(text, buttons):
    """Отправляет НОВОЕ inline-меню. buttons = list[list[(label, callback_data)]].
    Если есть предыдущее меню — удаляет его. Сохраняет message_id в _tg_last_menu_id."""
    global _tg_last_menu_id
    if not TG_ENABLED:
        print("[TG_MENU] ⏭ skip — TG отключён")
        return
    # Удаляем старое меню (если есть)
    if _tg_last_menu_id:
        print(f"[TG_MENU] 🗑 удаляю старое меню msg_id={_tg_last_menu_id}")
        try:
            import threading
            threading.Thread(target=_tg_send, args=(None,), kwargs={"action": "delete", "message_id": _tg_last_menu_id}, daemon=True).start()
        except Exception as _de:
            print(f"[TG_MENU] ⚠️ не удалось удалить старое меню: {_de}")
        _tg_last_menu_id = None
    # Строим reply_markup
    _btn_count = sum(len(_r) for _r in buttons)
    keyboard = []
    for row in buttons:
        keyboard.append([{"text": _l, "callback_data": _cd} for (_l, _cd) in row])
    reply_markup = {"inline_keyboard": keyboard}
    print(f"[TG_MENU] 📤 отправляю меню: {_btn_count} кнопок, {len(buttons)} рядов")
    # Отправляем синхронно — нам нужен message_id
    _holder = []
    try:
        _tg_send(text, retries=2, delay=2, reply_markup=reply_markup, _result_holder=_holder)
    except Exception as e:
        print(f"[TG_MENU] 💥 Ошибка отправки: {e}")
        return
    if _holder and _holder[0].get("ok") and _holder[0].get("message_id"):
        _tg_last_menu_id = _holder[0]["message_id"]
        print(f"[TG_MENU] ✅ меню показано, msg_id={_tg_last_menu_id}")
    else:
        _err_info = _holder[0] if _holder else "пустой ответ"
        print(f"[TG_MENU] ⚠️ меню НЕ показано: {_err_info}")

def tg_edit_menu(message_id, text, buttons):
    """Редактирует существующее меню (для подтверждений FORCE)."""
    if not TG_ENABLED or not message_id:
        return
    keyboard = []
    for row in buttons:
        keyboard.append([{"text": _l, "callback_data": _cd} for (_l, _cd) in row])
    reply_markup = {"inline_keyboard": keyboard}
    import threading
    threading.Thread(target=_tg_send, kwargs={"text": text, "action": "edit", "message_id": message_id, "reply_markup": reply_markup, "retries": 2, "delay": 2}, daemon=True).start()

def tg_delete_message(message_id):
    """Удаляет сообщение по id."""
    if not TG_ENABLED or not message_id:
        return
    import threading
    threading.Thread(target=_tg_send, args=(None,), kwargs={"action": "delete", "message_id": message_id, "retries": 2, "delay": 2}, daemon=True).start()

def _build_main_menu_buttons():
    """Строит набор кнопок главного меню. Возвращает list[list[(label, callback_data)]]."""
    _state_emoji = "▶️" if not _tg_paused else "⏸"
    _force_btn = ("❌ Снять FORCE", "force:off") if _tg_force_pattern else None
    rows = [
        [("⏸ Пауза", "pause"), ("▶️ Продолжить", "resume")],
        [("🛑 СТОП", "stop")],
        [("📊 Статус", "status"), ("💰 Профит", "profit")],
        [("📋 Отчёт", "summary"), ("📈 График", "screenshot")],
        [("🔧 Диагностика", "diag")],
        [("🟢🟢", "force:UP_UP"), ("🔴🔴", "force:DOWN_DOWN")],
        [("🟢🔴", "force:UP_DOWN"), ("🔴🟢", "force:DOWN_UP")],
    ]
    if _force_btn:
        rows.append([_force_btn])
    rows.append([("🔄 Обновить меню", "refresh")])
    return rows

def _build_main_menu_text():
    """Строит текст-шапку главного меню с актуальной статой."""
    _wins_m = sum(1 for t in trade_log if t["won"])
    _losses_m = trades_today - _wins_m
    _wr_m = (_wins_m / trades_today * 100) if trades_today > 0 else 0
    _state = "⏸ ПАУЗА" if _tg_paused else "▶️ Работает"
    _profit_emoji = "🟢" if total_profit >= 0 else "🔴"
    _force_line = ""
    if _tg_force_pattern:
        _fmap = {"UP_UP": "🟢🟢", "DOWN_DOWN": "🔴🔴", "UP_DOWN": "🟢🔴", "DOWN_UP": "🔴🟢"}
        _force_line = f"\\n⚡ FORCE: <b>{_fmap.get(_tg_force_pattern, _tg_force_pattern)}</b> (одноразово)"
    return (
        f"🎮 <b>[{BOT_NAME}] Пульт</b>\\n"
        f"━━━━━━━━━━━━━━━━━━━━\\n"
        f"{_profit_emoji} Профит: <b>{total_profit:+.2f} {CURRENCY}</b>\\n"
        f"📈 Сделок: <b>{trades_today}</b> (✅{_wins_m}/❌{_losses_m}) | WR: <b>{_wr_m:.0f}%</b>\\n"
        f"⚙️ Ставка: {globals().get('current_bet', BASE_BET)} {CURRENCY} | {ASSET}\\n"
        f"{_state}{_force_line}"
    )

def tg_show_main_menu():
    """Показывает главное меню (пересоздаёт, удаляя старое)."""
    if not TG_ENABLED:
        return
    tg_send_menu(_build_main_menu_text(), _build_main_menu_buttons())

# ===== УПРАВЛЕНИЕ ЧЕРЕЗ TELEGRAM =====
_tg_paused   = False
_tg_stopped  = False
_tg_offset   = 0
# Принудительный паттерн 2 свечей (одноразово, после применения сбрасывается).
# Возможные значения: "UP_UP", "DOWN_DOWN", "UP_DOWN", "DOWN_UP" или None
_tg_force_pattern = None
_tg_force_at = 0  # время установки

def _force_alias_to_pattern(alias):
    """Конвертирует пользовательский ввод в код тренда. Возвращает (pattern, human_label) или (None, None)."""
    if not alias:
        return None, None
    a = alias.lower().strip().replace(" ", "")
    # Эмодзи-варианты
    a = a.replace("🟢", "g").replace("🔴", "r").replace("зел", "g").replace("крас", "r").replace("кр", "r")
    if a in ("gg", "greengreen", "uu", "upup", "up_up"):
        return "UP_UP", "🟢🟢 (зел-зел)"
    if a in ("rr", "redred", "dd", "downdown", "down_down"):
        return "DOWN_DOWN", "🔴🔴 (кр-кр)"
    if a in ("gr", "greenred", "ud", "updown", "up_down"):
        return "UP_DOWN", "🟢🔴 (зел-кр)"
    if a in ("rg", "redgreen", "du", "downup", "down_up"):
        return "DOWN_UP", "🔴🟢 (кр-зел)"
    return None, None

def _tg_answer_callback(callback_id, text=""):
    """Подтверждает нажатие inline-кнопки (убирает 'часики' с кнопки)."""
    if not callback_id:
        return
    try:
        import urllib.request, urllib.parse
        u = f"https://api.telegram.org/bot{TG_TOKEN}/answerCallbackQuery"
        d = urllib.parse.urlencode({"callback_query_id": callback_id, "text": text}).encode()
        urllib.request.urlopen(urllib.request.Request(u, data=d, method="POST"), timeout=5)
    except Exception:
        pass

def _send_diag_report():
    """Полный диагностический отчёт о состоянии бота. Шлётся в ТГ и в консоль."""
    import time as _t_diag, sys as _sys_diag
    try:
        _wins_d = sum(1 for t in trade_log if t["won"])
        _losses_d = trades_today - _wins_d
        _wr_d = (_wins_d / trades_today * 100) if trades_today > 0 else 0
        _state_d = "⏸ ПАУЗА" if _tg_paused else ("🛑 СТОП" if _tg_stopped else "▶️ Работает")
        _cur_bet_d = globals().get('current_bet', BASE_BET)
        _streak_d = globals().get('cur_streak', 0)
        # FORCE-режим
        _force_d = "—"
        if _tg_force_pattern:
            _fmap_d = {"UP_UP": "🟢🟢", "DOWN_DOWN": "🔴🔴", "UP_DOWN": "🟢🔴", "DOWN_UP": "🔴🟢"}
            _force_d = f"{_fmap_d.get(_tg_force_pattern, _tg_force_pattern)} (активен)"
        # Время последнего тика свечи
        _buf_d = globals().get('_live_buf') or globals().get('buf') or globals().get('_live_buffer')
        _price_d = "—"
        _sync_d = "—"
        _last_tick_d = "—"
        if _buf_d is not None:
            _lp_d = getattr(_buf_d, 'last_price', 0)
            if _lp_d:
                _price_d = str(_lp_d)
            _sw_d = getattr(_buf_d, 'sync_warn', False)
            _sync_d = "⚠️ ЗАВИС" if _sw_d else "✅ живой"
            _lt_d = getattr(_buf_d, 'last_tick_at', None)
            if _lt_d:
                _ago = int(_t_diag.time() - _lt_d)
                _last_tick_d = f"{_ago}с назад"
        # Активные asyncio-задачи
        _tasks_d = "—"
        try:
            import asyncio as _a_diag
            _loop_d = _a_diag.get_event_loop()
            _all_tasks = [t for t in _a_diag.all_tasks(_loop_d) if not t.done()]
            _task_names = [t.get_name() for t in _all_tasks][:10]
            _tasks_d = f"{len(_all_tasks)} активных: {', '.join(_task_names) if _task_names else '—'}"
        except Exception as _te_d:
            _tasks_d = f"ошибка: {_te_d}"
        # Каскад настройки
        _cascade_settings_d = f"H1×{${cfg.hedgeCascadeM1 ?? 1.5}} H2×{${cfg.hedgeCascadeM2 ?? 1.5}} H3×{${cfg.hedgeCascadeM3 ?? 2.0}} | откат {${cfg.hedgePullbackPips ?? 5}} пип | проверка {${cfg.hedgeCheckInterval ?? 2}}с"
        _cascade_on_d = "✅ ВКЛ" if ${cfg.hedgeCascadeEnabled ? "True" : "False"} else "❌ выкл"
        # Последние 5 сделок
        _last5_d = ""
        if trade_log:
            for _tr in trade_log[-5:]:
                _mk = "✅" if _tr.get("won") else "❌"
                _last5_d += f"\\n  {_mk} {_tr.get('signal', '?')} | {_tr.get('profit', 0):+.2f}"
        else:
            _last5_d = "\\n  (сделок ещё не было)"
        # Время работы
        _start_t_d = globals().get('_bot_started_at', None)
        _uptime_d = "—"
        if _start_t_d:
            _ut = int(_t_diag.time() - _start_t_d)
            _uptime_d = f"{_ut//3600}ч {(_ut%3600)//60}м {_ut%60}с"
        _msg = (
            f"🔧 <b>[{BOT_NAME}] ДИАГНОСТИКА</b>\\n"
            f"━━━━━━━━━━━━━━━━━━━━\\n"
            f"<b>📊 Состояние:</b> {_state_d}\\n"
            f"<b>⏱ Аптайм:</b> {_uptime_d}\\n"
            f"<b>💰 Профит:</b> {total_profit:+.2f} {CURRENCY}\\n"
            f"<b>📈 Сделок:</b> {trades_today} (✅{_wins_d}/❌{_losses_d}) | WR: {_wr_d:.0f}%\\n"
            f"<b>⚙️ Ставка:</b> {_cur_bet_d} | <b>Серия:</b> {_streak_d:+d}\\n"
            f"<b>💱 Актив:</b> {ASSET} | <b>Цена:</b> {_price_d}\\n"
            f"<b>📡 Поток API:</b> {_sync_d} | <b>Тик:</b> {_last_tick_d}\\n"
            f"<b>⚡ FORCE:</b> {_force_d}\\n"
            f"━━━━━━━━━━━━━━━━━━━━\\n"
            f"<b>🛡 КАСКАДНЫЙ ХЕДЖ:</b> {_cascade_on_d}\\n"
            f"<i>{_cascade_settings_d}</i>\\n"
            f"━━━━━━━━━━━━━━━━━━━━\\n"
            f"<b>🧵 Asyncio задачи:</b>\\n<i>{_tasks_d}</i>\\n"
            f"━━━━━━━━━━━━━━━━━━━━\\n"
            f"<b>📋 Последние 5 сделок:</b>{_last5_d}\\n"
            f"━━━━━━━━━━━━━━━━━━━━\\n"
            f"<i>Если хедж молчит — проверь логи терминала на [CASCADE]</i>"
        )
        print(f"[DIAG] === ОТЧЁТ ===\\n{_msg}\\n[DIAG] === КОНЕЦ ===")
        tg(_msg)
    except Exception as _de:
        import traceback as _tb_d
        _err = f"❌ <b>[{BOT_NAME}] Ошибка диагностики</b>\\n{_de}"
        print(f"[DIAG] ❌ {_de}")
        print(_tb_d.format_exc())
        try: tg(_err)
        except: pass

def _handle_button_click(action_str, message_id, callback_id):
    """Обрабатывает нажатие inline-кнопки. action_str — содержимое callback_data."""
    global _tg_paused, _tg_stopped, _tg_force_pattern, _tg_force_at, _tg_pending_force, _tg_last_menu_id
    print(f"[TG_BTN] 🎯 click='{action_str}' msg_id={message_id} cb_id={callback_id[:8] if callback_id else '?'}")
    _tg_answer_callback(callback_id, "")
    if action_str == "pause":
        _tg_paused = True
        tg_delete_message(message_id)
        _tg_last_menu_id = None
        tg(f"⏸ <b>[{BOT_NAME}] на паузе</b>\\nЖду команду или нажатие ▶️ Продолжить")
        tg_show_main_menu()
    elif action_str == "resume":
        _tg_paused = False
        tg_delete_message(message_id)
        _tg_last_menu_id = None
        tg(f"▶️ <b>[{BOT_NAME}] возобновлён</b>")
        tg_show_main_menu()
    elif action_str == "stop":
        # Стоп — двухшаговое подтверждение через редактирование того же меню
        tg_edit_menu(
            message_id,
            f"⚠️ <b>[{BOT_NAME}] Точно остановить?</b>\\n\\nБот завершит работу полностью.",
            [[("✅ Да, СТОП", "stop:confirm")], [("❌ Отмена", "refresh")]]
        )
    elif action_str == "stop:confirm":
        _tg_stopped = True
        tg_delete_message(message_id)
        _tg_last_menu_id = None
        tg(f"🛑 <b>[{BOT_NAME}] остановлен</b>")
    elif action_str == "status":
        tg_delete_message(message_id)
        _tg_last_menu_id = None
        # Эмулируем команду /status — переиспользуем код из tg_poll_commands, но проще — собираем тут
        _wins_s = sum(1 for t in trade_log if t["won"])
        _wr_s = (_wins_s / trades_today * 100) if trades_today > 0 else 0
        _state_s = '⏸ На паузе' if _tg_paused else '▶️ Работает'
        _buf_s = globals().get('_live_buf') or globals().get('buf') or globals().get('_live_buffer')
        _last_price_line_s = ''
        if _buf_s is not None:
            _lp_s = getattr(_buf_s, 'last_price', 0)
            if _lp_s:
                _last_price_line_s = f"\\n💹 Цена: {_lp_s}"
        _chart_line_s = ''
        if trade_log:
            _last15_s = trade_log[-15:]
            _chart_s = ''.join('✅' if t['won'] else '❌' for t in _last15_s)
            _chart_line_s = f"\\n📊 Последние: {_chart_s}"
        tg(
            f"📊 <b>Статус [{BOT_NAME}]</b>\\n"
            f"💰 Профит: {total_profit:+.2f} {CURRENCY}\\n"
            f"📈 Сделок: {trades_today} (✅{_wins_s}/❌{trades_today-_wins_s}) | WR: {_wr_s:.0f}%\\n"
            f"⚙️ Ставка: {globals().get('current_bet', BASE_BET)} {CURRENCY} | {ASSET}\\n"
            f"{_state_s}{_last_price_line_s}{_chart_line_s}"
        )
        tg_show_main_menu()
    elif action_str == "profit":
        tg_delete_message(message_id)
        _tg_last_menu_id = None
        _wp = sum(1 for t in trade_log if t["won"])
        _lp_t = trades_today - _wp
        _wr_p = (_wp / trades_today * 100) if trades_today > 0 else 0
        _profits_p = [t["profit"] for t in trade_log] if trade_log else []
        _best = max(_profits_p) if _profits_p else 0
        _worst = min(_profits_p) if _profits_p else 0
        _emo = "🟢" if total_profit >= 0 else "🔴"
        tg(
            f"💰 <b>[{BOT_NAME}] Профит сегодня</b>\\n"
            f"━━━━━━━━━━━━━━━━━━━━\\n"
            f"{_emo} <b>{total_profit:+.2f} {CURRENCY}</b>\\n"
            f"📈 Сделок: {trades_today} (✅{_wp}/❌{_lp_t}) | WR: {_wr_p:.1f}%\\n"
            f"🏆 Лучшая: +{_best:.2f} {CURRENCY}\\n"
            f"💔 Худшая: {_worst:.2f} {CURRENCY}"
        )
        tg_show_main_menu()
    elif action_str == "summary":
        tg_delete_message(message_id)
        _tg_last_menu_id = None
        # Эмулируем /summary через искусственное сообщение
        _emulate_command(f"/summary {BOT_NAME}")
        tg_show_main_menu()
    elif action_str == "screenshot":
        tg_delete_message(message_id)
        _tg_last_menu_id = None
        _emulate_command(f"/screenshot {BOT_NAME}")
        tg_show_main_menu()
    elif action_str == "refresh":
        # Просто пересоздаём меню (с актуальной статой)
        tg_delete_message(message_id)
        _tg_last_menu_id = None
        tg_show_main_menu()
    elif action_str == "diag":
        tg_delete_message(message_id)
        _tg_last_menu_id = None
        _send_diag_report()
        tg_show_main_menu()
    elif action_str.startswith("startforce:"):
        # СТАРТОВЫЙ FORCE — без подтверждения, сразу ставим паттерн и пропускаем прогрев
        _patt = action_str.split(":", 1)[1]
        if _patt == "skip":
            _tg_pending_force = {"start_skip": True, "ts": __import__("time").time()}
            tg_delete_message(message_id)
            _tg_last_menu_id = None
            tg(f"⏭ <b>[{BOT_NAME}]</b> Пропуск стартового опроса — обычный прогрев (~2 мин)")
        elif _patt in ("UP_UP", "DOWN_DOWN", "UP_DOWN", "DOWN_UP"):
            _tg_force_pattern = _patt
            _tg_force_at = __import__("time").time()
            _tg_pending_force = {"start_done": True, "ts": _tg_force_at}
            tg_delete_message(message_id)
            _tg_last_menu_id = None
            _fmap_s = {"UP_UP": "🟢🟢 (зел-зел)", "DOWN_DOWN": "🔴🔴 (кр-кр)", "UP_DOWN": "🟢🔴 (зел-кр)", "DOWN_UP": "🔴🟢 (кр-зел)"}
            tg(
                f"⚡ <b>[{BOT_NAME}] СТАРТ С FORCE</b>\\n"
                f"━━━━━━━━━━━━━━━━━━━━\\n"
                f"🎯 Паттерн: <b>{_fmap_s.get(_patt, _patt)}</b>\\n"
                f"🚀 Иду торговать НЕМЕДЛЕННО (без прогрева)"
            )
    elif action_str.startswith("force:"):
        _patt = action_str.split(":", 1)[1]
        if _patt == "off":
            _tg_force_pattern = None
            _tg_force_at = 0
            _tg_pending_force = None
            tg_delete_message(message_id)
            _tg_last_menu_id = None
            tg(f"✅ <b>[{BOT_NAME}]</b> FORCE снят")
            tg_show_main_menu()
        elif _patt in ("UP_UP", "DOWN_DOWN", "UP_DOWN", "DOWN_UP"):
            # Подтверждение
            _tg_pending_force = {"pattern": _patt, "ts": __import__("time").time()}
            _fmap = {"UP_UP": "🟢🟢 (зел-зел)", "DOWN_DOWN": "🔴🔴 (кр-кр)", "UP_DOWN": "🟢🔴 (зел-кр)", "DOWN_UP": "🔴🟢 (кр-зел)"}
            tg_edit_menu(
                message_id,
                f"⚠️ <b>[{BOT_NAME}] Применить FORCE?</b>\\n━━━━━━━━━━━━━━━━━━━━\\n🎯 Паттерн: <b>{_fmap.get(_patt, _patt)}</b>\\n🔁 Применится <b>1 раз</b> на следующем тике\\nПосле сделки — авто-сброс.",
                [[("✅ Да, форсить!", f"force_confirm:{_patt}")], [("❌ Отмена", "refresh")]]
            )
        elif _patt.startswith("confirm:"):
            pass  # legacy, не используется
    elif action_str.startswith("force_confirm:"):
        _patt = action_str.split(":", 1)[1]
        if _patt in ("UP_UP", "DOWN_DOWN", "UP_DOWN", "DOWN_UP"):
            _tg_force_pattern = _patt
            _tg_force_at = __import__("time").time()
            _tg_pending_force = None
            tg_delete_message(message_id)
            _tg_last_menu_id = None
            _fmap2 = {"UP_UP": "🟢🟢 (зел-зел)", "DOWN_DOWN": "🔴🔴 (кр-кр)", "UP_DOWN": "🟢🔴 (зел-кр)", "DOWN_UP": "🔴🟢 (кр-зел)"}
            tg(
                f"⚡ <b>[{BOT_NAME}] FORCE АКТИВЕН</b>\\n"
                f"━━━━━━━━━━━━━━━━━━━━\\n"
                f"🎯 Паттерн: <b>{_fmap2.get(_patt, _patt)}</b>\\n"
                f"🔁 Применится на следующем тике (1 раз)"
            )
            tg_show_main_menu()

# Очередь искусственных команд (используется кнопками для переиспользования логики /summary, /screenshot)
_tg_emulated_queue = []
def _emulate_command(text):
    """Добавляет в очередь команду — она будет обработана как обычная текстовая (тем же кодом)."""
    _tg_emulated_queue.append(text)

def tg_poll_commands():
    """Получить новые команды и нажатия кнопок из Telegram"""
    global _tg_paused, _tg_stopped, _tg_offset, TAKE_PROFIT, STOP_LOSS, BASE_BET
    global _tg_force_pattern, _tg_force_at
    if not TG_ENABLED:
        return
    import urllib.request, json as _json
    try:
        url = f"https://api.telegram.org/bot{TG_TOKEN}/getUpdates?offset={_tg_offset}&timeout=1&limit=10"
        resp = urllib.request.urlopen(url, timeout=5).read()
        data = _json.loads(resp)
        _bot_name_lower = BOT_NAME.lower()
        for upd in data.get("result", []):
            _tg_offset = upd["update_id"] + 1
            # ===== CALLBACK_QUERY (нажатия inline-кнопок) =====
            cq = upd.get("callback_query")
            if cq:
                cq_chat = str(cq.get("message", {}).get("chat", {}).get("id", ""))
                if cq_chat != str(TG_CHAT_ID):
                    continue
                cq_data = cq.get("data", "")
                cq_msg_id = cq.get("message", {}).get("message_id")
                cq_id = cq.get("id")
                try:
                    _handle_button_click(cq_data, cq_msg_id, cq_id)
                except Exception as _be:
                    print(f"[TG_BTN] Ошибка обработки кнопки '{cq_data}': {_be}")
                continue
            # ===== ОБЫЧНЫЕ ТЕКСТОВЫЕ СООБЩЕНИЯ =====
            msg = upd.get("message", {})
            text = msg.get("text", "").strip()
            chat = str(msg.get("chat", {}).get("id", ""))
            if chat != str(TG_CHAT_ID):
                continue
            parts = text.split()
            if not parts:
                continue
            cmd = parts[0].lower()
            target = parts[1].lower() if len(parts) > 1 else ""
            val = parts[1] if len(parts) > 1 else ""
            for_me = (target == _bot_name_lower or target == "all" or target == "")
            if cmd == "/stop" and for_me:
                _tg_stopped = True
                tg(f"🛑 <b>[{BOT_NAME}] остановлен</b>\\n📤 Отправляю отчёт за день...")
                try:
                    import threading as _thr
                    _thr.Thread(target=tg_send_report_file, daemon=True).start()
                except Exception as _se:
                    print(f"[REPORT] auto-send err: {_se}")
            elif cmd == "/diag" and for_me:
                _send_diag_report()
            elif cmd == "/pause" and for_me:
                _tg_paused = True
                tg(f"⏸ <b>[{BOT_NAME}] на паузе.</b> /resume {BOT_NAME} для продолжения")
            elif cmd == "/resume" and for_me:
                _tg_paused = False
                tg(f"▶️ <b>[{BOT_NAME}] возобновлён</b>")
            elif cmd == "/status" and for_me:
                wins_s = sum(1 for t in trade_log if t["won"])
                _wr_s = (wins_s / trades_today * 100) if trades_today > 0 else 0
                _state = '⏸ На паузе' if _tg_paused else '▶️ Работает'
                # Подтягиваем буфер из глобалов (имя различается между ботами)
                _buf_g = globals().get('_live_buf') or globals().get('buf') or globals().get('_live_buffer')
                _ts_line = ''; _last_price_line = ''; _sync_line = ''
                if _buf_g is not None:
                    _ts = getattr(_buf_g, 'time_shift', None)
                    if _ts is not None:
                        _h = int(abs(_ts) // 3600); _m = int((abs(_ts) % 3600) // 60)
                        _sign = '+' if _ts >= 0 else '-'
                        _ts_line = f"\\n🕐 Сдвиг часов: {_sign}{_h}ч{_m:02d}м"
                    _lp = getattr(_buf_g, 'last_price', 0)
                    if _lp:
                        _last_price_line = f"\\n💹 Цена: {_lp}"
                    _sync_warn = getattr(_buf_g, 'sync_warn', False)
                    _sync_line = "\\n⚠️ Поток API завис" if _sync_warn else "\\n✅ Поток свечей живой"
                _cur_bet_g = globals().get('current_bet', BASE_BET)
                # Мини-график последних 15 сделок + текущая серия
                _chart_line = ''
                if trade_log:
                    _last15 = trade_log[-15:]
                    _chart = ''.join('✅' if t['won'] else '❌' for t in _last15)
                    _streak_g = globals().get('cur_streak', 0)
                    if _streak_g > 0:
                        _streak_emoji = f"🔥 серия побед: {_streak_g}"
                    elif _streak_g < 0:
                        _streak_emoji = f"❄️ серия проигрышей: {abs(_streak_g)}"
                    else:
                        _streak_emoji = "—"
                    _chart_line = f"\\n📊 Последние: {_chart}\\n{_streak_emoji}"
                tg(
                    f"📊 <b>Статус [{BOT_NAME}]</b>\\n"
                    f"💰 Профит: {total_profit:+.2f} {CURRENCY}\\n"
                    f"📈 Сделок: {trades_today} (✅{wins_s}/❌{trades_today-wins_s}) | WR: {_wr_s:.0f}%\\n"
                    f"⚙️ Ставка: {_cur_bet_g} {CURRENCY} | Актив: {ASSET}\\n"
                    f"{_state}"
                    f"{_sync_line}{_ts_line}{_last_price_line}"
                    f"{_chart_line}"
                )
            elif cmd == "/report" and for_me:
                try:
                    _today = datetime.now().strftime("%Y-%m-%d")
                    _file = os.path.join(_REPORTS_DIR, f"trades_{_today}.jsonl")
                    if not os.path.exists(_file):
                        tg(f"📊 <b>[{BOT_NAME}] Отчёт за {_today}</b>\\nПока нет данных за сегодня.")
                    else:
                        _trades, _cascades, _hedges = [], [], []
                        with open(_file, encoding="utf-8") as _fr:
                            for _line in _fr:
                                try:
                                    _e = _json_rep.loads(_line)
                                    if _e.get("bot") != BOT_NAME: continue
                                    _t = _e.get("type")
                                    if _t == "trade": _trades.append(_e)
                                    elif _t == "cascade_summary": _cascades.append(_e)
                                    elif _t == "hedge_open": _hedges.append(_e)
                                except: pass
                        _tcount = len(_trades)
                        _twins = sum(1 for t in _trades if t.get("main_won"))
                        _twr = round(_twins / _tcount * 100, 1) if _tcount else 0
                        _tpnl = round(sum(t.get("total_pnl", 0) for t in _trades), 2)
                        _troi_avg = round(sum(t.get("total_roi_pct", 0) for t in _trades) / _tcount, 1) if _tcount else 0
                        _ccount = len(_cascades)
                        _cwins_total = sum(c.get("wins", 0) for c in _cascades)
                        _closs_total = sum(c.get("losses", 0) for c in _cascades)
                        _ch_total = _cwins_total + _closs_total
                        _cwr = round(_cwins_total / _ch_total * 100, 1) if _ch_total else 0
                        _cpnl = round(sum(c.get("total_pnl", 0) for c in _cascades), 2)
                        _cprofitable = sum(1 for c in _cascades if c.get("total_pnl", 0) > 0)
                        _cprofitable_pct = round(_cprofitable / _ccount * 100, 1) if _ccount else 0
                        _h2 = [h for h in _hedges if h.get("level") == "H2"]
                        _h3 = [h for h in _hedges if h.get("level") == "H3"]
                        _h2_avg_pips = round(sum(h.get("pips_from_strike", 0) for h in _h2) / len(_h2), 1) if _h2 else 0
                        _h3_avg_pips = round(sum(h.get("pips_from_strike", 0) for h in _h3) / len(_h3), 1) if _h3 else 0
                        _h2_avg_pct = round(sum(abs(h.get("pct_move_from_strike", 0)) for h in _h2) / len(_h2), 4) if _h2 else 0
                        _best = max(_trades, key=lambda x: x.get("total_pnl", 0)) if _trades else None
                        _worst = min(_trades, key=lambda x: x.get("total_pnl", 0)) if _trades else None
                        _best_str = f"+{_best['total_pnl']:.2f} (ROI {_best.get('total_roi_pct',0):+.1f}%)" if _best else "—"
                        _worst_str = f"{_worst['total_pnl']:.2f} (ROI {_worst.get('total_roi_pct',0):+.1f}%)" if _worst else "—"
                        _err_lines = ""
                        if _strategy_err_count:
                            _err_lines = "\\n⚠️ Ошибки стратегий: " + ", ".join(f"{k}({v})" for k,v in _strategy_err_count.items())
                        tg(
                            f"📊 <b>[{BOT_NAME}] Отчёт за {_today}</b>\\n"
                            f"━━━━━━━━━━━━━━━━━━━━\\n"
                            f"📈 <b>СДЕЛКИ:</b>\\n"
                            f"• Всего: <b>{_tcount}</b> (✅{_twins}/❌{_tcount-_twins}) WR <b>{_twr}%</b>\\n"
                            f"• P&L: <b>{_tpnl:+.2f} {CURRENCY}</b> | сред. ROI: <b>{_troi_avg:+.1f}%</b>\\n"
                            f"• Лучшая: {_best_str}\\n"
                            f"• Худшая: {_worst_str}\\n"
                            f"━━━━━━━━━━━━━━━━━━━━\\n"
                            f"🛡 <b>КАСКАДЫ:</b>\\n"
                            f"• Запусков: <b>{_ccount}</b> | прибыльных: <b>{_cprofitable}</b> ({_cprofitable_pct}%)\\n"
                            f"• Хеджей всего: <b>{_ch_total}</b> (✅{_cwins_total}/❌{_closs_total}) WR <b>{_cwr}%</b>\\n"
                            f"• Итог каскадов: <b>{_cpnl:+.2f} {CURRENCY}</b>\\n"
                            f"━━━━━━━━━━━━━━━━━━━━\\n"
                            f"📐 <b>ПИПСЫ ХЕДЖЕЙ:</b>\\n"
                            f"• H2 откр.: ср. <b>{_h2_avg_pips} пип</b> от страйка ({_h2_avg_pct}%)\\n"
                            f"• H3 откр.: ср. <b>{_h3_avg_pips} пип</b> от страйка\\n"
                            f"━━━━━━━━━━━━━━━━━━━━\\n"
                            f"💾 Файл: <code>reports/trades_{_today}.jsonl</code>"
                            f"{_err_lines}"
                        )
                except Exception as _re:
                    tg(f"❌ <b>Ошибка отчёта:</b> {_re}")
            elif cmd == "/sendreport" and for_me:
                # Отправить JSONL-файл отчёта в TG
                _date = val if val else datetime.now().strftime("%Y-%m-%d")
                tg(f"📤 <b>[{BOT_NAME}]</b> Отправляю файл отчёта за {_date}...")
                try:
                    import threading as _thr
                    _thr.Thread(target=tg_send_report_file, args=(_date,), daemon=True).start()
                except Exception as _se:
                    tg(f"❌ Ошибка: {_se}")
            elif cmd == "/settp" and for_me:
                try:
                    TAKE_PROFIT = float(val)
                    tg(f"✅ <b>[{BOT_NAME}]</b> Take Profit: <b>{TAKE_PROFIT} {CURRENCY}</b>")
                except:
                    tg(f"❌ Формат: /settp {BOT_NAME} 50")
            elif cmd == "/setsl" and for_me:
                try:
                    STOP_LOSS = float(val)
                    tg(f"✅ <b>[{BOT_NAME}]</b> Stop Loss: <b>{STOP_LOSS} {CURRENCY}</b>")
                except:
                    tg(f"❌ Формат: /setsl {BOT_NAME} 20")
            elif cmd == "/setbet" and for_me:
                try:
                    BASE_BET = float(val)
                    tg(f"✅ <b>[{BOT_NAME}]</b> Ставка: <b>{BASE_BET} {CURRENCY}</b>")
                except:
                    tg(f"❌ Формат: /setbet {BOT_NAME} 10")
            elif cmd == "/summary" and for_me:
                # ===== ПОЛНЫЙ ОТЧЁТ ЗА СЕССИЮ =====
                _total = len(trade_log)
                if _total == 0:
                    tg(f"📋 <b>[{BOT_NAME}] Отчёт</b>\\nЕщё не было ни одной сделки. Жду сигналов...")
                else:
                    _wins = sum(1 for t in trade_log if t["won"])
                    _losses = _total - _wins
                    _wr = _wins / _total * 100
                    _profits = [t["profit"] for t in trade_log]
                    _best = max(_profits)
                    _worst = min(_profits)
                    _avg = sum(_profits) / _total
                    _full_wins = sum(1 for t in trade_log if t.get("full_win"))
                    _saved = sum(1 for t in trade_log if (t.get("main_won") is False) and t["won"])
                    _main_wins = sum(1 for t in trade_log if t.get("main_won"))
                    _wins_in_a_row = 0; _max_wins_streak = 0
                    _losses_in_a_row = 0; _max_losses_streak = 0
                    for _t in trade_log:
                        if _t["won"]:
                            _wins_in_a_row += 1; _losses_in_a_row = 0
                            _max_wins_streak = max(_max_wins_streak, _wins_in_a_row)
                        else:
                            _losses_in_a_row += 1; _wins_in_a_row = 0
                            _max_losses_streak = max(_max_losses_streak, _losses_in_a_row)
                    _hc = globals().get("hedge_count", 0); _hw = globals().get("hedge_wins", 0)
                    _ec = globals().get("ext_count", 0);   _ew = globals().get("ext_wins", 0)
                    _cs = globals().get("cur_streak", 0)
                    _hedge_wr = (_hw / _hc * 100) if _hc > 0 else 0
                    _ext_wr = (_ew / _ec * 100) if _ec > 0 else 0
                    if total_profit >= 0:
                        _ppct = min(100, int(total_profit / TAKE_PROFIT * 100)) if TAKE_PROFIT > 0 else 0
                        _pbar = "🟩" * (_ppct // 10) + "⬜" * (10 - _ppct // 10)
                        _plbl = f"до TP: {_ppct}%"
                    else:
                        _ppct = min(100, int(abs(total_profit) / STOP_LOSS * 100)) if STOP_LOSS > 0 else 0
                        _pbar = "🟥" * (_ppct // 10) + "⬜" * (10 - _ppct // 10)
                        _plbl = f"до SL: {_ppct}%"
                    _hedge_line = f"\\n🛡️ Хедж: {_hw}/{_hc} ({_hedge_wr:.0f}%) | спасений: {_saved}" if _hc > 0 else ""
                    _ext_line = f"\\n📈 Расширение: {_ew}/{_ec} ({_ext_wr:.0f}%)" if _ec > 0 else ""
                    _streak_str = f"🔥 +{_cs}" if _cs > 0 else (f"❄️ {_cs}" if _cs < 0 else "—")
                    tg(
                        f"📋 <b>[{BOT_NAME}] Полный отчёт</b>\\n"
                        f"━━━━━━━━━━━━━━━━━━━━\\n"
                        f"💰 <b>Профит сессии:</b> {total_profit:+.2f} {CURRENCY}\\n"
                        f"{_pbar} {_plbl}\\n"
                        f"━━━━━━━━━━━━━━━━━━━━\\n"
                        f"📊 <b>Сделки</b>\\n"
                        f"  Всего: <b>{_total}</b> (✅{_wins} / ❌{_losses})\\n"
                        f"  Winrate: <b>{_wr:.1f}%</b>\\n"
                        f"  🎯 Полных побед: {_full_wins}\\n"
                        f"  ✅ Чистых WIN основной: {_main_wins}{_hedge_line}{_ext_line}\\n"
                        f"━━━━━━━━━━━━━━━━━━━━\\n"
                        f"💹 <b>Профит-аналитика</b>\\n"
                        f"  🏆 Лучший трейд: <b>+{_best:.2f}</b>\\n"
                        f"  💔 Худший трейд: <b>{_worst:.2f}</b>\\n"
                        f"  📊 Средний: <b>{_avg:+.2f}</b>\\n"
                        f"━━━━━━━━━━━━━━━━━━━━\\n"
                        f"🔥 <b>Серии</b>\\n"
                        f"  Макс побед подряд: <b>{_max_wins_streak}</b>\\n"
                        f"  Макс поражений: <b>{_max_losses_streak}</b>\\n"
                        f"  Текущая: <b>{_streak_str}</b>\\n"
                        f"━━━━━━━━━━━━━━━━━━━━\\n"
                        f"⚙️ Текущая ставка: <b>{current_bet} {CURRENCY}</b>"
                    )
            elif cmd == "/pool":
                # Показываем содержимое общего пула свечей (общее знание между ботами)
                try:
                    _pdata = _pool_load()
                    _now_p = __import__("time").time()
                    if not _pdata:
                        tg(f"📊 <b>Пул свечей пуст</b>\\n\\nЕщё ни один бот не успел сохранить свечи. После пары тиков здесь появятся данные.")
                    else:
                        _lines = ["📊 <b>Общий пул свечей</b>", "━━━━━━━━━━━━━━━━━━━━"]
                        for _k in sorted(_pdata.keys()):
                            _e = _pdata[_k] or {}
                            _cs = _e.get("candles", [])
                            _age = int(_now_p - _e.get("updated_at", 0))
                            _fresh = "🟢" if _age < _POOL_FRESH_SEC else "🔴"
                            _last_close = _cs[-1].get("c") if _cs else "—"
                            _lines.append(f"{_fresh} <code>{_k}</code> | <b>{len(_cs)}</b> свечей | возраст {_age}с | last={_last_close}")
                        _lines.append("━━━━━━━━━━━━━━━━━━━━")
                        _lines.append(f"🟢 свежие (&lt;{_POOL_FRESH_SEC}с)  🔴 устаревшие")
                        tg("\\n".join(_lines))
                except Exception as _pe:
                    tg(f"❌ <b>Ошибка чтения пула:</b> {_pe}")
            elif cmd == "/profit" and for_me:
                # ===== ПРОФИТ ЗА СЕГОДНЯ =====
                _wins_p = sum(1 for t in trade_log if t["won"])
                _losses_p = trades_today - _wins_p
                _wr_p = (_wins_p / trades_today * 100) if trades_today > 0 else 0
                _profits_p = [t["profit"] for t in trade_log] if trade_log else []
                _best_p = max(_profits_p) if _profits_p else 0
                _worst_p = min(_profits_p) if _profits_p else 0
                _emoji_p = "🟢" if total_profit >= 0 else "🔴"
                tg(
                    f"💰 <b>[{BOT_NAME}] Профит сегодня</b>\\n"
                    f"━━━━━━━━━━━━━━━━━━━━\\n"
                    f"{_emoji_p} <b>{total_profit:+.2f} {CURRENCY}</b>\\n"
                    f"━━━━━━━━━━━━━━━━━━━━\\n"
                    f"📈 Сделок: {trades_today} (✅{_wins_p} / ❌{_losses_p})\\n"
                    f"🎯 WR: {_wr_p:.1f}%\\n"
                    f"🏆 Лучшая: +{_best_p:.2f} {CURRENCY}\\n"
                    f"💔 Худшая: {_worst_p:.2f} {CURRENCY}"
                )
            elif cmd == "/screenshot" and for_me:
                # ===== ASCII-ГРАФИК ПОСЛЕДНИХ СВЕЧЕЙ =====
                _buf_g = globals().get('_live_buf') or globals().get('buf') or globals().get('_live_buffer')
                _candles_g = []
                if _buf_g is not None:
                    _candles_g = list(getattr(_buf_g, 'candles', []) or [])
                if not _candles_g:
                    _candles_g = list(globals().get('_candle_cache', []) or [])
                if not _candles_g:
                    tg(f"📊 <b>[{BOT_NAME}] Скриншот</b>\\n\\nЕщё нет закрытых свечей. Подожди пару минут.")
                else:
                    _last_n = _candles_g[-10:]
                    _ohlc = []
                    for _c in _last_n:
                        if hasattr(_c, 'open'):
                            _ohlc.append((float(_c.open), float(_c.high), float(_c.low), float(_c.close), getattr(_c, 'time', None)))
                        elif isinstance(_c, dict):
                            _ohlc.append((float(_c.get('open', _c.get('o', 0))), float(_c.get('high', _c.get('h', 0))), float(_c.get('low', _c.get('l', 0))), float(_c.get('close', _c.get('c', 0))), _c.get('time')))
                        else:
                            _ohlc.append((float(_c[0]), float(_c[1]), float(_c[2]), float(_c[3]), _c[4] if len(_c) >= 5 else None))
                    _all_h = [_o[1] for _o in _ohlc]
                    _all_l = [_o[2] for _o in _ohlc]
                    _hi = max(_all_h); _lo = min(_all_l)
                    _rng = _hi - _lo if _hi > _lo else 0.00001
                    _rows = 8
                    _grid = [[" "] * len(_ohlc) for _ in range(_rows)]
                    for _i, (_op, _hh, _ll, _cl, _) in enumerate(_ohlc):
                        _y_op = int(round((_hi - _op) / _rng * (_rows - 1)))
                        _y_cl = int(round((_hi - _cl) / _rng * (_rows - 1)))
                        _y_hh = int(round((_hi - _hh) / _rng * (_rows - 1)))
                        _y_ll = int(round((_hi - _ll) / _rng * (_rows - 1)))
                        _ch = "🟢" if _cl >= _op else "🔴"
                        _y_top = min(_y_op, _y_cl); _y_bot = max(_y_op, _y_cl)
                        for _y in range(_y_hh, _y_ll + 1):
                            if _y_top <= _y <= _y_bot:
                                _grid[_y][_i] = _ch
                            else:
                                _grid[_y][_i] = "│"
                    _chart_lines = ["".join(_row) for _row in _grid]
                    _last_close = _ohlc[-1][3]
                    _last_color = "🟢" if _ohlc[-1][3] >= _ohlc[-1][0] else "🔴"
                    _trend_now = globals().get('_last_trend')
                    _trend_label = {"UP_UP": "🟢🟢 ↑↑", "DOWN_DOWN": "🔴🔴 ↓↓", "UP_DOWN": "🟢🔴 ↑↓", "DOWN_UP": "🔴🟢 ↓↑"}.get(_trend_now, "—")
                    _force_line = ""
                    if _tg_force_pattern:
                        _, _fh = _force_alias_to_pattern(_tg_force_pattern.replace("UP_UP", "gg").replace("DOWN_DOWN", "rr").replace("UP_DOWN", "gr").replace("DOWN_UP", "rg"))
                        _force_line = f"\\n⚡ FORCE: {_fh or _tg_force_pattern} (одноразово)"
                    tg(
                        f"📊 <b>[{BOT_NAME}] График</b>\\n"
                        f"<code>{chr(10).join(_chart_lines)}</code>\\n"
                        f"━━━━━━━━━━━━━━━━━━━━\\n"
                        f"📉 Hi: <b>{_hi:.5f}</b>\\n"
                        f"📈 Lo: <b>{_lo:.5f}</b>\\n"
                        f"💹 Last: {_last_color} <b>{_last_close:.5f}</b>\\n"
                        f"🎯 Тренд: {_trend_label}\\n"
                        f"⏱ Свечей: {len(_ohlc)} (из {len(_candles_g)})"
                        f"{_force_line}"
                    )
            elif cmd == "/force" and for_me:
                # ===== ФОРС ЦВЕТА 2 СВЕЧЕЙ (одноразово) =====
                if val.lower() in ("off", "выкл", "stop", "none", ""):
                    if _tg_force_pattern:
                        _tg_force_pattern = None
                        _tg_force_at = 0
                        tg(f"✅ <b>[{BOT_NAME}]</b> FORCE СНЯТ. Возвращаюсь к реальным свечам.")
                    else:
                        tg(f"ℹ️ <b>[{BOT_NAME}]</b> FORCE и так не активен.")
                else:
                    _patt, _human = _force_alias_to_pattern(val)
                    if _patt:
                        _tg_force_pattern = _patt
                        _tg_force_at = __import__("time").time()
                        tg(
                            f"⚡ <b>[{BOT_NAME}] FORCE АКТИВЕН</b>\\n"
                            f"━━━━━━━━━━━━━━━━━━━━\\n"
                            f"🎯 Паттерн: <b>{_human}</b>\\n"
                            f"🔁 Применится <b>1 раз</b> на следующем цикле\\n"
                            f"После сделки — авто-сброс, продолжу на реальных данных.\\n\\n"
                            f"Отмена: /force {BOT_NAME} off"
                        )
                    else:
                        tg(
                            f"❌ <b>[{BOT_NAME}]</b> Неизвестный паттерн: <code>{val}</code>\\n\\n"
                            f"<b>Доступные:</b>\\n"
                            f"/force {BOT_NAME} gg — 🟢🟢 (зел-зел)\\n"
                            f"/force {BOT_NAME} rr — 🔴🔴 (кр-кр)\\n"
                            f"/force {BOT_NAME} gr — 🟢🔴 (зел-кр)\\n"
                            f"/force {BOT_NAME} rg — 🔴🟢 (кр-зел)\\n"
                            f"/force {BOT_NAME} off — отменить"
                        )
            elif cmd == "/menu" and for_me:
                # Показать (или пересоздать) inline-меню с кнопками
                try:
                    tg_show_main_menu()
                except Exception as _me2:
                    tg(f"❌ <b>[{BOT_NAME}]</b> Не удалось показать меню: {_me2}")
            elif cmd == "/help":
                tg(
                    f"📋 <b>Команды [{BOT_NAME}]:</b>\\n"
                    f"━━━ <b>🎮 Меню кнопок</b> ━━━\\n"
                    f"/menu {BOT_NAME} — открыть пульт с кнопками\\n"
                    f"<i>(меню само появляется после каждой сделки)</i>\\n"
                    f"━━━ <b>Управление</b> ━━━\\n"
                    f"/stop {BOT_NAME} — остановить\\n"
                    f"/pause {BOT_NAME} — пауза\\n"
                    f"/resume {BOT_NAME} — продолжить\\n"
                    f"━━━ <b>Информация</b> ━━━\\n"
                    f"/status {BOT_NAME} — статус (профит, WR, цена)\\n"
                    f"/profit {BOT_NAME} — профит за сегодня\\n"
                    f"/summary {BOT_NAME} — полный отчёт сессии\\n"
                    f"/screenshot {BOT_NAME} — ASCII-график\\n"
                    f"/pool — общий пул свечей\\n"
                    f"━━━ <b>Настройки</b> ━━━\\n"
                    f"/settp {BOT_NAME} 50 — Take Profit\\n"
                    f"/setsl {BOT_NAME} 20 — Stop Loss\\n"
                    f"/setbet {BOT_NAME} 10 — базовая ставка\\n"
                    f"━━━ <b>⚡ FORCE (одноразово)</b> ━━━\\n"
                    f"/force {BOT_NAME} gg — 🟢🟢\\n"
                    f"/force {BOT_NAME} rr — 🔴🔴\\n"
                    f"/force {BOT_NAME} gr — 🟢🔴\\n"
                    f"/force {BOT_NAME} rg — 🔴🟢\\n"
                    f"/force {BOT_NAME} off — отменить\\n\\n"
                    f"<i>Вместо имени можно писать all — для всех ботов</i>"
                )
        # ===== ОБРАБОТКА ЭМУЛИРОВАННЫХ КОМАНД (от inline-кнопок) =====
        if _tg_emulated_queue:
            _emu_list = list(_tg_emulated_queue)
            _tg_emulated_queue.clear()
            for _emu_text in _emu_list:
                _eparts = _emu_text.split()
                if not _eparts:
                    continue
                _ecmd = _eparts[0].lower()
                _etarget = _eparts[1].lower() if len(_eparts) > 1 else ""
                _eval = _eparts[1] if len(_eparts) > 1 else ""
                # рекурсивно отправляем команду как фейковое сообщение через сам poll нельзя — у нас нет message-структуры.
                # Используем минимальный диспетчер для нужных команд:
                if _ecmd == "/summary":
                    _emu_total = len(trade_log)
                    if _emu_total == 0:
                        tg(f"📋 <b>[{BOT_NAME}] Отчёт</b>\\nЕщё не было ни одной сделки.")
                    else:
                        _ew_ = sum(1 for t in trade_log if t["won"])
                        _el_ = _emu_total - _ew_
                        _ewr_ = _ew_ / _emu_total * 100
                        _eprofits = [t["profit"] for t in trade_log]
                        _ebest = max(_eprofits); _eworst = min(_eprofits); _eavg = sum(_eprofits) / _emu_total
                        tg(
                            f"📋 <b>[{BOT_NAME}] Отчёт сессии</b>\\n"
                            f"━━━━━━━━━━━━━━━━━━━━\\n"
                            f"💰 Профит: <b>{total_profit:+.2f} {CURRENCY}</b>\\n"
                            f"📊 Сделок: <b>{_emu_total}</b> (✅{_ew_}/❌{_el_}) | WR: <b>{_ewr_:.1f}%</b>\\n"
                            f"🏆 Лучший: +{_ebest:.2f} | 💔 Худший: {_eworst:.2f}\\n"
                            f"📊 Средний: {_eavg:+.2f}"
                        )
                elif _ecmd == "/screenshot":
                    _ebuf = globals().get('_live_buf') or globals().get('buf') or globals().get('_live_buffer')
                    _ec_list = list(getattr(_ebuf, 'candles', []) or []) if _ebuf else []
                    if not _ec_list:
                        _ec_list = list(globals().get('_candle_cache', []) or [])
                    if not _ec_list:
                        tg(f"📊 <b>[{BOT_NAME}] График</b>\\nЕщё нет закрытых свечей.")
                    else:
                        _last10 = _ec_list[-10:]
                        _ohlc2 = []
                        for _ec in _last10:
                            if hasattr(_ec, 'open'):
                                _ohlc2.append((float(_ec.open), float(_ec.high), float(_ec.low), float(_ec.close)))
                            elif isinstance(_ec, dict):
                                _ohlc2.append((float(_ec.get('open', _ec.get('o', 0))), float(_ec.get('high', _ec.get('h', 0))), float(_ec.get('low', _ec.get('l', 0))), float(_ec.get('close', _ec.get('c', 0)))))
                            else:
                                _ohlc2.append((float(_ec[0]), float(_ec[1]), float(_ec[2]), float(_ec[3])))
                        _hi2 = max(_o[1] for _o in _ohlc2); _lo2 = min(_o[2] for _o in _ohlc2)
                        _rng2 = _hi2 - _lo2 if _hi2 > _lo2 else 0.00001
                        _rows2 = 8
                        _grid2 = [[" "] * len(_ohlc2) for _ in range(_rows2)]
                        for _i2, (_o2, _h2, _l2, _c2) in enumerate(_ohlc2):
                            _y_top = int(round((_hi2 - max(_o2, _c2)) / _rng2 * (_rows2 - 1)))
                            _y_bot = int(round((_hi2 - min(_o2, _c2)) / _rng2 * (_rows2 - 1)))
                            _y_hh2 = int(round((_hi2 - _h2) / _rng2 * (_rows2 - 1)))
                            _y_ll2 = int(round((_hi2 - _l2) / _rng2 * (_rows2 - 1)))
                            _ch2 = "🟢" if _c2 >= _o2 else "🔴"
                            for _y2 in range(_y_hh2, _y_ll2 + 1):
                                if _y_top <= _y2 <= _y_bot:
                                    _grid2[_y2][_i2] = _ch2
                                else:
                                    _grid2[_y2][_i2] = "│"
                        _chart2 = "\\n".join("".join(r) for r in _grid2)
                        tg(
                            f"📊 <b>[{BOT_NAME}] График</b>\\n"
                            f"<code>{_chart2}</code>\\n"
                            f"━━━━━━━━━━━━━━━━━━━━\\n"
                            f"📉 Hi: <b>{_hi2:.5f}</b> | 📈 Lo: <b>{_lo2:.5f}</b>\\n"
                            f"⏱ Свечей: {len(_ohlc2)}"
                        )
    except Exception:
        pass

# ===== СОСТОЯНИЕ =====
total_profit  = 0.0
trades_today  = 0
trade_log     = []
calls_follow  = 0
calls_reverse = 0
rejected_signals  = 0
rejected_no_trend = 0
rejected_conflict = 0
_last_report_time = 0
hedge_count   = 0
hedge_wins    = 0
ext_count     = 0
ext_wins      = 0
cur_streak    = 0   # >0 = серия побед, <0 = серия поражений
insufficient_funds_count = 0   # Подряд идущих "недостаточно средств"
INSUFFICIENT_FUNDS_LIMIT = 5   # После N подряд — авто-стоп
${martingaleBlock}
# ===== ТРЕНД ПО 2 ПОСЛЕДНИМ СВЕЧАМ =====
_last_trend = None

# ===== КЭШ СВЕЧЕЙ =====
_candle_cache     = []
_candle_asset     = None
_last_candle_time = None
_resolved_asset   = None

def candle_color(c):
    return "UP" if c[3] >= c[0] else "DOWN"

def get_trend(candles):
    closed = candles[:-1]
    if len(closed) < 2:
        return None
    window2 = closed[-2:]
    c2, c3 = [candle_color(c) for c in window2]
    e2 = "🟢" if c2 == "UP" else "🔴"
    e3 = "🟢" if c3 == "UP" else "🔴"
    w2, w3 = window2
    def _ts_fmt(c):
        try:
            t = c[4] if len(c) >= 5 else 0
            if hasattr(t, 'strftime'):
                return t.strftime('%H:%M:%S')
            if isinstance(t, (int, float)) and t > 0:
                _t = float(t)
                if _t > 1e12:
                    _t = _t / 1000.0
                return datetime.fromtimestamp(_t).strftime('%H:%M:%S')
        except Exception:
            pass
        return "??:??:??"
    def fmt(c, e):
        return f"{e} t={_ts_fmt(c)} o={c[0]:.5f} c={c[3]:.5f} Δ={c[3]-c[0]:+.5f}"
    cur   = candles[-1]
    window5 = closed[-5:] if len(closed) >= 5 else closed
    colors5 = [candle_color(c) for c in window5]
    ups5   = colors5.count("UP")
    downs5 = colors5.count("DOWN")
    bar   = "".join("🟢" if col == "UP" else "🔴" for col in colors5)
    cur_emoji = "🟢" if cur[3] >= cur[0] else "🔴"
    _times5 = " ".join(_ts_fmt(c) for c in window5)
    print(f"[СВЕЧИ] таймфрейм={EXPIRY_SEC}с ({EXPIRY_SEC//60}мин) | {bar} (▲{ups5}/▼{downs5}) | текущая: {cur_emoji} | времена закр.: {_times5}")
    print(f"[АНАЛИЗ] Свеча -2: {fmt(w2, e2)}")
    print(f"[АНАЛИЗ] Свеча -1: {fmt(w3, e3)}  ← последняя закрытая")
    if c2 == "UP" and c3 == "UP":
        print(f"[ТРЕНД]  {e2}{e3} → UP_UP (2 зелёных подряд)")
        return "UP_UP"
    if c2 == "DOWN" and c3 == "DOWN":
        print(f"[ТРЕНД]  {e2}{e3} → DOWN_DOWN (2 красных подряд)")
        return "DOWN_DOWN"
    if c2 == "DOWN" and c3 == "UP":
        print(f"[ТРЕНД]  {e2}{e3} → DOWN_UP (разворот вверх)")
        return "DOWN_UP"
    if c2 == "UP" and c3 == "DOWN":
        print(f"[ТРЕНД]  {e2}{e3} → UP_DOWN (разворот вниз)")
        return "UP_DOWN"
    print(f"[ТРЕНД]  {e2}{e3} → нет чёткого паттерна, пропуск")
    return None

def trend_to_signal(trend):
    sig = None
    if TREND_MODE == "any":
        if trend in ("UP_UP", "DOWN_UP"):
            sig = "CALL"
        elif trend in ("DOWN_DOWN", "UP_DOWN"):
            sig = "PUT"
    elif TREND_MODE == "same":
        if trend == "UP_UP":
            sig = "CALL"
        elif trend == "DOWN_DOWN":
            sig = "PUT"
    else:
        if trend == "DOWN_UP":
            sig = "CALL"
        elif trend == "UP_DOWN":
            sig = "PUT"
    if sig and TREND_FOLLOW == "reverse":
        sig = "PUT" if sig == "CALL" else "CALL"
    return sig

def check_trend_change(candles):
    global _last_trend
    trend = get_trend(candles)
    if trend and trend != _last_trend:
        old = _last_trend
        _last_trend = trend
        return trend, old
    _last_trend = trend
    return None, None

${strategyFunctions[cfg.strategy]}

${buildTradeBaseFiltersBlock(cfg)}

async def try_get_candles(client, asset_name):
    """Попытка получить свечи, с авто-переподключением при обрыве"""
    for attempt in range(3):
        try:
            raw = await client.get_candles(asset=asset_name, timeframe=${cfg.candleTimeframe ?? 60}, count=60)
            if raw:
                return raw
            return None  # пустой ответ — актив не найден, не повторяем
        except Exception as e:
            err = str(e)
            if "Not connected" in err or "reconnection failed" in err:
                print(f"[RECONNECT] Нет соединения, попытка переподключения {attempt+1}/3...")
                try:
                    await client.connect()
                    await asyncio.sleep(3)
                except Exception:
                    pass
            else:
                return None  # любая другая ошибка — не повторяем
    print("[ERROR] Не удалось подключиться после 3 попыток")
    return None

async def get_candles_data(client):
    """Получение свечей с кэшем — обновляет только когда закрывается новая свеча"""
    global _candle_cache, _candle_asset, _last_candle_time, _resolved_asset
    base = ASSET.replace("_otc", "").replace("#", "")
    candidates = [ASSET, f"#{ASSET}", f"{base}_otc", f"#{base}_otc", base]
    seen = []
    for name in candidates:
        if name in seen:
            continue
        seen.append(name)
        try:
            raw = await try_get_candles(client, name)
            if not raw:
                continue
            _resolved_asset = name
            if name != ASSET:
                print(f"[INFO] Актив найден как: {name}")
            if hasattr(raw[0], 'time'):
                sorted_raw = sorted(raw, key=lambda c: c.time)
                closed_raw = sorted_raw[:-1]
                print(f"[CANDLES] всего={len(sorted_raw)} закрытых={len(closed_raw)} TF={EXPIRY_SEC}s")
                _last7 = sorted_raw[-7:]
                _is_ms = _last7[-1].time > 1e10
                from datetime import timezone, timedelta
                _tz_msk = timezone(timedelta(hours=3))
                for _i, _c in enumerate(_last7):
                    _ts = _c.time / 1000 if _is_ms else _c.time
                    _open_t = datetime.fromtimestamp(_ts, tz=_tz_msk).strftime('%H:%M:%S')
                    _close_t = datetime.fromtimestamp(_ts + EXPIRY_SEC, tz=_tz_msk).strftime('%H:%M:%S')
                    _em = '🟢' if _c.close >= _c.open else '🔴'
                    _mark = ' ← ТЕКУЩАЯ' if _i == len(_last7) - 1 else ''
                    print(f"[RAW_API] [{_i - len(_last7)}] {_em} {_open_t}→{_close_t} o={_c.open:.5f} c={_c.close:.5f}{_mark}")
                _last_closed = sorted_raw[-2] if len(sorted_raw) >= 2 else sorted_raw[-1]
                _lc_ts = _last_closed.time / 1000 if _is_ms else _last_closed.time
                _lc_close_ts = _lc_ts + EXPIRY_SEC
                _now_ts = datetime.now(tz=_tz_msk).timestamp()
                _diff = _now_ts - _lc_close_ts
                if _diff > EXPIRY_SEC:
                    print(f"[SYNC_WARN] ⚠️ РАССИНХРОН! Последняя закрытая закрылась {_diff:.0f}с назад (>{EXPIRY_SEC}с) — данные устарели!")
                else:
                    print(f"[SYNC_OK] ✅ Последняя закрытая: {_diff:.0f}с назад (норма ≤{EXPIRY_SEC}с)")
            else:
                sorted_raw = list(raw)
                closed_raw = sorted_raw[:-1]
            if not closed_raw:
                continue
            cur_candle = sorted_raw[-1]
            lc = closed_raw[-1]
            emoji = '🟢' if lc.close >= lc.open else '🔴'
            print(f"[CANDLE] Последняя закрытая: {emoji} o={lc.open:.5f} c={lc.close:.5f} | закрытых: {len(closed_raw)}")
            # Кортеж: (open, high, low, close, timestamp) — timestamp нужен для отладки времени свечей
            candles_all = [(c.open, c.high, c.low, c.close, getattr(c, 'time', 0)) for c in closed_raw]
            candles_all += [(cur_candle.open, cur_candle.high, cur_candle.low, cur_candle.close, getattr(cur_candle, 'time', 0))]
            prices_all  = [c[3] for c in candles_all]
            return candles_all, prices_all
        except Exception as e:
            print(f"[CACHE_ERR] {e}")
            continue
    print(f"[FATAL] Актив {ASSET} не найден ни в одном формате — бот остановлен")
    print(f"[HINT] Выбери другой актив из списка сканера тренда")
    try:
        assets = await client.get_available_assets()
        if assets:
            names = [str(a) for a in list(assets)[:20]]
            print(f"[HINT] Доступные активы: {', '.join(names)}")
    except Exception:
        pass
    import sys; sys.exit(1)

async def place_trade(client, direction, amount):
    """Открытие опциона"""
    try:
        dir_val = OrderDirection.CALL if direction == "CALL" else OrderDirection.PUT
        trade_asset = _resolved_asset or ASSET
        _raw = await client.place_order(asset=trade_asset, amount=amount, direction=dir_val, duration=EXPIRY_SEC)
        import sys; sys.stdout.flush()
        print(f"[ORDER_RAW] type={type(_raw).__name__} val={str(_raw)[:500]}", flush=True)
        if hasattr(_raw, '__dict__'):
            print(f"[ORDER_DICT] {_raw.__dict__}", flush=True)
        elif hasattr(_raw, '__slots__'):
            print(f"[ORDER_SLOTS] { {s: getattr(_raw,s,None) for s in _raw.__slots__} }", flush=True)
        # ===== ДИАГНОСТИКА: какие методы есть у клиента и поля у ордера =====
        try:
            _client_methods = [m for m in dir(client) if not m.startswith('_')]
            print(f"[DIAG_CLIENT_METHODS] {_client_methods}", flush=True)
        except Exception as _de1:
            print(f"[DIAG_CLIENT_METHODS] err: {_de1}", flush=True)
        try:
            _order_attrs = [a for a in dir(_raw) if not a.startswith('_')]
            print(f"[DIAG_ORDER_ATTRS] {_order_attrs}", flush=True)
            for _a in _order_attrs:
                try:
                    _v = getattr(_raw, _a)
                    if not callable(_v):
                        print(f"[DIAG_ORDER_FIELD] {_a} = {_v!r}", flush=True)
                except Exception:
                    pass
        except Exception as _de2:
            print(f"[DIAG_ORDER_ATTRS] err: {_de2}", flush=True)
        # ===== Пробуем перезапросить ордер через 2 сек — вдруг там цена =====
        try:
            await asyncio.sleep(2)
            _oid_for_check = None
            if hasattr(_raw, 'order_id'):
                _oid_for_check = _raw.order_id
            elif isinstance(_raw, dict):
                _oid_for_check = _raw.get('order_id') or _raw.get('id')
            if _oid_for_check:
                for _mname in ('get_order', 'check_order', 'order_info', 'get_order_info', 'check_win'):
                    if hasattr(client, _mname):
                        try:
                            _m = getattr(client, _mname)
                            _info = await _m(_oid_for_check)
                            print(f"[DIAG_ORDER_CHECK_{_mname}] type={type(_info).__name__} val={str(_info)[:500]}", flush=True)
                            if hasattr(_info, '__dict__'):
                                print(f"[DIAG_ORDER_CHECK_{_mname}_DICT] {_info.__dict__}", flush=True)
                        except Exception as _ce:
                            print(f"[DIAG_ORDER_CHECK_{_mname}] err: {_ce}", flush=True)
        except Exception as _de3:
            print(f"[DIAG_ORDER_RECHECK] err: {_de3}", flush=True)
        # ===== Конец диагностики =====
        open_price = 0.0
        if isinstance(_raw, (list, tuple)):
            _oid = _raw[0]
            for _item in _raw[1:]:
                try:
                    _v = float(_item)
                    if _v > 1.0:
                        open_price = _v
                        break
                except (TypeError, ValueError):
                    pass
        elif isinstance(_raw, dict):
            _oid = _raw.get('id') or _raw.get('order_id')
            for _k in ('open_price', 'openPrice', 'open', 'price', 'strike'):
                if _raw.get(_k):
                    open_price = float(_raw[_k])
                    break
        else:
            _oid = getattr(_raw, 'order_id', None)
            for _attr in ('open_price', 'openPrice', 'open', 'price', 'strike'):
                _v = getattr(_raw, _attr, None)
                if _v:
                    try:
                        open_price = float(_v)
                        break
                    except (TypeError, ValueError):
                        pass
        print(f"[TRADE] {direction} | {amount} | {EXPIRY_SEC//60} мин | ID: {_oid} | Цена: {open_price}")
        return _oid, open_price
    except Exception as e:
        print(f"[ERROR] Сделка: {e}")
        return None, 0.0

async def hedge_monitor(client, original_direction, original_bet, entry_price, expiry_sec):
    """
    Мониторинг цены во время экспирации и хеджирование при уходе против позиции.
    Проверяет каждые expiry/5 секунд.
    Simple:  цена ушла против, пипсов < порога  → та же сумма
    Power:   цена ушла против, пипсов >= порога → сумма * коэф
    Complex: прошло > 50% времени И пипсов >= порога → Power немедленно
    """
    if not ${cfg.hedgeEnabled ? "True" : "False"}:
        return None, 0.0, 0, 0.0
    _pip_map = {
        # Forex мажоры
        "EURUSD": 8, "GBPUSD": 10, "USDJPY": 150, "USDCHF": 9, "USDCAD": 9, "AUDUSD": 9, "NZDUSD": 9,
        "EURUSD_otc": 8, "GBPUSD_otc": 10, "USDJPY_otc": 150, "USDCHF_otc": 9, "USDCAD_otc": 9, "AUDUSD_otc": 9, "NZDUSD_otc": 9,
        # Forex кросс-пары (JPY — порог 150, остальные стандарт)
        "GBPJPY": 200, "GBPJPY_otc": 200, "EURJPY": 150, "EURJPY_otc": 150, "EURGBP": 10, "EURGBP_otc": 10,
        "GBPAUD": 18, "GBPAUD_otc": 18, "GBPCAD": 16, "GBPCAD_otc": 16, "GBPCHF": 14, "GBPCHF_otc": 14,
        "AUDCAD_otc": 12, "AUDCHF_otc": 11, "AUDJPY": 140, "AUDJPY_otc": 140, "AUDNZD_otc": 13,
        "CADJPY": 130, "CADJPY_otc": 130, "CADCHF_otc": 10, "CHFJPY": 140, "CHFJPY_otc": 140,
        "NZDJPY": 140, "NZDJPY_otc": 140, "NZDCAD_otc": 12, "NZDCHF_otc": 11, "EURNZD_otc": 14,
        "GBPNZD_otc": 22, "EURCAD_otc": 13, "EURCHF_otc": 11,
        # Крипто
        "BTCUSD": 150, "BTCUSD_otc": 150, "ETHUSD": 60, "ETHUSD_otc": 60,
        "LTCUSD_otc": 30, "DOTUSD": 20, "LNKUSD": 15,
        "BTCGBP": 150, "BTCJPY": 150, "BCHEUR": 40, "DASH_USD": 30,
        # Товары
        "XAUUSD": 25, "XAUUSD_otc": 25, "XAGUSD": 15, "XAGUSD_otc": 15,
        "UKBrent": 12, "UKBrent_otc": 12, "USCrude": 12, "USCrude_otc": 12,
        "XNGUSD": 10, "XNGUSD_otc": 10, "XPTUSD": 20, "XPTUSD_otc": 20, "XPDUSD": 25,
        # Индексы
        "SP500": 8, "SP500_otc": 8, "NASUSD": 15, "NASUSD_otc": 15,
        "DJI30": 10, "DJI30_otc": 10, "JPN225": 25, "JPN225_otc": 25,
        "D30EUR": 15, "D30EUR_otc": 15, "F40EUR": 12, "F40EUR_otc": 12,
        "E50EUR": 12, "E50EUR_otc": 12, "E35EUR": 12, "100GBP": 12, "100GBP_otc": 12,
        "AUS200": 12, "AUS200_otc": 12, "CAC40": 12,
        # Акции OTC
        "#AAPL_otc": 20, "#TSLA_otc": 40, "#NVDA_otc": 35, "#AMZN_otc": 25,
        "#MSFT_otc": 20, "#GOOG_otc": 25, "#META_otc": 30, "#NFLX_otc": 40,
        "#GME_otc": 50, "#V_otc": 15, "#XOM_otc": 15, "#MCD_otc": 15,
        "#INTC_otc": 15, "#BA_otc": 25,
    }
    # Размер одного пипса — зависит от пары
    _pip_size_map = {
        # JPY-пары: 1 пипс = 0.01
        "USDJPY": 0.01, "USDJPY_otc": 0.01,
        "GBPJPY": 0.01, "GBPJPY_otc": 0.01, "EURJPY": 0.01, "EURJPY_otc": 0.01,
        "AUDJPY": 0.01, "AUDJPY_otc": 0.01, "CADJPY": 0.01, "CADJPY_otc": 0.01,
        "CHFJPY": 0.01, "CHFJPY_otc": 0.01, "NZDJPY": 0.01, "NZDJPY_otc": 0.01,
        "JPN225": 1.0, "JPN225_otc": 1.0,
        # Крипто: 1 пипс = 1.0
        "BTCUSD": 1.0, "BTCUSD_otc": 1.0, "ETHUSD": 1.0, "ETHUSD_otc": 1.0,
        "LTCUSD_otc": 0.1, "DOTUSD": 0.01, "LNKUSD": 0.01,
        "BTCGBP": 1.0, "BTCJPY": 1.0, "BCHEUR": 0.1, "DASH_USD": 0.1,
        # Индексы: 1 пипс = 1.0
        "SP500": 0.1, "SP500_otc": 0.1, "NASUSD": 0.1, "NASUSD_otc": 0.1,
        "DJI30": 1.0, "DJI30_otc": 1.0, "D30EUR": 1.0, "D30EUR_otc": 1.0,
        "F40EUR": 1.0, "F40EUR_otc": 1.0, "E50EUR": 1.0, "AUS200": 0.1, "AUS200_otc": 0.1,
        "100GBP": 0.1, "100GBP_otc": 0.1, "CAC40": 0.1,
        # Золото/серебро
        "XAUUSD": 0.1, "XAUUSD_otc": 0.1, "XAGUSD": 0.01, "XAGUSD_otc": 0.01,
        "XPTUSD": 0.1, "XPTUSD_otc": 0.1, "XPDUSD": 0.1,
        # Нефть/газ
        "UKBrent": 0.01, "UKBrent_otc": 0.01, "USCrude": 0.01, "USCrude_otc": 0.01,
        "XNGUSD": 0.001,
        # Акции OTC
        "#AAPL_otc": 0.01, "#TSLA_otc": 0.01, "#NVDA_otc": 0.01, "#AMZN_otc": 0.01,
        "#MSFT_otc": 0.01, "#GOOG_otc": 0.01, "#META_otc": 0.01, "#NFLX_otc": 0.01,
        "#GME_otc": 0.01, "#V_otc": 0.01, "#XOM_otc": 0.01, "#MCD_otc": 0.01,
        "#INTC_otc": 0.01, "#BA_otc": 0.01,
    }
    _asset_key = (_resolved_asset or ASSET)
    HEDGE_PIP_THRESHOLD        = ${cfg.hedgePipThreshold}
    HEDGE_SIMPLE_PIP_THRESHOLD = ${cfg.hedgeSimplePipThreshold}
    HEDGE_POWER_MULT           = ${cfg.hedgePowerMultiplier}
    HEDGE_SIMPLE_MULT          = 1.5
    PIP_SIZE                   = _pip_size_map.get(_asset_key, 0.0001)  # дефолт для Forex
    check_interval = ${cfg.hedgeCheckInterval}
    print(f"[HEDGE] Инициализация | актив={_asset_key} | pip_size={PIP_SIZE} | порог={HEDGE_PIP_THRESHOLD} пип | цена входа={entry_price}")
    opposite = "PUT" if original_direction == "CALL" else "CALL"
    start_time = asyncio.get_event_loop().time()

    while True:
        await asyncio.sleep(check_interval)
        elapsed = asyncio.get_event_loop().time() - start_time
        if elapsed >= expiry_sec - check_interval:
            break
        try:
            candles = await client.get_candles(asset=(_resolved_asset or ASSET), timeframe=${cfg.candleTimeframe ?? 60}, count=1)
            if not candles:
                continue
            _c = candles[-1]
            if hasattr(_c, 'close'):
                current_price = float(_c.close)
            elif isinstance(_c, dict):
                current_price = float(_c.get('close', _c.get('c', 0)))
            else:
                current_price = float(_c[3] if len(_c) > 3 else _c[1])
            if current_price == 0.0:
                continue
            pips = round(abs(current_price - entry_price) / PIP_SIZE, 1)
            went_against = (original_direction == "CALL" and current_price < entry_price) or \
                           (original_direction == "PUT"  and current_price > entry_price)
            if not went_against:
                print(f"[HEDGE] Цена держится, хедж не нужен ({pips} пип)")
                continue
            time_ratio = elapsed / expiry_sec
            if time_ratio >= 0.5 and pips >= HEDGE_PIP_THRESHOLD:
                hedge_bet = round(original_bet * HEDGE_POWER_MULT, 2)
                mode = "COMPLEX"
            elif pips >= HEDGE_PIP_THRESHOLD:
                hedge_bet = round(original_bet * HEDGE_POWER_MULT, 2)
                mode = "POWER"
            elif pips >= HEDGE_SIMPLE_PIP_THRESHOLD:
                hedge_bet = round(original_bet * HEDGE_SIMPLE_MULT, 2)
                mode = "SIMPLE"
            else:
                print(f"[HEDGE] Цена ушла {pips} пип — меньше порога Simple ({HEDGE_SIMPLE_PIP_THRESHOLD}), ждём")
                continue
            remaining = max(30, int(expiry_sec - elapsed))

            # ===== УМНЫЙ ХЕДЖ: 3 ЛИМИТА, БЕРЁМ МИНИМУМ =====
            _bal_now, _ = await get_balance(client)
            _wanted_hedge = hedge_bet
            _limit_pct = round(_bal_now * (SAFETY_MAX_BET_PCT / 100.0), 2) if _bal_now > 0 else _wanted_hedge
            _reserve_amount = round(_bal_now * (SAFETY_MIN_RESERVE_PCT / 100.0), 2) if SAFETY_MIN_RESERVE_PCT > 0 and _bal_now > 0 else 0.0
            _max_after_reserve = round(_bal_now - _reserve_amount, 2) if _reserve_amount > 0 else _wanted_hedge
            _smart_hedge = round(min(_wanted_hedge, _limit_pct, _max_after_reserve if _max_after_reserve > 0 else _wanted_hedge), 2)
            print(f"[HEDGE] 🧠 Умный расчёт:")
            print(f"[HEDGE]    Хотели:     {_wanted_hedge:.2f} (исходный {mode})")
            print(f"[HEDGE]    Лимит {SAFETY_MAX_BET_PCT}%:  {_limit_pct:.2f} (от баланса {_bal_now:.2f})")
            if SAFETY_MIN_RESERVE_PCT > 0:
                print(f"[HEDGE]    Резерв {SAFETY_MIN_RESERVE_PCT}%: {_reserve_amount:.2f} → можно ставить до {_max_after_reserve:.2f}")
            else:
                print(f"[HEDGE]    Резерв:     ОТКЛ (0%)")
            print(f"[HEDGE]    Итог:       {_smart_hedge:.2f} ✅")
            if _smart_hedge < BASE_BET:
                # Лимит меньше базовой → пробуем поставить базовой ставкой
                if BASE_BET <= _bal_now:
                    print(f"[HEDGE] 🔄 СБРОС ДО БАЗОВОЙ: лимит {_smart_hedge:.2f} < базовая {BASE_BET:.2f}")
                    print(f"[HEDGE]    Ставим хедж базовой суммой: {BASE_BET:.2f}")
                    tg(f"🔄 <b>[HEDGE сброшен к базовой]</b>\\nЛимит: {_smart_hedge:.2f}\\nСтавим: <b>{BASE_BET:.2f}</b>\\nБаланс: {_bal_now:.2f}")
                    _smart_hedge = BASE_BET
                else:
                    print(f"[HEDGE] ⛔ ОТМЕНА — даже базовая {BASE_BET:.2f} > баланс {_bal_now:.2f}")
                    tg(f"⛔ <b>[HEDGE отменён]</b>\\nДаже базовая ставка не лезет\\nБаланс: {_bal_now:.2f} | Базовая: {BASE_BET:.2f}")
                    return None, 0.0, 0, 0.0
            elif _smart_hedge < _wanted_hedge:
                print(f"[HEDGE] ⚠️ Хедж урезан: {_wanted_hedge:.2f} → {_smart_hedge:.2f} (защита баланса)")
                tg(f"⚠️ <b>[HEDGE урезан]</b>\\n{_wanted_hedge:.2f} → <b>{_smart_hedge:.2f}</b>\\nЛимит {SAFETY_MAX_BET_PCT}% или резерв")
            hedge_bet = _smart_hedge

            print(f"[HEDGE] {mode} | {pips} пип | {hedge_bet} | {opposite} | осталось {remaining}с")
            tg(f"🛡 <b>[HEDGE {mode}]</b> {opposite} | {hedge_bet} | {pips} пип | осталось {remaining}с")
            dir_val = OrderDirection.CALL if opposite == "CALL" else OrderDirection.PUT
            # Запоминаем баланс ПЕРЕД открытием хеджа — чтобы fallback правильно посчитал результат именно этой сделки
            balance_before_hedge, _ = await get_balance(client)
            order = await client.place_order(asset=(_resolved_asset or ASSET), amount=hedge_bet, direction=dir_val, duration=remaining)
            print(f"[HEDGE] Открыт ID: {order.order_id} | баланс до хеджа: {balance_before_hedge}")
            return order.order_id, hedge_bet, remaining, balance_before_hedge
        except Exception as e:
            print(f"[HEDGE] Ошибка: {e}")
    return None, 0.0, 0, 0.0

async def cascade_hedge_monitor(client, original_direction, original_bet, entry_price, expiry_sec, started_at):
    """
    🛡 КАСКАДНЫЙ ХЕДЖ — 3 уровня страховки в цикле основной сделки.

    Принцип:
      • Хедж-1 (X)     — открывается СРАЗУ с основной (отдельно, перед запуском этого монитора)
      • Хедж-2 (1.5X)  — открывается ПОСЛЕ 1/2 экспирации, в момент коррекции цены (откат N пипсов от пика)
                         направление: ПРОТИВОПОЛОЖНОЕ основной
      • Хедж-3 (2X)    — открывается при ПЕРВОМ пересечении страйка ценой (в любой момент жизни сделки)
                         направление: СОВПАДАЕТ с основной | срабатывает только 1 раз

    Все хеджи имеют ту же экспирацию что осталась у основной (заканчиваются вместе).

    Возвращает: list[(order_id, bet, level, balance_before)] — открытые хедж-ордера
    """
    opened_hedges = []
    if not ${cfg.hedgeCascadeEnabled ? "True" : "False"}:
        return opened_hedges
    if entry_price <= 0:
        print("[CASCADE] ⛔ entry_price=0 — каскад НЕ запущен")
        return opened_hedges

    M2_MULT       = ${cfg.hedgeCascadeM2 ?? 1.5}
    M3_MULT       = ${cfg.hedgeCascadeM3 ?? 2.0}
    PULLBACK_PIPS = ${cfg.hedgeCascadePullbackPips ?? 3}
    # 🎯 НОВЫЕ ПАРАМЕТРЫ H2:
    MIN_TIME_PCT     = ${cfg.hedgeCascadeMinTimePercent ?? 50} / 100.0  # минимум % экспирации до H2
    MIN_PEAK_PIPS    = ${cfg.hedgeCascadeMinPeakPips ?? 0}              # минимум пип от страйка для триггера
    REQUIRE_PROFIT   = ${cfg.hedgeCascadeRequireProfit ? "True" : "False"}  # H2 только если основная В ПЛЮСЕ
    CHECK_EVERY   = max(1, ${cfg.hedgeCheckInterval} // 2 if ${cfg.hedgeCheckInterval} > 1 else 1)

    _asset_key_c = (_resolved_asset or ASSET)
    _pip_size_map_c = {
        "USDJPY": 0.01, "USDJPY_otc": 0.01,
        "GBPJPY": 0.01, "GBPJPY_otc": 0.01, "EURJPY": 0.01, "EURJPY_otc": 0.01,
        "AUDJPY": 0.01, "AUDJPY_otc": 0.01, "CADJPY": 0.01, "CADJPY_otc": 0.01,
        "CHFJPY": 0.01, "CHFJPY_otc": 0.01, "NZDJPY": 0.01, "NZDJPY_otc": 0.01,
        "BTCUSD": 1.0, "BTCUSD_otc": 1.0, "ETHUSD": 1.0, "ETHUSD_otc": 1.0,
        "XAUUSD": 0.1, "XAUUSD_otc": 0.1, "XAGUSD": 0.01, "XAGUSD_otc": 0.01,
        "SP500": 0.1, "SP500_otc": 0.1, "NASUSD": 0.1, "DJI30": 1.0,
    }
    PIP_SIZE_C = _pip_size_map_c.get(_asset_key_c, 0.0001)

    h2_opened = False
    h3_opened = False
    h2_open_price = None  # 🎯 цена в момент открытия H2 — нужна для логики H3
    peak_abs_distance = 0.0
    peak_price = entry_price
    _iter = 0

    print(f"[CASCADE] 🛡 Старт мониторинга | основная={original_direction} {original_bet} | страйк={entry_price} | pip={PIP_SIZE_C} | откат={PULLBACK_PIPS} пип | проверка каждые {CHECK_EVERY}с")
    try:
        tg(f"🛡 <b>[CASCADE]</b> Мониторинг хедж-2/хедж-3 запущен | страйк {entry_price} | проверка {CHECK_EVERY}с")
    except Exception as _tge:
        print(f"[CASCADE] tg ошибка старта: {_tge}")

    while True:
        await asyncio.sleep(CHECK_EVERY)
        _iter += 1
        try:
            elapsed = asyncio.get_event_loop().time() - started_at
        except Exception:
            elapsed = 0
        remaining = int(expiry_sec - elapsed)
        if remaining <= 5:
            print(f"[CASCADE] ⏱ Конец цикла основной сделки (осталось {remaining}с). Каскад завершён.")
            break

        try:
            _cands = await client.get_candles(asset=(_resolved_asset or ASSET), timeframe=${cfg.candleTimeframe ?? 60}, count=1)
            if not _cands:
                continue
            _c = _cands[-1]
            if hasattr(_c, 'close'):
                current_price = float(_c.close)
            elif isinstance(_c, dict):
                current_price = float(_c.get('close', _c.get('c', 0)))
            else:
                current_price = float(_c[3] if len(_c) > 3 else _c[1])
            if current_price <= 0:
                continue
        except Exception as _ce:
            print(f"[CASCADE] Ошибка получения цены: {_ce}")
            continue

        cur_abs_distance = abs(current_price - entry_price)
        if cur_abs_distance > peak_abs_distance:
            peak_abs_distance = cur_abs_distance
            peak_price = current_price

        pips_from_entry = round(cur_abs_distance / PIP_SIZE_C, 1)
        pips_from_peak  = round(abs(peak_price - current_price) / PIP_SIZE_C, 1)
        time_ratio = elapsed / expiry_sec if expiry_sec > 0 else 0

        # PULSE-лог каждые 30 итераций — чтобы видеть что монитор живой
        if _iter % 30 == 0:
            print(f"[CASCADE] 💓 pulse iter={_iter} | цена={current_price} | страйк={entry_price} | откл={pips_from_entry}пип | от пика={pips_from_peak}пип | прошло {round(time_ratio*100)}% | h2={h2_opened} h3={h3_opened}")

        # ХЕДЖ-2 + ХЕДЖ-3: открываются ОДНОВРЕМЕННО на коррекции от пика
        # 🎯 ЛОГИКА H2 (ставим на возврат к страйку):
        #   цена ВЫШЕ страйка → H2 = PUT
        #   цена НИЖЕ страйка → H2 = CALL
        # 🎯 ЛОГИКА H3: ВСЕГДА противоположно H2, открывается ВМЕСТЕ с H2
        if not h2_opened and time_ratio >= MIN_TIME_PCT:
            _peak_pips = round(peak_abs_distance / PIP_SIZE_C, 1)
            _peak_ok   = _peak_pips >= MIN_PEAK_PIPS
            _in_profit = (original_direction == "CALL" and peak_price > entry_price) or \
                         (original_direction == "PUT"  and peak_price < entry_price)
            _profit_ok = (not REQUIRE_PROFIT) or _in_profit
            if peak_abs_distance > 0 and pips_from_peak >= PULLBACK_PIPS and _peak_ok and _profit_ok:
                # H2: правило по позиции цены (выше страйка → PUT, ниже → CALL)
                h2_dir = "PUT" if current_price > entry_price else "CALL"
                # H3: всегда противоположно H2
                h3_dir = "CALL" if h2_dir == "PUT" else "PUT"
                h2_bet = round(original_bet * M2_MULT, 2)
                h3_bet = round(original_bet * M3_MULT, 2)
                _h2_pos = "выше страйка" if current_price > entry_price else "ниже страйка"
                print(f"[CASCADE] 🔄 ХЕДЖ-2+3 ТРИГГЕР: коррекция {pips_from_peak} пип от пика (пик {round(peak_abs_distance/PIP_SIZE_C, 1)} пип)")
                print(f"[CASCADE]    осн={original_direction} | цена={current_price} {_h2_pos} {entry_price}")
                print(f"[CASCADE]    H2={h2_dir} ×{M2_MULT} ({h2_bet}) | H3={h3_dir} ×{M3_MULT} ({h3_bet}) | осталось {remaining}с")

                # --- открываем H2 ---
                try:
                    _bal_h2, _ = await get_balance(client)
                    if M2_MULT <= 0 or h2_bet <= 0:
                        print(f"[CASCADE] 🚫 ХЕДЖ-2 ОТКЛЮЧЁН (множитель={M2_MULT})")
                    elif h2_bet > _bal_h2:
                        print(f"[CASCADE] ⛔ ХЕДЖ-2 отменён: ставка {h2_bet} > баланс {_bal_h2}")
                        tg_info(f"⛔ <b>[CASCADE] Хедж-2 отменён</b>\\nНе хватает баланса: {_bal_h2:.2f} < {h2_bet:.2f}")
                    else:
                        _dv2 = OrderDirection.CALL if h2_dir == "CALL" else OrderDirection.PUT
                        _ord2 = await client.place_order(asset=(_resolved_asset or ASSET), amount=h2_bet, direction=_dv2, duration=remaining)
                        _oid2 = getattr(_ord2, 'order_id', None) if _ord2 else None
                        if _oid2:
                            opened_hedges.append((_oid2, h2_bet, "H2", _bal_h2))
                            h2_open_price = current_price
                            print(f"[CASCADE] ✅ ХЕДЖ-2 открыт ID={_oid2} | цена H2={h2_open_price}")
                            tg(f"🔄 <b>[CASCADE Хедж-2]</b> {h2_dir} | {h2_bet} | коррекция {pips_from_peak} пип | осталось {remaining}с")
                            try:
                                report_log("hedge_open", {
                                    "level": "H2", "order_id": str(_oid2), "direction": h2_dir,
                                    "bet": h2_bet, "multiplier": M2_MULT,
                                    "open_price": h2_open_price, "strike_price": entry_price,
                                    "pips_from_strike": calc_pips_distance(_asset_key_c, entry_price, h2_open_price),
                                    "pct_move_from_strike": calc_pct_move(entry_price, h2_open_price),
                                    "pips_pullback_from_peak": pips_from_peak,
                                    "peak_pips": round(peak_abs_distance / PIP_SIZE_C, 1),
                                    "time_elapsed_pct": round(time_ratio * 100, 1),
                                    "expiry_remaining_sec": remaining,
                                    "balance_before": _bal_h2, "main_direction": original_direction,
                                })
                            except Exception as _rle: print(f"[REPORT] err: {_rle}")
                except Exception as _e2:
                    print(f"[CASCADE] ❌ Ошибка хедж-2: {_e2}")
                h2_opened = True

                # --- открываем H3 ОДНОВРЕМЕННО, противоположно H2 ---
                try:
                    _bal_h3, _ = await get_balance(client)
                    if M3_MULT <= 0 or h3_bet <= 0:
                        print(f"[CASCADE] 🚫 ХЕДЖ-3 ОТКЛЮЧЁН (множитель={M3_MULT})")
                    elif h3_bet > _bal_h3:
                        print(f"[CASCADE] ⛔ ХЕДЖ-3 отменён: ставка {h3_bet} > баланс {_bal_h3}")
                        tg_info(f"⛔ <b>[CASCADE] Хедж-3 отменён</b>\\nНе хватает баланса: {_bal_h3:.2f} < {h3_bet:.2f}")
                    else:
                        _dv3 = OrderDirection.CALL if h3_dir == "CALL" else OrderDirection.PUT
                        _ord3 = await client.place_order(asset=(_resolved_asset or ASSET), amount=h3_bet, direction=_dv3, duration=remaining)
                        _oid3 = getattr(_ord3, 'order_id', None) if _ord3 else None
                        if _oid3:
                            opened_hedges.append((_oid3, h3_bet, "H3", _bal_h3))
                            print(f"[CASCADE] ✅ ХЕДЖ-3 открыт ID={_oid3} | направление {h3_dir} (против H2)")
                            tg(f"🎯 <b>[CASCADE Хедж-3]</b> {h3_dir} | {h3_bet} | вместе с H2, в противоход | осталось {remaining}с")
                            try:
                                report_log("hedge_open", {
                                    "level": "H3", "order_id": str(_oid3), "direction": h3_dir,
                                    "bet": h3_bet, "multiplier": M3_MULT,
                                    "open_price": current_price, "strike_price": entry_price,
                                    "pips_from_strike": calc_pips_distance(_asset_key_c, entry_price, current_price),
                                    "pct_move_from_strike": calc_pct_move(entry_price, current_price),
                                    "pips_pullback_from_peak": pips_from_peak,
                                    "peak_pips": round(peak_abs_distance / PIP_SIZE_C, 1),
                                    "time_elapsed_pct": round(time_ratio * 100, 1),
                                    "expiry_remaining_sec": remaining,
                                    "balance_before": _bal_h3, "main_direction": original_direction,
                                    "paired_with": "H2",
                                })
                            except Exception as _rle: print(f"[REPORT] err: {_rle}")
                except Exception as _e3:
                    print(f"[CASCADE] ❌ Ошибка хедж-3: {_e3}")
                h3_opened = True

        if h2_opened and h3_opened:
            print(f"[CASCADE] ✅ Все уровни каскада отработали. Жду конца основной.")
            break

    print(f"[CASCADE] 🏁 Мониторинг завершён | открыто хеджей: {len(opened_hedges)}")
    return opened_hedges

async def profit_extension_monitor(client, original_direction, original_bet, entry_price, expiry_sec):
    """
    Мониторинг прибыльной позиции для расширения прибыли.
    Trend:   цена ушла в нашу сторону на EXT_PIPS → доп. ставка в том же направлении
    Rebound: цена ушла в нашу сторону на EXT_PIPS → ставка на откат (обратное направление)
    Both:    оба ордера одновременно
    Срабатывает только один раз за экспирацию.
    """
    if not ${cfg.profitExtEnabled ? "True" : "False"}:
        return []
    _pip_map_ext = {
        "EURUSD": 8, "GBPUSD": 10, "USDJPY": 150, "USDCHF": 9, "USDCAD": 9, "AUDUSD": 9, "NZDUSD": 9,
        "EURUSD_otc": 8, "GBPUSD_otc": 10, "USDJPY_otc": 150, "USDCHF_otc": 9, "USDCAD_otc": 9, "AUDUSD_otc": 9, "NZDUSD_otc": 9,
        "GBPJPY": 200, "GBPJPY_otc": 200, "EURJPY": 150, "EURJPY_otc": 150, "EURGBP": 10, "EURGBP_otc": 10,
        "GBPAUD": 18, "GBPAUD_otc": 18, "GBPCAD": 16, "GBPCAD_otc": 16, "AUDCAD_otc": 12, "AUDJPY_otc": 140,
        "CADJPY_otc": 130, "CHFJPY_otc": 140, "NZDJPY_otc": 140, "GBPNZD_otc": 22,
        "BTCUSD": 150, "BTCUSD_otc": 150, "ETHUSD": 60, "ETHUSD_otc": 60,
        "LTCUSD_otc": 30, "DOTUSD": 20, "LNKUSD": 15, "BTCGBP": 150, "DASH_USD": 30,
        "XAUUSD": 25, "XAUUSD_otc": 25, "XAGUSD": 15, "XAGUSD_otc": 15,
        "UKBrent": 12, "UKBrent_otc": 12, "USCrude": 12, "XNGUSD": 10, "XPTUSD": 20,
        "SP500": 8, "SP500_otc": 8, "NASUSD": 15, "NASUSD_otc": 15, "DJI30": 10, "DJI30_otc": 10,
        "JPN225": 25, "JPN225_otc": 25, "D30EUR": 15, "AUS200": 12, "AUS200_otc": 12,
        "#AAPL_otc": 20, "#TSLA_otc": 40, "#NVDA_otc": 35, "#AMZN_otc": 25, "#MSFT_otc": 20,
        "#GOOG_otc": 25, "#META_otc": 30, "#NFLX_otc": 40, "#GME_otc": 50,
    }
    _asset_key_ext = (_resolved_asset or ASSET)
    _pip_size_map_ext = {
        "USDJPY": 0.01, "USDJPY_otc": 0.01,
        "GBPJPY": 0.01, "GBPJPY_otc": 0.01, "EURJPY": 0.01, "EURJPY_otc": 0.01,
        "AUDJPY_otc": 0.01, "CADJPY_otc": 0.01, "CHFJPY_otc": 0.01, "NZDJPY_otc": 0.01,
        "JPN225": 1.0, "JPN225_otc": 1.0,
        "BTCUSD": 1.0, "BTCUSD_otc": 1.0, "ETHUSD": 1.0, "ETHUSD_otc": 1.0,
        "LTCUSD_otc": 0.1, "DOTUSD": 0.01, "LNKUSD": 0.01, "BTCGBP": 1.0, "DASH_USD": 0.1,
        "SP500": 0.1, "SP500_otc": 0.1, "NASUSD": 0.1, "NASUSD_otc": 0.1,
        "DJI30": 1.0, "DJI30_otc": 1.0, "D30EUR": 1.0, "AUS200": 0.1, "AUS200_otc": 0.1,
        "XAUUSD": 0.1, "XAUUSD_otc": 0.1, "XAGUSD": 0.01, "XAGUSD_otc": 0.01,
        "UKBrent": 0.01, "UKBrent_otc": 0.01, "USCrude": 0.01, "XNGUSD": 0.001,
        "#AAPL_otc": 0.01, "#TSLA_otc": 0.01, "#NVDA_otc": 0.01, "#AMZN_otc": 0.01,
        "#MSFT_otc": 0.01, "#GOOG_otc": 0.01, "#META_otc": 0.01, "#NFLX_otc": 0.01,
        "#GME_otc": 0.01, "#V_otc": 0.01, "#XOM_otc": 0.01, "#MCD_otc": 0.01,
    }
    EXT_PIPS  = _pip_map_ext.get(_asset_key_ext, ${cfg.profitExtPips})
    EXT_MULT  = ${cfg.profitExtMultiplier}
    EXT_MODE  = "${cfg.profitExtMode}"
    PIP_SIZE  = _pip_size_map_ext.get(_asset_key_ext, 0.0001)
    check_interval = ${cfg.profitExtCheckInterval}
    print(f"[EXT] Инициализация | актив={_asset_key_ext} | pip_size={PIP_SIZE} | порог={EXT_PIPS} пип | режим={EXT_MODE} | цена входа={entry_price}")
    opposite  = "PUT" if original_direction == "CALL" else "CALL"
    start_time = asyncio.get_event_loop().time()
    triggered = False
    orders = []

    while not triggered:
        await asyncio.sleep(check_interval)
        elapsed = asyncio.get_event_loop().time() - start_time
        if elapsed >= expiry_sec - check_interval:
            break
        try:
            candles = await client.get_candles(asset=(_resolved_asset or ASSET), timeframe=${cfg.candleTimeframe ?? 60}, count=1)
            if not candles:
                continue
            _c2 = candles[-1]
            if hasattr(_c2, 'close'):
                current_price = float(_c2.close)
            elif isinstance(_c2, dict):
                current_price = float(_c2.get('close', _c2.get('c', 0)))
            else:
                current_price = float(_c2[3] if len(_c2) > 3 else _c2[1])
            if current_price == 0.0:
                continue
            pips = round(abs(current_price - entry_price) / PIP_SIZE, 1)
            in_profit = (original_direction == "CALL" and current_price > entry_price) or \
                        (original_direction == "PUT"  and current_price < entry_price)
            if not in_profit or pips < EXT_PIPS:
                print(f"[EXT] Ждём {EXT_PIPS} пип в нашу сторону (сейчас {pips} пип, {'✅' if in_profit else '❌'})")
                continue
            remaining = max(30, int(expiry_sec - elapsed))
            ext_bet = round(original_bet * EXT_MULT, 2)
            triggered = True
            if EXT_MODE in ("trend", "both"):
                dir_t = OrderDirection.CALL if original_direction == "CALL" else OrderDirection.PUT
                order_t = await client.place_order(asset=(_resolved_asset or ASSET), amount=ext_bet, direction=dir_t, duration=remaining)
                orders.append((order_t.order_id, ext_bet, "TREND", remaining))
                print(f"[EXT] TREND {original_direction} | {ext_bet} | {pips} пип | осталось {remaining}с")
                tg(f"📈 <b>[EXT TREND]</b> {original_direction} | {ext_bet} | {pips} пип | осталось {remaining}с")
            if EXT_MODE in ("rebound", "both"):
                dir_r = OrderDirection.CALL if opposite == "CALL" else OrderDirection.PUT
                order_r = await client.place_order(asset=(_resolved_asset or ASSET), amount=ext_bet, direction=dir_r, duration=remaining)
                orders.append((order_r.order_id, ext_bet, "REBOUND", remaining))
                print(f"[EXT] REBOUND {opposite} | {ext_bet} | {pips} пип | осталось {remaining}с")
                tg(f"🔄 <b>[EXT REBOUND]</b> {opposite} | {ext_bet} | {pips} пип | осталось {remaining}с")
        except Exception as e:
            print(f"[EXT] Ошибка: {e}")
    return orders

async def check_result(client, order_id, balance_before, bet, wait_sec=None):
    """Ожидание результата по конкретной сделке через get_deal (точно, не зависит от других ботов)."""
    PAYOUT = ${cfg.payoutRate} / 100
    _wait = wait_sec if wait_sec is not None else EXPIRY_SEC
    print(f"[WAIT] Ожидаем результат {round(_wait/60, 1)} мин...")
    await asyncio.sleep(_wait + 5)
    try:
        for attempt in range(30):
            try:
                deal = await client.get_deal(order_id)
                if deal is None:
                    await asyncio.sleep(3)
                    continue
                profit_raw = getattr(deal, 'profit', None) or getattr(deal, 'win', None) or getattr(deal, 'result', None)
                if profit_raw is None and hasattr(deal, '__dict__'):
                    profit_raw = deal.__dict__.get('profit') or deal.__dict__.get('win') or deal.__dict__.get('result')
                if profit_raw is None:
                    await asyncio.sleep(3)
                    continue
                profit_val = float(profit_raw)
                won = profit_val > 0
                profit = round(profit_val, 2) if won else 0.0
                loss_amount = round(bet, 2) if not won else 0.0
                status = "ВЫИГРЫШ ✅" if won else "ПРОИГРЫШ ❌"
                print(f"[RESULT] {status} | deal.profit={profit_val} | bet={bet} | Профит: {profit}")
                return won, profit, loss_amount
            except Exception as e_inner:
                print(f"[WAIT] Попытка {attempt+1}: {e_inner}")
                await asyncio.sleep(3)
                continue
        print(f"[WARN] Таймаут get_deal — fallback по балансу")
        balance_after, _ = await get_balance(client)
        diff = round(balance_after - balance_before, 2)
        won = diff > 0
        profit = round(diff, 2) if won else 0.0
        loss_amount = round(bet, 2) if not won else 0.0
        print(f"[WARN] diff={diff} → {'ВЫИГРЫШ ✅' if won else 'ПРОИГРЫШ ❌'} | Профит: {profit}")
        return won, profit, loss_amount
    except Exception as e:
        print(f"[ERROR] Результат: {e}")
        return False, 0.0, round(bet, 2)

async def get_balance(client):
    """Текущий баланс"""
    try:
        b = await client.get_balance()
        print(f"[DEBUG] get_balance raw: {b} | type: {type(b)} | attrs: {dir(b)}")
        if b is None:
            return 0.0, "USD"
        amount = 0.0
        if hasattr(b, "balance") and b.balance is not None:
            amount = float(b.balance)
        elif hasattr(b, "amount") and b.amount is not None:
            amount = float(b.amount)
        elif isinstance(b, (int, float)):
            amount = float(b)
        elif isinstance(b, dict):
            amount = float(b.get("balance") or b.get("amount") or 0)
        else:
            try:
                amount = float(b)
            except:
                pass
        currency = getattr(b, "currency", None) or (b.get("currency") if isinstance(b, dict) else None) or "USD"
        return amount, currency
    except Exception as e:
        print(f"[ERROR] get_balance: {e}")
        return 0.0, "USD"

def print_stats():
    wins    = sum(1 for t in trade_log if t["won"])
    total   = len(trade_log)
    winrate = (wins / total * 100) if total else 0
    print(f"\\n[STATS] {wins}/{total} сделок | Winrate: {winrate:.1f}% | Сессия: {round(total_profit, 2)} {CURRENCY}")
    print(f"[STATS] По тренду: {calls_follow} ставок | Против/комбо: {calls_reverse} ставок")
    print(f"[STATS] Отклонено сигналов: {rejected_signals} (нет тренда: {rejected_no_trend}, конфликт: {rejected_conflict})\\n")

async def main():
    global total_profit, trades_today, current_bet, rejected_signals, rejected_no_trend, rejected_conflict
    global _candle_cache, _candle_asset, _last_candle_time, _last_trend
    global calls_follow, calls_reverse
    global hedge_count, hedge_wins, ext_count, ext_wins
    hedge_count = 0; hedge_wins = 0; ext_count = 0; ext_wins = 0
    rejected_signals = 0
    rejected_no_trend = 0
    rejected_conflict = 0
    calls_follow  = 0
    calls_reverse = 0
    _candle_cache     = []
    _candle_asset     = None
    _last_candle_time = None
    _last_trend       = None
    print("[CACHE] Кэш свечей сброшен")

    print("Подключение к Pocket Option...")
    client = AsyncPocketOptionClient(SESSION_ID, is_demo=IS_DEMO, enable_logging=True)
    connected = False
    try:
        connect_task = asyncio.create_task(client.connect())
        for _ in range(20):
            await asyncio.sleep(1)
            if getattr(client, 'connected', False) or getattr(client, 'is_connected', False):
                connected = True
                break
        if not connected:
            connect_task.cancel()
            print("[ERROR] Не удалось подключиться за 20 сек.")
            print("[HINT] Попробуй:")
            print("  1. pip install --upgrade pocketoptionapi-async")
            print("  2. Убедись что VPN включён и работает")
            print('  3. Проверь SESSION_ID — он должен начинаться с: 42["auth",{')
            return
        print("[INFO] WebSocket подключён, ждём авторизации...")
    except Exception as e:
        print(f"[ERROR] connect(): {e}")
        print("[HINT] pip install --upgrade pocketoptionapi-async")
        return
    balance, currency = 0.0, "USD"
    for i in range(15):
        await asyncio.sleep(3)
        try:
            balance, currency = await get_balance(client)
            if balance > 0:
                global CURRENCY
                CURRENCY = currency
                break
        except Exception as e:
            print(f"[ERROR] get_balance: {e}")
        print(f"[WAIT] Ожидание соединения... ({i+1}/15)")
    else:
        print("[ERROR] Не удалось получить баланс за 45 сек. Проверь SESSION_ID.")
        return



    account_type = "🟡 ДЕМО-СЧЁТ" if IS_DEMO else "🔴 РЕАЛЬНЫЙ СЧЁТ"

    print("=" * 50)
    print("  Pocket Option Bot — ${strategyLabel}")
    print(f"  Счёт: {account_type}")
    print(f"  Актив: {ASSET} | Экспирация: {EXPIRY_SEC//60} мин")
    print(f"  Баланс: {round(balance, 2)} {CURRENCY} | TP: {TAKE_PROFIT} {CURRENCY} | SL: {STOP_LOSS} {CURRENCY}")
    # 🆔 Version stamp — чтобы юзер видел что код СВЕЖИЙ (а не старый bot1.py с компа)
    print(f"  🆔 BUILD: cascade-fix-v3 | каскад_код_внутри={'ДА' if ${cfg.hedgeCascadeEnabled ? "True" : "False"} else 'ВЫКЛ'}")
    print("=" * 50 + "\\n")
    tg(
        f"🤖 <b>{BOT_NAME} запущен</b>\\n"
        f"━━━━━━━━━━━━━━━━━━━━\\n"
        f"📋 <b>Параметры сессии</b>\\n"
        f"  Счёт: {account_type}\\n"
        f"  Стратегия: <b>${strategyLabel}</b>\\n"
        f"  Начальный баланс: <b>{balance:.2f} {CURRENCY}</b>\\n"
        f"  Take Profit: <b>+{TAKE_PROFIT} {CURRENCY}</b>\\n"
        f"  Stop Loss: <b>-{STOP_LOSS} {CURRENCY}</b>\\n"
        f"━━━━━━━━━━━━━━━━━━━━\\n"
        f"📊 <b>Актив</b>\\n"
        f"  Инструмент: <b>{ASSET}</b>\\n"
        f"  Экспирация: <b>{EXPIRY_SEC//60} мин</b>\\n"
        f"  Начальная ставка: <b>{BASE_BET} {CURRENCY}</b>\\n"
        f"━━━━━━━━━━━━━━━━━━━━\\n"
        f"🎮 <b>Команды управления:</b>\\n"
        f"  /stop {BOT_NAME}\\n"
        f"  /pause {BOT_NAME}\\n"
        f"  /resume {BOT_NAME}\\n"
        f"  /status {BOT_NAME}\\n"
        f"  /settp {BOT_NAME} 50 | /setsl {BOT_NAME} 20\\n"
        f"  <i>all вместо имени — управлять всеми</i>\\n"
        f"━━━━━━━━━━━━━━━━━━━━\\n"
        f"🛡 <b>Активные защиты:</b>\\n"
        f"  ✅ Анти-рассинхрон API (пауза при устаревших свечах)\\n"
        f"  ✅ Часовой пояс МСК (UTC+3) в логах\\n"
        f"  {('✅ Каскадный хедж 3 уровней (×' + str(${cfg.hedgeCascadeM1 ?? 1.5}) + '/×' + str(${cfg.hedgeCascadeM2 ?? 1.5}) + '/×' + str(${cfg.hedgeCascadeM3 ?? 2.0}) + ')') if ${cfg.hedgeCascadeEnabled ? "True" : "False"} else '⚠️ Каскадный хедж ВЫКЛЮЧЕН (вкл в настройках)'}\\n"
        f"━━━━━━━━━━━━━━━━━━━━\\n"
        f"⏳ Ожидаю сигналы..."
    )

    # ===== 🛡 ЖИРНЫЙ СТАРТОВЫЙ ЛОГ ПРО КАСКАД (видно сразу при запуске) =====
    _cascade_state_log = ${cfg.hedgeCascadeEnabled ? "True" : "False"}
    print("=" * 60)
    if _cascade_state_log:
        print(f"  🛡 КАСКАДНЫЙ ХЕДЖ: ✅ ВКЛЮЧЁН")
        print(f"     Хедж-1 (сразу, против): ×{${cfg.hedgeCascadeM1 ?? 1.5}}")
        print(f"     Хедж-2 (после 1/2 экспир., против): ×{${cfg.hedgeCascadeM2 ?? 1.5}}")
        print(f"     Хедж-3 (по основной, при пересеч. страйка): ×{${cfg.hedgeCascadeM3 ?? 2.0}}")
        print(f"     Откат от пика: {${cfg.hedgeCascadePullbackPips ?? 3}} пип")
        print(f"     Проверка цены: каждые {${cfg.hedgeCheckInterval ?? 2}} сек")
        _max_sum = 1 + ${cfg.hedgeCascadeM1 ?? 1.5} + ${cfg.hedgeCascadeM2 ?? 1.5} + ${cfg.hedgeCascadeM3 ?? 2.0}
        print(f"     Макс. сумма на сигнал: {_max_sum:.1f}X (т.е. {round(BASE_BET * _max_sum, 2)} {CURRENCY})")
    else:
        print(f"  ⚠️ КАСКАДНЫЙ ХЕДЖ: ❌ ВЫКЛЮЧЕН")
        print(f"     Чтобы включить: открой настройки бота → раздел")
        print(f"     '🛡 Каскадный хедж (3 уровня)' → переключи тумблер.")
        print(f"     Без него страховка хедж-1/хедж-2/хедж-3 НЕ запустится.")
    print("=" * 60)

    # ===== 🎯 СТАРТОВЫЙ ОПРОС FORCE: 4 кнопки выбора цвета 2 закрытых свечей =====
    # Если юзер нажмёт — установится _tg_force_pattern, прогрев пропустится, бот начнёт торговать СРАЗУ.
    # Если за 5 минут не нажмёт — обычный прогрев (~2 мин).
    import time as _t_boot
    globals()['_bot_started_at'] = _t_boot.time()
    _start_force_taken = False  # признак что стартовый force взят
    print(f"[STARTFORCE] 🎯 Показываю стартовый опрос FORCE на 5 минут...")
    try:
        tg_send_menu(
            f"🎯 <b>[{BOT_NAME}] Бот запущен — выбери стартовый паттерн</b>\\n"
            f"━━━━━━━━━━━━━━━━━━━━\\n"
            f"Какие были 2 последние закрытые свечи?\\n"
            f"Бот <b>сразу начнёт торговать</b> (без прогрева)\\n\\n"
            f"⏱ Если не нажмёшь за 5 мин — обычный прогрев",
            [
                [("🟢🟢 зел-зел", "startforce:UP_UP"), ("🔴🔴 кр-кр", "startforce:DOWN_DOWN")],
                [("🟢🔴 зел-кр", "startforce:UP_DOWN"), ("🔴🟢 кр-зел", "startforce:DOWN_UP")],
                [("⏭ Пропустить (обычный прогрев)", "startforce:skip")],
            ],
        )
    except Exception as _spe:
        print(f"[STARTFORCE] Не удалось отправить опрос: {_spe}")

    # Ждём ответ пользователя до 5 минут — каждую секунду опрашиваем ТГ
    import time as _time_sf
    _sf_start = _time_sf.time()
    _sf_timeout = 300  # 5 минут
    while _time_sf.time() - _sf_start < _sf_timeout:
        try:
            tg_poll_commands()
        except Exception as _pe2:
            print(f"[STARTFORCE] poll ошибка: {_pe2}")
        # Если юзер нажал кнопку цвета — _tg_force_pattern установлен, прогрев не нужен
        if _tg_force_pattern is not None and _tg_pending_force and isinstance(_tg_pending_force, dict) and _tg_pending_force.get("start_done"):
            _start_force_taken = True
            print(f"[STARTFORCE] ✅ Юзер выбрал паттерн {_tg_force_pattern} — пропускаем прогрев")
            _tg_pending_force = None
            break
        # Если юзер нажал "Пропустить" — выходим в обычный прогрев
        if _tg_pending_force and isinstance(_tg_pending_force, dict) and _tg_pending_force.get("start_skip"):
            print(f"[STARTFORCE] ⏭ Юзер нажал 'Пропустить' — иду на обычный прогрев")
            _tg_pending_force = None
            break
        await asyncio.sleep(1)
    else:
        print(f"[STARTFORCE] ⏱ Таймаут 5 мин — никто не ответил, иду на обычный прогрев")
        try:
            tg_info(f"⏱ <b>[{BOT_NAME}]</b> Таймаут стартового опроса (5 мин) — иду на обычный прогрев")
        except Exception:
            pass

    # ===== ФАЗА РАЗОГРЕВА: пропускаем если стартовый FORCE взят =====
    if _start_force_taken:
        print(f"[WARMUP] ⏭ Прогрев ПРОПУЩЕН — стартовый FORCE активен ({_tg_force_pattern})")
        tg_info(f"⏭ <b>[{BOT_NAME}]</b> Прогрев пропущен — иду торговать с FORCE паттерном")
    else:
        # ===== ФАЗА РАЗОГРЕВА: ждём закрытия 2 свежих 1-минутных свечей перед первой сделкой =====
        import time as _time_warmup
        warmup_start = _time_warmup.time()
        _now_struct = _time_warmup.localtime(warmup_start)
        _seconds_to_next_minute = 60 - _now_struct.tm_sec
        warmup_end = warmup_start + _seconds_to_next_minute + 60
        _warmup_total = int(warmup_end - warmup_start)
        print(f"[WARMUP] 🔥 Фаза разогрева: ждём закрытия 2 свежих 1-минутных свечей ({_warmup_total} сек)")
        tg_info(f"🔥 <b>[{BOT_NAME}] Разогрев</b>\\nЖду закрытия 2 свежих 1-минутных свечей перед первой сделкой\\n⏱ Примерно {_warmup_total} сек")
        _candles_seen = 0
        _last_candle_minute = None
        while _time_warmup.time() < warmup_end or _candles_seen < 2:
            _remaining = max(0, int(warmup_end - _time_warmup.time()))
            try:
                _wc = await client.get_candles(asset=ASSET, timeframe=60, count=3)
                if _wc:
                    _last = _wc[-1]
                    _t_attr = None
                    for _tk in ('time', 't', 'timestamp', 'open_time'):
                        if hasattr(_last, _tk):
                            try: _t_attr = float(getattr(_last, _tk)); break
                            except: pass
                        if isinstance(_last, dict) and _last.get(_tk):
                            try: _t_attr = float(_last[_tk]); break
                            except: pass
                    if _t_attr:
                        _cur_minute = int(_t_attr // 60)
                        if _last_candle_minute is None:
                            _last_candle_minute = _cur_minute
                        elif _cur_minute > _last_candle_minute:
                            _candles_seen += 1
                            _last_candle_minute = _cur_minute
                            print(f"[WARMUP] ✅ Закрылась свеча #{_candles_seen} | Осталось: {max(0, 2 - _candles_seen)} свечей")
            except Exception as _we:
                print(f"[WARMUP] Ошибка получения свечей: {_we}")
            if _candles_seen >= 2 and _time_warmup.time() >= warmup_end:
                break
            print(f"[WARMUP] ⏳ Жду закрытия свечей... ({_candles_seen}/2 готово, до конца разогрева {_remaining}с)")
            await asyncio.sleep(5)
        print(f"[WARMUP] ✅ Разогрев завершён! Бот готов к торговле.")
        tg_info(f"✅ <b>[{BOT_NAME}] Готов к торговле</b>\\n2 свежие свечи закрылись, начинаю мониторинг сигналов")
    # 🎮 Стартовое inline-меню (управление через кнопки)
    try:
        tg_show_main_menu()
    except Exception as _me:
        print(f"[TG_MENU] Ошибка стартового меню: {_me}")

    _reconnect_attempts = 0

    while True:
        try:
            if total_profit >= TAKE_PROFIT:
                msg = f"[TP] Take Profit достигнут: +{round(total_profit, 2)} {CURRENCY}"
                print(msg)
                wins_count = sum(1 for t in trade_log if t["won"])
                loss_count = trades_today - wins_count
                winrate = round(wins_count / trades_today * 100, 1) if trades_today > 0 else 0
                _hedge_str = f"\\n  🛡 Хеджей: {hedge_count} (✅ {hedge_wins} / ❌ {hedge_count - hedge_wins})" if hedge_count > 0 else ""
                _ext_str   = f"\\n  📈 Расширений: {ext_count} (✅ {ext_wins} / ❌ {ext_count - ext_wins})" if ext_count > 0 else ""
                tg(
                    f"✅ <b>Take Profit достигнут!</b>\\n"
                    f"━━━━━━━━━━━━━━━━━━━━\\n"
                    f"💰 <b>Итог сессии</b>\\n"
                    f"  Профит: <b>+{total_profit:.2f} {CURRENCY}</b>\\n"
                    f"  Баланс: <b>{balance_before + total_profit:.2f} {CURRENCY}</b>\\n"
                    f"━━━━━━━━━━━━━━━━━━━━\\n"
                    f"📊 <b>Статистика</b>\\n"
                    f"  Сделок: {trades_today} (✅ {wins_count} / ❌ {loss_count})\\n"
                    f"  Винрейт: <b>{winrate}%</b>\\n"
                    f"  Отклонено сигналов: {rejected_signals}"
                    f"{_hedge_str}{_ext_str}\\n"
                    f"━━━━━━━━━━━━━━━━━━━━"
                )
                if AUTO_RESTART:
                    total_profit = 0; trades_today = 0; calls_follow = 0; calls_reverse = 0
                    rejected_signals = 0; rejected_no_trend = 0; rejected_conflict = 0
                    _candle_cache[:] = []
                    _last_candle_time = None
                    _last_trend = None
                    print("[CACHE] Кэш сброшен после TP, перезапуск через 5 мин...")
                    await asyncio.sleep(300)
                    continue
                break

            if total_profit <= -STOP_LOSS:
                msg = f"[SL] Stop Loss достигнут: {round(total_profit, 2)} {CURRENCY}"
                print(msg)
                wins_count_sl = sum(1 for t in trade_log if t["won"])
                loss_count_sl = trades_today - wins_count_sl
                winrate_sl = round(wins_count_sl / trades_today * 100, 1) if trades_today > 0 else 0
                _hedge_str_sl = f"\\n  🛡 Хеджей: {hedge_count} (✅ {hedge_wins} / ❌ {hedge_count - hedge_wins})" if hedge_count > 0 else ""
                _ext_str_sl   = f"\\n  📈 Расширений: {ext_count} (✅ {ext_wins} / ❌ {ext_count - ext_wins})" if ext_count > 0 else ""
                tg(
                    f"🛑 <b>Stop Loss достигнут!</b>\\n"
                    f"━━━━━━━━━━━━━━━━━━━━\\n"
                    f"💸 <b>Итог сессии</b>\\n"
                    f"  Убыток: <b>{total_profit:.2f} {CURRENCY}</b>\\n"
                    f"  Баланс: <b>{balance_before + total_profit:.2f} {CURRENCY}</b>\\n"
                    f"━━━━━━━━━━━━━━━━━━━━\\n"
                    f"📊 <b>Статистика</b>\\n"
                    f"  Сделок: {trades_today} (✅ {wins_count_sl} / ❌ {loss_count_sl})\\n"
                    f"  Винрейт: <b>{winrate_sl}%</b>\\n"
                    f"  Отклонено сигналов: {rejected_signals}"
                    f"{_hedge_str_sl}{_ext_str_sl}\\n"
                    f"━━━━━━━━━━━━━━━━━━━━"
                )
                if AUTO_RESTART:
                    total_profit = 0; trades_today = 0; calls_follow = 0; calls_reverse = 0
                    rejected_signals = 0; rejected_no_trend = 0; rejected_conflict = 0
                    _candle_cache[:] = []
                    _last_candle_time = None
                    _last_trend = None
                    print("[CACHE] Кэш сброшен после SL, перезапуск через 5 мин...")
                    await asyncio.sleep(300)
                    continue
                break

            if trades_today >= DAILY_LIMIT:
                print(f"[LIMIT] Дневной лимит {DAILY_LIMIT} сделок исчерпан")
                wins_lim = sum(1 for t in trade_log if t["won"])
                loss_lim = trades_today - wins_lim
                winrate_lim = round(wins_lim / trades_today * 100, 1) if trades_today > 0 else 0
                tg(
                    f"⚠️ <b>Дневной лимит исчерпан</b>\\n"
                    f"━━━━━━━━━━━━━━━━━━━━\\n"
                    f"💰 <b>Итог сессии</b>\\n"
                    f"  Профит: <b>{total_profit:+.2f} {CURRENCY}</b>\\n"
                    f"  Баланс: <b>{balance_before + total_profit:.2f} {CURRENCY}</b>\\n"
                    f"━━━━━━━━━━━━━━━━━━━━\\n"
                    f"📊 <b>Статистика</b>\\n"
                    f"  Сделок: {trades_today} / {DAILY_LIMIT} (✅ {wins_lim} / ❌ {loss_lim})\\n"
                    f"  Винрейт: <b>{winrate_lim}%</b>\\n"
                    f"  Отклонено сигналов: {rejected_signals}\\n"
                    f"━━━━━━━━━━━━━━━━━━━━"
                )
                break

            # ⚡ Перевели в отдельный поток — раньше блокировал весь asyncio loop на 5с (timeout urllib),
            # из-за чего buffer_updater стоял и пропускал тики цены.
            await asyncio.to_thread(tg_poll_commands)
            if _tg_stopped:
                print("[TG] Бот остановлен командой из Telegram")
                break
            if _tg_paused:
                print("[TG] Пауза... Ожидаю команду /resume")
                await asyncio.sleep(CHECK_INTERVAL)
                continue

            import time as _time
            global _last_report_time
            if TG_ENABLED and (_time.time() - _last_report_time) >= 3600:
                _wins_r = sum(1 for t in trade_log if t["won"])
                _wr_r   = round(_wins_r / trades_today * 100, 1) if trades_today > 0 else 0
                tg(
                    f"⏰ <b>Авто-отчёт [{BOT_NAME}]</b>\\n"
                    f"━━━━━━━━━━━━━━━━━━━━\\n"
                    f"💰 Профит: <b>{total_profit:+.2f} {CURRENCY}</b>\\n"
                    f"📈 Сделок: {trades_today} (✅ {_wins_r} / ❌ {trades_today - _wins_r})\\n"
                    f"🎯 Винрейт: <b>{_wr_r}%</b>\\n"
                    f"━━━━━━━━━━━━━━━━━━━━"
                )
                _last_report_time = _time.time()

            await asyncio.sleep(3)
            candles, prices = await get_candles_data(client)
            if not prices:
                await asyncio.sleep(CHECK_INTERVAL)
                continue

            _reconnect_attempts = 0

            # ===== ⚡ FORCE из Telegram (одноразовая подмена 2 закрытых свечей) =====
            global _tg_force_pattern, _tg_force_at
            if _tg_force_pattern and len(candles) >= 3:
                # candles[-1] — живая, candles[-2] и candles[-3] — последние 2 закрытые
                # Подменяем именно их: open копируем как есть, close корректируем под нужный цвет
                _force_was = _tg_force_pattern
                def _flip_candle(_c, _want_up):
                    """Возвращает свечу с правильным направлением (UP/DOWN), сохраняя open и величину движения."""
                    if hasattr(_c, 'open') and hasattr(_c, 'close'):
                        _o = float(_c.open); _cl = float(_c.close)
                    elif isinstance(_c, dict):
                        _o = float(_c.get('open', _c.get('o', 0))); _cl = float(_c.get('close', _c.get('c', 0)))
                    else:
                        _o = float(_c[0]); _cl = float(_c[3])
                        _h = float(_c[1]); _l = float(_c[2])
                        _ts = _c[4] if len(_c) >= 5 else 0
                    _delta = abs(_cl - _o) or 0.00010
                    _new_close = _o + _delta if _want_up else _o - _delta
                    _new_high = max(_o, _new_close)
                    _new_low = min(_o, _new_close)
                    if isinstance(_c, tuple):
                        _ts2 = _c[4] if len(_c) >= 5 else 0
                        return (_o, _new_high, _new_low, _new_close, _ts2)
                    if isinstance(_c, dict):
                        _nc = dict(_c); _nc['close'] = _new_close; _nc['c'] = _new_close
                        _nc['high'] = _new_high; _nc['h'] = _new_high
                        _nc['low'] = _new_low;  _nc['l'] = _new_low
                        return _nc
                    return _c
                _want_2 = _force_was in ("UP_UP", "UP_DOWN")     # свеча -2 зелёная?
                _want_1 = _force_was in ("UP_UP", "DOWN_UP")     # свеча -1 зелёная?
                try:
                    candles = list(candles)
                    candles[-3] = _flip_candle(candles[-3], _want_2)
                    candles[-2] = _flip_candle(candles[-2], _want_1)
                    print(f"[TG_FORCE] ⚡ ПРИМЕНЁН паттерн {_force_was} к 2 закрытым свечам (одноразово)")
                    tg_info(f"⚡ <b>[{BOT_NAME}] FORCE применён</b>\\nПаттерн {_force_was} использован, дальше — реальные данные")
                except Exception as _fe:
                    print(f"[TG_FORCE] ❌ Ошибка применения: {_fe}")
                # Сразу сбрасываем — режим α (одноразовый)
                _tg_force_pattern = None
                _tg_force_at = 0

            # ✅ ИСПРАВЛЕНО: get_trend вызывается ОДИН раз — переиспользуем результат.
            # Раньше check_trend_change(candles) вызывал get_trend, потом ниже снова trend = get_trend(candles)
            # → блок [СВЕЧИ]/[АНАЛИЗ]/[ТРЕНД] печатался ДВАЖДЫ. Сейчас — только раз.
            trend = get_trend(candles)
            global _last_trend
            old_trend = _last_trend
            new_trend = trend if (trend and trend != _last_trend) else None
            _last_trend = trend
            if new_trend:
                arrow = "📈" if new_trend in ("UP_UP", "DOWN_UP") else "📉"
                labels = {"UP_UP": "🟢🟢 Два зелёных", "DOWN_DOWN": "🔴🔴 Два красных", "DOWN_UP": "🔴🟢 Разворот вверх", "UP_DOWN": "🟢🔴 Разворот вниз"}
                msg = f"{arrow} <b>Тренд изменился!</b>\\n{labels.get(old_trend, old_trend or '?')} → {labels.get(new_trend, new_trend)} | {ASSET}"
                print(f"[TREND] {old_trend} → {new_trend}")
                tg_info(msg)

            trend_sig = trend_to_signal(trend)
            signal, signal_info = get_signal(prices, candles)

            # Если стратегия молчит но тренд чёткий — торгуем по тренду
            if not signal and trend_sig and TREND_FOLLOW == "follow":
                signal = trend_sig
                signal_info = f"[TREND] {trend} → {trend_sig}"

            # ═══ TRADE BASE FILTERS — применяем фильтры по методике учебника ═══
            # ОПТИМИЗАЦИЯ: пропускаем TB-фильтр если сигнал и так конфликтует с трендом
            # (он всё равно будет отброшен ниже). Экономим CPU и чистим логи.
            _tb_skip = False
            if signal and TREND_FOLLOW != "combo" and trend_sig and signal != trend_sig:
                _tb_skip = True  # сигнал конфликтует с трендом — TB-фильтр не нужен
            try:
                # Обновляем данные старшего ТФ для MTF-фильтра (фоном, кэш 60с)
                if 'tb_update_higher_tf' in globals():
                    try:
                        await tb_update_higher_tf(client, _resolved_asset or ASSET)
                    except Exception:
                        pass
                if 'apply_tradebase_filters' in globals() and signal and not _tb_skip:
                    _filtered, _tb_lines = apply_tradebase_filters(signal, prices, candles)
                    for _ln in _tb_lines:
                        print(f"[TB-FILTER] {_ln}")
                    if _filtered is None and signal is not None:
                        signal_info = (signal_info or "") + " | TB-фильтр отменил: " + " | ".join(_tb_lines)
                        try:
                            rejected_signals += 1
                        except (NameError, UnboundLocalError):
                            pass
                        signal = None
                    elif _tb_lines:
                        signal_info = (signal_info or "") + " | TB✓ " + " | ".join(_tb_lines)
            except Exception as _tbe:
                print(f"[TB-FILTER] Ошибка фильтра (пропускаем): {_tbe}")

            # ===== СВОДНАЯ СТРОКА =====
            ts = datetime.now().strftime("%H:%M:%S")
            _tlbls = {"UP_UP": "🟢🟢🟢 Тренд ↑", "DOWN_DOWN": "🔴🔴🔴 Тренд ↓", "DOWN_UP": "🔴🟢 Разворот ↑", "UP_DOWN": "🟢🔴 Разворот ↓"}
            trend_str = _tlbls.get(trend, "— нет паттерна")
            sig_str = signal if signal else "нет"
            sig_emoji = "📈" if signal == "CALL" else ("📉" if signal == "PUT" else "⏸")
            _bal_now, _cur_api = await get_balance(client)
            # Приоритет — валюта из конфига (CURRENCY), API часто врёт USD на рублёвых счетах
            _cur_now = CURRENCY or _cur_api or "RUB"
            _cur_symbol = "₽" if _cur_now == "RUB" else ("$" if _cur_now == "USD" else _cur_now)
            _wins_now = sum(1 for t in trade_log if t["won"])
            _wr_now = f"{_wins_now/len(trade_log)*100:.0f}%" if trade_log else "—"
            _streak_now = (f"🔥{cur_streak}п" if cur_streak > 1 else (f"❄️{abs(cur_streak)}п" if cur_streak < -1 else ("✅1" if cur_streak == 1 else ("❌1" if cur_streak == -1 else "—"))))
            _profit_emoji = "🟢" if total_profit > 0 else ("🔴" if total_profit < 0 else "⚪")
            _trades_total = len(trade_log)
            # Мини-график последних 8 свечей: 🟩 зелёная, 🟥 красная, ⬜ дожи
            _mini_chart = ""
            try:
                _last8 = candles[-8:] if candles and len(candles) >= 1 else []
                for _mc in _last8:
                    if hasattr(_mc, 'open') and hasattr(_mc, 'close'):
                        _mo, _mcl = float(_mc.open), float(_mc.close)
                    elif isinstance(_mc, dict):
                        _mo = float(_mc.get('open', _mc.get('o', 0)))
                        _mcl = float(_mc.get('close', _mc.get('c', 0)))
                    elif hasattr(_mc, '__getitem__'):
                        _mo = float(_mc[0] if len(_mc) > 0 else 0)
                        _mcl = float(_mc[3] if len(_mc) > 3 else _mc[1])
                    else:
                        continue
                    if _mcl > _mo:
                        _mini_chart += "🟩"
                    elif _mcl < _mo:
                        _mini_chart += "🟥"
                    else:
                        _mini_chart += "⬜"
            except Exception:
                _mini_chart = ""
            _chart_line = f"  📊 {_mini_chart}" if _mini_chart else ""
            print(f"┌{'─'*65}")
            print(f"│ ⏰ {ts}  ▶  {trend_str}  ▶  Сигнал: {sig_emoji} {sig_str}{_chart_line}")
            print(f"│ 💰 {_bal_now:.2f}{_cur_symbol}  │  WR {_wr_now} ({_wins_now}/{_trades_total})  │  Серия {_streak_now}  │  {_profit_emoji} {total_profit:+.2f}{_cur_symbol}")

            if signal:
                labels = {"UP_UP": "🟢🟢", "DOWN_DOWN": "🔴🔴", "DOWN_UP": "🔴🟢", "UP_DOWN": "🟢🔴"}
                if TREND_FOLLOW != "combo":
                    if not trend_sig:
                        print(f"│ ❌ ПРОПУСК — тренд {labels.get(trend, trend or '?')} не подходит для режима '{TREND_MODE}'")
                        print(f"└{'─'*65}")
                        rejected_signals += 1
                        rejected_no_trend += 1
                        await asyncio.sleep(CHECK_INTERVAL)
                        continue
                    if signal != trend_sig:
                        print(f"│ ❌ ПРОПУСК — сигнал {signal} конфликтует с трендом {trend_sig} ({labels.get(trend, trend or '?')})")
                        print(f"└{'─'*65}")
                        rejected_signals += 1
                        rejected_conflict += 1
                        await asyncio.sleep(CHECK_INTERVAL)
                        continue
                print(f"│ ✅ ТОРГУЕМ — {signal} | тренд и сигнал совпадают")
            else:
                print(f"│ ⏸ ОЖИДАНИЕ — нет сигнала стратегии")
            print(f"└{'─'*65}")

            if signal:
                if BET_PERCENT:
                    balance, currency = await get_balance(client)
                    CURRENCY = currency
                    bet = round(balance * (BASE_BET / 100), 2)
                else:
                    balance, currency = await get_balance(client)
                    CURRENCY = currency
                    bet = current_bet

                # ===== ЗАЩИТА #1: ХВАТИТ ЛИ ДЕНЕГ НА СЧЁТЕ =====
                if balance > 0 and bet > balance:
                    insufficient_funds_count += 1
                    _remaining = INSUFFICIENT_FUNDS_LIMIT - insufficient_funds_count
                    print(f"{'='*55}")
                    print(f"[ЗАЩИТА] 💸 НЕДОСТАТОЧНО СРЕДСТВ #{insufficient_funds_count}/{INSUFFICIENT_FUNDS_LIMIT}")
                    print(f"[ЗАЩИТА]    Ставка: {bet:.2f} {currency}")
                    print(f"[ЗАЩИТА]    На счёте: {balance:.2f} {currency}")
                    print(f"[ЗАЩИТА]    Не хватает: {(bet - balance):.2f} {currency}")
                    print(f"[ЗАЩИТА]    💡 Сброс мартингейла к базовой ставке")
                    if _remaining > 0:
                        print(f"[ЗАЩИТА]    ⚠️ До авто-стопа осталось попыток: {_remaining}")
                    print(f"{'='*55}")
                    tg(
                        f"💸 <b>[{BOT_NAME}] Недостаточно средств #{insufficient_funds_count}/{INSUFFICIENT_FUNDS_LIMIT}</b>\\n"
                        f"Ставка: <b>{bet:.2f} {currency}</b>\\n"
                        f"На счёте: {balance:.2f} {currency}\\n"
                        f"Не хватает: {(bet - balance):.2f} {currency}\\n"
                        f"⚠️ Сброс мартингейла, осталось попыток: {max(0, _remaining)}"
                    )
                    # Сбрасываем мартингейл — ставка слишком большая для текущего баланса
                    try:
                        current_bet = BASE_BET
                        loss_streak = 0
                    except NameError:
                        pass

                    # ===== АВТО-СТОП БОТА: критически малый депозит =====
                    if insufficient_funds_count >= INSUFFICIENT_FUNDS_LIMIT:
                        print(f"{'='*55}")
                        print(f"[АВТО-СТОП] 🛑🛑🛑 КРИТИЧЕСКИ МАЛЫЙ ДЕПОЗИТ 🛑🛑🛑")
                        print(f"[АВТО-СТОП]    Бот {INSUFFICIENT_FUNDS_LIMIT} раз подряд не смог поставить сделку")
                        print(f"[АВТО-СТОП]    Текущий баланс: {balance:.2f} {currency}")
                        print(f"[АВТО-СТОП]    Базовая ставка: {BASE_BET:.2f} {currency}")
                        print(f"[АВТО-СТОП]    💡 Пополни счёт или уменьши базовую ставку")
                        print(f"[АВТО-СТОП]    🛑 БОТ ОСТАНОВЛЕН")
                        print(f"{'='*55}")
                        tg(
                            f"🛑🛑🛑 <b>[{BOT_NAME}] АВТО-СТОП</b>\\n"
                            f"Депозит критически мал!\\n"
                            f"Бот {INSUFFICIENT_FUNDS_LIMIT} раз подряд не смог поставить сделку.\\n\\n"
                            f"💰 Баланс: <b>{balance:.2f} {currency}</b>\\n"
                            f"📌 Базовая ставка: {BASE_BET:.2f} {currency}\\n\\n"
                            f"💡 Что делать:\\n"
                            f"• Пополни счёт\\n"
                            f"• Или уменьши базовую ставку\\n"
                            f"• Затем перезапусти бота"
                        )
                        return  # Выходим из main цикла → бот останавливается

                    await asyncio.sleep(CHECK_INTERVAL)
                    continue

                # ===== ЗАЩИТА #2: УМНЫЙ МАРТИНГЕЙЛ (3 ЛИМИТА, БЕРЁМ МИНИМУМ) =====
                _max_safe_bet = round(balance * (SAFETY_MAX_BET_PCT / 100.0), 2)
                if balance > 0 and bet > _max_safe_bet and bet >= BASE_BET:
                    _wanted_bet = bet
                    _limit_pct = _max_safe_bet
                    # Резерв: % баланса который должен ОСТАТЬСЯ → max ставка = баланс − резерв
                    _reserve_amount = round(balance * (SAFETY_MIN_RESERVE_PCT / 100.0), 2) if SAFETY_MIN_RESERVE_PCT > 0 else 0.0
                    _max_after_reserve = round(balance - _reserve_amount, 2) if _reserve_amount > 0 else _wanted_bet
                    _smart_bet = round(min(_wanted_bet, _limit_pct, _max_after_reserve if _max_after_reserve > 0 else _wanted_bet), 2)

                    print(f"{'='*55}")
                    print(f"[МАРТИНГЕЙЛ] 🧠 УМНЫЙ РАСЧЁТ СТАВКИ")
                    print(f"[МАРТИНГЕЙЛ]    Хотели:     {_wanted_bet:.2f} {currency} (мартингейл)")
                    print(f"[МАРТИНГЕЙЛ]    Лимит {SAFETY_MAX_BET_PCT}%:  {_limit_pct:.2f} {currency} (макс. % ставки)")
                    if SAFETY_MIN_RESERVE_PCT > 0:
                        print(f"[МАРТИНГЕЙЛ]    Резерв {SAFETY_MIN_RESERVE_PCT}%: {_reserve_amount:.2f} {currency} → можно ставить до {_max_after_reserve:.2f}")
                    else:
                        print(f"[МАРТИНГЕЙЛ]    Резерв:     ОТКЛ (0%)")
                    print(f"[МАРТИНГЕЙЛ]    Баланс:     {balance:.2f} {currency}")
                    print(f"[МАРТИНГЕЙЛ]    Итог:       {_smart_bet:.2f} {currency} ✅")
                    print(f"{'='*55}")

                    if _smart_bet < 1.0 or _smart_bet < BASE_BET:
                        # Денег мало для безопасной ставки → СБРОС К БАЗОВОЙ И ИДЁМ ТОРГОВАТЬ
                        print(f"[МАРТИНГЕЙЛ] 🔄 СБРОС К БАЗОВОЙ СТАВКЕ")
                        print(f"[МАРТИНГЕЙЛ]    Безопасный лимит ({_smart_bet:.2f}) меньше базовой ({BASE_BET:.2f})")
                        print(f"[МАРТИНГЕЙЛ]    Сбрасываем мартингейл и торгуем базовой: {_wanted_bet:.2f} → {BASE_BET:.2f}")
                        print(f"[МАРТИНГЕЙЛ]    Серия проигрышей: {loss_streak if 'loss_streak' in dir() else '?'} → 0")
                        tg(
                            f"🔄 <b>[{BOT_NAME}] Сброс к базовой ставке</b>\\n"
                            f"Хотели: {_wanted_bet:.2f} {currency} (мартингейл)\\n"
                            f"Безопасный лимит: {_smart_bet:.2f} (меньше базовой)\\n"
                            f"Ставим: <b>{BASE_BET:.2f} {currency}</b> (базовая)\\n"
                            f"Серия мартингейла обнулена"
                        )
                        try:
                            current_bet = BASE_BET
                            loss_streak = 0
                        except NameError:
                            pass
                        bet = BASE_BET
                        # Идём дальше — торгуем базовой ставкой
                        # (если и она не лезет — поймает защита #1: insufficient_funds_count)
                    else:
                        print(f"[МАРТИНГЕЙЛ] ⚠️ Ставка урезана: {_wanted_bet:.2f} → {_smart_bet:.2f} (защита баланса)")
                        tg(
                            f"⚠️ <b>[{BOT_NAME}] Мартингейл урезан</b>\\n"
                            f"Хотели: <b>{_wanted_bet:.2f} {currency}</b>\\n"
                            f"Ставим: <b>{_smart_bet:.2f} {currency}</b> (лимит {SAFETY_MAX_BET_PCT}% или резерв)\\n"
                            f"Баланс: {balance:.2f} {currency}"
                        )
                        bet = _smart_bet
                        try:
                            current_bet = _smart_bet
                        except NameError:
                            pass

                # Прошли все защиты — сбрасываем счётчик "недостаточно средств"
                if insufficient_funds_count > 0:
                    print(f"[ЗАЩИТА] ✅ Денег хватает, счётчик авто-стопа сброшен ({insufficient_funds_count} → 0)")
                    insufficient_funds_count = 0

                if trend_sig and signal == trend_sig:
                    calls_follow += 1
                elif trend_sig and signal != trend_sig:
                    calls_reverse += 1
                elif not trend_sig:
                    calls_reverse += 1
                emoji = "📈" if signal == "CALL" else "📉"
                _tlabels = {"UP_UP": "🟢🟢 Два зелёных", "DOWN_DOWN": "🔴🔴 Два красных", "DOWN_UP": "🔴🟢 Разворот вверх", "UP_DOWN": "🟢🔴 Разворот вниз"}
                trend_label = f"Тренд: {_tlabels.get(trend, '— нет')}"
                if signal_info:
                    print(f"[SIGNAL] {signal_info}")
                sig_line = f"📊 Сигнал: {signal_info}" if signal_info else ""
                # Метка режима EMA (если стратегия EMA активна)
                _ema_mode_emoji = {"cross": "⚡", "trend": "📈", "trend_with_cross": "🎯"}
                _ema_mode_label = {"cross": "Cross — пересечение", "trend": "Trend — позиция EMA", "trend_with_cross": "Гибрид — тренд+кросс"}
                _has_ema = ("EMA" in (signal_info or "")) or ("ema" in (signal_info or ""))
                ema_line = f"{_ema_mode_emoji.get(EMA_MODE, '·')} Режим EMA: <b>{_ema_mode_label.get(EMA_MODE, EMA_MODE)}</b>" if (_has_ema and 'EMA_MODE' in globals()) else ""
                tg_parts = [f"{emoji} <b>[{BOT_NAME}] Сделка открыта</b>", f"{signal} | {bet} {currency} | {ASSET} | {EXPIRY_SEC//60} мин", trend_label]
                if sig_line:
                    tg_parts.append(sig_line)
                if ema_line:
                    tg_parts.append(ema_line)
                tg_parts.append(f"📋 Сделок сегодня: {trades_today + 1}")
                # При первой сделке — добавляем инфо о синхронизации часов
                if trades_today == 0:
                    try:
                        _ts = getattr(buf, 'time_shift', None)
                        if _ts is not None:
                            _h = int(abs(_ts) // 3600)
                            _m = int((abs(_ts) % 3600) // 60)
                            _sign = '+' if _ts >= 0 else '-'
                            tg_parts.append(f"🕐 Синхр. часов: сервер {_sign}{_h}ч{_m:02d}м (ОК, авто-калибровка работает)")
                    except Exception:
                        pass
                tg("\\n".join(tg_parts))
                balance_before, _ = await get_balance(client)
                _pt_result = await place_trade(client, signal, bet)
                order_id = _pt_result[0] if isinstance(_pt_result, (list, tuple)) else _pt_result
                entry_price = float(_pt_result[1]) if isinstance(_pt_result, (list, tuple)) and len(_pt_result) > 1 and _pt_result[1] else 0.0
                if entry_price == 0.0 and candles:
                    try:
                        _lc = candles[-1]
                        if hasattr(_lc, 'close'):
                            entry_price = float(_lc.close)
                        elif isinstance(_lc, dict):
                            entry_price = float(_lc.get('close', _lc.get('c', 0)))
                        elif hasattr(_lc, '__getitem__'):
                            entry_price = float(_lc[3] if len(_lc) > 3 else _lc[1])
                    except Exception as e2:
                        print(f"[ENTRY_PRICE] Fallback ошибка: {e2}")
                print(f"[ENTRY_PRICE] entry_price={entry_price}")

                # ===== 🛡 КАСКАДНЫЙ ХЕДЖ — стартуем сразу с основной (НЕ ждём 60с) =====
                cascade_hedge1_info = None
                cascade_task = None
                cascade_h1_task = None  # хедж-1 теперь тоже неблокирующий
                cascade_started_at = asyncio.get_event_loop().time()
                _cascade_enabled_runtime = ${cfg.hedgeCascadeEnabled ? "True" : "False"}
                print(f"[CASCADE] 🔍 проверка: enabled={_cascade_enabled_runtime} | order_id={order_id} | entry_price={entry_price}")
                if order_id and _cascade_enabled_runtime and entry_price > 0:
                    print(f"[CASCADE] 🚀 ВКЛЮЧЁН — стартую каскад страховки")
                    # ХЕДЖ-1: сразу с основной, противоположное направление, та же экспирация, размер X
                    _h1_mult = ${cfg.hedgeCascadeM1 ?? 1.5}
                    _h1_bet  = round(bet * _h1_mult, 2)
                    _h1_dir  = "PUT" if signal == "CALL" else "CALL"

                    async def _open_hedge1():
                        """Хедж-1 в отдельной таске — не блокирует основной поток."""
                        try:
                            print(f"[CASCADE] 🛡 ХЕДЖ-1 ЗАПУСК: {_h1_dir} | {_h1_bet} (×{_h1_mult}) | экспирация {EXPIRY_SEC}с")
                            _bal_h1, _ = await get_balance(client)
                            print(f"[CASCADE] 🛡 ХЕДЖ-1: баланс={_bal_h1}")
                            if _h1_bet > _bal_h1:
                                print(f"[CASCADE] ⛔ ХЕДЖ-1 отменён: ставка {_h1_bet} > баланс {_bal_h1}")
                                try:
                                    tg(f"⛔ <b>[CASCADE Хедж-1 отменён]</b>\\nБаланс {_bal_h1:.2f} < {_h1_bet:.2f}")
                                except Exception:
                                    pass
                                return None
                            _dv1 = OrderDirection.CALL if _h1_dir == "CALL" else OrderDirection.PUT
                            print(f"[CASCADE] 🛡 ХЕДЖ-1: вызываю place_order...")
                            _ord1 = await asyncio.wait_for(
                                client.place_order(asset=(_resolved_asset or ASSET), amount=_h1_bet, direction=_dv1, duration=EXPIRY_SEC),
                                timeout=15,
                            )
                            _oid1 = getattr(_ord1, 'order_id', None) if _ord1 else None
                            print(f"[CASCADE] 🛡 ХЕДЖ-1: place_order вернул order_id={_oid1}")
                            if _oid1:
                                try:
                                    tg(f"🛡 <b>[CASCADE Хедж-1]</b> {_h1_dir} | {_h1_bet} | страховка против {signal} | {EXPIRY_SEC//60} мин")
                                except Exception as _te1:
                                    print(f"[CASCADE] tg ошибка: {_te1}")
                                return (_oid1, _h1_bet, "H1", _bal_h1)
                            return None
                        except asyncio.TimeoutError:
                            print(f"[CASCADE] ⏱ ХЕДЖ-1 ТАЙМАУТ 15с — брокер не ответил, пропуск")
                            try: tg(f"⏱ <b>[CASCADE Хедж-1]</b> Таймаут — брокер не ответил")
                            except: pass
                            return None
                        except Exception as _eh1:
                            import traceback as _tb1
                            print(f"[CASCADE] ❌ ХЕДЖ-1 КРИТ. ОШИБКА: {_eh1}")
                            print(_tb1.format_exc())
                            try: tg(f"❌ <b>[CASCADE Хедж-1]</b> Ошибка: {_eh1}")
                            except: pass
                            return None

                    # 🚫 Если множитель = 0 → ХЕДЖ-1 ОТКЛЮЧЁН пользователем
                    if _h1_mult <= 0 or _h1_bet <= 0:
                        print(f"[CASCADE] 🚫 ХЕДЖ-1 ОТКЛЮЧЁН (множитель={_h1_mult}) — пропускаем")
                        cascade_h1_task = None
                    else:
                        # Запускаем хедж-1 как НЕБЛОКИРУЮЩУЮ таску
                        cascade_h1_task = asyncio.create_task(_open_hedge1())
                        print(f"[CASCADE] 🛡 ХЕДЖ-1: задача создана (неблокирующая)")

                    # Обёртка для каскад-монитора с traceback на любую ошибку
                    async def _safe_cascade():
                        try:
                            return await cascade_hedge_monitor(client, signal, bet, entry_price, EXPIRY_SEC, cascade_started_at)
                        except Exception as _ec:
                            import traceback as _tbc
                            print(f"[CASCADE] ❌ МОНИТОР КРИТ. ОШИБКА: {_ec}")
                            print(_tbc.format_exc())
                            try: tg(f"❌ <b>[CASCADE Монитор]</b> Ошибка: {_ec}")
                            except: pass
                            return []

                    cascade_task = asyncio.create_task(_safe_cascade())
                    print(f"[CASCADE] 🛡 МОНИТОР: задача создана (хедж-2/хедж-3)")
                else:
                    if not _cascade_enabled_runtime:
                        print(f"[CASCADE] ⏭ ВЫКЛЮЧЕН в настройках")
                    elif entry_price <= 0:
                        print(f"[CASCADE] ⛔ entry_price={entry_price} — каскад НЕ запущен")
                    elif not order_id:
                        print(f"[CASCADE] ⛔ order_id отсутствует — каскад НЕ запущен")

                if order_id:
                    # Пауза 60с и обновление цены входа из свежей 1-минутной свечи
                    print(f"[ENTRY_PRICE] Пауза 60с для точного определения цены...")
                    await asyncio.sleep(60)
                    try:
                        _upd = await client.get_candles(asset=(_resolved_asset or ASSET), timeframe=60, count=3)
                        if _upd:
                            def _gt(c):
                                for _t in ('time', 't', 'timestamp', 'open_time'):
                                    if hasattr(c, _t):
                                        try: return float(getattr(c, _t))
                                        except: pass
                                    if isinstance(c, dict) and c.get(_t):
                                        try: return float(c[_t])
                                        except: pass
                                return 0
                            def _gc(c):
                                if hasattr(c, 'close'): return float(c.close)
                                if isinstance(c, dict): return float(c.get('close', c.get('c', 0)))
                                if hasattr(c, '__getitem__'): return float(c[3] if len(c) > 3 else c[1])
                                return 0
                            _su = sorted(_upd, key=_gt)
                            _ucand = _su[-1] if _gt(_su[-1]) > 0 else _upd[-1]
                            _np = _gc(_ucand)
                            if _np > 0:
                                entry_price = _np
                        print(f"[ENTRY_PRICE] Точная цена входа после 60с: {entry_price}")
                    except Exception as _ue:
                        print(f"[ENTRY_PRICE] Обновление не удалось: {_ue}")
                    # Запускаем хедж и расширение прибыли параллельно ДО ожидания результата
                    hedge_task = asyncio.create_task(
                        hedge_monitor(client, signal, bet, entry_price, EXPIRY_SEC)
                    ) if entry_price > 0 else None
                    ext_task = asyncio.create_task(
                        profit_extension_monitor(client, signal, bet, entry_price, EXPIRY_SEC)
                    ) if entry_price > 0 else None
                    if entry_price == 0.0:
                        print("[WARN] entry_price=0 — хедж и расширение прибыли НЕ запущены!")
                    # Ждём основной ордер и мониторы параллельно
                    main_result_task = asyncio.create_task(check_result(client, order_id, balance_before, bet))
                    gather_results = await asyncio.gather(
                        main_result_task,
                        hedge_task or asyncio.sleep(0),
                        ext_task or asyncio.sleep(0),
                        cascade_task or asyncio.sleep(0),
                        cascade_h1_task or asyncio.sleep(0),
                        return_exceptions=True,
                    )
                    main_res = gather_results[0]
                    hedge_res = gather_results[1]
                    ext_res   = gather_results[2]
                    cascade_res = gather_results[3]
                    cascade_h1_res = gather_results[4]
                    won, profit, loss_amount = main_res if not isinstance(main_res, Exception) else (False, 0.0, bet)

                    # Сохраняем результат хедж-1 (если открылся)
                    if cascade_h1_task and not isinstance(cascade_h1_res, Exception) and cascade_h1_res:
                        cascade_hedge1_info = cascade_h1_res
                        print(f"[CASCADE] ✅ ХЕДЖ-1 итог: {cascade_h1_res}")
                    elif cascade_h1_task and isinstance(cascade_h1_res, Exception):
                        print(f"[CASCADE] ❌ ХЕДЖ-1 завершился с ошибкой: {cascade_h1_res}")

                    # ===== Подсчёт результатов каскадного хеджа =====
                    cascade_orders = []
                    if cascade_hedge1_info is not None:
                        cascade_orders.append(cascade_hedge1_info)
                    if cascade_task and not isinstance(cascade_res, Exception) and isinstance(cascade_res, list):
                        cascade_orders.extend(cascade_res)
                    print(f"[CASCADE] 📊 Итого хеджей открыто: {len(cascade_orders)}")
                    # 🎯 СВОДКА КАСКАДА: собираем все результаты и шлём ОДНО сообщение
                    _cascade_summary_lines = []
                    _cascade_results_data = []  # для JSONL отчёта
                    _cascade_total_pl = 0.0
                    _cascade_wins_cnt = 0
                    _cascade_loss_cnt = 0
                    _cascade_total_bet = 0.0
                    for _co_id, _co_bet, _co_lvl, _co_bal in cascade_orders:
                        try:
                            _cw, _cp, _cl = await check_result(client, _co_id, _co_bal, _co_bet, wait_sec=10)
                            _cmark = f"✅ +{_cp:.2f}" if _cw else f"❌ -{_cl:.2f}"
                            _cpl = _cp - _cl  # P&L для этого хеджа
                            _co_roi = round((_cpl / _co_bet * 100) if _co_bet > 0 else 0, 1)
                            print(f"[CASCADE] {_co_lvl} результат: {_cmark} (ставка {_co_bet}) ROI={_co_roi}%")
                            _cascade_summary_lines.append(
                                f"{'✅' if _cw else '❌'} <b>{_co_lvl}</b>: ставка {_co_bet:.2f} → {_cpl:+.2f} {currency} (ROI {_co_roi:+.1f}%)"
                            )
                            _cascade_results_data.append({
                                "level": _co_lvl, "order_id": str(_co_id), "bet": _co_bet,
                                "won": _cw, "profit": _cp, "loss": _cl, "pnl": _cpl, "roi_pct": _co_roi,
                            })
                            _cascade_total_pl += _cpl
                            _cascade_total_bet += _co_bet
                            if _cw: _cascade_wins_cnt += 1
                            else:   _cascade_loss_cnt += 1
                            profit      += _cp
                            loss_amount += _cl
                        except Exception as _cre:
                            print(f"[CASCADE] Ошибка получения результата {_co_lvl}: {_cre}")
                            _cascade_summary_lines.append(f"⚠️ <b>{_co_lvl}</b>: ошибка получения результата")
                    # Шлём ОБЩУЮ сводку каскада в ТГ (если хотя бы 1 хедж был открыт)
                    if cascade_orders:
                        _cascade_emoji = "🟢" if _cascade_total_pl > 0 else ("🔴" if _cascade_total_pl < 0 else "⚪")
                        _cascade_status = "В ПЛЮСЕ" if _cascade_total_pl > 0 else ("В МИНУСЕ" if _cascade_total_pl < 0 else "В НОЛЬ")
                        _cascade_total_roi = round((_cascade_total_pl / _cascade_total_bet * 100) if _cascade_total_bet > 0 else 0, 1)
                        _cascade_wr = round((_cascade_wins_cnt / len(cascade_orders) * 100) if cascade_orders else 0, 1)
                        try:
                            tg(
                                f"{_cascade_emoji} <b>📊 СВОДКА КАСКАДА — {_cascade_status}</b>\\n"
                                f"━━━━━━━━━━━━━━━━━━━━\\n"
                                + "\\n".join(_cascade_summary_lines) + "\\n"
                                f"━━━━━━━━━━━━━━━━━━━━\\n"
                                f"🎯 Хеджей: <b>{len(cascade_orders)}</b> (✅ {_cascade_wins_cnt} / ❌ {_cascade_loss_cnt}) | WR: <b>{_cascade_wr}%</b>\\n"
                                f"💰 Ставки в каскаде: <b>{_cascade_total_bet:.2f} {currency}</b>\\n"
                                f"💵 Итог каскада: <b>{_cascade_total_pl:+.2f} {currency}</b> | ROI: <b>{_cascade_total_roi:+.1f}%</b>"
                            )
                        except Exception as _cs_e:
                            print(f"[CASCADE] Ошибка отправки сводки: {_cs_e}")
                        # Запись итога каскада в отчёт
                        try:
                            report_log("cascade_summary", {
                                "main_direction": signal, "main_bet": bet, "strike_price": entry_price,
                                "hedges_count": len(cascade_orders),
                                "wins": _cascade_wins_cnt, "losses": _cascade_loss_cnt,
                                "win_rate_pct": _cascade_wr,
                                "total_bet": round(_cascade_total_bet, 2),
                                "total_pnl": round(_cascade_total_pl, 2),
                                "total_roi_pct": _cascade_total_roi,
                                "results": _cascade_results_data,
                            })
                        except Exception as _re: print(f"[REPORT] err: {_re}")
                    if hedge_task and not isinstance(hedge_res, Exception) and isinstance(hedge_res, tuple) and len(hedge_res) >= 3:
                        # Безопасная распаковка: берём первые 3 значения, остальные игнорим
                        hedge_order_id = hedge_res[0]
                        hedge_bet = hedge_res[1]
                        hedge_remaining = hedge_res[2] if len(hedge_res) > 2 else 0
                        if hedge_order_id:
                            hedge_count += 1
                            h_won, h_profit, h_loss = await check_result(client, hedge_order_id, balance_before, hedge_bet, wait_sec=hedge_remaining)
                            if h_won:
                                hedge_wins += 1
                            hedge_result = f"✅ +{h_profit:.2f}" if h_won else f"❌ -{h_loss:.2f}"
                            tg(f"🛡 <b>Хедж результат:</b> {hedge_result} {currency}")
                            profit      += h_profit
                            loss_amount += h_loss
                    if ext_task and not isinstance(ext_res, Exception) and isinstance(ext_res, list):
                        for ext_id, ext_bet, ext_type, ext_remaining in ext_res:
                            ext_count += 1
                            e_won, e_profit, e_loss = await check_result(client, ext_id, balance_before, ext_bet, wait_sec=ext_remaining)
                            if e_won:
                                ext_wins += 1
                            ext_result = f"✅ +{e_profit:.2f}" if e_won else f"❌ -{e_loss:.2f}"
                            tg(f"{'📈' if ext_type == 'TREND' else '🔄'} <b>Расширение {ext_type}:</b> {ext_result} {currency}")
                            profit      += e_profit
                            loss_amount += e_loss
                    total_profit += profit - loss_amount
                    trades_today += 1
                    current_bet   = adjust_bet(won)
                    trade_log.append({
                        "time": datetime.now().strftime("%H:%M:%S"),
                        "direction": signal,
                        "amount": bet,
                        "won": won,
                        "profit": profit,
                    })
                    # 📊 ПОЛНАЯ запись сделки в JSONL для аналитики
                    try:
                        _trade_pnl = round(profit - loss_amount, 2)
                        _trade_roi = round((_trade_pnl / bet * 100) if bet > 0 else 0, 1)
                        _final_balance, _ = await get_balance(client)
                        report_log("trade", {
                            "order_id": str(order_id) if order_id else None,
                            "main_direction": signal,
                            "main_won": won,
                            "main_bet": bet,
                            "main_profit_currency": round(profit, 2),
                            "main_loss_currency": round(loss_amount, 2),
                            "strike_price": entry_price,
                            "expiry_sec": EXPIRY_SEC,
                            "signal_info": signal_info if 'signal_info' in dir() else "",
                            "total_pnl": _trade_pnl,
                            "total_roi_pct": _trade_roi,
                            "total_profit_session": round(total_profit, 2),
                            "trades_today": trades_today,
                            "win_rate_pct": round(sum(1 for t in trade_log if t["won"]) / len(trade_log) * 100, 1),
                            "cascade_used": len(cascade_orders) > 0 if 'cascade_orders' in dir() else False,
                            "cascade_hedges_count": len(cascade_orders) if 'cascade_orders' in dir() else 0,
                            "hedge_used": hedge_count > 0,
                            "hedge_count": hedge_count,
                            "ext_used": ext_count > 0,
                            "ext_count": ext_count,
                            "balance_before": balance_before,
                            "balance_after": _final_balance,
                            "current_streak": cur_streak,
                            "martingale_step": current_bet != BASE_BET,
                        })
                    except Exception as _re: print(f"[REPORT] err: {_re}")
                    wins  = sum(1 for t in trade_log if t["won"])
                    wr    = wins / len(trade_log) * 100
                    # Обновляем серию
                    if won:
                        cur_streak = cur_streak + 1 if cur_streak > 0 else 1
                    else:
                        cur_streak = cur_streak - 1 if cur_streak < 0 else -1
                    streak_str = (f"🔥 {cur_streak} подряд" if cur_streak > 1 else (f"❄️ {abs(cur_streak)} подряд" if cur_streak < -1 else ""))
                    res_emoji = "✅" if won else "❌"
                    hedge_stat = f" | 🛡 {hedge_wins}/{hedge_count}" if hedge_count > 0 else ""
                    ext_stat   = f" | 📈 {ext_wins}/{ext_count}" if ext_count > 0 else ""
                    streak_log = f" | {streak_str}" if streak_str else ""
                    balance_after, _ = await get_balance(client)
                    print(f"{'='*55}")
                    print(f"[РЕЗУЛЬТАТ] {res_emoji} {'ПОБЕДА' if won else 'ПОРАЖЕНИЕ'} | {profit:+.2f} {currency} | баланс: {balance_after:.2f} {currency}{streak_log}")
                    print(f"[СЕССИЯ]   Сделок: {len(trade_log)} | WR: {wr:.0f}% ({wins}/{len(trade_log)}) | Профит: {total_profit:+.2f} {currency}")
                    print(f"{'='*55}")
                    tg(f"{res_emoji} <b>[{BOT_NAME}] {'Выигрыш' if won else 'Проигрыш'}</b>\\n{signal} | {bet} {currency} | {ASSET}\\nПрофит: {profit:+.2f} {currency}\\nСессия: {total_profit:+.2f} {currency} | WR: {wr:.0f}% ({wins}/{len(trade_log)}){hedge_stat}{ext_stat}")
                    print_stats()
                    # 🎮 Авто-меню после каждой сделки (inline-кнопки)
                    try:
                        tg_show_main_menu()
                    except Exception as _me:
                        print(f"[TG_MENU] Ошибка показа меню: {_me}")
            else:
                ts = datetime.now().strftime("%H:%M:%S")
                print(f"[{ts}] Нет сигнала, ожидание {CHECK_INTERVAL} сек...")
                await asyncio.sleep(CHECK_INTERVAL)

        except Exception as e:
            err = str(e)
            _reconnect_attempts += 1
            if _reconnect_attempts > 10:
                print("[ERROR] Слишком много обрывов подряд, завершение.")
                tg_info("🔴 <b>Бот остановлен</b>\\nСлишком много обрывов соединения.")
                break
            print(f"[RECONNECT] Обрыв соединения ({_reconnect_attempts}/10): {err}")
            tg_info(f"⚠️ <b>Обрыв соединения</b>\\nПопытка переподключения {_reconnect_attempts}/10...")
            try:
                await client.connect()
                await asyncio.sleep(5)
                print("[RECONNECT] Переподключение успешно, продолжаю...")
                tg_info(f"✅ <b>Переподключение успешно</b>\\nБот продолжает работу | Сессия: {total_profit:+.2f} {CURRENCY}")
            except Exception as re:
                print(f"[RECONNECT] Не удалось переподключиться: {re}")
                await asyncio.sleep(10)

    await client.disconnect()

if __name__ == "__main__":
    print("════════════════════════════════════════")
    print("  КОНФИГУРАЦИЯ БОТА")
    print("════════════════════════════════════════")
    print(f"  Стратегия  : ${strategyLabel}")
    print(f"  Актив      : {ASSET}")
    print(f"  Экспирация : {EXPIRY_SEC} сек")
    print(f"  Ставка     : {BASE_BET} {CURRENCY}")
    print(f"  Режим      : {'ДЕМО-СЧЁТ' if IS_DEMO else 'РЕАЛЬНЫЙ СЧЁТ'}")
    print(f"  Take Profit: {TAKE_PROFIT} {CURRENCY}")
    print(f"  Stop Loss  : {STOP_LOSS} {CURRENCY}")
    print(f"  Лимит/день : {DAILY_LIMIT} сделок")
    print(f"  Режим свечей: {TREND_MODE}")
    print("════════════════════════════════════════")
    asyncio.run(main())
`
  )
}

// ===== COMBO CODE GENERATOR =====
export function generatePOComboCode(cfg: POBotConfig): string {
  const selected = cfg.comboStrategies.filter((s) => s !== "martingale")
  const labels = selected.map((s) => PO_STRATEGIES[s].label).join(" + ")
  const logicWord = cfg.comboLogic === "AND" ? "все подтверждают" : "хотя бы одна подтверждает"

  const martingaleBlock = cfg.martingaleEnabled
    ? `
current_bet = BASE_BET
loss_streak = 0

def adjust_bet(won, profit=0.0, bet=0.0):
    """
    Мартингейл по РЕАЛЬНОМУ итогу сделки (с учётом хеджа и расширения прибыли).
    
    ✅ ЛЮБОЙ ПЛЮС (profit > 0) — считаем ПОБЕДОЙ → сброс к BASE_BET (даже если хедж урезал)
    ❌ ПРОИГРЫШ (profit <= 0) — реальный убыток → УВЕЛИЧИВАЕМ ставку (классический Мартингейл)
    """
    global current_bet, loss_streak
    # 🛡️ ЖЁСТКАЯ ЗАЩИТА: если мартингейл отключён в настройках — всегда базовая ставка
    if not MARTINGALE:
        current_bet = BASE_BET
        loss_streak = 0
        return BASE_BET
    _prev_bet = current_bet
    _prev_streak = loss_streak
    # Любой плюс = победа. Хедж не должен ломать мартингейл.
    is_win = profit > 0
    if is_win:
        # Подробный лог: куда делись деньги
        _full_payout = profit >= bet
        _payout_label = "ПОЛНАЯ ВЫПЛАТА" if _full_payout else "УРЕЗАННАЯ ВЫПЛАТА (хедж/частичный профит)"
        if loss_streak > 0:
            print(f"[МАРТИНГЕЙЛ] ━━━━━━━━━━━━━━━━━━━━")
            print(f"[МАРТИНГЕЙЛ] ✅ ПОБЕДА — серия проигрышей оборвана!")
            print(f"[МАРТИНГЕЙЛ]    Тип: {_payout_label}")
            print(f"[МАРТИНГЕЙЛ]    Серия: {_prev_streak} проигрышей → 0 (сброс)")
            print(f"[МАРТИНГЕЙЛ]    Ставка: {_prev_bet:.2f} → {BASE_BET:.2f} (возврат к базовой)")
            print(f"[МАРТИНГЕЙЛ]    Профит сделки: +{profit:.2f} (ставка была {bet:.2f})")
            if not _full_payout:
                print(f"[МАРТИНГЕЙЛ]    💡 Прибыль меньше ставки, но всё равно В ПЛЮСЕ — мартингейл сброшен")
            print(f"[МАРТИНГЕЙЛ] ━━━━━━━━━━━━━━━━━━━━")
            tg_info(f"✅ <b>[{BOT_NAME}] Серия отыграна!</b>\\nБыло {_prev_streak} проигрышей подряд\\nПрофит: +{profit:.2f} ({_payout_label})\\nСтавка: {_prev_bet:.2f} → <b>{BASE_BET:.2f}</b>")
        else:
            print(f"[МАРТИНГЕЙЛ] ✅ Победа ({_payout_label}) | Ставка базовая: {BASE_BET:.2f} | Профит: +{profit:.2f} | Ставка: {bet:.2f}")
        current_bet = BASE_BET
        loss_streak = 0
    else:
        loss_streak += 1
        # Тут мы реально в минусе или ноль — классический мартингейл
        event = f"❌ Проигрыш (итог {profit:.2f}, ставка была {bet:.2f})"
        event_short = "Проигрыш"
        if loss_streak <= ${cfg.martingaleSteps}:
            new_bet = round(current_bet * ${cfg.martingaleMultiplier}, 2)
            # Прогноз риска: общая сумма серии и потенциальный убыток
            _step_label = f"{loss_streak}/${cfg.martingaleSteps}"
            print(f"[МАРТИНГЕЙЛ] ━━━━━━━━━━━━━━━━━━━━")
            print(f"[МАРТИНГЕЙЛ] {event}")
            print(f"[МАРТИНГЕЙЛ]    Шаг серии: {_step_label}")
            print(f"[МАРТИНГЕЙЛ]    Ставка: {_prev_bet:.2f} → {new_bet:.2f} (×${cfg.martingaleMultiplier})")
            print(f"[МАРТИНГЕЙЛ]    Цель: отыграть {profit:.2f} следующей сделкой")
            print(f"[МАРТИНГЕЙЛ] ━━━━━━━━━━━━━━━━━━━━")
            # Telegram только когда серия становится опасной (от 2-го шага)
            if loss_streak >= 2:
                tg_info(
                    f"⚠️ <b>[{BOT_NAME}] {event_short} #{loss_streak}</b>\\n"
                    f"Шаг серии: <b>{_step_label}</b>\\n"
                    f"Ставка: {_prev_bet:.2f} → <b>{new_bet:.2f}</b> (×${cfg.martingaleMultiplier})\\n"
                    f"Убыток сделки: {profit:.2f}"
                )
            current_bet = new_bet
        else:
            print(f"[МАРТИНГЕЙЛ] ━━━━━━━━━━━━━━━━━━━━")
            print(f"[МАРТИНГЕЙЛ] 🛑 ЛИМИТ ШАГОВ ИСЧЕРПАН (${cfg.martingaleSteps}/${cfg.martingaleSteps})")
            print(f"[МАРТИНГЕЙЛ]    Принудительный сброс ставки: {_prev_bet:.2f} → {BASE_BET:.2f}")
            print(f"[МАРТИНГЕЙЛ]    Серия: {_prev_streak} → 0 (обнулена)")
            print(f"[МАРТИНГЕЙЛ]    💡 Стратегия: фиксируем убыток и начинаем заново с базы")
            print(f"[МАРТИНГЕЙЛ] ━━━━━━━━━━━━━━━━━━━━")
            tg_info(
                f"🛑 <b>[{BOT_NAME}] Лимит мартингейла!</b>\\n"
                f"Достигнут максимум шагов (${cfg.martingaleSteps})\\n"
                f"Сброс ставки: {_prev_bet:.2f} → <b>{BASE_BET:.2f}</b>\\n"
                f"Начинаем серию заново"
            )
            current_bet = BASE_BET
            loss_streak = 0
    return current_bet
`
    : `
current_bet = BASE_BET

def adjust_bet(won, profit=0.0, bet=0.0):
    """Без мартингейла — всегда возвращаем базовую ставку (profit/bet принимаем для совместимости)."""
    return BASE_BET
`

  const fnBlocks: string[] = []
  const callLines: string[] = []

  if (selected.includes("rsi_reversal")) {
    fnBlocks.push(`
def calculate_rsi(prices, period=${cfg.rsiPeriod}):
    deltas = [prices[i] - prices[i-1] for i in range(1, len(prices))]
    gains  = [d if d > 0 else 0 for d in deltas]
    losses = [-d if d < 0 else 0 for d in deltas]
    avg_gain = sum(gains[-period:]) / period
    avg_loss = sum(losses[-period:]) / period
    if avg_loss == 0:
        return 100
    return 100 - (100 / (1 + avg_gain / avg_loss))

def signal_rsi(prices, candles):
    rsi = calculate_rsi(prices)
    if rsi <= ${cfg.rsiOversold}: return "${cfg.trendFollow !== "reverse" ? "CALL" : "PUT"}", f"RSI={rsi:.1f}≤${cfg.rsiOversold}"
    if rsi >= ${cfg.rsiOverbought}: return "${cfg.trendFollow !== "reverse" ? "PUT" : "CALL"}", f"RSI={rsi:.1f}≥${cfg.rsiOverbought}"
    return None, f"RSI={rsi:.1f}"`)
    callLines.push("signal_rsi(prices, candles)")
  }

  if (selected.includes("ema_cross") || selected.includes("ema_trend")) {
    // В комбо-режиме используется универсальная EMA-функция с тремя режимами (cross/trend/trend_with_cross),
    // выбираемыми через cfg.emaMode. Если в combo выбраны и ema_cross и ema_trend — это эквивалентно одному signal_ema.
    fnBlocks.push(`
def calculate_ema(prices, period):
    k = 2 / (period + 1)
    ema = [prices[0]]
    for p in prices[1:]:
        ema.append(p * k + ema[-1] * (1 - k))
    return ema

# EMA_MODE: "cross" | "trend" | "trend_with_cross"
EMA_MODE = "${cfg.emaMode ?? "cross"}"
EMA_CROSS_LOOKBACK = 5

def signal_ema(prices, candles):
    if len(prices) < ${cfg.emaSlow} + 2:
        return None, ""
    fast = calculate_ema(prices, ${cfg.emaFast})
    slow = calculate_ema(prices, ${cfg.emaSlow})
    above = fast[-1] > slow[-1]
    cross_up   = above and fast[-2] <= slow[-2]
    cross_down = (not above) and fast[-2] >= slow[-2]
    info = f"EMA${cfg.emaFast}={fast[-1]:.5f}/EMA${cfg.emaSlow}={slow[-1]:.5f}[{EMA_MODE}]"
    if EMA_MODE == "cross":
        if cross_up:   return "${cfg.trendFollow !== "reverse" ? "CALL" : "PUT"}", f"{info}↑кросс"
        if cross_down: return "${cfg.trendFollow !== "reverse" ? "PUT" : "CALL"}", f"{info}↓кросс"
        return None, info
    if EMA_MODE == "trend":
        if above: return "${cfg.trendFollow !== "reverse" ? "CALL" : "PUT"}", f"{info}↑тренд"
        return "${cfg.trendFollow !== "reverse" ? "PUT" : "CALL"}", f"{info}↓тренд"
    # trend_with_cross — гибрид
    recent = False
    lb = min(EMA_CROSS_LOOKBACK, len(fast) - 1)
    for i in range(1, lb + 1):
        if above and fast[-i-1] <= slow[-i-1] and fast[-i] > slow[-i]:
            recent = True; break
        if (not above) and fast[-i-1] >= slow[-i-1] and fast[-i] < slow[-i]:
            recent = True; break
    if not recent:
        return None, f"{info} (нет свежего кросса)"
    if above: return "${cfg.trendFollow !== "reverse" ? "CALL" : "PUT"}", f"{info}↑тренд+кросс"
    return "${cfg.trendFollow !== "reverse" ? "PUT" : "CALL"}", f"{info}↓тренд+кросс"`)
    callLines.push("signal_ema(prices, candles)")
  }

  if (selected.includes("candle_pattern")) {
    fnBlocks.push(`
def signal_candle_pattern(prices, candles):
    if not candles or len(candles) < 3:
        return None, ""
    o1, h1, l1, c1 = candles[-2][:4]
    o2, h2, l2, c2 = candles[-1][:4]
    body2 = abs(c2 - o2)
    low_sh = min(o2, c2) - l2
    up_sh  = h2 - max(o2, c2)
    if low_sh > body2 * 2 and up_sh < body2 * 0.5 and c1 < o1: return "${cfg.trendFollow !== "reverse" ? "CALL" : "PUT"}", "Молот🔨"
    if up_sh > body2 * 2 and low_sh < body2 * 0.5 and c1 > o1: return "${cfg.trendFollow !== "reverse" ? "PUT" : "CALL"}", "Звезда⭐"
    if c1 < o1 and c2 > o2 and c2 > o1 and o2 < c1: return "${cfg.trendFollow !== "reverse" ? "CALL" : "PUT"}", "Поглощение🟢"
    if c1 > o1 and c2 < o2 and c2 < o1 and o2 > c1: return "${cfg.trendFollow !== "reverse" ? "PUT" : "CALL"}", "Поглощение🔴"
    return None, "Нет паттерна"`)
    callLines.push("signal_candle_pattern(prices, candles)")
  }

  if (selected.includes("support_resistance")) {
    fnBlocks.push(`
def find_levels(prices, window=10):
    sup, res = [], []
    for i in range(window, len(prices) - window):
        if prices[i] == min(prices[i-window:i+window]): sup.append(prices[i])
        if prices[i] == max(prices[i-window:i+window]): res.append(prices[i])
    return sup[-3:], res[-3:]

def signal_support_resistance(prices, candles):
    if len(prices) < 30:
        return None, ""
    sup, res = find_levels(prices)
    cur = prices[-1]
    thr = cur * 0.001
    for s in sup:
        if abs(cur - s) < thr: return "${cfg.trendFollow !== "reverse" ? "CALL" : "PUT"}", f"Поддержка={s:.5f}"
    for r in res:
        if abs(cur - r) < thr: return "${cfg.trendFollow !== "reverse" ? "PUT" : "CALL"}", f"Сопротивление={r:.5f}"
    return None, "Нет уровня"`)
    callLines.push("signal_support_resistance(prices, candles)")
  }

  const combineLogic = cfg.comboLogic === "AND"
    ? `
_strategy_err_count = {}
_strategy_err_notified = set()

def _safe_strategy_call(fn, prices, candles):
    """Безопасный вызов стратегии — ошибки не валят бота"""
    _fname = getattr(fn, '__name__', '?')
    try:
        return fn(prices, candles)
    except Exception as _se:
        import traceback as _tbs
        _strategy_err_count[_fname] = _strategy_err_count.get(_fname, 0) + 1
        print(f"[STRATEGY] ⚠️ Ошибка в {_fname} (#{_strategy_err_count[_fname]}): {_se}")
        print(_tbs.format_exc())
        # Шлём TG только 1 раз на каждую новую ошибку — не спамим
        if _fname not in _strategy_err_notified:
            _strategy_err_notified.add(_fname)
            try:
                tg(f"⚠️ <b>Стратегия отключена</b>\\n<code>{_fname}</code>\\nОшибка: {str(_se)[:120]}\\n<i>Бот продолжает работу с другими стратегиями</i>")
            except: pass
        return None, f"⚠️err:{_fname}"

def get_combined_signal(prices, candles):
    """Комбо AND — большинство стратегий должны совпасть"""
    fns = [${callLines.map(l => l.replace(/\(.*\)/, '')).join(", ")}]
    results = [_safe_strategy_call(f, prices, candles) for f in fns]
    signals = [(s, i) for s, i in results if s is not None]
    majority = (${callLines.length} // 2) + 1
    calls = [(s, i) for s, i in signals if s == "CALL"]
    puts  = [(s, i) for s, i in signals if s == "PUT"]
    if len(calls) >= majority:
        info = "AND✅ " + " | ".join(i for _, i in calls if i)
        return "CALL", info
    if len(puts) >= majority:
        info = "AND✅ " + " | ".join(i for _, i in puts if i)
        return "PUT", info
    all_info = " | ".join(i for _, i in signals if i)
    return None, all_info  # Нет большинства`
    : `
_strategy_err_count = {}
_strategy_err_notified = set()

def _safe_strategy_call(fn, prices, candles):
    """Безопасный вызов стратегии — ошибки не валят бота"""
    _fname = getattr(fn, '__name__', '?')
    try:
        return fn(prices, candles)
    except Exception as _se:
        import traceback as _tbs
        _strategy_err_count[_fname] = _strategy_err_count.get(_fname, 0) + 1
        print(f"[STRATEGY] ⚠️ Ошибка в {_fname} (#{_strategy_err_count[_fname]}): {_se}")
        print(_tbs.format_exc())
        if _fname not in _strategy_err_notified:
            _strategy_err_notified.add(_fname)
            try:
                tg(f"⚠️ <b>Стратегия отключена</b>\\n<code>{_fname}</code>\\nОшибка: {str(_se)[:120]}\\n<i>Бот продолжает работу с другими стратегиями</i>")
            except: pass
        return None, f"⚠️err:{_fname}"

def get_combined_signal(prices, candles):
    """Комбо OR — достаточно хотя бы одного сигнала"""
    fns = [${callLines.map(l => l.replace(/\(.*\)/, '')).join(", ")}]
    results = [_safe_strategy_call(f, prices, candles) for f in fns]
    signals = [(s, i) for s, i in results if s is not None]
    if not signals:
        all_info = " | ".join(i for _, i in results if i)
        return None, all_info
    calls = [(s, i) for s, i in signals if s == "CALL"]
    puts  = [(s, i) for s, i in signals if s == "PUT"]
    if len(calls) > len(puts):
        info = "OR✅ " + " | ".join(i for _, i in calls if i)
        return "CALL", info
    if len(puts) > len(calls):
        info = "OR✅ " + " | ".join(i for _, i in puts if i)
        return "PUT", info
    all_info = " | ".join(i for _, i in signals if i)
    return None, all_info  # Равенство голосов — пропускаем`

  const comboAssetMap: Record<string, string> = {
    "EUR/USD (OTC)": "EURUSD_otc",
    "GBP/USD (OTC)": "GBPUSD_otc",
    "USD/JPY (OTC)": "USDJPY_otc",
    "AUD/USD (OTC)": "AUDUSD_otc",
    "EUR/GBP (OTC)": "EURGBP_otc",
    "EUR/JPY (OTC)": "EURJPY_otc",
    "USD/CAD (OTC)": "USDCAD_otc",
    "NZD/USD (OTC)": "NZDUSD_otc",
    "BTC/USD (OTC)": "BTCUSD_otc",
    "ETH/USD (OTC)": "ETHUSD_otc",
    "Gold (OTC)":    "XAUUSD_otc",
    "Oil (OTC)":     "USOIL_otc",
    "EUR/USD":       "EURUSD",
    "GBP/USD":       "GBPUSD",
    "USD/JPY":       "USDJPY",
    "AUD/USD":       "AUDUSD",
    "USD/CAD":       "USDCAD",
    "EUR/GBP":       "EURGBP",
    "EUR/JPY":       "EURJPY",
    "NZD/USD":       "NZDUSD",
  }
  const comboAssetSymbol = comboAssetMap[cfg.asset] ?? cfg.asset.replace("/", "").replace(" (OTC)", "_otc").replace(/\s/g, "")

  const _buildVersion = `v2.1-${new Date().toISOString().slice(0, 10)}`
  return (
`#!/usr/bin/env python3
"""
Pocket Option КОМБО-Бот
Сгенерировано: TradeBase Bot Builder (${_buildVersion})

════════════════════════════════════════
  КОНФИГУРАЦИЯ БОТА
════════════════════════════════════════
  Стратегии  : ${labels}
  Логика     : ${cfg.comboLogic} — ${logicWord}
  Актив      : ${comboAssetSymbol}
  Экспирация : ${cfg.expiry} мин
  Ставка     : ${cfg.betAmount}${cfg.betPercent ? "% от баланса" : " " + cfg.currency}
  Режим      : ${cfg.isDemo ? "ДЕМО-СЧЁТ" : "РЕАЛЬНЫЙ СЧЁТ"}
  Направление: ${cfg.trendFollow === "follow" ? "По тренду ↗" : cfg.trendFollow === "reverse" ? "Против тренда ↙" : "Комбо ↗↙"}
  Режим свечей: ${(cfg.trendMode ?? "same") === "same" ? "Одинаковые (2 зелёных=CALL / 2 красных=PUT)" : (cfg.trendMode === "reverse") ? "Разворот (красн+зел=PUT / зел+красн=CALL)" : "Любой паттерн (UP=CALL, DOWN=PUT)"}
  Таймфрейм  : ${(cfg.candleTimeframe ?? 60) === 60 ? "1 мин  (60 свечей = 1 час истории)" : (cfg.candleTimeframe ?? 60) === 300 ? "5 мин  (60 свечей = 5 часов истории)" : (cfg.candleTimeframe ?? 60) === 900 ? "15 мин (60 свечей = 15 часов истории)" : "1 час  (60 свечей = 2.5 дня истории)"}
  Take Profit: ${cfg.takeProfitRub} ${cfg.currency}
  Stop Loss  : ${cfg.stopLossRub} ${cfg.currency}
  Лимит/день : ${cfg.dailyLimit} сделок
  Мартингейл : ${cfg.martingaleEnabled ? `x${cfg.martingaleMultiplier} до ${cfg.martingaleSteps} шагов` : "выкл"}
════════════════════════════════════════

Установка зависимостей:
    pip install pocketoptionapi-async websockets msgpack
"""

import asyncio
import os
import builtins as _builtins
from datetime import datetime, timedelta, timezone
from pocketoptionapi_async import AsyncPocketOptionClient, OrderDirection

# ===== ТАЙМЗОНЫ ДЛЯ ШПИОН-ЛОГА =====
MSK_TZ = timezone(timedelta(hours=3))   # время как на Pocket Option (Москва)
# Локальное время — автоматом из системы (не хардкодим!)
LOCAL_TZ = datetime.now().astimezone().tzinfo
_local_offset = datetime.now().astimezone().utcoffset()
_local_hours = int(_local_offset.total_seconds() // 3600) if _local_offset else 0
_msk_diff = _local_hours - 3  # разница с Москвой

# ===== ВРЕМЯ В ЛОГАХ =====
# Перехватываем print глобально — каждая строка лога получает префикс [HH:MM:SS]
_original_print = _builtins.print
def _print_with_time(*args, **kwargs):
    _ts = datetime.now().strftime("%H:%M:%S")
    _original_print(f"[{_ts}]", *args, **kwargs)
_builtins.print = _print_with_time

# ===== НАСТРОЙКИ =====
ASSET        = "${comboAssetSymbol}"
EXPIRY_SEC   = ${String(parseInt(cfg.expiry) * 60)}
BASE_BET     = ${cfg.betAmount}
BET_PERCENT  = ${cfg.betPercent ? "True" : "False"}
IS_DEMO      = ${cfg.isDemo ? "True" : "False"}
CURRENCY     = "${cfg.currency}"
TAKE_PROFIT  = ${cfg.takeProfitRub}
STOP_LOSS    = ${cfg.stopLossRub}
DAILY_LIMIT  = ${cfg.dailyLimit}
AUTO_RESTART     = ${cfg.autoRestart ? "True" : "False"}
MARTINGALE       = ${cfg.martingaleEnabled ? "True" : "False"}
MARTINGALE_MULT  = ${cfg.martingaleMultiplier}
MARTINGALE_STEPS = ${cfg.martingaleSteps}

# ===== БЕЗОПАСНОСТЬ СТАВОК =====
SAFETY_MAX_BET_PCT     = ${cfg.safetyMaxBetPercent ?? 30}    # Максимум % от баланса на одну сделку/хедж
SAFETY_MIN_RESERVE_PCT = ${cfg.safetyMinReservePercent ?? 0} # Минимальный резерв в % (не трогаем)

CHECK_INTERVAL   = ${cfg.checkInterval}      # Интервал проверки сигнала (сек)
TREND_MODE       = "${cfg.trendMode ?? "same"}"     # "same" = 2 одинаковых, "reverse" = разворот, "any" = любой паттерн
TREND_FOLLOW     = "${cfg.trendFollow}"              # "follow" = по тренду, "reverse" = против, "combo" = без фильтра

try:
    from dotenv import load_dotenv; load_dotenv()
except ImportError:
    pass

SESSION_ID = os.environ.get("PO_SESSION_ID", "")
if not SESSION_ID:
    _env = os.path.join(os.path.dirname(os.path.abspath(__file__)), ".env")
    if os.path.exists(_env):
        with open(_env, encoding="utf-8") as _f:
            for _line in _f:
                if _line.startswith("PO_SESSION_ID="):
                    SESSION_ID = _line.split("=", 1)[1].strip().strip('"').strip("'")
                    break
if not SESSION_ID:
    print("[ERROR] Не задан PO_SESSION_ID.")
    print("Создайте файл .env рядом с bot.py:")
    print('  PO_SESSION_ID=42["auth",{"session":"...","isDemo":0,"uid":...}]')
    exit(1)

print(f"[INFO] SESSION_ID загружен, длина: {len(SESSION_ID)} символов")

# ===== ЗАПУСК АВТО-ОТЧЁТА (фоновый поток) =====
def _start_auto_report_bg():
    try:
        if "${cfg.tgAutoReportTime || ''}".strip() and ${cfg.tgEnabled ? "True" : "False"}:
            import threading as _athr
            _athr.Thread(target=_auto_report_scheduler, daemon=True).start()
    except Exception as _ae:
        print(f"[AUTOREPORT] start err: {_ae}")

# ===== АВТООПРЕДЕЛЕНИЕ ДЕМО/РЕАЛ из SESSION_ID =====
try:
    import re as _re
    _m = _re.search('"isDemo"[ ]*:[ ]*([0-9]+)', SESSION_ID)
    IS_DEMO = bool(int(_m.group(1))) if _m else IS_DEMO
    _u = _re.search('"uid"[ ]*:[ ]*([0-9]+)', SESSION_ID)
    _uid = _u.group(1) if _u else "неизвестен"
    print(f"[INFO] Аккаунт UID: {_uid} | Режим: {'ДЕМО' if IS_DEMO else 'РЕАЛЬНЫЙ'}")
except Exception:
    print(f"[INFO] Режим (из настроек): {'ДЕМО' if IS_DEMO else 'РЕАЛЬНЫЙ'}")

# ===== TELEGRAM =====
BOT_NAME        = "${cfg.botName || "Бот"}"
TG_TOKEN   = "${cfg.tgToken}"
TG_CHAT_ID = "${cfg.tgChatId}"
TG_ENABLED      = ${cfg.tgEnabled ? "True" : "False"} and bool(TG_TOKEN and TG_CHAT_ID)
TG_NOTIFY_MODE  = "${cfg.tgNotifyMode ?? "all"}"

def _tg_send(text, retries=5, delay=5, reply_markup=None, action="send", message_id=None, _result_holder=None):
    """Отправка/редактирование/удаление сообщений через прокси-функцию (без VPN).
    Если передан _result_holder (list) — кладёт туда ответ Telegram (для получения message_id)."""
    import urllib.request, json, time
    url = "https://functions.poehali.dev/fb70e0a6-b6c1-49e2-b148-c37dab50f024"
    payload_data = {"token": TG_TOKEN, "chat_id": TG_CHAT_ID, "action": action}
    if text is not None:
        payload_data["text"] = text
    if reply_markup is not None:
        payload_data["reply_markup"] = reply_markup
    if message_id is not None:
        payload_data["message_id"] = message_id
    payload = json.dumps(payload_data).encode()
    req = urllib.request.Request(url, data=payload, headers={"Content-Type": "application/json"}, method="POST")
    _t0 = time.time()
    _has_markup = reply_markup is not None
    _text_len = len(text) if text else 0
    for attempt in range(1, retries + 1):
        try:
            resp = urllib.request.urlopen(req, timeout=20)
            _resp_data = None
            try:
                _resp_data = json.loads(resp.read().decode())
            except Exception:
                pass
            if _result_holder is not None and _resp_data is not None:
                _result_holder.append(_resp_data)
            _elapsed = int((time.time() - _t0) * 1000)
            if _resp_data is not None:
                _ok = _resp_data.get("ok", False)
                _out_id = _resp_data.get("message_id", "—")
                if _ok:
                    print(f"[TG_API] ✅ action={action} msg_id={message_id or '—'}→{_out_id} text_len={_text_len} markup={_has_markup} elapsed={_elapsed}ms")
                else:
                    _err = _resp_data.get("error", "?")
                    print(f"[TG_API] ⚠️  action={action} msg_id={message_id or '—'} elapsed={_elapsed}ms err={_err}")
            else:
                print(f"[TG_API] ✅ action={action} msg_id={message_id or '—'} text_len={_text_len} markup={_has_markup} elapsed={_elapsed}ms (no body)")
            return
        except Exception as e:
            if attempt < retries:
                print(f"[TG_API] 🔄 retry {attempt}/{retries} action={action} err={e}")
                time.sleep(delay)
            else:
                _elapsed = int((time.time() - _t0) * 1000)
                print(f"[TG_API] 💥 FAIL action={action} msg_id={message_id or '—'} elapsed={_elapsed}ms err={e}")

def tg(text):
    """Отправка уведомления о ставке (всегда, если TG включён)"""
    if not TG_ENABLED:
        return
    import threading
    threading.Thread(target=_tg_send, args=(text,), daemon=True).start()

def tg_info(text):
    """Информационное уведомление (запуск/тренд/ошибки) — только в режиме all"""
    _notify_mode = globals().get("TG_NOTIFY_MODE", "all")
    if _notify_mode == "bets_only":
        return
    tg(text)

# ===== СИСТЕМА ОТЧЁТНОСТИ (JSONL) =====
import json as _json_rep
_REPORTS_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "reports")
try:
    os.makedirs(_REPORTS_DIR, exist_ok=True)
except Exception as _re:
    print(f"[REPORT] ⚠️ Не могу создать папку reports: {_re}")

def report_log(event_type, data):
    """Записывает событие в JSONL-файл текущего дня.
    event_type: 'trade' | 'cascade' | 'hedge' | 'session_start' | 'session_end' | 'strategy_error'
    """
    try:
        _today = datetime.now().strftime("%Y-%m-%d")
        _file = os.path.join(_REPORTS_DIR, f"trades_{_today}.jsonl")
        _entry = {
            "ts": datetime.now().isoformat(timespec='seconds'),
            "type": event_type,
            "asset": ASSET,
            "bot": globals().get('BOT_NAME', '?'),
            **data
        }
        with open(_file, "a", encoding="utf-8") as _f:
            _f.write(_json_rep.dumps(_entry, ensure_ascii=False, default=str) + "\\n")
    except Exception as _re:
        print(f"[REPORT] ⚠️ Не могу записать отчёт: {_re}")

def calc_pips_distance(symbol, price_a, price_b):
    """Расстояние между ценами в пипах (учитывает тип пары)"""
    try:
        _pip_div = {
            "EURUSD": 0.0001, "GBPUSD": 0.0001, "AUDUSD": 0.0001, "NZDUSD": 0.0001,
            "USDCHF": 0.0001, "USDCAD": 0.0001, "EURGBP": 0.0001, "EURCHF": 0.0001,
            "EURNZD": 0.0001, "EURAUD": 0.0001, "EURCAD": 0.0001, "GBPAUD": 0.0001,
            "GBPCAD": 0.0001, "GBPCHF": 0.0001, "GBPNZD": 0.0001, "AUDCAD": 0.0001,
            "AUDCHF": 0.0001, "AUDNZD": 0.0001, "CADCHF": 0.0001, "NZDCAD": 0.0001,
            "NZDCHF": 0.0001,
            "USDJPY": 0.01, "EURJPY": 0.01, "GBPJPY": 0.01, "AUDJPY": 0.01,
            "CHFJPY": 0.01, "CADJPY": 0.01, "NZDJPY": 0.01,
            "XAUUSD": 0.1, "XAGUSD": 0.001,
            "BTCUSD": 1.0, "ETHUSD": 0.1, "LTCUSD": 0.1,
        }
        _sym_clean = symbol.replace("_otc", "").replace("/", "").upper()
        _pip = _pip_div.get(_sym_clean, 0.0001)
        return round(abs(price_a - price_b) / _pip, 1)
    except Exception:
        return 0.0

def calc_pct_move(price_a, price_b):
    """Процентное изменение цены"""
    try:
        if price_a == 0: return 0.0
        return round((price_b - price_a) / price_a * 100, 4)
    except Exception:
        return 0.0

AUTO_REPORT_TIME = "${cfg.tgAutoReportTime || ''}"  # HH:MM или пусто = выкл

def _auto_report_scheduler():
    """Фоновый поток: каждый день в AUTO_REPORT_TIME отправляет в TG отчёт за ВЧЕРА"""
    if not AUTO_REPORT_TIME or not TG_ENABLED:
        return
    try:
        _hh, _mm = AUTO_REPORT_TIME.split(":")
        _hh = int(_hh); _mm = int(_mm)
    except Exception:
        print(f"[AUTOREPORT] ❌ Неверный формат времени: {AUTO_REPORT_TIME}")
        return
    print(f"[AUTOREPORT] ⏰ Планировщик запущен: ежедневно в {AUTO_REPORT_TIME} (отчёт за вчера)")
    import time as _t
    _last_sent_date = None
    while not globals().get("_tg_stopped", False):
        try:
            _now = datetime.now()
            _today_str = _now.strftime("%Y-%m-%d")
            if (_now.hour == _hh and _now.minute == _mm and _last_sent_date != _today_str):
                _yesterday = (_now - timedelta(days=1)).strftime("%Y-%m-%d")
                print(f"[AUTOREPORT] 🚀 Отправка отчёта за {_yesterday}")
                _ok = tg_send_report_file(_yesterday, caption=(
                    f"🌅 <b>[{BOT_NAME}] Автоотчёт</b>\\n"
                    f"📅 За: {_yesterday}\\n"
                    f"<i>Перетащи файл в /bot-report для анализа</i>"
                ))
                _last_sent_date = _today_str
                if not _ok:
                    print(f"[AUTOREPORT] ⚠️ Не удалось отправить отчёт за {_yesterday}")
            _t.sleep(30)
        except Exception as _e:
            print(f"[AUTOREPORT] err: {_e}")
            _t.sleep(60)

def tg_send_report_file(date_str=None, caption=None):
    """Отправляет JSONL-отчёт за день как документ в Telegram"""
    if not TG_ENABLED:
        return False
    import urllib.request, json as _j, base64 as _b64, time as _t
    if date_str is None:
        date_str = datetime.now().strftime("%Y-%m-%d")
    _file = os.path.join(_REPORTS_DIR, f"trades_{date_str}.jsonl")
    if not os.path.exists(_file):
        try: tg(f"📭 Отчёт за {date_str} ещё не создан (нет сделок).")
        except: pass
        return False
    try:
        with open(_file, "rb") as _f:
            _bytes = _f.read()
        if len(_bytes) == 0:
            tg(f"📭 Файл отчёта за {date_str} пуст.")
            return False
        _b64s = _b64.b64encode(_bytes).decode()
        # Подсчёт строк своего бота для caption
        _lines = _bytes.decode("utf-8", errors="ignore").split("\\n")
        _my_lines = sum(1 for _l in _lines if _l and ('"bot": "' + BOT_NAME + '"') in _l)
        if not caption:
            caption = (
                f"📊 <b>[{BOT_NAME}] Отчёт {date_str}</b>\\n"
                f"Размер: {len(_bytes)} байт | Записей бота: {_my_lines}\\n"
                f"<i>Перетащи в /bot-report для анализа</i>"
            )
        _payload = _j.dumps({
            "token": TG_TOKEN, "chat_id": TG_CHAT_ID,
            "action": "document",
            "file_b64": _b64s,
            "file_name": f"trades_{date_str}.jsonl",
            "caption": caption,
        }).encode()
        _url = "https://functions.poehali.dev/fb70e0a6-b6c1-49e2-b148-c37dab50f024"
        _req = urllib.request.Request(_url, data=_payload, headers={"Content-Type": "application/json"}, method="POST")
        for _att in range(1, 4):
            try:
                _r = urllib.request.urlopen(_req, timeout=60)
                _resp = _j.loads(_r.read().decode())
                if _resp.get("ok"):
                    print(f"[REPORT] ✅ Файл отчёта {date_str} отправлен в TG")
                    return True
                print(f"[REPORT] ⚠️ TG err: {_resp.get('error')}")
                if _att < 3: _t.sleep(3)
            except Exception as _e:
                print(f"[REPORT] retry {_att}: {_e}")
                if _att < 3: _t.sleep(3)
        return False
    except Exception as _e:
        print(f"[REPORT] ❌ Ошибка отправки файла: {_e}")
        return False

# Запустить планировщик автоотчётов (фоновый поток)
try:
    _start_auto_report_bg()
except Exception as _se:
    print(f"[AUTOREPORT] init err: {_se}")

# ===== ID последнего меню (чтобы не плодить и удалять старые) =====
_tg_last_menu_id = None
# Состояние подтверждения FORCE: { "pattern": "UP_UP", "ts": time }, либо None
_tg_pending_force = None

def tg_send_menu(text, buttons):
    """Отправляет НОВОЕ inline-меню. buttons = list[list[(label, callback_data)]].
    Если есть предыдущее меню — удаляет его. Сохраняет message_id в _tg_last_menu_id."""
    global _tg_last_menu_id
    if not TG_ENABLED:
        print("[TG_MENU] ⏭ skip — TG отключён")
        return
    # Удаляем старое меню (если есть)
    if _tg_last_menu_id:
        print(f"[TG_MENU] 🗑 удаляю старое меню msg_id={_tg_last_menu_id}")
        try:
            import threading
            threading.Thread(target=_tg_send, args=(None,), kwargs={"action": "delete", "message_id": _tg_last_menu_id}, daemon=True).start()
        except Exception as _de:
            print(f"[TG_MENU] ⚠️ не удалось удалить старое меню: {_de}")
        _tg_last_menu_id = None
    # Строим reply_markup
    _btn_count = sum(len(_r) for _r in buttons)
    keyboard = []
    for row in buttons:
        keyboard.append([{"text": _l, "callback_data": _cd} for (_l, _cd) in row])
    reply_markup = {"inline_keyboard": keyboard}
    print(f"[TG_MENU] 📤 отправляю меню: {_btn_count} кнопок, {len(buttons)} рядов")
    # Отправляем синхронно — нам нужен message_id
    _holder = []
    try:
        _tg_send(text, retries=2, delay=2, reply_markup=reply_markup, _result_holder=_holder)
    except Exception as e:
        print(f"[TG_MENU] 💥 Ошибка отправки: {e}")
        return
    if _holder and _holder[0].get("ok") and _holder[0].get("message_id"):
        _tg_last_menu_id = _holder[0]["message_id"]
        print(f"[TG_MENU] ✅ меню показано, msg_id={_tg_last_menu_id}")
    else:
        _err_info = _holder[0] if _holder else "пустой ответ"
        print(f"[TG_MENU] ⚠️ меню НЕ показано: {_err_info}")

def tg_edit_menu(message_id, text, buttons):
    """Редактирует существующее меню (для подтверждений FORCE)."""
    if not TG_ENABLED or not message_id:
        return
    keyboard = []
    for row in buttons:
        keyboard.append([{"text": _l, "callback_data": _cd} for (_l, _cd) in row])
    reply_markup = {"inline_keyboard": keyboard}
    import threading
    threading.Thread(target=_tg_send, kwargs={"text": text, "action": "edit", "message_id": message_id, "reply_markup": reply_markup, "retries": 2, "delay": 2}, daemon=True).start()

def tg_delete_message(message_id):
    """Удаляет сообщение по id."""
    if not TG_ENABLED or not message_id:
        return
    import threading
    threading.Thread(target=_tg_send, args=(None,), kwargs={"action": "delete", "message_id": message_id, "retries": 2, "delay": 2}, daemon=True).start()

def _build_main_menu_buttons():
    """Строит набор кнопок главного меню. Возвращает list[list[(label, callback_data)]]."""
    _state_emoji = "▶️" if not _tg_paused else "⏸"
    _force_btn = ("❌ Снять FORCE", "force:off") if _tg_force_pattern else None
    rows = [
        [("⏸ Пауза", "pause"), ("▶️ Продолжить", "resume")],
        [("🛑 СТОП", "stop")],
        [("📊 Статус", "status"), ("💰 Профит", "profit")],
        [("📋 Отчёт", "summary"), ("📈 График", "screenshot")],
        [("🔧 Диагностика", "diag")],
        [("🟢🟢", "force:UP_UP"), ("🔴🔴", "force:DOWN_DOWN")],
        [("🟢🔴", "force:UP_DOWN"), ("🔴🟢", "force:DOWN_UP")],
    ]
    if _force_btn:
        rows.append([_force_btn])
    rows.append([("🔄 Обновить меню", "refresh")])
    return rows

def _build_main_menu_text():
    """Строит текст-шапку главного меню с актуальной статой."""
    _wins_m = sum(1 for t in trade_log if t["won"])
    _losses_m = trades_today - _wins_m
    _wr_m = (_wins_m / trades_today * 100) if trades_today > 0 else 0
    _state = "⏸ ПАУЗА" if _tg_paused else "▶️ Работает"
    _profit_emoji = "🟢" if total_profit >= 0 else "🔴"
    _force_line = ""
    if _tg_force_pattern:
        _fmap = {"UP_UP": "🟢🟢", "DOWN_DOWN": "🔴🔴", "UP_DOWN": "🟢🔴", "DOWN_UP": "🔴🟢"}
        _force_line = f"\\n⚡ FORCE: <b>{_fmap.get(_tg_force_pattern, _tg_force_pattern)}</b> (одноразово)"
    return (
        f"🎮 <b>[{BOT_NAME}] Пульт</b>\\n"
        f"━━━━━━━━━━━━━━━━━━━━\\n"
        f"{_profit_emoji} Профит: <b>{total_profit:+.2f} {CURRENCY}</b>\\n"
        f"📈 Сделок: <b>{trades_today}</b> (✅{_wins_m}/❌{_losses_m}) | WR: <b>{_wr_m:.0f}%</b>\\n"
        f"⚙️ Ставка: {globals().get('current_bet', BASE_BET)} {CURRENCY} | {ASSET}\\n"
        f"{_state}{_force_line}"
    )

def tg_show_main_menu():
    """Показывает главное меню (пересоздаёт, удаляя старое)."""
    if not TG_ENABLED:
        return
    tg_send_menu(_build_main_menu_text(), _build_main_menu_buttons())

# ===== УПРАВЛЕНИЕ ЧЕРЕЗ TELEGRAM =====
_tg_paused   = False
_tg_stopped  = False
_tg_offset   = 0
# Принудительный паттерн 2 свечей (одноразово, после применения сбрасывается).
# Возможные значения: "UP_UP", "DOWN_DOWN", "UP_DOWN", "DOWN_UP" или None
_tg_force_pattern = None
_tg_force_at = 0  # время установки

def _force_alias_to_pattern(alias):
    """Конвертирует пользовательский ввод в код тренда. Возвращает (pattern, human_label) или (None, None)."""
    if not alias:
        return None, None
    a = alias.lower().strip().replace(" ", "")
    # Эмодзи-варианты
    a = a.replace("🟢", "g").replace("🔴", "r").replace("зел", "g").replace("крас", "r").replace("кр", "r")
    if a in ("gg", "greengreen", "uu", "upup", "up_up"):
        return "UP_UP", "🟢🟢 (зел-зел)"
    if a in ("rr", "redred", "dd", "downdown", "down_down"):
        return "DOWN_DOWN", "🔴🔴 (кр-кр)"
    if a in ("gr", "greenred", "ud", "updown", "up_down"):
        return "UP_DOWN", "🟢🔴 (зел-кр)"
    if a in ("rg", "redgreen", "du", "downup", "down_up"):
        return "DOWN_UP", "🔴🟢 (кр-зел)"
    return None, None

def _tg_answer_callback(callback_id, text=""):
    """Подтверждает нажатие inline-кнопки (убирает 'часики' с кнопки)."""
    if not callback_id:
        return
    try:
        import urllib.request, urllib.parse
        u = f"https://api.telegram.org/bot{TG_TOKEN}/answerCallbackQuery"
        d = urllib.parse.urlencode({"callback_query_id": callback_id, "text": text}).encode()
        urllib.request.urlopen(urllib.request.Request(u, data=d, method="POST"), timeout=5)
    except Exception:
        pass

def _send_diag_report():
    """Полный диагностический отчёт о состоянии бота. Шлётся в ТГ и в консоль."""
    import time as _t_diag, sys as _sys_diag
    try:
        _wins_d = sum(1 for t in trade_log if t["won"])
        _losses_d = trades_today - _wins_d
        _wr_d = (_wins_d / trades_today * 100) if trades_today > 0 else 0
        _state_d = "⏸ ПАУЗА" if _tg_paused else ("🛑 СТОП" if _tg_stopped else "▶️ Работает")
        _cur_bet_d = globals().get('current_bet', BASE_BET)
        _streak_d = globals().get('cur_streak', 0)
        # FORCE-режим
        _force_d = "—"
        if _tg_force_pattern:
            _fmap_d = {"UP_UP": "🟢🟢", "DOWN_DOWN": "🔴🔴", "UP_DOWN": "🟢🔴", "DOWN_UP": "🔴🟢"}
            _force_d = f"{_fmap_d.get(_tg_force_pattern, _tg_force_pattern)} (активен)"
        # Время последнего тика свечи
        _buf_d = globals().get('_live_buf') or globals().get('buf') or globals().get('_live_buffer')
        _price_d = "—"
        _sync_d = "—"
        _last_tick_d = "—"
        if _buf_d is not None:
            _lp_d = getattr(_buf_d, 'last_price', 0)
            if _lp_d:
                _price_d = str(_lp_d)
            _sw_d = getattr(_buf_d, 'sync_warn', False)
            _sync_d = "⚠️ ЗАВИС" if _sw_d else "✅ живой"
            _lt_d = getattr(_buf_d, 'last_tick_at', None)
            if _lt_d:
                _ago = int(_t_diag.time() - _lt_d)
                _last_tick_d = f"{_ago}с назад"
        # Активные asyncio-задачи
        _tasks_d = "—"
        try:
            import asyncio as _a_diag
            _loop_d = _a_diag.get_event_loop()
            _all_tasks = [t for t in _a_diag.all_tasks(_loop_d) if not t.done()]
            _task_names = [t.get_name() for t in _all_tasks][:10]
            _tasks_d = f"{len(_all_tasks)} активных: {', '.join(_task_names) if _task_names else '—'}"
        except Exception as _te_d:
            _tasks_d = f"ошибка: {_te_d}"
        # Каскад настройки
        _cascade_settings_d = f"H1×{${cfg.hedgeCascadeM1 ?? 1.5}} H2×{${cfg.hedgeCascadeM2 ?? 1.5}} H3×{${cfg.hedgeCascadeM3 ?? 2.0}} | откат {${cfg.hedgePullbackPips ?? 5}} пип | проверка {${cfg.hedgeCheckInterval ?? 2}}с"
        _cascade_on_d = "✅ ВКЛ" if ${cfg.hedgeCascadeEnabled ? "True" : "False"} else "❌ выкл"
        # Последние 5 сделок
        _last5_d = ""
        if trade_log:
            for _tr in trade_log[-5:]:
                _mk = "✅" if _tr.get("won") else "❌"
                _last5_d += f"\\n  {_mk} {_tr.get('signal', '?')} | {_tr.get('profit', 0):+.2f}"
        else:
            _last5_d = "\\n  (сделок ещё не было)"
        # Время работы
        _start_t_d = globals().get('_bot_started_at', None)
        _uptime_d = "—"
        if _start_t_d:
            _ut = int(_t_diag.time() - _start_t_d)
            _uptime_d = f"{_ut//3600}ч {(_ut%3600)//60}м {_ut%60}с"
        _msg = (
            f"🔧 <b>[{BOT_NAME}] ДИАГНОСТИКА</b>\\n"
            f"━━━━━━━━━━━━━━━━━━━━\\n"
            f"<b>📊 Состояние:</b> {_state_d}\\n"
            f"<b>⏱ Аптайм:</b> {_uptime_d}\\n"
            f"<b>💰 Профит:</b> {total_profit:+.2f} {CURRENCY}\\n"
            f"<b>📈 Сделок:</b> {trades_today} (✅{_wins_d}/❌{_losses_d}) | WR: {_wr_d:.0f}%\\n"
            f"<b>⚙️ Ставка:</b> {_cur_bet_d} | <b>Серия:</b> {_streak_d:+d}\\n"
            f"<b>💱 Актив:</b> {ASSET} | <b>Цена:</b> {_price_d}\\n"
            f"<b>📡 Поток API:</b> {_sync_d} | <b>Тик:</b> {_last_tick_d}\\n"
            f"<b>⚡ FORCE:</b> {_force_d}\\n"
            f"━━━━━━━━━━━━━━━━━━━━\\n"
            f"<b>🛡 КАСКАДНЫЙ ХЕДЖ:</b> {_cascade_on_d}\\n"
            f"<i>{_cascade_settings_d}</i>\\n"
            f"━━━━━━━━━━━━━━━━━━━━\\n"
            f"<b>🧵 Asyncio задачи:</b>\\n<i>{_tasks_d}</i>\\n"
            f"━━━━━━━━━━━━━━━━━━━━\\n"
            f"<b>📋 Последние 5 сделок:</b>{_last5_d}\\n"
            f"━━━━━━━━━━━━━━━━━━━━\\n"
            f"<i>Если хедж молчит — проверь логи терминала на [CASCADE]</i>"
        )
        print(f"[DIAG] === ОТЧЁТ ===\\n{_msg}\\n[DIAG] === КОНЕЦ ===")
        tg(_msg)
    except Exception as _de:
        import traceback as _tb_d
        _err = f"❌ <b>[{BOT_NAME}] Ошибка диагностики</b>\\n{_de}"
        print(f"[DIAG] ❌ {_de}")
        print(_tb_d.format_exc())
        try: tg(_err)
        except: pass

def _handle_button_click(action_str, message_id, callback_id):
    """Обрабатывает нажатие inline-кнопки. action_str — содержимое callback_data."""
    global _tg_paused, _tg_stopped, _tg_force_pattern, _tg_force_at, _tg_pending_force, _tg_last_menu_id
    print(f"[TG_BTN] 🎯 click='{action_str}' msg_id={message_id} cb_id={callback_id[:8] if callback_id else '?'}")
    _tg_answer_callback(callback_id, "")
    if action_str == "pause":
        _tg_paused = True
        tg_delete_message(message_id)
        _tg_last_menu_id = None
        tg(f"⏸ <b>[{BOT_NAME}] на паузе</b>\\nЖду команду или нажатие ▶️ Продолжить")
        tg_show_main_menu()
    elif action_str == "resume":
        _tg_paused = False
        tg_delete_message(message_id)
        _tg_last_menu_id = None
        tg(f"▶️ <b>[{BOT_NAME}] возобновлён</b>")
        tg_show_main_menu()
    elif action_str == "stop":
        # Стоп — двухшаговое подтверждение через редактирование того же меню
        tg_edit_menu(
            message_id,
            f"⚠️ <b>[{BOT_NAME}] Точно остановить?</b>\\n\\nБот завершит работу полностью.",
            [[("✅ Да, СТОП", "stop:confirm")], [("❌ Отмена", "refresh")]]
        )
    elif action_str == "stop:confirm":
        _tg_stopped = True
        tg_delete_message(message_id)
        _tg_last_menu_id = None
        tg(f"🛑 <b>[{BOT_NAME}] остановлен</b>")
    elif action_str == "status":
        tg_delete_message(message_id)
        _tg_last_menu_id = None
        # Эмулируем команду /status — переиспользуем код из tg_poll_commands, но проще — собираем тут
        _wins_s = sum(1 for t in trade_log if t["won"])
        _wr_s = (_wins_s / trades_today * 100) if trades_today > 0 else 0
        _state_s = '⏸ На паузе' if _tg_paused else '▶️ Работает'
        _buf_s = globals().get('_live_buf') or globals().get('buf') or globals().get('_live_buffer')
        _last_price_line_s = ''
        if _buf_s is not None:
            _lp_s = getattr(_buf_s, 'last_price', 0)
            if _lp_s:
                _last_price_line_s = f"\\n💹 Цена: {_lp_s}"
        _chart_line_s = ''
        if trade_log:
            _last15_s = trade_log[-15:]
            _chart_s = ''.join('✅' if t['won'] else '❌' for t in _last15_s)
            _chart_line_s = f"\\n📊 Последние: {_chart_s}"
        tg(
            f"📊 <b>Статус [{BOT_NAME}]</b>\\n"
            f"💰 Профит: {total_profit:+.2f} {CURRENCY}\\n"
            f"📈 Сделок: {trades_today} (✅{_wins_s}/❌{trades_today-_wins_s}) | WR: {_wr_s:.0f}%\\n"
            f"⚙️ Ставка: {globals().get('current_bet', BASE_BET)} {CURRENCY} | {ASSET}\\n"
            f"{_state_s}{_last_price_line_s}{_chart_line_s}"
        )
        tg_show_main_menu()
    elif action_str == "profit":
        tg_delete_message(message_id)
        _tg_last_menu_id = None
        _wp = sum(1 for t in trade_log if t["won"])
        _lp_t = trades_today - _wp
        _wr_p = (_wp / trades_today * 100) if trades_today > 0 else 0
        _profits_p = [t["profit"] for t in trade_log] if trade_log else []
        _best = max(_profits_p) if _profits_p else 0
        _worst = min(_profits_p) if _profits_p else 0
        _emo = "🟢" if total_profit >= 0 else "🔴"
        tg(
            f"💰 <b>[{BOT_NAME}] Профит сегодня</b>\\n"
            f"━━━━━━━━━━━━━━━━━━━━\\n"
            f"{_emo} <b>{total_profit:+.2f} {CURRENCY}</b>\\n"
            f"📈 Сделок: {trades_today} (✅{_wp}/❌{_lp_t}) | WR: {_wr_p:.1f}%\\n"
            f"🏆 Лучшая: +{_best:.2f} {CURRENCY}\\n"
            f"💔 Худшая: {_worst:.2f} {CURRENCY}"
        )
        tg_show_main_menu()
    elif action_str == "summary":
        tg_delete_message(message_id)
        _tg_last_menu_id = None
        # Эмулируем /summary через искусственное сообщение
        _emulate_command(f"/summary {BOT_NAME}")
        tg_show_main_menu()
    elif action_str == "screenshot":
        tg_delete_message(message_id)
        _tg_last_menu_id = None
        _emulate_command(f"/screenshot {BOT_NAME}")
        tg_show_main_menu()
    elif action_str == "refresh":
        # Просто пересоздаём меню (с актуальной статой)
        tg_delete_message(message_id)
        _tg_last_menu_id = None
        tg_show_main_menu()
    elif action_str == "diag":
        tg_delete_message(message_id)
        _tg_last_menu_id = None
        _send_diag_report()
        tg_show_main_menu()
    elif action_str.startswith("startforce:"):
        # СТАРТОВЫЙ FORCE — без подтверждения, сразу ставим паттерн и пропускаем прогрев
        _patt = action_str.split(":", 1)[1]
        if _patt == "skip":
            _tg_pending_force = {"start_skip": True, "ts": __import__("time").time()}
            tg_delete_message(message_id)
            _tg_last_menu_id = None
            tg(f"⏭ <b>[{BOT_NAME}]</b> Пропуск стартового опроса — обычный прогрев (~2 мин)")
        elif _patt in ("UP_UP", "DOWN_DOWN", "UP_DOWN", "DOWN_UP"):
            _tg_force_pattern = _patt
            _tg_force_at = __import__("time").time()
            _tg_pending_force = {"start_done": True, "ts": _tg_force_at}
            tg_delete_message(message_id)
            _tg_last_menu_id = None
            _fmap_s = {"UP_UP": "🟢🟢 (зел-зел)", "DOWN_DOWN": "🔴🔴 (кр-кр)", "UP_DOWN": "🟢🔴 (зел-кр)", "DOWN_UP": "🔴🟢 (кр-зел)"}
            tg(
                f"⚡ <b>[{BOT_NAME}] СТАРТ С FORCE</b>\\n"
                f"━━━━━━━━━━━━━━━━━━━━\\n"
                f"🎯 Паттерн: <b>{_fmap_s.get(_patt, _patt)}</b>\\n"
                f"🚀 Иду торговать НЕМЕДЛЕННО (без прогрева)"
            )
    elif action_str.startswith("force:"):
        _patt = action_str.split(":", 1)[1]
        if _patt == "off":
            _tg_force_pattern = None
            _tg_force_at = 0
            _tg_pending_force = None
            tg_delete_message(message_id)
            _tg_last_menu_id = None
            tg(f"✅ <b>[{BOT_NAME}]</b> FORCE снят")
            tg_show_main_menu()
        elif _patt in ("UP_UP", "DOWN_DOWN", "UP_DOWN", "DOWN_UP"):
            # Подтверждение
            _tg_pending_force = {"pattern": _patt, "ts": __import__("time").time()}
            _fmap = {"UP_UP": "🟢🟢 (зел-зел)", "DOWN_DOWN": "🔴🔴 (кр-кр)", "UP_DOWN": "🟢🔴 (зел-кр)", "DOWN_UP": "🔴🟢 (кр-зел)"}
            tg_edit_menu(
                message_id,
                f"⚠️ <b>[{BOT_NAME}] Применить FORCE?</b>\\n━━━━━━━━━━━━━━━━━━━━\\n🎯 Паттерн: <b>{_fmap.get(_patt, _patt)}</b>\\n🔁 Применится <b>1 раз</b> на следующем тике\\nПосле сделки — авто-сброс.",
                [[("✅ Да, форсить!", f"force_confirm:{_patt}")], [("❌ Отмена", "refresh")]]
            )
        elif _patt.startswith("confirm:"):
            pass  # legacy, не используется
    elif action_str.startswith("force_confirm:"):
        _patt = action_str.split(":", 1)[1]
        if _patt in ("UP_UP", "DOWN_DOWN", "UP_DOWN", "DOWN_UP"):
            _tg_force_pattern = _patt
            _tg_force_at = __import__("time").time()
            _tg_pending_force = None
            tg_delete_message(message_id)
            _tg_last_menu_id = None
            _fmap2 = {"UP_UP": "🟢🟢 (зел-зел)", "DOWN_DOWN": "🔴🔴 (кр-кр)", "UP_DOWN": "🟢🔴 (зел-кр)", "DOWN_UP": "🔴🟢 (кр-зел)"}
            tg(
                f"⚡ <b>[{BOT_NAME}] FORCE АКТИВЕН</b>\\n"
                f"━━━━━━━━━━━━━━━━━━━━\\n"
                f"🎯 Паттерн: <b>{_fmap2.get(_patt, _patt)}</b>\\n"
                f"🔁 Применится на следующем тике (1 раз)"
            )
            tg_show_main_menu()

# Очередь искусственных команд (используется кнопками для переиспользования логики /summary, /screenshot)
_tg_emulated_queue = []
def _emulate_command(text):
    """Добавляет в очередь команду — она будет обработана как обычная текстовая (тем же кодом)."""
    _tg_emulated_queue.append(text)

def tg_poll_commands():
    """Получить новые команды и нажатия кнопок из Telegram"""
    global _tg_paused, _tg_stopped, _tg_offset, TAKE_PROFIT, STOP_LOSS, BASE_BET
    global _tg_force_pattern, _tg_force_at
    if not TG_ENABLED:
        return
    import urllib.request, json as _json
    try:
        url = f"https://api.telegram.org/bot{TG_TOKEN}/getUpdates?offset={_tg_offset}&timeout=1&limit=10"
        resp = urllib.request.urlopen(url, timeout=5).read()
        data = _json.loads(resp)
        _bot_name_lower = BOT_NAME.lower()
        for upd in data.get("result", []):
            _tg_offset = upd["update_id"] + 1
            # ===== CALLBACK_QUERY (нажатия inline-кнопок) =====
            cq = upd.get("callback_query")
            if cq:
                cq_chat = str(cq.get("message", {}).get("chat", {}).get("id", ""))
                if cq_chat != str(TG_CHAT_ID):
                    continue
                cq_data = cq.get("data", "")
                cq_msg_id = cq.get("message", {}).get("message_id")
                cq_id = cq.get("id")
                try:
                    _handle_button_click(cq_data, cq_msg_id, cq_id)
                except Exception as _be:
                    print(f"[TG_BTN] Ошибка обработки кнопки '{cq_data}': {_be}")
                continue
            # ===== ОБЫЧНЫЕ ТЕКСТОВЫЕ СООБЩЕНИЯ =====
            msg = upd.get("message", {})
            text = msg.get("text", "").strip()
            chat = str(msg.get("chat", {}).get("id", ""))
            if chat != str(TG_CHAT_ID):
                continue
            parts = text.split()
            if not parts:
                continue
            cmd = parts[0].lower()
            target = parts[1].lower() if len(parts) > 1 else ""
            val = parts[1] if len(parts) > 1 else ""
            for_me = (target == _bot_name_lower or target == "all" or target == "")
            if cmd == "/stop" and for_me:
                _tg_stopped = True
                tg(f"🛑 <b>[{BOT_NAME}] остановлен</b>\\n📤 Отправляю отчёт за день...")
                try:
                    import threading as _thr
                    _thr.Thread(target=tg_send_report_file, daemon=True).start()
                except Exception as _se:
                    print(f"[REPORT] auto-send err: {_se}")
            elif cmd == "/diag" and for_me:
                _send_diag_report()
            elif cmd == "/pause" and for_me:
                _tg_paused = True
                tg(f"⏸ <b>[{BOT_NAME}] на паузе.</b> /resume {BOT_NAME} для продолжения")
            elif cmd == "/resume" and for_me:
                _tg_paused = False
                tg(f"▶️ <b>[{BOT_NAME}] возобновлён</b>")
            elif cmd == "/status" and for_me:
                wins_s = sum(1 for t in trade_log if t["won"])
                _wr_s = (wins_s / trades_today * 100) if trades_today > 0 else 0
                _state = '⏸ На паузе' if _tg_paused else '▶️ Работает'
                # Подтягиваем буфер из глобалов (имя различается между ботами)
                _buf_g = globals().get('_live_buf') or globals().get('buf') or globals().get('_live_buffer')
                _ts_line = ''; _last_price_line = ''; _sync_line = ''
                if _buf_g is not None:
                    _ts = getattr(_buf_g, 'time_shift', None)
                    if _ts is not None:
                        _h = int(abs(_ts) // 3600); _m = int((abs(_ts) % 3600) // 60)
                        _sign = '+' if _ts >= 0 else '-'
                        _ts_line = f"\\n🕐 Сдвиг часов: {_sign}{_h}ч{_m:02d}м"
                    _lp = getattr(_buf_g, 'last_price', 0)
                    if _lp:
                        _last_price_line = f"\\n💹 Цена: {_lp}"
                    _sync_warn = getattr(_buf_g, 'sync_warn', False)
                    _sync_line = "\\n⚠️ Поток API завис" if _sync_warn else "\\n✅ Поток свечей живой"
                _cur_bet_g = globals().get('current_bet', BASE_BET)
                # Мини-график последних 15 сделок + текущая серия
                _chart_line = ''
                if trade_log:
                    _last15 = trade_log[-15:]
                    _chart = ''.join('✅' if t['won'] else '❌' for t in _last15)
                    _streak_g = globals().get('cur_streak', 0)
                    if _streak_g > 0:
                        _streak_emoji = f"🔥 серия побед: {_streak_g}"
                    elif _streak_g < 0:
                        _streak_emoji = f"❄️ серия проигрышей: {abs(_streak_g)}"
                    else:
                        _streak_emoji = "—"
                    _chart_line = f"\\n📊 Последние: {_chart}\\n{_streak_emoji}"
                tg(
                    f"📊 <b>Статус [{BOT_NAME}]</b>\\n"
                    f"💰 Профит: {total_profit:+.2f} {CURRENCY}\\n"
                    f"📈 Сделок: {trades_today} (✅{wins_s}/❌{trades_today-wins_s}) | WR: {_wr_s:.0f}%\\n"
                    f"⚙️ Ставка: {_cur_bet_g} {CURRENCY} | Актив: {ASSET}\\n"
                    f"{_state}"
                    f"{_sync_line}{_ts_line}{_last_price_line}"
                    f"{_chart_line}"
                )
            elif cmd == "/report" and for_me:
                try:
                    _today = datetime.now().strftime("%Y-%m-%d")
                    _file = os.path.join(_REPORTS_DIR, f"trades_{_today}.jsonl")
                    if not os.path.exists(_file):
                        tg(f"📊 <b>[{BOT_NAME}] Отчёт за {_today}</b>\\nПока нет данных за сегодня.")
                    else:
                        _trades, _cascades, _hedges = [], [], []
                        with open(_file, encoding="utf-8") as _fr:
                            for _line in _fr:
                                try:
                                    _e = _json_rep.loads(_line)
                                    if _e.get("bot") != BOT_NAME: continue
                                    _t = _e.get("type")
                                    if _t == "trade": _trades.append(_e)
                                    elif _t == "cascade_summary": _cascades.append(_e)
                                    elif _t == "hedge_open": _hedges.append(_e)
                                except: pass
                        _tcount = len(_trades)
                        _twins = sum(1 for t in _trades if t.get("main_won"))
                        _twr = round(_twins / _tcount * 100, 1) if _tcount else 0
                        _tpnl = round(sum(t.get("total_pnl", 0) for t in _trades), 2)
                        _troi_avg = round(sum(t.get("total_roi_pct", 0) for t in _trades) / _tcount, 1) if _tcount else 0
                        _ccount = len(_cascades)
                        _cwins_total = sum(c.get("wins", 0) for c in _cascades)
                        _closs_total = sum(c.get("losses", 0) for c in _cascades)
                        _ch_total = _cwins_total + _closs_total
                        _cwr = round(_cwins_total / _ch_total * 100, 1) if _ch_total else 0
                        _cpnl = round(sum(c.get("total_pnl", 0) for c in _cascades), 2)
                        _cprofitable = sum(1 for c in _cascades if c.get("total_pnl", 0) > 0)
                        _cprofitable_pct = round(_cprofitable / _ccount * 100, 1) if _ccount else 0
                        _h2 = [h for h in _hedges if h.get("level") == "H2"]
                        _h3 = [h for h in _hedges if h.get("level") == "H3"]
                        _h2_avg_pips = round(sum(h.get("pips_from_strike", 0) for h in _h2) / len(_h2), 1) if _h2 else 0
                        _h3_avg_pips = round(sum(h.get("pips_from_strike", 0) for h in _h3) / len(_h3), 1) if _h3 else 0
                        _h2_avg_pct = round(sum(abs(h.get("pct_move_from_strike", 0)) for h in _h2) / len(_h2), 4) if _h2 else 0
                        _best = max(_trades, key=lambda x: x.get("total_pnl", 0)) if _trades else None
                        _worst = min(_trades, key=lambda x: x.get("total_pnl", 0)) if _trades else None
                        _best_str = f"+{_best['total_pnl']:.2f} (ROI {_best.get('total_roi_pct',0):+.1f}%)" if _best else "—"
                        _worst_str = f"{_worst['total_pnl']:.2f} (ROI {_worst.get('total_roi_pct',0):+.1f}%)" if _worst else "—"
                        _err_lines = ""
                        if _strategy_err_count:
                            _err_lines = "\\n⚠️ Ошибки стратегий: " + ", ".join(f"{k}({v})" for k,v in _strategy_err_count.items())
                        tg(
                            f"📊 <b>[{BOT_NAME}] Отчёт за {_today}</b>\\n"
                            f"━━━━━━━━━━━━━━━━━━━━\\n"
                            f"📈 <b>СДЕЛКИ:</b>\\n"
                            f"• Всего: <b>{_tcount}</b> (✅{_twins}/❌{_tcount-_twins}) WR <b>{_twr}%</b>\\n"
                            f"• P&L: <b>{_tpnl:+.2f} {CURRENCY}</b> | сред. ROI: <b>{_troi_avg:+.1f}%</b>\\n"
                            f"• Лучшая: {_best_str}\\n"
                            f"• Худшая: {_worst_str}\\n"
                            f"━━━━━━━━━━━━━━━━━━━━\\n"
                            f"🛡 <b>КАСКАДЫ:</b>\\n"
                            f"• Запусков: <b>{_ccount}</b> | прибыльных: <b>{_cprofitable}</b> ({_cprofitable_pct}%)\\n"
                            f"• Хеджей всего: <b>{_ch_total}</b> (✅{_cwins_total}/❌{_closs_total}) WR <b>{_cwr}%</b>\\n"
                            f"• Итог каскадов: <b>{_cpnl:+.2f} {CURRENCY}</b>\\n"
                            f"━━━━━━━━━━━━━━━━━━━━\\n"
                            f"📐 <b>ПИПСЫ ХЕДЖЕЙ:</b>\\n"
                            f"• H2 откр.: ср. <b>{_h2_avg_pips} пип</b> от страйка ({_h2_avg_pct}%)\\n"
                            f"• H3 откр.: ср. <b>{_h3_avg_pips} пип</b> от страйка\\n"
                            f"━━━━━━━━━━━━━━━━━━━━\\n"
                            f"💾 Файл: <code>reports/trades_{_today}.jsonl</code>"
                            f"{_err_lines}"
                        )
                except Exception as _re:
                    tg(f"❌ <b>Ошибка отчёта:</b> {_re}")
            elif cmd == "/sendreport" and for_me:
                # Отправить JSONL-файл отчёта в TG
                _date = val if val else datetime.now().strftime("%Y-%m-%d")
                tg(f"📤 <b>[{BOT_NAME}]</b> Отправляю файл отчёта за {_date}...")
                try:
                    import threading as _thr
                    _thr.Thread(target=tg_send_report_file, args=(_date,), daemon=True).start()
                except Exception as _se:
                    tg(f"❌ Ошибка: {_se}")
            elif cmd == "/settp" and for_me:
                try:
                    TAKE_PROFIT = float(val)
                    tg(f"✅ <b>[{BOT_NAME}]</b> Take Profit: <b>{TAKE_PROFIT} {CURRENCY}</b>")
                except:
                    tg(f"❌ Формат: /settp {BOT_NAME} 50")
            elif cmd == "/setsl" and for_me:
                try:
                    STOP_LOSS = float(val)
                    tg(f"✅ <b>[{BOT_NAME}]</b> Stop Loss: <b>{STOP_LOSS} {CURRENCY}</b>")
                except:
                    tg(f"❌ Формат: /setsl {BOT_NAME} 20")
            elif cmd == "/setbet" and for_me:
                try:
                    BASE_BET = float(val)
                    tg(f"✅ <b>[{BOT_NAME}]</b> Ставка: <b>{BASE_BET} {CURRENCY}</b>")
                except:
                    tg(f"❌ Формат: /setbet {BOT_NAME} 10")
            elif cmd == "/summary" and for_me:
                # ===== ПОЛНЫЙ ОТЧЁТ ЗА СЕССИЮ =====
                _total = len(trade_log)
                if _total == 0:
                    tg(f"📋 <b>[{BOT_NAME}] Отчёт</b>\\nЕщё не было ни одной сделки. Жду сигналов...")
                else:
                    _wins = sum(1 for t in trade_log if t["won"])
                    _losses = _total - _wins
                    _wr = _wins / _total * 100
                    _profits = [t["profit"] for t in trade_log]
                    _best = max(_profits)
                    _worst = min(_profits)
                    _avg = sum(_profits) / _total
                    _full_wins = sum(1 for t in trade_log if t.get("full_win"))
                    _saved = sum(1 for t in trade_log if (t.get("main_won") is False) and t["won"])
                    _main_wins = sum(1 for t in trade_log if t.get("main_won"))
                    _wins_in_a_row = 0; _max_wins_streak = 0
                    _losses_in_a_row = 0; _max_losses_streak = 0
                    for _t in trade_log:
                        if _t["won"]:
                            _wins_in_a_row += 1; _losses_in_a_row = 0
                            _max_wins_streak = max(_max_wins_streak, _wins_in_a_row)
                        else:
                            _losses_in_a_row += 1; _wins_in_a_row = 0
                            _max_losses_streak = max(_max_losses_streak, _losses_in_a_row)
                    _hc = globals().get("hedge_count", 0); _hw = globals().get("hedge_wins", 0)
                    _ec = globals().get("ext_count", 0);   _ew = globals().get("ext_wins", 0)
                    _cs = globals().get("cur_streak", 0)
                    _hedge_wr = (_hw / _hc * 100) if _hc > 0 else 0
                    _ext_wr = (_ew / _ec * 100) if _ec > 0 else 0
                    if total_profit >= 0:
                        _ppct = min(100, int(total_profit / TAKE_PROFIT * 100)) if TAKE_PROFIT > 0 else 0
                        _pbar = "🟩" * (_ppct // 10) + "⬜" * (10 - _ppct // 10)
                        _plbl = f"до TP: {_ppct}%"
                    else:
                        _ppct = min(100, int(abs(total_profit) / STOP_LOSS * 100)) if STOP_LOSS > 0 else 0
                        _pbar = "🟥" * (_ppct // 10) + "⬜" * (10 - _ppct // 10)
                        _plbl = f"до SL: {_ppct}%"
                    _hedge_line = f"\\n🛡️ Хедж: {_hw}/{_hc} ({_hedge_wr:.0f}%) | спасений: {_saved}" if _hc > 0 else ""
                    _ext_line = f"\\n📈 Расширение: {_ew}/{_ec} ({_ext_wr:.0f}%)" if _ec > 0 else ""
                    _streak_str = f"🔥 +{_cs}" if _cs > 0 else (f"❄️ {_cs}" if _cs < 0 else "—")
                    tg(
                        f"📋 <b>[{BOT_NAME}] Полный отчёт</b>\\n"
                        f"━━━━━━━━━━━━━━━━━━━━\\n"
                        f"💰 <b>Профит сессии:</b> {total_profit:+.2f} {CURRENCY}\\n"
                        f"{_pbar} {_plbl}\\n"
                        f"━━━━━━━━━━━━━━━━━━━━\\n"
                        f"📊 <b>Сделки</b>\\n"
                        f"  Всего: <b>{_total}</b> (✅{_wins} / ❌{_losses})\\n"
                        f"  Winrate: <b>{_wr:.1f}%</b>\\n"
                        f"  🎯 Полных побед: {_full_wins}\\n"
                        f"  ✅ Чистых WIN основной: {_main_wins}{_hedge_line}{_ext_line}\\n"
                        f"━━━━━━━━━━━━━━━━━━━━\\n"
                        f"💹 <b>Профит-аналитика</b>\\n"
                        f"  🏆 Лучший трейд: <b>+{_best:.2f}</b>\\n"
                        f"  💔 Худший трейд: <b>{_worst:.2f}</b>\\n"
                        f"  📊 Средний: <b>{_avg:+.2f}</b>\\n"
                        f"━━━━━━━━━━━━━━━━━━━━\\n"
                        f"🔥 <b>Серии</b>\\n"
                        f"  Макс побед подряд: <b>{_max_wins_streak}</b>\\n"
                        f"  Макс поражений: <b>{_max_losses_streak}</b>\\n"
                        f"  Текущая: <b>{_streak_str}</b>\\n"
                        f"━━━━━━━━━━━━━━━━━━━━\\n"
                        f"⚙️ Текущая ставка: <b>{current_bet} {CURRENCY}</b>"
                    )
            elif cmd == "/pool":
                # Показываем содержимое общего пула свечей (общее знание между ботами)
                try:
                    _pdata = _pool_load()
                    _now_p = __import__("time").time()
                    if not _pdata:
                        tg(f"📊 <b>Пул свечей пуст</b>\\n\\nЕщё ни один бот не успел сохранить свечи. После пары тиков здесь появятся данные.")
                    else:
                        _lines = ["📊 <b>Общий пул свечей</b>", "━━━━━━━━━━━━━━━━━━━━"]
                        for _k in sorted(_pdata.keys()):
                            _e = _pdata[_k] or {}
                            _cs = _e.get("candles", [])
                            _age = int(_now_p - _e.get("updated_at", 0))
                            _fresh = "🟢" if _age < _POOL_FRESH_SEC else "🔴"
                            _last_close = _cs[-1].get("c") if _cs else "—"
                            _lines.append(f"{_fresh} <code>{_k}</code> | <b>{len(_cs)}</b> свечей | возраст {_age}с | last={_last_close}")
                        _lines.append("━━━━━━━━━━━━━━━━━━━━")
                        _lines.append(f"🟢 свежие (&lt;{_POOL_FRESH_SEC}с)  🔴 устаревшие")
                        tg("\\n".join(_lines))
                except Exception as _pe:
                    tg(f"❌ <b>Ошибка чтения пула:</b> {_pe}")
            elif cmd == "/profit" and for_me:
                # ===== ПРОФИТ ЗА СЕГОДНЯ =====
                _wins_p = sum(1 for t in trade_log if t["won"])
                _losses_p = trades_today - _wins_p
                _wr_p = (_wins_p / trades_today * 100) if trades_today > 0 else 0
                _profits_p = [t["profit"] for t in trade_log] if trade_log else []
                _best_p = max(_profits_p) if _profits_p else 0
                _worst_p = min(_profits_p) if _profits_p else 0
                _emoji_p = "🟢" if total_profit >= 0 else "🔴"
                tg(
                    f"💰 <b>[{BOT_NAME}] Профит сегодня</b>\\n"
                    f"━━━━━━━━━━━━━━━━━━━━\\n"
                    f"{_emoji_p} <b>{total_profit:+.2f} {CURRENCY}</b>\\n"
                    f"━━━━━━━━━━━━━━━━━━━━\\n"
                    f"📈 Сделок: {trades_today} (✅{_wins_p} / ❌{_losses_p})\\n"
                    f"🎯 WR: {_wr_p:.1f}%\\n"
                    f"🏆 Лучшая: +{_best_p:.2f} {CURRENCY}\\n"
                    f"💔 Худшая: {_worst_p:.2f} {CURRENCY}"
                )
            elif cmd == "/screenshot" and for_me:
                # ===== ASCII-ГРАФИК ПОСЛЕДНИХ СВЕЧЕЙ =====
                _buf_g = globals().get('_live_buf') or globals().get('buf') or globals().get('_live_buffer')
                _candles_g = []
                if _buf_g is not None:
                    _candles_g = list(getattr(_buf_g, 'candles', []) or [])
                if not _candles_g:
                    _candles_g = list(globals().get('_candle_cache', []) or [])
                if not _candles_g:
                    tg(f"📊 <b>[{BOT_NAME}] Скриншот</b>\\n\\nЕщё нет закрытых свечей. Подожди пару минут.")
                else:
                    _last_n = _candles_g[-10:]
                    _ohlc = []
                    for _c in _last_n:
                        if hasattr(_c, 'open'):
                            _ohlc.append((float(_c.open), float(_c.high), float(_c.low), float(_c.close), getattr(_c, 'time', None)))
                        elif isinstance(_c, dict):
                            _ohlc.append((float(_c.get('open', _c.get('o', 0))), float(_c.get('high', _c.get('h', 0))), float(_c.get('low', _c.get('l', 0))), float(_c.get('close', _c.get('c', 0))), _c.get('time')))
                        else:
                            _ohlc.append((float(_c[0]), float(_c[1]), float(_c[2]), float(_c[3]), _c[4] if len(_c) >= 5 else None))
                    _all_h = [_o[1] for _o in _ohlc]
                    _all_l = [_o[2] for _o in _ohlc]
                    _hi = max(_all_h); _lo = min(_all_l)
                    _rng = _hi - _lo if _hi > _lo else 0.00001
                    _rows = 8
                    _grid = [[" "] * len(_ohlc) for _ in range(_rows)]
                    for _i, (_op, _hh, _ll, _cl, _) in enumerate(_ohlc):
                        _y_op = int(round((_hi - _op) / _rng * (_rows - 1)))
                        _y_cl = int(round((_hi - _cl) / _rng * (_rows - 1)))
                        _y_hh = int(round((_hi - _hh) / _rng * (_rows - 1)))
                        _y_ll = int(round((_hi - _ll) / _rng * (_rows - 1)))
                        _ch = "🟢" if _cl >= _op else "🔴"
                        _y_top = min(_y_op, _y_cl); _y_bot = max(_y_op, _y_cl)
                        for _y in range(_y_hh, _y_ll + 1):
                            if _y_top <= _y <= _y_bot:
                                _grid[_y][_i] = _ch
                            else:
                                _grid[_y][_i] = "│"
                    _chart_lines = ["".join(_row) for _row in _grid]
                    _last_close = _ohlc[-1][3]
                    _last_color = "🟢" if _ohlc[-1][3] >= _ohlc[-1][0] else "🔴"
                    _trend_now = globals().get('_last_trend')
                    _trend_label = {"UP_UP": "🟢🟢 ↑↑", "DOWN_DOWN": "🔴🔴 ↓↓", "UP_DOWN": "🟢🔴 ↑↓", "DOWN_UP": "🔴🟢 ↓↑"}.get(_trend_now, "—")
                    _force_line = ""
                    if _tg_force_pattern:
                        _, _fh = _force_alias_to_pattern(_tg_force_pattern.replace("UP_UP", "gg").replace("DOWN_DOWN", "rr").replace("UP_DOWN", "gr").replace("DOWN_UP", "rg"))
                        _force_line = f"\\n⚡ FORCE: {_fh or _tg_force_pattern} (одноразово)"
                    tg(
                        f"📊 <b>[{BOT_NAME}] График</b>\\n"
                        f"<code>{chr(10).join(_chart_lines)}</code>\\n"
                        f"━━━━━━━━━━━━━━━━━━━━\\n"
                        f"📉 Hi: <b>{_hi:.5f}</b>\\n"
                        f"📈 Lo: <b>{_lo:.5f}</b>\\n"
                        f"💹 Last: {_last_color} <b>{_last_close:.5f}</b>\\n"
                        f"🎯 Тренд: {_trend_label}\\n"
                        f"⏱ Свечей: {len(_ohlc)} (из {len(_candles_g)})"
                        f"{_force_line}"
                    )
            elif cmd == "/force" and for_me:
                # ===== ФОРС ЦВЕТА 2 СВЕЧЕЙ (одноразово) =====
                if val.lower() in ("off", "выкл", "stop", "none", ""):
                    if _tg_force_pattern:
                        _tg_force_pattern = None
                        _tg_force_at = 0
                        tg(f"✅ <b>[{BOT_NAME}]</b> FORCE СНЯТ. Возвращаюсь к реальным свечам.")
                    else:
                        tg(f"ℹ️ <b>[{BOT_NAME}]</b> FORCE и так не активен.")
                else:
                    _patt, _human = _force_alias_to_pattern(val)
                    if _patt:
                        _tg_force_pattern = _patt
                        _tg_force_at = __import__("time").time()
                        tg(
                            f"⚡ <b>[{BOT_NAME}] FORCE АКТИВЕН</b>\\n"
                            f"━━━━━━━━━━━━━━━━━━━━\\n"
                            f"🎯 Паттерн: <b>{_human}</b>\\n"
                            f"🔁 Применится <b>1 раз</b> на следующем цикле\\n"
                            f"После сделки — авто-сброс, продолжу на реальных данных.\\n\\n"
                            f"Отмена: /force {BOT_NAME} off"
                        )
                    else:
                        tg(
                            f"❌ <b>[{BOT_NAME}]</b> Неизвестный паттерн: <code>{val}</code>\\n\\n"
                            f"<b>Доступные:</b>\\n"
                            f"/force {BOT_NAME} gg — 🟢🟢 (зел-зел)\\n"
                            f"/force {BOT_NAME} rr — 🔴🔴 (кр-кр)\\n"
                            f"/force {BOT_NAME} gr — 🟢🔴 (зел-кр)\\n"
                            f"/force {BOT_NAME} rg — 🔴🟢 (кр-зел)\\n"
                            f"/force {BOT_NAME} off — отменить"
                        )
            elif cmd == "/menu" and for_me:
                # Показать (или пересоздать) inline-меню с кнопками
                try:
                    tg_show_main_menu()
                except Exception as _me2:
                    tg(f"❌ <b>[{BOT_NAME}]</b> Не удалось показать меню: {_me2}")
            elif cmd == "/help":
                tg(
                    f"📋 <b>Команды [{BOT_NAME}]:</b>\\n"
                    f"━━━ <b>🎮 Меню кнопок</b> ━━━\\n"
                    f"/menu {BOT_NAME} — открыть пульт с кнопками\\n"
                    f"<i>(меню само появляется после каждой сделки)</i>\\n"
                    f"━━━ <b>Управление</b> ━━━\\n"
                    f"/stop {BOT_NAME} — остановить\\n"
                    f"/pause {BOT_NAME} — пауза\\n"
                    f"/resume {BOT_NAME} — продолжить\\n"
                    f"━━━ <b>Информация</b> ━━━\\n"
                    f"/status {BOT_NAME} — статус (профит, WR, цена)\\n"
                    f"/profit {BOT_NAME} — профит за сегодня\\n"
                    f"/summary {BOT_NAME} — полный отчёт сессии\\n"
                    f"/screenshot {BOT_NAME} — ASCII-график\\n"
                    f"/pool — общий пул свечей\\n"
                    f"━━━ <b>Настройки</b> ━━━\\n"
                    f"/settp {BOT_NAME} 50 — Take Profit\\n"
                    f"/setsl {BOT_NAME} 20 — Stop Loss\\n"
                    f"/setbet {BOT_NAME} 10 — базовая ставка\\n"
                    f"━━━ <b>⚡ FORCE (одноразово)</b> ━━━\\n"
                    f"/force {BOT_NAME} gg — 🟢🟢\\n"
                    f"/force {BOT_NAME} rr — 🔴🔴\\n"
                    f"/force {BOT_NAME} gr — 🟢🔴\\n"
                    f"/force {BOT_NAME} rg — 🔴🟢\\n"
                    f"/force {BOT_NAME} off — отменить\\n\\n"
                    f"<i>Вместо имени можно писать all — для всех ботов</i>"
                )
        # ===== ОБРАБОТКА ЭМУЛИРОВАННЫХ КОМАНД (от inline-кнопок) =====
        if _tg_emulated_queue:
            _emu_list = list(_tg_emulated_queue)
            _tg_emulated_queue.clear()
            for _emu_text in _emu_list:
                _eparts = _emu_text.split()
                if not _eparts:
                    continue
                _ecmd = _eparts[0].lower()
                _etarget = _eparts[1].lower() if len(_eparts) > 1 else ""
                _eval = _eparts[1] if len(_eparts) > 1 else ""
                # рекурсивно отправляем команду как фейковое сообщение через сам poll нельзя — у нас нет message-структуры.
                # Используем минимальный диспетчер для нужных команд:
                if _ecmd == "/summary":
                    _emu_total = len(trade_log)
                    if _emu_total == 0:
                        tg(f"📋 <b>[{BOT_NAME}] Отчёт</b>\\nЕщё не было ни одной сделки.")
                    else:
                        _ew_ = sum(1 for t in trade_log if t["won"])
                        _el_ = _emu_total - _ew_
                        _ewr_ = _ew_ / _emu_total * 100
                        _eprofits = [t["profit"] for t in trade_log]
                        _ebest = max(_eprofits); _eworst = min(_eprofits); _eavg = sum(_eprofits) / _emu_total
                        tg(
                            f"📋 <b>[{BOT_NAME}] Отчёт сессии</b>\\n"
                            f"━━━━━━━━━━━━━━━━━━━━\\n"
                            f"💰 Профит: <b>{total_profit:+.2f} {CURRENCY}</b>\\n"
                            f"📊 Сделок: <b>{_emu_total}</b> (✅{_ew_}/❌{_el_}) | WR: <b>{_ewr_:.1f}%</b>\\n"
                            f"🏆 Лучший: +{_ebest:.2f} | 💔 Худший: {_eworst:.2f}\\n"
                            f"📊 Средний: {_eavg:+.2f}"
                        )
                elif _ecmd == "/screenshot":
                    _ebuf = globals().get('_live_buf') or globals().get('buf') or globals().get('_live_buffer')
                    _ec_list = list(getattr(_ebuf, 'candles', []) or []) if _ebuf else []
                    if not _ec_list:
                        _ec_list = list(globals().get('_candle_cache', []) or [])
                    if not _ec_list:
                        tg(f"📊 <b>[{BOT_NAME}] График</b>\\nЕщё нет закрытых свечей.")
                    else:
                        _last10 = _ec_list[-10:]
                        _ohlc2 = []
                        for _ec in _last10:
                            if hasattr(_ec, 'open'):
                                _ohlc2.append((float(_ec.open), float(_ec.high), float(_ec.low), float(_ec.close)))
                            elif isinstance(_ec, dict):
                                _ohlc2.append((float(_ec.get('open', _ec.get('o', 0))), float(_ec.get('high', _ec.get('h', 0))), float(_ec.get('low', _ec.get('l', 0))), float(_ec.get('close', _ec.get('c', 0)))))
                            else:
                                _ohlc2.append((float(_ec[0]), float(_ec[1]), float(_ec[2]), float(_ec[3])))
                        _hi2 = max(_o[1] for _o in _ohlc2); _lo2 = min(_o[2] for _o in _ohlc2)
                        _rng2 = _hi2 - _lo2 if _hi2 > _lo2 else 0.00001
                        _rows2 = 8
                        _grid2 = [[" "] * len(_ohlc2) for _ in range(_rows2)]
                        for _i2, (_o2, _h2, _l2, _c2) in enumerate(_ohlc2):
                            _y_top = int(round((_hi2 - max(_o2, _c2)) / _rng2 * (_rows2 - 1)))
                            _y_bot = int(round((_hi2 - min(_o2, _c2)) / _rng2 * (_rows2 - 1)))
                            _y_hh2 = int(round((_hi2 - _h2) / _rng2 * (_rows2 - 1)))
                            _y_ll2 = int(round((_hi2 - _l2) / _rng2 * (_rows2 - 1)))
                            _ch2 = "🟢" if _c2 >= _o2 else "🔴"
                            for _y2 in range(_y_hh2, _y_ll2 + 1):
                                if _y_top <= _y2 <= _y_bot:
                                    _grid2[_y2][_i2] = _ch2
                                else:
                                    _grid2[_y2][_i2] = "│"
                        _chart2 = "\\n".join("".join(r) for r in _grid2)
                        tg(
                            f"📊 <b>[{BOT_NAME}] График</b>\\n"
                            f"<code>{_chart2}</code>\\n"
                            f"━━━━━━━━━━━━━━━━━━━━\\n"
                            f"📉 Hi: <b>{_hi2:.5f}</b> | 📈 Lo: <b>{_lo2:.5f}</b>\\n"
                            f"⏱ Свечей: {len(_ohlc2)}"
                        )
    except Exception:
        pass

# ===== СОСТОЯНИЕ =====
total_profit  = 0.0
trades_today  = 0
trade_log     = []
calls_follow  = 0
calls_reverse = 0
rejected_signals  = 0
rejected_no_trend = 0
rejected_conflict = 0
_last_report_time = 0
hedge_count   = 0
hedge_wins    = 0
ext_count     = 0
ext_wins      = 0
cur_streak    = 0   # >0 = серия побед, <0 = серия поражений
insufficient_funds_count = 0   # Подряд идущих "недостаточно средств"
INSUFFICIENT_FUNDS_LIMIT = 5   # После N подряд — авто-стоп
${martingaleBlock}
# ===== ТРЕНД ПО 2 ПОСЛЕДНИМ СВЕЧАМ =====
_last_trend = None

# ===== КЭШ СВЕЧЕЙ =====
_candle_cache     = []
_candle_asset     = None
_last_candle_time = None
_resolved_asset   = None

def candle_color(c):
    return "UP" if c[3] >= c[0] else "DOWN"

def get_trend(candles):
    closed = candles[:-1]
    if len(closed) < 2:
        return None
    window2 = closed[-2:]
    c2, c3 = [candle_color(c) for c in window2]
    e2 = "🟢" if c2 == "UP" else "🔴"
    e3 = "🟢" if c3 == "UP" else "🔴"
    w2, w3 = window2
    def _ts_fmt(c):
        try:
            t = c[4] if len(c) >= 5 else 0
            if hasattr(t, 'strftime'):
                return t.strftime('%H:%M:%S')
            if isinstance(t, (int, float)) and t > 0:
                _t = float(t)
                if _t > 1e12:
                    _t = _t / 1000.0
                return datetime.fromtimestamp(_t).strftime('%H:%M:%S')
        except Exception:
            pass
        return "??:??:??"
    def fmt(c, e):
        return f"{e} t={_ts_fmt(c)} o={c[0]:.5f} c={c[3]:.5f} Δ={c[3]-c[0]:+.5f}"
    cur   = candles[-1]
    window5 = closed[-5:] if len(closed) >= 5 else closed
    colors5 = [candle_color(c) for c in window5]
    ups5   = colors5.count("UP")
    downs5 = colors5.count("DOWN")
    bar   = "".join("🟢" if col == "UP" else "🔴" for col in colors5)
    cur_emoji = "🟢" if cur[3] >= cur[0] else "🔴"
    _times5 = " ".join(_ts_fmt(c) for c in window5)
    print(f"[СВЕЧИ] таймфрейм={EXPIRY_SEC}с ({EXPIRY_SEC//60}мин) | {bar} (▲{ups5}/▼{downs5}) | текущая: {cur_emoji} | времена закр.: {_times5}")
    print(f"[АНАЛИЗ] Свеча -2: {fmt(w2, e2)}")
    print(f"[АНАЛИЗ] Свеча -1: {fmt(w3, e3)}  ← последняя закрытая")
    if c2 == "UP" and c3 == "UP":
        print(f"[ТРЕНД]  {e2}{e3} → UP_UP (2 зелёных подряд)")
        return "UP_UP"
    if c2 == "DOWN" and c3 == "DOWN":
        print(f"[ТРЕНД]  {e2}{e3} → DOWN_DOWN (2 красных подряд)")
        return "DOWN_DOWN"
    if c2 == "DOWN" and c3 == "UP":
        print(f"[ТРЕНД]  {e2}{e3} → DOWN_UP (разворот вверх)")
        return "DOWN_UP"
    if c2 == "UP" and c3 == "DOWN":
        print(f"[ТРЕНД]  {e2}{e3} → UP_DOWN (разворот вниз)")
        return "UP_DOWN"
    print(f"[ТРЕНД]  {e2}{e3} → нет чёткого паттерна, пропуск")
    return None

def trend_to_signal(trend):
    sig = None
    if TREND_MODE == "any":
        if trend in ("UP_UP", "DOWN_UP"):
            sig = "CALL"
        elif trend in ("DOWN_DOWN", "UP_DOWN"):
            sig = "PUT"
    elif TREND_MODE == "same":
        if trend == "UP_UP":
            sig = "CALL"
        elif trend == "DOWN_DOWN":
            sig = "PUT"
    else:
        if trend == "DOWN_UP":
            sig = "CALL"
        elif trend == "UP_DOWN":
            sig = "PUT"
    if sig and TREND_FOLLOW == "reverse":
        sig = "PUT" if sig == "CALL" else "CALL"
    return sig

def check_trend_change(candles):
    global _last_trend
    trend = get_trend(candles)
    if trend and trend != _last_trend:
        old = _last_trend
        _last_trend = trend
        return trend, old
    _last_trend = trend
    return None, None

# ===== СТРАТЕГИИ =====
PAYOUT           = ${cfg.payoutRate ?? 92} / 100
TRADE_DIRECTION  = "${cfg.tradeDirection ?? "all"}"  # "all" | "call_only" | "put_only"

${fnBlocks.join("\n")}

# ===== КОМБО-ЛОГИКА (${cfg.comboLogic}) =====
${combineLogic}

${buildTradeBaseFiltersBlock(cfg)}

async def get_candles_data(client):
    try:
        raw = await client.get_candles(asset=ASSET, timeframe=EXPIRY_SEC, count=100)
        candles = [(c.open, c.high, c.low, c.close) for c in raw]
        prices  = [c.close for c in raw]
        print(f"[CANDLES] Получено свечей: {len(prices)} | таймфрейм: {EXPIRY_SEC}с ({EXPIRY_SEC//60}мин)")
        return candles, prices
    except Exception as e:
        print(f"[ERROR] get_candles: {e}")
        return [], []

# ===== ЖИВОЙ БУФЕР СВЕЧЕЙ =====
# Бот держит в памяти последние 50 свечей и текущую "живую" свечу.
# Фоновая задача опрашивает цену раз в LIVE_TICK_INTERVAL сек и обновляет буфер.
# Главный цикл читает буфер мгновенно, без ожиданий get_candles.
LIVE_BUFFER_SIZE = 50
LIVE_TICK_INTERVAL = 0.5  # ⚡ опрос каждые 0.5с — точность h/l свечей x2 (раньше было 1с)

# ===== ЗАПИСЬ ВИДЕННЫХ СВЕЧЕЙ В ФАЙЛ СЕССИИ =====
# Все свечи которые бот ВИДЕЛ ЛИЧНО (закрытые) пишутся в свечи/YYYY-MM-DD_HH-MM-SS.csv
# Имя файла = дата+время старта бота. Один запуск = один файл.
import os as _os_sess
from datetime import datetime as _dt_sess, timedelta as _td_sess
_SESSION_DIR = _os_sess.path.join(_os_sess.path.dirname(_os_sess.path.abspath(__file__)) if "__file__" in dir() else ".", "свечи")
_SESSION_START = _dt_sess.now().strftime("%Y-%m-%d_%H-%M-%S")
_SESSION_FILE = _os_sess.path.join(_SESSION_DIR, f"{_SESSION_START}.csv")
_SESSION_SEEN = set()  # хэши уже записанных свечей чтобы не дублировать

def _session_init():
    """Создаёт папку 'свечи/' и файл сессии с заголовком."""
    try:
        _os_sess.makedirs(_SESSION_DIR, exist_ok=True)
        if not _os_sess.path.exists(_SESSION_FILE):
            _header = "timestamp_utc;asset;timeframe_sec;open;high;low;close;color;recorded_at" + chr(10)
            with open(_SESSION_FILE, "w", encoding="utf-8") as f:
                f.write(_header)
            print(f"[SESSION] 📝 Файл сессии создан: свечи/{_SESSION_START}.csv")
    except Exception as _se:
        print(f"[SESSION] init error: {_se}")

def _session_save_candle(asset, tf_sec, candle_t, o, h, l, c):
    """Записать ОДНУ закрытую свечу в файл сессии. candle_t = unix-ts начала свечи."""
    try:
        # дедупликация по (asset, tf, time)
        _hash = f"{asset}_{int(tf_sec)}_{int(candle_t)}"
        if _hash in _SESSION_SEEN:
            return
        _SESSION_SEEN.add(_hash)
        _os_sess.makedirs(_SESSION_DIR, exist_ok=True)
        _ts_str = _dt_sess.utcfromtimestamp(int(candle_t)).strftime("%Y-%m-%d %H:%M:%S")
        _now_str = _dt_sess.now().strftime("%Y-%m-%d %H:%M:%S")
        _color = "GREEN" if c >= o else "RED"
        _line = f"{_ts_str};{asset};{int(tf_sec)};{o};{h};{l};{c};{_color};{_now_str}" + chr(10)
        with open(_SESSION_FILE, "a", encoding="utf-8") as f:
            f.write(_line)
        print(f"[SESSION] 💾 Свеча записана: {_ts_str} UTC | {_color} | o={o} c={c} → свечи/{_SESSION_START}.csv")
    except Exception as _se:
        print(f"[SESSION] save error: {_se}")

_session_init()

# ===== ОБЩИЙ ПУЛ СВЕЧЕЙ МЕЖДУ БОТАМИ =====
# Файл candle_pool.json рядом с ботом. Все боты пишут сюда закрытые свечи и
# при старте читают, чтобы пропустить WARMUP если есть свежие данные.
# Поддерживает АГРЕГАЦИЮ: бот на 30мин может собрать свечи из 3-минутных тиков бота-донора.
import os as _os_pool
import json as _json_pool
_POOL_FILE = _os_pool.path.join(_os_pool.path.dirname(_os_pool.path.abspath(__file__)) if "__file__" in dir() else ".", "candle_pool.json")
_POOL_MAX_PER_KEY = 500  # макс свечей на ключ (asset_timeframe)
_POOL_FRESH_SEC = 30     # данные считаем свежими только в пределах 30 сек (раньше было 300с — старые свечи приводили к торговле по неактуальным ценам)

def _pool_load():
    """Читаем пул из файла. Возвращаем dict или {} если нет/битый."""
    try:
        if not _os_pool.path.exists(_POOL_FILE):
            return {}
        with open(_POOL_FILE, "r", encoding="utf-8") as f:
            return _json_pool.load(f) or {}
    except Exception:
        return {}

def _pool_save(data):
    """Атомарная запись пула: пишем во временный файл, потом os.rename (atomic)."""
    try:
        _tmp = _POOL_FILE + ".tmp"
        with open(_tmp, "w", encoding="utf-8") as f:
            _json_pool.dump(data, f, ensure_ascii=False)
        _os_pool.replace(_tmp, _POOL_FILE)
    except Exception as _pe:
        print(f"[POOL] save error: {_pe}")

_POOL_AUTO_CLEAN_SEC = 300   # авто-очистка: записи старше 5 минут удаляются при старте

def _pool_auto_cleanup():
    """Авто-очистка устаревшего пула при старте бота. Удаляет/файл/записи старше _POOL_AUTO_CLEAN_SEC."""
    try:
        if not _os_pool.path.exists(_POOL_FILE):
            return
        data = _pool_load()
        if not data:
            return
        now = __import__("time").time()
        stale_keys = []
        fresh_keys = []
        for k, v in list(data.items()):
            age = now - (v or {}).get("updated_at", 0)
            if age >= _POOL_AUTO_CLEAN_SEC:
                stale_keys.append((k, int(age)))
                del data[k]
            else:
                fresh_keys.append((k, int(age)))
        if stale_keys:
            if data:
                _pool_save(data)
                print(f"[POOL_CLEAN] 🧹 Удалены устаревшие записи (>{_POOL_AUTO_CLEAN_SEC}с):")
                for k, a in stale_keys:
                    print(f"[POOL_CLEAN]    ❌ {k} — возраст {a}с")
            else:
                # Все записи устарели — удаляем файл целиком
                try:
                    _os_pool.remove(_POOL_FILE)
                    print(f"[POOL_CLEAN] 🧹 Весь пул устарел — файл candle_pool.json удалён ({len(stale_keys)} записей)")
                except Exception as _re:
                    print(f"[POOL_CLEAN] remove error: {_re}")
            if fresh_keys:
                print(f"[POOL_CLEAN] ✅ Сохранены свежие записи:")
                for k, a in fresh_keys:
                    print(f"[POOL_CLEAN]    🟢 {k} — возраст {a}с")
        else:
            if fresh_keys:
                print(f"[POOL_CLEAN] ✅ Пул в порядке: {len(fresh_keys)} свежих записей, очистка не требуется")
    except Exception as _ce:
        print(f"[POOL_CLEAN] error: {_ce}")

# Вызываем авто-очистку СРАЗУ при импорте модуля бота (до warmup)
_pool_auto_cleanup()

def _pool_key(asset, tf_sec):
    return f"{asset}_{int(tf_sec)}"

def _pool_push_candle(asset, tf_sec, candle_t, o, h, l, c):
    """Дописать одну закрытую свечу в пул. candle_t — unix-timestamp начала свечи."""
    try:
        data = _pool_load()
        k = _pool_key(asset, tf_sec)
        entry = data.get(k) or {"updated_at": 0, "candles": []}
        candles = entry.get("candles", [])
        # Проверка на дубль по timestamp
        if candles and candles[-1].get("t") == candle_t:
            return
        candles.append({"t": int(candle_t), "o": float(o), "h": float(h), "l": float(l), "c": float(c)})
        if len(candles) > _POOL_MAX_PER_KEY:
            candles = candles[-_POOL_MAX_PER_KEY:]
        entry["candles"] = candles
        entry["updated_at"] = int(__import__("time").time())
        data[k] = entry
        _pool_save(data)
    except Exception as _pe:
        print(f"[POOL] push error: {_pe}")

def _pool_get_candles(asset, tf_sec, min_count=2):
    """
    Достать свечи для пары (asset, tf_sec) из пула.
    Если прямого ключа нет — пытаемся АГРЕГИРОВАТЬ из меньшего таймфрейма (доноры).
    Возвращает список (o,h,l,c) или [] если данных недостаточно/устарели.
    """
    try:
        data = _pool_load()
        now = __import__("time").time()
        k = _pool_key(asset, tf_sec)
        # 1) Прямой матч
        entry = data.get(k)
        if entry:
            _age = int(now - entry.get("updated_at", 0))
            if _age < _POOL_FRESH_SEC:
                cs = entry.get("candles", [])
                if len(cs) >= min_count:
                    print(f"[POOL] ✅ Прямой матч: {k} | свечей: {len(cs)} | возраст: {_age}с (≤{_POOL_FRESH_SEC}с — свежие)")
                    return [(c["o"], c["h"], c["l"], c["c"]) for c in cs]
            else:
                print(f"[POOL] ⚠️ Найден кэш {k} но УСТАРЕВШИЙ ({_age}с > {_POOL_FRESH_SEC}с) — пропускаем, делаем свежий warmup")
        # 2) Агрегация: ищем донор с делимым таймфреймом (asset тот же, tf_donor < tf_sec, tf_sec % tf_donor == 0)
        for kk, ee in data.items():
            try:
                _a, _tf = kk.rsplit("_", 1)
                _tf = int(_tf)
            except Exception:
                continue
            if _a != asset or _tf >= tf_sec or tf_sec % _tf != 0:
                continue
            if (now - ee.get("updated_at", 0)) >= _POOL_FRESH_SEC:
                continue
            ratio = tf_sec // _tf
            cs = ee.get("candles", [])
            if len(cs) < ratio * min_count:
                continue
            # Группируем по бакетам tf_sec
            groups = {}
            for cd in cs:
                bucket = int(cd["t"] // tf_sec) * tf_sec
                groups.setdefault(bucket, []).append(cd)
            # Берём только полные группы (== ratio свечей в группе) и сортируем по времени
            full = sorted([(b, g) for b, g in groups.items() if len(g) == ratio])
            if len(full) < min_count:
                continue
            agg = []
            for b, g in full[-_POOL_MAX_PER_KEY:]:
                g_sorted = sorted(g, key=lambda x: x["t"])
                agg.append((g_sorted[0]["o"], max(x["h"] for x in g_sorted), min(x["l"] for x in g_sorted), g_sorted[-1]["c"]))
            print(f"[POOL] 🔄 АГРЕГАЦИЯ: {kk} ({_tf}с) → {tf_sec}с | свечей донора: {len(cs)} | собрано: {len(agg)} | ratio={ratio}:1")
            return agg
        return []
    except Exception as _pe:
        print(f"[POOL] get error: {_pe}")
        return []


class CandleBuffer:
    def __init__(self):
        # ✅ НОВАЯ ЛОГИКА: бот САМ строит свечи из тиков цены.
        # Никакой истории с API, никаких "закрытых свечей из кеша".
        # Только то, что мы УВИДЕЛИ СВОИМИ ГЛАЗАМИ.
        self.candles = []        # список (open, high, low, close) — закрытые свечи которые МЫ ВИДЕЛИ
        self.live = None         # текущая формирующаяся свеча (open, high, low, close)
        self.live_bucket = None  # int — начало текущей свечи (unix-ts // EXPIRY_SEC * EXPIRY_SEC)
        self.last_price = 0.0
        self.last_update = 0.0
        self.ready = False
        self.sync_warn = False
        self.time_shift = None
        self.last_candle_close_dt = None
        # ===== СВЕРКА С ГРАФИКОМ =====
        self.cmp_total = 0       # сколько раз сверяли
        self.cmp_match = 0       # цвет совпал
        self.cmp_color_diff = 0  # цвет разошёлся
        self.cmp_price_max_gap = 0.0  # максимальное расхождение close (%)

    async def warmup(self, client):
        """⚠️ NO-OP: больше не загружаем историю. Бот стартует с пустого буфера и ЖДЁТ свои свечи."""
        _used_asset = _resolved_asset or ASSET
        print(f"[BUFFER] 🔥 НОВАЯ ЛОГИКА: ждём свечи которые УВИДИМ САМИ | актив={_used_asset} | таймфрейм={EXPIRY_SEC}с")
        print(f"[BUFFER] ⏳ Готовы к торговле когда накопим >= 2 свечи (~{EXPIRY_SEC*2}с минимум)")
        self.ready = True  # буфер готов опрашивать цены сразу

    async def tick(self, client):
        """✅ НОВАЯ ЛОГИКА: опрашиваем ТОЛЬКО текущую цену и САМИ строим свечи.
        Никаких 'closed' свечей из API — только то, что мы видим в реальном времени.
        """
        try:
            _query_asset = _resolved_asset or ASSET
            # Берём 1 свечу — нам нужна только её current.close (= текущая цена тика)
            raw = await client.get_candles(asset=_query_asset, timeframe=EXPIRY_SEC, count=1)
            if not raw:
                return
            import time as _t_mod
            from datetime import timedelta
            now = _t_mod.time()
            current = raw[-1]
            cur_price = float(current.close)
            # ===== ОПРЕДЕЛЯЕМ В КАКУЮ СВЕЧУ ПОПАДАЕТ ТЕКУЩИЙ ТИК =====
            # bucket = начало свечи в которой мы сейчас живём (unix-ts округлённое вниз до EXPIRY_SEC)
            bucket = int(now // EXPIRY_SEC) * EXPIRY_SEC
            # ===== СЛУЧАЙ 1: первый тик за всё время =====
            if self.live is None or self.live_bucket is None:
                self.live_bucket = bucket
                self.live = (cur_price, cur_price, cur_price, cur_price)  # o=h=l=c
                self.last_price = cur_price
                self.last_update = now
                _utc_t = datetime.utcfromtimestamp(bucket).strftime('%H:%M:%S')
                print(f"[CANDLE_BUILD] 🆕 СТАРТ ПЕРВОЙ СВЕЧИ {_utc_t} UTC | open={cur_price:.5f}")
                return
            # ===== СЛУЧАЙ 2: тик в той же свече — обновляем h/l/c =====
            if bucket == self.live_bucket:
                _o, _h, _l, _c = self.live
                _h = max(_h, cur_price)
                _l = min(_l, cur_price)
                _c = cur_price
                self.live = (_o, _h, _l, _c)
                self.last_price = cur_price
                self.last_update = now
                return
            # ===== СЛУЧАЙ 3: началась НОВАЯ свеча — закрываем старую и открываем новую =====
            # Закрываем предыдущую свечу + ДОБАВЛЯЕМ ВРЕМЯ ОТКРЫТИЯ (5-й элемент)
            # 5-tuple (o, h, l, c, bucket_ts) — анализатор get_trend умеет читать c[4]
            closed_tup = (self.live[0], self.live[1], self.live[2], self.live[3], int(self.live_bucket))
            # ✅ ЗАЩИТА ОТ ПЛОСКОЙ СВЕЧИ: если o=h=l=c — мы стартанули в конце окна
            # и собрали 1 тик. Такая свеча — мусор, не считаем её "закрытой".
            _is_flat = (closed_tup[0] == closed_tup[1] == closed_tup[2] == closed_tup[3])
            if _is_flat:
                _open_t_skip = datetime.utcfromtimestamp(self.live_bucket).strftime('%H:%M:%S')
                print(f"[CANDLE_BUILD] 🚫 ПРОПУЩЕНА ПЛОСКАЯ СВЕЧА {_open_t_skip} UTC | o=h=l=c={closed_tup[0]:.5f} (мало тиков, бот стартанул в конце окна)")
                # Открываем новую свечу с актуальной цены, не сохраняя плоскую
                self.live_bucket = bucket
                self.live = (cur_price, cur_price, cur_price, cur_price)
                self.last_price = cur_price
                self.last_update = now
                self.sync_warn = False
                return
            self.candles.append(closed_tup)
            if len(self.candles) > LIVE_BUFFER_SIZE:
                self.candles = self.candles[-LIVE_BUFFER_SIZE:]
            # Логируем закрытие
            _close_dt = datetime.utcfromtimestamp(self.live_bucket + EXPIRY_SEC)
            _open_dt = datetime.utcfromtimestamp(self.live_bucket)
            _open_t = _open_dt.strftime('%H:%M:%S')
            _close_t = _close_dt.strftime('%H:%M:%S')
            _color = '🟢' if closed_tup[3] >= closed_tup[0] else '🔴'
            print(f"[CANDLE_BUILD] ✅ ЗАКРЫТА {_color} {_open_t}→{_close_t} UTC | o={closed_tup[0]:.5f} h={closed_tup[1]:.5f} l={closed_tup[2]:.5f} c={closed_tup[3]:.5f}")
            # ===== СВЕРКА С ГРАФИКОМ POCKETOPTION (раз в 10 свечей) =====
            # ⚡ Раньше делали запрос на КАЖДОЙ закрытой свече → жрало +0.5-1.5с к каждому тику.
            # Теперь сверяем раз в 10 свечей — этого достаточно для контроля синхронизации,
            # а свободное время уходит на нормальные тики (h/l не пропускаются).
            if len(self.candles) % 10 == 0:
                try:
                    _ref = await client.get_candles(asset=_query_asset, timeframe=EXPIRY_SEC, count=2)
                    if _ref and len(_ref) >= 2:
                        _api_closed = _ref[-2]  # последняя закрытая на бирже
                        _api_o = float(_api_closed.open)
                        _api_c = float(_api_closed.close)
                        _api_color = '🟢' if _api_c >= _api_o else '🔴'
                        _our_color = _color
                        _close_gap = abs(_api_c - closed_tup[3]) / max(_api_c, 0.0001) * 100
                        self.cmp_total += 1
                        if self.cmp_price_max_gap < _close_gap:
                            self.cmp_price_max_gap = _close_gap
                        if _api_color == _our_color:
                            self.cmp_match += 1
                            _verdict = "✅ В НОГУ"
                        else:
                            self.cmp_color_diff += 1
                            _verdict = "⚠️ ЦВЕТ РАЗОШЁЛСЯ"
                        _match_pct = (self.cmp_match / self.cmp_total) * 100
                        print(f"[SYNC_CHECK] {_verdict} | бот: {_our_color} c={closed_tup[3]:.5f} | график: {_api_color} c={_api_c:.5f} | дельта close={_close_gap:.3f}% | совпадений: {self.cmp_match}/{self.cmp_total} ({_match_pct:.0f}%)")
                except Exception as _se:
                    print(f"[SYNC_CHECK] не удалось сверить с API: {_se}")
            self.last_candle_close_dt = _close_dt
            # Записываем в файл сессии
            try:
                _session_save_candle((_resolved_asset or ASSET), EXPIRY_SEC, int(self.live_bucket), closed_tup[0], closed_tup[1], closed_tup[2], closed_tup[3])
            except Exception as _se:
                print(f"[SESSION] save error: {_se}")
            # Записываем в общий пул
            try:
                _pool_push_candle((_resolved_asset or ASSET), EXPIRY_SEC, int(self.live_bucket), closed_tup[0], closed_tup[1], closed_tup[2], closed_tup[3])
            except Exception as _pe:
                pass
            # Открываем новую свечу
            self.live_bucket = bucket
            self.live = (cur_price, cur_price, cur_price, cur_price)
            self.last_price = cur_price
            self.last_update = now
            _new_open_t = datetime.utcfromtimestamp(bucket).strftime('%H:%M:%S')
            print(f"[CANDLE_BUILD] 🆕 НОВАЯ СВЕЧА {_new_open_t} UTC | open={cur_price:.5f} | накоплено закрытых: {len(self.candles)}")
            self.sync_warn = False
            return
        except Exception as e:
            print(f"[BUFFER] tick error: {e}")
            return

    # ===== СТАРАЯ ЛОГИКА ОТКЛЮЧЕНА — оставлено для совместимости =====
    async def _legacy_tick_unused(self, client):
        try:
            _query_asset = _resolved_asset or ASSET
            raw = await client.get_candles(asset=_query_asset, timeframe=EXPIRY_SEC, count=2)
            if not raw:
                return
            now = __import__("time").time()
            closed = raw[-2] if len(raw) >= 2 else None
            current = raw[-1]
            cur_close = float(current.close)
            # SANITY-CHECK: если цена скакнула >0.5% за 1 тик — это глюк API (мусор из кеша)
            # Игнорируем такой тик, не записываем в буфер.
            if self.last_price > 0:
                _jump = abs(cur_close - self.last_price) / max(self.last_price, 0.0001)
                if _jump > 0.005:
                    print(f"[TICK_GUARD] ⚠️ ПОДОЗРИТЕЛЬНЫЙ СКАЧОК: {self.last_price:.5f} → {cur_close:.5f} ({_jump*100:.2f}%) — игнорирую тик, ставлю sync_warn")
                    self.sync_warn = True
                    return
            self.last_price = cur_close
            self.last_update = now
            # Обновляем закрытые свечи (если появилась новая)
            if closed is not None:
                closed_tup = (float(closed.open), float(closed.high), float(closed.low), float(closed.close))
                # SANITY-CHECK: новая закрытая свеча не должна сильно отличаться от текущей цены
                _closed_close = closed_tup[3]
                if cur_close > 0 and abs(_closed_close - cur_close) / max(cur_close, 0.0001) > 0.01:
                    print(f"[TICK_GUARD] ⚠️ Свеча из кеша API: closed.close={_closed_close:.5f} vs live={cur_close:.5f} — пропускаю запись")
                    self.sync_warn = True
                    return
                if not self.candles or self.candles[-1] != closed_tup:
                    self.candles.append(closed_tup)
                    if len(self.candles) > LIVE_BUFFER_SIZE:
                        self.candles = self.candles[-LIVE_BUFFER_SIZE:]
                    # ====== ЗАПИСЬ В ОБЩИЙ ПУЛ ======
                    try:
                        _t_pool = None
                        for _tk in ('time', 't', 'timestamp', 'open_time'):
                            _v = getattr(closed, _tk, None)
                            if _v is None and isinstance(closed, dict):
                                _v = closed.get(_tk)
                            if _v is None:
                                continue
                            if isinstance(_v, datetime):
                                _t_pool = _v.timestamp()
                                break
                            try:
                                _num = float(_v)
                                _t_pool = _num / 1000 if _num > 1e10 else _num
                                break
                            except (TypeError, ValueError):
                                continue
                        if _t_pool:
                            _pool_push_candle((_resolved_asset or ASSET), EXPIRY_SEC, int(_t_pool), closed_tup[0], closed_tup[1], closed_tup[2], closed_tup[3])
                            # ✅ ЗАПИСЬ В ФАЙЛ СЕССИИ — каждая свеча которую БОТ УВИДЕЛ ЛИЧНО
                            _session_save_candle((_resolved_asset or ASSET), EXPIRY_SEC, int(_t_pool), closed_tup[0], closed_tup[1], closed_tup[2], closed_tup[3])
                    except Exception as _ppe:
                        print(f"[POOL] push from tick error: {_ppe}")
                    try:
                        from datetime import timedelta
                        # ВАЖНО: работаем в UTC чтобы не зависеть от часового пояса юзера (Красноярск, Москва — без разницы)
                        _candle_dt = None
                        for _tk in ('time', 't', 'timestamp', 'open_time'):
                            _v = getattr(closed, _tk, None)
                            if _v is None and isinstance(closed, dict):
                                _v = closed.get(_tk)
                            if _v is None:
                                continue
                            if isinstance(_v, datetime):
                                _candle_dt = _v.replace(tzinfo=None) if _v.tzinfo else _v
                                break
                            try:
                                _num = float(_v)
                                _raw_ts = _num / 1000 if _num > 1e10 else _num
                                _candle_dt = datetime.utcfromtimestamp(_raw_ts)
                                break
                            except (TypeError, ValueError):
                                continue
                        if _candle_dt is not None:
                            _close_dt = _candle_dt + timedelta(seconds=EXPIRY_SEC)
                            _open_t = _candle_dt.strftime('%H:%M:%S')
                            _close_t = _close_dt.strftime('%H:%M:%S')
                            _now_dt = datetime.utcnow()
                            _now_str = _now_dt.strftime('%H:%M:%S')
                            _raw_diff = (_now_dt - _close_dt).total_seconds()
                            # АВТО-КАЛИБРОВКА: при первой свече запоминаем разницу часов
                            # Считаем что свеча реально только что закрылась → её "истинная задержка" = ~EXPIRY_SEC/2
                            if self.time_shift is None:
                                self.time_shift = _raw_diff
                                print(f"[TIME_SYNC] 🕐 Калибровка часов выполнена ✅ (бот синхронизирован с потоком свечей)")
                            # Корректированная задержка относительно потока свечей
                            _diff = _raw_diff - self.time_shift
                            # Дополнительно: если есть предыдущая свеча — считаем дельту между свечами
                            _gap_from_prev = None
                            if self.last_candle_close_dt is not None:
                                _gap_from_prev = (_close_dt - self.last_candle_close_dt).total_seconds()
                            self.last_candle_close_dt = _close_dt
                            _em = '🟢' if closed.close >= closed.open else '🔴'
                            _gap_str = f" | gap={_gap_from_prev:.0f}с" if _gap_from_prev is not None else ""
                            # Красивый статус задержки вместо пугающих чисел
                            _abs_diff = abs(_diff)
                            if _abs_diff <= EXPIRY_SEC:
                                _delay_str = "задержка ОК ✅"
                            elif _abs_diff <= EXPIRY_SEC * 2:
                                _delay_str = f"задержка {_abs_diff:.0f}с ⚠️"
                            else:
                                _delay_str = f"задержка {_abs_diff:.0f}с ❌ (поток встал)"
                            print(f"[RAW_API] 🆕 СВЕЧА {_em} {_open_t}→{_close_t} UTC | {_delay_str}{_gap_str} | o={closed.open:.5f} c={closed.close:.5f}")
                            # Свеча "устарела" только если корректированная задержка > 2× таймфрейма
                            # ИЛИ если gap между свечами слишком большой (поток встал)
                            _stale = _diff > EXPIRY_SEC * 2
                            if _stale:
                                print(f"[SYNC_WARN] ⚠️ РАССИНХРОН! Корректированная задержка {_diff:.0f}с > {EXPIRY_SEC*2}с — поток встал!")
                                self.sync_warn = True
                            else:
                                self.sync_warn = False
                        else:
                            _em = '🟢' if closed.close >= closed.open else '🔴'
                            print(f"[RAW_API] 🆕 НОВАЯ ЗАКРЫТАЯ {_em} (нет timestamp) | o={closed.open:.5f} c={closed.close:.5f}")
                    except Exception as _le:
                        print(f"[RAW_API_ERR] {_le}")
            # Обновляем "живую" свечу
            self.live = (float(current.open), float(current.high), float(current.low), cur_close)
        except Exception as e:
            pass

    def all_candles(self):
        """Возвращает список свечей включая текущую (для анализа в реальном времени)."""
        if self.live:
            return self.candles + [self.live]
        return list(self.candles)

    def closed_candles(self):
        """Только закрытые свечи (для строгого тренд-анализа)."""
        return list(self.candles)

    def prices(self):
        """Список close-цен включая текущую."""
        out = [c[3] for c in self.candles]
        if self.live:
            out.append(self.live[3])
        return out

async def buffer_updater(buf, client):
    """Фоновая задача — каждые LIVE_TICK_INTERVAL сек обновляет буфер (резерв на случай отказа стрима)."""
    while True:
        try:
            await buf.tick(client)
        except Exception as e:
            print(f"[BUFFER] tick error: {e}")
        await asyncio.sleep(LIVE_TICK_INTERVAL)


async def live_stream_subscriber(buf, client):
    """🚀 LIVE TICK STREAM: ПРЯМОЙ WebSocket к Pocket Option (Socket.IO протокол).
    Подключаемся напрямую к wss://api-eu.po.market — получаем настоящие тики каждую секунду.
    Каждое изменение цены сразу обновляет buf.last_price и текущую живую свечу.
    """
    _stream_asset = _resolved_asset or ASSET
    print(f"[WS] 🎯 ПРЯМОЙ WebSocket к РО: {_stream_asset} | demo={IS_DEMO}")

    try:
        import websockets
    except ImportError:
        print(f"[WS] ❌ Нет модуля websockets — поставь: pip install websockets")
        return

    import json as _json_ws
    import time as _t_ws
    import gzip as _gzip_ws
    import zlib as _zlib_ws
    # MessagePack нужен для распаковки бинарных пакетов РО (Socket.IO v3+)
    try:
        import msgpack as _msgpack_ws
        _HAS_MSGPACK = True
    except ImportError:
        _HAS_MSGPACK = False
        print(f"[WS] ⚠️ Нет msgpack — поставь: pip install msgpack (без него бинарные тики не парсятся!)")

    def _decode_binary(_buf):
        """Универсальный декодер бинарного пакета РО.
        РО шлёт данные в разных форматах: MessagePack, JSON (utf-8), gzip-JSON.
        """
        if not _buf:
            return None
        # 1) Пробуем MessagePack
        if _HAS_MSGPACK:
            try:
                _obj = _msgpack_ws.unpackb(_buf, raw=False, strict_map_key=False)
                return _obj
            except Exception:
                pass
        # 2) Пробуем чистый JSON (utf-8)
        try:
            _txt = _buf.decode('utf-8', errors='ignore')
            if _txt and (_txt[0] in '[{' or _txt.startswith('"')):
                return _json_ws.loads(_txt)
        except Exception:
            pass
        # 3) Пробуем gzip-JSON
        try:
            _unzipped = _gzip_ws.decompress(_buf)
            return _json_ws.loads(_unzipped.decode('utf-8'))
        except Exception:
            pass
        # 4) Пробуем zlib (raw deflate)
        try:
            _unzipped = _zlib_ws.decompress(_buf)
            return _json_ws.loads(_unzipped.decode('utf-8'))
        except Exception:
            pass
        return None

    # Список регионов РО для подключения (попробуем по очереди если первый недоступен)
    _ws_urls = [
        "wss://api-eu.po.market/socket.io/?EIO=4&transport=websocket",
        "wss://demo-api-eu.po.market/socket.io/?EIO=4&transport=websocket",
        "wss://api-l.po.market/socket.io/?EIO=4&transport=websocket",
        "wss://api-asia.po.market/socket.io/?EIO=4&transport=websocket",
    ]

    _stream_state = {'ticks': 0, 'first_logged': False, 'reconnects': 0}

    def _update_price(_price):
        """Обновляем буфер новой ценой."""
        if _price is None or _price <= 0.0001:
            return
        _now_s = _t_ws.time()
        _bucket_s = int(_now_s // EXPIRY_SEC) * EXPIRY_SEC
        if buf.live is None or buf.live_bucket is None:
            buf.live_bucket = _bucket_s
            buf.live = (_price, _price, _price, _price)
            _utc_t = datetime.utcfromtimestamp(_bucket_s).strftime('%H:%M:%S')
            print(f"[WS] 🆕 ПЕРВЫЙ ТИК {_utc_t} UTC | price={_price:.5f}")
        elif _bucket_s == buf.live_bucket:
            _o, _h, _l, _c = buf.live
            buf.live = (_o, max(_h, _price), min(_l, _price), _price)
        else:
            buf.live_bucket = _bucket_s
            buf.live = (_price, _price, _price, _price)
        buf.last_price = _price
        buf.last_update = _now_s
        _stream_state['ticks'] += 1
        if not _stream_state['first_logged']:
            _stream_state['first_logged'] = True
            print(f"[WS] ✅ ПЕРВАЯ ЦЕНА ИЗ СТРИМА: {_price:.5f}")
        if _stream_state['ticks'] % 50 == 0:
            print(f"[WS] 💓 живой поток | тиков: {_stream_state['ticks']} | цена: {_price:.5f}")

    async def _connect_one(_url):
        """Одна попытка подключения и работы."""
        print(f"[WS] 🔌 Подключаюсь: {_url}")
        # Socket.IO требует Origin header — иначе РО рубит соединение
        _headers = [
            ("Origin", "https://pocketoption.com"),
            ("Cache-Control", "no-cache"),
            ("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"),
        ]
        # Совместимость: новые версии websockets используют additional_headers, старые — extra_headers
        _ws_kwargs = {'ping_interval': 20, 'ping_timeout': 20, 'max_size': 10_000_000}
        import inspect as _inspect_ws
        try:
            _conn_sig = _inspect_ws.signature(websockets.connect)
            _hdr_param = 'additional_headers' if 'additional_headers' in _conn_sig.parameters else 'extra_headers'
        except Exception:
            _hdr_param = 'extra_headers'
        _ws_kwargs[_hdr_param] = _headers
        # 🔬 Диагностика SSID
        _ssid_preview = (SESSION_ID[:60] + "...") if len(SESSION_ID) > 60 else SESSION_ID
        _ssid_len = len(SESSION_ID)
        print(f"[WS] 🔬 SSID длина={_ssid_len} начало={_ssid_preview}")

        async with websockets.connect(_url, **_ws_kwargs) as _ws:
            print(f"[WS] ✅ Соединение установлено — жду пакеты от сервера")
            _auth_sent = False
            _subscribed = False
            _last_msg_ts = _t_ws.time()
            _all_pkts_logged = 0  # счётчик залогированных пакетов для диагностики
            _pending_event_name = None  # имя event'а из 451-[...] для следующего BINARY пакета
            _binary_logged = 0  # счётчик залогированных распакованных бинарников
            try:
                async for _raw in _ws:
                    _last_msg_ts = _t_ws.time()
                    if not isinstance(_raw, str):
                        # 📦 BINARY-пакет: это данные для предыдущего "451-" event'а
                        _decoded = _decode_binary(_raw)
                        if _decoded is None:
                            if _binary_logged < 3:
                                print(f"[WS] ⚠️ BINARY не распознан ({len(_raw)} байт) | первые байты: {_raw[:50]!r}")
                            continue
                        _evt = _pending_event_name or '?'
                        if _binary_logged < 5:
                            _binary_logged += 1
                            print(f"[WS] 🎁 BINARY[{_evt}] распакован ({len(_raw)}б): {str(_decoded)[:300]}")
                        # 💰 Извлекаем цену из распакованных данных
                        if _evt in ('updateStream', 'updateHistoryNewFast', 'updateHistoryNew', 'loadHistoryPeriod'):
                            # Формат updateStream: [[asset, ts, price], ...] или {asset: [[ts, price], ...]}
                            _items = _decoded if isinstance(_decoded, list) else None
                            if _items:
                                for _it in _items:
                                    if isinstance(_it, list) and len(_it) >= 3:
                                        _it_asset = str(_it[0]) if _it[0] else ''
                                        if not _it_asset or _it_asset.lower() == _stream_asset.lower():
                                            try:
                                                _update_price(float(_it[2]))
                                            except (TypeError, ValueError):
                                                pass
                                    elif isinstance(_it, dict):
                                        _it_asset = str(_it.get('asset') or _it.get('symbol') or '')
                                        if not _it_asset or _it_asset.lower() == _stream_asset.lower():
                                            _p = _it.get('price') or _it.get('close') or _it.get('value') or _it.get('c')
                                            if _p is not None:
                                                try:
                                                    _update_price(float(_p))
                                                except (TypeError, ValueError):
                                                    pass
                            elif isinstance(_decoded, dict):
                                # Иногда РО шлёт {asset: {candles: [[ts, o, h, l, c], ...]}}
                                for _k, _v in _decoded.items():
                                    if str(_k).lower() == _stream_asset.lower() and isinstance(_v, dict):
                                        _candles = _v.get('candles') or _v.get('history') or []
                                        if _candles and isinstance(_candles[-1], list) and len(_candles[-1]) >= 5:
                                            try:
                                                _update_price(float(_candles[-1][4]))  # close последней свечи
                                            except (TypeError, ValueError):
                                                pass
                        _pending_event_name = None
                        continue
                    # 🔬 ПЕЧАТАЕМ ПЕРВЫЕ 20 ВХОДЯЩИХ ПАКЕТОВ ЦЕЛИКОМ для диагностики
                    if _all_pkts_logged < 20:
                        _all_pkts_logged += 1
                        print(f"[WS] 📥 RECV #{_all_pkts_logged}: {_raw[:300]}")
                    # Socket.IO протокол: первая цифра = тип пакета
                    # 0 = connect, 2 = ping, 3 = pong, 40 = connect_ok, 42 = event, 4{N} = engine.io
                    if _raw.startswith("0"):
                        # engine.io OPEN — шлём в ответ "40" чтобы открыть socket.io
                        await _ws.send("40")
                        print(f"[WS] ↗ SEND: 40 (engine.io upgrade)")
                        continue
                    if _raw == "2":
                        # ping — отвечаем pong
                        await _ws.send("3")
                        continue
                    if _raw.startswith("40"):
                        # socket.io connected — пора авторизоваться
                        if not _auth_sent:
                            # ВАЖНО: РО ждёт SSID-строку как уже готовый payload (не как dict)
                            # Сам SSID — это строка вида '42["auth",{...}]' или JSON-объект
                            # Если SESSION_ID начинается с '42[' — отправляем как есть, иначе оборачиваем
                            _ssid_stripped = SESSION_ID.strip()
                            if _ssid_stripped.startswith("42[") or _ssid_stripped.startswith('["auth"'):
                                # Уже готовая socket.io команда — отправляем как есть
                                _to_send = _ssid_stripped if _ssid_stripped.startswith("42") else "42" + _ssid_stripped
                                await _ws.send(_to_send)
                                print(f"[WS] 🔑 Отправил готовый SSID-payload (len={len(_to_send)})")
                            else:
                                # Сырая строка — оборачиваем в auth event
                                _auth_payload = ["auth", {"session": SESSION_ID, "isDemo": 1 if IS_DEMO else 0, "uid": 0, "platform": 1}]
                                await _ws.send("42" + _json_ws.dumps(_auth_payload))
                                print(f"[WS] 🔑 Отправил auth-обёртку (demo={IS_DEMO})")
                            _auth_sent = True
                        continue
                    # BINARY EVENT (Socket.IO v3+): 45N-[имя,placeholder]
                    # N = кол-во binary attachments, далее идут BINARY-пакеты с данными
                    if _raw.startswith("45") and "-" in _raw[:8]:
                        try:
                            _dash_pos = _raw.index("-")
                            _payload_str = _raw[_dash_pos+1:]
                            _data = _json_ws.loads(_payload_str)
                            if isinstance(_data, list) and len(_data) >= 1:
                                _pending_event_name = _data[0]
                                # Подписываемся при первом успешном event'е
                                if _pending_event_name in ("successauth", "successupdateBalance", "balance") and not _subscribed:
                                    _sub_payload = ["subfor", _stream_asset]
                                    await _ws.send("42" + _json_ws.dumps(_sub_payload))
                                    _sub2 = ["changeSymbol", {"asset": _stream_asset, "period": 60}]
                                    await _ws.send("42" + _json_ws.dumps(_sub2))
                                    _subscribed = True
                                    print(f"[WS] 📡 Подписался на {_stream_asset} (после event '{_pending_event_name}')")
                        except Exception as _be:
                            print(f"[WS] ⚠️ Не смог распарсить 45-header: {_be} | {_raw[:100]}")
                        continue
                    if _raw.startswith("42"):
                        # event payload
                        try:
                            _data = _json_ws.loads(_raw[2:])
                        except Exception:
                            continue
                        if not isinstance(_data, list) or len(_data) < 2:
                            continue
                        _evt_name = _data[0]
                        _evt_data = _data[1]
                        # После авторизации подписываемся на актив
                        if _evt_name in ("successauth", "successupdateBalance", "balance") and not _subscribed:
                            # Шлём subscribe на наш актив
                            _sub_payload = ["subfor", _stream_asset]
                            await _ws.send("42" + _json_ws.dumps(_sub_payload))
                            # Альтернативные имена подписок
                            _sub2 = ["changeSymbol", {"asset": _stream_asset, "period": 60}]
                            await _ws.send("42" + _json_ws.dumps(_sub2))
                            _subscribed = True
                            print(f"[WS] 📡 Подписался на {_stream_asset}")
                        # Обработка тиков по разным возможным именам
                        if _evt_name in ("updateStream", "stream-update", "tick", "price-update", "loadHistoryPeriod"):
                            # Формат updateStream: [["EURUSD_otc", timestamp, price], ...]
                            _items = _evt_data if isinstance(_evt_data, list) else [_evt_data]
                            for _it in _items:
                                if isinstance(_it, list) and len(_it) >= 3:
                                    _it_asset = str(_it[0]) if _it[0] else ''
                                    if _it_asset.lower() == _stream_asset.lower():
                                        try:
                                            _update_price(float(_it[2]))
                                        except (TypeError, ValueError):
                                            pass
                                elif isinstance(_it, dict):
                                    _it_asset = str(_it.get('asset') or _it.get('symbol') or '')
                                    if not _it_asset or _it_asset.lower() == _stream_asset.lower():
                                        _p = _it.get('price') or _it.get('close') or _it.get('value')
                                        if _p is not None:
                                            try:
                                                _update_price(float(_p))
                                            except (TypeError, ValueError):
                                                pass
                        # Логируем неизвестные event-имена (первые 5)
                        elif _stream_state['ticks'] == 0 and _evt_name not in ('successauth', 'successupdateBalance', 'balance'):
                            print(f"[WS] 📨 event='{_evt_name}' data={str(_evt_data)[:150]}")
            except Exception as _le:
                # Ловим ConnectionClosed и др. — печатаем причину
                _ec = getattr(_le, 'code', None)
                _er = getattr(_le, 'reason', None) or getattr(_le, 'rcvd_then_sent', None)
                print(f"[WS] 🔻 Соединение закрыто: type={type(_le).__name__} code={_ec} reason={_er} | сообщение: {str(_le)[:200]}")
                raise

    # Главный цикл — переподключение с экспоненциальным бэкоффом (МИН 5 СЕК между попытками)
    _url_idx = 0
    while True:
        _url = _ws_urls[_url_idx % len(_ws_urls)]
        try:
            await _connect_one(_url)
            # Если _connect_one вышел БЕЗ исключения — значит сервер тихо закрыл сокет, ждём 5с
            print(f"[WS] ⚠️ Сокет закрылся без ошибки — переподключение через 10с")
            await asyncio.sleep(10)
        except Exception as _we:
            _stream_state['reconnects'] += 1
            # Минимум 5с, максимум 60с — НЕ спамим РО каждую секунду
            _wait = max(5, min(60, 2 ** min(_stream_state['reconnects'], 6)))
            print(f"[WS] ❌ Соединение упало ({type(_we).__name__}): {str(_we)[:200]} | след.попытка через {_wait}с (всего {_stream_state['reconnects']})")
            _url_idx += 1
            await asyncio.sleep(_wait)


async def place_trade(client, direction, amount):
    try:
        dir_val = OrderDirection.CALL if direction == "CALL" else OrderDirection.PUT
        _raw = await client.place_order(asset=ASSET, amount=amount, direction=dir_val, duration=EXPIRY_SEC)
        print(f"[ORDER_RAW] type={type(_raw).__name__} val={str(_raw)[:300]}", flush=True)
        if hasattr(_raw, '__dict__'):
            print(f"[ORDER_DICT] {_raw.__dict__}", flush=True)
        open_price = 0.0
        if isinstance(_raw, (list, tuple)):
            _oid = _raw[0]
            for _item in _raw[1:]:
                try:
                    _v = float(_item)
                    if _v > 1.0:
                        open_price = _v
                        break
                except (TypeError, ValueError):
                    pass
        elif isinstance(_raw, dict):
            _oid = _raw.get('id') or _raw.get('order_id')
            for _k in ('open_price', 'openPrice', 'open', 'price', 'strike'):
                if _raw.get(_k):
                    open_price = float(_raw[_k])
                    break
        else:
            _oid = getattr(_raw, 'order_id', None)
            for _attr in ('open_price', 'openPrice', 'open', 'price', 'strike'):
                _v = getattr(_raw, _attr, None)
                if _v:
                    try:
                        open_price = float(_v)
                        break
                    except (TypeError, ValueError):
                        pass
        print(f"[TRADE] {direction} | {amount} | {EXPIRY_SEC//60} мин | ID: {_oid} | Цена: {open_price}", flush=True)
        return _oid, open_price
    except Exception as e:
        print(f"[ERROR] place_trade: {e}")
        return None, 0.0

async def check_result(client, order_id, balance_before, bet, wait_sec=None):
    _wait = wait_sec if wait_sec is not None else EXPIRY_SEC
    _payout = globals().get("PAYOUT", 0.92)
    # УМНЫЙ ПОЛЛИНГ: спим до экспирации - 3с, потом часто спрашиваем "сделка закрыта?"
    _sleep_before_poll = max(0, _wait - 3)
    print(f"[WAIT] Ожидаем результат ~{round(_wait/60, 1)} мин (ранний поллинг за 3с до экспирации)...")
    if _sleep_before_poll > 0:
        await asyncio.sleep(_sleep_before_poll)
    # Поллинг: до 30 секунд после расчётной экспирации, по 1 разу в секунду
    _poll_started = __import__("time").time()
    _poll_max = 30 + 5  # 35с запас на закрытие сделки в API
    try:
        _attempt = 0
        while __import__("time").time() - _poll_started < _poll_max:
            _attempt += 1
            try:
                deal = await client.get_deal(order_id)
                if deal is None:
                    await asyncio.sleep(1)
                    continue
                profit_raw = getattr(deal, 'profit', None) or getattr(deal, 'win', None) or getattr(deal, 'result', None)
                if profit_raw is None and hasattr(deal, '__dict__'):
                    profit_raw = deal.__dict__.get('profit') or deal.__dict__.get('win') or deal.__dict__.get('result')
                if profit_raw is None:
                    await asyncio.sleep(1)
                    continue
                # Проверяем что сделка реально закрыта (некоторые API возвращают profit=0 пока сделка ACTIVE)
                _status = getattr(deal, 'status', None) or (deal.__dict__.get('status') if hasattr(deal, '__dict__') else None)
                _status_str = str(_status).lower() if _status is not None else ''
                if 'active' in _status_str or 'open' in _status_str or 'pending' in _status_str:
                    await asyncio.sleep(1)
                    continue
                profit_val = float(profit_raw)
                won = profit_val > 0
                profit = round(bet * _payout, 2) if won else round(-bet, 2)
                _elapsed = __import__("time").time() - _poll_started
                print(f"[RESULT] {'ВЫИГРЫШ ✅' if won else 'ПРОИГРЫШ ❌'} | Профит: {profit} | Получено за {_elapsed:.1f}с поллинга (попытка #{_attempt})")
                return won, profit
            except Exception as e_inner:
                await asyncio.sleep(1)
                continue
        print(f"[WARN] get_deal таймаут — fallback по балансу")
        balance_after, _ = await get_balance(client)
        diff = round(balance_after - balance_before, 2)
        won = diff > 0
        profit = round(bet * _payout, 2) if won else round(-bet, 2)
        print(f"[WARN] Fallback: {'ВЫИГРЫШ ✅' if won else 'ПРОИГРЫШ ❌'} | Профит: {profit}")
        return won, profit
    except Exception as e:
        print(f"[ERROR] check_result: {e}")
        return False, round(-bet, 2)

async def get_balance(client):
    try:
        b = await client.get_balance()
        if b is None:
            return 0.0, CURRENCY
        amount = 0.0
        if hasattr(b, "balance") and b.balance is not None:
            amount = float(b.balance)
        elif hasattr(b, "amount") and b.amount is not None:
            amount = float(b.amount)
        elif isinstance(b, (int, float)):
            amount = float(b)
        else:
            try:
                amount = float(b)
            except:
                pass
        currency = getattr(b, "currency", None) or (b.get("currency") if isinstance(b, dict) else None) or CURRENCY
        return amount, currency
    except:
        return 0.0, CURRENCY

async def hedge_monitor(client, original_direction, original_bet, entry_price, expiry_sec):
    """Хеджирование при уходе цены против позиции."""
    if not ${cfg.hedgeEnabled ? "True" : "False"}:
        return None, 0.0, 0, 0.0
    # 🛡 ЕСЛИ ВКЛЮЧЁН КАСКАДНЫЙ ХЕДЖ — старый ATR-хедж НЕ запускается (чтобы не дублировать страховку)
    if ${cfg.hedgeCascadeEnabled ? "True" : "False"}:
        print(f"[HEDGE] ⏭ ATR-хедж пропущен — активен каскадный хедж (3 уровня)")
        return None, 0.0, 0, 0.0
    _pip_map = {
        "EURUSD": 8, "GBPUSD": 10, "USDJPY": 150, "USDCHF": 9, "USDCAD": 9, "AUDUSD": 9, "NZDUSD": 9,
        "EURUSD_otc": 8, "GBPUSD_otc": 10, "USDJPY_otc": 150, "USDCHF_otc": 9, "USDCAD_otc": 9, "AUDUSD_otc": 9, "NZDUSD_otc": 9,
        "GBPJPY": 200, "GBPJPY_otc": 200, "EURJPY": 150, "EURJPY_otc": 150, "EURGBP": 10, "EURGBP_otc": 10,
        "GBPAUD": 18, "GBPAUD_otc": 18, "GBPCAD": 16, "GBPCAD_otc": 16, "GBPCHF": 14, "GBPCHF_otc": 14,
        "AUDCAD_otc": 12, "AUDCHF_otc": 11, "AUDJPY": 140, "AUDJPY_otc": 140, "AUDNZD_otc": 13,
        "CADJPY": 130, "CADJPY_otc": 130, "CADCHF_otc": 10, "CHFJPY": 140, "CHFJPY_otc": 140,
        "NZDJPY": 140, "NZDJPY_otc": 140, "NZDCAD_otc": 12, "NZDCHF_otc": 11, "EURNZD_otc": 14,
        "GBPNZD_otc": 22, "EURCAD_otc": 13, "EURCHF_otc": 11,
        "BTCUSD": 150, "BTCUSD_otc": 150, "ETHUSD": 60, "ETHUSD_otc": 60,
        "LTCUSD_otc": 30, "DOTUSD": 20, "LNKUSD": 15, "BTCGBP": 150, "BTCJPY": 150, "BCHEUR": 40, "DASH_USD": 30,
        "XAUUSD": 25, "XAUUSD_otc": 25, "XAGUSD": 15, "XAGUSD_otc": 15,
        "UKBrent": 12, "UKBrent_otc": 12, "USCrude": 12, "USCrude_otc": 12,
        "XNGUSD": 10, "XNGUSD_otc": 10, "XPTUSD": 20, "XPTUSD_otc": 20, "XPDUSD": 25,
        "SP500": 8, "SP500_otc": 8, "NASUSD": 15, "NASUSD_otc": 15,
        "DJI30": 10, "DJI30_otc": 10, "JPN225": 25, "JPN225_otc": 25,
        "D30EUR": 15, "D30EUR_otc": 15, "F40EUR": 12, "F40EUR_otc": 12,
        "E50EUR": 12, "E50EUR_otc": 12, "AUS200": 12, "AUS200_otc": 12, "100GBP": 12, "100GBP_otc": 12, "CAC40": 12,
        "#AAPL_otc": 20, "#TSLA_otc": 40, "#NVDA_otc": 35, "#AMZN_otc": 25,
        "#MSFT_otc": 20, "#GOOG_otc": 25, "#META_otc": 30, "#NFLX_otc": 40,
        "#GME_otc": 50, "#V_otc": 15, "#XOM_otc": 15, "#MCD_otc": 15, "#INTC_otc": 15, "#BA_otc": 25,
    }
    _pip_size_map = {
        "USDJPY": 0.01, "USDJPY_otc": 0.01, "GBPJPY": 0.01, "GBPJPY_otc": 0.01,
        "EURJPY": 0.01, "EURJPY_otc": 0.01, "AUDJPY_otc": 0.01, "CADJPY_otc": 0.01,
        "CHFJPY_otc": 0.01, "NZDJPY_otc": 0.01, "JPN225": 1.0, "JPN225_otc": 1.0,
        "BTCUSD": 1.0, "BTCUSD_otc": 1.0, "ETHUSD": 1.0, "ETHUSD_otc": 1.0,
        "LTCUSD_otc": 0.1, "DOTUSD": 0.01, "LNKUSD": 0.01, "BTCGBP": 1.0, "BTCJPY": 1.0, "BCHEUR": 0.1, "DASH_USD": 0.1,
        "SP500": 0.1, "SP500_otc": 0.1, "NASUSD": 0.1, "NASUSD_otc": 0.1,
        "DJI30": 1.0, "DJI30_otc": 1.0, "D30EUR": 1.0, "D30EUR_otc": 1.0,
        "F40EUR": 1.0, "F40EUR_otc": 1.0, "E50EUR": 1.0, "AUS200": 0.1, "AUS200_otc": 0.1,
        "100GBP": 0.1, "100GBP_otc": 0.1, "CAC40": 0.1,
        "XAUUSD": 0.1, "XAUUSD_otc": 0.1, "XAGUSD": 0.01, "XAGUSD_otc": 0.01,
        "XPTUSD": 0.1, "XPTUSD_otc": 0.1, "XPDUSD": 0.1,
        "UKBrent": 0.01, "UKBrent_otc": 0.01, "USCrude": 0.01, "USCrude_otc": 0.01, "XNGUSD": 0.001,
        "#AAPL_otc": 0.01, "#TSLA_otc": 0.01, "#NVDA_otc": 0.01, "#AMZN_otc": 0.01,
        "#MSFT_otc": 0.01, "#GOOG_otc": 0.01, "#META_otc": 0.01, "#NFLX_otc": 0.01,
        "#GME_otc": 0.01, "#V_otc": 0.01, "#XOM_otc": 0.01, "#MCD_otc": 0.01, "#INTC_otc": 0.01, "#BA_otc": 0.01,
    }
    _asset_key = (_resolved_asset or ASSET)
    # ===== НОВАЯ ATR-ЛОГИКА ХЕДЖА =====
    # Хедж = встречная (страховая) сделка. Открывается ОДИН РАЗ за исходную сделку.
    # Условия срабатывания (все должны совпасть):
    #   1. Прошло 30%-70% времени экспирации
    #   2. Цена ушла ПРОТИВ исходной позиции
    #   3. Расстояние от входа > HEDGE_ATR_PERCENT % от ATR(14) последних 14 свечей
    #   4. CONFIRM_TICKS подряд цена движется против (защита от шума)
    HEDGE_ATR_PERCENT      = ${cfg.hedgeAtrPercent ?? 70}      # % от ATR — порог "далеко"
    HEDGE_ATR_PERIOD       = 14                                 # период расчёта ATR (фикс., 14 закрытых свечей)
    HEDGE_TIME_MIN         = ${cfg.hedgeTimeMinPercent ?? 30}  # % времени мин (раньше — рано)
    HEDGE_TIME_MAX         = ${cfg.hedgeTimeMaxPercent ?? 70}  # % времени макс (позже — поздно)
    HEDGE_CONFIRM_TICKS    = ${cfg.hedgeConfirmTicks ?? 2}     # кол-во тиков подряд "против"
    HEDGE_MULT             = 1.5                                # фикс. множитель ставки хеджа
    PIP_SIZE               = _pip_size_map.get(_asset_key, 0.0001)
    check_interval         = ${cfg.hedgeCheckInterval}
    print(f"[HEDGE] 🆕 ATR-логика | актив={_asset_key} | ATR%={HEDGE_ATR_PERCENT} | время {HEDGE_TIME_MIN}%-{HEDGE_TIME_MAX}% | подтверждений={HEDGE_CONFIRM_TICKS} | вход={entry_price}")
    opposite = "PUT" if original_direction == "CALL" else "CALL"
    start_time = asyncio.get_event_loop().time()
    _against_streak = 0
    _last_price_check = entry_price

    while True:
        await asyncio.sleep(check_interval)
        elapsed = asyncio.get_event_loop().time() - start_time
        if elapsed >= expiry_sec - check_interval:
            break
        try:
            # Берём 15 свечей: 14 закрытых для ATR + 1 текущая для цены
            _atr_candles = await client.get_candles(asset=(_resolved_asset or ASSET), timeframe=${cfg.candleTimeframe ?? 60}, count=HEDGE_ATR_PERIOD + 1)
            if not _atr_candles or len(_atr_candles) < 2:
                continue
            _hc = _atr_candles[-1]
            if hasattr(_hc, 'close'):
                current_price = float(_hc.close)
            elif isinstance(_hc, dict):
                current_price = float(_hc.get('close', _hc.get('c', 0)))
            else:
                current_price = float(_hc[3] if len(_hc) > 3 else _hc[1])
            if current_price == 0.0:
                continue
            # ===== РАСЧЁТ ATR(14) по закрытым свечам =====
            _closed_for_atr = _atr_candles[:-1] if len(_atr_candles) > HEDGE_ATR_PERIOD else _atr_candles
            _trs = []
            _prev_close = None
            for _ac in _closed_for_atr[-HEDGE_ATR_PERIOD:]:
                if hasattr(_ac, 'high'):
                    _h, _l, _c = float(_ac.high), float(_ac.low), float(_ac.close)
                elif isinstance(_ac, dict):
                    _h = float(_ac.get('high', _ac.get('h', 0)))
                    _l = float(_ac.get('low', _ac.get('l', 0)))
                    _c = float(_ac.get('close', _ac.get('c', 0)))
                else:
                    _h, _l, _c = float(_ac[1]), float(_ac[2]), float(_ac[3])
                if _prev_close is None:
                    _tr = _h - _l
                else:
                    _tr = max(_h - _l, abs(_h - _prev_close), abs(_l - _prev_close))
                _trs.append(_tr)
                _prev_close = _c
            atr = sum(_trs) / len(_trs) if _trs else 0.0
            atr_pips = round(atr / PIP_SIZE, 1) if PIP_SIZE > 0 else 0.0
            distance_abs = abs(current_price - entry_price)
            pips = round(distance_abs / PIP_SIZE, 1) if PIP_SIZE > 0 else 0.0
            atr_threshold = atr * (HEDGE_ATR_PERCENT / 100.0)
            atr_ratio = (distance_abs / atr * 100.0) if atr > 0 else 0.0
            went_against = (original_direction == "CALL" and current_price < entry_price) or \
                           (original_direction == "PUT"  and current_price > entry_price)
            time_ratio = (elapsed / expiry_sec) * 100.0  # в процентах
            # Подтверждение тиками — считаем только если цена СТАБИЛЬНО идёт против
            if went_against:
                # Текущая цена против И продолжила удаляться от _last_price_check (или равна)
                _continued = (original_direction == "CALL" and current_price <= _last_price_check) or \
                             (original_direction == "PUT"  and current_price >= _last_price_check)
                if _continued:
                    _against_streak += 1
                else:
                    _against_streak = 1  # цена против, но шумит — сбрасываем но не до 0
            else:
                _against_streak = 0
            _last_price_check = current_price
            print(f"[HEDGE] t={time_ratio:.0f}% | Δ={pips}пип ({atr_ratio:.0f}% ATR) | ATR={atr_pips}пип | против={went_against} | подтв.={_against_streak}/{HEDGE_CONFIRM_TICKS}")
            # ===== ПРОВЕРКА УСЛОВИЙ =====
            if not went_against:
                continue
            if time_ratio < HEDGE_TIME_MIN:
                continue  # рано
            if time_ratio > HEDGE_TIME_MAX:
                print(f"[HEDGE] ⏰ Время вышло ({time_ratio:.0f}% > {HEDGE_TIME_MAX}%) — хедж отменён")
                break
            if atr <= 0 or distance_abs < atr_threshold:
                continue  # цена не дотянула до порога ATR
            if _against_streak < HEDGE_CONFIRM_TICKS:
                continue  # не подтверждено достаточно тиков
            # Все условия совпали — открываем хедж
            hedge_bet = round(original_bet * HEDGE_MULT, 2)
            mode = "ATR-HEDGE"
            remaining = max(30, int(expiry_sec - elapsed))

            # ===== УМНЫЙ ХЕДЖ: 3 ЛИМИТА, БЕРЁМ МИНИМУМ =====
            _bal_now, _ = await get_balance(client)
            _wanted_hedge = hedge_bet
            _limit_pct = round(_bal_now * (SAFETY_MAX_BET_PCT / 100.0), 2) if _bal_now > 0 else _wanted_hedge
            _reserve_amount = round(_bal_now * (SAFETY_MIN_RESERVE_PCT / 100.0), 2) if SAFETY_MIN_RESERVE_PCT > 0 and _bal_now > 0 else 0.0
            _max_after_reserve = round(_bal_now - _reserve_amount, 2) if _reserve_amount > 0 else _wanted_hedge
            _smart_hedge = round(min(_wanted_hedge, _limit_pct, _max_after_reserve if _max_after_reserve > 0 else _wanted_hedge), 2)
            print(f"[HEDGE] 🧠 Умный расчёт:")
            print(f"[HEDGE]    Хотели:     {_wanted_hedge:.2f} (исходный {mode})")
            print(f"[HEDGE]    Лимит {SAFETY_MAX_BET_PCT}%:  {_limit_pct:.2f} (от баланса {_bal_now:.2f})")
            if SAFETY_MIN_RESERVE_PCT > 0:
                print(f"[HEDGE]    Резерв {SAFETY_MIN_RESERVE_PCT}%: {_reserve_amount:.2f} → можно ставить до {_max_after_reserve:.2f}")
            else:
                print(f"[HEDGE]    Резерв:     ОТКЛ (0%)")
            print(f"[HEDGE]    Итог:       {_smart_hedge:.2f} ✅")
            if _smart_hedge < BASE_BET:
                # Лимит меньше базовой → пробуем поставить базовой ставкой
                if BASE_BET <= _bal_now:
                    print(f"[HEDGE] 🔄 СБРОС ДО БАЗОВОЙ: лимит {_smart_hedge:.2f} < базовая {BASE_BET:.2f}")
                    print(f"[HEDGE]    Ставим хедж базовой суммой: {BASE_BET:.2f}")
                    tg(f"🔄 <b>[HEDGE сброшен к базовой]</b>\\nЛимит: {_smart_hedge:.2f}\\nСтавим: <b>{BASE_BET:.2f}</b>\\nБаланс: {_bal_now:.2f}")
                    _smart_hedge = BASE_BET
                else:
                    print(f"[HEDGE] ⛔ ОТМЕНА — даже базовая {BASE_BET:.2f} > баланс {_bal_now:.2f}")
                    tg(f"⛔ <b>[HEDGE отменён]</b>\\nДаже базовая ставка не лезет\\nБаланс: {_bal_now:.2f} | Базовая: {BASE_BET:.2f}")
                    return None, 0.0, 0, 0.0
            elif _smart_hedge < _wanted_hedge:
                print(f"[HEDGE] ⚠️ Хедж урезан: {_wanted_hedge:.2f} → {_smart_hedge:.2f} (защита баланса)")
                tg(f"⚠️ <b>[HEDGE урезан]</b>\\n{_wanted_hedge:.2f} → <b>{_smart_hedge:.2f}</b>\\nЛимит {SAFETY_MAX_BET_PCT}% или резерв")
            hedge_bet = _smart_hedge

            print(f"[HEDGE] {mode} | {pips} пип | {hedge_bet} | {opposite} | осталось {remaining}с")
            tg(f"🛡 <b>[HEDGE {mode}]</b> {opposite} | {hedge_bet} | {pips} пип | осталось {remaining}с")
            dir_val = OrderDirection.CALL if opposite == "CALL" else OrderDirection.PUT
            # Запоминаем баланс ПЕРЕД открытием хеджа — чтобы fallback правильно посчитал результат именно этой сделки
            balance_before_hedge, _ = await get_balance(client)
            order = await client.place_order(asset=(_resolved_asset or ASSET), amount=hedge_bet, direction=dir_val, duration=remaining)
            print(f"[HEDGE] Открыт ID: {order.order_id} | баланс до хеджа: {balance_before_hedge}")
            return order.order_id, hedge_bet, remaining, balance_before_hedge
        except Exception as e:
            print(f"[HEDGE] Ошибка: {e}")
    return None, 0.0, 0, 0.0

async def cascade_hedge_monitor(client, original_direction, original_bet, entry_price, expiry_sec, started_at):
    """
    🛡 КАСКАДНЫЙ ХЕДЖ — 3 уровня страховки в цикле основной сделки.

    Принцип:
      • Хедж-1 (X)     — открывается СРАЗУ с основной (отдельно, перед запуском этого монитора)
      • Хедж-2 (1.5X)  — открывается ПОСЛЕ 1/2 экспирации, в момент коррекции цены (откат N пипсов от пика)
                         направление: ПРОТИВОПОЛОЖНОЕ основной
      • Хедж-3 (2X)    — открывается при ПЕРВОМ пересечении страйка ценой (в любой момент жизни сделки)
                         направление: СОВПАДАЕТ с основной | срабатывает только 1 раз

    Все хеджи имеют ту же экспирацию что осталась у основной (заканчиваются вместе).

    Возвращает: list[(order_id, bet, level, balance_before)] — открытые хедж-ордера
    """
    opened_hedges = []
    if not ${cfg.hedgeCascadeEnabled ? "True" : "False"}:
        return opened_hedges
    if entry_price <= 0:
        print("[CASCADE] ⛔ entry_price=0 — каскад НЕ запущен")
        return opened_hedges

    M2_MULT       = ${cfg.hedgeCascadeM2 ?? 1.5}
    M3_MULT       = ${cfg.hedgeCascadeM3 ?? 2.0}
    PULLBACK_PIPS = ${cfg.hedgeCascadePullbackPips ?? 3}
    # 🎯 НОВЫЕ ПАРАМЕТРЫ H2:
    MIN_TIME_PCT     = ${cfg.hedgeCascadeMinTimePercent ?? 50} / 100.0  # минимум % экспирации до H2
    MIN_PEAK_PIPS    = ${cfg.hedgeCascadeMinPeakPips ?? 0}              # минимум пип от страйка для триггера
    REQUIRE_PROFIT   = ${cfg.hedgeCascadeRequireProfit ? "True" : "False"}  # H2 только если основная В ПЛЮСЕ
    CHECK_EVERY   = max(1, ${cfg.hedgeCheckInterval} // 2 if ${cfg.hedgeCheckInterval} > 1 else 1)

    _asset_key_c = (_resolved_asset or ASSET)
    _pip_size_map_c = {
        "USDJPY": 0.01, "USDJPY_otc": 0.01,
        "GBPJPY": 0.01, "GBPJPY_otc": 0.01, "EURJPY": 0.01, "EURJPY_otc": 0.01,
        "AUDJPY": 0.01, "AUDJPY_otc": 0.01, "CADJPY": 0.01, "CADJPY_otc": 0.01,
        "CHFJPY": 0.01, "CHFJPY_otc": 0.01, "NZDJPY": 0.01, "NZDJPY_otc": 0.01,
        "BTCUSD": 1.0, "BTCUSD_otc": 1.0, "ETHUSD": 1.0, "ETHUSD_otc": 1.0,
        "XAUUSD": 0.1, "XAUUSD_otc": 0.1, "XAGUSD": 0.01, "XAGUSD_otc": 0.01,
        "SP500": 0.1, "SP500_otc": 0.1, "NASUSD": 0.1, "DJI30": 1.0,
    }
    PIP_SIZE_C = _pip_size_map_c.get(_asset_key_c, 0.0001)

    h2_opened = False
    h3_opened = False
    h2_open_price = None  # 🎯 цена в момент открытия H2 — нужна для логики H3
    peak_abs_distance = 0.0
    peak_price = entry_price
    _iter = 0

    print(f"[CASCADE] 🛡 Старт мониторинга | основная={original_direction} {original_bet} | страйк={entry_price} | pip={PIP_SIZE_C} | откат={PULLBACK_PIPS} пип | проверка каждые {CHECK_EVERY}с")
    try:
        tg(f"🛡 <b>[CASCADE]</b> Мониторинг хедж-2/хедж-3 запущен | страйк {entry_price} | проверка {CHECK_EVERY}с")
    except Exception as _tge:
        print(f"[CASCADE] tg ошибка старта: {_tge}")

    while True:
        await asyncio.sleep(CHECK_EVERY)
        _iter += 1
        try:
            elapsed = asyncio.get_event_loop().time() - started_at
        except Exception:
            elapsed = 0
        remaining = int(expiry_sec - elapsed)
        if remaining <= 5:
            print(f"[CASCADE] ⏱ Конец цикла основной сделки (осталось {remaining}с). Каскад завершён.")
            break

        try:
            current_price = 0.0
            # Сначала пробуем живой буфер (если доступен глобально)
            try:
                if _live_buf and _live_buf.last_price > 0:
                    current_price = float(_live_buf.last_price)
            except NameError:
                pass
            # Fallback на свечи если буфер недоступен
            if current_price <= 0:
                _cands = await client.get_candles(asset=(_resolved_asset or ASSET), timeframe=${cfg.candleTimeframe ?? 60}, count=1)
                if not _cands:
                    continue
                _c = _cands[-1]
                if hasattr(_c, 'close'):
                    current_price = float(_c.close)
                elif isinstance(_c, dict):
                    current_price = float(_c.get('close', _c.get('c', 0)))
                else:
                    current_price = float(_c[3] if len(_c) > 3 else _c[1])
            if current_price <= 0:
                continue
        except Exception as _ce:
            print(f"[CASCADE] Ошибка получения цены: {_ce}")
            continue

        cur_abs_distance = abs(current_price - entry_price)
        if cur_abs_distance > peak_abs_distance:
            peak_abs_distance = cur_abs_distance
            peak_price = current_price

        pips_from_entry = round(cur_abs_distance / PIP_SIZE_C, 1)
        pips_from_peak  = round(abs(peak_price - current_price) / PIP_SIZE_C, 1)
        time_ratio = elapsed / expiry_sec if expiry_sec > 0 else 0

        # PULSE-лог каждые 30 итераций — чтобы видеть что монитор живой
        if _iter % 30 == 0:
            print(f"[CASCADE] 💓 pulse iter={_iter} | цена={current_price} | страйк={entry_price} | откл={pips_from_entry}пип | от пика={pips_from_peak}пип | прошло {round(time_ratio*100)}% | h2={h2_opened} h3={h3_opened}")

        # ХЕДЖ-2 + ХЕДЖ-3: открываются ОДНОВРЕМЕННО на коррекции от пика
        # 🎯 ЛОГИКА H2 (ставим на возврат к страйку):
        #   цена ВЫШЕ страйка → H2 = PUT
        #   цена НИЖЕ страйка → H2 = CALL
        # 🎯 ЛОГИКА H3: ВСЕГДА противоположно H2, открывается ВМЕСТЕ с H2
        if not h2_opened and time_ratio >= MIN_TIME_PCT:
            _peak_pips = round(peak_abs_distance / PIP_SIZE_C, 1)
            _peak_ok   = _peak_pips >= MIN_PEAK_PIPS
            _in_profit = (original_direction == "CALL" and peak_price > entry_price) or \
                         (original_direction == "PUT"  and peak_price < entry_price)
            _profit_ok = (not REQUIRE_PROFIT) or _in_profit
            if peak_abs_distance > 0 and pips_from_peak >= PULLBACK_PIPS and _peak_ok and _profit_ok:
                # H2: правило по позиции цены (выше страйка → PUT, ниже → CALL)
                h2_dir = "PUT" if current_price > entry_price else "CALL"
                # H3: всегда противоположно H2
                h3_dir = "CALL" if h2_dir == "PUT" else "PUT"
                h2_bet = round(original_bet * M2_MULT, 2)
                h3_bet = round(original_bet * M3_MULT, 2)
                _h2_pos = "выше страйка" if current_price > entry_price else "ниже страйка"
                print(f"[CASCADE] 🔄 ХЕДЖ-2+3 ТРИГГЕР: коррекция {pips_from_peak} пип от пика (пик {round(peak_abs_distance/PIP_SIZE_C, 1)} пип)")
                print(f"[CASCADE]    осн={original_direction} | цена={current_price} {_h2_pos} {entry_price}")
                print(f"[CASCADE]    H2={h2_dir} ×{M2_MULT} ({h2_bet}) | H3={h3_dir} ×{M3_MULT} ({h3_bet}) | осталось {remaining}с")

                # --- открываем H2 ---
                try:
                    _bal_h2, _ = await get_balance(client)
                    if M2_MULT <= 0 or h2_bet <= 0:
                        print(f"[CASCADE] 🚫 ХЕДЖ-2 ОТКЛЮЧЁН (множитель={M2_MULT})")
                    elif h2_bet > _bal_h2:
                        print(f"[CASCADE] ⛔ ХЕДЖ-2 отменён: ставка {h2_bet} > баланс {_bal_h2}")
                        tg_info(f"⛔ <b>[CASCADE] Хедж-2 отменён</b>\\nНе хватает баланса: {_bal_h2:.2f} < {h2_bet:.2f}")
                    else:
                        _dv2 = OrderDirection.CALL if h2_dir == "CALL" else OrderDirection.PUT
                        _ord2 = await client.place_order(asset=(_resolved_asset or ASSET), amount=h2_bet, direction=_dv2, duration=remaining)
                        _oid2 = getattr(_ord2, 'order_id', None) if _ord2 else None
                        if _oid2:
                            opened_hedges.append((_oid2, h2_bet, "H2", _bal_h2))
                            h2_open_price = current_price
                            print(f"[CASCADE] ✅ ХЕДЖ-2 открыт ID={_oid2} | цена H2={h2_open_price}")
                            tg(f"🔄 <b>[CASCADE Хедж-2]</b> {h2_dir} | {h2_bet} | коррекция {pips_from_peak} пип | осталось {remaining}с")
                            try:
                                report_log("hedge_open", {
                                    "level": "H2", "order_id": str(_oid2), "direction": h2_dir,
                                    "bet": h2_bet, "multiplier": M2_MULT,
                                    "open_price": h2_open_price, "strike_price": entry_price,
                                    "pips_from_strike": calc_pips_distance(_asset_key_c, entry_price, h2_open_price),
                                    "pct_move_from_strike": calc_pct_move(entry_price, h2_open_price),
                                    "pips_pullback_from_peak": pips_from_peak,
                                    "peak_pips": round(peak_abs_distance / PIP_SIZE_C, 1),
                                    "time_elapsed_pct": round(time_ratio * 100, 1),
                                    "expiry_remaining_sec": remaining,
                                    "balance_before": _bal_h2, "main_direction": original_direction,
                                })
                            except Exception as _rle: print(f"[REPORT] err: {_rle}")
                except Exception as _e2:
                    print(f"[CASCADE] ❌ Ошибка хедж-2: {_e2}")
                h2_opened = True

                # --- открываем H3 ОДНОВРЕМЕННО, противоположно H2 ---
                try:
                    _bal_h3, _ = await get_balance(client)
                    if M3_MULT <= 0 or h3_bet <= 0:
                        print(f"[CASCADE] 🚫 ХЕДЖ-3 ОТКЛЮЧЁН (множитель={M3_MULT})")
                    elif h3_bet > _bal_h3:
                        print(f"[CASCADE] ⛔ ХЕДЖ-3 отменён: ставка {h3_bet} > баланс {_bal_h3}")
                        tg_info(f"⛔ <b>[CASCADE] Хедж-3 отменён</b>\\nНе хватает баланса: {_bal_h3:.2f} < {h3_bet:.2f}")
                    else:
                        _dv3 = OrderDirection.CALL if h3_dir == "CALL" else OrderDirection.PUT
                        _ord3 = await client.place_order(asset=(_resolved_asset or ASSET), amount=h3_bet, direction=_dv3, duration=remaining)
                        _oid3 = getattr(_ord3, 'order_id', None) if _ord3 else None
                        if _oid3:
                            opened_hedges.append((_oid3, h3_bet, "H3", _bal_h3))
                            print(f"[CASCADE] ✅ ХЕДЖ-3 открыт ID={_oid3} | направление {h3_dir} (против H2)")
                            tg(f"🎯 <b>[CASCADE Хедж-3]</b> {h3_dir} | {h3_bet} | вместе с H2, в противоход | осталось {remaining}с")
                            try:
                                report_log("hedge_open", {
                                    "level": "H3", "order_id": str(_oid3), "direction": h3_dir,
                                    "bet": h3_bet, "multiplier": M3_MULT,
                                    "open_price": current_price, "strike_price": entry_price,
                                    "pips_from_strike": calc_pips_distance(_asset_key_c, entry_price, current_price),
                                    "pct_move_from_strike": calc_pct_move(entry_price, current_price),
                                    "pips_pullback_from_peak": pips_from_peak,
                                    "peak_pips": round(peak_abs_distance / PIP_SIZE_C, 1),
                                    "time_elapsed_pct": round(time_ratio * 100, 1),
                                    "expiry_remaining_sec": remaining,
                                    "balance_before": _bal_h3, "main_direction": original_direction,
                                    "paired_with": "H2",
                                })
                            except Exception as _rle: print(f"[REPORT] err: {_rle}")
                except Exception as _e3:
                    print(f"[CASCADE] ❌ Ошибка хедж-3: {_e3}")
                h3_opened = True

        if h2_opened and h3_opened:
            print(f"[CASCADE] ✅ Все уровни каскада отработали. Жду конца основной.")
            break

    print(f"[CASCADE] 🏁 Мониторинг завершён | открыто хеджей: {len(opened_hedges)}")
    return opened_hedges

async def profit_extension_monitor(client, original_direction, original_bet, entry_price, expiry_sec):
    """Расширение прибыли при движении цены в нашу сторону."""
    if not ${cfg.profitExtEnabled ? "True" : "False"}:
        return []
    _pip_map_ext = {
        "EURUSD": 8, "GBPUSD": 10, "USDJPY": 150, "USDCHF": 9, "USDCAD": 9, "AUDUSD": 9, "NZDUSD": 9,
        "EURUSD_otc": 8, "GBPUSD_otc": 10, "USDJPY_otc": 150, "USDCHF_otc": 9, "USDCAD_otc": 9, "AUDUSD_otc": 9, "NZDUSD_otc": 9,
        "GBPJPY": 200, "GBPJPY_otc": 200, "EURJPY": 150, "EURJPY_otc": 150, "EURGBP": 10, "EURGBP_otc": 10,
        "GBPAUD": 18, "GBPAUD_otc": 18, "GBPCAD": 16, "GBPCAD_otc": 16, "AUDCAD_otc": 12, "AUDJPY_otc": 140,
        "CADJPY_otc": 130, "CHFJPY_otc": 140, "NZDJPY_otc": 140, "GBPNZD_otc": 22,
        "BTCUSD": 150, "BTCUSD_otc": 150, "ETHUSD": 60, "ETHUSD_otc": 60,
        "LTCUSD_otc": 30, "DOTUSD": 20, "LNKUSD": 15, "BTCGBP": 150, "DASH_USD": 30,
        "XAUUSD": 25, "XAUUSD_otc": 25, "XAGUSD": 15, "XAGUSD_otc": 15,
        "UKBrent": 12, "UKBrent_otc": 12, "USCrude": 12, "XNGUSD": 10, "XPTUSD": 20,
        "SP500": 8, "SP500_otc": 8, "NASUSD": 15, "NASUSD_otc": 15, "DJI30": 10, "DJI30_otc": 10,
        "JPN225": 25, "JPN225_otc": 25, "D30EUR": 15, "AUS200": 12, "AUS200_otc": 12,
        "#AAPL_otc": 20, "#TSLA_otc": 40, "#NVDA_otc": 35, "#AMZN_otc": 25, "#MSFT_otc": 20,
        "#GOOG_otc": 25, "#META_otc": 30, "#NFLX_otc": 40, "#GME_otc": 50,
    }
    _pip_size_map_ext = {
        "USDJPY": 0.01, "USDJPY_otc": 0.01, "GBPJPY": 0.01, "GBPJPY_otc": 0.01,
        "EURJPY": 0.01, "EURJPY_otc": 0.01, "AUDJPY_otc": 0.01, "CADJPY_otc": 0.01,
        "CHFJPY_otc": 0.01, "NZDJPY_otc": 0.01, "JPN225": 1.0, "JPN225_otc": 1.0,
        "BTCUSD": 1.0, "BTCUSD_otc": 1.0, "ETHUSD": 1.0, "ETHUSD_otc": 1.0,
        "LTCUSD_otc": 0.1, "DOTUSD": 0.01, "LNKUSD": 0.01, "BTCGBP": 1.0, "DASH_USD": 0.1,
        "SP500": 0.1, "SP500_otc": 0.1, "NASUSD": 0.1, "NASUSD_otc": 0.1,
        "DJI30": 1.0, "DJI30_otc": 1.0, "D30EUR": 1.0, "AUS200": 0.1, "AUS200_otc": 0.1,
        "XAUUSD": 0.1, "XAUUSD_otc": 0.1, "XAGUSD": 0.01, "XAGUSD_otc": 0.01,
        "UKBrent": 0.01, "UKBrent_otc": 0.01, "USCrude": 0.01, "XNGUSD": 0.001,
    }
    _asset_key_ext = (_resolved_asset or ASSET)
    EXT_PIPS = _pip_map_ext.get(_asset_key_ext, ${cfg.profitExtPips})
    EXT_MULT = ${cfg.profitExtMultiplier}
    EXT_MODE = "${cfg.profitExtMode}"
    PIP_SIZE = _pip_size_map_ext.get(_asset_key_ext, 0.0001)
    check_interval = ${cfg.profitExtCheckInterval}
    opposite = "PUT" if original_direction == "CALL" else "CALL"
    print(f"[EXT] Инициализация | порог={EXT_PIPS} пип | режим={EXT_MODE} | цена входа={entry_price}")
    start_time = asyncio.get_event_loop().time()
    triggered = False
    orders = []

    while not triggered:
        await asyncio.sleep(check_interval)
        elapsed = asyncio.get_event_loop().time() - start_time
        if elapsed >= expiry_sec - check_interval:
            break
        try:
            candles = await client.get_candles(asset=(_resolved_asset or ASSET), timeframe=${cfg.candleTimeframe ?? 60}, count=1)
            if not candles:
                continue
            _ec = candles[-1]
            if hasattr(_ec, 'close'):
                current_price = float(_ec.close)
            elif isinstance(_ec, dict):
                current_price = float(_ec.get('close', _ec.get('c', 0)))
            else:
                current_price = float(_ec[3] if len(_ec) > 3 else _ec[1])
            if current_price == 0.0:
                continue
            pips = round(abs(current_price - entry_price) / PIP_SIZE, 1)
            in_profit = (original_direction == "CALL" and current_price > entry_price) or \
                        (original_direction == "PUT"  and current_price < entry_price)
            if not in_profit or pips < EXT_PIPS:
                print(f"[EXT] Ждём {EXT_PIPS} пип в нашу сторону (сейчас {pips} пип, {'✅' if in_profit else '❌'})")
                continue
            remaining = max(30, int(expiry_sec - elapsed))
            ext_bet = round(original_bet * EXT_MULT, 2)
            triggered = True
            if EXT_MODE in ("trend", "both"):
                dir_t = OrderDirection.CALL if original_direction == "CALL" else OrderDirection.PUT
                order_t = await client.place_order(asset=(_resolved_asset or ASSET), amount=ext_bet, direction=dir_t, duration=remaining)
                orders.append((order_t.order_id, ext_bet, "TREND", remaining))
                print(f"[EXT] TREND {original_direction} | {ext_bet} | {pips} пип | осталось {remaining}с")
                tg(f"📈 <b>[EXT TREND]</b> {original_direction} | {ext_bet} | {pips} пип | осталось {remaining}с")
            if EXT_MODE in ("rebound", "both"):
                dir_r = OrderDirection.CALL if opposite == "CALL" else OrderDirection.PUT
                order_r = await client.place_order(asset=(_resolved_asset or ASSET), amount=ext_bet, direction=dir_r, duration=remaining)
                orders.append((order_r.order_id, ext_bet, "REBOUND", remaining))
                print(f"[EXT] REBOUND {opposite} | {ext_bet} | {pips} пип | осталось {remaining}с")
                tg(f"🔄 <b>[EXT REBOUND]</b> {opposite} | {ext_bet} | {pips} пип | осталось {remaining}с")
        except Exception as e:
            print(f"[EXT] Ошибка: {e}")
    return orders

def print_stats():
    wins  = sum(1 for t in trade_log if t["won"])
    total = len(trade_log)
    wr    = (wins / total * 100) if total else 0
    # Считаем сколько раз хедж/ext "спасли" сделку (основная проиграла, но итог +)
    saved_by_hedge = sum(1 for t in trade_log if t.get("main_won") is False and t["won"])
    main_wins = sum(1 for t in trade_log if t.get("main_won"))
    print(f"[STATS] {wins}/{total} | WR: {wr:.1f}% | Сессия: {total_profit:.2f} {CURRENCY}")
    if saved_by_hedge > 0:
        print(f"[STATS] 🛡️ Спасено хеджем: {saved_by_hedge} | Чистых WIN основной: {main_wins}")
    print(f"[STATS] По тренду: {calls_follow} ставок | Против/комбо: {calls_reverse} ставок")

async def main():
    global total_profit, trades_today, current_bet, calls_follow, calls_reverse
    global hedge_count, hedge_wins, ext_count, ext_wins, cur_streak
    calls_follow  = 0
    calls_reverse = 0
    hedge_count = 0; hedge_wins = 0; ext_count = 0; ext_wins = 0
    cur_streak = 0

    client = AsyncPocketOptionClient(SESSION_ID, is_demo=IS_DEMO, enable_logging=False)
    await client.connect()
    for i in range(15):
        await asyncio.sleep(2)
        try:
            balance, currency = await get_balance(client)
            if balance > 0:
                break
        except Exception:
            pass
        print(f"[WAIT] Ожидание соединения... ({i+1}/15)")
    else:
        print("[ERROR] Не удалось подключиться за 30 сек. Проверь SESSION_ID.")
        return

    account_type = "🟡 ДЕМО-СЧЁТ" if IS_DEMO else "🔴 РЕАЛЬНЫЙ СЧЁТ"

    print("=" * 55)
    print("  КОМБО-Бот: ${labels}")
    print(f"  Счёт: {account_type}")
    print("  Логика: ${cfg.comboLogic} — ${logicWord}")
    print(f"  Актив: {ASSET} | Экспирация: {EXPIRY_SEC//60} мин | Баланс: {balance:.2f} {CURRENCY}")
    print(f"  TP: {TAKE_PROFIT} {CURRENCY} | SL: {STOP_LOSS} {CURRENCY} | Лимит: {DAILY_LIMIT}")
    print(f"  Пейаут: {int(PAYOUT * 100)}%")
    trend_mode_label = "🟢🟢/🔴🔴 Одинаковые" if TREND_MODE == "same" else "🔴🟢/🟢🔴 Разворот"
    print(f"  Режим тренда: {trend_mode_label}")
    print("=" * 55 + "\\n")
    tg(
        f"🤖 <b>{BOT_NAME} запущен</b>\\n"
        f"━━━━━━━━━━━━━━━━━━━━\\n"
        f"📋 <b>Параметры сессии</b>\\n"
        f"  Счёт: {account_type}\\n"
        f"  Стратегия: <b>${labels}</b>\\n"
        f"  Логика: <b>${cfg.comboLogic}</b>\\n"
        f"  Начальный баланс: <b>{balance:.2f} {CURRENCY}</b>\\n"
        f"  Take Profit: <b>+{TAKE_PROFIT} {CURRENCY}</b>\\n"
        f"  Stop Loss: <b>-{STOP_LOSS} {CURRENCY}</b>\\n"
        f"━━━━━━━━━━━━━━━━━━━━\\n"
        f"📊 <b>Актив</b>\\n"
        f"  Инструмент: <b>{ASSET}</b>\\n"
        f"  Экспирация: <b>{EXPIRY_SEC//60} мин</b>\\n"
        f"  Начальная ставка: <b>{BASE_BET} {CURRENCY}</b>\\n"
        f"━━━━━━━━━━━━━━━━━━━━\\n"
        f"🎮 <b>Команды управления:</b>\\n"
        f"  /stop {BOT_NAME}\\n"
        f"  /pause {BOT_NAME}\\n"
        f"  /resume {BOT_NAME}\\n"
        f"  /status {BOT_NAME}\\n"
        f"  /settp {BOT_NAME} 50 | /setsl {BOT_NAME} 20\\n"
        f"  <i>all вместо имени — управлять всеми</i>\\n"
        f"━━━━━━━━━━━━━━━━━━━━\\n"
        f"🛡 <b>Активные защиты:</b>\\n"
        f"  ✅ Анти-рассинхрон API (пауза при устаревших свечах)\\n"
        f"  ✅ Часовой пояс МСК (UTC+3) в логах\\n"
        f"  {('✅ Каскадный хедж 3 уровней (×' + str(${cfg.hedgeCascadeM1 ?? 1.5}) + '/×' + str(${cfg.hedgeCascadeM2 ?? 1.5}) + '/×' + str(${cfg.hedgeCascadeM3 ?? 2.0}) + ')') if ${cfg.hedgeCascadeEnabled ? "True" : "False"} else '⚠️ Каскадный хедж ВЫКЛЮЧЕН (вкл в настройках)'}\\n"
        f"━━━━━━━━━━━━━━━━━━━━\\n"
        f"⏳ Ожидаю сигналы..."
    )

    # ===== 🛡 ЖИРНЫЙ СТАРТОВЫЙ ЛОГ ПРО КАСКАД (видно сразу при запуске) =====
    _cascade_state_log = ${cfg.hedgeCascadeEnabled ? "True" : "False"}
    print("=" * 60)
    if _cascade_state_log:
        print(f"  🛡 КАСКАДНЫЙ ХЕДЖ: ✅ ВКЛЮЧЁН")
        print(f"     Хедж-1 (сразу, против): ×{${cfg.hedgeCascadeM1 ?? 1.5}}")
        print(f"     Хедж-2 (после 1/2 экспир., против): ×{${cfg.hedgeCascadeM2 ?? 1.5}}")
        print(f"     Хедж-3 (по основной, при пересеч. страйка): ×{${cfg.hedgeCascadeM3 ?? 2.0}}")
        print(f"     Откат от пика: {${cfg.hedgeCascadePullbackPips ?? 3}} пип")
        print(f"     Проверка цены: каждые {${cfg.hedgeCheckInterval ?? 2}} сек")
        _max_sum = 1 + ${cfg.hedgeCascadeM1 ?? 1.5} + ${cfg.hedgeCascadeM2 ?? 1.5} + ${cfg.hedgeCascadeM3 ?? 2.0}
        print(f"     Макс. сумма на сигнал: {_max_sum:.1f}X (т.е. {round(BASE_BET * _max_sum, 2)} {CURRENCY})")
    else:
        print(f"  ⚠️ КАСКАДНЫЙ ХЕДЖ: ❌ ВЫКЛЮЧЕН")
        print(f"     Чтобы включить: открой настройки бота → раздел")
        print(f"     '🛡 Каскадный хедж (3 уровня)' → переключи тумблер.")
        print(f"     Без него страховка хедж-1/хедж-2/хедж-3 НЕ запустится.")
    print("=" * 60)

    # ===== ФАЗА РАЗОГРЕВА ПОЛНОСТЬЮ УБРАНА =====
    # ✅ НОВАЯ ЛОГИКА: бот НЕ дёргает API-историю на старте.
    # Свечи строятся из живых тиков в CandleBuffer.tick().
    # Готовность к торговле определяется в живом буфере (минимум 2 свои свечи).
    _tf_sec_for_msg = max(60, EXPIRY_SEC)
    _wait_min = max(2, ${cfg.warmupCandles ?? 2}) * (_tf_sec_for_msg // 60)
    print(f"[STARTUP] ✅ Разогрев пропущен — свечи будут собраны из живых тиков в реальном времени")
    print(f"[STARTUP] ⏱ Первая сделка через ~{_wait_min} мин (нужно увидеть 2 свечи по {_tf_sec_for_msg//60}м)")
    tg_info(f"🚀 <b>[{BOT_NAME}] Старт</b>\\nСобираю свечи из живых тиков (без устаревшей истории API)\\n⏱ Первая сделка через ~{_wait_min} мин")

    # ===== ЗАПУСК ЖИВОГО БУФЕРА СВЕЧЕЙ =====
    # ✅ НОВАЯ ЛОГИКА: бот стартует с ПУСТОГО буфера и САМ строит свечи из тиков цены.
    # Никаких warmup_collected, никакой истории с API — только то, что увидим САМИ.
    _live_buf = CandleBuffer()
    await _live_buf.warmup(client)  # просто печатает заглавный лог и ставит ready=True
    _buf_task = asyncio.create_task(buffer_updater(_live_buf, client))
    # 🚀 LIVE STREAM: подписка на тики через WebSocket (мгновенные обновления цены)
    _stream_task = asyncio.create_task(live_stream_subscriber(_live_buf, client))
    print(f"[BUFFER] 🚀 Живой буфер запущен (опрос каждые {LIVE_TICK_INTERVAL}с, размер {LIVE_BUFFER_SIZE} свечей)")
    tg_info(f"🚀 <b>[{BOT_NAME}] Живой буфер</b>\\nОпрос цены каждые {LIVE_TICK_INTERVAL}с | буфер {LIVE_BUFFER_SIZE} свечей\\nРешения принимаются мгновенно")

    # ===== ОЖИДАНИЕ СИЛЬНОГО ТРЕНДА ДЛЯ ПЕРВОЙ СДЕЛКИ =====
    REQUIRE_STRONG_TREND = ${cfg.requireStrongTrendOnStart ? "True" : "False"}
    STRONG_TREND_CANDLES = ${cfg.strongTrendCandles ?? 3}
    # Жёсткий таймаут поиска сильного тренда: STRONG_TREND_CANDLES * 60 сек * 5 циклов = до ~15 минут максимум
    STRONG_TREND_MAX_WAIT_SEC = STRONG_TREND_CANDLES * 60 * 5
    _strong_trend_wait_start = None
    _first_trade_done = False
    if REQUIRE_STRONG_TREND:
        print(f"[STRONG_TREND] 🎯 Жду сильный тренд для первой сделки: {STRONG_TREND_CANDLES} свечей одного цвета подряд (макс {STRONG_TREND_MAX_WAIT_SEC//60} мин)")
        tg_info(f"🎯 <b>[{BOT_NAME}] Ищу сильный тренд</b>\\nЖду {STRONG_TREND_CANDLES} свечей одного цвета подряд для первой сделки")

    last_lost_signal = None
    while True:
        if total_profit >= TAKE_PROFIT:
            print(f"[TP] +{total_profit:.2f} {CURRENCY}")
            _w = sum(1 for t in trade_log if t["won"]); _l = trades_today - _w; _wr = round(_w/trades_today*100,1) if trades_today else 0
            tg(
                f"✅ <b>Take Profit достигнут!</b>\\n"
                f"━━━━━━━━━━━━━━━━━━━━\\n"
                f"💰 <b>Итог сессии</b>\\n"
                f"  Профит: <b>+{total_profit:.2f} {CURRENCY}</b>\\n"
                f"  Баланс: <b>{balance_before + total_profit:.2f} {CURRENCY}</b>\\n"
                f"━━━━━━━━━━━━━━━━━━━━\\n"
                f"📊 <b>Статистика</b>\\n"
                f"  Сделок: {trades_today} (✅ {_w} / ❌ {_l})\\n"
                f"  Винрейт: <b>{_wr}%</b>\\n"
                f"━━━━━━━━━━━━━━━━━━━━"
            )
            if AUTO_RESTART:
                total_profit = 0; trades_today = 0; calls_follow = 0; calls_reverse = 0; await asyncio.sleep(300); continue
            break
        if total_profit <= -STOP_LOSS:
            print(f"[SL] {total_profit:.2f} {CURRENCY}")
            _w2 = sum(1 for t in trade_log if t["won"]); _l2 = trades_today - _w2; _wr2 = round(_w2/trades_today*100,1) if trades_today else 0
            tg(
                f"🛑 <b>Stop Loss достигнут!</b>\\n"
                f"━━━━━━━━━━━━━━━━━━━━\\n"
                f"💸 <b>Итог сессии</b>\\n"
                f"  Убыток: <b>{total_profit:.2f} {CURRENCY}</b>\\n"
                f"  Баланс: <b>{balance_before + total_profit:.2f} {CURRENCY}</b>\\n"
                f"━━━━━━━━━━━━━━━━━━━━\\n"
                f"📊 <b>Статистика</b>\\n"
                f"  Сделок: {trades_today} (✅ {_w2} / ❌ {_l2})\\n"
                f"  Винрейт: <b>{_wr2}%</b>\\n"
                f"━━━━━━━━━━━━━━━━━━━━"
            )
            if AUTO_RESTART:
                total_profit = 0; trades_today = 0; calls_follow = 0; calls_reverse = 0; await asyncio.sleep(300); continue
            break
        if trades_today >= DAILY_LIMIT:
            print(f"[LIMIT] Лимит {DAILY_LIMIT} сделок исчерпан")
            _w3 = sum(1 for t in trade_log if t["won"]); _l3 = trades_today - _w3; _wr3 = round(_w3/trades_today*100,1) if trades_today else 0
            tg(
                f"⚠️ <b>Дневной лимит исчерпан</b>\\n"
                f"━━━━━━━━━━━━━━━━━━━━\\n"
                f"💰 <b>Итог сессии</b>\\n"
                f"  Профит: <b>{total_profit:+.2f} {CURRENCY}</b>\\n"
                f"  Баланс: <b>{balance_before + total_profit:.2f} {CURRENCY}</b>\\n"
                f"━━━━━━━━━━━━━━━━━━━━\\n"
                f"📊 <b>Статистика</b>\\n"
                f"  Сделок: {trades_today} / {DAILY_LIMIT} (✅ {_w3} / ❌ {_l3})\\n"
                f"  Винрейт: <b>{_wr3}%</b>\\n"
                f"━━━━━━━━━━━━━━━━━━━━"
            )
            break

        # ⚡ Перевели в отдельный поток — раньше блокировал весь asyncio loop на 5с (timeout urllib),
        # из-за чего buffer_updater стоял и пропускал тики цены.
        await asyncio.to_thread(tg_poll_commands)
        if _tg_stopped:
            print("[TG] Бот остановлен командой из Telegram")
            break
        if _tg_paused:
            print("[TG] Пауза... Ожидаю команду /resume")
            await asyncio.sleep(CHECK_INTERVAL)
            continue

        import time as _time
        global _last_report_time
        if TG_ENABLED and (_time.time() - _last_report_time) >= 3600:
            _wins_r = sum(1 for t in trade_log if t["won"])
            _wr_r   = round(_wins_r / trades_today * 100, 1) if trades_today > 0 else 0
            _hedge_str_r = f"\\n  🛡 Хеджей: {hedge_count} (✅ {hedge_wins} / ❌ {hedge_count - hedge_wins})" if hedge_count > 0 else ""
            _ext_str_r   = f"\\n  📈 Расширений: {ext_count} (✅ {ext_wins} / ❌ {ext_count - ext_wins})" if ext_count > 0 else ""
            _tp_left  = round(TAKE_PROFIT - total_profit, 2)
            _sl_left  = round(STOP_LOSS + total_profit, 2)
            _tp_pct   = round(total_profit / TAKE_PROFIT * 100, 1) if TAKE_PROFIT > 0 else 0
            _sl_pct   = round((STOP_LOSS - abs(min(total_profit, 0))) / STOP_LOSS * 100, 1) if STOP_LOSS > 0 else 100
            _tp_bar   = "█" * int(_tp_pct / 10) + "░" * (10 - int(_tp_pct / 10))
            tg(
                f"⏰ <b>Авто-отчёт [{BOT_NAME}]</b>\\n"
                f"━━━━━━━━━━━━━━━━━━━━\\n"
                f"💰 Профит: <b>{total_profit:+.2f} {CURRENCY}</b>\\n"
                f"📈 Сделок: {trades_today} (✅ {_wins_r} / ❌ {trades_today - _wins_r})\\n"
                f"🎯 Винрейт: <b>{_wr_r}%</b>"
                f"{_hedge_str_r}{_ext_str_r}\\n"
                f"━━━━━━━━━━━━━━━━━━━━\\n"
                f"🎯 До TP: <b>{_tp_left:+.2f} {CURRENCY}</b> ({_tp_pct}%)\\n"
                f"{_tp_bar} {_tp_pct}%\\n"
                f"🛑 До SL: <b>{_sl_left:.2f} {CURRENCY}</b> ({_sl_pct}% запаса)\\n"
                f"━━━━━━━━━━━━━━━━━━━━"
            )
            _last_report_time = _time.time()

        # ===== ЧТЕНИЕ ИЗ ЖИВОГО БУФЕРА =====
        # Буфер обновляется фоновой задачей каждые LIVE_TICK_INTERVAL сек.
        # ✅ НОВАЯ ЛОГИКА: ждём минимум 2 ЗАКРЫТЫХ свечи которые мы УВИДЕЛИ САМИ.
        await asyncio.sleep(1)

        # ===== 🕵️ ШПИОН-ЛОГ: сверка времени и цены с Pocket Option (каждые 5с) =====
        # Помогает понять — отстаёт ли бот от реальной котировки РО.
        # Открой РО рядом и сверь: цена бота vs цена на графике (правый верхний угол).
        import time as _t_spy
        _now_ts_spy = _t_spy.time()
        if not hasattr(_live_buf, '_last_spy_log') or (_now_ts_spy - getattr(_live_buf, '_last_spy_log', 0)) >= 5:
            _live_buf._last_spy_log = _now_ts_spy
            _t_local = datetime.now().astimezone().strftime('%H:%M:%S')
            _t_msk = datetime.now(MSK_TZ).strftime('%H:%M:%S')
            _t_utc = datetime.now(timezone.utc).strftime('%H:%M:%S')
            _diff_label = f"МСК{_msk_diff:+d}" if _msk_diff != 0 else "МСК"
            _price = getattr(_live_buf, 'last_price', 0.0)
            _last_upd = getattr(_live_buf, 'last_update', 0.0)
            _age = _now_ts_spy - _last_upd if _last_upd else -1
            _last_candle = _live_buf.candles[-1] if _live_buf.candles else None
            _live_tuple = _live_buf.live
            _bucket = _live_buf.live_bucket
            _bucket_msk = datetime.fromtimestamp(_bucket, MSK_TZ).strftime('%H:%M:%S') if _bucket else '—'
            print(f"[🕵️ SPY] ───────── сверка с Pocket Option ─────────")
            print(f"[🕵️ SPY] Время: МСК(РО)={_t_msk} | твоё({_diff_label})={_t_local} | UTC={_t_utc}")
            if _age >= 0:
                _age_warn = ' ⚠️ ОТСТАЁТ!' if _age > 2 else ' ✅'
                print(f"[🕵️ SPY] Цена в буфере: {_price:.5f} | возраст: {_age:.1f}с{_age_warn}")
            else:
                print(f"[🕵️ SPY] Цена в буфере: {_price:.5f} | ⏳ ещё нет тиков")
            if _live_tuple:
                _o, _h, _l, _c = _live_tuple
                print(f"[🕵️ SPY] Живая свеча: o={_o:.5f} h={_h:.5f} l={_l:.5f} c={_c:.5f}")
                print(f"[🕵️ SPY] Начало живой свечи: МСК={_bucket_msk}")
            if _last_candle and len(_last_candle) >= 5:
                _lo, _lh, _ll, _lc, _lb = _last_candle[0], _last_candle[1], _last_candle[2], _last_candle[3], _last_candle[4]
                _lcol = '🟢' if _lc >= _lo else '🔴'
                _lb_msk = datetime.fromtimestamp(_lb, MSK_TZ).strftime('%H:%M:%S')
                print(f"[🕵️ SPY] Посл.закр.свеча: {_lcol} o={_lo:.5f} c={_lc:.5f} | МСК={_lb_msk}")
            print(f"[🕵️ SPY] 👉 Открой РО, сверь цену. Норма: возраст<2с, цена±5 пипсов")
            print(f"[🕵️ SPY] ────────────────────────────────────────")

        _MIN_OWN_CANDLES = 2
        if not _live_buf.ready or len(_live_buf.candles) < _MIN_OWN_CANDLES:
            _have = len(_live_buf.candles) if _live_buf.candles else 0
            # Считаем сколько секунд осталось до закрытия текущей живой свечи
            import time as _t_wait
            _now_ts = _t_wait.time()
            _eta_sec = None
            if _live_buf.live_bucket is not None:
                _eta_sec = max(0, int((_live_buf.live_bucket + EXPIRY_SEC) - _now_ts))
            # Прогресс-бар [████░░░░] X/Y
            _filled = _have
            _empty = _MIN_OWN_CANDLES - _have
            _bar = '█' * _filled + '░' * _empty
            if _have == 0 and _eta_sec is None:
                _msg = f"⏳ [BUFFER] [{_bar}] 0/{_MIN_OWN_CANDLES} | жду первый тик цены..."
            elif _eta_sec is not None:
                _eta_m = _eta_sec // 60
                _eta_s = _eta_sec % 60
                _eta_str = f"{_eta_m}м{_eta_s:02d}с" if _eta_m > 0 else f"{_eta_s}с"
                _msg = f"⏳ [BUFFER] [{_bar}] {_have}/{_MIN_OWN_CANDLES} свечей | до закрытия следующей: {_eta_str}"
            else:
                _msg = f"⏳ [BUFFER] [{_bar}] {_have}/{_MIN_OWN_CANDLES} свечей"
            # печатаем не чаще раза в 15с
            if not hasattr(_live_buf, '_last_wait_log') or (_now_ts - getattr(_live_buf, '_last_wait_log', 0)) > 15:
                print(_msg)
                _live_buf._last_wait_log = _now_ts
            await asyncio.sleep(2)
            continue
        if _live_buf.sync_warn:
            print(f"[SYNC_GUARD] ⏸ Пропуск итерации — данные API устарели, жду свежую свечу...")
            global _sync_guard_notified
            try:
                _sync_guard_notified
            except NameError:
                _sync_guard_notified = False
            if not _sync_guard_notified:
                tg_info(f"⚠️ <b>[{BOT_NAME}] Защита от рассинхрона</b>\\n\\n📡 API PocketOption отдаёт устаревшие свечи\\n⏸ Бот приостановил торговлю до восстановления\\n\\n💡 Сделки возобновятся автоматически когда придёт свежая свеча")
                _sync_guard_notified = True
            await asyncio.sleep(5)
            continue
        else:
            try:
                if _sync_guard_notified:
                    tg_info(f"✅ <b>[{BOT_NAME}] Синхронизация восстановлена</b>\\n\\n📡 API снова отдаёт свежие данные\\n▶️ Торговля возобновлена")
                    _sync_guard_notified = False
            except NameError:
                pass
        candles = _live_buf.all_candles()
        prices = _live_buf.prices()
        if not prices:
            await asyncio.sleep(2)
            continue

        # ===== ⚡ FORCE из Telegram (одноразовая подмена 2 закрытых свечей) =====
        global _tg_force_pattern, _tg_force_at
        if _tg_force_pattern and len(candles) >= 3:
            _force_was = _tg_force_pattern
            def _flip_candle(_c, _want_up):
                """Возвращает свечу с правильным направлением (UP/DOWN), сохраняя open и величину движения."""
                if hasattr(_c, 'open') and hasattr(_c, 'close'):
                    _o = float(_c.open); _cl = float(_c.close)
                elif isinstance(_c, dict):
                    _o = float(_c.get('open', _c.get('o', 0))); _cl = float(_c.get('close', _c.get('c', 0)))
                else:
                    _o = float(_c[0]); _cl = float(_c[3])
                _delta = abs(_cl - _o) or 0.00010
                _new_close = _o + _delta if _want_up else _o - _delta
                _new_high = max(_o, _new_close)
                _new_low = min(_o, _new_close)
                if isinstance(_c, tuple):
                    _ts2 = _c[4] if len(_c) >= 5 else 0
                    return (_o, _new_high, _new_low, _new_close, _ts2)
                if isinstance(_c, dict):
                    _nc = dict(_c); _nc['close'] = _new_close; _nc['c'] = _new_close
                    _nc['high'] = _new_high; _nc['h'] = _new_high
                    _nc['low'] = _new_low;  _nc['l'] = _new_low
                    return _nc
                return _c
            _want_2 = _force_was in ("UP_UP", "UP_DOWN")
            _want_1 = _force_was in ("UP_UP", "DOWN_UP")
            try:
                candles = list(candles)
                candles[-3] = _flip_candle(candles[-3], _want_2)
                candles[-2] = _flip_candle(candles[-2], _want_1)
                print(f"[TG_FORCE] ⚡ ПРИМЕНЁН паттерн {_force_was} к 2 закрытым свечам (одноразово)")
                tg_info(f"⚡ <b>[{BOT_NAME}] FORCE применён</b>\\nПаттерн {_force_was} использован, дальше — реальные данные")
            except Exception as _fe:
                print(f"[TG_FORCE] ❌ Ошибка применения: {_fe}")
            _tg_force_pattern = None
            _tg_force_at = 0

        # ✅ ИСПРАВЛЕНО: get_trend вызывается ОДИН раз — переиспользуем результат.
        trend = get_trend(candles)
        global _last_trend
        old_trend = _last_trend
        new_trend = trend if (trend and trend != _last_trend) else None
        _last_trend = trend
        if new_trend:
            arrow = "📈" if new_trend in ("UP_UP", "DOWN_UP") else "📉"
            labels = {"UP_UP": "🟢🟢 Два зелёных", "DOWN_DOWN": "🔴🔴 Два красных", "DOWN_UP": "🔴🟢 Разворот вверх", "UP_DOWN": "🟢🔴 Разворот вниз"}
            msg = f"{arrow} <b>Тренд изменился!</b>\\n{labels.get(old_trend, old_trend or '?')} → {labels.get(new_trend, new_trend)} | {ASSET}"
            print(f"[TREND] {old_trend} → {new_trend}")
            tg_info(msg)

        trend_sig = trend_to_signal(trend)
        signal, signal_info = get_combined_signal(prices, candles)

        # Если комбо молчит но тренд чёткий — торгуем по тренду
        if not signal and trend_sig and TREND_FOLLOW == "follow":
            signal = trend_sig
            signal_info = f"[TREND] {trend} → {trend_sig}"

        # ═══ TRADE BASE FILTERS — фильтры по методике учебника ═══
        # ОПТИМИЗАЦИЯ: пропускаем TB если сигнал и так конфликтует с трендом
        _tb_skip = False
        if signal and TREND_FOLLOW != "combo" and trend_sig and signal != trend_sig:
            _tb_skip = True
        try:
            if 'tb_update_higher_tf' in globals():
                try:
                    await tb_update_higher_tf(client, _resolved_asset or ASSET)
                except Exception:
                    pass
            if 'apply_tradebase_filters' in globals() and signal and not _tb_skip:
                _filtered, _tb_lines = apply_tradebase_filters(signal, prices, candles)
                for _ln in _tb_lines:
                    print(f"[TB-FILTER] {_ln}")
                if _filtered is None and signal is not None:
                    signal_info = (signal_info or "") + " | TB-фильтр отменил: " + " | ".join(_tb_lines)
                    try:
                        rejected_signals += 1
                    except (NameError, UnboundLocalError):
                        pass
                    signal = None
                elif _tb_lines:
                    signal_info = (signal_info or "") + " | TB✓ " + " | ".join(_tb_lines)
        except Exception as _tbe:
            print(f"[TB-FILTER] Ошибка фильтра (пропускаем): {_tbe}")

        if signal:
            if TRADE_DIRECTION == "call_only" and signal != "CALL":
                print(f"[FILTER] Сигнал {signal} пропущен — фильтр: только CALL")
                await asyncio.sleep(2)
                continue
            if TRADE_DIRECTION == "put_only" and signal != "PUT":
                print(f"[FILTER] Сигнал {signal} пропущен — фильтр: только PUT")
                await asyncio.sleep(2)
                continue

        # ===== СВОДНАЯ СТРОКА =====
        ts = datetime.now().strftime("%H:%M:%S")
        _tlbls2 = {"UP_UP": "🟢🟢🟢 Тренд ↑", "DOWN_DOWN": "🔴🔴🔴 Тренд ↓", "DOWN_UP": "🔴🟢 Разворот ↑", "UP_DOWN": "🟢🔴 Разворот ↓"}
        trend_str2 = _tlbls2.get(trend, "— нет паттерна")
        sig_str2 = signal if signal else "нет"
        sig_emoji2 = "📈" if signal == "CALL" else ("📉" if signal == "PUT" else "⏸")
        _bal_now2, _cur_now2 = await get_balance(client)
        _wins_now2 = sum(1 for t in trade_log if t["won"])
        _wr_now2 = f"{_wins_now2/len(trade_log)*100:.0f}%" if trade_log else "—"
        _streak_now2 = (f"🔥{cur_streak}п" if cur_streak > 1 else (f"❄️{abs(cur_streak)}п" if cur_streak < -1 else ("✅1" if cur_streak == 1 else ("❌1" if cur_streak == -1 else "—"))))
        print(f"{'='*55}")
        print(f"[ИТОГ {ts}] Тренд: {trend_str2} | Сигнал: {sig_emoji2} {sig_str2}")
        print(f"[СЧЁТ]     Баланс: {_bal_now2:.2f} {_cur_now2} | WR: {_wr_now2} ({_wins_now2}/{len(trade_log)}) | Серия: {_streak_now2} | Профит сессии: {total_profit:+.2f}")

        if signal:
            labels = {"UP_UP": "🟢🟢", "DOWN_DOWN": "🔴🔴", "DOWN_UP": "🔴🟢", "UP_DOWN": "🟢🔴"}
            if TREND_FOLLOW != "combo":
                if not trend_sig:
                    print(f"[ИТОГ] ❌ ПРОПУСК — тренд {labels.get(trend, trend or '?')} не подходит для режима '{TREND_MODE}'")
                    print(f"{'='*55}")
                    await asyncio.sleep(2)
                    continue
                # ✅ ИСПРАВЛЕНО: проверяем КОНФЛИКТ сигнала и тренда.
                # Раньше signal слепо переписывался на trend_sig — поэтому в логе
                # был "Сигнал: PUT" а торговался "CALL". Теперь конфликтные сигналы пропускаются.
                if signal != trend_sig:
                    print(f"[ИТОГ] ❌ ПРОПУСК — сигнал {signal} КОНФЛИКТУЕТ с трендом {trend_sig} ({labels.get(trend, trend or '?')})")
                    print(f"[ИТОГ]    Стратегия говорит: {signal} | Тренд показывает: {trend_sig} | Не торгую против тренда")
                    print(f"{'='*55}")
                    await asyncio.sleep(2)
                    continue
            print(f"[ИТОГ] ✅ ТОРГУЕМ — {signal} | тренд и сигнал совпадают")
        else:
            print(f"[ИТОГ] ⏸ ОЖИДАНИЕ — нет сигнала")
        print(f"{'='*55}")

        # ===== ПРОВЕРКА СИЛЬНОГО ТРЕНДА ДЛЯ ПЕРВОЙ СДЕЛКИ =====
        if signal and REQUIRE_STRONG_TREND and not _first_trade_done:
            # Запоминаем когда начали ждать (для жёсткого таймаута)
            if _strong_trend_wait_start is None:
                _strong_trend_wait_start = __import__("time").time()
            _strong_elapsed = __import__("time").time() - _strong_trend_wait_start
            # ЖЁСТКИЙ ТАЙМАУТ — защита от вечного зависания в ожидании тренда
            if _strong_elapsed > STRONG_TREND_MAX_WAIT_SEC:
                print(f"[STRONG_TREND] ⚠️ Таймаут ожидания сильного тренда ({STRONG_TREND_MAX_WAIT_SEC//60} мин) — снимаю требование, торгую по обычному сигналу")
                tg_info(f"⚠️ <b>[{BOT_NAME}] Таймаут поиска тренда</b>\\nЖду слишком долго, перехожу к обычной торговле")
                _first_trade_done = True
            else:
                try:
                    # ВАЖНО: используем ТЕ ЖЕ свечи что и в основном анализе тренда (тот же таймфрейм)
                    _closed_strong = candles[:-1] if candles else []
                    if len(_closed_strong) >= STRONG_TREND_CANDLES:
                        _last_n = _closed_strong[-STRONG_TREND_CANDLES:]
                        _ctx_n = _closed_strong[-5:] if len(_closed_strong) >= 5 else _closed_strong
                        def _oc_of(_csc):
                            """Возвращает (open, close) свечи"""
                            if hasattr(_csc, 'open') and hasattr(_csc, 'close'):
                                return float(_csc.open), float(_csc.close)
                            elif isinstance(_csc, dict):
                                return float(_csc.get('open', _csc.get('o', 0))), float(_csc.get('close', _csc.get('c', 0)))
                            else:
                                return float(_csc[0]), float(_csc[3])
                        _last_data = [_oc_of(c) for c in _last_n]
                        _ctx_data  = [_oc_of(c) for c in _ctx_n]
                        _colors = ["UP" if cl >= o else "DOWN" for (o, cl) in _last_data]
                        _ctx_colors = ["UP" if cl >= o else "DOWN" for (o, cl) in _ctx_data]
                        _bar_strong = "".join("🟢" if c == "UP" else "🔴" for c in _colors)
                        _ctx_bar = "".join("🟢" if c == "UP" else "🔴" for c in _ctx_colors)
                        # Контекст с выделением последних N свечей
                        _ctx_highlighted = ""
                        for _i, _c in enumerate(_ctx_colors):
                            _emoji = "🟢" if _c == "UP" else "🔴"
                            if _i >= len(_ctx_colors) - len(_colors):
                                _ctx_highlighted += f"[{_emoji}]"
                            else:
                                _ctx_highlighted += _emoji
                        # Размер пипса для актива (для расчёта Δ пипсов)
                        _pip_strong = _pip_size_map.get((_resolved_asset or ASSET), 0.0001) if "_pip_size_map" in dir() else 0.0001
                        # Считаем суммарное движение и движение каждой свечи в пипсах
                        _deltas_pips = [round((cl - o) / _pip_strong, 1) for (o, cl) in _last_data]
                        _total_delta_price = sum(cl - o for (o, cl) in _last_data)
                        _total_delta_pips = round(_total_delta_price / _pip_strong, 1)
                        # Детальная разбивка по свечам: 🟢+5.2 пип / 🔴-3.1 пип
                        _details = " ".join(f"{'🟢' if d >= 0 else '🔴'}{d:+.1f}пип" for d in _deltas_pips)
                        # Цена начала первой и конца последней свечи
                        _first_open = _last_data[0][0]
                        _last_close = _last_data[-1][1]
                        _all_up   = all(c == "UP" for c in _colors)
                        _all_down = all(c == "DOWN" for c in _colors)
                        _trend_matches = (_all_up and signal == "CALL") or (_all_down and signal == "PUT")
                        _expected = ("🟢" * STRONG_TREND_CANDLES) if signal == "CALL" else ("🔴" * STRONG_TREND_CANDLES)
                        # Оценка силы движения
                        _abs_pips = abs(_total_delta_pips)
                        if _abs_pips < 5:
                            _strength = "💤 слабое"
                        elif _abs_pips < 15:
                            _strength = "⚖️ умеренное"
                        elif _abs_pips < 30:
                            _strength = "💪 сильное"
                        else:
                            _strength = "🔥 очень сильное"
                        if not _trend_matches:
                            _wait_left = max(0, int((STRONG_TREND_MAX_WAIT_SEC - _strong_elapsed) / 60))
                            print(f"[STRONG_TREND] ⏸ Жду сильный тренд | Контекст 5 свечей: {_ctx_highlighted}")
                            print(f"[STRONG_TREND]    Сейчас: {_bar_strong} | Нужно: {_expected} для {signal} | До таймаута: ~{_wait_left} мин")
                            print(f"[STRONG_TREND]    📊 По свечам: {_details}")
                            print(f"[STRONG_TREND]    💹 Суммарно: {_total_delta_pips:+.1f} пип ({_strength}) | {_first_open:.5f} → {_last_close:.5f}")
                            await asyncio.sleep(2)
                            continue
                        else:
                            print(f"[STRONG_TREND] 🎯 СИЛЬНЫЙ ТРЕНД НАЙДЕН!")
                            print(f"[STRONG_TREND]    Контекст 5 свечей: {_ctx_highlighted}")
                            print(f"[STRONG_TREND]    Совпало: {_bar_strong} = {_expected} → первая сделка {signal}!")
                            print(f"[STRONG_TREND]    📊 По свечам: {_details}")
                            print(f"[STRONG_TREND]    💹 Суммарно: {_total_delta_pips:+.1f} пип ({_strength}) | {_first_open:.5f} → {_last_close:.5f}")
                            tg_info(
                                f"🎯 <b>[{BOT_NAME}] Сильный тренд!</b>\\n"
                                f"━━━━━━━━━━━━━━━━━━━━\\n"
                                f"Контекст: {_ctx_bar}\\n"
                                f"Совпало: {_bar_strong} → <b>{signal}</b>\\n"
                                f"📊 По свечам: {_details}\\n"
                                f"💹 Суммарно: <b>{_total_delta_pips:+.1f} пип</b> {_strength}\\n"
                                f"💰 {_first_open:.5f} → {_last_close:.5f}"
                            )
                            _first_trade_done = True
                            _strong_trend_wait_start = None
                    else:
                        print(f"[STRONG_TREND] ⏳ Недостаточно свечей ({len(_closed_strong)}/{STRONG_TREND_CANDLES})")
                        await asyncio.sleep(2)
                        continue
                except Exception as _ste:
                    print(f"[STRONG_TREND] Ошибка: {_ste}, пропускаю проверку")
                    _first_trade_done = True

        if signal:
            if BET_PERCENT:
                balance, currency = await get_balance(client)
                bet = round(balance * (BASE_BET / 100), 2)
            else:
                balance, currency = await get_balance(client)
                bet = current_bet
            if trend_sig and signal == trend_sig:
                calls_follow += 1
            else:
                calls_reverse += 1
            emoji = "📈" if signal == "CALL" else "📉"
            _tlabels2 = {"UP_UP": "🟢🟢 Два зелёных", "DOWN_DOWN": "🔴🔴 Два красных", "DOWN_UP": "🔴🟢 Разворот вверх", "UP_DOWN": "🟢🔴 Разворот вниз"}
            trend_info = _tlabels2.get(trend, "— нет тренда")
            tg_parts = [f"{emoji} <b>[{BOT_NAME}] Комбо-сделка</b>", f"{signal} | {bet} {currency} | {ASSET}", f"Тренд: {trend_info}"]
            if signal_info:
                tg_parts.append(f"📊 Сигнал: {signal_info}")
            tg_parts.append(f"📋 Сделок сегодня: {trades_today + 1}")
            tg("\\n".join(tg_parts))
            balance_before, _ = await get_balance(client)
            _pt_result = await place_trade(client, signal, bet)
            order_id = _pt_result[0] if isinstance(_pt_result, (list, tuple)) else _pt_result
            entry_price = float(_pt_result[1]) if isinstance(_pt_result, (list, tuple)) and len(_pt_result) > 1 and _pt_result[1] else 0.0
            if entry_price == 0.0 and candles:
                try:
                    _lc = candles[-1]
                    if hasattr(_lc, 'close'):
                        entry_price = float(_lc.close)
                    elif isinstance(_lc, dict):
                        entry_price = float(_lc.get('close', _lc.get('c', 0)))
                    elif hasattr(_lc, '__getitem__'):
                        entry_price = float(_lc[3] if len(_lc) > 3 else _lc[1])
                except Exception as _ep_err:
                    print(f"[ENTRY_PRICE] Fallback ошибка: {_ep_err}")
            print(f"[ENTRY_PRICE] entry_price={entry_price}")
            if order_id:
                # Мгновенно берём актуальную цену из живого буфера — никаких 60с ожиданий!
                if _live_buf and _live_buf.last_price > 0:
                    entry_price = float(_live_buf.last_price)
                    print(f"[ENTRY_PRICE] ⚡ Цена входа из живого буфера: {entry_price:.5f}")
                else:
                    print(f"[ENTRY_PRICE] Используем цену из place_trade: {entry_price}")
                hedge_task = asyncio.create_task(
                    hedge_monitor(client, signal, bet, entry_price, EXPIRY_SEC)
                ) if entry_price > 0 else None
                ext_task = asyncio.create_task(
                    profit_extension_monitor(client, signal, bet, entry_price, EXPIRY_SEC)
                ) if entry_price > 0 else None
                # 🛡 КАСКАДНЫЙ ХЕДЖ — запуск Хедж-1 + монитора H2/H3 (если включён в конфиге)
                _cascade_enabled_runtime = ${cfg.hedgeCascadeEnabled ? "True" : "False"}
                cascade_task = None
                cascade_h1_task = None
                cascade_hedge1_info = None
                print(f"[CASCADE] 🔍 проверка: enabled={_cascade_enabled_runtime} | order_id={order_id} | entry_price={entry_price}")
                if order_id and _cascade_enabled_runtime and entry_price > 0:
                    print(f"[CASCADE] 🚀 ВКЛЮЧЁН — стартую каскад страховки")
                    # ХЕДЖ-1: сразу с основной, противоположное направление, та же экспирация, размер ×M1
                    _h1_mult = ${cfg.hedgeCascadeM1 ?? 1.5}
                    _h1_bet  = round(bet * _h1_mult, 2)
                    _h1_dir  = "PUT" if signal == "CALL" else "CALL"

                    async def _open_hedge1():
                        """Хедж-1 в отдельной таске — не блокирует основной поток."""
                        try:
                            print(f"[CASCADE] 🛡 ХЕДЖ-1 ЗАПУСК: {_h1_dir} | {_h1_bet} (×{_h1_mult}) | экспирация {EXPIRY_SEC}с")
                            _bal_h1, _ = await get_balance(client)
                            print(f"[CASCADE] 🛡 ХЕДЖ-1: баланс={_bal_h1}")
                            if _h1_bet > _bal_h1:
                                print(f"[CASCADE] ⛔ ХЕДЖ-1 отменён: ставка {_h1_bet} > баланс {_bal_h1}")
                                try:
                                    tg(f"⛔ <b>[CASCADE Хедж-1 отменён]</b>\\nБаланс {_bal_h1:.2f} < {_h1_bet:.2f}")
                                except Exception:
                                    pass
                                return None
                            _dv1 = OrderDirection.CALL if _h1_dir == "CALL" else OrderDirection.PUT
                            print(f"[CASCADE] 🛡 ХЕДЖ-1: вызываю place_order...")
                            _ord1 = await asyncio.wait_for(
                                client.place_order(asset=(_resolved_asset or ASSET), amount=_h1_bet, direction=_dv1, duration=EXPIRY_SEC),
                                timeout=15,
                            )
                            _oid1 = getattr(_ord1, 'order_id', None) if _ord1 else None
                            print(f"[CASCADE] 🛡 ХЕДЖ-1: place_order вернул order_id={_oid1}")
                            if _oid1:
                                try:
                                    tg(f"🛡 <b>[CASCADE Хедж-1]</b> {_h1_dir} | {_h1_bet} | страховка против {signal} | {EXPIRY_SEC//60} мин")
                                except Exception as _te1:
                                    print(f"[CASCADE] tg ошибка: {_te1}")
                                return (_oid1, _h1_bet, "H1", _bal_h1)
                            return None
                        except asyncio.TimeoutError:
                            print(f"[CASCADE] ⏱ ХЕДЖ-1 ТАЙМАУТ 15с — брокер не ответил, пропуск")
                            try: tg(f"⏱ <b>[CASCADE Хедж-1]</b> Таймаут — брокер не ответил")
                            except: pass
                            return None
                        except Exception as _eh1:
                            import traceback as _tb1
                            print(f"[CASCADE] ❌ ХЕДЖ-1 КРИТ. ОШИБКА: {_eh1}")
                            print(_tb1.format_exc())
                            try: tg(f"❌ <b>[CASCADE Хедж-1]</b> Ошибка: {_eh1}")
                            except: pass
                            return None

                    # 🚫 Если множитель = 0 → ХЕДЖ-1 ОТКЛЮЧЁН пользователем
                    if _h1_mult <= 0 or _h1_bet <= 0:
                        print(f"[CASCADE] 🚫 ХЕДЖ-1 ОТКЛЮЧЁН (множитель={_h1_mult}) — пропускаем")
                        cascade_h1_task = None
                    else:
                        # Запускаем хедж-1 как НЕБЛОКИРУЮЩУЮ таску
                        cascade_h1_task = asyncio.create_task(_open_hedge1())
                        print(f"[CASCADE] 🛡 ХЕДЖ-1: задача создана (неблокирующая)")

                    try:
                        cascade_started_at = asyncio.get_event_loop().time()
                    except Exception:
                        cascade_started_at = 0
                    async def _safe_cascade():
                        try:
                            return await cascade_hedge_monitor(client, signal, bet, entry_price, EXPIRY_SEC, cascade_started_at)
                        except Exception as _ec:
                            import traceback as _tbc
                            print(f"[CASCADE] ❌ МОНИТОР КРИТ. ОШИБКА: {_ec}")
                            print(_tbc.format_exc())
                            return []
                    cascade_task = asyncio.create_task(_safe_cascade())
                    print(f"[CASCADE] 🛡 МОНИТОР: задача создана (хедж-2/хедж-3)")
                else:
                    if not _cascade_enabled_runtime:
                        print(f"[CASCADE] ⏭ ВЫКЛЮЧЕН в настройках")
                    elif entry_price <= 0:
                        print(f"[CASCADE] ⛔ entry_price={entry_price} — каскад НЕ запущен")
                    elif not order_id:
                        print(f"[CASCADE] ⛔ order_id отсутствует — каскад НЕ запущен")
                if entry_price == 0.0:
                    print("[WARN] entry_price=0 — хедж и расширение прибыли НЕ запущены!")
                # Ждём основной ордер и мониторы параллельно
                main_result_task = asyncio.create_task(check_result(client, order_id, balance_before, bet))
                gather_results = await asyncio.gather(
                    main_result_task,
                    hedge_task or asyncio.sleep(0),
                    ext_task or asyncio.sleep(0),
                    cascade_task or asyncio.sleep(0),
                    cascade_h1_task or asyncio.sleep(0),
                    return_exceptions=True,
                )
                main_res        = gather_results[0]
                hedge_res       = gather_results[1]
                ext_res         = gather_results[2]
                cascade_res     = gather_results[3]
                cascade_h1_res  = gather_results[4]
                # Сохраняем результат хедж-1 (если открылся)
                if cascade_h1_task and not isinstance(cascade_h1_res, Exception) and cascade_h1_res:
                    cascade_hedge1_info = cascade_h1_res
                    print(f"[CASCADE] ✅ ХЕДЖ-1 итог: {cascade_h1_res}")
                elif cascade_h1_task and isinstance(cascade_h1_res, Exception):
                    print(f"[CASCADE] ❌ ХЕДЖ-1 завершился с ошибкой: {cascade_h1_res}")
                won, profit = main_res if not isinstance(main_res, Exception) else (False, round(-bet, 2))
                if hedge_task and not isinstance(hedge_res, Exception) and isinstance(hedge_res, tuple):
                    # Распаковка 4 элементов: order_id, ставка, оставшееся время, баланс ПЕРЕД хеджем
                    if len(hedge_res) == 4:
                        hedge_order_id, hedge_bet, hedge_remaining, balance_before_hedge = hedge_res
                    else:
                        hedge_order_id, hedge_bet, hedge_remaining = hedge_res
                        balance_before_hedge = balance_before
                    if hedge_order_id:
                        hedge_count += 1
                        # Передаём именно balance_before_hedge — чтобы fallback по балансу считал ТОЛЬКО результат хедж-сделки
                        h_won, h_profit = await check_result(client, hedge_order_id, balance_before_hedge, hedge_bet, wait_sec=hedge_remaining)
                        if h_won:
                            hedge_wins += 1
                        hedge_result = f"✅ +{h_profit:.2f}" if h_won else f"❌ {h_profit:.2f}"
                        tg(f"🛡 <b>Хедж результат:</b> {hedge_result} {currency}")
                        profit += h_profit
                if ext_task and not isinstance(ext_res, Exception) and isinstance(ext_res, list):
                    for ext_id, ext_bet, ext_type, ext_remaining in ext_res:
                        ext_count += 1
                        e_won, e_profit = await check_result(client, ext_id, balance_before, ext_bet, wait_sec=ext_remaining)
                        if e_won:
                            ext_wins += 1
                        ext_result = f"✅ +{e_profit:.2f}" if e_won else f"❌ {e_profit:.2f}"
                        tg(f"{'📈' if ext_type == 'TREND' else '🔄'} <b>Расширение {ext_type}:</b> {ext_result} {currency}")
                        profit += e_profit
                # 🛡 Обработка результатов КАСКАДНЫХ хеджей (H1 + H2 + H3)
                cascade_orders = []
                if cascade_hedge1_info is not None:
                    cascade_orders.append(cascade_hedge1_info)
                if cascade_task and not isinstance(cascade_res, Exception) and isinstance(cascade_res, list):
                    cascade_orders.extend(cascade_res)
                print(f"[CASCADE] 📊 Итого хеджей открыто: {len(cascade_orders)}")
                for _c_oid, _c_bet, _c_lvl, _c_bal in cascade_orders:
                    hedge_count += 1
                    c_won, c_profit = await check_result(client, _c_oid, _c_bal, _c_bet, wait_sec=10)
                    if c_won:
                        hedge_wins += 1
                    c_result = f"✅ +{c_profit:.2f}" if c_won else f"❌ {c_profit:.2f}"
                    print(f"[CASCADE] {_c_lvl} результат: {c_result} (ставка {_c_bet})")
                    tg(f"🛡 <b>[CASCADE {_c_lvl}] результат:</b> {c_result} {currency}")
                    profit += c_profit
                total_profit += profit
                trades_today += 1
                # Реальный результат — по итоговому профиту (с учётом хеджа и ext), а не только основной сделки
                final_won = profit > 0
                # "Полная" выплата = профит покрывает хотя бы изначальную ставку (для статистики/логов)
                # ВАЖНО: мартингейл сбрасывается на ЛЮБОМ плюсе (profit > 0), даже если выплата урезана хеджем
                full_win = profit >= bet
                # Перезапуск ожидания сильного тренда после проигрыша
                RESET_TREND_AFTER_LOSS = ${cfg.resetTrendAfterLoss ? "True" : "False"}
                if not final_won and REQUIRE_STRONG_TREND and RESET_TREND_AFTER_LOSS:
                    _first_trade_done = False
                    print(f"[STRONG_TREND] 🔄 Сброс! После проигрыша снова жду сильный тренд: {STRONG_TREND_CANDLES} свечей одного цвета")
                    tg_info(f"🔄 <b>[{BOT_NAME}] Сброс после проигрыша</b>\\nЖду сильный тренд из {STRONG_TREND_CANDLES} свечей перед следующей сделкой")
                current_bet   = adjust_bet(final_won, profit=profit, bet=bet)
                trade_log.append({"won": final_won, "profit": profit, "main_won": won, "full_win": full_win})
                # ===== ПАУЗА ПОСЛЕ СЕРИИ ПРОИГРЫШЕЙ =====
                PAUSE_AFTER_LOSSES_ENABLED = ${cfg.pauseAfterLossesEnabled ? "True" : "False"}
                PAUSE_AFTER_LOSSES_COUNT   = ${cfg.pauseAfterLossesCount ?? 3}
                PAUSE_AFTER_LOSSES_MINUTES = ${cfg.pauseAfterLossesMinutes ?? 10}
                if PAUSE_AFTER_LOSSES_ENABLED and not final_won:
                    # Считаем последовательную серию проигрышей с конца trade_log
                    _losses_in_row = 0
                    for _t in reversed(trade_log):
                        if not _t["won"]:
                            _losses_in_row += 1
                        else:
                            break
                    if _losses_in_row >= PAUSE_AFTER_LOSSES_COUNT:
                        _pause_sec = PAUSE_AFTER_LOSSES_MINUTES * 60
                        # Жёсткий лимит паузы: максимум 2 часа (защита от случайных огромных значений)
                        _pause_sec = min(_pause_sec, 7200)
                        print(f"[PAUSE] ⏸ Серия проигрышей: {_losses_in_row} подряд! Пауза {PAUSE_AFTER_LOSSES_MINUTES} минут для остывания рынка...")
                        tg(
                            f"⏸ <b>[{BOT_NAME}] Защитная пауза</b>\\n"
                            f"━━━━━━━━━━━━━━━━━━━━\\n"
                            f"❄️ Серия проигрышей: <b>{_losses_in_row} подряд</b>\\n"
                            f"⏱ Пауза: <b>{PAUSE_AFTER_LOSSES_MINUTES} минут</b>\\n"
                            f"💡 Защита от «разноса» депозита на эмоциях рынка"
                        )
                        # Сбрасываем флаг сильного тренда, чтобы после паузы войти только на чёткий сигнал
                        if REQUIRE_STRONG_TREND:
                            _first_trade_done = False
                            _strong_trend_wait_start = None
                        # Пауза с возможностью прерывания через /resume или /stop
                        _pause_start_t = __import__("time").time()
                        _pause_iterations = 0
                        _max_iterations = int(_pause_sec / 10) + 10  # защита от вечного цикла
                        while True:
                            _pause_iterations += 1
                            _elapsed_pause = __import__("time").time() - _pause_start_t
                            # Условия выхода (защита от зависания)
                            if _elapsed_pause >= _pause_sec:
                                break
                            if _pause_iterations > _max_iterations:
                                print(f"[PAUSE] ⚠️ Превышен лимит итераций паузы — принудительный выход")
                                break
                            tg_poll_commands()
                            if _tg_stopped:
                                break
                            if not _tg_paused and _elapsed_pause >= _pause_sec * 0.5:
                                # Если пользователь вручную нажал /resume — выходим раньше
                                pass
                            await asyncio.sleep(10)
                        if not _tg_stopped:
                            print(f"[PAUSE] ✅ Пауза окончена, продолжаю торговлю")
                            tg(f"✅ <b>[{BOT_NAME}] Пауза окончена</b>\\nПродолжаю торговлю")
                wins = sum(1 for t in trade_log if t["won"])
                wr   = wins / len(trade_log) * 100
                # Серия побед/поражений
                if final_won:
                    cur_streak = cur_streak + 1 if cur_streak >= 0 else 1
                else:
                    cur_streak = cur_streak - 1 if cur_streak <= 0 else -1
                # Определяем тип результата для эмодзи и заголовка
                if full_win:
                    status_emoji = "🎯"; status_text = "ПОЛНАЯ ПОБЕДА"
                elif final_won:
                    status_emoji = "🛡️"; status_text = "СПАСЕНО ХЕДЖЕМ"
                else:
                    status_emoji = "❌"; status_text = "ПРОИГРЫШ"
                # Прогресс-бар до Take Profit / Stop Loss
                if total_profit >= 0:
                    progress_pct = min(100, int(total_profit / TAKE_PROFIT * 100)) if TAKE_PROFIT > 0 else 0
                    progress_bar = "🟩" * (progress_pct // 10) + "⬜" * (10 - progress_pct // 10)
                    progress_label = f"TP {progress_pct}%"
                else:
                    progress_pct = min(100, int(abs(total_profit) / STOP_LOSS * 100)) if STOP_LOSS > 0 else 0
                    progress_bar = "🟥" * (progress_pct // 10) + "⬜" * (10 - progress_pct // 10)
                    progress_label = f"SL {progress_pct}%"
                # Серия для отображения
                if cur_streak >= 2:
                    streak_str = f"🔥 {cur_streak} побед подряд"
                elif cur_streak <= -2:
                    streak_str = f"❄️ {abs(cur_streak)} поражений подряд"
                else:
                    streak_str = "—"
                # Статистика хеджей за сессию
                hedge_stat = f"🛡️ Хедж: {hedge_wins}/{hedge_count}" if hedge_count > 0 else ""
                ext_stat   = f"📈 Расш: {ext_wins}/{ext_count}" if ext_count > 0 else ""
                extras = " | ".join(s for s in [hedge_stat, ext_stat] if s)
                extras_line = f"\\n{extras}" if extras else ""
                # Красивое сообщение
                tg(
                    f"{status_emoji} <b>[{BOT_NAME}] {status_text}</b>\\n"
                    f"━━━━━━━━━━━━━━━━━━━━\\n"
                    f"🎯 <b>{signal}</b> | {bet} {currency} | <code>{ASSET}</code>\\n"
                    f"💰 Профит: <b>{profit:+.2f} {currency}</b>\\n"
                    f"━━━━━━━━━━━━━━━━━━━━\\n"
                    f"📊 Сессия: <b>{total_profit:+.2f} {currency}</b>\\n"
                    f"📈 WR: <b>{wr:.0f}%</b> ({wins}/{len(trade_log)}){extras_line}\\n"
                    f"{streak_str if streak_str != '—' else ''}\\n"
                    f"{progress_bar} {progress_label}"
                )
                print_stats()
                # 🎮 Авто-меню после каждой сделки (inline-кнопки)
                try:
                    tg_show_main_menu()
                except Exception as _me:
                    print(f"[TG_MENU] Ошибка показа меню: {_me}")
        else:
            ts = datetime.now().strftime("%H:%M:%S")
            print(f"[{ts}] Нет подтверждённого сигнала, проверка через 2 сек (буфер живой)...")
            await asyncio.sleep(2)

    try:
        _buf_task.cancel()
    except Exception:
        pass
    await client.disconnect()

if __name__ == "__main__":
    print("════════════════════════════════════════")
    print("  КОНФИГУРАЦИЯ БОТА")
    print("════════════════════════════════════════")
    print(f"  Стратегии  : ${labels}")
    print(f"  Логика     : ${cfg.comboLogic} — ${logicWord}")
    print(f"  Актив      : {ASSET}")
    print(f"  Экспирация : {EXPIRY_SEC} сек")
    print(f"  Ставка     : {BASE_BET} {CURRENCY}")
    print(f"  Режим      : {'ДЕМО-СЧЁТ' if IS_DEMO else 'РЕАЛЬНЫЙ СЧЁТ'}")
    print(f"  Take Profit: {TAKE_PROFIT} {CURRENCY}")
    print(f"  Stop Loss  : {STOP_LOSS} {CURRENCY}")
    print(f"  Лимит/день : {DAILY_LIMIT} сделок")
    print("════════════════════════════════════════")
    asyncio.run(main())
`
  )
}