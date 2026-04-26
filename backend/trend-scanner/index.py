import json
import math
import urllib.request
from datetime import datetime, timedelta, timezone

# Крипто-пары Pocket Option (Binance)
CRYPTO_PAIRS = [
    "BTCUSDT", "ETHUSDT", "SOLUSDT", "BNBUSDT", "DOGEUSDT",
]

CRYPTO_MAP = {
    "BTCUSDT": "BTC/USD",
    "ETHUSDT": "ETH/USD",
    "SOLUSDT": "SOL/USD",
    "BNBUSDT": "BNB/USD",
    "DOGEUSDT": "DOGE/USD",
}

# Forex пары Pocket Option (через open.er-api.com)
FOREX_PAIRS = [
    ("EUR", "USD"), ("GBP", "USD"), ("USD", "JPY"), ("AUD", "USD"),
    ("USD", "CAD"), ("USD", "CHF"), ("NZD", "USD"),
    ("EUR", "GBP"), ("EUR", "JPY"), ("EUR", "CHF"), ("EUR", "AUD"), ("EUR", "CAD"),
    ("GBP", "JPY"), ("GBP", "CHF"), ("GBP", "AUD"), ("GBP", "CAD"),
    ("AUD", "JPY"), ("AUD", "CAD"), ("CAD", "JPY"),
]


def fetch_url(url):
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=10) as resp:
        return json.loads(resp.read())


def calc_stability_score(prices: list) -> dict:
    """
    Считает стабильность цены по двум метрикам:
    1. std_pct — стандартное отклонение в % (чем меньше — тем ровнее)
    2. slope_pct — наклон линии регрессии в % (чем ближе к 0 — тем горизонтальнее)
    stability_score — итоговая оценка от 0 до 100 (100 = идеально ровная линия)
    """
    n = len(prices)
    if n < 2:
        return {"std_pct": 0, "slope_pct": 0, "stability_score": 0}

    mean = sum(prices) / n
    if mean == 0:
        return {"std_pct": 0, "slope_pct": 0, "stability_score": 0}

    # Стандартное отклонение в %
    variance = sum((p - mean) ** 2 for p in prices) / n
    std = math.sqrt(variance)
    std_pct = (std / mean) * 100

    # Наклон линии регрессии (метод наименьших квадратов)
    xs = list(range(n))
    x_mean = (n - 1) / 2
    xy_sum = sum((xs[i] - x_mean) * (prices[i] - mean) for i in range(n))
    x2_sum = sum((xs[i] - x_mean) ** 2 for i in range(n))
    slope = xy_sum / x2_sum if x2_sum != 0 else 0
    slope_pct = abs(slope / mean) * 100

    # Итоговая оценка: нормализуем оба показателя (меньше = лучше)
    # Используем экспоненциальное затухание: score = e^(-k * value)
    std_score = math.exp(-std_pct * 20)     # 20 — чувствительность
    slope_score = math.exp(-slope_pct * 30) # 30 — чувствительность

    stability_score = round((std_score * 0.5 + slope_score * 0.5) * 100, 1)

    return {
        "std_pct": round(std_pct, 4),
        "slope_pct": round(slope_pct, 4),
        "stability_score": stability_score,
    }


