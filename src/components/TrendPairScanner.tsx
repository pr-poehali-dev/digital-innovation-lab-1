import { useMemo, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Icon from "@/components/ui/icon"

interface Pair {
  symbol: string
  type: "Forex" | "OTC" | "Crypto" | "Commodity"
  session: "Asia" | "Europe" | "US" | "24/7"
  adx: number
  atrPips: number
  rsi: number
  emaSlope: "up" | "down" | "flat"
  spreadPo: string
  payoutPo: number
  trendScore: number
  comment: string
}

const pairs: Pair[] = [
  {
    symbol: "EUR/USD OTC",
    type: "OTC",
    session: "24/7",
    adx: 32,
    atrPips: 9,
    rsi: 58,
    emaSlope: "up",
    spreadPo: "0.0",
    payoutPo: 92,
    trendScore: 88,
    comment: "Алгоритмическая пара — чистые тренды, минимум шума. Топ для трендовой стратегии на выходных.",
  },
  {
    symbol: "GBP/USD OTC",
    type: "OTC",
    session: "24/7",
    adx: 38,
    atrPips: 14,
    rsi: 64,
    emaSlope: "up",
    spreadPo: "0.0",
    payoutPo: 90,
    trendScore: 91,
    comment: "Самая трендовая OTC-пара. Высокая ATR, чёткие импульсы. Топ-1 для EMA-trend.",
  },
  {
    symbol: "USD/JPY OTC",
    type: "OTC",
    session: "24/7",
    adx: 28,
    atrPips: 11,
    rsi: 52,
    emaSlope: "up",
    spreadPo: "0.0",
    payoutPo: 91,
    trendScore: 78,
    comment: "Тренд средней силы, но очень стабильный. Хорошо отрабатывает MACD и Supertrend.",
  },
  {
    symbol: "AUD/CAD OTC",
    type: "OTC",
    session: "24/7",
    adx: 41,
    atrPips: 12,
    rsi: 67,
    emaSlope: "up",
    spreadPo: "0.0",
    payoutPo: 93,
    trendScore: 93,
    comment: "Хайповая OTC-пара у профи. ADX 40+ почти всегда — настоящая фабрика трендов.",
  },
  {
    symbol: "EUR/JPY OTC",
    type: "OTC",
    session: "24/7",
    adx: 35,
    atrPips: 16,
    rsi: 61,
    emaSlope: "up",
    spreadPo: "0.0",
    payoutPo: 92,
    trendScore: 86,
    comment: "Высокая ATR + чистый тренд. Подходит для экспирации 3–5 минут.",
  },
  {
    symbol: "EUR/USD",
    type: "Forex",
    session: "Europe",
    adx: 24,
    atrPips: 8,
    rsi: 55,
    emaSlope: "up",
    spreadPo: "0.6",
    payoutPo: 87,
    trendScore: 72,
    comment: "Лучше всего работает 10:00–18:00 МСК. До открытия Лондона — флэт, не лезь.",
  },
  {
    symbol: "GBP/USD",
    type: "Forex",
    session: "Europe",
    adx: 31,
    atrPips: 13,
    rsi: 59,
    emaSlope: "up",
    spreadPo: "0.9",
    payoutPo: 85,
    trendScore: 81,
    comment: "Кабель — король трендов. Сильные импульсы, но и шум выше. Stop-hunt частый.",
  },
  {
    symbol: "USD/JPY",
    type: "Forex",
    session: "Asia",
    adx: 27,
    atrPips: 10,
    rsi: 53,
    emaSlope: "up",
    spreadPo: "0.7",
    payoutPo: 86,
    trendScore: 75,
    comment: "Главная азиатская пара. Тренды по новостям BoJ. Утром — топ.",
  },
  {
    symbol: "BTC/USD",
    type: "Crypto",
    session: "US",
    adx: 36,
    atrPips: 850,
    rsi: 62,
    emaSlope: "up",
    spreadPo: "8.0",
    payoutPo: 78,
    trendScore: 84,
    comment: "Тренды мощные, но рваные. Лучшее окно — 15:30–22:00 МСК (открытие фонды США).",
  },
  {
    symbol: "ETH/USD",
    type: "Crypto",
    session: "US",
    adx: 33,
    atrPips: 95,
    rsi: 60,
    emaSlope: "up",
    spreadPo: "0.4",
    payoutPo: 80,
    trendScore: 80,
    comment: "Ходит за BTC с усилением. ATR в % больше — пробои масштабнее.",
  },
  {
    symbol: "XAU/USD (Gold)",
    type: "Commodity",
    session: "Europe",
    adx: 29,
    atrPips: 220,
    rsi: 57,
    emaSlope: "flat",
    spreadPo: "0.5",
    payoutPo: 82,
    trendScore: 73,
    comment: "Реагирует на DXY и геополитику. Тренды короткие, но мощные.",
  },
  {
    symbol: "AUD/USD",
    type: "Forex",
    session: "Asia",
    adx: 22,
    atrPips: 6,
    rsi: 48,
    emaSlope: "flat",
    spreadPo: "0.8",
    payoutPo: 84,
    trendScore: 58,
    comment: "Тренды слабые. Подходит для разворотных стратегий, не для тренд-следования.",
  },
]

type FilterType = "all" | "OTC" | "Forex" | "Crypto"

function getAdxStatus(adx: number) {
  if (adx >= 40) return { label: "СИЛЬНЫЙ", color: "bg-green-500", text: "text-green-400" }
  if (adx >= 25) return { label: "ТРЕНД", color: "bg-yellow-500", text: "text-yellow-400" }
  return { label: "ФЛЭТ", color: "bg-gray-500", text: "text-gray-400" }
}

function getScoreColor(score: number) {
  if (score >= 85) return "text-green-400 border-green-500/40"
  if (score >= 70) return "text-yellow-400 border-yellow-500/40"
  return "text-gray-400 border-zinc-700"
}

export function TrendPairScanner() {
  const [filter, setFilter] = useState<FilterType>("all")
  const [sort, setSort] = useState<"trend" | "adx" | "atr">("trend")

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

      {/* Топ-рекомендация */}
      {top && (
        <Card className="bg-gradient-to-br from-green-950/40 via-zinc-900/60 to-black border-green-500/40 border-2 mb-6">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <Icon name="Award" className="text-green-400" size={28} />
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                TOP PICK · Сила тренда {top.trendScore}/100
              </Badge>
            </div>
            <div className="flex flex-wrap items-baseline gap-4 mb-3">
              <span className="font-orbitron text-3xl font-bold text-white">{top.symbol}</span>
              <Badge className="bg-zinc-800 text-gray-300 border-zinc-700">{top.type}</Badge>
              <Badge className="bg-zinc-800 text-gray-300 border-zinc-700">Выплата {top.payoutPo}%</Badge>
            </div>
            <p className="text-gray-300">{top.comment}</p>
          </CardContent>
        </Card>
      )}

      {/* Фильтры */}
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
          {(["trend", "adx", "atr"] as const).map((s) => (
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

      {/* Таблица */}
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
    </section>
  )
}
