import os, glob

# Ищем все .py файлы в текущей папке и подпапках
for root, dirs, files in os.walk('.'):
    for f in files:
        if f.endswith('.py'):
            path = os.path.join(root, f)
            try:
                content = open(path, encoding='utf-8', errors='ignore').read()
                if 'openOrder' in content or 'buyV2' in content or 'place_order' in content:
                    print(f'\n=== {path} ===')
                    for i, line in enumerate(content.split('\n')):
                        if any(k in line for k in ['openOrder', 'buyV2', 'place_order', 'send(', 'buy']):
                            print(f'  {i+1}: {line.strip()[:120]}')
            except:
                pass