def handler(event: dict, context) -> dict:
    """Сканирует все активы Pocket Option (крипта + Forex) и возвращает топ по силе тренда и по стабильности."""

    if event.get("httpMethod") == "OPTIONS":
        return {
            "statusCode": 200,
            "headers": {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Max-Age": "86400",
            },
            "body": "",
        }

    mode = (event.get("queryStringParameters") or {}).get("mode", "trend")

    results = []

    # --- КРИПТА (Binance 24h ticker + klines для стабильности) ---
    symbols = ",".join([f'"{s}"' for s in CRYPTO_PAIRS])
    crypto_data = fetch_url(f"https://api.binance.com/api/v3/ticker/24hr?symbols=[{symbols}]")

    for ticker in crypto_data:
        symbol = ticker["symbol"]
        if symbol not in CRYPTO_MAP:
            continue
        change_pct = float(ticker["priceChangePercent"])
        high = float(ticker["highPrice"])
        low = float(ticker["lowPrice"])
        last = float(ticker["lastPrice"])
        price_range = high - low

        stability = {"std_pct": 0, "slope_pct": 0, "stability_score": 0}
        if mode == "stability":
            try:
                klines = fetch_url(f"https://api.binance.com/api/v3/klines?symbol={symbol}&interval=5m&limit=20")
                closes = [float(k[4]) for k in klines]
                stability = calc_stability_score(closes)
            except Exception:
                pass

        results.append({
            "asset": CRYPTO_MAP[symbol],
            "asset_otc": CRYPTO_MAP[symbol] + " (OTC)",
            "category": "crypto",
            "change_pct": round(change_pct, 2),
            "trend_strength": round(abs(change_pct), 2),
            "direction": "UP" if change_pct > 0 else "DOWN",
            "position_in_range": round(((last - low) / price_range * 100) if price_range > 0 else 50, 1),
            **stability,
        })

    # --- FOREX (open.er-api.com — текущий и несколько дней для стабильности) ---
    today = datetime.now(timezone.utc)
    yesterday = today - timedelta(days=1)

    # Собираем историю курсов (5 дней) для расчёта стабильности
    rate_history: dict = {}  # asset -> [price1, price2, ...]
    if mode == "stability":
        for days_ago in range(4, -1, -1):
            dt = today - timedelta(days=days_ago)
            dt_str = dt.strftime("%Y-%m-%d")
            try:
                day_data = fetch_url(f"https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@{dt_str}/v1/currencies/usd.min.json")
                day_rates = day_data["usd"]
                for base, quote in FOREX_PAIRS:
                    b = base.lower()
                    q = quote.lower()
                    try:
                        if base == "USD":
                            rate = day_rates[q]
                        elif quote == "USD":
                            rate = 1 / day_rates[b]
                        else:
                            rate = day_rates[q] / day_rates[b]
                        key = f"{base}/{quote}"
                        rate_history.setdefault(key, []).append(rate)
                    except Exception:
                        continue
            except Exception:
                continue

    try:
        today_str = today.strftime("%Y-%m-%d")
        yesterday_str = yesterday.strftime("%Y-%m-%d")
        current_data = fetch_url(f"https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@{today_str}/v1/currencies/usd.min.json")
        prev_data = fetch_url(f"https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@{yesterday_str}/v1/currencies/usd.min.json")
        current_rates = current_data["usd"]
        prev_rates = prev_data["usd"]

        for base, quote in FOREX_PAIRS:
            try:
                b = base.lower()
                q = quote.lower()
                if base == "USD":
                    rate_now = current_rates[q]
                    rate_prev = prev_rates[q]
                elif quote == "USD":
                    rate_now = 1 / current_rates[b]
                    rate_prev = 1 / prev_rates[b]
                else:
                    rate_now = current_rates[q] / current_rates[b]
                    rate_prev = prev_rates[q] / prev_rates[b]

                change_pct = ((rate_now - rate_prev) / rate_prev) * 100
                asset_name = f"{base}/{quote}"

                stability = {"std_pct": 0, "slope_pct": 0, "stability_score": 0}
                if mode == "stability" and asset_name in rate_history:
                    stability = calc_stability_score(rate_history[asset_name])

                results.append({
                    "asset": asset_name,
                    "asset_otc": asset_name + " (OTC)",
                    "category": "forex",
                    "change_pct": round(change_pct, 3),
                    "trend_strength": round(abs(change_pct), 3),
                    "direction": "UP" if change_pct > 0 else "DOWN",
                    "position_in_range": None,
                    **stability,
                })
            except Exception:
                continue
    except Exception:
        pass

    if mode == "stability":
        results.sort(key=lambda x: x.get("stability_score", 0), reverse=True)
    else:
        results.sort(key=lambda x: x["trend_strength"], reverse=True)

    return {
        "statusCode": 200,
        "headers": {"Access-Control-Allow-Origin": "*", "Content-Type": "application/json"},
        "body": {
            "top": results,
            "best": results[0] if results else None,
            "scanned": len(results),
            "mode": mode,
        },
    }
