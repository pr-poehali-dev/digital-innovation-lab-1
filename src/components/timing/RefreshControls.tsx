import { useEffect, useRef, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Icon from "@/components/ui/icon"
import { toast } from "sonner"
import { refreshAllLevels } from "@/lib/refresh-all-levels"
import { AUTO_REFRESH_MS, type DebugStep } from "./timingData"

export function RefreshControls() {
  const [refreshing, setRefreshing] = useState(false)
  const [lastRefresh, setLastRefresh] = useState<number | null>(null)
  const [autoRefresh, setAutoRefresh] = useState<boolean>(true)
  const [nextRefreshIn, setNextRefreshIn] = useState<number>(AUTO_REFRESH_MS / 1000)
  const [debugOpen, setDebugOpen] = useState<boolean>(false)
  const [debugSteps, setDebugSteps] = useState<DebugStep[]>([])
  const [clickCounter, setClickCounter] = useState(0)
  const refreshingRef = useRef(false)

  const pushStep = (level: DebugStep["level"], msg: string) => {
    setDebugSteps((prev) => [...prev.slice(-20), { ts: Date.now(), level, msg }])
     
    console.log(`[Timing] ${level.toUpperCase()}: ${msg}`)
  }

  const doRefresh = async (silent: boolean) => {
    pushStep("info", `doRefresh start (silent=${silent}, busy=${refreshingRef.current})`)
    if (refreshingRef.current) {
      pushStep("warn", "Сброс busy-флага (был залипший)")
      refreshingRef.current = false
    }
    refreshingRef.current = true
    setRefreshing(true)
    setDebugOpen(true)
    const toastId = silent ? undefined : toast.loading("🛸 Обновляю уровни по всем парам...")
    try {
      pushStep("info", "Вызываю refreshAllLevels()")
      const result = await refreshAllLevels()
      pushStep(
        result.updated > 0 ? "ok" : "warn",
        `Результат: live=${result.liveCount}, defaults=${result.defaultCount}, всего=${result.updated}, api=${result.apiReachable ? "доступен" : "402/недоступен"}`
      )

      setLastRefresh(Date.now())
      setNextRefreshIn(AUTO_REFRESH_MS / 1000)

      if (!silent) {
        const opts = toastId ? { id: toastId } : undefined
        if (result.updated === 0) {
          toast.error("Ничего не обновлено. Открой панель отладки внизу.", opts)
        } else if (result.liveCount === 0) {
          toast.success(
            `Обновлено ${result.updated} пар по дефолтам мая 2026. Live-API недоступен (402).`,
            opts
          )
        } else {
          toast.success(
            `Готово! Live: ${result.liveCount}, дефолты: ${result.defaultCount}. Всего: ${result.updated}.`,
            opts
          )
        }
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e)
      pushStep("err", `Исключение: ${msg}`)
      if (!silent) {
        toast.error(`Ошибка: ${msg}`, toastId ? { id: toastId } : undefined)
      }
    } finally {
      refreshingRef.current = false
      setRefreshing(false)
      pushStep("info", "doRefresh finished")
    }
  }

  const handleRefreshLevels = () => {
    setClickCounter((c) => c + 1)
    pushStep("info", `🖱️ КНОПКА НАЖАТА (клик #${clickCounter + 1})`)
    void doRefresh(false)
  }

  // Офлайн-режим: пересчёт уровней БЕЗ обращения к API (мгновенно)
  const handleOfflineRefresh = async () => {
    pushStep("info", "🛸 Офлайн-пересчёт уровней из дефолтов мая 2026")
    setRefreshing(true)
    setDebugOpen(true)
    try {
      const { PAIR_DEFAULTS } = await import("@/lib/pair-defaults")
      const { generateLevels, setLevelsBatch } = await import("@/lib/runtime-levels")
      const batch: Record<string, { current: number; levels: number[]; updatedAt: number; source: "default" }> = {}
      const now = Date.now()
      for (const def of PAIR_DEFAULTS) {
        const levels = generateLevels(def.price, def.keys[0])
        if (!levels.length) continue
        const meta = { current: def.price, levels, updatedAt: now, source: "default" as const }
        for (const k of def.keys) batch[k] = meta
      }
      setLevelsBatch(batch)
      setLastRefresh(Date.now())
      pushStep("ok", `Офлайн: пересчитано ${Object.keys(batch).length} пар (мгновенно)`)
      toast.success(`Уровни обновлены офлайн: ${Object.keys(batch).length} пар`)
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e)
      pushStep("err", `Офлайн-ошибка: ${msg}`)
      toast.error(`Ошибка офлайн-режима: ${msg}`)
    } finally {
      setRefreshing(false)
    }
  }

  // Авто-обновление каждые 5 минут + обратный отсчёт
  useEffect(() => {
    if (!autoRefresh) return
    const tickId = window.setInterval(() => {
      setNextRefreshIn((s) => {
        if (s <= 1) {
          void doRefresh(true)
          return AUTO_REFRESH_MS / 1000
        }
        return s - 1
      })
    }, 1000)
    return () => window.clearInterval(tickId)
     
  }, [autoRefresh])

  // Первое обновление при загрузке:
  // 1) офлайн-пересчёт через 100мс (мгновенно, без API) — не блокируем первый рендер
  // 2) через 800мс пробуем live-API в фоне (если ответит — обновим поверх)
  // init-levels.ts уже сделал базовую инициализацию при старте SPA, так что страница
  // отрисуется СРАЗУ, а наши refresh'ы только дополняют свежими данными.
  useEffect(() => {
    const t1 = window.setTimeout(() => { void handleOfflineRefresh() }, 100)
    const t2 = window.setTimeout(() => void doRefresh(true), 800)
    return () => {
      window.clearTimeout(t1)
      window.clearTimeout(t2)
    }
     
  }, [])

  return (
    <div className="text-center mb-12">
      <Badge className="mb-4 bg-red-500/20 text-red-400 border-red-500/30">
        <Icon name="Clock" size={14} className="mr-1" />
        Тайминг и пары
      </Badge>
      <h1 className="font-orbitron text-4xl md:text-6xl font-bold text-white mb-4">
        Когда торговать <span className="text-red-500">какую пару</span>
      </h1>
      <p className="text-gray-400 text-lg max-w-3xl mx-auto mb-6">
        Сессии, корреляции, расписание по часам и стратегии под каждое время дня.
        Главный упор — на <span className="text-red-400 font-semibold">EUR/USD OTC</span> и{" "}
        <span className="text-yellow-400 font-semibold">BTC/USD</span>.
      </p>
      <div className="flex items-center justify-center gap-3 flex-wrap">
        <Button
          onClick={handleRefreshLevels}
          className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-semibold"
          size="lg"
        >
          <Icon
            name="RefreshCw"
            size={18}
            className={`mr-2 ${refreshing ? "animate-spin" : ""}`}
          />
          {refreshing ? "Обновляю..." : "Обновить уровни (онлайн)"}
        </Button>
        <Button
          onClick={handleOfflineRefresh}
          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold"
          size="lg"
        >
          <Icon name="Zap" size={18} className="mr-2" />
          Офлайн-пересчёт (мгновенно)
        </Button>
        <Button
          onClick={() => setAutoRefresh((v) => !v)}
          variant="outline"
          size="lg"
          className={`border-2 ${autoRefresh ? "border-green-500/50 text-green-400 hover:bg-green-500/10" : "border-zinc-700 text-gray-400 hover:bg-zinc-800"}`}
        >
          <Icon name={autoRefresh ? "Zap" : "ZapOff"} size={16} className="mr-2" />
          Авто: {autoRefresh ? "ВКЛ" : "ВЫКЛ"}
        </Button>
        <Button
          onClick={() => setDebugOpen((v) => !v)}
          variant="outline"
          size="lg"
          className="border-2 border-yellow-500/50 text-yellow-400 hover:bg-yellow-500/10"
        >
          <Icon name="Bug" size={16} className="mr-2" />
          Лог ({debugSteps.length})
        </Button>
      </div>

      {/* Визуальная панель отладки — заменяет F12 для Opera */}
      {debugOpen && (
        <div className="mt-4 max-w-3xl mx-auto bg-zinc-950 border-2 border-yellow-500/30 rounded-lg p-4 text-left">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-mono text-yellow-400 text-sm flex items-center gap-2">
              <Icon name="Terminal" size={16} />
              Отладка кнопки · кликов: {clickCounter}
            </h3>
            <button
              onClick={() => setDebugSteps([])}
              className="text-xs text-gray-500 hover:text-gray-300"
            >
              очистить
            </button>
          </div>
          {debugSteps.length === 0 ? (
            <p className="text-xs text-gray-500 font-mono">
              Нажми «Обновить уровни» — здесь появится лог действий
            </p>
          ) : (
            <div className="space-y-1 max-h-64 overflow-y-auto font-mono text-xs">
              {debugSteps.map((s, i) => {
                const color =
                  s.level === "ok"
                    ? "text-green-400"
                    : s.level === "warn"
                    ? "text-orange-400"
                    : s.level === "err"
                    ? "text-red-400"
                    : "text-gray-300"
                return (
                  <div key={i} className="flex gap-2">
                    <span className="text-gray-600 shrink-0">
                      {new Date(s.ts).toLocaleTimeString("ru-RU")}
                    </span>
                    <span className={`shrink-0 ${color}`}>
                      {s.level === "ok" ? "✓" : s.level === "warn" ? "⚠" : s.level === "err" ? "✗" : "·"}
                    </span>
                    <span className={color}>{s.msg}</span>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}
      <div className="mt-3 flex items-center justify-center gap-4 text-xs text-gray-500 flex-wrap">
        {lastRefresh && (
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            Обновлено: {new Date(lastRefresh).toLocaleTimeString("ru-RU")}
          </span>
        )}
        {autoRefresh && (
          <span className="text-gray-600">
            След. авто-обновление через{" "}
            <span className="text-orange-400 font-mono">
              {Math.floor(nextRefreshIn / 60)}:{String(nextRefreshIn % 60).padStart(2, "0")}
            </span>
          </span>
        )}
        <span className="text-gray-600">Уровни актуальны на май 2026</span>
      </div>
    </div>
  )
}

export default RefreshControls