import { useState, useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

const STORAGE_KEY = "tradebase_chapters_bots"

/* ─── Visual Components ───────────────────────────────────────── */

function BotWorkflowDiagram() {
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

function GridBotChart() {
  const gridLevels = [40, 60, 80, 100, 120, 140, 160]
  const pricePath = "20,140 50,130 80,110 110,100 140,120 170,90 200,80 230,100 260,110 290,90 320,80 350,60"
  return (
    <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 my-4">
      <p className="text-zinc-400 text-xs font-space-mono mb-2">Grid-бот: сетка ордеров в диапазоне цены</p>
      <svg viewBox="0 0 370 170" className="w-full h-44">
        {/* Grid levels */}
        {gridLevels.map((y, i) => (
          <g key={i}>
            <line x1="15" y1={y} x2="355" y2={y} stroke={i % 2 === 0 ? "#22c55e33" : "#ef444433"} strokeWidth="1" strokeDasharray="4,3" />
            <text x="357" y={y + 4} fontSize="7" fill={i % 2 === 0 ? "#86efac" : "#fca5a5"} fontFamily="monospace">
              {i % 2 === 0 ? "BUY" : "SELL"}
            </text>
          </g>
        ))}
        {/* Price line */}
        <polyline points={pricePath} fill="none" stroke="#e5e7eb" strokeWidth="2" />
        {/* Buy/sell markers */}
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

function DCAChart() {
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
        {/* Avg price line */}
        <line x1="15" y1={avgY} x2={w - 15} y2={avgY} stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="5,3" />
        <text x={w - 14} y={avgY - 3} fontSize="8" fill="#fbbf24" fontFamily="monospace" textAnchor="end">Ср. цена</text>
        {/* Price path */}
        <path d={path} stroke="#e5e7eb" strokeWidth="2" fill="none" />
        {/* Entry points */}
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

function BacktestMetricsTable() {
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

function PlatformsComparisonTable() {
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

function StrategyComparisonTable() {
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

function OverfittingChart() {
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

function LaunchChecklist() {
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
              <li key={j} className="flex items-start gap-2 text-xs font-space-mono text-zinc-400">
                <span className={`mt-0.5 flex-shrink-0 ${cat.color}`}>✓</span>
                <span>{c}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}

function APIKeysGuide() {
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

function MonitoringDashboard() {
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

function BacktestingCodeExample() {
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

/* ─── Chapter Data ────────────────────────────────────────────── */

type Section = { title: string; content: React.ReactNode }
type Chapter = { id: string; badge: string; title: string; summary: string; sections: Section[] }

const chapters: Chapter[] = [
  {
    id: "what-is-bot",
    badge: "Глава 1",
    title: "Что такое торговый бот и как он работает",
    summary: "Торговый бот — программа, которая автоматически исполняет сделки по заранее заданной логике. Он не спит, не устаёт и не поддаётся эмоциям.",
    sections: [
      {
        title: "Цикл работы бота: от сигнала до сделки",
        content: (
          <div className="space-y-3">
            <p className="text-gray-300 leading-relaxed">Торговый бот — это просто программа, которая повторяет те же действия, что делает трейдер вручную — только быстрее и без эмоций.</p>
            <BotWorkflowDiagram />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-center">
                <div className="text-3xl mb-2">⚡</div>
                <div className="text-white font-orbitron text-xs font-bold mb-1">Скорость</div>
                <p className="text-zinc-400 text-xs">50–500 мс vs 2–5 секунд вручную. Критично для скальпинга и арбитража.</p>
              </div>
              <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-center">
                <div className="text-3xl mb-2">🧘</div>
                <div className="text-white font-orbitron text-xs font-bold mb-1">Без эмоций</div>
                <p className="text-zinc-400 text-xs">Страх и жадность — главные враги трейдера. Бот исполняет стратегию без отклонений.</p>
              </div>
              <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-center">
                <div className="text-3xl mb-2">🕐</div>
                <div className="text-white font-orbitron text-xs font-bold mb-1">24/7</div>
                <p className="text-zinc-400 text-xs">Криптовалютный рынок не закрывается. Бот торгует пока вы спите.</p>
              </div>
            </div>
          </div>
        )
      },
      {
        title: "API-ключи: как безопасно подключить бота",
        content: (
          <div className="space-y-3">
            <p className="text-gray-300 leading-relaxed">API (Application Programming Interface) — мост между вашим ботом и биржей. Понимание безопасности API критично: ошибка здесь = потеря всего счёта.</p>
            <APIKeysGuide />
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
              <div className="text-white font-orbitron text-xs font-bold mb-2">Что бот может делать через API</div>
              <div className="grid grid-cols-2 gap-2 text-xs font-space-mono">
                <div>
                  <div className="text-green-400 mb-2">Разрешённые действия:</div>
                  <ul className="text-zinc-400 space-y-1">
                    <li>✓ Получать котировки и данные</li>
                    <li>✓ Видеть баланс счёта</li>
                    <li>✓ Открывать ордера</li>
                    <li>✓ Закрывать позиции</li>
                    <li>✓ Читать историю сделок</li>
                  </ul>
                </div>
                <div>
                  <div className="text-red-400 mb-2">Отключите вывод средств:</div>
                  <ul className="text-zinc-400 space-y-1">
                    <li>✗ Вывод на внешний кошелёк</li>
                    <li>✗ Перевод между аккаунтами</li>
                    <li>✗ Изменение настроек аккаунта</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )
      },
      {
        title: "Преимущества и ограничения: что бот не умеет",
        content: (
          <div className="space-y-3">
            <p className="text-gray-300 leading-relaxed">Боты — мощный инструмент, но не волшебная палочка. Понимание их ограничений спасёт от разочарований и потерь.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div className="text-green-400 font-orbitron text-xs font-bold mb-2">Что бот делает лучше человека</div>
                <ul className="space-y-2">
                  {[
                    "Работает 24/7 без перерывов",
                    "Исполняет стратегию без эмоций",
                    "Реагирует за миллисекунды",
                    "Тестирует стратегии на годах данных",
                    "Одновременно ведёт 10+ пар",
                    "Не паникует при -20% за день",
                  ].map((t, i) => (
                    <li key={i} className="flex gap-2 text-xs font-space-mono text-zinc-400">
                      <span className="text-green-400 flex-shrink-0">✓</span>{t}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <div className="text-red-400 font-orbitron text-xs font-bold mb-2">Что бот не умеет</div>
                <ul className="space-y-2">
                  {[
                    "Понимать новости и события (FOMC, твиты Маска)",
                    "Адаптироваться к изменению режима рынка",
                    "Предсказывать black swan события",
                    "Читать \"психологию\" рынка",
                    "Работать при технических сбоях биржи",
                    "Гарантировать прибыль при плохой стратегии",
                  ].map((t, i) => (
                    <li key={i} className="flex gap-2 text-xs font-space-mono text-zinc-400">
                      <span className="text-red-400 flex-shrink-0">✗</span>{t}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="bg-zinc-900 border border-yellow-500/20 rounded-xl p-4">
              <div className="text-yellow-400 font-orbitron text-xs font-bold mb-1">Главный принцип</div>
              <p className="text-zinc-400 text-xs font-space-mono">Бот усиливает вашу стратегию, а не создаёт её. Плохая стратегия + бот = быстрый слив (бот торгует хуже, но быстрее). Хорошая стратегия + бот = масштабирование прибыли.</p>
            </div>
          </div>
        )
      },
    ]
  },
  {
    id: "strategies",
    badge: "Глава 2",
    title: "Популярные стратегии для ботов",
    summary: "Стратегия — сердце любого бота. Рассмотрим самые распространённые алгоритмические стратегии с их логикой, плюсами и минусами.",
    sections: [
      {
        title: "Обзор и сравнение всех стратегий",
        content: (
          <div className="space-y-3">
            <p className="text-gray-300 leading-relaxed">Выбор стратегии зависит от вашего капитала, технических знаний и текущего состояния рынка. Не существует «лучшей» стратегии — только подходящая для конкретного рынка.</p>
            <StrategyComparisonTable />
            <div className="bg-zinc-900 border border-red-500/20 rounded-xl p-4">
              <div className="text-red-400 font-orbitron text-xs font-bold mb-1">Мартингейл — почему не рекомендуется</div>
              <p className="text-zinc-400 text-xs font-space-mono">Мартингейл удваивает размер позиции после каждого убытка. Математически это работает — до первой длинной серии потерь. Серия из 8 потерь при начальном лоте $100 → убыток $25,600. Один рыночный обвал уничтожает весь депозит.</p>
            </div>
          </div>
        )
      },
      {
        title: "Grid-бот: зарабатывай на боковике",
        content: (
          <div className="space-y-3">
            <p className="text-gray-300 leading-relaxed">Grid-бот идеален когда рынок «ходит» в диапазоне без чёткого тренда. Именно в такие периоды ручная торговля особенно сложна, а бот зарабатывает стабильно.</p>
            <GridBotChart />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-3">
                <div className="text-white font-orbitron text-xs font-bold mb-2">Как настроить Grid-бот</div>
                <ul className="text-zinc-400 text-xs font-space-mono space-y-1">
                  <li>→ Выберите диапазон цены (макс. и мин.)</li>
                  <li>→ Задайте количество уровней (5–50)</li>
                  <li>→ Чем больше уровней → меньше прибыль с каждого, но чаще срабатывают</li>
                  <li>→ Оставьте 20–30% капитала резервом</li>
                </ul>
              </div>
              <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-3">
                <div className="text-white font-orbitron text-xs font-bold mb-2">Пример расчёта прибыли</div>
                <div className="text-zinc-400 text-xs font-space-mono space-y-1">
                  <div>Диапазон: $40k–$50k</div>
                  <div>Уровней: 10 (через $1k)</div>
                  <div>Прибыль с уровня: ~2%</div>
                  <div>Капитал: $1000</div>
                  <div className="text-green-400 pt-1">→ При 3 срабатываниях/день: ~$6/день (0.6%)</div>
                </div>
              </div>
            </div>
          </div>
        )
      },
      {
        title: "DCA-бот и трендовые стратегии",
        content: (
          <div className="space-y-3">
            <p className="text-gray-300 leading-relaxed">DCA (Dollar Cost Averaging) — самая безопасная стратегия для новичков. Трендовые стратегии — для тех, кто хочет следовать рынку автоматически.</p>
            <DCAChart />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
              <div className="bg-zinc-900 border border-blue-500/20 rounded-xl p-4">
                <div className="text-blue-400 font-orbitron text-xs font-bold mb-2">DCA-стратегия</div>
                <div className="text-zinc-400 text-xs font-space-mono space-y-2">
                  <div><span className="text-white">Для кого:</span> долгосрочные инвесторы в BTC/ETH</div>
                  <div><span className="text-white">Логика:</span> покупать фиксированную сумму каждую неделю или при падении на X%</div>
                  <div><span className="text-white">Плюс:</span> не нужно угадывать дно рынка</div>
                  <div><span className="text-white">Минус:</span> при медвежьем рынке замораживает капитал на месяцы</div>
                </div>
              </div>
              <div className="bg-zinc-900 border border-yellow-500/20 rounded-xl p-4">
                <div className="text-yellow-400 font-orbitron text-xs font-bold mb-2">Трендовый бот (EMA/MACD)</div>
                <div className="text-zinc-400 text-xs font-space-mono space-y-2">
                  <div><span className="text-white">Для кого:</span> свинг-трейдеры, H1–H4</div>
                  <div><span className="text-white">Логика:</span> вход по Golden Cross EMA, выход по Death Cross</div>
                  <div><span className="text-white">Плюс:</span> хорошо работает на сильных трендах (BTC 2020–2021)</div>
                  <div><span className="text-white">Минус:</span> боковик генерирует много убыточных сделок</div>
                </div>
              </div>
            </div>
          </div>
        )
      },
    ]
  },
  {
    id: "backtesting",
    badge: "Глава 3",
    title: "Бэктестинг: проверка стратегии на истории",
    summary: "Прежде чем запускать бота с реальными деньгами, нужно проверить стратегию на исторических данных. Это называется бэктестинг.",
    sections: [
      {
        title: "Ключевые метрики бэктестинга",
        content: (
          <div className="space-y-3">
            <p className="text-gray-300 leading-relaxed">Результат бэктестинга — не просто «+50% за год». Это целый набор метрик, который показывает надёжность и устойчивость стратегии.</p>
            <BacktestMetricsTable />
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
              <div className="text-white font-orbitron text-xs font-bold mb-2">Пример интерпретации результатов</div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs font-space-mono">
                {[
                  { metric: "Total Return", val: "+87%", color: "text-green-400" },
                  { metric: "Max Drawdown", val: "-18%", color: "text-yellow-400" },
                  { metric: "Sharpe Ratio", val: "1.8", color: "text-green-400" },
                  { metric: "Win Rate", val: "52%", color: "text-blue-400" },
                  { metric: "Profit Factor", val: "1.65", color: "text-green-400" },
                  { metric: "Trades", val: "247", color: "text-purple-400" },
                ].map((m, i) => (
                  <div key={i} className="bg-zinc-950 rounded-lg p-2 text-center">
                    <div className="text-zinc-500 text-xs mb-1">{m.metric}</div>
                    <div className={`font-bold text-base ${m.color}`}>{m.val}</div>
                  </div>
                ))}
              </div>
              <p className="text-zinc-500 text-xs mt-2 font-space-mono">Эти результаты выглядят реалистично и заслуживают доверия — можно переходить к paper trading.</p>
            </div>
          </div>
        )
      },
      {
        title: "Overfitting: главная ловушка бэктестинга",
        content: (
          <div className="space-y-3">
            <p className="text-gray-300 leading-relaxed">Overfitting (переобучение) — самая частая причина провала ботов в реальной торговле. Стратегия «слишком хорошо» адаптирована под исторические данные и не работает в будущем.</p>
            <OverfittingChart />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="bg-zinc-900 border border-red-500/20 rounded-lg p-3">
                <div className="text-red-400 font-orbitron text-xs font-bold mb-2">Признаки overfitting</div>
                <ul className="text-zinc-400 text-xs font-space-mono space-y-1">
                  <li>✗ Доходность &gt;300% в год</li>
                  <li>✗ Win Rate &gt;85%</li>
                  <li>✗ Работает только на 1 активе</li>
                  <li>✗ Работает только за 1 год</li>
                  <li>✗ Очень много параметров (20+)</li>
                  <li>✗ Max Drawdown &lt;3%</li>
                </ul>
              </div>
              <div className="bg-zinc-900 border border-green-500/20 rounded-lg p-3">
                <div className="text-green-400 font-orbitron text-xs font-bold mb-2">Как избежать overfitting</div>
                <ul className="text-zinc-400 text-xs font-space-mono space-y-1">
                  <li>✓ Тест на 3+ разных периодах</li>
                  <li>✓ Out-of-sample тест (отдельный период)</li>
                  <li>✓ Тест на 3+ активах</li>
                  <li>✓ Минимальное число параметров</li>
                  <li>✓ Walk-forward оптимизация</li>
                  <li>✓ Paper trading перед реальным</li>
                </ul>
              </div>
            </div>
          </div>
        )
      },
      {
        title: "Инструменты для бэктестинга: от простых к мощным",
        content: (
          <div className="space-y-3">
            <p className="text-gray-300 leading-relaxed">Начните с простого инструмента — TradingView. Когда почувствуете потребность в большем контроле — переходите на Python.</p>
            <BacktestingCodeExample />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { name: "TradingView Pine Script", level: "Начинающий", desc: "Встроенный бэктестер прямо на графике. Не нужно устанавливать ничего. Ограничен данными и возможностями.", link: "tradingview.com", color: "text-blue-400" },
                { name: "Python + Backtesting.py", level: "Средний", desc: "Простая библиотека, 50 строк кода для полноценного бэктеста. Установка: pip install backtesting", link: "kernc.github.io/backtesting.py", color: "text-yellow-400" },
                { name: "Freqtrade", level: "Продвинутый", desc: "Полноценный фреймворк для крипто-ботов. Встроенный бэктестинг, оптимизация, Telegram, Docker.", link: "freqtrade.io", color: "text-green-400" },
                { name: "Backtrader", level: "Продвинутый", desc: "Мощная Python-библиотека для любых рынков (акции, фьючерсы, форекс). Поддерживает любые данные.", link: "backtrader.com", color: "text-purple-400" },
              ].map((t, i) => (
                <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-1">
                    <div className={`font-orbitron text-xs font-bold ${t.color}`}>{t.name}</div>
                    <Badge className="bg-zinc-800 text-zinc-400 border-0 text-xs">{t.level}</Badge>
                  </div>
                  <p className="text-zinc-400 text-xs font-space-mono leading-relaxed">{t.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )
      },
    ]
  },
  {
    id: "platforms",
    badge: "Глава 4",
    title: "Платформы для создания ботов без кода",
    summary: "Не умеете программировать? Это не проблема. Существуют no-code платформы, позволяющие создавать ботов через визуальный интерфейс.",
    sections: [
      {
        title: "Полное сравнение платформ 2024",
        content: (
          <div className="space-y-3">
            <p className="text-gray-300 leading-relaxed">Рынок no-code платформ для ботов активно развивается. Выбор зависит от ваших задач, бюджета и биржи.</p>
            <PlatformsComparisonTable />
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
              <div className="text-white font-orbitron text-xs font-bold mb-3">Как выбрать платформу</div>
              <div className="space-y-2 text-xs font-space-mono text-zinc-400">
                <div className="flex gap-2"><span className="text-white flex-shrink-0">Новичок:</span><span>Pionex или Bybit Bot — бесплатно, встроено в биржу, нет проблем с API</span></div>
                <div className="flex gap-2"><span className="text-white flex-shrink-0">Средний уровень:</span><span>3Commas или Cryptohopper — больше типов ботов, маркетплейс стратегий</span></div>
                <div className="flex gap-2"><span className="text-white flex-shrink-0">Серьёзный трейдер:</span><span>Freqtrade — бесплатно, полный контроль, свой сервер, все биржи через CCXT</span></div>
              </div>
            </div>
          </div>
        )
      },
      {
        title: "3Commas и Pionex: детальный разбор",
        content: (
          <div className="space-y-3">
            <p className="text-gray-300 leading-relaxed">Это два самых популярных варианта для старта. Разберём их детально.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="text-2xl">🟢</div>
                  <div className="text-white font-orbitron font-bold">3Commas</div>
                </div>
                <div className="space-y-2 text-xs font-space-mono">
                  <div className="grid grid-cols-2 gap-1">
                    <div className="text-zinc-500">Биржи:</div><div className="text-zinc-300">Binance, Bybit, OKX, +17</div>
                    <div className="text-zinc-500">Боты:</div><div className="text-zinc-300">DCA, Grid, Options, Composite</div>
                    <div className="text-zinc-500">Цена:</div><div className="text-yellow-400">$29 / $49 / $99 в мес.</div>
                    <div className="text-zinc-500">Маркетплейс:</div><div className="text-green-400">Да (копируй чужих ботов)</div>
                    <div className="text-zinc-500">Мобил. приложение:</div><div className="text-green-400">iOS + Android</div>
                  </div>
                  <div className="border-t border-zinc-800 pt-2">
                    <div className="text-red-400">⚠️ Риск:</div>
                    <p className="text-zinc-500">Сторонний сервис хранит ваши API-ключи. В 2019 году был взлом похожей платформы.</p>
                  </div>
                </div>
              </div>
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="text-2xl">🔵</div>
                  <div className="text-white font-orbitron font-bold">Pionex</div>
                </div>
                <div className="space-y-2 text-xs font-space-mono">
                  <div className="grid grid-cols-2 gap-1">
                    <div className="text-zinc-500">Тип:</div><div className="text-zinc-300">Биржа со встроенными ботами</div>
                    <div className="text-zinc-500">Боты:</div><div className="text-zinc-300">16 типов (Grid, DCA, TWAP...)</div>
                    <div className="text-zinc-500">Цена:</div><div className="text-green-400">Бесплатно</div>
                    <div className="text-zinc-500">Комиссия:</div><div className="text-yellow-400">0.05% (очень низкая)</div>
                    <div className="text-zinc-500">API-ключи:</div><div className="text-green-400">Не нужны</div>
                  </div>
                  <div className="border-t border-zinc-800 pt-2">
                    <div className="text-yellow-400">⚠️ Ограничение:</div>
                    <p className="text-zinc-500">Только их торговые пары. Нельзя использовать свою биржу.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      },
      {
        title: "Freqtrade: для тех, кто хочет полный контроль",
        content: (
          <div className="space-y-3">
            <p className="text-gray-300 leading-relaxed">Freqtrade — открытый исходный код, ваш сервер, ваша стратегия. Требует базовых знаний Python и командной строки, но даёт неограниченные возможности.</p>
            <div className="bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-2 border-b border-zinc-800 bg-zinc-900">
                <div className="w-2 h-2 rounded-full bg-red-500" />
                <div className="w-2 h-2 rounded-full bg-yellow-500" />
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span className="text-zinc-500 text-xs font-space-mono ml-2">terminal</span>
              </div>
              <pre className="p-4 text-xs font-space-mono text-zinc-300 leading-relaxed overflow-x-auto">
{`# Установка Freqtrade через Docker (рекомендуется)
curl -sSL https://raw.githubusercontent.com/freqtrade/freqtrade/stable/setup.sh | bash

# Создать новый проект
freqtrade create-userdir --userdir user_data

# Запустить бэктестинг стратегии
freqtrade backtesting --strategy SampleStrategy \\
  --timerange 20230101-20231231 \\
  --pairs BTC/USDT ETH/USDT

# Запустить в режиме paper trading (без реальных денег)
freqtrade trade --strategy SampleStrategy --dry-run`}
              </pre>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-space-mono">
              {[
                { title: "Поддержка бирж", value: "100+ (через CCXT)", color: "text-green-400" },
                { title: "Встроенный бэктест", value: "Да, с подробной статистикой", color: "text-blue-400" },
                { title: "Telegram-интеграция", value: "Управление ботом из Telegram", color: "text-purple-400" },
              ].map((f, i) => (
                <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-lg p-3">
                  <div className="text-zinc-500 mb-1">{f.title}</div>
                  <div className={`font-semibold ${f.color}`}>{f.value}</div>
                </div>
              ))}
            </div>
          </div>
        )
      },
    ]
  },
  {
    id: "launch",
    badge: "Глава 5",
    title: "Запуск бота: чеклист перед стартом",
    summary: "Перед запуском бота с реальными деньгами пройдите этот чеклист. Пропуск любого пункта может стоить части депозита.",
    sections: [
      {
        title: "Полный чеклист запуска по 4 категориям",
        content: (
          <div className="space-y-3">
            <p className="text-gray-300 leading-relaxed">Этот чеклист составлен на основе опыта сотен трейдеров. Каждый пункт — результат чьей-то дорогостоящей ошибки.</p>
            <LaunchChecklist />
          </div>
        )
      },
      {
        title: "Мониторинг и ежедневное обслуживание",
        content: (
          <div className="space-y-3">
            <p className="text-gray-300 leading-relaxed">Запустить бота — это 20% работы. Остальные 80% — мониторинг и своевременные корректировки.</p>
            <MonitoringDashboard />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-3">
                <div className="text-blue-400 font-orbitron text-xs font-bold mb-2">Ежедневно</div>
                <ul className="text-zinc-400 text-xs font-space-mono space-y-1">
                  <li>→ P&L за день</li>
                  <li>→ Количество сделок</li>
                  <li>→ Открытые позиции</li>
                  <li>→ Ошибки в логах</li>
                </ul>
              </div>
              <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-3">
                <div className="text-purple-400 font-orbitron text-xs font-bold mb-2">Еженедельно</div>
                <ul className="text-zinc-400 text-xs font-space-mono space-y-1">
                  <li>→ Win Rate за неделю</li>
                  <li>→ Сравнение с бэктестом</li>
                  <li>→ Состояние рынка (тренд/флэт)</li>
                  <li>→ Актуальность параметров</li>
                </ul>
              </div>
              <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-3">
                <div className="text-yellow-400 font-orbitron text-xs font-bold mb-2">Ежемесячно</div>
                <ul className="text-zinc-400 text-xs font-space-mono space-y-1">
                  <li>→ Переоптимизация параметров</li>
                  <li>→ Анализ просадок</li>
                  <li>→ Обновление стратегии</li>
                  <li>→ Смена ключей API</li>
                </ul>
              </div>
            </div>
          </div>
        )
      },
      {
        title: "Риск-менеджмент для бота: защита капитала",
        content: (
          <div className="space-y-3">
            <p className="text-gray-300 leading-relaxed">Риск-менеджмент бота — это те же правила, что и для ручной торговли, только автоматизированные.</p>
            <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4">
              <svg viewBox="0 0 360 140" className="w-full h-36">
                {/* Capital shield layers */}
                <rect x="20" y="20" width="320" height="100" rx="8" fill="#ef444408" stroke="#ef444430" strokeWidth="1" />
                <rect x="35" y="32" width="290" height="77" rx="6" fill="#f59e0b08" stroke="#f59e0b30" strokeWidth="1" />
                <rect x="50" y="44" width="260" height="54" rx="5" fill="#22c55e08" stroke="#22c55e30" strokeWidth="1" />
                <rect x="65" y="56" width="230" height="32" rx="4" fill="#3b82f608" stroke="#3b82f630" strokeWidth="1" />
                <text x="185" y="76" fontSize="11" fill="#93c5fd" textAnchor="middle" fontFamily="monospace" fontWeight="bold">КАПИТАЛ БОТА</text>
                <text x="185" y="90" fontSize="8" fill="#60a5fa" textAnchor="middle" fontFamily="monospace">$1,000 (10% от общего)</text>
                <text x="30" y="84" fontSize="8" fill="#86efac" fontFamily="monospace" transform="rotate(-90, 30, 84)">Daily SL</text>
                <text x="15" y="73" fontSize="8" fill="#fcd34d" fontFamily="monospace" transform="rotate(-90, 15, 73)">Global SL</text>
                <text x="185" y="130" fontSize="8" fill="#52525b" textAnchor="middle" fontFamily="monospace">Слои защиты капитала: начинайте с 10% депозита → расширяйте после 30 дней прибыли</text>
              </svg>
            </div>
            <div className="space-y-2">
              {[
                { title: "Daily Stop Loss (Дневной лимит потерь)", desc: "Установите максимальный убыток за день — например 3%. При достижении бот прекращает торговать до следующего дня. Это защищает от лавинных потерь при аномальной волатильности.", color: "text-red-400" },
                { title: "Лимит размера позиции", desc: "Каждая позиция бота не должна занимать более 10–15% от капитала бота. Если бот торгует несколько пар — диверсификация снижает риск одного плохого актива.", color: "text-yellow-400" },
                { title: "Глобальный Stop Loss", desc: "Если бот потерял 15–20% от стартового капитала — автоматически останавливается и требует ручного перезапуска. Это сигнал пересмотреть стратегию, а не продолжать торговать.", color: "text-orange-400" },
                { title: "Минимальный стартовый капитал", desc: "Запускайте с 10–20% от планируемого капитала. Дайте боту поработать 2–4 недели — сравните результаты с бэктестом. Только после подтверждения добавляйте полный капитал.", color: "text-green-400" },
              ].map((rule, i) => (
                <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-lg p-3">
                  <div className={`font-orbitron text-xs font-bold mb-1 ${rule.color}`}>{rule.title}</div>
                  <p className="text-zinc-400 text-xs font-space-mono leading-relaxed">{rule.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )
      },
    ]
  },
]

/* ─── Page Component ──────────────────────────────────────────── */

export default function BotsGuide() {
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
  const total = chapters.length
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
              Гайд по торговым ботам
            </h1>
            <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
              От понимания принципов работы до запуска первого бота. Стратегии, бэктестинг, платформы и чеклист запуска.
            </p>
          </div>

          {/* Progress */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 mb-10">
            <div className="flex items-center justify-between mb-3">
              <span className="font-orbitron text-white text-sm">Прогресс по гайду</span>
              <span className="font-space-mono text-red-400 text-sm font-bold">{readCount} / {total} глав</span>
            </div>
            <div className="w-full bg-zinc-800 rounded-full h-2 mb-2">
              <div
                className="bg-red-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${pct}%` }}
              />
            </div>
            <div className="flex gap-2 mt-3 flex-wrap">
              {chapters.map((c) => (
                <a
                  key={c.id}
                  href={`#${c.id}`}
                  className={`text-xs font-space-mono px-3 py-1 rounded-full border transition-colors ${
                    readChapters.has(c.id)
                      ? "bg-green-500/20 border-green-500/40 text-green-400"
                      : "border-red-500/30 text-red-400 hover:bg-red-500/10"
                  }`}
                >
                  {readChapters.has(c.id) ? "✓ " : ""}{c.badge}
                </a>
              ))}
            </div>
          </div>

          {/* Chapters */}
          <div className="space-y-12">
            {chapters.map((chapter) => {
              const isDone = readChapters.has(chapter.id)
              return (
                <div key={chapter.id} id={chapter.id} className="scroll-mt-24">
                  <Card className={`border transition-colors ${isDone ? "bg-zinc-900/60 border-green-500/25" : "bg-zinc-900 border-red-500/20"}`}>
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between mb-3">
                        <Badge className="bg-red-500 text-white border-0">{chapter.badge}</Badge>
                        <button
                          onClick={() => toggleChapter(chapter.id)}
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
                        {chapter.title}
                      </CardTitle>
                      <p className="text-gray-400 leading-relaxed mt-2">{chapter.summary}</p>
                    </CardHeader>
                    <CardContent>
                      <Accordion type="multiple" className="w-full">
                        {chapter.sections.map((section, idx) => (
                          <AccordionItem
                            key={idx}
                            value={`${chapter.id}-${idx}`}
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
            <p className="text-gray-400 mb-4 font-space-mono">Хотите создать своего бота прямо сейчас?</p>
            <a
              href="/bot-builder"
              className="inline-block bg-red-500 hover:bg-red-600 text-white font-orbitron px-8 py-3 rounded-md transition-colors"
            >
              Открыть конструктор ботов →
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
