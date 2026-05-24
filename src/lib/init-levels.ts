/**
 * Авто-инициализация рантайм-уровней при старте SPA.
 * Импортируется один раз в src/App.tsx — выполняется сразу.
 *
 * Делает офлайн-пересчёт уровней по PAIR_DEFAULTS (актуальные на май 2026),
 * чтобы конструктор ботов, графики и блоки уровней показывали свежие значения
 * на ЛЮБОЙ странице, не только Тайминг.
 *
 * Если live-API сейчас 402 / недоступен — всё равно уровни в сторе свежие.
 */

import { generateLevels, setLevelsBatch, getAllLevels, type LevelsStore, type RuntimeLevels } from "./runtime-levels"
import { PAIR_DEFAULTS } from "./pair-defaults"

const INIT_KEY = "runtime-levels-init-ts"
// Пересчитываем не чаще раз в час (чтобы старые snapshots в localStorage не затирали свежий live)
const INIT_MIN_INTERVAL_MS = 60 * 60 * 1000

if (typeof window !== "undefined") {
  try {
    const last = Number(window.localStorage.getItem(INIT_KEY) || 0)
    const existing = getAllLevels()
    const isEmpty = Object.keys(existing).length === 0
    const isStale = Date.now() - last > INIT_MIN_INTERVAL_MS

    if (isEmpty || isStale) {
      const batch: LevelsStore = {}
      const now = Date.now()
      for (const def of PAIR_DEFAULTS) {
        const levels = generateLevels(def.price, def.keys[0])
        if (!levels.length) continue
        const meta: RuntimeLevels = {
          current: def.price,
          levels,
          updatedAt: now,
          source: "default",
        }
        for (const k of def.keys) batch[k] = meta
      }
      setLevelsBatch(batch)
      window.localStorage.setItem(INIT_KEY, String(now))
       
      console.log(`[init-levels] 🛸 офлайн-пересчёт: ${Object.keys(batch).length} пар`)
    }
  } catch (e) {
     
    console.warn("[init-levels] ошибка:", e)
  }
}
