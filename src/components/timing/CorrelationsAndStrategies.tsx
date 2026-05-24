import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Icon from "@/components/ui/icon"
import { correlations, dayStrategies } from "./timingData"

export function CorrelationsAndStrategies() {
  return (
    <>
      {/* Корреляция пар */}
      <section className="mb-20">
        <h2 className="font-orbitron text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <Icon name="GitMerge" className="text-red-500" /> Корреляция пар
        </h2>
        <p className="text-gray-400 mb-8">
          Какие пары двигаются вместе, а какие зеркально. Используй для подтверждения сигналов.
        </p>
        <div className="grid md:grid-cols-2 gap-4">
          {correlations.map((c) => (
            <Card key={c.pair1 + c.pair2} className="bg-zinc-900/50 border-zinc-700 border">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-white font-bold">{c.pair1}</span>
                    <Icon
                      name={c.type.startsWith("Обратная") ? "ArrowLeftRight" : "ArrowRight"}
                      size={16}
                      className="text-gray-500"
                    />
                    <span className="font-mono text-white font-bold">{c.pair2}</span>
                  </div>
                  <Badge
                    className={
                      c.value.startsWith("+")
                        ? "bg-green-500/20 text-green-400 border-green-500/30"
                        : c.value.startsWith("−")
                        ? "bg-red-500/20 text-red-400 border-red-500/30"
                        : "bg-zinc-700 text-gray-300"
                    }
                  >
                    {c.value}
                  </Badge>
                </div>
                <div className="text-xs text-gray-500 mb-2">{c.type}</div>
                <p className="text-gray-300 text-sm">{c.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Стратегии по времени дня */}
      <section className="mb-12">
        <h2 className="font-orbitron text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <Icon name="Target" className="text-red-500" /> Стратегии по времени дня
        </h2>
        <p className="text-gray-400 mb-8">Утром скальп, днём тренд, вечером новости, ночью OTC.</p>
        <div className="grid md:grid-cols-2 gap-6">
          {dayStrategies.map((s) => (
            <Card key={s.time} className={`bg-zinc-900/50 ${s.color} border-2`}>
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <Icon name={s.icon} className={s.accent} size={28} />
                  <Badge className="bg-zinc-800 text-gray-300 border-zinc-700">{s.time}</Badge>
                </div>
                <CardTitle className={`font-orbitron ${s.accent}`}>{s.strategy}</CardTitle>
                <div className="text-sm text-gray-500 font-mono">{s.pair}</div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 mb-4">{s.desc}</p>
                <div className="text-xs text-gray-500 mb-2">Индикаторы и условия:</div>
                <ul className="space-y-1">
                  {s.indicators.map((i) => (
                    <li key={i} className="text-sm text-gray-300 flex items-start gap-2">
                      <Icon name="Check" size={14} className={`${s.accent} mt-0.5 flex-shrink-0`} />
                      <span>{i}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Финальный блок */}
      <Card className="bg-gradient-to-br from-red-950/40 via-zinc-900/60 to-black border-red-500/30 border-2">
        <CardContent className="p-8 text-center">
          <Icon name="AlertTriangle" className="text-yellow-400 mx-auto mb-4" size={40} />
          <h3 className="font-orbitron text-2xl font-bold text-white mb-3">Главное правило тайминга</h3>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Не торгуй за 30 минут до и 15 минут после важных новостей по USD (15:30 и 17:00 МСК) —
            волатильность ломает любую стратегию. Используй экономический календарь.
          </p>
        </CardContent>
      </Card>
    </>
  )
}

export default CorrelationsAndStrategies
