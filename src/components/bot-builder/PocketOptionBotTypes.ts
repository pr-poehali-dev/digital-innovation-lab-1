export type POStrategy = "rsi_reversal" | "ema_cross" | "martingale" | "candle_pattern" | "support_resistance"
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
  hedgePowerMultiplier: number
  hedgeCheckInterval: number
  profitExtEnabled: boolean
  profitExtPips: number
  profitExtMode: "trend" | "rebound" | "both"
  profitExtMultiplier: number
  profitExtCheckInterval: number
  srManualLevels: string
  srStep: number
  srWindow: number
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
  trendMode: "same",
  trendFollow: "follow",
  useOTC: true,
  autoRestart: false,
  isDemo: true,
  currency: "RUB",
  tgToken: "",
  tgChatId: "",
  tgEnabled: true,
  tgNotifyMode: "all",
  tgProxy: "",
  checkInterval: 30,
  payoutRate: 92,
  tradeDirection: "all",
  hedgeEnabled: false,
  hedgePipThreshold: 8,
  hedgePowerMultiplier: 1.5,
  hedgeCheckInterval: 5,
  profitExtEnabled: false,
  profitExtPips: 12,
  profitExtMode: "both",
  profitExtMultiplier: 1.0,
  profitExtCheckInterval: 5,
  srManualLevels: "",
  srStep: 0,
  srWindow: 10,
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
    if oversold:
        return ("CALL" if ${cfg.trendFollow !== "reverse" ? "True" : "False"} else "PUT"), f"{info} ≤ ${cfg.rsiOversold} (перепроданность)"
    if overbought:
        return ("PUT" if ${cfg.trendFollow !== "reverse" ? "True" : "False"} else "CALL"), f"{info} ≥ ${cfg.rsiOverbought} (перекупленность)"
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
    if cross_up:
        return "${cfg.trendFollow !== "reverse" ? "CALL" : "PUT"}", f"{info} (пересечение вверх ↑)"
    if cross_down:
        return "${cfg.trendFollow !== "reverse" ? "PUT" : "CALL"}", f"{info} (пересечение вниз ↓)"
    return None, info`,

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
    if calls >= 2:
        return "CALL", f"{info} → большинство вверх"
    if puts >= 2:
        return "PUT", f"{info} → большинство вниз"
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
    # Молот — разворот вверх
    if lower_shadow > body2 * 2 and upper_shadow < body2 * 0.5 and c1 < o1:
        return "CALL", "Паттерн: 🔨 Молот (разворот вверх)"
    # Падающая звезда — разворот вниз
    if upper_shadow > body2 * 2 and lower_shadow < body2 * 0.5 and c1 > o1:
        return "PUT", "Паттерн: ⭐ Падающая звезда (разворот вниз)"
    # Бычье поглощение
    if c1 < o1 and c2 > o2 and c2 > o1 and o2 < c1:
        return "CALL", "Паттерн: 🟢 Бычье поглощение"
    # Медвежье поглощение
    if c1 > o1 and c2 < o2 and c2 < o1 and o2 > c1:
        return "PUT", "Паттерн: 🔴 Медвежье поглощение"
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
    if nearest_sup and abs(current - nearest_sup) < threshold:
        src = "ручной" if nearest_sup in manual else ("сетка" if SR_STEP > 0 and nearest_sup in step_levels else "авто")
        return "CALL", f"Цена {current:.5f} у поддержки {nearest_sup:.5f} [{src}] → отскок вверх"
    if nearest_res and abs(current - nearest_res) < threshold:
        src = "ручной" if nearest_res in manual else ("сетка" if SR_STEP > 0 and nearest_res in step_levels else "авто")
        return "PUT", f"Цена {current:.5f} у сопротивления {nearest_res:.5f} [{src}] → отскок вниз"
    sup_info = f"{nearest_sup:.5f}" if nearest_sup else "нет"
    res_info = f"{nearest_res:.5f}" if nearest_res else "нет"
    return None, f"Цена {current:.5f} | ближ.sup={sup_info} res={res_info}"`,
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
from datetime import datetime
from pocketoptionapi_async import AsyncPocketOptionClient, OrderDirection

# ===== НАСТРОЙКИ =====
ASSET        = os.environ.get("PO_ASSET", "${assetSymbol}")
EXPIRY_SEC   = ${String(parseInt(cfg.expiry) * 60)}             # Экспирация в секундах
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

