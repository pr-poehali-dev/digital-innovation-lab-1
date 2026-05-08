import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Icon from "@/components/ui/icon"
import { PlatformsProfitCalculator } from "@/components/PlatformsProfitCalculator"

type Platform = {
  id: string
  name: string
  logo: string
  tagline: string
  founded: string
  hq: string
  users: string
  pricing: string
  freeTier: boolean
  exchanges: number
  bots: string[]
  bestFor: string
  rating: number
  url: string
  color: string
}

const platforms: Platform[] = [
  {
    id: "pionex",
    name: "Pionex",
    logo: "🟢",
    tagline: "Биржа со встроенными ботами",
    founded: "2019",
    hq: "Сингапур",
    users: "1 000 000+",
    pricing: "Бесплатно (комиссия 0.05%)",
    freeTier: true,
    exchanges: 1,
    bots: ["Grid Bot", "DCA Bot", "Arbitrage Bot", "Smart Trade", "Leveraged Grid", "Spot-Futures Arbitrage", "Rebalancing Bot", "TWAP Bot"],
    bestFor: "Новички и пассивные трейдеры",
    rating: 4.5,
    url: "pionex.com",
    color: "green",
  },
  {
    id: "3commas",
    name: "3Commas",
    logo: "🔵",
    tagline: "Профи-комбайн для опытных",
    founded: "2017",
    hq: "Эстония",
    users: "220 000+",
    pricing: "$22–$75/мес",
    freeTier: false,
    exchanges: 18,
    bots: ["DCA Bot", "Grid Bot", "Options Bot", "Smart Trade", "Signal Bot", "TradingView Webhooks"],
    bestFor: "Опытные трейдеры и команды",
    rating: 4.0,
    url: "3commas.io",
    color: "blue",
  },
  {
    id: "bitsgap",
    name: "Bitsgap",
    logo: "🟣",
    tagline: "Универсальный терминал",
    founded: "2018",
    hq: "Эстония",
    users: "500 000+",
    pricing: "$24–$149/мес",
    freeTier: false,
    exchanges: 15,
    bots: ["GRID Bot", "DCA Bot", "BTD (Buy The Dip)", "Combo Bot", "Futures Bot", "Demo Trading"],
    bestFor: "Активные мульти-биржевые трейдеры",
    rating: 4.3,
    url: "bitsgap.com",
    color: "purple",
  },
]

const compareRows = [
  { label: "Год основания", values: ["2019", "2017", "2018"] },
  { label: "Штаб-квартира", values: ["Сингапур", "Эстония", "Эстония"] },
  { label: "Пользователей", values: ["1 000 000+", "220 000+", "500 000+"] },
  { label: "Бирж в подключении", values: ["1 (своя)", "18+", "15+"] },
  { label: "Бесплатный тариф", values: ["Да, навсегда", "Только триал 3 дня", "Триал 7 дней"] },
  { label: "Минимальный тариф", values: ["$0", "$22/мес", "$24/мес"] },
  { label: "Топ-тариф", values: ["$0", "$75/мес", "$149/мес"] },
  { label: "Комиссия за сделки", values: ["0.05%", "Биржевая", "Биржевая"] },
  { label: "Демо-режим", values: ["Нет (paper trading отдельно)", "Да", "Да"] },
  { label: "Бэктестинг", values: ["Базовый", "Продвинутый", "Продвинутый"] },
  { label: "Мобильное приложение", values: ["iOS/Android", "iOS/Android", "iOS/Android"] },
  { label: "Русский язык", values: ["Да", "Да", "Да"] },
  { label: "Копитрейдинг", values: ["Нет", "Да (Marketplace)", "Нет"] },
  { label: "TradingView сигналы", values: ["Нет", "Да", "Да"] },
  { label: "Фьючерсы", values: ["Да", "Да", "Да"] },
  { label: "Безопасность (взломы в истории)", values: ["Не было", "Был инцидент в 2022", "Не было"] },
]

