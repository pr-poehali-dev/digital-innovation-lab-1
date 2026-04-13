import json
import urllib.request
import urllib.parse


def handler(event: dict, context) -> dict:
    """Отправка Telegram уведомления через сервер (обход блокировок у пользователя)"""
    cors = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
    }

    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": cors, "body": ""}

    try:
        body = json.loads(event.get("body") or "{}")
    except Exception:
        return {"statusCode": 400, "headers": cors, "body": json.dumps({"ok": False, "error": "invalid json"})}

    token = body.get("token", "").strip()
    chat_id = body.get("chat_id", "").strip()
    text = body.get("text", "").strip()

    if not token or not chat_id or not text:
        return {"statusCode": 400, "headers": cors, "body": json.dumps({"ok": False, "error": "token, chat_id and text are required"})}

    url = f"https://api.telegram.org/bot{token}/sendMessage"
    data = urllib.parse.urlencode({
        "chat_id": chat_id,
        "text": text,
        "parse_mode": "HTML",
    }).encode()

    req = urllib.request.Request(url, data=data, method="POST")
    resp = urllib.request.urlopen(req, timeout=10)
    result = json.loads(resp.read().decode())

    return {
        "statusCode": 200,
        "headers": cors,
        "body": json.dumps({"ok": result.get("ok", False)}),
    }
