import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import Icon from "@/components/ui/icon"
import { PO_EXPIRY_LABELS, type POBotConfig, type POExpiry, type POStrategy } from "./PocketOptionBotTypes"

interface AIComment {
  level: "info" | "warn" | "good"
  text: string
}

interface Props {
  config: POBotConfig
  set: (patch: Partial<POBotConfig>) => void
  /** Auto-pip-size helper (вычисляет pipSize по тикеру) */
  getAutoPipSize: (asset: string) => number
  /** Сканер тренда (Button с onSelect) */
  TrendScanner: React.ComponentType<{ onSelect: (asset: string) => void }>
  /** Селектор актива (Select-обёртка) */
  AssetSelector: React.ComponentType<{ value: string; onChange: (asset: string) => void }>
  /** Хелпер для AI-комментария по активу + экспирации (возвращает level/text или null) */
  assetExpiryComment: (
    asset: string,
    expiry: POExpiry,
    strategy: POStrategy,
    comboMode: boolean,
    comboStrategies: POStrategy[],
  ) => AIComment | null
  /** Рендер AIComment-блока (передаётся из родителя — он живёт в основном файле) */
  AIComment: React.ComponentType<{ level: "info" | "warn" | "good"; text: string }>
}

/**
 * 🎯 Реорганизованный блок: «Торговый актив» + «Тайминг и интервалы».
 *
 * Старая структура (до этапа реорганизации):
 *   "Актив и экспирация" — содержал актив, сканер, экспирацию, AI-коммент
 *
 * Новая структура:
 *   Карточка 1: «Торговый актив» — только TrendScanner + AssetSelector
 *   Карточка 2: «Тайминг и интервалы» — экспирация, частота проверки сигналов,
 *               источник свечей (раньше жил в HedgingCards). AI-комментарий внизу.
 */
export function AssetAndTimingCards({
  config,
  set,
  getAutoPipSize,
  TrendScanner,
  AssetSelector,
  assetExpiryComment,
  AIComment,
}: Props) {
  const comment = assetExpiryComment(
    config.asset,
    config.expiry,
    config.strategy,
    config.comboMode,
    config.comboStrategies,
  )

  return (
    <>
      {/* ═══ Карточка 1: Торговый актив ═══ */}
      <Card className="bg-zinc-900 border-red-500/20">
        <CardHeader className="pb-3">
          <CardTitle className="font-orbitron text-white text-base flex items-center gap-2">
            <Icon name="Target" size={18} className="text-red-400" />
            Торговый актив
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <TrendScanner onSelect={(v) => set({ asset: v, pipSize: getAutoPipSize(v) })} />
          <AssetSelector
            value={config.asset}
            onChange={(v) => set({ asset: v, pipSize: getAutoPipSize(v) })}
          />
        </CardContent>
      </Card>

      {/* ═══ Карточка 2: Тайминг и интервалы ═══ */}
      <Card className="bg-zinc-900 border-cyan-500/20">
        <CardHeader className="pb-3">
          <CardTitle className="font-orbitron text-white text-base flex items-center gap-2">
            <Icon name="Timer" size={18} className="text-cyan-400" />
            Тайминг и интервалы
          </CardTitle>
          <p className="text-zinc-500 font-space-mono text-[11px] mt-1">
            Как часто бот думает, на каких свечах смотрит и какой длины сделки открывает
          </p>
        </CardHeader>
        <CardContent className="space-y-5">
          {/* ── Экспирация опциона ── */}
          <div>
            <Label className="text-zinc-300 font-space-mono text-xs mb-1.5 flex items-center gap-1.5">
              <span className="text-cyan-400">⏱</span> Длительность сделки (экспирация)
            </Label>
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
            <p className="text-zinc-600 text-xs font-space-mono mt-1.5">{PO_EXPIRY_LABELS[config.expiry]}</p>
          </div>

          {/* ── Интервал проверки сигнала ── */}
          <div>
            <Label className="text-zinc-300 font-space-mono text-xs mb-1.5 flex items-center gap-1.5">
              <span className="text-cyan-400">🔁</span> Проверять сигнал каждые{" "}
              <span className="text-white font-bold">{config.checkInterval} сек</span>
            </Label>
            <Slider
              min={10}
              max={120}
              step={5}
              value={[config.checkInterval]}
              onValueChange={([v]) => set({ checkInterval: v })}
            />
            <p className="text-zinc-600 font-space-mono text-xs mt-1.5">
              {config.checkInterval <= 15
                ? "⚡ Быстро, но нагружает API"
                : config.checkInterval >= 60
                ? "🐢 Бот неспешный, пропускает краткосрочные движения"
                : "⚖️ Хороший баланс скорости и нагрузки"}
            </p>
          </div>

          {/* ── Источник свечей (перенесён из HedgingCards) ── */}
          <div>
            <Label className="text-zinc-300 font-space-mono text-xs mb-2 flex items-center gap-1.5">
              <span className="text-cyan-400">🕯</span> Источник свечей для анализа
            </Label>
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
                <p className="text-zinc-100 font-space-mono text-xs font-bold mb-1">🔧 LIVE-фид (буфер тиков)</p>
                <p className="text-zinc-500 font-space-mono text-[10px]">
                  Бот сам строит свечи из WebSocket-тиков РО — точные актуальные цены.
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
                  Свечи через get_candles(). Для OTC может отдавать устаревшие котировки.
                </p>
                <p className="text-amber-400 font-space-mono text-[10px] mt-1">⚠️ Глючит на OTC</p>
              </button>
            </div>
            <div className="bg-zinc-800/60 border border-zinc-700 rounded p-2 mt-2">
              <p className="text-zinc-400 font-space-mono text-[10px]">
                {(config.candleSource ?? "buffer") === "buffer"
                  ? <>🔧 <b className="text-emerald-300">Активно: LIVE-фид.</b> Первая сделка через ~6 мин (2 закрытых свечи нужно накопить).</>
                  : <>📡 <b className="text-amber-300">Активно: API РО.</b> Сразу готов к торговле, но на OTC возможны устаревшие свечи.</>}
              </p>
            </div>
          </div>

          {/* ── AI-комментарий по выбранной связке актив+экспирация ── */}
          {comment && <AIComment level={comment.level} text={comment.text} />}
        </CardContent>
      </Card>
    </>
  )
}

export default AssetAndTimingCards
