import json
import urllib.request
import urllib.parse


def handler(event: dict, context) -> dict:
    """Отправка/редактирование/удаление сообщений в Telegram с поддержкой inline-кнопок.
    
    Поддерживаемые действия:
      action="send"   (по умолчанию) — отправить новое сообщение (опц. с reply_markup)
      action="edit"   — отредактировать существующее (нужен message_id)
      action="delete" — удалить сообщение (нужен message_id)
    
    Тело запроса:
      token       (обяз.) — токен бота
      chat_id     (обяз.) — id чата
      text        (для send/edit) — текст сообщения (HTML)
      reply_markup (опц.) — JSON inline-клавиатуры или dict
      message_id  (для edit/delete)
      action      (опц.)
    
    Ответ: { ok: bool, message_id?: int, error?: str }
    """
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

    token = str(body.get("token", "")).strip()
    chat_id = str(body.get("chat_id", "")).strip()
    action = str(body.get("action", "send")).strip().lower()

    if not token or not chat_id:
        return {"statusCode": 400, "headers": cors, "body": json.dumps({"ok": False, "error": "token and chat_id are required"})}

    if action == "delete":
        message_id = body.get("message_id")
        if not message_id:
            return {"statusCode": 400, "headers": cors, "body": json.dumps({"ok": False, "error": "message_id required for delete"})}
        url = f"https://api.telegram.org/bot{token}/deleteMessage"
        data = urllib.parse.urlencode({"chat_id": chat_id, "message_id": str(message_id)}).encode()
    elif action == "edit":
        message_id = body.get("message_id")
        text = str(body.get("text", "")).strip()
        if not message_id or not text:
            return {"statusCode": 400, "headers": cors, "body": json.dumps({"ok": False, "error": "message_id and text required for edit"})}
        url = f"https://api.telegram.org/bot{token}/editMessageText"
        params = {
            "chat_id": chat_id,
            "message_id": str(message_id),
            "text": text,
            "parse_mode": "HTML",
        }
        reply_markup = body.get("reply_markup")
        if reply_markup is not None:
            params["reply_markup"] = reply_markup if isinstance(reply_markup, str) else json.dumps(reply_markup)
        data = urllib.parse.urlencode(params).encode()
    else:
        text = str(body.get("text", "")).strip()
        if not text:
            return {"statusCode": 400, "headers": cors, "body": json.dumps({"ok": False, "error": "text is required"})}
        url = f"https://api.telegram.org/bot{token}/sendMessage"
        params = {
            "chat_id": chat_id,
            "text": text,
            "parse_mode": "HTML",
        }
        reply_markup = body.get("reply_markup")
        if reply_markup is not None:
            params["reply_markup"] = reply_markup if isinstance(reply_markup, str) else json.dumps(reply_markup)
        data = urllib.parse.urlencode(params).encode()

    try:
        req = urllib.request.Request(url, data=data, method="POST")
        resp = urllib.request.urlopen(req, timeout=10)
        result = json.loads(resp.read().decode())
    except Exception as e:
        return {"statusCode": 200, "headers": cors, "body": json.dumps({"ok": False, "error": str(e)})}

    response_body = {"ok": bool(result.get("ok", False))}
    res = result.get("result")
    if isinstance(res, dict) and "message_id" in res:
        response_body["message_id"] = res["message_id"]
    if not response_body["ok"]:
        response_body["error"] = result.get("description", "telegram api error")

    return {
        "statusCode": 200,
        "headers": cors,
        "body": json.dumps(response_body),
    }
