export type POStrategy = "rsi_reversal" | "ema_cross" | "martingale" | "candle_pattern" | "support_resistance"
export type POExpiry = "1" | "2" | "3" | "5" | "15"
export type POComboLogic = "AND" | "OR"
export type POEmaTrendMode = "ema9_21" | "ema20_50" | "ema50_200" | "custom"

export interface POBotConfig {
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
  trendMode: "same" | "reverse"
  trendFollow: boolean
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
  // Валютные пары (Forex)
  "EUR/USD", "GBP/USD", "USD/JPY", "AUD/USD", "USD/CAD",
  "EUR/GBP", "EUR/JPY", "NZD/USD", "EUR/CHF", "CAD/JPY", "CAD/CHF", "AUD/CAD",
  // Валютные пары OTC
  "EUR/USD (OTC)", "GBP/USD (OTC)", "USD/JPY (OTC)", "AUD/USD (OTC)", "EUR/GBP (OTC)",
  "USD/CAD (OTC)", "NZD/USD (OTC)", "AUD/CAD (OTC)", "USD/CHF (OTC)",
  "EUR/CHF (OTC)", "CAD/JPY (OTC)", "CAD/CHF (OTC)",
  // Криптовалюты
  "BTC/USD", "ETH/USD", "LTC/USD", "XRP/USD", "SOL/USD",
  // Криптовалюты OTC
  "BTC/USD (OTC)", "ETH/USD (OTC)", "LTC/USD (OTC)", "XRP/USD (OTC)", "SOL/USD (OTC)",
  // Прочее
  "Gold (OTC)", "Oil (OTC)",
]

