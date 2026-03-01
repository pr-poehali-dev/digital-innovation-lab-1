import type { PracticeStep } from "./practiceStepTypes"

// ─────────────────────────────────────────────────────────────
// Визуал 1: Симуляция депозита при разных % ставки
// ─────────────────────────────────────────────────────────────
const DepositSimulation = () => {
  const scenarios = [
    { pct: 2, label: "2% (правило)", color: "#22c55e", bg: "bg-green-500/10", border: "border-green-500/30" },
    { pct: 5, label: "5% (агрессивно)", color: "#eab308", bg: "bg-yellow-500/10", border: "border-yellow-500/30" },
    { pct: 10, label: "10% (слив)", color: "#ef4444", bg: "bg-red-500/10", border: "border-red-500/30" },
  ]

  const calcDepositAfterLosses = (pct: number, losses: number) => {
    let d = 1000
    for (let i = 0; i < losses; i++) d -= d * (pct / 100)
    return Math.round(d)
  }

  const losses = [0, 1, 2, 3, 5, 7, 10]

  return (
    <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4">
      <div className="font-orbitron text-xs font-bold text-zinc-400 mb-4">
        Депозит $1,000 после N проигрышей подряд
      </div>

      {/* Bar chart */}
      <div className="space-y-4">
        {scenarios.map((s) => (
          <div key={s.pct}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-orbitron font-bold" style={{ color: s.color }}>{s.label}</span>
            </div>
            <div className="flex items-end gap-1 h-16">
              {losses.map((n) => {
                const val = calcDepositAfterLosses(s.pct, n)
                const heightPct = Math.max(2, (val / 1000) * 100)
                return (
                  <div key={n} className="flex-1 flex flex-col items-center justify-end gap-1">
                    <span className="text-[9px] font-space-mono text-zinc-500">${val}</span>
                    <div
                      className="w-full rounded-t-sm"
                      style={{ height: `${heightPct}%`, backgroundColor: s.color, opacity: 0.8 }}
                    />
                    <span className="text-[9px] font-space-mono text-zinc-600">{n}x</span>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>
      <p className="text-zinc-600 text-[10px] font-space-mono mt-3">
        Ось X: количество проигрышей подряд. Ось Y: остаток депозита.
      </p>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// Визуал 2: Timeline торгового дня
// ─────────────────────────────────────────────────────────────
const DayTimeline = () => {
  const events = [
    {
      time: "09:00",
      label: "Старт дня",
      desc: "Открываем платформу, проверяем новости",
      type: "neutral",
      balance: "$1,000",
    },
    {
      time: "09:30",
      label: "Сделка 1 — PUT",
      desc: "EMA нисходящая + RSI 71 → сигнал",
      type: "win",
      balance: "$1,016",
    },
    {
      time: "10:15",
      label: "Сделка 2 — CALL",
      desc: "Сигнал ложный — волатильность после новостей",
      type: "loss",
      balance: "$996",
    },
    {
      time: "11:00",
      label: "Сделка 3 — PUT",
      desc: "Чистый сигнал на M5 — сильное сопротивление",
      type: "win",
      balance: "$1,013",
    },
    {
      time: "11:45",
      label: "Сделка 4 — PUT",
      desc: "Тренд продолжается, confluence 3/3",
      type: "loss",
      balance: "$993",
    },
    {
      time: "12:30",
      label: "Сделка 5 — CALL",
      desc: "Слабый сигнал, но руки зачесались...",
      type: "loss",
      balance: "$973",
    },
    {
      time: "12:50",
      label: "🛑 Стоп! -6%",
      desc: "Дневной лимит сработал. Закрываем Pocket Option",
      type: "stop",
      balance: "$940",
    },
  ]

  const typeStyle: Record<string, { dot: string; text: string; card: string }> = {
    neutral: { dot: "bg-zinc-500", text: "text-zinc-400", card: "border-zinc-700 bg-zinc-900" },
    win: { dot: "bg-green-500", text: "text-green-400", card: "border-green-500/30 bg-green-500/5" },
    loss: { dot: "bg-red-500", text: "text-red-400", card: "border-red-500/30 bg-red-500/5" },
    stop: { dot: "bg-orange-500", text: "text-orange-400", card: "border-orange-500/40 bg-orange-500/10" },
  }

  return (
    <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4">
      <div className="font-orbitron text-xs font-bold text-zinc-400 mb-4">
        Типичный торговый день: когда стоп спасает депозит
      </div>
      <div className="relative">
        <div className="absolute left-[5.5rem] top-0 bottom-0 w-px bg-zinc-800" />
        <div className="space-y-3">
          {events.map((e, i) => {
            const s = typeStyle[e.type]
            return (
              <div key={i} className="flex gap-3 items-start">
                <span className="text-[10px] font-space-mono text-zinc-500 w-16 shrink-0 pt-2 text-right">{e.time}</span>
                <div className="relative flex items-start gap-2 pl-4">
                  <div className={`absolute left-0 top-2 w-2.5 h-2.5 rounded-full border-2 border-zinc-950 ${s.dot} z-10`} />
                  <div className={`rounded-lg border px-3 py-2 ${s.card}`}>
                    <div className={`text-xs font-orbitron font-bold ${s.text} mb-0.5 flex items-center justify-between gap-4`}>
                      <span>{e.label}</span>
                      <span className="text-white font-space-mono">{e.balance}</span>
                    </div>
                    <p className="text-zinc-500 text-[10px] font-space-mono">{e.desc}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// Визуал 3: Заполненный журнал трейдера за неделю
// ─────────────────────────────────────────────────────────────
const TraderJournal = () => {
  const trades = [
    {
      date: "Пн 24.02",
      time: "10:40",
      asset: "BTC/USD M5",
      dir: "PUT",
      signals: "EMA ↓ + RSI 72 + сопр. $96,580",
      stake: "$20",
      result: "win",
      pnl: "+$16.40",
    },
    {
      date: "Пн 24.02",
      time: "14:15",
      asset: "BTC/USD M5",
      dir: "CALL",
      signals: "EMA ↑ + RSI 38 + поддержка $95,200",
      stake: "$20",
      result: "loss",
      pnl: "-$20.00",
    },
    {
      date: "Вт 25.02",
      time: "09:55",
      asset: "BTC/USD M5",
      dir: "CALL",
      signals: "EMA ↑ + RSI 42 + отбой от MA50",
      stake: "$20",
      result: "win",
      pnl: "+$16.40",
    },
    {
      date: "Ср 26.02",
      time: "11:30",
      asset: "BTC/USD M5",
      dir: "PUT",
      signals: "EMA ↓ + RSI 69 — слабый сигнал",
      stake: "$20",
      result: "loss",
      pnl: "-$20.00",
    },
    {
      date: "Чт 27.02",
      time: "15:00",
      asset: "BTC/USD M5",
      dir: "PUT",
      signals: "EMA ↓ + RSI 74 + сопр. $97,100 + объём",
      stake: "$20",
      result: "win",
      pnl: "+$16.40",
    },
    {
      date: "Пт 28.02",
      time: "10:20",
      asset: "BTC/USD M5",
      dir: "CALL",
      signals: "EMA ↑ + RSI 35 + поддержка $94,800",
      stake: "$20",
      result: "win",
      pnl: "+$16.40",
    },
  ]

  const totalPnl = trades.reduce((acc, t) => acc + parseFloat(t.pnl.replace(/\$|\+/g, "")), 0)
  const wins = trades.filter((t) => t.result === "win").length

  return (
    <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4">
      <div className="font-orbitron text-xs font-bold text-zinc-400 mb-3 flex items-center justify-between">
        <span>Журнал трейдера — неделя 24–28 февраля</span>
        <span className={`${totalPnl >= 0 ? "text-green-400" : "text-red-400"}`}>
          {totalPnl >= 0 ? "+" : ""}${totalPnl.toFixed(2)}
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-[10px] font-space-mono border-collapse">
          <thead>
            <tr className="border-b border-zinc-800">
              {["Дата", "Время", "Актив", "Направл.", "Сигналы", "Ставка", "PnL"].map((h) => (
                <th key={h} className="text-left text-zinc-600 font-bold pb-2 pr-3 whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {trades.map((t, i) => (
              <tr key={i} className="border-b border-zinc-900 hover:bg-zinc-900/50 transition-colors">
                <td className="py-1.5 pr-3 text-zinc-500 whitespace-nowrap">{t.date}</td>
                <td className="py-1.5 pr-3 text-zinc-400 whitespace-nowrap">{t.time}</td>
                <td className="py-1.5 pr-3 text-zinc-300 whitespace-nowrap">{t.asset}</td>
                <td className={`py-1.5 pr-3 font-bold whitespace-nowrap ${t.dir === "PUT" ? "text-red-400" : "text-green-400"}`}>{t.dir}</td>
                <td className="py-1.5 pr-3 text-zinc-500 max-w-[160px]">{t.signals}</td>
                <td className="py-1.5 pr-3 text-white whitespace-nowrap">{t.stake}</td>
                <td className={`py-1.5 font-bold whitespace-nowrap ${t.result === "win" ? "text-green-400" : "text-red-400"}`}>{t.pnl}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-3 pt-3 border-t border-zinc-800 flex gap-6">
        <div>
          <span className="text-zinc-600 text-[10px] font-space-mono">Сделок</span>
          <div className="text-white text-sm font-orbitron font-bold">{trades.length}</div>
        </div>
        <div>
          <span className="text-zinc-600 text-[10px] font-space-mono">Win Rate</span>
          <div className="text-green-400 text-sm font-orbitron font-bold">{Math.round((wins / trades.length) * 100)}%</div>
        </div>
        <div>
          <span className="text-zinc-600 text-[10px] font-space-mono">Итог недели</span>
          <div className={`text-sm font-orbitron font-bold ${totalPnl >= 0 ? "text-green-400" : "text-red-400"}`}>
            {totalPnl >= 0 ? "+" : ""}${totalPnl.toFixed(2)}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// Визуал 4: DCA — визуальный график покупок + средняя цена
// ─────────────────────────────────────────────────────────────
const DcaChart = () => {
  const weeks = [
    { label: "Нед. 1", price: 94000, amount: 100 },
    { label: "Нед. 2", price: 91000, amount: 100 },
    { label: "Нед. 3", price: 96500, amount: 100 },
    { label: "Нед. 4", price: 98000, amount: 100 },
    { label: "Нед. 5", price: 89500, amount: 100 },
    { label: "Нед. 6", price: 92000, amount: 100 },
    { label: "Нед. 7", price: 100000, amount: 100 },
    { label: "Нед. 8", price: 97000, amount: 100 },
  ]

  const minP = Math.min(...weeks.map((w) => w.price))
  const maxP = Math.max(...weeks.map((w) => w.price))
  const range = maxP - minP

  const totalBtc = weeks.reduce((acc, w) => acc + w.amount / w.price, 0)
  const totalUsd = weeks.reduce((acc, w) => acc + w.amount, 0)
  const avgPrice = totalUsd / totalBtc

  const currentPrice = weeks[weeks.length - 1].price
  const portfolioValue = totalBtc * currentPrice
  const pnl = portfolioValue - totalUsd

  return (
    <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4">
      <div className="font-orbitron text-xs font-bold text-zinc-400 mb-4">
        DCA на BTC: $100 каждую неделю × 8 недель
      </div>

      {/* Chart */}
      <div className="flex items-end gap-2 h-28 mb-1">
        {weeks.map((w, i) => {
          const barH = Math.max(15, ((w.price - minP) / range) * 80 + 20)
          const isAboveAvg = w.price > avgPrice
          return (
            <div key={i} className="flex-1 flex flex-col items-center justify-end gap-1 relative group">
              {/* Tooltip */}
              <div className="absolute bottom-full mb-1 opacity-0 group-hover:opacity-100 transition-opacity bg-zinc-800 border border-zinc-700 rounded px-2 py-1 text-[9px] font-space-mono text-white whitespace-nowrap z-10 pointer-events-none">
                ${(w.price / 1000).toFixed(1)}K
              </div>
              <div
                className={`w-full rounded-t-sm transition-all ${isAboveAvg ? "bg-purple-500/70" : "bg-blue-500/70"}`}
                style={{ height: `${barH}%` }}
              />
              <span className="text-[8px] font-space-mono text-zinc-600">{w.label}</span>
            </div>
          )
        })}
      </div>

      {/* Avg line label */}
      <div className="flex items-center gap-2 mb-3">
        <div className="w-6 h-px border-t-2 border-dashed border-yellow-400" />
        <span className="text-yellow-400 text-[10px] font-space-mono">
          Средняя цена покупки: ${Math.round(avgPrice).toLocaleString()}
        </span>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-2 mt-2">
        <div className="bg-zinc-900 rounded-lg p-2 text-center">
          <div className="text-zinc-500 text-[9px] font-space-mono mb-1">Вложено</div>
          <div className="text-white text-xs font-orbitron font-bold">${totalUsd}</div>
        </div>
        <div className="bg-zinc-900 rounded-lg p-2 text-center">
          <div className="text-zinc-500 text-[9px] font-space-mono mb-1">BTC куплено</div>
          <div className="text-purple-400 text-xs font-orbitron font-bold">{totalBtc.toFixed(5)}</div>
        </div>
        <div className="bg-zinc-900 rounded-lg p-2 text-center">
          <div className="text-zinc-500 text-[9px] font-space-mono mb-1">Прибыль</div>
          <div className={`text-xs font-orbitron font-bold ${pnl >= 0 ? "text-green-400" : "text-red-400"}`}>
            {pnl >= 0 ? "+" : ""}${Math.round(pnl)}
          </div>
        </div>
      </div>
      <p className="text-zinc-600 text-[9px] font-space-mono mt-2">
        Синие = ниже средней цены, фиолетовые = выше средней цены
      </p>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// Визуал 5: Grid-бот — схема сетки ордеров
// ─────────────────────────────────────────────────────────────
const GridBotVisual = () => {
  const rangeMin = 93000
  const rangeMax = 99000
  const step = 1000
  const levels = []
  for (let p = rangeMax; p >= rangeMin; p -= step) levels.push(p)

  const currentPrice = 95500

  return (
    <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4">
      <div className="font-orbitron text-xs font-bold text-zinc-400 mb-4 flex items-center justify-between">
        <span>Grid-бот: сетка ордеров BTC/USD</span>
        <span className="text-yellow-400 font-space-mono text-xs">${currentPrice.toLocaleString()} ← текущая цена</span>
      </div>

      <div className="space-y-1">
        {levels.map((price) => {
          const isCurrent = Math.abs(price - currentPrice) < 500
          const isAbove = price > currentPrice
          const isBoundary = price === rangeMax || price === rangeMin

          return (
            <div
              key={price}
              className={`flex items-center gap-2 rounded-lg px-3 py-1.5 border transition-all ${
                isBoundary
                  ? "border-orange-500/50 bg-orange-500/10"
                  : isCurrent
                  ? "border-yellow-400/60 bg-yellow-400/10"
                  : isAbove
                  ? "border-red-500/20 bg-red-500/5"
                  : "border-green-500/20 bg-green-500/5"
              }`}
            >
              <span className={`text-xs font-space-mono font-bold w-24 ${isBoundary ? "text-orange-400" : isCurrent ? "text-yellow-400" : "text-zinc-300"}`}>
                ${price.toLocaleString()}
              </span>

              {isBoundary ? (
                <span className="text-orange-400 text-[10px] font-orbitron">
                  {price === rangeMax ? "▲ Верхняя граница — стоп" : "▼ Нижняя граница — стоп"}
                </span>
              ) : isCurrent ? (
                <span className="text-yellow-400 text-[10px] font-orbitron">◉ Текущая цена</span>
              ) : isAbove ? (
                <div className="flex items-center gap-3">
                  <span className="text-red-400 text-[10px] font-space-mono">SELL ордер</span>
                  <div className="w-16 h-1.5 bg-red-500/40 rounded-full">
                    <div className="h-full bg-red-400 rounded-full" style={{ width: "70%" }} />
                  </div>
                  <span className="text-zinc-500 text-[10px] font-space-mono">+0.5% прибыли</span>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <span className="text-green-400 text-[10px] font-space-mono">BUY ордер</span>
                  <div className="w-16 h-1.5 bg-green-500/40 rounded-full">
                    <div className="h-full bg-green-400 rounded-full" style={{ width: "70%" }} />
                  </div>
                  <span className="text-zinc-500 text-[10px] font-space-mono">ждёт падения</span>
                </div>
              )}
            </div>
          )
        })}
      </div>

      <div className="mt-3 pt-3 border-t border-zinc-800 grid grid-cols-3 gap-2 text-center">
        <div>
          <div className="text-zinc-600 text-[9px] font-space-mono">Уровней</div>
          <div className="text-white text-sm font-orbitron font-bold">{levels.length}</div>
        </div>
        <div>
          <div className="text-zinc-600 text-[9px] font-space-mono">Шаг сетки</div>
          <div className="text-purple-400 text-sm font-orbitron font-bold">$1,000</div>
        </div>
        <div>
          <div className="text-zinc-600 text-[9px] font-space-mono">Прибыль/шаг</div>
          <div className="text-green-400 text-sm font-orbitron font-bold">~0.5%</div>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// Визуал 6: Бот vs Человек — сравнительная инфографика
// ─────────────────────────────────────────────────────────────
const BotVsHumanChart = () => {
  const metrics = [
    { label: "Скорость реакции", bot: 100, human: 15, unit: "мс vs секунды" },
    { label: "Дисциплина правил", bot: 100, human: 65, unit: "% соблюдения" },
    { label: "Работа 24/7", bot: 100, human: 25, unit: "доступность" },
    { label: "Адаптация к рынку", bot: 30, human: 90, unit: "гибкость" },
    { label: "Реакция на новости", bot: 10, human: 85, unit: "понимание" },
  ]

  return (
    <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4">
      <div className="font-orbitron text-xs font-bold text-zinc-400 mb-4">
        Бот vs Человек: сравнительный анализ навыков
      </div>

      <div className="flex items-center gap-4 mb-3">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm bg-purple-500/70" />
          <span className="text-[10px] font-space-mono text-zinc-400">Бот</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm bg-blue-500/70" />
          <span className="text-[10px] font-space-mono text-zinc-400">Человек</span>
        </div>
      </div>

      <div className="space-y-3">
        {metrics.map((m, i) => (
          <div key={i}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-space-mono text-zinc-400">{m.label}</span>
              <span className="text-[9px] font-space-mono text-zinc-600">{m.unit}</span>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[9px] text-purple-400 w-8 text-right font-space-mono shrink-0">{m.bot}%</span>
                <div className="flex-1 h-3 bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-purple-500/70 rounded-full transition-all"
                    style={{ width: `${m.bot}%` }}
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[9px] text-blue-400 w-8 text-right font-space-mono shrink-0">{m.human}%</span>
                <div className="flex-1 h-3 bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500/70 rounded-full transition-all"
                    style={{ width: `${m.human}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// Экспорты степов
// ─────────────────────────────────────────────────────────────

export const stepRiskManagement: PracticeStep = {
  id: "risk-management",
  badge: "Шаг 3",
  color: "red",
  icon: "Shield",
  title: "Риск-менеджмент: сколько ставить на сделку",
  summary: "Правила управления капиталом на Pocket Option. Без этого даже 70% правильных сигналов превращаются в слив депозита.",
  sections: [
    {
      title: "Правило 2% на Pocket Option",
      content: (
        <div className="space-y-3">
          <p className="text-gray-300 leading-relaxed">
            На бинарных опционах риск на сделку = размер ставки (при проигрыше теряем всю ставку).
            Поэтому <span className="text-red-400 font-semibold">правило 1–2% критично</span> как нигде.
          </p>
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4">
            <div className="space-y-3">
              {[
                { deposit: "$1,000", pct: "2%", stake: "$20", label: "Рекомендуемый старт" },
                { deposit: "$1,000", pct: "5%", stake: "$50", label: "Агрессивно — риск слива" },
                { deposit: "$1,000", pct: "10%", stake: "$100", label: "Слив за 10 проигрышей" },
              ].map((row, i) => (
                <div key={i} className={`flex items-center gap-3 p-2 rounded-lg border ${i === 0 ? "bg-green-500/10 border-green-500/30" : i === 1 ? "bg-yellow-500/10 border-yellow-500/30" : "bg-red-500/10 border-red-500/30"}`}>
                  <div className={`text-xs font-space-mono w-4 ${i === 0 ? "text-green-400" : i === 1 ? "text-yellow-400" : "text-red-400"}`}>
                    {i === 0 ? "✓" : "✗"}
                  </div>
                  <div className="flex-1 text-xs font-space-mono text-zinc-300">
                    Депозит {row.deposit} × {row.pct} = <span className="font-bold text-white">{row.stake}</span> ставка
                  </div>
                  <div className={`text-xs font-orbitron ${i === 0 ? "text-green-400" : i === 1 ? "text-yellow-400" : "text-red-400"}`}>{row.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Визуальная симуляция */}
          <DepositSimulation />

          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
            <div className="text-red-400 font-orbitron text-xs font-bold mb-2">Математика выживания на Pocket Option</div>
            <p className="text-zinc-400 text-xs font-space-mono leading-relaxed">
              При 2% ставке: 10 проигрышей подряд = -18.3% депозита. Можно восстановиться.<br />
              При 10% ставке: 10 проигрышей подряд = -65.1% депозита. Восстановиться крайне сложно.<br />
              <span className="text-white">Серия из 10 проигрышей при 55% Win Rate встречается в 0.25% случаев — это реально.</span>
            </p>
          </div>

          <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
            <div className="text-blue-400 font-orbitron text-xs font-bold mb-2">Из жизни: правило 2% от Эда Сейкоты</div>
            <p className="text-zinc-300 text-xs font-space-mono leading-relaxed">
              Эд Сейкота — трейдер-легенда, превративший $5,000 в $15 млн за 12 лет — публично говорил,
              что управление риском важнее любой стратегии входа: «Долгосрочное выживание полностью зависит от размера позиции».
              Он никогда не рисковал более чем 2–3% на одну сделку, даже в периоды максимальной уверенности.
              Именно это позволило ему пережить десятки кризисов без серьёзных потерь капитала.
            </p>
          </div>
        </div>
      ),
    },
    {
      title: "Дневной лимит: когда останавливаться",
      content: (
        <div className="space-y-3">
          <p className="text-gray-300 leading-relaxed">
            Даже с правильной стратегией бывают плохие дни. <span className="text-yellow-400 font-semibold">Дневной стоп-лосс</span> защищает от эмоциональных решений.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-zinc-900 border border-red-500/30 rounded-xl p-4">
              <div className="text-red-400 font-orbitron text-xs font-bold mb-3">Дневной Stop Loss</div>
              <div className="text-3xl font-orbitron font-bold text-red-400 mb-2">-6%</div>
              <p className="text-zinc-400 text-xs font-space-mono leading-relaxed">
                Потеряли 3 ставки по 2% → стоп. Закрываем платформу до следующего дня. Без исключений.
              </p>
            </div>
            <div className="bg-zinc-900 border border-green-500/30 rounded-xl p-4">
              <div className="text-green-400 font-orbitron text-xs font-bold mb-3">Дневной Take Profit</div>
              <div className="text-3xl font-orbitron font-bold text-green-400 mb-2">+10%</div>
              <p className="text-zinc-400 text-xs font-space-mono leading-relaxed">
                Заработали 10% за день → тоже стоп. Жадность убивает прибыль. Фиксируем и уходим.
              </p>
            </div>
          </div>

          {/* Визуальный timeline дня */}
          <DayTimeline />

          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
            <div className="text-yellow-400 font-orbitron text-xs font-bold mb-2">Из жизни: правило Джорджа Сороса о потерях</div>
            <p className="text-zinc-300 text-xs font-space-mono leading-relaxed">
              Джордж Сорос — один из самых богатых трейдеров в истории — имел жёсткое правило:
              если он чувствовал, что «не в форме» или рынок ведёт себя непредсказуемо, он просто переставал торговать.
              «Не важно, правы вы или нет. Важно, сколько вы зарабатываете, когда правы, и сколько теряете, когда ошибаетесь».
              Дневной лимит — это формализация того же принципа: плохой день заканчиваем заранее.
            </p>
          </div>
        </div>
      ),
    },
    {
      title: "Журнал трейдера: как его вести",
      content: (
        <div className="space-y-3">
          <p className="text-gray-300 leading-relaxed">
            Журнал сделок — инструмент №1 для роста. Без него невозможно понять, что работает, а что нет.
          </p>
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4">
            <div className="font-orbitron text-xs font-bold text-zinc-400 mb-3">Минимальная запись после каждой сделки</div>
            <div className="space-y-2">
              {[
                { field: "Дата/время", example: "28.02.2026, 14:40", color: "text-blue-400" },
                { field: "Инструмент", example: "BTC/USD, M5", color: "text-purple-400" },
                { field: "Направление", example: "PUT", color: "text-red-400" },
                { field: "Сигналы", example: "EMA нисход. + сопротивление $96,580 + RSI 68", color: "text-yellow-400" },
                { field: "Ставка", example: "$20 (2% от $1,000)", color: "text-green-400" },
                { field: "Результат", example: "Выигрыш / Проигрыш / сумма", color: "text-zinc-400" },
              ].map((row, i) => (
                <div key={i} className="flex gap-2 items-center">
                  <span className={`text-xs font-orbitron w-28 shrink-0 ${row.color}`}>{row.field}:</span>
                  <span className="text-xs font-space-mono text-zinc-400">{row.example}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Живой пример заполненного журнала */}
          <TraderJournal />

          <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4">
            <div className="text-purple-400 font-orbitron text-xs font-bold mb-2">Из жизни: журнал Ливермора и Далио</div>
            <p className="text-zinc-300 text-xs font-space-mono leading-relaxed">
              Джесси Ливермор — трейдер начала XX века, сделавший состояние на «чёрный четверг» 1929 года — вёл детальные дневники каждой сделки.
              Рэй Далио, основатель Bridgewater Associates (крупнейший хедж-фонд в мире), до сих пор фиксирует гипотезы и их результаты.
              Он называет это «петлёй обратной связи»: без записей ты не можешь учиться, потому что память субъективна — мозг «забывает» ошибки.
              Ведение журнала — это то, что отличает профессионала от любителя на любом рынке.
            </p>
          </div>
        </div>
      ),
    },
  ],
}

export const stepBotAutomation: PracticeStep = {
  id: "bot-automation",
  badge: "Шаг 4",
  color: "purple",
  icon: "Bot",
  title: "Автоматизация: когда нужен торговый бот",
  summary: "Боты убирают эмоции из торговли и работают 24/7. Но они решают только часть задач — понимание рынка остаётся за человеком.",
  sections: [
    {
      title: "Бот vs ручная торговля: что выбрать",
      content: (
        <div className="space-y-3">
          <p className="text-gray-300 leading-relaxed">
            Бот — это инструмент, а не волшебная кнопка. Он хорош там, где нужна дисциплина и скорость реакции.
            Плох там, где нужно принимать нестандартные решения.
          </p>

          {/* Визуальный сравнительный график */}
          <BotVsHumanChart />

          <div className="space-y-2">
            {[
              {
                aspect: "Эмоции",
                bot: "Торгует по правилам без страха и жадности",
                human: "Может нарушить правила под давлением рынка",
                winner: "bot",
              },
              {
                aspect: "Скорость",
                bot: "Реагирует за миллисекунды",
                human: "Анализирует 5–30 секунд перед входом",
                winner: "bot",
              },
              {
                aspect: "Адаптация",
                bot: "Не видит смену рыночного режима",
                human: "Может подстроиться под новые условия",
                winner: "human",
              },
              {
                aspect: "Режим 24/7",
                bot: "Работает постоянно без перерывов",
                human: "Устаёт, теряет концентрацию",
                winner: "bot",
              },
            ].map((row, i) => (
              <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-lg p-3">
                <div className="text-zinc-400 font-orbitron text-xs mb-2">{row.aspect}</div>
                <div className="grid grid-cols-2 gap-2">
                  <div className={`text-xs font-space-mono p-2 rounded ${row.winner === "bot" ? "bg-purple-500/20 text-purple-300" : "bg-zinc-800 text-zinc-400"}`}>
                    <span className="font-bold">Бот: </span>{row.bot}
                  </div>
                  <div className={`text-xs font-space-mono p-2 rounded ${row.winner === "human" ? "bg-blue-500/20 text-blue-300" : "bg-zinc-800 text-zinc-400"}`}>
                    <span className="font-bold">Человек: </span>{row.human}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4">
            <div className="text-purple-400 font-orbitron text-xs font-bold mb-2">Из жизни: как работает Renaissance Technologies</div>
            <p className="text-zinc-300 text-xs font-space-mono leading-relaxed">
              Medallion Fund от Renaissance Technologies — самый успешный хедж-фонд в истории (+66% годовых в среднем за 30 лет).
              Он полностью алгоритмический: там работают математики и физики, а не традиционные трейдеры.
              Но даже они постоянно вмешиваются вручную при смене рыночного режима. Чистая автоматизация работает лишь в стабильных условиях —
              именно поэтому понимание рынка важнее любого алгоритма.
            </p>
          </div>
        </div>
      ),
    },
    {
      title: "DCA-бот: стратегия для крипто-рынка",
      content: (
        <div className="space-y-3">
          <p className="text-gray-300 leading-relaxed">
            Dollar Cost Averaging (DCA) — покупка фиксированной суммы актива через равные интервалы времени.
            Не нужно угадывать «дно» — стратегия усредняет цену автоматически.
          </p>

          {/* Визуальный DCA-график */}
          <DcaChart />

          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4">
            <div className="font-orbitron text-xs font-bold text-zinc-400 mb-3">Пример DCA на BTC за 4 недели</div>
            <div className="space-y-2">
              {[
                { week: "Неделя 1", price: "$94,000", amount: "$100", btc: "0.00106 BTC" },
                { week: "Неделя 2", price: "$91,000", amount: "$100", btc: "0.00110 BTC" },
                { week: "Неделя 3", price: "$96,500", amount: "$100", btc: "0.00104 BTC" },
                { week: "Неделя 4", price: "$98,000", amount: "$100", btc: "0.00102 BTC" },
              ].map((row, i) => (
                <div key={i} className="flex items-center gap-2 text-xs font-space-mono">
                  <span className="text-zinc-500 w-20">{row.week}</span>
                  <span className="text-zinc-400 w-20">{row.price}</span>
                  <span className="text-white w-14">{row.amount}</span>
                  <span className="text-green-400">{row.btc}</span>
                </div>
              ))}
              <div className="border-t border-zinc-800 pt-2 flex items-center gap-2 text-xs font-space-mono">
                <span className="text-zinc-500 w-20">Итого</span>
                <span className="text-yellow-400 w-20">Ср. $94,875</span>
                <span className="text-white w-14">$400</span>
                <span className="text-green-400 font-bold">0.00422 BTC</span>
              </div>
            </div>
          </div>

          <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
            <div className="text-green-400 font-orbitron text-xs font-bold mb-2">Из жизни: как инвестирует Майкл Сэйлор</div>
            <p className="text-zinc-300 text-xs font-space-mono leading-relaxed">
              Майкл Сэйлор, CEO MicroStrategy, публично применяет принцип DCA для корпоративных покупок биткоина.
              Компания покупает BTC каждый квартал на фиксированную сумму — независимо от цены.
              К 2024 году MicroStrategy накопила более 190,000 BTC со средней ценой покупки около $31,224.
              При цене BTC выше $95K — это многократный рост. Систематичность важнее попытки поймать «идеальный момент».
            </p>
          </div>
        </div>
      ),
    },
    {
      title: "Grid-бот: заработок на волатильности",
      content: (
        <div className="space-y-3">
          <p className="text-gray-300 leading-relaxed">
            Grid-бот выставляет сетку ордеров на покупку и продажу. Каждое колебание цены внутри диапазона приносит прибыль.
            Идеален для боковых рынков, которые составляют 70% времени.
          </p>

          {/* Визуальная схема сетки */}
          <GridBotVisual />

          <div className="space-y-2">
            {[
              {
                param: "Диапазон",
                value: "$93,000 — $99,000",
                desc: "Зона, где BTC торгуется в боковике",
                color: "text-blue-400",
              },
              {
                param: "Шаг сетки",
                value: "$500 (12 уровней)",
                desc: "Каждые $500 — ордер на покупку и продажу",
                color: "text-purple-400",
              },
              {
                param: "Прибыль с шага",
                value: "0.5% за движение",
                desc: "Бот зарабатывает на каждом полном качании цены",
                color: "text-green-400",
              },
              {
                param: "Риск",
                value: "Выход из диапазона",
                desc: "Если BTC уходит ниже $93K или выше $99K — бот останавливается",
                color: "text-red-400",
              },
            ].map((row, i) => (
              <div key={i} className="flex gap-3 items-start bg-zinc-900 border border-zinc-800 rounded-lg p-3">
                <div className={`font-orbitron text-xs font-bold ${row.color} w-20 shrink-0`}>{row.param}</div>
                <div>
                  <div className="text-white text-xs font-space-mono font-bold mb-0.5">{row.value}</div>
                  <p className="text-zinc-500 text-xs font-space-mono">{row.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
            <div className="text-blue-400 font-orbitron text-xs font-bold mb-2">Из жизни: алгоритмы маркет-мейкеров</div>
            <p className="text-zinc-300 text-xs font-space-mono leading-relaxed">
              Крупные маркет-мейкеры (Citadel Securities, Virtu Financial) зарабатывают именно на сетке ордеров — выставляя bid и ask одновременно.
              Они не угадывают направление: они зарабатывают на спреде и объёме.
              Grid-бот — это доступная версия той же стратегии для розничного трейдера.
              По данным Virtu Financial, компания была прибыльна в 1,237 из 1,238 торговых дней — именно благодаря этому подходу.
            </p>
          </div>
        </div>
      ),
    },
  ],
}
