#!/usr/bin/env python3
"""
Pocket Option КОМБО-Бот + КАСКАДНЫЙ ХЕДЖ 3 уровней
"""

import asyncio
import os
import builtins as _builtins
import time as _time_mod
from datetime import datetime
from pocketoptionapi_async import AsyncPocketOptionClient, OrderDirection

_original_print = _builtins.print
def _print_with_time(*args, **kwargs):
    _ts = datetime.now().strftime("%H:%M:%S")
    _original_print(f"[{_ts}]", *args, **kwargs)
_builtins.print = _print_with_time

# ===== НАСТРОЙКИ =====
ASSET        = "EURUSD_otc"
EXPIRY_SEC   = 120
BASE_BET     = 5
BET_PERCENT  = False
IS_DEMO      = True
CURRENCY     = "USD"
TAKE_PROFIT  = 3000
STOP_LOSS    = 1500
DAILY_LIMIT  = 20
AUTO_RESTART     = False
MARTINGALE       = False

# ===== КАСКАДНЫЙ ХЕДЖ =====
CASCADE_ENABLED   = True
CASCADE_H1_MULT   = 1.0    # H1: сразу против
CASCADE_H2_MULT   = 1.5    # H2: после 50% времени, против
CASCADE_H3_MULT   = 2.0    # H3: при пересечении страйка, по основной
CASCADE_PIP_OFFSET = 3     # откат от пика в пипах
CASCADE_CHECK_SEC = 2      # проверка цены каждые N сек

SAFETY_MAX_BET_PCT     = 20
SAFETY_MIN_RESERVE_PCT = 30

CHECK_INTERVAL   = 10
TREND_MODE       = "any"
TREND_FOLLOW     = "follow"

try:
    from dotenv import load_dotenv; load_dotenv()
except ImportError:
    pass

SESSION_ID = os.environ.get("PO_SESSION_ID", "")
if not SESSION_ID:
    _env = os.path.join(os.path.dirname(os.path.abspath(__file__)), ".env")
    if os.path.exists(_env):
        with open(_env, encoding="utf-8") as _f:
            for _line in _f:
                if _line.startswith("PO_SESSION_ID="):
                    SESSION_ID = _line.split("=", 1)[1].strip().strip('"').strip("'")
                    break
if not SESSION_ID:
    print("[ERROR] Не задан PO_SESSION_ID.")
    exit(1)

print(f"[INFO] SESSION_ID загружен, длина: {len(SESSION_ID)} символов")

try:
    import re as _re
    _m = _re.search('"isDemo"[ ]*:[ ]*([0-9]+)', SESSION_ID)
    IS_DEMO = bool(int(_m.group(1))) if _m else IS_DEMO
    _u = _re.search('"uid"[ ]*:[ ]*([0-9]+)', SESSION_ID)
    _uid = _u.group(1) if _u else "неизвестен"
    print(f"[INFO] Аккаунт UID: {_uid} | Режим: {'ДЕМО' if IS_DEMO else 'РЕАЛЬНЫЙ'}")
except Exception:
    pass

# ===== TELEGRAM =====
BOT_NAME    = "1"
TG_TOKEN    = "8631657463:AAGvuSF2Anw7OBgRg_LJsX6YqW9OwEmbKz4"
TG_CHAT_ID  = "7533507918"
TG_ENABLED  = True and bool(TG_TOKEN and TG_CHAT_ID)

def _tg_send_raw(text):
    import urllib.request, json
    url = "https://functions.poehali.dev/fb70e0a6-b6c1-49e2-b148-c37dab50f024"
    payload = json.dumps({"token": TG_TOKEN, "chat_id": TG_CHAT_ID, "action": "send", "text": text}).encode()
    req = urllib.request.Request(url, data=payload, headers={"Content-Type": "application/json"}, method="POST")
    try:
        urllib.request.urlopen(req, timeout=20).read()
    except Exception as e:
        print(f"[TG] err: {e}")