export const PO_ASSETS_GROUPS = [
  {
    label: "💱 Валютные пары",
    assets: ["EUR/USD", "GBP/USD", "USD/JPY", "AUD/USD", "USD/CAD", "EUR/CHF", "CAD/JPY", "CAD/CHF", "AUD/CAD"],
  },
  {
    label: "💱 Валютные пары OTC",
    assets: ["EUR/USD (OTC)", "GBP/USD (OTC)", "USD/JPY (OTC)", "AUD/USD (OTC)", "EUR/GBP (OTC)", "EUR/CHF (OTC)", "CAD/JPY (OTC)", "CAD/CHF (OTC)", "AUD/CAD (OTC)"],
  },
  {
    label: "₿ Криптовалюты",
    assets: ["BTC/USD", "ETH/USD", "LTC/USD", "XRP/USD", "SOL/USD"],
  },
  {
    label: "₿ Криптовалюты OTC",
    assets: ["BTC/USD (OTC)", "ETH/USD (OTC)", "LTC/USD (OTC)", "XRP/USD (OTC)", "SOL/USD (OTC)"],
  },
  {
    label: "🏅 Прочее",
    assets: ["Gold (OTC)", "Oil (OTC)", "EUR/GBP", "EUR/JPY", "NZD/USD", "USD/CHF (OTC)"],
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
  trendFollow: true,
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
    """Сигнал по RSI${cfg.trendFollow ? " — разворотная стратегия (перепроданность=CALL, перекупленность=PUT)" : " — контртрендовая стратегия (перепроданность=PUT, перекупленность=CALL)"}"""
    prices = prices[:-1]
    if len(prices) < ${cfg.rsiPeriod} + 1:
        return None, ""
    rsi = calculate_rsi(prices)
    oversold  = rsi <= ${cfg.rsiOversold}
    overbought = rsi >= ${cfg.rsiOverbought}
    info = f"RSI(${cfg.rsiPeriod}): {rsi:.1f}"
    if oversold:
        return ("CALL" if ${cfg.trendFollow ? "True" : "False"} else "PUT"), f"{info} ≤ ${cfg.rsiOversold} (перепроданность)"
    if overbought:
        return ("PUT" if ${cfg.trendFollow ? "True" : "False"} else "CALL"), f"{info} ≥ ${cfg.rsiOverbought} (перекупленность)"
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
    """Сигнал по пересечению EMA ${cfg.emaFast} / EMA ${cfg.emaSlow}${cfg.trendFollow ? " (по тренду)" : " (против тренда)"}"""
    prices = prices[:-1]
    if len(prices) < ${cfg.emaSlow} + 2:
        return None, ""
    ema_fast = calculate_ema(prices, ${cfg.emaFast})
    ema_slow = calculate_ema(prices, ${cfg.emaSlow})
    cross_up = ema_fast[-1] > ema_slow[-1] and ema_fast[-2] <= ema_slow[-2]
    cross_down = ema_fast[-1] < ema_slow[-1] and ema_fast[-2] >= ema_slow[-2]
    info = f"EMA${cfg.emaFast}={ema_fast[-1]:.5f} / EMA${cfg.emaSlow}={ema_slow[-1]:.5f}"
    if cross_up:
        return "${cfg.trendFollow ? "CALL" : "PUT"}", f"{info} (пересечение вверх ↑)"
    if cross_down:
        return "${cfg.trendFollow ? "PUT" : "CALL"}", f"{info} (пересечение вниз ↓)"
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
def find_levels(prices, window=10):
    """Поиск уровней поддержки и сопротивления"""
    supports, resistances = [], []
    for i in range(window, len(prices) - window):
        if prices[i] == min(prices[i-window:i+window]):
            supports.append(prices[i])
        if prices[i] == max(prices[i-window:i+window]):
            resistances.append(prices[i])
    return supports[-3:], resistances[-3:]

def get_signal(prices, candles=None):
    """Вход от уровней поддержки/сопротивления"""
    prices = prices[:-1]
    if len(prices) < 30:
        return None, ""
    supports, resistances = find_levels(prices)
    current = prices[-1]
    threshold = current * 0.001
    for sup in supports:
        if abs(current - sup) < threshold:
            return "CALL", f"Цена {current:.5f} у поддержки {sup:.5f} (отскок вверх)"
    for res in resistances:
        if abs(current - res) < threshold:
            return "PUT", f"Цена {current:.5f} у сопротивления {res:.5f} (отскок вниз)"
    return None, f"Цена {current:.5f} | sup={[round(s,5) for s in supports]} res={[round(r,5) for r in resistances]}"`,
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
    // Валютные пары
    "EUR/USD":       "EURUSD",
    "GBP/USD":       "GBPUSD",
    "USD/JPY":       "USDJPY",
    "AUD/USD":       "AUDUSD",
    "USD/CAD":       "USDCAD",
    "EUR/GBP":       "EURGBP",
    "EUR/JPY":       "EURJPY",
    "NZD/USD":       "NZDUSD",
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
  Направление: ${cfg.trendFollow ? "По тренду ↗" : "Против тренда ↙"}
  Режим свечей: ${(cfg.trendMode ?? "same") === "same" ? "Одинаковые (2 зелёных=CALL / 2 красных=PUT)" : "Разворот (красн+зел=PUT / зел+красн=CALL)"}
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
TREND_MODE       = "${cfg.trendMode ?? "same"}"     # "same" = 2 одинаковых, "reverse" = разворот

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
TG_TOKEN   = "${cfg.tgToken}"
TG_CHAT_ID = "${cfg.tgChatId}"
TG_ENABLED      = ${cfg.tgEnabled ? "True" : "False"} and bool(TG_TOKEN and TG_CHAT_ID)
TG_PROXY        = "${cfg.tgProxy}"
TG_NOTIFY_MODE  = "${cfg.tgNotifyMode ?? "all"}"

def _tg_send(text, retries=3, delay=5):
    import urllib.request, urllib.parse, time
    url = f"https://api.telegram.org/bot{TG_TOKEN}/sendMessage"
    data = urllib.parse.urlencode({"chat_id": TG_CHAT_ID, "text": text, "parse_mode": "HTML"}).encode()
    if TG_PROXY:
        import socks, socket
        from urllib.parse import urlparse
        p = urlparse(TG_PROXY)
        socks.set_default_proxy(socks.SOCKS5, p.hostname, p.port, username=p.username, password=p.password)
        socket.socket = socks.socksocket
    for attempt in range(1, retries + 1):
        try:
            urllib.request.urlopen(url, data, timeout=8)
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

# ===== СОСТОЯНИЕ =====
total_profit = 0.0
trades_today = 0
trade_log    = []
${martingaleBlock}
# ===== ТРЕНД ПО 2 ПОСЛЕДНИМ СВЕЧАМ =====
_last_trend = None

# ===== КЭШ СВЕЧЕЙ =====
_candle_cache     = []
_candle_asset     = None
_last_candle_time = None

def candle_color(c):
    return "UP" if c[3] >= c[0] else "DOWN"

def get_trend(candles):
    closed = candles[:-1]
    if len(closed) < 2:
        return None
    prev = candle_color(closed[-2])
    last = candle_color(closed[-1])
    prev_emoji = "🟢" if prev == "UP" else "🔴"
    last_emoji = "🟢" if last == "UP" else "🔴"
    p = closed[-2]
    l = closed[-1]
    cur = candles[-1]
    cur_emoji = "🟢" if cur[3] >= cur[0] else "🔴"
    print(f"[СВЕЧИ] таймфрейм={EXPIRY_SEC}с ({EXPIRY_SEC//60}мин) | предпоследняя={prev_emoji} o={p[0]:.5f} c={p[3]:.5f} | последняя закрытая={last_emoji} o={l[0]:.5f} c={l[3]:.5f} | текущая (незакрытая)={cur_emoji} o={cur[0]:.5f} c={cur[3]:.5f}")
    if prev == "UP" and last == "UP":
        return "UP_UP"
    if prev == "DOWN" and last == "DOWN":
        return "DOWN_DOWN"
    if prev == "DOWN" and last == "UP":
        return "DOWN_UP"
    if prev == "UP" and last == "DOWN":
        return "UP_DOWN"
    return None

def trend_to_signal(trend):
    if TREND_MODE == "same":
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
            return raw if raw else None
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
                return None
    print("[ERROR] Не удалось получить свечи после 3 попыток переподключения")
    return None

async def get_candles_data(client):
    """Получение свечей с кэшем — обновляет только когда закрывается новая свеча"""
    global _candle_cache, _candle_asset, _last_candle_time
    base = ASSET.replace("_otc", "").replace("#", "")
    candidates = [ASSET, f"#{ASSET}", base, f"{base}_otc", f"#{base}_otc"]
    seen = []
    for name in candidates:
        if name in seen:
            continue
        seen.append(name)
        try:
            raw = await try_get_candles(client, name)
            if not raw:
                continue
            if name != ASSET:
                print(f"[INFO] Актив найден как: {name}")
            if hasattr(raw[0], 'time'):
                sorted_raw = sorted(raw, key=lambda c: c.time)
            else:
                sorted_raw = list(reversed(raw))
            closed_raw = sorted_raw[:-1]
            if not closed_raw:
                continue
            has_time = hasattr(closed_raw[-1], 'time')
            last_time = closed_raw[-1].time if has_time else f"{closed_raw[-1].open:.5f}_{closed_raw[-1].close:.5f}"
            print(f"[CACHE_DEBUG] has_time={has_time} last_time={last_time} cached={_last_candle_time} match={_last_candle_time == last_time}")
            if _candle_asset == name and _last_candle_time == last_time and _candle_cache:
                print(f"[CACHE] Новых закрытых свечей нет, используем кэш ({len(_candle_cache)} шт)")
                candles_all = _candle_cache + [(sorted_raw[-1].open, sorted_raw[-1].high, sorted_raw[-1].low, sorted_raw[-1].close)]
                prices_all  = [c[3] for c in candles_all]
                return candles_all, prices_all
            _candle_cache     = [(c.open, c.high, c.low, c.close) for c in closed_raw]
            _candle_asset     = name
            _last_candle_time = last_time
            lc = closed_raw[-1]
            emoji = '🟢' if lc.close >= lc.open else '🔴'
            print(f"[CACHE] Новая закрытая свеча: {emoji} o={lc.open:.5f} c={lc.close:.5f} | закрытых в кэше: {len(_candle_cache)}")
            candles_all = _candle_cache + [(sorted_raw[-1].open, sorted_raw[-1].high, sorted_raw[-1].low, sorted_raw[-1].close)]
            prices_all  = [c[3] for c in candles_all]
            return candles_all, prices_all
        except Exception as e:
            print(f"[CACHE_ERR] {e}")
            continue
    print(f"[ERROR] Актив {ASSET} не найден ни в одном формате")
    try:
        assets = await client.get_available_assets()
        if assets:
            names = [str(a) for a in list(assets)[:10]]
            print(f"[HINT] Доступные активы: {', '.join(names)}")
    except Exception:
        pass
    return [], []

async def place_trade(client, direction, amount):
    """Открытие опциона"""
    try:
        dir_val = OrderDirection.CALL if direction == "CALL" else OrderDirection.PUT
        order = await client.place_order(asset=ASSET, amount=amount, direction=dir_val, duration=EXPIRY_SEC)
        print(f"[TRADE] {direction} | {amount} | {EXPIRY_SEC//60} мин | ID: {order.order_id}")
        return order.order_id
    except Exception as e:
        print(f"[ERROR] Сделка: {e}")
        return None

async def check_result(client, order_id, balance_before):
    """Ожидание результата через сравнение баланса"""
    print(f"[WAIT] Ожидаем результат {EXPIRY_SEC//60} мин...")
    await asyncio.sleep(EXPIRY_SEC + 10)
    try:
        for attempt in range(15):
            balance_after, _ = await get_balance(client)
            if balance_after == 0.0:
                await asyncio.sleep(5)
                continue
            profit = round(balance_after - balance_before, 2)
            if profit == 0.0 and attempt < 10:
                await asyncio.sleep(5)
                continue
            won = profit > 0
            status = "ВЫИГРЫШ ✅" if won else "ПРОИГРЫШ ❌"
            print(f"[RESULT] {status} | Профит: {profit}")
            return won, profit
        print("[WARN] Не удалось определить результат сделки")
        return False, 0.0
    except Exception as e:
        print(f"[ERROR] Результат: {e}")
        return False, 0.0

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
    print(f"\\n[STATS] {wins}/{total} сделок | Winrate: {winrate:.1f}% | Сессия: {round(total_profit, 2)} {CURRENCY}\\n")

async def main():
    global total_profit, trades_today, current_bet

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
    tg_info(f"🤖 <b>Бот запущен</b>\\nСчёт: {account_type}\\nСтратегия: ${strategyLabel}\\nАктив: {ASSET} | Экспирация: {EXPIRY_SEC//60} мин\\nБаланс: {balance:.2f} {CURRENCY} | TP: {TAKE_PROFIT} | SL: {STOP_LOSS}")

    _reconnect_attempts = 0

    while True:
        try:
            if total_profit >= TAKE_PROFIT:
                msg = f"[TP] Take Profit достигнут: +{round(total_profit, 2)} {CURRENCY}"
                print(msg)
                tg(f"✅ <b>Take Profit достигнут!</b>\\n+{total_profit:.2f} {CURRENCY} за сессию")
                if AUTO_RESTART:
                    total_profit = 0
                    trades_today = 0
                    await asyncio.sleep(300)
                    continue
                break

            if total_profit <= -STOP_LOSS:
                msg = f"[SL] Stop Loss достигнут: {round(total_profit, 2)} {CURRENCY}"
                print(msg)
                tg(f"🛑 <b>Stop Loss достигнут!</b>\\n{total_profit:.2f} {CURRENCY} за сессию")
                if AUTO_RESTART:
                    total_profit = 0
                    trades_today = 0
                    await asyncio.sleep(300)
                    continue
                break

            if trades_today >= DAILY_LIMIT:
                print(f"[LIMIT] Дневной лимит {DAILY_LIMIT} сделок исчерпан")
                tg_info(f"⚠️ <b>Дневной лимит исчерпан</b>\\n{DAILY_LIMIT} сделок | Итог: {total_profit:.2f} {CURRENCY}")
                break

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
                if not trend_sig:
                    print(f"[{ts}] Сигнал {signal} отклонён — тренд неподходящий {labels.get(trend, trend or '?')}")
                    await asyncio.sleep(CHECK_INTERVAL)
                    continue
                signal = trend_sig

            if signal:
                if BET_PERCENT:
                    balance, currency = await get_balance(client)
                    CURRENCY = currency
                    bet = round(balance * (BASE_BET / 100), 2)
                else:
                    balance, currency = await get_balance(client)
                    CURRENCY = currency
                    bet = current_bet

                emoji = "📈" if signal == "CALL" else "📉"
                _tlabels = {"UP_UP": "🟢🟢 Два зелёных", "DOWN_DOWN": "🔴🔴 Два красных", "DOWN_UP": "🔴🟢 Разворот вверх", "UP_DOWN": "🟢🔴 Разворот вниз"}
                trend_label = f"Тренд: {_tlabels.get(trend, '— нет')}"
                sig_line = f"📊 Сигнал: {signal_info}" if signal_info else ""
                tg_parts = [f"{emoji} <b>Сделка открыта</b>", f"{signal} | {bet} {currency} | {ASSET} | {EXPIRY_SEC//60} мин", trend_label]
                if sig_line:
                    tg_parts.append(sig_line)
                tg_parts.append(f"📋 Сделок сегодня: {trades_today + 1}")
                tg("\\n".join(tg_parts))
                balance_before, _ = await get_balance(client)
                order_id = await place_trade(client, signal, bet)
                if order_id:
                    won, profit = await check_result(client, order_id, balance_before)
                    total_profit += profit
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
                    tg(f"{res_emoji} <b>{'Выигрыш' if won else 'Проигрыш'}</b>\\n{signal} | {bet} {currency} | {ASSET}\\nПрофит: {profit:+.2f} {currency}\\nСессия: {total_profit:+.2f} {currency} | WR: {wr:.0f}% ({wins}/{len(trade_log)})")
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
    if rsi <= ${cfg.rsiOversold}: return "${cfg.trendFollow ? "CALL" : "PUT"}"
    if rsi >= ${cfg.rsiOverbought}: return "${cfg.trendFollow ? "PUT" : "CALL"}"
    return None`)
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
        return None
    fast = calculate_ema(prices, ${cfg.emaFast})
    slow = calculate_ema(prices, ${cfg.emaSlow})
    if fast[-1] > slow[-1] and fast[-2] <= slow[-2]: return "${cfg.trendFollow ? "CALL" : "PUT"}"
    if fast[-1] < slow[-1] and fast[-2] >= slow[-2]: return "${cfg.trendFollow ? "PUT" : "CALL"}"
    return None`)
    callLines.push("signal_ema(prices, candles)")
  }

  if (selected.includes("candle_pattern")) {
    fnBlocks.push(`
def signal_candle_pattern(prices, candles):
    if not candles or len(candles) < 3:
        return None
    o1, h1, l1, c1 = candles[-2]
    o2, h2, l2, c2 = candles[-1]
    body2 = abs(c2 - o2)
    low_sh = min(o2, c2) - l2
    up_sh  = h2 - max(o2, c2)
    # Молот / Падающая звезда / Поглощения
    if low_sh > body2 * 2 and up_sh < body2 * 0.5 and c1 < o1: return "${cfg.trendFollow ? "CALL" : "PUT"}"
    if up_sh > body2 * 2 and low_sh < body2 * 0.5 and c1 > o1: return "${cfg.trendFollow ? "PUT" : "CALL"}"
    if c1 < o1 and c2 > o2 and c2 > o1 and o2 < c1: return "${cfg.trendFollow ? "CALL" : "PUT"}"
    if c1 > o1 and c2 < o2 and c2 < o1 and o2 > c1: return "${cfg.trendFollow ? "PUT" : "CALL"}"
    return None`)
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
        return None
    sup, res = find_levels(prices)
    cur = prices[-1]
    thr = cur * 0.001
    for s in sup:
        if abs(cur - s) < thr: return "${cfg.trendFollow ? "CALL" : "PUT"}"
    for r in res:
        if abs(cur - r) < thr: return "${cfg.trendFollow ? "PUT" : "CALL"}"
    return None`)
    callLines.push("signal_support_resistance(prices, candles)")
  }

  const combineLogic = cfg.comboLogic === "AND"
    ? `
def get_combined_signal(prices, candles):
    """Комбо AND — большинство стратегий должны совпасть"""
    names = [${callLines.map(l => `"${l.replace(/\(.*\)/, '')}"`).join(", ")}]
    raw   = [${callLines.join(", ")}]
    signals = [(n, s) for n, s in zip(names, raw) if s is not None]
    majority = (${selected.length} // 2) + 1
    calls = sum(1 for _, s in signals if s == "CALL")
    puts  = sum(1 for _, s in signals if s == "PUT")
    if calls >= majority:
        info = "AND: " + ", ".join(n for n, s in signals if s == "CALL")
        return "CALL", info
    if puts >= majority:
        info = "AND: " + ", ".join(n for n, s in signals if s == "PUT")
        return "PUT", info
    return None, ""  # Нет большинства`
    : `
def get_combined_signal(prices, candles):
    """Комбо OR — достаточно хотя бы одного сигнала"""
    names = [${callLines.map(l => `"${l.replace(/\(.*\)/, '')}"`).join(", ")}]
    raw   = [${callLines.join(", ")}]
    signals = [(n, s) for n, s in zip(names, raw) if s is not None]
    if not signals:
        return None, ""
    calls = sum(1 for _, s in signals if s == "CALL")
    puts  = sum(1 for _, s in signals if s == "PUT")
    if calls > puts:
        info = "OR: " + ", ".join(n for n, s in signals if s == "CALL")
        return "CALL", info
    if puts > calls:
        info = "OR: " + ", ".join(n for n, s in signals if s == "PUT")
        return "PUT", info
    return None, ""  # Равенство голосов — пропускаем`

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
  Направление: ${cfg.trendFollow ? "По тренду ↗" : "Против тренда ↙"}
  Режим свечей: ${(cfg.trendMode ?? "same") === "same" ? "Одинаковые (2 зелёных=CALL / 2 красных=PUT)" : "Разворот (красн+зел=PUT / зел+красн=CALL)"}
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
TREND_MODE       = "${cfg.trendMode ?? "same"}"     # "same" = 2 одинаковых, "reverse" = разворот

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
TG_TOKEN   = "${cfg.tgToken}"
TG_CHAT_ID = "${cfg.tgChatId}"
TG_ENABLED      = ${cfg.tgEnabled ? "True" : "False"} and bool(TG_TOKEN and TG_CHAT_ID)
TG_PROXY        = "${cfg.tgProxy}"
TG_NOTIFY_MODE  = "${cfg.tgNotifyMode ?? "all"}"

