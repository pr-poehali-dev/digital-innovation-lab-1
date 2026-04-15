"""
Журнал торговли ботов: создание сессии, запись сделок, получение истории.
"""
import json
import os
import psycopg2


CORS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
}


def get_conn():
    conn = psycopg2.connect(os.environ["DATABASE_URL"])
    return conn


def esc(val):
    if val is None:
        return "NULL"
    if isinstance(val, bool):
        return "TRUE" if val else "FALSE"
    if isinstance(val, (int, float)):
        return str(val)
    return "'" + str(val).replace("'", "''") + "'"


def handler(event: dict, context) -> dict:
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS, "body": ""}

    method = event.get("httpMethod", "GET")
    path = event.get("path", "/")
    body = {}
    if event.get("body"):
        try:
            body = json.loads(event["body"])
        except Exception:
            pass

    s = os.environ.get("MAIN_DB_SCHEMA", "public")

    # POST /bot-trades/session — создать новую сессию, вернуть session_id
    if method == "POST" and path.endswith("/session"):
        bot_name = esc(body.get("bot_name", "Бот"))
        strategy = esc(body.get("strategy", "unknown"))
        asset = esc(body.get("asset", "EUR/USD"))
        bet_amount = esc(body.get("bet_amount", 0))
        currency = esc(body.get("currency", "RUB"))
        is_demo = esc(body.get("is_demo", True))

        conn = get_conn()
        cur = conn.cursor()
        cur.execute(
            f"INSERT INTO {s}.bot_sessions (bot_name, strategy, asset, bet_amount, currency, is_demo) "
            f"VALUES ({bot_name}, {strategy}, {asset}, {bet_amount}, {currency}, {is_demo}) RETURNING id"
        )
        session_id = str(cur.fetchone()[0])
        conn.commit()
        cur.close()
        conn.close()
        return {"statusCode": 200, "headers": CORS, "body": json.dumps({"session_id": session_id})}

    # POST /bot-trades/trade — записать сделку
    if method == "POST" and path.endswith("/trade"):
        session_id = body.get("session_id")
        if not session_id:
            return {"statusCode": 400, "headers": CORS, "body": json.dumps({"error": "session_id required"})}

        won = bool(body.get("won", False))
        bet = float(body.get("bet", 0))
        payout_pct = float(body.get("payout_pct", 82))
        profit = round(bet * payout_pct / 100, 2) if won else -bet

        s_id = esc(session_id)
        s_asset = esc(body.get("asset", "EUR/USD"))
        s_direction = esc(body.get("direction", "CALL"))
        s_bet = esc(bet)
        s_payout = esc(payout_pct)
        s_won = esc(won)
        s_profit = esc(profit)
        s_wins = esc(1 if won else 0)
        s_losses = esc(0 if won else 1)
        s_strategy_name = esc(body.get("strategy_name") or "")
        s_indicator_value = esc(body.get("indicator_value") or "")

        conn = get_conn()
        cur = conn.cursor()
        cur.execute(
            f"INSERT INTO {s}.bot_trades (session_id, asset, direction, bet, payout_pct, won, profit, strategy_name, indicator_value) "
            f"VALUES ({s_id}, {s_asset}, {s_direction}, {s_bet}, {s_payout}, {s_won}, {s_profit}, {s_strategy_name}, {s_indicator_value})"
        )
        cur.execute(
            f"UPDATE {s}.bot_sessions SET "
            f"total_trades = total_trades + 1, "
            f"wins = wins + {s_wins}, "
            f"losses = losses + {s_losses}, "
            f"total_profit = total_profit + {s_profit} "
            f"WHERE id = {s_id}"
        )
        conn.commit()
        cur.close()
        conn.close()
        return {"statusCode": 200, "headers": CORS, "body": json.dumps({"ok": True, "profit": profit})}

    # PUT /bot-trades/session/end — завершить сессию
    if method == "PUT" and "/session/end" in path:
        session_id = body.get("session_id")
        if not session_id:
            return {"statusCode": 400, "headers": CORS, "body": json.dumps({"error": "session_id required"})}
        conn = get_conn()
        cur = conn.cursor()
        cur.execute(f"UPDATE {s}.bot_sessions SET ended_at = NOW() WHERE id = {esc(session_id)}")
        conn.commit()
        cur.close()
        conn.close()
        return {"statusCode": 200, "headers": CORS, "body": json.dumps({"ok": True})}

    # GET /bot-trades/sessions — список всех сессий
    if method == "GET" and path.endswith("/sessions"):
        conn = get_conn()
        cur = conn.cursor()
        cur.execute(
            f"SELECT id, bot_name, strategy, asset, bet_amount, currency, is_demo, "
            f"started_at, ended_at, total_trades, wins, losses, total_profit "
            f"FROM {s}.bot_sessions ORDER BY started_at DESC LIMIT 100"
        )
        rows = cur.fetchall()
        cur.close()
        conn.close()
        sessions = [
            {
                "id": str(r[0]),
                "bot_name": r[1],
                "strategy": r[2],
                "asset": r[3],
                "bet_amount": float(r[4]) if r[4] is not None else 0,
                "currency": r[5],
                "is_demo": r[6],
                "started_at": r[7].isoformat() if r[7] else None,
                "ended_at": r[8].isoformat() if r[8] else None,
                "total_trades": r[9],
                "wins": r[10],
                "losses": r[11],
                "total_profit": float(r[12]) if r[12] is not None else 0,
            }
            for r in rows
        ]
        return {"statusCode": 200, "headers": CORS, "body": json.dumps({"sessions": sessions})}

    # GET /bot-trades/trades?session_id=... — сделки сессии
    if method == "GET" and path.endswith("/trades"):
        params = event.get("queryStringParameters") or {}
        session_id = params.get("session_id")
        if not session_id:
            return {"statusCode": 400, "headers": CORS, "body": json.dumps({"error": "session_id required"})}
        conn = get_conn()
        cur = conn.cursor()
        cur.execute(
            f"SELECT id, traded_at, asset, direction, bet, payout_pct, won, profit, strategy_name, indicator_value "
            f"FROM {s}.bot_trades WHERE session_id = {esc(session_id)} ORDER BY traded_at ASC"
        )
        rows = cur.fetchall()
        cur.close()
        conn.close()
        trades = [
            {
                "id": str(r[0]),
                "traded_at": r[1].isoformat() if r[1] else None,
                "asset": r[2],
                "direction": r[3],
                "bet": float(r[4]) if r[4] is not None else 0,
                "payout_pct": float(r[5]) if r[5] is not None else 0,
                "won": r[6],
                "profit": float(r[7]) if r[7] is not None else 0,
                "strategy_name": r[8] or "",
                "indicator_value": r[9] or "",
            }
            for r in rows
        ]
        return {"statusCode": 200, "headers": CORS, "body": json.dumps({"trades": trades})}

    # GET /bot-trades/report/today — сводка по всем ботам за сегодня
    if method == "GET" and "report/today" in path:
        conn = get_conn()
        cur = conn.cursor()
        cur.execute(
            f"SELECT bot_name, SUM(total_trades), SUM(wins), SUM(losses), SUM(total_profit), currency "
            f"FROM {s}.bot_sessions "
            f"WHERE started_at >= CURRENT_DATE "
            f"GROUP BY bot_name, currency "
            f"ORDER BY SUM(total_profit) DESC"
        )
        rows = cur.fetchall()
        cur.close()
        conn.close()
        bots = [
            {
                "bot_name": r[0],
                "total": int(r[1] or 0),
                "wins": int(r[2] or 0),
                "losses": int(r[3] or 0),
                "profit": round(float(r[4] or 0), 2),
                "currency": r[5] or "",
            }
            for r in rows
        ]
        total_profit = round(sum(b["profit"] for b in bots), 2)
        total_trades = sum(b["total"] for b in bots)
        total_wins = sum(b["wins"] for b in bots)
        return {"statusCode": 200, "headers": CORS, "body": json.dumps({
            "bots": bots,
            "summary": {
                "total_trades": total_trades,
                "total_wins": total_wins,
                "total_losses": total_trades - total_wins,
                "total_profit": total_profit,
                "winrate": round(total_wins / total_trades * 100) if total_trades > 0 else 0,
            }
        })}

    return {"statusCode": 404, "headers": CORS, "body": json.dumps({"error": "not found"})}
