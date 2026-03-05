export type POStrategy = "rsi_reversal" | "ema_cross" | "martingale" | "candle_pattern" | "support_resistance"
export type POExpiry = "1" | "2" | "3" | "5" | "15"

export interface POBotConfig {
  strategy: POStrategy
  asset: string
  expiry: POExpiry
  betAmount: number
  betPercent: boolean
  martingaleEnabled: boolean
  martingaleMultiplier: number
  martingaleSteps: number
  takeProfitUsd: number
  stopLossUsd: number
  dailyLimit: number
  rsiPeriod: number
  rsiOverbought: number
  rsiOversold: number
  emaFast: number
  emaSlow: number
  useOTC: boolean
  autoRestart: boolean
}

export const PO_STRATEGIES: Record<POStrategy, { label: string; description: string; color: string; risk: string }> = {
  rsi_reversal: {
    label: "RSI Разворот",
    description: "Покупаем CALL при перепроданности, PUT при перекупленности",
    color: "bg-blue-500/20 border-blue-500/40 text-blue-400",
    risk: "Средний",
  },
  ema_cross: {
    label: "EMA Пересечение",
    description: "Сигналы по пересечению быстрой и медленной EMA",
    color: "bg-green-500/20 border-green-500/40 text-green-400",
    risk: "Низкий",
  },
  martingale: {
    label: "Мартингейл",
    description: "Удвоение ставки после проигрыша до достижения профита",
    color: "bg-red-500/20 border-red-500/40 text-red-400",
    risk: "Высокий",
  },
  candle_pattern: {
    label: "Паттерны свечей",
    description: "Молот, поглощение, доджи — разворотные паттерны японских свечей",
    color: "bg-yellow-500/20 border-yellow-500/40 text-yellow-400",
    risk: "Средний",
  },
  support_resistance: {
    label: "Поддержка / Сопротивление",
    description: "Вход от уровней поддержки и сопротивления с подтверждением",
    color: "bg-purple-500/20 border-purple-500/40 text-purple-400",
    risk: "Средний",
  },
}