def _tg_send(text, retries=3, delay=5):
    import urllib.request, urllib.parse, time
    url = f"https://api.telegram.org/bot{TG_TOKEN}/sendMessage"
    data = urllib.parse.urlencode({"chat_id": TG_CHAT_ID, "text": text, "parse_mode": "HTML"}).encode()
    if TG_PROXY:
        import socks, socket
        from urllib.parse import urlparse
        p = urlparse(TG_PROXY)
        socks.set_default_proxy(socks.SOCKS5, p.hostname, p.port, username=p.username, password=p.password)
        socket.socket = socks.socksocket
    for attempt in range(1, retries + 1):
        try:
            urllib.request.urlopen(url, data, timeout=8)
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

# ===== СОСТОЯНИЕ =====
total_profit = 0.0
trades_today = 0
trade_log    = []
${martingaleBlock}
# ===== ТРЕНД ПО 2 ПОСЛЕДНИМ СВЕЧАМ =====
_last_trend = None

# ===== КЭШ СВЕЧЕЙ =====
_candle_cache     = []
_candle_asset     = None
_last_candle_time = None

def candle_color(c):
    return "UP" if c[3] >= c[0] else "DOWN"

def get_trend(candles):
    closed = candles[:-1]
    if len(closed) < 2:
        return None
    prev = candle_color(closed[-2])
    last = candle_color(closed[-1])
    prev_emoji = "🟢" if prev == "UP" else "🔴"
    last_emoji = "🟢" if last == "UP" else "🔴"
    p = closed[-2]
    l = closed[-1]
    cur = candles[-1]
    cur_emoji = "🟢" if cur[3] >= cur[0] else "🔴"
    print(f"[СВЕЧИ] таймфрейм={EXPIRY_SEC}с ({EXPIRY_SEC//60}мин) | предпоследняя={prev_emoji} o={p[0]:.5f} c={p[3]:.5f} | последняя закрытая={last_emoji} o={l[0]:.5f} c={l[3]:.5f} | текущая (незакрытая)={cur_emoji} o={cur[0]:.5f} c={cur[3]:.5f}")
    if prev == "UP" and last == "UP":
        return "UP_UP"
    if prev == "DOWN" and last == "DOWN":
        return "DOWN_DOWN"
    if prev == "DOWN" and last == "UP":
        return "DOWN_UP"
    if prev == "UP" and last == "DOWN":
        return "UP_DOWN"
    return None

