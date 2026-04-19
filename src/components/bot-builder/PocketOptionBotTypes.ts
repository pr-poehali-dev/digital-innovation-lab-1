export type POStrategy = "rsi_reversal" | "ema_cross" | "martingale" | "candle_pattern" | "support_resistance"
export type POExpiry = "1" | "2" | "3" | "5" | "15"
export type POComboLogic = "AND" | "OR"
export type POEmaTrendMode = "ema9_21" | "ema20_50" | "ema50_200" | "custom"

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
  useOTC: boolean
  autoRestart: boolean
  isDemo: boolean
  currency: string
  tgToken: string
  tgChatId: string
  tgEnabled: boolean
  tgProxy: string
  tgSendMode: "proxy" | "server"
  tgNotifyMode: "all" | "bets_only"
  tgDailyReport: boolean
  tgDailyReportTime: string
  invertSignal: boolean
  invertSignalRsi: boolean
  invertSignalEma: boolean
  invertSignalCandle: boolean
  invertSignalRufus: boolean
  invertSignalMartingale: boolean
  checkInterval: number
  payoutRate: number
  tradeDirection: "all" | "call_only" | "put_only"
  // Фильтр по времени
  timeFilterEnabled: boolean
  timeFilterFrom: string
  timeFilterTo: string
  // RSI-порог
  rsiThresholdEnabled: boolean
  rsiThresholdOversold: number
  rsiThresholdOverbought: number
  // Пауза после серии проигрышей
  lossStreakPauseEnabled: boolean
  lossStreakCount: number
  lossStreakPauseMin: number
  // Фильтр тренда по EMA200
  emaTrendFilterEnabled: boolean
  // Rufus — алгоритм уровней
  rufusPips: number
  rufusLookback: number
  rufusStep: 0.01 | 0.001 | 0.0001
  rufusPipSize: number | null
  // Тренд по свечам (комбо-режим)
  trendCandlesEnabled: boolean
  trendCandlesCount: 2 | 3 | 4
  // Подтверждение сигнала свечами (одиночный режим)
  candleConfirmEnabled: boolean
  candleConfirmCount: 2 | 3 | 4
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
    label: "EMA Пересечение",
    description: "Сигналы по пересечению быстрой и медленной EMA",
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
    label: "Уровни — Rufus",
    description: "Алгоритм Rufus: вход от круглых уровней (0.0100). Подход сверху → CALL, снизу → PUT",
    color: "bg-purple-500/20 border-purple-500/40 text-purple-400",
    risk: "Средний",
    icon: "🧱",
    winrateEst: "58–72%",
    signalsPerDay: "2–8",
    bestExpiry: "1–5 мин",
    bestAssets: "EUR/USD OTC, GBP/USD OTC, USD/JPY OTC",
    pros: [
      "Торгует от психологически значимых уровней",
      "Направление подхода фильтрует ложные пробои",
      "Настраиваемый радиус входа в пипсах",
    ],
    cons: [
      "Мало сигналов — нужно ждать у уровня",
      "Лучше работает на форекс-парах, не на крипте",
    ],
    combosWith: ["candle_pattern", "rsi_reversal"],
  },
}

export const PO_ASSETS = [
  // Валютные пары Forex (подтверждённые на PO)
  "EUR/USD", "GBP/USD", "USD/JPY", "AUD/USD", "USD/CAD", "USD/CHF", "NZD/USD",
  "EUR/GBP", "EUR/JPY", "EUR/CHF", "EUR/AUD", "EUR/CAD",
  "GBP/JPY", "GBP/CHF", "GBP/AUD", "GBP/CAD",
  "AUD/JPY", "AUD/CAD", "CAD/JPY",
  // Валютные пары Forex OTC (подтверждённые на PO)
  "EUR/USD (OTC)", "GBP/USD (OTC)", "USD/JPY (OTC)", "AUD/USD (OTC)", "USD/CAD (OTC)", "USD/CHF (OTC)", "NZD/USD (OTC)",
  "EUR/RUB (OTC)", "USD/RUB (OTC)",
  "EUR/GBP (OTC)", "EUR/JPY (OTC)", "EUR/CHF (OTC)", "EUR/AUD (OTC)", "EUR/CAD (OTC)",
  "GBP/JPY (OTC)", "GBP/CHF (OTC)", "GBP/AUD (OTC)", "GBP/CAD (OTC)",
  "AUD/JPY (OTC)", "AUD/CAD (OTC)", "CAD/JPY (OTC)",
  // Криптовалюты
  "BTC/USD", "ETH/USD", "SOL/USD", "BNB/USD", "DOGE/USD",
  // Криптовалюты OTC
  "BTC/USD (OTC)", "ETH/USD (OTC)", "SOL/USD (OTC)", "BNB/USD (OTC)", "DOGE/USD (OTC)",
  // Акции OTC (реальный список Pocket Option)
  "Nvidia (OTC)", "Apple (OTC)", "Tesla (OTC)", "VISA (OTC)", "Palantir (OTC)",
  "GameStop (OTC)", "ExxonMobil (OTC)", "Netflix (OTC)", "McDonald's (OTC)",
  "Intel (OTC)", "Boeing (OTC)", "Alibaba (OTC)",
  // Товары OTC (реальный список Pocket Option)
  "Gold (OTC)", "Silver (OTC)", "Brent Oil (OTC)", "WTI Oil (OTC)",
  "Natural Gas (OTC)", "Platinum (OTC)", "Palladium (OTC)",
  // Индексы OTC (реальный список Pocket Option)
  "S&P 500 (OTC)", "Dow Jones (OTC)", "NASDAQ (OTC)", "AUS 200 (OTC)", "VIX (OTC)",
]

export const PO_ASSETS_GROUPS = [
  {
    label: "💱 Forex — основные",
    assets: ["EUR/USD", "GBP/USD", "USD/JPY", "AUD/USD", "USD/CAD", "USD/CHF", "NZD/USD"],
  },
  {
    label: "💱 Forex — кросс-пары",
    assets: [
      "EUR/GBP", "EUR/JPY", "EUR/CHF", "EUR/AUD", "EUR/CAD",
      "GBP/JPY", "GBP/CHF", "GBP/AUD", "GBP/CAD",
      "AUD/JPY", "AUD/CAD", "CAD/JPY",
    ],
  },
  {
    label: "💱 Forex OTC — основные",
    assets: ["EUR/USD (OTC)", "GBP/USD (OTC)", "USD/JPY (OTC)", "AUD/USD (OTC)", "USD/CAD (OTC)", "USD/CHF (OTC)", "NZD/USD (OTC)", "EUR/RUB (OTC)", "USD/RUB (OTC)"],
  },
  {
    label: "💱 Forex OTC — кросс-пары",
    assets: [
      "EUR/GBP (OTC)", "EUR/JPY (OTC)", "EUR/CHF (OTC)", "EUR/AUD (OTC)", "EUR/CAD (OTC)",
      "GBP/JPY (OTC)", "GBP/CHF (OTC)", "GBP/AUD (OTC)", "GBP/CAD (OTC)",
      "AUD/JPY (OTC)", "AUD/CAD (OTC)", "CAD/JPY (OTC)",
    ],
  },
  {
    label: "₿ Крипто",
    assets: ["BTC/USD", "ETH/USD", "SOL/USD", "BNB/USD", "DOGE/USD"],
  },
  {
    label: "₿ Крипто OTC",
    assets: ["BTC/USD (OTC)", "ETH/USD (OTC)", "SOL/USD (OTC)", "BNB/USD (OTC)", "DOGE/USD (OTC)"],
  },
  {
    label: "📈 Акции OTC",
    assets: ["Nvidia (OTC)", "Apple (OTC)", "Tesla (OTC)", "VISA (OTC)", "Palantir (OTC)", "GameStop (OTC)", "ExxonMobil (OTC)", "Netflix (OTC)", "McDonald's (OTC)", "Intel (OTC)", "Boeing (OTC)", "Alibaba (OTC)"],
  },
  {
    label: "🏅 Товары OTC",
    assets: ["Gold (OTC)", "Silver (OTC)", "Brent Oil (OTC)", "WTI Oil (OTC)", "Natural Gas (OTC)", "Platinum (OTC)", "Palladium (OTC)"],
  },
  {
    label: "📊 Индексы OTC",
    assets: ["S&P 500 (OTC)", "Dow Jones (OTC)", "NASDAQ (OTC)", "AUS 200 (OTC)", "VIX (OTC)"],
  },
]

export const PO_EXPIRY_LABELS: Record<POExpiry, string> = {
  "1": "1 минута",
  "2": "2 минуты",
  "3": "3 минуты",
  "5": "5 минут",
  "15": "15 минут",
}

export const PO_DEFAULT_CONFIG: POBotConfig = {
  botName: "Бот 1",
  strategy: "rsi_reversal",
  comboMode: false,
  comboStrategies: ["rsi_reversal", "ema_cross"],
  comboLogic: "AND",
  asset: "EUR/USD (OTC)",
  expiry: "1",
  betAmount: 500,
  betPercent: false,
  martingaleEnabled: false,
  martingaleMultiplier: 2.1,
  martingaleSteps: 3,
  takeProfitRub: 3000,
  stopLossRub: 1500,
  dailyLimit: 20,
  rsiPeriod: 14,
  rsiOverbought: 70,
  rsiOversold: 30,
  emaFast: 9,
  emaSlow: 21,
  emaTrendMode: "ema9_21",
  useOTC: true,
  autoRestart: false,
  isDemo: true,
  currency: "RUB",
  tgToken: "",
  tgChatId: "",
  tgEnabled: true,
  tgSendMode: "server",
  tgNotifyMode: "all",
  tgDailyReport: false,
  tgDailyReportTime: "23:00",
  invertSignal: false,
  invertSignalRsi: false,
  invertSignalEma: false,
  invertSignalCandle: false,
  invertSignalRufus: false,
  invertSignalMartingale: false,
  tgProxy: "",
  checkInterval: 10,
  payoutRate: 92,
  tradeDirection: "all",
  timeFilterEnabled: false,
  timeFilterFrom: "09:00",
  timeFilterTo: "21:00",
  rsiThresholdEnabled: false,
  rsiThresholdOversold: 25,
  rsiThresholdOverbought: 75,
  lossStreakPauseEnabled: false,
  lossStreakCount: 3,
  lossStreakPauseMin: 30,
  emaTrendFilterEnabled: false,
  rufusPips: 5,
  rufusLookback: 10,
  rufusStep: 0.01,
  rufusPipSize: null,
  trendCandlesEnabled: false,
  trendCandlesCount: 3,
  candleConfirmEnabled: false,
  candleConfirmCount: 3,
}

// Таблица размеров пипса по активу (Вариант А — автоматически)
// Используется в generatePOCode если rufusPipSize не задан вручную
export const PO_PIP_SIZE: Record<string, { pip: number; comment: string }> = {
  // === ФОРЕКС — основные пары (котировка 5 знаков после запятой) ===
  // 1 пип = 0.0001 (4-й знак) — стандарт для USD-котируемых пар
  "EUR/USD":        { pip: 0.0001, comment: "Стандартный форекс, 4-й знак после запятой" },
  "GBP/USD":        { pip: 0.0001, comment: "Стандартный форекс, 4-й знак после запятой" },
  "AUD/USD":        { pip: 0.0001, comment: "Стандартный форекс, 4-й знак после запятой" },
  "NZD/USD":        { pip: 0.0001, comment: "Стандартный форекс, 4-й знак после запятой" },
  "USD/CAD":        { pip: 0.0001, comment: "Стандартный форекс, 4-й знак после запятой" },
  "USD/CHF":        { pip: 0.0001, comment: "Стандартный форекс, 4-й знак после запятой" },
  // JPY-пары: котировка 3 знака после запятой, 1 пип = 0.01
  "USD/JPY":        { pip: 0.01, comment: "JPY-пара: цена ~150.xx, пип = 0.01 (2-й знак)" },
  "EUR/JPY":        { pip: 0.01, comment: "JPY-пара: цена ~160.xx, пип = 0.01" },
  "GBP/JPY":        { pip: 0.01, comment: "JPY-пара: цена ~190.xx, пип = 0.01" },
  "AUD/JPY":        { pip: 0.01, comment: "JPY-пара: цена ~95.xx, пип = 0.01" },
  "CAD/JPY":        { pip: 0.01, comment: "JPY-пара: цена ~110.xx, пип = 0.01" },
  // Кросс-пары без JPY — стандарт 0.0001
  "EUR/GBP":        { pip: 0.0001, comment: "Кросс-пара, 4-й знак после запятой" },
  "EUR/CHF":        { pip: 0.0001, comment: "Кросс-пара, 4-й знак после запятой" },
  "EUR/AUD":        { pip: 0.0001, comment: "Кросс-пара, 4-й знак после запятой" },
  "EUR/CAD":        { pip: 0.0001, comment: "Кросс-пара, 4-й знак после запятой" },
  "GBP/CHF":        { pip: 0.0001, comment: "Кросс-пара, 4-й знак после запятой" },
  "GBP/AUD":        { pip: 0.0001, comment: "Кросс-пара, 4-й знак после запятой" },
  "GBP/CAD":        { pip: 0.0001, comment: "Кросс-пара, 4-й знак после запятой" },
  "AUD/CAD":        { pip: 0.0001, comment: "Кросс-пара, 4-й знак после запятой" },
  // RUB-пары: цена ~90.xxx, пип = 0.001 (3-й знак после запятой)
  "EUR/RUB (OTC)":  { pip: 0.001, comment: "Евро/рубль OTC: цена ~90.xxx, пип = 0.001" },
  "USD/RUB (OTC)":  { pip: 0.001, comment: "Доллар/рубль OTC: цена ~90.xxx, пип = 0.001" },
  // === ФОРЕКС OTC — те же значения, OTC = синтетика на основе реального актива ===
  "EUR/USD (OTC)":  { pip: 0.0001, comment: "OTC-версия EUR/USD, пип тот же 0.0001" },
  "GBP/USD (OTC)":  { pip: 0.0001, comment: "OTC-версия GBP/USD" },
  "AUD/USD (OTC)":  { pip: 0.0001, comment: "OTC-версия AUD/USD" },
  "NZD/USD (OTC)":  { pip: 0.0001, comment: "OTC-версия NZD/USD" },
  "USD/CAD (OTC)":  { pip: 0.0001, comment: "OTC-версия USD/CAD" },
  "USD/CHF (OTC)":  { pip: 0.0001, comment: "OTC-версия USD/CHF" },
  "USD/JPY (OTC)":  { pip: 0.01,   comment: "OTC JPY-пара, пип = 0.01" },
  "EUR/JPY (OTC)":  { pip: 0.01,   comment: "OTC JPY-пара, пип = 0.01" },
  "GBP/JPY (OTC)":  { pip: 0.01,   comment: "OTC JPY-пара, пип = 0.01" },
  "AUD/JPY (OTC)":  { pip: 0.01,   comment: "OTC JPY-пара, пип = 0.01" },
  "CAD/JPY (OTC)":  { pip: 0.01,   comment: "OTC JPY-пара, пип = 0.01" },
  "EUR/GBP (OTC)":  { pip: 0.0001, comment: "OTC кросс-пара" },
  "EUR/CHF (OTC)":  { pip: 0.0001, comment: "OTC кросс-пара" },
  "EUR/AUD (OTC)":  { pip: 0.0001, comment: "OTC кросс-пара" },
  "EUR/CAD (OTC)":  { pip: 0.0001, comment: "OTC кросс-пара" },
  "GBP/CHF (OTC)":  { pip: 0.0001, comment: "OTC кросс-пара" },
  "GBP/AUD (OTC)":  { pip: 0.0001, comment: "OTC кросс-пара" },
  "GBP/CAD (OTC)":  { pip: 0.0001, comment: "OTC кросс-пара" },
  "AUD/CAD (OTC)":  { pip: 0.0001, comment: "OTC кросс-пара" },
  // === КРИПТО — цена BTC/USD ~60000$, 1 пип = 1.0 (минимальный шаг = $1) ===
  "BTC/USD":        { pip: 1.0,    comment: "Биткоин: цена ~60000$, пип = $1 (целый доллар)" },
  "BTC/USD (OTC)":  { pip: 1.0,    comment: "OTC биткоин, пип = $1" },
  // ETH/USD ~3000$, пип = 0.1 ($0.10 = минимальный значимый шаг)
  "ETH/USD":        { pip: 0.1,    comment: "Эфир: цена ~3000$, пип = $0.10" },
  "ETH/USD (OTC)":  { pip: 0.1,    comment: "OTC эфир, пип = $0.10" },
  // SOL/USD ~150$, пип = 0.01
  "SOL/USD":        { pip: 0.01,   comment: "Солана: цена ~150$, пип = $0.01" },
  "SOL/USD (OTC)":  { pip: 0.01,   comment: "OTC солана, пип = $0.01" },
  // BNB/USD ~500$, пип = 0.1
  "BNB/USD":        { pip: 0.1,    comment: "BNB: цена ~500$, пип = $0.10" },
  "BNB/USD (OTC)":  { pip: 0.1,    comment: "OTC BNB, пип = $0.10" },
  // DOGE/USD ~0.15$, пип = 0.0001 (как форекс — мелкая цена)
  "DOGE/USD":       { pip: 0.0001, comment: "Додж: цена ~0.15$, пип = 0.0001 (4-й знак)" },
  "DOGE/USD (OTC)": { pip: 0.0001, comment: "OTC додж, пип = 0.0001" },
  // === АКЦИИ OTC — цена в долларах, пип = 0.01 ($0.01 = 1 цент = минимальный шаг акций) ===
  "Nvidia (OTC)":      { pip: 0.01, comment: "Акция: минимальный шаг = $0.01 (1 цент)" },
  "Apple (OTC)":       { pip: 0.01, comment: "Акция: минимальный шаг = $0.01" },
  "Tesla (OTC)":       { pip: 0.01, comment: "Акция: минимальный шаг = $0.01" },
  "VISA (OTC)":        { pip: 0.01, comment: "Акция: минимальный шаг = $0.01" },
  "Palantir (OTC)":    { pip: 0.01, comment: "Акция: минимальный шаг = $0.01" },
  "GameStop (OTC)":    { pip: 0.01, comment: "Акция: минимальный шаг = $0.01" },
  "ExxonMobil (OTC)":  { pip: 0.01, comment: "Акция: минимальный шаг = $0.01" },
  "Netflix (OTC)":     { pip: 0.01, comment: "Акция: минимальный шаг = $0.01" },
  "McDonald's (OTC)":  { pip: 0.01, comment: "Акция: минимальный шаг = $0.01" },
  "Intel (OTC)":       { pip: 0.01, comment: "Акция: минимальный шаг = $0.01" },
  "Boeing (OTC)":      { pip: 0.01, comment: "Акция: минимальный шаг = $0.01" },
  "Alibaba (OTC)":     { pip: 0.01, comment: "Акция: минимальный шаг = $0.01" },
  // === ТОВАРЫ OTC — цена в долларах ===
  // Gold/Silver: цена ~2000$/oz, пип = 0.1 ($0.10 минимальный шаг на Pocket Option)
  "Gold (OTC)":        { pip: 0.1,  comment: "Золото: цена ~2000$/oz, пип = $0.10" },
  "Silver (OTC)":      { pip: 0.01, comment: "Серебро: цена ~25$/oz, пип = $0.01" },
  "Platinum (OTC)":    { pip: 0.1,  comment: "Платина: цена ~1000$/oz, пип = $0.10" },
  "Palladium (OTC)":   { pip: 0.1,  comment: "Палладий: цена ~1000$/oz, пип = $0.10" },
  // Нефть: цена ~80$, пип = 0.01
  "Brent Oil (OTC)":   { pip: 0.01, comment: "Нефть Brent: цена ~80$, пип = $0.01" },
  "WTI Oil (OTC)":     { pip: 0.01, comment: "Нефть WTI: цена ~75$, пип = $0.01" },
  // Газ: цена ~2.5$, пип = 0.001
  "Natural Gas (OTC)": { pip: 0.001, comment: "Природный газ: цена ~2.5$, пип = $0.001 (мелкая цена)" },
  // === ИНДЕКСЫ OTC — цена тысячи пунктов, пип = 1.0 (1 пункт индекса) ===
  "S&P 500 (OTC)":     { pip: 1.0, comment: "Индекс: цена ~5000 пунктов, пип = 1 пункт" },
  "Dow Jones (OTC)":   { pip: 1.0, comment: "Индекс: цена ~38000 пунктов, пип = 1 пункт" },
  "NASDAQ (OTC)":      { pip: 1.0, comment: "Индекс: цена ~18000 пунктов, пип = 1 пункт" },
  "AUS 200 (OTC)":     { pip: 1.0, comment: "Австралийский индекс: цена ~7500 пунктов, пип = 1 пункт" },
  "VIX (OTC)":         { pip: 0.01, comment: "Индекс волатильности: цена ~15-20, пип = 0.01" },
}

