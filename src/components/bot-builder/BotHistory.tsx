import { useState } from "react"
import { POBotConfig } from "./PocketOptionBotTypes"
import Icon from "@/components/ui/icon"
import { Button } from "@/components/ui/button"

export interface BotHistoryEntry {
  id: string
  date: string
  time: string
  botName: string
  strategy: string
  asset: string
  betAmount: number
  currency: string
  isDemo: boolean
  config: POBotConfig
}

const STORAGE_KEY = "po_bot_history"
const MAX_ENTRIES = 50

export function loadBotHistory(): BotHistoryEntry[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]")
  } catch {
    return []
  }
}

export function saveBotToHistory(config: POBotConfig) {
  const history = loadBotHistory()
  const now = new Date()
  const entry: BotHistoryEntry = {
    id: Date.now().toString(),
    date: now.toLocaleDateString("ru-RU"),
    time: now.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" }),
    botName: config.botName,
    strategy: config.comboMode ? "Комбо" : config.strategy,
    asset: config.asset,
    betAmount: config.betAmount,
    currency: config.currency,
    isDemo: config.isDemo,
    config,
  }
  const updated = [entry, ...history].slice(0, MAX_ENTRIES)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
}

const STRATEGY_LABELS: Record<string, string> = {
  rsi_reversal: "RSI Разворот",
  ema_cross: "EMA Пересечение",
  bb_squeeze: "Bollinger Bands",
  macd_signal: "MACD Сигнал",
  rufus: "Rufus",
  Комбо: "Комбо",
}

interface BotHistoryProps {
  onRestore: (config: POBotConfig) => void
}

export default function BotHistory({ onRestore }: BotHistoryProps) {
  const [history, setHistory] = useState<BotHistoryEntry[]>(loadBotHistory)
  const [expanded, setExpanded] = useState(false)
  const [confirmClear, setConfirmClear] = useState(false)

  const removeEntry = (id: string) => {
    const updated = history.filter((e) => e.id !== id)
    setHistory(updated)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
  }

  const clearAll = () => {
    setHistory([])
    localStorage.removeItem(STORAGE_KEY)
    setConfirmClear(false)
  }

  if (history.length === 0) return null

  return (
    <div className="rounded-xl border border-white/10 bg-white/5 overflow-hidden">
      <button
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-white/5 transition-colors"
        onClick={() => setExpanded((v) => !v)}
      >
        <div className="flex items-center gap-2 text-sm font-medium text-white/80">
          <Icon name="History" size={16} />
          История созданных ботов
          <span className="text-xs bg-white/10 text-white/60 rounded-full px-2 py-0.5">{history.length}</span>
        </div>
        <Icon name={expanded ? "ChevronUp" : "ChevronDown"} size={16} className="text-white/40" />
      </button>

      {expanded && (
        <div className="border-t border-white/10">
          <div className="max-h-80 overflow-y-auto divide-y divide-white/5">
            {history.map((entry) => (
              <div key={entry.id} className="flex items-center gap-3 px-5 py-3 hover:bg-white/5 transition-colors group">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-medium text-white truncate">{entry.botName}</span>
                    <span className={`text-xs px-1.5 py-0.5 rounded ${entry.isDemo ? "bg-yellow-500/20 text-yellow-400" : "bg-green-500/20 text-green-400"}`}>
                      {entry.isDemo ? "Демо" : "Реал"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5 text-xs text-white/40 flex-wrap">
                    <span>{entry.date} {entry.time}</span>
                    <span>·</span>
                    <span>{STRATEGY_LABELS[entry.strategy] ?? entry.strategy}</span>
                    <span>·</span>
                    <span>{entry.asset}</span>
                    <span>·</span>
                    <span>{entry.betAmount} {entry.currency}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-7 px-2 text-xs text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
                    onClick={() => onRestore(entry.config)}
                  >
                    <Icon name="RotateCcw" size={12} className="mr-1" />
                    Восстановить
                  </Button>
                  <button
                    className="p-1.5 text-white/20 hover:text-red-400 transition-colors rounded"
                    onClick={() => removeEntry(entry.id)}
                  >
                    <Icon name="X" size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="px-5 py-3 border-t border-white/10 flex justify-end">
            {confirmClear ? (
              <div className="flex items-center gap-2 text-sm">
                <span className="text-white/50">Очистить всё?</span>
                <Button size="sm" variant="ghost" className="h-7 px-2 text-red-400 hover:text-red-300" onClick={clearAll}>Да</Button>
                <Button size="sm" variant="ghost" className="h-7 px-2 text-white/40" onClick={() => setConfirmClear(false)}>Нет</Button>
              </div>
            ) : (
              <button
                className="text-xs text-white/30 hover:text-red-400 transition-colors"
                onClick={() => setConfirmClear(true)}
              >
                Очистить историю
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
