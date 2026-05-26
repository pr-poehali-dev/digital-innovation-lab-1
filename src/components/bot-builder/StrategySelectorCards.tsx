import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import Icon from "@/components/ui/icon"
import { PO_STRATEGIES, type POBotConfig, type POComboLogic, type POStrategy } from "./PocketOptionBotTypes"

interface ComboPreset {
  id: string
  name: string
  emoji: string
  tag: string
  tagColor: string
  desc: string
  tip: string
  expiry: number
  logic: POComboLogic
  strategies: POStrategy[]
}

interface Props {
  config: POBotConfig
  set: (patch: Partial<POBotConfig>) => void
  detailOpen: Record<string, boolean>
  toggleDetail: (key: string) => void
  /** Все ключи стратегий (отфильтрованные на стороне родителя при необходимости) */
  strategies: POStrategy[]
  /** Готовые пресеты комбо */
  PRESETS: ComboPreset[]
  /** Тогглит выбор стратегии в comboStrategies */
  toggleComboStrategy: (key: POStrategy) => void
  /** Применяет пресет (выставляет comboStrategies + comboLogic + expiry) */
  applyPreset: (preset: ComboPreset) => void
  /** Компонент StrategyCard передаётся как проп (он module-level в основном файле) */
  StrategyCard: React.ComponentType<{
    stratKey: POStrategy
    active: boolean
    selectable?: boolean
    onClick: () => void
    showDetail: boolean
    onToggleDetail: () => void
  }>
}

/**
 * Strategy Selector / Combo Mode Picker (этап 6).
 *
 * Содержит два варианта рендера в зависимости от config.comboMode:
 *  - Single mode: список карточек стратегий (RSI / Candle / S/R / EMA)
 *  - Combo mode: AND/OR логика + пресеты + чекбоксы стратегий + оценка комбо + режим свечей
 */
export function StrategySelectorCards({
  config,
  set,
  detailOpen,
  toggleDetail,
  strategies,
  PRESETS,
  toggleComboStrategy,
  applyPreset,
  StrategyCard,
}: Props) {
  return (
    <>
      {/* Strategy selection */}
      {!config.comboMode ? (
        <Card className="bg-zinc-900 border-red-500/20">
          <CardHeader className="pb-3">
            <CardTitle className="font-orbitron text-white text-base">Стратегия</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {strategies.filter((k) => k !== "ema_trend").map((key) => (
              <StrategyCard
                key={key}
                stratKey={key}
                active={config.strategy === key}
                onClick={() => set({ strategy: key })}
                showDetail={!!detailOpen[key]}
                onToggleDetail={() => toggleDetail(key)}
              />
            ))}
            {config.strategy === "support_resistance" && (
              <div className="flex items-center gap-2 bg-purple-950/40 border border-purple-500/30 rounded-lg px-3 py-2 mt-1">
                <Icon name="ArrowDown" size={13} className="text-purple-400 shrink-0 animate-bounce" />
                <span className="text-purple-300 font-space-mono text-xs">Настройки уровней — прокрути вниз до раздела <b>"Настройки уровней"</b></span>
              </div>
            )}
            {config.strategy === "ema_trend" && (
              <div className="flex items-center gap-2 bg-emerald-950/40 border border-emerald-500/30 rounded-lg px-3 py-2 mt-1">
                <Icon name="TrendingUp" size={13} className="text-emerald-400 shrink-0" />
                <span className="text-emerald-300 font-space-mono text-xs">Рекомендуется для трендовых активов: <b>EUR/USD OTC, USD/JPY OTC, BTC/USD</b>. Сигналы идут постоянно пока тренд активен — включи фильтр тренда "По тренду ↗"</span>
              </div>
            )}
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

            {/* Strategy cards with checkboxes — ema_trend скрыт, режим выбирается в карточке EMA через emaMode */}
            <div className="space-y-2">
              {strategies.filter((k) => k !== "martingale" && k !== "ema_trend").map((key) => {
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
            {/* Trend mode */}
            <div className="space-y-2 pt-1">
              <Label className="text-zinc-300 text-sm">Режим анализа свечей</Label>
              <p className="text-zinc-500 text-xs font-space-mono">Бот смотрит на 3 последних закрытых свечи</p>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => set({ trendMode: "same" })}
                  className={`flex flex-col items-start gap-1 rounded-xl border px-3 py-2.5 text-left transition-all ${(config.trendMode ?? "same") === "same" ? "border-green-500/60 bg-green-500/10" : "border-zinc-700 bg-zinc-800/60 hover:border-zinc-600"}`}
                >
                  <span className="text-sm font-medium text-zinc-200">🟢🟢🟢 / 🔴🔴🔴</span>
                  <span className="text-xs font-space-mono text-zinc-500">Тренд</span>
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
              {/* Подсказка по выбранному режиму */}
              {(config.trendMode ?? "same") === "same" && (
                <div className="bg-green-950/30 border border-green-500/20 rounded-lg px-3 py-2 text-xs font-space-mono text-green-300/80">
                  ✅ Вход только когда <b>все 3 последних свечи</b> одного цвета — чёткий тренд подтверждён. Меньше сигналов, но точнее.
                </div>
              )}
              {(config.trendMode ?? "same") === "reverse" && (
                <div className="bg-blue-950/30 border border-blue-500/20 rounded-lg px-3 py-2 text-xs font-space-mono text-blue-300/80">
                  🔄 Вход на <b>смене направления</b>: предпоследняя и последняя свечи — разного цвета. Работает на флете и после сильного движения.
                </div>
              )}
              {(config.trendMode ?? "same") === "any" && (
                <div className="bg-purple-950/30 border border-purple-500/20 rounded-lg px-3 py-2 text-xs font-space-mono text-purple-300/80">
                  ⚡ Бот входит при <b>любом паттерне</b> — и по тренду, и на разворотах. Больше сделок, но ниже точность. Лучше использовать с сильной стратегией.
                </div>
              )}
            </div>
            {config.comboStrategies.includes("support_resistance") && (
              <div className="flex items-center gap-2 bg-purple-950/40 border border-purple-500/30 rounded-lg px-3 py-2">
                <Icon name="ArrowDown" size={13} className="text-purple-400 shrink-0 animate-bounce" />
                <span className="text-purple-300 font-space-mono text-xs">Настройки уровней — прокрути вниз до раздела <b>"Настройки уровней"</b></span>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </>
  )
}

export default StrategySelectorCards