const proCons = [
  {
    name: "Pionex",
    color: "green",
    pros: [
      "Полностью бесплатные боты — платишь только биржевую комиссию 0.05%",
      "16+ встроенных ботов прямо на бирже — не нужны API-ключи",
      "Идеально для новичков — простой интерфейс на русском",
      "Самая большая аудитория среди бот-платформ (1М+)",
      "Регулирована в США (MSB FinCEN)",
    ],
    cons: [
      "Работает ТОЛЬКО внутри своей биржи — нельзя подключить Binance/Bybit",
      "Ограниченный выбор торговых пар по сравнению с Binance",
      "Слабый бэктестинг — только базовая статистика",
      "Нет копитрейдинга и TradingView-сигналов",
      "Ликвидность ниже, чем на топ-биржах",
    ],
  },
  {
    name: "3Commas",
    color: "blue",
    pros: [
      "Подключение 18+ бирж одновременно (Binance, Bybit, OKX, Kraken и др.)",
      "Мощный SmartTrade-терминал с трейлинг-стопами и тейк-профитами",
      "Поддержка TradingView-вебхуков — автоматизация любых стратегий",
      "Marketplace сигналов и готовых ботов от других трейдеров",
      "Глубокий бэктестинг с историей до 3 лет",
    ],
    cons: [
      "Дорого — от $22/мес, топ-тариф $75/мес",
      "В 2022 году произошла утечка API-ключей — репутационный удар",
      "Сложный интерфейс — крутая кривая обучения для новичков",
      "Нет полноценного бесплатного тарифа",
      "DCA-боты при медвежьем тренде могут сильно слить депозит",
    ],
  },
  {
    name: "Bitsgap",
    color: "purple",
    pros: [
      "Лучший GRID-бот на рынке по отзывам — стабильно работает в боковике",
      "Единый терминал для торговли на 15+ биржах с одного экрана",
      "Полноценный демо-режим с виртуальными $50 000",
      "Combo-боты совмещают GRID + DCA в одной стратегии",
      "Чистый и удобный интерфейс — лучше чем у 3Commas",
    ],
    cons: [
      "Дороже 3Commas на верхних тарифах ($149/мес)",
      "Нет копитрейдинга и публичного marketplace",
      "Меньше типов ботов чем у конкурентов",
      "Слабая русскоязычная поддержка (отвечают долго)",
      "Фьючерсная торговля доступна только на платных тарифах",
    ],
  },
]

const verdicts = [
  {
    case: "Я новичок, хочу попробовать ботов без вложений",
    winner: "Pionex",
    color: "green",
    reason: "Бесплатно, просто, не надо разбираться с API",
    percent: 68,
  },
  {
    case: "У меня уже есть Binance/Bybit и я хочу автоматизировать",
    winner: "Bitsgap",
    color: "purple",
    reason: "Лучший GRID + удобный мульти-биржевой терминал",
    percent: 52,
  },
  {
    case: "Я профи, торгую по сигналам TradingView",
    winner: "3Commas",
    color: "blue",
    reason: "Вебхуки, мощный SmartTrade, marketplace сигналов",
    percent: 61,
  },
  {
    case: "Хочу копировать сделки топ-трейдеров",
    winner: "3Commas",
    color: "blue",
    reason: "Единственная из тройки с полноценным копитрейдингом",
    percent: 74,
  },
  {
    case: "Боковой рынок, хочу зарабатывать на колебаниях",
    winner: "Bitsgap",
    color: "purple",
    reason: "GRID-бот Bitsgap считается эталонным в индустрии",
    percent: 58,
  },
]

