import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import Icon from "@/components/ui/icon"
import type { POBotConfig } from "./PocketOptionBotTypes"

interface Props {
  config: POBotConfig
  set: (patch: Partial<POBotConfig>) => void
  detailOpen: Record<string, boolean>
  toggleDetail: (key: string) => void
}

/**
 * Две карточки, идущие подряд:
 *  - 🔥 Прогрев бота (свечи) — всегда открыта
 *  - 📈 Расширение прибыли — collapsible (toggleDetail("profitExt"))
 *
 * Декомпозированы из PocketOptionBotForm.tsx (этап 4).
 */
export function BotWarmupAndProfitExtensionCards({ config, set, detailOpen, toggleDetail }: Props) {
  return (
    <>
      {/* 🔥 Прогрев бота (свечи) */}
      <Card className="bg-zinc-900 border-2 border-cyan-500/40">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-space-mono text-zinc-300 flex items-center gap-2">
            🔥 Прогрев бота — старт без 42-минутного ожидания
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-zinc-300 font-space-mono text-xs">Прогрев историей через API РО</p>
              <p className="text-zinc-500 font-space-mono text-[10px] mt-0.5">
                Бот запросит готовые свечи нужного ТФ из истории РО → сделки с первой минуты, качество индикаторов полное.
              </p>
            </div>
            <Switch checked={config.warmupHistoryEnabled !== false} onCheckedChange={(v) => set({ warmupHistoryEnabled: v })} />
          </div>

          <div className="flex items-center justify-between border-t border-zinc-800 pt-3">
            <div>
              <p className="text-zinc-300 font-space-mono text-xs">Адаптивные индикаторы (фоллбэк)</p>
              <p className="text-zinc-500 font-space-mono text-[10px] mt-0.5">
                Если РО не отдаст историю — торгуем с 2 свечей, период RSI/EMA уменьшается под буфер. Качество растёт по мере накопления.
              </p>
            </div>
            <Switch checked={config.adaptiveIndicators !== false} onCheckedChange={(v) => set({ adaptiveIndicators: v })} />
          </div>

          <div className="bg-cyan-500/10 border border-cyan-500/30 rounded p-2.5">
            <p className="text-cyan-300 font-space-mono text-[11px]">
              {config.warmupHistoryEnabled !== false && config.adaptiveIndicators !== false ? (
                <>✅ <b>Гибрид:</b> сначала пробуем историю → если не выйдет, фоллбэк на адаптивные. Старт сделок ~6 мин или сразу.</>
              ) : config.warmupHistoryEnabled !== false ? (
                <>📥 Только история. Если РО не отдаст свечи — будем ждать накопления по живым тикам.</>
              ) : config.adaptiveIndicators !== false ? (
                <>🧠 Только адаптивные индикаторы. Сделки начнутся через ~6 мин (2 свечи по 3 мин).</>
              ) : (
                <>⚠️ Оба режима выключены — бот ждёт стандартного буфера 14 свечей (~42 мин).</>
              )}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Profit Extension */}
      <Card className="bg-zinc-900 border-zinc-700">
        <CardHeader className="pb-3 cursor-pointer" onClick={() => toggleDetail("profitExt")}>
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-space-mono text-zinc-300 flex items-center gap-2">
              <Icon name="TrendingUp" size={14} className="text-emerald-400" />
              Расширение прибыли
              {config.profitExtEnabled && <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded px-1.5 py-0.5">вкл</span>}
            </CardTitle>
            <Icon name={detailOpen["profitExt"] ? "ChevronUp" : "ChevronDown"} size={14} className="text-zinc-500" />
          </div>
        </CardHeader>
        {detailOpen["profitExt"] && (
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-zinc-300 font-space-mono text-xs">Включить расширение прибыли</Label>
                <p className="text-zinc-500 font-space-mono text-[10px] mt-0.5">Открывает доп. ставку если цена идёт в нашу сторону</p>
              </div>
              <Switch checked={config.profitExtEnabled} onCheckedChange={(v) => set({ profitExtEnabled: v })} />
            </div>

            {config.profitExtEnabled && (
              <div className="space-y-4">
                {/* 🎯 Размер пипса берётся из единой настройки в блоке "Хеджирование" */}
                <div className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-2.5">
                  <p className="text-zinc-400 font-space-mono text-[11px]">
                    🎯 <b>Размер пипса:</b> {config.pipSizeAuto !== false ? <span className="text-emerald-400">авто по активу</span> : <span className="text-emerald-400">{config.pipSize}</span>} · настраивается в блоке <b>«Хеджирование»</b> (единая настройка для всех модулей)
                  </p>
                </div>

                {/* Порог пипсов */}
                <div>
                  <Label className="text-zinc-400 font-space-mono text-xs mb-1.5 block">
                    Порог срабатывания: <span className="text-white font-bold">{config.profitExtPips} пипсов</span>
                  </Label>
                  <Slider min={5} max={100} step={1} value={[config.profitExtPips]} onValueChange={([v]) => set({ profitExtPips: v })} />
                  <p className="text-zinc-600 font-space-mono text-[10px] mt-1">
                    Цена ушла в нашу сторону на {config.profitExtPips} пип → открываем доп. ставку
                  </p>
                </div>

                {/* Режим */}
                <div>
                  <Label className="text-zinc-400 font-space-mono text-xs mb-2 block">Режим расширения</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {([["trend", "📈 Тренд", "Добиваем импульс"], ["rebound", "🔄 Откат", "Ставим на разворот"], ["both", "⚡ Оба", "Trend + Rebound"]] as const).map(([val, label, desc]) => (
                      <button key={val} type="button" onClick={() => set({ profitExtMode: val })}
                        className={`rounded-lg px-2 py-2 text-xs font-space-mono border transition-all text-left ${config.profitExtMode === val ? "bg-emerald-600/20 border-emerald-500/50 text-emerald-300" : "bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-zinc-500"}`}>
                        <div className="font-bold text-[11px]">{label}</div>
                        <div className="text-[9px] text-zinc-500 mt-0.5">{desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Коэффициент */}
                <div>
                  <Label className="text-zinc-400 font-space-mono text-xs mb-1.5 block">
                    Размер доп. ставки: <span className="text-white font-bold">×{config.profitExtMultiplier}</span>
                  </Label>
                  <Slider min={0.5} max={2.0} step={0.1} value={[config.profitExtMultiplier]} onValueChange={([v]) => set({ profitExtMultiplier: Math.round(v * 10) / 10 })} />
                  <p className="text-zinc-600 font-space-mono text-[10px] mt-1">
                    {config.profitExtMultiplier < 1 ? "Доп. ставка меньше основной — осторожный режим" : config.profitExtMultiplier === 1 ? "Доп. ставка равна основной" : `Доп. ставка увеличена в ${config.profitExtMultiplier}x`}
                  </p>
                </div>

                {/* Интервал проверки */}
                <div>
                  <Label className="text-zinc-400 font-space-mono text-xs mb-1.5 block">
                    Интервал проверки цены: <span className="text-white font-bold">{config.profitExtCheckInterval} сек</span>
                  </Label>
                  <Slider min={1} max={60} step={1} value={[config.profitExtCheckInterval]} onValueChange={([v]) => set({ profitExtCheckInterval: v })} />
                  <p className="text-zinc-600 font-space-mono text-[10px] mt-1">
                    {config.profitExtCheckInterval <= 3 ? "⚡ Очень часто — не пропустит момент, больше нагрузки" : config.profitExtCheckInterval <= 10 ? "⚖️ Оптимально — баланс точности и нагрузки" : "🐢 Редко — меньше нагрузки, возможна задержка входа"}
                  </p>
                </div>

                {/* Описание логики */}
                <div className="bg-zinc-800/50 rounded-lg p-3 space-y-1.5 font-space-mono text-[10px]">
                  <p className="text-zinc-300 font-bold mb-1">Логика расширения прибыли:</p>
                  {(config.profitExtMode === "trend" || config.profitExtMode === "both") && (
                    <p className="text-zinc-400">📈 <span className="text-emerald-300">Trend:</span> цена ушла на {config.profitExtPips} пип в нашу сторону → доп. ставка в том же направлении ×{config.profitExtMultiplier}</p>
                  )}
                  {(config.profitExtMode === "rebound" || config.profitExtMode === "both") && (
                    <p className="text-zinc-400">🔄 <span className="text-yellow-300">Rebound:</span> цена ушла на {config.profitExtPips} пип → ставим на откат в обратном направлении ×{config.profitExtMultiplier}</p>
                  )}
                  {config.profitExtMode === "both" && (
                    <p className="text-zinc-500 mt-1">⚡ В режиме "Оба" — открываются обе ставки одновременно</p>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        )}
      </Card>
    </>
  )
}

export default BotWarmupAndProfitExtensionCards
