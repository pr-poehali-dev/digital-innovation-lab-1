import type { ReactNode } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import type { POBotConfig } from "./PocketOptionBotTypes"

interface EmaPreset {
  mode: string
  label: string
  fast: number
  slow: number
  hint: string
}

interface Props {
  config: POBotConfig
  set: (patch: Partial<POBotConfig>) => void
  EMA_PRESETS: readonly EmaPreset[] | EmaPreset[]
  rsiAiComment?: ReactNode
  emaAiComment?: ReactNode
}

/**
 * Combo-режим карточки настроек (этап 5):
 *  - Combo RSI+EMA settings
 *  - Combo Candle Pattern + Support/Resistance settings (только направление входа)
 */
export function ComboIndicatorSettingsCards({ config, set, EMA_PRESETS, rsiAiComment, emaAiComment }: Props) {
  return (
    <>
      {/* Combo RSI+EMA settings */}
      {config.comboMode && (config.comboStrategies.includes("rsi_reversal") || config.comboStrategies.includes("ema_cross")) && (
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
                {rsiAiComment}
                <div className="grid grid-cols-3 gap-1.5">
                  <button onClick={() => set({ trendFollow: "follow" })} className={`rounded-lg border px-2 py-2 text-xs font-space-mono transition-all ${config.trendFollow === "follow" ? "border-green-500/60 bg-green-500/10 text-green-400" : "border-zinc-700 bg-zinc-800/60 text-zinc-400 hover:border-zinc-600"}`}>↗ По тренду</button>
                  <button onClick={() => set({ trendFollow: "reverse" })} className={`rounded-lg border px-2 py-2 text-xs font-space-mono transition-all ${config.trendFollow === "reverse" ? "border-orange-500/60 bg-orange-500/10 text-orange-400" : "border-zinc-700 bg-zinc-800/60 text-zinc-400 hover:border-zinc-600"}`}>↙ Против</button>
                  <button onClick={() => set({ trendFollow: "combo" })} className={`rounded-lg border px-2 py-2 text-xs font-space-mono transition-all ${config.trendFollow === "combo" ? "border-blue-500/60 bg-blue-500/10 text-blue-400" : "border-zinc-700 bg-zinc-800/60 text-zinc-400 hover:border-zinc-600"}`}>↗↙ Комбо</button>
                </div>
                {config.trendFollow === "reverse" && (
                  <div className="flex items-start gap-2 bg-orange-950/40 border border-orange-500/30 rounded-lg px-2.5 py-2">
                    <span className="text-orange-400 text-xs font-space-mono leading-relaxed">⚠️ Только для флета. На трендовом рынке увеличивает убытки.</span>
                  </div>
                )}
                {config.trendFollow === "combo" && (
                  <div className="flex items-start gap-2 bg-blue-950/40 border border-blue-500/30 rounded-lg px-2.5 py-2">
                    <span className="text-blue-400 text-xs font-space-mono leading-relaxed">Комбо: ставит по любому сигналу без фильтра тренда.</span>
                  </div>
                )}
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
                        if (p.mode !== "custom") set({ emaTrendMode: p.mode as POBotConfig["emaTrendMode"], emaFast: p.fast, emaSlow: p.slow })
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
                {/* EMA mode (cross / trend / hybrid) — комбо */}
                <div className="space-y-1.5">
                  <Label className="text-zinc-500 font-space-mono text-xs">Режим EMA</Label>
                  <div className="grid grid-cols-3 gap-1.5">
                    <button onClick={() => set({ emaMode: "cross" })} className={`rounded-lg border px-2 py-1.5 text-xs font-space-mono transition-all ${(config.emaMode ?? "cross") === "cross" ? "border-green-500/60 bg-green-500/10 text-green-400" : "border-zinc-700 bg-zinc-800/60 text-zinc-400 hover:border-zinc-600"}`}>⚡ Cross</button>
                    <button onClick={() => set({ emaMode: "trend" })} className={`rounded-lg border px-2 py-1.5 text-xs font-space-mono transition-all ${config.emaMode === "trend" ? "border-emerald-500/60 bg-emerald-500/10 text-emerald-400" : "border-zinc-700 bg-zinc-800/60 text-zinc-400 hover:border-zinc-600"}`}>📈 Trend</button>
                    <button onClick={() => set({ emaMode: "trend_with_cross" })} className={`rounded-lg border px-2 py-1.5 text-xs font-space-mono transition-all ${config.emaMode === "trend_with_cross" ? "border-purple-500/60 bg-purple-500/10 text-purple-400" : "border-zinc-700 bg-zinc-800/60 text-zinc-400 hover:border-zinc-600"}`}>🎯 Гибрид</button>
                  </div>
                  <p className="text-zinc-600 text-xs font-space-mono">
                    {(config.emaMode ?? "cross") === "cross" && "Сигнал только в момент пересечения EMA"}
                    {config.emaMode === "trend" && "Сигнал на каждой свече — по позиции EMA"}
                    {config.emaMode === "trend_with_cross" && "Тренд + свежий кросс за последние 5 свечей (снайпер)"}
                  </p>
                </div>
                <div className="grid grid-cols-3 gap-1.5">
                  <button onClick={() => set({ trendFollow: "follow" })} className={`rounded-lg border px-2 py-2 text-xs font-space-mono transition-all ${config.trendFollow === "follow" ? "border-green-500/60 bg-green-500/10 text-green-400" : "border-zinc-700 bg-zinc-800/60 text-zinc-400 hover:border-zinc-600"}`}>↗ По тренду</button>
                  <button onClick={() => set({ trendFollow: "reverse" })} className={`rounded-lg border px-2 py-2 text-xs font-space-mono transition-all ${config.trendFollow === "reverse" ? "border-orange-500/60 bg-orange-500/10 text-orange-400" : "border-zinc-700 bg-zinc-800/60 text-zinc-400 hover:border-zinc-600"}`}>↙ Против</button>
                  <button onClick={() => set({ trendFollow: "combo" })} className={`rounded-lg border px-2 py-2 text-xs font-space-mono transition-all ${config.trendFollow === "combo" ? "border-blue-500/60 bg-blue-500/10 text-blue-400" : "border-zinc-700 bg-zinc-800/60 text-zinc-400 hover:border-zinc-600"}`}>↗↙ Комбо</button>
                </div>
                {config.trendFollow === "reverse" && (
                  <div className="flex items-start gap-2 bg-orange-950/40 border border-orange-500/30 rounded-lg px-2.5 py-2">
                    <span className="text-orange-400 text-xs font-space-mono leading-relaxed">⚠️ Только для флета. На трендовом рынке увеличивает убытки.</span>
                  </div>
                )}
                {config.trendFollow === "combo" && (
                  <div className="flex items-start gap-2 bg-blue-950/40 border border-blue-500/30 rounded-lg px-2.5 py-2">
                    <span className="text-blue-400 text-xs font-space-mono leading-relaxed">Комбо: ставит по любому сигналу без фильтра тренда.</span>
                  </div>
                )}
                {emaAiComment}
              </div>
            )}
            <div className="space-y-2 pt-1">
              <Label className="text-zinc-300 text-sm">Режим анализа свечей</Label>
              <p className="text-zinc-500 text-xs font-space-mono">Как бот читает 2 последних свечи перед входом</p>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => set({ trendMode: "same" })}
                  className={`flex flex-col items-start gap-1 rounded-xl border px-3 py-2.5 text-left transition-all ${(config.trendMode ?? "same") === "same" ? "border-green-500/60 bg-green-500/10" : "border-zinc-700 bg-zinc-800/60 hover:border-zinc-600"}`}
                >
                  <span className="text-sm font-medium text-zinc-200">🟢🟢 / 🔴🔴</span>
                  <span className="text-xs font-space-mono text-zinc-500">Одинаковые</span>
                </button>
                <button
                  onClick={() => set({ trendMode: "reverse" })}
                  className={`flex flex-col items-start gap-1 rounded-xl border px-3 py-2.5 text-left transition-all ${(config.trendMode ?? "same") === "reverse" ? "border-blue-500/60 bg-blue-500/10" : "border-zinc-700 bg-zinc-800/60 hover:border-zinc-600"}`}
                >
                  <span className="text-sm font-medium text-zinc-200">🔴🟢 / 🟢🔴</span>
                  <span className="text-xs font-space-mono text-zinc-500">Разворот</span>
                </button>
                <button
                  onClick={() => set({ trendMode: "any" })}
                  className={`flex flex-col items-start gap-1 rounded-xl border px-3 py-2.5 text-left transition-all ${(config.trendMode ?? "same") === "any" ? "border-purple-500/60 bg-purple-500/10" : "border-zinc-700 bg-zinc-800/60 hover:border-zinc-600"}`}
                >
                  <span className="text-sm font-medium text-zinc-200">🔀 Любой</span>
                  <span className="text-xs font-space-mono text-zinc-500">Все паттерны</span>
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Combo candle_pattern + support_resistance settings */}
      {config.comboMode && (config.comboStrategies.includes("candle_pattern") || config.comboStrategies.includes("support_resistance")) && (
        <Card className="bg-zinc-900 border-zinc-700">
          <CardHeader className="pb-3"><CardTitle className="font-orbitron text-white text-base">Направление входа</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <Label className="text-zinc-300 text-sm">Направление входа</Label>
              <div className="grid grid-cols-3 gap-1.5">
                <button onClick={() => set({ trendFollow: "follow" })} className={`rounded-lg border px-2 py-2 text-xs font-space-mono transition-all ${config.trendFollow === "follow" ? "border-green-500/60 bg-green-500/10 text-green-400" : "border-zinc-700 bg-zinc-800/60 text-zinc-400 hover:border-zinc-600"}`}>↗ По тренду</button>
                <button onClick={() => set({ trendFollow: "reverse" })} className={`rounded-lg border px-2 py-2 text-xs font-space-mono transition-all ${config.trendFollow === "reverse" ? "border-orange-500/60 bg-orange-500/10 text-orange-400" : "border-zinc-700 bg-zinc-800/60 text-zinc-400 hover:border-zinc-600"}`}>↙ Против</button>
                <button onClick={() => set({ trendFollow: "combo" })} className={`rounded-lg border px-2 py-2 text-xs font-space-mono transition-all ${config.trendFollow === "combo" ? "border-blue-500/60 bg-blue-500/10 text-blue-400" : "border-zinc-700 bg-zinc-800/60 text-zinc-400 hover:border-zinc-600"}`}>↗↙ Комбо</button>
              </div>
              {config.trendFollow === "reverse" && (
                <div className="flex items-start gap-2 bg-orange-950/40 border border-orange-500/30 rounded-lg px-2.5 py-2">
                  <span className="text-orange-400 text-xs font-space-mono leading-relaxed">⚠️ Только для флета. На трендовом рынке увеличивает убытки.</span>
                </div>
              )}
              {config.trendFollow === "combo" && (
                <div className="flex items-start gap-2 bg-blue-950/40 border border-blue-500/30 rounded-lg px-2.5 py-2">
                  <span className="text-blue-400 text-xs font-space-mono leading-relaxed">Комбо: ставит по любому сигналу без фильтра тренда.</span>
                </div>
              )}
            </div>
            <div className="space-y-2 pt-1">
              <Label className="text-zinc-300 text-sm">Режим анализа свечей</Label>
              <p className="text-zinc-500 text-xs font-space-mono">Как бот читает 2 последних свечи перед входом</p>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => set({ trendMode: "same" })}
                  className={`flex flex-col items-start gap-1 rounded-xl border px-3 py-2.5 text-left transition-all ${(config.trendMode ?? "same") === "same" ? "border-green-500/60 bg-green-500/10" : "border-zinc-700 bg-zinc-800/60 hover:border-zinc-600"}`}
                >
                  <span className="text-sm font-medium text-zinc-200">🟢🟢 / 🔴🔴</span>
                  <span className="text-xs font-space-mono text-zinc-500">Одинаковые</span>
                </button>
                <button
                  onClick={() => set({ trendMode: "reverse" })}
                  className={`flex flex-col items-start gap-1 rounded-xl border px-3 py-2.5 text-left transition-all ${(config.trendMode ?? "same") === "reverse" ? "border-blue-500/60 bg-blue-500/10" : "border-zinc-700 bg-zinc-800/60 hover:border-zinc-600"}`}
                >
                  <span className="text-sm font-medium text-zinc-200">🔴🟢 / 🟢🔴</span>
                  <span className="text-xs font-space-mono text-zinc-500">Разворот</span>
                </button>
                <button
                  onClick={() => set({ trendMode: "any" })}
                  className={`flex flex-col items-start gap-1 rounded-xl border px-3 py-2.5 text-left transition-all ${(config.trendMode ?? "same") === "any" ? "border-purple-500/60 bg-purple-500/10" : "border-zinc-700 bg-zinc-800/60 hover:border-zinc-600"}`}
                >
                  <span className="text-sm font-medium text-zinc-200">🔀 Любой</span>
                  <span className="text-xs font-space-mono text-zinc-500">Все паттерны</span>
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  )
}

export default ComboIndicatorSettingsCards
