import { useRuntimeLevels } from "@/lib/useRuntimeLevels"
import { findDefaultByKey } from "@/lib/pair-defaults"
import { generateLevels } from "@/lib/runtime-levels"

interface Props {
  asset: string
  srManualLevels: string
  set: (patch: Partial<{ srManualLevels: string }>) => void
}

/**
 * Блок с пресетами уровней для выбранной пары.
 * Берёт уровни из рантайм-стора (обновляется кнопкой "Обновить уровни сейчас" на странице Тайминг).
 * Если в сторе пусто — генерирует уровни из дефолтных цен (актуальные на май 2026).
 */
export function SrPresetsBlock({ asset, srManualLevels, set }: Props) {
  // 1. Считаем fallback из дефолтов сразу, чтоб что-то показать ДО первого refresh
  const def = findDefaultByKey(asset)
  const fallbackLevels = def ? generateLevels(def.price, asset) : []

  const { levels, meta, isLive } = useRuntimeLevels(asset, fallbackLevels)

  if (!levels.length) return null

  const sourceLabel = isLive
    ? "🟢 LIVE-цены"
    : meta?.source === "default"
      ? "обновлено по дефолтам мая 2026"
      : "базовые уровни мая 2026"

  return (
    <div className="bg-zinc-800/50 rounded-lg p-3">
      <div className="flex items-center justify-between mb-2 gap-2 flex-wrap">
        <p className="text-zinc-400 font-space-mono text-[10px]">📌 Типичные уровни для {asset}:</p>
        <span className={`text-[9px] font-space-mono px-1.5 py-0.5 rounded ${isLive ? "bg-green-500/15 text-green-400" : "bg-zinc-700 text-zinc-500"}`}>
          {sourceLabel}
        </span>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {levels.map((l) => (
          <button
            key={l}
            type="button"
            onClick={() =>
              set({ srManualLevels: srManualLevels ? `${srManualLevels}, ${l}` : String(l) })
            }
            className="text-[10px] font-space-mono bg-zinc-700 hover:bg-purple-600/30 hover:border-purple-500/50 border border-zinc-600 text-zinc-300 rounded px-2 py-0.5 transition-all"
          >
            +{l}
          </button>
        ))}
      </div>
      <button
        type="button"
        onClick={() => set({ srManualLevels: levels.join(", ") })}
        className="mt-2 text-[10px] font-space-mono text-purple-400 hover:text-purple-300 transition-colors"
      >
        Добавить все →
      </button>
      {meta?.updatedAt && (
        <p className="mt-1.5 text-zinc-600 font-space-mono text-[9px]">
          Обновлено: {new Date(meta.updatedAt).toLocaleTimeString("ru-RU")}
          {meta.current ? ` · цена ${meta.current}` : ""}
        </p>
      )}
    </div>
  )
}

export default SrPresetsBlock
