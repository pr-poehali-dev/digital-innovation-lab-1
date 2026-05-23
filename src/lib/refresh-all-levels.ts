import { loadQuotes } from "@/components/pair-deep-dive/data"
import { loadScannerQuotes, pairs as scannerPairs } from "@/components/trend-pair-scanner/data"
import { generateLevels, setLevelsBatch, type LevelsStore, type RuntimeLevels } from "./runtime-levels"
import { PAIR_DEFAULTS } from "./pair-defaults"

export interface RefreshResult {
  /** сколько пар обновлено */
  updated: number
  /** сколько пар получили РЕАЛЬНУЮ live-цену */
  liveCount: number
  /** сколько пар откатились на дефолт */
  defaultCount: number
  /** удалось ли вообще достучаться до апи */
  apiReachable: boolean
}

/**
 * Тянет live-котировки и пересчитывает уровни для ВСЕХ пар:
 *  - PairDeepDive (3 пары)
 *  - TrendPairScanner (12 пар)
 *  - Конструктор ботов (~30+ пар через PAIR_DEFAULTS)
 *
 * Если апи отвечает 402 / падает — для тех пар используется дефолтная цена
 * из pair-defaults.ts (актуальные на май 2026 уровни).
 */
export async function refreshAllLevels(): Promise<RefreshResult> {
  console.log("[refresh-all-levels] 🛸 start")
  // 1. Собираем все API-символы из доступных источников
  const apiSymbols = new Set<string>()
  for (const p of scannerPairs) {
    if (p.apiSymbol) apiSymbols.add(p.apiSymbol)
  }
  for (const d of PAIR_DEFAULTS) {
    if (d.apiSymbol) apiSymbols.add(d.apiSymbol)
  }

  // 2. Параллельно дёргаем оба эндпоинта (allSettled — один сбой не валит другой)
  const [deepRes, scanRes] = await Promise.allSettled([
    loadQuotes(true),
    loadScannerQuotes(Array.from(apiSymbols), true),
  ])

  const liveQuotes: Record<string, { price?: number; error?: string }> = {}
  if (deepRes.status === "fulfilled") Object.assign(liveQuotes, deepRes.value)
  if (scanRes.status === "fulfilled") Object.assign(liveQuotes, scanRes.value)

  const apiReachable = deepRes.status === "fulfilled" || scanRes.status === "fulfilled"

  // 3. Для каждой записи в PAIR_DEFAULTS определяем цену (live или fallback)
  const batch: LevelsStore = {}
  let liveCount = 0
  let defaultCount = 0
  const now = Date.now()

  for (const def of PAIR_DEFAULTS) {
    let price = def.price
    let source: RuntimeLevels["source"] = "default"

    if (def.apiSymbol) {
      const q = liveQuotes[def.apiSymbol]
      if (q && !q.error && typeof q.price === "number" && q.price > 0) {
        price = q.price
        source = "live"
      }
    }

    // Берём первый ключ как «канонический» для генерации уровней (округление)
    const canonicalKey = def.keys[0]
    const levels = generateLevels(price, canonicalKey)

    if (!levels.length) continue

    const meta: RuntimeLevels = {
      current: price,
      levels,
      updatedAt: now,
      source,
    }

    // одни и те же уровни — для всех вариантов имени пары
    for (const k of def.keys) {
      batch[k] = meta
    }

    if (source === "live") liveCount++
    else defaultCount++
  }

  setLevelsBatch(batch)

  const result = {
    updated: Object.keys(batch).length,
    liveCount,
    defaultCount,
    apiReachable,
  }
  console.log("[refresh-all-levels] ✅ done", result)
  return result
}