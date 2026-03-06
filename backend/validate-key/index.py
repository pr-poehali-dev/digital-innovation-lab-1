import json
import os
import psycopg2


def handler(event: dict, context) -> dict:
    """Валидация ключа доступа пользователя"""
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': {'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type', 'Access-Control-Max-Age': '86400'}, 'body': ''}

    body = json.loads(event.get('body') or '{}')
    key = (body.get('key') or '').strip().upper()

    if not key:
        return {'statusCode': 400, 'headers': {'Access-Control-Allow-Origin': '*'}, 'body': {'valid': False, 'error': 'Ключ не указан'}}

    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor()
    cur.execute("SELECT id, is_active FROM access_keys WHERE key = '%s'" % key)
    row = cur.fetchone()
    conn.close()

    if not row:
        return {'statusCode': 200, 'headers': {'Access-Control-Allow-Origin': '*'}, 'body': {'valid': False, 'error': 'Ключ не найден'}}

    if not row[1]:
        return {'statusCode': 200, 'headers': {'Access-Control-Allow-Origin': '*'}, 'body': {'valid': False, 'error': 'Ключ деактивирован'}}

    return {'statusCode': 200, 'headers': {'Access-Control-Allow-Origin': '*'}, 'body': {'valid': True}}
