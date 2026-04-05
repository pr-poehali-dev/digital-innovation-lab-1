import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Icon from "@/components/ui/icon"
import * as XLSX from "xlsx"

const API = "https://functions.poehali.dev/317c9913-52da-4683-920f-963c978a3202"

interface Session {
  id: string
  bot_name: string
  strategy: string
  asset: string
  bet_amount: number
  currency: string
  is_demo: boolean
  started_at: string
  ended_at: string | null
  total_trades: number
  wins: number
  losses: number
  total_profit: number
}

interface Trade {
  id: string
  traded_at: string
  asset: string
  direction: string
  bet: number
  payout_pct: number
  won: boolean
  profit: number
}

function fmt(iso: string) {
  const d = new Date(iso)
  return d.toLocaleDateString("ru-RU") + " " + d.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" })
}

function fmtTime(iso: string) {
  return new Date(iso).toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit", second: "2-digit" })
}

const STRATEGY_LABELS: Record<string, string> = {
  rsi_reversal: "RSI Разворот",
  ema_cross: "EMA Пересечение",
  bb_squeeze: "Bollinger Bands",
  macd_signal: "MACD Сигнал",
  rufus: "Rufus",
  combo: "Комбо",
}

export default function TradeSessions() {
  const [sessions, setSessions] = useState<Session[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedSession, setSelectedSession] = useState<Session | null>(null)
  const [trades, setTrades] = useState<Trade[]>([])
  const [tradesLoading, setTradesLoading] = useState(false)
  const [open, setOpen] = useState(false)

  const loadSessions = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch(`${API}/sessions`)
      const data = await res.json()
      setSessions(data.sessions || [])
    } catch { /* silent */ }
    setLoading(false)
  }, [])

  useEffect(() => {
    if (!open) return
    loadSessions()
    const interval = setInterval(loadSessions, 60 * 60 * 1000)
    return () => clearInterval(interval)
  }, [open, loadSessions])

  const loadTrades = async (session: Session) => {
    setSelectedSession(session)
    setTradesLoading(true)
    setTrades([])
    try {
      const res = await fetch(`${API}/trades?session_id=${session.id}`)
      const data = await res.json()
      setTrades(data.trades || [])
    } catch { /* silent */ }
    setTradesLoading(false)
  }

  const exportCSV = (session: Session, sessionTrades: Trade[]) => {
    const header = "Время,Актив,Направление,Ставка,Выплата%,Результат,Профит"
    const rows = sessionTrades.map((t) =>
      [fmtTime(t.traded_at), t.asset, t.direction, t.bet, t.payout_pct, t.won ? "WIN" : "LOSS", t.profit.toFixed(2)].join(",")
    )
    const csv = [header, ...rows].join("\n")
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${session.bot_name}_${session.started_at.slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const exportExcel = (session: Session, sessionTrades: Trade[]) => {
    const wr = session.total_trades > 0 ? Math.round((session.wins / session.total_trades) * 100) : 0
    const rows = sessionTrades.map((t) => ({
      "Время": fmtTime(t.traded_at),
      "Актив": t.asset,
      "Направление": t.direction,
      "Ставка": t.bet,
      "Выплата %": t.payout_pct,
      "Результат": t.won ? "WIN" : "LOSS",
      "Профит": parseFloat(t.profit.toFixed(2)),
    }))
    const summary = [
      {},
      { "Время": `=== ИТОГИ: ${session.bot_name} ===` },
      { "Время": "Старт", "Актив": fmt(session.started_at) },
      { "Время": "Сделок", "Актив": session.total_trades },
      { "Время": "Выигрышей", "Актив": session.wins },
      { "Время": "Проигрышей", "Актив": session.losses },
      { "Время": "Winrate", "Актив": `${wr}%` },
      { "Время": "Профит", "Актив": parseFloat(session.total_profit.toFixed(2)) },
    ]
    const ws = XLSX.utils.json_to_sheet([...rows, ...summary])
    ws["!cols"] = [{ wch: 10 }, { wch: 18 }, { wch: 12 }, { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 12 }]
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, "Сделки")
    XLSX.writeFile(wb, `${session.bot_name}_${session.started_at.slice(0, 10)}.xlsx`)
  }

  // Chart helper
  const buildChart = (sessionTrades: Trade[]) => {
    if (sessionTrades.length < 2) return null
    const W = 300, H = 56, pad = 4
    let cum = 0
    const values = sessionTrades.map((t) => { cum += t.profit; return cum })
    const min = Math.min(0, ...values)
    const max = Math.max(0, ...values)
    const range = max - min || 1
    const pts = values.map((v, i) => ({
      x: pad + (i / (values.length - 1)) * (W - pad * 2),
      y: H - pad - ((v - min) / range) * (H - pad * 2),
    }))
    const zeroY = H - pad - ((0 - min) / range) * (H - pad * 2)
    const polyline = pts.map((p) => `${p.x},${p.y}`).join(" ")
    const fill = `${pts[0].x},${zeroY} ` + polyline + ` ${pts[pts.length - 1].x},${zeroY}`
    const positive = values[values.length - 1] >= 0
    return { pts, polyline, fill, zeroY, positive, W, H }
  }

  const totalSessions = sessions.length
  const activeSessions = sessions.filter((s) => !s.ended_at).length

  const totalTrades = sessions.reduce((a, s) => a + s.total_trades, 0)
  const totalWins = sessions.reduce((a, s) => a + s.wins, 0)
  const totalProfit = sessions.reduce((a, s) => a + s.total_profit, 0)
  const avgWinrate = totalTrades > 0 ? Math.round((totalWins / totalTrades) * 100) : 0
  const bestSession = sessions.reduce((best, s) => (!best || s.total_profit > best.total_profit ? s : best), null as Session | null)
  const worstSession = sessions.reduce((worst, s) => (!worst || s.total_profit < worst.total_profit ? s : worst), null as Session | null)

  return (
    <Card className="bg-zinc-900 border-zinc-700">
      <CardHeader className="pb-3">
        <button
          className="flex items-center justify-between w-full"
          onClick={() => setOpen((v) => !v)}
        >
          <CardTitle className="font-orbitron text-white text-base flex items-center gap-2">
            <Icon name="BarChart2" size={16} className="text-blue-400" />
            Журнал торговых сессий
            {totalSessions > 0 && (
              <span className="text-xs bg-white/10 text-white/60 rounded-full px-2 py-0.5">{totalSessions}</span>
            )}
            {activeSessions > 0 && (
              <span className="text-xs bg-green-500/20 text-green-400 rounded-full px-2 py-0.5 animate-pulse">
                {activeSessions} активна
              </span>
            )}
          </CardTitle>
          <Icon name={open ? "ChevronUp" : "ChevronDown"} size={16} className="text-zinc-500" />
        </button>
      </CardHeader>

      {open && (
        <CardContent className="space-y-4 pt-0">
          <p className="text-zinc-500 font-space-mono text-xs">
            Данные автоматически поступают от запущенных ботов. Каждый запуск бота создаёт новую сессию.
          </p>

          <div className="flex justify-end">
            <Button
              size="sm"
              variant="outline"
              onClick={loadSessions}
              disabled={loading}
              className="border-zinc-700 text-zinc-400 hover:text-white font-space-mono text-xs h-7"
            >
              <Icon name={loading ? "Loader" : "RefreshCw"} size={12} className={`mr-1 ${loading ? "animate-spin" : ""}`} />
              Обновить
            </Button>
          </div>

          {/* Summary stats */}
          {sessions.length > 0 && (
            <div className="rounded-xl border border-zinc-700 bg-zinc-800/40 p-4 space-y-3">
              <p className="text-zinc-400 font-orbitron text-xs font-semibold uppercase tracking-wider">Общая статистика</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-zinc-900 rounded-lg p-3 text-center">
                  <p className="text-zinc-500 font-space-mono text-xs mb-1">Сессий</p>
                  <p className="text-white font-orbitron text-lg font-bold">{totalSessions}</p>
                </div>
                <div className="bg-zinc-900 rounded-lg p-3 text-center">
                  <p className="text-zinc-500 font-space-mono text-xs mb-1">Сделок</p>
                  <p className="text-white font-orbitron text-lg font-bold">{totalTrades}</p>
                </div>
                <div className="bg-zinc-900 rounded-lg p-3 text-center">
                  <p className="text-zinc-500 font-space-mono text-xs mb-1">Винрейт</p>
                  <p className={`font-orbitron text-lg font-bold ${avgWinrate >= 60 ? "text-green-400" : avgWinrate >= 50 ? "text-yellow-400" : "text-red-400"}`}>
                    {avgWinrate}%
                  </p>
                </div>
                <div className="bg-zinc-900 rounded-lg p-3 text-center">
                  <p className="text-zinc-500 font-space-mono text-xs mb-1">Профит</p>
                  <p className={`font-orbitron text-lg font-bold ${totalProfit >= 0 ? "text-green-400" : "text-red-400"}`}>
                    {totalProfit >= 0 ? "+" : ""}{totalProfit.toFixed(2)}
                  </p>
                </div>
              </div>
              {(bestSession || worstSession) && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  {bestSession && bestSession.total_profit > 0 && (
                    <div className="flex items-center gap-2 bg-green-500/5 border border-green-500/20 rounded-lg px-3 py-2">
                      <Icon name="TrendingUp" size={14} className="text-green-400 shrink-0" />
                      <div className="min-w-0">
                        <p className="text-zinc-500 font-space-mono text-xs">Лучшая сессия</p>
                        <p className="text-green-400 font-orbitron text-xs truncate">{bestSession.bot_name} <span className="text-green-300">+{bestSession.total_profit.toFixed(2)}</span></p>
                      </div>
                    </div>
                  )}
                  {worstSession && worstSession.total_profit < 0 && (
                    <div className="flex items-center gap-2 bg-red-500/5 border border-red-500/20 rounded-lg px-3 py-2">
                      <Icon name="TrendingDown" size={14} className="text-red-400 shrink-0" />
                      <div className="min-w-0">
                        <p className="text-zinc-500 font-space-mono text-xs">Худшая сессия</p>
                        <p className="text-red-400 font-orbitron text-xs truncate">{worstSession.bot_name} <span className="text-red-300">{worstSession.total_profit.toFixed(2)}</span></p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Session list */}
          {sessions.length === 0 && !loading && (
            <div className="text-center py-8 text-zinc-600 font-space-mono text-xs">
              <Icon name="Inbox" size={32} className="mx-auto mb-2 opacity-30" />
              Нет сессий. Запусти бота — данные появятся автоматически.
            </div>
          )}

          <div className="space-y-2">
            {sessions.map((s) => {
              const wr = s.total_trades > 0 ? Math.round((s.wins / s.total_trades) * 100) : 0
              const wrColor = wr >= 60 ? "text-green-400" : wr >= 50 ? "text-yellow-400" : "text-red-400"
              const profColor = s.total_profit >= 0 ? "text-green-400" : "text-red-400"
              const isActive = !s.ended_at
              const isSelected = selectedSession?.id === s.id

              return (
                <div
                  key={s.id}
                  className={`rounded-xl border transition-all ${isSelected ? "border-blue-500/50 bg-blue-500/5" : "border-zinc-800 bg-zinc-800/40 hover:border-zinc-700"}`}
                >
                  {/* Session header */}
                  <button
                    className="w-full flex items-center gap-3 p-3 text-left"
                    onClick={() => isSelected ? setSelectedSession(null) : loadTrades(s)}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-orbitron font-semibold text-white">{s.bot_name}</span>
                        <span className={`text-xs px-1.5 py-0.5 rounded ${s.is_demo ? "bg-yellow-500/20 text-yellow-400" : "bg-green-500/20 text-green-400"}`}>
                          {s.is_demo ? "Демо" : "Реал"}
                        </span>
                        {isActive && (
                          <span className="text-xs bg-blue-500/20 text-blue-400 rounded px-1.5 py-0.5 animate-pulse">Live</span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-1 text-xs text-zinc-500 font-space-mono flex-wrap">
                        <span>{fmt(s.started_at)}</span>
                        <span>·</span>
                        <span>{STRATEGY_LABELS[s.strategy] ?? s.strategy}</span>
                        <span>·</span>
                        <span>{s.asset}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 shrink-0 text-right">
                      <div>
                        <div className={`text-sm font-orbitron font-bold ${profColor}`}>
                          {s.total_profit >= 0 ? "+" : ""}{s.total_profit.toFixed(2)} {s.currency}
                        </div>
                        <div className="text-xs text-zinc-600 font-space-mono">{s.total_trades} сделок</div>
                      </div>
                      <div>
                        <div className={`text-sm font-orbitron font-bold ${wrColor}`}>{wr}%</div>
                        <div className="text-xs text-zinc-600 font-space-mono">{s.wins}W / {s.losses}L</div>
                      </div>
                      <Icon name={isSelected ? "ChevronUp" : "ChevronDown"} size={14} className="text-zinc-600" />
                    </div>
                  </button>

                  {/* Expanded trades */}
                  {isSelected && (
                    <div className="border-t border-zinc-800 p-3 space-y-3">
                      {tradesLoading ? (
                        <div className="flex items-center gap-2 text-zinc-500 font-space-mono text-xs py-4 justify-center">
                          <Icon name="Loader" size={14} className="animate-spin" />
                          Загрузка сделок...
                        </div>
                      ) : (
                        <>
                          {/* Chart */}
                          {trades.length >= 2 && (() => {
                            const chart = buildChart(trades)
                            if (!chart) return null
                            return (
                              <div className="bg-zinc-900 rounded-lg p-2 border border-zinc-800">
                                <svg width="100%" viewBox={`0 0 ${chart.W} ${chart.H}`} preserveAspectRatio="none" className="h-14">
                                  <line x1={0} y1={chart.zeroY} x2={chart.W} y2={chart.zeroY} stroke="#3f3f46" strokeWidth="1" />
                                  <polygon points={chart.fill} fill={chart.positive ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)"} />
                                  <polyline points={chart.polyline} fill="none" stroke={chart.positive ? "#22c55e" : "#ef4444"} strokeWidth="1.5" strokeLinejoin="round" />
                                </svg>
                              </div>
                            )
                          })()}

                          {/* Stats row */}
                          <div className="grid grid-cols-4 gap-2">
                            {[
                              { label: "Сделок", value: s.total_trades },
                              { label: "Winrate", value: `${wr}%`, color: wrColor },
                              { label: "Профит", value: `${s.total_profit >= 0 ? "+" : ""}${s.total_profit.toFixed(2)}`, color: profColor },
                              { label: "Ср. ставка", value: `${s.bet_amount} ${s.currency}` },
                            ].map(({ label, value, color }) => (
                              <div key={label} className="bg-zinc-900 rounded-lg p-2 text-center border border-zinc-800">
                                <div className={`text-sm font-orbitron font-bold ${color || "text-white"}`}>{value}</div>
                                <div className="text-xs text-zinc-600 font-space-mono mt-0.5">{label}</div>
                              </div>
                            ))}
                          </div>

                          {/* Export buttons */}
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => exportCSV(s, trades)}
                              className="border-zinc-700 text-zinc-400 hover:text-white font-space-mono text-xs h-7"
                            >
                              <Icon name="Download" size={12} className="mr-1" />
                              CSV
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => exportExcel(s, trades)}
                              className="border-green-700/50 text-green-500 hover:text-green-300 font-space-mono text-xs h-7"
                            >
                              <Icon name="FileSpreadsheet" size={12} className="mr-1" />
                              Excel
                            </Button>
                          </div>

                          {/* Trades table */}
                          {trades.length > 0 ? (
                            <div className="max-h-64 overflow-y-auto rounded-lg border border-zinc-800">
                              <table className="w-full text-xs font-space-mono">
                                <thead className="bg-zinc-900 sticky top-0">
                                  <tr className="text-zinc-500">
                                    <th className="text-left px-3 py-2">Время</th>
                                    <th className="text-left px-3 py-2">Актив</th>
                                    <th className="text-left px-3 py-2">Напр.</th>
                                    <th className="text-right px-3 py-2">Ставка</th>
                                    <th className="text-right px-3 py-2">Профит</th>
                                    <th className="text-center px-3 py-2">Рез.</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-zinc-800">
                                  {[...trades].reverse().map((t) => (
                                    <tr key={t.id} className="hover:bg-zinc-800/50">
                                      <td className="px-3 py-2 text-zinc-400">{fmtTime(t.traded_at)}</td>
                                      <td className="px-3 py-2 text-zinc-300">{t.asset}</td>
                                      <td className={`px-3 py-2 font-bold ${t.direction === "CALL" ? "text-green-400" : "text-red-400"}`}>{t.direction}</td>
                                      <td className="px-3 py-2 text-right text-zinc-300">{t.bet}</td>
                                      <td className={`px-3 py-2 text-right font-bold ${t.profit >= 0 ? "text-green-400" : "text-red-400"}`}>
                                        {t.profit >= 0 ? "+" : ""}{t.profit.toFixed(2)}
                                      </td>
                                      <td className="px-3 py-2 text-center">{t.won ? "✅" : "❌"}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          ) : (
                            <p className="text-zinc-600 font-space-mono text-xs text-center py-4">Сделок пока нет</p>
                          )}
                        </>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </CardContent>
      )}
    </Card>
  )
}