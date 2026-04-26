import json
import math
import urllib.request
from concurrent.futures import ThreadPoolExecutor, as_completed
from datetime import datetime, timedelta, timezone

CRYPTO_PAIRS = ["BTCUSDT", "ETHUSDT", "SOLUSDT", "BNBUSDT", "DOGEUSDT"]
CRYPTO_MAP = {
    "BTCUSDT": "BTC/USD", "ETHUSDT": "ETH/USD", "SOLUSDT": "SOL/USD",
    "BNBUSDT": "BNB/USD", "DOGEUSDT": "DOGE/USD",
}
FOREX_TUPLE = [
    ("EUR", "USD"), ("GBP", "USD"), ("USD", "JPY"), ("AUD", "USD"),
    ("USD", "CAD"), ("USD", "CHF"), ("NZD", "USD"),
    ("EUR", "GBP"), ("EUR", "JPY"), ("EUR", "CHF"), ("EUR", "AUD"), ("EUR", "CAD"),
    ("GBP", "JPY"), ("GBP", "CHF"), ("GBP", "AUD"), ("GBP", "CAD"),
    ("AUD", "JPY"), ("AUD", "CAD"), ("CAD", "JPY"),
]
CORS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
}

# Маппинг временного промежутка (минуты) в binance interval + yahoo range
TIMEFRAME_MAP = {
    5:    {"binance": "5m",  "yahoo_interval": "5m",  "yahoo_range": "1d"},
    30:   {"binance": "30m", "yahoo_interval": "30m", "yahoo_range": "5d"},
    60:   {"binance": "1h",  "yahoo_interval": "1h",  "yahoo_range": "5d"},
    180:  {"binance": "3h",  "yahoo_interval": "60m", "yahoo_range": "5d"},
    360:  {"binance": "6h",  "yahoo_interval": "60m", "yahoo_range": "1mo"},
    720:  {"binance": "12h", "yahoo_interval": "60m", "yahoo_range": "1mo"},
    1440: {"binance": "1d",  "yahoo_interval": "1d",  "yahoo_range": "3mo"},
}


def fetch_url(url, timeout=8):
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=timeout) as resp:
        return json.loads(resp.read())


def candle_ratio(prices: list) -> dict:
    """
    Считает кол-во зелёных и красных свечей.
    Зелёная: close > open (рост), Красная: close <= open (падение).
    trend_score = green/red если зелёных больше, иначе red/green.
    """
    if len(prices) < 2:
        return {"green": 0, "red": 0, "trend_score": 0, "direction": "UP"}
    green = 0
    red = 0
    for i in range(1, len(prices)):
        if prices[i] > prices[i - 1]:
            green += 1
        else:
            red += 1
    total = green + red
    if total == 0:
        return {"green": 0, "red": 0, "trend_score": 0, "direction": "UP"}
    if green >= red:
        score = green / max(red, 1)
        direction = "UP"
    else:
        score = red / max(green, 1)
        direction = "DOWN"
    return {
        "green": green,
        "red": red,
        "trend_score": round(score, 4),
        "direction": direction,
    }


def fetch_yahoo_prices(base, quote, yahoo_interval, yahoo_range, limit):
    sym = f"{base}{quote}=X"
    url = f"https://query1.finance.yahoo.com/v8/finance/chart/{sym}?interval={yahoo_interval}&range={yahoo_range}"
    req = urllib.request.Request(url, headers={
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        "Accept": "application/json",
    })
    with urllib.request.urlopen(req, timeout=8) as resp:
        ydata = json.loads(resp.read())
    closes = ydata["chart"]["result"][0]["indicators"]["quote"][0]["close"]
    prices = [float(c) for c in closes if c is not None]
    return prices[-limit:] if len(prices) >= 2 else []


def fetch_day_rates(dt_str):
    url = f"https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@{dt_str}/v1/currencies/usd.min.json"
    return fetch_url(url, timeout=5).get("usd", {})