// Получить размер пипса для актива (с fallback = 0.0001)
export function getPipSize(asset: string, override: number | null): number {
  if (override !== null && override > 0) return override
  return PO_PIP_SIZE[asset]?.pip ?? 0.0001
}

// Helper to avoid TS template literal conflicts with Python f-strings
const S = "$"

export function generatePOCode(cfg: POBotConfig): string {
  const strategyLabel = PO_STRATEGIES[cfg.strategy].label

  const strategyFunctions: Record<POStrategy, string> = {
    rsi_reversal: `
def calculate_rsi(prices, period=${cfg.rsiPeriod}):
    """RSI индикатор по методу Уайлдера (EMA-сглаживание) — совпадает с TradingView"""
    if len(prices) < period + 1:
        return 50
    deltas = [prices[i] - prices[i-1] for i in range(1, len(prices))]
    gains  = [d if d > 0 else 0.0 for d in deltas]
    losses = [-d if d < 0 else 0.0 for d in deltas]
    avg_gain = sum(gains[:period]) / period
    avg_loss = sum(losses[:period]) / period
    for i in range(period, len(deltas)):
        avg_gain = (avg_gain * (period - 1) + gains[i]) / period
        avg_loss = (avg_loss * (period - 1) + losses[i]) / period
    if avg_loss == 0:
        return 100
    rs = avg_gain / avg_loss
    return 100 - (100 / (1 + rs))

def get_signal(prices, candles=None):
    """Сигнал по RSI — перепроданность=CALL, перекупленность=PUT (режим свечей не влияет)"""
    prices = prices[:-1]
    if len(prices) < ${cfg.rsiPeriod} + 1:
        return None, ""
    rsi = calculate_rsi(prices)
    info = f"RSI(${cfg.rsiPeriod}): {rsi:.1f}"
    signal = None
    if rsi <= ${cfg.rsiOversold}:
        signal = ("CALL", f"{info} ≤ ${cfg.rsiOversold} (перепроданность)")
    elif rsi >= ${cfg.rsiOverbought}:
        signal = ("PUT", f"{info} ≥ ${cfg.rsiOverbought} (перекупленность)")
    if signal and INVERT_SIGNAL_RSI:
        return ("PUT" if signal[0] == "CALL" else "CALL"), signal[1] + " [INV]"
    return signal if signal else (None, info)`,

    ema_cross: `
def calculate_ema(prices, period):
    """EMA индикатор"""
    k = 2 / (period + 1)
    ema = [prices[0]]
    for price in prices[1:]:
        ema.append(price * k + ema[-1] * (1 - k))
    return ema

def get_signal(prices, candles=None):
    """Сигнал по пересечению EMA ${cfg.emaFast} / EMA ${cfg.emaSlow}"""
    prices = prices[:-1]
    if len(prices) < ${cfg.emaSlow} + 2:
        return None, ""
    ema_fast = calculate_ema(prices, ${cfg.emaFast})
    ema_slow = calculate_ema(prices, ${cfg.emaSlow})
    cross_up = ema_fast[-1] > ema_slow[-1] and ema_fast[-2] <= ema_slow[-2]
    cross_down = ema_fast[-1] < ema_slow[-1] and ema_fast[-2] >= ema_slow[-2]
    info = f"EMA${cfg.emaFast}={ema_fast[-1]:.5f} / EMA${cfg.emaSlow}={ema_slow[-1]:.5f}"
    signal = None
    if cross_up:
        signal = ("CALL", f"{info} (пересечение вверх ↑)")
    elif cross_down:
        signal = ("PUT", f"{info} (пересечение вниз ↓)")
    if signal and INVERT_SIGNAL_EMA:
        return ("PUT" if signal[0] == "CALL" else "CALL"), signal[1] + " [INV]"
    return signal if signal else (None, info)`,

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
    signal = None
    if calls >= 2:
        signal = ("CALL", f"{info} → большинство вверх")
    elif puts >= 2:
        signal = ("PUT", f"{info} → большинство вниз")
    if signal and INVERT_SIGNAL_MARTINGALE:
        return ("PUT" if signal[0] == "CALL" else "CALL"), signal[1] + " [INV]"
    return signal if signal else (None, info)`,

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
    signal = None
    # Молот — разворот вверх
    if lower_shadow > body2 * 2 and upper_shadow < body2 * 0.5 and c1 < o1:
        signal = ("CALL", "Паттерн: 🔨 Молот (разворот вверх)")
    # Падающая звезда — разворот вниз
    elif upper_shadow > body2 * 2 and lower_shadow < body2 * 0.5 and c1 > o1:
        signal = ("PUT", "Паттерн: ⭐ Падающая звезда (разворот вниз)")
    # Бычье поглощение
    elif c1 < o1 and c2 > o2 and c2 > o1 and o2 < c1:
        signal = ("CALL", "Паттерн: 🟢 Бычье поглощение")
    # Медвежье поглощение
    elif c1 > o1 and c2 < o2 and c2 < o1 and o2 > c1:
        signal = ("PUT", "Паттерн: 🔴 Медвежье поглощение")
    if signal and INVERT_SIGNAL_CANDLE:
        return ("PUT" if signal[0] == "CALL" else "CALL"), signal[1] + " [INV]"
    return signal if signal else (None, "")`,

    support_resistance: `
# ===== RUFUS — алгоритм уровней поддержки/сопротивления =====
RUFUS_PIPS     = ${cfg.rufusPips ?? 5}       # Радиус приближения к уровню (в пипсах)
RUFUS_LOOKBACK = ${cfg.rufusLookback ?? 10}  # Свечей назад для определения направления
RUFUS_STEP     = ${cfg.rufusStep ?? 0.01}    # Шаг уровней: 0.01 (сотые) или 0.001 (тысячные)
RUFUS_PIP_SIZE = ${getPipSize(cfg.asset, cfg.rufusPipSize ?? null)}  # Размер 1 пипса для ${cfg.asset}

def get_rufus_levels(price):
    """Ближайшие круглые уровни (каждые RUFUS_STEP)"""
    step = RUFUS_STEP
    lower = round(int(price / step) * step, 5)
    upper = round(lower + step, 5)
    return lower, upper

def get_signal(prices, candles=None):
    """Rufus: вход от круглых уровней по направлению подхода"""
    prices = prices[:-1]
    if len(prices) < RUFUS_LOOKBACK + 2:
        return None, ""
    current = prices[-1]
    pip = RUFUS_PIP_SIZE
    threshold = RUFUS_PIPS * pip
    lower_level, upper_level = get_rufus_levels(current)
    signal = None
    for level in [lower_level, upper_level]:
        if abs(current - level) <= threshold:
            if current >= level:
                signal = ("PUT", f"[RUFUS] {current:.5f}→{level:.4f} сверху→PUT")
            else:
                signal = ("CALL", f"[RUFUS] {current:.5f}→{level:.4f} снизу→CALL")
            break
    if signal and INVERT_SIGNAL_RUFUS:
        return ("PUT" if signal[0] == "CALL" else "CALL"), signal[1] + " [INV]"
    return signal if signal else (None, f"[RUFUS] Цена {current:.5f} | уровни: {lower_level:.4f} / {upper_level:.4f} | dist_low={abs(current-lower_level)/pip:.1f} pip")`,
  }

  const martingaleBlock = cfg.martingaleEnabled
    ? `
# === МАРТИНГЕЙЛ ===
current_bet = BASE_BET
loss_streak = 0

def adjust_bet(won):
    global current_bet, loss_streak
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

def adjust_bet(won):
    return BASE_BET
`

  const assetMap: Record<string, string> = {
    // Валютные пары OTC
    "EUR/USD (OTC)": "EURUSD_otc",
    "GBP/USD (OTC)": "GBPUSD_otc",
    "USD/JPY (OTC)": "USDJPY_otc",
    "AUD/USD (OTC)": "AUDUSD_otc",
    "EUR/GBP (OTC)": "EURGBP_otc",
    "EUR/JPY (OTC)": "EURJPY_otc",
    "USD/CAD (OTC)": "USDCAD_otc",
    "NZD/USD (OTC)": "NZDUSD_otc",
    "AUD/CAD (OTC)": "AUDCAD_otc",
    "USD/CHF (OTC)": "USDCHF_otc",
    "GBP/AUD (OTC)": "GBPAUD_otc",
    "GBP/CAD (OTC)": "GBPCAD_otc",
    "GBP/CHF (OTC)": "GBPCHF_otc",
    "GBP/JPY (OTC)": "GBPJPY_otc",
    "EUR/AUD (OTC)": "EURAUD_otc",
    "EUR/CAD (OTC)": "EURCAD_otc",
    "EUR/CHF (OTC)": "EURCHF_otc",
    "AUD/JPY (OTC)": "AUDJPY_otc",
    "CAD/JPY (OTC)": "CADJPY_otc",
    // Валютные пары
    "EUR/USD":       "EURUSD",
    "GBP/USD":       "GBPUSD",
    "USD/JPY":       "USDJPY",
    "AUD/USD":       "AUDUSD",
    "USD/CAD":       "USDCAD",
    "EUR/GBP":       "EURGBP",
    "EUR/JPY":       "EURJPY",
    "NZD/USD":       "NZDUSD",
    "GBP/AUD":       "GBPAUD",
    "GBP/CAD":       "GBPCAD",
    "GBP/CHF":       "GBPCHF",
    "GBP/JPY":       "GBPJPY",
    "EUR/AUD":       "EURAUD",
    "EUR/CAD":       "EURCAD",
    "EUR/CHF":       "EURCHF",
    "AUD/JPY":       "AUDJPY",
    "AUD/CAD":       "AUDCAD",
    "USD/CHF":       "USDCHF",
    "CAD/JPY":       "CADJPY",
    // Криптовалюты OTC
    "BTC/USD (OTC)": "BTCUSD_otc",
    "ETH/USD (OTC)": "ETHUSD_otc",
    "LTC/USD (OTC)": "LTCUSD_otc",
    "XRP/USD (OTC)": "XRPUSD_otc",
    "SOL/USD (OTC)": "SOLUSD_otc",
    // Криптовалюты
    "BTC/USD":       "BTCUSD",
    "ETH/USD":       "ETHUSD",
    "LTC/USD":       "LTCUSD",
    "XRP/USD":       "XRPUSD",
    "SOL/USD":       "SOLUSD",
    // Прочее
    "Gold (OTC)":    "XAUUSD_otc",
    "Oil (OTC)":     "USOIL_otc",
  }
  const assetSymbol = assetMap[cfg.asset] ?? cfg.asset.replace("/", "").replace(" (OTC)", "_otc").replace(/\s/g, "")

  return (
`#!/usr/bin/env python3
"""
Pocket Option Bot — ${strategyLabel}
Сгенерировано: TradeBase Bot Builder

════════════════════════════════════════
  КОНФИГУРАЦИЯ БОТА
════════════════════════════════════════
  Стратегия  : ${strategyLabel}
  Актив      : ${assetSymbol}
  Экспирация : ${cfg.expiry} мин
  Ставка     : ${cfg.betAmount}${cfg.betPercent ? "% от баланса" : " " + cfg.currency}
  Режим      : ${cfg.isDemo ? "ДЕМО-СЧЁТ" : "РЕАЛЬНЫЙ СЧЁТ"}

  Take Profit: ${cfg.takeProfitRub} ${cfg.currency}
  Stop Loss  : ${cfg.stopLossRub} ${cfg.currency}
  Лимит/день : ${cfg.dailyLimit} сделок
  Мартингейл : ${cfg.martingaleEnabled ? `x${cfg.martingaleMultiplier} до ${cfg.martingaleSteps} шагов` : "выкл"}
════════════════════════════════════════

Установка зависимостей:
    pip install pocketoptionapi-async PySocks
"""

import asyncio
import os
from datetime import datetime
from pocketoptionapi_async import AsyncPocketOptionClient, OrderDirection

# ===== НАСТРОЙКИ =====
ASSET        = os.environ.get("PO_ASSET", "${assetSymbol}")
EXPIRY_SEC   = ${String(parseInt(cfg.expiry) * 60)}             # Экспирация в секундах
CANDLE_TF    = 60                                               # Таймфрейм свечей для индикаторов (1 мин)
TWELVE_DATA_KEY = os.environ.get("TWELVE_DATA_KEY", "c7268bb91057482d9e78c17a85ea45fb")
TWELVE_DATA_SYMBOL = "${(() => { const s = assetSymbol.replace(/_otc$/,'').replace(/^#/,'').toUpperCase(); if (s.endsWith('USDT')) return s.replace('USDT','/USD'); const m = s.match(/^([A-Z]{3})([A-Z]{3})$/); return m ? m[1]+'/'+m[2] : s; })()}"

BASE_BET     = ${cfg.betAmount}          # Базовая ставка ₽
BET_PERCENT  = ${cfg.betPercent ? "True" : "False"}        # True = % от баланса
IS_DEMO      = ${cfg.isDemo ? "True" : "False"}                   # True = демо, False = реальный счёт

CURRENCY     = "${cfg.currency}"         # Валюта счёта
TAKE_PROFIT  = ${cfg.takeProfitRub}      # Стоп профит за сессию
STOP_LOSS    = ${cfg.stopLossRub}        # Стоп лосс за сессию
DAILY_LIMIT  = ${cfg.dailyLimit}         # Макс. сделок в день
AUTO_RESTART = ${cfg.autoRestart ? "True" : "False"}       # Перезапуск после TP/SL

MARTINGALE       = ${cfg.martingaleEnabled ? "True" : "False"}
MARTINGALE_MULT  = ${cfg.martingaleMultiplier}
MARTINGALE_STEPS = ${cfg.martingaleSteps}

CHECK_INTERVAL   = ${cfg.checkInterval}      # Интервал проверки сигнала (сек)
TRADE_DIRECTION  = "${cfg.tradeDirection ?? "all"}"  # "all" | "call_only" | "put_only"

TIME_FILTER_ENABLED   = ${cfg.timeFilterEnabled ? "True" : "False"}
TIME_FILTER_FROM      = "${cfg.timeFilterFrom ?? "09:00"}"
TIME_FILTER_TO        = "${cfg.timeFilterTo ?? "21:00"}"

RSI_THRESHOLD_ENABLED    = ${cfg.rsiThresholdEnabled ? "True" : "False"}
RSI_THRESHOLD_OVERSOLD   = ${cfg.rsiThresholdOversold ?? 25}
RSI_THRESHOLD_OVERBOUGHT = ${cfg.rsiThresholdOverbought ?? 75}

LOSS_STREAK_PAUSE_ENABLED = ${cfg.lossStreakPauseEnabled ? "True" : "False"}
LOSS_STREAK_COUNT         = ${cfg.lossStreakCount ?? 3}
LOSS_STREAK_PAUSE_MIN     = ${cfg.lossStreakPauseMin ?? 30}

EMA_TREND_FILTER = ${cfg.emaTrendFilterEnabled ? "True" : "False"}

CANDLE_CONFIRM_ENABLED = ${cfg.candleConfirmEnabled ? "True" : "False"}
CANDLE_CONFIRM_COUNT   = ${cfg.candleConfirmCount ?? 3}

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
TG_PROXY        = "${cfg.tgProxy}"
TG_SEND_MODE    = "${cfg.tgSendMode ?? "server"}"
TG_SERVER_URL   = "https://functions.poehali.dev/fb70e0a6-b6c1-49e2-b148-c37dab50f024"
TG_NOTIFY_MODE  = "${cfg.tgNotifyMode ?? "all"}"
TG_DAILY_REPORT = ${cfg.tgDailyReport ? "True" : "False"}
TG_DAILY_REPORT_TIME = "${cfg.tgDailyReportTime ?? "22:00"}"
INVERT_SIGNAL            = ${cfg.invertSignal ? "True" : "False"}
INVERT_SIGNAL_RSI        = ${cfg.invertSignalRsi ? "True" : "False"}
INVERT_SIGNAL_EMA        = ${cfg.invertSignalEma ? "True" : "False"}
INVERT_SIGNAL_CANDLE     = ${cfg.invertSignalCandle ? "True" : "False"}
INVERT_SIGNAL_RUFUS      = ${cfg.invertSignalRufus ? "True" : "False"}
INVERT_SIGNAL_MARTINGALE = ${cfg.invertSignalMartingale ? "True" : "False"}

# ===== ЖУРНАЛ СДЕЛОК =====
JOURNAL_URL = "https://functions.poehali.dev/317c9913-52da-4683-920f-963c978a3202"
REPORT_SCHEDULER_URL = "https://functions.poehali.dev/26bda9fa-84ca-4013-9943-a0e23f0cebc2"
_session_id = None

def _journal_request(path, method="POST", data=None, _retry=2):
    import urllib.request, json as _json, time as _time
    url = JOURNAL_URL + path
    body = _json.dumps(data or {}).encode()
    for attempt in range(_retry):
        try:
            req = urllib.request.Request(url, data=body, headers={"Content-Type": "application/json"}, method=method)
            resp = urllib.request.urlopen(req, timeout=15).read()
            return _json.loads(resp)
        except Exception as e:
            if attempt < _retry - 1:
                _time.sleep(2)
            else:
                print(f"[JOURNAL] Ошибка: {e}")
    return {}

def journal_start_session():
    global _session_id
    result = _journal_request("", data={
        "action": "session",
        "bot_name": BOT_NAME,
        "strategy": "${cfg.comboMode ? "combo" : cfg.strategy}",
        "asset": ASSET,
        "bet_amount": BASE_BET,
        "currency": CURRENCY,
        "is_demo": IS_DEMO,
    })
    _session_id = result.get("session_id")
    if _session_id:
        print(f"[JOURNAL] Сессия создана: {_session_id}")

def journal_log_trade(direction, bet, payout_pct, won, strategy_name=None, indicator_value=None):
    if not _session_id:
        return
    import threading
    threading.Thread(
        target=_journal_request,
        args=("",),
        kwargs={"data": {
            "action": "trade",
            "session_id": _session_id,
            "asset": ASSET,
            "direction": direction,
            "bet": bet,
            "payout_pct": payout_pct,
            "won": won,
            "strategy_name": strategy_name,
            "indicator_value": indicator_value,
        }},
        daemon=True
    ).start()

def journal_end_session():
    if not _session_id:
        return
    _journal_request("", method="POST", data={"action": "end", "session_id": _session_id})

_tg_auto_proxies = []
_tg_auto_proxies_ts = 0

def _fetch_auto_proxies():
    import urllib.request, json, time
    global _tg_auto_proxies, _tg_auto_proxies_ts
    if time.time() - _tg_auto_proxies_ts < 600 and _tg_auto_proxies:
        return _tg_auto_proxies
    result = []
    try:
        r = urllib.request.urlopen("https://api.proxyscrape.com/v2/?request=displayproxies&protocol=socks5&timeout=3000&country=all&ssl=all&anonymity=all&limit=30", timeout=8)
        for line in r.read().decode().splitlines():
            line = line.strip()
            if line and ":" in line:
                result.append(f"socks5://{line}")
    except Exception:
        pass
    try:
        r2 = urllib.request.urlopen("https://api.proxyscrape.com/v2/?request=displayproxies&protocol=http&timeout=3000&country=all&ssl=all&anonymity=all&limit=20", timeout=8)
        for line in r2.read().decode().splitlines():
            line = line.strip()
            if line and ":" in line:
                result.append(f"http://{line}")
    except Exception:
        pass
    if result:
        _tg_auto_proxies = result
        _tg_auto_proxies_ts = time.time()
        print(f"[TG] Загружено {len(result)} авто-прокси")
    return result

def _apply_proxy(proxy_url):
    import socket
    from urllib.parse import urlparse as _up
    p = _up(proxy_url)
    scheme = p.scheme.lower()
    if scheme in ("socks5", "socks4"):
        import socks
        _type = socks.SOCKS5 if scheme == "socks5" else socks.SOCKS4
        socks.set_default_proxy(_type, p.hostname, p.port, username=p.username, password=p.password)
        socket.socket = socks.socksocket
    elif scheme in ("http", "https"):
        import socks
        socks.set_default_proxy(socks.HTTP, p.hostname, p.port, username=p.username, password=p.password)
        socket.socket = socks.socksocket

def _tg_send(text, retries=2, delay=3):
    import urllib.request, urllib.parse, json as _json, time, socket as _socket
    if TG_SEND_MODE == "server":
        payload = _json.dumps({"token": TG_TOKEN, "chat_id": TG_CHAT_ID, "text": text}).encode()
        req = urllib.request.Request(TG_SERVER_URL, data=payload, headers={"Content-Type": "application/json"}, method="POST")
        for attempt in range(1, retries + 1):
            try:
                resp = urllib.request.urlopen(req, timeout=10)
                result = _json.loads(resp.read().decode())
                if result.get("ok"):
                    print("[TG] Отправлено через сервер ✓")
                    return
            except Exception:
                if attempt < retries:
                    time.sleep(delay)
        print("[TG] Не удалось отправить через сервер")
        return
    url = f"https://api.telegram.org/bot{TG_TOKEN}/sendMessage"
    data = urllib.parse.urlencode({"chat_id": TG_CHAT_ID, "text": text, "parse_mode": "HTML"}).encode()
    _user_proxies = [p.strip() for p in TG_PROXY.split(",") if p.strip()] if TG_PROXY else []
    _auto = _fetch_auto_proxies()
    _all_proxies = _user_proxies + [p for p in _auto if p not in _user_proxies]
    _orig_socket = _socket.socket
    def _reset_socket():
        try:
            _socket.socket = _orig_socket
        except Exception:
            pass
    for proxy in (_all_proxies + [None]):
        if proxy:
            try:
                _apply_proxy(proxy)
            except Exception:
                _reset_socket()
                continue
        else:
            _reset_socket()
        for attempt in range(1, retries + 1):
            try:
                urllib.request.urlopen(url, data, timeout=6)
                if proxy is None and _all_proxies:
                    print("[TG] Все прокси недоступны, отправлено напрямую ✓")
                else:
                    print(f"[TG] Отправлено через {proxy.split('@')[-1]} ✓")
                _reset_socket()
                return
            except Exception:
                if attempt < retries:
                    time.sleep(delay)
        if proxy:
            print(f"[TG] Прокси не работает, пробую следующий: {proxy.split('@')[-1]}")
            _reset_socket()
    print("[TG] Не удалось отправить уведомление ни через один прокси и напрямую")

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

_daily_stats = {"total": 0, "wins": 0, "losses": 0, "profit": 0.0, "max_win_streak": 0, "max_loss_streak": 0, "_cur_win": 0, "_cur_loss": 0}
_last_signal_time = __import__("time").time()
_no_signal_alert_sent = False

def _tg_inline(text, buttons):
    """Отправить сообщение с inline-кнопками"""
    if not TG_ENABLED:
        return
    import urllib.request, json as _json
    payload = _json.dumps({
        "chat_id": TG_CHAT_ID,
        "text": text,
        "parse_mode": "HTML",
        "reply_markup": {"inline_keyboard": buttons}
    }).encode()
    try:
        req = urllib.request.Request(
            f"https://api.telegram.org/bot{TG_TOKEN}/sendMessage",
            data=payload, headers={"Content-Type": "application/json"}
        )
        urllib.request.urlopen(req, timeout=5)
    except Exception:
        tg(text)

def _main_buttons():
    return [[
        {"text": "▶️ Старт",  "callback_data": f"/start {BOT_NAME}"},
        {"text": "⏸ Пауза",  "callback_data": f"/pause {BOT_NAME}"},
        {"text": "🛑 Стоп",   "callback_data": f"/stop {BOT_NAME}"}
    ],[
        {"text": "📊 Статус", "callback_data": f"/status {BOT_NAME}"},
        {"text": "📋 Отчёт", "callback_data": f"/report {BOT_NAME}"},
        {"text": "🔧 Тюнинг","callback_data": f"/tune {BOT_NAME}"}
    ]]

def _update_daily_stats(won, profit_val, loss_val):
    s = _daily_stats
    s["total"] += 1
    if won:
        s["wins"] += 1
        s["profit"] += profit_val
        s["_cur_win"] += 1
        s["_cur_loss"] = 0
        if s["_cur_win"] > s["max_win_streak"]:
            s["max_win_streak"] = s["_cur_win"]
    else:
        s["losses"] += 1
        s["profit"] -= loss_val
        s["_cur_win"] = 0
        s["_cur_loss"] += 1
        if s["_cur_loss"] > s["max_loss_streak"]:
            s["max_loss_streak"] = s["_cur_loss"]

def _get_strategy_recommendation(strategy_key):
    """Рекомендация по корректировке параметров стратегии"""
    s = strategy_key or ""
    if "RSI" in s or "${cfg.strategy}" == "rsi_reversal":
        return (
            "💡 Рекомендации:\\n"
            "  — Если много ложных сигналов CALL: повысьте RSI oversold ${cfg.rsiOversold} → попробуйте ${cfg.rsiOversold - 5}\\n"
            "  — Если много ложных сигналов PUT: понизьте RSI overbought ${cfg.rsiOverbought} → попробуйте ${cfg.rsiOverbought + 5}\\n"
            "  — Или увеличьте период RSI ${cfg.rsiPeriod} → ${cfg.rsiPeriod + 2} для фильтрации шума"
        )
    elif "EMA" in s or "${cfg.strategy}" == "ema_cross":
        return (
            "💡 Рекомендации:\\n"
            "  — Много ложных пересечений? Увеличьте разрыв: EMA быстрая ${cfg.emaFast}→${cfg.emaFast + 3}, медленная ${cfg.emaSlow}→${cfg.emaSlow + 5}\\n"
            "  — Сигналы запаздывают? Уменьшите периоды: ${cfg.emaFast}→${cfg.emaFast - 2} / ${cfg.emaSlow}→${cfg.emaSlow - 3}\\n"
            "  — Попробуйте добавить фильтр по RSI чтобы отсеять боковик"
        )
    elif "Паттерн" in s or "${cfg.strategy}" == "candle_pattern":
        return (
            "💡 Рекомендации:\\n"
            "  — Паттерны дают ложные сигналы? Торгуйте только в направлении тренда EMA\\n"
            "  — Уменьшите экспирацию — свечные паттерны лучше работают на коротких таймфреймах\\n"
            "  — Ограничьте торговлю часами высокой волатильности (08:00–12:00, 14:00–18:00 МСК)"
        )
    elif "RUFUS" in s or "${cfg.strategy}" == "support_resistance":
        return (
            "💡 Рекомендации:\\n"
            "  — Много пробоев уровней? Увеличьте RUFUS_PIPS ${cfg.rufusPips ?? 5} → ${(cfg.rufusPips ?? 5) + 2}\\n"
            "  — Слишком редкие сигналы? Уменьшите RUFUS_PIPS → ${Math.max(2, (cfg.rufusPips ?? 5) - 1)}\\n"
            "  — Увеличьте RUFUS_LOOKBACK ${cfg.rufusLookback ?? 10} → ${(cfg.rufusLookback ?? 10) + 5} для более надёжного определения тренда"
        )
    elif "комбо" in s.lower() or "${cfg.strategy}" == "combo":
        return (
            "💡 Рекомендации:\\n"
            "  — Переключитесь с AND на OR логику для большего числа сигналов\\n"
            "  — Уберите наименее эффективную стратегию из комбо\\n"
            "  — Проверьте каждую стратегию отдельно чтобы найти слабое звено"
        )
    else:
        return (
            "💡 Рекомендации:\\n"
            "  — Попробуйте другую стратегию или актив\\n"
            "  — Проверьте настройки экспирации и размера ставки"
        )

def _build_strat_block_with_tips():
    """Блок анализа по стратегиям с рекомендациями"""
    strat_stats: dict = {}
    for t in trade_log:
        key = t.get("strategy", "—")
        if key not in strat_stats:
            strat_stats[key] = {"wins": 0, "losses": 0}
        if t["won"]:
            strat_stats[key]["wins"] += 1
        else:
            strat_stats[key]["losses"] += 1
    lines = []
    tips = []
    for strat, st in strat_stats.items():
        strat_label = strat.split("(")[0].strip() if strat else "—"
        total = st["wins"] + st["losses"]
        wr = round(st["wins"] / total * 100) if total > 0 else 0
        if st["losses"] > st["wins"]:
            verdict = "⚠️ корректировка"
            tips.append(_get_strategy_recommendation(strat))
        else:
            verdict = "✅ ок"
        lines.append(f"  • {strat_label}: {st['wins']}W/{st['losses']}L ({wr}%) — {verdict}")
    block = "\\n".join(lines) if lines else "  нет данных"
    tips_block = "\\n\\n" + "\\n\\n".join(tips) if tips else ""
    return block + tips_block

def _register_in_scheduler(report_time=None):
    """Регистрирует бота в серверном планировщике для авто-отчётов"""
    if not TG_ENABLED:
        return
    try:
        import urllib.request as _ur, json as _jj
        payload = _jj.dumps({
            "action": "register",
            "tg_token": TG_TOKEN,
            "tg_chat_id": str(TG_CHAT_ID),
            "journal_url": JOURNAL_URL,
            "report_time": report_time or TG_DAILY_REPORT_TIME,
        }).encode()
        req = _ur.Request(
            REPORT_SCHEDULER_URL,
            data=payload, headers={"Content-Type": "application/json"}
        )
        _ur.urlopen(req, timeout=6)
        print(f"[SCHEDULER] Зарегистрирован, отчёт в {report_time or TG_DAILY_REPORT_TIME}")
    except Exception as e:
        print(f"[SCHEDULER] Ошибка регистрации: {e}")

def _send_all_bots_report():
    """Сводный отчёт по всем ботам за сегодня — запрашивает данные с сервера"""
    try:
        import urllib.request as _ur, json as _jj
        url = JOURNAL_URL + "/report/today"
        req = _ur.Request(url, headers={"Content-Type": "application/json"})
        resp = _ur.urlopen(req, timeout=8)
        data = _jj.loads(resp.read().decode())
        bots = data.get("bots", [])
        sm = data.get("summary", {})
        if not bots:
            _tg_inline("📊 <b>Сводка по всем ботам</b>\\n\\nСегодня сделок не было.", _main_buttons())
            return
        lines = ["📊 <b>Сводка за сегодня — все боты</b>", "━━━━━━━━━━━━━━━━━━"]
        for b in bots:
            wr = round(b["wins"] / b["total"] * 100) if b["total"] > 0 else 0
            pnl_e = "🟢" if b["profit"] >= 0 else "🔴"
            sign = "+" if b["profit"] >= 0 else ""
            lines.append(
                f"🤖 <b>{b['bot_name']}</b>\\n"
                f"  📈 Сделок: {b['total']} | ✅ {b['wins']} / ❌ {b['losses']} | WR: {wr}%\\n"
                f"  {pnl_e} P&amp;L: {sign}{b['profit']} {b['currency']}"
            )
        lines.append("━━━━━━━━━━━━━━━━━━")
        tot_e = "🟢" if sm.get("total_profit", 0) >= 0 else "🔴"
        tot_sign = "+" if sm.get("total_profit", 0) >= 0 else ""
        lines.append(
            f"<b>ИТОГО:</b> {sm.get('total_trades',0)} сделок | WR: {sm.get('winrate',0)}%\\n"
            f"{tot_e} Общий P&amp;L: {tot_sign}{sm.get('total_profit',0)}"
        )
        _tg_inline("\\n".join(lines), _main_buttons())
    except Exception as e:
        tg(f"⚠️ Не удалось получить сводку: {e}")

def _send_daily_report():
    s = _daily_stats
    if s["total"] == 0:
        _tg_inline("📊 <b>Ежедневный отчёт</b>\\n\\nСегодня сделок не было.", _main_buttons())
        return
    winrate = round(s["wins"] / s["total"] * 100) if s["total"] > 0 else 0
    profit_sign = "+" if s["profit"] >= 0 else ""
    emoji_pnl = "🟢" if s["profit"] >= 0 else "🔴"
    bar_w = min(10, round(winrate / 10))
    bar = "█" * bar_w + "░" * (10 - bar_w)
    strat_block = _build_strat_block_with_tips()
    _tg_inline(
        f"📊 <b>Отчёт — {BOT_NAME}</b>\\n"
        f"━━━━━━━━━━━━━━━━━━\\n"
        f"📅 Сделок сегодня: <b>{s['total']}</b>\\n"
        f"✅ Побед: <b>{s['wins']}</b>  ❌ Потерь: <b>{s['losses']}</b>\\n"
        f"📈 Винрейт: <b>{winrate}%</b>  [{bar}]\\n"
        f"{emoji_pnl} P&amp;L: <b>{profit_sign}{round(s['profit'], 2)} {CURRENCY}</b>\\n"
        f"🔥 Лучшая серия: <b>{s['max_win_streak']}</b>  💀 Худшая: <b>{s['max_loss_streak']}</b>\\n"
        f"━━━━━━━━━━━━━━━━━━\\n"
        f"<b>По стратегиям:</b>\\n{strat_block}",
        _main_buttons()
    )

def _daily_report_scheduler():
    import time, datetime, threading
    if not TG_DAILY_REPORT:
        return
    def _loop():
        last_sent_date = None
        last_all_sent_date = None
        while True:
            now = datetime.datetime.now()
            target_h, target_m = map(int, TG_DAILY_REPORT_TIME.split(":"))
            if now.hour == target_h and now.minute == target_m and now.date() != last_sent_date:
                _send_daily_report()
                last_sent_date = now.date()
            if now.hour == 22 and now.minute == 0 and now.date() != last_all_sent_date:
                last_all_sent_date = now.date()
                time.sleep(3)
                _send_all_bots_report()
            time.sleep(30)
    threading.Thread(target=_loop, daemon=True).start()

# ===== УПРАВЛЕНИЕ ЧЕРЕЗ TELEGRAM =====
_tg_paused   = False
_tg_stopped  = False
_tg_offset   = -1

def _tg_flush_old_updates():
    """Сброс накопившихся старых команд при старте — чтобы /stop из прошлого сеанса не остановил бот"""
    global _tg_offset
    if not TG_ENABLED:
        return
    import urllib.request, json as _json
    try:
        url = f"https://api.telegram.org/bot{TG_TOKEN}/getUpdates?offset=-1&timeout=0&limit=1"
        resp = urllib.request.urlopen(url, timeout=5).read()
        data = _json.loads(resp)
        results = data.get("result", [])
        if results:
            _tg_offset = results[-1]["update_id"] + 1
        else:
            _tg_offset = 0
    except Exception:
        _tg_offset = 0

_tg_flush_old_updates()

async def tg_poll_commands():
    """Получить новые команды из Telegram (async — не блокирует event loop)"""
    global _tg_paused, _tg_stopped, _tg_offset, TAKE_PROFIT, STOP_LOSS, BASE_BET
    if not TG_ENABLED:
        return
    import urllib.request, json as _json
    _poll_proxies = [p.strip() for p in TG_PROXY.split(",") if p.strip()] if TG_PROXY else [None]
    def _fetch():
        url = f"https://api.telegram.org/bot{TG_TOKEN}/getUpdates?offset={_tg_offset}&timeout=0&limit=10"
        for _proxy in _poll_proxies:
            if _proxy:
                try:
                    _apply_proxy(_proxy)
                except Exception:
                    continue
            try:
                return urllib.request.urlopen(url, timeout=5).read()
            except Exception as _fe:
                _last = _fe
        raise _last
    try:
        resp = await asyncio.get_event_loop().run_in_executor(None, _fetch)
        data = _json.loads(resp)
        _bot_name_lower = BOT_NAME.lower()
        for upd in data.get("result", []):
            _tg_offset = upd["update_id"] + 1
            msg = upd.get("message") or upd.get("channel_post") or {}
            text = msg.get("text", "").strip()
            chat = str(msg.get("chat", {}).get("id", ""))
            if chat != str(TG_CHAT_ID):
                continue
            parts = text.split()
            if not parts:
                continue
            cmd = parts[0].lower().split("@")[0]
            rest = parts[1:] if len(parts) > 1 else []
            val = ""
            target = ""
            if rest:
                full_rest = " ".join(rest).lower()
                if full_rest == _bot_name_lower or full_rest == "all":
                    target = full_rest
                else:
                    try:
                        float(rest[-1])
                        val = rest[-1]
                        target = " ".join(rest[:-1]).lower()
                    except ValueError:
                        target = full_rest
            for_me = (target == _bot_name_lower or target == "all" or target == "")
            if cmd == "/stop" and for_me:
                _tg_stopped = True
                tg(f"🛑 <b>[{BOT_NAME}] остановлен</b>")
            elif cmd == "/pause" and for_me:
                _tg_paused = True
                tg(f"⏸ <b>[{BOT_NAME}] на паузе.</b> /resume {BOT_NAME} для продолжения")
            elif cmd in ("/resume", "/start") and for_me:
                _tg_paused = False
                _tg_stopped = False
                _tg_inline(f"▶️ <b>[{BOT_NAME}] возобновлён и торгует</b>", _main_buttons())
            elif cmd == "/status" and for_me:
                wins_s = sum(1 for t in trade_log if t["won"])
                strat_block = _build_strat_block_with_tips()
                tg(f"📊 <b>Статус [{BOT_NAME}]</b>\\n💰 Профит: {total_profit:+.2f} {CURRENCY}\\n📈 Сделок: {trades_today} (✅{wins_s}/❌{trades_today-wins_s})\\n{'⏸ На паузе' if _tg_paused else '▶️ Работает'}\\n\\n<b>По стратегиям:</b>\\n{strat_block}")
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
            elif cmd == "/setreport" and for_me:
                new_time = val.strip() if val else ""
                import re as _re
                if _re.match(r"^\\d{1,2}:\\d{2}$", new_time):
                    _register_in_scheduler(report_time=new_time)
                    _tg_inline(f"✅ <b>[{BOT_NAME}]</b> Авто-отчёт теперь в <b>{new_time}</b>", _main_buttons())
                else:
                    tg(f"❌ Формат: /setreport {BOT_NAME} 21:00")
            elif cmd == "/report":
                raw_tgt = " ".join(parts[1:]).lower() if len(parts) > 1 else ""
                if raw_tgt == "all":
                    _send_all_bots_report()
                elif for_me:
                    _send_daily_report()
            elif cmd == "/reset" and for_me:
                _daily_stats.update({"total": 0, "wins": 0, "losses": 0, "profit": 0.0, "max_win_streak": 0, "max_loss_streak": 0, "_cur_win": 0, "_cur_loss": 0})
                tg(f"🔄 <b>[{BOT_NAME}]</b> Дневная статистика сброшена")
            elif cmd == "/tune" and for_me:
                if not trade_log:
                    tg(f"🔧 <b>[{BOT_NAME}] /tune</b>\\nНедостаточно данных — нужно хотя бы несколько сделок.")
                else:
                    total_t = len(trade_log)
                    wins_t = sum(1 for t in trade_log if t["won"])
                    wr_t = wins_t / total_t * 100 if total_t > 0 else 0
                    lines = [f"🔧 <b>[{BOT_NAME}] Авто-тюнинг</b>\\nСделок: {total_t} | WR: {wr_t:.0f}%\\n"]
                    strategy = "${cfg.strategy}"
                    if strategy == "rsi_reversal":
                        rsi_vals_call = [t.get("strategy","") for t in trade_log if not t["won"] and "CALL" in str(t.get("direction",""))]
                        rsi_vals_put  = [t.get("strategy","") for t in trade_log if not t["won"] and "PUT"  in str(t.get("direction",""))]
                        new_os = ${cfg.rsiOversold}
                        new_ob = ${cfg.rsiOverbought}
                        if len(rsi_vals_call) > len(rsi_vals_put):
                            new_os = max(15, ${cfg.rsiOversold} - 5)
                            lines.append(f"📉 Много ложных CALL-сигналов")
                            lines.append(f"→ RSI Oversold: <b>${cfg.rsiOversold} → {new_os}</b> (жёстче фильтр)")
                        elif len(rsi_vals_put) > len(rsi_vals_call):
                            new_ob = min(85, ${cfg.rsiOverbought} + 5)
                            lines.append(f"📈 Много ложных PUT-сигналов")
                            lines.append(f"→ RSI Overbought: <b>${cfg.rsiOverbought} → {new_ob}</b> (жёстче фильтр)")
                        if wr_t < 40:
                            new_per = ${cfg.rsiPeriod} + 2
                            lines.append(f"→ Период RSI: <b>${cfg.rsiPeriod} → {new_per}</b> (меньше шума)")
                        lines.append(f"\\n<i>Примени: /setrsi {BOT_NAME} oversold {new_os} overbought {new_ob}</i>")
                    elif strategy == "ema_cross":
                        if wr_t < 45:
                            new_fast = ${cfg.emaFast} + 2
                            new_slow = ${cfg.emaSlow} + 4
                            lines.append(f"📊 WR ниже 45% — много ложных пересечений")
                            lines.append(f"→ EMA быстрая: <b>${cfg.emaFast} → {new_fast}</b>")
                            lines.append(f"→ EMA медленная: <b>${cfg.emaSlow} → {new_slow}</b>")
                        elif wr_t > 65:
                            new_fast = max(3, ${cfg.emaFast} - 1)
                            new_slow = max(${cfg.emaFast}+3, ${cfg.emaSlow} - 2)
                            lines.append(f"✅ WR хороший, но можно ускорить сигналы")
                            lines.append(f"→ EMA быстрая: <b>${cfg.emaFast} → {new_fast}</b>")
                            lines.append(f"→ EMA медленная: <b>${cfg.emaSlow} → {new_slow}</b>")
                        else:
                            lines.append(f"✅ Параметры EMA оптимальны для текущего рынка")
                    elif strategy == "candle_pattern":
                        if wr_t < 45:
                            lines.append(f"🕯 Паттерны дают много ложных сигналов")
                            lines.append(f"→ Ограничь торговлю: /settp {BOT_NAME} {round(total_profit * 0.5, 1)}")
                            lines.append(f"→ Торгуй только 08:00–12:00 и 15:00–18:00 МСК")
                        else:
                            lines.append(f"✅ Свечные паттерны работают хорошо")
                    elif strategy == "support_resistance":
                        if wr_t < 45:
                            new_pips = ${cfg.rufusPips ?? 5} + 2
                            new_lb   = ${cfg.rufusLookback ?? 10} + 5
                            lines.append(f"🧱 Уровни часто пробиваются")
                            lines.append(f"→ RUFUS_PIPS: <b>${cfg.rufusPips ?? 5} → {new_pips}</b> (шире зона)")
                            lines.append(f"→ RUFUS_LOOKBACK: <b>${cfg.rufusLookback ?? 10} → {new_lb}</b> (надёжнее тренд)")
                        else:
                            lines.append(f"✅ Уровни Rufus работают хорошо")
                    else:
                        lines.append(_build_strat_block_with_tips())
                    tg("\\n".join(lines))
            elif cmd == "/help":
                _tg_inline(
                    f"📋 <b>Команды [{BOT_NAME}]:</b>\\n"
                    f"/start {BOT_NAME} — запустить / возобновить\\n"
                    f"/stop {BOT_NAME} — остановить\\n"
                    f"/pause {BOT_NAME} — пауза\\n"
                    f"/resume {BOT_NAME} — продолжить\\n"
                    f"/status {BOT_NAME} — статистика\\n"
                    f"/report {BOT_NAME} — отчёт за день\\n"
                    f"/reset {BOT_NAME} — сбросить статистику\\n"
                    f"/tune {BOT_NAME} — авто-тюнинг\\n"
                    f"/settp {BOT_NAME} 50 | /setsl {BOT_NAME} 20\\n"
                    f"/setreport {BOT_NAME} 21:00 — время авто-отчёта\\n"
                    f"<i>all вместо имени — все боты</i>",
                    _main_buttons()
                )
        for upd in data.get("result", []):
            cb = upd.get("callback_query")
            if cb:
                cb_data = cb.get("data", "").strip()
                cb_chat = str(cb.get("message", {}).get("chat", {}).get("id", ""))
                if cb_chat == str(TG_CHAT_ID) and cb_data:
                    import urllib.request as _ur2, json as _j2
                    parts2 = cb_data.split()
                    cmd2 = parts2[0].lower() if parts2 else ""
                    tgt2 = " ".join(parts2[1:]).lower() if len(parts2) > 1 else ""
                    for_me2 = (tgt2 == BOT_NAME.lower() or tgt2 == "all" or tgt2 == "")
                    if for_me2:
                        if cmd2 in ("/start", "/resume"):
                            _tg_paused = False; _tg_stopped = False
                            _tg_inline(f"▶️ <b>[{BOT_NAME}] возобновлён</b>", _main_buttons())
                        elif cmd2 == "/pause":
                            _tg_paused = True
                            _tg_inline(f"⏸ <b>[{BOT_NAME}] на паузе</b>", _main_buttons())
                        elif cmd2 == "/stop":
                            _tg_stopped = True
                            tg(f"🛑 <b>[{BOT_NAME}] остановлен</b>")
                        elif cmd2 == "/status":
                            wins_cb = sum(1 for t in trade_log if t["won"])
                            _tg_inline(
                                f"📊 <b>Статус [{BOT_NAME}]</b>\\n💰 Профит: {total_profit:+.2f} {CURRENCY}\\n"
                                f"📈 Сделок: {trades_today} (✅{wins_cb}/❌{trades_today-wins_cb})\\n"
                                f"{'⏸ На паузе' if _tg_paused else '▶️ Работает'}",
                                _main_buttons()
                            )
                        elif cmd2 == "/report":
                            _send_daily_report()
                    try:
                        ack_url = f"https://api.telegram.org/bot{TG_TOKEN}/answerCallbackQuery"
                        ack_payload = _j2.dumps({"callback_query_id": cb["id"]}).encode()
                        ack_req = _ur2.Request(ack_url, data=ack_payload, headers={"Content-Type": "application/json"})
                        _ur2.urlopen(ack_req, timeout=3)
                    except Exception:
                        pass
    except Exception:
        pass

# ===== СОСТОЯНИЕ =====
total_profit  = 0.0
trades_today  = 0
trade_log     = []
rejected_signals  = 0
rejected_no_trend = 0
rejected_conflict = 0
_last_report_time = 0
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
    if len(closed) < 3:
        return None
    window5 = closed[-5:] if len(closed) >= 5 else closed
    colors5 = [candle_color(c) for c in window5]
    ups5   = colors5.count("UP")
    downs5 = colors5.count("DOWN")
    cur   = candles[-1]
    bar   = "".join("🟢" if col == "UP" else "🔴" for col in colors5)
    cur_emoji = "🟢" if cur[3] >= cur[0] else "🔴"
    print(f"[СВЕЧИ] таймфрейм={CANDLE_TF}с ({CANDLE_TF//60}мин) | последние {len(colors5)} свечей: {bar} (▲{ups5}/▼{downs5}) | текущая: {cur_emoji}")
    if ups5 > downs5:
        return "UP_UP"
    if downs5 > ups5:
        return "DOWN_DOWN"
    return None

def trend_to_signal(trend):
    if trend in ("UP_UP", "DOWN_UP"):
        return "CALL"
    if trend in ("DOWN_DOWN", "UP_DOWN"):
        return "PUT"
    return None

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

_td_cache = {"candles": [], "prices": [], "ts": 0}

def fetch_candles_twelvedata():
    """Получение свежих свечей M1 с Twelve Data — обновляет сразу после закрытия новой свечи"""
    import urllib.request as _ur, json as _jj, time as _ti, math as _math
    global _td_cache
    now = _ti.time()
    # Вычисляем сколько секунд прошло с начала текущей минуты
    secs_in_minute = now % 60
    # Свеча закрывается в начале каждой минуты — обновляем в первые 5 сек новой минуты
    # или если прошло больше 60 сек с последнего обновления
    minute_now = int(now // 60)
    minute_cached = int(_td_cache["ts"] // 60) if _td_cache["ts"] else 0
    fresh = (minute_now == minute_cached) and _td_cache["candles"]
    if fresh:
        return _td_cache["candles"], _td_cache["prices"]
    try:
        url = f"https://api.twelvedata.com/time_series?symbol={TWELVE_DATA_SYMBOL}&interval=1min&outputsize=50&apikey={TWELVE_DATA_KEY}"
        req = _ur.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        data = _jj.loads(_ur.urlopen(req, timeout=10).read())
        if data.get("status") == "error":
            raise Exception(data.get("message", "TD error"))
        values = list(reversed(data.get("values", [])))
        candles = [(float(c["open"]), float(c["high"]), float(c["low"]), float(c["close"])) for c in values]
        prices  = [float(c["close"]) for c in values]
        _td_cache = {"candles": candles, "prices": prices, "ts": now}
        print(f"[CANDLES] Twelve Data: {len(prices)} свечей M1 | последняя цена: {prices[-1]:.5f}")
        return candles, prices
    except Exception as e:
        print(f"[CANDLES] Twelve Data ошибка: {e} — используем кэш")
        return _td_cache["candles"], _td_cache["prices"]

async def try_get_candles(client, asset_name):
    """Попытка получить свечи, с авто-переподключением при обрыве"""
    for attempt in range(3):
        try:
            raw = await client.get_candles(asset=asset_name, timeframe=CANDLE_TF, count=100)
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
    """Получение свечей — сначала Twelve Data, fallback на PO API"""
    if TWELVE_DATA_KEY and TWELVE_DATA_SYMBOL:
        candles, prices = fetch_candles_twelvedata()
        if candles and prices:
            return candles, prices
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
                now_ts = datetime.now().timestamp()
                sample_time = sorted_raw[-1].time
                if sample_time > 1e10:
                    closed_raw = [c for c in sorted_raw if c.time / 1000 + CANDLE_TF <= now_ts]
                else:
                    closed_raw = [c for c in sorted_raw if c.time + CANDLE_TF <= now_ts]
                if not closed_raw:
                    closed_raw = sorted_raw[:-1]
                print(f"[TIME_DEBUG] now={now_ts:.0f} last_candle_time={sorted_raw[-1].time} ms={sample_time > 1e10} candle_tf={CANDLE_TF} closed={len(closed_raw)}/{len(sorted_raw)}")
            else:
                sorted_raw = list(raw)
                closed_raw = sorted_raw[:-1]
            if not closed_raw:
                continue
            cur_candle = sorted_raw[-1]
            lc = closed_raw[-1]
            emoji = '🟢' if lc.close >= lc.open else '🔴'
            print(f"[CANDLE] Последняя закрытая: {emoji} o={lc.open:.5f} c={lc.close:.5f} | закрытых: {len(closed_raw)}")
            candles_all = [(c.open, c.high, c.low, c.close) for c in closed_raw]
            candles_all += [(cur_candle.open, cur_candle.high, cur_candle.low, cur_candle.close)]
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

async def _resolve_trade_asset(client):
    """Ищет рабочий формат актива для сделки"""
    global _resolved_asset
    if _resolved_asset:
        return _resolved_asset
    base = ASSET.replace("_otc", "").replace("#", "")
    candidates = [f"#{base}_otc", f"#{base}", f"{base}_otc", base, ASSET]
    for name in candidates:
        try:
            dir_val = OrderDirection.CALL
            order = await client.place_order(asset=name, amount=0.01, direction=dir_val, duration=60)
            _resolved_asset = name
            print(f"[ASSET] Рабочий формат: {name}")
            return name
        except Exception as e:
            if "Invalid asset" in str(e):
                continue
            _resolved_asset = name
            return name
    return ASSET

async def place_trade(client, direction, amount):
    """Открытие опциона с авто-поиском формата актива"""
    global _resolved_asset
    dir_val = OrderDirection.CALL if direction == "CALL" else OrderDirection.PUT
    base = ASSET.replace("_otc", "").replace("#", "")
    is_otc = "otc" in ASSET.lower()
    candidates_try = []
    if _resolved_asset:
        candidates_try = [_resolved_asset]
    if is_otc:
        candidates_try += [f"#{base}_otc", f"{base}_otc"]
    else:
        candidates_try += [f"#{base}", base]
    seen = []
    for trade_asset in candidates_try:
        if trade_asset in seen:
            continue
        seen.append(trade_asset)
        try:
            order = await client.place_order(asset=trade_asset, amount=amount, direction=dir_val, duration=EXPIRY_SEC)
            _resolved_asset = trade_asset
            print(f"[TRADE] {direction} | {amount} | {EXPIRY_SEC//60} мин | актив: {trade_asset} | ID: {order.order_id}")
            return order.order_id
        except Exception as e:
            if "Invalid asset" in str(e):
                print(f"[ASSET] {trade_asset} не подходит, пробуем следующий...")
                continue
            print(f"[ERROR] place_trade: {e}")
            return None
    print(f"[ERROR] place_trade: актив {ASSET} не найден ни в одном формате")
    return None
async def check_result(client, order_id, balance_before, bet):
    """Ожидание результата по конкретной сделке через get_deal (точно, не зависит от других ботов)."""
    PAYOUT = ${cfg.payoutRate} / 100
    print(f"[WAIT] Ожидаем результат...")
    try:
        for attempt in range(120):
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
                profit_val = float(profit_raw)
                won = profit_val > 0
                profit = round(profit_val, 2) if won else 0.0
                loss_amount = round(bet, 2) if not won else 0.0
                status = "ВЫИГРЫШ ✅" if won else "ПРОИГРЫШ ❌"
                print(f"[RESULT] {status} | deal.profit={profit_val} | bet={bet} | Профит: {profit}")
                return won, profit, loss_amount
            except Exception as e_inner:
                print(f"[WAIT] Попытка {attempt+1}: {e_inner}")
                await asyncio.sleep(1)
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
    print(f"[STATS] Всего сделок: {trades_today} | Профит: {total_profit:+.2f}")
    print(f"[STATS] Отклонено сигналов: {rejected_signals} (нет тренда: {rejected_no_trend}, конфликт: {rejected_conflict})\\n")

async def main():
    global total_profit, trades_today, current_bet, rejected_signals, rejected_no_trend, rejected_conflict
    global _candle_cache, _candle_asset, _last_candle_time, _last_trend
    _daily_report_scheduler()
    rejected_signals = 0
    rejected_no_trend = 0
    rejected_conflict = 0
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
    print("=" * 50 + "\\n")
    _tg_inline(
        f"🤖 <b>{BOT_NAME} запущен</b>\\n"
        f"━━━━━━━━━━━━━━━━━━━━\\n"
        f"📋 <b>Параметры сессии</b>\\n"
        f"  Счёт: {account_type}\\n"
        f"  Стратегия: <b>${strategyLabel}</b>\\n"
        f"  Актив: <b>{_resolved_asset or ASSET}</b>" + (" ✅ авто" if _resolved_asset and _resolved_asset != ASSET else "") + "\\n"
        f"  Начальный баланс: <b>{balance:.2f} {CURRENCY}</b>\\n"
        f"  Take Profit: <b>+{TAKE_PROFIT} {CURRENCY}</b>\\n"
        f"  Stop Loss: <b>-{STOP_LOSS} {CURRENCY}</b>\\n"
        f"━━━━━━━━━━━━━━━━━━━━\\n"
        f"📊 <b>Актив</b>\\n"
        f"  Инструмент: <b>{ASSET}</b>\\n"
        f"  Экспирация: <b>{EXPIRY_SEC//60} мин</b>\\n"
        f"  Начальная ставка: <b>{BASE_BET} {CURRENCY}</b>\\n"
        f"━━━━━━━━━━━━━━━━━━━━\\n"
        f"⏳ Ожидаю сигналы...",
        _main_buttons()
    )
    journal_start_session()
    _register_in_scheduler()

    _reconnect_attempts = 0
    _loss_streak = 0
    _loss_streak_pause_until = 0

    while True:
        try:
            if total_profit >= TAKE_PROFIT:
                msg = f"[TP] Take Profit достигнут: +{round(total_profit, 2)} {CURRENCY}"
                print(msg)
                wins_count = sum(1 for t in trade_log if t["won"])
                loss_count = trades_today - wins_count
                winrate = round(wins_count / trades_today * 100, 1) if trades_today > 0 else 0
                _ss_tp = {}
                for _t in trade_log:
                    _sk = str(_t.get("strategy", "${cfg.strategy}"))[:40]
                    _ss_tp.setdefault(_sk, {"w": 0, "l": 0})
                    if _t["won"]: _ss_tp[_sk]["w"] += 1
                    else: _ss_tp[_sk]["l"] += 1
                _sl_tp = "\\n".join(f"  {k}: ✅{v['w']} / ❌{v['l']}" for k, v in _ss_tp.items())
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
                    f"  Отклонено сигналов: {rejected_signals}\\n"
                    f"━━━━━━━━━━━━━━━━━━━━\\n"
                    f"🔬 <b>По сигналам:</b>\\n{_sl_tp}\\n"
                    f"━━━━━━━━━━━━━━━━━━━━"
                )
                if AUTO_RESTART:
                    total_profit = 0; trades_today = 0
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
                _ss_sl = {}
                for _t in trade_log:
                    _sk = str(_t.get("strategy", "${cfg.strategy}"))[:40]
                    _ss_sl.setdefault(_sk, {"w": 0, "l": 0})
                    if _t["won"]: _ss_sl[_sk]["w"] += 1
                    else: _ss_sl[_sk]["l"] += 1
                _sl_sl = "\\n".join(f"  {k}: ✅{v['w']} / ❌{v['l']}" for k, v in _ss_sl.items())
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
                    f"  Отклонено сигналов: {rejected_signals}\\n"
                    f"━━━━━━━━━━━━━━━━━━━━\\n"
                    f"🔬 <b>По сигналам:</b>\\n{_sl_sl}\\n"
                    f"━━━━━━━━━━━━━━━━━━━━"
                )
                if AUTO_RESTART:
                    total_profit = 0; trades_today = 0
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
                _ss_lim = {}
                for _t in trade_log:
                    _sk = str(_t.get("strategy", "${cfg.strategy}"))[:40]
                    _ss_lim.setdefault(_sk, {"w": 0, "l": 0})
                    if _t["won"]: _ss_lim[_sk]["w"] += 1
                    else: _ss_lim[_sk]["l"] += 1
                _sl_lim = "\\n".join(f"  {k}: ✅{v['w']} / ❌{v['l']}" for k, v in _ss_lim.items())
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
                    f"━━━━━━━━━━━━━━━━━━━━\\n"
                    f"🔬 <b>По сигналам:</b>\\n{_sl_lim}\\n"
                    f"━━━━━━━━━━━━━━━━━━━━"
                )
                break

            await tg_poll_commands()
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
                _ss_hr = {}
                for _t in trade_log:
                    _sk = str(_t.get("strategy", "${cfg.strategy}"))[:40]
                    _ss_hr.setdefault(_sk, {"w": 0, "l": 0})
                    if _t["won"]: _ss_hr[_sk]["w"] += 1
                    else: _ss_hr[_sk]["l"] += 1
                _sl_hr = "\\n".join(f"  {k}: ✅{v['w']} / ❌{v['l']}" for k, v in _ss_hr.items())
                tg(
                    f"⏰ <b>Авто-отчёт [{BOT_NAME}]</b>\\n"
                    f"━━━━━━━━━━━━━━━━━━━━\\n"
                    f"💰 Профит: <b>{total_profit:+.2f} {CURRENCY}</b>\\n"
                    f"📈 Сделок: {trades_today} (✅ {_wins_r} / ❌ {trades_today - _wins_r})\\n"
                    f"🎯 Винрейт: <b>{_wr_r}%</b>\\n"
                    f"━━━━━━━━━━━━━━━━━━━━\\n"
                    f"🔬 <b>По сигналам:</b>\\n{_sl_hr}\\n"
                    f"━━━━━━━━━━━━━━━━━━━━"
                )
                _last_report_time = _time.time()

            await asyncio.sleep(3)
            candles, prices = await get_candles_data(client)
            if not prices:
                await asyncio.sleep(CHECK_INTERVAL)
                continue

            try:
                import datetime as _dt
                _tick_raw = await client.get_candles(asset=_resolved_asset or ASSET, timeframe=1, count=1)
                if _tick_raw:
                    _tc = _tick_raw[-1]
                    _tick_val = float(_tc.close) if hasattr(_tc, 'close') else float(_tc[3])
                    if _tick_val > 0:
                        prices = prices[:-1] + [_tick_val]
                        _tick_ts = _dt.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
                        print(f"[PRICE] Текущая цена (1s тик): {_tick_val:.5f} (ts={_tick_ts})")
            except Exception as _e:
                print(f"[PRICE_ERR] Тик не получен: {_e}")

            _reconnect_attempts = 0

            new_trend, old_trend = check_trend_change(candles)

            trend = get_trend(candles)
            trend_sig = trend_to_signal(trend)
            signal, signal_info = get_signal(prices, candles)

            import time as _time_mod
            if TIME_FILTER_ENABLED:
                _now = datetime.now().strftime("%H:%M")
                if not (TIME_FILTER_FROM <= _now <= TIME_FILTER_TO):
                    print(f"[TIME] {_now} вне окна {TIME_FILTER_FROM}–{TIME_FILTER_TO}, ожидание...")
                    await asyncio.sleep(CHECK_INTERVAL)
                    continue

            if LOSS_STREAK_PAUSE_ENABLED and _loss_streak_pause_until > _time_mod.time():
                _left = int((_loss_streak_pause_until - _time_mod.time()) / 60)
                print(f"[PAUSE] Пауза после {LOSS_STREAK_COUNT} проигрышей подряд. Осталось ~{_left} мин.")
                await asyncio.sleep(CHECK_INTERVAL)
                continue

            if signal:
                if TRADE_DIRECTION == "call_only" and signal != "CALL":
                    print(f"[FILTER] Сигнал {signal} пропущен — фильтр: только CALL")
                    await asyncio.sleep(CHECK_INTERVAL)
                    continue
                if TRADE_DIRECTION == "put_only" and signal != "PUT":
                    print(f"[FILTER] Сигнал {signal} пропущен — фильтр: только PUT")
                    await asyncio.sleep(CHECK_INTERVAL)
                    continue
                if RSI_THRESHOLD_ENABLED and signal_info:
                    import re as _re
                    _rsi_m = _re.search(r'RSI[=:]\\s*(\\d+\\.?\\d*)', signal_info)
                    if _rsi_m:
                        _rsi_val = float(_rsi_m.group(1))
                        if signal == "CALL" and _rsi_val > RSI_THRESHOLD_OVERSOLD:
                            print(f"[RSI-THRESHOLD] RSI={_rsi_val} > {RSI_THRESHOLD_OVERSOLD}, сигнал CALL слабый, пропуск")
                            await asyncio.sleep(CHECK_INTERVAL)
                            continue
                        if signal == "PUT" and _rsi_val < RSI_THRESHOLD_OVERBOUGHT:
                            print(f"[RSI-THRESHOLD] RSI={_rsi_val} < {RSI_THRESHOLD_OVERBOUGHT}, сигнал PUT слабый, пропуск")
                            await asyncio.sleep(CHECK_INTERVAL)
                            continue
                if EMA_TREND_FILTER and len(prices) >= 200:
                    _ema200 = sum(prices[-200:]) / 200
                    _price_now = prices[-1]
                    if signal == "CALL" and _price_now < _ema200:
                        print(f"[EMA200] Цена {_price_now:.5f} < EMA200 {_ema200:.5f}, CALL отвергнут")
                        rejected_signals += 1
                        await asyncio.sleep(CHECK_INTERVAL)
                        continue
                    if signal == "PUT" and _price_now > _ema200:
                        print(f"[EMA200] Цена {_price_now:.5f} > EMA200 {_ema200:.5f}, PUT отвергнут")
                        rejected_signals += 1
                        await asyncio.sleep(CHECK_INTERVAL)
                        continue
                if CANDLE_CONFIRM_ENABLED and len(candles) >= CANDLE_CONFIRM_COUNT + 1:
                    _conf_candles = candles[-(CANDLE_CONFIRM_COUNT + 1):-1]
                    _conf_colors = ["UP" if c[3] >= c[0] else "DOWN" for c in _conf_candles]
                    _conf_emojis = "".join("🟢" if col == "UP" else "🔴" for col in _conf_colors)
                    _expected = "UP" if signal == "CALL" else "DOWN"
                    if not all(c == _expected for c in _conf_colors):
                        print(f"[CANDLE-CONFIRM] Нет {CANDLE_CONFIRM_COUNT} свечей подряд для {signal} | свечи: {_conf_emojis} | сигнал отклонён")
                        rejected_signals += 1
                        await asyncio.sleep(CHECK_INTERVAL)
                        continue
                    print(f"[CANDLE-CONFIRM] ✅ {CANDLE_CONFIRM_COUNT} свечей подтверждают {signal} | {_conf_emojis}")

            if signal:
                if BET_PERCENT:
                    balance, currency = await get_balance(client)
                    CURRENCY = currency
                    bet = round(balance * (BASE_BET / 100), 2)
                else:
                    balance, currency = await get_balance(client)
                    CURRENCY = currency
                    bet = current_bet

                if INVERT_SIGNAL:
                    signal = "PUT" if signal == "CALL" else "CALL"
                emoji = "📈" if signal == "CALL" else "📉"
                if len(candles) >= 6:
                    _last5 = candles[-6:-1]
                    _cur   = candles[-1]
                    _emojis = "".join("🟢" if c[3] >= c[0] else "🔴" for c in _last5)
                    _cur_e  = "🟢" if _cur[3] >= _cur[0] else "🔴"
                    _ups = sum(1 for c in _last5 if c[3] >= c[0])
                    _dns = 5 - _ups
                    _cur_up = 1 if _cur[3] >= _cur[0] else 0
                    _ups6 = _ups + _cur_up
                    _dns6 = 6 - _ups6
                    print(f"[СВЕЧИ] последние 5: {_emojis} (▲{_ups}/▼{_dns}) | текущая: {_cur_e} | → {signal}")
                if signal_info:
                    print(f"[SIGNAL] {signal_info}")
                sig_line = f"📊 Сигнал: {signal_info}" if signal_info else ""
                _candle_line = ""
                if len(candles) >= 6:
                    _candle_line = f"🕯 {_emojis}{_cur_e} (▲{_ups6}/▼{_dns6})"
                tg_parts = [f"{emoji} <b>[{BOT_NAME}] Сделка открыта</b>", f"{signal} | {bet} {currency} | {ASSET} | {EXPIRY_SEC//60} мин"]
                if _candle_line:
                    tg_parts.append(_candle_line)
                if sig_line:
                    tg_parts.append(sig_line)
                tg_parts.append(f"📋 Сделок сегодня: {trades_today + 1}")
                import time as _ts_t; _last_signal_time = _ts_t.time(); _no_signal_alert_sent = False
                tg("\\n".join(tg_parts))
                balance_before, _ = await get_balance(client)
                order_id = await place_trade(client, signal, bet)
                if order_id:
                    won, profit, loss_amount = await check_result(client, order_id, balance_before, bet)
                    _update_daily_stats(won, profit, loss_amount)
                    total_profit += profit - loss_amount
                    trades_today += 1
                    current_bet   = adjust_bet(won)
                    trade_log.append({
                        "time": datetime.now().strftime("%H:%M:%S"),
                        "direction": signal,
                        "amount": bet,
                        "won": won,
                        "profit": profit,
                        "strategy": signal_info or "${cfg.strategy}",
                    })
                    journal_log_trade(signal, bet, PAYOUT_RATE, won, strategy_name="${cfg.comboMode ? "combo" : cfg.strategy}", indicator_value=signal_info or "")
                    wins  = sum(1 for t in trade_log if t["won"])
                    wr    = wins / len(trade_log) * 100
                    res_emoji = "✅" if won else "❌"
                    _tg_inline(
                        f"{res_emoji} <b>[{BOT_NAME}] {'Выигрыш' if won else 'Проигрыш'}</b>\\n"
                        f"{signal} | {bet} {currency} | {ASSET}\\n"
                        f"Профит: {profit:+.2f} {currency}\\n"
                        f"Сессия: {total_profit:+.2f} {currency} | WR: {wr:.0f}% ({wins}/{len(trade_log)})",
                        _main_buttons()
                    )
                    print_stats()
                    if LOSS_STREAK_PAUSE_ENABLED:
                        if won:
                            _loss_streak = 0
                        else:
                            _loss_streak += 1
                            if _loss_streak >= LOSS_STREAK_COUNT:
                                _loss_streak_pause_until = _time_mod.time() + LOSS_STREAK_PAUSE_MIN * 60
                                _loss_streak = 0
                                tg(f"⏸ <b>[{BOT_NAME}] Пауза {LOSS_STREAK_PAUSE_MIN} мин</b> — {LOSS_STREAK_COUNT} проигрышей подряд")
                                print(f"[PAUSE] {LOSS_STREAK_COUNT} проигрышей подряд — пауза {LOSS_STREAK_PAUSE_MIN} мин")
            else:
                ts = datetime.now().strftime("%H:%M:%S")
                reason = f" ({signal_info})" if signal_info else ""
                print(f"[{ts}] Нет сигнала{reason} | ожидание {CHECK_INTERVAL} сек...")
                import time as _ta
                if _ta.time() - _last_signal_time > 1800 and not _no_signal_alert_sent:
                    _no_signal_alert_sent = True
                    _tg_inline(
                        f"⚠️ <b>[{BOT_NAME}] Нет сигналов 30 минут</b>\\n"
                        f"Бот работает, но сигналы отсутствуют.\\n"
                        f"Проверь актив или условия рынка.",
                        _main_buttons()
                    )
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

    journal_end_session()
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

def adjust_bet(won):
    global current_bet, loss_streak
    if won:
        current_bet = BASE_BET
        loss_streak = 0
    else:
        loss_streak += 1
        if loss_streak <= ${cfg.martingaleSteps}:
            current_bet = round(current_bet * ${cfg.martingaleMultiplier}, 2)
        else:
            current_bet = BASE_BET
            loss_streak = 0
    return current_bet
`
    : `
current_bet = BASE_BET

def adjust_bet(won):
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

def signal_trend(prices, candles):
    if len(candles) < 3:
        return None, ""
    last3 = candles[-4:-1]
    colors = ["UP" if c[3] >= c[0] else "DOWN" for c in last3]
    if all(c == "UP" for c in colors):
        return "CALL", f"ТРЕНД✅ 3🟢 подряд→CALL"
    if all(c == "DOWN" for c in colors):
        return "PUT", f"ТРЕНД✅ 3🔴 подряд→PUT"
    return None, f"ТРЕНД: нет 3 подряд"

def signal_rsi(prices, candles):
    rsi = calculate_rsi(prices)
    if rsi <= ${cfg.rsiOversold}: return "CALL", f"RSI={rsi:.1f}≤${cfg.rsiOversold}"
    if rsi >= ${cfg.rsiOverbought}: return "PUT", f"RSI={rsi:.1f}≥${cfg.rsiOverbought}"
    return None, f"RSI={rsi:.1f}"`)
    callLines.push("signal_rsi(prices, candles)")
  }

  if (selected.includes("ema_cross")) {
    fnBlocks.push(`
def calculate_ema(prices, period):
    k = 2 / (period + 1)
    ema = [prices[0]]
    for p in prices[1:]:
        ema.append(p * k + ema[-1] * (1 - k))
    return ema

def signal_ema(prices, candles):
    if len(prices) < ${cfg.emaSlow} + 2:
        return None, ""
    fast = calculate_ema(prices, ${cfg.emaFast})
    slow = calculate_ema(prices, ${cfg.emaSlow})
    info = f"EMA${cfg.emaFast}={fast[-1]:.5f}/EMA${cfg.emaSlow}={slow[-1]:.5f}"
    if fast[-1] > slow[-1] and fast[-2] <= slow[-2]: return "CALL", f"{info}↑"
    if fast[-1] < slow[-1] and fast[-2] >= slow[-2]: return "PUT", f"{info}↓"
    return None, info`)
    callLines.push("signal_ema(prices, candles)")
  }

  if (selected.includes("candle_pattern")) {
    fnBlocks.push(`
def signal_candle_pattern(prices, candles):
    if not candles or len(candles) < 3:
        return None, ""
    o1, h1, l1, c1 = candles[-2]
    o2, h2, l2, c2 = candles[-1]
    body2 = abs(c2 - o2)
    low_sh = min(o2, c2) - l2
    up_sh  = h2 - max(o2, c2)
    if low_sh > body2 * 2 and up_sh < body2 * 0.5 and c1 < o1: return "CALL", "Молот🔨"
    if up_sh > body2 * 2 and low_sh < body2 * 0.5 and c1 > o1: return "PUT", "Звезда⭐"
    if c1 < o1 and c2 > o2 and c2 > o1 and o2 < c1: return "CALL", "Поглощение🟢"
    if c1 > o1 and c2 < o2 and c2 < o1 and o2 > c1: return "PUT", "Поглощение🔴"
    return None, "Нет паттерна"`)
    callLines.push("signal_candle_pattern(prices, candles)")
  }

  if (selected.includes("support_resistance")) {
    fnBlocks.push(`
# Rufus — уровни в комбо
_RUFUS_PIPS     = ${cfg.rufusPips ?? 5}
_RUFUS_LOOKBACK = ${cfg.rufusLookback ?? 10}
_RUFUS_STEP     = ${cfg.rufusStep ?? 0.01}
_RUFUS_PIP_SIZE = ${getPipSize(cfg.asset, cfg.rufusPipSize ?? null)}

def _rufus_levels(price):
    step = _RUFUS_STEP
    lower = round(int(price / step) * step, 5)
    return lower, round(lower + step, 5)

def signal_support_resistance(prices, candles):
    if len(prices) < _RUFUS_LOOKBACK + 2:
        return None, ""
    cur = prices[-1]
    pip = _RUFUS_PIP_SIZE
    thr = _RUFUS_PIPS * pip
    lower, upper = _rufus_levels(cur)
    for level in [lower, upper]:
        if abs(cur - level) <= thr:
            past_avg = sum(prices[-_RUFUS_LOOKBACK-1:-1]) / _RUFUS_LOOKBACK
            if past_avg > level and cur <= level + thr:
                return "CALL", f"[RUFUS] {cur:.5f}→{level:.4f} сверху→CALL"
            elif past_avg < level and cur >= level - thr:
                return "PUT", f"[RUFUS] {cur:.5f}→{level:.4f} снизу→PUT"
    return None, f"[RUFUS] {cur:.5f} далеко от {lower:.4f}/{upper:.4f}"`)
    callLines.push("signal_support_resistance(prices, candles)")
  }

  const trendN = cfg.trendCandlesEnabled ? (cfg.trendCandlesCount ?? 3) : 3
  const trendEmoji = "🟢".repeat(trendN)
  const trendEmojiRed = "🔴".repeat(trendN)
  const trendEnabled = cfg.trendCandlesEnabled

  const combineLogic = cfg.comboLogic === "AND"
    ? `
TREND_CANDLES_ENABLED = ${trendEnabled ? "True" : "False"}
TREND_CANDLES_COUNT = ${trendN}

def get_trend_Ncandles(candles):
    """${trendN} свечи одного цвета подряд"""
    if not TREND_CANDLES_ENABLED:
        return "ANY", "ТРЕНД: отключён"
    if len(candles) < TREND_CANDLES_COUNT + 1:
        return None, "ТРЕНД: мало свечей"
    lastN = candles[-(TREND_CANDLES_COUNT + 1):-1]
    colors = ["UP" if c[3] >= c[0] else "DOWN" for c in lastN]
    if all(c == "UP" for c in colors):
        return "CALL", f"ТРЕНД${trendEmoji}→CALL"
    if all(c == "DOWN" for c in colors):
        return "PUT", f"ТРЕНД${trendEmojiRed}→PUT"
    return None, f"ТРЕНД: нет {TREND_CANDLES_COUNT} подряд"

def get_combined_signal(prices, candles):
    """Комбо AND + тренд — стратегия должна совпасть с трендом (${trendN} свечи)"""
    fns = [${callLines.map(l => l.replace(/\(.*\)/, '')).join(", ")}]
    results = [f(prices, candles) for f in fns]
    trend_sig, trend_info = get_trend_Ncandles(candles)
    signals = [(s, i) for s, i in results if s is not None]
    majority = (${selected.length} // 2) + 1
    calls = [(s, i) for s, i in signals if s == "CALL"]
    puts  = [(s, i) for s, i in signals if s == "PUT"]
    print(f"[СТРАТЕГИИ] CALL={len(calls)}/${selected.length} PUT={len(puts)}/${selected.length} | нужно {majority} | ТРЕНД={trend_sig} | " + " | ".join(i for _, i in results if i))
    if len(calls) >= majority:
        if trend_sig in ("CALL", "ANY"):
            info = "AND✅ " + " | ".join(i for _, i in calls if i) + (" | " + trend_info if trend_sig != "ANY" else "")
            return "CALL", info
        else:
            print(f"[ТРЕНД] Сигнал CALL заблокирован — тренд {trend_sig} ({trend_info})")
            return None, " | ".join(i for _, i in calls if i) + " | " + trend_info
    if len(puts) >= majority:
        if trend_sig in ("PUT", "ANY"):
            info = "AND✅ " + " | ".join(i for _, i in puts if i) + (" | " + trend_info if trend_sig != "ANY" else "")
            return "PUT", info
        else:
            print(f"[ТРЕНД] Сигнал PUT заблокирован — тренд {trend_sig} ({trend_info})")
            return None, " | ".join(i for _, i in puts if i) + " | " + trend_info
    all_info = " | ".join(i for _, i in results if i) + " | " + trend_info
    return None, all_info  # Нет большинства`
    : `
TREND_CANDLES_ENABLED = ${trendEnabled ? "True" : "False"}
TREND_CANDLES_COUNT = ${trendN}

def get_trend_Ncandles(candles):
    """${trendN} свечи одного цвета подряд"""
    if not TREND_CANDLES_ENABLED:
        return "ANY", "ТРЕНД: отключён"
    if len(candles) < TREND_CANDLES_COUNT + 1:
        return None, "ТРЕНД: мало свечей"
    lastN = candles[-(TREND_CANDLES_COUNT + 1):-1]
    colors = ["UP" if c[3] >= c[0] else "DOWN" for c in lastN]
    if all(c == "UP" for c in colors):
        return "CALL", f"ТРЕНД${trendEmoji}→CALL"
    if all(c == "DOWN" for c in colors):
        return "PUT", f"ТРЕНД${trendEmojiRed}→PUT"
    return None, f"ТРЕНД: нет {TREND_CANDLES_COUNT} подряд"

def get_combined_signal(prices, candles):
    """Комбо OR + тренд — достаточно одной стратегии + совпадение тренда (${trendN} свечи)"""
    fns = [${callLines.map(l => l.replace(/\(.*\)/, '')).join(", ")}]
    results = [f(prices, candles) for f in fns]
    trend_sig, trend_info = get_trend_Ncandles(candles)
    signals = [(s, i) for s, i in results if s is not None]
    calls = [(s, i) for s, i in signals if s == "CALL"]
    puts  = [(s, i) for s, i in signals if s == "PUT"]
    print(f"[СТРАТЕГИИ] CALL={len(calls)}/${selected.length} PUT={len(puts)}/${selected.length} | ТРЕНД={trend_sig} | " + " | ".join(i for _, i in results if i))
    if not signals:
        all_info = " | ".join(i for _, i in results if i) + " | " + trend_info
        return None, all_info
    if len(calls) > len(puts):
        if trend_sig in ("CALL", "ANY"):
            info = "OR✅ " + " | ".join(i for _, i in calls if i) + (" | " + trend_info if trend_sig != "ANY" else "")
            return "CALL", info
        else:
            print(f"[ТРЕНД] Сигнал CALL заблокирован — тренд {trend_sig} ({trend_info})")
            return None, " | ".join(i for _, i in calls if i) + " | " + trend_info
    if len(puts) > len(calls):
        if trend_sig in ("PUT", "ANY"):
            info = "OR✅ " + " | ".join(i for _, i in puts if i) + (" | " + trend_info if trend_sig != "ANY" else "")
            return "PUT", info
        else:
            print(f"[ТРЕНД] Сигнал PUT заблокирован — тренд {trend_sig} ({trend_info})")
            return None, " | ".join(i for _, i in puts if i) + " | " + trend_info
    all_info = " | ".join(i for _, i in results if i) + " | " + trend_info
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

  return (
`#!/usr/bin/env python3
"""
Pocket Option КОМБО-Бот
Сгенерировано: TradeBase Bot Builder

════════════════════════════════════════
  КОНФИГУРАЦИЯ БОТА
════════════════════════════════════════
  Стратегии  : ${labels}
  Логика     : ${cfg.comboLogic} — ${logicWord}
  Актив      : ${comboAssetSymbol}
  Экспирация : ${cfg.expiry} мин
  Ставка     : ${cfg.betAmount}${cfg.betPercent ? "% от баланса" : " " + cfg.currency}
  Режим      : ${cfg.isDemo ? "ДЕМО-СЧЁТ" : "РЕАЛЬНЫЙ СЧЁТ"}

  Take Profit: ${cfg.takeProfitRub} ${cfg.currency}
  Stop Loss  : ${cfg.stopLossRub} ${cfg.currency}
  Лимит/день : ${cfg.dailyLimit} сделок
  Мартингейл : ${cfg.martingaleEnabled ? `x${cfg.martingaleMultiplier} до ${cfg.martingaleSteps} шагов` : "выкл"}
════════════════════════════════════════

Установка зависимостей:
    pip install pocketoptionapi-async PySocks
"""

