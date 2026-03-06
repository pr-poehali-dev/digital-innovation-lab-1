import json
import os
import hashlib
import secrets
import string
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


def handler(event: dict, context) -> dict:
    """Webhook от Lava.ru — получение уведомления об успешной оплате и выдача ключа"""
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': {'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type', 'Access-Control-Max-Age': '86400'}, 'body': ''}

    body = json.loads(event.get('body') or '{}')

    secret = os.environ.get('LAVA_SECRET_KEY', '')
    if secret and not verify_signature(body, secret):
        return {'statusCode': 403, 'headers': {'Access-Control-Allow-Origin': '*'}, 'body': {'error': 'Invalid signature'}}

    status = body.get('status')
    if status != 'success':
        return {'statusCode': 200, 'headers': {'Access-Control-Allow-Origin': '*'}, 'body': {'ok': True, 'message': 'Not a success event'}}

    order_id = body.get('order_id', '')
    email = body.get('email', '') or body.get('buyer_email', '')

    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor()

    cur.execute("SELECT id FROM access_keys WHERE lava_order_id = '%s'" % order_id)
    existing = cur.fetchone()
    if existing:
        conn.close()
        return {'statusCode': 200, 'headers': {'Access-Control-Allow-Origin': '*'}, 'body': {'ok': True, 'message': 'Already processed'}}

    new_key = generate_key()
    cur.execute(
        "INSERT INTO access_keys (key, email, lava_order_id) VALUES ('%s', '%s', '%s')" % (new_key, email, order_id)
    )
    conn.commit()
    conn.close()

    return {'statusCode': 200, 'headers': {'Access-Control-Allow-Origin': '*'}, 'body': {'ok': True, 'key': new_key}}