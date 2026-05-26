import { useState, useMemo } from "react"
import TradeBaseFiltersCard from "./TradeBaseFiltersCard"
import SrPresetsBlock from "./SrPresetsBlock"
import TelegramNotifyCard from "./TelegramNotifyCard"
import TradeDirectionCard from "./TradeDirectionCard"
import BetManagementCard from "./BetManagementCard"
import MartingaleAndSafetyCards from "./MartingaleAndSafetyCards"
import HedgingCards from "./HedgingCards"
import BotWarmupAndProfitExtensionCards from "./BotWarmupAndProfitExtensionCards"
import IndicatorSettingsCards from "./IndicatorSettingsCards"
import ComboIndicatorSettingsCards from "./ComboIndicatorSettingsCards"
import StrategySelectorCards from "./StrategySelectorCards"
import SafetyCheckBanner from "./SafetyCheckBanner"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Icon from "@/components/ui/icon"
import {
  POBotConfig,
  POStrategy,
  POExpiry,
  POComboLogic,
  POEmaTrendMode,
  PO_STRATEGIES,
  PO_ASSETS,
  PO_ASSETS_GROUPS,
  PO_EXPIRY_LABELS,
} from "./PocketOptionBotTypes"

const TREND_SCANNER_URL = "https://functions.poehali.dev/371ca5f1-ae59-4842-a669-eef3d16a149e"
const TG_SEND_URL = "https://functions.poehali.dev/fb70e0a6-b6c1-49e2-b148-c37dab50f024"

interface TrendResult {
  asset: string
  asset_otc: string
  category: "crypto" | "forex"
  change_pct: number
  trend_strength: number
  direction: "UP" | "DOWN"
  volume_usd?: number
  position_in_range: number | null
  stability_score?: number
  std_pct?: number
  slope_pct?: number
}

const EXPIRY_OPTIONS = [
  { value: 1, label: "1 мин" }, { value: 2, label: "2 мин" }, { value: 3, label: "3 мин" },
  { value: 5, label: "5 мин" }, { value: 15, label: "15 мин" }, { value: 30, label: "30 мин" },
  { value: 45, label: "45 мин" }, { value: 60, label: "1 час" },
]
const TIMEFRAME_OPTIONS = [
  { value: 5, label: "5 мин" }, { value: 30, label: "30 мин" }, { value: 60, label: "1 час" },
  { value: 180, label: "3 часа" }, { value: 360, label: "6 часов" }, { value: 720, label: "12 часов" },
  { value: 1440, label: "1 день" },
]

