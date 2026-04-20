path = r'.\pocketoptionapi_async\client.py'
lines = open(path, encoding='utf-8', errors='ignore').read().split('\n')
# показываем место где формируется openOrder сообщение
for i, line in enumerate(lines):
    if 820 <= i+1 <= 870:
        print(f'{i+1}: {line}')