import asyncio
import os
from datetime import datetime
from pocketoptionapi_async import AsyncPocketOptionClient, OrderDirection

# ===== НАСТРОЙКИ =====
ASSET        = "${comboAssetSymbol}"
EXPIRY_SEC   = ${String(parseInt(cfg.expiry) * 60)}
CANDLE_TF    = 60
TWELVE_DATA_KEY = os.environ.get("TWELVE_DATA_KEY", "c7268bb91057482d9e78c17a85ea45fb")
TWELVE_DATA_SYMBOL = "${(() => { const s = comboAssetSymbol.replace(/_otc$/,'').replace(/^#/,'').toUpperCase(); if (s.endsWith('USDT')) return s.replace('USDT','/USD'); const m = s.match(/^([A-Z]{3})([A-Z]{3})$/); return m ? m[1]+'/'+m[2] : s; })()}"
BASE_BET     = ${cfg.betAmount}
BET_PERCENT  = ${cfg.betPercent ? "True" : "False"}
IS_DEMO      = ${cfg.isDemo ? "True" : "False"}
CURRENCY     = "${cfg.currency}"
TAKE_PROFIT  = ${cfg.takeProfitRub}
STOP_LOSS    = ${cfg.stopLossRub}
DAILY_LIMIT  = ${cfg.dailyLimit}
CANDLE_CONFIRM_ENABLED = ${cfg.candleConfirmEnabled ? "True" : "False"}
CANDLE_CONFIRM_COUNT   = ${cfg.candleConfirmCount ?? 3}
AUTO_RESTART     = ${cfg.autoRestart ? "True" : "False"}
MARTINGALE       = ${cfg.martingaleEnabled ? "True" : "False"}
MARTINGALE_MULT  = ${cfg.martingaleMultiplier}
MARTINGALE_STEPS = ${cfg.martingaleSteps}

