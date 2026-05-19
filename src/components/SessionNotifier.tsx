import { useEffect, useRef } from "react"
import { toast } from "sonner"
import { useNavigate } from "react-router-dom"

interface SessionEvent {
  startHour: number
  startMinute: number
  title: string
  description: string
  emoji: string
  pair: string
  isPeak?: boolean
}

const events: SessionEvent[] = [
  {
    startHour: 10,
    startMinute: 0,
    title: "Открытие Лондона",
    description: "Европейская сессия. Лучшее время для тренда по EUR/USD",
    emoji: "🇪🇺",
    pair: "EUR/USD",
  },
  {
    startHour: 15,
    startMinute: 0,
    title: "PEAK-сессия началась!",
    description: "США + Европа. Пик волатильности. EUR/USD и BTC/USD в огне!",
    emoji: "🔥",
    pair: "EUR/USD, BTC/USD",
    isPeak: true,
  },
  {
    startHour: 15,
    startMinute: 30,
    title: "Новости по USD",
    description: "Осторожно! Большие свечи. Подожди 15 минут перед входом",
    emoji: "⚠️",
    pair: "EUR/USD",
  },
  {
    startHour: 19,
    startMinute: 0,
    title: "Крипта оживает",
    description: "Американская сессия. BTC/USD тянется за NASDAQ",
    emoji: "₿",
    pair: "BTC/USD",
  },
  {
    startHour: 0,
    startMinute: 0,
    title: "OTC-режим включён",
    description: "Forex закрыт. EUR/USD OTC ходит по алгоритму брокера",
    emoji: "🌙",
    pair: "EUR/USD OTC",
  },
]

function getMoscowDate() {
  const now = new Date()
  const utc = now.getTime() + now.getTimezoneOffset() * 60000
  return new Date(utc + 3 * 3600000)
}

const STORAGE_KEY = "tradebase_last_session_notif"

export function SessionNotifier() {
  const navigate = useNavigate()
  const checkedRef = useRef<Set<string>>(new Set())

  useEffect(() => {
    const check = () => {
      const msk = getMoscowDate()
      const h = msk.getHours()
      const m = msk.getMinutes()
      const dateKey = `${msk.getFullYear()}-${msk.getMonth()}-${msk.getDate()}`

      // Загрузим уже показанные за сегодня
      let shownToday: string[] = []
      try {
        const raw = localStorage.getItem(STORAGE_KEY)
        if (raw) {
          const parsed = JSON.parse(raw)
          if (parsed.date === dateKey) shownToday = parsed.shown || []
        }
      } catch {
        // ignore
      }

      events.forEach((ev) => {
        const key = `${ev.startHour}:${ev.startMinute}`
        if (shownToday.includes(key)) return
        if (checkedRef.current.has(key)) return

        // Окно — в течение 2 минут после начала события
        const eventTotal = ev.startHour * 60 + ev.startMinute
        const nowTotal = h * 60 + m
        const diff = nowTotal - eventTotal

        if (diff >= 0 && diff <= 2) {
          checkedRef.current.add(key)
          shownToday.push(key)
          localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify({ date: dateKey, shown: shownToday })
          )

          toast(`${ev.emoji} ${ev.title}`, {
            description: `${ev.description} · ${ev.pair}`,
            duration: ev.isPeak ? 15000 : 8000,
            action: {
              label: "Открыть",
              onClick: () => navigate("/timing"),
            },
            className: ev.isPeak ? "border-red-500/50" : "",
          })

          // Виброотклик на мобиле + звуковой бип через WebAudio
          if (ev.isPeak) {
            if (navigator.vibrate) navigator.vibrate([100, 50, 100, 50, 200])
            try {
              const ctx = new (window.AudioContext ||
                (window as unknown as { webkitAudioContext: typeof AudioContext })
                  .webkitAudioContext)()
              const osc = ctx.createOscillator()
              const gain = ctx.createGain()
              osc.connect(gain)
              gain.connect(ctx.destination)
              osc.frequency.value = 880
              gain.gain.setValueAtTime(0.15, ctx.currentTime)
              gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6)
              osc.start()
              osc.stop(ctx.currentTime + 0.6)
            } catch {
              // ignore
            }
          }
        }
      })
    }

    check()
    const id = setInterval(check, 30000)
    return () => clearInterval(id)
  }, [navigate])

  return null
}
