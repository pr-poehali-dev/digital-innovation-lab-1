import urllib.request
import json
import random


def handler(event: dict, context) -> dict:
    """Получить свежие SOCKS5 прокси с публичного GitHub-репозитория"""
    if event.get('httpMethod') == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }

    url = 'https://raw.githubusercontent.com/TheSpeedX/PROXY-List/master/socks5.txt'
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req, timeout=10) as resp:
        text = resp.read().decode('utf-8')

    lines = [l.strip() for l in text.splitlines() if l.strip() and ':' in l]
    sample = random.sample(lines, min(20, len(lines)))
    proxies = [f"socks5://{p}" for p in sample[:20]]

    return {
        'statusCode': 200,
        'headers': {'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'proxies': proxies})
    }