def _tg_send(text, retries=5, delay=5):
    """Отправка через промежуточный сервер — не требует VPN на машине юзера"""
    import urllib.request, json, time
    url = "https://functions.poehali.dev/fb70e0a6-b6c1-49e2-b148-c37dab50f024"
    payload = json.dumps({"token": TG_TOKEN, "chat_id": TG_CHAT_ID, "text": text}).encode()
    req = urllib.request.Request(url, data=payload, headers={"Content-Type": "application/json"}, method="POST")
    for attempt in range(1, retries + 1):
        try:
            urllib.request.urlopen(req, timeout=20)
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

# ===== УПРАВЛЕНИЕ ЧЕРЕЗ TELEGRAM =====
_tg_paused   = False
_tg_stopped  = False
_tg_offset   = 0

def tg_poll_commands():
    """Получить новые команды из Telegram и обработать их"""
    global _tg_paused, _tg_stopped, _tg_offset, TAKE_PROFIT, STOP_LOSS, BASE_BET
    if not TG_ENABLED:
        return
    import urllib.request, json as _json
    try:
        url = f"https://api.telegram.org/bot{TG_TOKEN}/getUpdates?offset={_tg_offset}&timeout=1&limit=5"
        resp = urllib.request.urlopen(url, timeout=5).read()
        data = _json.loads(resp)
        _bot_name_lower = BOT_NAME.lower()
        for upd in data.get("result", []):
            _tg_offset = upd["update_id"] + 1
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
                tg(f"📊 <b>Статус [{BOT_NAME}]</b>\\n💰 Профит: {total_profit:+.2f} {CURRENCY}\\n📈 Сделок: {trades_today} (✅{wins_s}/❌{trades_today-wins_s})\\n{'⏸ На паузе' if _tg_paused else '▶️ Работает'}")
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
            elif cmd == "/help":
                tg(f"📋 <b>Команды [{BOT_NAME}]:</b>\\n/stop {BOT_NAME} — остановить\\n/pause {BOT_NAME} — пауза\\n/resume {BOT_NAME} — продолжить\\n/status {BOT_NAME} — статистика\\n/settp {BOT_NAME} 50\\n/setsl {BOT_NAME} 20\\n/setbet {BOT_NAME} 10\\n\\n<i>Вместо имени можно писать all</i>")
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
    window = closed[-5:] if len(closed) >= 5 else closed
    colors = [candle_color(c) for c in window]
    ups   = colors.count("UP")
    downs = colors.count("DOWN")
    last  = candle_color(closed[-1])
    prev  = candle_color(closed[-2])
    cur   = candles[-1]
    bar   = "".join("🟢" if col == "UP" else "🔴" for col in colors)
    cur_emoji = "🟢" if cur[3] >= cur[0] else "🔴"
    print(f"[СВЕЧИ] таймфрейм={EXPIRY_SEC}с ({EXPIRY_SEC//60}мин) | последние {len(window)} свечей: {bar} (▲{ups}/▼{downs}) | текущая: {cur_emoji}")
    if ups >= 3:
        return "UP_UP" if last == "UP" else "DOWN_UP"
    if downs >= 3:
        return "DOWN_DOWN" if last == "DOWN" else "UP_DOWN"
    if prev == "DOWN" and last == "UP":
        return "DOWN_UP"
    if prev == "UP" and last == "DOWN":
        return "UP_DOWN"
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
            raw = await client.get_candles(asset=asset_name, timeframe=EXPIRY_SEC, count=100)
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
                now_ts = datetime.now().timestamp()
                sample_time = sorted_raw[-1].time
                if sample_time > 1e10:
                    closed_raw = [c for c in sorted_raw if c.time / 1000 + EXPIRY_SEC <= now_ts]
                else:
                    closed_raw = [c for c in sorted_raw if c.time + EXPIRY_SEC <= now_ts]
                if not closed_raw:
                    closed_raw = sorted_raw[:-1]
                print(f"[TIME_DEBUG] now={now_ts:.0f} last_candle_time={sorted_raw[-1].time} ms={sample_time > 1e10} expiry={EXPIRY_SEC} closed={len(closed_raw)}/{len(sorted_raw)}")
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

async def place_trade(client, direction, amount):
    """Открытие опциона"""
    try:
        dir_val = OrderDirection.CALL if direction == "CALL" else OrderDirection.PUT
        trade_asset = _resolved_asset or ASSET
        order = await client.place_order(asset=trade_asset, amount=amount, direction=dir_val, duration=EXPIRY_SEC)
        print(f"[TRADE] {direction} | {amount} | {EXPIRY_SEC//60} мин | ID: {order.order_id}")
        return order.order_id
    except Exception as e:
        print(f"[ERROR] Сделка: {e}")
        return None

