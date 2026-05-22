/**
 * Общий стор для динамических уровней S/R по всем парам.
 * Кнопка "Обновить уровни" дёргает live-котировки и пересчитывает
 * уровни вокруг текущей цены (-5%, -2%, -1%, current, +1%, +2%, +5%).
 *
 * Использует:
 *  - PairDeepDive (страница Тайминг)
 *  - TrendPairScanner (страница Тайминг)
 *  - PocketOptionBotForm (конструктор ботов — пресеты по паре)
 */

const STORAGE_KEY = "runtime-levels-v1"
const EVENT_NAME = "runtime-levels:updated"

export interface RuntimeLevels {
  /** Текущая цена (центр пресета). */
  current: number
  /** Отсортированный массив уровней (от низкого к высокому). */
  levels: number[]
  /** Метка времени последнего обновления (ms). */
  updatedAt: number
  /** Источник цены: live (api) / default (из бейслайн-данных). */
  source: "live" | "default"
}

/** Ключ — нормализованное имя пары вроде "EUR/USD" / "BTC/USD" / "Gold". */
export type LevelsStore = Record<string, RuntimeLevels>

let memoryStore: LevelsStore = loadFromStorage()

// Если стор пустой при первой загрузке — лениво заполним дефолтами,
// чтобы конструктор ботов и другие места показывали свежие уровни
// сразу, даже до нажатия кнопки "Обновить".
if (typeof window !== "undefined" && Object.keys(memoryStore).length === 0) {
  Promise.resolve().then(async () => {
    try {
      const { PAIR_DEFAULTS } = await import("./pair-defaults")
      const batch: LevelsStore = {}
      const now = Date.now()
      for (const def of PAIR_DEFAULTS) {
        const levels = generateLevels(def.price, def.keys[0])
        if (!levels.length) continue
        const meta: RuntimeLevels = { current: def.price, levels, updatedAt: now, source: "default" }
        for (const k of def.keys) batch[k] = meta
      }
      memoryStore = { ...batch, ...memoryStore }
      saveToStorage(memoryStore)
      emitUpdate()
    } catch {
      // ignore
    }
  })
}

function loadFromStorage(): LevelsStore {
  if (typeof window === "undefined") return {}
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return {}
    return JSON.parse(raw) as LevelsStore
  } catch {
    return {}
  }
}

function saveToStorage(store: LevelsStore) {
  if (typeof window === "undefined") return
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store))
  } catch {
    // ignore quota errors
  }
}

/** Округление под характер пары. */
function roundForPair(value: number, key: string): number {
  const k = key.toUpperCase()
  if (k.includes("BTC") || k.includes("ETH") || k.includes("NASDAQ") || k.includes("DOW") || k.includes("NIKKEI") || k.includes("DAX") || k.includes("FTSE") || k.includes("CAC") || k.includes("S&P") || k.includes("STOXX") || k.includes("AUS 200")) {
    if (value >= 50000) return Math.round(value / 500) * 500
    if (value >= 10000) return Math.round(value / 100) * 100
    if (value >= 1000) return Math.round(value / 50) * 50
    return Math.round(value)
  }
  if (k.includes("GOLD") || k.includes("XAU")) return Math.round(value / 10) * 10
  if (k.includes("SILVER") || k.includes("XAG")) return Math.round(value)
  if (k.includes("OIL") || k.includes("BRENT") || k.includes("WTI")) return Math.round(value)
  if (k.includes("JPY")) return Math.round(value * 10) / 10
  if (k.includes("LTC") || k.includes("DOT") || k.includes("LINK") || k.includes("DASH")) return Math.round(value)
  if (k.includes("PLATINUM") || k.includes("PALLADIUM")) return Math.round(value / 10) * 10
  // обычные форекс-пары (EURUSD, GBPUSD и т.п.)
  return Math.round(value * 10000) / 10000
}

/**
 * Сгенерировать набор уровней вокруг цены с заданными процентными отклонениями.
 * По умолчанию: -5%, -2%, -1%, цена, +1%, +2%, +5%.
 */
export function generateLevels(price: number, key: string, deltas: number[] = [-0.05, -0.02, -0.01, 0, 0.01, 0.02, 0.05]): number[] {
  if (!price || price <= 0) return []
  const raw = deltas.map((d) => roundForPair(price * (1 + d), key))
  // удаляем дубли после округления, сортируем
  return Array.from(new Set(raw)).sort((a, b) => a - b)
}

/** Получить уровни для пары (если есть). */
export function getLevels(key: string): RuntimeLevels | null {
  return memoryStore[key] ?? null
}

/** Снэпшот всего стора (read-only копия). */
export function getAllLevels(): LevelsStore {
  return { ...memoryStore }
}

/** Записать уровни для одной пары и оповестить подписчиков. */
export function setLevels(key: string, levels: RuntimeLevels) {
  memoryStore = { ...memoryStore, [key]: levels }
  saveToStorage(memoryStore)
  emitUpdate()
}

/** Записать пачку уровней одним апдейтом. */
export function setLevelsBatch(batch: LevelsStore) {
  memoryStore = { ...memoryStore, ...batch }
  saveToStorage(memoryStore)
  emitUpdate()
}

function emitUpdate() {
  if (typeof window === "undefined") return
  window.dispatchEvent(new CustomEvent(EVENT_NAME))
}

/** Подписаться на обновления стора. Возвращает функцию отписки. */
export function subscribeLevels(cb: () => void): () => void {
  if (typeof window === "undefined") return () => {}
  const handler = () => cb()
  window.addEventListener(EVENT_NAME, handler)
  return () => window.removeEventListener(EVENT_NAME, handler)
}