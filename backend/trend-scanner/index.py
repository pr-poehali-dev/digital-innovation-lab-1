import json
import os
import time
import urllib.request

# Кэш: { "EUR/USD_15min": { "ts": 1234567890, "candles": [...] } }
_CACHE = {}
CACHE_TTL = 15 * 60  # 15 минут

ALL_ASSETS = [
    ("EUR/USD", "forex"),
    ("GBP/USD", "forex"),
    ("USD/JPY", "forex"),
    ("AUD/USD", "forex"),
    ("USD/CAD", "forex"),
    ("USD/CHF", "forex"),
    ("NZD/USD", "forex"),
    ("EUR/GBP", "forex"),
    ("EUR/JPY", "forex"),
    ("GBP/JPY", "forex"),
    ("BTC/USD", "crypto"),
    ("ETH/USD", "crypto"),
    ("SOL/USD", "crypto"),
    ("BNB/USD", "crypto"),
    ("DOGE/USD", "crypto"),
]

TD_INTERVAL_MAP = {
    "5min":  "5min",
    "15min": "15min",
    "30min": "30min",
    "1h":    "1h",
    "4h":    "4h",
}


def fetch_url(url):
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=12) as resp:
        return json.loads(resp.read())


def fetch_candles(symbol, interval, api_key, limit=6):
    cache_key = f"{symbol}_{interval}"
    now = time.time()
    cached = _CACHE.get(cache_key)
    if cached and now - cached["ts"] < CACHE_TTL:
        return cached["candles"]

    url = (
        f"https://api.twelvedata.com/time_series"
        f"?symbol={symbol}&interval={interval}&outputsize={limit}&apikey={api_key}"
    )
    data = fetch_url(url)
    if data.get("status") == "error":
        raise Exception(data.get("message", "Twelve Data error"))

    candles = []
    for c in data.get("values", []):
        o, cl = float(c["open"]), float(c["close"])
        candles.append({
            "t": c["datetime"],
            "o": o,
            "h": float(c["high"]),
            "l": float(c["low"]),
            "c": cl,
            "green": cl >= o,
        })

    _CACHE[cache_key] = {"ts": now, "candles": candles}
    return candles


def analyze_trend(candles):
    """Определяет направление и силу тренда по свечам."""
    if not candles or len(candles) < 2:
        return {"direction": "NEUTRAL", "trend_strength": 1, "summary": "NEUTRAL"}

    ordered = list(reversed(candles))  # от старых к новым
    greens = sum(1 for c in ordered if c["green"])
    reds = len(ordered) - greens
    last = ordered[-1]
    prev = ordered[-2]

    # Направление по большинству свечей
    if greens > reds:
        direction = "UP"
    elif reds > greens:
        direction = "DOWN"
    else:
        direction = "NEUTRAL"

    # Сила тренда (1-5)
    ratio = max(greens, reds) / len(ordered)
    if ratio >= 0.9:
        strength = 5
    elif ratio >= 0.75:
        strength = 4
    elif ratio >= 0.6:
        strength = 3
    elif ratio >= 0.5:
        strength = 2
    else:
        strength = 1

    # Summary
    last_move = (last["c"] - last["o"]) / last["o"] * 100
    if direction == "UP":
        summary = "STRONG_BUY" if strength >= 4 else "BUY"
    elif direction == "DOWN":
        summary = "STRONG_SELL" if strength >= 4 else "SELL"
    else:
        summary = "NEUTRAL"

    return {
        "direction": direction,
        "trend_strength": strength,
        "summary": summary,
        "greens": greens,
        "reds": reds,
    }


def handler(event: dict, context) -> dict:
    """Сканирует активы Pocket Option через Twelve Data (свечи + анализ тренда)."""

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
    interval = TD_INTERVAL_MAP.get(params.get("interval", "1h"), "1h")
    api_key = os.environ.get("TWELVE_DATA_API_KEY", "")

    results = []

    for symbol, category in ALL_ASSETS:
        try:
            candles = fetch_candles(symbol, interval, api_key, limit=6)
            ta = analyze_trend(candles)
            results.append({
                "asset": symbol,
                "asset_otc": symbol + " (OTC)",
                "category": category,
                "summary": ta["summary"],
                "direction": ta["direction"],
                "trend_strength": ta["trend_strength"],
                "greens": ta["greens"],
                "reds": ta["reds"],
                "candles": candles,
            })
        except Exception:
            continue

    results.sort(key=lambda x: x["trend_strength"], reverse=True)

    return {
        "statusCode": 200,
        "headers": {"Access-Control-Allow-Origin": "*", "Content-Type": "application/json"},
        "body": {
            "top": results,
            "best": results[0] if results else None,
            "scanned": len(results),
            "interval": interval,
            "source": "twelvedata",
        },
    }
