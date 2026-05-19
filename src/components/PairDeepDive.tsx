import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Icon from "@/components/ui/icon"

interface Level {
  price: string
  type: "R" | "S" | "Pivot"
  strength: "сильный" | "средний" | "слабый"
  note: string
}

interface NewsItem {
  date: string
  title: string
  impact: "high" | "medium" | "low"
  result: string
  color: string
}

interface DeepDive {
  key: "eurusd-otc" | "btc-usd"
  symbol: string
  emoji: string
  accent: string
  border: string
  glow: string
  summary: string
  currentPrice: string
  change: string
  changePositive: boolean
  bias: "Бычий" | "Медвежий" | "Нейтральный"
  biasColor: string
  levels: Level[]
  news: NewsItem[]
  scenarios: { title: string; condition: string; action: string; tone: "bull" | "bear" }[]
  metrics: { label: string; value: string; hint?: string }[]
}

const dives: DeepDive[] = [
  {
    key: "eurusd-otc",
    symbol: "EUR/USD OTC",
    emoji: "🇪🇺",
    accent: "text-red-400",
    border: "border-red-500/40",
    glow: "shadow-red-500/20",
    summary:
      "Алгоритмическая пара Pocket Option. Двигается по генерируемому ценовому потоку, копирующему Forex с задержкой ~30 сек. На выходных идёт по собственному движку. Подходит для трендовых стратегий и торговли от уровней.",
    currentPrice: "1.0842",
    change: "+0.18%",
    changePositive: true,
    bias: "Бычий",
    biasColor: "bg-green-500/20 text-green-400 border-green-500/30",
    metrics: [
      { label: "ADX (H1)", value: "32", hint: "Тренд средней силы" },
      { label: "RSI (M15)", value: "58", hint: "Зона роста, без перекупленности" },
      { label: "ATR (M5)", value: "9 pips", hint: "Стандартная вола" },
      { label: "Spread", value: "0.0", hint: "OTC без спреда" },
      { label: "Payout", value: "92%", hint: "Высокая выплата" },
      { label: "Активность", value: "24/7", hint: "Включая выходные" },
    ],
    levels: [
      { price: "1.0920", type: "R", strength: "сильный", note: "Максимум прошлой недели, тройное касание" },
      { price: "1.0880", type: "R", strength: "средний", note: "Локальное сопротивление, скопление ордеров" },
      { price: "1.0850", type: "Pivot", strength: "сильный", note: "Точка разворота дня, психологический уровень" },
      { price: "1.0820", type: "S", strength: "средний", note: "Поддержка от EMA-50 на H1" },
      { price: "1.0780", type: "S", strength: "сильный", note: "Минимум недели, ключевой уровень для лонга" },
    ],
    news: [
      {
        date: "вчера, 15:30",
        title: "Core CPI USA 0.3% (прогноз 0.3%)",
        impact: "high",
        result: "EUR/USD OTC: +35 пунктов за час. Алгоритм скопировал движение Forex с лагом 40 сек.",
        color: "bg-green-500/10 border-green-500/30",
      },
      {
        date: "позавчера, 17:00",
        title: "Решение ЕЦБ по ставке: без изменений",
        impact: "high",
        result: "Резкая свеча вниз −22 пунктов, далее откат вверх. Идеально для пробойной стратегии.",
        color: "bg-red-500/10 border-red-500/30",
      },
      {
        date: "3 дня назад",
        title: "NFP USA: 187k (прогноз 170k)",
        impact: "high",
        result: "Доллар укрепился, EUR/USD OTC ушёл с 1.0890 на 1.0810. Тренд продержался 4 часа.",
        color: "bg-red-500/10 border-red-500/30",
      },
      {
        date: "выходные",
        title: "OTC-режим (Forex закрыт)",
        impact: "medium",
        result: "Пара ходила в канале 1.0820–1.0880. Алгоритм давал чистые отбои от границ.",
        color: "bg-purple-500/10 border-purple-500/30",
      },
    ],
    scenarios: [
      {
        title: "Сценарий №1 — Лонг от поддержки",
        condition: "Цена касается 1.0820 + RSI < 40 + бычий пин-бар на M5",
        action: "Покупка call, экспирация 3–5 минут. Цель — возврат к 1.0850.",
        tone: "bull",
      },
      {
        title: "Сценарий №2 — Пробой вверх",
        condition: "Закрепление выше 1.0880 на двух свечах H1 + растущий ADX",
        action: "Call на откате к 1.0880, экспирация 10–15 минут. Цель 1.0920.",
        tone: "bull",
      },
      {
        title: "Сценарий №3 — Шорт от сопротивления",
        condition: "Касание 1.0920 + RSI > 70 + медвежья поглощающая",
        action: "Put, экспирация 5–7 минут. Цель 1.0880.",
        tone: "bear",
      },
    ],
  },
  {
    key: "btc-usd",
    symbol: "BTC/USD",
    emoji: "₿",
    accent: "text-yellow-400",
    border: "border-yellow-500/40",
    glow: "shadow-yellow-500/20",
    summary:
      "Крипта №1. Торгуется 24/7, но реальные движения и тренды формируются в часы открытия фондового рынка США (15:30–22:00 МСК). Сильно коррелирует с NASDAQ (+0.65). На Pocket Option — рабочий инструмент для тренд-стратегий и новостной торговли.",
    currentPrice: "67 420",
    change: "+1.84%",
    changePositive: true,
    bias: "Бычий",
    biasColor: "bg-green-500/20 text-green-400 border-green-500/30",
    metrics: [
      { label: "ADX (H1)", value: "36", hint: "Уверенный тренд" },
      { label: "RSI (M15)", value: "62", hint: "Бычья зона, ещё есть запас" },
      { label: "ATR (M15)", value: "$850", hint: "Высокая вола" },
      { label: "Spread", value: "$8", hint: "Норма для крипты" },
      { label: "Payout", value: "78%", hint: "Ниже Forex" },
      { label: "Funding rate", value: "+0.012%", hint: "Лонги платят шортам" },
    ],
    levels: [
      { price: "$72 000", type: "R", strength: "сильный", note: "ATH 2024, психологическая отметка" },
      { price: "$69 500", type: "R", strength: "средний", note: "Уровень consolidation последних недель" },
      { price: "$67 000", type: "Pivot", strength: "сильный", note: "Точка разворота — EMA-200 на H4" },
      { price: "$64 800", type: "S", strength: "сильный", note: "Минимум недели + объёмная зона" },
      { price: "$61 500", type: "S", strength: "сильный", note: "Гэп ликвидности, цель для шортов" },
    ],
    news: [
      {
        date: "вчера, 16:30",
        title: "Spot BTC ETF: приток $230M за день",
        impact: "high",
        result: "BTC рванул с $66 200 до $67 900 за 3 часа. Идеальный тренд для call на 15-минутках.",
        color: "bg-green-500/10 border-green-500/30",
      },
      {
        date: "вчера, 21:00",
        title: "FOMC Minutes: ястребиная риторика",
        impact: "high",
        result: "BTC откатился с $68 000 до $66 800. Резкая свеча — стопы и ликвидации.",
        color: "bg-red-500/10 border-red-500/30",
      },
      {
        date: "3 дня назад",
        title: "Hashrate обновил ATH (700 EH/s)",
        impact: "medium",
        result: "Среднесрочно бычий сигнал. Кратковременная реакция в виде роста на 1.2%.",
        color: "bg-green-500/10 border-green-500/30",
      },
      {
        date: "неделя",
        title: "Halving + ETF flows = новый цикл",
        impact: "high",
        result: "Структурный бычий драйвер. Тренд H4 устойчиво вверх, откаты выкупаются.",
        color: "bg-green-500/10 border-green-500/30",
      },
    ],
    scenarios: [
      {
        title: "Сценарий №1 — Покупка от Pivot",
        condition: "Касание $67 000 + бычья дивергенция по RSI + рост объёмов",
        action: "Call, экспирация 15 минут. Цель — возврат к $69 500.",
        tone: "bull",
      },
      {
        title: "Сценарий №2 — Пробой ATH",
        condition: "Закрепление выше $72 000 на дневке + Funding < 0.02%",
        action: "Тренд-следование. Call на откатах к $72 000, экспирация 30 минут–1 час.",
        tone: "bull",
      },
      {
        title: "Сценарий №3 — Шорт на ликвидацию",
        condition: "Отбой от $69 500 + перегретый Funding + RSI > 75",
        action: "Put на M15, цель $67 000. Стоп выше $70 000 (для CFD).",
        tone: "bear",
      },
    ],
  },
]

