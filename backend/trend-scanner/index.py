import json
import urllib.request
from datetime import datetime, timedelta, timezone

try:
    from tradingview_ta import TA_Handler, Interval
    TV_AVAILABLE = True
except Exception:
    TV_AVAILABLE = False

# Крипто-пары Pocket Option
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

# Forex пары TradingView symbol → display name
FOREX_TV = [
    ("EURUSD", "EUR/USD"),
    ("GBPUSD", "GBP/USD"),
    ("USDJPY", "USD/JPY"),
    ("AUDUSD", "AUD/USD"),
    ("USDCAD", "USD/CAD"),
    ("USDCHF", "USD/CHF"),
    ("NZDUSD", "NZD/USD"),
    ("EURGBP", "EUR/GBP"),
    ("EURJPY", "EUR/JPY"),
    ("GBPJPY", "GBP/JPY"),
]

FOREX_PAIRS_FALLBACK = [
    ("EUR", "USD"), ("GBP", "USD"), ("USD", "JPY"), ("AUD", "USD"),
    ("USD", "CAD"), ("USD", "CHF"), ("NZD", "USD"),
    ("EUR", "GBP"), ("EUR", "JPY"), ("GBP", "JPY"),
]

SUMMARY_MAP = {
    "STRONG_BUY": "STRONG_BUY",
    "BUY": "BUY",
    "NEUTRAL": "NEUTRAL",
    "SELL": "SELL",
    "STRONG_SELL": "STRONG_SELL",
}

DIRECTION_MAP = {
    "STRONG_BUY": "UP",
    "BUY": "UP",
    "NEUTRAL": "NEUTRAL",
    "SELL": "DOWN",
    "STRONG_SELL": "DOWN",
}

STRENGTH_MAP = {
    "STRONG_BUY": 5,
    "BUY": 3,
    "NEUTRAL": 1,
    "SELL": 3,
    "STRONG_SELL": 5,
}


def fetch_url(url):
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=10) as resp:
        return json.loads(resp.read())


def fetch_candles_twelvedata(symbol, interval, limit, api_key):
    url = f"https://api.twelvedata.com/time_series?symbol={symbol}&interval={interval}&outputsize={limit}&apikey={api_key}"
    data = fetch_url(url)
    if data.get("status") == "error":
        raise Exception(data.get("message", "Twelve Data error"))
    candles = []
    for c in data.get("values", []):
        candles.append({
            "t": c["datetime"],
            "o": float(c["open"]),
            "h": float(c["high"]),
            "l": float(c["low"]),
            "c": float(c["close"]),
            "green": float(c["close"]) >= float(c["open"]),
        })
    return candles


def get_tv_analysis(symbol, exchange, screener, interval):
    handler = TA_Handler(
        symbol=symbol,
        exchange=exchange,
        screener=screener,
        interval=interval,
    )
    analysis = handler.get_analysis()
    summary = analysis.summary["RECOMMENDATION"]
    indicators = analysis.indicators
    return {
        "summary": SUMMARY_MAP.get(summary, summary),
        "direction": DIRECTION_MAP.get(summary, "NEUTRAL"),
        "trend_strength": STRENGTH_MAP.get(summary, 1),
        "rsi": round(indicators.get("RSI", 50), 1),
        "macd": round(indicators.get("MACD.macd", 0), 4),
        "ema20": round(indicators.get("EMA20", 0), 4),
        "buy_signals": analysis.summary.get("BUY", 0),
        "sell_signals": analysis.summary.get("SELL", 0),
        "neutral_signals": analysis.summary.get("NEUTRAL", 0),
    }


# Twelve Data symbol map для форекса
FOREX_TD_SYMBOL = {
    "EUR/USD": "EUR/USD", "GBP/USD": "GBP/USD", "USD/JPY": "USD/JPY",
    "AUD/USD": "AUD/USD", "USD/CAD": "USD/CAD", "USD/CHF": "USD/CHF",
    "NZD/USD": "NZD/USD", "EUR/GBP": "EUR/GBP", "EUR/JPY": "EUR/JPY",
    "GBP/JPY": "GBP/JPY",
}

# Twelve Data symbol map для крипты
CRYPTO_TD_SYMBOL = {
    "BTC/USD": "BTC/USD", "ETH/USD": "ETH/USD", "SOL/USD": "SOL/USD",
    "BNB/USD": "BNB/USD", "DOGE/USD": "DOGE/USD",
}


