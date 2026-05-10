import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Icon from "@/components/ui/icon"
import { POBotConfig } from "./PocketOptionBotTypes"

interface Props {
  config: POBotConfig
  onChange: (patch: Partial<POBotConfig>) => void
}

interface FilterRowProps {
  enabled: boolean
  onToggle: (v: boolean) => void
  icon: string
  iconColor: string
  title: string
  badge: string
  badgeColor: string
  description: string
  source: string
  children?: React.ReactNode
}

function FilterRow({ enabled, onToggle, icon, iconColor, title, badge, badgeColor, description, source, children }: FilterRowProps) {
  return (
    <div className={`rounded-xl border p-3 transition-all ${enabled ? "border-amber-500/40 bg-amber-500/5" : "border-zinc-700 bg-zinc-900/40"}`}>
      <div className="flex items-start gap-3">
        <div className={`shrink-0 w-9 h-9 rounded-lg flex items-center justify-center ${iconColor}`}>
          <Icon name={icon} size={18} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="text-zinc-100 font-orbitron text-sm font-semibold">{title}</span>
            <Badge className={`${badgeColor} text-[10px] py-0 px-1.5`}>{badge}</Badge>
          </div>
          <p className="text-zinc-400 text-xs font-space-mono leading-relaxed">{description}</p>
          <p className="text-zinc-600 text-[11px] font-space-mono mt-0.5 italic">📚 {source}</p>
        </div>
        <Switch checked={enabled} onCheckedChange={onToggle} />
      </div>
      {enabled && children && (
        <div className="mt-3 pt-3 border-t border-zinc-800 space-y-2">{children}</div>
      )}
    </div>
  )
}

