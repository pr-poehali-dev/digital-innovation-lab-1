import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Icon from "@/components/ui/icon"
import type { DeepDive, LiveQuote } from "./data"

interface Props {
  dive: DeepDive
  active: DeepDive["key"]
  live: LiveQuote | null
  loading: boolean
  lastUpdate: number
}

export function PairHeader({ dive, active, live, loading, lastUpdate }: Props) {
  const livePrice = live?.price
  const liveChange = live?.change_pct
  const liveAdx = live?.adx
  const liveRsi = live?.rsi
  const liveAtr = live?.atr
  const liveTrend = live?.trend
  const hasLive = !!livePrice && !live?.error

  const displayPrice = hasLive
    ? active === "btc-usd"
      ? livePrice!.toLocaleString("en-US", { maximumFractionDigits: 0 })
      : livePrice!.toFixed(4)
    : dive.currentPrice

  const displayChange = hasLive
    ? `${liveChange! >= 0 ? "+" : ""}${liveChange!.toFixed(2)}%`
    : dive.change
  const changePositive = hasLive ? liveChange! >= 0 : dive.changePositive

  const dynamicBias =
    hasLive && liveTrend
      ? liveTrend === "up"
        ? { label: "Бычий", color: "bg-green-500/20 text-green-400 border-green-500/30" }
        : liveTrend === "down"
        ? { label: "Медвежий", color: "bg-red-500/20 text-red-400 border-red-500/30" }
        : { label: "Нейтральный", color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" }
      : { label: dive.bias, color: dive.biasColor }

  return (
    <Card className={`bg-gradient-to-br from-zinc-900/80 via-black to-zinc-900/40 border-2 ${dive.border} ${dive.glow} shadow-xl mb-6`}>
      <CardContent className="p-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <div className="flex items-baseline gap-3 mb-2 flex-wrap">
              <span className="font-orbitron text-3xl font-bold text-white">{dive.symbol}</span>
              <Badge className={dynamicBias.color}>{dynamicBias.label} bias</Badge>
              {hasLive && (
                <Badge className="bg-green-500/15 text-green-400 border-green-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 mr-1.5 inline-block animate-pulse" />
                  LIVE · {lastUpdate ? new Date(lastUpdate).toLocaleTimeString("ru-RU") : "—"}
                </Badge>
              )}
              {loading && (
                <Badge className="bg-zinc-700/60 text-gray-300 border-zinc-600 text-[10px]">
                  <Icon name="RefreshCw" size={10} className="mr-1 animate-spin" />
                  обновление
                </Badge>
              )}
            </div>
            <div className="flex items-baseline gap-3 mb-4">
              <span className="font-mono text-4xl font-bold text-white">{displayPrice}</span>
              <span className={`font-mono text-lg ${changePositive ? "text-green-400" : "text-red-400"}`}>
                {changePositive ? "▲" : "▼"} {displayChange}
              </span>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">{dive.summary}</p>
          </div>

          {/* Метрики */}
          <div className="grid grid-cols-2 gap-2">
            {dive.metrics.map((m, idx) => {
              let val = m.value
              let hint = m.hint
              let liveFlag = false
              if (hasLive && idx === 0 && liveAdx !== undefined) {
                val = String(liveAdx)
                hint = liveAdx >= 40 ? "Сильный тренд" : liveAdx >= 25 ? "Тренд средней силы" : "Флэт / слабый тренд"
                liveFlag = true
              }
              if (hasLive && idx === 1 && liveRsi !== undefined) {
                val = String(liveRsi)
                hint = liveRsi > 70 ? "Перекупленность" : liveRsi < 30 ? "Перепроданность" : "Нейтральная зона"
                liveFlag = true
              }
              if (hasLive && idx === 2 && liveAtr !== undefined) {
                val = active === "btc-usd" ? `$${liveAtr.toFixed(0)}` : `${(liveAtr * 10000).toFixed(0)} pips`
                hint = "Средний размах за свечу"
                liveFlag = true
              }
              return (
                <div key={m.label} className="bg-black/40 border border-zinc-800 rounded p-3 relative">
                  {liveFlag && (
                    <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  )}
                  <div className="text-[10px] text-gray-500 uppercase mb-1">{m.label}</div>
                  <div className={`font-mono text-lg font-bold ${dive.accent}`}>{val}</div>
                  {hint && <div className="text-[10px] text-gray-500 mt-1">{hint}</div>}
                </div>
              )
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
