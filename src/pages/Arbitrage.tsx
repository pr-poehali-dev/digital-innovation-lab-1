import { useEffect, useState } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import Icon from "@/components/ui/icon"
import { toast } from "sonner"

const SCANNER_URL = "https://functions.poehali.dev/371ca5f1-ae59-4842-a669-eef3d16a149e?mode=arbitrage"
const STORAGE_KEY = "arbitrage_simulator_v1"
const TAKER_FEE = 0.001
const START_BALANCE = 10000

type Pair = {
  symbol: string
  buy_exchange: string
  buy_price: number
  sell_exchange: string
  sell_price: number
  spread_pct: number
  buy_volume: number
  sell_volume: number
}

type Trade = {
  id: number
  ts: number
  symbol: string
  buy_exchange: string
  sell_exchange: string
  spread_pct: number
  pnl_usd: number
  pnl_pct: number
  status: "win" | "loss"
  amount: number
}

type State = {
  balance: number
  trades: Trade[]
  totalTrades: number
  wins: number
}

const LEVELS = [
  { name: "Новичок", min: 0, color: "text-gray-400", bg: "bg-gray-500/20", border: "border-gray-500/30" },
  { name: "Стажёр", min: 5, color: "text-blue-400", bg: "bg-blue-500/20", border: "border-blue-500/30" },
  { name: "Арбитражёр", min: 15, color: "text-green-400", bg: "bg-green-500/20", border: "border-green-500/30" },
  { name: "Мастер", min: 35, color: "text-yellow-400", bg: "bg-yellow-500/20", border: "border-yellow-500/30" },
  { name: "Легенда", min: 75, color: "text-red-400", bg: "bg-red-500/20", border: "border-red-500/30" },
]

function loadState(): State {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch {
    // ignore
  }
  return { balance: START_BALANCE, trades: [], totalTrades: 0, wins: 0 }
}

function saveState(s: State) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(s))
}

function getLevel(totalTrades: number) {
  let lvl = LEVELS[0]
  for (const l of LEVELS) {
    if (totalTrades >= l.min) lvl = l
  }
  return lvl
}

function getNextLevel(totalTrades: number) {
  return LEVELS.find((l) => l.min > totalTrades)
}

