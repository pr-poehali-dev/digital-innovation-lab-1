import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Icon from "@/components/ui/icon"

interface Session {
  name: string
  startHour: number
  endHour: number
  icon: string
  color: string
  bg: string
  border: string
  desc: string
  bestPair: string
}

const sessionsList: Session[] = [
  {
    name: "Ночь / OTC",
    startHour: 0,
    endHour: 3,
    icon: "Moon",
    color: "text-purple-400",
    bg: "from-purple-950/40",
    border: "border-purple-500/40",
    desc: "Forex закрыт. EUR/USD OTC ходит по алгоритму брокера.",
    bestPair: "EUR/USD OTC",
  },
  {
    name: "Азиатская сессия",
    startHour: 3,
    endHour: 10,
    icon: "Sunrise",
    color: "text-yellow-400",
    bg: "from-yellow-950/40",
    border: "border-yellow-500/40",
    desc: "Низкая волатильность. Скальп в узких диапазонах.",
    bestPair: "USD/JPY, EUR/USD OTC",
  },
  {
    name: "Европейская сессия",
    startHour: 10,
    endHour: 15,
    icon: "Building2",
    color: "text-blue-400",
    bg: "from-blue-950/40",
    border: "border-blue-500/40",
    desc: "Открытие Лондона. Лучшее время для тренда по EUR/USD.",
    bestPair: "EUR/USD, GBP/USD",
  },
  {
    name: "США + Европа (PEAK)",
    startHour: 15,
    endHour: 19,
    icon: "Flame",
    color: "text-red-400",
    bg: "from-red-950/50",
    border: "border-red-500/50",
    desc: "🔥 Пик волатильности. Новости по USD в 15:30 и 17:00.",
    bestPair: "EUR/USD, BTC/USD",
  },
  {
    name: "Американская сессия",
    startHour: 19,
    endHour: 24,
    icon: "Sun",
    color: "text-orange-400",
    bg: "from-orange-950/40",
    border: "border-orange-500/40",
    desc: "Крипта оживает. BTC/USD тянется за NASDAQ.",
    bestPair: "BTC/USD, EUR/USD",
  },
]

function getMoscowTime(): { h: number; m: number; s: number } {
  const now = new Date()
  const utc = now.getTime() + now.getTimezoneOffset() * 60000
  const msk = new Date(utc + 3 * 3600000)
  return { h: msk.getHours(), m: msk.getMinutes(), s: msk.getSeconds() }
}

function getCurrentSession(hour: number): Session {
  return (
    sessionsList.find((s) => hour >= s.startHour && hour < s.endHour) || sessionsList[0]
  )
}

function pad(n: number) {
  return n.toString().padStart(2, "0")
}

export function LiveSessionClock() {
  const [time, setTime] = useState(getMoscowTime())

  useEffect(() => {
    const id = setInterval(() => setTime(getMoscowTime()), 1000)
    return () => clearInterval(id)
  }, [])

  const current = getCurrentSession(time.h)
  const minutesInSession = (time.h - current.startHour) * 60 + time.m
  const totalMinutes = (current.endHour - current.startHour) * 60
  const progress = Math.min(100, Math.round((minutesInSession / totalMinutes) * 100))
  const minutesLeft = totalMinutes - minutesInSession

  return (
    <Card
      className={`bg-gradient-to-br ${current.bg} via-zinc-900/60 to-black ${current.border} border-2 mb-10`}
    >
      <CardContent className="p-6 md:p-8">
        <div className="grid md:grid-cols-2 gap-6 items-center">
          {/* Часы */}
          <div className="text-center md:text-left">
            <div className="flex items-center gap-2 justify-center md:justify-start mb-2">
              <Icon name="Clock" className="text-gray-400" size={16} />
              <span className="text-xs text-gray-400 uppercase tracking-wider">
                Сейчас в Москве
              </span>
            </div>
            <div className="font-orbitron text-5xl md:text-7xl font-bold text-white tabular-nums">
              {pad(time.h)}
              <span className="text-red-500 animate-pulse">:</span>
              {pad(time.m)}
              <span className="text-gray-600 text-3xl md:text-5xl">:{pad(time.s)}</span>
            </div>
          </div>

          {/* Сессия */}
          <div>
            <div className="flex items-center gap-3 mb-3">
              <Icon name={current.icon} className={current.color} size={32} />
              <div>
                <div className="text-xs text-gray-400 uppercase">Активная сессия</div>
                <div className={`font-orbitron text-xl font-bold ${current.color}`}>
                  {current.name}
                </div>
              </div>
            </div>
            <p className="text-gray-300 text-sm mb-3">{current.desc}</p>
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="text-xs text-gray-500">Лучшие пары:</span>
              <Badge className="bg-zinc-800 text-gray-200 border-zinc-700 font-mono">
                {current.bestPair}
              </Badge>
            </div>
            <div>
              <div className="flex justify-between text-xs text-gray-400 mb-1">
                <span>
                  {pad(current.startHour)}:00 — {pad(current.endHour)}:00
                </span>
                <span>осталось ~{Math.floor(minutesLeft / 60)}ч {minutesLeft % 60}м</span>
              </div>
              <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className={`h-full ${current.color.replace("text-", "bg-")} transition-all duration-1000`}
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
