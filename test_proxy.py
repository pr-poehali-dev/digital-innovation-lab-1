"""
WebSocket proxy - перехватывает ВСЕ сообщения между браузером и сервером.
Запусти, потом в браузере открой: http://localhost:8765
"""
import asyncio
import websockets
import json
import time

TARGET = "wss://demo-api-eu.po.market/socket.io/?EIO=4&transport=websocket"
HEADERS = {
    "Origin": "https://pocketoption.com",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
}

SID = '42["auth",{"session":"sr9kblg2dpov6ujkcrjcia42li","isDemo":1,"uid":108599173,"platform":2,"isFastHistory":true,"isOptimized":true}]'

async def test():
    print("Подключаюсь к серверу...")
    ws = await websockets.connect(TARGET, additional_headers=HEADERS, ping_interval=None)
    await ws.recv()
    await ws.send("40")
    for _ in range(5):
        m = await asyncio.wait_for(ws.recv(), timeout=5)
        if isinstance(m, str) and m.startswith("40"):
            break
    await ws.send(SID)
    print("Авторизован. Жду баланс...")

    authed = False
    deadline = time.time() + 20
    while time.time() < deadline:
        try:
            m = await asyncio.wait_for(ws.recv(), timeout=3)
            if isinstance(m, bytes) and b"balance" in m:
                bal = json.loads(m.decode())
                print(f"Баланс: {bal}")
                authed = True
        except asyncio.TimeoutError:
            if authed:
                break

    if not authed:
        print("Не авторизован!")
        return

    print("\nПробую разные варианты openOrder...\n")

    # Пробуем без # в активе
    variants = [
        {"asset": "EURUSD",     "amount": 1, "action": "call", "isDemo": 1, "requestId": "buy", "optionType": 100, "time": 60},
        {"asset": "EURUSD",     "amount": 1, "action": "call", "isDemo": 1, "requestId": "buy", "optionType": 100, "time": 60, "tournamentId": 0},
        {"asset": "#EURUSD",    "amount": 1, "action": "call", "isDemo": 1, "requestId": "buy", "optionType": 100, "time": 60},
        {"asset": "EURUSD_otc", "amount": 1, "action": "call", "isDemo": 1, "requestId": "buy", "optionType": 100, "time": 60},
        # без optionType
        {"asset": "EURUSD",     "amount": 1, "action": "call", "isDemo": 1, "requestId": "buy", "time": 60},
        # с другим optionType
        {"asset": "EURUSD",     "amount": 1, "action": "call", "isDemo": 1, "requestId": "buy", "optionType": 1,   "time": 60},
        # amount как строка
        {"asset": "EURUSD",     "amount": "1","action": "call", "isDemo": 1, "requestId": "buy", "optionType": 100,"time": 60},
    ]

    for v in variants:
        msg = "42" + json.dumps(["openOrder", v])
        print(f"SEND: {msg}")
        await ws.send(msg)
        deadline2 = time.time() + 4
        got = False
        while time.time() < deadline2:
            try:
                m = await asyncio.wait_for(ws.recv(), timeout=2)
                if isinstance(m, str) and m == "2":
                    await ws.send("3")
                    continue
                txt = m.decode() if isinstance(m, bytes) else m
                print(f"RECV: {txt[:300]}")
                got = True
                if "success" in txt.lower() or "fail" in txt.lower():
                    break
            except asyncio.TimeoutError:
                break
        if not got:
            print("(нет ответа)")
        print()
        await asyncio.sleep(1)

    await ws.close()

asyncio.run(test())
