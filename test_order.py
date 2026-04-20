import asyncio, websockets, json, time

async def test():
    url = 'wss://demo-api-eu.po.market/socket.io/?EIO=4&transport=websocket'
    headers = {'Origin': 'https://pocketoption.com'}
    sid = '42["auth",{"session":"sr9kblg2dpov6ujkcrjcia42li","isDemo":1,"uid":108599173,"platform":2,"isFastHistory":true,"isOptimized":true}]'
    ws = await websockets.connect(url, additional_headers=headers, ping_interval=None)
    m = await ws.recv(); print('EIO:', m[:80])
    await ws.send('40')
    for _ in range(5):
        m = await asyncio.wait_for(ws.recv(), timeout=5)
        print('NS:', m[:80] if isinstance(m,str) else m[:80])
        if isinstance(m,str) and m.startswith('40'): break
    await ws.send(sid)
    print('AUTH sent')
    deadline = time.time() + 20
    authed = False
    while time.time() < deadline:
        try:
            m = await asyncio.wait_for(ws.recv(), timeout=3)
            if isinstance(m, bytes):
                txt = m.decode()
                print('BYTES:', txt[:150])
                if 'balance' in txt: authed = True
            else:
                if m == '2': await ws.send('3')
                print('STR:', m[:150])
        except asyncio.TimeoutError:
            if authed: break
    print('--- AUTHED:', authed, '---')
    if authed:
        req = json.dumps(['openOrder', {'asset': '#EURUSD_otc', 'amount': 1, 'command': 0, 'time': 60, 'isDemo': 1, 'requestId': 'test1'}])
        await ws.send('42' + req)
        print('ORDER SENT')
        deadline2 = time.time() + 10
        while time.time() < deadline2:
            try:
                m = await asyncio.wait_for(ws.recv(), timeout=3)
                print('RESP:', m[:300] if isinstance(m,str) else m.decode()[:300])
                if m == '2': await ws.send('3')
            except asyncio.TimeoutError: pass
    await ws.close()

asyncio.run(test())
