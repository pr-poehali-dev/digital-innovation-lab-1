"""
Cron-функция: отправляет ежедневный сводный отчёт по всем ботам в Telegram.
Вызывается по расписанию (22:00) или вручную через POST.
Также принимает регистрацию бота (POST /register) и обновление времени (POST /settime).
"""
import json
import os
import urllib.request
import datetime
import psycopg2

CORS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
}

def get_tbl():
    schema = os.environ.get("MAIN_DB_SCHEMA", "public")
    return f"{schema}.tg_schedules"


def get_conn():
    return psycopg2.connect(os.environ["DATABASE_URL"])


def esc(val):
    if val is None:
        return "NULL"
    if isinstance(val, bool):
        return "TRUE" if val else "FALSE"
    if isinstance(val, (int, float)):
        return str(val)
    return "'" + str(val).replace("'", "''") + "'"


def tg_send(token, chat_id, text, buttons=None):
    payload = {"chat_id": chat_id, "text": text, "parse_mode": "HTML"}
    if buttons:
        payload["reply_markup"] = {"inline_keyboard": buttons}
    data = json.dumps(payload).encode()
    req = urllib.request.Request(
        f"https://api.telegram.org/bot{token}/sendMessage",
        data=data,
        headers={"Content-Type": "application/json"},
    )
    urllib.request.urlopen(req, timeout=8)


def fetch_today_report(journal_url):
    req = urllib.request.Request(
        journal_url + "/report/today",
        headers={"Content-Type": "application/json"},
    )
    resp = urllib.request.urlopen(req, timeout=8)
    return json.loads(resp.read().decode())


def build_report_text(data):
    bots = data.get("bots", [])
    sm = data.get("summary", {})
    if not bots:
        return "📊 <b>Сводка за сегодня</b>\n\nСегодня сделок не было."
    lines = ["📊 <b>Сводка за сегодня — все боты</b>", "━━━━━━━━━━━━━━━━━━"]
    for b in bots:
        wr = round(b["wins"] / b["total"] * 100) if b["total"] > 0 else 0
        pnl_e = "🟢" if b["profit"] >= 0 else "🔴"
        sign = "+" if b["profit"] >= 0 else ""
        lines.append(
            f"🤖 <b>{b['bot_name']}</b>\n"
            f"  📈 Сделок: {b['total']} | ✅ {b['wins']} / ❌ {b['losses']} | WR: {wr}%\n"
            f"  {pnl_e} P&amp;L: {sign}{b['profit']} {b['currency']}"
        )
    lines.append("━━━━━━━━━━━━━━━━━━")
    tot_e = "🟢" if sm.get("total_profit", 0) >= 0 else "🔴"
    tot_sign = "+" if sm.get("total_profit", 0) >= 0 else ""
    lines.append(
        f"<b>ИТОГО:</b> {sm.get('total_trades', 0)} сделок | WR: {sm.get('winrate', 0)}%\n"
        f"{tot_e} Общий P&amp;L: {tot_sign}{sm.get('total_profit', 0)}"
    )
    return "\n".join(lines)


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

    # POST /tg-daily-report/register — бот регистрирует свои данные
    if method == "POST" and path.endswith("/register"):
        tg_token = body.get("tg_token", "")
        tg_chat_id = str(body.get("tg_chat_id", ""))
        journal_url = body.get("journal_url", "")
        report_time = body.get("report_time", "22:00")
        if not tg_token or not tg_chat_id or not journal_url:
            return {"statusCode": 400, "headers": CORS, "body": json.dumps({"error": "tg_token, tg_chat_id, journal_url required"})}
        TBL = get_tbl()
        conn = get_conn()
        cur = conn.cursor()
        cur.execute(
            f"INSERT INTO {TBL} (tg_token, tg_chat_id, report_time, journal_url) "
            f"VALUES ({esc(tg_token)}, {esc(tg_chat_id)}, {esc(report_time)}, {esc(journal_url)}) "
            f"ON CONFLICT (tg_chat_id) DO UPDATE SET "
            f"tg_token = EXCLUDED.tg_token, "
            f"journal_url = EXCLUDED.journal_url, "
            f"report_time = EXCLUDED.report_time, "
            f"updated_at = NOW()"
        )
        conn.commit()
        cur.close()
        conn.close()
        return {"statusCode": 200, "headers": CORS, "body": json.dumps({"ok": True})}

    # POST /tg-daily-report/settime — обновить время отчёта
    if method == "POST" and path.endswith("/settime"):
        tg_chat_id = str(body.get("tg_chat_id", ""))
        report_time = body.get("report_time", "22:00")
        if not tg_chat_id:
            return {"statusCode": 400, "headers": CORS, "body": json.dumps({"error": "tg_chat_id required"})}
        TBL = get_tbl()
        conn = get_conn()
        cur = conn.cursor()
        cur.execute(
            f"UPDATE {TBL} SET report_time = {esc(report_time)}, updated_at = NOW() "
            f"WHERE tg_chat_id = {esc(tg_chat_id)}"
        )
        conn.commit()
        cur.close()
        conn.close()
        return {"statusCode": 200, "headers": CORS, "body": json.dumps({"ok": True})}

    # GET /tg-daily-report/send — cron-триггер или ручной вызов
    # Отправляет отчёт всем у кого сейчас совпадает report_time
    if method == "GET" and (path.endswith("/send") or path.endswith("/")):
        now = datetime.datetime.now()
        current_time = now.strftime("%H:%M")
        TBL = get_tbl()
        conn = get_conn()
        cur = conn.cursor()
        cur.execute(
            f"SELECT tg_token, tg_chat_id, journal_url FROM {TBL} "
            f"WHERE report_time = {esc(current_time)}"
        )
        rows = cur.fetchall()
        cur.close()
        conn.close()
        sent = 0
        errors = []
        for row in rows:
            token, chat_id, journal_url = row
            try:
                data = fetch_today_report(journal_url)
                text = build_report_text(data)
                tg_send(token, chat_id, text)
                sent += 1
            except Exception as e:
                errors.append(f"{chat_id}: {str(e)}")
        return {"statusCode": 200, "headers": CORS, "body": json.dumps({
            "ok": True,
            "time": current_time,
            "sent": sent,
            "errors": errors,
        })}

    # GET /tg-daily-report/send-all — принудительно всем (для теста)
    if method == "GET" and path.endswith("/send-all"):
        TBL = get_tbl()
        conn = get_conn()
        cur = conn.cursor()
        cur.execute(f"SELECT tg_token, tg_chat_id, journal_url FROM {TBL}")
        rows = cur.fetchall()
        cur.close()
        conn.close()
        sent = 0
        for row in rows:
            token, chat_id, journal_url = row
            try:
                data = fetch_today_report(journal_url)
                text = build_report_text(data)
                tg_send(token, chat_id, text)
                sent += 1
            except Exception:
                pass
        return {"statusCode": 200, "headers": CORS, "body": json.dumps({"ok": True, "sent": sent})}

    return {"statusCode": 404, "headers": CORS, "body": json.dumps({"error": "not found"})}