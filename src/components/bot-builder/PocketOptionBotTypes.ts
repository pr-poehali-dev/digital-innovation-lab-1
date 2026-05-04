export type POStrategy = "rsi_reversal" | "ema_cross" | "ema_trend" | "martingale" | "candle_pattern" | "support_resistance"
export type POExpiry = "1" | "2" | "3" | "5" | "15" | "30" | "45" | "60"
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
  comboStrategies: ["rsi_reversal", "ema_cross", "ema_trend", "support_resistance"],
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
}

// Helper to avoid TS template literal conflicts with Python f-strings
const S = "$"

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

def get_signal(prices, candles=None):
    """Сигнал по пересечению EMA ${cfg.emaFast} / EMA ${cfg.emaSlow}${cfg.trendFollow === "follow" ? " (по тренду)" : cfg.trendFollow === "reverse" ? " (против тренда)" : " (комбо)"}"""
    prices = prices[:-1]
    if len(prices) < ${cfg.emaSlow} + 2:
        return None, ""
    ema_fast = calculate_ema(prices, ${cfg.emaFast})
    ema_slow = calculate_ema(prices, ${cfg.emaSlow})
    cross_up = ema_fast[-1] > ema_slow[-1] and ema_fast[-2] <= ema_slow[-2]
    cross_down = ema_fast[-1] < ema_slow[-1] and ema_fast[-2] >= ema_slow[-2]
    info = f"EMA${cfg.emaFast}={ema_fast[-1]:.5f} / EMA${cfg.emaSlow}={ema_slow[-1]:.5f}"
    diff = ema_fast[-1] - ema_slow[-1]
    print(f"[СИГНАЛ] EMA${cfg.emaFast}={ema_fast[-1]:.5f} | EMA${cfg.emaSlow}={ema_slow[-1]:.5f} | разница={diff:+.5f} | пересечение вверх: {'✅' if cross_up else '❌'} | вниз: {'✅' if cross_down else '❌'}")
    if cross_up:
        sig = "${cfg.trendFollow !== "reverse" ? "CALL" : "PUT"}"
        print(f"[СИГНАЛ] → {sig} (EMA пересечение вверх ↑)")
        return sig, f"{info} (пересечение вверх ↑)"
    if cross_down:
        sig = "${cfg.trendFollow !== "reverse" ? "PUT" : "CALL"}"
        print(f"[СИГНАЛ] → {sig} (EMA пересечение вниз ↓)")
        return sig, f"{info} (пересечение вниз ↓)"
    print(f"[СИГНАЛ] → нет сигнала (пересечения не было, разница {diff:+.5f})")
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
    """EMA Тренд: CALL пока EMA${cfg.emaFast} выше EMA${cfg.emaSlow}, PUT пока ниже${cfg.trendFollow === "follow" ? " (по тренду)" : cfg.trendFollow === "reverse" ? " (против тренда)" : " (комбо)"}"""
    prices = prices[:-1]
    if len(prices) < ${cfg.emaSlow} + 1:
        return None, ""
    ema_fast = calculate_ema(prices, ${cfg.emaFast})
    ema_slow = calculate_ema(prices, ${cfg.emaSlow})
    above = ema_fast[-1] > ema_slow[-1]
    info = f"EMA${cfg.emaFast}={ema_fast[-1]:.5f} / EMA${cfg.emaSlow}={ema_slow[-1]:.5f}"
    diff = ema_fast[-1] - ema_slow[-1]
    direction = "выше ↑" if above else "ниже ↓"
    print(f"[СИГНАЛ] EMA${cfg.emaFast}={ema_fast[-1]:.5f} | EMA${cfg.emaSlow}={ema_slow[-1]:.5f} | разница={diff:+.5f} | EMA${cfg.emaFast} {direction} EMA${cfg.emaSlow}")
    if above:
        sig = "${cfg.trendFollow !== "reverse" ? "CALL" : "PUT"}"
        print(f"[СИГНАЛ] → {sig} (EMA${cfg.emaFast} > EMA${cfg.emaSlow})")
        return sig, f"{info} (EMA${cfg.emaFast} > EMA${cfg.emaSlow} ↑)"
    else:
        sig = "${cfg.trendFollow !== "reverse" ? "PUT" : "CALL"}"
        print(f"[СИГНАЛ] → {sig} (EMA${cfg.emaFast} < EMA${cfg.emaSlow})")
        return sig, f"{info} (EMA${cfg.emaFast} < EMA${cfg.emaSlow} ↓)"`,

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
  Направление: ${cfg.trendFollow === "follow" ? "По тренду ↗" : cfg.trendFollow === "reverse" ? "Против тренда ↙" : "Комбо ↗↙"}
  Режим свечей: ${(cfg.trendMode ?? "same") === "same" ? "Одинаковые (2 зелёных=CALL / 2 красных=PUT)" : (cfg.trendMode === "reverse") ? "Разворот (красн+зел=PUT / зел+красн=CALL)" : "Любой паттерн (UP=CALL, DOWN=PUT)"}
  Таймфрейм  : ${(cfg.candleTimeframe ?? 60) === 60 ? "1 мин  (60 свечей = 1 час истории)" : (cfg.candleTimeframe ?? 60) === 300 ? "5 мин  (60 свечей = 5 часов истории)" : (cfg.candleTimeframe ?? 60) === 900 ? "15 мин (60 свечей = 15 часов истории)" : "1 час  (60 свечей = 2.5 дня истории)"}
  Take Profit: ${cfg.takeProfitRub} ${cfg.currency}
  Stop Loss  : ${cfg.stopLossRub} ${cfg.currency}
  Лимит/день : ${cfg.dailyLimit} сделок
  Мартингейл : ${cfg.martingaleEnabled ? `x${cfg.martingaleMultiplier} до ${cfg.martingaleSteps} шагов` : "выкл"}
════════════════════════════════════════

Установка зависимостей:
    pip install pocketoptionapi-async
"""

import asyncio
import os
import builtins as _builtins
from datetime import datetime
from pocketoptionapi_async import AsyncPocketOptionClient, OrderDirection

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
    for attempt in range(1, retries + 1):
        try:
            resp = urllib.request.urlopen(req, timeout=20)
            if _result_holder is not None:
                try:
                    _r = json.loads(resp.read().decode())
                    _result_holder.append(_r)
                except Exception:
                    pass
            return
        except Exception as e:
            if attempt < retries:
                time.sleep(delay)
            else:
                print(f"[TG] Ошибка: {e}")

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

# ===== ID последнего меню (чтобы не плодить и удалять старые) =====
_tg_last_menu_id = None
# Состояние подтверждения FORCE: { "pattern": "UP_UP", "ts": time }, либо None
_tg_pending_force = None

def tg_send_menu(text, buttons):
    """Отправляет НОВОЕ inline-меню. buttons = list[list[(label, callback_data)]].
    Если есть предыдущее меню — удаляет его. Сохраняет message_id в _tg_last_menu_id."""
    global _tg_last_menu_id
    if not TG_ENABLED:
        return
    # Удаляем старое меню (если есть)
    if _tg_last_menu_id:
        try:
            import threading
            threading.Thread(target=_tg_send, args=(None,), kwargs={"action": "delete", "message_id": _tg_last_menu_id}, daemon=True).start()
        except Exception:
            pass
        _tg_last_menu_id = None
    # Строим reply_markup
    keyboard = []
    for row in buttons:
        keyboard.append([{"text": _l, "callback_data": _cd} for (_l, _cd) in row])
    reply_markup = {"inline_keyboard": keyboard}
    # Отправляем синхронно — нам нужен message_id
    _holder = []
    try:
        _tg_send(text, retries=2, delay=2, reply_markup=reply_markup, _result_holder=_holder)
    except Exception as e:
        print(f"[TG_MENU] Ошибка отправки: {e}")
        return
    if _holder and _holder[0].get("ok") and _holder[0].get("message_id"):
        _tg_last_menu_id = _holder[0]["message_id"]

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

def _handle_button_click(action_str, message_id, callback_id):
    """Обрабатывает нажатие inline-кнопки. action_str — содержимое callback_data."""
    global _tg_paused, _tg_stopped, _tg_force_pattern, _tg_force_at, _tg_pending_force, _tg_last_menu_id
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
                tg(f"🛑 <b>[{BOT_NAME}] остановлен</b>")
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
    if TREND_MODE == "any":
        if trend in ("UP_UP", "DOWN_UP"):
            return "CALL"
        if trend in ("DOWN_DOWN", "UP_DOWN"):
            return "PUT"
    elif TREND_MODE == "same":
        if trend == "UP_UP":
            return "CALL"
        if trend == "DOWN_DOWN":
            return "PUT"
    else:
        if trend == "DOWN_UP":
            return "CALL"
        if trend == "UP_DOWN":
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
        f"━━━━━━━━━━━━━━━━━━━━\\n"
        f"⏳ Ожидаю сигналы..."
    )

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

            tg_poll_commands()
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
                tg_parts = [f"{emoji} <b>[{BOT_NAME}] Сделка открыта</b>", f"{signal} | {bet} {currency} | {ASSET} | {EXPIRY_SEC//60} мин", trend_label]
                if sig_line:
                    tg_parts.append(sig_line)
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
                    gather_results = await asyncio.gather(main_result_task, hedge_task or asyncio.sleep(0), ext_task or asyncio.sleep(0), return_exceptions=True)
                    main_res = gather_results[0]
                    hedge_res = gather_results[1]
                    ext_res   = gather_results[2]
                    won, profit, loss_amount = main_res if not isinstance(main_res, Exception) else (False, 0.0, bet)
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
    if fast[-1] > slow[-1] and fast[-2] <= slow[-2]: return "${cfg.trendFollow !== "reverse" ? "CALL" : "PUT"}", f"{info}↑"
    if fast[-1] < slow[-1] and fast[-2] >= slow[-2]: return "${cfg.trendFollow !== "reverse" ? "PUT" : "CALL"}", f"{info}↓"
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
def get_combined_signal(prices, candles):
    """Комбо AND — большинство стратегий должны совпасть"""
    fns = [${callLines.map(l => l.replace(/\(.*\)/, '')).join(", ")}]
    results = [f(prices, candles) for f in fns]
    signals = [(s, i) for s, i in results if s is not None]
    majority = (${selected.length} // 2) + 1
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
def get_combined_signal(prices, candles):
    """Комбо OR — достаточно хотя бы одного сигнала"""
    fns = [${callLines.map(l => l.replace(/\(.*\)/, '')).join(", ")}]
    results = [f(prices, candles) for f in fns]
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
  Направление: ${cfg.trendFollow === "follow" ? "По тренду ↗" : cfg.trendFollow === "reverse" ? "Против тренда ↙" : "Комбо ↗↙"}
  Режим свечей: ${(cfg.trendMode ?? "same") === "same" ? "Одинаковые (2 зелёных=CALL / 2 красных=PUT)" : (cfg.trendMode === "reverse") ? "Разворот (красн+зел=PUT / зел+красн=CALL)" : "Любой паттерн (UP=CALL, DOWN=PUT)"}
  Таймфрейм  : ${(cfg.candleTimeframe ?? 60) === 60 ? "1 мин  (60 свечей = 1 час истории)" : (cfg.candleTimeframe ?? 60) === 300 ? "5 мин  (60 свечей = 5 часов истории)" : (cfg.candleTimeframe ?? 60) === 900 ? "15 мин (60 свечей = 15 часов истории)" : "1 час  (60 свечей = 2.5 дня истории)"}
  Take Profit: ${cfg.takeProfitRub} ${cfg.currency}
  Stop Loss  : ${cfg.stopLossRub} ${cfg.currency}
  Лимит/день : ${cfg.dailyLimit} сделок
  Мартингейл : ${cfg.martingaleEnabled ? `x${cfg.martingaleMultiplier} до ${cfg.martingaleSteps} шагов` : "выкл"}
════════════════════════════════════════

Установка зависимостей:
    pip install pocketoptionapi-async
"""

import asyncio
import os
import builtins as _builtins
from datetime import datetime
from pocketoptionapi_async import AsyncPocketOptionClient, OrderDirection

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
    for attempt in range(1, retries + 1):
        try:
            resp = urllib.request.urlopen(req, timeout=20)
            if _result_holder is not None:
                try:
                    _r = json.loads(resp.read().decode())
                    _result_holder.append(_r)
                except Exception:
                    pass
            return
        except Exception as e:
            if attempt < retries:
                time.sleep(delay)
            else:
                print(f"[TG] Ошибка: {e}")

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

# ===== ID последнего меню (чтобы не плодить и удалять старые) =====
_tg_last_menu_id = None
# Состояние подтверждения FORCE: { "pattern": "UP_UP", "ts": time }, либо None
_tg_pending_force = None

def tg_send_menu(text, buttons):
    """Отправляет НОВОЕ inline-меню. buttons = list[list[(label, callback_data)]].
    Если есть предыдущее меню — удаляет его. Сохраняет message_id в _tg_last_menu_id."""
    global _tg_last_menu_id
    if not TG_ENABLED:
        return
    # Удаляем старое меню (если есть)
    if _tg_last_menu_id:
        try:
            import threading
            threading.Thread(target=_tg_send, args=(None,), kwargs={"action": "delete", "message_id": _tg_last_menu_id}, daemon=True).start()
        except Exception:
            pass
        _tg_last_menu_id = None
    # Строим reply_markup
    keyboard = []
    for row in buttons:
        keyboard.append([{"text": _l, "callback_data": _cd} for (_l, _cd) in row])
    reply_markup = {"inline_keyboard": keyboard}
    # Отправляем синхронно — нам нужен message_id
    _holder = []
    try:
        _tg_send(text, retries=2, delay=2, reply_markup=reply_markup, _result_holder=_holder)
    except Exception as e:
        print(f"[TG_MENU] Ошибка отправки: {e}")
        return
    if _holder and _holder[0].get("ok") and _holder[0].get("message_id"):
        _tg_last_menu_id = _holder[0]["message_id"]

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

def _handle_button_click(action_str, message_id, callback_id):
    """Обрабатывает нажатие inline-кнопки. action_str — содержимое callback_data."""
    global _tg_paused, _tg_stopped, _tg_force_pattern, _tg_force_at, _tg_pending_force, _tg_last_menu_id
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
                tg(f"🛑 <b>[{BOT_NAME}] остановлен</b>")
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
    if TREND_MODE == "any":
        if trend in ("UP_UP", "DOWN_UP"):
            return "CALL"
        if trend in ("DOWN_DOWN", "UP_DOWN"):
            return "PUT"
    elif TREND_MODE == "same":
        if trend == "UP_UP":
            return "CALL"
        if trend == "DOWN_DOWN":
            return "PUT"
    else:
        if trend == "DOWN_UP":
            return "CALL"
        if trend == "UP_DOWN":
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
LIVE_TICK_INTERVAL = 1  # секунд между опросами цены — чем меньше, тем точнее h/l свечи

# ===== ЗАПИСЬ ВИДЕННЫХ СВЕЧЕЙ В ФАЙЛ СЕССИИ =====
# Все свечи которые бот ВИДЕЛ ЛИЧНО (закрытые) пишутся в свечи/YYYY-MM-DD_HH-MM-SS.csv
# Имя файла = дата+время старта бота. Один запуск = один файл.
import os as _os_sess
from datetime import datetime as _dt_sess
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
            # ===== СВЕРКА С ГРАФИКОМ POCKETOPTION =====
            # Бот закрыл свою свечу — спросим у API ту же свечу и сравним.
            # Это даёт честный лог "бот идёт в ногу с биржей".
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
    """Фоновая задача — каждые LIVE_TICK_INTERVAL сек обновляет буфер."""
    while True:
        try:
            await buf.tick(client)
        except Exception as e:
            print(f"[BUFFER] tick error: {e}")
        await asyncio.sleep(LIVE_TICK_INTERVAL)


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
        f"━━━━━━━━━━━━━━━━━━━━\\n"
        f"⏳ Ожидаю сигналы..."
    )

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

        tg_poll_commands()
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
                if entry_price == 0.0:
                    print("[WARN] entry_price=0 — хедж и расширение прибыли НЕ запущены!")
                # Ждём основной ордер и мониторы параллельно
                main_result_task = asyncio.create_task(check_result(client, order_id, balance_before, bet))
                gather_results = await asyncio.gather(main_result_task, hedge_task or asyncio.sleep(0), ext_task or asyncio.sleep(0), return_exceptions=True)
                main_res  = gather_results[0]
                hedge_res = gather_results[1]
                ext_res   = gather_results[2]
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