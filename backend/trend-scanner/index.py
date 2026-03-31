import json
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


def handler(event: dict, context) -> dict:
    """Сканирует все активы Pocket Option (крипта + Forex) и возвращает топ по силе тренда."""

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

    results = []

    # --- КРИПТА (Binance 24h ticker) ---
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
        results.append({
            "asset": CRYPTO_MAP[symbol],
            "asset_otc": CRYPTO_MAP[symbol] + " (OTC)",
            "category": "crypto",
            "change_pct": round(change_pct, 2),
            "trend_strength": round(abs(change_pct), 2),
            "direction": "UP" if change_pct > 0 else "DOWN",
            "position_in_range": round(((last - low) / price_range * 100) if price_range > 0 else 50, 1),
        })

    # --- FOREX (open.er-api.com — текущий и вчерашний курс) ---
    today = datetime.now(timezone.utc)
    yesterday = today - timedelta(days=1)

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
                results.append({
                    "asset": asset_name,
                    "asset_otc": asset_name + " (OTC)",
                    "category": "forex",
                    "change_pct": round(change_pct, 3),
                    "trend_strength": round(abs(change_pct), 3),
                    "direction": "UP" if change_pct > 0 else "DOWN",
                    "position_in_range": None,
                })
            except Exception:
                continue
    except Exception:
        pass

    results.sort(key=lambda x: x["trend_strength"], reverse=True)

    return {
        "statusCode": 200,
        "headers": {"Access-Control-Allow-Origin": "*", "Content-Type": "application/json"},
        "body": {
            "top": results,
            "best": results[0] if results else None,
            "scanned": len(results),
        },
    }