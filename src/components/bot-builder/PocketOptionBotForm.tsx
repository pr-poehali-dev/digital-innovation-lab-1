import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
  PO_STRATEGIES,
  PO_ASSETS,
  PO_EXPIRY_LABELS,
} from "./PocketOptionBotTypes"

interface Props {
  config: POBotConfig
  onChange: (config: POBotConfig) => void
  onGenerate: () => void
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

export default function PocketOptionBotForm({ config, onChange, onGenerate }: Props) {
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

            {/* Strategy cards with checkboxes */}
            <div className="space-y-2">
              {strategies.filter((k) => k !== "martingale").map((key) => {
                const isActive = config.comboStrategies.includes(key)
                return (
                  <StrategyCard
                    key={key}
                    stratKey={key}
                    active={isActive}
                    selectable
                    onClick={() => toggleComboStrategy(key)}
                    showDetail={!!detailOpen["combo_" + key]}
                    onToggleDetail={() => toggleDetail("combo_" + key)}
                  />
                )
              })}
            </div>

            {config.comboStrategies.length >= 2 && (
              <div className="bg-zinc-800 rounded-xl px-4 py-3 text-xs font-space-mono space-y-1">
                <p className="text-zinc-400 font-semibold mb-1.5">Предварительная оценка комбо:</p>
                {config.comboLogic === "AND" ? (
                  <>
                    <p className="text-zinc-500">
                      • Сигналов/день: ~{Math.max(2, Math.min(...config.comboStrategies.filter(s=>s!=="martingale").map(s => parseInt(PO_STRATEGIES[s].signalsPerDay))))}
                    </p>
                    <p className="text-green-400">• Качество сигналов: Высокое (все совпадают)</p>
                    <p className="text-zinc-500">• Риск ложных входов: Низкий</p>
                  </>
                ) : (
                  <>
                    <p className="text-zinc-500">
                      • Сигналов/день: ~{config.comboStrategies.filter(s=>s!=="martingale").reduce((a,s) => a + parseInt(PO_STRATEGIES[s].signalsPerDay), 0)}
                    </p>
                    <p className="text-yellow-400">• Качество сигналов: Среднее (голосование)</p>
                    <p className="text-zinc-500">• Риск ложных входов: Средний</p>
                  </>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Asset & Expiry */}
      <Card className="bg-zinc-900 border-red-500/20">
        <CardHeader className="pb-3">
          <CardTitle className="font-orbitron text-white text-base">Актив и экспирация</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-zinc-400 font-space-mono text-xs mb-1.5 block">Торговый актив</Label>
            <Select value={config.asset} onValueChange={(v) => set({ asset: v })}>
              <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white font-space-mono text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-zinc-800 border-zinc-700 max-h-64">
                {PO_ASSETS.map((a) => (
                  <SelectItem key={a} value={a} className="text-white font-space-mono text-xs hover:bg-zinc-700">
                    {a}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

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
              {config.betPercent ? "Ставка (% от баланса)" : "Ставка (USD)"}
            </Label>
            <div className="flex items-center gap-3">
              <Slider
                min={1} max={config.betPercent ? 50 : 200} step={1}
                value={[config.betAmount]}
                onValueChange={([v]) => set({ betAmount: v })}
                className="flex-1"
              />
              <span className="text-red-400 font-orbitron font-bold text-sm w-16 text-right">
                {config.betAmount}{config.betPercent ? "%" : "$"}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-zinc-400 font-space-mono text-xs mb-1.5 block">Take Profit (USD)</Label>
              <Input type="number" value={config.takeProfitUsd} onChange={(e) => set({ takeProfitUsd: Number(e.target.value) })} className="bg-zinc-800 border-zinc-700 text-green-400 font-space-mono text-sm" />
            </div>
            <div>
              <Label className="text-zinc-400 font-space-mono text-xs mb-1.5 block">Stop Loss (USD)</Label>
              <Input type="number" value={config.stopLossUsd} onChange={(e) => set({ stopLossUsd: Number(e.target.value) })} className="bg-zinc-800 border-zinc-700 text-red-400 font-space-mono text-sm" />
            </div>
          </div>

          <div>
            <Label className="text-zinc-400 font-space-mono text-xs mb-1.5 block">Макс. сделок в день: {config.dailyLimit}</Label>
            <Slider min={1} max={100} step={1} value={[config.dailyLimit]} onValueChange={([v]) => set({ dailyLimit: v })} />
          </div>

          <div className="flex items-center justify-between pt-1">
            <div>
              <Label className="text-zinc-300 text-sm">Авто-перезапуск</Label>
              <p className="text-zinc-500 text-xs font-space-mono">Продолжать после TP/SL</p>
            </div>
            <Switch checked={config.autoRestart} onCheckedChange={(v) => set({ autoRestart: v })} />
          </div>
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
              <p className="text-zinc-400">Пример с базовой ставкой ${config.betAmount}:</p>
              {Array.from({ length: config.martingaleSteps }, (_, i) => {
                const bet = (config.betAmount * Math.pow(config.martingaleMultiplier, i)).toFixed(2)
                return (
                  <p key={i} className={i === 0 ? "text-green-400" : i < 3 ? "text-yellow-400" : "text-red-400"}>
                    Шаг {i + 1}: ${bet}
                  </p>
                )
              })}
            </div>
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
          </CardContent>
        </Card>
      )}

      {/* EMA settings */}
      {!config.comboMode && config.strategy === "ema_cross" && (
        <Card className="bg-zinc-900 border-green-500/20">
          <CardHeader className="pb-3"><CardTitle className="font-orbitron text-white text-base">Настройки EMA</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-zinc-400 font-space-mono text-xs mb-1.5 block">Быстрая EMA</Label>
                <Input type="number" value={config.emaFast} onChange={(e) => set({ emaFast: Number(e.target.value) })} className="bg-zinc-800 border-zinc-700 text-green-400 font-space-mono text-sm" />
              </div>
              <div>
                <Label className="text-zinc-400 font-space-mono text-xs mb-1.5 block">Медленная EMA</Label>
                <Input type="number" value={config.emaSlow} onChange={(e) => set({ emaSlow: Number(e.target.value) })} className="bg-zinc-800 border-zinc-700 text-blue-400 font-space-mono text-sm" />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Combo RSI+EMA settings */}
      {config.comboMode && (config.comboStrategies.includes("rsi_reversal") || config.comboStrategies.includes("ema_cross")) && (
        <Card className="bg-zinc-900 border-zinc-700">
          <CardHeader className="pb-3"><CardTitle className="font-orbitron text-white text-base">Параметры индикаторов</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {config.comboStrategies.includes("rsi_reversal") && (
              <div className="space-y-3">
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
              </div>
            )}
            {config.comboStrategies.includes("ema_cross") && (
              <div className="space-y-3">
                <p className="text-green-400 font-space-mono text-xs font-semibold">EMA</p>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label className="text-zinc-500 font-space-mono text-xs mb-1 block">Быстрая EMA</Label>
                    <Input type="number" value={config.emaFast} onChange={(e) => set({ emaFast: Number(e.target.value) })} className="bg-zinc-800 border-zinc-700 text-green-400 font-space-mono text-xs h-8" />
                  </div>
                  <div>
                    <Label className="text-zinc-500 font-space-mono text-xs mb-1 block">Медленная EMA</Label>
                    <Input type="number" value={config.emaSlow} onChange={(e) => set({ emaSlow: Number(e.target.value) })} className="bg-zinc-800 border-zinc-700 text-blue-400 font-space-mono text-xs h-8" />
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
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
