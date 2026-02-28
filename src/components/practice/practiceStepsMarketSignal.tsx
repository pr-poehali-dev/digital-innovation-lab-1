import type { PracticeStep } from "./practiceStepTypes"

export const stepMarketAnalysis: PracticeStep = {
  id: "market-analysis",
  badge: "Шаг 1",
  color: "blue",
  icon: "BarChart2",
  title: "Анализ рынка: читаем BTC/USD",
  summary: "Прежде чем открыть сделку на Pocket Option — нужно понять, куда движется рынок. Применяем всё из раздела «Основы трейдинга».",
  sections: [
    {
      title: "Выбираем тайм-фрейм и инструмент",
      content: (
        <div className="space-y-3">
          <p className="text-gray-300 leading-relaxed">
            Pocket Option — платформа бинарных опционов. BTC/USD — самый ликвидный инструмент с предсказуемыми паттернами.
            Для краткосрочных сделок (1–5 минут) работаем на <span className="text-blue-400 font-semibold">тайм-фрейме M1 и M5</span>.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { label: "Инструмент", value: "BTC/USD", desc: "Высокая ликвидность, предсказуемые уровни", color: "text-yellow-400" },
              { label: "Тайм-фрейм", value: "M5", desc: "Для анализа + M1 для входа", color: "text-blue-400" },
              { label: "Экспирация", value: "3–5 мин", desc: "Стандарт для скальпинга", color: "text-green-400" },
            ].map((item, i) => (
              <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-lg p-3">
                <div className="text-zinc-500 text-xs font-space-mono mb-1">{item.label}</div>
                <div className={`font-orbitron font-bold text-sm ${item.color}`}>{item.value}</div>
                <div className="text-zinc-500 text-xs mt-1">{item.desc}</div>
              </div>
            ))}
          </div>
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
            <div className="text-blue-400 font-orbitron text-xs font-bold mb-2">Из главы «Тайм-фреймы»</div>
            <p className="text-zinc-400 text-xs font-space-mono leading-relaxed">
              M5 показывает структуру — где сформированы уровни, куда идёт тренд. M1 — точка входа.
              Никогда не торгуем только на M1 без понимания старшего тайм-фрейма.
            </p>
          </div>
        </div>
      )
    },
    {
      title: "Определяем тренд через скользящие средние",
      content: (
        <div className="space-y-3">
          <p className="text-gray-300 leading-relaxed">
            Открываем график BTC/USD M5 на Pocket Option. Включаем <span className="text-yellow-400 font-semibold">EMA 20 и EMA 50</span>. Смотрим взаиморасположение.
          </p>
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4">
            <svg viewBox="0 0 400 160" className="w-full h-40">
              <defs>
                <linearGradient id="priceGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.15"/>
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity="0"/>
                </linearGradient>
              </defs>
              {[
                [30, 100, 90, 108], [55, 90, 82, 96], [80, 82, 75, 88], [105, 75, 70, 80],
                [130, 70, 65, 74], [155, 65, 60, 70], [180, 62, 55, 66], [205, 55, 50, 60],
                [230, 52, 46, 56], [255, 48, 43, 52], [280, 45, 40, 50], [305, 42, 37, 47],
                [330, 38, 34, 42], [355, 35, 30, 40]
              ].map(([x, open, close, high], i) => (
                <g key={i}>
                  <line x1={x + 10} y1={high} x2={x + 10} y2={close < open ? close : open} stroke={close < open ? "#ef4444" : "#22c55e"} strokeWidth="1"/>
                  <rect x={x + 5} y={Math.min(open, close)} width="10" height={Math.abs(open - close) || 1} fill={close < open ? "#ef4444" : "#22c55e"} opacity="0.9"/>
                </g>
              ))}
              <polyline points="30,98 55,88 80,80 105,73 130,67 155,62 180,59 205,53 230,50 255,46 280,43 305,40 330,37 355,34"
                fill="none" stroke="#eab308" strokeWidth="2" opacity="0.9"/>
              <polyline points="30,105 55,100 80,95 105,88 130,82 155,76 180,71 205,66 230,62 255,58 280,54 305,51 330,47 355,44"
                fill="none" stroke="#3b82f6" strokeWidth="2" opacity="0.9"/>
              <text x="358" y="32" fontSize="8" fill="#eab308" fontFamily="monospace">EMA 20</text>
              <text x="358" y="43" fontSize="8" fill="#3b82f6" fontFamily="monospace">EMA 50</text>
              <text x="10" y="155" fontSize="8" fill="#52525b" fontFamily="monospace">EMA 20 ниже EMA 50 → нисходящий тренд → торгуем PUT</text>
            </svg>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
              <div className="text-green-400 font-orbitron text-xs font-bold mb-2">CALL (рост) — когда</div>
              <ul className="text-zinc-400 text-xs font-space-mono space-y-1">
                <li>→ EMA 20 выше EMA 50</li>
                <li>→ Цена выше обеих MA</li>
                <li>→ EMA 20 растёт вверх</li>
              </ul>
            </div>
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
              <div className="text-red-400 font-orbitron text-xs font-bold mb-2">PUT (падение) — когда</div>
              <ul className="text-zinc-400 text-xs font-space-mono space-y-1">
                <li>→ EMA 20 ниже EMA 50</li>
                <li>→ Цена ниже обеих MA</li>
                <li>→ EMA 20 падает вниз</li>
              </ul>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "RSI подтверждает сигнал",
      content: (
        <div className="space-y-3">
          <p className="text-gray-300 leading-relaxed">
            После определения тренда — подтверждаем сигнал через <span className="text-purple-400 font-semibold">RSI (14)</span>.
            Один индикатор = слабый сигнал. Два совпадающих = высокая вероятность.
          </p>
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4">
            <svg viewBox="0 0 400 100" className="w-full h-24">
              <rect x="0" y="0" width="400" height="100" fill="transparent"/>
              <rect x="20" y="5" width="360" height="20" fill="#ef444408" stroke="#ef444420" strokeWidth="0.5" rx="2"/>
              <rect x="20" y="55" width="360" height="20" fill="#22c55e08" stroke="#22c55e20" strokeWidth="0.5" rx="2"/>
              <text x="385" y="18" fontSize="7" fill="#ef4444" fontFamily="monospace" textAnchor="end">70</text>
              <text x="385" y="68" fontSize="7" fill="#22c55e" fontFamily="monospace" textAnchor="end">30</text>
              <polyline
                points="30,30 60,35 90,42 120,50 150,56 180,62 210,67 240,72 270,68 300,60 330,52 360,42"
                fill="none" stroke="#a855f7" strokeWidth="2"/>
              <circle cx="240" cy="72" r="4" fill="#ef4444" opacity="0.8"/>
              <text x="240" y="85" fontSize="8" fill="#ef4444" textAnchor="middle" fontFamily="monospace">RSI=28 → перепродан</text>
              <text x="20" y="95" fontSize="7" fill="#52525b" fontFamily="monospace">RSI входит в зону перепроданности при нисходящем тренде = сигнал скорого отскока</text>
            </svg>
          </div>
          <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-3">
            <div className="text-purple-400 font-orbitron text-xs font-bold mb-2">Правило использования RSI для бинарных опционов</div>
            <p className="text-zinc-400 text-xs font-space-mono leading-relaxed">
              RSI {'<'} 30 при нисходящем тренде = возможный отскок → PUT теряет силу, ждём разворота.
              RSI {'>'} 70 при восходящем тренде = возможная коррекция → не открываем CALL, ждём откат.
              Используйте RSI как <span className="text-white">фильтр входа</span>, не как самостоятельный сигнал.
            </p>
          </div>
        </div>
      )
    },
    {
      title: "Уровни поддержки и сопротивления: находим точку входа",
      content: (
        <div className="space-y-3">
          <p className="text-gray-300 leading-relaxed">
            Уровни — это зоны, где цена останавливается и разворачивается. На Pocket Option это критично:
            нужна <span className="text-yellow-400 font-semibold">точка входа у уровня</span>, а не «посередине».
          </p>
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4">
            <svg viewBox="0 0 400 150" className="w-full h-36">
              <line x1="20" y1="30" x2="380" y2="30" stroke="#ef4444" strokeWidth="1" strokeDasharray="6,4" opacity="0.7"/>
              <text x="383" y="33" fontSize="8" fill="#ef4444" fontFamily="monospace">Resistance</text>
              <line x1="20" y1="110" x2="380" y2="110" stroke="#22c55e" strokeWidth="1" strokeDasharray="6,4" opacity="0.7"/>
              <text x="383" y="113" fontSize="8" fill="#22c55e" fontFamily="monospace">Support</text>
              <polyline
                points="30,100 60,85 90,60 110,30 130,45 150,65 170,80 190,95 210,110 230,95 250,80 270,65 290,50 310,30 330,48 350,68"
                fill="none" stroke="#60a5fa" strokeWidth="2"/>
              <circle cx="110" cy="30" r="5" fill="#ef4444" opacity="0.8"/>
              <text x="110" y="22" fontSize="8" fill="#ef4444" textAnchor="middle" fontFamily="monospace">PUT</text>
              <circle cx="210" cy="110" r="5" fill="#22c55e" opacity="0.8"/>
              <text x="210" y="125" fontSize="8" fill="#22c55e" textAnchor="middle" fontFamily="monospace">CALL</text>
              <text x="200" y="145" fontSize="8" fill="#52525b" textAnchor="middle" fontFamily="monospace">Цена отбивается от уровней → открываем сделку на отбой</text>
            </svg>
          </div>
          <div className="space-y-2">
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-3">
              <div className="text-yellow-400 font-orbitron text-xs font-bold mb-1">Как найти уровни на BTC</div>
              <p className="text-zinc-400 text-xs font-space-mono leading-relaxed">
                Смотрим на M15/H1: где цена касалась одной точки 2+ раза и разворачивалась — это уровень.
                Круглые числа (42000, 43000, 44000) — дополнительно усиливают уровень.
              </p>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-3">
              <div className="text-blue-400 font-orbitron text-xs font-bold mb-1">Стратегия «Отбой от уровня»</div>
              <p className="text-zinc-400 text-xs font-space-mono leading-relaxed">
                Цена подходит к уровню → на M1 видим разворотную свечу (доджи, пин-бар) →
                RSI показывает перекупленность/перепроданность у уровня → открываем сделку против движения.
              </p>
            </div>
          </div>
        </div>
      )
    }
  ]
}

