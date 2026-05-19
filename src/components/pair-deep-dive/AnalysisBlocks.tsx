import { Card, CardContent } from "@/components/ui/card"
import Icon from "@/components/ui/icon"
import type { DeepDive } from "./data"

interface Props {
  dive: DeepDive
}

export function NewsBlock({ dive }: Props) {
  return (
    <Card className="bg-zinc-900/50 border-zinc-800 border-2 mb-6">
      <CardContent className="p-6">
        <h3 className="font-orbitron text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Icon name="Newspaper" className={dive.accent} size={22} />
          Свежие новости и реакция рынка
        </h3>
        <div className="space-y-3">
          {dive.news.map((n, i) => (
            <div key={i} className={`rounded border p-4 ${n.color}`}>
              <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <Icon
                    name={n.impact === "high" ? "AlertCircle" : n.impact === "medium" ? "Info" : "Circle"}
                    size={16}
                    className={
                      n.impact === "high" ? "text-red-400" :
                      n.impact === "medium" ? "text-yellow-400" : "text-gray-500"
                    }
                  />
                  <span className="font-semibold text-white text-sm">{n.title}</span>
                </div>
                <span className="text-xs text-gray-500">{n.date}</span>
              </div>
              <p className="text-gray-300 text-sm pl-6">{n.result}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export function ScenariosBlock({ dive }: Props) {
  return (
    <Card className="bg-zinc-900/50 border-zinc-800 border-2">
      <CardContent className="p-6">
        <h3 className="font-orbitron text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Icon name="Crosshair" className={dive.accent} size={22} />
          Торговые сценарии на ближайшее время
        </h3>
        <div className="grid md:grid-cols-3 gap-4">
          {dive.scenarios.map((sc, i) => (
            <div
              key={i}
              className={`rounded border-2 p-4 ${
                sc.tone === "bull"
                  ? "bg-green-500/5 border-green-500/30"
                  : "bg-red-500/5 border-red-500/30"
              }`}
            >
              <div className="flex items-center gap-2 mb-3">
                <Icon
                  name={sc.tone === "bull" ? "TrendingUp" : "TrendingDown"}
                  className={sc.tone === "bull" ? "text-green-400" : "text-red-400"}
                  size={20}
                />
                <span className="font-semibold text-white text-sm">{sc.title}</span>
              </div>
              <div className="text-[11px] text-gray-500 uppercase mb-1 mt-3">Условие:</div>
              <p className="text-sm text-gray-300 mb-3">{sc.condition}</p>
              <div className="text-[11px] text-gray-500 uppercase mb-1">Действие:</div>
              <p className={`text-sm font-semibold ${sc.tone === "bull" ? "text-green-400" : "text-red-400"}`}>
                {sc.action}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
