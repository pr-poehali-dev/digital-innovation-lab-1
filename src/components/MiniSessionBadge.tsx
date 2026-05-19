import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import Icon from "@/components/ui/icon"

interface Session {
  name: string
  startHour: number
  endHour: number
  icon: string
  color: string
  glow: string
  pair: string
}

const sessions: Session[] = [
  {
    name: "Ночь / OTC",
    startHour: 0,
    endHour: 3,
    icon: "Moon",
    color: "text-purple-400",
    glow: "shadow-purple-500/30",
    pair: "EUR/USD OTC",
  },
  {
    name: "Азия",
    startHour: 3,
    endHour: 10,
    icon: "Sunrise",
    color: "text-yellow-400",
    glow: "shadow-yellow-500/30",
    pair: "USD/JPY",
  },
  {
    name: "Европа",
    startHour: 10,
    endHour: 15,
    icon: "Building2",
    color: "text-blue-400",
    glow: "shadow-blue-500/30",
    pair: "EUR/USD",
  },
  {
    name: "PEAK 🔥",
    startHour: 15,
    endHour: 19,
    icon: "Flame",
    color: "text-red-400",
    glow: "shadow-red-500/50",
    pair: "EUR/USD, BTC",
  },
  {
    name: "США",
    startHour: 19,
    endHour: 24,
    icon: "Sun",
    color: "text-orange-400",
    glow: "shadow-orange-500/30",
    pair: "BTC/USD",
  },
]

function getMoscowTime() {
  const now = new Date()
  const utc = now.getTime() + now.getTimezoneOffset() * 60000
  const msk = new Date(utc + 3 * 3600000)
  return { h: msk.getHours(), m: msk.getMinutes() }
}

function pad(n: number) {
  return n.toString().padStart(2, "0")
}

export function MiniSessionBadge() {
  const navigate = useNavigate()
  const [time, setTime] = useState(getMoscowTime())

  useEffect(() => {
    const id = setInterval(() => setTime(getMoscowTime()), 30000)
    return () => clearInterval(id)
  }, [])

  const current =
    sessions.find((s) => time.h >= s.startHour && time.h < s.endHour) || sessions[0]
  const isPeak = current.name.startsWith("PEAK")

  return (
    <button
      onClick={() => navigate("/timing")}
      className={`group fixed bottom-6 right-6 z-[100] bg-black/90 backdrop-blur-md border-2 ${isPeak ? "border-red-500 animate-pulse" : "border-zinc-800"} hover:border-red-500/60 rounded-full px-4 py-2.5 shadow-lg ${current.glow} hover:shadow-xl transition-all duration-300 flex items-center gap-3`}
    >
      <Icon
        name={current.icon}
        className={`${current.color} group-hover:scale-110 transition-transform`}
        size={20}
      />
      <div className="text-left">
        <div className="text-[10px] text-gray-500 uppercase leading-none">
          МСК {pad(time.h)}:{pad(time.m)}
        </div>
        <div className={`text-sm font-bold ${current.color} leading-tight`}>
          {current.name}
        </div>
      </div>
      <div className="hidden sm:block border-l border-zinc-700 pl-3 text-xs text-gray-400 font-mono">
        {current.pair}
      </div>
      <Icon
        name="ArrowRight"
        className="text-gray-500 group-hover:text-red-400 group-hover:translate-x-0.5 transition-all"
        size={14}
      />
    </button>
  )
}