CHECK_INTERVAL   = ${cfg.checkInterval}      # Интервал проверки сигнала (сек)
TRADE_DIRECTION  = "${cfg.tradeDirection ?? "all"}"
TREND_MODE       = "same"

TIME_FILTER_ENABLED   = ${cfg.timeFilterEnabled ? "True" : "False"}
TIME_FILTER_FROM      = "${cfg.timeFilterFrom ?? "09:00"}"
TIME_FILTER_TO        = "${cfg.timeFilterTo ?? "21:00"}"

RSI_THRESHOLD_ENABLED    = ${cfg.rsiThresholdEnabled ? "True" : "False"}
RSI_THRESHOLD_OVERSOLD   = ${cfg.rsiThresholdOversold ?? 25}
RSI_THRESHOLD_OVERBOUGHT = ${cfg.rsiThresholdOverbought ?? 75}

LOSS_STREAK_PAUSE_ENABLED = ${cfg.lossStreakPauseEnabled ? "True" : "False"}
LOSS_STREAK_COUNT         = ${cfg.lossStreakCount ?? 3}
LOSS_STREAK_PAUSE_MIN     = ${cfg.lossStreakPauseMin ?? 30}

EMA_TREND_FILTER = ${cfg.emaTrendFilterEnabled ? "True" : "False"}

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
TG_PROXY        = "${cfg.tgProxy}"
TG_SEND_MODE    = "${cfg.tgSendMode ?? "server"}"
TG_SERVER_URL   = "https://functions.poehali.dev/fb70e0a6-b6c1-49e2-b148-c37dab50f024"
TG_NOTIFY_MODE  = "${cfg.tgNotifyMode ?? "all"}"
TG_DAILY_REPORT = ${cfg.tgDailyReport ? "True" : "False"}
TG_DAILY_REPORT_TIME = "${cfg.tgDailyReportTime ?? "22:00"}"
INVERT_SIGNAL            = ${cfg.invertSignal ? "True" : "False"}
INVERT_SIGNAL_RSI        = ${cfg.invertSignalRsi ? "True" : "False"}
INVERT_SIGNAL_EMA        = ${cfg.invertSignalEma ? "True" : "False"}
INVERT_SIGNAL_CANDLE     = ${cfg.invertSignalCandle ? "True" : "False"}
INVERT_SIGNAL_RUFUS      = ${cfg.invertSignalRufus ? "True" : "False"}
INVERT_SIGNAL_MARTINGALE = ${cfg.invertSignalMartingale ? "True" : "False"}

