import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Icon from "@/components/ui/icon"

const bots = [
  {
    name: "Spot Grid Bot",
    icon: "Grid3x3",
    color: "border-green-500/30",
    accent: "text-green-400",
    bg: "bg-green-500/10",
    risk: "Низкий",
    minDeposit: "$100",
    bestFor: "Боковой рынок, флэт",
    desc: "Покупает на падении, продаёт на росте в заданном диапазоне. Делает много мелких сделок — идеально для бокового тренда.",
    pros: ["Без эмоций — алгоритм", "Профит даже в боковике", "Встроен в Bybit бесплатно"],
    cons: ["Сливает при сильном тренде вниз", "Нужно угадать диапазон"],
    apiUsage: "Bybit Built-in (без API) ИЛИ ccxt + pybit",
  },
  {
    name: "DCA Bot",
    icon: "TrendingDown",
    color: "border-blue-500/30",
    accent: "text-blue-400",
    bg: "bg-blue-500/10",
    risk: "Средний",
    minDeposit: "$50",
    bestFor: "Долгосрочные позиции",
    desc: "Усреднение стоимости — докупает на каждом откате цены. Снижает среднюю цену входа. Идеально для накопления BTC/ETH.",
    pros: ["Работает в любом тренде", "Снижает риск входа в максимум", "Психологически комфортный"],
    cons: ["Замораживает капитал", "Прибыль только при росте"],
    apiUsage: "Bybit Built-in + Webhook от TradingView",
  },
  {
    name: "Futures Grid",
    icon: "Zap",
    color: "border-red-500/30",
    accent: "text-red-400",
    bg: "bg-red-500/10",
    risk: "Высокий",
    minDeposit: "$200",
    bestFor: "Опытные трейдеры",
    desc: "Сетка с плечом — лонг и шорт одновременно. Двунаправленный заработок на волатильности. Только для понимающих маржин-коллы.",
    pros: ["Прибыль и в росте, и в падении", "Плечо умножает доход", "Хедж против рынка"],
    cons: ["Ликвидация при сильном движении", "Funding rate ест прибыль"],
    apiUsage: "pybit + собственный код через REST API v5",
  },
  {
    name: "Martingale Bot",
    icon: "Repeat",
    color: "border-orange-500/30",
    accent: "text-orange-400",
    bg: "bg-orange-500/10",
    risk: "Очень высокий",
    minDeposit: "$500",
    bestFor: "Тесты на демо",
    desc: "Удваивает ставку после убытка. Математически — рано или поздно сольёт депозит. Используется только как часть гибридных стратегий.",
    pros: ["Быстро отыгрывает убытки", "Простая логика"],
    cons: ["⚠️ Высокий риск слива", "Не работает в трендовом рынке", "Нужен большой банк"],
    apiUsage: "Конструктор TradeBase + кастомный код",
  },
  {
    name: "Arbitrage Bot",
    icon: "ArrowLeftRight",
    color: "border-purple-500/30",
    accent: "text-purple-400",
    bg: "bg-purple-500/10",
    risk: "Низкий",
    minDeposit: "$1000",
    bestFor: "Большие депозиты",
    desc: "Покупает на одной бирже дешевле — продаёт на Bybit дороже (или наоборот). Прибыль 0.1-0.5% за сделку, но почти без риска.",
    pros: ["Минимальный риск", "Стабильный доход", "Не зависит от тренда"],
    cons: ["Нужен большой капитал", "Спреды сокращаются", "Высокие комиссии за вывод"],
    apiUsage: "ccxt с несколькими биржами + быстрый VPS",
  },
  {
    name: "AI Signal Bot",
    icon: "Sparkles",
    color: "border-pink-500/30",
    accent: "text-pink-400",
    bg: "bg-pink-500/10",
    risk: "Средний",
    minDeposit: "$100",
    bestFor: "Активные трейдеры",
    desc: "Получает сигналы от TradingView (или своего ML-скрипта) через Webhook и исполняет на Bybit. Гибрид человек+алгоритм.",
    pros: ["Любая ваша стратегия", "Можно бэктестить", "TradingView интеграция"],
    cons: ["Нужен платный TradingView Pro", "Задержка сигнала ~1-3 сек"],
    apiUsage: "TradingView Webhook → ваш сервер → Bybit API",
  },
]

export function BybitBotTypes() {
  return (
    <section className="mb-20">
      <h2 className="font-orbitron text-3xl font-bold text-white mb-2 flex items-center gap-3">
        <Icon name="Bot" className="text-yellow-400" /> Типы ботов на Bybit
      </h2>
      <p className="text-gray-400 mb-8">
        Что можно автоматизировать. От встроенных (без API) до кастомных (через Python).
      </p>
      <div className="grid md:grid-cols-2 gap-6">
        {bots.map((b) => (
          <Card key={b.name} className={`bg-zinc-900/50 ${b.color} border-2`}>
            <CardHeader>
              <div className="flex items-center justify-between mb-2">
                <div className={`w-12 h-12 rounded-lg ${b.bg} flex items-center justify-center`}>
                  <Icon name={b.icon} className={b.accent} size={24} />
                </div>
                <Badge className="bg-zinc-800 text-gray-300 border-zinc-700 text-xs">
                  Риск: {b.risk}
                </Badge>
              </div>
              <CardTitle className={`font-orbitron text-xl ${b.accent}`}>{b.name}</CardTitle>
              <div className="text-xs text-gray-500 font-mono">
                Мин. депозит: <span className="text-white">{b.minDeposit}</span> · {b.bestFor}
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 mb-4 text-sm">{b.desc}</p>

              <div className="mb-3">
                <div className="text-xs text-green-400 mb-1.5 font-semibold">Плюсы:</div>
                <ul className="space-y-1">
                  {b.pros.map((p) => (
                    <li key={p} className="text-xs text-gray-300 flex items-start gap-2">
                      <Icon name="Check" size={12} className="text-green-400 mt-0.5 flex-shrink-0" />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mb-3">
                <div className="text-xs text-red-400 mb-1.5 font-semibold">Минусы:</div>
                <ul className="space-y-1">
                  {b.cons.map((c) => (
                    <li key={c} className="text-xs text-gray-300 flex items-start gap-2">
                      <Icon name="X" size={12} className="text-red-400 mt-0.5 flex-shrink-0" />
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-black/40 border border-zinc-800 rounded p-2.5 text-xs">
                <span className="text-gray-500">🔧 Подключение:</span>{" "}
                <span className="text-gray-300 font-mono">{b.apiUsage}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}

export default BybitBotTypes