def tg(text):
    if not TG_ENABLED:
        return
    import threading
    threading.Thread(target=_tg_send_raw, args=(text,), daemon=True).start()

def tg_info(text):
    tg(text)

# ===== СОСТОЯНИЕ =====
total_profit  = 0.0
trades_today  = 0
trade_log     = []
hedge_count   = 0
hedge_wins    = 0
cur_streak    = 0
current_bet   = BASE_BET
_resolved_asset = None
_last_trend = None

def adjust_bet(won, profit=0.0, bet=0.0):
    return BASE_BET

def candle_color(c):
    return "UP" if c[3] >= c[0] else "DOWN"

def get_trend(candles):
    closed = candles[:-1]
    if len(closed) < 2:
        return None
    window2 = closed[-2:]
    c2, c3 = [candle_color(c) for c in window2]
    e2 = "🟢" if c2 == "UP" else "🔴"
    e3 = "🟢" if c3 == "UP" else "🔴"
    print(f"[ТРЕНД] {e2}{e3}")
    if c2 == "UP" and c3 == "UP":
        return "UP_UP"
    if c2 == "DOWN" and c3 == "DOWN":
        return "DOWN_DOWN"
    if c2 == "DOWN" and c3 == "UP":
        return "DOWN_UP"
    if c2 == "UP" and c3 == "DOWN":
        return "UP_DOWN"
    return None

def trend_to_signal(trend):
    if trend in ("UP_UP", "DOWN_UP"):
        return "CALL"
    if trend in ("DOWN_DOWN", "UP_DOWN"):
        return "PUT"
    return None

# ===== СТРАТЕГИИ =====
PAYOUT = 0.92

def calculate_rsi(prices, period=14):
    deltas = [prices[i] - prices[i-1] for i in range(1, len(prices))]
    gains  = [d if d > 0 else 0 for d in deltas]
    losses = [-d if d < 0 else 0 for d in deltas]
    avg_gain = sum(gains[-period:]) / period
    avg_loss = sum(losses[-period:]) / period
    if avg_loss == 0:
        return 100
    return 100 - (100 / (1 + avg_gain / avg_loss))

def signal_rsi(prices, candles):
    rsi = calculate_rsi(prices)
    if rsi <= 30: return "CALL", f"RSI={rsi:.1f}≤30"
    if rsi >= 70: return "PUT", f"RSI={rsi:.1f}≥70"
    return None, f"RSI={rsi:.1f}"

def calculate_ema(prices, period):
    k = 2 / (period + 1)
    ema = [prices[0]]
    for p in prices[1:]:
        ema.append(p * k + ema[-1] * (1 - k))
    return ema

def signal_ema(prices, candles):
    if len(prices) < 23:
        return None, ""
    fast = calculate_ema(prices, 9)
    slow = calculate_ema(prices, 21)
    if fast[-1] > slow[-1] and fast[-2] <= slow[-2]: return "CALL", "EMA↑"
    if fast[-1] < slow[-1] and fast[-2] >= slow[-2]: return "PUT", "EMA↓"
    return None, ""

def signal_support_resistance(prices, candles):
    if len(prices) < 30:
        return None, ""
    return None, ""

def get_combined_signal(prices, candles):
    fns = [signal_rsi, signal_ema, signal_support_resistance]
    results = [f(prices, candles) for f in fns]
    signals = [(s, i) for s, i in results if s is not None]
    if not signals:
        return None, ""
    calls = [s for s, i in signals if s == "CALL"]
    puts  = [s for s, i in signals if s == "PUT"]
    if len(calls) > len(puts):
        return "CALL", "OR✅"
    if len(puts) > len(calls):
        return "PUT", "OR✅"
    return None, ""

# ===== ЖИВОЙ БУФЕР =====
LIVE_BUFFER_SIZE = 50
LIVE_TICK_INTERVAL = 0.5  # ⚡ опрос каждые 0.5с — точность h/l свечей x2 (раньше было 1с)