# ===== ЖУРНАЛ СДЕЛОК =====
JOURNAL_URL = "https://functions.poehali.dev/317c9913-52da-4683-920f-963c978a3202"
REPORT_SCHEDULER_URL = "https://functions.poehali.dev/26bda9fa-84ca-4013-9943-a0e23f0cebc2"
_session_id = None

def _journal_request(path, method="POST", data=None, _retry=2):
    import urllib.request, json as _json, time as _time
    url = JOURNAL_URL + path
    body = _json.dumps(data or {}).encode()
    for attempt in range(_retry):
        try:
            req = urllib.request.Request(url, data=body, headers={"Content-Type": "application/json"}, method=method)
            resp = urllib.request.urlopen(req, timeout=15).read()
            return _json.loads(resp)
        except Exception as e:
            if attempt < _retry - 1:
                _time.sleep(2)
            else:
                print(f"[JOURNAL] Ошибка: {e}")
    return {}

def journal_start_session():
    global _session_id
    result = _journal_request("/session", data={
        "bot_name": BOT_NAME,
        "strategy": "combo",
        "asset": ASSET,
        "bet_amount": BASE_BET,
        "currency": CURRENCY,
        "is_demo": IS_DEMO,
    })
    _session_id = result.get("session_id")
    if _session_id:
        print(f"[JOURNAL] Сессия создана: {_session_id}")