export function PairDeepDive() {
  const [active, setActive] = useState<DeepDive["key"]>("eurusd-otc")
  const dive = dives.find((d) => d.key === active)!

  return (
    <section className="mb-20">
      <h2 className="font-orbitron text-3xl font-bold text-white mb-2 flex items-center gap-3">
        <Icon name="Microscope" className="text-red-500" /> Разбор пар: EUR/USD OTC и BTC/USD
      </h2>
      <p className="text-gray-400 mb-6">
        Уровни поддержки и сопротивления, свежие новости и сценарии работы. Обновлено по последним торговым дням.
      </p>

      {/* Переключатель пар */}
      <div className="flex gap-2 mb-6">
        {dives.map((d) => (
          <Button
            key={d.key}
            onClick={() => setActive(d.key)}
            className={
              active === d.key
                ? "bg-red-500 hover:bg-red-600 text-white"
                : "bg-zinc-800 hover:bg-zinc-700 text-gray-300 border border-zinc-700"
            }
          >
            <span className="mr-2">{d.emoji}</span>
            {d.symbol}
          </Button>
        ))}
      </div>

      {/* Шапка пары */}
      <Card className={`bg-gradient-to-br from-zinc-900/80 via-black to-zinc-900/40 border-2 ${dive.border} ${dive.glow} shadow-xl mb-6`}>
        <CardContent className="p-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <div className="flex items-baseline gap-3 mb-2">
                <span className="font-orbitron text-3xl font-bold text-white">{dive.symbol}</span>
                <Badge className={dive.biasColor}>{dive.bias} bias</Badge>
              </div>
              <div className="flex items-baseline gap-3 mb-4">
                <span className="font-mono text-4xl font-bold text-white">{dive.currentPrice}</span>
                <span className={`font-mono text-lg ${dive.changePositive ? "text-green-400" : "text-red-400"}`}>
                  {dive.changePositive ? "▲" : "▼"} {dive.change}
                </span>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed">{dive.summary}</p>
            </div>

            {/* Метрики */}
            <div className="grid grid-cols-2 gap-2">
              {dive.metrics.map((m) => (
                <div key={m.label} className="bg-black/40 border border-zinc-800 rounded p-3">
                  <div className="text-[10px] text-gray-500 uppercase mb-1">{m.label}</div>
                  <div className={`font-mono text-lg font-bold ${dive.accent}`}>{m.value}</div>
                  {m.hint && <div className="text-[10px] text-gray-500 mt-1">{m.hint}</div>}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Уровни */}
      <Card className="bg-zinc-900/50 border-zinc-800 border-2 mb-6">
        <CardContent className="p-6">
          <h3 className="font-orbitron text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Icon name="LineChart" className={dive.accent} size={22} />
            Уровни поддержки и сопротивления
          </h3>
          <div className="space-y-2">
            {dive.levels.map((lvl, i) => {
              const isR = lvl.type === "R"
              const isP = lvl.type === "Pivot"
              return (
                <div
                  key={i}
                  className={`grid grid-cols-12 gap-3 items-center p-3 rounded border ${
                    isR ? "bg-red-500/5 border-red-500/20" :
                    isP ? "bg-yellow-500/5 border-yellow-500/20" :
                    "bg-green-500/5 border-green-500/20"
                  }`}
                >
                  <div className="col-span-3 md:col-span-2 font-mono font-bold text-white text-lg">
                    {lvl.price}
                  </div>
                  <div className="col-span-3 md:col-span-2">
                    <Badge className={
                      isR ? "bg-red-500/20 text-red-400 border-red-500/40" :
                      isP ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/40" :
                      "bg-green-500/20 text-green-400 border-green-500/40"
                    }>
                      {isR ? "Сопротивление" : isP ? "Pivot" : "Поддержка"}
                    </Badge>
                  </div>
                  <div className="col-span-3 md:col-span-2 text-xs text-gray-400">
                    {lvl.strength}
                  </div>
                  <div className="col-span-12 md:col-span-6 text-sm text-gray-300">
                    {lvl.note}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Новости */}
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

      {/* Сценарии */}
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
    </section>
  )
}
