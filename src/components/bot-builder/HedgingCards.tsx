import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
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
 * Три связанные карточки хеджирования:
 *  - Хеджирование (ATR-логика + размер пипса)
 *  - Каскадный хедж (3 уровня: H1/H2/H3)
 *  - Источник свечей для анализа (LIVE-буфер vs API)
 *
 * Декомпозированы из PocketOptionBotForm.tsx (этап 3) — самая жирная секция ~374 строки.
 */
export function HedgingCards({ config, set, detailOpen, toggleDetail }: Props) {
  return (
    <>
      {/* Хеджирование */}
      <Card className="bg-zinc-900 border-zinc-700">
        <CardHeader className="pb-3 cursor-pointer" onClick={() => toggleDetail("hedge")}>
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-space-mono text-zinc-300 flex items-center gap-2">
              <Icon name="Shield" size={14} className="text-purple-400" />
              Хеджирование
              {config.hedgeEnabled && <span className="text-[10px] bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded px-1.5 py-0.5">вкл</span>}
            </CardTitle>
            <Icon name={detailOpen["hedge"] ? "ChevronUp" : "ChevronDown"} size={14} className="text-zinc-500" />
          </div>
        </CardHeader>
        {detailOpen["hedge"] && (
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-zinc-300 font-space-mono text-xs">Включить хеджирование</Label>
                <p className="text-zinc-500 font-space-mono text-[10px] mt-0.5">Открывает встречную ставку если цена идёт против</p>
              </div>
              <Switch checked={config.hedgeEnabled} onCheckedChange={(v) => set({ hedgeEnabled: v })} />
            </div>

            {config.hedgeEnabled && (
              <div className="space-y-4">
                {/* 🎯 ЕДИНЫЙ Размер пипса — используется ВЕЗДЕ (хедж, расширение прибыли, уровни) */}
                <div className="border border-purple-500/30 bg-purple-500/5 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <Label className="text-purple-300 font-space-mono text-xs font-bold">🎯 Размер пипса (единая настройка)</Label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={config.pipSizeAuto !== false}
                        onChange={(e) => set({ pipSizeAuto: e.target.checked })}
                        className="accent-purple-500"
                      />
                      <span className="text-zinc-400 font-space-mono text-[10px]">Авто по активу</span>
                    </label>
                  </div>
                  {config.pipSizeAuto !== false ? (
                    <div className="bg-zinc-900/60 rounded px-3 py-2 text-zinc-300 font-space-mono text-xs">
                      ✅ Бот сам определит pip по активу: JPY → 0.01 · BTC/ETH → 1.0 · XAU → 0.1 · остальные → 0.0001
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      {[0.0001, 0.001, 0.01, 0.1, 1].map((v) => (
                        <button key={v} type="button" onClick={() => set({ pipSize: v })}
                          className={`flex-1 py-1.5 rounded-lg border text-xs font-space-mono transition-all ${config.pipSize === v ? "bg-purple-600/20 border-purple-500/50 text-purple-300" : "bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-zinc-500"}`}>
                          {v}
                        </button>
                      ))}
                      <input
                        type="number"
                        step="0.00001"
                        min="0.00001"
                        max="1000"
                        value={config.pipSize}
                        onChange={(e) => { const v = parseFloat(e.target.value); if (!isNaN(v) && v > 0) set({ pipSize: v }); }}
                        className="w-24 bg-zinc-800 border border-zinc-700 rounded-lg px-2 py-1.5 text-xs font-space-mono text-white text-center focus:border-purple-500 focus:outline-none"
                      />
                    </div>
                  )}
                  <p className="text-zinc-500 font-space-mono text-[10px] mt-2">
                    Используется во всех модулях: хеджирование, расширение прибыли, расчёт уровней. Меняешь здесь — применяется везде.
                  </p>
                </div>

                {/* Старые поля скрыты — заменены на ATR-логику ниже. Значения сохраняются в конфиге для обратной совместимости. */}
                <div className="hidden" aria-hidden="true">
                  <Slider min={1} max={100} step={1} value={[config.hedgeSimplePipThreshold]} onValueChange={([v]) => set({ hedgeSimplePipThreshold: v })} />
                  <Slider min={2} max={200} step={1} value={[config.hedgePipThreshold]} onValueChange={([v]) => set({ hedgePipThreshold: v })} />
                  <Slider min={1.1} max={3.0} step={0.1} value={[config.hedgePowerMultiplier]} onValueChange={([v]) => set({ hedgePowerMultiplier: Math.round(v * 10) / 10 })} />
                </div>

                {/* === НОВАЯ ATR-ЛОГИКА ХЕДЖА === */}
                <div className="bg-emerald-950/20 border border-emerald-800/40 rounded-lg p-3">
                  <p className="text-emerald-300 font-space-mono text-[11px] font-bold mb-1">🆕 Умный хедж по ATR</p>
                  <p className="text-zinc-400 font-space-mono text-[10px]">
                    Бот считает средний размах последних 14 свечей (ATR) и срабатывает только когда цена ушла достаточно далеко
                    относительно текущей волатильности — не на фикс. пипсы, а адаптивно.
                  </p>
                </div>

                {/* Порог ATR */}
                <div>
                  <Label className="text-zinc-400 font-space-mono text-xs mb-1.5 block">
                    Порог расстояния (% от ATR): <span className="text-white font-bold">{config.hedgeAtrPercent}%</span>
                  </Label>
                  <Slider min={50} max={100} step={5} value={[config.hedgeAtrPercent]} onValueChange={([v]) => set({ hedgeAtrPercent: v })} />
                  <p className="text-zinc-600 font-space-mono text-[10px] mt-1">
                    {config.hedgeAtrPercent <= 60
                      ? "⚡ Чувствительно — хедж сработает рано"
                      : config.hedgeAtrPercent >= 90
                      ? "🐢 Поздно — только при очень сильном уходе"
                      : "⚖️ Баланс — стандартное поведение (рекомендуется 70%)"}
                  </p>
                </div>

                {/* Окно времени MIN */}
                <div>
                  <Label className="text-zinc-400 font-space-mono text-xs mb-1.5 block">
                    Раньше не открывать (% времени): <span className="text-white font-bold">{config.hedgeTimeMinPercent}%</span>
                  </Label>
                  <Slider min={10} max={50} step={5} value={[config.hedgeTimeMinPercent]} onValueChange={([v]) => set({ hedgeTimeMinPercent: v })} />
                  <p className="text-zinc-600 font-space-mono text-[10px] mt-1">
                    Хедж не сработает раньше {config.hedgeTimeMinPercent}% времени экспирации (защита от шума в начале)
                  </p>
                </div>

                {/* Окно времени MAX */}
                <div>
                  <Label className="text-zinc-400 font-space-mono text-xs mb-1.5 block">
                    Позже не открывать (% времени): <span className="text-white font-bold">{config.hedgeTimeMaxPercent}%</span>
                  </Label>
                  <Slider min={50} max={90} step={5} value={[config.hedgeTimeMaxPercent]} onValueChange={([v]) => set({ hedgeTimeMaxPercent: v })} />
                  <p className="text-zinc-600 font-space-mono text-[10px] mt-1">
                    После {config.hedgeTimeMaxPercent}% времени смысла нет — отмена хеджа
                  </p>
                </div>

                {/* Подтверждающие тики */}
                <div>
                  <Label className="text-zinc-400 font-space-mono text-xs mb-1.5 block">
                    Подтверждающих тиков: <span className="text-white font-bold">{config.hedgeConfirmTicks}</span>
                  </Label>
                  <Slider min={1} max={5} step={1} value={[config.hedgeConfirmTicks]} onValueChange={([v]) => set({ hedgeConfirmTicks: v })} />
                  <p className="text-zinc-600 font-space-mono text-[10px] mt-1">
                    Цена должна {config.hedgeConfirmTicks} раз подряд (×{config.hedgeCheckInterval} сек) идти против — защита от рывков
                  </p>
                </div>

                {/* Интервал проверки */}
                <div>
                  <Label className="text-zinc-400 font-space-mono text-xs mb-1.5 block">
                    Интервал проверки цены: <span className="text-white font-bold">{config.hedgeCheckInterval} сек</span>
                  </Label>
                  <Slider min={1} max={60} step={1} value={[config.hedgeCheckInterval]} onValueChange={([v]) => set({ hedgeCheckInterval: v })} />
                  <p className="text-zinc-600 font-space-mono text-[10px] mt-1">
                    {config.hedgeCheckInterval <= 3 ? "⚡ Очень часто — высокая точность, больше нагрузки" : config.hedgeCheckInterval <= 10 ? "⚖️ Оптимально — баланс точности и нагрузки" : "🐢 Редко — меньше нагрузки, возможна задержка реакции"}
                  </p>
                </div>

                {/* Описание новой логики */}
                <div className="bg-zinc-800/50 rounded-lg p-3 space-y-2 font-space-mono text-[10px]">
                  <p className="text-zinc-300 font-bold mb-1">Логика умного хеджа (ATR):</p>
                  <p className="text-zinc-400">⏱ Проверка каждые <span className="text-white">{config.hedgeCheckInterval} сек</span></p>
                  <p className="text-zinc-400">📏 <span className="text-emerald-300">ATR период:</span> 14 закрытых свечей (фикс.)</p>
                  <p className="text-zinc-400">🎯 <span className="text-emerald-300">Срабатывает</span> когда цена ушла ≥ {config.hedgeAtrPercent}% от ATR</p>
                  <p className="text-zinc-400">🪟 <span className="text-emerald-300">Окно времени:</span> {config.hedgeTimeMinPercent}% – {config.hedgeTimeMaxPercent}% от экспирации</p>
                  <p className="text-zinc-400">✅ <span className="text-emerald-300">Подтверждение:</span> {config.hedgeConfirmTicks} тика(ов) подряд против</p>
                  <p className="text-zinc-400">💰 <span className="text-emerald-300">Размер:</span> ставка × 1.5 (фикс.)</p>
                  <p className="text-zinc-400">🔁 <span className="text-emerald-300">Направление:</span> встречное (CALL → PUT, PUT → CALL)</p>
                </div>
              </div>
            )}
          </CardContent>
        )}
      </Card>

      {/* 🛡 Каскадный хедж — НОВАЯ модель */}
      <Card className={`bg-zinc-900 transition-all ${config.hedgeCascadeEnabled ? "border-2 border-emerald-500/60 shadow-[0_0_20px_rgba(16,185,129,0.25)]" : "border-2 border-amber-500/40"}`}>
        <CardHeader className="pb-3 cursor-pointer" onClick={() => toggleDetail("hedgeCascade")}>
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-space-mono text-zinc-300 flex items-center gap-2">
              🛡 Каскадный хедж (3 уровня)
              {config.hedgeCascadeEnabled ? (
                <span className="text-[10px] bg-emerald-500/30 text-emerald-300 px-2 py-0.5 rounded font-bold border border-emerald-500/40">✅ ВКЛ</span>
              ) : (
                <span className="text-[10px] bg-amber-500/30 text-amber-300 px-2 py-0.5 rounded font-bold border border-amber-500/40 animate-pulse">⚠️ ВЫКЛ — нажми чтобы включить</span>
              )}
            </CardTitle>
            <Icon name={detailOpen.hedgeCascade ? "ChevronUp" : "ChevronDown"} size={16} className="text-zinc-500" />
          </div>
          {!config.hedgeCascadeEnabled && (
            <p className="text-amber-400/80 font-space-mono text-[10px] mt-2">
              💡 Без каскадного хеджа страховка хедж-1/хедж-2/хедж-3 <b>НЕ запустится</b>. Все логи [CASCADE] будут пустыми.
            </p>
          )}
        </CardHeader>
        {detailOpen.hedgeCascade && (
          <CardContent className="space-y-3 pt-0">
            <div className="flex items-center justify-between">
              <Label className="text-zinc-300 font-space-mono text-xs">Включить каскадный хедж</Label>
              <Switch checked={!!config.hedgeCascadeEnabled} onCheckedChange={(v) => set({ hedgeCascadeEnabled: v })} />
            </div>

            {config.hedgeCascadeEnabled && (
              <div className="space-y-3 pt-2 border-t border-zinc-800">
                <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-2">
                  <p className="text-amber-300 font-space-mono text-[10px]">
                    ⚠️ <b>Каскадный хедж</b> — это НОВАЯ модель. Если включишь — обычный «умный хедж (ATR)» сверху продолжит работать тоже. Лучше выключить старый хедж, чтобы не дублировать защиту.
                  </p>
                </div>

                {/* Множитель Хедж-1 */}
                <div>
                  <Label className="text-zinc-400 font-space-mono text-xs mb-1.5 block">
                    Хедж-1 (открывается СРАЗУ): <span className="text-white font-bold">×{config.hedgeCascadeM1?.toFixed(1) ?? "1.5"}</span> от ставки
                  </Label>
                  <Slider min={0} max={3} step={0.1} value={[config.hedgeCascadeM1 ?? 1.5]} onValueChange={([v]) => set({ hedgeCascadeM1: v })} />
                  <p className="text-zinc-600 font-space-mono text-[10px] mt-1">
                    {(config.hedgeCascadeM1 ?? 1.5) === 0 ? "🚫 ОТКЛЮЧЁН — Хедж-1 не открывается" : <>Открывается мгновенно с основной, <b>противоположное направление</b>, та же экспирация</>}
                  </p>
                </div>

                {/* Множитель Хедж-2 */}
                <div>
                  <Label className="text-zinc-400 font-space-mono text-xs mb-1.5 block">
                    Хедж-2 (после 1/2 экспирации): <span className="text-white font-bold">×{config.hedgeCascadeM2?.toFixed(1) ?? "1.5"}</span> от ставки
                  </Label>
                  <Slider min={0.5} max={3} step={0.1} value={[config.hedgeCascadeM2 ?? 1.5]} onValueChange={([v]) => set({ hedgeCascadeM2: v })} />
                  <p className="text-zinc-600 font-space-mono text-[10px] mt-1">
                    Срабатывает после 1/2 экспирации, в момент <b>коррекции</b> цены (откат от пика). Направление <b>против основной</b>
                  </p>
                </div>

                {/* Множитель Хедж-3 */}
                <div>
                  <Label className="text-zinc-400 font-space-mono text-xs mb-1.5 block">
                    Хедж-3 (пересечение страйка): <span className="text-white font-bold">×{config.hedgeCascadeM3?.toFixed(1) ?? "2.0"}</span> от ставки
                  </Label>
                  <Slider min={0.5} max={4} step={0.1} value={[config.hedgeCascadeM3 ?? 2.0]} onValueChange={([v]) => set({ hedgeCascadeM3: v })} />
                  <p className="text-zinc-600 font-space-mono text-[10px] mt-1">
                    Срабатывает 1 раз — когда цена впервые пересекает страйк основной. Направление <b>совпадает с основной</b>
                  </p>
                </div>

                {/* Откат в пипсах */}
                <div>
                  <Label className="text-zinc-400 font-space-mono text-xs mb-1.5 block">
                    Откат от пика (для Хеджа-2): <span className="text-white font-bold">{config.hedgeCascadePullbackPips ?? 3} пип</span>
                  </Label>
                  <Slider min={1} max={20} step={1} value={[config.hedgeCascadePullbackPips ?? 3]} onValueChange={([v]) => set({ hedgeCascadePullbackPips: v })} />
                  <p className="text-zinc-600 font-space-mono text-[10px] mt-1">
                    {(config.hedgeCascadePullbackPips ?? 3) <= 2 ? "⚡ Очень чувствительно — хедж-2 откроется при малейшем дёргании" : (config.hedgeCascadePullbackPips ?? 3) >= 10 ? "🐢 Сурово — нужен явный разворот" : "⚖️ Норма (рекомендуется 3-5 пип)"}
                  </p>
                </div>

                {/* 🎯 НОВОЕ: Триггер Хедж-3 в пипсах */}
                <div className="border-t border-amber-500/30 pt-3 bg-amber-500/5 -mx-4 px-4 py-3 rounded">
                  <Label className="text-amber-300 font-space-mono text-xs mb-1.5 block">
                    🎯 Триггер Хедж-3: <span className="text-white font-bold">{config.hedgeCascadeH3TriggerPips ?? 2} пип</span> от цены H2
                  </Label>
                  <Slider min={1} max={15} step={1} value={[config.hedgeCascadeH3TriggerPips ?? 2]} onValueChange={([v]) => set({ hedgeCascadeH3TriggerPips: v })} />
                  <p className="text-zinc-500 font-space-mono text-[10px] mt-1">
                    Хедж-3 открывается ПОСЛЕ Хедж-2: ждём, что цена пойдёт <b>в сторону основной ставки</b> на N пипсов от цены открытия H2. Совпадает с направлением основной.
                  </p>
                  <p className="text-amber-400/70 font-space-mono text-[10px] mt-1">
                    ⚠️ Поле сохраняется, логика в коде бота будет включена в следующем обновлении (см. ТЗ).
                  </p>
                </div>

                {/* 🎯 МИНИМУМ ВРЕМЕНИ ДО H2 */}
                <div className="border-t border-zinc-800 pt-3">
                  <Label className="text-zinc-400 font-space-mono text-xs mb-1.5 block">
                    Минимум времени до H2: <span className="text-white font-bold">{config.hedgeCascadeMinTimePercent ?? 50}%</span> от экспирации
                  </Label>
                  <Slider min={0} max={90} step={5} value={[config.hedgeCascadeMinTimePercent ?? 50]} onValueChange={([v]) => set({ hedgeCascadeMinTimePercent: v })} />
                  <p className="text-zinc-600 font-space-mono text-[10px] mt-1">
                    {(config.hedgeCascadeMinTimePercent ?? 50) === 0 ? "⚡ Без задержки — H2 может открыться сразу" : (config.hedgeCascadeMinTimePercent ?? 50) >= 75 ? "🐢 Только в самом конце сделки" : "⚖️ Стандарт (50% = после половины экспирации)"}
                  </p>
                </div>

                {/* 🎯 МИНИМУМ ПИК ОТ СТРАЙКА */}
                <div>
                  <Label className="text-zinc-400 font-space-mono text-xs mb-1.5 block">
                    Минимум удаления от страйка: <span className="text-white font-bold">{config.hedgeCascadeMinPeakPips ?? 0} пип</span>
                  </Label>
                  <Slider min={0} max={50} step={1} value={[config.hedgeCascadeMinPeakPips ?? 0]} onValueChange={([v]) => set({ hedgeCascadeMinPeakPips: v })} />
                  <p className="text-zinc-600 font-space-mono text-[10px] mt-1">
                    {(config.hedgeCascadeMinPeakPips ?? 0) === 0 ? "🟢 Без ограничения — любое отклонение" : `Цена должна уйти от страйка минимум на ${config.hedgeCascadeMinPeakPips} пип, иначе H2 не откроется`}
                  </p>
                </div>

                {/* 🎯 ТОЛЬКО ЕСЛИ В ПЛЮСЕ */}
                <div className="flex items-center justify-between bg-zinc-800/40 rounded-lg p-3">
                  <div>
                    <Label className="text-zinc-300 font-space-mono text-xs">
                      H2 только если основная В ПЛЮСЕ
                    </Label>
                    <p className="text-zinc-600 font-space-mono text-[10px] mt-0.5">
                      {config.hedgeCascadeRequireProfit ? "✅ ВКЛ — H2 откроется только если цена ушла В нашу сторону" : "❌ ВЫКЛ — H2 открывается при любом отклонении"}
                    </p>
                  </div>
                  <Switch checked={config.hedgeCascadeRequireProfit ?? false} onCheckedChange={(v) => set({ hedgeCascadeRequireProfit: v })} />
                </div>

                {/* 🛟 СПАСАТЕЛЬНЫЙ ТРИГГЕР H2 «уход в минус» */}
                <div className="bg-zinc-800/40 rounded-lg p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-zinc-300 font-space-mono text-xs">
                      🛟 Спасательный триггер H2 (уход в минус)
                    </Label>
                    <Input
                      type="number"
                      step="0.5"
                      min="0"
                      value={config.hedgeCascadeLossTriggerPips ?? 1}
                      onChange={(e) => set({ hedgeCascadeLossTriggerPips: parseFloat(e.target.value) || 0 })}
                      className="w-20 h-8 text-xs bg-zinc-900 border-zinc-700 font-space-mono text-center"
                    />
                  </div>
                  <p className="text-zinc-600 font-space-mono text-[10px]">
                    {(config.hedgeCascadeLossTriggerPips ?? 1) > 0
                      ? `✅ Открывать H2 СРАЗУ если основная в минусе ≥ ${config.hedgeCascadeLossTriggerPips ?? 1} пип (не дожидаясь пика+отката)`
                      : "❌ ВЫКЛ — H2 только по классической логике «пик + откат»"}
                  </p>
                </div>

                {/* Сводка */}
                <div className="bg-zinc-800/50 rounded-lg p-3 space-y-1 font-space-mono text-[10px]">
                  <p className="text-zinc-300 font-bold mb-1">Сводка по каскаду (X = размер основной):</p>
                  <p className="text-zinc-400">🛡 <span className="text-purple-300">Хедж-1:</span> ×{config.hedgeCascadeM1?.toFixed(1) ?? "1.5"}X — сразу, ПРОТИВ основной</p>
                  <p className="text-zinc-400">🔄 <span className="text-purple-300">Хедж-2:</span> ×{config.hedgeCascadeM2?.toFixed(1) ?? "1.5"}X — после {config.hedgeCascadeMinTimePercent ?? 50}%, ПРОТИВ, откат {config.hedgeCascadePullbackPips ?? 3} пип{(config.hedgeCascadeMinPeakPips ?? 0) > 0 ? `, пик ≥ ${config.hedgeCascadeMinPeakPips} пип` : ""}{config.hedgeCascadeRequireProfit ? ", только в плюсе" : ""}{(config.hedgeCascadeLossTriggerPips ?? 1) > 0 ? ` ИЛИ минус ≥ ${config.hedgeCascadeLossTriggerPips ?? 1} пип 🛟` : ""}</p>
                  <p className="text-zinc-400">🎯 <span className="text-purple-300">Хедж-3:</span> ×{config.hedgeCascadeM3?.toFixed(1) ?? "2.0"}X — ПОСЛЕ H2, при откате {config.hedgeCascadeH3TriggerPips ?? 2} пип в сторону основной (направление = основная)</p>
                  <p className="text-zinc-400 mt-1">⏱ Все хеджи имеют ту же экспирацию — заканчиваются с основной</p>
                  <p className="text-zinc-400">💰 <span className="text-purple-300">Макс. сумма на сигнал:</span> X × (1 + {config.hedgeCascadeM1?.toFixed(1) ?? "1.5"} + {config.hedgeCascadeM2?.toFixed(1) ?? "1.5"} + {config.hedgeCascadeM3?.toFixed(1) ?? "2.0"}) = <span className="text-white">{(1 + (config.hedgeCascadeM1 ?? 1.5) + (config.hedgeCascadeM2 ?? 1.5) + (config.hedgeCascadeM3 ?? 2.0)).toFixed(1)}X</span></p>
                </div>
              </div>
            )}
          </CardContent>
        )}
      </Card>

      {/* 🎯 Источник свечей для анализа */}
      <Card className="bg-zinc-900 border-2 border-emerald-500/40">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-space-mono text-zinc-300 flex items-center gap-2">
            🎯 Источник свечей — что бот видит для анализа
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => set({ candleSource: "buffer" })}
              className={`p-3 rounded-lg border-2 text-left transition-all ${
                (config.candleSource ?? "buffer") === "buffer"
                  ? "border-emerald-500 bg-emerald-500/10"
                  : "border-zinc-700 bg-zinc-800/40 hover:border-zinc-600"
              }`}
            >
              <p className="text-zinc-100 font-space-mono text-xs font-bold mb-1">🔧 Свой буфер тиков (LIVE-фид)</p>
              <p className="text-zinc-500 font-space-mono text-[10px]">
                Бот сам строит свечи из WebSocket-тиков РО — точные актуальные цены как на графике.
              </p>
              <p className="text-emerald-400 font-space-mono text-[10px] mt-1">✅ Рекомендуется для OTC</p>
            </button>
            <button
              type="button"
              onClick={() => set({ candleSource: "api" })}
              className={`p-3 rounded-lg border-2 text-left transition-all ${
                config.candleSource === "api"
                  ? "border-amber-500 bg-amber-500/10"
                  : "border-zinc-700 bg-zinc-800/40 hover:border-zinc-600"
              }`}
            >
              <p className="text-zinc-100 font-space-mono text-xs font-bold mb-1">📡 API Pocket Option</p>
              <p className="text-zinc-500 font-space-mono text-[10px]">
                Свечи берутся через get_candles(). Для OTC может отдавать устаревшие котировки.
              </p>
              <p className="text-amber-400 font-space-mono text-[10px] mt-1">⚠️ Глючит на OTC активах</p>
            </button>
          </div>
          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded p-2.5">
            <p className="text-emerald-300 font-space-mono text-[11px]">
              {(config.candleSource ?? "buffer") === "buffer" ? (
                <>🔧 <b>Активно: буфер тиков (LIVE).</b> Бот строит свечи прямо из WebSocket-фида — самые свежие данные. Первая сделка через ~6 мин (2 закрытых свечи на ТФ 3 мин).</>
              ) : (
                <>📡 <b>Активно: API РО.</b> ⚠️ На OTC активах может вернуть устаревшие свечи! Используй только для обычных (не OTC) активов.</>
              )}
            </p>
          </div>
        </CardContent>
      </Card>
    </>
  )
}

export default HedgingCards
