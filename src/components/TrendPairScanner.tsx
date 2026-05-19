import { useMemo, useState } from "react"
import { Badge } from "@/components/ui/badge"
import Icon from "@/components/ui/icon"
import {
  pairs,
  applyLiveQuote,
  useScannerQuotes,
  type FilterType,
  type SortType,
  type Pair,
} from "./trend-pair-scanner/data"
import { TopPickCard } from "./trend-pair-scanner/TopPickCard"
import { ScannerFilters } from "./trend-pair-scanner/ScannerFilters"
import { ScannerTable } from "./trend-pair-scanner/ScannerTable"

export function TrendPairScanner() {
  const [filter, setFilter] = useState<FilterType>("all")
  const [sort, setSort] = useState<SortType>("trend")
  const { quotes, loading, lastUpdate } = useScannerQuotes()

  const livePairs: Pair[] = useMemo(
    () => pairs.map((p) => applyLiveQuote(p, p.apiSymbol ? quotes[p.apiSymbol] : undefined)),
    [quotes],
  )
  const liveSymbols = useMemo(() => {
    const s = new Set<string>()
    for (const p of pairs) {
      if (p.apiSymbol && quotes[p.apiSymbol] && !quotes[p.apiSymbol].error && quotes[p.apiSymbol].price !== undefined) {
        s.add(p.symbol)
      }
    }
    return s
  }, [quotes])

  const filtered = useMemo(() => {
    let res = livePairs
    if (filter !== "all") res = res.filter((p) => p.type === filter)
    res = [...res].sort((a, b) => {
      if (sort === "adx") return b.adx - a.adx
      if (sort === "atr") return b.atrPips - a.atrPips
      return b.trendScore - a.trendScore
    })
    return res
  }, [filter, sort, livePairs])

  const top = filtered[0]
  const hasLive = lastUpdate > 0

  return (
    <section className="mb-20">
      <h2 className="font-orbitron text-3xl font-bold text-white mb-2 flex items-center gap-3">
        <Icon name="Radar" className="text-red-500" /> Сканер трендовых пар
      </h2>
      <p className="text-gray-400 mb-6">
        Подбор идеальной пары под трендовую стратегию. Все пары — из каталога Pocket Option.
        Метрики: ADX (сила тренда), ATR (волатильность), RSI, наклон EMA.
      </p>

      <div className="flex items-center gap-2 mb-4 flex-wrap">
        {hasLive && (
          <Badge className="bg-green-500/15 text-green-400 border-green-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 mr-1.5 inline-block animate-pulse" />
            LIVE · {new Date(lastUpdate).toLocaleTimeString("ru-RU")}
          </Badge>
        )}
        {loading && (
          <Badge className="bg-zinc-700/60 text-gray-300 border-zinc-600 text-[10px]">
            <Icon name="RefreshCw" size={10} className="mr-1 animate-spin" />
            обновление
          </Badge>
        )}
        {!hasLive && !loading && (
          <Badge className="bg-zinc-800 text-gray-400 border-zinc-700 text-[10px]">
            Данные ожидаются
          </Badge>
        )}
      </div>

      {top && <TopPickCard top={top} isLive={liveSymbols.has(top.symbol)} />}
      <ScannerFilters filter={filter} setFilter={setFilter} sort={sort} setSort={setSort} />
      <ScannerTable filtered={filtered} liveSymbols={liveSymbols} />
    </section>
  )
}
