import { useEffect, useState } from "react"
import { getLevels, subscribeLevels, type RuntimeLevels } from "./runtime-levels"

/**
 * Возвращает уровни для пары из рантайм-стора.
 * Перерендеривает компонент при обновлении стора.
 *
 * @param key — ключ пары ("EUR/USD", "BTC/USD" и т.д.)
 * @param fallback — массив уровней по умолчанию (если в сторе пусто)
 */
export function useRuntimeLevels(key: string, fallback?: number[]): {
  levels: number[]
  meta: RuntimeLevels | null
  isLive: boolean
} {
  const [tick, setTick] = useState(0)

  useEffect(() => {
    return subscribeLevels(() => setTick((n) => n + 1))
  }, [])

  // tick используется только чтобы пересчитать снизу — eslint-disable нам не нужен
  void tick

  const meta = getLevels(key)
  const levels = meta?.levels?.length ? meta.levels : fallback ?? []
  return { levels, meta, isLive: meta?.source === "live" }
}