export const PO_ASSETS = [
  "EUR/USD (OTC)", "GBP/USD (OTC)", "USD/JPY (OTC)", "AUD/USD (OTC)",
  "EUR/USD", "GBP/USD", "USD/JPY", "AUD/USD", "USD/CAD",
  "EUR/GBP", "EUR/JPY", "NZD/USD",
  "BTC/USD (OTC)", "ETH/USD (OTC)", "Gold (OTC)", "Oil (OTC)",
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
  asset: "EUR/USD (OTC)",
  expiry: "1",
  betAmount: 10,
  betPercent: false,
  martingaleEnabled: false,
  martingaleMultiplier: 2.1,
  martingaleSteps: 3,
  takeProfitUsd: 50,
  stopLossUsd: 30,
  dailyLimit: 20,
  rsiPeriod: 14,
  rsiOverbought: 70,
  rsiOversold: 30,
  emaFast: 9,
  emaSlow: 21,
  useOTC: true,
  autoRestart: false,
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
    """Сигнал разворота по RSI"""
    rsi = calculate_rsi(prices)
    if rsi <= ${cfg.rsiOversold}:
        return "CALL"  # Перепроданность — ждём рост
    elif rsi >= ${cfg.rsiOverbought}:
        return "PUT"   # Перекупленность — ждём падение
    return None`,

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
    if len(prices) < ${cfg.emaSlow} + 2:
        return None
    ema_fast = calculate_ema(prices, ${cfg.emaFast})
    ema_slow = calculate_ema(prices, ${cfg.emaSlow})
    if ema_fast[-1] > ema_slow[-1] and ema_fast[-2] <= ema_slow[-2]:
        return "CALL"
    if ema_fast[-1] < ema_slow[-1] and ema_fast[-2] >= ema_slow[-2]:
        return "PUT"
    return None`,

    martingale: `
def get_signal(prices, candles=None):
    """Мартингейл: сигнал по последней свече"""
    if len(prices) < 2:
        return None
    if prices[-1] < prices[-2]:
        return "CALL"
    elif prices[-1] > prices[-2]:
        return "PUT"
    return None`,

    candle_pattern: `
def get_signal(prices, candles=None):
    """Паттерны японских свечей"""
    if candles is None or len(candles) < 3:
        return None
    o1, h1, l1, c1 = candles[-2]
    o2, h2, l2, c2 = candles[-1]
    body2 = abs(c2 - o2)
    lower_shadow = min(o2, c2) - l2
    upper_shadow = h2 - max(o2, c2)
    # Молот — разворот вверх
    if lower_shadow > body2 * 2 and upper_shadow < body2 * 0.5 and c1 < o1:
        return "CALL"
    # Падающая звезда — разворот вниз
    if upper_shadow > body2 * 2 and lower_shadow < body2 * 0.5 and c1 > o1:
        return "PUT"
    # Бычье поглощение
    if c1 < o1 and c2 > o2 and c2 > o1 and o2 < c1:
        return "CALL"
    # Медвежье поглощение
    if c1 > o1 and c2 < o2 and c2 < o1 and o2 > c1:
        return "PUT"
    return None`,

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
    if len(prices) < 30:
        return None
    supports, resistances = find_levels(prices)
    current = prices[-1]
    threshold = current * 0.001
    for sup in supports:
        if abs(current - sup) < threshold:
            return "CALL"
    for res in resistances:
        if abs(current - res) < threshold:
            return "PUT"
    return None`,
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

  return (
`#!/usr/bin/env python3
"""
Pocket Option Bot — ${strategyLabel}
Актив: ${cfg.asset} | Экспирация: ${cfg.expiry} мин
Ставка: ${S}${cfg.betAmount}${cfg.betPercent ? "%" : " USD"} | Стратегия: ${strategyLabel}
Сгенерировано: TradeBase Bot Builder
"""

import time
import requests
import json
import os
from datetime import datetime

# ===== НАСТРОЙКИ =====
ASSET       = "${cfg.asset}"
EXPIRY_MIN  = ${cfg.expiry}              # Экспирация опциона (минуты)
BASE_BET    = ${cfg.betAmount}           # Базовая ставка USD
BET_PERCENT = ${cfg.betPercent ? "True" : "False"}         # True = % от баланса

TAKE_PROFIT = ${cfg.takeProfitUsd}       # Стоп профит (USD за сессию)
STOP_LOSS   = ${cfg.stopLossUsd}         # Стоп лосс (USD за сессию)
DAILY_LIMIT = ${cfg.dailyLimit}          # Макс. сделок в день
AUTO_RESTART= ${cfg.autoRestart ? "True" : "False"}        # Перезапуск после TP/SL

MARTINGALE       = ${cfg.martingaleEnabled ? "True" : "False"}
MARTINGALE_MULT  = ${cfg.martingaleMultiplier}
MARTINGALE_STEPS = ${cfg.martingaleSteps}

# Session ID из Pocket Option (скопировать из браузера DevTools → Cookie → ci_session)
SESSION_ID = os.environ.get("PO_SESSION_ID", "")
BASE_URL   = "https://api.po.market/api/v1"

# ===== HTTP СЕССИЯ =====
session = requests.Session()
session.headers.update({
    "Cookie": "ci_session=" + SESSION_ID,
    "Content-Type": "application/json",
    "User-Agent": "Mozilla/5.0",
})

# ===== СОСТОЯНИЕ =====
total_profit = 0.0
trades_today = 0
trade_log    = []
${martingaleBlock}
${strategyFunctions[cfg.strategy]}

def get_candles(count=50):
    """Получение свечей для анализа"""
    try:
        resp = session.get(BASE_URL + "/candles", params={
            "asset": ASSET,
            "period": EXPIRY_MIN * 60,
            "count": count,
        })
        data = resp.json().get("data", [])
        candles = [(c["open"], c["high"], c["low"], c["close"]) for c in data]
        prices  = [c[3] for c in candles]
        return candles, prices
    except Exception as e:
        print("[ERROR] Не удалось получить свечи:", e)
        return [], []

def place_trade(direction, amount):
    """Открытие бинарного опциона в Pocket Option"""
    payload = {
        "asset":      ASSET,
        "direction":  direction.lower(),
        "amount":     amount,
        "expiration": EXPIRY_MIN * 60,
    }
    try:
        resp = session.post(BASE_URL + "/trade", json=payload)
        result = resp.json()
        trade_id = result.get("id", "unknown")
        print(f"[TRADE] {direction} | {S}{amount} | {EXPIRY_MIN} мин | ID: {trade_id}")
        return trade_id
    except Exception as e:
        print("[ERROR] Ошибка при открытии сделки:", e)
        return None

def check_result(trade_id):
    """Проверка результата сделки после экспирации"""
    time.sleep(EXPIRY_MIN * 60 + 5)
    try:
        resp = session.get(BASE_URL + "/trade/" + str(trade_id))
        result = resp.json()
        profit = float(result.get("profit", 0))
        won    = profit > 0
        status = "ВЫИГРЫШ" if won else "ПРОИГРЫШ"
        print(f"[RESULT] {status} | Профит: {S}{profit:.2f}")
        return won, profit
    except Exception as e:
        print("[ERROR] Не удалось получить результат:", e)
        return False, 0

def get_balance():
    """Текущий баланс аккаунта"""
    try:
        resp = session.get(BASE_URL + "/balance")
        return float(resp.json().get("balance", 0))
    except:
        return 0

def print_stats():
    wins     = sum(1 for t in trade_log if t["won"])
    total    = len(trade_log)
    winrate  = (wins / total * 100) if total else 0
    print(f"\\n[STATS] {wins}/{total} сделок | Winrate: {winrate:.1f}% | Сессия: {S}{total_profit:.2f}\\n")

def main():
    global total_profit, trades_today, current_bet

    print("=" * 50)
    print("  Pocket Option Bot — " + "${strategyLabel}")
    print("  Актив:", ASSET, "| Экспирация:", EXPIRY_MIN, "мин")
    print(f"  TP: {S}{TAKE_PROFIT} | SL: {S}{STOP_LOSS} | Лимит: {DAILY_LIMIT} сделок")
    print("=" * 50 + "\\n")

    while True:
        # Проверка лимитов
        if total_profit >= TAKE_PROFIT:
            print(f"[TP] Take Profit достигнут: +{S}{total_profit:.2f}")
            if AUTO_RESTART:
                total_profit = 0
                trades_today = 0
                time.sleep(300)
                continue
            break

        if total_profit <= -STOP_LOSS:
            print(f"[SL] Stop Loss достигнут: {S}{total_profit:.2f}")
            if AUTO_RESTART:
                total_profit = 0
                trades_today = 0
                time.sleep(300)
                continue
            break

        if trades_today >= DAILY_LIMIT:
            print(f"[LIMIT] Дневной лимит {DAILY_LIMIT} сделок исчерпан")
            break

        # Получение данных
        candles, prices = get_candles()
        if not prices:
            time.sleep(30)
            continue

        signal = get_signal(prices, candles)

        if signal:
            if BET_PERCENT:
                balance = get_balance()
                bet = round(balance * (BASE_BET / 100), 2)
            else:
                bet = current_bet

            trade_id = place_trade(signal, bet)
            if trade_id:
                won, profit = check_result(trade_id)
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
                print_stats()
        else:
            ts = datetime.now().strftime("%H:%M:%S")
            print(f"[{ts}] Нет сигнала, ожидание 30 сек...")
            time.sleep(30)

if __name__ == "__main__":
    main()
`
  )
}