async def hedge_monitor(client, original_direction, original_bet, entry_price, expiry_sec):
    """
    Мониторинг цены во время экспирации и хеджирование при уходе против позиции.
    Проверяет каждые expiry/5 секунд.
    Simple:  цена ушла против, пипсов < порога  → та же сумма
    Power:   цена ушла против, пипсов >= порога → сумма * коэф
    Complex: прошло > 50% времени И пипсов >= порога → Power немедленно
    """
    if not ${cfg.hedgeEnabled ? "True" : "False"}:
        return None, 0.0
    _pip_map = {
        # Forex мажоры
        "EURUSD": 8, "GBPUSD": 10, "USDJPY": 9, "USDCHF": 9, "USDCAD": 9, "AUDUSD": 9, "NZDUSD": 9,
        "EURUSD_otc": 8, "GBPUSD_otc": 10, "USDJPY_otc": 9, "USDCHF_otc": 9, "USDCAD_otc": 9, "AUDUSD_otc": 9, "NZDUSD_otc": 9,
        # Forex кросс-пары
        "GBPJPY": 20, "GBPJPY_otc": 20, "EURJPY": 15, "EURJPY_otc": 15, "EURGBP": 10, "EURGBP_otc": 10,
        "GBPAUD": 18, "GBPAUD_otc": 18, "GBPCAD": 16, "GBPCAD_otc": 16, "GBPCHF": 14, "GBPCHF_otc": 14,
        "AUDCAD_otc": 12, "AUDCHF_otc": 11, "AUDJPY_otc": 14, "AUDNZD_otc": 13,
        "CADJPY_otc": 13, "CADCHF_otc": 10, "CHFJPY_otc": 14,
        "NZDJPY_otc": 14, "NZDCAD_otc": 12, "NZDCHF_otc": 11, "EURNZD_otc": 14,
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
    _asset_key = (_resolved_asset or ASSET)
    HEDGE_PIP_THRESHOLD = _pip_map.get(_asset_key, ${cfg.hedgePipThreshold})
    HEDGE_POWER_MULT    = ${cfg.hedgePowerMultiplier}
    check_interval = max(10, expiry_sec // 5)
    opposite = "PUT" if original_direction == "CALL" else "CALL"
    start_time = asyncio.get_event_loop().time()
    while True:
        await asyncio.sleep(check_interval)
        elapsed = asyncio.get_event_loop().time() - start_time
        if elapsed >= expiry_sec - check_interval:
            break
        try:
            candles = await client.get_candles(asset=(_resolved_asset or ASSET), timeframe=60, count=1)
            if not candles:
                continue
            current_price = float(candles[-1].close)
            pips = round(abs(current_price - entry_price) * 10000, 1)
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
            else:
                hedge_bet = round(original_bet, 2)
                mode = "SIMPLE"
            remaining = max(30, int(expiry_sec - elapsed))
            print(f"[HEDGE] {mode} | {pips} пип | {hedge_bet} | {opposite} | осталось {remaining}с")
            tg(f"🛡 <b>[HEDGE {mode}]</b> {opposite} | {hedge_bet} | {pips} пип | осталось {remaining}с")
            dir_val = OrderDirection.CALL if opposite == "CALL" else OrderDirection.PUT
            order = await client.place_order(asset=(_resolved_asset or ASSET), amount=hedge_bet, direction=dir_val, duration=remaining)
            print(f"[HEDGE] Открыт ID: {order.order_id}")
            return order.order_id, hedge_bet
        except Exception as e:
            print(f"[HEDGE] Ошибка: {e}")
    return None, 0.0

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
        "EURUSD": 8, "GBPUSD": 10, "USDJPY": 9, "USDCHF": 9, "USDCAD": 9, "AUDUSD": 9, "NZDUSD": 9,
        "EURUSD_otc": 8, "GBPUSD_otc": 10, "USDJPY_otc": 9, "USDCHF_otc": 9, "USDCAD_otc": 9, "AUDUSD_otc": 9, "NZDUSD_otc": 9,
        "GBPJPY": 20, "GBPJPY_otc": 20, "EURJPY": 15, "EURJPY_otc": 15, "EURGBP": 10, "EURGBP_otc": 10,
        "GBPAUD": 18, "GBPAUD_otc": 18, "GBPCAD": 16, "GBPCAD_otc": 16, "AUDCAD_otc": 12, "AUDJPY_otc": 14,
        "CADJPY_otc": 13, "CHFJPY_otc": 14, "NZDJPY_otc": 14, "GBPNZD_otc": 22,
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
    EXT_PIPS  = _pip_map_ext.get(_asset_key_ext, ${cfg.profitExtPips})
    EXT_MULT  = ${cfg.profitExtMultiplier}
    EXT_MODE  = "${cfg.profitExtMode}"
    check_interval = max(10, expiry_sec // 5)
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
            candles = await client.get_candles(asset=(_resolved_asset or ASSET), timeframe=60, count=1)
            if not candles:
                continue
            current_price = float(candles[-1].close)
            pips = round(abs(current_price - entry_price) * 10000, 1)
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
                orders.append((order_t.order_id, ext_bet, "TREND"))
                print(f"[EXT] TREND {original_direction} | {ext_bet} | {pips} пип | осталось {remaining}с")
                tg(f"📈 <b>[EXT TREND]</b> {original_direction} | {ext_bet} | {pips} пип | осталось {remaining}с")
            if EXT_MODE in ("rebound", "both"):
                dir_r = OrderDirection.CALL if opposite == "CALL" else OrderDirection.PUT
                order_r = await client.place_order(asset=(_resolved_asset or ASSET), amount=ext_bet, direction=dir_r, duration=remaining)
                orders.append((order_r.order_id, ext_bet, "REBOUND"))
                print(f"[EXT] REBOUND {opposite} | {ext_bet} | {pips} пип | осталось {remaining}с")
                tg(f"🔄 <b>[EXT REBOUND]</b> {opposite} | {ext_bet} | {pips} пип | осталось {remaining}с")
        except Exception as e:
            print(f"[EXT] Ошибка: {e}")
    return orders

async def check_result(client, order_id, balance_before, bet):
    """Ожидание результата по конкретной сделке через get_deal (точно, не зависит от других ботов)."""
    PAYOUT = ${cfg.payoutRate} / 100
    print(f"[WAIT] Ожидаем результат {EXPIRY_SEC//60} мин...")
    await asyncio.sleep(EXPIRY_SEC + 5)
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
        f"⏳ Ожидаю сигналы..."
    )

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

            new_trend, old_trend = check_trend_change(candles)
            if new_trend:
                arrow = "📈" if new_trend in ("UP_UP", "DOWN_UP") else "📉"
                labels = {"UP_UP": "🟢🟢 Два зелёных", "DOWN_DOWN": "🔴🔴 Два красных", "DOWN_UP": "🔴🟢 Разворот вверх", "UP_DOWN": "🟢🔴 Разворот вниз"}
                msg = f"{arrow} <b>Тренд изменился!</b>\\n{labels.get(old_trend, old_trend or '?')} → {labels.get(new_trend, new_trend)} | {ASSET}"
                print(f"[TREND] {old_trend} → {new_trend}")
                tg_info(msg)

            trend = get_trend(candles)
            trend_sig = trend_to_signal(trend)
            signal, signal_info = get_signal(prices, candles)

            if signal:
                labels = {"UP_UP": "🟢🟢", "DOWN_DOWN": "🔴🔴", "DOWN_UP": "🔴🟢", "UP_DOWN": "🟢🔴"}
                ts = datetime.now().strftime("%H:%M:%S")
                if TREND_FOLLOW != "combo":
                    if not trend_sig:
                        print(f"[{ts}] Сигнал {signal} отклонён — тренд неподходящий {labels.get(trend, trend or '?')}")
                        rejected_signals += 1
                        rejected_no_trend += 1
                        await asyncio.sleep(CHECK_INTERVAL)
                        continue
                    if signal != trend_sig:
                        print(f"[{ts}] Сигнал {signal} отклонён — не совпадает с трендом {trend_sig} ({labels.get(trend, trend or '?')})")
                        rejected_signals += 1
                        rejected_conflict += 1
                        await asyncio.sleep(CHECK_INTERVAL)
                        continue

            if signal:
                if BET_PERCENT:
                    balance, currency = await get_balance(client)
                    CURRENCY = currency
                    bet = round(balance * (BASE_BET / 100), 2)
                else:
                    balance, currency = await get_balance(client)
                    CURRENCY = currency
                    bet = current_bet

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
                tg("\\n".join(tg_parts))
                balance_before, _ = await get_balance(client)
                # Получаем цену входа для хеджирования
                entry_price = 0.0
                try:
                    _ec = await client.get_candles(asset=(_resolved_asset or ASSET), timeframe=60, count=1)
                    if _ec:
                        entry_price = float(_ec[-1].close)
                except Exception:
                    pass
                order_id = await place_trade(client, signal, bet)
                if order_id:
                    # Запускаем хедж-монитор параллельно с ожиданием результата
                    hedge_task = asyncio.create_task(
                        hedge_monitor(client, signal, bet, entry_price, EXPIRY_SEC)
                    ) if entry_price > 0 else None
                    won, profit, loss_amount = await check_result(client, order_id, balance_before, bet)
                    # Ждём хедж и расширение прибыли параллельно
                    ext_task = asyncio.create_task(
                        profit_extension_monitor(client, signal, bet, entry_price, EXPIRY_SEC)
                    ) if entry_price > 0 else None
                    if hedge_task:
                        hedge_order_id, hedge_bet = await hedge_task
                        if hedge_order_id:
                            hedge_count += 1
                            h_won, h_profit, h_loss = await check_result(client, hedge_order_id, balance_before, hedge_bet)
                            if h_won:
                                hedge_wins += 1
                            hedge_result = f"✅ +{h_profit:.2f}" if h_won else f"❌ -{h_loss:.2f}"
                            tg(f"🛡 <b>Хедж результат:</b> {hedge_result} {currency}")
                            profit      += h_profit
                            loss_amount += h_loss
                    if ext_task:
                        ext_orders = await ext_task
                        for ext_id, ext_bet, ext_type in ext_orders:
                            ext_count += 1
                            e_won, e_profit, e_loss = await check_result(client, ext_id, balance_before, ext_bet)
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
                    res_emoji = "✅" if won else "❌"
                    hedge_stat = f" | 🛡 {hedge_wins}/{hedge_count}" if hedge_count > 0 else ""
                    ext_stat   = f" | 📈 {ext_wins}/{ext_count}" if ext_count > 0 else ""
                    tg(f"{res_emoji} <b>[{BOT_NAME}] {'Выигрыш' if won else 'Проигрыш'}</b>\\n{signal} | {bet} {currency} | {ASSET}\\nПрофит: {profit:+.2f} {currency}\\nСессия: {total_profit:+.2f} {currency} | WR: {wr:.0f}% ({wins}/{len(trade_log)}){hedge_stat}{ext_stat}")
                    print_stats()
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
from datetime import datetime
from pocketoptionapi_async import AsyncPocketOptionClient, OrderDirection

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

def _tg_send(text, retries=5, delay=5):
    """Отправка через промежуточный сервер — не требует VPN на машине юзера"""
    import urllib.request, json, time
    url = "https://functions.poehali.dev/fb70e0a6-b6c1-49e2-b148-c37dab50f024"
    payload = json.dumps({"token": TG_TOKEN, "chat_id": TG_CHAT_ID, "text": text}).encode()
    req = urllib.request.Request(url, data=payload, headers={"Content-Type": "application/json"}, method="POST")
    for attempt in range(1, retries + 1):
        try:
            urllib.request.urlopen(req, timeout=20)
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

# ===== УПРАВЛЕНИЕ ЧЕРЕЗ TELEGRAM =====
_tg_paused   = False
_tg_stopped  = False
_tg_offset   = 0

def tg_poll_commands():
    """Получить новые команды из Telegram и обработать их"""
    global _tg_paused, _tg_stopped, _tg_offset, TAKE_PROFIT, STOP_LOSS, BASE_BET
    if not TG_ENABLED:
        return
    import urllib.request, json as _json
    try:
        url = f"https://api.telegram.org/bot{TG_TOKEN}/getUpdates?offset={_tg_offset}&timeout=1&limit=5"
        resp = urllib.request.urlopen(url, timeout=5).read()
        data = _json.loads(resp)
        _bot_name_lower = BOT_NAME.lower()
        for upd in data.get("result", []):
            _tg_offset = upd["update_id"] + 1
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
                tg(f"📊 <b>Статус [{BOT_NAME}]</b>\\n💰 Профит: {total_profit:+.2f} {CURRENCY}\\n📈 Сделок: {trades_today} (✅{wins_s}/❌{trades_today-wins_s})\\n{'⏸ На паузе' if _tg_paused else '▶️ Работает'}")
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
            elif cmd == "/help":
                tg(f"📋 <b>Команды [{BOT_NAME}]:</b>\\n/stop {BOT_NAME} — остановить\\n/pause {BOT_NAME} — пауза\\n/resume {BOT_NAME} — продолжить\\n/status {BOT_NAME} — статистика\\n/settp {BOT_NAME} 50\\n/setsl {BOT_NAME} 20\\n/setbet {BOT_NAME} 10\\n\\n<i>Вместо имени можно писать all</i>")
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
    window = closed[-5:] if len(closed) >= 5 else closed
    colors = [candle_color(c) for c in window]
    ups   = colors.count("UP")
    downs = colors.count("DOWN")
    last  = candle_color(closed[-1])
    prev  = candle_color(closed[-2])
    cur   = candles[-1]
    bar   = "".join("🟢" if col == "UP" else "🔴" for col in colors)
    cur_emoji = "🟢" if cur[3] >= cur[0] else "🔴"
    print(f"[СВЕЧИ] таймфрейм={EXPIRY_SEC}с ({EXPIRY_SEC//60}мин) | последние {len(window)} свечей: {bar} (▲{ups}/▼{downs}) | текущая: {cur_emoji}")
    if ups >= 3:
        return "UP_UP" if last == "UP" else "DOWN_UP"
    if downs >= 3:
        return "DOWN_DOWN" if last == "DOWN" else "UP_DOWN"
    if prev == "DOWN" and last == "UP":
        return "DOWN_UP"
    if prev == "UP" and last == "DOWN":
        return "UP_DOWN"
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

async def place_trade(client, direction, amount):
    try:
        dir_val = OrderDirection.CALL if direction == "CALL" else OrderDirection.PUT
        order = await client.place_order(asset=ASSET, amount=amount, direction=dir_val, duration=EXPIRY_SEC)
        print(f"[TRADE] {direction} | {amount} | {EXPIRY_SEC//60} мин | ID: {order.order_id}")
        return order.order_id
    except Exception as e:
        print(f"[ERROR] place_trade: {e}")
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
    print(f"[STATS] По тренду: {calls_follow} ставок | Против/комбо: {calls_reverse} ставок")

async def main():
    global total_profit, trades_today, current_bet, calls_follow, calls_reverse
    calls_follow  = 0
    calls_reverse = 0

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
        f"⏳ Ожидаю сигналы..."
    )

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

        await asyncio.sleep(3)
        candles, prices = await get_candles_data(client)
        if not prices:
            await asyncio.sleep(CHECK_INTERVAL)
            continue

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

        if signal:
            if TRADE_DIRECTION == "call_only" and signal != "CALL":
                print(f"[FILTER] Сигнал {signal} пропущен — фильтр: только CALL")
                await asyncio.sleep(CHECK_INTERVAL)
                continue
            if TRADE_DIRECTION == "put_only" and signal != "PUT":
                print(f"[FILTER] Сигнал {signal} пропущен — фильтр: только PUT")
                await asyncio.sleep(CHECK_INTERVAL)
                continue

        if signal:
            labels = {"UP_UP": "🟢🟢", "DOWN_DOWN": "🔴🔴", "DOWN_UP": "🔴🟢", "UP_DOWN": "🟢🔴"}
            ts = datetime.now().strftime("%H:%M:%S")
            if TREND_FOLLOW != "combo":
                if not trend_sig:
                    print(f"[{ts}] Комбо-сигнал {signal} отклонён — тренд неподходящий {labels.get(trend, trend or '?')}")
                    await asyncio.sleep(CHECK_INTERVAL)
                    continue
                signal = trend_sig

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
            order_id = await place_trade(client, signal, bet)
            if order_id:
                won, profit = await check_result(client, order_id, balance_before, bet)
                total_profit += profit
                trades_today += 1
                current_bet   = adjust_bet(won)
                trade_log.append({"won": won, "profit": profit})
                wins = sum(1 for t in trade_log if t["won"])
                wr   = wins / len(trade_log) * 100
                res_emoji = "✅" if won else "❌"
                tg(f"{res_emoji} <b>[{BOT_NAME}] {'Выигрыш' if won else 'Проигрыш'}</b>\\n{signal} | {bet} {currency} | {ASSET}\\nПрофит: {profit:+.2f} {currency}\\nСессия: {total_profit:+.2f} {currency} | WR: {wr:.0f}% ({wins}/{len(trade_log)})")
                print_stats()
        else:
            ts = datetime.now().strftime("%H:%M:%S")
            print(f"[{ts}] Нет подтверждённого сигнала, ожидание {CHECK_INTERVAL} сек...")
            await asyncio.sleep(CHECK_INTERVAL)

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