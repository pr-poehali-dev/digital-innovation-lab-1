import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Icon from "@/components/ui/icon"
import type { Pair } from "./data"

interface Props {
  top: Pair
  isLive?: boolean
}

export function TopPickCard({ top, isLive }: Props) {
  return (
    <Card className="bg-gradient-to-br from-green-950/40 via-zinc-900/60 to-black border-green-500/40 border-2 mb-6">
      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-3 flex-wrap">
          <Icon name="Award" className="text-green-400" size={28} />
          <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
            TOP PICK · Сила тренда {top.trendScore}/100
          </Badge>
          {isLive && (
            <Badge className="bg-green-500/15 text-green-400 border-green-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 mr-1.5 inline-block animate-pulse" />
              LIVE
            </Badge>
          )}
        </div>
        <div className="flex flex-wrap items-baseline gap-4 mb-3">
          <span className="font-orbitron text-3xl font-bold text-white">{top.symbol}</span>
          <Badge className="bg-zinc-800 text-gray-300 border-zinc-700">{top.type}</Badge>
          <Badge className="bg-zinc-800 text-gray-300 border-zinc-700">Выплата {top.payoutPo}%</Badge>
        </div>
        <p className="text-gray-300">{top.comment}</p>
      </CardContent>
    </Card>
  )
}