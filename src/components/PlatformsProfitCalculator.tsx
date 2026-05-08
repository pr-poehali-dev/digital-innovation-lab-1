import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import Icon from "@/components/ui/icon"

type Calc = {
  name: string
  color: string
  monthlyFee: number
  tradeFeePct: number
  expectedYieldPct: number
  note: string
}

const data: Calc[] = [
  {
    name: "Pionex",
    color: "green",
    monthlyFee: 0,
    tradeFeePct: 0.05,
    expectedYieldPct: 1.5,
    note: "Бесплатно, но доходность ниже из-за ликвидности",
  },
  {
    name: "3Commas",
    color: "blue",
    monthlyFee: 37,
    tradeFeePct: 0.1,
    expectedYieldPct: 2.8,
    note: "Тариф Pro, биржевая комиссия Binance",
  },
  {
    name: "Bitsgap",
    color: "purple",
    monthlyFee: 49,
    tradeFeePct: 0.1,
    expectedYieldPct: 3.2,
    note: "Тариф Advanced, лучший GRID на боковике",
  },
]

export function PlatformsProfitCalculator() {
  const [deposit, setDeposit] = useState(1000)
  const [months, setMonths] = useState(6)
  const [tradesPerMonth, setTradesPerMonth] = useState(40)

  const results = useMemo(() => {
    return data.map((p) => {
      let balance = deposit
      let totalFees = 0
      let totalSubs = 0
      for (let m = 0; m < months; m++) {
        const monthGain = balance * (p.expectedYieldPct / 100)
        const tradeVolume = balance * tradesPerMonth
        const tradeFees = tradeVolume * (p.tradeFeePct / 100)
        balance = balance + monthGain - tradeFees - p.monthlyFee
        totalFees += tradeFees
        totalSubs += p.monthlyFee
      }
      const profit = balance - deposit
      const roi = (profit / deposit) * 100
      return {
        ...p,
        finalBalance: Math.round(balance),
        profit: Math.round(profit),
        roi: roi.toFixed(1),
        totalFees: Math.round(totalFees),
        totalSubs: Math.round(totalSubs),
      }
    })
  }, [deposit, months, tradesPerMonth])

  const winner = useMemo(() => {
    return results.reduce((max, r) => (r.profit > max.profit ? r : max), results[0])
  }, [results])

  return (
    <Card className="bg-gradient-to-br from-zinc-900 to-black border-red-500/40 mb-16">
      <CardHeader>
        <CardTitle className="font-orbitron text-2xl text-white flex items-center gap-2">
          <Icon name="Calculator" size={24} className="text-red-500" />
          Калькулятор прибыли
        </CardTitle>
        <p className="text-gray-400 text-sm mt-2">
          Прикинь, сколько заработаешь (или потеряешь) за выбранный период с учётом подписки и комиссий
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Inputs */}
        <div className="grid md:grid-cols-3 gap-6 pb-6 border-b border-zinc-800">
          <div>
            <label className="text-gray-400 text-sm font-geist mb-2 block">
              Депозит ($)
            </label>
            <Input
              type="number"
              value={deposit}
              onChange={(e) => setDeposit(Math.max(100, Number(e.target.value) || 0))}
              className="bg-zinc-800 border-zinc-700 text-white"
            />
            <Slider
              value={[deposit]}
              onValueChange={(v) => setDeposit(v[0])}
              min={100}
              max={50000}
              step={100}
              className="mt-3"
            />
          </div>

          <div>
            <label className="text-gray-400 text-sm font-geist mb-2 block">
              Период: {months} {months === 1 ? "месяц" : months < 5 ? "месяца" : "месяцев"}
            </label>
            <Slider
              value={[months]}
              onValueChange={(v) => setMonths(v[0])}
              min={1}
              max={24}
              step={1}
              className="mt-3"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>1м</span>
              <span>24м</span>
            </div>
          </div>

          <div>
            <label className="text-gray-400 text-sm font-geist mb-2 block">
              Сделок в месяц: {tradesPerMonth}
            </label>
            <Slider
              value={[tradesPerMonth]}
              onValueChange={(v) => setTradesPerMonth(v[0])}
              min={5}
              max={200}
              step={5}
              className="mt-3"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>5</span>
              <span>200</span>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="grid md:grid-cols-3 gap-4">
          {results.map((r) => {
            const isWinner = r.name === winner.name && r.profit > 0
            const isLoss = r.profit < 0
            return (
              <Card
                key={r.name}
                className={`bg-zinc-900 border-2 transition-all ${
                  isWinner
                    ? `border-${r.color}-500 shadow-lg shadow-${r.color}-500/20`
                    : `border-${r.color}-500/20`
                }`}
              >
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className={`font-orbitron text-xl text-${r.color}-400`}>{r.name}</h3>
                    {isWinner && (
                      <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded-full font-geist">
                        🏆 ТОП
                      </span>
                    )}
                  </div>

                  <div className="mb-4">
                    <p className="text-gray-500 text-xs mb-1">Итого через {months} мес.:</p>
                    <p className="text-white font-orbitron text-3xl font-bold">
                      ${r.finalBalance.toLocaleString()}
                    </p>
                  </div>

                  <div className={`mb-4 p-3 rounded-lg ${isLoss ? "bg-red-500/10" : "bg-green-500/10"}`}>
                    <p className="text-gray-500 text-xs mb-1">Чистая прибыль:</p>
                    <p className={`font-orbitron text-2xl font-bold ${isLoss ? "text-red-400" : "text-green-400"}`}>
                      {isLoss ? "" : "+"}${r.profit.toLocaleString()}
                    </p>
                    <p className={`text-sm font-geist ${isLoss ? "text-red-400" : "text-green-400"}`}>
                      ROI: {isLoss ? "" : "+"}{r.roi}%
                    </p>
                  </div>

                  <div className="space-y-2 text-sm border-t border-zinc-800 pt-3">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Подписка:</span>
                      <span className="text-red-400">−${r.totalSubs}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Комиссии:</span>
                      <span className="text-red-400">−${r.totalFees}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Доходность:</span>
                      <span className="text-white">{r.expectedYieldPct}% / мес</span>
                    </div>
                  </div>

                  <p className="text-xs text-gray-500 mt-3 italic">{r.note}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Disclaimer */}
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mt-6">
          <div className="flex gap-3">
            <Icon name="AlertTriangle" size={20} className="text-yellow-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-yellow-400 font-geist text-sm font-semibold mb-1">
                Это прогноз, а не гарантия
              </p>
              <p className="text-gray-400 text-xs leading-relaxed">
                Расчёт основан на средней доходности GRID-ботов в боковом рынке (2024–2025). При сильном падении рынка боты могут уйти в минус. Всегда тестируй стратегию на демо-режиме перед запуском реальных денег.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
