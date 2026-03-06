import json
import os
import urllib.request
import urllib.error


def handler(event: dict, context) -> dict:
    """Создание платёжной ссылки через Lava.top API v2"""
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

    api_key = os.environ.get('LAVA_SECRET_KEY', '')
    offer_id = os.environ.get('LAVA_SHOP_ID', '')

    if not api_key or not offer_id:
        return {'statusCode': 500, 'headers': headers, 'body': json.dumps({'error': 'Lava not configured'})}

    body = json.loads(event.get('body') or '{}')
    email = body.get('email', '[email protected]')

    payload = {
        'email': email,
        'offerId': offer_id,
        'currency': 'RUB',
        'buyerLanguage': 'RU',
    }

    body_str = json.dumps(payload, ensure_ascii=False)

    req = urllib.request.Request(
        'https://gate.lava.top/api/v2/invoice',
        data=body_str.encode('utf-8'),
        headers={
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'X-Api-Key': api_key,
        },
        method='POST',
    )

    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            result = json.loads(resp.read().decode())
    except urllib.error.HTTPError as e:
        error_body = e.read().decode()
        return {'statusCode': 502, 'headers': headers, 'body': json.dumps({'error': f'Lava API error {e.code}', 'detail': error_body})}

    pay_url = result.get('paymentUrl', '')

    return {
        'statusCode': 200,
        'headers': headers,
        'body': json.dumps({'url': pay_url}),
    }