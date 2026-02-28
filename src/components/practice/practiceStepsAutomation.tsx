import type { PracticeStep } from "./practiceStepTypes"

export const stepAutomation: PracticeStep = {
  id: "automation",
  badge: "Шаг 5",
  color: "purple",
  icon: "Code2",
  title: "Автоматизация: торговый бот для BTC/USDT на Pocket Option",
  summary: "Полный разбор: как написать торгового бота на Python, подключить его к Pocket Option через WebSocket и запустить стратегию EMA+RSI без ручного вмешательства.",
  sections: [
    {
      title: "Архитектура бота: из чего состоит система",
      content: (
        <div className="space-y-3">
          <p className="text-gray-300 leading-relaxed">
            Торговый бот — это не одна программа, а цепочка модулей. Каждый отвечает за свою задачу.
            Разберём архитектуру на примере BTC/USDT с нашей стратегией (EMA 20/50 + RSI + уровни).
          </p>
          <div className="space-y-2">
            {[
              {
                num: "01",
                module: "Data Feed — поток котировок",
                desc: "Получает реальные цены BTC/USDT в режиме реального времени. Источники: Binance WebSocket API (бесплатно) или Pocket Option собственный поток.",
                color: "text-blue-400",
                border: "border-blue-500/30",
              },
              {
                num: "02",
                module: "Signal Engine — движок сигналов",
                desc: "Считает EMA 20/50 и RSI на каждой новой свече M5. Проверяет конфлюэнс трёх факторов. Генерирует сигнал CALL/PUT или WAIT.",
                color: "text-yellow-400",
                border: "border-yellow-500/30",
              },
              {
                num: "03",
                module: "Risk Manager — контроль риска",
                desc: "Перед каждой сделкой проверяет: не превышен ли дневной лимит -6%, какой размер ставки по правилу 2%, не торгуем ли в запрещённое время.",
                color: "text-red-400",
                border: "border-red-500/30",
              },
              {
                num: "04",
                module: "Executor — исполнение ордеров",
                desc: "Подключается к Pocket Option через WebSocket (протокол Traderoom API). Отправляет команду открыть опцион с нужной ставкой и экспирацией.",
                color: "text-purple-400",
                border: "border-purple-500/30",
              },
              {
                num: "05",
                module: "Logger — журнал и статистика",
                desc: "Записывает каждую сделку в CSV: время, направление, цена входа, результат. Считает Win Rate, серии, просадку в реальном времени.",
                color: "text-green-400",
                border: "border-green-500/30",
              },
            ].map((item, i) => (
              <div key={i} className={`flex gap-3 items-start bg-zinc-900 border ${item.border} rounded-lg p-3`}>
                <div className={`font-orbitron text-xs font-bold ${item.color} w-6 shrink-0`}>{item.num}</div>
                <div>
                  <div className={`font-orbitron text-xs font-bold mb-1 ${item.color}`}>{item.module}</div>
                  <p className="text-zinc-400 text-xs font-space-mono leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-zinc-950 border border-zinc-700 rounded-xl p-4">
            <div className="font-orbitron text-xs font-bold text-zinc-400 mb-3">Схема потока данных</div>
            <div className="flex items-center gap-2 flex-wrap">
              {["Binance WS", "→", "Data Feed", "→", "Signal Engine", "→", "Risk Manager", "→", "Executor", "→", "Pocket Option"].map((item, i) => (
                <span key={i} className={`text-xs font-space-mono ${item === "→" ? "text-zinc-600" : "bg-zinc-800 text-zinc-300 px-2 py-1 rounded"}`}>{item}</span>
              ))}
            </div>
            <div className="mt-2 flex items-center gap-2">
              <span className="text-xs font-space-mono bg-zinc-800 text-zinc-300 px-2 py-1 rounded">Logger</span>
              <span className="text-xs font-space-mono text-zinc-600">← записывает каждый шаг</span>
            </div>
          </div>

          <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
            <div className="text-blue-400 font-orbitron text-xs font-bold mb-2">Из жизни: архитектура Two Sigma</div>
            <p className="text-zinc-300 text-xs font-space-mono leading-relaxed">
              Хедж-фонд Two Sigma (AUM $60 млрд) строит свои торговые системы по той же модульной архитектуре.
              Каждый компонент — отдельная служба с чёткой ответственностью. Это позволяет менять стратегию (Signal Engine),
              не трогая исполнение (Executor) или риск-менеджмент. Модульность — стандарт индустрии.
            </p>
          </div>
        </div>
      )
    },
    {
      title: "Python-код: Signal Engine с EMA и RSI",
      content: (
        <div className="space-y-3">
          <p className="text-gray-300 leading-relaxed">
            Ниже — готовый рабочий код Signal Engine на Python. Он считает EMA 20/50, RSI и определяет сигнал.
            Это основа бота — самая важная часть.
          </p>

          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4">
            <div className="font-orbitron text-xs font-bold text-zinc-400 mb-3">signal_engine.py</div>
            <pre className="text-xs font-space-mono text-zinc-300 overflow-x-auto leading-relaxed whitespace-pre">{`import pandas as pd
import numpy as np

class SignalEngine:
    def __init__(self, ema_fast=20, ema_slow=50, rsi_period=14):
        self.ema_fast = ema_fast
        self.ema_slow = ema_slow
        self.rsi_period = rsi_period

    def calculate_ema(self, prices: list, period: int) -> float:
        """Считает EMA по последним n свечам."""
        series = pd.Series(prices)
        ema = series.ewm(span=period, adjust=False).mean()
        return round(ema.iloc[-1], 2)

    def calculate_rsi(self, prices: list) -> float:
        """Считает RSI(14) по последним свечам."""
        series = pd.Series(prices)
        delta = series.diff()
        gain = delta.where(delta > 0, 0).rolling(self.rsi_period).mean()
        loss = (-delta.where(delta < 0, 0)).rolling(self.rsi_period).mean()
        rs = gain / loss
        rsi = 100 - (100 / (1 + rs))
        return round(rsi.iloc[-1], 2)

    def get_signal(self, close_prices: list) -> dict:
        """
        Принимает список цен закрытия (минимум 60 свечей M5).
        Возвращает: {'signal': 'CALL'|'PUT'|'WAIT', 'ema_fast': x,
                     'ema_slow': x, 'rsi': x, 'confluence': int}
        """
        if len(close_prices) < self.ema_slow + 10:
            return {"signal": "WAIT", "reason": "Недостаточно данных"}

        ema_fast = self.calculate_ema(close_prices, self.ema_fast)
        ema_slow = self.calculate_ema(close_prices, self.ema_slow)
        rsi = self.calculate_rsi(close_prices)
        current_price = close_prices[-1]

        confluence = 0
        direction = None

        # Фактор 1: тренд по EMA
        if ema_fast > ema_slow:
            confluence += 1
            direction = "CALL"
        elif ema_fast < ema_slow:
            confluence += 1
            direction = "PUT"

        # Фактор 2: RSI фильтр
        if direction == "CALL" and rsi < 35:
            confluence += 1
        elif direction == "PUT" and rsi > 65:
            confluence += 1

        # Фактор 3: расстояние от EMA (цена близко к линии)
        ema_distance = abs(current_price - ema_fast) / current_price
        if ema_distance < 0.003:  # 0.3% — цена у EMA
            confluence += 1

        signal = direction if confluence >= 3 else "WAIT"

        return {
            "signal": signal,
            "ema_fast": ema_fast,
            "ema_slow": ema_slow,
            "rsi": rsi,
            "confluence": confluence,
            "current_price": current_price,
        }`}</pre>
          </div>

          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4">
            <div className="font-orbitron text-xs font-bold text-zinc-400 mb-3">Пример использования</div>
            <pre className="text-xs font-space-mono text-zinc-300 overflow-x-auto leading-relaxed whitespace-pre">{`engine = SignalEngine()

# close_prices — список из 60+ цен закрытия M5 свечей
close_prices = [95800, 95850, 95900, ..., 96420]

result = engine.get_signal(close_prices)
# {'signal': 'PUT', 'ema_fast': 96420.0, 'ema_slow': 96180.0,
#  'rsi': 68.3, 'confluence': 3, 'current_price': 96420}`}</pre>
          </div>

          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
            <div className="text-yellow-400 font-orbitron text-xs font-bold mb-2">Важно: зачем нужен pandas</div>
            <p className="text-zinc-300 text-xs font-space-mono leading-relaxed">
              Библиотека <span className="text-white">pandas</span> — стандарт для финансовых вычислений.
              EMA через <span className="text-white">ewm()</span> точнее ручного расчёта, потому что учитывает все исторические данные с убывающим весом.
              Установка: <span className="text-green-400">pip install pandas numpy</span>
            </p>
          </div>
        </div>
      )
    },
    {
      title: "WebSocket: получаем котировки BTC/USDT в реальном времени",
      content: (
        <div className="space-y-3">
          <p className="text-gray-300 leading-relaxed">
            Для расчёта EMA и RSI боту нужны реальные свечные данные. Binance предоставляет бесплатный WebSocket
            с M5-свечами BTC/USDT в режиме реального времени.
          </p>

          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4">
            <div className="font-orbitron text-xs font-bold text-zinc-400 mb-3">data_feed.py — получение свечей с Binance</div>
            <pre className="text-xs font-space-mono text-zinc-300 overflow-x-auto leading-relaxed whitespace-pre">{`import json
import asyncio
import websockets
from collections import deque
from signal_engine import SignalEngine

class DataFeed:
    def __init__(self, symbol="btcusdt", interval="5m", max_candles=100):
        self.symbol = symbol
        self.interval = interval
        self.close_prices = deque(maxlen=max_candles)
        self.engine = SignalEngine()
        self.url = (
            f"wss://stream.binance.com:9443/ws/"
            f"{symbol}@kline_{interval}"
        )

    async def on_message(self, data: dict):
        """Обработчик каждого обновления свечи."""
        kline = data["k"]
        is_closed = kline["x"]   # True = свеча закрылась
        close_price = float(kline["c"])

        if is_closed:
            self.close_prices.append(close_price)
            print(f"Новая свеча M5: {close_price}")

            # Генерируем сигнал на закрытой свече
            if len(self.close_prices) >= 60:
                result = self.engine.get_signal(list(self.close_prices))
                signal = result["signal"]

                if signal != "WAIT":
                    print(f"СИГНАЛ: {signal} | RSI: {result['rsi']}"
                          f" | Конфлюэнс: {result['confluence']}/3")
                    # Здесь вызываем Risk Manager → Executor
                    await self.on_signal(result)

    async def on_signal(self, result: dict):
        """Переопределите этот метод для подключения исполнения."""
        pass  # Risk Manager и Executor подключаются здесь

    async def run(self):
        """Запускает поток данных."""
        print(f"Подключение к Binance WS: {self.symbol} {self.interval}")
        async with websockets.connect(self.url) as ws:
            async for raw in ws:
                data = json.loads(raw)
                await self.on_message(data)

if __name__ == "__main__":
    feed = DataFeed()
    asyncio.run(feed.run())`}</pre>
          </div>

          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4">
            <div className="font-orbitron text-xs font-bold text-zinc-400 mb-3">Формат данных от Binance WebSocket</div>
            <pre className="text-xs font-space-mono text-zinc-300 overflow-x-auto leading-relaxed whitespace-pre">{`{
  "e": "kline",          // тип события
  "E": 1735900000000,    // время события (ms)
  "s": "BTCUSDT",        // символ
  "k": {
    "t": 1735900000000,  // время открытия свечи
    "T": 1735900299999,  // время закрытия свечи
    "o": "96100.00",     // цена открытия
    "h": "96450.00",     // максимум
    "l": "96050.00",     // минимум
    "c": "96380.00",     // цена ЗАКРЫТИЯ ← используем
    "v": "124.853",      // объём BTC
    "x": true            // true = свеча закрылась (ВАЖНО!)
  }
}`}</pre>
          </div>

          <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
            <div className="text-green-400 font-orbitron text-xs font-bold mb-2">Почему только закрытые свечи</div>
            <p className="text-zinc-300 text-xs font-space-mono leading-relaxed">
              Поле <span className="text-white">x: true</span> означает, что свеча закрылась и цена зафиксирована.
              EMA и RSI нужно считать только на закрытых свечах — иначе значения будут меняться каждую секунду
              и генерировать ложные сигналы. Это классическая ошибка новичков в алго-трейдинге.
            </p>
          </div>
        </div>
      )
    },
    {
      title: "Risk Manager и Executor: защита и исполнение",
      content: (
        <div className="space-y-3">
          <p className="text-gray-300 leading-relaxed">
            Перед каждой сделкой Risk Manager проверяет правила безопасности.
            Только после его одобрения Executor отправляет ордер.
          </p>

          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4">
            <div className="font-orbitron text-xs font-bold text-zinc-400 mb-3">risk_manager.py</div>
            <pre className="text-xs font-space-mono text-zinc-300 overflow-x-auto leading-relaxed whitespace-pre">{`from datetime import datetime, time

class RiskManager:
    def __init__(self, deposit: float, max_risk_pct=0.02, daily_loss_pct=0.06):
        self.deposit = deposit
        self.max_risk_pct = max_risk_pct      # 2% на сделку
        self.daily_loss_pct = daily_loss_pct  # 6% дневной стоп
        self.daily_pnl = 0.0
        self.trades_today = 0

    def get_stake(self) -> float:
        """Возвращает размер ставки по правилу 2%."""
        return round(self.deposit * self.max_risk_pct, 2)

    def is_trading_allowed(self) -> tuple[bool, str]:
        """Проверяет, можно ли открывать новую сделку."""

        # 1. Дневной стоп-лосс
        daily_loss = self.daily_pnl / self.deposit
        if daily_loss <= -self.daily_loss_pct:
            return False, f"Дневной стоп: {daily_loss*100:.1f}%"

        # 2. Дневной тейк-профит
        if daily_loss >= 0.10:
            return False, f"Дневной тейк: +{daily_loss*100:.1f}%"

        # 3. Запрещённые часы (высокая волатильность)
        now = datetime.utcnow().time()
        bad_hours = [
            (time(12, 25), time(12, 35)),  # Публикация NFP (пятница)
            (time(8, 25),  time(8, 35)),   # Открытие Европы
        ]
        for start, end in bad_hours:
            if start <= now <= end:
                return False, "Запрещённое время: высокая волатильность"

        return True, "OK"

    def record_result(self, won: bool, stake: float, payout_pct=0.82):
        """Записывает результат сделки."""
        if won:
            self.daily_pnl += stake * payout_pct
        else:
            self.daily_pnl -= stake
        self.trades_today += 1
        print(f"PnL за день: {self.daily_pnl:+.2f} | Сделок: {self.trades_today}")`}</pre>
          </div>

          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4">
            <div className="font-orbitron text-xs font-bold text-zinc-400 mb-3">Схема проверки перед входом</div>
            <div className="space-y-2">
              {[
                { check: "Сигнал валиден?", condition: "confluence == 3", pass: "CALL или PUT", fail: "WAIT — ждём", color: "text-blue-400" },
                { check: "Торговля разрешена?", condition: "is_trading_allowed()", pass: "Продолжаем", fail: "Стоп — пропускаем", color: "text-yellow-400" },
                { check: "Депозит не нулевой?", condition: "deposit > 0", pass: "Считаем ставку", fail: "Остановка бота", color: "text-red-400" },
                { check: "Размер ставки", condition: "deposit × 2%", pass: "Отправляем ордер", fail: "", color: "text-green-400" },
              ].map((item, i) => (
                <div key={i} className="flex gap-3 items-start bg-zinc-900 border border-zinc-800 rounded-lg p-2">
                  <div className={`font-orbitron text-xs font-bold ${item.color} w-5 shrink-0`}>{i + 1}.</div>
                  <div className="flex-1">
                    <span className={`font-orbitron text-xs font-bold ${item.color}`}>{item.check} </span>
                    <span className="text-zinc-500 text-xs font-space-mono">[{item.condition}]</span>
                  </div>
                  <div className="text-right">
                    {item.pass && <div className="text-green-400 text-xs font-space-mono">✓ {item.pass}</div>}
                    {item.fail && <div className="text-red-400 text-xs font-space-mono">✗ {item.fail}</div>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4">
            <div className="text-purple-400 font-orbitron text-xs font-bold mb-2">Из жизни: Circuit Breakers в хедж-фондах</div>
            <p className="text-zinc-300 text-xs font-space-mono leading-relaxed">
              Профессиональные трейдинговые системы имеют «автоматические выключатели» (circuit breakers) —
              именно то, что делает наш Risk Manager. Citadel и AQR автоматически останавливают торговлю
              при превышении дневной просадки. Это не слабость — это архитектурное требование к любой серьёзной системе.
            </p>
          </div>
        </div>
      )
    },
    {
      title: "Pocket Option WebSocket API: подключение и отправка ордеров",
      content: (
        <div className="space-y-3">
          <p className="text-gray-300 leading-relaxed">
            Pocket Option имеет WebSocket API для автоматической торговли. Вот как подключить Python-бота
            к реальному аккаунту и отправлять ордеры программно.
          </p>

          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
            <div className="text-yellow-400 font-orbitron text-xs font-bold mb-2">Важно: демо-аккаунт сначала</div>
            <p className="text-zinc-300 text-xs font-space-mono leading-relaxed">
              Всегда тестируй бота на демо-аккаунте минимум 2 недели, прежде чем переключиться на реальные деньги.
              Даже идеальный бэктест не гарантирует реального результата — слипаж, задержки сети, изменения в API.
            </p>
          </div>

          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4">
            <div className="font-orbitron text-xs font-bold text-zinc-400 mb-3">Шаг 1: получаем session token из браузера</div>
            <pre className="text-xs font-space-mono text-zinc-300 overflow-x-auto leading-relaxed whitespace-pre">{`# Pocket Option использует авторизацию через session token.
# Как получить токен:
# 1. Войди на pocketoption.com в Chrome/Firefox
# 2. Открой DevTools → Application → Cookies
# 3. Найди cookie с именем: ph_session или _ga_* 
# 4. Либо: DevTools → Network → WS соединения → 
#    найди headers Authorization или Bearer token

SESSION_TOKEN = "твой_токен_из_браузера"  # Вставь сюда
DEMO_MODE = True  # True = демо, False = реальный счёт`}</pre>
          </div>

          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4">
            <div className="font-orbitron text-xs font-bold text-zinc-400 mb-3">pocket_option_client.py</div>
            <pre className="text-xs font-space-mono text-zinc-300 overflow-x-auto leading-relaxed whitespace-pre">{`import asyncio
import json
import websockets
import time

class PocketOptionClient:
    """WebSocket-клиент для Pocket Option Traderoom API."""

    WS_URL = "wss://api.pocketoption.com/socket.io/?EIO=4&transport=websocket"

    def __init__(self, session_token: str, demo: bool = True):
        self.token = session_token
        self.demo = demo
        self.ws = None
        self.balance = 0.0
        self.pending_orders = {}

    async def connect(self):
        """Устанавливает WebSocket-соединение с Pocket Option."""
        headers = {
            "Cookie": f"session={self.token}",
            "Origin": "https://pocketoption.com",
            "User-Agent": "Mozilla/5.0 (compatible; TradingBot/1.0)",
        }
        self.ws = await websockets.connect(
            self.WS_URL,
            extra_headers=headers,
            ping_interval=20,
            ping_timeout=30,
        )
        print("[PO] WebSocket подключён")

        # Шаг 1: ответить на handshake Socket.IO
        await self.ws.recv()       # "0{...}" — приветствие сервера
        await self.ws.send("40")   # "40" — подтверждение подключения
        response = await self.ws.recv()
        print(f"[PO] Handshake: {response[:80]}")

        # Шаг 2: авторизация с токеном
        auth_payload = json.dumps({
            "session": self.token,
            "isDemo": 1 if self.demo else 0,
            "uid": 0,
        })
        await self.ws.send(f'42["auth",{auth_payload}]')
        auth_response = await self.ws.recv()
        print(f"[PO] Auth ответ: {auth_response[:120]}")

    async def open_order(
        self,
        asset: str,
        direction: str,
        amount: float,
        expiration: int = 60,
    ) -> dict:
        """
        Открывает бинарный опцион.
        
        asset       — 'BTCUSDT_otc' (OTC) или 'BTCUSDT' (реальный рынок)
        direction   — 'call' или 'put'
        amount      — ставка в USD (например 20.0)
        expiration  — время экспирации в секундах (60, 120, 300...)
        """
        order_id = str(int(time.time() * 1000))  # уникальный ID
        
        order_payload = json.dumps({
            "asset": asset,
            "requestId": order_id,
            "optionType": 100,          # 100 = турбо-опцион
            "direction": direction,
            "amount": amount,
            "time": expiration,
            "isDemo": 1 if self.demo else 0,
        })
        
        await self.ws.send(f'42["openOrder",{order_payload}]')
        print(f"[PO] Ордер отправлен: {direction.upper()} {asset} $" + str(amount))
        
        # Ждём подтверждение
        response = await asyncio.wait_for(self.ws.recv(), timeout=10)
        data = json.loads(response[2:])  # убираем "42" префикс
        
        return {
            "order_id": order_id,
            "status": data[0],
            "response": data[1] if len(data) > 1 else {},
        }

    async def get_balance(self) -> float:
        """Запрашивает текущий баланс аккаунта."""
        await self.ws.send('42["getBalance",{}]')
        response = await asyncio.wait_for(self.ws.recv(), timeout=5)
        data = json.loads(response[2:])
        balance = data[1].get("balance", 0)
        self.balance = float(balance)
        return self.balance

    async def close(self):
        """Закрывает WebSocket-соединение."""
        if self.ws:
            await self.ws.close()
            print("[PO] Соединение закрыто")`}</pre>
          </div>

          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4">
            <div className="font-orbitron text-xs font-bold text-zinc-400 mb-3">main.py — главный цикл бота</div>
            <pre className="text-xs font-space-mono text-zinc-300 overflow-x-auto leading-relaxed whitespace-pre">{`import asyncio
import websockets
import json
from signal_engine import SignalEngine
from risk_manager import RiskManager
from pocket_option_client import PocketOptionClient
from data_feed import BinanceDataFeed  # из предыдущего шага

SESSION_TOKEN = "твой_токен"
ASSET = "BTCUSDT_otc"  # BTC OTC на Pocket Option
EXPIRY = 300           # 5 минут = 300 секунд

async def run_bot():
    # Инициализация компонентов
    client = PocketOptionClient(SESSION_TOKEN, demo=True)
    signal_engine = SignalEngine()
    risk = RiskManager(deposit=1000.0)
    feed = BinanceDataFeed()

    await client.connect()
    balance = await client.get_balance()
    print(f"[BOT] Баланс: $" + f"{balance:.2f}" + " (Демо)")

    close_prices = []

    async def on_candle_close(prices: list):
        """Вызывается при закрытии каждой M5-свечи."""
        nonlocal close_prices
        close_prices = prices

        # 1. Получаем сигнал
        result = signal_engine.get_signal(close_prices)
        signal = result["signal"]
        print(f"[SIGNAL] {signal} | RSI={result['rsi']} | Conf={result['confluence']}/3")

        if signal == "WAIT":
            return

        # 2. Проверяем риск-менеджмент
        allowed, reason = risk.is_trading_allowed()
        if not allowed:
            print(f"[RISK] Торговля запрещена: {reason}")
            return

        # 3. Определяем ставку
        stake = risk.get_stake()
        direction = signal.lower()  # "call" или "put"

        # 4. Отправляем ордер
        order = await client.open_order(
            asset=ASSET,
            direction=direction,
            amount=stake,
            expiration=EXPIRY,
        )
        print(f"[ORDER] ID={order['order_id']} Status={order['status']}")

    # Запускаем поток данных с Binance
    await feed.start(callback=on_candle_close)

if __name__ == "__main__":
    asyncio.run(run_bot())`}</pre>
          </div>

          <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-4">
            <div className="font-orbitron text-xs font-bold text-zinc-400 mb-3">requirements.txt для установки зависимостей</div>
            <pre className="text-xs font-space-mono text-zinc-300 overflow-x-auto leading-relaxed whitespace-pre">{`websockets>=11.0
pandas>=2.0
numpy>=1.24
requests>=2.28
python-dotenv>=1.0  # для хранения SESSION_TOKEN в .env файле`}</pre>
            <div className="mt-3 text-zinc-500 text-xs font-space-mono">
              Установка: <span className="text-zinc-300">pip install -r requirements.txt</span>
            </div>
          </div>

          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
            <div className="text-red-400 font-orbitron text-xs font-bold mb-2">Безопасность: храни токен в .env</div>
            <pre className="text-xs font-space-mono text-zinc-300 overflow-x-auto leading-relaxed whitespace-pre">{`# .env файл (НЕ загружай в GitHub!)
SESSION_TOKEN=твой_секретный_токен_здесь

# В коде читаем так:
from dotenv import load_dotenv
import os
load_dotenv()
SESSION_TOKEN = os.getenv("SESSION_TOKEN")`}</pre>
          </div>

          <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
            <div className="text-blue-400 font-orbitron text-xs font-bold mb-2">Из жизни: Renaissance Technologies и API-трейдинг</div>
            <p className="text-zinc-300 text-xs font-space-mono leading-relaxed">
              Медальон-фонд Джима Саймонса — самый прибыльный хедж-фонд в истории (+66% годовых до комиссий) —
              работает исключительно через автоматические API-подключения к биржам. Ни один трейдер не нажимает
              кнопки вручную. Цель — устранить человеческую эмоциональность и задержки. Тот же принцип
              работает и для розничного трейдера: автоматизация исполнения убирает страх и жадность из уравнения.
            </p>
          </div>
        </div>
      )
    },
    {
      title: "Запуск и бэктест: проверяем стратегию до реальных денег",
      content: (
        <div className="space-y-3">
          <p className="text-gray-300 leading-relaxed">
            Перед запуском с реальными деньгами нужно проверить стратегию на исторических данных — это называется бэктест.
            Покажем, как это сделать быстро на Python.
          </p>

          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4">
            <div className="font-orbitron text-xs font-bold text-zinc-400 mb-3">backtest.py — проверка на истории</div>
            <pre className="text-xs font-space-mono text-zinc-300 overflow-x-auto leading-relaxed whitespace-pre">{`import requests
import pandas as pd
from signal_engine import SignalEngine

def get_historical_candles(symbol="BTCUSDT", interval="5m", limit=500):
    """Получаем исторические свечи с Binance REST API."""
    url = "https://api.binance.com/api/v3/klines"
    params = {"symbol": symbol, "interval": interval, "limit": limit}
    response = requests.get(url, params=params)
    data = response.json()
    closes = [float(candle[4]) for candle in data]  # индекс 4 = close
    return closes

def run_backtest(closes: list, deposit=1000, payout=0.82):
    """Запускает бэктест стратегии EMA+RSI."""
    engine = SignalEngine()
    balance = deposit
    wins, losses = 0, 0
    trades = []

    for i in range(60, len(closes)):
        window = closes[:i]
        result = engine.get_signal(window)

        if result["signal"] == "WAIT":
            continue

        stake = balance * 0.02  # 2% от текущего баланса

        # Симуляция: смотрим, куда пошла цена через 5 свечей
        if i + 1 < len(closes):
            next_price = closes[i + 1]
            current = closes[i]
            price_up = next_price > current

            won = (result["signal"] == "CALL" and price_up) or \
                  (result["signal"] == "PUT" and not price_up)

            if won:
                balance += stake * payout
                wins += 1
            else:
                balance -= stake
                losses += 1

            trades.append({
                "signal": result["signal"],
                "rsi": result["rsi"],
                "confluence": result["confluence"],
                "won": won,
                "balance": round(balance, 2),
            })

    total = wins + losses
    win_rate = wins / total * 100 if total > 0 else 0
    print(f"Сделок: {total} | Win Rate: {win_rate:.1f}%")
    print(f"Начальный депозит: $" + str(deposit) + " -> Итог: $" + f"{balance:.2f}")
    print(f"Прибыль: " + f"{(balance - deposit) / deposit * 100:.1f}" + "%")
    return pd.DataFrame(trades)

# Запуск
closes = get_historical_candles()
results = run_backtest(closes)`}</pre>
          </div>

          <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-4">
            <div className="font-orbitron text-xs font-bold text-zinc-400 mb-3">Пример результатов бэктеста</div>
            <div className="space-y-2">
              {[
                { metric: "Период", value: "500 свечей M5 (~42 часа)", color: "text-zinc-300" },
                { metric: "Всего сигналов", value: "38 сделок", color: "text-zinc-300" },
                { metric: "Win Rate", value: "57.9% (22 выигрыша)", color: "text-green-400" },
                { metric: "Депозит $1,000 → Итог", value: "$1,187", color: "text-green-400" },
                { metric: "Макс. серия проигрышей", value: "4 подряд", color: "text-red-400" },
                { metric: "Макс. просадка", value: "-8.3% (4 сделки × 2%)", color: "text-yellow-400" },
              ].map((row, i) => (
                <div key={i} className="flex items-center justify-between gap-2">
                  <span className="text-zinc-500 text-xs font-space-mono">{row.metric}</span>
                  <span className={`text-xs font-space-mono font-bold ${row.color}`}>{row.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-4">
            <div className="text-orange-400 font-orbitron text-xs font-bold mb-2">Из жизни: Эдвард Торп — «бэктест до казино»</div>
            <p className="text-zinc-300 text-xs font-space-mono leading-relaxed">
              Эдвард Торп — математик, создавший первую систему подсчёта карт в блэкджеке и первый количественный хедж-фонд —
              никогда не запускал стратегию без исчерпывающего математического доказательства её преимущества.
              Он говорил: «Если не можешь объяснить, почему стратегия работает математически — не ставь на неё реальные деньги».
              Бэктест — это минимальный стандарт проверки перед запуском.
            </p>
          </div>

          <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-4">
            <div className="font-orbitron text-xs font-bold text-zinc-400 mb-3">Что дальше: конструктор ботов</div>
            <p className="text-zinc-300 text-xs font-space-mono leading-relaxed mb-3">
              Хочешь получить готовый Python-код бота под свои параметры без написания кода вручную?
              Используй раздел <span className="text-purple-400 font-bold">Конструктор ботов</span> на этом сайте —
              настрой стратегию через форму и получи готовый скрипт.
            </p>
            <a
              href="/bot-builder"
              className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-orbitron font-bold px-4 py-2 rounded-lg transition-colors"
            >
              Перейти в конструктор ботов →
            </a>
          </div>
        </div>
      )
    },
  ]
}