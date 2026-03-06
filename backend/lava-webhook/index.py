import json
import os
import hashlib
import secrets
import string
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import psycopg2


def generate_key(length=16):
    alphabet = string.ascii_uppercase + string.digits
    return ''.join(secrets.choice(alphabet) for _ in range(length))


def verify_signature(data: dict, secret: str) -> bool:
    """Верификация подписи от Lava.ru"""
    sign = data.get('sign', '')
    fields = [
        str(data.get('invoice_id', '')),
        str(data.get('order_id', '')),
        str(data.get('status', '')),
        str(data.get('amount', '')),
        str(data.get('credited', '')),
        str(data.get('shop_id', '')),
    ]
    sign_str = ':'.join(fields) + secret
    expected = hashlib.sha256(sign_str.encode()).hexdigest()
    return sign == expected


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
    <body style="font-family: Arial, sans-serif; background: #f5f5f5; padding: 20px;">
      <div style="max-width: 480px; margin: 0 auto; background: #fff; border-radius: 16px; padding: 40px; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
        <h2 style="color: #111; margin-bottom: 8px;">Оплата прошла успешно!</h2>
        <p style="color: #555; margin-bottom: 24px;">Спасибо за покупку. Вот ваш ключ доступа:</p>
        <div style="background: #f0f0f0; border-radius: 10px; padding: 20px; text-align: center; margin-bottom: 24px;">
          <span style="font-family: monospace; font-size: 22px; font-weight: bold; letter-spacing: 3px; color: #111;">{key}</span>
        </div>
        <p style="color: #555; font-size: 14px; margin-bottom: 16px;">
          Перейдите на сайт, нажмите <strong>«Получить доступ»</strong> и введите этот ключ.
        </p>
        <p style="color: #aaa; font-size: 12px;">Храните ключ в надёжном месте — он даёт постоянный доступ к платформе.</p>
      </div>
    </body>
    </html>
    """

    msg.attach(MIMEText(html, 'html'))

    with smtplib.SMTP_SSL(smtp_host, 465) as server:
        server.login(smtp_user, smtp_password)
        server.sendmail(smtp_user, to_email, msg.as_string())


def handler(event: dict, context) -> dict:
    """Webhook от Lava.ru — получение уведомления об успешной оплате, выдача ключа и отправка на email"""
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': {'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type', 'Access-Control-Max-Age': '86400'}, 'body': ''}

    body = json.loads(event.get('body') or '{}')

    headers = {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'}

    secret = os.environ.get('LAVA_SECRET_KEY', '')
    if secret and not verify_signature(body, secret):
        return {'statusCode': 403, 'headers': headers, 'body': json.dumps({'error': 'Invalid signature'})}

    status = body.get('status')
    if status != 'success':
        return {'statusCode': 200, 'headers': headers, 'body': json.dumps({'ok': True, 'message': 'Not a success event'})}

    order_id = body.get('order_id', '')
    email = body.get('email', '') or body.get('buyer_email', '')

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