def journal_log_trade(direction, bet, payout_pct, won, strategy_name=None, indicator_value=None):
    if not _session_id:
        return
    import threading
    threading.Thread(
        target=_journal_request,
        args=("",),
        kwargs={"data": {
            "action": "trade",
            "session_id": _session_id,
            "asset": ASSET,
            "direction": direction,
            "bet": bet,
            "payout_pct": payout_pct,
            "won": won,
            "strategy_name": strategy_name,
            "indicator_value": indicator_value,
        }},
        daemon=True
    ).start()

def journal_end_session():
    if not _session_id:
        return
    _journal_request("", method="POST", data={"action": "end", "session_id": _session_id})

_tg_auto_proxies = []
_tg_auto_proxies_ts = 0

def _fetch_auto_proxies():
    import urllib.request, json, time
    global _tg_auto_proxies, _tg_auto_proxies_ts
    if time.time() - _tg_auto_proxies_ts < 600 and _tg_auto_proxies:
        return _tg_auto_proxies
    result = []
    try:
        r = urllib.request.urlopen("https://api.proxyscrape.com/v2/?request=displayproxies&protocol=socks5&timeout=3000&country=all&ssl=all&anonymity=all&limit=30", timeout=8)
        for line in r.read().decode().splitlines():
            line = line.strip()
            if line and ":" in line:
                result.append(f"socks5://{line}")
    except Exception:
        pass
    try:
        r2 = urllib.request.urlopen("https://api.proxyscrape.com/v2/?request=displayproxies&protocol=http&timeout=3000&country=all&ssl=all&anonymity=all&limit=20", timeout=8)
        for line in r2.read().decode().splitlines():
            line = line.strip()
            if line and ":" in line:
                result.append(f"http://{line}")
    except Exception:
        pass
    if result:
        _tg_auto_proxies = result
        _tg_auto_proxies_ts = time.time()
        print(f"[TG] Загружено {len(result)} авто-прокси")
    return result

def _apply_proxy(proxy_url):
    import socket
    from urllib.parse import urlparse as _up
    p = _up(proxy_url)
    scheme = p.scheme.lower()
    if scheme in ("socks5", "socks4"):
        import socks
        _type = socks.SOCKS5 if scheme == "socks5" else socks.SOCKS4
        socks.set_default_proxy(_type, p.hostname, p.port, username=p.username, password=p.password)
        socket.socket = socks.socksocket
    elif scheme in ("http", "https"):
        import socks
        socks.set_default_proxy(socks.HTTP, p.hostname, p.port, username=p.username, password=p.password)
        socket.socket = socks.socksocket

def _tg_send(text, retries=2, delay=3):
    import urllib.request, urllib.parse, json as _json, time, socket as _socket
    if TG_SEND_MODE == "server":
        payload = _json.dumps({"token": TG_TOKEN, "chat_id": TG_CHAT_ID, "text": text}).encode()
        req = urllib.request.Request(TG_SERVER_URL, data=payload, headers={"Content-Type": "application/json"}, method="POST")
        for attempt in range(1, retries + 1):
            try:
                resp = urllib.request.urlopen(req, timeout=10)
                result = _json.loads(resp.read().decode())
                if result.get("ok"):
                    print("[TG] Отправлено через сервер ✓")
                    return
            except Exception:
                if attempt < retries:
                    time.sleep(delay)
        print("[TG] Не удалось отправить через сервер")
        return
    url = f"https://api.telegram.org/bot{TG_TOKEN}/sendMessage"
    data = urllib.parse.urlencode({"chat_id": TG_CHAT_ID, "text": text, "parse_mode": "HTML"}).encode()
    _user_proxies = [p.strip() for p in TG_PROXY.split(",") if p.strip()] if TG_PROXY else []
    _auto = _fetch_auto_proxies()
    _all_proxies = _user_proxies + [p for p in _auto if p not in _user_proxies]
    _orig_socket = _socket.socket
    def _reset_socket():
        try:
            _socket.socket = _orig_socket
        except Exception:
            pass
    for proxy in (_all_proxies + [None]):
        if proxy:
            try:
                _apply_proxy(proxy)
            except Exception:
                _reset_socket()
                continue
        else:
            _reset_socket()
        for attempt in range(1, retries + 1):
            try:
                urllib.request.urlopen(url, data, timeout=6)
                if proxy is None and _all_proxies:
                    print("[TG] Все прокси недоступны, отправлено напрямую ✓")
                else:
                    print(f"[TG] Отправлено через {proxy.split('@')[-1]} ✓")
                _reset_socket()
                return
            except Exception:
                if attempt < retries:
                    time.sleep(delay)
        if proxy:
            print(f"[TG] Прокси не работает, пробую следующий: {proxy.split('@')[-1]}")
            _reset_socket()
    print("[TG] Не удалось отправить уведомление ни через один прокси и напрямую")

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

_daily_stats = {"total": 0, "wins": 0, "losses": 0, "profit": 0.0, "max_win_streak": 0, "max_loss_streak": 0, "_cur_win": 0, "_cur_loss": 0}
_last_signal_time = __import__("time").time()
_no_signal_alert_sent = False

def _tg_inline(text, buttons):
    """Отправить сообщение с inline-кнопками"""
    if not TG_ENABLED:
        return
    import urllib.request, json as _json
    payload = _json.dumps({
        "chat_id": TG_CHAT_ID,
        "text": text,
        "parse_mode": "HTML",
        "reply_markup": {"inline_keyboard": buttons}
    }).encode()
    try:
        req = urllib.request.Request(
            f"https://api.telegram.org/bot{TG_TOKEN}/sendMessage",
            data=payload, headers={"Content-Type": "application/json"}
        )
        urllib.request.urlopen(req, timeout=5)
    except Exception:
        tg(text)

def _main_buttons():
    return [[
        {"text": "▶️ Старт",  "callback_data": f"/start {BOT_NAME}"},
        {"text": "⏸ Пауза",  "callback_data": f"/pause {BOT_NAME}"},
        {"text": "🛑 Стоп",   "callback_data": f"/stop {BOT_NAME}"}
    ],[
        {"text": "📊 Статус", "callback_data": f"/status {BOT_NAME}"},
        {"text": "📋 Отчёт", "callback_data": f"/report {BOT_NAME}"},
        {"text": "🔧 Тюнинг","callback_data": f"/tune {BOT_NAME}"}
    ]]

def _update_daily_stats(won, profit_val, loss_val):
    s = _daily_stats
    s["total"] += 1
    if won:
        s["wins"] += 1
        s["profit"] += profit_val
        s["_cur_win"] += 1
        s["_cur_loss"] = 0
        if s["_cur_win"] > s["max_win_streak"]:
            s["max_win_streak"] = s["_cur_win"]
    else:
        s["losses"] += 1
        s["profit"] -= loss_val
        s["_cur_win"] = 0
        s["_cur_loss"] += 1
        if s["_cur_loss"] > s["max_loss_streak"]:
            s["max_loss_streak"] = s["_cur_loss"]

def _get_strategy_recommendation(strategy_key):
    """Рекомендация по корректировке параметров стратегии"""
    s = strategy_key or ""
    if "RSI" in s or "${cfg.strategy}" == "rsi_reversal":
        return (
            "💡 Рекомендации:\\n"
            "  — Если много ложных сигналов CALL: повысьте RSI oversold ${cfg.rsiOversold} → попробуйте ${cfg.rsiOversold - 5}\\n"
            "  — Если много ложных сигналов PUT: понизьте RSI overbought ${cfg.rsiOverbought} → попробуйте ${cfg.rsiOverbought + 5}\\n"
            "  — Или увеличьте период RSI ${cfg.rsiPeriod} → ${cfg.rsiPeriod + 2} для фильтрации шума"
        )
    elif "EMA" in s or "${cfg.strategy}" == "ema_cross":
        return (
            "💡 Рекомендации:\\n"
            "  — Много ложных пересечений? Увеличьте разрыв: EMA быстрая ${cfg.emaFast}→${cfg.emaFast + 3}, медленная ${cfg.emaSlow}→${cfg.emaSlow + 5}\\n"
            "  — Сигналы запаздывают? Уменьшите периоды: ${cfg.emaFast}→${cfg.emaFast - 2} / ${cfg.emaSlow}→${cfg.emaSlow - 3}\\n"
            "  — Попробуйте добавить фильтр по RSI чтобы отсеять боковик"
        )
    elif "Паттерн" in s or "${cfg.strategy}" == "candle_pattern":
        return (
            "💡 Рекомендации:\\n"
            "  — Паттерны дают ложные сигналы? Торгуйте только в направлении тренда EMA\\n"
            "  — Уменьшите экспирацию — свечные паттерны лучше работают на коротких таймфреймах\\n"
            "  — Ограничьте торговлю часами высокой волатильности (08:00–12:00, 14:00–18:00 МСК)"
        )
    elif "RUFUS" in s or "${cfg.strategy}" == "support_resistance":
        return (
            "💡 Рекомендации:\\n"
            "  — Много пробоев уровней? Увеличьте RUFUS_PIPS ${cfg.rufusPips ?? 5} → ${(cfg.rufusPips ?? 5) + 2}\\n"
            "  — Слишком редкие сигналы? Уменьшите RUFUS_PIPS → ${Math.max(2, (cfg.rufusPips ?? 5) - 1)}\\n"
            "  — Увеличьте RUFUS_LOOKBACK ${cfg.rufusLookback ?? 10} → ${(cfg.rufusLookback ?? 10) + 5} для более надёжного определения тренда"
        )
    elif "комбо" in s.lower() or "${cfg.strategy}" == "combo":
        return (
            "💡 Рекомендации:\\n"
            "  — Переключитесь с AND на OR логику для большего числа сигналов\\n"
            "  — Уберите наименее эффективную стратегию из комбо\\n"
            "  — Проверьте каждую стратегию отдельно чтобы найти слабое звено"
        )
    else:
        return (
            "💡 Рекомендации:\\n"
            "  — Попробуйте другую стратегию или актив\\n"
            "  — Проверьте настройки экспирации и размера ставки"
        )

