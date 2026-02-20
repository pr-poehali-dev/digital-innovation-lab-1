import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

type BotType = "grid" | "dca" | "trend" | "scalping"

interface BotConfig {
  type: BotType
  asset: string
  exchange: string
  deposit: number
  riskPercent: number
  takeProfitPercent: number
  stopLossPercent: number
  gridLevels: number
  dcaStep: number
  trendIndicator: string
  trailingStop: boolean
  compounding: boolean
}

const BOT_TYPES: Record<BotType, { label: string; description: string; color: string }> = {
  grid: { label: "Grid-бот", description: "Торговля в диапазоне, покупка снизу — продажа сверху", color: "bg-blue-500/20 border-blue-500/40 text-blue-400" },
  dca: { label: "DCA-бот", description: "Усреднение по времени или при падении цены", color: "bg-green-500/20 border-green-500/40 text-green-400" },
  trend: { label: "Трендовый бот", description: "Следование тренду по сигналам индикаторов", color: "bg-yellow-500/20 border-yellow-500/40 text-yellow-400" },
  scalping: { label: "Скальпинг-бот", description: "Множество быстрых сделок на малых тайм-фреймах", color: "bg-red-500/20 border-red-500/40 text-red-400" },
}

function generateCode(cfg: BotConfig): string {
  const typeComments: Record<BotType, string> = {
    grid: "# Grid-стратегия: покупка на нижних уровнях, продажа на верхних",
    dca: "# DCA-стратегия: усреднение при падении цены",
    trend: `# Трендовая стратегия на основе ${cfg.trendIndicator}`,
    scalping: "# Скальпинг-стратегия: быстрые сделки на M1-M5",
  }

  const strategyCode: Record<BotType, string> = {
    grid: `
def calculate_grid_levels(current_price, levels=${cfg.gridLevels}, spread=0.01):
    """Расчёт уровней сетки вокруг текущей цены"""
    step = current_price * spread
    return [current_price + step * i for i in range(-levels, levels + 1)]

def check_grid_signal(price, grid_levels, open_orders):
    """Проверяет, нужно ли открыть ордер на уровне сетки"""
    for level in grid_levels:
        if abs(price - level) / level < 0.001:  # цена близка к уровню
            if level not in open_orders:
                direction = "BUY" if price <= level else "SELL"
                return direction, level
    return None, None`,

    dca: `
def check_dca_signal(current_price, avg_price, position_count):
    """Сигнал для усреднения при падении цены"""
    if avg_price is None:
        return "BUY"  # Первая покупка
    
    drop_percent = (avg_price - current_price) / avg_price * 100
    
    if drop_percent >= ${cfg.dcaStep} and position_count < 5:
        return "BUY"  # Усредняем при падении на ${cfg.dcaStep}%
    
    profit_percent = (current_price - avg_price) / avg_price * 100
    if profit_percent >= ${cfg.takeProfitPercent}:
        return "SELL"  # Закрываем при достижении цели
    
    return None`,

    trend: `
def check_trend_signal(df):
    """Трендовый сигнал на основе ${cfg.trendIndicator}"""
    ${cfg.trendIndicator === "EMA" ? `
    ema_fast = df['close'].ewm(span=9).mean()
    ema_slow = df['close'].ewm(span=21).mean()
    
    if ema_fast.iloc[-1] > ema_slow.iloc[-1] and ema_fast.iloc[-2] <= ema_slow.iloc[-2]:
        return "BUY"   # Золотой крест
    elif ema_fast.iloc[-1] < ema_slow.iloc[-1] and ema_fast.iloc[-2] >= ema_slow.iloc[-2]:
        return "SELL"  # Мёртвый крест` : cfg.trendIndicator === "MACD" ? `
    exp1 = df['close'].ewm(span=12).mean()
    exp2 = df['close'].ewm(span=26).mean()
    macd = exp1 - exp2
    signal = macd.ewm(span=9).mean()
    
    if macd.iloc[-1] > signal.iloc[-1] and macd.iloc[-2] <= signal.iloc[-2]:
        return "BUY"
    elif macd.iloc[-1] < signal.iloc[-1] and macd.iloc[-2] >= signal.iloc[-2]:
        return "SELL"` : `
    delta = df['close'].diff()
    gain = delta.where(delta > 0, 0).rolling(14).mean()
    loss = -delta.where(delta < 0, 0).rolling(14).mean()
    rs = gain / loss
    rsi = 100 - (100 / (1 + rs))
    
    if rsi.iloc[-1] < 30:
        return "BUY"   # Перепроданность
    elif rsi.iloc[-1] > 70:
        return "SELL"  # Перекупленность`}
    return None`,

    scalping: `
def check_scalping_signal(df, spread_threshold=0.001):
    """Скальпинг сигнал на основе краткосрочного импульса"""
    # Быстрый RSI на M1
    delta = df['close'].diff()
    gain = delta.where(delta > 0, 0).rolling(7).mean()
    loss = -delta.where(delta < 0, 0).rolling(7).mean()
    rsi = 100 - (100 / (1 + gain / loss))
    
    volume_ma = df['volume'].rolling(20).mean()
    volume_surge = df['volume'].iloc[-1] > volume_ma.iloc[-1] * 1.5
    
    if rsi.iloc[-1] < 35 and volume_surge:
        return "BUY"
    elif rsi.iloc[-1] > 65 and volume_surge:
        return "SELL"
    return None`,
  }

  return `#!/usr/bin/env python3
"""
Торговый бот: ${BOT_TYPES[cfg.type].label}
Актив: ${cfg.asset} | Биржа: ${cfg.exchange}
Депозит: $${cfg.deposit} | Риск: ${cfg.riskPercent}% на сделку
Сгенерировано: TradeBase Bot Builder
"""

import time
import ccxt
import pandas as pd
import os

${typeComments[cfg.type]}

# === НАСТРОЙКИ ===
EXCHANGE_ID = "${cfg.exchange.toLowerCase()}"
SYMBOL = "${cfg.asset}"
DEPOSIT = ${cfg.deposit}          # Депозит в USD
RISK_PERCENT = ${cfg.riskPercent}        # % риска на сделку
TAKE_PROFIT = ${cfg.takeProfitPercent}       # % тейк-профит
STOP_LOSS = ${cfg.stopLossPercent}         # % стоп-лосс
COMPOUNDING = ${cfg.compounding ? "True" : "False"}      # Реинвестирование прибыли

# === ПОДКЛЮЧЕНИЕ К БИРЖЕ ===
exchange = getattr(ccxt, EXCHANGE_ID)({
    "apiKey": os.environ.get("API_KEY"),
    "secret": os.environ.get("API_SECRET"),
    "enableRateLimit": True,
    "options": {"defaultType": "spot"},
})

def get_ohlcv(timeframe="1m", limit=100):
    """Получение исторических свечей"""
    ohlcv = exchange.fetch_ohlcv(SYMBOL, timeframe, limit=limit)
    df = pd.DataFrame(ohlcv, columns=["timestamp", "open", "high", "low", "close", "volume"])
    df["timestamp"] = pd.to_datetime(df["timestamp"], unit="ms")
    return df

def get_position_size(price, risk_pct=RISK_PERCENT):
    """Расчёт размера позиции по риску"""
    balance = exchange.fetch_balance()["USDT"]["free"]
    risk_amount = balance * (risk_pct / 100)
    stop_distance = price * (STOP_LOSS / 100)
    quantity = risk_amount / stop_distance
    return round(quantity, 6)

def place_order(side, quantity, price=None):
    """Размещение ордера"""
    order_type = "limit" if price else "market"
    order = exchange.create_order(
        symbol=SYMBOL,
        type=order_type,
        side=side.lower(),
        amount=quantity,
        price=price,
    )
    print(f"[ORDER] {side} {quantity} {SYMBOL} @ {price or 'market'} | ID: {order['id']}")
    return order
${strategyCode[cfg.type]}

def main():
    """Основной цикл бота"""
    print(f"🤖 Запуск бота: {BOT_TYPES_LABEL}")
    print(f"   Актив: {SYMBOL} | Биржа: {EXCHANGE_ID}")
    print(f"   Депозит: ${cfg.deposit} | Риск: {cfg.riskPercent}%\\n")
    
    ${cfg.type === "grid" ? "grid_levels = []\n    open_orders = set()" : cfg.type === "dca" ? "avg_price = None\n    position_count = 0" : ""}
    
    while True:
        try:
            df = get_ohlcv()
            current_price = df["close"].iloc[-1]
            
            ${cfg.type === "grid" ? `if not grid_levels:
                grid_levels = calculate_grid_levels(current_price)
            
            signal, level = check_grid_signal(current_price, grid_levels, open_orders)
            if signal:
                qty = get_position_size(current_price)
                place_order(signal, qty, level)
                open_orders.add(level)` : cfg.type === "dca" ? `signal = check_dca_signal(current_price, avg_price, position_count)
            if signal == "BUY":
                qty = get_position_size(current_price)
                place_order("BUY", qty)
                position_count += 1
                avg_price = current_price if avg_price is None else (avg_price + current_price) / 2
            elif signal == "SELL":
                place_order("SELL", get_position_size(current_price))
                avg_price = None
                position_count = 0` : `signal = check_${cfg.type === "trend" ? "trend" : "scalping"}_signal(df)
            if signal:
                qty = get_position_size(current_price)
                place_order(signal, qty)`}
            
            time.sleep(${cfg.type === "scalping" ? 5 : cfg.type === "grid" ? 10 : 60})
            
        except Exception as e:
            print(f"[ERROR] {e}")
            time.sleep(30)

BOT_TYPES_LABEL = "${BOT_TYPES[cfg.type].label}"

if __name__ == "__main__":
    main()
`
}

export default function BotBuilder() {
  const [config, setConfig] = useState<BotConfig>({
    type: "dca",
    asset: "BTC/USDT",
    exchange: "Binance",
    deposit: 1000,
    riskPercent: 1,
    takeProfitPercent: 3,
    stopLossPercent: 1.5,
    gridLevels: 5,
    dcaStep: 3,
    trendIndicator: "EMA",
    trailingStop: false,
    compounding: false,
  })

  const [copied, setCopied] = useState(false)
  const [generated, setGenerated] = useState(false)
  const [code, setCode] = useState("")

  const handleGenerate = () => {
    setCode(generateCode(config))
    setGenerated(true)
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="dark min-h-screen bg-black">
      <Navbar />
      <main className="pt-24 pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <Badge className="bg-red-500/20 text-red-400 border-red-500/30 mb-4">Конструктор ботов</Badge>
            <h1 className="font-orbitron text-4xl md:text-5xl font-bold text-white mb-6">
              Конструктор торговых ботов
            </h1>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto leading-relaxed">
              Настройте параметры и получите готовый Python-код торгового бота. Без программирования.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left: Settings */}
            <div className="space-y-6">
              {/* Bot type */}
              <Card className="bg-zinc-900 border-red-500/20">
                <CardHeader>
                  <CardTitle className="font-orbitron text-white text-lg">Тип стратегии</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    {(Object.keys(BOT_TYPES) as BotType[]).map((type) => (
                      <button
                        key={type}
                        onClick={() => setConfig({ ...config, type })}
                        className={`p-3 rounded-lg border text-left transition-all ${
                          config.type === type
                            ? BOT_TYPES[type].color + " border-opacity-100"
                            : "border-zinc-700 text-zinc-400 hover:border-zinc-500"
                        }`}
                      >
                        <div className="font-orbitron text-sm font-semibold mb-1">{BOT_TYPES[type].label}</div>
                        <div className="text-xs opacity-80 leading-tight">{BOT_TYPES[type].description}</div>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Asset & Exchange */}
              <Card className="bg-zinc-900 border-red-500/20">
                <CardHeader>
                  <CardTitle className="font-orbitron text-white text-lg">Актив и биржа</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-gray-300 font-space-mono text-sm">Торговая пара</Label>
                    <Select value={config.asset} onValueChange={(v) => setConfig({ ...config, asset: v })}>
                      <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-zinc-800 border-zinc-700">
                        {["BTC/USDT", "ETH/USDT", "SOL/USDT", "BNB/USDT", "AAPL/USD", "EUR/USD"].map((a) => (
                          <SelectItem key={a} value={a} className="text-white hover:bg-zinc-700">{a}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-300 font-space-mono text-sm">Биржа</Label>
                    <Select value={config.exchange} onValueChange={(v) => setConfig({ ...config, exchange: v })}>
                      <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-zinc-800 border-zinc-700">
                        {["Binance", "Bybit", "OKX", "Kraken", "KuCoin"].map((e) => (
                          <SelectItem key={e} value={e} className="text-white hover:bg-zinc-700">{e}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Capital & Risk */}
              <Card className="bg-zinc-900 border-red-500/20">
                <CardHeader>
                  <CardTitle className="font-orbitron text-white text-lg">Капитал и риск</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label className="text-gray-300 font-space-mono text-sm">Депозит ($)</Label>
                    <Input
                      type="number"
                      value={config.deposit}
                      onChange={(e) => setConfig({ ...config, deposit: Number(e.target.value) })}
                      className="bg-zinc-800 border-zinc-700 text-white"
                    />
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <Label className="text-gray-300 font-space-mono text-sm">Риск на сделку</Label>
                      <span className="text-red-400 font-space-mono text-sm font-bold">{config.riskPercent}%</span>
                    </div>
                    <Slider
                      min={0.1} max={5} step={0.1}
                      value={[config.riskPercent]}
                      onValueChange={([v]) => setConfig({ ...config, riskPercent: v })}
                      className="[&>[data-orientation=horizontal]]:h-2"
                    />
                    <div className="flex justify-between text-xs text-zinc-500 font-space-mono">
                      <span>0.1% (консерв.)</span><span>5% (агресс.)</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-gray-300 font-space-mono text-sm">Тейк-профит (%)</Label>
                      <Input
                        type="number"
                        value={config.takeProfitPercent}
                        onChange={(e) => setConfig({ ...config, takeProfitPercent: Number(e.target.value) })}
                        className="bg-zinc-800 border-zinc-700 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-gray-300 font-space-mono text-sm">Стоп-лосс (%)</Label>
                      <Input
                        type="number"
                        value={config.stopLossPercent}
                        onChange={(e) => setConfig({ ...config, stopLossPercent: Number(e.target.value) })}
                        className="bg-zinc-800 border-zinc-700 text-white"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Strategy-specific */}
              {config.type === "grid" && (
                <Card className="bg-zinc-900 border-blue-500/20">
                  <CardHeader>
                    <CardTitle className="font-orbitron text-white text-lg">Настройки Grid</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <Label className="text-gray-300 font-space-mono text-sm">Количество уровней сетки</Label>
                        <span className="text-blue-400 font-bold font-space-mono text-sm">{config.gridLevels}</span>
                      </div>
                      <Slider
                        min={3} max={20} step={1}
                        value={[config.gridLevels]}
                        onValueChange={([v]) => setConfig({ ...config, gridLevels: v })}
                      />
                    </div>
                  </CardContent>
                </Card>
              )}

              {config.type === "dca" && (
                <Card className="bg-zinc-900 border-green-500/20">
                  <CardHeader>
                    <CardTitle className="font-orbitron text-white text-lg">Настройки DCA</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <Label className="text-gray-300 font-space-mono text-sm">Шаг усреднения (% падения)</Label>
                        <span className="text-green-400 font-bold font-space-mono text-sm">{config.dcaStep}%</span>
                      </div>
                      <Slider
                        min={1} max={15} step={0.5}
                        value={[config.dcaStep]}
                        onValueChange={([v]) => setConfig({ ...config, dcaStep: v })}
                      />
                    </div>
                  </CardContent>
                </Card>
              )}

              {config.type === "trend" && (
                <Card className="bg-zinc-900 border-yellow-500/20">
                  <CardHeader>
                    <CardTitle className="font-orbitron text-white text-lg">Настройки тренда</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <Label className="text-gray-300 font-space-mono text-sm">Индикатор сигнала</Label>
                      <Select value={config.trendIndicator} onValueChange={(v) => setConfig({ ...config, trendIndicator: v })}>
                        <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-zinc-800 border-zinc-700">
                          {["EMA", "MACD", "RSI"].map((ind) => (
                            <SelectItem key={ind} value={ind} className="text-white hover:bg-zinc-700">{ind}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Options */}
              <Card className="bg-zinc-900 border-red-500/20">
                <CardHeader>
                  <CardTitle className="font-orbitron text-white text-lg">Дополнительно</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-white font-space-mono text-sm">Трейлинг стоп</Label>
                      <p className="text-zinc-500 text-xs mt-0.5">Стоп-лосс двигается за ценой</p>
                    </div>
                    <Switch
                      checked={config.trailingStop}
                      onCheckedChange={(v) => setConfig({ ...config, trailingStop: v })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-white font-space-mono text-sm">Реинвестирование</Label>
                      <p className="text-zinc-500 text-xs mt-0.5">Добавлять прибыль к депозиту</p>
                    </div>
                    <Switch
                      checked={config.compounding}
                      onCheckedChange={(v) => setConfig({ ...config, compounding: v })}
                    />
                  </div>
                </CardContent>
              </Card>

              <Button
                onClick={handleGenerate}
                className="w-full bg-red-500 hover:bg-red-600 text-white font-orbitron py-6 text-lg"
              >
                Сгенерировать код бота
              </Button>
            </div>

            {/* Right: Code output */}
            <div className="space-y-4">
              <Card className="bg-zinc-900 border-red-500/20 h-full">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="font-orbitron text-white text-lg">Python-код бота</CardTitle>
                  {generated && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCopy}
                      className="border-red-500/40 text-red-400 hover:bg-red-500/10 font-space-mono text-xs"
                    >
                      {copied ? "Скопировано ✓" : "Копировать"}
                    </Button>
                  )}
                </CardHeader>
                <CardContent>
                  {generated ? (
                    <pre className="bg-black rounded-lg p-4 text-xs text-green-400 font-space-mono overflow-auto max-h-[700px] whitespace-pre-wrap leading-relaxed border border-zinc-800">
                      {code}
                    </pre>
                  ) : (
                    <div className="bg-black rounded-lg p-8 border border-zinc-800 text-center min-h-[400px] flex flex-col items-center justify-center">
                      <div className="text-6xl mb-4">🤖</div>
                      <p className="text-zinc-400 font-space-mono text-sm mb-2">Код появится здесь</p>
                      <p className="text-zinc-600 font-space-mono text-xs">Настройте параметры и нажмите «Сгенерировать»</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {generated && (
                <Card className="bg-zinc-900 border-yellow-500/20">
                  <CardContent className="pt-4">
                    <div className="flex gap-3">
                      <span className="text-yellow-400 text-xl">⚠️</span>
                      <div>
                        <p className="text-yellow-400 font-orbitron text-sm font-semibold mb-1">Важно перед запуском</p>
                        <ul className="text-zinc-400 font-space-mono text-xs space-y-1">
                          <li>• Сначала протестируйте на Paper Trading</li>
                          <li>• Не храните API ключи в коде — используйте переменные окружения</li>
                          <li>• Начинайте с минимального депозита</li>
                          <li>• Изучите <a href="/bots-guide" className="text-red-400 underline">гайд по ботам</a> перед стартом</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
