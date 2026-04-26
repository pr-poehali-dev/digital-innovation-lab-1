import json
import math
import os
import urllib.request
from datetime import datetime, timedelta, timezone

# OTC пары Pocket Option — реальные символы
FOREX_PAIRS = [
    "EUR/USD", "GBP/USD", "USD/JPY", "AUD/USD",
    "USD/CAD", "USD/CHF", "NZD/USD",
    "EUR/GBP", "EUR/JPY", "EUR/CHF", "EUR/AUD", "EUR/CAD",
    "GBP/JPY", "GBP/CHF", "GBP/AUD", "GBP/CAD",
    "AUD/JPY", "AUD/CAD", "CAD/JPY",
]

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


def fetch_url(url):
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=10) as resp:
        return json.loads(resp.read())


def calc_stability_score(prices: list) -> dict:
    n = len(prices)
    if n < 2:
        return {"std_pct": 0, "slope_pct": 0, "stability_score": 0}
    mean = sum(prices) / n
    if mean == 0:
        return {"std_pct": 0, "slope_pct": 0, "stability_score": 0}
    variance = sum((p - mean) ** 2 for p in prices) / n
    std = math.sqrt(variance)
    std_pct = (std / mean) * 100
    xs = list(range(n))
    x_mean = (n - 1) / 2
    xy_sum = sum((xs[i] - x_mean) * (prices[i] - mean) for i in range(n))
    x2_sum = sum((xs[i] - x_mean) ** 2 for i in range(n))
    slope = xy_sum / x2_sum if x2_sum != 0 else 0
    slope_pct = abs(slope / mean) * 100
    std_score = math.exp(-std_pct * 20)
    slope_score = math.exp(-slope_pct * 30)
    stability_score = round((std_score * 0.5 + slope_score * 0.5) * 100, 1)
    return {
        "std_pct": round(std_pct, 4),
        "slope_pct": round(slope_pct, 4),
        "stability_score": stability_score,
    }


def fetch_twelve_candles(symbol: str, api_key: str, interval="5min", count=20) -> list:
    """Получает последние N свечей с Twelve Data для форекс пары."""
    sym = symbol.replace("/", "")
    url = f"https://api.twelvedata.com/time_series?symbol={sym}&interval={interval}&outputsize={count}&apikey={api_key}"
    data = fetch_url(url)
    if data.get("status") == "error" or "values" not in data:
        return []
    return [float(v["close"]) for v in reversed(data["values"])]


