import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Icon from "@/components/ui/icon"

interface Trade {
  id: string
  time: string
  asset: string
  direction: "CALL" | "PUT"
  bet: number
  won: boolean
  profit: number
}

const STORAGE_KEY = "po_trade_journal"

function loadTrades(): Trade[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]")
  } catch {
    return []
  }
}

function saveTrades(trades: Trade[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(trades))
}

interface Props {
  defaultAsset?: string
  defaultBet?: number
}

export default function TradeJournal({ defaultAsset = "EUR/USD (OTC)", defaultBet = 10 }: Props) {
  const [trades, setTrades] = useState<Trade[]>(loadTrades)
  const [asset, setAsset] = useState(defaultAsset)
  const [bet, setBet] = useState(defaultBet)
  const [direction, setDirection] = useState<"CALL" | "PUT">("CALL")
  const [showHistory, setShowHistory] = useState(false)
  const [justAdded, setJustAdded] = useState<"win" | "loss" | null>(null)

  useEffect(() => {
    setAsset(defaultAsset)
    setBet(defaultBet)
  }, [defaultAsset, defaultBet])

  const addTrade = (won: boolean) => {
    const payout = 0.82 // Pocket Option ~82% payout
    const profit = won ? parseFloat((bet * payout).toFixed(2)) : -bet
    const trade: Trade = {
      id: Date.now().toString(),
      time: new Date().toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" }),
      asset,
      direction,
      bet,
      won,
      profit,
    }
    const updated = [trade, ...trades]
    setTrades(updated)
    saveTrades(updated)
    setJustAdded(won ? "win" : "loss")
    setTimeout(() => setJustAdded(null), 1000)
  }

  const removeTrade = (id: string) => {
    const updated = trades.filter((t) => t.id !== id)
    setTrades(updated)
    saveTrades(updated)
  }

  const clearAll = () => {
    if (confirm("Очистить весь журнал?")) {
      setTrades([])
      saveTrades([])
    }
  }

  const exportCSV = () => {
    const header = "Время,Актив,Направление,Ставка,Результат,Профит"
    const rows = trades.map((t) =>
      [t.time, t.asset, t.direction, t.bet, t.won ? "WIN" : "LOSS", t.profit.toFixed(2)].join(",")
    )
    const csv = [header, ...rows].join("\n")
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `trade_journal_${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  // Stats
  const total = trades.length
  const wins = trades.filter((t) => t.won).length
  const losses = total - wins
  const winrate = total > 0 ? Math.round((wins / total) * 100) : 0
  const totalProfit = trades.reduce((s, t) => s + t.profit, 0)
  const streak = (() => {
    if (!trades.length) return { type: null, count: 0 }
    let count = 0
    const first = trades[0].won
    for (const t of trades) {
      if (t.won === first) count++
      else break
    }
    return { type: first ? "win" : "loss", count }
  })()

  const winrateColor = winrate >= 60 ? "text-green-400" : winrate >= 50 ? "text-yellow-400" : "text-red-400"
  const profitColor = totalProfit >= 0 ? "text-green-400" : "text-red-400"

  return (
    <Card className="bg-zinc-900 border-zinc-700">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="font-orbitron text-white text-base flex items-center gap-2">
            <span>📋</span> Журнал сделок
          </CardTitle>
          {total > 0 && (
            <div className="flex items-center gap-2">
              <button
                onClick={exportCSV}
                className="text-zinc-500 hover:text-green-400 transition-colors"
                title="Экспорт в CSV"
              >
                <Icon name="FileDown" size={14} />
              </button>
              <button
                onClick={clearAll}
                className="text-zinc-600 hover:text-red-400 transition-colors"
                title="Очистить журнал"
              >
                <Icon name="Trash2" size={14} />
              </button>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">

        {/* Stats row */}
        <div className="grid grid-cols-4 gap-2">
          <div className="bg-zinc-800 rounded-xl p-3 text-center">
            <p className="text-zinc-500 font-space-mono text-xs mb-1">Сделок</p>
            <p className="text-white font-orbitron font-bold text-lg">{total}</p>
          </div>
          <div className="bg-zinc-800 rounded-xl p-3 text-center">
            <p className="text-zinc-500 font-space-mono text-xs mb-1">Winrate</p>
            <p className={`font-orbitron font-bold text-lg ${winrateColor}`}>{winrate}%</p>
          </div>
          <div className="bg-zinc-800 rounded-xl p-3 text-center">
            <p className="text-zinc-500 font-space-mono text-xs mb-1">В/П</p>
            <p className="font-orbitron font-bold text-lg">
              <span className="text-green-400">{wins}</span>
              <span className="text-zinc-600">/</span>
              <span className="text-red-400">{losses}</span>
            </p>
          </div>
          <div className="bg-zinc-800 rounded-xl p-3 text-center">
            <p className="text-zinc-500 font-space-mono text-xs mb-1">Профит</p>
            <p className={`font-orbitron font-bold text-base ${profitColor}`}>
              {totalProfit >= 0 ? "+" : ""}{totalProfit.toFixed(2)}$
            </p>
          </div>
        </div>

        {/* Streak indicator */}
        {streak.count >= 2 && (
          <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-space-mono
            ${streak.type === "win"
              ? "bg-green-500/10 border-green-500/30 text-green-400"
              : "bg-red-500/10 border-red-500/30 text-red-400"
            }`}
          >
            <span>{streak.type === "win" ? "🔥" : "❄️"}</span>
            {streak.type === "win"
              ? `Серия побед: ${streak.count} подряд`
              : `Серия потерь: ${streak.count} подряд${streak.count >= 3 ? " — рекомендуем сделать паузу" : ""}`
            }
          </div>
        )}

        {/* Input row */}
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-zinc-500 font-space-mono text-xs mb-1 block">Актив</Label>
              <Input
                value={asset}
                onChange={(e) => setAsset(e.target.value)}
                className="bg-zinc-800 border-zinc-700 text-white font-space-mono text-xs h-8"
              />
            </div>
            <div>
              <Label className="text-zinc-500 font-space-mono text-xs mb-1 block">Ставка ($)</Label>
              <Input
                type="number"
                value={bet}
                onChange={(e) => setBet(Number(e.target.value))}
                className="bg-zinc-800 border-zinc-700 text-white font-space-mono text-xs h-8"
              />
            </div>
          </div>

          {/* Direction toggle */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setDirection("CALL")}
              className={`py-2 rounded-lg font-orbitron text-xs font-bold border transition-all
                ${direction === "CALL"
                  ? "bg-green-500/20 border-green-500/50 text-green-400"
                  : "bg-zinc-800 border-zinc-700 text-zinc-500 hover:border-zinc-500"
                }`}
            >
              ▲ CALL
            </button>
            <button
              onClick={() => setDirection("PUT")}
              className={`py-2 rounded-lg font-orbitron text-xs font-bold border transition-all
                ${direction === "PUT"
                  ? "bg-red-500/20 border-red-500/50 text-red-400"
                  : "bg-zinc-800 border-zinc-700 text-zinc-500 hover:border-zinc-500"
                }`}
            >
              ▼ PUT
            </button>
          </div>

          {/* Win/Loss buttons */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => addTrade(true)}
              className={`py-3 rounded-xl font-orbitron font-bold text-sm border transition-all duration-150
                ${justAdded === "win"
                  ? "bg-green-400 border-green-400 text-black scale-95"
                  : "bg-green-500/20 border-green-500/40 text-green-400 hover:bg-green-500/30 active:scale-95"
                }`}
            >
              ✓ WIN
            </button>
            <button
              onClick={() => addTrade(false)}
              className={`py-3 rounded-xl font-orbitron font-bold text-sm border transition-all duration-150
                ${justAdded === "loss"
                  ? "bg-red-500 border-red-500 text-white scale-95"
                  : "bg-red-500/20 border-red-500/40 text-red-400 hover:bg-red-500/30 active:scale-95"
                }`}
            >
              ✗ LOSS
            </button>
          </div>
        </div>

        {/* History toggle */}
        {total > 0 && (
          <div>
            <button
              onClick={() => setShowHistory((v) => !v)}
              className="w-full flex items-center justify-between text-zinc-500 hover:text-zinc-300 transition-colors py-1"
            >
              <span className="font-space-mono text-xs">История ({total} сделок)</span>
              <Icon name={showHistory ? "ChevronUp" : "ChevronDown"} size={14} />
            </button>

            {showHistory && (
              <div className="mt-2 space-y-1.5 max-h-56 overflow-y-auto pr-1">
                {trades.map((t) => (
                  <div
                    key={t.id}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-space-mono group
                      ${t.won
                        ? "bg-green-500/5 border-green-500/20"
                        : "bg-red-500/5 border-red-500/20"
                      }`}
                  >
                    <span className={t.won ? "text-green-400" : "text-red-400"}>
                      {t.won ? "✓" : "✗"}
                    </span>
                    <span className="text-zinc-500">{t.time}</span>
                    <span className="text-zinc-300 flex-1">{t.asset}</span>
                    <span className={t.direction === "CALL" ? "text-green-400" : "text-red-400"}>
                      {t.direction}
                    </span>
                    <span className="text-zinc-400">${t.bet}</span>
                    <span className={t.profit >= 0 ? "text-green-400" : "text-red-400"}>
                      {t.profit >= 0 ? "+" : ""}{t.profit.toFixed(2)}$
                    </span>
                    <button
                      onClick={() => removeTrade(t.id)}
                      className="text-zinc-700 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Icon name="X" size={11} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {total === 0 && (
          <p className="text-zinc-600 font-space-mono text-xs text-center py-2">
            Нажмите WIN или LOSS после каждой сделки
          </p>
        )}

      </CardContent>
    </Card>
  )
}