export default function Arbitrage() {
  const [pairs, setPairs] = useState<Pair[]>([])
  const [loading, setLoading] = useState(false)
  const [updatedAt, setUpdatedAt] = useState<number | null>(null)
  const [state, setState] = useState<State>(loadState)
  const [trading, setTrading] = useState<string | null>(null)
  const [tradeAmount, setTradeAmount] = useState(1000)

  useEffect(() => {
    saveState(state)
  }, [state])

  useEffect(() => {
    scan()
  }, [])

  async function scan() {
    setLoading(true)
    try {
      const r = await fetch(SCANNER_URL)
      const data = await r.json()
      setPairs(data.pairs || [])
      setUpdatedAt(data.updated_at || Math.floor(Date.now() / 1000))
      if ((data.pairs || []).length === 0) {
        toast.info("Связок не найдено. Спреды сейчас низкие — попробуй позже.")
      }
    } catch (e) {
      toast.error("Не удалось получить цены. Проверь интернет.")
    } finally {
      setLoading(false)
    }
  }

  function executeTrade(pair: Pair) {
    if (tradeAmount > state.balance) {
      toast.error("Недостаточно средств!")
      return
    }
    if (tradeAmount < 50) {
      toast.error("Минимальный объём — $50")
      return
    }

    setTrading(pair.symbol)

    setTimeout(() => {
      // Реалистичная симуляция:
      // - комиссии taker 0.1% × 2 (вход + выход)
      // - проскальзывание 0.05–0.3% (рандом)
      // - 10% шанс что связка "ушла" → убыток
      const slippage = 0.0005 + Math.random() * 0.0025
      const fees = TAKER_FEE * 2
      const arbWentBad = Math.random() < 0.1

      let netPct: number
      if (arbWentBad) {
        // связка закрылась — убыток от -0.5% до -1.5%
        netPct = -(0.005 + Math.random() * 0.01)
      } else {
        netPct = pair.spread_pct / 100 - fees - slippage
      }

      const pnl = tradeAmount * netPct
      const status: "win" | "loss" = pnl > 0 ? "win" : "loss"

      const trade: Trade = {
        id: Date.now(),
        ts: Date.now(),
        symbol: pair.symbol,
        buy_exchange: pair.buy_exchange,
        sell_exchange: pair.sell_exchange,
        spread_pct: pair.spread_pct,
        pnl_usd: Math.round(pnl * 100) / 100,
        pnl_pct: Math.round(netPct * 10000) / 100,
        status,
        amount: tradeAmount,
      }

      setState((prev) => ({
        balance: Math.round((prev.balance + pnl) * 100) / 100,
        trades: [trade, ...prev.trades].slice(0, 20),
        totalTrades: prev.totalTrades + 1,
        wins: prev.wins + (status === "win" ? 1 : 0),
      }))

      if (status === "win") {
        toast.success(`+$${pnl.toFixed(2)} (${(netPct * 100).toFixed(2)}%)`)
      } else {
        toast.error(`-$${Math.abs(pnl).toFixed(2)} (${(netPct * 100).toFixed(2)}%)`)
      }

      setTrading(null)
    }, 1500)
  }

  function reset() {
    if (!confirm("Точно сбросить весь прогресс?")) return
    const fresh: State = { balance: START_BALANCE, trades: [], totalTrades: 0, wins: 0 }
    setState(fresh)
    toast.info("Прогресс сброшен. Депозит: $10 000")
  }

  const winRate = state.totalTrades > 0 ? Math.round((state.wins / state.totalTrades) * 100) : 0
  const roi = ((state.balance - START_BALANCE) / START_BALANCE) * 100
  const level = getLevel(state.totalTrades)
  const nextLevel = getNextLevel(state.totalTrades)
  const levelProgress = nextLevel
    ? ((state.totalTrades - level.min) / (nextLevel.min - level.min)) * 100
    : 100

  const bestTrade = state.trades.length
    ? state.trades.reduce((m, t) => (t.pnl_usd > m.pnl_usd ? t : m))
    : null
  const worstTrade = state.trades.length
    ? state.trades.reduce((m, t) => (t.pnl_usd < m.pnl_usd ? t : m))
    : null

  return (
    <div className="min-h-screen bg-black">
      <Navbar />

      <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <Badge className="mb-4 bg-green-500/10 text-green-400 border border-green-500/30">
              <Icon name="ArrowLeftRight" size={14} className="mr-1" />
              Реальные цены • CoinGecko
            </Badge>
            <h1 className="font-orbitron text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
              Симулятор <span className="text-green-400">арбитража</span>
            </h1>
            <p className="font-geist text-gray-400 max-w-2xl mx-auto text-lg">
              Купи дешевле на одной бирже — продай дороже на другой. Тренируйся на виртуальных $10 000 с реальными ценами рынка.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card className="bg-white/5 border-white/10">
              <CardContent className="pt-6">
                <p className="font-space-mono text-xs text-gray-400 mb-1">Баланс</p>
                <p className="font-orbitron text-2xl font-bold text-white">
                  ${state.balance.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
                <p className={`font-space-mono text-xs mt-1 ${roi >= 0 ? "text-green-400" : "text-red-400"}`}>
                  {roi >= 0 ? "+" : ""}{roi.toFixed(2)}% ROI
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10">
              <CardContent className="pt-6">
                <p className="font-space-mono text-xs text-gray-400 mb-1">Сделок</p>
                <p className="font-orbitron text-2xl font-bold text-white">{state.totalTrades}</p>
                <p className="font-space-mono text-xs text-gray-400 mt-1">
                  Win-rate: <span className="text-green-400">{winRate}%</span>
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10">
              <CardContent className="pt-6">
                <p className="font-space-mono text-xs text-gray-400 mb-1">Лучшая</p>
                <p className="font-orbitron text-2xl font-bold text-green-400">
                  {bestTrade ? `+$${bestTrade.pnl_usd.toFixed(2)}` : "—"}
                </p>
                <p className="font-space-mono text-xs text-gray-400 mt-1">
                  {bestTrade ? bestTrade.symbol : "нет сделок"}
                </p>
              </CardContent>
            </Card>

            <Card className={`${level.bg} ${level.border}`}>
              <CardContent className="pt-6">
                <p className="font-space-mono text-xs text-gray-400 mb-1">Уровень</p>
                <p className={`font-orbitron text-2xl font-bold ${level.color}`}>{level.name}</p>
                {nextLevel ? (
                  <>
                    <Progress value={levelProgress} className="h-1 mt-2" />
                    <p className="font-space-mono text-xs text-gray-400 mt-1">
                      до "{nextLevel.name}": {nextLevel.min - state.totalTrades} сделок
                    </p>
                  </>
                ) : (
                  <p className="font-space-mono text-xs text-yellow-400 mt-2">МАКС</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Trade Amount + Scan */}
          <Card className="bg-white/5 border-white/10 mb-6">
            <CardContent className="pt-6">
              <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                <div className="flex-1 w-full">
                  <label className="font-space-mono text-xs text-gray-400 block mb-2">
                    Объём сделки: <span className="text-white font-bold">${tradeAmount.toLocaleString()}</span>
                  </label>
                  <input
                    type="range"
                    min={50}
                    max={Math.max(50, Math.floor(state.balance))}
                    step={50}
                    value={Math.min(tradeAmount, state.balance)}
                    onChange={(e) => setTradeAmount(Number(e.target.value))}
                    className="w-full accent-green-500"
                  />
                  <div className="flex justify-between font-space-mono text-xs text-gray-500 mt-1">
                    <span>$50</span>
                    <span>${Math.floor(state.balance).toLocaleString()}</span>
                  </div>
                </div>
                <div className="flex gap-2 w-full lg:w-auto">
                  <Button
                    onClick={scan}
                    disabled={loading}
                    className="bg-green-500 hover:bg-green-600 text-black font-bold flex-1 lg:flex-initial"
                  >
                    <Icon name={loading ? "Loader2" : "Radar"} size={16} className={`mr-2 ${loading ? "animate-spin" : ""}`} />
                    {loading ? "Сканирую..." : "Сканировать связки"}
                  </Button>
                  <Button
                    onClick={reset}
                    variant="outline"
                    className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                  >
                    <Icon name="RotateCcw" size={16} />
                  </Button>
                </div>
              </div>
              {updatedAt && (
                <p className="font-space-mono text-xs text-gray-500 mt-3">
                  Обновлено: {new Date(updatedAt * 1000).toLocaleTimeString("ru-RU")}
                </p>
              )}
            </CardContent>
          </Card>

          {/* Pairs */}
          <div className="grid lg:grid-cols-2 gap-4 mb-8">
            {pairs.length === 0 && !loading && (
              <Card className="bg-white/5 border-white/10 lg:col-span-2">
                <CardContent className="pt-6 text-center">
                  <Icon name="SearchX" size={48} className="mx-auto text-gray-500 mb-3" />
                  <p className="font-geist text-gray-400">
                    Связки не найдены. Спреды на рынке сейчас низкие — попробуй позже.
                  </p>
                </CardContent>
              </Card>
            )}
            {pairs.map((p) => (
              <Card key={p.symbol} className="bg-white/5 border-white/10 hover:border-green-500/30 transition-colors">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="font-orbitron text-white text-xl flex items-center gap-2">
                      <Icon name="Coins" size={20} className="text-yellow-400" />
                      {p.symbol}
                    </CardTitle>
                    <Badge className="bg-green-500/10 text-green-400 border-green-500/30 font-space-mono">
                      +{p.spread_pct.toFixed(3)}%
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
                      <p className="font-space-mono text-xs text-blue-400 mb-1">КУПИТЬ на</p>
                      <p className="font-geist text-sm text-white font-semibold">{p.buy_exchange}</p>
                      <p className="font-space-mono text-lg text-white mt-1">${p.buy_price.toLocaleString()}</p>
                    </div>
                    <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                      <p className="font-space-mono text-xs text-red-400 mb-1">ПРОДАТЬ на</p>
                      <p className="font-geist text-sm text-white font-semibold">{p.sell_exchange}</p>
                      <p className="font-space-mono text-lg text-white mt-1">${p.sell_price.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="font-space-mono text-xs text-gray-400 mb-3 flex justify-between">
                    <span>Чистыми после комиссий: ~{(p.spread_pct - 0.2).toFixed(2)}%</span>
                    <span>Прогноз: <span className="text-green-400">${(tradeAmount * (p.spread_pct - 0.2) / 100).toFixed(2)}</span></span>
                  </div>
                  <Button
                    onClick={() => executeTrade(p)}
                    disabled={trading !== null || tradeAmount > state.balance}
                    className="w-full bg-green-500 hover:bg-green-600 text-black font-bold"
                  >
                    {trading === p.symbol ? (
                      <>
                        <Icon name="Loader2" size={16} className="mr-2 animate-spin" />
                        Исполняю...
                      </>
                    ) : (
                      <>
                        <Icon name="Zap" size={16} className="mr-2" />
                        Сделать сделку (${tradeAmount})
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* History */}
          {state.trades.length > 0 && (
            <Card className="bg-white/5 border-white/10 mb-8">
              <CardHeader>
                <CardTitle className="font-orbitron text-white text-xl flex items-center gap-2">
                  <Icon name="History" size={20} className="text-gray-400" />
                  История сделок
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {state.trades.map((t) => (
                    <div
                      key={t.id}
                      className={`flex items-center justify-between p-3 rounded-lg border ${
                        t.status === "win" ? "bg-green-500/5 border-green-500/20" : "bg-red-500/5 border-red-500/20"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon
                          name={t.status === "win" ? "TrendingUp" : "TrendingDown"}
                          size={18}
                          className={t.status === "win" ? "text-green-400" : "text-red-400"}
                        />
                        <div>
                          <p className="font-geist text-sm text-white font-semibold">
                            {t.symbol}
                          </p>
                          <p className="font-space-mono text-xs text-gray-500">
                            {t.buy_exchange} → {t.sell_exchange} • ${t.amount}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p
                          className={`font-space-mono font-bold ${
                            t.status === "win" ? "text-green-400" : "text-red-400"
                          }`}
                        >
                          {t.pnl_usd >= 0 ? "+" : ""}${t.pnl_usd.toFixed(2)}
                        </p>
                        <p className="font-space-mono text-xs text-gray-500">
                          {t.pnl_pct >= 0 ? "+" : ""}{t.pnl_pct.toFixed(2)}%
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Worst trade */}
          {worstTrade && state.totalTrades >= 5 && (
            <Card className="bg-yellow-500/5 border-yellow-500/20 mb-8">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <Icon name="AlertTriangle" size={20} className="text-yellow-400 mt-1" />
                  <div>
                    <p className="font-geist text-yellow-400 font-semibold mb-1">Антирекорд</p>
                    <p className="font-space-mono text-sm text-gray-300">
                      Худшая сделка: <span className="text-red-400">${worstTrade.pnl_usd.toFixed(2)}</span> на {worstTrade.symbol}.
                      В реальном арбитраже ~10% сделок уходят в минус из-за задержек и проскальзывания.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* How it works */}
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="font-orbitron text-white text-xl flex items-center gap-2">
                <Icon name="GraduationCap" size={20} className="text-green-400" />
                Как считается прибыль
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 font-geist text-gray-300 text-sm">
              <div className="flex items-start gap-2">
                <Icon name="Check" size={16} className="text-green-400 mt-0.5" />
                <p><span className="font-bold text-white">Спред</span> — разница цен между биржами в %</p>
              </div>
              <div className="flex items-start gap-2">
                <Icon name="Minus" size={16} className="text-red-400 mt-0.5" />
                <p><span className="font-bold text-white">Комиссии</span> — 0.1% × 2 (вход и выход) = 0.2%</p>
              </div>
              <div className="flex items-start gap-2">
                <Icon name="Minus" size={16} className="text-red-400 mt-0.5" />
                <p><span className="font-bold text-white">Проскальзывание</span> — 0.05–0.3% (цена меняется пока ты исполняешь)</p>
              </div>
              <div className="flex items-start gap-2">
                <Icon name="AlertCircle" size={16} className="text-yellow-400 mt-0.5" />
                <p><span className="font-bold text-white">Риск</span> — в 10% случаев связка "уходит" до закрытия и получаешь убыток</p>
              </div>
              <div className="pt-2 border-t border-white/10 mt-3">
                <p className="font-space-mono text-xs text-gray-400">
                  Чистый PnL = Объём × (Спред% − 0.2% − Проскальзывание%)
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}
