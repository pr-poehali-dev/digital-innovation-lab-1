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
    print('AUTH sent. Слушаю все сообщения 60 секунд...')
    print('>>> ОТКРОЙ СДЕЛКУ ВРУЧНУЮ НА САЙТЕ pocketoption.com <<<')
    print('=' * 60)

    deadline = time.time() + 60
    while time.time() < deadline:
        try:
            m = await asyncio.wait_for(ws.recv(), timeout=2)
            if isinstance(m, str):
                if m == '2':
                    await ws.send('3')
                    continue
                print(f'[STR] {m[:300]}')
            else:
                txt = m.decode('utf-8', errors='replace')
                print(f'[BIN] {txt[:300]}')
        except asyncio.TimeoutError:
            pass

    await ws.close()

asyncio.run(test())
