import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Icon from "@/components/ui/icon"
import { getAdxStatus, getScoreColor, type Pair } from "./data"

interface Props {
  filtered: Pair[]
}

export function ScannerTable({ filtered }: Props) {
  return (
    <>
      <Card className="bg-zinc-900/50 border-zinc-800 border">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-black/50 border-b border-zinc-800">
                <tr className="text-left text-gray-500 text-xs uppercase">
                  <th className="p-3">Пара</th>
                  <th className="p-3">ADX</th>
                  <th className="p-3">ATR</th>
                  <th className="p-3">RSI</th>
                  <th className="p-3">EMA</th>
                  <th className="p-3">Payout</th>
                  <th className="p-3">Сила тренда</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => {
                  const adx = getAdxStatus(p.adx)
                  return (
                    <tr key={p.symbol} className="border-b border-zinc-800 hover:bg-black/30">
                      <td className="p-3">
                        <div className="font-mono font-bold text-white">{p.symbol}</div>
                        <div className="text-xs text-gray-500">{p.type} · {p.session}</div>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <span className={`font-mono font-bold ${adx.text}`}>{p.adx}</span>
                          <Badge className={`${adx.color} text-black text-[10px] font-bold border-0`}>
                            {adx.label}
                          </Badge>
                        </div>
                      </td>
                      <td className="p-3 font-mono text-gray-300">
                        {p.atrPips}
                        <span className="text-xs text-gray-500 ml-1">
                          {p.type === "Crypto" ? "$" : "pips"}
                        </span>
                      </td>
                      <td className="p-3">
                        <span className={`font-mono font-bold ${
                          p.rsi > 70 ? "text-red-400" : p.rsi < 30 ? "text-green-400" : "text-gray-300"
                        }`}>
                          {p.rsi}
                        </span>
                      </td>
                      <td className="p-3">
                        <Icon
                          name={p.emaSlope === "up" ? "TrendingUp" : p.emaSlope === "down" ? "TrendingDown" : "Minus"}
                          className={
                            p.emaSlope === "up" ? "text-green-400" :
                            p.emaSlope === "down" ? "text-red-400" : "text-gray-500"
                          }
                          size={18}
                        />
                      </td>
                      <td className="p-3 font-mono text-gray-300">{p.payoutPo}%</td>
                      <td className="p-3">
                        <div className={`inline-flex items-center gap-2 px-2 py-1 rounded border ${getScoreColor(p.trendScore)} bg-black/30`}>
                          <span className="font-mono font-bold">{p.trendScore}</span>
                          <div className="w-14 h-1.5 bg-zinc-800 rounded overflow-hidden">
                            <div
                              className={p.trendScore >= 85 ? "bg-green-500" : p.trendScore >= 70 ? "bg-yellow-500" : "bg-gray-500"}
                              style={{ width: `${p.trendScore}%`, height: "100%" }}
                            />
                          </div>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Легенда индикаторов */}
      <Card className="bg-zinc-900/30 border-zinc-800 border mt-4">
        <CardContent className="p-5">
          <div className="text-xs text-gray-500 uppercase mb-3 font-semibold">Как читать индикаторы</div>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-300">
            <div className="flex gap-3">
              <Icon name="Activity" className="text-red-400 flex-shrink-0 mt-0.5" size={18} />
              <div>
                <b className="text-white">ADX</b> — сила тренда (0–100). До 20 — флэт, 25–40 — тренд,
                40+ — сильный тренд. Главный индикатор для тренд-стратегий.
              </div>
            </div>
            <div className="flex gap-3">
              <Icon name="Waves" className="text-blue-400 flex-shrink-0 mt-0.5" size={18} />
              <div>
                <b className="text-white">ATR</b> — средний размах свечи. Чем выше — тем большие движения
                и тем дальше ставим экспирацию.
              </div>
            </div>
            <div className="flex gap-3">
              <Icon name="Gauge" className="text-purple-400 flex-shrink-0 mt-0.5" size={18} />
              <div>
                <b className="text-white">RSI</b> — перекупленность. {">"}70 — пара перегрета, риск разворота.
                {" <"}30 — перепродана, ждём отскока.
              </div>
            </div>
            <div className="flex gap-3">
              <Icon name="TrendingUp" className="text-green-400 flex-shrink-0 mt-0.5" size={18} />
              <div>
                <b className="text-white">EMA</b> — наклон скользящей. Вверх = бычий тренд, вниз =
                медвежий, плоско = флэт.
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  )
}