def handler(event: dict, context) -> dict:
    """Сканирует активы Pocket Option через TradingView TA + свечи Twelve Data."""

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

    import os
    td_key = os.environ.get("TWELVE_DATA_API_KEY", "")

    params = event.get("queryStringParameters") or {}

    # --- ТЕСТ: GET /?test=candles ---
    if params.get("test") == "candles":
        candles = fetch_candles_twelvedata("AUD/USD", "1h", 5, td_key)
        return {
            "statusCode": 200,
            "headers": {"Access-Control-Allow-Origin": "*", "Content-Type": "application/json"},
            "body": {"symbol": "AUD/USD", "interval": "1h", "candles": candles},
        }

    results = []

    if TV_AVAILABLE:
        # --- КРИПТА через TradingView + свечи Twelve Data ---
        for symbol, display in CRYPTO_MAP.items():
            try:
                ta = get_tv_analysis(symbol, "BINANCE", "crypto", Interval.INTERVAL_15_MINUTES)
                candles = []
                if td_key and display in CRYPTO_TD_SYMBOL:
                    try:
                        candles = fetch_candles_twelvedata(CRYPTO_TD_SYMBOL[display], "1h", 6, td_key)
                    except Exception:
                        pass
                results.append({
                    "asset": display,
                    "asset_otc": display + " (OTC)",
                    "category": "crypto",
                    "summary": ta["summary"],
                    "direction": ta["direction"],
                    "trend_strength": ta["trend_strength"],
                    "change_pct": None,
                    "rsi": ta["rsi"],
                    "buy_signals": ta["buy_signals"],
                    "sell_signals": ta["sell_signals"],
                    "neutral_signals": ta["neutral_signals"],
                    "position_in_range": None,
                    "candles": candles,
                })
            except Exception:
                continue

        # --- FOREX через TradingView + свечи Twelve Data ---
        for symbol, display in FOREX_TV:
            try:
                ta = get_tv_analysis(symbol, "FX_IDC", "forex", Interval.INTERVAL_15_MINUTES)
                candles = []
                if td_key and display in FOREX_TD_SYMBOL:
                    try:
                        candles = fetch_candles_twelvedata(FOREX_TD_SYMBOL[display], "1h", 6, td_key)
                    except Exception:
                        pass
                results.append({
                    "asset": display,
                    "asset_otc": display + " (OTC)",
                    "category": "forex",
                    "summary": ta["summary"],
                    "direction": ta["direction"],
                    "trend_strength": ta["trend_strength"],
                    "change_pct": None,
                    "rsi": ta["rsi"],
                    "buy_signals": ta["buy_signals"],
                    "sell_signals": ta["sell_signals"],
                    "neutral_signals": ta["neutral_signals"],
                    "position_in_range": None,
                    "candles": candles,
                })
            except Exception:
                continue

    else:
        # --- FALLBACK: Binance 24h ticker для крипты ---
        symbols = ",".join([f'"{s}"' for s in CRYPTO_PAIRS])
        try:
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
                    "summary": "BUY" if change_pct > 0 else "SELL",
                    "direction": "UP" if change_pct > 0 else "DOWN",
                    "trend_strength": round(abs(change_pct), 2),
                    "change_pct": round(change_pct, 2),
                    "rsi": None,
                    "buy_signals": None,
                    "sell_signals": None,
                    "neutral_signals": None,
                    "position_in_range": round(((last - low) / price_range * 100) if price_range > 0 else 50, 1),
                })
        except Exception:
            pass

        # --- FALLBACK: Forex через currency-api ---
        today = datetime.now(timezone.utc)
        yesterday = today - timedelta(days=1)
        try:
            today_str = today.strftime("%Y-%m-%d")
            yesterday_str = yesterday.strftime("%Y-%m-%d")
            current_data = fetch_url(f"https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@{today_str}/v1/currencies/usd.min.json")
            prev_data = fetch_url(f"https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@{yesterday_str}/v1/currencies/usd.min.json")
            current_rates = current_data["usd"]
            prev_rates = prev_data["usd"]
            for base, quote in FOREX_PAIRS_FALLBACK:
                try:
                    b, q = base.lower(), quote.lower()
                    if base == "USD":
                        rate_now, rate_prev = current_rates[q], prev_rates[q]
                    elif quote == "USD":
                        rate_now, rate_prev = 1 / current_rates[b], 1 / prev_rates[b]
                    else:
                        rate_now = current_rates[q] / current_rates[b]
                        rate_prev = prev_rates[q] / prev_rates[b]
                    change_pct = ((rate_now - rate_prev) / rate_prev) * 100
                    results.append({
                        "asset": f"{base}/{quote}",
                        "asset_otc": f"{base}/{quote} (OTC)",
                        "category": "forex",
                        "summary": "BUY" if change_pct > 0 else "SELL",
                        "direction": "UP" if change_pct > 0 else "DOWN",
                        "trend_strength": round(abs(change_pct), 3),
                        "change_pct": round(change_pct, 3),
                        "rsi": None,
                        "buy_signals": None,
                        "sell_signals": None,
                        "neutral_signals": None,
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
            "source": "tradingview" if TV_AVAILABLE else "fallback",
        },
    }