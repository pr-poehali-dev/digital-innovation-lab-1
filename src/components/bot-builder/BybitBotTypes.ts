/**
 * 🟠 Bybit Bot — типы и генератор Python-кода.
 *
 * Концепция: переиспользуем POBotConfig (вся UI-форма та же), добавляем поля
 * специфичные для Bybit (mode, testnet, leverage, API-ключи). Генератор отличается
 * только обвязкой брокера: pybit вместо pocketoptionapi_async.
 *
 * Что осталось от Pocket Option:
 *   - стратегии (RSI, EMA, MACD, Bollinger, ATR),
 *   - TP/SL, мартингейл, дневные лимиты,
 *   - сильный тренд, разогрев, паузы,
 *   - Telegram-уведомления.
 *
 * Что изменилось:
 *   - вместо SESSION_ID — BYBIT_API_KEY + BYBIT_API_SECRET,
 *   - вместо CALL/PUT — buy/sell ордера на споте или Long/Short на фьюче,
 *   - вместо экспирации — TP/SL в % от цены входа (на споте нет «таймера»),
 *   - вместо «выплата 92%» — реальный комиссии биржи 0.1%,
 *   - вместо OTC-активов — пары BTC/USDT, ETH/USDT и т.д.
 */
import type { POBotConfig } from "./PocketOptionBotTypes"

export type BybitMode = "spot" | "futures"

/** Дополнительные поля, специфичные для Bybit. POBotConfig используется как база. */
export interface BybitExtras {
  /** Спот или линейные фьючерсы */
  bybitMode: BybitMode
  /** Testnet (api-testnet.bybit.com) или mainnet */
  bybitTestnet: boolean
  /** Плечо для фьючерсов (1-100). Игнорируется для spot. */
  bybitLeverage: number
  /** TP в % от цены входа (например, 1.5 = +1.5%). Заменяет «дневной TP в рублях». */
  bybitTpPercent: number
  /** SL в % от цены входа (например, 1.0 = -1.0%). */
  bybitSlPercent: number
  /** Использовать рыночные ордера (market) или лимитные (limit) */
  bybitOrderType: "market" | "limit"
  /** Таймфрейм свечей в минутах: 1, 3, 5, 15, 60 */
  bybitTimeframeMin: 1 | 3 | 5 | 15 | 60
  /** Доп. индикаторы (поверх RSI/EMA из основного конфига) */
  bybitUseMacd: boolean
  bybitUseBollinger: boolean
  bybitUseAtrFilter: boolean
  /** Включить шортинг (только для futures) */
  bybitAllowShort: boolean
}

export type BybitBotConfig = POBotConfig & BybitExtras

/** Дефолты для Bybit-бота — безопасные стартовые значения. */
export const BYBIT_DEFAULT_EXTRAS: BybitExtras = {
  bybitMode: "spot",
  bybitTestnet: true,
  bybitLeverage: 3,
  bybitTpPercent: 1.5,
  bybitSlPercent: 1.0,
  bybitOrderType: "market",
  bybitTimeframeMin: 5,
  bybitUseMacd: true,
  bybitUseBollinger: true,
  bybitUseAtrFilter: true,
  bybitAllowShort: false,
}

/** Список популярных пар на Bybit (для дропдауна актива). */
export const BYBIT_ASSETS = [
  "BTC/USDT",
  "ETH/USDT",
  "SOL/USDT",
  "BNB/USDT",
  "XRP/USDT",
  "DOGE/USDT",
  "ADA/USDT",
  "MATIC/USDT",
  "LINK/USDT",
  "AVAX/USDT",
  "TON/USDT",
  "ARB/USDT",
] as const

// ═══════════════════════════════════════════════════════════════════
// 🔧 Генератор Python-кода для Bybit-бота
// ═══════════════════════════════════════════════════════════════════

/**
 * Генерирует готовый bot.py для Bybit на основе конфига.
 *
 * Используется библиотека pybit (официальная). Если включён mode=futures —
 * используется HTTP с категорией "linear", иначе "spot".
 */