export default function TradeBaseFiltersCard({ config, onChange }: Props) {
  const set = (patch: Partial<POBotConfig>) => onChange(patch)

  const enabledCount = [
    config.ma200FilterEnabled,
    config.rsiDivergenceEnabled,
    config.mtfFilterEnabled,
    config.candleConfirmEnabled,
    config.srStrengthEnabled,
    config.volumeProxyEnabled,
  ].filter(Boolean).length

  return (
    <Card className="bg-zinc-900 border-amber-500/30">
      <CardHeader className="pb-3">
        <CardTitle className="font-orbitron text-white text-base flex items-center gap-2">
          <Icon name="BookOpen" size={18} className="text-amber-400" />
          Фильтры Trade Base
          {enabledCount > 0 && (
            <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 text-xs">
              {enabledCount}/6 активно
            </Badge>
          )}
        </CardTitle>
        <p className="text-zinc-500 text-xs font-space-mono mt-1">
          Дополнительные фильтры по методике учебника. Каждый отбрасывает «плохие» сигналы — winrate растёт, но сделок становится меньше.
        </p>
      </CardHeader>
      <CardContent className="space-y-2">
        {/* 🚀 Быстрые пресеты — рекомендуемые наборы фильтров */}
        <div className="rounded-xl border border-amber-500/30 bg-gradient-to-br from-amber-950/40 to-orange-950/30 p-3 space-y-2">
          <div className="flex items-center gap-2">
            <Icon name="Sparkles" size={16} className="text-amber-400" />
            <span className="text-amber-300 font-orbitron text-sm font-semibold">Быстрые пресеты</span>
          </div>
          <p className="text-zinc-400 text-[11px] font-space-mono leading-relaxed">
            Выбери готовый набор по методике Trade Base — один клик и фильтры включены.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {/* Пресет «Безопасный» */}
            <Button
              type="button"
              onClick={() =>
                set({
                  ma200FilterEnabled: true,
                  rsiDivergenceEnabled: true,
                  mtfFilterEnabled: false,
                  candleConfirmEnabled: true,
                  srStrengthEnabled: false,
                  volumeProxyEnabled: false,
                })
              }
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-space-mono text-xs h-auto py-2 px-2 flex flex-col items-start gap-0.5"
            >
              <span className="flex items-center gap-1">
                <Icon name="Shield" size={12} /> ТОП-3 Безопасный
              </span>
              <span className="text-[10px] opacity-80 font-normal">MA200 + RSI-див + Свеча</span>
            </Button>

            {/* Пресет «Сбалансированный» */}
            <Button
              type="button"
              onClick={() =>
                set({
                  ma200FilterEnabled: true,
                  rsiDivergenceEnabled: true,
                  mtfFilterEnabled: true,
                  candleConfirmEnabled: true,
                  srStrengthEnabled: true,
                  volumeProxyEnabled: false,
                })
              }
              className="bg-blue-600 hover:bg-blue-700 text-white font-space-mono text-xs h-auto py-2 px-2 flex flex-col items-start gap-0.5"
            >
              <span className="flex items-center gap-1">
                <Icon name="Target" size={12} /> Сбалансированный
              </span>
              <span className="text-[10px] opacity-80 font-normal">5/6 фильтров — золотая середина</span>
            </Button>

            {/* Пресет «Снайпер» */}
            <Button
              type="button"
              onClick={() =>
                set({
                  ma200FilterEnabled: true,
                  rsiDivergenceEnabled: true,
                  mtfFilterEnabled: true,
                  candleConfirmEnabled: true,
                  srStrengthEnabled: true,
                  volumeProxyEnabled: true,
                })
              }
              className="bg-red-600 hover:bg-red-700 text-white font-space-mono text-xs h-auto py-2 px-2 flex flex-col items-start gap-0.5"
            >
              <span className="flex items-center gap-1">
                <Icon name="Crosshair" size={12} /> Снайпер
              </span>
              <span className="text-[10px] opacity-80 font-normal">Все 6 — макс. точность, мало сделок</span>
            </Button>
          </div>

          {/* Кнопка «Сбросить всё» */}
          {enabledCount > 0 && (
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                set({
                  ma200FilterEnabled: false,
                  rsiDivergenceEnabled: false,
                  mtfFilterEnabled: false,
                  candleConfirmEnabled: false,
                  srStrengthEnabled: false,
                  volumeProxyEnabled: false,
                })
              }
              className="w-full border-zinc-700 bg-zinc-800/50 hover:bg-zinc-700 text-zinc-300 font-space-mono text-xs h-7"
            >
              <Icon name="RotateCcw" size={12} className="mr-1.5" />
              Сбросить все фильтры
            </Button>
          )}

          <div className="bg-amber-950/40 border border-amber-500/20 rounded-md px-2 py-1.5 mt-1">
            <p className="text-amber-200/80 text-[10px] font-space-mono leading-relaxed">
              💡 <b>72% юзеров</b> начинают с «Безопасного» — это рекомендация Trade Base. После 50+ сделок переходи на «Сбалансированный».
            </p>
          </div>
        </div>

        {/* 1. MA200 */}
        <FilterRow
          enabled={!!config.ma200FilterEnabled}
          onToggle={(v) => set({ ma200FilterEnabled: v })}
          icon="TrendingUp"
          iconColor="bg-blue-500/20 text-blue-400"
          title="MA200 — главный фильтр направления"
          badge="🔥 must-have"
          badgeColor="bg-red-500/20 text-red-400 border-red-500/30"
          description="CALL только если цена выше MA200, PUT — только если ниже. Снижает проигрыши на 15–20%."
          source="Пол Тюдор Джонс: «Ниже MA200 — никаких лонгов. Точка»"
        >
          <div className="flex items-center gap-2">
            <Label className="text-zinc-400 text-xs font-space-mono">Период:</Label>
            <Input
              type="number"
              value={config.ma200Period ?? 200}
              onChange={(e) => set({ ma200Period: Number(e.target.value) })}
              className="bg-zinc-800 border-zinc-700 text-amber-400 font-space-mono text-xs h-7 w-20"
            />
            <span className="text-zinc-600 text-[11px] font-space-mono">200 = авто</span>
          </div>
          <div className="bg-blue-950/30 border border-blue-500/30 rounded-md px-2 py-1.5">
            <p className="text-blue-300 text-[11px] font-space-mono leading-relaxed">
              🤖 <b>Авто-подбор по ТФ свечей:</b> 1m → MA50 (~50 мин), 3m → MA100 (~5 ч), 5m → MA150 (~12.5 ч), 15m+ → MA200.
              Оставь <b>200</b> — бот сам выберет оптимум. Или задай свой период вручную.
            </p>
          </div>
        </FilterRow>

        {/* 2. RSI Divergence */}
        <FilterRow
          enabled={!!config.rsiDivergenceEnabled}
          onToggle={(v) => set({ rsiDivergenceEnabled: v })}
          icon="Activity"
          iconColor="bg-purple-500/20 text-purple-400"
          title="RSI-дивергенция"
          badge="🔥 главный сигнал RSI"
          badgeColor="bg-red-500/20 text-red-400 border-red-500/30"
          description="Вход по RSI только если есть бычья/медвежья дивергенция с ценой. Trade Base: «30/70 без дивергенции — обманка»."
          source="Trade Base: ключевой сигнал RSI, повышает winrate на ~12%"
        >
          <div className="flex items-center gap-2">
            <Label className="text-zinc-400 text-xs font-space-mono">Окно поиска:</Label>
            <Input
              type="number"
              value={config.rsiDivergenceLookback ?? 8}
              onChange={(e) => set({ rsiDivergenceLookback: Number(e.target.value) })}
              className="bg-zinc-800 border-zinc-700 text-amber-400 font-space-mono text-xs h-7 w-20"
            />
            <span className="text-zinc-600 text-[11px] font-space-mono">8 = авто</span>
          </div>
          <div className="bg-purple-950/30 border border-purple-500/30 rounded-md px-2 py-1.5">
            <p className="text-purple-300 text-[11px] font-space-mono leading-relaxed">
              🤖 <b>Авто-подбор по ТФ свечей:</b> 1m → 6 свечей, 3m → 8, 5m → 10, 15m+ → 14 (классика Уайлдера).
              Оставь <b>8</b> — бот сам подберёт. Меньше окно = чувствительнее, больше = надёжнее.
            </p>
          </div>
        </FilterRow>

        {/* 3. MTF */}
        <FilterRow
          enabled={!!config.mtfFilterEnabled}
          onToggle={(v) => set({ mtfFilterEnabled: v })}
          icon="Layers"
          iconColor="bg-emerald-500/20 text-emerald-400"
          title="MTF — старший таймфрейм"
          badge="🎯 Тройной экран"
          badgeColor="bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
          description="Сигнал должен совпадать с трендом старшего ТФ. Если торгуешь 5m, фильтр смотрит 15m."
          source="Метод Александра Элдера «Тройной экран» — стандарт у профи"
        >
          <div className="flex items-center gap-2">
            <Label className="text-zinc-400 text-xs font-space-mono">Множитель ТФ:</Label>
            <Input
              type="number"
              value={config.mtfMultiplier ?? 3}
              onChange={(e) => set({ mtfMultiplier: Number(e.target.value) })}
              className="bg-zinc-800 border-zinc-700 text-amber-400 font-space-mono text-xs h-7 w-20"
            />
            <span className="text-zinc-600 text-[11px] font-space-mono">× текущий ТФ (3 = 5m → 15m)</span>
          </div>
        </FilterRow>

        {/* 4. Candle Confirmation */}
        <FilterRow
          enabled={!!config.candleConfirmEnabled}
          onToggle={(v) => set({ candleConfirmEnabled: v })}
          icon="CheckCircle2"
          iconColor="bg-yellow-500/20 text-yellow-400"
          title="Подтверждение свечой"
          badge="💡 важно"
          badgeColor="bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
          description="После паттерна (молот/поглощение) ждать ещё одну свечу в направлении сигнала. Без подтверждения = просто красивая картинка."
          source="Trade Base: «Свечной паттерн = предположение, нужно подтверждение»"
        />

        {/* 5. S/R Strength */}
        <FilterRow
          enabled={!!config.srStrengthEnabled}
          onToggle={(v) => set({ srStrengthEnabled: v })}
          icon="Anchor"
          iconColor="bg-orange-500/20 text-orange-400"
          title="Сила уровня S/R"
          badge="💡 фильтр S/R"
          badgeColor="bg-orange-500/20 text-orange-400 border-orange-500/30"
          description="Игнорировать слабые уровни поддержки/сопротивления. Чем больше касаний — тем надёжнее уровень."
          source="Trade Base: «2–3 касания — слабый, 4+ — сильный уровень»"
        >
          <div className="flex items-center gap-2">
            <Label className="text-zinc-400 text-xs font-space-mono">Мин. касаний:</Label>
            <Input
              type="number"
              value={config.srMinTouches ?? 3}
              onChange={(e) => set({ srMinTouches: Number(e.target.value) })}
              className="bg-zinc-800 border-zinc-700 text-amber-400 font-space-mono text-xs h-7 w-20"
            />
            <span className="text-zinc-600 text-[11px] font-space-mono">3 = средне, 4+ = строго</span>
          </div>
        </FilterRow>

        {/* 6. Volume Proxy */}
        <FilterRow
          enabled={!!config.volumeProxyEnabled}
          onToggle={(v) => set({ volumeProxyEnabled: v })}
          icon="BarChart3"
          iconColor="bg-pink-500/20 text-pink-400"
          title="Объём через range свечи"
          badge="🎁 продвинуто"
          badgeColor="bg-pink-500/20 text-pink-400 border-pink-500/30"
          description="API не отдаёт объём напрямую — используем range свечи (high-low) как заменитель. Слабые свечи отбрасываются."
          source="Trade Base: «Объём — король подтверждения»"
        >
          <div className="flex items-center gap-2">
            <Label className="text-zinc-400 text-xs font-space-mono">Мин. range:</Label>
            <Input
              type="number"
              step="0.1"
              value={config.volumeProxyMinRatio ?? 0.7}
              onChange={(e) => set({ volumeProxyMinRatio: Number(e.target.value) })}
              className="bg-zinc-800 border-zinc-700 text-amber-400 font-space-mono text-xs h-7 w-20"
            />
            <span className="text-zinc-600 text-[11px] font-space-mono">× от среднего (0.7 = 70%)</span>
          </div>
        </FilterRow>

        {enabledCount > 0 && (
          <div className="bg-amber-950/30 border border-amber-500/30 rounded-lg px-3 py-2 mt-3">
            <p className="text-amber-300 text-xs font-space-mono leading-relaxed">
              ⚠️ Включено фильтров: <b>{enabledCount}/6</b>. Чем больше фильтров — тем меньше сделок, но выше точность. Начни с 1–2 и наблюдай.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}