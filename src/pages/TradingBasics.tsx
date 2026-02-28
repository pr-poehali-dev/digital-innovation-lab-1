import { useState, useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

const STORAGE_KEY = "tradebase_chapters_basics"

/* ─── SVG Charts & Visual Components ─────────────────────────── */

function CandlestickChart() {
  const candles = [
    { x: 30, open: 140, close: 120, high: 150, low: 110, bull: false },
    { x: 70, open: 120, close: 145, high: 155, low: 115, bull: true },
    { x: 110, open: 145, close: 135, high: 160, low: 130, bull: false },
    { x: 150, open: 135, close: 165, high: 170, low: 128, bull: true },
    { x: 190, open: 165, close: 155, high: 175, low: 148, bull: false },
    { x: 230, open: 155, close: 185, high: 190, low: 150, bull: true },
    { x: 270, open: 185, close: 175, high: 195, low: 168, bull: false },
    { x: 310, open: 175, close: 200, high: 205, low: 170, bull: true },
  ]
  const labels = ["Янв", "Фев", "Мар", "Апр", "Май", "Июн", "Июл", "Авг"]
  return (
    <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 my-4">
      <p className="text-zinc-400 text-xs font-space-mono mb-3">График: японские свечи BTC/USDT (пример)</p>
      <svg viewBox="0 0 360 220" className="w-full h-48">
        {/* Grid lines */}
        {[60, 100, 140, 180].map(y => (
          <line key={y} x1="20" y1={y} x2="340" y2={y} stroke="#27272a" strokeWidth="1" />
        ))}
        {/* Price labels */}
        {[{y:60,p:"$45k"},{y:100,p:"$42k"},{y:140,p:"$39k"},{y:180,p:"$36k"}].map(l => (
          <text key={l.y} x="5" y={l.y+4} fontSize="8" fill="#52525b" fontFamily="monospace">{l.p}</text>
        ))}
        {/* Candles */}
        {candles.map((c, i) => {
          const color = c.bull ? "#22c55e" : "#ef4444"
          const top = Math.min(c.open, c.close)
          const bot = Math.max(c.open, c.close)
          return (
            <g key={i}>
              <line x1={c.x} y1={c.high} x2={c.x} y2={c.low} stroke={color} strokeWidth="1.5" />
              <rect x={c.x - 10} y={top} width="20" height={Math.max(bot - top, 2)} fill={color} rx="1" />
            </g>
          )
        })}
        {/* X labels */}
        {candles.map((c, i) => (
          <text key={i} x={c.x} y="212" fontSize="8" fill="#52525b" textAnchor="middle" fontFamily="monospace">{labels[i]}</text>
        ))}
        {/* Legend */}
        <rect x="240" y="10" width="10" height="10" fill="#22c55e" rx="1" />
        <text x="254" y="19" fontSize="8" fill="#86efac" fontFamily="monospace">Бычья свеча</text>
        <rect x="240" y="26" width="10" height="10" fill="#ef4444" rx="1" />
        <text x="254" y="35" fontSize="8" fill="#fca5a5" fontFamily="monospace">Медвежья свеча</text>
      </svg>
    </div>
  )
}

function OrderBookChart() {
  const bids = [
    { price: "42,850", size: 3.2, pct: 80 },
    { price: "42,800", size: 2.1, pct: 52 },
    { price: "42,750", size: 1.5, pct: 38 },
    { price: "42,700", size: 4.8, pct: 100 },
    { price: "42,650", size: 0.9, pct: 22 },
  ]
  const asks = [
    { price: "42,900", size: 1.8, pct: 45 },
    { price: "42,950", size: 3.5, pct: 88 },
    { price: "43,000", size: 2.2, pct: 55 },
    { price: "43,050", size: 1.1, pct: 28 },
    { price: "43,100", size: 4.0, pct: 100 },
  ]
  return (
    <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 my-4">
      <p className="text-zinc-400 text-xs font-space-mono mb-3">Стакан ордеров (Order Book) BTC/USDT</p>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <div className="flex justify-between text-xs text-zinc-500 font-space-mono mb-1 px-1">
            <span>Цена (USDT)</span><span>Объём (BTC)</span>
          </div>
          {asks.map((a, i) => (
            <div key={i} className="relative flex justify-between text-xs font-space-mono py-0.5 px-1">
              <div className="absolute inset-0 right-0 bg-red-500/10 rounded" style={{ width: `${a.pct}%` }} />
              <span className="relative text-red-400">{a.price}</span>
              <span className="relative text-zinc-400">{a.size}</span>
            </div>
          ))}
          <div className="border-t border-zinc-700 my-1" />
          {bids.map((b, i) => (
            <div key={i} className="relative flex justify-between text-xs font-space-mono py-0.5 px-1">
              <div className="absolute inset-0 right-0 bg-green-500/10 rounded" style={{ width: `${b.pct}%` }} />
              <span className="relative text-green-400">{b.price}</span>
              <span className="relative text-zinc-400">{b.size}</span>
            </div>
          ))}
        </div>
        <div className="flex flex-col justify-center gap-2 text-xs font-space-mono">
          <div className="bg-zinc-900 rounded-lg p-3">
            <div className="text-zinc-500 mb-1">Лучший ASK (продажа)</div>
            <div className="text-red-400 font-bold text-base">$42,900</div>
          </div>
          <div className="bg-zinc-900 rounded-lg p-3">
            <div className="text-zinc-500 mb-1">Спред</div>
            <div className="text-yellow-400 font-bold text-base">$50 (0.12%)</div>
          </div>
          <div className="bg-zinc-900 rounded-lg p-3">
            <div className="text-zinc-500 mb-1">Лучший BID (покупка)</div>
            <div className="text-green-400 font-bold text-base">$42,850</div>
          </div>
        </div>
      </div>
    </div>
  )
}

function RSIChart() {
  const prices = [100, 105, 102, 110, 115, 112, 118, 122, 119, 125, 128, 124, 120, 116, 112, 108, 105, 102, 98, 95]
  const rsi = [50, 58, 52, 63, 71, 66, 74, 79, 72, 80, 83, 75, 67, 60, 52, 45, 38, 31, 25, 20]
  const w = 340, ph = 80, rh = 60, pad = 20
  const maxP = Math.max(...prices), minP = Math.min(...prices)
  const px = (i: number) => pad + (i / (prices.length - 1)) * (w - pad * 2)
  const py = (v: number) => ph - ((v - minP) / (maxP - minP)) * (ph - 10) - 5
  const ry = (v: number) => rh - (v / 100) * (rh - 8) - 4
  const pPath = prices.map((v, i) => `${i === 0 ? "M" : "L"} ${px(i)} ${py(v)}`).join(" ")
  const rPath = rsi.map((v, i) => `${i === 0 ? "M" : "L"} ${px(i)} ${ry(v)}`).join(" ")
  return (
    <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 my-4">
      <p className="text-zinc-400 text-xs font-space-mono mb-2">Цена + RSI: пример дивергенции и зон</p>
      <svg viewBox={`0 0 ${w} ${ph + rh + 20}`} className="w-full">
        {/* Price area */}
        <text x="2" y="12" fontSize="8" fill="#71717a" fontFamily="monospace">ЦЕНА</text>
        <path d={pPath} stroke="#ef4444" strokeWidth="1.5" fill="none" />
        {/* RSI area */}
        <text x="2" y={ph + 28} fontSize="8" fill="#71717a" fontFamily="monospace">RSI(14)</text>
        <g transform={`translate(0, ${ph + 16})`}>
          <rect x={pad} y={ry(70)} width={w - pad * 2} height={ry(30) - ry(70)} fill="#ef4444" opacity="0.07" />
          <line x1={pad} y1={ry(70)} x2={w - pad} y2={ry(70)} stroke="#ef4444" strokeWidth="0.8" strokeDasharray="3,3" />
          <line x1={pad} y1={ry(30)} x2={w - pad} y2={ry(30)} stroke="#22c55e" strokeWidth="0.8" strokeDasharray="3,3" />
          <text x={w - pad + 2} y={ry(70) + 4} fontSize="7" fill="#ef4444" fontFamily="monospace">70</text>
          <text x={w - pad + 2} y={ry(30) + 4} fontSize="7" fill="#22c55e" fontFamily="monospace">30</text>
          <path d={rPath} stroke="#a78bfa" strokeWidth="1.5" fill="none" />
        </g>
        {/* Overbought marker */}
        <text x={px(11)} y={py(128) - 5} fontSize="7" fill="#fbbf24" textAnchor="middle" fontFamily="monospace">Перекупленность</text>
        {/* Oversold marker */}
        <text x={px(19)} y={ph + 16 + ry(20) + 12} fontSize="7" fill="#86efac" textAnchor="middle" fontFamily="monospace">Перепроданность</text>
      </svg>
    </div>
  )
}

function SupportResistanceChart() {
  return (
    <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 my-4">
      <p className="text-zinc-400 text-xs font-space-mono mb-2">Уровни поддержки и сопротивления</p>
      <svg viewBox="0 0 360 180" className="w-full h-44">
        {/* Resistance line */}
        <line x1="30" y1="50" x2="330" y2="50" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="6,4" />
        <text x="332" y="54" fontSize="8" fill="#ef4444" fontFamily="monospace">Сопр.</text>
        {/* Support line */}
        <line x1="30" y1="130" x2="330" y2="130" stroke="#22c55e" strokeWidth="1.5" strokeDasharray="6,4" />
        <text x="332" y="134" fontSize="8" fill="#22c55e" fontFamily="monospace">Подд.</text>
        {/* Price zigzag */}
        <polyline
          points="30,130 60,110 90,50 100,70 130,130 160,100 190,50 200,65 230,130 260,108 290,50 310,75 330,90"
          fill="none" stroke="#e5e7eb" strokeWidth="2"
        />
        {/* Touch markers */}
        {[[90,50],[190,50],[290,50]].map(([x,y],i) => (
          <circle key={i} cx={x} cy={y} r="4" fill="none" stroke="#ef4444" strokeWidth="1.5" />
        ))}
        {[[30,130],[130,130],[230,130]].map(([x,y],i) => (
          <circle key={i} cx={x} cy={y} r="4" fill="none" stroke="#22c55e" strokeWidth="1.5" />
        ))}
        <text x="155" y="170" fontSize="8" fill="#52525b" textAnchor="middle" fontFamily="monospace">Чем больше касаний → тем уровень сильнее</text>
      </svg>
    </div>
  )
}

function RiskCalcTable() {
  const rows = [
    { deposit: "50 000₽", risk1: "500₽", risk2: "1 000₽", maxLoss: "10 000₽ (20 сделок)" },
    { deposit: "100 000₽", risk1: "1 000₽", risk2: "2 000₽", maxLoss: "20 000₽ (20 сделок)" },
    { deposit: "500 000₽", risk1: "5 000₽", risk2: "10 000₽", maxLoss: "100 000₽ (20 сделок)" },
    { deposit: "1 000 000₽", risk1: "10 000₽", risk2: "20 000₽", maxLoss: "200 000₽ (20 сделок)" },
  ]
  return (
    <div className="bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden my-4">
      <div className="px-4 py-2 border-b border-zinc-800">
        <p className="text-zinc-400 text-xs font-space-mono">Таблица: размер риска на сделку по правилу 1–2%</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs font-space-mono">
          <thead>
            <tr className="border-b border-zinc-800">
              <th className="text-left px-4 py-2 text-zinc-500">Депозит</th>
              <th className="text-right px-4 py-2 text-zinc-500">Риск 1%</th>
              <th className="text-right px-4 py-2 text-zinc-500">Риск 2%</th>
              <th className="text-right px-4 py-2 text-zinc-500">Макс. серия потерь</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} className="border-b border-zinc-900 hover:bg-zinc-900/50 transition-colors">
                <td className="px-4 py-2 text-white font-semibold">{r.deposit}</td>
                <td className="px-4 py-2 text-right text-yellow-400">{r.risk1}</td>
                <td className="px-4 py-2 text-right text-orange-400">{r.risk2}</td>
                <td className="px-4 py-2 text-right text-zinc-400">{r.maxLoss}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function RRTable() {
  const rows = [
    { rr: "1:1", winRate: "51%", comment: "Минимально допустимо", color: "text-orange-400" },
    { rr: "1:2", winRate: "34%", comment: "Стандарт для трейдеров", color: "text-yellow-400" },
    { rr: "1:3", winRate: "25%", comment: "Хорошо для тренд-трейдинга", color: "text-green-400" },
    { rr: "1:5", winRate: "17%", comment: "Для swing/позиционных сделок", color: "text-emerald-400" },
  ]
  return (
    <div className="bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden my-4">
      <div className="px-4 py-2 border-b border-zinc-800">
        <p className="text-zinc-400 text-xs font-space-mono">Таблица: минимальный win rate для прибыли при разных R:R</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs font-space-mono">
          <thead>
            <tr className="border-b border-zinc-800">
              <th className="text-left px-4 py-2 text-zinc-500">Риск:Прибыль</th>
              <th className="text-right px-4 py-2 text-zinc-500">Мин. Win Rate</th>
              <th className="text-right px-4 py-2 text-zinc-500">Комментарий</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} className="border-b border-zinc-900 hover:bg-zinc-900/50 transition-colors">
                <td className={`px-4 py-2 font-bold text-base ${r.color}`}>{r.rr}</td>
                <td className="px-4 py-2 text-right text-white font-semibold">{r.winRate}</td>
                <td className="px-4 py-2 text-right text-zinc-400">{r.comment}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function MarketComparisonTable() {
  const markets = [
    { name: "Криптовалюта", hours: "24/7", volatility: "Очень высокая", liquidity: "Высокая", example: "BTC, ETH, SOL" },
    { name: "Форекс", hours: "24/5", volatility: "Средняя", liquidity: "Очень высокая", example: "EUR/USD, GBP/JPY" },
    { name: "Акции (РФ)", hours: "10:00–18:50", volatility: "Средняя", liquidity: "Средняя", example: "SBER, GAZP, YNDX" },
    { name: "Акции (США)", hours: "09:30–16:00 ET", volatility: "Средняя", liquidity: "Очень высокая", example: "AAPL, TSLA, NVDA" },
    { name: "Товарный", hours: "Сессии", volatility: "Низкая–Средняя", liquidity: "Средняя", example: "Нефть, Золото, Газ" },
  ]
  return (
    <div className="bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden my-4">
      <div className="px-4 py-2 border-b border-zinc-800">
        <p className="text-zinc-400 text-xs font-space-mono">Сравнение основных финансовых рынков</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs font-space-mono">
          <thead>
            <tr className="border-b border-zinc-800">
              <th className="text-left px-4 py-2 text-zinc-500">Рынок</th>
              <th className="text-left px-4 py-2 text-zinc-500">Часы торгов</th>
              <th className="text-left px-4 py-2 text-zinc-500">Волатильность</th>
              <th className="text-left px-4 py-2 text-zinc-500">Ликвидность</th>
              <th className="text-left px-4 py-2 text-zinc-500">Примеры</th>
            </tr>
          </thead>
          <tbody>
            {markets.map((m, i) => (
              <tr key={i} className="border-b border-zinc-900 hover:bg-zinc-900/50 transition-colors">
                <td className="px-4 py-2 text-white font-semibold">{m.name}</td>
                <td className="px-4 py-2 text-yellow-400">{m.hours}</td>
                <td className="px-4 py-2 text-zinc-300">{m.volatility}</td>
                <td className="px-4 py-2 text-zinc-300">{m.liquidity}</td>
                <td className="px-4 py-2 text-zinc-400">{m.example}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function OrderTypesTable() {
  const orders = [
    { type: "Market Order", when: "Нужна мгновенная покупка/продажа", pros: "Всегда исполняется", cons: "Проскальзывание при низкой ликвидности" },
    { type: "Limit Order", when: "Хотите войти по конкретной цене", pros: "Точная цена, нет proскальзывания", cons: "Может не исполниться" },
    { type: "Stop-Loss", when: "Защита от убытков", pros: "Автоматическая защита капитала", cons: "Срабатывает при flash-crash" },
    { type: "Take-Profit", when: "Фиксация прибыли", pros: "Не нужно следить за рынком", cons: "Может закрыть раньше сильного движения" },
    { type: "Trailing Stop", when: "Трендовые движения", pros: "Сохраняет нарастающую прибыль", cons: "Сложнее настроить корректно" },
    { type: "Stop-Limit", when: "Точный выход при стопе", pros: "Контроль цены выхода", cons: "Не гарантирует исполнение при гэпе" },
  ]
  return (
    <div className="bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden my-4">
      <div className="px-4 py-2 border-b border-zinc-800">
        <p className="text-zinc-400 text-xs font-space-mono">Типы ордеров: когда и зачем использовать</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs font-space-mono">
          <thead>
            <tr className="border-b border-zinc-800">
              <th className="text-left px-4 py-2 text-zinc-500">Тип ордера</th>
              <th className="text-left px-4 py-2 text-zinc-500">Когда использовать</th>
              <th className="text-left px-4 py-2 text-zinc-500">Плюс</th>
              <th className="text-left px-4 py-2 text-zinc-500">Минус</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o, i) => (
              <tr key={i} className="border-b border-zinc-900 hover:bg-zinc-900/50 transition-colors">
                <td className="px-4 py-2 text-red-400 font-semibold whitespace-nowrap">{o.type}</td>
                <td className="px-4 py-2 text-zinc-300">{o.when}</td>
                <td className="px-4 py-2 text-green-400">{o.pros}</td>
                <td className="px-4 py-2 text-red-300">{o.cons}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function TimeframeTable() {
  const tfs = [
    { tf: "M1–M5", name: "Скальпинг", desc: "Десятки сделок в день, минимальная прибыль с каждой", who: "Профессиональные скальперы" },
    { tf: "M15–M30", name: "Интрадей", desc: "Несколько сделок в день, закрытие к вечеру", who: "Дневные трейдеры" },
    { tf: "H1–H4", name: "Свинг", desc: "Позиции от часов до дней", who: "Большинство трейдеров" },
    { tf: "D1", name: "Позиционный", desc: "Удержание от дней до недель", who: "Инвесторы + трейдеры" },
    { tf: "W1–MN", name: "Долгосрочный", desc: "Месяцы и годы удержания", who: "Инвесторы" },
  ]
  return (
    <div className="bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden my-4">
      <div className="px-4 py-2 border-b border-zinc-800">
        <p className="text-zinc-400 text-xs font-space-mono">Тайм-фреймы и стили торговли</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs font-space-mono">
          <thead>
            <tr className="border-b border-zinc-800">
              <th className="text-left px-4 py-2 text-zinc-500">ТФ</th>
              <th className="text-left px-4 py-2 text-zinc-500">Стиль</th>
              <th className="text-left px-4 py-2 text-zinc-500">Описание</th>
              <th className="text-left px-4 py-2 text-zinc-500">Для кого</th>
            </tr>
          </thead>
          <tbody>
            {tfs.map((t, i) => (
              <tr key={i} className="border-b border-zinc-900 hover:bg-zinc-900/50 transition-colors">
                <td className="px-4 py-2 text-red-400 font-bold">{t.tf}</td>
                <td className="px-4 py-2 text-white font-semibold">{t.name}</td>
                <td className="px-4 py-2 text-zinc-300">{t.desc}</td>
                <td className="px-4 py-2 text-zinc-400">{t.who}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function IndicatorsComparisonTable() {
  const indicators = [
    { name: "SMA (простая MA)", type: "Трендовый", signal: "Пересечение MA200", lag: "Высокий", best: "Долгосрочный тренд" },
    { name: "EMA (экспон. MA)", type: "Трендовый", signal: "Golden/Death cross", lag: "Средний", best: "Свинг-трейдинг" },
    { name: "RSI (14)", type: "Осциллятор", signal: ">70 / <30, дивергенция", lag: "Низкий", best: "Боковой рынок" },
    { name: "MACD", type: "Трендовый+Осц.", signal: "Пересечение линий", lag: "Средний", best: "Подтверждение тренда" },
    { name: "Bollinger Bands", type: "Волатильность", signal: "Выход за полосы", lag: "Средний", best: "Волатильные рынки" },
    { name: "Stochastic", type: "Осциллятор", signal: ">80 / <20", lag: "Низкий", best: "Краткосрочная торговля" },
    { name: "Volume", type: "Объём", signal: "Рост объёма на движении", lag: "Нет", best: "Подтверждение пробоев" },
  ]
  return (
    <div className="bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden my-4">
      <div className="px-4 py-2 border-b border-zinc-800">
        <p className="text-zinc-400 text-xs font-space-mono">Сравнение популярных индикаторов</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs font-space-mono">
          <thead>
            <tr className="border-b border-zinc-800">
              <th className="text-left px-4 py-2 text-zinc-500">Индикатор</th>
              <th className="text-left px-4 py-2 text-zinc-500">Тип</th>
              <th className="text-left px-4 py-2 text-zinc-500">Сигнал</th>
              <th className="text-left px-4 py-2 text-zinc-500">Запазд.</th>
              <th className="text-left px-4 py-2 text-zinc-500">Лучший для</th>
            </tr>
          </thead>
          <tbody>
            {indicators.map((ind, i) => (
              <tr key={i} className="border-b border-zinc-900 hover:bg-zinc-900/50 transition-colors">
                <td className="px-4 py-2 text-purple-400 font-semibold">{ind.name}</td>
                <td className="px-4 py-2 text-zinc-300">{ind.type}</td>
                <td className="px-4 py-2 text-yellow-300">{ind.signal}</td>
                <td className="px-4 py-2 text-zinc-400">{ind.lag}</td>
                <td className="px-4 py-2 text-zinc-400">{ind.best}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function MACDChart() {
  const prices = [100, 102, 105, 108, 106, 110, 115, 118, 116, 120, 125, 122, 118, 114, 110, 112, 116, 120, 124, 128]
  const macd = [-0.5, -0.3, 0.2, 0.8, 0.5, 1.2, 2.0, 2.5, 2.0, 2.8, 3.5, 2.8, 1.5, 0.3, -0.5, -0.8, -0.3, 0.5, 1.2, 2.0]
  const signal = [0.2, 0.1, 0.2, 0.4, 0.4, 0.6, 1.0, 1.5, 1.7, 2.0, 2.5, 2.6, 2.3, 1.8, 1.2, 0.7, 0.3, 0.3, 0.5, 0.9]
  const w = 340, ph = 80, mh = 60, pad = 20
  const maxP = Math.max(...prices), minP = Math.min(...prices)
  const maxM = Math.max(...macd.map(Math.abs)) * 1.2
  const px = (i: number) => pad + (i / (prices.length - 1)) * (w - pad * 2)
  const py = (v: number) => ph - ((v - minP) / (maxP - minP)) * (ph - 10) - 5
  const my = (v: number) => mh / 2 - (v / maxM) * (mh / 2 - 5)
  const pPath = prices.map((v, i) => `${i === 0 ? "M" : "L"} ${px(i)} ${py(v)}`).join(" ")
  const macdPath = macd.map((v, i) => `${i === 0 ? "M" : "L"} ${px(i)} ${my(v)}`).join(" ")
  const sigPath = signal.map((v, i) => `${i === 0 ? "M" : "L"} ${px(i)} ${my(v)}`).join(" ")
  return (
    <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 my-4">
      <p className="text-zinc-400 text-xs font-space-mono mb-2">Цена + MACD (сигналы на пересечениях)</p>
      <svg viewBox={`0 0 ${w} ${ph + mh + 20}`} className="w-full">
        <text x="2" y="12" fontSize="8" fill="#71717a" fontFamily="monospace">ЦЕНА</text>
        <path d={pPath} stroke="#e5e7eb" strokeWidth="1.5" fill="none" />
        <text x="2" y={ph + 26} fontSize="8" fill="#71717a" fontFamily="monospace">MACD</text>
        <g transform={`translate(0, ${ph + 14})`}>
          <line x1={pad} y1={mh / 2} x2={w - pad} y2={mh / 2} stroke="#3f3f46" strokeWidth="0.8" />
          {macd.map((v, i) => {
            const barH = Math.abs(my(v) - mh / 2)
            const barY = v >= 0 ? mh / 2 - barH : mh / 2
            return <rect key={i} x={px(i) - 4} y={barY} width="8" height={barH} fill={v >= 0 ? "#22c55e" : "#ef4444"} opacity="0.6" />
          })}
          <path d={macdPath} stroke="#60a5fa" strokeWidth="1.5" fill="none" />
          <path d={sigPath} stroke="#fbbf24" strokeWidth="1.5" fill="none" strokeDasharray="4,2" />
        </g>
        <rect x={w - 110} y="5" width="8" height="4" fill="#60a5fa" />
        <text x={w - 98} y="11" fontSize="7" fill="#93c5fd" fontFamily="monospace">MACD</text>
        <rect x={w - 110} y="15" width="8" height="4" fill="#fbbf24" />
        <text x={w - 98} y="21" fontSize="7" fill="#fde68a" fontFamily="monospace">Signal</text>
      </svg>
    </div>
  )
}

function CandlePatternCards() {
  const patterns = [
    { name: "Доджи", color: "text-yellow-400", desc: "Открытие ≈ Закрытие. Нерешительность рынка. Сигнал потенциального разворота.", shape: "doji" },
    { name: "Молот", color: "text-green-400", desc: "Длинная нижняя тень + маленькое тело. Отклонение падения. Бычий разворот.", shape: "hammer" },
    { name: "Поглощение", color: "text-red-400", desc: "Большая свеча поглощает предыдущую. Смена настроений рынка.", shape: "engulf" },
    { name: "Пинбар", color: "text-purple-400", desc: "Длинная тень в направлении тренда. Отказ идти дальше. Сильный разворот.", shape: "pinbar" },
  ]
  function Shape({ type }: { type: string }) {
    if (type === "doji") return (
      <svg viewBox="0 0 30 60" className="h-12 mx-auto">
        <line x1="15" y1="5" x2="15" y2="55" stroke="#eab308" strokeWidth="1.5" />
        <rect x="5" y="28" width="20" height="4" fill="#eab308" />
      </svg>
    )
    if (type === "hammer") return (
      <svg viewBox="0 0 30 60" className="h-12 mx-auto">
        <line x1="15" y1="5" x2="15" y2="15" stroke="#22c55e" strokeWidth="1.5" />
        <rect x="5" y="15" width="20" height="15" fill="#22c55e" />
        <line x1="15" y1="30" x2="15" y2="55" stroke="#22c55e" strokeWidth="1.5" />
      </svg>
    )
    if (type === "engulf") return (
      <svg viewBox="0 0 50 60" className="h-12 mx-auto">
        <line x1="12" y1="8" x2="12" y2="52" stroke="#ef4444" strokeWidth="1" />
        <rect x="4" y="15" width="16" height="25" fill="#ef4444" />
        <line x1="38" y1="4" x2="38" y2="56" stroke="#22c55e" strokeWidth="1" />
        <rect x="28" y="10" width="20" height="36" fill="#22c55e" />
      </svg>
    )
    return (
      <svg viewBox="0 0 30 60" className="h-12 mx-auto">
        <line x1="15" y1="5" x2="15" y2="15" stroke="#a78bfa" strokeWidth="1.5" />
        <rect x="5" y="15" width="20" height="10" fill="#a78bfa" />
        <line x1="15" y1="25" x2="15" y2="55" stroke="#a78bfa" strokeWidth="1.5" />
      </svg>
    )
  }
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4">
      {patterns.map((p, i) => (
        <div key={i} className="bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-center">
          <Shape type={p.shape} />
          <div className={`font-orbitron text-sm font-bold mt-2 mb-1 ${p.color}`}>{p.name}</div>
          <div className="text-zinc-400 text-xs font-space-mono leading-relaxed">{p.desc}</div>
        </div>
      ))}
    </div>
  )
}

function TradingJournalTemplate() {
  return (
    <div className="bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden my-4">
      <div className="px-4 py-2 border-b border-zinc-800">
        <p className="text-zinc-400 text-xs font-space-mono">Шаблон торгового журнала</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs font-space-mono">
          <thead>
            <tr className="border-b border-zinc-800">
              {["Дата", "Актив", "Напр.", "Вход", "SL", "TP", "Выход", "P&L", "R:R", "Причина входа"].map(h => (
                <th key={h} className="text-left px-3 py-2 text-zinc-500 whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-zinc-900 bg-green-500/5">
              <td className="px-3 py-2 text-zinc-300">15.01</td>
              <td className="px-3 py-2 text-white">BTC/USDT</td>
              <td className="px-3 py-2 text-green-400">LONG</td>
              <td className="px-3 py-2">42 500</td>
              <td className="px-3 py-2 text-red-400">41 500</td>
              <td className="px-3 py-2 text-green-400">44 500</td>
              <td className="px-3 py-2">44 500</td>
              <td className="px-3 py-2 text-green-400">+2 000</td>
              <td className="px-3 py-2 text-emerald-400">1:2</td>
              <td className="px-3 py-2 text-zinc-400">Откат к EMA200 + RSI 32</td>
            </tr>
            <tr className="border-b border-zinc-900 bg-red-500/5">
              <td className="px-3 py-2 text-zinc-300">17.01</td>
              <td className="px-3 py-2 text-white">ETH/USDT</td>
              <td className="px-3 py-2 text-red-400">SHORT</td>
              <td className="px-3 py-2">2 350</td>
              <td className="px-3 py-2 text-red-400">2 420</td>
              <td className="px-3 py-2 text-green-400">2 210</td>
              <td className="px-3 py-2">2 420</td>
              <td className="px-3 py-2 text-red-400">-700</td>
              <td className="px-3 py-2 text-orange-400">1:2</td>
              <td className="px-3 py-2 text-zinc-400">Пробой уровня сопр.</td>
            </tr>
            <tr className="border-b border-zinc-900 bg-green-500/5">
              <td className="px-3 py-2 text-zinc-300">20.01</td>
              <td className="px-3 py-2 text-white">SOL/USDT</td>
              <td className="px-3 py-2 text-green-400">LONG</td>
              <td className="px-3 py-2">95.20</td>
              <td className="px-3 py-2 text-red-400">92.00</td>
              <td className="px-3 py-2 text-green-400">104.60</td>
              <td className="px-3 py-2">104.50</td>
              <td className="px-3 py-2 text-green-400">+9 300</td>
              <td className="px-3 py-2 text-emerald-400">1:3</td>
              <td className="px-3 py-2 text-zinc-400">Поглощение + объём</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

/* ─── Sections with Rich Content ──────────────────────────────── */

type Section = {
  title: string
  content: React.ReactNode
}

type Article = {
  id: string
  badge: string
  title: string
  summary: string
  sections: Section[]
}

const articles: Article[] = [
  {
    id: "markets",
    badge: "Глава 1",
    title: "Что такое финансовые рынки",
    summary: "Финансовые рынки — это площадки, где покупатели и продавцы обменивают активы: акции, валюту, криптовалюту, товары. Понимание структуры рынка — фундамент любой торговли.",
    sections: [
      {
        title: "Основные типы рынков и их сравнение",
        content: (
          <div className="space-y-3">
            <p className="text-gray-300 leading-relaxed">Выбор рынка определяет весь стиль торговли. Каждый рынок имеет свой характер волатильности, ликвидности и часов работы.</p>
            <MarketComparisonTable />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
              <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-3">
                <div className="text-yellow-400 font-orbitron text-xs font-bold mb-2">Что такое ликвидность?</div>
                <p className="text-zinc-400 text-xs leading-relaxed">Ликвидность — насколько легко купить или продать актив без существенного изменения его цены. Высокая ликвидность = узкий спред, быстрое исполнение. Низкая = широкий спред, проскальзывание.</p>
              </div>
              <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-3">
                <div className="text-red-400 font-orbitron text-xs font-bold mb-2">Что такое волатильность?</div>
                <p className="text-zinc-400 text-xs leading-relaxed">Волатильность — амплитуда колебаний цены. BTC может за день изменить цену на 5–15%. Акции SBER — на 1–3%. Высокая волатильность = больше возможностей и рисков одновременно.</p>
              </div>
            </div>
          </div>
        )
      },
      {
        title: "Участники рынка и их роли",
        content: (
          <div className="space-y-3">
            <p className="text-gray-300 leading-relaxed">Рынок — это экосистема с разными игроками. Понимание мотивов каждого помогает читать движения цены.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { title: "Маркет-мейкеры", color: "border-blue-500/40 bg-blue-500/5", tc: "text-blue-400", desc: "Крупные банки и брокеры, которые постоянно выставляют заявки на покупку и продажу. Обеспечивают ликвидность. Зарабатывают на спреде. Без них рынок не работает." },
                { title: "Институционалы", color: "border-purple-500/40 bg-purple-500/5", tc: "text-purple-400", desc: "Хедж-фонды, банки, пенсионные фонды. Торгуют миллиардами — их сделки буквально двигают рынок. Часто используют алгоритмы и ИИ." },
                { title: "Розничные трейдеры", color: "border-yellow-500/40 bg-yellow-500/5", tc: "text-yellow-400", desc: "Частные лица с небольшим капиталом. Это мы с вами. Составляем меньшую часть объёма, но в сумме влияем на настроения рынка." },
                { title: "Алгоритмы (HFT)", color: "border-red-500/40 bg-red-500/5", tc: "text-red-400", desc: "Высокочастотные торговые боты. Совершают тысячи сделок в секунду. Обеспечивают около 70% объёма на американских биржах. Конкурировать с ними в скорости невозможно." },
              ].map((p, i) => (
                <div key={i} className={`border rounded-lg p-3 ${p.color}`}>
                  <div className={`font-orbitron text-xs font-bold mb-1 ${p.tc}`}>{p.title}</div>
                  <p className="text-zinc-400 text-xs leading-relaxed">{p.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )
      },
      {
        title: "Стакан ордеров (Order Book) — как читать",
        content: (
          <div className="space-y-3">
            <p className="text-gray-300 leading-relaxed">Order Book — главный инструмент понимания текущего баланса спроса и предложения. Именно здесь видно, где стоят крупные игроки.</p>
            <OrderBookChart />
            <div className="space-y-2 text-sm text-zinc-300 leading-relaxed">
              <div className="flex gap-2"><span className="text-green-400 font-bold">Биды (зелёные)</span><span>— заявки на покупку. Чем выше цена — тем меньше желающих покупать.</span></div>
              <div className="flex gap-2"><span className="text-red-400 font-bold">Аски (красные)</span><span>— заявки на продажу. Стена продаж выше рынка тормозит рост цены.</span></div>
              <div className="flex gap-2"><span className="text-yellow-400 font-bold">Спред</span><span>— разница между лучшим аском и лучшим бидом. Это «стоимость» мгновенной сделки.</span></div>
              <div className="bg-zinc-900 border border-zinc-700 rounded-lg p-3 text-xs text-zinc-400 mt-2">
                <span className="text-white font-semibold">Совет:</span> Большой объём на уровне поддержки в стакане — не гарантия. Крупные игроки могут снять свои заявки прямо перед достижением цены (манипуляция «стеной»). Анализируйте стакан в динамике.
              </div>
            </div>
          </div>
        )
      },
      {
        title: "▲ Продвинутый уровень: Smart Money и структура рынка (ICT)",
        content: (
          <div className="space-y-4">
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 flex gap-2 items-center">
              <span className="text-red-400 text-lg">⚠</span>
              <p className="text-red-300 text-xs font-space-mono">Этот раздел для продвинутых трейдеров. Концепции основаны на методологии ICT (Inner Circle Trader) и SMC (Smart Money Concepts).</p>
            </div>
            <p className="text-gray-300 leading-relaxed">Smart Money — это крупные институциональные игроки (банки, фонды), которые двигают рынок. Их задача: набрать позицию по лучшей цене, не показывая намерений. Для этого они создают ловушки для розничных трейдеров.</p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { title: "Stop Hunt (Охота за стопами)", color: "border-red-500/40 bg-red-500/5", tc: "text-red-400", desc: "Цена намеренно пробивает очевидные уровни поддержки/сопротивления, выбивает стоп-лоссы большинства розничных трейдеров — и разворачивается. Это не случайность, это ликвидность для Smart Money." },
                { title: "Fair Value Gap (FVG)", color: "border-blue-500/40 bg-blue-500/5", tc: "text-blue-400", desc: "Разрыв в ценовом диапазоне из трёх свечей, где не было двустороннего обмена. Рынок часто возвращается заполнить FVG перед продолжением тренда. Мощная зона для входа." },
                { title: "Order Block (OB)", color: "border-purple-500/40 bg-purple-500/5", tc: "text-purple-400", desc: "Последняя бычья/медвежья свеча перед импульсным движением. Место накопления позиций Smart Money. Цена часто возвращается к OB для добора позиции." },
              ].map((item, i) => (
                <div key={i} className={`border rounded-xl p-3 ${item.color}`}>
                  <div className={`font-orbitron text-xs font-bold mb-2 ${item.tc}`}>{item.title}</div>
                  <p className="text-zinc-400 text-xs leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>

            <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4">
              <div className="text-white font-orbitron text-xs font-bold mb-3">Структура рынка (Market Structure)</div>
              <svg viewBox="0 0 360 120" className="w-full h-28">
                <polyline points="20,100 60,80 80,90 120,55 140,70 190,30 210,45 250,20 280,35 320,15" fill="none" stroke="#e5e7eb" strokeWidth="1.5" />
                {/* HH markers */}
                {[[120,55],[190,30],[250,20]].map(([x,y],i) => (
                  <g key={i}>
                    <circle cx={x} cy={y} r="4" fill="#22c55e" />
                    <text x={x} y={y-8} fontSize="7" fill="#22c55e" textAnchor="middle" fontFamily="monospace">HH</text>
                  </g>
                ))}
                {/* HL markers */}
                {[[80,90],[140,70],[210,45]].map(([x,y],i) => (
                  <g key={i}>
                    <circle cx={x} cy={y} r="4" fill="#60a5fa" />
                    <text x={x} y={y+14} fontSize="7" fill="#60a5fa" textAnchor="middle" fontFamily="monospace">HL</text>
                  </g>
                ))}
                <text x="180" y="115" fontSize="8" fill="#52525b" textAnchor="middle" fontFamily="monospace">Бычий тренд: HH (Higher High) + HL (Higher Low)</text>
              </svg>
              <div className="grid grid-cols-2 gap-3 mt-3">
                <div className="bg-zinc-900 rounded-lg p-3">
                  <div className="text-green-400 font-orbitron text-xs font-bold mb-1">Бычья структура</div>
                  <p className="text-zinc-400 text-xs font-space-mono">HH + HL — каждый максимум и минимум выше предыдущего. Торгуем только лонги на HL.</p>
                </div>
                <div className="bg-zinc-900 rounded-lg p-3">
                  <div className="text-red-400 font-orbitron text-xs font-bold mb-1">Медвежья структура</div>
                  <p className="text-zinc-400 text-xs font-space-mono">LH + LL — каждый максимум и минимум ниже предыдущего. Торгуем только шорты на LH.</p>
                </div>
              </div>
            </div>

            <div className="bg-zinc-900 border border-yellow-500/20 rounded-xl p-4">
              <div className="text-yellow-400 font-orbitron text-xs font-bold mb-2">Смена структуры (BOS / CHoCH)</div>
              <div className="space-y-2 text-xs font-space-mono text-zinc-400">
                <div className="flex gap-2 items-start"><span className="text-blue-400 font-bold shrink-0">BOS</span><span>(Break of Structure) — пробой предыдущего HH или LL. Подтверждает продолжение тренда. Используется для входа в направлении доминирующей структуры.</span></div>
                <div className="flex gap-2 items-start"><span className="text-orange-400 font-bold shrink-0">CHoCH</span><span>(Change of Character) — первый признак смены тренда. Цена впервые пробивает структуру против тренда. Сигнал к переходу к нейтралитету или развороту.</span></div>
              </div>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
              <div className="text-white font-orbitron text-xs font-bold mb-2">Манипуляция перед движением: схема Wyckoff</div>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-xs font-space-mono">
                {[
                  { n: "1. Накопление", c: "text-blue-400", d: "Smart Money накапливают позицию в боковике. Объём растёт, цена не двигается. Большинство думает «ничего не происходит»." },
                  { n: "2. Разметка (Markup)", c: "text-green-400", d: "Импульсный рост после накопления. FOMO-трейдеры входят на хаях. Smart Money продолжают добирать." },
                  { n: "3. Распределение", c: "text-yellow-400", d: "Боковик на вершине. Smart Money тихо выходят из позиций, перекладывая их на розничных покупателей." },
                  { n: "4. Уценка (Markdown)", c: "text-red-400", d: "Резкое падение. Розничные трейдеры держат убытки. Smart Money откупают внизу — цикл повторяется." },
                ].map((s, i) => (
                  <div key={i} className="bg-zinc-950 rounded-lg p-2">
                    <div className={`font-bold mb-1 ${s.c}`}>{s.n}</div>
                    <p className="text-zinc-500 leading-relaxed">{s.d}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )
      },
    ]
  },
  {
    id: "orders",
    badge: "Глава 2",
    title: "Типы ордеров и исполнение сделок",
    summary: "Правильный выбор типа ордера влияет на цену входа, исполнение и итоговый результат. Разберём все основные типы и когда их применять.",
    sections: [
      {
        title: "Полная таблица типов ордеров",
        content: (
          <div className="space-y-3">
            <p className="text-gray-300 leading-relaxed">Каждый тип ордера решает конкретную задачу. Ошибка в выборе типа ордера может стоить процентов прибыли или части капитала.</p>
            <OrderTypesTable />
          </div>
        )
      },
      {
        title: "Рыночный vs Лимитный: что выбрать",
        content: (
          <div className="space-y-3">
            <p className="text-gray-300 leading-relaxed">Главный выбор каждого трейдера при входе в сделку — скорость или точность цены.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-zinc-900 border border-red-500/30 rounded-xl p-4">
                <div className="text-red-400 font-orbitron font-bold mb-2">Market Order</div>
                <div className="space-y-1 text-xs text-zinc-400 font-space-mono">
                  <div>✓ Мгновенное исполнение</div>
                  <div>✓ 100% вероятность сделки</div>
                  <div>✗ Проскальзывание в неликвиде</div>
                  <div>✗ Нет контроля цены</div>
                </div>
                <div className="mt-3 bg-zinc-950 rounded p-2 text-xs text-zinc-500">
                  <span className="text-white">Используйте:</span> При срочном закрытии позиции, торговле топ-ликвидными активами (BTC, SBER, AAPL)
                </div>
              </div>
              <div className="bg-zinc-900 border border-green-500/30 rounded-xl p-4">
                <div className="text-green-400 font-orbitron font-bold mb-2">Limit Order</div>
                <div className="space-y-1 text-xs text-zinc-400 font-space-mono">
                  <div>✓ Точная цена входа</div>
                  <div>✓ Нет проскальзывания</div>
                  <div>✓ Maker-скидка на комиссию</div>
                  <div>✗ Может не исполниться</div>
                </div>
                <div className="mt-3 bg-zinc-950 rounded p-2 text-xs text-zinc-500">
                  <span className="text-white">Используйте:</span> Вход на откате, выход на TP, любая работа «по уровням»
                </div>
              </div>
            </div>
            <div className="bg-zinc-900 border border-yellow-500/20 rounded-xl p-4 mt-2">
              <div className="text-yellow-400 font-orbitron text-xs font-bold mb-2">Пример расчёта проскальзывания</div>
              <p className="text-zinc-400 text-xs font-space-mono leading-relaxed">
                Хотите купить 1 BTC по цене $42,850 рыночным ордером. Стакан: лучший аск $42,900 (0.3 BTC) + $42,950 (0.7 BTC). Итог: покупаете по средней ~$42,930. Проскальзывание = $80 (0.19%). На маленьких объёмах незначительно, на крупных — существенно.
              </p>
            </div>
          </div>
        )
      },
      {
        title: "▲ Продвинутый уровень: OCO, фьючерсы и продвинутые типы ордеров",
        content: (
          <div className="space-y-4">
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 flex gap-2 items-center">
              <span className="text-red-400 text-lg">⚠</span>
              <p className="text-red-300 text-xs font-space-mono">Продвинутый раздел. Требует понимания базовых типов ордеров и принципов маржинальной торговли.</p>
            </div>

            <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4">
              <div className="text-white font-orbitron text-xs font-bold mb-3">OCO (One Cancels the Other)</div>
              <p className="text-gray-300 text-sm leading-relaxed mb-3">Пара ордеров: при исполнении одного второй автоматически отменяется. Позволяет одновременно зафиксировать прибыль или ограничить убыток без ручного контроля.</p>
              <div className="bg-zinc-900 rounded-xl p-3">
                <svg viewBox="0 0 360 100" className="w-full h-24">
                  <line x1="30" y1="50" x2="330" y2="50" stroke="#e5e7eb" strokeWidth="1.5" />
                  <circle cx="180" cy="50" r="5" fill="#60a5fa" />
                  <text x="180" y="42" fontSize="8" fill="#60a5fa" textAnchor="middle" fontFamily="monospace">ПОЗИЦИЯ $100</text>
                  <line x1="30" y1="25" x2="330" y2="25" stroke="#22c55e" strokeWidth="1" strokeDasharray="5,3" />
                  <text x="60" y="20" fontSize="8" fill="#22c55e" fontFamily="monospace">TP: $115 (+15%)</text>
                  <line x1="30" y1="78" x2="330" y2="78" stroke="#ef4444" strokeWidth="1" strokeDasharray="5,3" />
                  <text x="60" y="92" fontSize="8" fill="#ef4444" fontFamily="monospace">SL: $93 (-7%)</text>
                  <text x="280" y="52" fontSize="8" fill="#a78bfa" fontFamily="monospace">OCO</text>
                  <line x1="320" y1="25" x2="320" y2="78" stroke="#a78bfa" strokeWidth="1" />
                  <text x="270" y="90" fontSize="7" fill="#52525b" fontFamily="monospace">Сработает одно — другое отменится</text>
                </svg>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                <div className="bg-zinc-900 rounded-lg p-3">
                  <div className="text-green-400 font-orbitron text-xs font-bold mb-1">Применение</div>
                  <p className="text-zinc-400 text-xs font-space-mono leading-relaxed">Входите в сделку и сразу выставляете OCO: если цена достигает TP — позиция закрывается с прибылью, SL-ордер отменяется. Если цена падает до SL — убыток зафиксирован, TP отменён.</p>
                </div>
                <div className="bg-zinc-900 rounded-lg p-3">
                  <div className="text-blue-400 font-orbitron text-xs font-bold mb-1">Где доступно</div>
                  <p className="text-zinc-400 text-xs font-space-mono leading-relaxed">Bybit, Binance Futures, OKX — все крупные биржи поддерживают OCO. На споте — иногда ограничено. Всегда проверяйте исполнение в тестовой сети перед реальными деньгами.</p>
                </div>
              </div>
            </div>

            <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4">
              <div className="text-white font-orbitron text-xs font-bold mb-3">Фьючерсы: лонг, шорт и ликвидация</div>
              <p className="text-gray-300 text-sm leading-relaxed mb-3">Фьючерсные контракты позволяют торговать с кредитным плечом и открывать позиции на падение (шорт) без владения активом. Высокий потенциал прибыли = высокий риск ликвидации.</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { title: "Плечо (Leverage)", color: "text-yellow-400", bc: "border-yellow-500/30 bg-yellow-500/5", desc: "10x плечо: 1000$ управляет позицией 10 000$. Прибыль и убыток умножаются на 10. Движение против вас на 10% = потеря всего депозита (ликвидация)." },
                  { title: "Шорт (Short)", color: "text-red-400", bc: "border-red-500/30 bg-red-500/5", desc: "Продаёте актив, которого у вас нет (берёте в долг у биржи). Зарабатываете на падении цены. При росте — убыток. Риск шорта теоретически неограничен." },
                  { title: "Ликвидация", color: "text-orange-400", bc: "border-orange-500/30 bg-orange-500/5", desc: "Биржа принудительно закрывает позицию при достижении уровня ликвидации. Вы теряете весь маржинальный залог. Никогда не торгуйте без стопа на фьючерсах." },
                ].map((item, i) => (
                  <div key={i} className={`border rounded-xl p-3 ${item.bc}`}>
                    <div className={`font-orbitron text-xs font-bold mb-1 ${item.color}`}>{item.title}</div>
                    <p className="text-zinc-400 text-xs font-space-mono leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
              <div className="bg-zinc-900 border border-red-500/20 rounded-xl p-3 mt-3">
                <div className="text-red-400 font-orbitron text-xs font-bold mb-1">Формула цены ликвидации (лонг):</div>
                <code className="text-green-400 font-space-mono text-xs block bg-zinc-950 rounded p-2 mt-1">
                  Цена ликвидации = Цена входа × (1 - 1/Плечо + Ставка обслуживания)
                </code>
                <p className="text-zinc-500 text-xs font-space-mono mt-2">Пример: Лонг BTC по $50,000 с плечом 10x → ликвидация ≈ $45,500 (падение ~9%)</p>
              </div>
            </div>

            <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4">
              <div className="text-white font-orbitron text-xs font-bold mb-3">Алгоритм выставления ордеров: профессиональный чеклист</div>
              <div className="space-y-2">
                {[
                  { n: "1", text: "Определяю направление на D1/H4 (только по тренду или чёткая зона разворота)", color: "text-blue-400" },
                  { n: "2", text: "Нахожу точку входа на H1/M15 — ближе к уровню или OB, не в середине движения", color: "text-blue-400" },
                  { n: "3", text: "Ставлю лимитный ордер на уровень, а не рыночный — экономлю на комиссии и цене", color: "text-green-400" },
                  { n: "4", text: "Сразу выставляю SL за ближайшую структуру (не в процентах вслепую)", color: "text-red-400" },
                  { n: "5", text: "Рассчитываю размер позиции: риск 1% депо / размер стопа в $ = количество единиц", color: "text-yellow-400" },
                  { n: "6", text: "Выставляю TP или переношу в OCO. Ухожу от экрана. Не слежу каждую минуту.", color: "text-purple-400" },
                ].map((step, i) => (
                  <div key={i} className="flex items-start gap-3 bg-zinc-900 rounded-lg px-3 py-2">
                    <span className={`font-orbitron font-bold text-sm shrink-0 ${step.color}`}>{step.n}</span>
                    <span className="text-zinc-300 text-xs font-space-mono leading-relaxed">{step.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )
      },
      {
        title: "Стоп-ордера: защита капитала",
        content: (
          <div className="space-y-3">
            <p className="text-gray-300 leading-relaxed">Стоп-ордера — это ваша страховка. Профессионалы всегда ставят стопы до входа в сделку, а не после.</p>
            <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4">
              <svg viewBox="0 0 360 120" className="w-full h-28">
                {/* Price line */}
                <polyline points="20,80 80,75 120,60 160,55 200,65 240,50 270,40 290,30" fill="none" stroke="#e5e7eb" strokeWidth="2" />
                {/* Entry point */}
                <circle cx="120" cy="60" r="4" fill="#60a5fa" />
                <text x="125" y="55" fontSize="8" fill="#60a5fa" fontFamily="monospace">ВХОД $100</text>
                {/* Stop Loss */}
                <line x1="20" y1="90" x2="340" y2="90" stroke="#ef4444" strokeWidth="1" strokeDasharray="5,3" />
                <text x="250" y="87" fontSize="8" fill="#ef4444" fontFamily="monospace">STOP-LOSS $93 (-7%)</text>
                {/* Take Profit */}
                <line x1="20" y1="20" x2="340" y2="20" stroke="#22c55e" strokeWidth="1" strokeDasharray="5,3" />
                <text x="245" y="17" fontSize="8" fill="#22c55e" fontFamily="monospace">TAKE-PROFIT $121 (+21%)</text>
                {/* R:R annotation */}
                <line x1="350" y1="20" x2="350" y2="90" stroke="#a78bfa" strokeWidth="1" />
                <text x="310" y="58" fontSize="8" fill="#a78bfa" fontFamily="monospace">R:R = 1:3</text>
              </svg>
            </div>
            <div className="space-y-2 text-sm">
              <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-3">
                <div className="text-red-400 font-orbitron text-xs font-bold mb-1">Где ставить Stop-Loss?</div>
                <p className="text-zinc-400 text-xs font-space-mono leading-relaxed">За последний значимый уровень поддержки/сопротивления, за тень последней свечи, или фиксированный % от входа. Не ставьте стоп «на круглых числах» — там его часто выбивают намеренно.</p>
              </div>
              <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-3">
                <div className="text-yellow-400 font-orbitron text-xs font-bold mb-1">Трейлинг-стоп: автоматическое сохранение прибыли</div>
                <p className="text-zinc-400 text-xs font-space-mono leading-relaxed">Трейлинг-стоп следует за ценой на фиксированном расстоянии. Если BTC вырос с $42к до $48к, а трейлинг-стоп стоит на 5% ниже — он передвинется до $45,600. При откате закроет позицию, зафиксировав прибыль.</p>
              </div>
            </div>
          </div>
        )
      },
    ]
  },
  {
    id: "analysis",
    badge: "Глава 3",
    title: "Технический анализ: основы чтения графиков",
    summary: "Технический анализ — изучение исторических данных о цене и объёме для прогнозирования будущих движений. Используется большинством трейдеров во всех рынках.",
    sections: [
      {
        title: "Тайм-фреймы и стили торговли",
        content: (
          <div className="space-y-3">
            <p className="text-gray-300 leading-relaxed">Выбор тайм-фрейма определяет вашу жизнь как трейдера: сколько времени тратить, какой стресс испытывать, какой капитал нужен.</p>
            <TimeframeTable />
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
              <div className="text-white font-orbitron text-xs font-bold mb-2">Принцип «сверху вниз» (Top-Down Analysis)</div>
              <div className="flex items-center gap-2 text-xs font-space-mono text-zinc-400">
                <div className="bg-blue-500/20 border border-blue-500/30 rounded px-2 py-1 text-blue-300">W1: Тренд</div>
                <span className="text-zinc-600">→</span>
                <div className="bg-purple-500/20 border border-purple-500/30 rounded px-2 py-1 text-purple-300">D1: Контекст</div>
                <span className="text-zinc-600">→</span>
                <div className="bg-yellow-500/20 border border-yellow-500/30 rounded px-2 py-1 text-yellow-300">H4: Зона входа</div>
                <span className="text-zinc-600">→</span>
                <div className="bg-green-500/20 border border-green-500/30 rounded px-2 py-1 text-green-300">H1: Точный вход</div>
              </div>
              <p className="text-zinc-500 text-xs mt-2">Никогда не торгуйте «против» старшего тайм-фрейма — это один из главных принципов технического анализа.</p>
            </div>
          </div>
        )
      },
      {
        title: "Японские свечи: паттерны разворота",
        content: (
          <div className="space-y-3">
            <p className="text-gray-300 leading-relaxed">Японские свечи придумали рисовые трейдеры в Японии XVII века. Сегодня это стандарт во всём мире. Каждая свеча рассказывает о борьбе быков и медведей за период.</p>
            <CandlestickChart />
            <CandlePatternCards />
            <div className="bg-zinc-900 border border-yellow-500/20 rounded-xl p-4">
              <div className="text-yellow-400 font-orbitron text-xs font-bold mb-2">Важное правило</div>
              <p className="text-zinc-400 text-xs font-space-mono leading-relaxed">Паттерн свечи — это предположение, а не гарантия. Всегда ждите подтверждения: следующая свеча должна подтвердить разворот, а объём должен быть выше среднего. Без подтверждения — это просто красивая картинка.</p>
            </div>
          </div>
        )
      },
      {
        title: "Уровни поддержки и сопротивления",
        content: (
          <div className="space-y-3">
            <p className="text-gray-300 leading-relaxed">Уровни — основа технического анализа. Цена «помнит» исторические уровни и часто возвращается к ним снова и снова.</p>
            <SupportResistanceChart />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-3">
                <div className="text-green-400 font-orbitron text-xs font-bold mb-1">Поддержка</div>
                <p className="text-zinc-400 text-xs">Уровень, где покупатели «защищают» цену. Много раз останавливал падение. Хорошее место для покупки.</p>
              </div>
              <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-3">
                <div className="text-red-400 font-orbitron text-xs font-bold mb-1">Сопротивление</div>
                <p className="text-zinc-400 text-xs">Уровень, где продавцы «давят» цену вниз. Много раз тормозил рост. Хорошее место для продажи.</p>
              </div>
              <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-3">
                <div className="text-yellow-400 font-orbitron text-xs font-bold mb-1">Смена ролей</div>
                <p className="text-zinc-400 text-xs">После пробоя поддержка становится сопротивлением и наоборот. Это одна из самых надёжных закономерностей в ТА.</p>
              </div>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
              <div className="text-white font-orbitron text-xs font-bold mb-2">Как определять сильные уровни</div>
              <ul className="text-zinc-400 text-xs font-space-mono space-y-1 list-none">
                <li>→ Минимум 2–3 касания — слабый уровень, 4+ — сильный</li>
                <li>→ Много объёма при формировании уровня — он значимее</li>
                <li>→ Психологические числа: $40,000, $50,000, $100 — работают как магниты</li>
                <li>→ Уровни на D1 и W1 сильнее, чем на M15 или H1</li>
                <li>→ Недельные и месячные закрытия цены — особенно важные уровни</li>
              </ul>
            </div>
          </div>
        )
      },
      {
        title: "▲ Продвинутый уровень: VSA, ложные пробои и объёмный анализ",
        content: (
          <div className="space-y-4">
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 flex gap-2 items-center">
              <span className="text-red-400 text-lg">⚠</span>
              <p className="text-red-300 text-xs font-space-mono">Продвинутый раздел. Требует знания основ теханализа, японских свечей и уровней поддержки/сопротивления.</p>
            </div>

            <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4">
              <div className="text-white font-orbitron text-xs font-bold mb-3">VSA (Volume Spread Analysis) — анализ объёма и спреда</div>
              <p className="text-gray-300 text-sm leading-relaxed mb-3">VSA — методология чтения рынка через соотношение объёма торгов и диапазона (спреда) свечи. Позволяет понять, что делают «умные деньги», ещё до движения цены.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { title: "Ап-бар с высоким объёмом", color: "text-green-400", bc: "border-green-500/20 bg-green-500/5", desc: "Большая бычья свеча + высокий объём. Сила покупателей подтверждена. Признак продолжения или начала роста. Если появляется на уровне поддержки — очень сильный сигнал." },
                  { title: "Даун-бар с низким объёмом", color: "text-blue-400", bc: "border-blue-500/20 bg-blue-500/5", desc: "Падение на низком объёме = нет давления продавцов. Вероятный разворот или коррекция. Рынок просто «сползает» без участия крупных игроков — слабость." },
                  { title: "No Demand (нет спроса)", color: "text-yellow-400", bc: "border-yellow-500/20 bg-yellow-500/5", desc: "Бычья свеча с узким спредом и низким объёмом на вершине тренда. Покупатели иссякли. Медведи скоро возьмут контроль. Сигнал к выходу из лонга." },
                  { title: "No Supply (нет предложения)", color: "text-purple-400", bc: "border-purple-500/20 bg-purple-500/5", desc: "Медвежья свеча с узким спредом и низким объёмом на дне. Продавцы закончились. Сигнал к потенциальному развороту вверх. Ищем подтверждение бычьим баром." },
                ].map((item, i) => (
                  <div key={i} className={`border rounded-xl p-3 ${item.bc}`}>
                    <div className={`font-orbitron text-xs font-bold mb-1 ${item.color}`}>{item.title}</div>
                    <p className="text-zinc-400 text-xs font-space-mono leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4">
              <div className="text-white font-orbitron text-xs font-bold mb-3">Ложные пробои (Fakeout / Stop Hunt)</div>
              <p className="text-gray-300 text-sm leading-relaxed mb-3">Ложный пробой — одна из самых частых ловушек для розничных трейдеров. Цена пробивает уровень, провоцируя вход, а затем разворачивается. Научитесь их распознавать — и не попадать в них.</p>
              <svg viewBox="0 0 360 140" className="w-full h-36">
                <line x1="30" y1="60" x2="330" y2="60" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="6,3" />
                <text x="332" y="64" fontSize="8" fill="#ef4444" fontFamily="monospace">Сопр.</text>
                <polyline points="30,120 70,100 110,80 150,65 180,45 185,55 190,62 200,68 230,55 270,38 310,25" fill="none" stroke="#e5e7eb" strokeWidth="2" />
                <circle cx="180" cy="45" r="5" fill="#ef4444" />
                <text x="160" y="38" fontSize="7" fill="#ef4444" fontFamily="monospace">Пробой (ловушка)</text>
                <circle cx="200" cy="68" r="4" fill="#22c55e" />
                <text x="205" y="72" fontSize="7" fill="#22c55e" fontFamily="monospace">Реальное движение</text>
                <text x="90" y="135" fontSize="7" fill="#52525b" fontFamily="monospace">Цена пробила уровень, выбила стопы и пошла вверх</text>
              </svg>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3">
                {[
                  { title: "Признаки ложного пробоя", color: "text-red-400", items: ["Закрытие свечи обратно за уровень", "Низкий объём при пробое", "Длинная тень свечи за уровнем", "Быстрый разворот за 1–2 свечи"] },
                  { title: "Как не попасться", color: "text-yellow-400", items: ["Ждать закрытие свечи за уровнем", "Проверять объём при пробое", "Не входить сразу — ждать ретест", "Стоп ставить за тень пробойной свечи"] },
                  { title: "Торговля ложных пробоев", color: "text-green-400", items: ["Вход при возврате обратно за уровень", "Стоп за хай/лой ложного пробоя", "TP на ближайшем противоположном уровне", "Один из лучших паттернов для трейдинга"] },
                ].map((col, i) => (
                  <div key={i} className="bg-zinc-900 rounded-xl p-3">
                    <div className={`font-orbitron text-xs font-bold mb-2 ${col.color}`}>{col.title}</div>
                    <ul className="space-y-1">
                      {col.items.map((item, j) => (
                        <li key={j} className="text-zinc-400 text-xs font-space-mono flex gap-1.5"><span className={col.color}>→</span>{item}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4">
              <div className="text-white font-orbitron text-xs font-bold mb-3">Продвинутые паттерны: Голова и плечи, Двойное дно/вершина</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="text-red-400 font-orbitron text-xs font-bold mb-2">Голова и плечи (H&S)</div>
                  <svg viewBox="0 0 180 100" className="w-full h-24">
                    <line x1="10" y1="75" x2="170" y2="75" stroke="#52525b" strokeWidth="1" strokeDasharray="3,2" />
                    <text x="155" y="73" fontSize="6" fill="#52525b" fontFamily="monospace">Шея</text>
                    <polyline points="10,75 30,60 50,75 80,35 110,75 130,55 150,75" fill="none" stroke="#e5e7eb" strokeWidth="1.5" />
                    <text x="72" y="28" fontSize="7" fill="#ef4444" fontFamily="monospace">Голова</text>
                    <text x="20" y="55" fontSize="6" fill="#a78bfa" fontFamily="monospace">Пл.</text>
                    <text x="125" y="50" fontSize="6" fill="#a78bfa" fontFamily="monospace">Пл.</text>
                    <polyline points="150,75 165,95" fill="none" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="3,2" />
                    <text x="150" y="100" fontSize="6" fill="#ef4444" fontFamily="monospace">Цель</text>
                  </svg>
                  <p className="text-zinc-400 text-xs font-space-mono mt-2 leading-relaxed">Паттерн разворота на вершине тренда. Вход при пробое линии шеи. Цель = расстояние от головы до шеи, отложенное вниз.</p>
                </div>
                <div>
                  <div className="text-green-400 font-orbitron text-xs font-bold mb-2">Двойное дно (Double Bottom)</div>
                  <svg viewBox="0 0 180 100" className="w-full h-24">
                    <line x1="10" y1="30" x2="170" y2="30" stroke="#52525b" strokeWidth="1" strokeDasharray="3,2" />
                    <text x="155" y="28" fontSize="6" fill="#52525b" fontFamily="monospace">Шея</text>
                    <polyline points="10,30 30,65 50,30 100,30 130,65 150,30" fill="none" stroke="#e5e7eb" strokeWidth="1.5" />
                    <text x="22" y="78" fontSize="6" fill="#22c55e" fontFamily="monospace">Дно 1</text>
                    <text x="122" y="78" fontSize="6" fill="#22c55e" fontFamily="monospace">Дно 2</text>
                    <polyline points="150,30 165,10" fill="none" stroke="#22c55e" strokeWidth="1.5" strokeDasharray="3,2" />
                    <text x="150" y="8" fontSize="6" fill="#22c55e" fontFamily="monospace">Цель</text>
                  </svg>
                  <p className="text-zinc-400 text-xs font-space-mono mt-2 leading-relaxed">Паттерн разворота на дне. Два равных дна + пробой шеи = сильный сигнал. Второе дно часто на меньшем объёме — признак слабости продавцов.</p>
                </div>
              </div>
            </div>
          </div>
        )
      },
    ]
  },
  {
    id: "indicators",
    badge: "Глава 4",
    title: "Индикаторы: как использовать без перегрузки",
    summary: "Индикаторы помогают подтверждать сигналы, но не заменяют понимание рынка. Важно использовать минимальный набор и понимать логику каждого.",
    sections: [
      {
        title: "Обзор популярных индикаторов",
        content: (
          <div className="space-y-3">
            <p className="text-gray-300 leading-relaxed">Существуют сотни индикаторов, но большинство дублируют друг друга. Ниже — всё, что нужно знать о главных из них.</p>
            <IndicatorsComparisonTable />
            <div className="bg-zinc-900 border border-red-500/20 rounded-xl p-4">
              <div className="text-red-400 font-orbitron text-xs font-bold mb-2">Главная ошибка новичков</div>
              <p className="text-zinc-400 text-xs font-space-mono leading-relaxed">Добавлять всё больше индикаторов в надежде найти «идеальный сигнал». На самом деле — чем больше индикаторов, тем больше противоречивых сигналов. Профессионалы используют 2–3 индикатора максимум.</p>
            </div>
          </div>
        )
      },
      {
        title: "Скользящие средние (MA): тренд и точки входа",
        content: (
          <div className="space-y-3">
            <p className="text-gray-300 leading-relaxed">MA — самый популярный инструмент. Сглаживает шум цены и показывает направление тренда.</p>
            <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4">
              <svg viewBox="0 0 360 140" className="w-full h-36">
                {[60,90,120].map(y => <line key={y} x1="20" y1={y} x2="340" y2={y} stroke="#27272a" strokeWidth="0.8" />)}
                {/* Price */}
                <polyline points="20,120 50,110 80,100 110,90 90,85 120,75 150,65 130,60 160,50 190,45 210,40 240,35 270,30 300,25 330,20" fill="none" stroke="#e5e7eb" strokeWidth="1.5" />
                {/* EMA20 (fast) */}
                <polyline points="20,118 50,108 80,98 110,88 90,84 120,73 150,62 130,58 160,48 190,43 210,38 240,33 270,28 300,23 330,18" fill="none" stroke="#22c55e" strokeWidth="2" strokeDasharray="0" />
                {/* EMA50 (slow) */}
                <polyline points="20,122 50,115 80,108 110,100 100,96 130,88 160,78 145,73 175,62 205,55 225,49 255,43 285,37 315,31 340,26" fill="none" stroke="#ef4444" strokeWidth="2" />
                {/* Golden cross marker */}
                <circle cx="195" cy="50" r="6" fill="none" stroke="#fbbf24" strokeWidth="1.5" />
                <text x="200" y="43" fontSize="8" fill="#fbbf24" fontFamily="monospace">Golden Cross</text>
                {/* MA200 */}
                <line x1="20" y1="108" x2="340" y2="95" stroke="#a78bfa" strokeWidth="1.5" strokeDasharray="4,2" />
                <text x="250" y="92" fontSize="8" fill="#a78bfa" fontFamily="monospace">EMA 200</text>
                {/* Legend */}
                <line x1="20" y1="135" x2="35" y2="135" stroke="#22c55e" strokeWidth="2" />
                <text x="38" y="138" fontSize="7" fill="#86efac" fontFamily="monospace">EMA20 (быстрая)</text>
                <line x1="130" y1="135" x2="145" y2="135" stroke="#ef4444" strokeWidth="2" />
                <text x="148" y="138" fontSize="7" fill="#fca5a5" fontFamily="monospace">EMA50 (медленная)</text>
              </svg>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="bg-zinc-900 border border-green-500/20 rounded-lg p-3">
                <div className="text-green-400 font-orbitron text-xs font-bold mb-1">Golden Cross 🐂</div>
                <p className="text-zinc-400 text-xs font-space-mono">EMA20 пересекает EMA50 снизу вверх. Сигнал на покупку. Наиболее значим на H4 и D1. На меньших ТФ — много ложных сигналов.</p>
              </div>
              <div className="bg-zinc-900 border border-red-500/20 rounded-lg p-3">
                <div className="text-red-400 font-orbitron text-xs font-bold mb-1">Death Cross 🐻</div>
                <p className="text-zinc-400 text-xs font-space-mono">EMA20 пересекает EMA50 сверху вниз. Сигнал на продажу. Самый известный пример — Death Cross BTC в мае 2021.</p>
              </div>
            </div>
            <div className="bg-zinc-900 border border-purple-500/20 rounded-lg p-3">
              <div className="text-purple-400 font-orbitron text-xs font-bold mb-1">MA200 — маркер бычьего/медвежьего рынка</div>
              <p className="text-zinc-400 text-xs font-space-mono">Цена выше MA200 на D1 = бычий рынок. Ниже = медвежий. Используйте это как главный фильтр направления. Покупайте только выше MA200, продавайте только ниже.</p>
            </div>
          </div>
        )
      },
      {
        title: "RSI и дивергенция — как распознать разворот",
        content: (
          <div className="space-y-3">
            <p className="text-gray-300 leading-relaxed">RSI — осциллятор от 0 до 100, показывающий «перегрев» рынка. Самый ценный его сигнал — дивергенция.</p>
            <RSIChart />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-3">
                <div className="text-red-400 font-orbitron text-xs font-bold mb-1">RSI &gt; 70: перекупленность</div>
                <p className="text-zinc-400 text-xs font-space-mono">Цена росла слишком быстро. Возможен откат. Но в сильном тренде RSI может оставаться выше 70 неделями. Не продавайте только потому что RSI высокий.</p>
              </div>
              <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-3">
                <div className="text-green-400 font-orbitron text-xs font-bold mb-1">RSI &lt; 30: перепроданность</div>
                <p className="text-zinc-400 text-xs font-space-mono">Цена падала слишком быстро. Возможен отскок. В медвежьем рынке RSI может долго быть ниже 30. Покупка на перепроданности в нисходящем тренде — ошибка.</p>
              </div>
            </div>
            <div className="bg-zinc-900 border border-yellow-500/20 rounded-xl p-4">
              <div className="text-yellow-400 font-orbitron text-xs font-bold mb-2">Дивергенция RSI — самый сильный сигнал</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-space-mono">
                <div>
                  <div className="text-green-400 mb-1">Бычья дивергенция:</div>
                  <p className="text-zinc-400">Цена делает новый минимум, RSI — нет. Значит: медведи слабеют. Возможен разворот вверх.</p>
                </div>
                <div>
                  <div className="text-red-400 mb-1">Медвежья дивергенция:</div>
                  <p className="text-zinc-400">Цена делает новый максимум, RSI — нет. Значит: быки слабеют. Возможен разворот вниз.</p>
                </div>
              </div>
            </div>
          </div>
        )
      },
      {
        title: "MACD и объём: подтверждение движений",
        content: (
          <div className="space-y-3">
            <p className="text-gray-300 leading-relaxed">MACD (Moving Average Convergence Divergence) — один из лучших инструментов для определения силы и направления тренда.</p>
            <MACDChart />
            <div className="space-y-2 text-xs font-space-mono">
              <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-3">
                <div className="text-blue-400 font-bold mb-1">Как читать MACD</div>
                <ul className="text-zinc-400 space-y-1">
                  <li>→ Синяя линия (MACD) пересекает жёлтую (Signal) снизу вверх = покупка</li>
                  <li>→ Синяя пересекает жёлтую сверху вниз = продажа</li>
                  <li>→ Гистограмма выше нуля = бычий импульс, ниже нуля = медвежий</li>
                  <li>→ Дивергенция MACD работает так же, как дивергенция RSI</li>
                </ul>
              </div>
              <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-3">
                <div className="text-yellow-400 font-bold mb-1">Объём — король подтверждения</div>
                <ul className="text-zinc-400 space-y-1">
                  <li>→ Рост цены + рост объёма = сильное движение, доверяем</li>
                  <li>→ Рост цены + падение объёма = слабое движение, осторожно</li>
                  <li>→ Пробой уровня без объёма = скорее всего ложный пробой</li>
                  <li>→ Аномальный объём (spike) = крупный игрок входит или выходит</li>
                </ul>
              </div>
            </div>
          </div>
        )
      },
      {
        title: "▲ Продвинутый уровень: Ичимоку, скрытые дивергенции и мультитаймфреймный анализ",
        content: (
          <div className="space-y-4">
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 flex gap-2 items-center">
              <span className="text-red-400 text-lg">⚠</span>
              <p className="text-red-300 text-xs font-space-mono">Продвинутый раздел. Требует уверенного знания MA, RSI, MACD и базовых принципов теханализа.</p>
            </div>

            <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4">
              <div className="text-white font-orbitron text-xs font-bold mb-3">Облако Ичимоку (Ichimoku Kinko Hyo)</div>
              <p className="text-gray-300 text-sm leading-relaxed mb-3">Ичимоку — комплексный индикатор, который одновременно показывает тренд, уровни поддержки/сопротивления, импульс и сигналы входа. Пять линий в одном.</p>
              <div className="bg-zinc-900 rounded-xl p-3">
                <svg viewBox="0 0 360 130" className="w-full h-32">
                  {/* Cloud (Kumo) */}
                  <path d="M 40,50 L 200,40 L 200,75 L 40,85 Z" fill="#22c55e" fillOpacity="0.15" />
                  <path d="M 200,40 L 340,30 L 340,60 L 200,75 Z" fill="#ef4444" fillOpacity="0.15" />
                  {/* Senkou Span A */}
                  <polyline points="40,85 120,75 200,75 260,55 340,60" fill="none" stroke="#22c55e" strokeWidth="1" />
                  {/* Senkou Span B */}
                  <polyline points="40,50 120,45 200,40 260,35 340,30" fill="none" stroke="#ef4444" strokeWidth="1" />
                  {/* Price */}
                  <polyline points="40,95 80,85 120,90 160,70 200,65 240,45 280,35 320,25" fill="none" stroke="#e5e7eb" strokeWidth="2" />
                  {/* Tenkan-sen */}
                  <polyline points="40,92 80,82 120,86 160,68 200,63 240,44 280,34 320,24" fill="none" stroke="#60a5fa" strokeWidth="1.5" strokeDasharray="0" />
                  {/* Kijun-sen */}
                  <polyline points="40,100 100,92 160,85 220,72 280,60 320,50" fill="none" stroke="#fbbf24" strokeWidth="1.5" />
                  {/* Labels */}
                  <text x="5" y="70" fontSize="6" fill="#22c55e" fontFamily="monospace">Span A</text>
                  <text x="5" y="45" fontSize="6" fill="#ef4444" fontFamily="monospace">Span B</text>
                  <text x="5" y="95" fontSize="6" fill="#60a5fa" fontFamily="monospace">Tenkan</text>
                  <text x="5" y="105" fontSize="6" fill="#fbbf24" fontFamily="monospace">Kijun</text>
                  <text x="155" y="125" fontSize="7" fill="#52525b" textAnchor="middle" fontFamily="monospace">Цена выше облака = бычий тренд</text>
                </svg>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3 text-xs font-space-mono">
                {[
                  { name: "Tenkan-sen (9)", color: "text-blue-400", desc: "Быстрая линия. Средняя за 9 периодов. Пересечение с Kijun — сигнал входа. Направление = краткосрочный тренд." },
                  { name: "Kijun-sen (26)", color: "text-yellow-400", desc: "Медленная линия. Средняя за 26 периодов. Уровень поддержки/сопротивления. Пересечение Tenkan'а с Kijun = сигнал." },
                  { name: "Облако Kumo", color: "text-green-400", desc: "Зелёное облако = бычья поддержка. Красное = медвежье сопротивление. Цена выше облака — торгуем лонги. Ниже — шорты." },
                  { name: "Chikou Span", color: "text-purple-400", desc: "Цена, сдвинутая на 26 периодов назад. Если выше исторической цены — бычий сигнал. Подтверждает направление тренда." },
                ].map((item, i) => (
                  <div key={i} className="bg-zinc-900 rounded-lg p-2">
                    <div className={`font-bold mb-1 ${item.color}`}>{item.name}</div>
                    <p className="text-zinc-400 leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4">
              <div className="text-white font-orbitron text-xs font-bold mb-3">Скрытые дивергенции (Hidden Divergence)</div>
              <p className="text-gray-300 text-sm leading-relaxed mb-3">В отличие от обычных дивергенций, скрытые сигнализируют не о развороте, а о продолжении тренда. Один из мощнейших инструментов для входа в коррекцию.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-zinc-900 rounded-xl p-3">
                  <div className="text-green-400 font-orbitron text-xs font-bold mb-2">Скрытая бычья (HD+)</div>
                  <p className="text-zinc-400 text-xs font-space-mono leading-relaxed mb-2">Цена делает более высокий минимум (HL), RSI — более низкий минимум. Сигнал: коррекция в бычьем тренде. Входим на продолжение роста.</p>
                  <div className="text-xs text-zinc-500">Цена: HL ↗ | RSI: LL ↘ → Бычий сигнал</div>
                </div>
                <div className="bg-zinc-900 rounded-xl p-3">
                  <div className="text-red-400 font-orbitron text-xs font-bold mb-2">Скрытая медвежья (HD-)</div>
                  <p className="text-zinc-400 text-xs font-space-mono leading-relaxed mb-2">Цена делает более низкий максимум (LH), RSI — более высокий максимум. Сигнал: отскок в медвежьем тренде. Входим на продолжение падения.</p>
                  <div className="text-xs text-zinc-500">Цена: LH ↘ | RSI: HH ↗ → Медвежий сигнал</div>
                </div>
              </div>
            </div>

            <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4">
              <div className="text-white font-orbitron text-xs font-bold mb-3">Мультитаймфреймный анализ (MTF): торговая система</div>
              <p className="text-gray-300 text-sm leading-relaxed mb-3">Профессиональная система состоит из 3 тайм-фреймов: старший задаёт контекст, средний — зону, младший — точку входа.</p>
              <div className="overflow-x-auto">
                <table className="w-full text-xs font-space-mono">
                  <thead>
                    <tr className="border-b border-zinc-800">
                      {["Тайм-фрейм", "Роль", "Что смотрим", "Индикаторы"].map(h => (
                        <th key={h} className="text-left px-3 py-2 text-zinc-500 whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { tf: "W1 / D1", role: "Старший (контекст)", what: "Глобальный тренд, крупные уровни", ind: "MA200, Ичимоку, ключевые S/R" },
                      { tf: "H4 / H1", role: "Средний (зона)", what: "Зоны входа, структура, паттерны", ind: "RSI, MACD, EMA50" },
                      { tf: "M15 / M5", role: "Младший (триггер)", what: "Точный вход, стоп, паттерн свечи", ind: "EMA9/21, объём, стакан" },
                    ].map((row, i) => (
                      <tr key={i} className="border-b border-zinc-900 hover:bg-zinc-900/40">
                        <td className="px-3 py-2 text-blue-400 font-bold">{row.tf}</td>
                        <td className="px-3 py-2 text-zinc-300">{row.role}</td>
                        <td className="px-3 py-2 text-zinc-400">{row.what}</td>
                        <td className="px-3 py-2 text-purple-400">{row.ind}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="bg-zinc-900 border border-yellow-500/20 rounded-xl p-3 mt-3">
                <div className="text-yellow-400 font-orbitron text-xs font-bold mb-1">Правило согласования таймфреймов</div>
                <p className="text-zinc-400 text-xs font-space-mono leading-relaxed">Входите в сделку только если все три таймфрейма согласованы: D1 бычий → H4 показывает зону входа → M15 даёт триггер. При конфликте ТФ — пропускайте сетап. Ждать лучшего момента — тоже работа.</p>
              </div>
            </div>
          </div>
        )
      },
    ]
  },
  {
    id: "riskmanagement",
    badge: "Глава 5",
    title: "Риск-менеджмент: как не слить депозит",
    summary: "Риск-менеджмент важнее любой стратегии. Даже прибыльная система не спасёт, если неправильно управлять размером позиций.",
    sections: [
      {
        title: "Правило 1–2% на сделку: математика выживания",
        content: (
          <div className="space-y-3">
            <p className="text-gray-300 leading-relaxed">Главное правило трейдинга: сначала думай о том, сколько можешь потерять — и только потом о том, сколько заработаешь.</p>
            <RiskCalcTable />
            <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4">
              <svg viewBox="0 0 360 120" className="w-full h-28">
                {/* Drawdown comparison */}
                {[
                  { label: "10% риска", values: [100, 90, 81, 73, 66, 59, 53, 48, 43, 39], color: "#ef4444" },
                  { label: "2% риска", values: [100, 98, 96.1, 94.2, 92.3, 90.5, 88.7, 86.9, 85.2, 83.5], color: "#eab308" },
                  { label: "0.5% риска", values: [100, 99.5, 99, 98.5, 98, 97.5, 97, 96.5, 96, 95.5], color: "#22c55e" },
                ].map((line, li) => {
                  const maxV = 100, minV = 35, w2 = 320, h = 90, pad2 = 20
                  const px2 = (i: number) => pad2 + (i / (line.values.length - 1)) * (w2 - pad2)
                  const py2 = (v: number) => h - ((v - minV) / (maxV - minV)) * (h - 15) - 5
                  const path = line.values.map((v, i) => `${i === 0 ? "M" : "L"} ${px2(i)} ${py2(v)}`).join(" ")
                  return <path key={li} d={path} stroke={line.color} strokeWidth="2" fill="none" />
                })}
                <text x="180" y="115" fontSize="8" fill="#52525b" textAnchor="middle" fontFamily="monospace">10 последовательных убыточных сделок</text>
                <text x="20" y="12" fontSize="7" fill="#fca5a5" fontFamily="monospace">-10%/сд: капитал $39</text>
                <text x="20" y="52" fontSize="7" fill="#fde68a" fontFamily="monospace">-2%/сд: капитал $83.5</text>
                <text x="20" y="72" fontSize="7" fill="#86efac" fontFamily="monospace">-0.5%/сд: капитал $95.5</text>
              </svg>
            </div>
            <div className="bg-zinc-900 border border-red-500/20 rounded-xl p-4">
              <div className="text-red-400 font-orbitron text-xs font-bold mb-2">Математика ловушки</div>
              <p className="text-zinc-400 text-xs font-space-mono leading-relaxed">Потеряли 50% — нужно заработать 100% чтобы вернуться. Потеряли 25% — нужно 33%. Именно поэтому главное правило — не потерять много, а не заработать много.</p>
            </div>
          </div>
        )
      },
      {
        title: "Соотношение риск/прибыль (R:R): математика прибыльности",
        content: (
          <div className="space-y-3">
            <p className="text-gray-300 leading-relaxed">R:R позволяет быть прибыльным даже с низким процентом выигрышей. Это контр-интуитивно, но математически верно.</p>
            <RRTable />
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
              <div className="text-white font-orbitron text-xs font-bold mb-3">Пример расчёта прибыльности за 100 сделок</div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-space-mono">
                {[
                  { rr: "1:1", win: 60, lose: 40, profit: "+20R", color: "text-yellow-400" },
                  { rr: "1:2", win: 40, lose: 60, profit: "+20R", color: "text-green-400" },
                  { rr: "1:3", win: 30, lose: 70, profit: "+20R", color: "text-emerald-400" },
                ].map((ex, i) => (
                  <div key={i} className="bg-zinc-950 rounded-lg p-3">
                    <div className={`font-bold text-base mb-2 ${ex.color}`}>R:R = {ex.rr}</div>
                    <div className="text-green-400">{ex.win} побед × {ex.rr.split(":")[1]}R = +{ex.win * parseInt(ex.rr.split(":")[1])}R</div>
                    <div className="text-red-400">{ex.lose} потерь × 1R = -{ex.lose}R</div>
                    <div className="border-t border-zinc-800 mt-2 pt-2 text-white font-bold">Итого: {ex.profit}</div>
                  </div>
                ))}
              </div>
              <p className="text-zinc-500 text-xs mt-3">При R:R 1:2 — выигрывайте только 40% сделок и всё равно будете в прибыли.</p>
            </div>
          </div>
        )
      },
      {
        title: "Торговый журнал и анализ своих сделок",
        content: (
          <div className="space-y-3">
            <p className="text-gray-300 leading-relaxed">Журнал — единственный способ расти как трейдер. Без данных нет анализа, без анализа нет роста.</p>
            <TradingJournalTemplate />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-3">
                <div className="text-white font-orbitron text-xs font-bold mb-2">Что анализировать через 50 сделок</div>
                <ul className="text-zinc-400 text-xs font-space-mono space-y-1">
                  <li>→ Win Rate по каждому активу</li>
                  <li>→ Средний R:R реально vs планируемый</li>
                  <li>→ Лучшее время суток для торговли</li>
                  <li>→ Какой тайм-фрейм даёт лучший результат</li>
                  <li>→ Повторяющиеся ошибки</li>
                </ul>
              </div>
              <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-3">
                <div className="text-white font-orbitron text-xs font-bold mb-2">Психологические ошибки в журнале</div>
                <ul className="text-zinc-400 text-xs font-space-mono space-y-1">
                  <li>→ Ранний выход из прибыльных сделок</li>
                  <li>→ Сдвиг Stop-Loss в убыток («чуть подождать»)</li>
                  <li>→ Месть рынку после серии потерь</li>
                  <li>→ Слишком ранний вход без подтверждения</li>
                  <li>→ Игнорирование собственного плана</li>
                </ul>
              </div>
            </div>
            <div className="bg-zinc-900 border border-green-500/20 rounded-xl p-4">
              <div className="text-green-400 font-orbitron text-xs font-bold mb-2">Инструменты для ведения журнала</div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-space-mono">
                {["Notion", "Google Sheets", "Tradervue", "Edgewonk"].map(t => (
                  <div key={t} className="bg-zinc-950 rounded px-3 py-2 text-center text-zinc-300">{t}</div>
                ))}
              </div>
            </div>
          </div>
        )
      },
      {
        title: "▲ Продвинутый уровень: формула Келли, Drawdown-анализ и портфельный риск",
        content: (
          <div className="space-y-4">
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 flex gap-2 items-center">
              <span className="text-red-400 text-lg">⚠</span>
              <p className="text-red-300 text-xs font-space-mono">Продвинутый раздел. Математика управления капиталом для опытных трейдеров с реальной статистикой сделок.</p>
            </div>

            <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4">
              <div className="text-white font-orbitron text-xs font-bold mb-3">Критерий Келли: оптимальный размер позиции</div>
              <p className="text-gray-300 text-sm leading-relaxed mb-3">Формула Келли рассчитывает оптимальный % капитала для каждой сделки, максимизируя рост с учётом вашей win rate и R:R. Используется хедж-фондами и профессиональными трейдерами.</p>
              <div className="bg-zinc-900 rounded-xl p-4 mb-3">
                <div className="text-purple-400 font-orbitron text-xs font-bold mb-2">Формула Келли:</div>
                <code className="block bg-zinc-950 rounded p-3 font-space-mono text-sm text-green-400 mb-2">
                  K% = W - (1 - W) / R
                </code>
                <div className="text-xs font-space-mono text-zinc-400 space-y-1">
                  <div><span className="text-blue-400">W</span> — Win Rate (доля прибыльных сделок, от 0 до 1)</div>
                  <div><span className="text-blue-400">R</span> — отношение средней прибыли к среднему убытку (avg win / avg loss)</div>
                  <div><span className="text-blue-400">K%</span> — % капитала на одну сделку</div>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-space-mono">
                {[
                  { wr: "55%", r: "1.5", k: "21.7%", rec: "10.8%", color: "text-yellow-400" },
                  { wr: "45%", r: "2.0", k: "17.5%", rec: "8.7%", color: "text-green-400" },
                  { wr: "40%", r: "2.5", k: "16%", rec: "8%", color: "text-emerald-400" },
                ].map((ex, i) => (
                  <div key={i} className="bg-zinc-900 rounded-xl p-3">
                    <div className={`font-bold mb-2 ${ex.color}`}>WR={ex.wr}, R={ex.r}</div>
                    <div className="text-zinc-300">Формула: {ex.k}</div>
                    <div className="text-zinc-500 mt-1">Рекомендую: {ex.rec}</div>
                    <div className="text-zinc-600 text-xs mt-1">(половина Келли)</div>
                  </div>
                ))}
              </div>
              <div className="bg-zinc-900 border border-yellow-500/20 rounded-xl p-3 mt-3">
                <div className="text-yellow-400 font-orbitron text-xs font-bold mb-1">Важно: половина Келли</div>
                <p className="text-zinc-400 text-xs font-space-mono leading-relaxed">На практике используют половину от полного Келли (Fractional Kelly). Это снижает волатильность капитала на 50%, теряя лишь незначительную часть прироста. Полный Келли — слишком агрессивен даже для профессионалов.</p>
              </div>
            </div>

            <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4">
              <div className="text-white font-orbitron text-xs font-bold mb-3">Drawdown-анализ: когда остановиться</div>
              <p className="text-gray-300 text-sm leading-relaxed mb-3">Drawdown (просадка) — снижение капитала от пиковой отметки. Понимание просадок — ключ к психологической устойчивости и защите депозита.</p>
              <div className="bg-zinc-900 rounded-xl p-3 mb-3">
                <svg viewBox="0 0 360 120" className="w-full h-28">
                  <polyline points="20,90 50,80 80,65 110,55 130,70 155,85 170,95 185,90 210,75 240,60 270,45 310,30 340,20" fill="none" stroke="#e5e7eb" strokeWidth="1.5" />
                  {/* Peak */}
                  <circle cx="110" cy="55" r="3" fill="#22c55e" />
                  <line x1="110" y1="55" x2="110" y2="110" stroke="#22c55e" strokeWidth="0.8" strokeDasharray="3,2" />
                  <text x="112" y="50" fontSize="7" fill="#22c55e" fontFamily="monospace">Пик</text>
                  {/* Bottom */}
                  <circle cx="170" cy="95" r="3" fill="#ef4444" />
                  <line x1="170" y1="95" x2="170" y2="110" stroke="#ef4444" strokeWidth="0.8" strokeDasharray="3,2" />
                  <text x="172" y="104" fontSize="7" fill="#ef4444" fontFamily="monospace">Дно</text>
                  {/* Drawdown arrow */}
                  <line x1="110" y1="55" x2="170" y2="55" stroke="#a78bfa" strokeWidth="0.8" />
                  <line x1="170" y1="55" x2="170" y2="95" stroke="#a78bfa" strokeWidth="1" />
                  <text x="175" y="78" fontSize="7" fill="#a78bfa" fontFamily="monospace">DD</text>
                  {/* Recovery */}
                  <line x1="170" y1="55" x2="240" y2="55" stroke="#fbbf24" strokeWidth="0.8" strokeDasharray="3,2" />
                  <text x="195" y="50" fontSize="7" fill="#fbbf24" fontFamily="monospace">Восстановление</text>
                  <text x="100" y="118" fontSize="7" fill="#52525b" textAnchor="middle" fontFamily="monospace">Время</text>
                </svg>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs font-space-mono">
                  <thead>
                    <tr className="border-b border-zinc-800">
                      {["Просадка", "Нужно заработать", "Сигнал", "Действие"].map(h => (
                        <th key={h} className="text-left px-3 py-2 text-zinc-500 whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { dd: "5%", need: "5.3%", signal: "Норма", action: "Продолжаем торговать", color: "text-green-400" },
                      { dd: "10%", need: "11.1%", signal: "Обратить внимание", action: "Снизить объёмы на 50%", color: "text-yellow-400" },
                      { dd: "20%", need: "25%", signal: "Стоп-день/неделя", action: "Пауза, анализ ошибок", color: "text-orange-400" },
                      { dd: "30%", need: "42.8%", signal: "Критическая просадка", action: "Пауза 2+ недели, пересмотр системы", color: "text-red-400" },
                      { dd: "50%", need: "100%", signal: "Катастрофа", action: "Полная остановка, работа с психологом", color: "text-red-600" },
                    ].map((row, i) => (
                      <tr key={i} className="border-b border-zinc-900 hover:bg-zinc-900/40">
                        <td className={`px-3 py-2 font-bold ${row.color}`}>{row.dd}</td>
                        <td className="px-3 py-2 text-zinc-300">{row.need}</td>
                        <td className={`px-3 py-2 ${row.color}`}>{row.signal}</td>
                        <td className="px-3 py-2 text-zinc-400">{row.action}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4">
              <div className="text-white font-orbitron text-xs font-bold mb-3">Портфельный риск: торговля несколькими позициями</div>
              <p className="text-gray-300 text-sm leading-relaxed mb-3">При открытии нескольких позиций одновременно риски складываются. Коррелированные активы увеличивают общий портфельный риск, даже если каждая позиция маленькая.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="text-red-400 font-orbitron text-xs font-bold mb-2">Опасная ситуация</div>
                  {[
                    { pos: "BTC/USDT Long", risk: "2%", corr: "Высокая" },
                    { pos: "ETH/USDT Long", risk: "2%", corr: "Высокая" },
                    { pos: "SOL/USDT Long", risk: "2%", corr: "Высокая" },
                  ].map((p, i) => (
                    <div key={i} className="flex justify-between bg-zinc-900 rounded-lg px-3 py-2 text-xs font-space-mono">
                      <span className="text-zinc-300">{p.pos}</span>
                      <span className="text-red-400">{p.risk}</span>
                    </div>
                  ))}
                  <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-2 text-xs font-space-mono text-red-300">
                    Реальный риск ≈ 6% (все упадут вместе при крипто-распродаже)
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-green-400 font-orbitron text-xs font-bold mb-2">Правильная диверсификация</div>
                  {[
                    { pos: "BTC/USDT Long", risk: "2%", corr: "Крипто" },
                    { pos: "GOLD/USD Long", risk: "1%", corr: "Защитный" },
                    { pos: "USD/JPY Short", risk: "1%", corr: "Форекс" },
                  ].map((p, i) => (
                    <div key={i} className="flex justify-between bg-zinc-900 rounded-lg px-3 py-2 text-xs font-space-mono">
                      <span className="text-zinc-300">{p.pos}</span>
                      <span className="text-green-400">{p.risk}</span>
                    </div>
                  ))}
                  <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-2 text-xs font-space-mono text-green-300">
                    Реальный риск ≈ 2–3% (активы слабо коррелированы)
                  </div>
                </div>
              </div>
              <div className="bg-zinc-900 border border-blue-500/20 rounded-xl p-3 mt-4">
                <div className="text-blue-400 font-orbitron text-xs font-bold mb-1">Правило максимального портфельного риска</div>
                <p className="text-zinc-400 text-xs font-space-mono leading-relaxed">Суммарный риск всех открытых позиций не должен превышать 5–6% депозита одновременно. Это защищает от «чёрных лебедей» — непредвиденных рыночных событий, которые двигают все активы сразу.</p>
              </div>
            </div>

            <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4">
              <div className="text-white font-orbitron text-xs font-bold mb-3">Ключевые метрики оценки торговой системы</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-space-mono">
                {[
                  { name: "Expectancy (Матожидание)", formula: "E = (WR × avg_win) - (LR × avg_loss)", color: "text-green-400", desc: "Сколько R в среднем приносит одна сделка. Должно быть > 0. Цель: 0.3R и выше." },
                  { name: "Profit Factor (PF)", formula: "PF = Gross Profit / Gross Loss", color: "text-blue-400", desc: "Отношение всей прибыли к всем убыткам. PF > 1.5 — хорошая система. PF > 2 — отличная." },
                  { name: "Sharpe Ratio", formula: "SR = (Доходность - Rf) / Волатильность", color: "text-purple-400", desc: "Доходность относительно риска. SR > 1 — приемлемо. SR > 2 — профессиональный уровень." },
                  { name: "Max Drawdown (MDD)", formula: "MDD = (Пик - Дно) / Пик × 100%", color: "text-red-400", desc: "Максимальная просадка за всю историю. Должна быть < 20% для комфортной торговли." },
                ].map((m, i) => (
                  <div key={i} className="bg-zinc-900 rounded-xl p-3">
                    <div className={`font-bold mb-1 ${m.color}`}>{m.name}</div>
                    <code className="block bg-zinc-950 rounded px-2 py-1 text-zinc-400 mb-2 text-xs">{m.formula}</code>
                    <p className="text-zinc-500 leading-relaxed">{m.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )
      },
    ]
  },
]

/* ─── Page Component ──────────────────────────────────────────── */

export default function TradingBasics() {
  const [readChapters, setReadChapters] = useState<Set<string>>(new Set())

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]") as string[]
    setReadChapters(new Set(saved))
  }, [])

  const toggleChapter = (id: string) => {
    setReadChapters((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...next]))
      return next
    })
  }

  const readCount = readChapters.size
  const total = articles.length
  const pct = Math.round((readCount / total) * 100)

  return (
    <div className="dark min-h-screen bg-black">
      <Navbar />
      <main className="pt-24 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-10">
            <Badge className="bg-red-500/20 text-red-400 border-red-500/30 mb-4">База знаний</Badge>
            <h1 className="font-orbitron text-4xl md:text-5xl font-bold text-white mb-6">
              Основы трейдинга
            </h1>
            <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
              Полный учебный курс от нуля до первой осознанной сделки. Читайте главы по порядку или выбирайте нужную тему.
            </p>
          </div>

          {/* Progress */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 mb-10">
            <div className="flex items-center justify-between mb-3">
              <span className="font-orbitron text-white text-sm">Прогресс по курсу</span>
              <span className="font-space-mono text-red-400 text-sm font-bold">{readCount} / {total} глав</span>
            </div>
            <div className="w-full bg-zinc-800 rounded-full h-2 mb-2">
              <div
                className="bg-red-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${pct}%` }}
              />
            </div>
            <div className="flex gap-2 mt-3 flex-wrap">
              {articles.map((a) => (
                <a
                  key={a.id}
                  href={`#${a.id}`}
                  className={`text-xs font-space-mono px-3 py-1 rounded-full border transition-colors ${
                    readChapters.has(a.id)
                      ? "bg-green-500/20 border-green-500/40 text-green-400"
                      : "border-red-500/30 text-red-400 hover:bg-red-500/10"
                  }`}
                >
                  {readChapters.has(a.id) ? "✓ " : ""}{a.badge}
                </a>
              ))}
            </div>
          </div>

          {/* Articles */}
          <div className="space-y-12">
            {articles.map((article) => {
              const isDone = readChapters.has(article.id)
              return (
                <div key={article.id} id={article.id} className="scroll-mt-24">
                  <Card className={`border transition-colors ${isDone ? "bg-zinc-900/60 border-green-500/25" : "bg-zinc-900 border-red-500/20"}`}>
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between mb-3">
                        <Badge className="bg-red-500 text-white border-0">{article.badge}</Badge>
                        <button
                          onClick={() => toggleChapter(article.id)}
                          className={`flex items-center gap-2 text-xs font-space-mono px-3 py-1.5 rounded-full border transition-all ${
                            isDone
                              ? "bg-green-500/20 border-green-500/40 text-green-400"
                              : "border-zinc-600 text-zinc-500 hover:border-green-500/50 hover:text-green-400"
                          }`}
                        >
                          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                            <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          {isDone ? "Прочитано" : "Отметить прочитанным"}
                        </button>
                      </div>
                      <CardTitle className={`font-orbitron text-2xl leading-tight ${isDone ? "text-zinc-400" : "text-white"}`}>
                        {article.title}
                      </CardTitle>
                      <p className="text-gray-400 leading-relaxed mt-2">{article.summary}</p>
                    </CardHeader>
                    <CardContent>
                      <Accordion type="multiple" className="w-full">
                        {article.sections.map((section, idx) => (
                          <AccordionItem
                            key={idx}
                            value={`${article.id}-${idx}`}
                            className="border-red-500/20"
                          >
                            <AccordionTrigger className="text-left text-base font-semibold text-white hover:text-red-400 font-orbitron">
                              {section.title}
                            </AccordionTrigger>
                            <AccordionContent>
                              {section.content}
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    </CardContent>
                  </Card>
                </div>
              )
            })}
          </div>

          {/* Next step */}
          <div className="mt-16 text-center">
            <p className="text-gray-400 mb-4 font-space-mono">Следующий шаг — автоматизация торговли</p>
            <a
              href="/bots-guide"
              className="inline-block bg-red-500 hover:bg-red-600 text-white font-orbitron px-8 py-3 rounded-md transition-colors"
            >
              Гайд по торговым ботам →
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}