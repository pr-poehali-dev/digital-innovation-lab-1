import json
import time
import urllib.request
import urllib.parse


def _mask_chat(chat_id: str) -> str:
    """Скрывает часть chat_id в логах для приватности."""
    s = str(chat_id)
    if len(s) <= 4:
        return "***"
    return s[:2] + "***" + s[-2:]


def _log(req_id: str, msg: str) -> None:
    """Префикс [TG-SEND req_id] для удобной фильтрации."""
    print(f"[TG-SEND {req_id}] {msg}", flush=True)


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
    req_id = getattr(context, "request_id", "?")[:8] if context else "?"
    t0 = time.time()

    cors = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
    }

    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": cors, "body": ""}

    try:
        body = json.loads(event.get("body") or "{}")
    except Exception as e:
        _log(req_id, f"❌ INVALID_JSON: {e}")
        return {"statusCode": 400, "headers": cors, "body": json.dumps({"ok": False, "error": "invalid json"})}

    token = str(body.get("token", "")).strip()
    chat_id = str(body.get("chat_id", "")).strip()
    action = str(body.get("action", "send")).strip().lower()

    if not token or not chat_id:
        _log(req_id, f"❌ MISSING_PARAMS: token_len={len(token)} chat_len={len(chat_id)}")
        return {"statusCode": 400, "headers": cors, "body": json.dumps({"ok": False, "error": "token and chat_id are required"})}

    masked = _mask_chat(chat_id)
    has_markup = body.get("reply_markup") is not None
    in_msg_id = body.get("message_id")

    if action == "document":
        # Отправка документа (файла) — base64 в file_b64, имя в file_name
        import base64
        file_b64 = body.get("file_b64", "")
        file_name = str(body.get("file_name", "report.txt")).strip()
        caption = str(body.get("caption", "")).strip()
        if not file_b64:
            _log(req_id, f"❌ DOC_NO_FILE chat={masked}")
            return {"statusCode": 400, "headers": cors, "body": json.dumps({"ok": False, "error": "file_b64 required"})}
        try:
            file_bytes = base64.b64decode(file_b64)
        except Exception as e:
            _log(req_id, f"❌ DOC_BAD_B64: {e}")
            return {"statusCode": 400, "headers": cors, "body": json.dumps({"ok": False, "error": f"bad base64: {e}"})}
        # multipart/form-data вручную
        boundary = "----py" + str(int(time.time() * 1000))
        body_parts = []
        def _add_field(name, value):
            body_parts.append(f"--{boundary}\r\nContent-Disposition: form-data; name=\"{name}\"\r\n\r\n{value}\r\n".encode())
        _add_field("chat_id", chat_id)
        if caption:
            _add_field("caption", caption)
            _add_field("parse_mode", "HTML")
        body_parts.append(
            f"--{boundary}\r\nContent-Disposition: form-data; name=\"document\"; filename=\"{file_name}\"\r\nContent-Type: application/octet-stream\r\n\r\n".encode()
            + file_bytes + b"\r\n"
        )
        body_parts.append(f"--{boundary}--\r\n".encode())
        data = b"".join(body_parts)
        url = f"https://api.telegram.org/bot{token}/sendDocument"
        _log(req_id, f"➡️  DOC chat={masked} name={file_name} size={len(file_bytes)}b")
        try:
            req = urllib.request.Request(url, data=data, method="POST", headers={"Content-Type": f"multipart/form-data; boundary={boundary}"})
            resp = urllib.request.urlopen(req, timeout=30)
            result = json.loads(resp.read().decode())
            ok = bool(result.get("ok", False))
            elapsed_ms = int((time.time() - t0) * 1000)
            if ok:
                _log(req_id, f"✅ DOC_OK chat={masked} elapsed={elapsed_ms}ms")
                return {"statusCode": 200, "headers": cors, "body": json.dumps({"ok": True, "message_id": result.get("result", {}).get("message_id")})}
            _log(req_id, f"⚠️  DOC_ERR chat={masked} err={result.get('description')}")
            return {"statusCode": 200, "headers": cors, "body": json.dumps({"ok": False, "error": result.get("description", "tg error")})}
        except Exception as e:
            _log(req_id, f"💥 DOC_FAIL chat={masked} err={e}")
            return {"statusCode": 200, "headers": cors, "body": json.dumps({"ok": False, "error": str(e)})}

    if action == "delete":
        if not in_msg_id:
            _log(req_id, f"❌ DELETE_NO_MSG_ID chat={masked}")
            return {"statusCode": 400, "headers": cors, "body": json.dumps({"ok": False, "error": "message_id required for delete"})}
        _log(req_id, f"➡️  DELETE chat={masked} msg_id={in_msg_id}")
        url = f"https://api.telegram.org/bot{token}/deleteMessage"
        data = urllib.parse.urlencode({"chat_id": chat_id, "message_id": str(in_msg_id)}).encode()
    elif action == "edit":
        text = str(body.get("text", "")).strip()
        if not in_msg_id or not text:
            _log(req_id, f"❌ EDIT_BAD_PARAMS chat={masked} msg_id={in_msg_id} text_len={len(text)}")
            return {"statusCode": 400, "headers": cors, "body": json.dumps({"ok": False, "error": "message_id and text required for edit"})}
        _log(req_id, f"➡️  EDIT chat={masked} msg_id={in_msg_id} text_len={len(text)} markup={has_markup}")
        url = f"https://api.telegram.org/bot{token}/editMessageText"
        params = {
            "chat_id": chat_id,
            "message_id": str(in_msg_id),
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
            _log(req_id, f"❌ SEND_NO_TEXT chat={masked}")
            return {"statusCode": 400, "headers": cors, "body": json.dumps({"ok": False, "error": "text is required"})}
        _log(req_id, f"➡️  SEND chat={masked} text_len={len(text)} markup={has_markup}")
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
        elapsed_ms = int((time.time() - t0) * 1000)
        _log(req_id, f"💥 TG_API_FAIL action={action} chat={masked} elapsed={elapsed_ms}ms err={e}")
        return {"statusCode": 200, "headers": cors, "body": json.dumps({"ok": False, "error": str(e)})}

    response_body = {"ok": bool(result.get("ok", False))}
    res = result.get("result")
    out_msg_id = None
    if isinstance(res, dict) and "message_id" in res:
        out_msg_id = res["message_id"]
        response_body["message_id"] = out_msg_id
    if not response_body["ok"]:
        response_body["error"] = result.get("description", "telegram api error")

    elapsed_ms = int((time.time() - t0) * 1000)
    if response_body["ok"]:
        _log(req_id, f"✅ OK action={action} chat={masked} msg_id={out_msg_id} elapsed={elapsed_ms}ms")
    else:
        _log(req_id, f"⚠️  TG_ERR action={action} chat={masked} elapsed={elapsed_ms}ms err={response_body.get('error')}")

    return {
        "statusCode": 200,
        "headers": cors,
        "body": json.dumps(response_body),
    }