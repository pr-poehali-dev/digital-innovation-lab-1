import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Icon from "@/components/ui/icon"
import type { DeepDive, Level } from "./data"
import { useRuntimeLevels } from "@/lib/useRuntimeLevels"

interface Props {
  dive: DeepDive
}

/** Ключ в рантайм-сторе совпадает с symbol дайва (EUR/USD OTC и т.п.) */
function storeKeyFor(dive: DeepDive): string {
  return dive.symbol
}

function buildLiveLevels(values: number[], current: number, hardcoded: Level[]): Level[] {
  // Если есть оригинальные заметки/strength — реюзаем по позициям, иначе дефолтные
  const sorted = [...values].sort((a, b) => b - a) // сверху R, потом Pivot, потом S
  return sorted.map((v, i): Level => {
    const ref = hardcoded[i]
    let type: "R" | "S" | "Pivot"
    if (v > current * 1.002) type = "R"
    else if (v < current * 0.998) type = "S"
    else type = "Pivot"
    return {
      price: typeof v === "number" ? (v >= 1000 ? v.toLocaleString("ru-RU") : String(v)) : String(v),
      type,
      strength: ref?.strength ?? "средний",
      note: ref?.note ?? `Автоматический уровень от текущей цены ${current}`,
    }
  })
}

export function LevelsBlock({ dive }: Props) {
  const { meta, isLive } = useRuntimeLevels(storeKeyFor(dive))
  const levels: Level[] =
    meta && meta.levels.length > 0
      ? buildLiveLevels(meta.levels, meta.current, dive.levels)
      : dive.levels

  return (
    <Card className="bg-zinc-900/50 border-zinc-800 border-2 mb-6">
      <CardContent className="p-6">
        <h3 className="font-orbitron text-xl font-bold text-white mb-4 flex items-center gap-2 flex-wrap">
          <Icon name="LineChart" className={dive.accent} size={22} />
          Уровни поддержки и сопротивления
          {meta && (
            <Badge className={`ml-auto text-[10px] ${isLive ? "bg-green-500/20 text-green-400 border-green-500/40" : "bg-zinc-700 text-gray-400 border-zinc-600"}`}>
              {isLive ? "🟢 LIVE" : "обновлено"} · {new Date(meta.updatedAt).toLocaleTimeString("ru-RU")}
            </Badge>
          )}
        </h3>
        <div className="space-y-2">
          {levels.map((lvl, i) => {
            const isR = lvl.type === "R"
            const isP = lvl.type === "Pivot"
            return (
              <div
                key={i}
                className={`grid grid-cols-12 gap-3 items-center p-3 rounded border ${
                  isR ? "bg-red-500/5 border-red-500/20" :
                  isP ? "bg-yellow-500/5 border-yellow-500/20" :
                  "bg-green-500/5 border-green-500/20"
                }`}
              >
                <div className="col-span-3 md:col-span-2 font-mono font-bold text-white text-lg">
                  {lvl.price}
                </div>
                <div className="col-span-3 md:col-span-2">
                  <Badge className={
                    isR ? "bg-red-500/20 text-red-400 border-red-500/40" :
                    isP ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/40" :
                    "bg-green-500/20 text-green-400 border-green-500/40"
                  }>
                    {isR ? "Сопротивление" : isP ? "Pivot" : "Поддержка"}
                  </Badge>
                </div>
                <div className="col-span-3 md:col-span-2 text-xs text-gray-400">
                  {lvl.strength}
                </div>
                <div className="col-span-12 md:col-span-6 text-sm text-gray-300">
                  {lvl.note}
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}