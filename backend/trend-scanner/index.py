import json
import urllib.request

BINANCE_TICKER_URL = "https://api.binance.com/api/v3/ticker/24hr"

# Только те крипто-пары, которые реально есть на Pocket Option (OTC)
CRYPTO_PAIRS = [
    "BTCUSDT", "ETHUSDT", "LTCUSDT", "XRPUSDT", "SOLUSDT",
    "BNBUSDT", "DOGEUSDT", "ADAUSDT", "DOTUSDT", "AVAXUSDT",
]

PO_ASSET_MAP = {
    "BTCUSDT": "BTC/USD",
    "ETHUSDT": "ETH/USD",
    "LTCUSDT": "LTC/USD",
    "XRPUSDT": "XRP/USD",
    "SOLUSDT": "SOL/USD",
    "BNBUSDT": "BNB/USD",
    "DOGEUSDT": "DOGE/USD",
    "ADAUSDT": "ADA/USD",
    "DOTUSDT": "DOT/USD",
    "AVAXUSDT": "AVAX/USD",
}


def handler(event: dict, context) -> dict:
    """Сканирует крипто-рынок через Binance API и возвращает топ активов по силе тренда."""

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

    symbols = ",".join([f'"{s}"' for s in CRYPTO_PAIRS])
    url = f"https://api.binance.com/api/v3/ticker/24hr?symbols=[{symbols}]"

    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=10) as resp:
        data = json.loads(resp.read())

    results = []
    for ticker in data:
        symbol = ticker["symbol"]
        if symbol not in PO_ASSET_MAP:
            continue

        price_change_pct = float(ticker["priceChangePercent"])
        volume = float(ticker["quoteVolume"])
        high = float(ticker["highPrice"])
        low = float(ticker["lowPrice"])
        last = float(ticker["lastPrice"])

        price_range = high - low
        trend_strength = abs(price_change_pct)
        direction = "UP" if price_change_pct > 0 else "DOWN"

        position_in_range = ((last - low) / price_range * 100) if price_range > 0 else 50

        results.append({
            "symbol": symbol,
            "asset": PO_ASSET_MAP[symbol],
            "asset_otc": PO_ASSET_MAP[symbol] + " (OTC)",
            "change_pct": round(price_change_pct, 2),
            "trend_strength": round(trend_strength, 2),
            "direction": direction,
            "volume_usd": round(volume),
            "position_in_range": round(position_in_range, 1),
            "high": float(ticker["highPrice"]),
            "low": float(ticker["lowPrice"]),
            "last": float(ticker["lastPrice"]),
        })

    results.sort(key=lambda x: x["trend_strength"], reverse=True)
    top = results[:5]

    return {
        "statusCode": 200,
        "headers": {"Access-Control-Allow-Origin": "*", "Content-Type": "application/json"},
        "body": {
            "top": top,
            "best": top[0] if top else None,
            "scanned": len(results),
        },
    }