export default function PlatformsCompare() {
  return (
    <div className="dark min-h-screen bg-black">
      <Navbar />
      <main className="pt-24 pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <Badge className="bg-red-500/20 text-red-400 border-red-500/30 mb-4">Сравнительный анализ 2026</Badge>
            <h1 className="font-orbitron text-4xl md:text-5xl font-bold text-white mb-6">
              Pionex vs 3Commas vs Bitsgap
            </h1>
            <p className="text-gray-300 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
              Подробный разбор трёх крупнейших платформ автотрейдинга. Сильные и слабые стороны, цены, типы ботов и кому какая подходит.
            </p>
          </div>

          {/* Cards Overview */}
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            {platforms.map((p) => (
              <Card key={p.id} className={`bg-zinc-900 border-${p.color}-500/30 hover:border-${p.color}-500/60 transition-colors`}>
                <CardHeader>
                  <div className="text-5xl mb-3">{p.logo}</div>
                  <CardTitle className="font-orbitron text-2xl text-white">{p.name}</CardTitle>
                  <p className="text-gray-400 text-sm">{p.tagline}</p>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Год:</span>
                    <span className="text-white">{p.founded}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Юзеров:</span>
                    <span className="text-white">{p.users}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Цена:</span>
                    <span className={`text-${p.color}-400 font-semibold`}>{p.pricing}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Бирж:</span>
                    <span className="text-white">{p.exchanges}</span>
                  </div>
                  <div className="pt-3 border-t border-zinc-800">
                    <p className="text-xs text-gray-500 mb-1">Лучше всего для:</p>
                    <p className="text-white text-sm">{p.bestFor}</p>
                  </div>
                  <div className="flex items-center gap-1 pt-2">
                    {[...Array(5)].map((_, i) => (
                      <Icon
                        key={i}
                        name="Star"
                        size={16}
                        className={i < Math.floor(p.rating) ? `text-${p.color}-400 fill-${p.color}-400` : "text-zinc-700"}
                      />
                    ))}
                    <span className="text-white text-sm ml-2">{p.rating}/5</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Profit Calculator */}
          <PlatformsProfitCalculator />

          {/* Comparison Table */}
          <Card className="bg-zinc-900 border-red-500/20 mb-16">
            <CardHeader>
              <CardTitle className="font-orbitron text-2xl text-white flex items-center gap-2">
                <Icon name="Table" size={24} className="text-red-500" />
                Сравнительная таблица
              </CardTitle>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-800">
                    <th className="text-left py-3 px-4 text-gray-400 font-geist">Параметр</th>
                    <th className="text-left py-3 px-4 text-green-400 font-geist">Pionex</th>
                    <th className="text-left py-3 px-4 text-blue-400 font-geist">3Commas</th>
                    <th className="text-left py-3 px-4 text-purple-400 font-geist">Bitsgap</th>
                  </tr>
                </thead>
                <tbody>
                  {compareRows.map((row, i) => (
                    <tr key={i} className="border-b border-zinc-800/50 hover:bg-zinc-800/30">
                      <td className="py-3 px-4 text-gray-300 font-geist">{row.label}</td>
                      {row.values.map((v, j) => (
                        <td key={j} className="py-3 px-4 text-white">{v}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>

          {/* Pros & Cons */}
          <h2 className="font-orbitron text-3xl font-bold text-white mb-8 text-center">
            Сильные и слабые стороны
          </h2>
          <div className="space-y-6 mb-16">
            {proCons.map((p) => (
              <Card key={p.name} className={`bg-zinc-900 border-${p.color}-500/30`}>
                <CardHeader>
                  <CardTitle className={`font-orbitron text-2xl text-${p.color}-400`}>{p.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-green-400 font-orbitron text-sm mb-3 flex items-center gap-2">
                        <Icon name="CheckCircle2" size={18} />
                        СИЛЬНЫЕ СТОРОНЫ
                      </h4>
                      <ul className="space-y-2">
                        {p.pros.map((pro, i) => (
                          <li key={i} className="text-gray-300 text-sm flex gap-2">
                            <span className="text-green-400 mt-0.5">+</span>
                            <span>{pro}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-red-400 font-orbitron text-sm mb-3 flex items-center gap-2">
                        <Icon name="XCircle" size={18} />
                        СЛАБЫЕ СТОРОНЫ
                      </h4>
                      <ul className="space-y-2">
                        {p.cons.map((con, i) => (
                          <li key={i} className="text-gray-300 text-sm flex gap-2">
                            <span className="text-red-400 mt-0.5">−</span>
                            <span>{con}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Verdicts by case */}
          <h2 className="font-orbitron text-3xl font-bold text-white mb-8 text-center">
            Кому какая платформа подходит
          </h2>
          <div className="grid md:grid-cols-2 gap-4 mb-16">
            {verdicts.map((v, i) => (
              <Card key={i} className="bg-zinc-900 border-zinc-800 hover:border-red-500/40 transition-colors">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3 mb-3">
                    <Icon name="HelpCircle" size={20} className="text-red-500 mt-0.5" />
                    <p className="text-white font-geist">{v.case}</p>
                  </div>
                  <div className={`pl-8 border-l-2 border-${v.color}-500`}>
                    <p className="text-gray-500 text-xs mb-1">Победитель:</p>
                    <p className={`text-${v.color}-400 font-orbitron text-xl font-bold mb-2`}>{v.winner}</p>
                    <p className="text-gray-400 text-sm mb-2">{v.reason}</p>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                        <div className={`h-full bg-${v.color}-500`} style={{ width: `${v.percent}%` }} />
                      </div>
                      <span className="text-xs text-gray-500">{v.percent}% выбрали</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Final Verdict */}
          <Card className="bg-gradient-to-br from-red-500/10 to-zinc-900 border-red-500/40">
            <CardHeader>
              <CardTitle className="font-orbitron text-3xl text-white text-center">
                Итоговый вердикт
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-300 text-lg leading-relaxed">
                <span className="text-green-400 font-bold">Pionex</span> — лучший вход в автотрейдинг. Если ты только начинаешь и не хочешь платить $22+/мес — бери Pionex. Минус: ты привязан к их бирже.
              </p>
              <p className="text-gray-300 text-lg leading-relaxed">
                <span className="text-blue-400 font-bold">3Commas</span> — для тех, кто живёт в TradingView и торгует на нескольких биржах. Платно, но мощно. Помни про инцидент 2022 года — храни API-ключи с whitelisted IP.
              </p>
              <p className="text-gray-300 text-lg leading-relaxed">
                <span className="text-purple-400 font-bold">Bitsgap</span> — золотая середина. Лучший GRID, удобный интерфейс, демо-режим. Дороговато, но стабильно работает.
              </p>
              <div className="pt-4 border-t border-zinc-800 mt-6">
                <p className="text-center text-white font-orbitron text-xl">
                  Совет: начни с <span className="text-green-400">Pionex</span> бесплатно, освойся, потом мигрируй на <span className="text-purple-400">Bitsgap</span> или <span className="text-blue-400">3Commas</span> когда депозит вырастет.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  )
}