class CandleBuffer:
    def __init__(self):
        self.candles = []
        self.live = None
        self.live_bucket = None
        self.last_price = 0.0
        self.last_update = 0.0
        self.ready = False
        self.sync_warn = False

    async def warmup(self, client):
        print(f"[BUFFER] 🔥 Жду свечи которые УВИДИМ САМИ | актив={ASSET} | таймфрейм={EXPIRY_SEC}с")
        self.ready = True

    async def tick(self, client):
        try:
            raw = await client.get_candles(asset=ASSET, timeframe=EXPIRY_SEC, count=1)
            if not raw:
                return
            now = _time_mod.time()
            current = raw[-1]
            cur_price = float(current.close)
            bucket = int(now // EXPIRY_SEC) * EXPIRY_SEC
            if self.live is None or self.live_bucket is None:
                self.live_bucket = bucket
                self.live = (cur_price, cur_price, cur_price, cur_price)
                self.last_price = cur_price
                self.last_update = now
                _utc_t = datetime.utcfromtimestamp(bucket).strftime('%H:%M:%S')
                print(f"[CANDLE_BUILD] 🆕 СТАРТ ПЕРВОЙ СВЕЧИ {_utc_t} UTC | open={cur_price:.5f}")
                return
            if bucket == self.live_bucket:
                _o, _h, _l, _c = self.live
                _h = max(_h, cur_price)
                _l = min(_l, cur_price)
                _c = cur_price
                self.live = (_o, _h, _l, _c)
                self.last_price = cur_price
                self.last_update = now
                return
            closed_tup = (self.live[0], self.live[1], self.live[2], self.live[3], int(self.live_bucket))
            _is_flat = (closed_tup[0] == closed_tup[1] == closed_tup[2] == closed_tup[3])
            if _is_flat:
                print(f"[CANDLE_BUILD] 🚫 ПРОПУЩЕНА ПЛОСКАЯ СВЕЧА")
                self.live_bucket = bucket
                self.live = (cur_price, cur_price, cur_price, cur_price)
                self.last_price = cur_price
                self.last_update = now
                return
            self.candles.append(closed_tup)
            if len(self.candles) > LIVE_BUFFER_SIZE:
                self.candles = self.candles[-LIVE_BUFFER_SIZE:]
            _color = '🟢' if closed_tup[3] >= closed_tup[0] else '🔴'
            print(f"[CANDLE_BUILD] ✅ ЗАКРЫТА {_color} | o={closed_tup[0]:.5f} c={closed_tup[3]:.5f}")
            self.live_bucket = bucket
            self.live = (cur_price, cur_price, cur_price, cur_price)
            self.last_price = cur_price
            self.last_update = now
            print(f"[CANDLE_BUILD] 🆕 НОВАЯ СВЕЧА | накоплено: {len(self.candles)}")
        except Exception as e:
            print(f"[BUFFER] tick error: {e}")

    def all_candles(self):
        if self.live:
            return self.candles + [self.live]
        return list(self.candles)

    def prices(self):
        out = [c[3] for c in self.candles]
        if self.live:
            out.append(self.live[3])
        return out

async def buffer_updater(buf, client):
    while True:
        try:
            await buf.tick(client)
        except Exception as e:
            print(f"[BUFFER] err: {e}")
        await asyncio.sleep(LIVE_TICK_INTERVAL)

async def get_balance(client):
    try:
        b = await client.get_balance()
        if b is None:
            return 0.0, CURRENCY
        amount = 0.0
        if hasattr(b, "balance") and b.balance is not None:
            amount = float(b.balance)
        elif hasattr(b, "amount") and b.amount is not None:
            amount = float(b.amount)
        else:
            try: amount = float(b)
            except: pass
        return amount, CURRENCY
    except:
        return 0.0, CURRENCY

async def place_trade(client, direction, amount, duration=None):
    try:
        _dur = duration if duration else EXPIRY_SEC
        dir_val = OrderDirection.CALL if direction == "CALL" else OrderDirection.PUT
        _raw = await client.place_order(asset=ASSET, amount=amount, direction=dir_val, duration=_dur)
        _oid = getattr(_raw, 'order_id', None)
        open_price = 0.0
        for _attr in ('open_price', 'openPrice', 'open', 'price', 'strike'):
            _v = getattr(_raw, _attr, None)
            if _v:
                try:
                    open_price = float(_v)
                    break
                except: pass
        print(f"[TRADE] {direction} | {amount} | {_dur}с | ID: {_oid} | Цена: {open_price}")
        return _oid, open_price
    except Exception as e:
        print(f"[ERROR] place_trade: {e}")
        return None, 0.0

async def check_result(client, order_id, balance_before, bet, wait_sec=None):
    _wait = wait_sec if wait_sec is not None else EXPIRY_SEC
    _payout = PAYOUT
    _sleep_before_poll = max(0, _wait - 3)
    print(f"[WAIT] Ожидаем результат ~{round(_wait/60, 1)} мин...")
    if _sleep_before_poll > 0:
        await asyncio.sleep(_sleep_before_poll)
    _poll_started = _time_mod.time()
    _poll_max = 35
    try:
        while _time_mod.time() - _poll_started < _poll_max:
            try:
                deal = await client.get_deal(order_id)
                if deal is None:
                    await asyncio.sleep(1); continue
                profit_raw = getattr(deal, 'profit', None) or getattr(deal, 'win', None)
                if profit_raw is None:
                    await asyncio.sleep(1); continue
                _status = getattr(deal, 'status', None)
                _status_str = str(_status).lower() if _status is not None else ''
                if 'active' in _status_str or 'open' in _status_str:
                    await asyncio.sleep(1); continue
                profit_val = float(profit_raw)
                won = profit_val > 0
                profit = round(bet * _payout, 2) if won else round(-bet, 2)
                print(f"[RESULT] {'✅' if won else '❌'} | Профит: {profit}")
                return won, profit
            except Exception:
                await asyncio.sleep(1)
        print(f"[WARN] Таймаут — fallback по балансу")
        balance_after, _ = await get_balance(client)
        diff = round(balance_after - balance_before, 2)
        won = diff > 0
        profit = round(bet * _payout, 2) if won else round(-bet, 2)
        print(f"[WARN] Fallback: {'✅' if won else '❌'} | {profit}")
        return won, profit
    except Exception as e:
        print(f"[ERROR] check_result: {e}")
        return False, round(-bet, 2)

# ===== КАСКАДНЫЙ ХЕДЖ 3 УРОВНЕЙ =====
async def cascade_hedge(client, main_dir, main_bet, entry_price, expiry_sec, live_buf):
    """
    Каскадный хедж 3 уровней (ПАРАЛЛЕЛЬНО основной сделке):
      H1 — СРАЗУ против основной (×1)
      H2 — на 50% времени экспирации, если цена против (×1.5)
      H3 — при пересечении страйка обратно (откат 3 пипа от пика, ×2)
    """
    _pip_size_map = {
        "EURUSD": 0.0001, "EURUSD_otc": 0.0001, "GBPUSD": 0.0001, "GBPUSD_otc": 0.0001,
        "USDJPY": 0.01, "USDJPY_otc": 0.01, "GBPJPY": 0.01, "GBPJPY_otc": 0.01,
        "AUDUSD": 0.0001, "AUDUSD_otc": 0.0001, "USDCAD": 0.0001, "USDCAD_otc": 0.0001,
        "NZDUSD": 0.0001, "NZDUSD_otc": 0.0001, "USDCHF": 0.0001, "USDCHF_otc": 0.0001,
        "EURJPY": 0.01, "EURJPY_otc": 0.01, "EURGBP": 0.0001, "EURGBP_otc": 0.0001,
        "BTCUSD": 1.0, "BTCUSD_otc": 1.0, "ETHUSD": 1.0, "ETHUSD_otc": 1.0,
        "XAUUSD": 0.1, "XAUUSD_otc": 0.1,
    }
    PIP = _pip_size_map.get(ASSET, 0.0001)
    PIP_OFFSET = CASCADE_PIP_OFFSET * PIP
    opposite = "PUT" if main_dir == "CALL" else "CALL"
    print(f"[CASCADE] 🛡 СТАРТ | основная {main_dir} {main_bet} @ {entry_price:.5f}")
    tg(f"🛡 <b>[CASCADE СТАРТ]</b>\nОсновная: {main_dir} {main_bet} @ {entry_price:.5f}")

    hedge_orders = []  # (level, order_id, bet, wait_sec, balance_before)

    # ===== H1: СРАЗУ ПРОТИВ =====
    h1_bet = round(main_bet * CASCADE_H1_MULT, 2)
    try:
        bal_h1, _ = await get_balance(client)
        h1_id, _ = await place_trade(client, opposite, h1_bet, duration=expiry_sec)
        if h1_id:
            print(f"[CASCADE] H1 ✅ {opposite} ×{CASCADE_H1_MULT} = {h1_bet}")
            tg(f"🛡 <b>H1</b> {opposite} ×{CASCADE_H1_MULT} = {h1_bet}")
            hedge_orders.append(("H1", h1_id, h1_bet, expiry_sec, bal_h1))
    except Exception as e:
        print(f"[CASCADE] H1 ОШИБКА: {e}")

    # ===== Мониторим цену для H2/H3 =====
    start_t = _time_mod.time()
    h2_fired = False
    h3_fired = False
    peak_against = entry_price

    while True:
        elapsed = _time_mod.time() - start_t
        if elapsed >= expiry_sec - CASCADE_CHECK_SEC:
            break
        await asyncio.sleep(CASCADE_CHECK_SEC)
        try:
            cur_price = float(live_buf.last_price) if live_buf and live_buf.last_price > 0 else 0
            if cur_price == 0:
                continue
            went_against = (main_dir == "CALL" and cur_price < entry_price) or \
                           (main_dir == "PUT" and cur_price > entry_price)
            if went_against:
                if main_dir == "CALL":
                    peak_against = min(peak_against, cur_price)
                else:
                    peak_against = max(peak_against, cur_price)
            time_pct = elapsed / expiry_sec * 100
            against_pips = abs(cur_price - entry_price) / PIP if PIP > 0 else 0
            print(f"[CASCADE] t={time_pct:.0f}% | цена={cur_price:.5f} | Δ={against_pips:.1f}пип | против={went_against}")

            # ===== H2: 50% времени + цена против =====
            if not h2_fired and time_pct >= 50 and went_against:
                h2_bet = round(main_bet * CASCADE_H2_MULT, 2)
                remaining = max(15, int(expiry_sec - elapsed))
                try:
                    bal_h2, _ = await get_balance(client)
                    h2_id, _ = await place_trade(client, opposite, h2_bet, duration=remaining)
                    if h2_id:
                        h2_fired = True
                        print(f"[CASCADE] H2 ✅ {opposite} ×{CASCADE_H2_MULT} = {h2_bet} | t={time_pct:.0f}%")
                        tg(f"🛡 <b>H2</b> {opposite} ×{CASCADE_H2_MULT} = {h2_bet}\n(50% времени, цена против)")
                        hedge_orders.append(("H2", h2_id, h2_bet, remaining, bal_h2))
                except Exception as e:
                    print(f"[CASCADE] H2 ОШИБКА: {e}")
                    h2_fired = True

            # ===== H3: пересечение страйка (откат 3 пипа от пика обратно) =====
            if not h3_fired and went_against:
                if main_dir == "CALL":
                    crossed = cur_price >= peak_against + PIP_OFFSET
                else:
                    crossed = cur_price <= peak_against - PIP_OFFSET
                if crossed:
                    h3_bet = round(main_bet * CASCADE_H3_MULT, 2)
                    remaining = max(15, int(expiry_sec - elapsed))
                    try:
                        bal_h3, _ = await get_balance(client)
                        h3_id, _ = await place_trade(client, main_dir, h3_bet, duration=remaining)
                        if h3_id:
                            h3_fired = True
                            print(f"[CASCADE] H3 ✅ {main_dir} ×{CASCADE_H3_MULT} = {h3_bet} | пересёк страйк")
                            tg(f"🛡 <b>H3</b> {main_dir} ×{CASCADE_H3_MULT} = {h3_bet}\n(пересечение страйка, откат {CASCADE_PIP_OFFSET} пип)")
                            hedge_orders.append(("H3", h3_id, h3_bet, remaining, bal_h3))
                    except Exception as e:
                        print(f"[CASCADE] H3 ОШИБКА: {e}")
                        h3_fired = True
        except Exception as e:
            print(f"[CASCADE] LOOP ERR: {e}")

    # ===== ЖДЁМ результаты всех хеджей =====
    total_cascade_profit = 0.0
    for name, hid, hbet, hwait, hbal in hedge_orders:
        try:
            won, prof = await check_result(client, hid, hbal, hbet, wait_sec=hwait)
            total_cascade_profit += prof
            print(f"[CASCADE] {name} итог: {'✅' if won else '❌'} {prof:+.2f}")
            tg(f"🛡 <b>{name}</b> итог: {'✅' if won else '❌'} {prof:+.2f}")
        except Exception as e:
            print(f"[CASCADE] {name} check err: {e}")

    return total_cascade_profit

async def main():
    global total_profit, trades_today, current_bet, hedge_count, hedge_wins, cur_streak

    client = AsyncPocketOptionClient(SESSION_ID, is_demo=IS_DEMO, enable_logging=False)
    await client.connect()
    balance = 0.0
    for i in range(15):
        await asyncio.sleep(2)
        try:
            balance, _ = await get_balance(client)
            if balance > 0:
                break
        except Exception:
            pass
        print(f"[WAIT] Ожидание соединения... ({i+1}/15)")
    if balance == 0:
        print("[ERROR] Не удалось подключиться")
        return

    account_type = "🟡 ДЕМО-СЧЁТ" if IS_DEMO else "🔴 РЕАЛЬНЫЙ СЧЁТ"
    print("=" * 55)
    print(f"  КОМБО-Бот + КАСКАДНЫЙ ХЕДЖ 3 уровней")
    print(f"  Счёт: {account_type} | Баланс: {balance:.2f} {CURRENCY}")
    print(f"  Актив: {ASSET} | Экспирация: {EXPIRY_SEC//60} мин")
    print(f"  TP: {TAKE_PROFIT} | SL: {STOP_LOSS} | Лимит: {DAILY_LIMIT}")
    print("=" * 55)
    print(f"  🛡 КАСКАДНЫЙ ХЕДЖ: ✅ ВКЛЮЧЁН")
    print(f"     H1 (сразу, против): ×{CASCADE_H1_MULT}")
    print(f"     H2 (50% времени, против): ×{CASCADE_H2_MULT}")
    print(f"     H3 (пересеч. страйка, по основной): ×{CASCADE_H3_MULT}")
    print(f"     Откат от пика: {CASCADE_PIP_OFFSET} пип | Проверка: {CASCADE_CHECK_SEC}с")
    _max_sum = 1 + CASCADE_H1_MULT + CASCADE_H2_MULT + CASCADE_H3_MULT
    print(f"     Макс сумма на сигнал: {_max_sum:.1f}X = {round(BASE_BET * _max_sum, 2)} {CURRENCY}")
    print("=" * 55)

    tg(
        f"🤖 <b>{BOT_NAME} запущен + КАСКАД</b>\n"
        f"━━━━━━━━━━━━━━━━━━━━\n"
        f"Баланс: <b>{balance:.2f} {CURRENCY}</b>\n"
        f"Актив: <b>{ASSET}</b>\n"
        f"Экспирация: <b>{EXPIRY_SEC//60} мин</b>\n"
        f"Ставка: <b>{BASE_BET} {CURRENCY}</b>\n"
        f"━━━━━━━━━━━━━━━━━━━━\n"
        f"🛡 <b>Каскадный хедж: ВКЛ</b>\n"
        f"H1 ×{CASCADE_H1_MULT} | H2 ×{CASCADE_H2_MULT} | H3 ×{CASCADE_H3_MULT}\n"
        f"Макс сумма: {_max_sum:.1f}X = {round(BASE_BET * _max_sum, 2)} {CURRENCY}"
    )

    _live_buf = CandleBuffer()
    await _live_buf.warmup(client)
    _buf_task = asyncio.create_task(buffer_updater(_live_buf, client))
    print(f"[BUFFER] 🚀 Живой буфер запущен")

    while True:
        if total_profit >= TAKE_PROFIT:
            print(f"[TP] +{total_profit:.2f}")
            tg(f"✅ <b>TP достигнут!</b> +{total_profit:.2f} {CURRENCY}")
            break
        if total_profit <= -STOP_LOSS:
            print(f"[SL] {total_profit:.2f}")
            tg(f"🛑 <b>SL достигнут!</b> {total_profit:.2f} {CURRENCY}")
            break
        if trades_today >= DAILY_LIMIT:
            print(f"[LIMIT] Лимит сделок")
            break

        await asyncio.sleep(1)
        if not _live_buf.ready or len(_live_buf.candles) < 2:
            _have = len(_live_buf.candles)
            _now_ts = _time_mod.time()
            _eta_sec = None
            if _live_buf.live_bucket is not None:
                _eta_sec = max(0, int((_live_buf.live_bucket + EXPIRY_SEC) - _now_ts))
            _bar = '█' * _have + '░' * (2 - _have)
            if _eta_sec is not None:
                _eta_str = f"{_eta_sec//60}м{_eta_sec%60:02d}с" if _eta_sec >= 60 else f"{_eta_sec}с"
                _msg = f"⏳ [BUFFER] [{_bar}] {_have}/2 свечей | до закрытия: {_eta_str}"
            else:
                _msg = f"⏳ [BUFFER] [{_bar}] {_have}/2 | жду тик..."
            if not hasattr(_live_buf, '_last_wait_log') or (_now_ts - getattr(_live_buf, '_last_wait_log', 0)) > 15:
                print(_msg)
                _live_buf._last_wait_log = _now_ts
            await asyncio.sleep(2)
            continue

        candles = _live_buf.all_candles()
        prices = _live_buf.prices()
        if not prices:
            await asyncio.sleep(2); continue

        trend = get_trend(candles)
        trend_sig = trend_to_signal(trend)
        signal, signal_info = get_combined_signal(prices, candles)

        if not signal and trend_sig and TREND_FOLLOW == "follow":
            signal = trend_sig
            signal_info = f"[TREND] {trend}"

        ts = datetime.now().strftime("%H:%M:%S")
        _bal_now, _ = await get_balance(client)
        _wins_now = sum(1 for t in trade_log if t["won"])
        _wr_now = f"{_wins_now/len(trade_log)*100:.0f}%" if trade_log else "—"
        print(f"{'='*55}")
        print(f"[ИТОГ {ts}] Тренд: {trend} | Сигнал: {signal}")
        print(f"[СЧЁТ] Баланс: {_bal_now:.2f} | WR: {_wr_now} | Профит: {total_profit:+.2f}")

        if signal:
            if not trend_sig:
                print(f"[ИТОГ] ❌ ПРОПУСК — нет тренда")
                await asyncio.sleep(2); continue
            if signal != trend_sig:
                print(f"[ИТОГ] ❌ КОНФЛИКТ {signal} vs тренд {trend_sig}")
                await asyncio.sleep(2); continue
            print(f"[ИТОГ] ✅ ТОРГУЕМ {signal}")
        else:
            print(f"[ИТОГ] ⏸ ОЖИДАНИЕ")
            await asyncio.sleep(2); continue
        print(f"{'='*55}")

        bet = current_bet
        balance_before, _ = await get_balance(client)

        emoji = "📈" if signal == "CALL" else "📉"
        tg(f"{emoji} <b>[{BOT_NAME}] СДЕЛКА</b>\n{signal} | {bet} {CURRENCY} | {ASSET}\nТренд: {trend}")

        order_id, entry_price = await place_trade(client, signal, bet)
        if not order_id:
            await asyncio.sleep(5); continue

        if _live_buf.last_price > 0:
            entry_price = float(_live_buf.last_price)
        print(f"[ENTRY] {entry_price:.5f}")

        # ===== ЗАПУСКАЕМ КАСКАД ПАРАЛЛЕЛЬНО ОСНОВНОЙ СДЕЛКЕ =====
        cascade_task = None
        if CASCADE_ENABLED and entry_price > 0:
            cascade_task = asyncio.create_task(
                cascade_hedge(client, signal, bet, entry_price, EXPIRY_SEC, _live_buf)
            )

        main_task = asyncio.create_task(check_result(client, order_id, balance_before, bet))

        results = await asyncio.gather(
            main_task,
            cascade_task or asyncio.sleep(0),
            return_exceptions=True
        )
        main_res = results[0]
        cascade_res = results[1]

        won, profit = main_res if not isinstance(main_res, Exception) else (False, round(-bet, 2))

        cascade_profit = 0.0
        if cascade_task and not isinstance(cascade_res, Exception) and isinstance(cascade_res, (int, float)):
            cascade_profit = float(cascade_res)
            hedge_count += 1
            if cascade_profit > 0:
                hedge_wins += 1
            print(f"[CASCADE] Итог каскада: {cascade_profit:+.2f}")
            tg(f"🛡 <b>Каскад итог:</b> {cascade_profit:+.2f} {CURRENCY}")

        total_trade_profit = profit + cascade_profit
        total_profit += total_trade_profit
        trades_today += 1
        final_won = total_trade_profit > 0

        if final_won:
            cur_streak = cur_streak + 1 if cur_streak >= 0 else 1
        else:
            cur_streak = cur_streak - 1 if cur_streak <= 0 else -1

        trade_log.append({"won": final_won, "profit": total_trade_profit, "main_won": won, "signal": signal})

        if total_trade_profit >= bet:
            status_emoji = "🎯"; status_text = "ПОЛНАЯ ПОБЕДА"
        elif final_won:
            status_emoji = "🛡️"; status_text = "СПАСЕНО КАСКАДОМ"
        else:
            status_emoji = "❌"; status_text = "ПРОИГРЫШ"

        wr = sum(1 for t in trade_log if t["won"]) / len(trade_log) * 100
        wins = sum(1 for t in trade_log if t["won"])

        tg(
            f"{status_emoji} <b>[{BOT_NAME}] {status_text}</b>\n"
            f"━━━━━━━━━━━━━━━━━━━━\n"
            f"🎯 {signal} | {bet} | <code>{ASSET}</code>\n"
            f"💰 Основная: {profit:+.2f} | Каскад: {cascade_profit:+.2f}\n"
            f"💵 Итог сделки: <b>{total_trade_profit:+.2f}</b>\n"
            f"━━━━━━━━━━━━━━━━━━━━\n"
            f"📊 Сессия: <b>{total_profit:+.2f} {CURRENCY}</b>\n"
            f"📈 WR: <b>{wr:.0f}%</b> ({wins}/{len(trade_log)})"
        )
        print(f"[STATS] {wins}/{len(trade_log)} | WR: {wr:.1f}% | Сессия: {total_profit:+.2f}")

    try:
        _buf_task.cancel()
    except:
        pass
    await client.disconnect()

if __name__ == "__main__":
    print("=" * 55)
    print("  КОМБО-Бот + КАСКАДНЫЙ ХЕДЖ")
    print("=" * 55)
    asyncio.run(main())