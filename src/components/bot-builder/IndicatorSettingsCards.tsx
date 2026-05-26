import type { ReactNode } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import SrPresetsBlock from "./SrPresetsBlock"
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
  /** Готовый <AIComment {...rsiComment(config)} /> от родителя */
  rsiAiComment?: ReactNode
  /** Готовый <AIComment {...emaComment(config)} /> от родителя */
  emaAiComment?: ReactNode
}

/**
 * Single-strategy карточки настроек индикаторов (этап 5):
 *  - RSI settings (strategy === "rsi_reversal")
 *  - Candle Pattern settings (strategy === "candle_pattern")
 *  - Support/Resistance settings (strategy === "support_resistance" ИЛИ combo)
 *  - EMA Cross settings (strategy === "ema_cross")
 *
 * Combo-режим вынесен отдельно в ComboIndicatorSettingsCards.tsx
 */
export function IndicatorSettingsCards({ config, set, EMA_PRESETS, rsiAiComment, emaAiComment }: Props) {
  return (
    <>
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
            {rsiAiComment}
            {/* Trend direction */}
            <div className="space-y-2">
              <Label className="text-zinc-300 text-sm">Направление входа</Label>
              <div className="grid grid-cols-3 gap-1.5">
                <button onClick={() => set({ trendFollow: "follow" })} className={`rounded-lg border px-2 py-2 text-xs font-space-mono transition-all ${config.trendFollow === "follow" ? "border-green-500/60 bg-green-500/10 text-green-400" : "border-zinc-700 bg-zinc-800/60 text-zinc-400 hover:border-zinc-600"}`}>↗ По тренду</button>
                <button onClick={() => set({ trendFollow: "reverse" })} className={`rounded-lg border px-2 py-2 text-xs font-space-mono transition-all ${config.trendFollow === "reverse" ? "border-orange-500/60 bg-orange-500/10 text-orange-400" : "border-zinc-700 bg-zinc-800/60 text-zinc-400 hover:border-zinc-600"}`}>↙ Против</button>
                <button onClick={() => set({ trendFollow: "combo" })} className={`rounded-lg border px-2 py-2 text-xs font-space-mono transition-all ${config.trendFollow === "combo" ? "border-blue-500/60 bg-blue-500/10 text-blue-400" : "border-zinc-700 bg-zinc-800/60 text-zinc-400 hover:border-zinc-600"}`}>↗↙ Комбо</button>
              </div>
              {config.trendFollow === "reverse" && (
                <div className="flex items-start gap-2 bg-orange-950/40 border border-orange-500/30 rounded-lg px-3 py-2">
                  <span className="text-orange-400 text-xs font-space-mono leading-relaxed">↙ Против тренда: бот переворачивает сигнал стратегии (CALL↔PUT) и тренд для фильтра. Ставит на разворот. Подходит для флета, опасно при сильном тренде.</span>
                </div>
              )}
              {config.trendFollow === "combo" && (
                <div className="flex items-start gap-2 bg-blue-950/40 border border-blue-500/30 rounded-lg px-3 py-2">
                  <span className="text-blue-400 text-xs font-space-mono leading-relaxed">Комбо: бот ставит по любому сигналу стратегии без фильтра тренда.</span>
                </div>
              )}
            </div>
            {/* Trend mode */}
            <div className="space-y-2">
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

      {/* Candle Pattern settings */}
      {!config.comboMode && config.strategy === "candle_pattern" && (
        <Card className="bg-zinc-900 border-yellow-500/20">
          <CardHeader className="pb-3"><CardTitle className="font-orbitron text-white text-base">Настройки паттернов свечей</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <p className="text-zinc-500 text-xs font-space-mono leading-relaxed">
              Бот ищет разворотные паттерны (молот, поглощение, доджи). Сигнал формируется при закрытии свечи.
            </p>
            <div className="space-y-2">
              <Label className="text-zinc-300 text-sm">Направление входа</Label>
              <p className="text-zinc-500 text-xs font-space-mono">Как сигнал стратегии соотносится с определённым трендом</p>
              <div className="grid grid-cols-3 gap-1.5">
                <button onClick={() => set({ trendFollow: "follow" })} className={`rounded-lg border px-2 py-2 text-xs font-space-mono transition-all ${config.trendFollow === "follow" ? "border-green-500/60 bg-green-500/10 text-green-400" : "border-zinc-700 bg-zinc-800/60 text-zinc-400 hover:border-zinc-600"}`}>↗ По тренду</button>
                <button onClick={() => set({ trendFollow: "reverse" })} className={`rounded-lg border px-2 py-2 text-xs font-space-mono transition-all ${config.trendFollow === "reverse" ? "border-orange-500/60 bg-orange-500/10 text-orange-400" : "border-zinc-700 bg-zinc-800/60 text-zinc-400 hover:border-zinc-600"}`}>↙ Против</button>
                <button onClick={() => set({ trendFollow: "combo" })} className={`rounded-lg border px-2 py-2 text-xs font-space-mono transition-all ${config.trendFollow === "combo" ? "border-blue-500/60 bg-blue-500/10 text-blue-400" : "border-zinc-700 bg-zinc-800/60 text-zinc-400 hover:border-zinc-600"}`}>↗↙ Комбо</button>
              </div>
              {config.trendFollow === "follow" && (
                <div className="bg-green-950/30 border border-green-500/20 rounded-lg px-3 py-2 text-xs font-space-mono text-green-300/80">
                  ↗ Бот входит <b>только когда сигнал совпадает с трендом</b>. Тренд вверх → только CALL. Самый надёжный режим — меньше сделок, выше точность.
                </div>
              )}
              {config.trendFollow === "reverse" && (
                <div className="bg-orange-950/30 border border-orange-500/20 rounded-lg px-3 py-2 text-xs font-space-mono text-orange-300/80">
                  ↙ Бот входит <b>против тренда</b> — сигналы инвертируются: CALL→PUT, PUT→CALL. Работает на флете и откатах. ⚠️ На сильном тренде увеличивает убытки.
                </div>
              )}
              {config.trendFollow === "combo" && (
                <div className="bg-blue-950/30 border border-blue-500/20 rounded-lg px-3 py-2 text-xs font-space-mono text-blue-300/80">
                  ↗↙ Бот торгует <b>любой сигнал стратегии</b> без фильтра по тренду. Максимум сделок, но ниже точность — подходит только с очень сильной стратегией.
                </div>
              )}
            </div>
            {/* Trend mode */}
            <div className="space-y-2">
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

      {/* Support/Resistance settings */}
      {((!config.comboMode && config.strategy === "support_resistance") || (config.comboMode && config.comboStrategies.includes("support_resistance"))) && (
        <Card className="bg-zinc-900 border-purple-500/20">
          <CardHeader className="pb-3"><CardTitle className="font-orbitron text-white text-base">Настройки уровней</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <p className="text-zinc-500 text-xs font-space-mono leading-relaxed">
              Бот торгует от уровней поддержки и сопротивления. Вход при отбое от уровня.
            </p>

            {/* Окно автопоиска */}
            <div>
              <Label className="text-zinc-400 font-space-mono text-xs mb-1.5 block">
                Окно автопоиска уровней: <span className="text-white font-bold">{config.srWindow} свечей</span>
              </Label>
              <Slider min={5} max={30} step={1} value={[config.srWindow]} onValueChange={([v]) => set({ srWindow: v })} />
              <p className="text-zinc-600 font-space-mono text-[10px] mt-1">Бот ищет локальные минимумы/максимумы в окне из {config.srWindow} свечей</p>
            </div>

            {/* Шаг сетки */}
            <div>
              <Label className="text-zinc-400 font-space-mono text-xs mb-1.5 block">
                Шаг сетки уровней: <span className="text-white font-bold">{config.srStep === 0 ? "авто (по свечам)" : config.srStep}</span>
              </Label>
              <Slider min={0} max={0.1} step={0.001} value={[config.srStep]} onValueChange={([v]) => set({ srStep: Math.round(v * 1000) / 1000 })} />
              <p className="text-zinc-600 font-space-mono text-[10px] mt-1">
                {config.srStep === 0 ? "0 = только автоуровни из свечей" : `Сетка уровней через каждые ${config.srStep} пункта`}
              </p>
            </div>

            {/* Ручные уровни */}
            <div>
              <Label className="text-zinc-400 font-space-mono text-xs mb-1.5 block">Ручные уровни (через запятую)</Label>
              <input
                type="text"
                value={config.srManualLevels}
                onChange={(e) => set({ srManualLevels: e.target.value })}
                placeholder="1.0850, 1.0900, 1.0950"
                className="w-full bg-zinc-800 border border-zinc-700 text-white font-space-mono text-xs rounded-md px-3 py-2 focus:outline-none focus:border-purple-500/50"
              />
              <p className="text-zinc-600 font-space-mono text-[10px] mt-1">Имеют наивысший приоритет. Оставь пустым для автоопределения.</p>
            </div>

            {/* Пресеты по паре — берутся из общего рантайм-стора, обновляются кнопкой "Обновить уровни" */}
            <SrPresetsBlock asset={config.asset} srManualLevels={config.srManualLevels} set={set} />

            <div className="space-y-2">
              <Label className="text-zinc-300 text-sm">Направление входа</Label>
              <div className="grid grid-cols-3 gap-1.5">
                <button onClick={() => set({ trendFollow: "follow" })} className={`rounded-lg border px-2 py-2 text-xs font-space-mono transition-all ${config.trendFollow === "follow" ? "border-green-500/60 bg-green-500/10 text-green-400" : "border-zinc-700 bg-zinc-800/60 text-zinc-400 hover:border-zinc-600"}`}>↗ По тренду</button>
                <button onClick={() => set({ trendFollow: "reverse" })} className={`rounded-lg border px-2 py-2 text-xs font-space-mono transition-all ${config.trendFollow === "reverse" ? "border-orange-500/60 bg-orange-500/10 text-orange-400" : "border-zinc-700 bg-zinc-800/60 text-zinc-400 hover:border-zinc-600"}`}>↙ Против</button>
                <button onClick={() => set({ trendFollow: "combo" })} className={`rounded-lg border px-2 py-2 text-xs font-space-mono transition-all ${config.trendFollow === "combo" ? "border-blue-500/60 bg-blue-500/10 text-blue-400" : "border-zinc-700 bg-zinc-800/60 text-zinc-400 hover:border-zinc-600"}`}>↗↙ Комбо</button>
              </div>
              {config.trendFollow === "reverse" && (
                <div className="flex items-start gap-2 bg-orange-950/40 border border-orange-500/30 rounded-lg px-3 py-2">
                  <span className="text-orange-400 text-xs font-space-mono leading-relaxed">↙ Против тренда: бот переворачивает сигнал стратегии (CALL↔PUT) и тренд для фильтра. Ставит на разворот. Подходит для флета, опасно при сильном тренде.</span>
                </div>
              )}
              {config.trendFollow === "combo" && (
                <div className="flex items-start gap-2 bg-blue-950/40 border border-blue-500/30 rounded-lg px-3 py-2">
                  <span className="text-blue-400 text-xs font-space-mono leading-relaxed">Комбо: бот ставит по любому сигналу стратегии без фильтра тренда.</span>
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

            <div className="space-y-2 pt-1">
              <Label className="text-zinc-300 text-sm">Таймфрейм свечей</Label>
              <p className="text-zinc-500 text-xs font-space-mono">Размер одной свечи для анализа сигнала</p>
              <div className="grid grid-cols-4 gap-2">
                {([
                  { value: 60,   label: "1 мин",  sub: "60 свечей = 1ч" },
                  { value: 300,  label: "5 мин",  sub: "60 свечей = 5ч" },
                  { value: 900,  label: "15 мин", sub: "60 свечей = 15ч" },
                  { value: 3600, label: "1 час",  sub: "60 свечей = 2.5д" },
                ] as const).map(({ value, label, sub }) => {
                  const active = (config.candleTimeframe ?? 60) === value
                  return (
                    <button
                      key={value}
                      onClick={() => set({ candleTimeframe: value })}
                      className={`flex flex-col items-start gap-0.5 rounded-xl border px-3 py-2.5 text-left transition-all ${active ? "border-orange-500/60 bg-orange-500/10" : "border-zinc-700 bg-zinc-800/60 hover:border-zinc-600"}`}
                    >
                      <span className={`text-sm font-medium ${active ? "text-orange-300" : "text-zinc-200"}`}>{label}</span>
                      <span className="text-xs font-space-mono text-zinc-500">{sub}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* EMA Cross settings */}
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
                      if (p.mode !== "custom") set({ emaTrendMode: p.mode as POBotConfig["emaTrendMode"], emaFast: p.fast, emaSlow: p.slow })
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
            {/* EMA mode (cross / trend / hybrid) */}
            <div className="space-y-2 pt-1">
              <Label className="text-zinc-300 text-sm">Режим работы EMA</Label>
              <p className="text-zinc-500 text-xs font-space-mono">Когда бот даёт сигнал — выбери логику</p>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => set({ emaMode: "cross" })}
                  className={`flex flex-col items-start gap-1 rounded-xl border px-3 py-2.5 text-left transition-all ${(config.emaMode ?? "cross") === "cross" ? "border-green-500/60 bg-green-500/10" : "border-zinc-700 bg-zinc-800/60 hover:border-zinc-600"}`}
                >
                  <span className="text-sm font-medium text-zinc-200">⚡ Cross</span>
                  <span className="text-xs font-space-mono text-zinc-500">Только пересечение</span>
                </button>
                <button
                  onClick={() => set({ emaMode: "trend" })}
                  className={`flex flex-col items-start gap-1 rounded-xl border px-3 py-2.5 text-left transition-all ${config.emaMode === "trend" ? "border-emerald-500/60 bg-emerald-500/10" : "border-zinc-700 bg-zinc-800/60 hover:border-zinc-600"}`}
                >
                  <span className="text-sm font-medium text-zinc-200">📈 Trend</span>
                  <span className="text-xs font-space-mono text-zinc-500">Постоянно по тренду</span>
                </button>
                <button
                  onClick={() => set({ emaMode: "trend_with_cross" })}
                  className={`flex flex-col items-start gap-1 rounded-xl border px-3 py-2.5 text-left transition-all ${config.emaMode === "trend_with_cross" ? "border-purple-500/60 bg-purple-500/10" : "border-zinc-700 bg-zinc-800/60 hover:border-zinc-600"}`}
                >
                  <span className="text-sm font-medium text-zinc-200">🎯 Гибрид</span>
                  <span className="text-xs font-space-mono text-zinc-500">Тренд + свежий кросс</span>
                </button>
              </div>
              <div className="bg-zinc-950/60 border border-zinc-800 rounded-lg px-3 py-2 mt-1">
                {(config.emaMode ?? "cross") === "cross" && (
                  <p className="text-zinc-400 text-xs font-space-mono leading-relaxed">⚡ <b className="text-green-400">Cross</b>: вход только в момент пересечения EMA. Мало сигналов, точные точки входа.</p>
                )}
                {config.emaMode === "trend" && (
                  <p className="text-zinc-400 text-xs font-space-mono leading-relaxed">📈 <b className="text-emerald-400">Trend</b>: сигнал на каждой свече по позиции EMA. Много сигналов, нужен фильтр тренда.</p>
                )}
                {config.emaMode === "trend_with_cross" && (
                  <p className="text-zinc-400 text-xs font-space-mono leading-relaxed">🎯 <b className="text-purple-400">Гибрид</b>: торгуем по тренду, но только если в последние 5 свечей был кросс. Снайперский режим — реже, но точнее.</p>
                )}
              </div>
            </div>
            {/* Trend direction */}
            <div className="space-y-2">
              <Label className="text-zinc-300 text-sm">Направление входа</Label>
              <div className="grid grid-cols-3 gap-1.5">
                <button onClick={() => set({ trendFollow: "follow" })} className={`rounded-lg border px-2 py-2 text-xs font-space-mono transition-all ${config.trendFollow === "follow" ? "border-green-500/60 bg-green-500/10 text-green-400" : "border-zinc-700 bg-zinc-800/60 text-zinc-400 hover:border-zinc-600"}`}>↗ По тренду</button>
                <button onClick={() => set({ trendFollow: "reverse" })} className={`rounded-lg border px-2 py-2 text-xs font-space-mono transition-all ${config.trendFollow === "reverse" ? "border-orange-500/60 bg-orange-500/10 text-orange-400" : "border-zinc-700 bg-zinc-800/60 text-zinc-400 hover:border-zinc-600"}`}>↙ Против</button>
                <button onClick={() => set({ trendFollow: "combo" })} className={`rounded-lg border px-2 py-2 text-xs font-space-mono transition-all ${config.trendFollow === "combo" ? "border-blue-500/60 bg-blue-500/10 text-blue-400" : "border-zinc-700 bg-zinc-800/60 text-zinc-400 hover:border-zinc-600"}`}>↗↙ Комбо</button>
              </div>
              {config.trendFollow === "reverse" && (
                <div className="flex items-start gap-2 bg-orange-950/40 border border-orange-500/30 rounded-lg px-3 py-2">
                  <span className="text-orange-400 text-xs font-space-mono leading-relaxed">↙ Против тренда: бот переворачивает сигнал стратегии (CALL↔PUT) и тренд для фильтра. Ставит на разворот. Подходит для флета, опасно при сильном тренде.</span>
                </div>
              )}
              {config.trendFollow === "combo" && (
                <div className="flex items-start gap-2 bg-blue-950/40 border border-blue-500/30 rounded-lg px-3 py-2">
                  <span className="text-blue-400 text-xs font-space-mono leading-relaxed">Комбо: бот ставит по любому сигналу стратегии без фильтра тренда.</span>
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
            {emaAiComment}
          </CardContent>
        </Card>
      )}
    </>
  )
}

export default IndicatorSettingsCards
