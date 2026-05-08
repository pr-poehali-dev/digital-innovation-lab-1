import json
import urllib.request
import urllib.error
import time
from typing import Dict, List, Any

CACHE: Dict[str, Any] = {"data": None, "ts": 0}
CACHE_TTL = 60

COINS = [
    {"id": "bitcoin", "symbol": "BTC"},
    {"id": "ethereum", "symbol": "ETH"},
    {"id": "solana", "symbol": "SOL"},
    {"id": "binancecoin", "symbol": "BNB"},
    {"id": "ripple", "symbol": "XRP"},
]

ALLOWED_EXCHANGES = {
    "Binance", "Coinbase Exchange", "Kraken", "Bybit",
    "OKX", "KuCoin", "Bitfinex", "Gate.io", "HTX", "Bitstamp"
}


def fetch_tickers(coin_id: str) -> List[Dict[str, Any]]:
    url = f"https://api.coingecko.com/api/v3/coins/{coin_id}/tickers?include_exchange_logo=false&depth=false"
    req = urllib.request.Request(url, headers={"User-Agent": "TradeBase/1.0"})
    try:
        with urllib.request.urlopen(req, timeout=8) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            return data.get("tickers", [])
    except (urllib.error.URLError, urllib.error.HTTPError, TimeoutError):
        return []


def find_pairs(symbol: str, tickers: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    prices = {}
    for t in tickers:
        market = t.get("market", {}).get("name", "")
        target = t.get("target", "")
        if market not in ALLOWED_EXCHANGES:
            continue
        if target not in ("USDT", "USD", "USDC"):
            continue
        last = t.get("last")
        volume = t.get("converted_volume", {}).get("usd", 0)
        if not last or last <= 0 or volume < 100000:
            continue
        if market not in prices or volume > prices[market]["volume"]:
            prices[market] = {"price": float(last), "volume": volume}

    if len(prices) < 2:
        return []

    items = sorted(prices.items(), key=lambda x: x[1]["price"])
    cheapest_name, cheapest = items[0]
    expensive_name, expensive = items[-1]

    spread = ((expensive["price"] - cheapest["price"]) / cheapest["price"]) * 100

    if spread < 0.15:
        return []

    return [{
        "symbol": symbol,
        "buy_exchange": cheapest_name,
        "buy_price": round(cheapest["price"], 4),
        "sell_exchange": expensive_name,
        "sell_price": round(expensive["price"], 4),
        "spread_pct": round(spread, 3),
        "buy_volume": int(cheapest["volume"]),
        "sell_volume": int(expensive["volume"]),
    }]


def handler(event: Dict[str, Any], context) -> Dict[str, Any]:
    """Сканер арбитражных связок: тянет цены с CoinGecko и ищет максимальный спред между биржами"""

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

    now = time.time()
    if CACHE["data"] and (now - CACHE["ts"]) < CACHE_TTL:
        body = CACHE["data"]
    else:
        all_pairs = []
        for coin in COINS:
            tickers = fetch_tickers(coin["id"])
            pairs = find_pairs(coin["symbol"], tickers)
            all_pairs.extend(pairs)
            time.sleep(0.3)

        all_pairs.sort(key=lambda x: x["spread_pct"], reverse=True)

        body = {
            "pairs": all_pairs,
            "updated_at": int(now),
            "source": "CoinGecko",
        }
        CACHE["data"] = body
        CACHE["ts"] = now

    return {
        "statusCode": 200,
        "headers": {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json",
        },
        "body": json.dumps(body),
    }