export function generateBybitCode(cfg: BybitBotConfig): string {
  // Базовая нормализация
  const symbol = (cfg.asset || "BTC/USDT").replace("/", "") // BTC/USDT → BTCUSDT
  const category = cfg.bybitMode === "futures" ? "linear" : "spot"
  const tfMin = cfg.bybitTimeframeMin
  // Bybit принимает таймфрейм как строку: "1","3","5","15","60"
  const tfBybit = String(tfMin)
  const allowShort = cfg.bybitMode === "futures" && cfg.bybitAllowShort
  const leverage = cfg.bybitMode === "futures" ? cfg.bybitLeverage : 1
  const tpPct = cfg.bybitTpPercent
  const slPct = cfg.bybitSlPercent
  const baseBet = cfg.betAmount
  const dailyLimit = cfg.dailyLimit
  const checkInterval = Math.max(5, cfg.checkInterval || 10)
  const rsiPeriod = cfg.rsiPeriod
  const rsiOver = cfg.rsiOverbought
  const rsiUnder = cfg.rsiOversold
  const emaFast = cfg.emaFast
  const emaSlow = cfg.emaSlow
  const tgEnabled = cfg.tgEnabled && cfg.tgToken && cfg.tgChatId
  const tgToken = cfg.tgToken || ""
  const tgChatId = cfg.tgChatId || ""
  const botName = (cfg.botName || "BYBIT-БОТ").replace(/"/g, "")
  const pauseAfterLosses = cfg.pauseAfterLossesEnabled ?? true
  const pauseCount = cfg.pauseAfterLossesCount ?? 3
  const pauseMin = cfg.pauseAfterLossesMinutes ?? 10
  const martOn = cfg.martingaleEnabled
  const martMult = cfg.martingaleMultiplier
  const martSteps = cfg.martingaleSteps
  const useMacd = cfg.bybitUseMacd
  const useBb = cfg.bybitUseBollinger
  const useAtr = cfg.bybitUseAtrFilter
  const testnet = cfg.bybitTestnet
  const orderType = cfg.bybitOrderType === "limit" ? "Limit" : "Market"

  return `#!/usr/bin/env python3
"""
🟠 Bybit Trading Bot — ${botName}
Сгенерировано конструктором TradeBase
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Режим: ${cfg.bybitMode.toUpperCase()} | Сеть: ${testnet ? "TESTNET" : "MAINNET"}
Актив: ${cfg.asset} | Таймфрейм: ${tfMin}мин
TP: +${tpPct}% | SL: -${slPct}% | Плечо: ×${leverage}
Индикаторы: RSI(${rsiPeriod}), EMA(${emaFast}/${emaSlow})${useMacd ? ", MACD" : ""}${useBb ? ", Bollinger" : ""}${useAtr ? ", ATR-фильтр" : ""}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
"""
import os
import time
import json
import math
from datetime import datetime
from pybit.unified_trading import HTTP

# ═══ Загрузка ключей из .env ═══
try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass

API_KEY = os.environ.get("BYBIT_API_KEY", "")
API_SECRET = os.environ.get("BYBIT_API_SECRET", "")
if not API_KEY or not API_SECRET:
    raise SystemExit("❌ Не заданы BYBIT_API_KEY / BYBIT_API_SECRET в .env")

# ═══ КОНФИГУРАЦИЯ ═══
SYMBOL          = "${symbol}"
CATEGORY        = "${category}"             # spot | linear
TIMEFRAME       = "${tfBybit}"              # минуты
TESTNET         = ${testnet ? "True" : "False"}
LEVERAGE        = ${leverage}
ORDER_TYPE      = "${orderType}"            # Market | Limit
BASE_BET_USDT   = ${baseBet}                # размер одной сделки в USDT
TP_PERCENT      = ${tpPct}                  # тейк-профит % от цены входа
SL_PERCENT      = ${slPct}                  # стоп-лосс % от цены входа
DAILY_LIMIT     = ${dailyLimit}             # макс сделок в день
CHECK_INTERVAL  = ${checkInterval}          # секунд между проверками сигнала
ALLOW_SHORT     = ${allowShort ? "True" : "False"}
TRADE_DIRECTION = "${cfg.tradeDirection}"   # all | call_only | put_only

# Индикаторы
RSI_PERIOD      = ${rsiPeriod}
RSI_OVERBOUGHT  = ${rsiOver}
RSI_OVERSOLD    = ${rsiUnder}
EMA_FAST        = ${emaFast}
EMA_SLOW        = ${emaSlow}
USE_MACD        = ${useMacd ? "True" : "False"}
USE_BOLLINGER   = ${useBb ? "True" : "False"}
USE_ATR_FILTER  = ${useAtr ? "True" : "False"}

# Защита
MARTINGALE      = ${martOn ? "True" : "False"}
MART_MULT       = ${martMult}
MART_STEPS      = ${martSteps}
PAUSE_AFTER_LOSSES = ${pauseAfterLosses ? "True" : "False"}
PAUSE_COUNT     = ${pauseCount}
PAUSE_MIN       = ${pauseMin}

# Комбо
COMBO_LOGIC     = "${cfg.comboLogic}"
COMBO_STRATEGIES = ${JSON.stringify(cfg.comboStrategies)}

# Telegram
TG_ENABLED      = ${tgEnabled ? "True" : "False"}
TG_TOKEN        = "${tgToken}"
TG_CHAT_ID      = "${tgChatId}"

# ═══ Инициализация клиента Bybit ═══
session = HTTP(
    testnet=TESTNET,
    api_key=API_KEY,
    api_secret=API_SECRET,
)

def log(*args):
    ts = datetime.now().strftime("%H:%M:%S")
    msg = " ".join(str(a) for a in args)
    print(f"[{ts}] {msg}")

def tg_send(text: str):
    if not TG_ENABLED:
        return
    try:
        import urllib.request, urllib.parse
        url = f"https://api.telegram.org/bot{TG_TOKEN}/sendMessage"
        data = urllib.parse.urlencode({
            "chat_id": TG_CHAT_ID,
            "text": text,
            "parse_mode": "HTML",
        }).encode()
        urllib.request.urlopen(url, data, timeout=5)
    except Exception as e:
        log(f"⚠️ TG: {e}")

# ═══ Получение свечей с Bybit ═══
def get_candles(limit: int = 200):
    """Возвращает список свечей [open, high, low, close, volume] от старых к новым."""
    resp = session.get_kline(
        category=CATEGORY,
        symbol=SYMBOL,
        interval=TIMEFRAME,
        limit=limit,
    )
    if resp.get("retCode") != 0:
        log(f"❌ get_kline error: {resp.get('retMsg')}")
        return []
    raw = resp["result"]["list"]
    # Bybit отдаёт от новых к старым — разворачиваем
    raw = list(reversed(raw))
    candles = []
    for k in raw:
        # k = [start, open, high, low, close, volume, turnover]
        candles.append({
            "open":   float(k[1]),
            "high":   float(k[2]),
            "low":    float(k[3]),
            "close":  float(k[4]),
            "volume": float(k[5]),
        })
    return candles

# ═══ Индикаторы ═══
def calc_rsi(closes, period=14):
    if len(closes) < period + 1:
        return 50.0
    gains, losses = [], []
    for i in range(1, period + 1):
        diff = closes[-i] - closes[-i-1]
        if diff > 0: gains.append(diff)
        else: losses.append(-diff)
    avg_gain = sum(gains) / period if gains else 0.0001
    avg_loss = sum(losses) / period if losses else 0.0001
    rs = avg_gain / avg_loss
    return 100 - (100 / (1 + rs))

def calc_ema(closes, period):
    if len(closes) < period:
        return closes[-1]
    k = 2 / (period + 1)
    ema = sum(closes[:period]) / period
    for c in closes[period:]:
        ema = c * k + ema * (1 - k)
    return ema

def calc_macd(closes):
    """Возвращает (macd, signal, hist)."""
    if len(closes) < 35:
        return 0, 0, 0
    ema12 = calc_ema(closes, 12)
    ema26 = calc_ema(closes, 26)
    macd = ema12 - ema26
    # signal = EMA9 от истории MACD — упрощённо
    signal = macd * 0.9
    return macd, signal, macd - signal

def calc_bollinger(closes, period=20, mult=2):
    if len(closes) < period:
        return closes[-1], closes[-1], closes[-1]
    window = closes[-period:]
    sma = sum(window) / period
    variance = sum((c - sma)**2 for c in window) / period
    std = variance ** 0.5
    return sma + mult * std, sma, sma - mult * std

def calc_atr(candles, period=14):
    if len(candles) < period + 1:
        return 0
    trs = []
    for i in range(1, len(candles)):
        h, l = candles[i]["high"], candles[i]["low"]
        prev_c = candles[i-1]["close"]
        tr = max(h - l, abs(h - prev_c), abs(l - prev_c))
        trs.append(tr)
    return sum(trs[-period:]) / period

# ═══ Сигналы ═══
def get_signal(candles):
    """
    Возвращает 'BUY' | 'SELL' | None — на основе комбо стратегий.
    COMBO_LOGIC=AND — все стратегии должны совпасть.
    COMBO_LOGIC=OR — достаточно одной.
    """
    if len(candles) < max(EMA_SLOW, RSI_PERIOD) + 5:
        return None
    closes = [c["close"] for c in candles]
    votes_buy, votes_sell = 0, 0
    total = 0

    # RSI
    if "rsi_reversal" in COMBO_STRATEGIES:
        total += 1
        rsi = calc_rsi(closes, RSI_PERIOD)
        if rsi < RSI_OVERSOLD: votes_buy += 1
        elif rsi > RSI_OVERBOUGHT: votes_sell += 1

    # EMA cross
    if "ema_cross" in COMBO_STRATEGIES or "ema_trend" in COMBO_STRATEGIES:
        total += 1
        fast = calc_ema(closes, EMA_FAST)
        slow = calc_ema(closes, EMA_SLOW)
        if fast > slow: votes_buy += 1
        elif fast < slow: votes_sell += 1

    # MACD
    if USE_MACD:
        total += 1
        macd, sig, hist = calc_macd(closes)
        if hist > 0: votes_buy += 1
        elif hist < 0: votes_sell += 1

    # Bollinger
    if USE_BOLLINGER:
        total += 1
        upper, mid, lower = calc_bollinger(closes)
        last = closes[-1]
        if last <= lower: votes_buy += 1
        elif last >= upper: votes_sell += 1

    # ATR-фильтр волатильности (если рынок «спит» — не торгуем)
    if USE_ATR_FILTER:
        atr = calc_atr(candles, 14)
        avg_price = sum(closes[-20:]) / 20
        atr_pct = (atr / avg_price) * 100 if avg_price else 0
        if atr_pct < 0.1:
            log(f"💤 Низкая волатильность (ATR={atr_pct:.3f}%) — пропуск")
            return None

    if total == 0:
        return None

    if COMBO_LOGIC == "AND":
        if votes_buy == total: return "BUY"
        if votes_sell == total: return "SELL"
    else:  # OR
        if votes_buy > votes_sell: return "BUY"
        if votes_sell > votes_buy: return "SELL"
    return None

# ═══ Размещение ордера ═══
def place_order(side: str, qty: float):
    """side = 'Buy' | 'Sell'. qty — количество базовой монеты."""
    params = {
        "category": CATEGORY,
        "symbol": SYMBOL,
        "side": side,
        "orderType": ORDER_TYPE,
        "qty": str(qty),
    }
    if CATEGORY == "linear":
        # Для фьюча устанавливаем плечо (один раз — идемпотентно)
        try:
            session.set_leverage(
                category="linear",
                symbol=SYMBOL,
                buyLeverage=str(LEVERAGE),
                sellLeverage=str(LEVERAGE),
            )
        except Exception:
            pass
    resp = session.place_order(**params)
    return resp

def get_price() -> float:
    resp = session.get_tickers(category=CATEGORY, symbol=SYMBOL)
    if resp.get("retCode") != 0:
        return 0.0
    return float(resp["result"]["list"][0]["lastPrice"])

def calc_qty(usdt_amount: float, price: float) -> float:
    """Сколько базовой монеты купить на usdt_amount по price."""
    if price <= 0: return 0
    qty = usdt_amount / price
    # Округление под typical step для большинства пар
    if price > 1000: return round(qty, 4)
    if price > 1:    return round(qty, 2)
    return round(qty, 0)

# ═══ Главный цикл ═══
def main():
    log(f"🚀 Запуск {repr(SYMBOL)} | {CATEGORY.upper()} | {'TESTNET' if TESTNET else 'MAINNET'}")
    tg_send(f"🟠 <b>${botName}</b> запущен\\n{SYMBOL} | {CATEGORY} | TF={TIMEFRAME}мин")

    bet = BASE_BET_USDT
    consec_losses = 0
    paused_until = 0
    deals_today = 0
    open_order = None  # {side, entry_price, tp_price, sl_price, qty}
    day_start = datetime.now().day

    while True:
        try:
            # Сброс дневного счётчика
            if datetime.now().day != day_start:
                deals_today = 0
                day_start = datetime.now().day

            # Пауза
            now = time.time()
            if paused_until > now:
                left = int(paused_until - now)
                log(f"⏸ Пауза ещё {left}с")
                time.sleep(min(60, left))
                continue

            # Дневной лимит
            if deals_today >= DAILY_LIMIT:
                log(f"📅 Дневной лимит {DAILY_LIMIT} достигнут — ждём следующий день")
                time.sleep(300)
                continue

            # Если есть открытая сделка — проверяем TP/SL
            if open_order:
                price = get_price()
                if price > 0:
                    hit_tp = (open_order["side"] == "Buy"  and price >= open_order["tp_price"]) or \\
                             (open_order["side"] == "Sell" and price <= open_order["tp_price"])
                    hit_sl = (open_order["side"] == "Buy"  and price <= open_order["sl_price"]) or \\
                             (open_order["side"] == "Sell" and price >= open_order["sl_price"])
                    if hit_tp or hit_sl:
                        close_side = "Sell" if open_order["side"] == "Buy" else "Buy"
                        place_order(close_side, open_order["qty"])
                        result = "✅ TP" if hit_tp else "❌ SL"
                        delta = (price - open_order["entry_price"]) * open_order["qty"]
                        if open_order["side"] == "Sell": delta = -delta
                        log(f"{result} | {open_order['side']} | вход {open_order['entry_price']:.4f} → выход {price:.4f} | P/L ≈ {delta:+.4f}")
                        tg_send(f"{result}\\n{open_order['side']} {SYMBOL}\\nP/L: {delta:+.4f} USDT")
                        if hit_sl:
                            consec_losses += 1
                            if MARTINGALE and consec_losses <= MART_STEPS:
                                bet = bet * MART_MULT
                                log(f"🎲 Мартингейл шаг {consec_losses}: ставка → {bet:.2f}")
                            if PAUSE_AFTER_LOSSES and consec_losses >= PAUSE_COUNT:
                                paused_until = time.time() + PAUSE_MIN * 60
                                log(f"⏸ Пауза {PAUSE_MIN}мин после {consec_losses} проигрышей")
                                tg_send(f"⏸ Пауза {PAUSE_MIN}мин — {consec_losses} проигрышей подряд")
                                consec_losses = 0
                        else:
                            consec_losses = 0
                            bet = BASE_BET_USDT  # сброс мартингейла
                        open_order = None
                        deals_today += 1
                time.sleep(CHECK_INTERVAL)
                continue

            # Ищем сигнал
            candles = get_candles(200)
            if not candles:
                time.sleep(CHECK_INTERVAL)
                continue
            signal = get_signal(candles)

            # Фильтр направления
            if signal == "BUY" and TRADE_DIRECTION == "put_only": signal = None
            if signal == "SELL" and TRADE_DIRECTION == "call_only": signal = None
            if signal == "SELL" and not ALLOW_SHORT and CATEGORY == "spot":
                signal = None  # на споте шортить нельзя без маржинального аккаунта

            if not signal:
                log("⏳ Ожидание сигнала...")
                time.sleep(CHECK_INTERVAL)
                continue

            # Открываем позицию
            price = get_price()
            if price <= 0:
                time.sleep(CHECK_INTERVAL)
                continue
            qty = calc_qty(bet, price)
            if qty <= 0:
                log("⚠️ qty=0, пропуск")
                time.sleep(CHECK_INTERVAL)
                continue

            side = "Buy" if signal == "BUY" else "Sell"
            if signal == "BUY":
                tp = price * (1 + TP_PERCENT / 100)
                sl = price * (1 - SL_PERCENT / 100)
            else:
                tp = price * (1 - TP_PERCENT / 100)
                sl = price * (1 + SL_PERCENT / 100)

            log(f"📈 Открытие {side} | {SYMBOL} | qty={qty} @ {price:.4f} | TP={tp:.4f} SL={sl:.4f}")
            resp = place_order(side, qty)
            if resp.get("retCode") == 0:
                tg_send(f"📈 <b>{side}</b> {SYMBOL}\\nЦена: {price:.4f}\\nTP: {tp:.4f}\\nSL: {sl:.4f}\\nQty: {qty}")
                open_order = {
                    "side": side,
                    "entry_price": price,
                    "tp_price": tp,
                    "sl_price": sl,
                    "qty": qty,
                }
            else:
                log(f"❌ Ордер не открыт: {resp.get('retMsg')}")
                tg_send(f"❌ Ошибка открытия: {resp.get('retMsg')}")

            time.sleep(CHECK_INTERVAL)

        except KeyboardInterrupt:
            log("👋 Остановка по Ctrl+C")
            tg_send("👋 Бот остановлен вручную")
            break
        except Exception as e:
            log(f"💥 Ошибка: {e}")
            tg_send(f"💥 Ошибка: {e}")
            time.sleep(30)

if __name__ == "__main__":
    main()
`
}
