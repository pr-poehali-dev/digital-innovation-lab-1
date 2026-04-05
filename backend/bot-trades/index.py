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
    return psycopg2.connect(os.environ["DATABASE_URL"])


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

    # POST /bot-trades/session — создать новую сессию, вернуть session_id
    if method == "POST" and path.endswith("/session"):
        conn = get_conn()
        cur = conn.cursor()
        cur.execute(
            """
            INSERT INTO bot_sessions (bot_name, strategy, asset, bet_amount, currency, is_demo)
            VALUES (%s, %s, %s, %s, %s, %s) RETURNING id
            """,
            (
                body.get("bot_name", "Бот"),
                body.get("strategy", "unknown"),
                body.get("asset", "EUR/USD"),
                body.get("bet_amount", 0),
                body.get("currency", "RUB"),
                body.get("is_demo", True),
            ),
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

        conn = get_conn()
        cur = conn.cursor()

        cur.execute(
            """
            INSERT INTO bot_trades (session_id, asset, direction, bet, payout_pct, won, profit)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
            """,
            (
                session_id,
                body.get("asset", "EUR/USD"),
                body.get("direction", "CALL"),
                bet,
                payout_pct,
                won,
                profit,
            ),
        )

        cur.execute(
            """
            UPDATE bot_sessions SET
                total_trades = total_trades + 1,
                wins = wins + %s,
                losses = losses + %s,
                total_profit = total_profit + %s
            WHERE id = %s
            """,
            (1 if won else 0, 0 if won else 1, profit, session_id),
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
        cur.execute(
            "UPDATE bot_sessions SET ended_at = NOW() WHERE id = %s",
            (session_id,),
        )
        conn.commit()
        cur.close()
        conn.close()
        return {"statusCode": 200, "headers": CORS, "body": json.dumps({"ok": True})}

    # GET /bot-trades/sessions — список всех сессий
    if method == "GET" and path.endswith("/sessions"):
        conn = get_conn()
        cur = conn.cursor()
        cur.execute(
            """
            SELECT id, bot_name, strategy, asset, bet_amount, currency, is_demo,
                   started_at, ended_at, total_trades, wins, losses, total_profit
            FROM bot_sessions
            ORDER BY started_at DESC
            LIMIT 100
            """
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
                "bet_amount": float(r[4]),
                "currency": r[5],
                "is_demo": r[6],
                "started_at": r[7].isoformat() if r[7] else None,
                "ended_at": r[8].isoformat() if r[8] else None,
                "total_trades": r[9],
                "wins": r[10],
                "losses": r[11],
                "total_profit": float(r[12]),
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
            """
            SELECT id, traded_at, asset, direction, bet, payout_pct, won, profit
            FROM bot_trades WHERE session_id = %s ORDER BY traded_at ASC
            """,
            (session_id,),
        )
        rows = cur.fetchall()
        cur.close()
        conn.close()
        trades = [
            {
                "id": str(r[0]),
                "traded_at": r[1].isoformat(),
                "asset": r[2],
                "direction": r[3],
                "bet": float(r[4]),
                "payout_pct": float(r[5]),
                "won": r[6],
                "profit": float(r[7]),
            }
            for r in rows
        ]
        return {"statusCode": 200, "headers": CORS, "body": json.dumps({"trades": trades})}

    return {"statusCode": 404, "headers": CORS, "body": json.dumps({"error": "not found"})}