def trend_to_signal(trend):
    if TREND_MODE == "same":
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
${fnBlocks.join("\n")}

# ===== КОМБО-ЛОГИКА (${cfg.comboLogic}) =====
${combineLogic}

async def get_candles_data(client):
    try:
        raw = await client.get_candles(asset=ASSET, timeframe=60, count=100)
        candles = [(c.open, c.high, c.low, c.close) for c in raw]
        prices  = [c.close for c in raw]
        print(f"[CANDLES] Получено свечей: {len(prices)}")
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

async def check_result(client, order_id, balance_before):
    print(f"[WAIT] Ожидаем результат {EXPIRY_SEC//60} мин...")
    await asyncio.sleep(EXPIRY_SEC + 5)
    try:
        for attempt in range(10):
            balance_after, _ = await get_balance(client)
            if balance_after == 0.0:
                await asyncio.sleep(3)
                continue
            profit = round(balance_after - balance_before, 2)
            if profit == 0.0 and attempt < 3:
                await asyncio.sleep(3)
                continue
            won = profit > 0
            print(f"[RESULT] {'ВЫИГРЫШ ✅' if won else 'ПРОИГРЫШ ❌'} | Профит: {profit}")
            return won, profit
        print("[WARN] Не удалось определить результат сделки")
        return False, 0.0
    except Exception as e:
        print(f"[ERROR] check_result: {e}")
        return False, 0.0

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