def _build_strat_block_with_tips():
    """Блок анализа по стратегиям с рекомендациями"""
    strat_stats: dict = {}
    for t in trade_log:
        key = t.get("strategy", "—")
        if key not in strat_stats:
            strat_stats[key] = {"wins": 0, "losses": 0}
        if t["won"]:
            strat_stats[key]["wins"] += 1
        else:
            strat_stats[key]["losses"] += 1
    lines = []
    tips = []
    for strat, st in strat_stats.items():
        strat_label = strat.split("(")[0].strip() if strat else "—"
        total = st["wins"] + st["losses"]
        wr = round(st["wins"] / total * 100) if total > 0 else 0
        if st["losses"] > st["wins"]:
            verdict = "⚠️ корректировка"
            tips.append(_get_strategy_recommendation(strat))
        else:
            verdict = "✅ ок"
        lines.append(f"  • {strat_label}: {st['wins']}W/{st['losses']}L ({wr}%) — {verdict}")
    block = "\\n".join(lines) if lines else "  нет данных"
    tips_block = "\\n\\n" + "\\n\\n".join(tips) if tips else ""
    return block + tips_block

def _register_in_scheduler(report_time=None):
    """Регистрирует бота в серверном планировщике для авто-отчётов"""
    if not TG_ENABLED:
        return
    try:
        import urllib.request as _ur, json as _jj
        payload = _jj.dumps({
            "action": "register",
            "tg_token": TG_TOKEN,
            "tg_chat_id": str(TG_CHAT_ID),
            "journal_url": JOURNAL_URL,
            "report_time": report_time or TG_DAILY_REPORT_TIME,
        }).encode()
        req = _ur.Request(
            REPORT_SCHEDULER_URL,
            data=payload, headers={"Content-Type": "application/json"}
        )
        _ur.urlopen(req, timeout=6)
        print(f"[SCHEDULER] Зарегистрирован, отчёт в {report_time or TG_DAILY_REPORT_TIME}")
    except Exception as e:
        print(f"[SCHEDULER] Ошибка регистрации: {e}")

def _send_all_bots_report():
    """Сводный отчёт по всем ботам за сегодня — запрашивает данные с сервера"""
    try:
        import urllib.request as _ur, json as _jj
        url = JOURNAL_URL + "/report/today"
        req = _ur.Request(url, headers={"Content-Type": "application/json"})
        resp = _ur.urlopen(req, timeout=8)
        data = _jj.loads(resp.read().decode())
        bots = data.get("bots", [])
        sm = data.get("summary", {})
        if not bots:
            _tg_inline("📊 <b>Сводка по всем ботам</b>\\n\\nСегодня сделок не было.", _main_buttons())
            return
        lines = ["📊 <b>Сводка за сегодня — все боты</b>", "━━━━━━━━━━━━━━━━━━"]
        for b in bots:
            wr = round(b["wins"] / b["total"] * 100) if b["total"] > 0 else 0
            pnl_e = "🟢" if b["profit"] >= 0 else "🔴"
            sign = "+" if b["profit"] >= 0 else ""
            lines.append(
                f"🤖 <b>{b['bot_name']}</b>\\n"
                f"  📈 Сделок: {b['total']} | ✅ {b['wins']} / ❌ {b['losses']} | WR: {wr}%\\n"
                f"  {pnl_e} P&amp;L: {sign}{b['profit']} {b['currency']}"
            )
        lines.append("━━━━━━━━━━━━━━━━━━")
        tot_e = "🟢" if sm.get("total_profit", 0) >= 0 else "🔴"
        tot_sign = "+" if sm.get("total_profit", 0) >= 0 else ""
        lines.append(
            f"<b>ИТОГО:</b> {sm.get('total_trades',0)} сделок | WR: {sm.get('winrate',0)}%\\n"
            f"{tot_e} Общий P&amp;L: {tot_sign}{sm.get('total_profit',0)}"
        )
        _tg_inline("\\n".join(lines), _main_buttons())
    except Exception as e:
        tg(f"⚠️ Не удалось получить сводку: {e}")

def _send_daily_report():
    s = _daily_stats
    if s["total"] == 0:
        _tg_inline("📊 <b>Ежедневный отчёт</b>\\n\\nСегодня сделок не было.", _main_buttons())
        return
    winrate = round(s["wins"] / s["total"] * 100) if s["total"] > 0 else 0
    profit_sign = "+" if s["profit"] >= 0 else ""
    emoji_pnl = "🟢" if s["profit"] >= 0 else "🔴"
    bar_w = min(10, round(winrate / 10))
    bar = "█" * bar_w + "░" * (10 - bar_w)
    strat_block = _build_strat_block_with_tips()
    _tg_inline(
        f"📊 <b>Отчёт — {BOT_NAME}</b>\\n"
        f"━━━━━━━━━━━━━━━━━━\\n"
        f"📅 Сделок сегодня: <b>{s['total']}</b>\\n"
        f"✅ Побед: <b>{s['wins']}</b>  ❌ Потерь: <b>{s['losses']}</b>\\n"
        f"📈 Винрейт: <b>{winrate}%</b>  [{bar}]\\n"
        f"{emoji_pnl} P&amp;L: <b>{profit_sign}{round(s['profit'], 2)} {CURRENCY}</b>\\n"
        f"🔥 Лучшая серия: <b>{s['max_win_streak']}</b>  💀 Худшая: <b>{s['max_loss_streak']}</b>\\n"
        f"━━━━━━━━━━━━━━━━━━\\n"
        f"<b>По стратегиям:</b>\\n{strat_block}",
        _main_buttons()
    )

def _daily_report_scheduler():
    import time, datetime, threading
    if not TG_DAILY_REPORT:
        return
    def _loop():
        last_sent_date = None
        last_all_sent_date = None
        while True:
            now = datetime.datetime.now()
            target_h, target_m = map(int, TG_DAILY_REPORT_TIME.split(":"))
            if now.hour == target_h and now.minute == target_m and now.date() != last_sent_date:
                _send_daily_report()
                last_sent_date = now.date()
            if now.hour == 22 and now.minute == 0 and now.date() != last_all_sent_date:
                last_all_sent_date = now.date()
                time.sleep(3)
                _send_all_bots_report()
            time.sleep(30)
    threading.Thread(target=_loop, daemon=True).start()

# ===== УПРАВЛЕНИЕ ЧЕРЕЗ TELEGRAM =====
_tg_paused   = False
_tg_stopped  = False
_tg_offset   = -1

def _tg_flush_old_updates():
    """Сброс накопившихся старых команд при старте — чтобы /stop из прошлого сеанса не остановил бот"""
    global _tg_offset
    if not TG_ENABLED:
        return
    import urllib.request, json as _json
    try:
        url = f"https://api.telegram.org/bot{TG_TOKEN}/getUpdates?offset=-1&timeout=0&limit=1"
        resp = urllib.request.urlopen(url, timeout=5).read()
        data = _json.loads(resp)
        results = data.get("result", [])
        if results:
            _tg_offset = results[-1]["update_id"] + 1
        else:
            _tg_offset = 0
    except Exception:
        _tg_offset = 0

_tg_flush_old_updates()

async def tg_poll_commands():
    """Получить новые команды из Telegram (async — не блокирует event loop)"""
    global _tg_paused, _tg_stopped, _tg_offset, TAKE_PROFIT, STOP_LOSS, BASE_BET
    if not TG_ENABLED:
        return
    import urllib.request, json as _json
    _poll_proxies = [p.strip() for p in TG_PROXY.split(",") if p.strip()] if TG_PROXY else [None]
    def _fetch():
        url = f"https://api.telegram.org/bot{TG_TOKEN}/getUpdates?offset={_tg_offset}&timeout=0&limit=10"
        for _proxy in _poll_proxies:
            if _proxy:
                try:
                    _apply_proxy(_proxy)
                except Exception:
                    continue
            try:
                return urllib.request.urlopen(url, timeout=5).read()
            except Exception as _fe:
                _last = _fe
        raise _last
    try:
        resp = await asyncio.get_event_loop().run_in_executor(None, _fetch)
        data = _json.loads(resp)
        _bot_name_lower = BOT_NAME.lower()
        for upd in data.get("result", []):
            _tg_offset = upd["update_id"] + 1
            msg = upd.get("message") or upd.get("channel_post") or {}
            text = msg.get("text", "").strip()
            chat = str(msg.get("chat", {}).get("id", ""))
            if chat != str(TG_CHAT_ID):
                continue
            parts = text.split()
            if not parts:
                continue
            cmd = parts[0].lower().split("@")[0]
            rest = parts[1:] if len(parts) > 1 else []
            val = ""
            target = ""
            if rest:
                full_rest = " ".join(rest).lower()
                if full_rest == _bot_name_lower or full_rest == "all":
                    target = full_rest
                else:
                    try:
                        float(rest[-1])
                        val = rest[-1]
                        target = " ".join(rest[:-1]).lower()
                    except ValueError:
                        target = full_rest
            for_me = (target == _bot_name_lower or target == "all" or target == "")
            if cmd == "/stop" and for_me:
                _tg_stopped = True
                tg(f"🛑 <b>[{BOT_NAME}] остановлен</b>")
            elif cmd == "/pause" and for_me:
                _tg_paused = True
                tg(f"⏸ <b>[{BOT_NAME}] на паузе.</b> /resume {BOT_NAME} для продолжения")
            elif cmd in ("/resume", "/start") and for_me:
                _tg_paused = False
                _tg_stopped = False
                _tg_inline(f"▶️ <b>[{BOT_NAME}] возобновлён и торгует</b>", _main_buttons())
            elif cmd == "/status" and for_me:
                wins_s = sum(1 for t in trade_log if t["won"])
                strat_block = _build_strat_block_with_tips()
                tg(f"📊 <b>Статус [{BOT_NAME}]</b>\\n💰 Профит: {total_profit:+.2f} {CURRENCY}\\n📈 Сделок: {trades_today} (✅{wins_s}/❌{trades_today-wins_s})\\n{'⏸ На паузе' if _tg_paused else '▶️ Работает'}\\n\\n<b>По стратегиям:</b>\\n{strat_block}")
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
            elif cmd == "/setreport" and for_me:
                new_time = val.strip() if val else ""
                import re as _re
                if _re.match(r"^\\d{1,2}:\\d{2}$", new_time):
                    _register_in_scheduler(report_time=new_time)
                    _tg_inline(f"✅ <b>[{BOT_NAME}]</b> Авто-отчёт теперь в <b>{new_time}</b>", _main_buttons())
                else:
                    tg(f"❌ Формат: /setreport {BOT_NAME} 21:00")
            elif cmd == "/report":
                raw_tgt = " ".join(parts[1:]).lower() if len(parts) > 1 else ""
                if raw_tgt == "all":
                    _send_all_bots_report()
                elif for_me:
                    _send_daily_report()
            elif cmd == "/reset" and for_me:
                _daily_stats.update({"total": 0, "wins": 0, "losses": 0, "profit": 0.0, "max_win_streak": 0, "max_loss_streak": 0, "_cur_win": 0, "_cur_loss": 0})
                tg(f"🔄 <b>[{BOT_NAME}]</b> Дневная статистика сброшена")
            elif cmd == "/tune" and for_me:
                if not trade_log:
                    tg(f"🔧 <b>[{BOT_NAME}] /tune</b>\\nНедостаточно данных — нужно хотя бы несколько сделок.")
                else:
                    total_t = len(trade_log)
                    wins_t = sum(1 for t in trade_log if t["won"])
                    wr_t = wins_t / total_t * 100 if total_t > 0 else 0
                    lines = [f"🔧 <b>[{BOT_NAME}] Авто-тюнинг</b>\\nСделок: {total_t} | WR: {wr_t:.0f}%\\n"]
                    strategy = "${cfg.strategy}"
                    if strategy == "rsi_reversal":
                        rsi_vals_call = [t.get("strategy","") for t in trade_log if not t["won"] and "CALL" in str(t.get("direction",""))]
                        rsi_vals_put  = [t.get("strategy","") for t in trade_log if not t["won"] and "PUT"  in str(t.get("direction",""))]
                        new_os = ${cfg.rsiOversold}
                        new_ob = ${cfg.rsiOverbought}
                        if len(rsi_vals_call) > len(rsi_vals_put):
                            new_os = max(15, ${cfg.rsiOversold} - 5)
                            lines.append(f"📉 Много ложных CALL-сигналов")
                            lines.append(f"→ RSI Oversold: <b>${cfg.rsiOversold} → {new_os}</b> (жёстче фильтр)")
                        elif len(rsi_vals_put) > len(rsi_vals_call):
                            new_ob = min(85, ${cfg.rsiOverbought} + 5)
                            lines.append(f"📈 Много ложных PUT-сигналов")
                            lines.append(f"→ RSI Overbought: <b>${cfg.rsiOverbought} → {new_ob}</b> (жёстче фильтр)")
                        if wr_t < 40:
                            new_per = ${cfg.rsiPeriod} + 2
                            lines.append(f"→ Период RSI: <b>${cfg.rsiPeriod} → {new_per}</b> (меньше шума)")
                        lines.append(f"\\n<i>Примени: /setrsi {BOT_NAME} oversold {new_os} overbought {new_ob}</i>")
                    elif strategy == "ema_cross":
                        if wr_t < 45:
                            new_fast = ${cfg.emaFast} + 2
                            new_slow = ${cfg.emaSlow} + 4
                            lines.append(f"📊 WR ниже 45% — много ложных пересечений")
                            lines.append(f"→ EMA быстрая: <b>${cfg.emaFast} → {new_fast}</b>")
                            lines.append(f"→ EMA медленная: <b>${cfg.emaSlow} → {new_slow}</b>")
                        elif wr_t > 65:
                            new_fast = max(3, ${cfg.emaFast} - 1)
                            new_slow = max(${cfg.emaFast}+3, ${cfg.emaSlow} - 2)
                            lines.append(f"✅ WR хороший, но можно ускорить сигналы")
                            lines.append(f"→ EMA быстрая: <b>${cfg.emaFast} → {new_fast}</b>")
                            lines.append(f"→ EMA медленная: <b>${cfg.emaSlow} → {new_slow}</b>")
                        else:
                            lines.append(f"✅ Параметры EMA оптимальны для текущего рынка")
                    elif strategy == "candle_pattern":
                        if wr_t < 45:
                            lines.append(f"🕯 Паттерны дают много ложных сигналов")
                            lines.append(f"→ Ограничь торговлю: /settp {BOT_NAME} {round(total_profit * 0.5, 1)}")
                            lines.append(f"→ Торгуй только 08:00–12:00 и 15:00–18:00 МСК")
                        else:
                            lines.append(f"✅ Свечные паттерны работают хорошо")
                    elif strategy == "support_resistance":
                        if wr_t < 45:
                            new_pips = ${cfg.rufusPips ?? 5} + 2
                            new_lb   = ${cfg.rufusLookback ?? 10} + 5
                            lines.append(f"🧱 Уровни часто пробиваются")
                            lines.append(f"→ RUFUS_PIPS: <b>${cfg.rufusPips ?? 5} → {new_pips}</b> (шире зона)")
                            lines.append(f"→ RUFUS_LOOKBACK: <b>${cfg.rufusLookback ?? 10} → {new_lb}</b> (надёжнее тренд)")
                        else:
                            lines.append(f"✅ Уровни Rufus работают хорошо")
                    else:
                        lines.append(_build_strat_block_with_tips())
                    tg("\\n".join(lines))
            elif cmd == "/help":
                _tg_inline(
                    f"📋 <b>Команды [{BOT_NAME}]:</b>\\n"
                    f"/start {BOT_NAME} — запустить / возобновить\\n"
                    f"/stop {BOT_NAME} — остановить\\n"
                    f"/pause {BOT_NAME} — пауза\\n"
                    f"/resume {BOT_NAME} — продолжить\\n"
                    f"/status {BOT_NAME} — статистика\\n"
                    f"/report {BOT_NAME} — отчёт за день\\n"
                    f"/reset {BOT_NAME} — сбросить статистику\\n"
                    f"/tune {BOT_NAME} — авто-тюнинг\\n"
                    f"/settp {BOT_NAME} 50 | /setsl {BOT_NAME} 20\\n"
                    f"/setreport {BOT_NAME} 21:00 — время авто-отчёта\\n"
                    f"<i>all вместо имени — все боты</i>",
                    _main_buttons()
                )
        for upd in data.get("result", []):
            cb = upd.get("callback_query")
            if cb:
                cb_data = cb.get("data", "").strip()
                cb_chat = str(cb.get("message", {}).get("chat", {}).get("id", ""))
                if cb_chat == str(TG_CHAT_ID) and cb_data:
                    import urllib.request as _ur2, json as _j2
                    parts2 = cb_data.split()
                    cmd2 = parts2[0].lower() if parts2 else ""
                    tgt2 = " ".join(parts2[1:]).lower() if len(parts2) > 1 else ""
                    for_me2 = (tgt2 == BOT_NAME.lower() or tgt2 == "all" or tgt2 == "")
                    if for_me2:
                        if cmd2 in ("/start", "/resume"):
                            _tg_paused = False; _tg_stopped = False
                            _tg_inline(f"▶️ <b>[{BOT_NAME}] возобновлён</b>", _main_buttons())
                        elif cmd2 == "/pause":
                            _tg_paused = True
                            _tg_inline(f"⏸ <b>[{BOT_NAME}] на паузе</b>", _main_buttons())
                        elif cmd2 == "/stop":
                            _tg_stopped = True
                            tg(f"🛑 <b>[{BOT_NAME}] остановлен</b>")
                        elif cmd2 == "/status":
                            wins_cb = sum(1 for t in trade_log if t["won"])
                            _tg_inline(
                                f"📊 <b>Статус [{BOT_NAME}]</b>\\n💰 Профит: {total_profit:+.2f} {CURRENCY}\\n"
                                f"📈 Сделок: {trades_today} (✅{wins_cb}/❌{trades_today-wins_cb})\\n"
                                f"{'⏸ На паузе' if _tg_paused else '▶️ Работает'}",
                                _main_buttons()
                            )
                        elif cmd2 == "/report":
                            _send_daily_report()
                    try:
                        ack_url = f"https://api.telegram.org/bot{TG_TOKEN}/answerCallbackQuery"
                        ack_payload = _j2.dumps({"callback_query_id": cb["id"]}).encode()
                        ack_req = _ur2.Request(ack_url, data=ack_payload, headers={"Content-Type": "application/json"})
                        _ur2.urlopen(ack_req, timeout=3)
                    except Exception:
                        pass
    except Exception:
        pass

# ===== СОСТОЯНИЕ =====
total_profit  = 0.0
trades_today  = 0
trade_log     = []
rejected_signals  = 0
rejected_no_trend = 0
rejected_conflict = 0
_last_report_time = 0
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
    if len(closed) < 3:
        return None
    window5 = closed[-5:] if len(closed) >= 5 else closed
    colors5 = [candle_color(c) for c in window5]
    ups5   = colors5.count("UP")
    downs5 = colors5.count("DOWN")
    cur   = candles[-1]
    bar   = "".join("🟢" if col == "UP" else "🔴" for col in colors5)
    cur_emoji = "🟢" if cur[3] >= cur[0] else "🔴"
    print(f"[СВЕЧИ] таймфрейм={CANDLE_TF}с ({CANDLE_TF//60}мин) | последние {len(colors5)} свечей: {bar} (▲{ups5}/▼{downs5}) | текущая: {cur_emoji}")
    if ups5 > downs5:
        return "UP_UP"
    if downs5 > ups5:
        return "DOWN_DOWN"
    return None

