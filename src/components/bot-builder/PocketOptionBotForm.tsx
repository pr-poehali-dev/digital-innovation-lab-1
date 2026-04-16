import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
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

const TREND_SCANNER_URL = "https://functions.poehali.dev/d55c380e-7fd5-4871-aca7-c8670be08cde"

interface TrendResult {
  asset: string
  asset_otc: string
  category: "crypto" | "forex"
  change_pct: number | null
  trend_strength: number
  direction: "UP" | "DOWN" | "NEUTRAL"
  summary?: "STRONG_BUY" | "BUY" | "NEUTRAL" | "SELL" | "STRONG_SELL"
  rsi?: number | null
  buy_signals?: number | null
  sell_signals?: number | null
  neutral_signals?: number | null
  position_in_range: number | null
}

function TrendScanner({ onSelect }: { onSelect: (asset: string) => void }) {
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<TrendResult[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [collapsed, setCollapsed] = useState(false)
  // payouts[asset] — выплата введённая вручную для каждого актива
  const [payouts, setPayouts] = useState<Record<string, string>>({})
  // минимальная выплата для фильтра
  const [minPayout, setMinPayout] = useState<string>("80")

  function setPayout(asset: string, val: string) {
    setPayouts((p) => ({ ...p, [asset]: val }))
  }

  const minPct = Number(minPayout) || 0

  const visible = useMemo(() => {
    if (!results) return null
    return results.filter((r) => {
      if (r.category === "crypto") return false
      const pct = Number(payouts[r.asset])
      if (!pct) return true
      return pct >= minPct
    })
  }, [results, payouts, minPct])

  async function scan() {
    setLoading(true)
    setError(null)
    setResults(null)
    try {
      const resp = await fetch(TREND_SCANNER_URL)
      const raw = await resp.json()
      const data = typeof raw === "string" ? JSON.parse(raw) : raw
      setResults(data.top)
      const topForex = data.top?.find((r: TrendResult) => r.category === "forex")
      if (topForex) onSelect(topForex.asset_otc)
    } catch {
      setError("Не удалось получить данные")
    } finally {
      setLoading(false)
    }
  }

  const maxStrength = visible && visible.length > 0 ? Math.max(...visible.map((r) => r.trend_strength)) : 1

  return (
    <div className="space-y-2">
      {/* Кнопка сканирования + закрытие */}
      <div className="flex gap-2">
        <Button
          type="button"
          onClick={scan}
          disabled={loading}
          className="flex-1 bg-yellow-500/10 hover:bg-yellow-500/20 border border-yellow-500/30 text-yellow-400 font-space-mono text-xs h-8"
          variant="outline"
        >
          {loading
            ? <><Icon name="Loader2" size={13} className="mr-1.5 animate-spin" />Сканирую рынок...</>
            : <><Icon name="Zap" size={13} className="mr-1.5" />Найти сильный тренд (TradingView)</>  
          }
        </Button>
        {results && (
          <Button
            type="button"
            onClick={() => setCollapsed((v) => !v)}
            variant="outline"
            className="border-zinc-700 bg-zinc-800 text-zinc-400 hover:text-white h-8 px-2.5"
          >
            <Icon name={collapsed ? "ChevronDown" : "ChevronUp"} size={14} />
          </Button>
        )}
        {results && (
          <Button
            type="button"
            onClick={() => { setResults(null); setCollapsed(false) }}
            variant="outline"
            className="border-zinc-700 bg-zinc-800 text-zinc-400 hover:text-red-400 h-8 px-2.5"
          >
            <Icon name="X" size={14} />
          </Button>
        )}
      </div>

      {error && <p className="text-red-400 font-space-mono text-xs">{error}</p>}

      {results && !collapsed && (
        <>
          {/* Фильтр по минимальной выплате */}
          <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2">
            <Icon name="Filter" size={12} className="text-zinc-400 shrink-0" />
            <span className="text-zinc-400 font-space-mono text-xs">Скрыть если выплата менее</span>
            <input
              type="number"
              min={0}
              max={99}
              value={minPayout}
              onChange={(e) => setMinPayout(e.target.value)}
              className="w-12 bg-zinc-800 border border-zinc-600 rounded px-1.5 text-white font-space-mono text-xs outline-none text-center"
            />
            <span className="text-zinc-400 font-space-mono text-xs">%</span>
          </div>

          {/* Подсказка OTC */}
          <div className="bg-zinc-900 border border-yellow-500/20 rounded-lg px-3 py-2 flex items-start gap-2">
            <Icon name="Info" size={12} className="text-yellow-500/70 mt-0.5 shrink-0" />
            <p className="text-yellow-500/70 font-space-mono text-xs leading-relaxed">
              OTC-версии доступны 24/7 — поэтому брокер всегда принимает сделку. Введи выплату с PO рядом с каждым активом.
            </p>
          </div>

          {/* Список активов */}
          <div className="space-y-1.5">
            {visible && visible.length === 0 && (
              <p className="text-zinc-500 font-space-mono text-xs text-center py-2">Все активы скрыты фильтром — снизь минимум</p>
            )}
            {visible && visible.map((r) => {
              const barPct = (r.trend_strength / maxStrength) * 100
              const isUp = r.direction === "UP"
              const isDown = r.direction === "DOWN"
              const topForexAsset = visible.find(x => x.category === "forex")?.asset
              const isTop = r.asset === topForexAsset
              const payoutVal = payouts[r.asset] ?? ""
              const payoutNum = Number(payoutVal)
              const payoutColor = payoutNum >= 85 ? "text-green-400" : payoutNum >= 75 ? "text-yellow-400" : payoutNum > 0 ? "text-red-400" : "text-zinc-500"

              const summaryLabel: Record<string, string> = {
                STRONG_BUY: "STRONG BUY",
                BUY: "BUY",
                NEUTRAL: "NEUTRAL",
                SELL: "SELL",
                STRONG_SELL: "STRONG SELL",
              }
              const summaryColor: Record<string, string> = {
                STRONG_BUY: "text-green-400 bg-green-500/10 border-green-500/30",
                BUY: "text-green-300 bg-green-500/5 border-green-500/20",
                NEUTRAL: "text-zinc-400 bg-zinc-700/50 border-zinc-600",
                SELL: "text-red-300 bg-red-500/5 border-red-500/20",
                STRONG_SELL: "text-red-400 bg-red-500/10 border-red-500/30",
              }
              const total = (r.buy_signals ?? 0) + (r.sell_signals ?? 0) + (r.neutral_signals ?? 0)
              const buyPct = total > 0 ? Math.round(((r.buy_signals ?? 0) / total) * 100) : 0
              const sellPct = total > 0 ? Math.round(((r.sell_signals ?? 0) / total) * 100) : 0

              return (
                <div
                  key={r.asset}
                  className={`rounded border ${isTop ? "bg-yellow-500/5 border-yellow-500/30" : "bg-zinc-800 border-zinc-700"}`}
                >
                  {/* Верхняя строка: актив + summary + выплата + кнопка */}
                  <div className="flex items-center gap-2 px-2.5 pt-1.5 pb-1">
                    <span className={`text-xs font-bold shrink-0 ${isUp ? "text-green-400" : isDown ? "text-red-400" : "text-zinc-400"}`}>
                      {isUp ? "▲" : isDown ? "▼" : "—"}
                    </span>
                    <span className="text-xs shrink-0">{r.category === "crypto" ? "₿" : "💱"}</span>
                    <span className={`font-space-mono text-xs flex-1 ${isTop ? "text-yellow-300 font-bold" : "text-white"}`}>
                      {r.asset}{isTop && " 🔥"}
                    </span>

                    {/* TradingView summary badge */}
                    {r.summary && (
                      <span className={`font-space-mono text-[10px] font-bold px-1.5 py-0.5 rounded border shrink-0 ${summaryColor[r.summary] ?? "text-zinc-400"}`}>
                        {summaryLabel[r.summary] ?? r.summary}
                      </span>
                    )}

                    {/* Поле ввода выплаты */}
                    <div className="flex items-center gap-1 shrink-0">
                      <input
                        type="number"
                        min={0}
                        max={99}
                        placeholder="—"
                        value={payoutVal}
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) => setPayout(r.asset, e.target.value)}
                        className={`w-10 bg-zinc-900 border border-zinc-600 rounded px-1 text-center font-space-mono text-xs outline-none ${payoutColor}`}
                      />
                      <span className="text-zinc-500 font-space-mono text-xs">%</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => onSelect(r.asset_otc)}
                      className="shrink-0 text-zinc-500 hover:text-yellow-400 font-space-mono text-xs transition-colors"
                    >
                      OTC →
                    </button>
                  </div>

                  {/* RSI + сигналы buy/sell */}
                  {(r.rsi != null || r.buy_signals != null) && (
                    <div className="flex items-center gap-3 px-2.5 pb-1.5">
                      {r.rsi != null && (
                        <span className={`font-space-mono text-[10px] shrink-0 ${r.rsi > 70 ? "text-red-400" : r.rsi < 30 ? "text-green-400" : "text-zinc-400"}`}>
                          RSI {r.rsi}
                        </span>
                      )}
                      {r.buy_signals != null && total > 0 && (
                        <div className="flex items-center gap-1 flex-1">
                          <div className="flex-1 h-1 rounded bg-zinc-700 overflow-hidden flex">
                            <div className="h-full bg-green-500 transition-all" style={{ width: `${buyPct}%` }} />
                            <div className="h-full bg-red-500 transition-all" style={{ width: `${sellPct}%` }} />
                          </div>
                          <span className="text-[10px] font-space-mono text-green-400 shrink-0">{r.buy_signals}↑</span>
                          <span className="text-[10px] font-space-mono text-red-400 shrink-0">{r.sell_signals}↓</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Полоска силы тренда */}
                  <div className="w-full bg-zinc-700 rounded-b h-1">
                    <div
                      className={`h-1 rounded-b transition-all ${isUp ? "bg-green-500" : isDown ? "bg-red-500" : "bg-zinc-500"}`}
                      style={{ width: `${barPct}%` }}
                    />
                  </div>
                </div>
              )
            })}
            {visible && visible.length > 0 && (
              <p className="text-zinc-600 font-space-mono text-xs text-center pt-0.5">Нажми "OTC →" — актив выберется автоматически</p>
            )}
          </div>
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
                      {a}
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
  inverted,
}: {
  stratKey: POStrategy
  active: boolean
  selectable?: boolean
  onClick: () => void
  showDetail: boolean
  onToggleDetail: () => void
  inverted?: boolean
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
            {inverted && <span className="text-[10px] font-space-mono font-semibold text-orange-400 bg-orange-500/10 border border-orange-500/30 rounded px-1.5 py-0.5">🔄 INV</span>}
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
  const hasEMA = strats.includes("ema_cross")
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

      {/* Strategy selection */}
      {!config.comboMode ? (
        <Card className="bg-zinc-900 border-red-500/20">
          <CardHeader className="pb-3">
            <CardTitle className="font-orbitron text-white text-base">Стратегия</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {strategies.map((key) => (
              <StrategyCard
                key={key}
                stratKey={key}
                active={config.strategy === key}
                onClick={() => set({ strategy: key })}
                showDetail={!!detailOpen[key]}
                onToggleDetail={() => toggleDetail(key)}
              />
            ))}
          </CardContent>
        </Card>
      ) : (
        <Card className="bg-zinc-900 border-red-500/20">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between gap-2">
              <div>
                <CardTitle className="font-orbitron text-white text-base">Комбо-стратегии</CardTitle>
                <p className="text-zinc-500 font-space-mono text-xs mt-0.5">
                  Выберите 2–4 стратегии ({config.comboStrategies.length} выбрано)
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {/* Combo logic */}
            <div className="grid grid-cols-2 gap-2 mb-1">
              {(["AND", "OR"] as POComboLogic[]).map((logic) => (
                <button
                  key={logic}
                  onClick={() => set({ comboLogic: logic })}
                  className={`py-2.5 px-3 rounded-xl border font-orbitron text-xs font-bold transition-all text-left
                    ${config.comboLogic === logic
                      ? "bg-red-500/20 border-red-500/50 text-red-400"
                      : "bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-zinc-500"
                    }`}
                >
                  <div className="font-bold mb-0.5">{logic}</div>
                  <div className="text-zinc-500 font-space-mono text-xs font-normal">
                    {logic === "AND" ? "Все совпадают → сигнал" : "Хотя бы одна → сигнал"}
                  </div>
                </button>
              ))}
            </div>

            {config.comboLogic === "AND" && (
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg px-3 py-2 text-xs font-space-mono text-blue-400">
                🔒 AND — строгий фильтр: меньше сигналов, но выше качество
              </div>
            )}
            {config.comboLogic === "OR" && (
              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg px-3 py-2 text-xs font-space-mono text-yellow-400">
                ⚡ OR — мягкий фильтр: больше сигналов, выше активность
              </div>
            )}

            {/* Подтверждение трендом по свечам */}
            <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-3 space-y-2.5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-space-mono text-xs font-semibold">🕯️ Подтверждение трендом</p>
                  <p className="text-zinc-500 font-space-mono text-[10px] mt-0.5">Сделка только если N свечей одного цвета</p>
                </div>
                <Switch
                  checked={config.trendCandlesEnabled}
                  onCheckedChange={(v) => set({ trendCandlesEnabled: v })}
                />
              </div>
              {config.trendCandlesEnabled && (
                <div>
                  <p className="text-zinc-400 font-space-mono text-xs mb-2">Сколько свечей подряд нужно:</p>
                  <div className="grid grid-cols-3 gap-2">
                    {([2, 3, 4] as const).map((n) => (
                      <button
                        key={n}
                        onClick={() => set({ trendCandlesCount: n })}
                        className={`py-2 rounded-lg border font-orbitron text-sm font-bold transition-all
                          ${config.trendCandlesCount === n
                            ? "bg-red-500/20 border-red-500/50 text-red-400"
                            : "bg-zinc-900 border-zinc-700 text-zinc-400 hover:border-zinc-500"
                          }`}
                      >
                        {n === 2 ? "🟢🟢" : n === 3 ? "🟢🟢🟢" : "🟢🟢🟢🟢"}
                        <div className="text-[10px] font-space-mono font-normal mt-0.5 text-zinc-500">
                          {n} свечи
                        </div>
                      </button>
                    ))}
                  </div>
                  <div className="mt-2 bg-green-500/10 border border-green-500/20 rounded-lg px-3 py-2 text-xs font-space-mono text-green-400">
                    {config.trendCandlesCount === 2 && "⚡ 2 свечи — больше сигналов, но чуть ниже точность"}
                    {config.trendCandlesCount === 3 && "✅ 3 свечи — оптимальный баланс сигналов и точности"}
                    {config.trendCandlesCount === 4 && "🔒 4 свечи — очень редкие, но очень надёжные сигналы"}
                  </div>
                </div>
              )}
            </div>

            {/* Presets */}
            <div>
              <p className="text-zinc-500 font-space-mono text-xs mb-2">⚡ Быстрые пресеты</p>
              <div className="space-y-2">
                {PRESETS.map((preset) => {
                  const isActive =
                    preset.strategies.length === config.comboStrategies.length &&
                    preset.strategies.every((s) => config.comboStrategies.includes(s)) &&
                    preset.logic === config.comboLogic
                  return (
                    <button
                      key={preset.id}
                      onClick={() => applyPreset(preset)}
                      className={`w-full text-left p-3 rounded-xl border transition-all duration-150
                        ${isActive
                          ? "border-red-500/60 bg-red-500/10"
                          : "border-zinc-700 bg-zinc-800/40 hover:border-zinc-500 hover:bg-zinc-800/70"
                        }`}
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-xl flex-shrink-0 mt-0.5">{preset.emoji}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <span className={`font-orbitron text-sm font-semibold ${isActive ? "text-white" : "text-zinc-200"}`}>
                              {preset.name}
                            </span>
                            <span className={`text-xs px-2 py-0.5 rounded-full border font-space-mono ${preset.tagColor}`}>
                              {preset.tag}
                            </span>
                            <span className={`text-xs px-1.5 py-0.5 rounded font-space-mono border
                              ${preset.logic === "AND" ? "bg-blue-500/10 text-blue-400 border-blue-500/20" : "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"}`}>
                              {preset.logic}
                            </span>
                          </div>
                          <p className="text-zinc-400 font-space-mono text-xs leading-snug mb-1.5">{preset.desc}</p>
                          <div className="flex flex-wrap gap-1 mb-1.5">
                            {preset.strategies.map((s) => (
                              <span key={s} className="bg-zinc-700/60 text-zinc-300 text-xs font-space-mono px-1.5 py-0.5 rounded">
                                {PO_STRATEGIES[s].icon} {PO_STRATEGIES[s].label}
                              </span>
                            ))}
                            <span className="text-zinc-600 text-xs font-space-mono px-1.5 py-0.5">· {preset.expiry} мин</span>
                          </div>
                          {isActive && (
                            <p className="text-zinc-500 font-space-mono text-xs italic">💡 {preset.tip}</p>
                          )}
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>
              <div className="border-t border-zinc-800 mt-3 pt-3">
                <p className="text-zinc-500 font-space-mono text-xs mb-2">Или настройте вручную:</p>
              </div>
            </div>

            {/* Strategy cards with checkboxes */}
            <div className="space-y-2">
              {strategies.filter((k) => k !== "martingale").map((key) => {
                const isActive = config.comboStrategies.includes(key)
                const isInverted =
                  (key === "rsi_reversal" && (config.invertSignalRsi ?? false)) ||
                  (key === "ema_cross" && (config.invertSignalEma ?? false)) ||
                  (key === "candle_pattern" && (config.invertSignalCandle ?? false)) ||
                  (key === "support_resistance" && (config.invertSignalRufus ?? false)) ||
                  (key === "martingale" && (config.invertSignalMartingale ?? false))
                return (
                  <StrategyCard
                    key={key}
                    stratKey={key}
                    active={isActive}
                    selectable
                    onClick={() => toggleComboStrategy(key)}
                    showDetail={!!detailOpen["combo_" + key]}
                    onToggleDetail={() => toggleDetail("combo_" + key)}
                    inverted={isActive && isInverted}
                  />
                )
              })}
            </div>

            {config.comboStrategies.length >= 2 && (() => {
              const active = config.comboStrategies.filter(s => s !== "martingale")
              // Parse "10–25" → [10, 25]
              const ranges = active.map(s => {
                const parts = PO_STRATEGIES[s].signalsPerDay.replace("–", "-").split("-").map(Number)
                return { min: parts[0], max: parts[parts.length - 1] }
              })
              const risks = active.map(s => PO_STRATEGIES[s].risk)
              const hasHigh = risks.includes("Высокий")
              const hasMed  = risks.includes("Средний")

              let sigMin: number, sigMax: number, qualityText: string, qualityColor: string, falseRisk: string, falseColor: string

              if (config.comboLogic === "AND") {
                // AND → bottleneck (минимальные сигналы из всех стратегий)
                sigMin = Math.max(1, Math.min(...ranges.map(r => r.min)))
                sigMax = Math.max(2, Math.min(...ranges.map(r => r.max)))
                qualityText = active.length >= 3 ? "Очень высокое (все 3+ совпадают)" : "Высокое (оба подтверждают)"
                qualityColor = "text-green-400"
                falseRisk = active.length >= 3 ? "Очень низкий" : "Низкий"
                falseColor = "text-green-400"
              } else {
                // OR → сумма, но перекрытие ~30%
                sigMin = Math.round(ranges.reduce((a, r) => a + r.min, 0) * 0.7)
                sigMax = Math.round(ranges.reduce((a, r) => a + r.max, 0) * 0.7)
                qualityText = active.length >= 3 ? "Среднее (большинство голосов)" : "Среднее (хватает одного)"
                qualityColor = "text-yellow-400"
                falseRisk = hasHigh ? "Высокий" : hasMed ? "Средний" : "Низкий"
                falseColor = hasHigh ? "text-red-400" : hasMed ? "text-yellow-400" : "text-green-400"
              }

              const winrateMin = Math.round(active.reduce((a, s) => a + parseInt(PO_STRATEGIES[s].winrateEst), 0) / active.length)
              const winrateBonus = config.comboLogic === "AND" ? Math.min(8, active.length * 3) : 0
              const estWinrate = `${winrateMin + winrateBonus}–${winrateMin + winrateBonus + 8}%`

              const winrateNum = winrateMin + winrateBonus
              const payout = config.payoutRate / 100
              const estDailyWins = Math.round(sigMax * 0.6 * (winrateNum / 100) * (config.comboLogic === "AND" ? 0.7 : 1))
              const estBet = config.betAmount
              const estDayProfit = estDailyWins > 0
                ? (estDailyWins * estBet * payout - (sigMax - estDailyWins > 0 ? sigMax - estDailyWins : 0) * estBet).toFixed(0)
                : "0"
              const overlapNote = config.comboLogic === "OR"
                ? "Стратегии дублируют ~30% сигналов"
                : "Все стратегии должны совпасть"

              return (
                <div className="bg-zinc-800 rounded-xl px-4 py-3 text-xs font-space-mono space-y-1.5">
                  <p className="text-zinc-300 font-semibold mb-2">📊 Оценка комбо ({active.length} стратегии, {config.comboLogic}):</p>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                    <p className="text-zinc-500">Стратегии: <span className="text-zinc-300">{active.map(s => PO_STRATEGIES[s].label).join(" + ")}</span></p>
                    <p className="text-zinc-500">Логика: <span className={config.comboLogic === "AND" ? "text-green-400" : "text-yellow-400"}>{config.comboLogic} — {overlapNote}</span></p>
                    <p className="text-zinc-500">Сигналов/день: <span className="text-white">~{sigMin}–{sigMax}</span></p>
                    <p className="text-zinc-500">Расч. winrate: <span className={config.comboLogic === "AND" ? "text-green-400" : "text-yellow-400"}>{estWinrate}</span></p>
                    <p className="text-zinc-500">Качество сигналов: <span className={qualityColor}>{qualityText}</span></p>
                    <p className="text-zinc-500">Риск ложных входов: <span className={falseColor}>{falseRisk}</span></p>
                    <p className="text-zinc-500">Проигрышей до SL: <span className={config.stopLossRub > 0 && estBet > 0 ? (Math.floor(config.stopLossRub / estBet) < 5 ? "text-orange-400" : "text-green-400") : "text-zinc-400"}>{config.stopLossRub > 0 && estBet > 0 ? `${Math.floor(config.stopLossRub / estBet)} подряд` : "—"}</span></p>
                    <p className="text-zinc-500">Прогноз/день: <span className={Number(estDayProfit) >= 0 ? "text-green-400" : "text-red-400"}>{Number(estDayProfit) >= 0 ? "+" : ""}{config.currency || "$"}{estDayProfit}</span></p>
                  </div>
                  {config.comboLogic === "AND" && active.length >= 3 && (
                    <p className="text-green-400/80 text-[10px] mt-1">✅ AND + 3 стратегии — максимальная фильтрация, меньше сделок, выше точность</p>
                  )}
                  {config.comboLogic === "OR" && hasHigh && (
                    <p className="text-orange-400/80 text-[10px] mt-1">⚠️ OR с высокорисковой стратегией — возможны ложные входы</p>
                  )}
                </div>
              )
            })()}

          </CardContent>
        </Card>
      )}

      {/* Asset & Expiry */}
      <Card className="bg-zinc-900 border-red-500/20">
        <CardHeader className="pb-3">
          <CardTitle className="font-orbitron text-white text-base">Актив и экспирация</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <TrendScanner onSelect={(v) => {
            const isCrypto = ["BTC","ETH","SOL","BNB","DOGE"].some(c => v.includes(c))
            set({ asset: v, rufusStep: isCrypto ? 0.01 : 0.01 })
          }} />
          <AssetSelector value={config.asset} onChange={(v) => {
            const isCrypto = ["BTC","ETH","SOL","BNB","DOGE"].some(c => v.includes(c))
            const isJpy = v.includes("JPY")
            const rufusStep: 0.01 | 0.001 = isJpy ? 0.01 : isCrypto ? 0.01 : 0.01
            set({ asset: v, rufusStep })
          }} />

          <div>
            <Label className="text-zinc-400 font-space-mono text-xs mb-1.5 block">Экспирация опциона</Label>
            <div className="grid grid-cols-5 gap-1.5">
              {(["1", "2", "3", "5", "15"] as POExpiry[]).map((exp) => (
                <button
                  key={exp}
                  onClick={() => set({ expiry: exp })}
                  className={`py-2 rounded-lg text-xs font-orbitron font-bold border transition-all
                    ${config.expiry === exp
                      ? "bg-red-500 border-red-500 text-white"
                      : "bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-zinc-500"
                    }`}
                >
                  {exp}м
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

      {/* Bet */}
      <Card className="bg-zinc-900 border-red-500/20">
        <CardHeader className="pb-3">
          <CardTitle className="font-orbitron text-white text-base">Управление ставкой</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-zinc-300 text-sm">Ставка в % от баланса</Label>
              <p className="text-zinc-500 text-xs font-space-mono">Иначе — фиксированная сумма в USD</p>
            </div>
            <Switch checked={config.betPercent} onCheckedChange={(v) => set({ betPercent: v })} />
          </div>

          <div>
            <Label className="text-zinc-400 font-space-mono text-xs mb-1.5 block">
              {config.betPercent ? "Ставка (% от баланса)" : `Ставка (${config.currency})`}
            </Label>
            <div className="flex items-center gap-3">
              <Slider
                min={config.betPercent ? 1 : (config.currency === "RUB" ? 50 : config.currency === "INR" ? 50 : 1)}
                max={config.betPercent ? 50 : (config.currency === "RUB" ? 10000 : config.currency === "INR" ? 5000 : config.currency === "BRL" ? 500 : 200)}
                step={config.betPercent ? 1 : (config.currency === "RUB" ? 50 : config.currency === "INR" ? 50 : 1)}
                value={[config.betAmount]}
                onValueChange={([v]) => set({ betAmount: v })}
                className="flex-1"
              />
              <span className="text-red-400 font-orbitron font-bold text-sm w-16 text-right">
                {config.betAmount}{config.betPercent ? "%" : ` ${config.currency}`}
              </span>
            </div>
          </div>

          <div>
            <Label className="text-zinc-400 font-space-mono text-xs mb-1.5 block">Валюта счёта</Label>
            <Select value={config.currency} onValueChange={(v) => {
              const defaults: Record<string, { betAmount: number; takeProfitRub: number; stopLossRub: number }> = {
                RUB: { betAmount: 500, takeProfitRub: 3000, stopLossRub: 1500 },
                USD: { betAmount: 5,   takeProfitRub: 30,   stopLossRub: 15   },
                EUR: { betAmount: 5,   takeProfitRub: 30,   stopLossRub: 15   },
                BRL: { betAmount: 25,  takeProfitRub: 150,  stopLossRub: 75   },
                INR: { betAmount: 400, takeProfitRub: 2500, stopLossRub: 1000 },
              }
              set({ currency: v, ...(defaults[v] ?? {}) })
            }}>
              <SelectTrigger className="bg-zinc-800 border-zinc-700 text-zinc-100 font-space-mono text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="RUB">RUB — Рубли ₽</SelectItem>
                <SelectItem value="USD">USD — Доллары $</SelectItem>
                <SelectItem value="EUR">EUR — Евро €</SelectItem>
                <SelectItem value="BRL">BRL — Реалы R$</SelectItem>
                <SelectItem value="INR">INR — Рупии ₹</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-zinc-400 font-space-mono text-xs mb-1.5 block">Take Profit ({config.currency})</Label>
              <Input type="number" value={config.takeProfitRub} onChange={(e) => set({ takeProfitRub: Number(e.target.value) })} className="bg-zinc-800 border-zinc-700 text-green-400 font-space-mono text-sm" />
            </div>
            <div>
              <Label className="text-zinc-400 font-space-mono text-xs mb-1.5 block">Stop Loss ({config.currency})</Label>
              <Input type="number" value={config.stopLossRub} onChange={(e) => set({ stopLossRub: Number(e.target.value) })} className="bg-zinc-800 border-zinc-700 text-red-400 font-space-mono text-sm" />
            </div>
          </div>

          <div>
            <Label className="text-zinc-400 font-space-mono text-xs mb-1.5 block">Макс. сделок в день: {config.dailyLimit}</Label>
            <Slider min={1} max={100} step={1} value={[config.dailyLimit]} onValueChange={([v]) => set({ dailyLimit: v })} />
          </div>

          <div>
            <Label className="text-zinc-400 font-space-mono text-xs mb-1.5 block">Интервал проверки: {config.checkInterval} сек</Label>
            <Slider min={10} max={120} step={5} value={[config.checkInterval]} onValueChange={([v]) => set({ checkInterval: v })} />
            <p className="text-zinc-600 font-space-mono text-xs mt-1.5">
              {config.checkInterval <= 15 ? "⚡ Быстро — больше сигналов, больше шума" : config.checkInterval >= 60 ? "🐢 Медленно — меньше шума, реже проверка" : "⚖️ Баланс — оптимально для большинства стратегий"}
            </p>
          </div>

          <div>
            <Label className="text-zinc-400 font-space-mono text-xs mb-1.5 block">Выплата брокера: {config.payoutRate}%</Label>
            <Slider min={50} max={99} step={1} value={[config.payoutRate]} onValueChange={([v]) => set({ payoutRate: v })} />
            <p className="text-zinc-600 font-space-mono text-xs mt-1.5">
              {config.payoutRate >= 90 ? "🔥 Высокая выплата — ищи активы с таким %" : config.payoutRate >= 75 ? "⚖️ Средняя выплата — стандарт для большинства" : "⚠️ Низкая выплата — сложнее выйти в плюс"}
            </p>
          </div>

          <div className="flex items-center justify-between pt-1">
            <div>
              <Label className="text-zinc-300 text-sm">Режим счёта</Label>
              <p className="text-zinc-500 text-xs font-space-mono">Демо или реальный счёт</p>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-xs font-space-mono ${config.isDemo ? "text-green-400" : "text-zinc-500"}`}>Демо</span>
              <Switch checked={!config.isDemo} onCheckedChange={(v) => set({ isDemo: !v })} />
              <span className={`text-xs font-space-mono ${!config.isDemo ? "text-red-400" : "text-zinc-500"}`}>Реальный</span>
            </div>
          </div>
          {!config.isDemo && (
            <div className="flex items-center gap-2 bg-red-950/40 border border-red-500/30 rounded-lg px-3 py-2">
              <span className="text-red-400 text-xs font-space-mono">Реальный счёт — бот будет торговать настоящими деньгами!</span>
            </div>
          )}

          <div className="flex items-center justify-between pt-1">
            <div>
              <Label className="text-zinc-300 text-sm">Авто-перезапуск</Label>
              <p className="text-zinc-500 text-xs font-space-mono">Продолжать после TP/SL</p>
            </div>
            <Switch checked={config.autoRestart} onCheckedChange={(v) => set({ autoRestart: v })} />
          </div>
          {(() => {
            const c = betComment(config)
            return c ? <AIComment level={c.level} text={c.text} /> : null
          })()}
        </CardContent>
      </Card>

      {/* Martingale */}
      <Card className={`border transition-all duration-200 ${config.martingaleEnabled ? "bg-red-950/30 border-red-500/40" : "bg-zinc-900 border-zinc-700"}`}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="font-orbitron text-white text-base">
              Мартингейл
              {config.martingaleEnabled && <Badge className="ml-2 bg-red-500/20 text-red-400 border-red-500/30 text-xs">Включён</Badge>}
            </CardTitle>
            <Switch checked={config.martingaleEnabled} onCheckedChange={(v) => set({ martingaleEnabled: v })} />
          </div>
        </CardHeader>
        {config.martingaleEnabled && (
          <CardContent className="space-y-4">
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
              <p className="text-red-400 text-xs font-space-mono leading-relaxed">
                ⚠️ Мартингейл увеличивает ставку после каждого проигрыша. Высокий риск потери депозита при серии убытков.
              </p>
            </div>
            <div>
              <Label className="text-zinc-400 font-space-mono text-xs mb-1.5 block">Множитель: ×{config.martingaleMultiplier}</Label>
              <Slider min={1.5} max={4} step={0.1} value={[config.martingaleMultiplier]} onValueChange={([v]) => set({ martingaleMultiplier: Math.round(v * 10) / 10 })} />
              <div className="flex justify-between text-zinc-600 text-xs font-space-mono mt-1">
                <span>×1.5 (консерв.)</span><span>×4.0 (агресс.)</span>
              </div>
            </div>
            <div>
              <Label className="text-zinc-400 font-space-mono text-xs mb-1.5 block">Макс. шагов: {config.martingaleSteps}</Label>
              <Slider min={1} max={7} step={1} value={[config.martingaleSteps]} onValueChange={([v]) => set({ martingaleSteps: v })} />
            </div>
            <div className="bg-zinc-800 rounded-lg p-3 font-space-mono text-xs space-y-1">
              <p className="text-zinc-400">Пример с базовой ставкой {config.betAmount}₽:</p>
              {Array.from({ length: config.martingaleSteps }, (_, i) => {
                const bet = (config.betAmount * Math.pow(config.martingaleMultiplier, i)).toFixed(2)
                return (
                  <p key={i} className={i === 0 ? "text-green-400" : i < 3 ? "text-yellow-400" : "text-red-400"}>
                    Шаг {i + 1}: {bet}₽
                  </p>
                )
              })}
            </div>
            <div className="flex items-center justify-between bg-red-950/30 border border-red-500/20 rounded-lg px-3 py-2">
              <span className="text-red-400 text-xs font-space-mono">🔄 Инверсия сигналов Мартингейл</span>
              <Switch checked={config.invertSignalMartingale ?? false} onCheckedChange={(v) => set({ invertSignalMartingale: v })} className="scale-75" />
            </div>
            {config.invertSignalMartingale && (
              <p className="text-zinc-500 text-xs font-space-mono px-1">⚡ Большинство вверх → PUT &nbsp;|&nbsp; Большинство вниз → CALL</p>
            )}
          </CardContent>
        )}
      </Card>

      {/* RSI settings */}
      {!config.comboMode && config.strategy === "rsi_reversal" && (
        <Card className="bg-zinc-900 border-blue-500/20">
          <CardHeader className="pb-3"><CardTitle className="font-orbitron text-white text-base">Настройки RSI</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-zinc-400 font-space-mono text-xs mb-1.5 block">Период RSI: {config.rsiPeriod}</Label>
              <Slider min={7} max={21} step={1} value={[config.rsiPeriod]} onValueChange={([v]) => set({ rsiPeriod: v })} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-zinc-400 font-space-mono text-xs mb-1.5 block">Перекупленность</Label>
                <Input type="number" value={config.rsiOverbought} onChange={(e) => set({ rsiOverbought: Number(e.target.value) })} className="bg-zinc-800 border-zinc-700 text-red-400 font-space-mono text-sm" />
              </div>
              <div>
                <Label className="text-zinc-400 font-space-mono text-xs mb-1.5 block">Перепроданность</Label>
                <Input type="number" value={config.rsiOversold} onChange={(e) => set({ rsiOversold: Number(e.target.value) })} className="bg-zinc-800 border-zinc-700 text-green-400 font-space-mono text-sm" />
              </div>
            </div>
            <AIComment {...rsiComment(config)} />
            <div className="flex items-center justify-between bg-blue-950/30 border border-blue-500/20 rounded-lg px-3 py-2">
              <span className="text-blue-400 text-xs font-space-mono">🔄 Инверсия сигналов RSI</span>
              <Switch checked={config.invertSignalRsi ?? false} onCheckedChange={(v) => set({ invertSignalRsi: v })} className="scale-75" />
            </div>
            {config.invertSignalRsi && (
              <p className="text-zinc-500 text-xs font-space-mono px-1">⚡ Перепроданность → PUT &nbsp;|&nbsp; Перекупленность → CALL</p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Candle Pattern settings */}
      {!config.comboMode && config.strategy === "candle_pattern" && (
        <Card className="bg-zinc-900 border-yellow-500/20">
          <CardHeader className="pb-3"><CardTitle className="font-orbitron text-white text-base">Настройки паттернов свечей</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <p className="text-zinc-500 text-xs font-space-mono leading-relaxed">
              Бот ищет разворотные паттерны (молот, поглощение, доджи). Сигнал формируется при закрытии свечи.
            </p>
            <div className="flex items-center justify-between bg-yellow-950/30 border border-yellow-500/20 rounded-lg px-3 py-2">
              <span className="text-yellow-400 text-xs font-space-mono">🔄 Инверсия сигналов паттернов</span>
              <Switch checked={config.invertSignalCandle ?? false} onCheckedChange={(v) => set({ invertSignalCandle: v })} className="scale-75" />
            </div>
            {config.invertSignalCandle && (
              <p className="text-zinc-500 text-xs font-space-mono px-1">⚡ Бычий паттерн → PUT &nbsp;|&nbsp; Медвежий паттерн → CALL</p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Support/Resistance settings — RUFUS */}
      {!config.comboMode && config.strategy === "support_resistance" && (
        <Card className="bg-zinc-900 border-purple-500/20">
          <CardHeader className="pb-3">
            <CardTitle className="font-orbitron text-white text-base flex items-center gap-2">
              Настройки уровней
              <span className="text-[10px] font-space-mono font-normal bg-purple-500/20 border border-purple-500/40 text-purple-300 rounded px-1.5 py-0.5">RUFUS</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-zinc-500 text-xs font-space-mono leading-relaxed">
              Алгоритм <b className="text-purple-400">Rufus</b> торгует от круглых уровней. Подход сверху → поддержка → <span className="text-green-400">CALL</span>. Подход снизу → сопротивление → <span className="text-red-400">PUT</span>.
            </p>
            {(() => {
              const asset = config.asset ?? ""
              const isJpy = asset.includes("JPY")
              const isCrypto = ["BTC","ETH","SOL","BNB","DOGE"].some(c => asset.includes(c))
              const isStock = ["Nvidia","Apple","Tesla","VISA","Palantir","GameStop","ExxonMobil","Netflix","McDonald","Intel","Boeing","Alibaba"].some(c => asset.includes(c))
              const isCommodity = ["Gold","Silver","Oil","Gas","Platinum","Palladium"].some(c => asset.includes(c))
              const currentStep = config.rufusStep ?? 0.01

              type StepInfo = { label: string; badge: string; when: string; example: string; warning?: string }
              const stepInfo: Record<string, StepInfo> = {
                "0.01": {
                  label: "0.0100 — сотые",
                  badge: "рекомендовано",
                  when: isJpy
                    ? "Для USD/JPY уровни на целых числах (109.00, 110.00)"
                    : isCrypto
                    ? "Для крипты круглые уровни — тысячи (30000, 31000)"
                    : isStock
                    ? "Для акций уровни на целых ценах ($150, $200)"
                    : isCommodity
                    ? "Для Gold/Oil уровни на круглых ценах ($1900, $2000)"
                    : "Стандарт для EUR/USD, GBP/USD, AUD/USD",
                  example: isJpy ? "109.00 / 110.00 / 111.00" : isCrypto ? "30000 / 31000 / 32000" : "1.1200 / 1.1300 / 1.1400",
                },
                "0.001": {
                  label: "0.0010 — тысячные",
                  badge: "для скальпинга",
                  when: "Больше сигналов — уровни через каждые 10 пипсов",
                  example: isJpy ? "109.00 / 109.10 / 109.20" : "1.1290 / 1.1300 / 1.1310",
                  warning: isCrypto
                    ? "Для крипты 0.001 не имеет смысла — цены в тысячах"
                    : isStock
                    ? "Для акций 0.001 не имеет смысла — цены в долларах"
                    : "Больше шума и ложных сигналов. Подходит опытным трейдерам."
                },
              }
              const info = stepInfo[String(currentStep)]

              return (
                <div>
                  <Label className="text-zinc-400 font-space-mono text-xs mb-2 block">Шаг уровней</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {([0.01, 0.001] as const).map((step) => (
                      <button
                        key={step}
                        onClick={() => set({ rufusStep: step })}
                        className={`rounded-md px-3 py-2 text-xs font-space-mono font-semibold border transition-all text-left ${
                          currentStep === step
                            ? "bg-purple-500/20 border-purple-500/50 text-purple-300"
                            : "bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-zinc-500"
                        }`}
                      >
                        <div>{step === 0.01 ? "0.0100 — сотые" : "0.0010 — тысячные"}</div>
                        <div className={`text-[9px] mt-0.5 font-normal ${currentStep === step ? "text-purple-400" : "text-zinc-600"}`}>
                          {step === 0.01 ? stepInfo["0.01"].badge : stepInfo["0.001"].badge}
                        </div>
                      </button>
                    ))}
                  </div>
                  <div className="mt-2 bg-zinc-800/50 border border-zinc-700/40 rounded-lg px-3 py-2 space-y-1.5">
                    <p className="text-zinc-300 font-space-mono text-[10px] font-semibold">
                      💡 {info.when}
                    </p>
                    <p className="text-zinc-500 font-space-mono text-[10px]">
                      Уровни: {info.example}
                    </p>
                    {info.warning && (
                      <p className="text-amber-500/80 font-space-mono text-[10px]">⚠ {info.warning}</p>
                    )}
                    {isCrypto && currentStep === 0.01 && (
                      <p className="text-amber-500/80 font-space-mono text-[10px]">⚠ Rufus даёт мало сигналов на крипте — рассмотри форекс-пары</p>
                    )}
                  </div>
                </div>
              )
            })()}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-zinc-400 font-space-mono text-xs mb-1.5 block">Радиус входа (пипсов)</Label>
                <Input
                  type="number" min={1} max={50}
                  value={config.rufusPips ?? 5}
                  onChange={(e) => set({ rufusPips: Number(e.target.value) })}
                  className="bg-zinc-800 border-zinc-700 text-purple-400 font-space-mono text-sm"
                />
                <p className="text-zinc-600 font-space-mono text-[10px] mt-1">Как близко к уровню должна быть цена</p>
              </div>
              <div>
                <Label className="text-zinc-400 font-space-mono text-xs mb-1.5 block">Свечей для направления</Label>
                <Input
                  type="number" min={3} max={50}
                  value={config.rufusLookback ?? 10}
                  onChange={(e) => set({ rufusLookback: Number(e.target.value) })}
                  className="bg-zinc-800 border-zinc-700 text-purple-400 font-space-mono text-sm"
                />
                <p className="text-zinc-600 font-space-mono text-[10px] mt-1">За сколько свечей смотреть направление</p>
              </div>
            </div>
            <div className="bg-purple-950/30 border border-purple-500/20 rounded-lg px-3 py-2 space-y-1">
              <p className="text-purple-300 text-xs font-space-mono font-semibold">Пример при {config.rufusPips ?? 5} пипс:</p>
              <p className="text-zinc-400 text-xs font-space-mono">
                Уровень {(config.rufusStep ?? 0.01) === 0.01 ? "1.1300" : "1.1300"} → вход в диапазоне {(1.1300 - (config.rufusPips ?? 5) * 0.0001).toFixed(5)}–{(1.1300 + (config.rufusPips ?? 5) * 0.0001).toFixed(5)}
              </p>
              <p className="text-zinc-500 text-[10px] font-space-mono">
                Уровни: каждые {config.rufusStep ?? 0.01} ({(config.rufusStep ?? 0.01) === 0.01 ? "сотые" : "тысячные"})
              </p>
            </div>
            <div className="flex items-center justify-between bg-purple-950/30 border border-purple-500/20 rounded-lg px-3 py-2">
              <span className="text-purple-300 text-xs font-space-mono">🔄 Инверсия сигналов Rufus</span>
              <Switch checked={config.invertSignalRufus ?? false} onCheckedChange={(v) => set({ invertSignalRufus: v })} className="scale-75" />
            </div>
            {config.invertSignalRufus && (
              <p className="text-zinc-500 text-xs font-space-mono px-1">⚡ Подход сверху → PUT &nbsp;|&nbsp; Подход снизу → CALL</p>
            )}
          </CardContent>
        </Card>
      )}

      {!config.comboMode && config.strategy === "ema_cross" && (
        <Card className="bg-zinc-900 border-green-500/20">
          <CardHeader className="pb-3"><CardTitle className="font-orbitron text-white text-base">Настройки EMA</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {/* Presets */}
            <div>
              <Label className="text-zinc-400 font-space-mono text-xs mb-2 block">Пресет периодов</Label>
              <div className="grid grid-cols-4 gap-1.5">
                {EMA_PRESETS.map((p) => (
                  <button
                    key={p.mode}
                    onClick={() => {
                      if (p.mode !== "custom") set({ emaTrendMode: p.mode, emaFast: p.fast, emaSlow: p.slow })
                      else set({ emaTrendMode: "custom" })
                    }}
                    className={`rounded-lg px-2 py-1.5 text-xs font-space-mono font-semibold border transition-all ${
                      config.emaTrendMode === p.mode
                        ? "bg-green-500/20 border-green-500/50 text-green-400"
                        : "bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-zinc-500"
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
              <p className="text-zinc-600 font-space-mono text-xs mt-1.5">
                {EMA_PRESETS.find(p => p.mode === config.emaTrendMode)?.hint}
              </p>
            </div>
            {/* Values */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-zinc-400 font-space-mono text-xs mb-1.5 block">Быстрая EMA</Label>
                <Input type="number" value={config.emaFast} onChange={(e) => set({ emaFast: Number(e.target.value), emaTrendMode: "custom" })} className="bg-zinc-800 border-zinc-700 text-green-400 font-space-mono text-sm" />
              </div>
              <div>
                <Label className="text-zinc-400 font-space-mono text-xs mb-1.5 block">Медленная EMA</Label>
                <Input type="number" value={config.emaSlow} onChange={(e) => set({ emaSlow: Number(e.target.value), emaTrendMode: "custom" })} className="bg-zinc-800 border-zinc-700 text-blue-400 font-space-mono text-sm" />
              </div>
            </div>
            <AIComment {...emaComment(config)} />
            <div className="flex items-center justify-between bg-green-950/30 border border-green-500/20 rounded-lg px-3 py-2">
              <span className="text-green-400 text-xs font-space-mono">🔄 Инверсия сигналов EMA</span>
              <Switch checked={config.invertSignalEma ?? false} onCheckedChange={(v) => set({ invertSignalEma: v })} className="scale-75" />
            </div>
            {config.invertSignalEma && (
              <p className="text-zinc-500 text-xs font-space-mono px-1">⚡ Пересечение вверх → PUT &nbsp;|&nbsp; Пересечение вниз → CALL</p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Combo RSI+EMA+Rufus settings */}
      {config.comboMode && (config.comboStrategies.includes("rsi_reversal") || config.comboStrategies.includes("ema_cross") || config.comboStrategies.includes("support_resistance")) && (
        <Card className="bg-zinc-900 border-zinc-700">
          <CardHeader className="pb-3"><CardTitle className="font-orbitron text-white text-base">Параметры индикаторов</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {config.comboStrategies.includes("rsi_reversal") && (
              <div className="space-y-2">
                <p className="text-blue-400 font-space-mono text-xs font-semibold">RSI</p>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <Label className="text-zinc-500 font-space-mono text-xs mb-1 block">Период</Label>
                    <Input type="number" value={config.rsiPeriod} onChange={(e) => set({ rsiPeriod: Number(e.target.value) })} className="bg-zinc-800 border-zinc-700 text-white font-space-mono text-xs h-8" />
                  </div>
                  <div>
                    <Label className="text-zinc-500 font-space-mono text-xs mb-1 block">Перекуп.</Label>
                    <Input type="number" value={config.rsiOverbought} onChange={(e) => set({ rsiOverbought: Number(e.target.value) })} className="bg-zinc-800 border-zinc-700 text-red-400 font-space-mono text-xs h-8" />
                  </div>
                  <div>
                    <Label className="text-zinc-500 font-space-mono text-xs mb-1 block">Перепрод.</Label>
                    <Input type="number" value={config.rsiOversold} onChange={(e) => set({ rsiOversold: Number(e.target.value) })} className="bg-zinc-800 border-zinc-700 text-green-400 font-space-mono text-xs h-8" />
                  </div>
                </div>
                <AIComment {...rsiComment(config)} />
                <div className="flex items-center justify-between bg-blue-950/30 border border-blue-500/20 rounded-lg px-3 py-1.5">
                  <span className="text-blue-400 text-xs font-space-mono">🔄 Инверсия RSI</span>
                  <Switch checked={config.invertSignalRsi ?? false} onCheckedChange={(v) => set({ invertSignalRsi: v })} className="scale-75" />
                </div>
                {config.invertSignalRsi && <p className="text-zinc-500 text-[10px] font-space-mono px-1">⚡ Перепроданность → PUT | Перекупленность → CALL</p>}
              </div>
            )}
            {config.comboStrategies.includes("ema_cross") && (
              <div className="space-y-2">
                <p className="text-green-400 font-space-mono text-xs font-semibold">EMA</p>
                <div className="grid grid-cols-4 gap-1">
                  {EMA_PRESETS.map((p) => (
                    <button
                      key={p.mode}
                      onClick={() => {
                        if (p.mode !== "custom") set({ emaTrendMode: p.mode, emaFast: p.fast, emaSlow: p.slow })
                        else set({ emaTrendMode: "custom" })
                      }}
                      className={`rounded-md px-1.5 py-1 text-xs font-space-mono font-semibold border transition-all ${
                        config.emaTrendMode === p.mode
                          ? "bg-green-500/20 border-green-500/50 text-green-400"
                          : "bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-zinc-500"
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label className="text-zinc-500 font-space-mono text-xs mb-1 block">Быстрая EMA</Label>
                    <Input type="number" value={config.emaFast} onChange={(e) => set({ emaFast: Number(e.target.value), emaTrendMode: "custom" })} className="bg-zinc-800 border-zinc-700 text-green-400 font-space-mono text-xs h-8" />
                  </div>
                  <div>
                    <Label className="text-zinc-500 font-space-mono text-xs mb-1 block">Медленная EMA</Label>
                    <Input type="number" value={config.emaSlow} onChange={(e) => set({ emaSlow: Number(e.target.value), emaTrendMode: "custom" })} className="bg-zinc-800 border-zinc-700 text-blue-400 font-space-mono text-xs h-8" />
                  </div>
                </div>
                <AIComment {...emaComment(config)} />
                <div className="flex items-center justify-between bg-green-950/30 border border-green-500/20 rounded-lg px-3 py-1.5">
                  <span className="text-green-400 text-xs font-space-mono">🔄 Инверсия EMA</span>
                  <Switch checked={config.invertSignalEma ?? false} onCheckedChange={(v) => set({ invertSignalEma: v })} className="scale-75" />
                </div>
                {config.invertSignalEma && <p className="text-zinc-500 text-[10px] font-space-mono px-1">⚡ Пересечение вверх → PUT | Вниз → CALL</p>}
              </div>
            )}
            {config.comboStrategies.includes("support_resistance") && (() => {
              const asset = config.asset ?? ""
              const isJpy = asset.includes("JPY")
              const isCrypto = ["BTC","ETH","SOL","BNB","DOGE"].some(c => asset.includes(c))
              const isStock = ["Nvidia","Apple","Tesla","VISA","Palantir","GameStop","ExxonMobil","Netflix","McDonald","Intel","Boeing","Alibaba"].some(c => asset.includes(c))
              const isCommodity = ["Gold","Silver","Oil","Gas","Platinum","Palladium"].some(c => asset.includes(c))
              const currentStep = config.rufusStep ?? 0.01
              const when01 = isJpy ? "USD/JPY — целые числа (109.00, 110.00)"
                : isCrypto ? "Крипта — уровни на тысячах (30000, 31000)"
                : isStock ? "Акции — целые цены ($150, $200)"
                : isCommodity ? "Gold/Oil — круглые цены ($1900, $2000)"
                : "EUR/USD, GBP/USD — стандарт (1.1300, 1.1400)"
              const example01 = isJpy ? "109.00 / 110.00 / 111.00" : isCrypto ? "30000 / 31000 / 32000" : "1.1200 / 1.1300 / 1.1400"
              const example001 = isJpy ? "109.00 / 109.10 / 109.20" : "1.1290 / 1.1300 / 1.1310"
              const warning001 = isCrypto ? "Для крипты 0.001 не имеет смысла" : isStock ? "Для акций 0.001 не имеет смысла" : "Больше шума. Для опытных трейдеров."
              return (
                <div className="space-y-2">
                  <p className="text-purple-400 font-space-mono text-xs font-semibold flex items-center gap-1.5">
                    RUFUS <span className="text-[9px] bg-purple-500/20 border border-purple-500/30 rounded px-1 py-0.5 text-purple-300">уровни</span>
                  </p>
                  <div className="grid grid-cols-2 gap-1.5">
                    {([0.01, 0.001] as const).map((step) => (
                      <button
                        key={step}
                        onClick={() => set({ rufusStep: step })}
                        className={`rounded px-2 py-2 text-[10px] font-space-mono font-semibold border transition-all text-left ${
                          currentStep === step
                            ? "bg-purple-500/20 border-purple-500/50 text-purple-300"
                            : "bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-zinc-500"
                        }`}
                      >
                        <div>{step === 0.01 ? "0.0100 — сотые" : "0.0010 — тысячные"}</div>
                        <div className={`text-[9px] mt-0.5 font-normal ${currentStep === step ? "text-purple-400" : "text-zinc-600"}`}>
                          {step === 0.01 ? "рекомендовано" : "для скальпинга"}
                        </div>
                      </button>
                    ))}
                  </div>
                  <div className="bg-zinc-800/50 border border-zinc-700/40 rounded-lg px-2.5 py-2 space-y-1">
                    <p className="text-zinc-300 font-space-mono text-[10px] font-semibold">
                      💡 {currentStep === 0.01 ? when01 : "Уровни через каждые 10 пипсов"}
                    </p>
                    <p className="text-zinc-500 font-space-mono text-[10px]">
                      Уровни: {currentStep === 0.01 ? example01 : example001}
                    </p>
                    {currentStep === 0.001 && (
                      <p className="text-amber-500/80 font-space-mono text-[10px]">⚠ {warning001}</p>
                    )}
                    {isCrypto && currentStep === 0.01 && (
                      <p className="text-amber-500/80 font-space-mono text-[10px]">⚠ Rufus даёт мало сигналов на крипте</p>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label className="text-zinc-500 font-space-mono text-xs mb-1 block">Радиус (пипсов)</Label>
                      <Input type="number" min={1} max={50} value={config.rufusPips ?? 5} onChange={(e) => set({ rufusPips: Number(e.target.value) })} className="bg-zinc-800 border-zinc-700 text-purple-400 font-space-mono text-xs h-8" />
                    </div>
                    <div>
                      <Label className="text-zinc-500 font-space-mono text-xs mb-1 block">Свечей назад</Label>
                      <Input type="number" min={3} max={50} value={config.rufusLookback ?? 10} onChange={(e) => set({ rufusLookback: Number(e.target.value) })} className="bg-zinc-800 border-zinc-700 text-purple-400 font-space-mono text-xs h-8" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between bg-purple-950/30 border border-purple-500/20 rounded-lg px-3 py-1.5">
                    <span className="text-purple-300 text-xs font-space-mono">🔄 Инверсия Rufus</span>
                    <Switch checked={config.invertSignalRufus ?? false} onCheckedChange={(v) => set({ invertSignalRufus: v })} className="scale-75" />
                  </div>
                  {config.invertSignalRufus && <p className="text-zinc-500 text-[10px] font-space-mono px-1">⚡ Подход сверху → PUT | Снизу → CALL</p>}
                </div>
              )
            })()}
          </CardContent>
        </Card>
      )}

      {/* Комбо: инверсия для candle_pattern и martingale */}
      {config.comboMode && (config.comboStrategies.includes("candle_pattern") || config.comboStrategies.includes("martingale")) && (
        <Card className="bg-zinc-900 border-zinc-700">
          <CardHeader className="pb-2 pt-4 px-4"><CardTitle className="text-sm font-space-mono text-zinc-200">🔄 Инверсия сигналов</CardTitle></CardHeader>
          <CardContent className="px-4 pb-4 space-y-3">
            {config.comboStrategies.includes("candle_pattern") && (
              <div className="space-y-1">
                <div className="flex items-center justify-between bg-yellow-950/30 border border-yellow-500/20 rounded-lg px-3 py-1.5">
                  <span className="text-yellow-400 text-xs font-space-mono">🔄 Инверсия паттернов свечей</span>
                  <Switch checked={config.invertSignalCandle ?? false} onCheckedChange={(v) => set({ invertSignalCandle: v })} className="scale-75" />
                </div>
                {config.invertSignalCandle && <p className="text-zinc-500 text-[10px] font-space-mono px-1">⚡ Бычий паттерн → PUT | Медвежий → CALL</p>}
              </div>
            )}
            {config.comboStrategies.includes("martingale") && (
              <div className="space-y-1">
                <div className="flex items-center justify-between bg-red-950/30 border border-red-500/20 rounded-lg px-3 py-1.5">
                  <span className="text-red-400 text-xs font-space-mono">🔄 Инверсия Мартингейл</span>
                  <Switch checked={config.invertSignalMartingale ?? false} onCheckedChange={(v) => set({ invertSignalMartingale: v })} className="scale-75" />
                </div>
                {config.invertSignalMartingale && <p className="text-zinc-500 text-[10px] font-space-mono px-1">⚡ Большинство вверх → PUT | Вниз → CALL</p>}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Итоговая сводка — одиночный режим */}
      {!config.comboMode && (config.timeFilterEnabled || config.rsiThresholdEnabled || config.lossStreakPauseEnabled || (config.tradeDirection ?? "all") !== "all") && (
        <div className="rounded-xl border border-zinc-600 bg-zinc-900 px-4 py-3 space-y-2 font-space-mono text-xs">
          <p className="text-zinc-300 font-semibold">🛡 Активные защиты:</p>
          {(config.tradeDirection ?? "all") !== "all" && (
            <p className="text-red-400">🚦 Только {config.tradeDirection === "call_only" ? "CALL (рост)" : "PUT (падение)"} — {config.tradeDirection === "call_only" ? "PUT" : "CALL"} игнорируется</p>
          )}
          {config.timeFilterEnabled && (
            <p className="text-blue-400">🕐 Торговое окно: {config.timeFilterFrom}–{config.timeFilterTo}</p>
          )}
          {config.rsiThresholdEnabled && (
            <p className="text-purple-400">📉 RSI-порог: вход только ≤{config.rsiThresholdOversold} / ≥{config.rsiThresholdOverbought}</p>
          )}
          {config.lossStreakPauseEnabled && (
            <p className="text-orange-400">⏸️ Пауза {config.lossStreakPauseMin} мин после {config.lossStreakCount} проигрышей подряд</p>
          )}
        </div>
      )}

      {/* Фильтр направления сделок */}
      <Card className="bg-zinc-900 border-zinc-700">
        <CardHeader className="pb-2 pt-4 px-4 cursor-pointer" onClick={() => {}}>
          <CardTitle className="text-sm font-space-mono text-zinc-200 flex items-center gap-2">
            <span>🚦</span> Пропускать сделки
            <span className="ml-auto text-[10px] font-normal text-red-400 bg-red-400/10 border border-red-400/20 rounded px-1.5 py-0.5">ЖЁСТКИЙ ФИЛЬТР</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-4 space-y-2">
          <p className="text-zinc-500 text-xs font-space-mono">Бот будет исполнять только выбранный тип сделок, остальные — игнорировать</p>
          <div className="grid grid-cols-3 gap-2">
            {([
              { value: "all", label: "📊 Все", desc: "CALL и PUT" },
              { value: "call_only", label: "📈 Только CALL", desc: "Только рост" },
              { value: "put_only", label: "📉 Только PUT", desc: "Только падение" },
            ] as const).map((opt) => (
              <button
                key={opt.value}
                onClick={() => set({ tradeDirection: opt.value })}
                className={`rounded-lg px-2 py-2.5 text-xs font-space-mono border transition-all text-center ${(config.tradeDirection ?? "all") === opt.value ? "bg-red-600/20 border-red-500/50 text-red-300" : "bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-zinc-500"}`}
              >
                <div className="font-bold mb-0.5">{opt.label}</div>
                <div className="text-zinc-500 text-[10px]">{opt.desc}</div>
              </button>
            ))}
          </div>
          {(config.tradeDirection ?? "all") !== "all" && (
            <div className="flex items-center gap-2 bg-red-950/40 border border-red-500/30 rounded-lg px-2.5 py-2">
              <span className="text-red-400 text-xs">⚠️</span>
              <span className="text-red-400 text-xs font-space-mono">
                Бот будет пропускать {(config.tradeDirection ?? "all") === "call_only" ? "PUT" : "CALL"}-сигналы — это снизит количество сделок
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Инверсия сигналов */}
      <Card className="bg-zinc-900 border-zinc-700">
        <CardHeader className="pb-2 pt-4 px-4">
          <CardTitle className="text-sm font-space-mono text-zinc-200 flex items-center gap-2">
            <span>🔄</span> Инверсия сигналов
            <Switch checked={config.invertSignal ?? false} onCheckedChange={(v) => set({ invertSignal: v })} className="ml-auto scale-90" />
          </CardTitle>
        </CardHeader>
        {config.invertSignal && (
          <CardContent className="px-4 pb-4 space-y-2">
            <p className="text-zinc-500 text-xs font-space-mono">Бот будет открывать противоположную сделку от сигнала стратегии</p>
            <div className="flex items-center gap-2 bg-orange-950/40 border border-orange-500/30 rounded-lg px-2.5 py-2">
              <span className="text-orange-400 text-xs font-space-mono">⚡ CALL → PUT &nbsp;|&nbsp; PUT → CALL</span>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Фильтр по времени */}
      <Card className="bg-zinc-900 border-zinc-700">
        <CardHeader className="pb-2 pt-4 px-4">
          <CardTitle className="text-sm font-space-mono text-zinc-200 flex items-center gap-2">
            <span>🕐</span> Фильтр по времени
            <Switch checked={config.timeFilterEnabled ?? false} onCheckedChange={(v) => set({ timeFilterEnabled: v })} className="ml-auto scale-90" />
          </CardTitle>
        </CardHeader>
        {(config.timeFilterEnabled) && (
          <CardContent className="px-4 pb-4 space-y-3">
            <p className="text-zinc-500 text-xs font-space-mono">Бот будет открывать сделки только в указанный промежуток (по московскому времени)</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-zinc-400 font-space-mono text-xs mb-1 block">С</Label>
                <Input type="time" value={config.timeFilterFrom ?? "09:00"} onChange={(e) => set({ timeFilterFrom: e.target.value })} className="bg-zinc-800 border-zinc-700 text-white font-space-mono text-sm h-9" />
              </div>
              <div>
                <Label className="text-zinc-400 font-space-mono text-xs mb-1 block">До</Label>
                <Input type="time" value={config.timeFilterTo ?? "21:00"} onChange={(e) => set({ timeFilterTo: e.target.value })} className="bg-zinc-800 border-zinc-700 text-white font-space-mono text-sm h-9" />
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* RSI-порог */}
      <Card className="bg-zinc-900 border-zinc-700">
        <CardHeader className="pb-2 pt-4 px-4">
          <CardTitle className="text-sm font-space-mono text-zinc-200 flex items-center gap-2">
            <span>📉</span> Жёсткий RSI-порог
            <Switch checked={config.rsiThresholdEnabled ?? false} onCheckedChange={(v) => set({ rsiThresholdEnabled: v })} className="ml-auto scale-90" />
          </CardTitle>
        </CardHeader>
        {(config.rsiThresholdEnabled) && (
          <CardContent className="px-4 pb-4 space-y-3">
            <p className="text-zinc-500 text-xs font-space-mono">Бот войдёт только при экстремальных значениях RSI — меньше сигналов, но точнее</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-zinc-400 font-space-mono text-xs mb-1 block">Перепроданность ≤</Label>
                <Input type="number" min={5} max={40} value={config.rsiThresholdOversold ?? 25} onChange={(e) => set({ rsiThresholdOversold: Number(e.target.value) })} className="bg-zinc-800 border-zinc-700 text-green-400 font-space-mono text-sm h-9" />
              </div>
              <div>
                <Label className="text-zinc-400 font-space-mono text-xs mb-1 block">Перекупленность ≥</Label>
                <Input type="number" min={60} max={95} value={config.rsiThresholdOverbought ?? 75} onChange={(e) => set({ rsiThresholdOverbought: Number(e.target.value) })} className="bg-zinc-800 border-zinc-700 text-red-400 font-space-mono text-sm h-9" />
              </div>
            </div>
            <div className="flex items-center gap-2 bg-blue-950/40 border border-blue-500/30 rounded-lg px-2.5 py-2">
              <span className="text-blue-400 text-xs font-space-mono">Стандарт RSI 30/70. Здесь ты задаёшь более жёсткие границы — бот пропустит слабые сигналы.</span>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Пауза после серии проигрышей */}
      <Card className="bg-zinc-900 border-zinc-700">
        <CardHeader className="pb-2 pt-4 px-4">
          <CardTitle className="text-sm font-space-mono text-zinc-200 flex items-center gap-2">
            <span>⏸️</span> Пауза после проигрышей
            <Switch checked={config.lossStreakPauseEnabled ?? false} onCheckedChange={(v) => set({ lossStreakPauseEnabled: v })} className="ml-auto scale-90" />
          </CardTitle>
        </CardHeader>
        {(config.lossStreakPauseEnabled) && (
          <CardContent className="px-4 pb-4 space-y-3">
            <p className="text-zinc-500 text-xs font-space-mono">Бот автоматически останавливается при серии проигрышей подряд</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-zinc-400 font-space-mono text-xs mb-1 block">Проигрышей подряд</Label>
                <Input type="number" min={1} max={20} value={config.lossStreakCount ?? 3} onChange={(e) => set({ lossStreakCount: Number(e.target.value) })} className="bg-zinc-800 border-zinc-700 text-orange-400 font-space-mono text-sm h-9" />
              </div>
              <div>
                <Label className="text-zinc-400 font-space-mono text-xs mb-1 block">Пауза (минут)</Label>
                <Input type="number" min={5} max={480} value={config.lossStreakPauseMin ?? 30} onChange={(e) => set({ lossStreakPauseMin: Number(e.target.value) })} className="bg-zinc-800 border-zinc-700 text-orange-400 font-space-mono text-sm h-9" />
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Следование тренду EMA100 */}
      <Card className="bg-zinc-900 border-zinc-700">
        <CardHeader className="pb-2 pt-4 px-4">
          <CardTitle className="text-sm font-space-mono text-zinc-200 flex items-center gap-2">
            <span>📈</span> Следование тренду (EMA100)
            <Switch checked={config.emaTrendFilterEnabled ?? false} onCheckedChange={(v) => set({ emaTrendFilterEnabled: v })} className="ml-auto scale-90" />
          </CardTitle>
        </CardHeader>
        {config.emaTrendFilterEnabled && (
          <CardContent className="px-4 pb-4 space-y-3">
            <p className="text-zinc-500 text-xs font-space-mono">Бот проверяет цену относительно EMA100 перед каждой сделкой</p>
            <div className="space-y-2">
              <div className="flex items-center gap-3 bg-green-500/5 border border-green-500/20 rounded-lg px-3 py-2">
                <span className="text-green-400 text-base">📈</span>
                <div>
                  <p className="text-green-400 font-space-mono text-xs font-semibold">Цена выше EMA100 → только CALL</p>
                  <p className="text-zinc-500 font-space-mono text-xs">Сигналы PUT отвергаются</p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-red-500/5 border border-red-500/20 rounded-lg px-3 py-2">
                <span className="text-red-400 text-base">📉</span>
                <div>
                  <p className="text-red-400 font-space-mono text-xs font-semibold">Цена ниже EMA100 → только PUT</p>
                  <p className="text-zinc-500 font-space-mono text-xs">Сигналы CALL отвергаются</p>
                </div>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Подтверждение свечами перед сделкой */}
      <Card className="bg-zinc-900 border-zinc-700">
        <CardHeader className="pb-2 pt-4 px-4">
          <CardTitle className="text-sm font-space-mono text-zinc-200 flex items-center gap-2">
            <span>🕯️</span> Подтверждение свечами
            <Switch checked={config.candleConfirmEnabled ?? false} onCheckedChange={(v) => set({ candleConfirmEnabled: v })} className="ml-auto scale-90" />
          </CardTitle>
        </CardHeader>
        {config.candleConfirmEnabled && (
          <CardContent className="px-4 pb-4 space-y-3">
            <p className="text-zinc-500 text-xs font-space-mono">Сделка открывается только если сигнал стратегии совпадает с N свечами одного цвета подряд прямо сейчас</p>
            <div>
              <p className="text-zinc-400 font-space-mono text-xs mb-2">Сколько свечей подряд нужно:</p>
              <div className="grid grid-cols-3 gap-2">
                {([2, 3, 4] as const).map((n) => (
                  <button
                    key={n}
                    onClick={() => set({ candleConfirmCount: n })}
                    className={`py-2 rounded-lg border font-orbitron text-sm font-bold transition-all
                      ${config.candleConfirmCount === n
                        ? "bg-orange-500/20 border-orange-500/50 text-orange-400"
                        : "bg-zinc-900 border-zinc-700 text-zinc-400 hover:border-zinc-500"
                      }`}
                  >
                    {"🕯️".repeat(n)}
                    <div className="text-[10px] font-space-mono font-normal mt-0.5 text-zinc-500">
                      {n} свечи
                    </div>
                  </button>
                ))}
              </div>
              <div className="mt-2 bg-orange-500/10 border border-orange-500/20 rounded-lg px-3 py-2 text-xs font-space-mono text-orange-400">
                {config.candleConfirmCount === 2 && "⚡ 2 свечи — больше сигналов, чуть ниже точность"}
                {config.candleConfirmCount === 3 && "✅ 3 свечи — оптимальный баланс сигналов и точности"}
                {config.candleConfirmCount === 4 && "🔒 4 свечи — редкие, но очень надёжные входы"}
              </div>
            </div>
          </CardContent>
        )}
      </Card>

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
          {(config.timeFilterEnabled || config.rsiThresholdEnabled || config.lossStreakPauseEnabled || (config.tradeDirection ?? "all") !== "all") && (
            <div className="mt-2 pt-2 border-t border-zinc-700 space-y-1">
              <p className="text-zinc-400 text-[11px] font-semibold">🛡 Активные защиты:</p>
              {(config.tradeDirection ?? "all") !== "all" && (
                <p className="text-red-400 text-[11px]">🚦 Только {config.tradeDirection === "call_only" ? "CALL (рост)" : "PUT (падение)"} — {config.tradeDirection === "call_only" ? "PUT" : "CALL"} игнорируется</p>
              )}
              {config.timeFilterEnabled && (
                <p className="text-blue-400 text-[11px]">🕐 Торговое окно: {config.timeFilterFrom}–{config.timeFilterTo}</p>
              )}
              {config.rsiThresholdEnabled && (
                <p className="text-purple-400 text-[11px]">📉 RSI-порог: вход только ≤{config.rsiThresholdOversold} / ≥{config.rsiThresholdOverbought}</p>
              )}
              {config.lossStreakPauseEnabled && (
                <p className="text-orange-400 text-[11px]">⏸️ Пауза {config.lossStreakPauseMin} мин после {config.lossStreakCount} проигрышей подряд</p>
              )}
            </div>
          )}
        </div>
      )}

      <Button
        onClick={onGenerate}
        className="w-full bg-red-600 hover:bg-red-500 text-white font-orbitron font-bold py-4 text-base rounded-xl transition-all duration-200 shadow-lg shadow-red-500/20"
      >
        {config.comboMode ? `🔀 Сгенерировать комбо-бот (${config.comboLogic})` : "Сгенерировать код бота"}
      </Button>
    </div>
  )
}