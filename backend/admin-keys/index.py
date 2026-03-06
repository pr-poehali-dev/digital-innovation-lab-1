import json
import os
import secrets
import string
import psycopg2


def generate_key(length=16):
    alphabet = string.ascii_uppercase + string.digits
    return ''.join(secrets.choice(alphabet) for _ in range(length))


def get_conn():
    schema = os.environ.get('MAIN_DB_SCHEMA', 'public')
    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    conn.cursor().execute(f"SET search_path TO {schema}")
    return conn


def check_auth(event: dict) -> bool:
    admin_password = os.environ.get('ADMIN_PASSWORD', '')
    if not admin_password:
        return False
    auth = event.get('headers', {}).get('X-Admin-Password', '')
    return auth == admin_password


def handler(event: dict, context) -> dict:
    """Админ-панель: список ключей доступа и генерация новых"""
    cors = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, X-Admin-Password',
        'Content-Type': 'application/json',
    }

    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': cors, 'body': ''}

    if not check_auth(event):
        return {'statusCode': 401, 'headers': cors, 'body': json.dumps({'error': 'Unauthorized'})}

    method = event.get('httpMethod', 'GET')
    conn = get_conn()
    cur = conn.cursor()

    if method == 'GET':
        cur.execute("""
            SELECT id, key, email, lava_order_id, is_active, created_at
            FROM access_keys
            ORDER BY created_at DESC
            LIMIT 200
        """)
        rows = cur.fetchall()
        conn.close()
        keys = [
            {
                'id': r[0],
                'key': r[1],
                'email': r[2] or '',
                'order_id': r[3] or '',
                'is_active': r[4],
                'created_at': r[5].isoformat() if r[5] else '',
            }
            for r in rows
        ]
        return {'statusCode': 200, 'headers': cors, 'body': json.dumps({'keys': keys})}

    if method == 'POST':
        body = json.loads(event.get('body') or '{}')
        action = body.get('action')

        if action == 'generate':
            email = body.get('email', '')
            count = min(int(body.get('count', 1)), 50)
            new_keys = []
            for _ in range(count):
                k = generate_key()
                cur.execute(
                    "INSERT INTO access_keys (key, email, lava_order_id) VALUES ('%s', '%s', 'manual') RETURNING id" % (k, email)
                )
                new_keys.append(k)
            conn.commit()
            conn.close()
            return {'statusCode': 200, 'headers': cors, 'body': json.dumps({'generated': new_keys})}

        if action == 'toggle':
            key_id = int(body.get('id', 0))
            cur.execute("UPDATE access_keys SET is_active = NOT is_active WHERE id = %d" % key_id)
            conn.commit()
            conn.close()
            return {'statusCode': 200, 'headers': cors, 'body': json.dumps({'ok': True})}

        if action == 'delete':
            key_id = int(body.get('id', 0))
            cur.execute("DELETE FROM access_keys WHERE id = %d" % key_id)
            conn.commit()
            conn.close()
            return {'statusCode': 200, 'headers': cors, 'body': json.dumps({'ok': True})}

    conn.close()
    return {'statusCode': 400, 'headers': cors, 'body': json.dumps({'error': 'Bad request'})}