def handler(event: dict, context) -> dict:
    """Сканирует OTC пары Pocket Option через Twelve Data и Binance. Возвращает топ по тренду или стабильности."""

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

    params = event.get("queryStringParameters") or {}
    mode = params.get("mode", "trend")
    interval = params.get("interval", "5min")
    if interval not in ("1min", "5min", "15min"):
        interval = "5min"
    api_key = os.environ.get("TWELVE_DATA_API_KEY", "")

    results = []

    # --- КРИПТА (Binance 24h ticker + klines) ---
    try:
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
            skip = False
            if mode == "stability":
                try:
                    klines = fetch_url(f"https://api.binance.com/api/v3/klines?symbol={symbol}&interval=5m&limit=100")
                    closes = [float(k[4]) for k in klines]
                    if len(closes) < 100:
                        skip = True
                    else:
                        stability = calc_stability_score(closes)
                except Exception:
                    skip = True
            if skip:
                continue

            results.append({
                "asset": CRYPTO_MAP[symbol],
                "asset_otc": CRYPTO_MAP[symbol] + " (OTC)",
                "category": "crypto",
                "change_pct": round(change_pct, 2),
                "trend_strength": round(abs(change_pct), 2),
                "direction": "UP" if change_pct > 0 else "DOWN",
                "position_in_range": round(((last - low) / price_range * 100) if price_range > 0 else 50, 1),
                "source": "binance",
                **stability,
            })
    except Exception:
        pass

    # --- ФОРЕКС OTC (Twelve Data свечи + fallback на курсы дня) ---
    today = datetime.now(timezone.utc)
    yesterday = today - timedelta(days=1)
    today_str = today.strftime("%Y-%m-%d")
    yesterday_str = yesterday.strftime("%Y-%m-%d")

    # Пробуем получить курсы через Twelve Data батчем
    twelve_prices = {}
    if api_key:
        try:
            symbols_str = ",".join(p.replace("/", "") for p in FOREX_PAIRS)
            outputsize = 100 if mode == "stability" else 20
            url_batch = f"https://api.twelvedata.com/time_series?symbol={symbols_str}&interval={interval}&outputsize={outputsize}&apikey={api_key}"
            batch = fetch_url(url_batch)
            # Если один символ — оборачиваем
            if batch.get("meta"):
                sym = batch["meta"]["symbol"]
                pair = sym[:3] + "/" + sym[3:]
                if "values" in batch:
                    twelve_prices[pair] = [float(v["close"]) for v in reversed(batch["values"])]
            else:
                for sym, data in batch.items():
                    if isinstance(data, dict) and "values" in data:
                        pair_key = sym[:3] + "/" + sym[3:]
                        twelve_prices[pair_key] = [float(v["close"]) for v in reversed(data["values"])]
        except Exception:
            pass

    # Fallback — курсы за сегодня/вчера через cdn.jsdelivr.net
    current_rates, prev_rates = {}, {}
    try:
        current_data = fetch_url(f"https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@{today_str}/v1/currencies/usd.min.json")
        prev_data = fetch_url(f"https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@{yesterday_str}/v1/currencies/usd.min.json")
        current_rates = current_data.get("usd", {})
        prev_rates = prev_data.get("usd", {})
    except Exception:
        pass

    FOREX_TUPLE = [
        ("EUR", "USD"), ("GBP", "USD"), ("USD", "JPY"), ("AUD", "USD"),
        ("USD", "CAD"), ("USD", "CHF"), ("NZD", "USD"),
        ("EUR", "GBP"), ("EUR", "JPY"), ("EUR", "CHF"), ("EUR", "AUD"), ("EUR", "CAD"),
        ("GBP", "JPY"), ("GBP", "CHF"), ("GBP", "AUD"), ("GBP", "CAD"),
        ("AUD", "JPY"), ("AUD", "CAD"), ("CAD", "JPY"),
    ]

    for base, quote in FOREX_TUPLE:
        pair = f"{base}/{quote}"
        try:
            prices = twelve_prices.get(pair)
            source = "twelve_data"

            if not prices or len(prices) < 2:
                # Fallback на курсы дня
                b, q = base.lower(), quote.lower()
                if base == "USD":
                    rate_now = current_rates.get(q)
                    rate_prev = prev_rates.get(q)
                elif quote == "USD":
                    rate_now = 1 / current_rates[b] if current_rates.get(b) else None
                    rate_prev = 1 / prev_rates[b] if prev_rates.get(b) else None
                else:
                    rate_now = current_rates.get(q) / current_rates.get(b, 1) if current_rates.get(q) and current_rates.get(b) else None
                    rate_prev = prev_rates.get(q) / prev_rates.get(b, 1) if prev_rates.get(q) and prev_rates.get(b) else None

                if not rate_now or not rate_prev:
                    continue
                prices = [rate_prev, rate_now]
                source = "fx_daily"

            last_price = prices[-1]
            first_price = prices[0]
            change_pct = ((last_price - first_price) / first_price) * 100

            # В режиме stability — только реальные свечи (минимум 100 точек)
            if mode == "stability" and (source == "fx_daily" or len(prices) < 100):
                continue

            last_price = prices[-1]
            first_price = prices[0]
            change_pct = ((last_price - first_price) / first_price) * 100

            stability = {"std_pct": 0, "slope_pct": 0, "stability_score": 0}
            if mode == "stability":
                stability = calc_stability_score(prices)

            results.append({
                "asset": pair,
                "asset_otc": pair + " (OTC)",
                "category": "forex",
                "change_pct": round(change_pct, 4),
                "trend_strength": round(abs(change_pct), 4),
                "direction": "UP" if change_pct > 0 else "DOWN",
                "position_in_range": None,
                "source": source,
                **stability,
            })
        except Exception:
            continue

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
            "source": "twelve_data+binance",
        },
    }