def trend_to_signal(trend):
    if trend in ("UP_UP", "DOWN_UP"):
        return "CALL"
    if trend in ("DOWN_DOWN", "UP_DOWN"):
        return "PUT"
    return None

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

_td_cache = {"candles": [], "prices": [], "ts": 0}

def fetch_candles_twelvedata():
    """Получение свежих свечей M1 — обновляет сразу после закрытия новой свечи"""
    import urllib.request as _ur, json as _jj, time as _ti
    global _td_cache
    now = _ti.time()
    minute_now = int(now // 60)
    minute_cached = int(_td_cache["ts"] // 60) if _td_cache["ts"] else 0
    if (minute_now == minute_cached) and _td_cache["candles"]:
        return _td_cache["candles"], _td_cache["prices"]
    try:
        url = f"https://api.twelvedata.com/time_series?symbol={TWELVE_DATA_SYMBOL}&interval=1min&outputsize=50&apikey={TWELVE_DATA_KEY}"
        req = _ur.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        data = _jj.loads(_ur.urlopen(req, timeout=10).read())
        if data.get("status") == "error":
            raise Exception(data.get("message", "TD error"))
        values = list(reversed(data.get("values", [])))
        candles = [(float(c["open"]), float(c["high"]), float(c["low"]), float(c["close"])) for c in values]
        prices  = [float(c["close"]) for c in values]
        _td_cache = {"candles": candles, "prices": prices, "ts": now}
        print(f"[CANDLES] Twelve Data: {len(prices)} свечей M1 | последняя цена: {prices[-1]:.5f}")
        return candles, prices
    except Exception as e:
        print(f"[CANDLES] Twelve Data ошибка: {e} — используем кэш")
        return _td_cache["candles"], _td_cache["prices"]

async def get_candles_data(client):
    if TWELVE_DATA_KEY and TWELVE_DATA_SYMBOL:
        candles, prices = fetch_candles_twelvedata()
        if candles and prices:
            return candles, prices
    try:
        raw = await client.get_candles(asset=ASSET, timeframe=CANDLE_TF, count=100)
        candles = [(c.open, c.high, c.low, c.close) for c in raw]
        prices  = [c.close for c in raw]
        print(f"[CANDLES] PO API: {len(prices)} свечей | таймфрейм: {CANDLE_TF}с")
        return candles, prices
    except Exception as e:
        print(f"[ERROR] get_candles: {e}")
        return [], []

_combo_resolved_asset = None

async def place_trade(client, direction, amount):
    """Открытие опциона с авто-поиском формата актива"""
    global _combo_resolved_asset
    dir_val = OrderDirection.CALL if direction == "CALL" else OrderDirection.PUT
    base = ASSET.replace("_otc", "").replace("#", "")
    is_otc = "otc" in ASSET.lower()
    candidates_try = []
    if _combo_resolved_asset:
        candidates_try = [_combo_resolved_asset]
    if is_otc:
        candidates_try += [f"#{base}_otc", f"{base}_otc"]
    else:
        candidates_try += [f"#{base}", base]
    seen = []
    for trade_asset in candidates_try:
        if trade_asset in seen:
            continue
        seen.append(trade_asset)
        try:
            order = await client.place_order(asset=trade_asset, amount=amount, direction=dir_val, duration=EXPIRY_SEC)
            _combo_resolved_asset = trade_asset
            print(f"[TRADE] {direction} | {amount} | {EXPIRY_SEC//60} мин | актив: {trade_asset} | ID: {order.order_id}")
            return order.order_id
        except Exception as e:
            if "Invalid asset" in str(e):
                print(f"[ASSET] {trade_asset} не подходит, пробуем следующий...")
                continue
            print(f"[ERROR] place_trade: {e}")
            return None
    print(f"[ERROR] place_trade: актив {ASSET} не найден ни в одном формате")
    return None

async def check_result(client, order_id, balance_before, bet):
    print(f"[WAIT] Ожидаем результат {EXPIRY_SEC//60} мин...")
    await asyncio.sleep(EXPIRY_SEC + 5)
    _payout = globals().get("PAYOUT", 0.92)
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
                profit = round(bet * _payout, 2) if won else round(-bet, 2)
                print(f"[RESULT] {'ВЫИГРЫШ ✅' if won else 'ПРОИГРЫШ ❌'} | Профит: {profit}")
                return won, profit
            except Exception as e_inner:
                await asyncio.sleep(3)
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

def print_stats():
    wins  = sum(1 for t in trade_log if t["won"])
    total = len(trade_log)
    wr    = (wins / total * 100) if total else 0
    print(f"[STATS] {wins}/{total} | WR: {wr:.1f}% | Сессия: {total_profit:.2f} {CURRENCY}")
    print(f"[STATS] Всего сделок: {trades_today} | Профит: {total_profit:+.2f}")

async def main():
    global total_profit, trades_today, current_bet
    _daily_report_scheduler()

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
    print("=" * 55 + "\\n")
    _tg_inline(
        f"🤖 <b>{BOT_NAME} запущен</b>\\n"
        f"━━━━━━━━━━━━━━━━━━━━\\n"
        f"📋 <b>Параметры сессии</b>\\n"
        f"  Счёт: {account_type}\\n"
        f"  Стратегия: <b>${labels}</b>\\n"
        f"  Логика: <b>${cfg.comboLogic}</b>\\n"
        f"  Актив: <b>{_combo_resolved_asset or ASSET}</b>" + (" ✅ авто" if _combo_resolved_asset and _combo_resolved_asset != ASSET else "") + "\\n"
        f"  Начальный баланс: <b>{balance:.2f} {CURRENCY}</b>\\n"
        f"  Take Profit: <b>+{TAKE_PROFIT} {CURRENCY}</b>\\n"
        f"  Stop Loss: <b>-{STOP_LOSS} {CURRENCY}</b>\\n"
        f"━━━━━━━━━━━━━━━━━━━━\\n"
        f"📊 <b>Актив</b>\\n"
        f"  Инструмент: <b>{_combo_resolved_asset or ASSET}</b>\\n"
        f"  Экспирация: <b>{EXPIRY_SEC//60} мин</b>\\n"
        f"  Начальная ставка: <b>{BASE_BET} {CURRENCY}</b>\\n"
        f"━━━━━━━━━━━━━━━━━━━━\\n"
        f"⏳ Ожидаю сигналы...",
        _main_buttons()
    )
    journal_start_session()
    _register_in_scheduler()

    last_lost_signal = None
    _loss_streak = 0
    _loss_streak_pause_until = 0
    while True:
        if total_profit >= TAKE_PROFIT:
            print(f"[TP] +{total_profit:.2f} {CURRENCY}")
            _w = sum(1 for t in trade_log if t["won"]); _l = trades_today - _w; _wr = round(_w/trades_today*100,1) if trades_today else 0
            _ss = {}
            for _t in trade_log:
                _sk = str(_t.get("strategy", "комбо"))[:30]
                _ss.setdefault(_sk, {"w": 0, "l": 0})
                if _t["won"]: _ss[_sk]["w"] += 1
                else: _ss[_sk]["l"] += 1
            _sl = "\\n".join(f"  {k}: ✅{v['w']} / ❌{v['l']}" for k, v in _ss.items())
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
                f"━━━━━━━━━━━━━━━━━━━━\\n"
                f"🔬 <b>По стратегиям:</b>\\n{_sl}\\n"
                f"━━━━━━━━━━━━━━━━━━━━"
            )
            if AUTO_RESTART:
                total_profit = 0; trades_today = 0; await asyncio.sleep(300); continue
            break
        if total_profit <= -STOP_LOSS:
            print(f"[SL] {total_profit:.2f} {CURRENCY}")
            _w2 = sum(1 for t in trade_log if t["won"]); _l2 = trades_today - _w2; _wr2 = round(_w2/trades_today*100,1) if trades_today else 0
            _ss2 = {}
            for _t in trade_log:
                _sk2 = str(_t.get("strategy", "комбо"))[:30]
                _ss2.setdefault(_sk2, {"w": 0, "l": 0})
                if _t["won"]: _ss2[_sk2]["w"] += 1
                else: _ss2[_sk2]["l"] += 1
            _sl2 = "\\n".join(f"  {k}: ✅{v['w']} / ❌{v['l']}" for k, v in _ss2.items())
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
                f"━━━━━━━━━━━━━━━━━━━━\\n"
                f"🔬 <b>По стратегиям:</b>\\n{_sl2}\\n"
                f"━━━━━━━━━━━━━━━━━━━━"
            )
            if AUTO_RESTART:
                total_profit = 0; trades_today = 0; await asyncio.sleep(300); continue
            break
        if trades_today >= DAILY_LIMIT:
            print(f"[LIMIT] Лимит {DAILY_LIMIT} сделок исчерпан")
            _w3 = sum(1 for t in trade_log if t["won"]); _l3 = trades_today - _w3; _wr3 = round(_w3/trades_today*100,1) if trades_today else 0
            _ss3 = {}
            for _t in trade_log:
                _sk3 = str(_t.get("strategy", "комбо"))[:30]
                _ss3.setdefault(_sk3, {"w": 0, "l": 0})
                if _t["won"]: _ss3[_sk3]["w"] += 1
                else: _ss3[_sk3]["l"] += 1
            _sl3 = "\\n".join(f"  {k}: ✅{v['w']} / ❌{v['l']}" for k, v in _ss3.items())
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
                f"━━━━━━━━━━━━━━━━━━━━\\n"
                f"🔬 <b>По стратегиям:</b>\\n{_sl3}\\n"
                f"━━━━━━━━━━━━━━━━━━━━"
            )
            break

        await tg_poll_commands()
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
            _strat_stat = {}
            for _t in trade_log:
                _s = str(_t.get("strategy", "комбо"))[:30]
                _strat_stat.setdefault(_s, {"w": 0, "l": 0})
                if _t["won"]: _strat_stat[_s]["w"] += 1
                else: _strat_stat[_s]["l"] += 1
            _strat_lines = "\\n".join(f"  {_s}: ✅{v['w']} / ❌{v['l']}" for _s, v in _strat_stat.items())
            tg(
                f"⏰ <b>Авто-отчёт [{BOT_NAME}]</b>\\n"
                f"━━━━━━━━━━━━━━━━━━━━\\n"
                f"💰 Профит: <b>{total_profit:+.2f} {CURRENCY}</b>\\n"
                f"📈 Сделок: {trades_today} (✅ {_wins_r} / ❌ {trades_today - _wins_r})\\n"
                f"🎯 Винрейт: <b>{_wr_r}%</b>\\n"
                f"━━━━━━━━━━━━━━━━━━━━\\n"
                f"📊 <b>По стратегиям:</b>\\n{_strat_lines}\\n"
                f"━━━━━━━━━━━━━━━━━━━━"
            )
            _last_report_time = _time.time()

        await asyncio.sleep(3)
        candles, prices = await get_candles_data(client)
        if not prices:
            await asyncio.sleep(CHECK_INTERVAL)
            continue

        try:
            _live2 = await client.get_candles(asset=_combo_resolved_asset or ASSET, timeframe=5, count=3)
            if _live2:
                _ts_attr2 = 'time' if hasattr(_live2[0], 'time') else ('timestamp' if hasattr(_live2[0], 'timestamp') else None)
                _sorted_live2 = sorted(_live2, key=lambda c: getattr(c, _ts_attr2)) if _ts_attr2 else list(_live2)
                _cur2 = _sorted_live2[-1]
                _tick_val2 = float(_cur2.close) if hasattr(_cur2, 'close') else float(_cur2[3])
                _tick_ts2 = getattr(_cur2, _ts_attr2, 0) if _ts_attr2 else 0
                if _tick_val2 > 0:
                    prices = prices[:-1] + [_tick_val2]
                    print(f"[PRICE] Текущая цена с PO: {_tick_val2:.5f} (ts={_tick_ts2})")
        except Exception as _e:
            print(f"[PRICE_ERR] Не удалось получить цену с PO: {_e}")

        new_trend, old_trend = check_trend_change(candles)
        if new_trend:
            arrow = "📈" if new_trend in ("UP_UP", "DOWN_UP") else "📉"
            labels = {"UP_UP": "🟢🟢 Два зелёных", "DOWN_DOWN": "🔴🔴 Два красных", "DOWN_UP": "🔴🟢 Разворот вверх", "UP_DOWN": "🟢🔴 Разворот вниз"}
            msg = f"{arrow} <b>Тренд изменился!</b>\\n{labels.get(old_trend, old_trend or '?')} → {labels.get(new_trend, new_trend)} | {ASSET}"
            print(f"[TREND] {old_trend} → {new_trend}")
            tg_info(msg)

        trend = get_trend(candles)
        trend_sig = trend_to_signal(trend)
        signal, signal_info = get_combined_signal(prices, candles)

        import time as _time_mod2
        if TIME_FILTER_ENABLED:
            _now = datetime.now().strftime("%H:%M")
            if not (TIME_FILTER_FROM <= _now <= TIME_FILTER_TO):
                print(f"[TIME] {_now} вне окна {TIME_FILTER_FROM}–{TIME_FILTER_TO}, ожидание...")
                await asyncio.sleep(CHECK_INTERVAL)
                continue

        if LOSS_STREAK_PAUSE_ENABLED and _loss_streak_pause_until > _time_mod2.time():
            _left = int((_loss_streak_pause_until - _time_mod2.time()) / 60)
            print(f"[PAUSE] Пауза после {LOSS_STREAK_COUNT} проигрышей. Осталось ~{_left} мин.")
            await asyncio.sleep(CHECK_INTERVAL)
            continue

        if signal:
            if TRADE_DIRECTION == "call_only" and signal != "CALL":
                print(f"[FILTER] Сигнал {signal} пропущен — фильтр: только CALL")
                await asyncio.sleep(CHECK_INTERVAL)
                continue
            if TRADE_DIRECTION == "put_only" and signal != "PUT":
                print(f"[FILTER] Сигнал {signal} пропущен — фильтр: только PUT")
                await asyncio.sleep(CHECK_INTERVAL)
                continue
            if RSI_THRESHOLD_ENABLED and signal_info:
                import re as _re2
                _rsi_m = _re2.search(r'RSI[=:]\\s*(\\d+\\.?\\d*)', signal_info)
                if _rsi_m:
                    _rsi_val = float(_rsi_m.group(1))
                    if signal == "CALL" and _rsi_val > RSI_THRESHOLD_OVERSOLD:
                        print(f"[RSI-THRESHOLD] RSI={_rsi_val} > {RSI_THRESHOLD_OVERSOLD}, пропуск")
                        await asyncio.sleep(CHECK_INTERVAL)
                        continue
                    if signal == "PUT" and _rsi_val < RSI_THRESHOLD_OVERBOUGHT:
                        print(f"[RSI-THRESHOLD] RSI={_rsi_val} < {RSI_THRESHOLD_OVERBOUGHT}, пропуск")
                        await asyncio.sleep(CHECK_INTERVAL)
                        continue
            if EMA_TREND_FILTER and len(prices) >= 200:
                _ema200 = sum(prices[-200:]) / 200
                _price_now = prices[-1]
                if signal == "CALL" and _price_now < _ema200:
                    print(f"[EMA200] Цена {_price_now:.5f} < EMA200 {_ema200:.5f}, CALL отвергнут")
                    await asyncio.sleep(CHECK_INTERVAL)
                    continue
                if signal == "PUT" and _price_now > _ema200:
                    print(f"[EMA200] Цена {_price_now:.5f} > EMA200 {_ema200:.5f}, PUT отвергнут")
                    await asyncio.sleep(CHECK_INTERVAL)
                    continue
            if CANDLE_CONFIRM_ENABLED and len(candles) >= CANDLE_CONFIRM_COUNT + 1:
                _conf_candles = candles[-(CANDLE_CONFIRM_COUNT + 1):-1]
                _conf_colors = ["UP" if c[3] >= c[0] else "DOWN" for c in _conf_candles]
                _conf_emojis = "".join("🟢" if col == "UP" else "🔴" for col in _conf_colors)
                _expected = "UP" if signal == "CALL" else "DOWN"
                if not all(c == _expected for c in _conf_colors):
                    print(f"[CANDLE-CONFIRM] Нет {CANDLE_CONFIRM_COUNT} свечей подряд для {signal} | свечи: {_conf_emojis} | сигнал отклонён")
                    await asyncio.sleep(CHECK_INTERVAL)
                    continue
                print(f"[CANDLE-CONFIRM] ✅ {CANDLE_CONFIRM_COUNT} свечей подтверждают {signal} | {_conf_emojis}")

        if signal:
            if BET_PERCENT:
                balance, currency = await get_balance(client)
                bet = round(balance * (BASE_BET / 100), 2)
            else:
                balance, currency = await get_balance(client)
                bet = current_bet
            if INVERT_SIGNAL:
                signal = "PUT" if signal == "CALL" else "CALL"
            emoji = "📈" if signal == "CALL" else "📉"
            tg_parts = [f"{emoji} <b>[{BOT_NAME}] Комбо-сделка</b>", f"{signal} | {bet} {currency} | {ASSET}"]
            if signal_info:
                tg_parts.append(f"📊 Сигнал: {signal_info}")
            tg_parts.append(f"📋 Сделок сегодня: {trades_today + 1}")
            import time as _ts_t2; _last_signal_time = _ts_t2.time(); _no_signal_alert_sent = False
            tg("\\n".join(tg_parts))
            balance_before, _ = await get_balance(client)
            order_id = await place_trade(client, signal, bet)
            if order_id:
                won, profit = await check_result(client, order_id, balance_before, bet)
                loss_amount = round(bet, 2) if not won else 0.0
                _update_daily_stats(won, profit if won else 0.0, loss_amount)
                total_profit += profit
                trades_today += 1
                current_bet   = adjust_bet(won)
                trade_log.append({"won": won, "profit": profit, "strategy": signal_info or "комбо"})
                journal_log_trade(signal, bet, PAYOUT, won, strategy_name="combo", indicator_value=signal_info or "")
                wins = sum(1 for t in trade_log if t["won"])
                wr   = wins / len(trade_log) * 100
                res_emoji = "✅" if won else "❌"
                tg(f"{res_emoji} <b>[{BOT_NAME}] {'Выигрыш' if won else 'Проигрыш'}</b>\\n{signal} | {bet} {currency} | {ASSET}\\nПрофит: {profit:+.2f} {currency}\\nСессия: {total_profit:+.2f} {currency} | WR: {wr:.0f}% ({wins}/{len(trade_log)})")
                print_stats()
                if LOSS_STREAK_PAUSE_ENABLED:
                    if won:
                        _loss_streak = 0
                    else:
                        _loss_streak += 1
                        if _loss_streak >= LOSS_STREAK_COUNT:
                            _loss_streak_pause_until = _time_mod2.time() + LOSS_STREAK_PAUSE_MIN * 60
                            _loss_streak = 0
                            tg(f"⏸ <b>[{BOT_NAME}] Пауза {LOSS_STREAK_PAUSE_MIN} мин</b> — {LOSS_STREAK_COUNT} проигрышей подряд")
                            print(f"[PAUSE] {LOSS_STREAK_COUNT} проигрышей подряд — пауза {LOSS_STREAK_PAUSE_MIN} мин")
        else:
            ts = datetime.now().strftime("%H:%M:%S")
            reason = f" ({signal_info})" if signal_info else ""
            print(f"[{ts}] Нет сигнала{reason} | ожидание {CHECK_INTERVAL} сек...")
            await asyncio.sleep(CHECK_INTERVAL)

    journal_end_session()
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