function TrendScanner({ onSelect }: { onSelect: (asset: string) => void }) {
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<TrendResult[] | null>(null)
  const [candles, setCandles] = useState(20)
  const [expiry, setExpiry] = useState(5)
  const [timeframe, setTimeframe] = useState(5)
  const [error, setError] = useState<string | null>(null)
  const [collapsed, setCollapsed] = useState(false)
  const [payouts, setPayouts] = useState<Record<string, string>>({})
  const [minPayout, setMinPayout] = useState<string>("80")

  function setPayout(asset: string, val: string) {
    setPayouts((p) => ({ ...p, [asset]: val }))
  }

  const minPct = Number(minPayout) || 0

  const { upList, downList } = useMemo(() => {
    if (!results) return { upList: [], downList: [] }
    const filtered = results.filter((r) => {
      if (r.category === "crypto") return false
      const pct = Number(payouts[r.asset])
      if (!pct) return true
      return pct >= minPct
    })
    return {
      upList: filtered.filter(r => r.direction === "UP").sort((a, b) => b.trend_strength - a.trend_strength),
      downList: filtered.filter(r => r.direction === "DOWN").sort((a, b) => b.trend_strength - a.trend_strength),
    }
  }, [results, payouts, minPct])

  async function scan() {
    setLoading(true)
    setError(null)
    setResults(null)
    try {
      const params = new URLSearchParams({ candles: String(candles), timeframe: String(timeframe) })
      const url = `${TREND_SCANNER_URL}?${params.toString()}`
      const controller = new AbortController()
      const timer = setTimeout(() => controller.abort(), 30000)
      const resp = await fetch(url, { signal: controller.signal, mode: "cors", credentials: "omit" })
      clearTimeout(timer)
      const text = await resp.text()
      let data: { top?: TrendResult[] }
      try {
        const raw = JSON.parse(text)
        data = raw.body ? (typeof raw.body === "string" ? JSON.parse(raw.body) : raw.body) : raw
      } catch {
        setError(`Ошибка парсинга: ${text.slice(0, 100)}`)
        return
      }
      if (!data.top || data.top.length === 0) {
        setError("Нет данных — попробуй ещё раз")
        return
      }
      setResults(data.top)
      const topUp = data.top.find((r: TrendResult) => r.category === "forex" && r.direction === "UP")
      if (topUp) onSelect(topUp.asset_otc)
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e)
      if (msg.includes("abort") || msg.includes("Abort")) {
        setError("Превышено время ожидания — попробуй ещё раз")
      } else if (msg.includes("Failed to fetch") || msg.includes("NetworkError")) {
        setError("Сетевая ошибка — проверь интернет")
      } else {
        setError(`Ошибка: ${msg}`)
      }
    } finally {
      setLoading(false)
    }
  }

  const maxScore = results ? Math.max(...results.map(r => r.trend_strength), 1) : 1

  function AssetRow({ r, isTop }: { r: TrendResult; isTop: boolean }) {
    const isUp = r.direction === "UP"
    const payoutVal = payouts[r.asset] ?? ""
    const payoutNum = Number(payoutVal)
    const payoutColor = payoutNum >= 85 ? "text-green-400" : payoutNum >= 75 ? "text-yellow-400" : payoutNum > 0 ? "text-red-400" : "text-zinc-500"
    const barPct = (r.trend_strength / maxScore) * 100
    return (
      <div className={`rounded border ${isTop ? (isUp ? "bg-green-500/5 border-green-500/30" : "bg-red-500/5 border-red-500/30") : "bg-zinc-800 border-zinc-700"}`}>
        <div className="flex items-center gap-1.5 px-2 pt-1.5 pb-1">
          <span className={`text-xs font-bold shrink-0 ${isUp ? "text-green-400" : "text-red-400"}`}>{isUp ? "▲" : "▼"}</span>
          <span className={`font-space-mono text-xs flex-1 truncate ${isTop ? (isUp ? "text-green-300 font-bold" : "text-red-300 font-bold") : "text-white"}`}>
            {r.asset}{isTop ? (isUp ? " 🔥" : " 🔻") : ""}
          </span>
          <span className={`font-space-mono text-[10px] shrink-0 ${isUp ? "text-green-500/70" : "text-red-500/70"}`}>
            {r.green}🟢/{r.red}🔴
          </span>
          <div className="flex items-center gap-0.5 shrink-0">
            <input
              type="number" min={0} max={99} placeholder="—" value={payoutVal}
              onClick={(e) => e.stopPropagation()}
              onChange={(e) => setPayout(r.asset, e.target.value)}
              className={`w-9 bg-zinc-900 border border-zinc-600 rounded px-1 text-center font-space-mono text-xs outline-none ${payoutColor}`}
            />
            <span className="text-zinc-600 font-space-mono text-xs">%</span>
          </div>
          <button type="button" onClick={() => onSelect(r.asset_otc)}
            className="shrink-0 text-zinc-500 hover:text-yellow-400 font-space-mono text-xs transition-colors">
            OTC→
          </button>
        </div>
        <div className="w-full bg-zinc-700 rounded-b h-0.5">
          <div className={`h-0.5 rounded-b transition-all ${isUp ? "bg-green-500" : "bg-red-500"}`} style={{ width: `${barPct}%` }} />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {/* Настройки */}
      <div className="bg-zinc-900 border border-zinc-700 rounded-lg p-2.5 space-y-2">
        {/* Кол-во свечей */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-zinc-400 font-space-mono text-xs">Свечей для анализа</span>
            <span className="text-white font-space-mono text-xs font-bold">{candles} шт.</span>
          </div>
          <input
            type="range" min={5} max={100} step={1} value={candles}
            onChange={(e) => setCandles(Number(e.target.value))}
            className="w-full h-1 accent-yellow-400"
          />
          <div className="flex justify-between">
            <span className="text-zinc-600 font-space-mono text-[10px]">5</span>
            <span className="text-zinc-600 font-space-mono text-[10px]">100</span>
          </div>
        </div>

        {/* Время экспирации */}
        <div>
          <span className="text-zinc-400 font-space-mono text-xs block mb-1">Экспирация</span>
          <div className="flex flex-wrap gap-1">
            {EXPIRY_OPTIONS.map((o) => (
              <button key={o.value} type="button" onClick={() => setExpiry(o.value)}
                className={`px-2 h-6 rounded font-space-mono text-xs border transition-colors ${expiry === o.value ? "bg-yellow-500/20 border-yellow-500/50 text-yellow-300" : "bg-zinc-800 border-zinc-700 text-zinc-400 hover:text-white"}`}>
                {o.label}
              </button>
            ))}
          </div>
        </div>

        {/* Временной промежуток */}
        <div>
          <span className="text-zinc-400 font-space-mono text-xs block mb-1">Промежуток свечей</span>
          <div className="flex flex-wrap gap-1">
            {TIMEFRAME_OPTIONS.map((o) => (
              <button key={o.value} type="button" onClick={() => setTimeframe(o.value)}
                className={`px-2 h-6 rounded font-space-mono text-xs border transition-colors ${timeframe === o.value ? "bg-zinc-600 border-zinc-400 text-white" : "bg-zinc-800 border-zinc-700 text-zinc-400 hover:text-white"}`}>
                {o.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Кнопка сканирования */}
      <div className="flex gap-2">
        <Button type="button" onClick={scan} disabled={loading}
          className="flex-1 bg-yellow-500/10 hover:bg-yellow-500/20 border border-yellow-500/30 text-yellow-400 font-space-mono text-xs h-8"
          variant="outline">
          {loading
            ? <><Icon name="Loader2" size={13} className="mr-1.5 animate-spin" />Сканирую...</>
            : <><Icon name="Zap" size={13} className="mr-1.5" />Найти тренд</>
          }
        </Button>
        {results && (
          <Button type="button" onClick={() => setCollapsed(v => !v)} variant="outline"
            className="border-zinc-700 bg-zinc-800 text-zinc-400 hover:text-white h-8 px-2.5">
            <Icon name={collapsed ? "ChevronDown" : "ChevronUp"} size={14} />
          </Button>
        )}
        {results && (
          <Button type="button" onClick={() => { setResults(null); setCollapsed(false) }} variant="outline"
            className="border-zinc-700 bg-zinc-800 text-zinc-400 hover:text-red-400 h-8 px-2.5">
            <Icon name="X" size={14} />
          </Button>
        )}
      </div>

      {error && <p className="text-red-400 font-space-mono text-xs">{error}</p>}

      {results && !collapsed && (
        <>
          {/* Фильтр выплаты */}
          <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2">
            <Icon name="Filter" size={12} className="text-zinc-400 shrink-0" />
            <span className="text-zinc-400 font-space-mono text-xs">Скрыть если выплата менее</span>
            <input type="number" min={0} max={99} value={minPayout}
              onChange={(e) => setMinPayout(e.target.value)}
              className="w-12 bg-zinc-800 border border-zinc-600 rounded px-1.5 text-white font-space-mono text-xs outline-none text-center" />
            <span className="text-zinc-400 font-space-mono text-xs">%</span>
          </div>

          {/* 2 колонки */}
          <div className="grid grid-cols-2 gap-2">
            {/* Восходящий */}
            <div>
              <div className="flex items-center gap-1 mb-1.5">
                <span className="text-green-400 text-xs font-bold">▲</span>
                <span className="text-green-400 font-space-mono text-xs font-bold">Восходящий</span>
                <span className="text-zinc-500 font-space-mono text-xs">({upList.length})</span>
              </div>
              <div className="space-y-1">
                {upList.length === 0 && <p className="text-zinc-600 font-space-mono text-[10px] text-center py-2">нет пар</p>}
                {upList.map((r, i) => <AssetRow key={r.asset} r={r} isTop={i === 0} />)}
              </div>
            </div>
            {/* Нисходящий */}
            <div>
              <div className="flex items-center gap-1 mb-1.5">
                <span className="text-red-400 text-xs font-bold">▼</span>
                <span className="text-red-400 font-space-mono text-xs font-bold">Нисходящий</span>
                <span className="text-zinc-500 font-space-mono text-xs">({downList.length})</span>
              </div>
              <div className="space-y-1">
                {downList.length === 0 && <p className="text-zinc-600 font-space-mono text-[10px] text-center py-2">нет пар</p>}
                {downList.map((r, i) => <AssetRow key={r.asset} r={r} isTop={i === 0} />)}
              </div>
            </div>
          </div>

          <p className="text-zinc-600 font-space-mono text-xs text-center">
            Экспирация: {expiry} мин · {candles} свечей · {TIMEFRAME_OPTIONS.find(o => o.value === timeframe)?.label}
          </p>
        </>
      )}
    </div>
  )
}



function AssetSelector({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [search, setSearch] = useState("")
  const [open, setOpen] = useState(false)

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim()
    if (!q) return PO_ASSETS_GROUPS
    return PO_ASSETS_GROUPS
      .map((g) => ({ ...g, assets: g.assets.filter((a) => a.toLowerCase().includes(q)) }))
      .filter((g) => g.assets.length > 0)
  }, [search])

  return (
    <div>
      <Label className="text-zinc-400 font-space-mono text-xs mb-1.5 block">Торговый актив</Label>
      <Select
        value={value}
        onValueChange={(v) => { onChange(v); setOpen(false); setSearch("") }}
        open={open}
        onOpenChange={(o) => { setOpen(o); if (!o) setSearch("") }}
      >
        <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white font-space-mono text-sm">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="bg-zinc-800 border-zinc-700 max-h-80 p-0">
          <div className="sticky top-0 z-10 bg-zinc-800 border-b border-zinc-700 p-2">
            <Input
              placeholder="Поиск актива..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-zinc-900 border-zinc-600 text-white font-space-mono text-xs h-7 placeholder:text-zinc-500"
              autoFocus
            />
          </div>
          <div className="overflow-y-auto max-h-64">
            {filtered.length === 0 ? (
              <p className="text-zinc-500 font-space-mono text-xs text-center py-4">Ничего не найдено</p>
            ) : (
              filtered.map((group) => (
                <SelectGroup key={group.label}>
                  <SelectLabel className="text-zinc-500 font-space-mono text-xs px-2 py-1">{group.label}</SelectLabel>
                  {group.assets.map((a) => (
                    <SelectItem key={a} value={a} className="text-white font-space-mono text-xs hover:bg-zinc-700">
                      {a === "AUD/CAD (OTC)" ? <span>{a} <span className="text-zinc-500 text-[10px]">только OTC</span></span> : a}
                    </SelectItem>
                  ))}
                </SelectGroup>
              ))
            )}
          </div>
        </SelectContent>
      </Select>
    </div>
  )
}

const EMA_PRESETS: { mode: POEmaTrendMode; label: string; fast: number; slow: number; hint: string }[] = [
  { mode: "ema9_21",   label: "9/21",    fast: 9,  slow: 21,  hint: "Скальпинг и короткие сделки" },
  { mode: "ema20_50",  label: "20/50",   fast: 20, slow: 50,  hint: "Классика — универсально" },
  { mode: "ema50_200", label: "50/200",  fast: 50, slow: 200, hint: "Долгосрочный тренд" },
  { mode: "custom",    label: "Своё",    fast: 0,  slow: 0,   hint: "Ввести вручную" },
]

interface Props {
  config: POBotConfig
  onChange: (config: POBotConfig) => void
  onGenerate: () => void
  botIndex?: number
}

const RISK_COLORS: Record<string, string> = {
  "Низкий": "bg-green-500/20 text-green-400 border-green-500/30",
  "Средний": "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  "Высокий": "bg-red-500/20 text-red-400 border-red-500/30",
}

function StrategyCard({
  stratKey,
  active,
  selectable,
  onClick,
  showDetail,
  onToggleDetail,
}: {
  stratKey: POStrategy
  active: boolean
  selectable?: boolean
  onClick: () => void
  showDetail: boolean
  onToggleDetail: () => void
}) {
  const s = PO_STRATEGIES[stratKey]
  return (
    <div className={`rounded-xl border transition-all duration-150 overflow-hidden
      ${active ? "border-red-500/60 bg-red-500/10" : "border-zinc-700 bg-zinc-800/40"}`}
    >
      {/* Header row */}
      <div
        className="flex items-start gap-3 p-3 cursor-pointer hover:bg-white/5 transition-colors"
        onClick={onClick}
      >
        <div className={`w-3 h-3 rounded-full mt-1 flex-shrink-0 border-2 ${
          active
            ? selectable ? "border-red-400 bg-red-400" : "border-red-400 bg-red-400"
            : "border-zinc-500"
        }`} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-base">{s.icon}</span>
            <span className={`font-orbitron text-sm font-semibold ${active ? "text-white" : "text-zinc-300"}`}>
              {s.label}
            </span>
            <Badge className={`text-xs ${RISK_COLORS[s.risk]}`}>{s.risk} риск</Badge>
          </div>
          <p className="text-zinc-500 text-xs mt-0.5 leading-snug">{s.description}</p>
          <div className="flex gap-3 mt-1.5 text-xs font-space-mono">
            <span className="text-zinc-600">WR: <span className="text-zinc-400">{s.winrateEst}</span></span>
            <span className="text-zinc-600">Сигналов: <span className="text-zinc-400">{s.signalsPerDay}/д</span></span>
            <span className="text-zinc-600">Экспир: <span className="text-zinc-400">{s.bestExpiry}</span></span>
          </div>
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); onToggleDetail() }}
          className="text-zinc-600 hover:text-zinc-300 transition-colors flex-shrink-0 mt-0.5"
          title="Характеристики"
        >
          <Icon name={showDetail ? "ChevronUp" : "ChevronDown"} size={14} />
        </button>
      </div>

      {/* Detail panel */}
      {showDetail && (
        <div className="border-t border-zinc-700/60 px-4 py-3 space-y-3 bg-zinc-900/60">
          <div className="grid grid-cols-2 gap-2 text-xs font-space-mono">
            <div className="bg-zinc-800 rounded-lg p-2">
              <p className="text-zinc-500 mb-0.5">Лучшие активы</p>
              <p className="text-zinc-200 leading-snug">{s.bestAssets}</p>
            </div>
            <div className="bg-zinc-800 rounded-lg p-2">
              <p className="text-zinc-500 mb-0.5">Экспирация</p>
              <p className="text-zinc-200">{s.bestExpiry}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs font-space-mono">
            <div>
              <p className="text-green-400 mb-1 font-semibold">✓ Плюсы</p>
              <ul className="space-y-0.5">
                {s.pros.map((p, i) => <li key={i} className="text-zinc-400">• {p}</li>)}
              </ul>
            </div>
            <div>
              <p className="text-red-400 mb-1 font-semibold">✗ Минусы</p>
              <ul className="space-y-0.5">
                {s.cons.map((c, i) => <li key={i} className="text-zinc-400">• {c}</li>)}
              </ul>
            </div>
          </div>
          {s.combosWith.length > 0 && (
            <div className="text-xs font-space-mono">
              <p className="text-zinc-500 mb-1">Лучшие комбо:</p>
              <div className="flex flex-wrap gap-1">
                {s.combosWith.map((cs) => (
                  <span key={cs} className="bg-zinc-800 border border-zinc-700 text-zinc-300 px-2 py-0.5 rounded-full">
                    {PO_STRATEGIES[cs].icon} {PO_STRATEGIES[cs].label}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ===== AI Comment component =====
type CommentLevel = "good" | "warn" | "danger" | "info"
function AIComment({ level, text }: { level: CommentLevel; text: string }) {
  const styles: Record<CommentLevel, string> = {
    good:   "bg-green-500/10 border-green-500/25 text-green-400",
    warn:   "bg-yellow-500/10 border-yellow-500/25 text-yellow-400",
    danger: "bg-red-500/10 border-red-500/25 text-red-400",
    info:   "bg-blue-500/10 border-blue-500/25 text-blue-400",
  }
  const icons: Record<CommentLevel, string> = {
    good: "✅", warn: "⚠️", danger: "🚨", info: "💡",
  }
  return (
    <div className={`flex gap-2 px-3 py-2 rounded-lg border text-xs font-space-mono leading-relaxed ${styles[level]}`}>
      <span className="flex-shrink-0 mt-0.5">{icons[level]}</span>
      <span>{text}</span>
    </div>
  )
}

// ===== Asset/Expiry comment =====
function assetExpiryComment(asset: string, expiry: POExpiry, strategy: POStrategy, comboMode: boolean, comboStrategies: POStrategy[]): { level: CommentLevel; text: string } | null {
  const strats = comboMode ? comboStrategies : [strategy]
  const isOTC = asset.includes("OTC")
  const expNum = Number(expiry)
  const hasCandle = strats.includes("candle_pattern")
  const hasSR = strats.includes("support_resistance")
  const hasEMA = strats.includes("ema_cross") || strats.includes("ema_trend")
  const hasRSI = strats.includes("rsi_reversal")

  if (expNum === 1 && (hasCandle || hasSR)) {
    return { level: "warn", text: "Паттерны свечей и уровни плохо работают на экспирации 1 мин — слишком мало данных для формирования сигнала. Рекомендуем 5–15 мин." }
  }
  if (expNum >= 5 && strats.includes("martingale") && !comboMode) {
    return { level: "warn", text: "Мартингейл на 5+ минутах означает долгое ожидание результата каждой сделки. Депозит рискует не выдержать серию убытков." }
  }
  if (!isOTC && expNum <= 2) {
    return { level: "warn", text: "На реальных парах (не OTC) короткая экспирация 1–2 мин сильно зависит от спреда и волатильности. OTC-активы стабильнее для скальпинга." }
  }
  if (isOTC && (hasEMA || hasRSI) && expNum <= 3) {
    return { level: "good", text: "Отличный выбор! OTC-активы со стратегиями RSI/EMA на 1–3 минуты — классическое сочетание для Pocket Option." }
  }
  if (hasCandle && hasSR && expNum >= 5) {
    return { level: "good", text: "Паттерны свечей + уровни на 5–15 мин — высокоточное сочетание. Сигналов будет мало, но каждый — взвешенный вход." }
  }
  if (asset.includes("Gold") && expNum >= 5) {
    return { level: "info", text: "Gold OTC хорошо реагирует на уровни поддержки/сопротивления. Если не выбрана эта стратегия — добавьте для повышения точности." }
  }
  return null
}

// ===== Bet comment =====
function betComment(cfg: POBotConfig): { level: CommentLevel; text: string } | null {
  const { betAmount, betPercent, takeProfitRub, stopLossRub, dailyLimit, martingaleEnabled, martingaleMultiplier, martingaleSteps } = cfg

  if (betPercent && betAmount > 10) {
    return { level: "danger", text: `${betAmount}% от баланса — очень агрессивно. Рекомендуем не более 2–5% на сделку. При серии убытков депозит быстро сгорит.` }
  }
  if (betPercent && betAmount <= 2) {
    return { level: "good", text: `${betAmount}% от баланса — консервативный размер. Хороший выбор для долгосрочной торговли.` }
  }
  if (!betPercent && takeProfitRub < betAmount * 3) {
    return { level: "warn", text: `TP = ${takeProfitRub}₽ при ставке ${betAmount}₽ — соотношение низкое. Рекомендуем TP не менее чем в 3–5 раз выше ставки.` }
  }
  if (stopLossRub < betAmount * 2) {
    return { level: "warn", text: `Stop Loss ${stopLossRub}₽ покроет менее 2 проигрышных сделок подряд при ставке ${betAmount}₽. Увеличьте SL или снизьте ставку.` }
  }
  if (martingaleEnabled) {
    const maxBet = betAmount * Math.pow(martingaleMultiplier, martingaleSteps - 1)
    if (maxBet > stopLossRub * 0.6) {
      return { level: "danger", text: `При мартингейле ×${martingaleMultiplier} за ${martingaleSteps} шагов максимальная ставка достигнет $${maxBet.toFixed(0)}, что превышает 60% вашего SL. Это критично.` }
    }
    return { level: "warn", text: `С мартингейлом максимальная ставка на шаге ${martingaleSteps}: $${maxBet.toFixed(0)}. Убедитесь, что депозит покрывает полную серию.` }
  }
  if (dailyLimit > 30 && !betPercent) {
    return { level: "warn", text: `${dailyLimit} сделок/день при фиксированной ставке — высокая нагрузка на депозит. Рекомендуем лимит 10–20 сделок.` }
  }
  if (takeProfitRub >= betAmount * 5 && stopLossRub <= betAmount * 3) {
    return { level: "good", text: "Хорошее соотношение риск/доходность. TP значительно превышает SL." }
  }
  return null
}

// ===== Indicator comments — always return at least one comment =====
function rsiComment(cfg: POBotConfig): { level: CommentLevel; text: string } {
  const { rsiPeriod, rsiOverbought, rsiOversold, expiry } = cfg
  const expNum = Number(expiry)
  const gap = rsiOverbought - rsiOversold

  if (rsiOverbought <= rsiOversold) {
    return { level: "danger", text: `Уровень перекупленности (${rsiOverbought}) должен быть выше перепроданности (${rsiOversold}). Исправьте значения.` }
  }
  if (gap < 30) {
    return { level: "danger", text: `Зона нейтральности RSI (${rsiOversold}–${rsiOverbought}) слишком узкая — будет много ложных сигналов. Стандарт: 30/70 или жёстче 20/80.` }
  }
  if (rsiPeriod < 9 && expNum <= 2) {
    return { level: "warn", text: `RSI(${rsiPeriod}) на ${expiry} мин очень чувствителен к шуму рынка. Попробуйте период 9–14 для более чистых сигналов.` }
  }
  if (rsiPeriod >= 14 && expNum <= 2) {
    return { level: "info", text: `RSI(${rsiPeriod}) на экспирации ${expiry} мин немного запаздывает. Период 7–9 даст более быстрые сигналы для скальпинга.` }
  }
  if (rsiPeriod >= 14 && expNum >= 5) {
    return { level: "good", text: `RSI(${rsiPeriod}) хорошо подходит для экспирации ${expiry} мин — достаточно данных для чёткого сигнала.` }
  }
  if (gap >= 50) {
    return { level: "info", text: `RSI ${rsiOversold}/${rsiOverbought} — жёсткие уровни. Сигналов будет мало, но каждый — при экстремальном состоянии рынка.` }
  }
  if (rsiOverbought === 70 && rsiOversold === 30) {
    return { level: "good", text: `RSI(${rsiPeriod}) со стандартными уровнями 30/70 — надёжный классический вариант для OTC-рынка.` }
  }
  return { level: "good", text: `RSI(${rsiPeriod}): уровни ${rsiOversold}/${rsiOverbought}, зона нейтральности ${gap} пп — параметры в норме.` }
}

function emaComment(cfg: POBotConfig): { level: CommentLevel; text: string } {
  const { emaFast, emaSlow, expiry } = cfg
  const expNum = Number(expiry)
  const diff = emaSlow - emaFast

  if (emaFast >= emaSlow) {
    return { level: "danger", text: `Быстрая EMA(${emaFast}) ≥ медленной EMA(${emaSlow}) — это ошибка конфигурации. Быстрая EMA всегда должна быть меньше медленной.` }
  }
  if (diff < 5) {
    return { level: "danger", text: `Разница между EMA(${emaFast}) и EMA(${emaSlow}) всего ${diff} — сигналы будут слишком частыми и ложными. Рекомендуем разницу минимум 8–12.` }
  }
  if (diff < 8) {
    return { level: "warn", text: `Разница EMA(${emaFast})/EMA(${emaSlow}) = ${diff} — немного мала. Рекомендуем увеличить до 9/21 или 5/20 для снижения ложных пересечений.` }
  }
  if (emaFast <= 5 && expNum >= 5) {
    return { level: "warn", text: `EMA(${emaFast}) очень быстрая для экспирации ${expiry} мин — будет давать преждевременные сигналы. Попробуйте EMA 9–12.` }
  }
  if (emaFast === 9 && emaSlow === 21) {
    return { level: "good", text: `EMA 9/21 — классическое проверенное сочетание для бинарных опционов. Отличный выбор для экспирации ${expiry} мин.` }
  }
  if (emaFast === 5 && emaSlow === 20) {
    return { level: "good", text: `EMA 5/20 — агрессивное сочетание для коротких таймфреймов. Хорошо подходит для экспирации 1–2 мин.` }
  }
  if (emaFast === 12 && emaSlow === 26) {
    return { level: "good", text: `EMA 12/26 — основа классического MACD. Надёжно для экспирации 5–15 мин.` }
  }
  if (expNum <= 2 && emaFast >= 12) {
    return { level: "warn", text: `EMA(${emaFast}) медленновата для экспирации ${expiry} мин — сигналы будут запаздывать. Попробуйте EMA 5–9.` }
  }
  return { level: "good", text: `EMA(${emaFast})/EMA(${emaSlow}): разница ${diff} пп, параметры корректны для экспирации ${expiry} мин.` }
}

// ===== Indicator comment =====
function indicatorComment(cfg: POBotConfig): { level: CommentLevel; text: string } | null {
  // kept for backwards compat — not used directly anymore
  return null
}

function getAutoPipSize(asset: string): number {
  const a = asset.toUpperCase()
  if (a.includes("JPY") || a.includes("BTC") || a.includes("ETH") || a.includes("XAU") || a.includes("GOLD") || a.includes("S&P") || a.includes("NASDAQ") || a.includes("DOW") || a.includes("NIKKEI") || a.includes("DAX") || a.includes("BRENT") || a.includes("WTI") || a.includes("OIL")) return 0.01
  if (a.includes("LTC") || a.includes("DOT") || a.includes("LINK") || a.includes("BCH") || a.includes("DASH") || a.includes("SILVER") || a.includes("XAG")) return 0.001
  return 0.0001
}

export default function PocketOptionBotForm({ config, onChange, onGenerate, botIndex = 1 }: Props) {
  const set = (patch: Partial<POBotConfig>) => onChange({ ...config, ...patch })
  const [detailOpen, setDetailOpen] = useState<Record<string, boolean>>({})

  const toggleDetail = (key: string) =>
    setDetailOpen((prev) => ({ ...prev, [key]: !prev[key] }))

  const toggleComboStrategy = (key: POStrategy) => {
    const cur = config.comboStrategies
    if (cur.includes(key)) {
      if (cur.length <= 2) return // min 2
      set({ comboStrategies: cur.filter((s) => s !== key) })
    } else {
      if (cur.length >= 4) return // max 4
      set({ comboStrategies: [...cur, key] })
    }
  }

  const strategies = Object.keys(PO_STRATEGIES) as POStrategy[]

  const PRESETS: {
    id: string
    name: string
    emoji: string
    desc: string
    tag: string
    tagColor: string
    strategies: POStrategy[]
    logic: POComboLogic
    expiry: POExpiry
    tip: string
  }[] = [
    {
      id: "flat_filter",
      name: "Флет-фильтр",
      emoji: "🎯",
      desc: "RSI + EMA — двойное подтверждение для торговли в боковике",
      tag: "Новичкам",
      tagColor: "bg-green-500/20 text-green-400 border-green-500/30",
      strategies: ["rsi_reversal", "ema_cross"],
      logic: "AND",
      expiry: "3",
      tip: "Лучше работает на EUR/USD OTC и GBP/USD OTC в спокойный рынок",
    },
    {
      id: "reversal_pro",
      name: "Разворот Про",
      emoji: "🔄",
      desc: "Паттерны свечей + Уровни + RSI — три подтверждения разворота",
      tag: "Опытным",
      tagColor: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
      strategies: ["candle_pattern", "support_resistance", "rsi_reversal"],
      logic: "AND",
      expiry: "5",
      tip: "Мало сигналов, но очень высокая точность. Подходит для Gold OTC",
    },
    {
      id: "trend_catch",
      name: "Ловец тренда",
      emoji: "🏄",
      desc: "EMA + Поддержка/Сопротивление — вход по тренду с подтверждением уровня",
      tag: "Универсальный",
      tagColor: "bg-blue-500/20 text-blue-400 border-blue-500/30",
      strategies: ["ema_cross", "support_resistance"],
      logic: "AND",
      expiry: "5",
      tip: "Отлично работает на USD/JPY OTC при выраженном тренде",
    },
    {
      id: "signal_hunter",
      name: "Охотник за сигналами",
      emoji: "⚡",
      desc: "RSI + EMA + Паттерны — широкий охват, сигнал при любом совпадении",
      tag: "Активный",
      tagColor: "bg-orange-500/20 text-orange-400 border-orange-500/30",
      strategies: ["rsi_reversal", "ema_cross", "candle_pattern"],
      logic: "OR",
      expiry: "1",
      tip: "Много сигналов для активной торговли. Рекомендуем строгий Stop Loss",
    },
    {
      id: "precision",
      name: "Снайпер",
      emoji: "🎯",
      desc: "Все 4 стратегии AND — максимальная фильтрация, только лучшие входы",
      tag: "Высший класс",
      tagColor: "bg-purple-500/20 text-purple-400 border-purple-500/30",
      strategies: ["rsi_reversal", "ema_cross", "candle_pattern", "support_resistance"],
      logic: "AND",
      expiry: "5",
      tip: "1–3 сигнала в день. Каждый вход максимально взвешен",
    },
  ]

  const applyPreset = (preset: typeof PRESETS[number]) => {
    onChange({
      ...config,
      comboMode: true,
      comboStrategies: preset.strategies,
      comboLogic: preset.logic,
      expiry: preset.expiry,
    })
  }

  return (
    <div className="space-y-5">

      {/* Mode toggle */}
      <div className="flex gap-2 bg-zinc-800 border border-zinc-700 rounded-xl p-1">
        <button
          onClick={() => set({ comboMode: false })}
          className={`flex-1 py-2 px-3 rounded-lg font-orbitron text-xs font-bold transition-all duration-150
            ${!config.comboMode ? "bg-red-600 text-white shadow shadow-red-500/20" : "text-zinc-400 hover:text-zinc-200"}`}
        >
          Одна стратегия
        </button>
        <button
          onClick={() => set({ comboMode: true })}
          className={`flex-1 py-2 px-3 rounded-lg font-orbitron text-xs font-bold transition-all duration-150
            ${config.comboMode ? "bg-red-600 text-white shadow shadow-red-500/20" : "text-zinc-400 hover:text-zinc-200"}`}
        >
          🔀 Комбо
        </button>
      </div>

      {/* Strategy Selector / Combo Mode — декомпозировано в StrategySelectorCards (этап 6) */}
      <StrategySelectorCards
        config={config}
        set={set}
        detailOpen={detailOpen}
        toggleDetail={toggleDetail}
        strategies={strategies}
        PRESETS={PRESETS}
        toggleComboStrategy={toggleComboStrategy}
        applyPreset={applyPreset}
        StrategyCard={StrategyCard}
      />

      {/* Asset & Expiry */}
      <Card className="bg-zinc-900 border-red-500/20">
        <CardHeader className="pb-3">
          <CardTitle className="font-orbitron text-white text-base">Актив и экспирация</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <TrendScanner onSelect={(v) => set({ asset: v, pipSize: getAutoPipSize(v) })} />
          <AssetSelector value={config.asset} onChange={(v) => set({ asset: v, pipSize: getAutoPipSize(v) })} />

          <div>
            <Label className="text-zinc-400 font-space-mono text-xs mb-1.5 block">Экспирация опциона</Label>
            <div className="grid grid-cols-4 gap-1.5">
              {(["1", "2", "3", "5", "15", "30", "45", "60"] as POExpiry[]).map((exp) => (
                <button
                  key={exp}
                  onClick={() => set({ expiry: exp })}
                  className={`py-2 rounded-lg text-xs font-orbitron font-bold border transition-all
                    ${config.expiry === exp
                      ? "bg-red-500 border-red-500 text-white"
                      : "bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-zinc-500"
                    }`}
                >
                  {exp === "60" ? "1ч" : `${exp}м`}
                </button>
              ))}
            </div>
            <p className="text-zinc-600 text-xs font-space-mono mt-1">{PO_EXPIRY_LABELS[config.expiry]}</p>
          </div>
          {(() => {
            const c = assetExpiryComment(config.asset, config.expiry, config.strategy, config.comboMode, config.comboStrategies)
            return c ? <AIComment level={c.level} text={c.text} /> : null
          })()}
        </CardContent>
      </Card>

      {/* Bet Management — декомпозирована в BetManagementCard */}
      <BetManagementCard
        config={config}
        set={set}
        aiCommentSlot={(() => {
          const c = betComment(config)
          return c ? <AIComment level={c.level} text={c.text} /> : null
        })()}
      />

      {/* Мартингейл + Защита баланса — декомпозированы в MartingaleAndSafetyCards */}
      <MartingaleAndSafetyCards config={config} set={set} />

      {/* Хеджирование + Каскадный хедж + Источник свечей — декомпозированы в HedgingCards (этап 3) */}
      <HedgingCards config={config} set={set} detailOpen={detailOpen} toggleDetail={toggleDetail} />



      {/* Прогрев бота + Расширение прибыли — декомпозированы в BotWarmupAndProfitExtensionCards (этап 4) */}
      <BotWarmupAndProfitExtensionCards config={config} set={set} detailOpen={detailOpen} toggleDetail={toggleDetail} />

      {/* Single-strategy карточки (RSI, Candle Pattern, S/R, EMA Cross) — декомпозированы в IndicatorSettingsCards (этап 5) */}
      <IndicatorSettingsCards
        config={config}
        set={set}
        EMA_PRESETS={EMA_PRESETS}
        rsiAiComment={<AIComment {...rsiComment(config)} />}
        emaAiComment={<AIComment {...emaComment(config)} />}
      />

      {/* Combo карточки (RSI+EMA, Candle+S/R) — декомпозированы в ComboIndicatorSettingsCards (этап 5) */}
      <ComboIndicatorSettingsCards
        config={config}
        set={set}
        EMA_PRESETS={EMA_PRESETS}
        rsiAiComment={<AIComment {...rsiComment(config)} />}
        emaAiComment={<AIComment {...emaComment(config)} />}
      />
      <Card className="bg-zinc-900 border-zinc-700">
        <CardHeader className="pb-3">
          <CardTitle className="font-orbitron text-white text-sm flex items-center gap-2">
            <Icon name="Bot" size={16} className="text-purple-400" />
            Имя бота
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <Label className="text-zinc-400 font-space-mono text-xs mb-1.5 block">Название для Telegram</Label>
            <Input
              type="text"
              value={config.botName ?? `Бот ${botIndex}`}
              onChange={(e) => set({ botName: e.target.value })}
              placeholder={`Бот ${botIndex}`}
              className="bg-zinc-800 border-zinc-700 text-white font-space-mono text-sm"
            />
            <p className="text-zinc-500 font-space-mono text-xs mt-1">⚠️ При двух ботах задай разные имена. Управление: <span className="text-purple-400">/stop {config.botName ?? `Бот ${botIndex}`}</span> или <span className="text-zinc-400">/stop all</span></p>
          </div>
        </CardContent>
      </Card>

      {/* Фильтры Trade Base — фильтры по методике учебника */}
      <TradeBaseFiltersCard config={config} onChange={(patch) => set(patch)} />

      <TelegramNotifyCard config={config} set={set} />

      {/* Итоговая сводка перед генерацией */}
      {config.comboMode && (
        <div className="rounded-xl border border-zinc-600 bg-zinc-900 px-4 py-3 space-y-2 font-space-mono text-xs">
          <p className="text-zinc-300 font-semibold">📋 Итог настройки комбо-бота</p>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-zinc-500">
            <p>Актив: <span className="text-white">{config.asset}</span></p>
            <p>Экспирация: <span className="text-white">{config.expiry} мин</span></p>
            <p>Ставка: <span className="text-white">{config.currency || "$"}{config.betAmount}</span></p>
            <p>Выплата: <span className="text-white">{config.payoutRate}%</span></p>
            <p>Take Profit: <span className="text-green-400">{config.currency || "$"}{config.takeProfitRub}</span></p>
            <p>Stop Loss: <span className="text-red-400">{config.currency || "$"}{config.stopLossRub}</span></p>
            <p>Лимит/день: <span className="text-white">{config.dailyLimit} сделок</span></p>
            <p>Режим свечей: <span className="text-white">{config.trendMode === "same" ? "Одинаковые" : config.trendMode === "reverse" ? "Разворот" : "Любой"}</span></p>
            <p>Стратегии: <span className="text-white">{config.comboStrategies.filter(s => s !== "martingale").map(s => PO_STRATEGIES[s]?.label).join(", ") || "—"}</span></p>
            <p>Логика: <span className={config.comboLogic === "AND" ? "text-green-400" : "text-yellow-400"}>{config.comboLogic}</span></p>
          </div>
          {config.stopLossRub > 0 && config.takeProfitRub > 0 && (
            <p className={`text-[11px] mt-1 ${config.takeProfitRub >= config.stopLossRub * 1.5 ? "text-green-400" : "text-orange-400"}`}>
              {config.takeProfitRub >= config.stopLossRub * 1.5
                ? `✅ TP/SL = ${(config.takeProfitRub / config.stopLossRub).toFixed(1)}x — хорошее соотношение`
                : `⚠️ TP/SL = ${(config.takeProfitRub / config.stopLossRub).toFixed(1)}x — рекомендуем TP выше SL в 1.5x`}
            </p>
          )}
        </div>
      )}

      {/* Фильтр направления сделок (CALL/PUT/Все) */}
      <TradeDirectionCard config={config} set={set} />

      {/* 🛡 Проверка безопасности — баннер перед запуском */}
      <SafetyCheckBanner config={config} />

      <Button
        onClick={onGenerate}
        className="w-full bg-red-600 hover:bg-red-500 text-white font-orbitron font-bold py-4 text-base rounded-xl transition-all duration-200 shadow-lg shadow-red-500/20"
      >
        {config.comboMode ? `🔀 Сгенерировать комбо-бот (${config.comboLogic})` : "Сгенерировать код бота"}
      </Button>
    </div>
  )
}