import json
import os
import hashlib
import hmac
import secrets
import string
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import psycopg2


def generate_key(length=16):
    alphabet = string.ascii_uppercase + string.digits
    return ''.join(secrets.choice(alphabet) for _ in range(length))


def verify_signature(body_raw: str, secret: str, signature: str) -> bool:
    """Верификация подписи от Lava.top"""
    expected = hmac.new(secret.encode('utf-8'), body_raw.encode('utf-8'), hashlib.sha256).hexdigest()
    return expected == signature


def send_key_email(to_email: str, key: str):
    """Отправка ключа доступа покупателю на email"""
    smtp_host = os.environ.get('SMTP_HOST', 'smtp.gmail.com')
    smtp_user = os.environ.get('SMTP_USER', '')
    smtp_password = os.environ.get('SMTP_PASSWORD', '')

    if not smtp_user or not smtp_password or not to_email:
        return

    msg = MIMEMultipart('alternative')
    msg['Subject'] = 'Ваш ключ доступа'
    msg['From'] = smtp_user
    msg['To'] = to_email

    html = f"""
    <html>
    <body style="font-family: Arial, sans-serif; background: #0a0a0a; padding: 40px 20px;">
      <div style="max-width: 500px; margin: 0 auto;">
        <div style="text-align: center; margin-bottom: 32px;">
          <span style="font-size: 28px; font-weight: 900; color: #fff; letter-spacing: 2px;">TRADE<span style="color: #ef4444;">BASE</span></span>
        </div>
        <div style="background: #18181b; border-radius: 16px; padding: 40px; border: 1px solid #27272a;">
          <div style="width: 48px; height: 48px; background: rgba(239,68,68,0.15); border-radius: 12px; display: flex; align-items: center; justify-content: center; margin-bottom: 24px;">
            <span style="font-size: 24px;">✅</span>
          </div>
          <h2 style="color: #fff; margin: 0 0 8px 0; font-size: 22px;">Оплата прошла успешно!</h2>
          <p style="color: #a1a1aa; margin: 0 0 28px 0; font-size: 15px;">Спасибо за покупку. Вот твой ключ доступа к платформе:</p>
          <div style="background: #09090b; border: 1px solid #3f3f46; border-radius: 12px; padding: 24px; text-align: center; margin-bottom: 28px;">
            <p style="color: #71717a; font-size: 11px; text-transform: uppercase; letter-spacing: 2px; margin: 0 0 10px 0;">Ключ доступа</p>
            <span style="font-family: monospace; font-size: 24px; font-weight: bold; letter-spacing: 4px; color: #ef4444;">{key}</span>
          </div>
          <div style="background: rgba(239,68,68,0.08); border-left: 3px solid #ef4444; border-radius: 4px; padding: 14px 16px; margin-bottom: 28px;">
            <p style="color: #fca5a5; font-size: 13px; margin: 0;">Перейди на сайт → нажми <strong>«Получить доступ»</strong> → введи этот ключ</p>
          </div>
          <div style="border-top: 1px solid #27272a; padding-top: 20px;">
            <p style="color: #52525b; font-size: 12px; margin: 0;">Храни ключ в надёжном месте — он даёт постоянный доступ к платформе без дополнительной оплаты.</p>
          </div>
        </div>
        <p style="color: #3f3f46; font-size: 12px; text-align: center; margin-top: 24px;">© 2026 TradeBase · Если есть вопросы — ответь на это письмо</p>
      </div>
    </body>
    </html>
    """

    msg.attach(MIMEText(html, 'html'))

    with smtplib.SMTP_SSL(smtp_host, 465) as server:
        server.login(smtp_user, smtp_password)
        server.sendmail(smtp_user, to_email, msg.as_string())


def handler(event: dict, context) -> dict:
    """Webhook от Lava.top — получение уведомления об успешной оплате, выдача ключа и отправка на email"""
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': {'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type', 'Access-Control-Max-Age': '86400'}, 'body': ''}

    body_raw = event.get('body') or '{}'
    body = json.loads(body_raw)

    headers = {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'}

    secret = os.environ.get('LAVA_SECRET_KEY', '')
    signature = (event.get('headers') or {}).get('x-signature', '')
    if secret and signature and not verify_signature(body_raw, secret, signature):
        return {'statusCode': 403, 'headers': headers, 'body': json.dumps({'error': 'Invalid signature'})}

    # Lava.top формат: {"status": "success", "buyerEmail": "...", "contractId": "..."}
    status = body.get('status')
    if status != 'success':
        return {'statusCode': 200, 'headers': headers, 'body': json.dumps({'ok': True, 'message': 'Not a success event'})}

    order_id = body.get('contractId', '') or body.get('orderId', '') or body.get('order_id', '')
    email = body.get('buyerEmail', '') or body.get('email', '') or body.get('buyer_email', '')

    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor()

    cur.execute("SELECT id FROM access_keys WHERE lava_order_id = '%s'" % order_id)
    existing = cur.fetchone()
    if existing:
        conn.close()
        return {'statusCode': 200, 'headers': headers, 'body': json.dumps({'ok': True, 'message': 'Already processed'})}

    new_key = generate_key()
    cur.execute(
        "INSERT INTO access_keys (key, email, lava_order_id) VALUES ('%s', '%s', '%s')" % (new_key, email, order_id)
    )
    conn.commit()
    conn.close()

    send_key_email(email, new_key)

    return {'statusCode': 200, 'headers': headers, 'body': json.dumps({'ok': True, 'key': new_key})}