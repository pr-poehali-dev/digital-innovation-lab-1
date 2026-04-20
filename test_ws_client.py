path = r'.\pocketoptionapi_async\websocket_client.py'
lines = open(path, encoding='utf-8', errors='ignore').read().split('\n')
for i, line in enumerate(lines):
    if 515 <= i+1 <= 545:
        print(f'{i+1}: {line}')
print('\n--- failopenOrder ---')
for i, line in enumerate(lines):
    if 670 <= i+1 <= 700:
        print(f'{i+1}: {line}')
