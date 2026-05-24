import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Icon from "@/components/ui/icon"
import { sessions, eurUsdSchedule, btcUsdSchedule } from "./timingData"

export function SessionsAndSchedules() {
  return (
    <>
      {/* Торговые сессии */}
      <section className="mb-20">
        <h2 className="font-orbitron text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <Icon name="Globe" className="text-red-500" /> Торговые сессии
        </h2>
        <p className="text-gray-400 mb-8">Мир торгует круглосуточно — но не вся ликвидность одинаковая.</p>
        <div className="grid md:grid-cols-2 gap-6">
          {sessions.map((s) => (
            <Card key={s.name} className={`bg-zinc-900/50 ${s.color} border-2`}>
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <Icon name={s.icon} className={s.accent} size={28} />
                  <Badge className="bg-zinc-800 text-gray-300 border-zinc-700">{s.time}</Badge>
                </div>
                <CardTitle className={`font-orbitron ${s.accent}`}>{s.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 mb-4">{s.desc}</p>
                <div className="mb-3">
                  <div className="text-xs text-gray-500 mb-1">Активные пары:</div>
                  <div className="flex flex-wrap gap-2">
                    {s.pairs.map((p) => (
                      <Badge key={p} className="bg-zinc-800 text-gray-300 border-zinc-700">
                        {p}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="text-sm text-gray-400 bg-black/40 border border-zinc-800 rounded p-3">
                  <Icon name="Lightbulb" size={14} className="inline mr-1 text-yellow-400" />
                  {s.tips}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Расписание EUR/USD OTC */}
      <section className="mb-20">
        <h2 className="font-orbitron text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <Icon name="TrendingUp" className="text-red-500" />
          Расписание EUR/USD <span className="text-red-400">OTC</span>
        </h2>
        <p className="text-gray-400 mb-8">Время МСК. Главная пара для бинарных опционов.</p>
        <Card className="bg-zinc-900/50 border-red-500/30 border-2">
          <CardContent className="p-6">
            <div className="space-y-3">
              {eurUsdSchedule.map((row) => (
                <div
                  key={row.time}
                  className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center p-3 rounded bg-black/40 border border-zinc-800"
                >
                  <div className="md:col-span-3 font-mono text-white font-bold">{row.time}</div>
                  <div className="md:col-span-2">
                    <Badge className={`${row.color} text-white border-0 font-semibold`}>{row.vol}</Badge>
                  </div>
                  <div className="md:col-span-7 text-gray-300 text-sm">{row.note}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Расписание BTC/USD */}
      <section className="mb-20">
        <h2 className="font-orbitron text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <Icon name="Bitcoin" className="text-yellow-400" />
          Расписание <span className="text-yellow-400">BTC/USD</span>
        </h2>
        <p className="text-gray-400 mb-8">Крипта торгуется 24/7, но реальные движения — в часы американской сессии.</p>
        <Card className="bg-zinc-900/50 border-yellow-500/30 border-2">
          <CardContent className="p-6">
            <div className="space-y-3">
              {btcUsdSchedule.map((row) => (
                <div
                  key={row.time}
                  className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center p-3 rounded bg-black/40 border border-zinc-800"
                >
                  <div className="md:col-span-3 font-mono text-white font-bold">{row.time}</div>
                  <div className="md:col-span-2">
                    <Badge className={`${row.color} text-white border-0 font-semibold`}>{row.vol}</Badge>
                  </div>
                  <div className="md:col-span-7 text-gray-300 text-sm">{row.note}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>
    </>
  )
}

export default SessionsAndSchedules
