/* ─── Visual Components for BotsGuide ─────────────────────────── */

export function BotWorkflowDiagram() {
  const steps = [
    { label: "Биржа\n(Данные)", icon: "📊", color: "#3b82f6" },
    { label: "API\n(Запрос)", icon: "🔌", color: "#8b5cf6" },
    { label: "Бот\n(Анализ)", icon: "🤖", color: "#ef4444" },
    { label: "Стратегия\n(Решение)", icon: "🧠", color: "#f59e0b" },
    { label: "Ордер\n(Сделка)", icon: "📈", color: "#22c55e" },
  ]
  return (
    <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 my-4">
      <p className="text-zinc-400 text-xs font-space-mono mb-4">Цикл работы торгового бота (каждые ~100мс)</p>
      <div className="flex items-center justify-between overflow-x-auto gap-1">
        {steps.map((s, i) => (
          <div key={i} className="flex items-center gap-1 flex-shrink-0">
            <div className="flex flex-col items-center">
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center text-xl border"
                style={{ borderColor: s.color + "50", backgroundColor: s.color + "15" }}
              >
                {s.icon}
              </div>
              <div className="text-center mt-1">
                {s.label.split("\n").map((l, j) => (
                  <div key={j} className="text-xs font-space-mono" style={{ color: j === 0 ? "white" : "#71717a", fontSize: j === 0 ? "10px" : "9px" }}>{l}</div>
                ))}
              </div>
            </div>
            {i < steps.length - 1 && (
              <svg width="24" height="16" className="flex-shrink-0 mt-[-10px]">
                <path d="M4 8 L20 8 M14 4 L20 8 L14 12" stroke="#3f3f46" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </div>
        ))}
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <div className="bg-zinc-900 rounded px-3 py-1.5 text-xs font-space-mono text-zinc-400">
          <span className="text-white">Скорость:</span> 50–500 мс на полный цикл
        </div>
        <div className="bg-zinc-900 rounded px-3 py-1.5 text-xs font-space-mono text-zinc-400">
          <span className="text-white">24/7:</span> без перерывов и эмоций
        </div>
        <div className="bg-zinc-900 rounded px-3 py-1.5 text-xs font-space-mono text-zinc-400">
          <span className="text-white">HFT-боты:</span> до 1 мс
        </div>
      </div>
    </div>
  )
}

export function GridBotChart() {
  const gridLevels = [40, 60, 80, 100, 120, 140, 160]
  const pricePath = "20,140 50,130 80,110 110,100 140,120 170,90 200,80 230,100 260,110 290,90 320,80 350,60"
  return (
    <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 my-4">
      <p className="text-zinc-400 text-xs font-space-mono mb-2">Grid-бот: сетка ордеров в диапазоне цены</p>
      <svg viewBox="0 0 370 170" className="w-full h-44">
        {gridLevels.map((y, i) => (
          <g key={i}>
            <line x1="15" y1={y} x2="355" y2={y} stroke={i % 2 === 0 ? "#22c55e33" : "#ef444433"} strokeWidth="1" strokeDasharray="4,3" />
            <text x="357" y={y + 4} fontSize="7" fill={i % 2 === 0 ? "#86efac" : "#fca5a5"} fontFamily="monospace">
              {i % 2 === 0 ? "BUY" : "SELL"}
            </text>
          </g>
        ))}
        <polyline points={pricePath} fill="none" stroke="#e5e7eb" strokeWidth="2" />
        {[{x:170,y:90,type:"S"},{x:260,y:110,type:"B"},{x:290,y:90,type:"S"},{x:110,y:100,type:"B"}].map((m, i) => (
          <g key={i}>
            <circle cx={m.x} cy={m.y} r="5" fill={m.type === "B" ? "#22c55e" : "#ef4444"} opacity="0.9" />
            <text x={m.x} y={m.y + 4} fontSize="7" fill="white" textAnchor="middle" fontFamily="monospace" fontWeight="bold">{m.type}</text>
          </g>
        ))}
        <text x="15" y="158" fontSize="8" fill="#52525b" fontFamily="monospace">B = Покупка на уровне сетки, S = Продажа на уровне сетки → постоянный доход в боковике</text>
      </svg>
    </div>
  )
}

export function DCAChart() {
  const entries = [
    { x: 30, y: 60, price: "$45k" },
    { x: 90, y: 90, price: "$42k" },
    { x: 150, y: 110, price: "$40k" },
    { x: 210, y: 130, price: "$38k" },
    { x: 270, y: 100, price: "$41k" },
    { x: 330, y: 70, price: "$44k" },
  ]
  const prices = [60, 65, 80, 90, 100, 110, 125, 130, 115, 100, 95, 110, 130, 120, 105, 80, 70, 60, 75, 100, 115]
  const w = 360, ph = 150
  const px = (i: number) => 15 + (i / (prices.length - 1)) * (w - 30)
  const py = (v: number) => ph - ((v - 55) / 80) * (ph - 20) - 10
  const path = prices.map((v, i) => `${i === 0 ? "M" : "L"} ${px(i)} ${py(v)}`).join(" ")
  const avgY = py(90)
  return (
    <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 my-4">
      <p className="text-zinc-400 text-xs font-space-mono mb-2">DCA-бот: усреднение при падении, снижение средней цены</p>
      <svg viewBox={`0 0 ${w} ${ph + 10}`} className="w-full h-44">
        <line x1="15" y1={avgY} x2={w - 15} y2={avgY} stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="5,3" />
        <text x={w - 14} y={avgY - 3} fontSize="8" fill="#fbbf24" fontFamily="monospace" textAnchor="end">Ср. цена</text>
        <path d={path} stroke="#e5e7eb" strokeWidth="2" fill="none" />
        {entries.map((e, i) => (
          <g key={i}>
            <circle cx={e.x} cy={e.y} r="5" fill="#3b82f6" />
            <text x={e.x} y={e.y - 8} fontSize="7" fill="#93c5fd" textAnchor="middle" fontFamily="monospace">{e.price}</text>
          </g>
        ))}
        <text x="185" y={ph + 8} fontSize="8" fill="#52525b" textAnchor="middle" fontFamily="monospace">Синие точки = покупки DCA-бота при каждом падении</text>
      </svg>
    </div>
  )
}

export function BacktestMetricsTable() {
  const metrics = [
    { metric: "Total Return", desc: "Общая доходность за период", good: "> 50% в год", bad: "< 10% или нереально > 500%" },
    { metric: "Max Drawdown", desc: "Максимальная просадка от пика", good: "< 15%", bad: "> 30%" },
    { metric: "Sharpe Ratio", desc: "Доходность с учётом риска", good: "> 1.5", bad: "< 0.5" },
    { metric: "Win Rate", desc: "Процент прибыльных сделок", good: "45–65%", bad: "> 90% (overfitting)" },
    { metric: "Profit Factor", desc: "Сумма прибылей / сумма убытков", good: "> 1.5", bad: "< 1.0" },
    { metric: "Recovery Factor", desc: "Return / Max Drawdown", good: "> 3", bad: "< 1" },
  ]
  return (
    <div className="bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden my-4">
      <div className="px-4 py-2 border-b border-zinc-800">
        <p className="text-zinc-400 text-xs font-space-mono">Ключевые метрики бэктестинга: что означает каждая</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs font-space-mono">
          <thead>
            <tr className="border-b border-zinc-800">
              <th className="text-left px-4 py-2 text-zinc-500">Метрика</th>
              <th className="text-left px-4 py-2 text-zinc-500">Что показывает</th>
              <th className="text-left px-4 py-2 text-zinc-500">Хорошо</th>
              <th className="text-left px-4 py-2 text-zinc-500">Плохо</th>
            </tr>
          </thead>
          <tbody>
            {metrics.map((m, i) => (
              <tr key={i} className="border-b border-zinc-900 hover:bg-zinc-900/50 transition-colors">
                <td className="px-4 py-2 text-purple-400 font-bold whitespace-nowrap">{m.metric}</td>
                <td className="px-4 py-2 text-zinc-300">{m.desc}</td>
                <td className="px-4 py-2 text-green-400">{m.good}</td>
                <td className="px-4 py-2 text-red-400">{m.bad}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export function PlatformsComparisonTable() {
  const platforms = [
    { name: "3Commas", type: "Облачный", price: "$29–99/мес", bots: "DCA, Grid, Options", risk: "Средний", level: "Начинающий" },
    { name: "Pionex", type: "Биржа", price: "Бесплатно", bots: "16 типов (Grid, DCA, TWAP...)", risk: "Низкий", level: "Новичок" },
    { name: "Freqtrade", type: "Open-source", price: "Бесплатно", bots: "Любые (Python)", risk: "Требует знаний", level: "Продвинутый" },
    { name: "Hummingbot", type: "Open-source", price: "Бесплатно", bots: "Market-making, Arb", risk: "Требует знаний", level: "Эксперт" },
    { name: "Cryptohopper", type: "Облачный", price: "$19–99/мес", bots: "Trend, DCA, Grid", risk: "Средний", level: "Начинающий" },
    { name: "Bybit Bot", type: "Биржа", price: "Бесплатно", bots: "Grid, DCA, Spot", risk: "Низкий", level: "Новичок" },
  ]
  return (
    <div className="bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden my-4">
      <div className="px-4 py-2 border-b border-zinc-800">
        <p className="text-zinc-400 text-xs font-space-mono">Сравнение платформ для торговых ботов 2024</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs font-space-mono">
          <thead>
            <tr className="border-b border-zinc-800">
              <th className="text-left px-4 py-2 text-zinc-500">Платформа</th>
              <th className="text-left px-4 py-2 text-zinc-500">Тип</th>
              <th className="text-left px-4 py-2 text-zinc-500">Цена</th>
              <th className="text-left px-4 py-2 text-zinc-500">Типы ботов</th>
              <th className="text-left px-4 py-2 text-zinc-500">Уровень</th>
            </tr>
          </thead>
          <tbody>
            {platforms.map((p, i) => (
              <tr key={i} className="border-b border-zinc-900 hover:bg-zinc-900/50 transition-colors">
                <td className="px-4 py-2 text-white font-bold">{p.name}</td>
                <td className="px-4 py-2 text-blue-400">{p.type}</td>
                <td className="px-4 py-2 text-yellow-400">{p.price}</td>
                <td className="px-4 py-2 text-zinc-300">{p.bots}</td>
                <td className="px-4 py-2 text-zinc-400">{p.level}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export function StrategyComparisonTable() {
  const strategies = [
    { name: "Grid", market: "Боковик (флэт)", risk: "Средний", capital: "От $200", complexity: "Низкая", best: "BTC, ETH в диапазоне" },
    { name: "DCA", market: "Любой", risk: "Низкий", capital: "От $100", complexity: "Очень низкая", best: "Долгосрочное накопление" },
    { name: "Тренд (EMA/MACD)", market: "Тренд", risk: "Средний", capital: "От $300", complexity: "Средняя", best: "Сильные трендовые рынки" },
    { name: "Скальпинг", market: "Любой ликвидный", risk: "Высокий", capital: "От $1000", complexity: "Высокая", best: "BTC, ETH на M1–M5" },
    { name: "Арбитраж", market: "Любой", risk: "Низкий*", capital: "От $5000", complexity: "Очень высокая", best: "Кросс-биржевой спред" },
    { name: "Мартингейл", market: "Боковик", risk: "Очень высокий", capital: "Резервный", complexity: "Низкая", best: "Не рекомендуется" },
  ]
  return (
    <div className="bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden my-4">
      <div className="px-4 py-2 border-b border-zinc-800">
        <p className="text-zinc-400 text-xs font-space-mono">Сравнение стратегий для торговых ботов</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs font-space-mono">
          <thead>
            <tr className="border-b border-zinc-800">
              <th className="text-left px-4 py-2 text-zinc-500">Стратегия</th>
              <th className="text-left px-4 py-2 text-zinc-500">Рынок</th>
              <th className="text-left px-4 py-2 text-zinc-500">Риск</th>
              <th className="text-left px-4 py-2 text-zinc-500">Капитал</th>
              <th className="text-left px-4 py-2 text-zinc-500">Лучший для</th>
            </tr>
          </thead>
          <tbody>
            {strategies.map((s, i) => {
              const riskColor = s.risk === "Низкий" || s.risk === "Низкий*" ? "text-green-400" : s.risk === "Средний" ? "text-yellow-400" : "text-red-400"
              return (
                <tr key={i} className={`border-b border-zinc-900 hover:bg-zinc-900/50 transition-colors ${s.name === "Мартингейл" ? "opacity-60" : ""}`}>
                  <td className="px-4 py-2 text-red-400 font-bold">{s.name}</td>
                  <td className="px-4 py-2 text-zinc-300">{s.market}</td>
                  <td className={`px-4 py-2 font-semibold ${riskColor}`}>{s.risk}</td>
                  <td className="px-4 py-2 text-zinc-400">{s.capital}</td>
                  <td className="px-4 py-2 text-zinc-400">{s.best}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export function OverfittingChart() {
  const historical = [100, 110, 108, 120, 118, 130, 125, 140, 138, 150]
  const realWorld = [100, 105, 98, 102, 95, 88, 92, 85, 80, 75]
  const w = 340, h = 120, pad = 25
  const maxV = 160, minV = 70
  const px = (i: number) => pad + (i / (historical.length - 1)) * (w - pad * 2)
  const py = (v: number) => h - ((v - minV) / (maxV - minV)) * (h - 20) - 5
  const hPath = historical.map((v, i) => `${i === 0 ? "M" : "L"} ${px(i)} ${py(v)}`).join(" ")
  const rPath = realWorld.map((v, i) => `${i === 0 ? "M" : "L"} ${px(i)} ${py(v)}`).join(" ")
  const splitX = px(historical.length - 1)
  return (
    <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 my-4">
      <p className="text-zinc-400 text-xs font-space-mono mb-2">Overfitting: идеальный бэктест vs реальная торговля</p>
      <svg viewBox={`0 0 ${w} ${h + 20}`} className="w-full h-36">
        <rect x={pad} y="5" width={splitX - pad} height={h - 5} fill="#22c55e08" />
        <rect x={splitX} y="5" width={w - pad - splitX} height={h - 5} fill="#ef444408" />
        <text x={(pad + splitX) / 2} y="18" fontSize="8" fill="#86efac" textAnchor="middle" fontFamily="monospace">Бэктест (история)</text>
        <text x={(splitX + w - pad) / 2} y="18" fontSize="8" fill="#fca5a5" textAnchor="middle" fontFamily="monospace">Реальная торговля</text>
        <line x1={splitX} y1="5" x2={splitX} y2={h} stroke="#52525b" strokeWidth="1" strokeDasharray="4,3" />
        <path d={hPath} stroke="#22c55e" strokeWidth="2.5" fill="none" />
        <path d={rPath} stroke="#ef4444" strokeWidth="2.5" fill="none" />
        <line x1={pad} y1={pad + 20} x2={pad + 30} y2={pad + 20} stroke="#22c55e" strokeWidth="2" />
        <text x={pad + 34} y={pad + 24} fontSize="8" fill="#86efac" fontFamily="monospace">Бэктест: +50%</text>
        <line x1={pad} y1={pad + 35} x2={pad + 30} y2={pad + 35} stroke="#ef4444" strokeWidth="2" />
        <text x={pad + 34} y={pad + 39} fontSize="8" fill="#fca5a5" fontFamily="monospace">Реальность: -25%</text>
      </svg>
    </div>
  )
}

export function LaunchChecklist() {
  const items = [
    { category: "Тестирование", color: "text-blue-400", borderColor: "border-blue-500/30", bgColor: "bg-blue-500/5", checks: [
      "Бэктестинг на минимум 6 месяцев данных",
      "Paper trading от 2 недель с реальным рынком",
      "Стратегия протестирована на нескольких активах",
      "Проверены экстремальные сценарии (flash crash, делистинг)",
    ]},
    { category: "Безопасность", color: "text-yellow-400", borderColor: "border-yellow-500/30", bgColor: "bg-yellow-500/5", checks: [
      "API-ключи созданы без права вывода средств",
      "IP-whitelist для API (только ваш VPS/IP)",
      "Secret ключ хранится в зашифрованном виде",
      "Резервные копии конфигурации бота",
    ]},
    { category: "Инфраструктура", color: "text-purple-400", borderColor: "border-purple-500/30", bgColor: "bg-purple-500/5", checks: [
      "VPS с низкой задержкой до биржи (<50мс)",
      "Автоперезапуск при падении процесса (systemd/pm2)",
      "Мониторинг и алерты в Telegram при ошибках",
      "Логирование всех сделок и ошибок",
    ]},
    { category: "Риск-менеджмент", color: "text-red-400", borderColor: "border-red-500/30", bgColor: "bg-red-500/5", checks: [
      "Установлен дневной лимит потерь (Daily Stop Loss)",
      "Запуск с 10–20% от планируемого капитала",
      "Глобальный стоп при потере X% от депозита",
      "План действий при аномальном поведении рынка",
    ]},
  ]
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-4">
      {items.map((cat, i) => (
        <div key={i} className={`border rounded-xl p-4 ${cat.borderColor} ${cat.bgColor}`}>
          <div className={`font-orbitron text-xs font-bold mb-3 ${cat.color}`}>{cat.category}</div>
          <ul className="space-y-2">
            {cat.checks.map((c, j) => (
              <li key={j} className="flex gap-2 text-xs font-space-mono text-zinc-400">
                <span className={`${cat.color} flex-shrink-0`}>□</span>{c}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}

export function APIKeysGuide() {
  return (
    <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 my-4">
      <p className="text-zinc-400 text-xs font-space-mono mb-3">Как безопасно настроить API-ключи</p>
      <div className="space-y-3">
        <div className="flex gap-3">
          <div className="w-6 h-6 rounded-full bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400 text-xs font-bold flex-shrink-0 mt-0.5">1</div>
          <div>
            <div className="text-white text-xs font-orbitron font-bold mb-1">Создайте API-ключ на бирже</div>
            <p className="text-zinc-400 text-xs font-space-mono">Binance: Профиль → API Management → Create API. Обязательно включите Google 2FA перед созданием.</p>
          </div>
        </div>
        <div className="flex gap-3">
          <div className="w-6 h-6 rounded-full bg-yellow-500/20 border border-yellow-500/40 flex items-center justify-center text-yellow-400 text-xs font-bold flex-shrink-0 mt-0.5">2</div>
          <div>
            <div className="text-white text-xs font-orbitron font-bold mb-1">Ограничьте права ключа</div>
            <p className="text-zinc-400 text-xs font-space-mono">Разрешите только: "Enable Trading". НИКОГДА не включайте "Enable Withdrawals". Добавьте IP Restriction — только ваш VPS.</p>
          </div>
        </div>
        <div className="flex gap-3">
          <div className="w-6 h-6 rounded-full bg-green-500/20 border border-green-500/40 flex items-center justify-center text-green-400 text-xs font-bold flex-shrink-0 mt-0.5">3</div>
          <div>
            <div className="text-white text-xs font-orbitron font-bold mb-1">Сохраните Secret в безопасном месте</div>
            <p className="text-zinc-400 text-xs font-space-mono">Secret показывается ОДИН РАЗ. Сохраните в password manager (Bitwarden, 1Password). В коде — через переменные окружения, не хардкодить.</p>
          </div>
        </div>
        <div className="flex gap-3">
          <div className="w-6 h-6 rounded-full bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400 text-xs font-bold flex-shrink-0 mt-0.5">!</div>
          <div>
            <div className="text-red-400 text-xs font-orbitron font-bold mb-1">Никогда не делайте</div>
            <p className="text-zinc-400 text-xs font-space-mono">Не передавайте ключи в чатах/скриншотах. Не используйте общий VPS. Не давайте права вывода сторонним сервисам. Ключи с правом вывода = полный доступ к счёту.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export function MonitoringDashboard() {
  const daily = [
    { metric: "P&L сегодня", value: "+$127", color: "text-green-400" },
    { metric: "Кол-во сделок", value: "34", color: "text-blue-400" },
    { metric: "Win Rate", value: "58%", color: "text-yellow-400" },
    { metric: "Открытые позиции", value: "3", color: "text-purple-400" },
    { metric: "Нереализованный P&L", value: "+$45", color: "text-green-300" },
    { metric: "Дневной лимит убытка", value: "73% использ.", color: "text-orange-400" },
  ]
  return (
    <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 my-4">
      <p className="text-zinc-400 text-xs font-space-mono mb-3">Пример дашборда мониторинга бота (Telegram-отчёт)</p>
      <div className="bg-zinc-900 rounded-lg p-3 border border-zinc-800">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-xs">🤖</div>
          <span className="text-blue-400 text-xs font-space-mono font-bold">@MyGridBot_BTC · Ежедневный отчёт</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {daily.map((d, i) => (
            <div key={i} className="bg-zinc-950 rounded-lg p-2">
              <div className="text-zinc-500 text-xs font-space-mono mb-0.5">{d.metric}</div>
              <div className={`font-orbitron text-sm font-bold ${d.color}`}>{d.value}</div>
            </div>
          ))}
        </div>
        <div className="mt-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-2 text-xs font-space-mono text-yellow-400">
          ⚠️ 73% дневного лимита потерь достигнуто. Рекомендуется снизить активность.
        </div>
      </div>
    </div>
  )
}

export function BacktestingCodeExample() {
  return (
    <div className="bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden my-4">
      <div className="flex items-center gap-2 px-4 py-2 border-b border-zinc-800 bg-zinc-900">
        <div className="w-2 h-2 rounded-full bg-red-500" />
        <div className="w-2 h-2 rounded-full bg-yellow-500" />
        <div className="w-2 h-2 rounded-full bg-green-500" />
        <span className="text-zinc-500 text-xs font-space-mono ml-2">simple_backtest.py</span>
      </div>
      <pre className="p-4 text-xs font-space-mono overflow-x-auto text-zinc-300 leading-relaxed">
{`# Простейший бэктест стратегии EMA Cross на Python
import pandas as pd

def backtest_ema_cross(df, fast=20, slow=50):
    df['ema_fast'] = df['close'].ewm(span=fast).mean()
    df['ema_slow'] = df['close'].ewm(span=slow).mean()
    
    position = 0
    trades, equity = [], [1000]
    
    for i in range(1, len(df)):
        prev_fast = df['ema_fast'].iloc[i-1]
        prev_slow = df['ema_slow'].iloc[i-1]
        curr_fast = df['ema_fast'].iloc[i]
        curr_slow = df['ema_slow'].iloc[i]
        
        # Golden Cross — покупка
        if prev_fast < prev_slow and curr_fast > curr_slow and position == 0:
            position = equity[-1] / df['close'].iloc[i]
            entry = df['close'].iloc[i]
        
        # Death Cross — продажа
        elif prev_fast > prev_slow and curr_fast < curr_slow and position > 0:
            pnl = (df['close'].iloc[i] - entry) / entry
            trades.append(pnl)
            equity.append(equity[-1] * (1 + pnl))
            position = 0
    
    return {
        'total_return': (equity[-1] / 1000 - 1) * 100,
        'win_rate': sum(1 for t in trades if t > 0) / len(trades) * 100,
        'trades': len(trades)
    }`}
      </pre>
    </div>
  )
}
