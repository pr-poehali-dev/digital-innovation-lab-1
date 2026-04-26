import json
import math
import os
import urllib.request
from concurrent.futures import ThreadPoolExecutor, as_completed
from datetime import datetime, timedelta, timezone

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

FOREX_TUPLE = [
    ("EUR", "USD"), ("GBP", "USD"), ("USD", "JPY"), ("AUD", "USD"),
    ("USD", "CAD"), ("USD", "CHF"), ("NZD", "USD"),
    ("EUR", "GBP"), ("EUR", "JPY"), ("EUR", "CHF"), ("EUR", "AUD"), ("EUR", "CAD"),
    ("GBP", "JPY"), ("GBP", "CHF"), ("GBP", "AUD"), ("GBP", "CAD"),
    ("AUD", "JPY"), ("AUD", "CAD"), ("CAD", "JPY"),
]


def fetch_url(url, timeout=6):
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=timeout) as resp:
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


def fetch_yahoo_prices(base, quote, yahoo_interval):
    sym = f"{base}{quote}=X"
    url = f"https://query1.finance.yahoo.com/v8/finance/chart/{sym}?interval={yahoo_interval}&range=1d"
    req = urllib.request.Request(url, headers={
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        "Accept": "application/json",
    })
    with urllib.request.urlopen(req, timeout=6) as resp:
        ydata = json.loads(resp.read())
    closes = ydata["chart"]["result"][0]["indicators"]["quote"][0]["close"]
    prices = [float(c) for c in closes if c is not None]
    return prices if len(prices) >= 2 else []


def fetch_day_rates(dt_str):
    url = f"https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@{dt_str}/v1/currencies/usd.min.json"
    data = fetch_url(url, timeout=5)
    return data.get("usd", {})


def process_forex_pair(base, quote, mode, yahoo_interval, daily_rates):
    pair = f"{base}/{quote}"
    try:
        prices = []
        source = "yahoo"

        try:
            prices = fetch_yahoo_prices(base, quote, yahoo_interval)
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
            prices = hist
            source = "fx_daily"

        if mode == "stability" and len(prices) < 5:
            return None

        last_price = prices[-1]
        first_price = prices[0]
        change_pct = ((last_price - first_price) / first_price) * 100

        stability = {"std_pct": 0, "slope_pct": 0, "stability_score": 0}
        if mode == "stability":
            stability = calc_stability_score(prices)

        return {
            "asset": pair,
            "asset_otc": pair + " (OTC)",
            "category": "forex",
            "change_pct": round(change_pct, 4),
            "trend_strength": round(abs(change_pct), 4),
            "direction": "UP" if change_pct > 0 else "DOWN",
            "position_in_range": None,
            "source": source,
            **stability,
        }
    except Exception:
        return None


def handler(event: dict, context) -> dict:
    """Сканирует OTC пары Pocket Option параллельно. Возвращает топ по тренду или стабильности."""

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

    interval_yahoo = {"1min": "1m", "5min": "5m", "15min": "15m"}
    yahoo_interval = interval_yahoo.get(interval, "5m")

    results = []

    # --- КРИПТА параллельно ---
    try:
        symbols = ",".join([f'"{s}"' for s in CRYPTO_PAIRS])
        crypto_data = fetch_url(f"https://api.binance.com/api/v3/ticker/24hr?symbols=[{symbols}]")

        if mode == "stability":
            def fetch_klines(symbol):
                return symbol, fetch_url(f"https://api.binance.com/api/v3/klines?symbol={symbol}&interval=5m&limit=20")

            klines_map = {}
            with ThreadPoolExecutor(max_workers=5) as ex:
                futs = {ex.submit(fetch_klines, s): s for s in CRYPTO_PAIRS}
                for f in as_completed(futs, timeout=8):
                    try:
                        sym, klines = f.result()
                        klines_map[sym] = klines
                    except Exception:
                        pass

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
                klines = klines_map.get(symbol, [])
                closes = [float(k[4]) for k in klines]
                if len(closes) < 20:
                    continue
                stability = calc_stability_score(closes)

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

    # --- Загружаем историю курсов параллельно ---
    today = datetime.now(timezone.utc)
    dates = [(today - timedelta(days=i)).strftime("%Y-%m-%d") for i in range(6, -1, -1)]

    daily_rates = []
    with ThreadPoolExecutor(max_workers=7) as ex:
        futs = {ex.submit(fetch_day_rates, d): d for d in dates}
        date_results = {}
        for f in as_completed(futs, timeout=8):
            d = futs[f]
            try:
                date_results[d] = f.result()
            except Exception:
                date_results[d] = {}
    for d in dates:
        r = date_results.get(d, {})
        if r:
            daily_rates.append(r)

    # --- ФОРЕКС параллельно ---
    with ThreadPoolExecutor(max_workers=10) as ex:
        futs = [
            ex.submit(process_forex_pair, base, quote, mode, yahoo_interval, daily_rates)
            for base, quote in FOREX_TUPLE
        ]
        for f in as_completed(futs, timeout=10):
            try:
                r = f.result()
                if r:
                    results.append(r)
            except Exception:
                pass

    if mode == "stability":
        results.sort(key=lambda x: x.get("stability_score", 0), reverse=True)
    else:
        results.sort(key=lambda x: x["trend_strength"], reverse=True)

    print(f"[scanner] mode={mode} scanned={len(results)} results")

    return {
        "statusCode": 200,
        "headers": {"Access-Control-Allow-Origin": "*", "Content-Type": "application/json"},
        "body": json.dumps({
            "top": results,
            "best": results[0] if results else None,
            "scanned": len(results),
            "mode": mode,
        }),
    }
