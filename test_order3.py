import asyncio, websockets, json, time

async def test():
    url = 'wss://demo-api-eu.po.market/socket.io/?EIO=4&transport=websocket'
    headers = {'Origin': 'https://pocketoption.com'}
    sid = '42["auth",{"session":"sr9kblg2dpov6ujkcrjcia42li","isDemo":1,"uid":108599173,"platform":2,"isFastHistory":true,"isOptimized":true}]'
    ws = await websockets.connect(url, additional_headers=headers, ping_interval=None)
    await ws.recv()
    await ws.send('40')
    for _ in range(5):
        m = await asyncio.wait_for(ws.recv(), timeout=5)
        if isinstance(m,str) and m.startswith('40'): break

    await ws.send(sid)
    authed = False
    deadline = time.time() + 20
    while time.time() < deadline:
        try:
            m = await asyncio.wait_for(ws.recv(), timeout=3)
            if isinstance(m, bytes) and b'balance' in m:
                authed = True
        except asyncio.TimeoutError:
            if authed: break

    print('--- AUTHED:', authed, '---')
    if not authed:
        return

    payload = {'asset': '#EURUSD_otc', 'amount': 1, 'command': 0, 'time': 60, 'isDemo': 1, 'requestId': 'test1'}
    payload_bytes = json.dumps(payload).encode()

    formats = [
        # binary event: 451-["openOrder",{"_placeholder":true,"num":0}] + bytes payload
        ('BINARY openOrder', '451-' + json.dumps(['openOrder', {'_placeholder': True, 'num': 0}]), payload_bytes),
        ('BINARY buyV2',     '451-' + json.dumps(['buyV2',     {'_placeholder': True, 'num': 0}]), payload_bytes),
        # обычный но с другим полем amount -> price
        ('42 openOrder v2',  '42' + json.dumps(['openOrder', {'asset': '#EURUSD_otc', 'price': 1, 'command': 0, 'time': 60, 'isDemo': 1}]), None),
        # amount как строка
        ('42 amount str',    '42' + json.dumps(['openOrder', {'asset': '#EURUSD_otc', 'amount': '1', 'command': 0, 'time': 60, 'isDemo': 1}]), None),
    ]

    for name, msg, extra in formats:
        print(f'\nTRYING [{name}]: {msg[:120]}')
        await ws.send(msg)
        if extra is not None:
            await ws.send(extra)
            print(f'  + bytes: {extra[:80]}')
        deadline2 = time.time() + 5
        got = False
        while time.time() < deadline2:
            try:
                m = await asyncio.wait_for(ws.recv(), timeout=2)
                if isinstance(m, str) and m == '2':
                    await ws.send('3')
                    continue
                txt = m.decode() if isinstance(m, bytes) else m
                print(f'  RESP: {txt[:250]}')
                got = True
            except asyncio.TimeoutError:
                break
        if not got:
            print(f'  (нет ответа)')

    await ws.close()

asyncio.run(test())