def process_forex_pair(base, quote, tf_cfg, limit, daily_rates):
    pair = f"{base}/{quote}"
    try:
        prices = []
        try:
            prices = fetch_yahoo_prices(base, quote, tf_cfg["yahoo_interval"], tf_cfg["yahoo_range"], limit)
        except Exception:
            pass

        if not prices:
            b, q = base.lower(), quote.lower()
            hist = []
            for rates in daily_rates:
                try:
                    if base == "USD":
                        hist.append(rates[q])
                    elif quote == "USD":
                        hist.append(1 / rates[b])
                    else:
                        hist.append(rates[q] / rates[b])
                except Exception:
                    pass
            if len(hist) < 2:
                return None
            prices = hist[-limit:]

        if len(prices) < 2:
            return None

        ratio = candle_ratio(prices)
        change_pct = ((prices[-1] - prices[0]) / prices[0]) * 100

        return {
            "asset": pair,
            "asset_otc": pair + " (OTC)",
            "category": "forex",
            "change_pct": round(change_pct, 4),
            "trend_score": ratio["trend_score"],
            "trend_strength": ratio["trend_score"],
            "direction": ratio["direction"],
            "green": ratio["green"],
            "red": ratio["red"],
            "candles": len(prices),
            "position_in_range": None,
        }
    except Exception:
        return None


def handler(event: dict, context) -> dict:
    """Сканер трендов OTC пар: расчёт по зелёным/красным свечам с настройкой параметров."""

    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": {**CORS, "Access-Control-Max-Age": "86400"}, "body": ""}

    params = event.get("queryStringParameters") or {}

    # Параметры
    try:
        candles = max(5, min(100, int(params.get("candles", 20))))
    except Exception:
        candles = 20

    try:
        timeframe = int(params.get("timeframe", 5))
        if timeframe not in TIMEFRAME_MAP:
            timeframe = 5
    except Exception:
        timeframe = 5

    tf_cfg = TIMEFRAME_MAP[timeframe]

    results = []

    # КРИПТА
    try:
        symbols = ",".join([f'"{s}"' for s in CRYPTO_PAIRS])
        binance_interval = tf_cfg["binance"]
        crypto_url = f"https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval={binance_interval}&limit=1"

        def fetch_crypto_klines(symbol):
            url = f"https://api.binance.com/api/v3/klines?symbol={symbol}&interval={binance_interval}&limit={candles}"
            return symbol, fetch_url(url)

        klines_map = {}
        with ThreadPoolExecutor(max_workers=5) as ex:
            for f in as_completed({ex.submit(fetch_crypto_klines, s): s for s in CRYPTO_PAIRS}, timeout=10):
                try:
                    sym, klines = f.result()
                    klines_map[sym] = klines
                except Exception:
                    pass

        for symbol, name in CRYPTO_MAP.items():
            klines = klines_map.get(symbol, [])
            if len(klines) < 2:
                continue
            closes = [float(k[4]) for k in klines]
            ratio = candle_ratio(closes)
            change_pct = ((closes[-1] - closes[0]) / closes[0]) * 100
            results.append({
                "asset": name,
                "asset_otc": name + " (OTC)",
                "category": "crypto",
                "change_pct": round(change_pct, 2),
                "trend_score": ratio["trend_score"],
                "trend_strength": ratio["trend_score"],
                "direction": ratio["direction"],
                "green": ratio["green"],
                "red": ratio["red"],
                "candles": len(closes),
                "position_in_range": None,
                "source": "binance",
            })
    except Exception:
        pass

    # КУРСЫ параллельно (для запаса)
    today = datetime.now(timezone.utc)
    dates = [(today - timedelta(days=i)).strftime("%Y-%m-%d") for i in range(6, -1, -1)]
    date_results = {}
    with ThreadPoolExecutor(max_workers=7) as ex:
        futs = {ex.submit(fetch_day_rates, d): d for d in dates}
        for f in as_completed(futs, timeout=8):
            d = futs[f]
            try:
                date_results[d] = f.result()
            except Exception:
                date_results[d] = {}
    daily_rates = [date_results[d] for d in dates if date_results.get(d)]

    # ФОРЕКС параллельно
    with ThreadPoolExecutor(max_workers=10) as ex:
        for f in as_completed(
            [ex.submit(process_forex_pair, b, q, tf_cfg, candles, daily_rates) for b, q in FOREX_TUPLE],
            timeout=12
        ):
            try:
                r = f.result()
                if r:
                    results.append(r)
            except Exception:
                pass

    results.sort(key=lambda x: x["trend_score"], reverse=True)
    print(f"[scanner-proxy] candles={candles} timeframe={timeframe} scanned={len(results)}")

    return {
        "statusCode": 200,
        "headers": {**CORS, "Content-Type": "application/json"},
        "body": json.dumps({
            "top": results,
            "best": results[0] if results else None,
            "scanned": len(results),
            "candles": candles,
            "timeframe": timeframe,
        }),
    }
