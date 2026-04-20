path = r'.\pocketoptionapi_async\client.py'
lines = open(path, encoding='utf-8', errors='ignore').read().split('\n')
for i, line in enumerate(lines):
    if 390 <= i+1 <= 450:
        print(f'{i+1}: {line}')
print('\n--- строка 837 ---')
for i, line in enumerate(lines):
    if 825 <= i+1 <= 855:
        print(f'{i+1}: {line}')
