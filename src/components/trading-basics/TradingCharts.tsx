/* ─── SVG Charts & Table Components for TradingBasics ─────────── */

export function CandlestickChart() {
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
        {[60, 100, 140, 180].map(y => (
          <line key={y} x1="20" y1={y} x2="340" y2={y} stroke="#27272a" strokeWidth="1" />
        ))}
        {[{y:60,p:"$45k"},{y:100,p:"$42k"},{y:140,p:"$39k"},{y:180,p:"$36k"}].map(l => (
          <text key={l.y} x="5" y={l.y+4} fontSize="8" fill="#52525b" fontFamily="monospace">{l.p}</text>
        ))}
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
        {candles.map((c, i) => (
          <text key={i} x={c.x} y="212" fontSize="8" fill="#52525b" textAnchor="middle" fontFamily="monospace">{labels[i]}</text>
        ))}
        <rect x="240" y="10" width="10" height="10" fill="#22c55e" rx="1" />
        <text x="254" y="19" fontSize="8" fill="#86efac" fontFamily="monospace">Бычья свеча</text>
        <rect x="240" y="26" width="10" height="10" fill="#ef4444" rx="1" />
        <text x="254" y="35" fontSize="8" fill="#fca5a5" fontFamily="monospace">Медвежья свеча</text>
      </svg>
    </div>
  )
}

export function OrderBookChart() {
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

export function RSIChart() {
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
        <text x="2" y="12" fontSize="8" fill="#71717a" fontFamily="monospace">ЦЕНА</text>
        <path d={pPath} stroke="#ef4444" strokeWidth="1.5" fill="none" />
        <text x="2" y={ph + 28} fontSize="8" fill="#71717a" fontFamily="monospace">RSI(14)</text>
        <g transform={`translate(0, ${ph + 16})`}>
          <rect x={pad} y={ry(70)} width={w - pad * 2} height={ry(30) - ry(70)} fill="#ef4444" opacity="0.07" />
          <line x1={pad} y1={ry(70)} x2={w - pad} y2={ry(70)} stroke="#ef4444" strokeWidth="0.8" strokeDasharray="3,3" />
          <line x1={pad} y1={ry(30)} x2={w - pad} y2={ry(30)} stroke="#22c55e" strokeWidth="0.8" strokeDasharray="3,3" />
          <text x={w - pad + 2} y={ry(70) + 4} fontSize="7" fill="#ef4444" fontFamily="monospace">70</text>
          <text x={w - pad + 2} y={ry(30) + 4} fontSize="7" fill="#22c55e" fontFamily="monospace">30</text>
          <path d={rPath} stroke="#a78bfa" strokeWidth="1.5" fill="none" />
        </g>
        <text x={px(11)} y={py(128) - 5} fontSize="7" fill="#fbbf24" textAnchor="middle" fontFamily="monospace">Перекупленность</text>
        <text x={px(19)} y={ph + 16 + ry(20) + 12} fontSize="7" fill="#86efac" textAnchor="middle" fontFamily="monospace">Перепроданность</text>
      </svg>
    </div>
  )
}

export function SupportResistanceChart() {
  return (
    <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 my-4">
      <p className="text-zinc-400 text-xs font-space-mono mb-2">Уровни поддержки и сопротивления</p>
      <svg viewBox="0 0 360 180" className="w-full h-44">
        <line x1="30" y1="50" x2="330" y2="50" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="6,4" />
        <text x="332" y="54" fontSize="8" fill="#ef4444" fontFamily="monospace">Сопр.</text>
        <line x1="30" y1="130" x2="330" y2="130" stroke="#22c55e" strokeWidth="1.5" strokeDasharray="6,4" />
        <text x="332" y="134" fontSize="8" fill="#22c55e" fontFamily="monospace">Подд.</text>
        <polyline
          points="30,130 60,110 90,50 100,70 130,130 160,100 190,50 200,65 230,130 260,108 290,50 310,75 330,90"
          fill="none" stroke="#e5e7eb" strokeWidth="2"
        />
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

export function RiskCalcTable() {
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

export function RRTable() {
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

export function MarketComparisonTable() {
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

export function OrderTypesTable() {
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
                <td className="px-4 py-2 text-red-400 font-bold whitespace-nowrap">{o.type}</td>
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

export function TimeframeTable() {
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

export function IndicatorsComparisonTable() {
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

export function MACDChart() {
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

export function CandlePatternCards() {
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

export function TradingJournalTemplate() {
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
