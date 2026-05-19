import { useMemo, useState } from "react"
import Icon from "@/components/ui/icon"
import { pairs, type FilterType, type SortType } from "./trend-pair-scanner/data"
import { TopPickCard } from "./trend-pair-scanner/TopPickCard"
import { ScannerFilters } from "./trend-pair-scanner/ScannerFilters"
import { ScannerTable } from "./trend-pair-scanner/ScannerTable"

export function TrendPairScanner() {
  const [filter, setFilter] = useState<FilterType>("all")
  const [sort, setSort] = useState<SortType>("trend")

  const filtered = useMemo(() => {
    let res = pairs
    if (filter !== "all") res = res.filter((p) => p.type === filter)
    res = [...res].sort((a, b) => {
      if (sort === "adx") return b.adx - a.adx
      if (sort === "atr") return b.atrPips - a.atrPips
      return b.trendScore - a.trendScore
    })
    return res
  }, [filter, sort])

  const top = filtered[0]

  return (
    <section className="mb-20">
      <h2 className="font-orbitron text-3xl font-bold text-white mb-2 flex items-center gap-3">
        <Icon name="Radar" className="text-red-500" /> Сканер трендовых пар
      </h2>
      <p className="text-gray-400 mb-6">
        Подбор идеальной пары под трендовую стратегию. Все пары — из каталога Pocket Option.
        Метрики: ADX (сила тренда), ATR (волатильность), RSI, наклон EMA.
      </p>

      {top && <TopPickCard top={top} />}
      <ScannerFilters filter={filter} setFilter={setFilter} sort={sort} setSort={setSort} />
      <ScannerTable filtered={filtered} />
    </section>
  )
}