async def main():
    global total_profit, trades_today, current_bet

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
    trend_mode_label = "🟢🟢/🔴🔴 Одинаковые" if TREND_MODE == "same" else "🔴🟢/🟢🔴 Разворот"
    print(f"  Режим тренда: {trend_mode_label}")
    print("=" * 55 + "\\n")
    tg_info(f"🤖 <b>КОМБО-Бот запущен</b>\\nСчёт: {account_type}\\n${labels} (${cfg.comboLogic})\\nАктив: {ASSET} | {EXPIRY_SEC//60} мин\\nБаланс: {balance:.2f} {CURRENCY} | TP: {TAKE_PROFIT} | SL: {STOP_LOSS}")

    while True:
        if total_profit >= TAKE_PROFIT:
            print(f"[TP] +{total_profit:.2f} {CURRENCY}")
            tg(f"✅ <b>Take Profit достигнут!</b>\\n+{total_profit:.2f} {CURRENCY} за сессию")
            if AUTO_RESTART:
                total_profit = 0; trades_today = 0; await asyncio.sleep(300); continue
            break
        if total_profit <= -STOP_LOSS:
            print(f"[SL] {total_profit:.2f} {CURRENCY}")
            tg(f"🛑 <b>Stop Loss достигнут!</b>\\n{total_profit:.2f} {CURRENCY} за сессию")
            if AUTO_RESTART:
                total_profit = 0; trades_today = 0; await asyncio.sleep(300); continue
            break
        if trades_today >= DAILY_LIMIT:
            print(f"[LIMIT] Лимит {DAILY_LIMIT} сделок исчерпан")
            tg_info(f"⚠️ <b>Дневной лимит исчерпан</b>\\n{DAILY_LIMIT} сделок | Итог: {total_profit:.2f} {CURRENCY}")
            break

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
            labels = {"UP_UP": "🟢🟢", "DOWN_DOWN": "🔴🔴", "DOWN_UP": "🔴🟢", "UP_DOWN": "🟢🔴"}
            ts = datetime.now().strftime("%H:%M:%S")
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
            emoji = "📈" if signal == "CALL" else "📉"
            _tlabels2 = {"UP_UP": "🟢🟢 Два зелёных", "DOWN_DOWN": "🔴🔴 Два красных", "DOWN_UP": "🔴🟢 Разворот вверх", "UP_DOWN": "🟢🔴 Разворот вниз"}
            trend_info = _tlabels2.get(trend, "— нет тренда")
            tg_parts = [f"{emoji} <b>Комбо-сделка</b>", f"{signal} | {bet} {currency} | {ASSET}", f"Тренд: {trend_info}"]
            if signal_info:
                tg_parts.append(f"📊 Сигнал: {signal_info}")
            tg_parts.append(f"📋 Сделок сегодня: {trades_today + 1}")
            tg("\\n".join(tg_parts))
            balance_before, _ = await get_balance(client)
            order_id = await place_trade(client, signal, bet)
            if order_id:
                won, profit = await check_result(client, order_id, balance_before)
                total_profit += profit
                trades_today += 1
                current_bet   = adjust_bet(won)
                trade_log.append({"won": won, "profit": profit})
                wins = sum(1 for t in trade_log if t["won"])
                wr   = wins / len(trade_log) * 100
                res_emoji = "✅" if won else "❌"
                tg(f"{res_emoji} <b>{'Выигрыш' if won else 'Проигрыш'}</b>\\n{signal} | {bet} {currency} | {ASSET}\\nПрофит: {profit:+.2f} {currency}\\nСессия: {total_profit:+.2f} {currency} | WR: {wr:.0f}% ({wins}/{len(trade_log)})")
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