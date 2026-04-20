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

    # ждём баланс
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

    # пробуем ВСЕ известные форматы по очереди
    formats = [
        # формат 1 — наш текущий
        ['openOrder', {'asset': '#EURUSD_otc', 'amount': 1, 'command': 0, 'time': 60, 'isDemo': 1, 'requestId': 'test1'}],
        # формат 2 — action вместо command
        ['openOrder', {'asset': '#EURUSD_otc', 'amount': 1, 'action': 'call', 'time': 60, 'isDemo': 1}],
        # формат 3 — direction строкой
        ['openOrder', {'asset': '#EURUSD_otc', 'amount': 1, 'direction': 'call', 'time': 60, 'isDemo': 1}],
        # формат 4 — buyV2
        ['buyV2', {'asset': '#EURUSD_otc', 'amount': 1, 'command': 0, 'time': 60, 'isDemo': 1}],
        # формат 5 — без #
        ['openOrder', {'asset': 'EURUSD_otc', 'amount': 1, 'command': 0, 'time': 60, 'isDemo': 1}],
        # формат 6 — с tournamentId и price
        ['openOrder', {'asset': '#EURUSD_otc', 'amount': 1, 'command': 0, 'time': 60, 'isDemo': 1, 'tournamentId': 0, 'price': 0}],
    ]

    for fmt in formats:
        msg = '42' + json.dumps(fmt)
        print(f'\nTRYING [{fmt[0]}]: {msg[:120]}')
        await ws.send(msg)
        deadline2 = time.time() + 5
        got_resp = False
        while time.time() < deadline2:
            try:
                m = await asyncio.wait_for(ws.recv(), timeout=2)
                if m == '2':
                    await ws.send('3')
                    continue
                txt = m.decode() if isinstance(m, bytes) else m
                print(f'  RESP: {txt[:250]}')
                got_resp = True
            except asyncio.TimeoutError:
                break
        if not got_resp:
            print(f'  (нет ответа)')

    await ws.close()

asyncio.run(test())