export const stepSignalFormation: PracticeStep = {
  id: "signal-formation",
  badge: "Шаг 2",
  color: "yellow",
  icon: "Crosshair",
  title: "Формирование сигнала: 3 подтверждения",
  summary: "Хороший трейдер не открывает сделку по одному признаку. Ждём совпадения минимум трёх факторов — это называется «конфлюэнс».",
  sections: [
    {
      title: "Метод конфлюэнса: почему нужно 3 подтверждения",
      content: (
        <div className="space-y-3">
          <p className="text-gray-300 leading-relaxed">
            Конфлюэнс (confluence) — совпадение нескольких независимых сигналов в одной точке.
            Чем больше факторов указывают в одном направлении — тем выше вероятность правильного прогноза.
          </p>
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4">
            <div className="grid grid-cols-3 gap-3 text-center">
              {[
                { label: "1 сигнал", prob: "52%", color: "text-red-400", bg: "bg-red-500/10 border-red-500/30" },
                { label: "2 сигнала", prob: "64%", color: "text-yellow-400", bg: "bg-yellow-500/10 border-yellow-500/30" },
                { label: "3 сигнала", prob: "78%", color: "text-green-400", bg: "bg-green-500/10 border-green-500/30" },
              ].map((item, i) => (
                <div key={i} className={`border rounded-lg p-3 ${item.bg}`}>
                  <div className="text-zinc-400 text-xs font-space-mono mb-1">{item.label}</div>
                  <div className={`font-orbitron text-xl font-bold ${item.color}`}>{item.prob}</div>
                  <div className="text-zinc-600 text-xs">вероятность</div>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            {[
              { num: "01", title: "Тренд (EMA 20/50)", desc: "EMA 20 ниже EMA 50 → тренд нисходящий → смотрим PUT", color: "text-blue-400" },
              { num: "02", title: "Уровень сопротивления", desc: "Цена приближается к уровню 44,000 — там было 3 отбоя за неделю", color: "text-yellow-400" },
              { num: "03", title: "RSI перекуплен (72)", desc: "RSI выше 70 у уровня сопротивления при нисходящем тренде — сильный сигнал PUT", color: "text-red-400" },
            ].map((item, i) => (
              <div key={i} className="flex gap-3 bg-zinc-900 border border-zinc-800 rounded-lg p-3">
                <div className={`font-orbitron text-xs font-bold ${item.color} w-6 shrink-0`}>{item.num}</div>
                <div>
                  <div className={`font-orbitron text-xs font-bold mb-0.5 ${item.color}`}>{item.title}</div>
                  <p className="text-zinc-400 text-xs font-space-mono">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )
    },
    {
      title: "Реальный пример: BTC/USD, 14 февраля 2025",
      content: (
        <div className="space-y-3">
          <p className="text-gray-300 leading-relaxed">
            Разбираем конкретную ситуацию. BTC торгуется около $97,500. На M5 формируется сигнал.
          </p>
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4">
            <svg viewBox="0 0 400 180" className="w-full h-44">
              <rect x="20" y="10" width="360" height="120" rx="4" fill="#18181b"/>
              <line x1="20" y1="35" x2="380" y2="35" stroke="#ef4444" strokeWidth="1" strokeDasharray="4,3" opacity="0.6"/>
              <text x="22" y="30" fontSize="7" fill="#ef4444" fontFamily="monospace">$97,500 — Сопротивление (3 касания)</text>
              {[
                [30, 100, 90, 105, 85], [52, 90, 80, 95, 76], [74, 80, 72, 84, 68],
                [96, 72, 65, 76, 62], [118, 65, 58, 70, 54], [140, 58, 52, 62, 48],
                [162, 52, 46, 56, 42], [184, 46, 40, 50, 37], [206, 40, 35, 43, 32],
                [228, 37, 35, 42, 34], [250, 35, 33, 38, 31],
              ].map(([x, open, close, high, low], i) => (
                <g key={i}>
                  <line x1={x + 9} y1={high} x2={x + 9} y2={low} stroke={close < open ? "#ef4444" : "#22c55e"} strokeWidth="1"/>
                  <rect x={x + 3} y={Math.min(open, close)} width="12" height={Math.abs(open - close) || 2}
                    fill={close < open ? "#ef4444" : "#22c55e"} opacity="0.85"/>
                </g>
              ))}
              <polyline points="30,97 52,87 74,78 96,70 118,63 140,57 162,51 184,46 206,41 228,38 250,36"
                fill="none" stroke="#eab308" strokeWidth="1.5" opacity="0.8"/>
              <polyline points="30,110 52,102 74,94 96,86 118,79 140,72 162,66 184,60 206,54 228,50 250,47"
                fill="none" stroke="#3b82f6" strokeWidth="1.5" opacity="0.8"/>
              <polygon points="120,35 114,22 126,22" fill="#ef4444"/>
              <text x="120" y="18" fontSize="8" fill="#ef4444" textAnchor="middle" fontFamily="monospace" fontWeight="bold">PUT</text>
              <text x="356" y="50" fontSize="7" fill="#eab308" fontFamily="monospace" textAnchor="end">EMA20</text>
              <text x="356" y="60" fontSize="7" fill="#3b82f6" fontFamily="monospace" textAnchor="end">EMA50</text>
              <text x="200" y="170" fontSize="8" fill="#52525b" textAnchor="middle" fontFamily="monospace">3 подтверждения совпали → PUT на $97,500 → цена пошла вниз</text>
            </svg>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {[
              { label: "Сигнал", value: "PUT", color: "text-red-400" },
              { label: "Цена входа", value: "$97,500", color: "text-white" },
              { label: "Экспирация", value: "5 минут", color: "text-blue-400" },
              { label: "EMA", value: "20 < 50 ✓", color: "text-yellow-400" },
              { label: "Уровень", value: "3 касания ✓", color: "text-yellow-400" },
              { label: "RSI", value: "71 — ✓", color: "text-yellow-400" },
            ].map((item, i) => (
              <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-center">
                <div className="text-zinc-500 text-xs font-space-mono">{item.label}</div>
                <div className={`font-orbitron text-xs font-bold mt-0.5 ${item.color}`}>{item.value}</div>
              </div>
            ))}
          </div>
        </div>
      )
    }
  ]
}
