import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Icon from "@/components/ui/icon"
import type { DeepDive } from "./data"

interface Props {
  dive: DeepDive
}

export function LevelsBlock({ dive }: Props) {
  return (
    <Card className="bg-zinc-900/50 border-zinc-800 border-2 mb-6">
      <CardContent className="p-6">
        <h3 className="font-orbitron text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Icon name="LineChart" className={dive.accent} size={22} />
          Уровни поддержки и сопротивления
        </h3>
        <div className="space-y-2">
          {dive.levels.map((lvl, i) => {
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
