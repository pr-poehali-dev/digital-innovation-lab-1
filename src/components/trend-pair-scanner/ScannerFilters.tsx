import { Button } from "@/components/ui/button"
import type { FilterType, SortType } from "./data"

interface Props {
  filter: FilterType
  setFilter: (f: FilterType) => void
  sort: SortType
  setSort: (s: SortType) => void
}

export function ScannerFilters({ filter, setFilter, sort, setSort }: Props) {
  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {(["all", "OTC", "Forex", "Crypto"] as FilterType[]).map((f) => (
        <Button
          key={f}
          variant={filter === f ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter(f)}
          className={
            filter === f
              ? "bg-red-500 hover:bg-red-600 text-white"
              : "border-zinc-700 text-gray-300 hover:bg-zinc-800"
          }
        >
          {f === "all" ? "Все пары" : f}
        </Button>
      ))}
      <div className="ml-auto flex gap-2">
        <span className="text-xs text-gray-500 self-center">Сортировка:</span>
        {(["trend", "adx", "atr"] as SortType[]).map((s) => (
          <Button
            key={s}
            variant={sort === s ? "default" : "outline"}
            size="sm"
            onClick={() => setSort(s)}
            className={
              sort === s
                ? "bg-zinc-700 hover:bg-zinc-600 text-white"
                : "border-zinc-700 text-gray-400 hover:bg-zinc-800"
            }
          >
            {s === "trend" ? "По силе" : s === "adx" ? "По ADX" : "По ATR"}
          </Button>
        ))}
      </div>
    </div>
  )
}
