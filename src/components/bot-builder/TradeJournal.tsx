import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Icon from "@/components/ui/icon"
import * as XLSX from "xlsx"

interface Trade {
  id: string
  date: string
  time: string
  asset: string
  direction: "CALL" | "PUT"
  bet: number
  payout: number
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

function todayDate() {
  return new Date().toISOString().slice(0, 10)
}

function nowTime() {
  return new Date().toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" })
}

interface Props {
  defaultAsset?: string
  defaultBet?: number
}

export default function TradeJournal({ defaultAsset = "EUR/USD (OTC)", defaultBet = 10 }: Props) {
  const [trades, setTrades] = useState<Trade[]>(loadTrades)
  const [asset, setAsset] = useState(defaultAsset)
  const [bet, setBet] = useState(defaultBet)
  const [payout, setPayout] = useState(82)
  const [direction, setDirection] = useState<"CALL" | "PUT">("CALL")
  const [tradeDate, setTradeDate] = useState(todayDate())
  const [tradeTime, setTradeTime] = useState(nowTime())
  const [useManualTime, setUseManualTime] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [justAdded, setJustAdded] = useState<"win" | "loss" | null>(null)
  const [showExportPanel, setShowExportPanel] = useState(false)
  const [exportFrom, setExportFrom] = useState("")
  const [exportTo, setExportTo] = useState(todayDate())

  useEffect(() => {
    setAsset(defaultAsset)
    setBet(defaultBet)
  }, [defaultAsset, defaultBet])

  const addTrade = (won: boolean) => {
    const profit = won ? parseFloat((bet * payout / 100).toFixed(2)) : -bet
    const now = new Date()
    const trade: Trade = {
      id: Date.now().toString(),
      date: useManualTime ? tradeDate : todayDate(),
      time: useManualTime ? tradeTime : nowTime(),
      asset,
      direction,
      bet,
      payout,
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

  const getFilteredTrades = () => {
    return trades.filter((t) => {
      if (exportFrom && t.date < exportFrom) return false
      if (exportTo && t.date > exportTo) return false
      return true
    })
  }

  const exportCSV = () => {
    const filtered = getFilteredTrades()
    const header = "Дата,Время,Актив,Направление,Ставка,Выплата %,Результат,Профит"
    const rows = filtered.map((t) =>
      [t.date, t.time, t.asset, t.direction, t.bet, t.payout, t.won ? "WIN" : "LOSS", t.profit.toFixed(2)].join(",")
    )
    const csv = [header, ...rows].join("\n")
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    const suffix = exportFrom ? `${exportFrom}_${exportTo}` : todayDate()
    a.download = `trade_journal_${suffix}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const exportExcel = () => {
    const filtered = getFilteredTrades()
    const wins = filtered.filter((t) => t.won).length
    const totalT = filtered.length
    const wr = totalT > 0 ? Math.round((wins / totalT) * 100) : 0
    const totalProf = filtered.reduce((s, t) => s + t.profit, 0)

    const rows = filtered.map((t) => ({
      "Дата": t.date,
      "Время": t.time,
      "Актив": t.asset,
      "Направление": t.direction,
      "Ставка": t.bet,
      "Выплата %": t.payout,
      "Результат": t.won ? "WIN" : "LOSS",
      "Профит": parseFloat(t.profit.toFixed(2)),
    }))

    const periodLabel = exportFrom ? `${exportFrom} — ${exportTo}` : "Все время"
    const summaryRows = [
      {},
      { "Дата": `=== ИТОГИ: ${periodLabel} ===` },
      { "Дата": "Всего сделок", "Время": totalT },
      { "Дата": "Выигрышей", "Время": wins },
      { "Дата": "Проигрышей", "Время": totalT - wins },
      { "Дата": "Winrate", "Время": `${wr}%` },
      { "Дата": "Общий профит", "Время": parseFloat(totalProf.toFixed(2)) },
    ]

    const ws = XLSX.utils.json_to_sheet([...rows, ...summaryRows])
    ws["!cols"] = [
      { wch: 12 }, { wch: 8 }, { wch: 18 }, { wch: 12 },
      { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 12 },
    ]
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, "Журнал сделок")
    const suffix = exportFrom ? `${exportFrom}_${exportTo}` : todayDate()
    XLSX.writeFile(wb, `trade_journal_${suffix}.xlsx`)
  }

  // Stats
  const total = trades.length
  const wins = trades.filter((t) => t.won).length
  const losses = total - wins
  const winrate = total > 0 ? Math.round((wins / total) * 100) : 0
  const totalProfit = trades.reduce((s, t) => s + t.profit, 0)
  const avgPayout = total > 0 ? Math.round(trades.reduce((s, t) => s + t.payout, 0) / total) : payout

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

  // Mini chart: cumulative profit over last 20 trades (oldest → newest)
  const chartTrades = [...trades].reverse().slice(-20)
  const chartPoints = (() => {
    if (chartTrades.length < 2) return null
    const W = 240, H = 56, pad = 4
    let cumulative = 0
    const values = chartTrades.map((t) => { cumulative += t.profit; return cumulative })
    const min = Math.min(0, ...values)
    const max = Math.max(0, ...values)
    const range = max - min || 1
    const pts = values.map((v, i) => {
      const x = pad + (i / (values.length - 1)) * (W - pad * 2)
      const y = H - pad - ((v - min) / range) * (H - pad * 2)
      return { x, y, v }
    })
    const zeroY = H - pad - ((0 - min) / range) * (H - pad * 2)
    const polyline = pts.map((p) => `${p.x},${p.y}`).join(" ")
    const fill = `${pts[0].x},${zeroY} ` + polyline + ` ${pts[pts.length - 1].x},${zeroY}`
    const lastPositive = values[values.length - 1] >= 0
    return { pts, polyline, fill, zeroY, lastPositive, W, H, final: values[values.length - 1] }
  })()

  const payoutColor = payout >= 85 ? "text-green-400" : payout >= 75 ? "text-yellow-400" : "text-red-400"

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
                onClick={() => setShowExportPanel((v) => !v)}
                className={`text-xs font-space-mono px-2 py-1 rounded-lg border transition-colors ${showExportPanel ? "bg-zinc-700 border-zinc-500 text-zinc-200" : "border-zinc-700 text-zinc-500 hover:text-zinc-300 hover:border-zinc-500"}`}
                title="Выгрузка в файл"
              >
                <Icon name="Download" size={13} />
              </button>
              <button onClick={clearAll} className="text-zinc-600 hover:text-red-400 transition-colors" title="Очистить журнал">
                <Icon name="Trash2" size={14} />
              </button>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">

        {/* Export panel */}
        {showExportPanel && (
          <div className="bg-zinc-800/70 border border-zinc-700 rounded-xl p-3 space-y-3">
            <p className="text-zinc-400 font-space-mono text-xs font-bold">Выгрузка сделок</p>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-zinc-500 font-space-mono text-xs mb-1 block">С даты</Label>
                <input
                  type="date"
                  value={exportFrom}
                  onChange={(e) => setExportFrom(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-700 text-white font-space-mono text-xs rounded-lg px-2 py-1.5 outline-none focus:border-zinc-500"
                />
              </div>
              <div>
                <Label className="text-zinc-500 font-space-mono text-xs mb-1 block">По дату</Label>
                <input
                  type="date"
                  value={exportTo}
                  onChange={(e) => setExportTo(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-700 text-white font-space-mono text-xs rounded-lg px-2 py-1.5 outline-none focus:border-zinc-500"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5 flex-wrap">
                {[
                  { label: "Сегодня", from: todayDate(), to: todayDate() },
                  { label: "Неделя", from: new Date(Date.now() - 7 * 86400000).toISOString().slice(0, 10), to: todayDate() },
                  { label: "Месяц", from: new Date(Date.now() - 30 * 86400000).toISOString().slice(0, 10), to: todayDate() },
                  { label: "Всё", from: "", to: todayDate() },
                ].map((p) => (
                  <button
                    key={p.label}
                    onClick={() => { setExportFrom(p.from); setExportTo(p.to) }}
                    className="text-xs font-space-mono px-2 py-1 rounded-lg bg-zinc-700 hover:bg-zinc-600 text-zinc-300 transition-colors"
                  >
                    {p.label}
                  </button>
                ))}
              </div>
              <div className="ml-auto flex gap-2">
                <button
                  onClick={exportCSV}
                  className="text-xs font-space-mono px-3 py-1.5 rounded-lg bg-zinc-700 hover:bg-zinc-600 text-green-400 border border-zinc-600 transition-colors flex items-center gap-1.5"
                >
                  <Icon name="FileDown" size={12} /> CSV
                </button>
                <button
                  onClick={exportExcel}
                  className="text-xs font-space-mono px-3 py-1.5 rounded-lg bg-emerald-900/40 hover:bg-emerald-900/60 text-emerald-400 border border-emerald-700/40 transition-colors flex items-center gap-1.5"
                >
                  <Icon name="Sheet" size={12} /> Excel
                </button>
              </div>
            </div>
            {(() => {
              const cnt = getFilteredTrades().length
              return (
                <p className="text-zinc-600 font-space-mono text-xs">
                  {cnt > 0 ? `Будет выгружено: ${cnt} сделок` : "Нет сделок за выбранный период"}
                </p>
              )
            })()}
          </div>
        )}

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
            <p className={`font-orbitron font-bold text-sm ${profitColor}`}>
              {totalProfit >= 0 ? "+" : ""}{totalProfit.toFixed(2)}$
            </p>
          </div>
        </div>

        {/* Mini chart */}
        {chartPoints && (
          <div className="bg-zinc-800/60 rounded-xl p-3">
            <div className="flex items-center justify-between mb-2">
              <p className="text-zinc-500 font-space-mono text-xs">Кривая профита ({chartTrades.length} сделок)</p>
              <p className={`font-orbitron font-bold text-xs ${chartPoints.lastPositive ? "text-green-400" : "text-red-400"}`}>
                {chartPoints.final >= 0 ? "+" : ""}{chartPoints.final.toFixed(2)}$
              </p>
            </div>
            <svg viewBox={`0 0 ${chartPoints.W} ${chartPoints.H}`} className="w-full" style={{ height: 56 }} preserveAspectRatio="none">
              <line x1={4} y1={chartPoints.zeroY} x2={chartPoints.W - 4} y2={chartPoints.zeroY} stroke="#3f3f46" strokeWidth="1" strokeDasharray="3 3" />
              <polygon points={chartPoints.fill} fill={chartPoints.lastPositive ? "rgba(34,197,94,0.08)" : "rgba(239,68,68,0.08)"} />
              <polyline points={chartPoints.polyline} fill="none" stroke={chartPoints.lastPositive ? "#22c55e" : "#ef4444"} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
              {chartPoints.pts.map((p, i) => (
                <circle key={i} cx={p.x} cy={p.y} r="2" fill={chartTrades[i].won ? "#22c55e" : "#ef4444"} />
              ))}
              {(() => {
                const last = chartPoints.pts[chartPoints.pts.length - 1]
                return <circle cx={last.x} cy={last.y} r="3.5" fill={chartPoints.lastPositive ? "#22c55e" : "#ef4444"} stroke="#18181b" strokeWidth="1.5" />
              })()}
            </svg>
          </div>
        )}

        {/* Streak */}
        {streak.count >= 2 && (
          <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-space-mono
            ${streak.type === "win" ? "bg-green-500/10 border-green-500/30 text-green-400" : "bg-red-500/10 border-red-500/30 text-red-400"}`}>
            <span>{streak.type === "win" ? "🔥" : "❄️"}</span>
            {streak.type === "win"
              ? `Серия побед: ${streak.count} подряд`
              : `Серия потерь: ${streak.count} подряд${streak.count >= 3 ? " — рекомендуем паузу" : ""}`}
          </div>
        )}

        {/* Input */}
        <div className="space-y-3">

          {/* Asset + bet */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-zinc-500 font-space-mono text-xs mb-1 block">Актив</Label>
              <Input value={asset} onChange={(e) => setAsset(e.target.value)} className="bg-zinc-800 border-zinc-700 text-white font-space-mono text-xs h-8" />
            </div>
            <div>
              <Label className="text-zinc-500 font-space-mono text-xs mb-1 block">Ставка ($)</Label>
              <Input type="number" value={bet} onChange={(e) => setBet(Number(e.target.value))} className="bg-zinc-800 border-zinc-700 text-white font-space-mono text-xs h-8" />
            </div>
          </div>

          {/* Payout % */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <Label className="text-zinc-500 font-space-mono text-xs">Выплата при WIN (%)</Label>
              <span className={`font-orbitron font-bold text-sm ${payoutColor}`}>{payout}%</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min={50} max={100} step={1}
                value={payout}
                onChange={(e) => setPayout(Number(e.target.value))}
                className="flex-1 accent-red-500 h-1.5 rounded cursor-pointer"
              />
            </div>
            <div className="flex justify-between text-zinc-600 font-space-mono text-xs mt-0.5">
              <span>50% (мин)</span>
              <span className="text-zinc-500">~{(bet * payout / 100).toFixed(2)}$ профит</span>
              <span>100%</span>
            </div>
          </div>

          {/* Date/time toggle */}
          <div>
            <button
              onClick={() => setUseManualTime((v) => !v)}
              className="flex items-center gap-2 text-zinc-500 hover:text-zinc-300 transition-colors font-space-mono text-xs"
            >
              <Icon name={useManualTime ? "ChevronUp" : "ChevronDown"} size={12} />
              {useManualTime ? "Скрыть дату и время" : "Указать дату и время вручную"}
            </button>

            {useManualTime && (
              <div className="grid grid-cols-2 gap-2 mt-2">
                <div>
                  <Label className="text-zinc-500 font-space-mono text-xs mb-1 block">Дата</Label>
                  <Input
                    type="date"
                    value={tradeDate}
                    onChange={(e) => setTradeDate(e.target.value)}
                    className="bg-zinc-800 border-zinc-700 text-white font-space-mono text-xs h-8"
                  />
                </div>
                <div>
                  <Label className="text-zinc-500 font-space-mono text-xs mb-1 block">Время</Label>
                  <Input
                    type="time"
                    value={tradeTime}
                    onChange={(e) => setTradeTime(e.target.value)}
                    className="bg-zinc-800 border-zinc-700 text-white font-space-mono text-xs h-8"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Direction */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setDirection("CALL")}
              className={`py-2 rounded-lg font-orbitron text-xs font-bold border transition-all
                ${direction === "CALL" ? "bg-green-500/20 border-green-500/50 text-green-400" : "bg-zinc-800 border-zinc-700 text-zinc-500 hover:border-zinc-500"}`}
            >
              ▲ CALL
            </button>
            <button
              onClick={() => setDirection("PUT")}
              className={`py-2 rounded-lg font-orbitron text-xs font-bold border transition-all
                ${direction === "PUT" ? "bg-red-500/20 border-red-500/50 text-red-400" : "bg-zinc-800 border-zinc-700 text-zinc-500 hover:border-zinc-500"}`}
            >
              ▼ PUT
            </button>
          </div>

          {/* WIN / LOSS */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => addTrade(true)}
              className={`py-3 rounded-xl font-orbitron font-bold text-sm border transition-all duration-150
                ${justAdded === "win" ? "bg-green-400 border-green-400 text-black scale-95" : "bg-green-500/20 border-green-500/40 text-green-400 hover:bg-green-500/30 active:scale-95"}`}
            >
              ✓ WIN
            </button>
            <button
              onClick={() => addTrade(false)}
              className={`py-3 rounded-xl font-orbitron font-bold text-sm border transition-all duration-150
                ${justAdded === "loss" ? "bg-red-500 border-red-500 text-white scale-95" : "bg-red-500/20 border-red-500/40 text-red-400 hover:bg-red-500/30 active:scale-95"}`}
            >
              ✗ LOSS
            </button>
          </div>
        </div>

        {/* History */}
        {total > 0 && (
          <div>
            <button
              onClick={() => setShowHistory((v) => !v)}
              className="w-full flex items-center justify-between text-zinc-500 hover:text-zinc-300 transition-colors py-1"
            >
              <span className="font-space-mono text-xs">История ({total} сделок) · ср. выплата {avgPayout}%</span>
              <Icon name={showHistory ? "ChevronUp" : "ChevronDown"} size={14} />
            </button>

            {showHistory && (
              <div className="mt-2 space-y-1.5 max-h-56 overflow-y-auto pr-1">
                {trades.map((t) => (
                  <div
                    key={t.id}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-space-mono group
                      ${t.won ? "bg-green-500/5 border-green-500/20" : "bg-red-500/5 border-red-500/20"}`}
                  >
                    <span className={t.won ? "text-green-400" : "text-red-400"}>{t.won ? "✓" : "✗"}</span>
                    <span className="text-zinc-600">{t.date?.slice(5)} {t.time}</span>
                    <span className="text-zinc-300 flex-1 truncate">{t.asset}</span>
                    <span className={t.direction === "CALL" ? "text-green-400" : "text-red-400"}>{t.direction}</span>
                    <span className="text-zinc-500">{t.payout ?? 82}%</span>
                    <span className="text-zinc-400">${t.bet}</span>
                    <span className={t.profit >= 0 ? "text-green-400" : "text-red-400"}>
                      {t.profit >= 0 ? "+" : ""}{t.profit.toFixed(2)}$
                    </span>
                    <button onClick={() => removeTrade(t.id)} className="text-zinc-700 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100">
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