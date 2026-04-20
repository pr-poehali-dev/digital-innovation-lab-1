path = r'.\pocketoptionapi_async\client.py'
lines = open(path, encoding='utf-8', errors='ignore').read().split('\n')
for i, line in enumerate(lines):
    if 830 <= i+1 <= 860:
        print(f'{i+1}: {line}')
