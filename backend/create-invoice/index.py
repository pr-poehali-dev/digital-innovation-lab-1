import json
import os
import hashlib
import hmac
import uuid
import urllib.request
import urllib.error


def handler(event: dict, context) -> dict:
    """Создание платёжной ссылки через Lava.ru API"""
    if event.get('httpMethod') == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400',
            },
            'body': '',
        }

    headers = {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'}

    shop_id = os.environ.get('LAVA_SHOP_ID', '')
    secret_key = os.environ.get('LAVA_SECRET_KEY', '')

    if not shop_id or not secret_key:
        return {'statusCode': 500, 'headers': headers, 'body': json.dumps({'error': 'Lava not configured'})}

    order_id = str(uuid.uuid4())

    payload = {
        'shopId': shop_id,
        'sum': 2000,
        'orderId': order_id,
        'comment': 'Доступ к TradeBase',
    }

    body_str = json.dumps(payload, ensure_ascii=False)
    signature = hmac.new(secret_key.encode('utf-8'), body_str.encode('utf-8'), hashlib.sha256).hexdigest()

    req = urllib.request.Request(
        'https://api.lava.ru/business/invoice/create',
        data=body_str.encode('utf-8'),
        headers={
            'Content-Type': 'application/json',
            'Signature': signature,
            'Accept': 'application/json',
        },
        method='POST',
    )

    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            result = json.loads(resp.read().decode())
    except urllib.error.HTTPError as e:
        error_body = e.read().decode()
        return {'statusCode': 502, 'headers': headers, 'body': json.dumps({'error': f'Lava API error {e.code}', 'detail': error_body})}

    pay_url = result.get('data', {}).get('url', '')

    return {
        'statusCode': 200,
        'headers': headers,
        'body': json.dumps({'url': pay_url, 'order_id': order_id}),
    }