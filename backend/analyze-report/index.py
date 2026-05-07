"""
Business: Анализирует JSONL-отчёт бота — считает WR, ROI, пипсы хеджей, даёт рекомендации
Args: event с httpMethod=POST и body={content: "<jsonl text>"}
Returns: HTTP с детальным анализом (метрики + рекомендации)
"""
import json
from datetime import datetime
from collections import defaultdict


def handler(event: dict, context) -> dict:
    method = event.get('httpMethod', 'GET')
    cors = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Max-Age': '86400',
    }
    if method == 'OPTIONS':
        return {'statusCode': 200, 'headers': cors, 'body': ''}

    if method != 'POST':
        return {'statusCode': 405, 'headers': cors, 'body': json.dumps({'error': 'Use POST'})}

    try:
        body = json.loads(event.get('body') or '{}')
        content = body.get('content', '')
        if not content:
            return {'statusCode': 400, 'headers': cors, 'body': json.dumps({'error': 'No content'})}

        trades, cascades, hedges, errors = [], [], [], []
        bots = set()
        assets = set()
        for line in content.split('\n'):
            line = line.strip()
            if not line:
                continue
            try:
                e = json.loads(line)
                t = e.get('type')
                bots.add(e.get('bot', '?'))
                assets.add(e.get('asset', '?'))
                if t == 'trade':
                    trades.append(e)
                elif t == 'cascade_summary':
                    cascades.append(e)
                elif t == 'hedge_open':
                    hedges.append(e)
                elif t == 'strategy_error':
                    errors.append(e)
            except Exception:
                continue

        if not trades and not cascades:
            return {
                'statusCode': 200,
                'headers': {**cors, 'Content-Type': 'application/json'},
                'body': json.dumps({'error': 'Файл пуст или формат не распознан'}, ensure_ascii=False),
            }

        tcount = len(trades)
        twins = sum(1 for t in trades if t.get('main_won'))
        twr = round(twins / tcount * 100, 1) if tcount else 0
        tpnl = round(sum(t.get('total_pnl', 0) for t in trades), 2)
        avg_roi = round(sum(t.get('total_roi_pct', 0) for t in trades) / tcount, 1) if tcount else 0

        best_trade = max(trades, key=lambda x: x.get('total_pnl', 0)) if trades else None
        worst_trade = min(trades, key=lambda x: x.get('total_pnl', 0)) if trades else None

        by_hour = defaultdict(lambda: {'count': 0, 'wins': 0, 'pnl': 0.0})
        for t in trades:
            try:
                hour = datetime.fromisoformat(t['ts']).hour
                by_hour[hour]['count'] += 1
                if t.get('main_won'):
                    by_hour[hour]['wins'] += 1
                by_hour[hour]['pnl'] += t.get('total_pnl', 0)
            except Exception:
                pass
        hours_chart = []
        for h in sorted(by_hour.keys()):
            d = by_hour[h]
            wr_h = round(d['wins'] / d['count'] * 100, 1) if d['count'] else 0
            hours_chart.append({
                'hour': f"{h:02d}:00",
                'count': d['count'],
                'wins': d['wins'],
                'wr': wr_h,
                'pnl': round(d['pnl'], 2),
            })

        with_cascade = [t for t in trades if t.get('cascade_used')]
        without_cascade = [t for t in trades if not t.get('cascade_used')]

        def stats_block(arr):
            if not arr:
                return {'count': 0, 'wr': 0, 'pnl': 0, 'avg_roi': 0}
            wins = sum(1 for x in arr if x.get('main_won'))
            return {
                'count': len(arr),
                'wr': round(wins / len(arr) * 100, 1),
                'pnl': round(sum(x.get('total_pnl', 0) for x in arr), 2),
                'avg_roi': round(sum(x.get('total_roi_pct', 0) for x in arr) / len(arr), 1),
            }

        cmp_cascade = {'with': stats_block(with_cascade), 'without': stats_block(without_cascade)}

        ccount = len(cascades)
        c_profitable = sum(1 for c in cascades if c.get('total_pnl', 0) > 0)
        c_pnl = round(sum(c.get('total_pnl', 0) for c in cascades), 2)
        c_total_bet = round(sum(c.get('total_bet', 0) for c in cascades), 2)
        c_total_roi = round(c_pnl / c_total_bet * 100, 1) if c_total_bet else 0
        c_total_hedges = sum(c.get('hedges_count', 0) for c in cascades)
        c_wins = sum(c.get('wins', 0) for c in cascades)
        c_losses = sum(c.get('losses', 0) for c in cascades)
        c_wr = round(c_wins / (c_wins + c_losses) * 100, 1) if (c_wins + c_losses) else 0

        h2 = [h for h in hedges if h.get('level') == 'H2']
        h3 = [h for h in hedges if h.get('level') == 'H3']

        def hedge_stats(arr):
            if not arr:
                return None
            return {
                'count': len(arr),
                'avg_pips': round(sum(x.get('pips_from_strike', 0) for x in arr) / len(arr), 1),
                'min_pips': round(min(x.get('pips_from_strike', 0) for x in arr), 1),
                'max_pips': round(max(x.get('pips_from_strike', 0) for x in arr), 1),
                'avg_pct': round(sum(abs(x.get('pct_move_from_strike', 0)) for x in arr) / len(arr), 4),
                'avg_pullback': round(sum(x.get('pips_pullback_from_peak', 0) for x in arr) / len(arr), 1),
                'avg_time_pct': round(sum(x.get('time_elapsed_pct', 0) for x in arr) / len(arr), 1),
                'avg_multiplier': round(sum(x.get('multiplier', 0) for x in arr) / len(arr), 2),
            }

        pip_buckets = defaultdict(int)
        for h in h2:
            p = h.get('pips_from_strike', 0)
            bucket = int(p // 1)
            pip_buckets[bucket] += 1
        pip_distribution = [{'pips': f"{k}-{k+1}", 'count': v} for k, v in sorted(pip_buckets.items())]

        recs = []
        if cmp_cascade['with']['count'] >= 3 and cmp_cascade['without']['count'] >= 3:
            wd = cmp_cascade['with']
            wod = cmp_cascade['without']
            if wd['avg_roi'] > wod['avg_roi'] + 5:
                recs.append({'type': 'positive', 'icon': '🛡', 'title': 'Каскадное хеджирование работает!',
                    'detail': f"С каскадом ROI {wd['avg_roi']}% vs без него {wod['avg_roi']}% — разница +{round(wd['avg_roi']-wod['avg_roi'],1)} п.п. на {wd['count']} сделках."})
            elif wod['avg_roi'] > wd['avg_roi'] + 5:
                recs.append({'type': 'warning', 'icon': '⚠️', 'title': 'Каскад снижает прибыль',
                    'detail': f"Без каскада ROI {wod['avg_roi']}% vs с каскадом {wd['avg_roi']}%. Возможно стоит уменьшить множители M2/M3 или подкрутить триггер."})

        if h2 and len(h2) >= 5:
            avg_p = sum(x.get('pips_from_strike', 0) for x in h2) / len(h2)
            if c_profitable / max(ccount, 1) > 0.55:
                recs.append({'type': 'info', 'icon': '📐', 'title': f'Оптимальная зона H2: {round(avg_p, 1)} пип',
                    'detail': f"На {len(h2)} срабатываниях средняя дистанция {round(avg_p,1)} пип от страйка даёт прибыль в {round(c_profitable/ccount*100,1)}% случаев."})

        if hours_chart:
            best_hour = max(hours_chart, key=lambda x: x['pnl'])
            worst_hour = min(hours_chart, key=lambda x: x['pnl'])
            if best_hour['pnl'] > 0 and best_hour['count'] >= 2:
                recs.append({'type': 'info', 'icon': '⏰', 'title': f"Лучший час: {best_hour['hour']}",
                    'detail': f"P&L {best_hour['pnl']:+.2f} за {best_hour['count']} сделок (WR {best_hour['wr']}%)."})
            if worst_hour['pnl'] < -1 and worst_hour['count'] >= 2:
                recs.append({'type': 'warning', 'icon': '🌙', 'title': f"Худший час: {worst_hour['hour']}",
                    'detail': f"P&L {worst_hour['pnl']:+.2f} за {worst_hour['count']} сделок. Возможно стоит исключить это время."})

        if tcount >= 5:
            if twr < 50:
                recs.append({'type': 'warning', 'icon': '📉', 'title': f'Низкий WR: {twr}%',
                    'detail': f'Из {tcount} сделок выиграно {twins}. Стоит пересмотреть стратегии или порог сигнала.'})
            elif twr >= 65:
                recs.append({'type': 'positive', 'icon': '🔥', 'title': f'Отличный WR: {twr}%',
                    'detail': f'Из {tcount} сделок выиграно {twins} — стратегия работает!'})

        if h2 and h3 and len(h2) >= 3:
            avg_m2 = sum(x.get('multiplier', 0) for x in h2) / len(h2)
            avg_m3 = sum(x.get('multiplier', 0) for x in h3) / len(h3)
            if c_pnl < 0 and avg_m2 > 1.3:
                recs.append({'type': 'warning', 'icon': '⚖️', 'title': 'Каскад в минусе при больших множителях',
                    'detail': f"M2={round(avg_m2,2)}, M3={round(avg_m3,2)}, итог {c_pnl}. Попробуй уменьшить M2 до 1.0-1.2."})

        if errors:
            err_count = defaultdict(int)
            for e in errors:
                err_count[e.get('strategy', '?')] += 1
            for strat, cnt in err_count.items():
                recs.append({'type': 'warning', 'icon': '🐛', 'title': f'Ошибки в стратегии {strat}',
                    'detail': f'Зафиксировано {cnt} сбоев. Проверь параметры или временно отключи.'})

        result = {
            'meta': {
                'bots': sorted(bots), 'assets': sorted(assets),
                'date_from': trades[0]['ts'] if trades else None,
                'date_to': trades[-1]['ts'] if trades else None,
            },
            'summary': {
                'trades_total': tcount, 'trades_wins': twins, 'trades_losses': tcount - twins,
                'win_rate_pct': twr, 'total_pnl': tpnl, 'avg_roi_pct': avg_roi,
                'best_trade': {'pnl': round(best_trade['total_pnl'], 2), 'roi': best_trade.get('total_roi_pct', 0), 'time': best_trade['ts']} if best_trade else None,
                'worst_trade': {'pnl': round(worst_trade['total_pnl'], 2), 'roi': worst_trade.get('total_roi_pct', 0), 'time': worst_trade['ts']} if worst_trade else None,
            },
            'cascades': {
                'count': ccount, 'profitable_count': c_profitable,
                'profitable_pct': round(c_profitable / ccount * 100, 1) if ccount else 0,
                'total_pnl': c_pnl, 'total_bet': c_total_bet, 'total_roi_pct': c_total_roi,
                'hedges_total': c_total_hedges, 'hedges_wins': c_wins, 'hedges_losses': c_losses, 'hedges_wr_pct': c_wr,
            },
            'hedges': {
                'h2': hedge_stats(h2), 'h3': hedge_stats(h3),
                'pip_distribution': pip_distribution,
            },
            'comparison': cmp_cascade,
            'hours': hours_chart,
            'recommendations': recs,
            'errors_count': len(errors),
        }

        return {
            'statusCode': 200,
            'headers': {**cors, 'Content-Type': 'application/json'},
            'body': json.dumps(result, ensure_ascii=False, default=str),
            'isBase64Encoded': False,
        }

    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {**cors, 'Content-Type': 'application/json'},
            'body': json.dumps({'error': str(e)}, ensure_ascii=False),
        }
