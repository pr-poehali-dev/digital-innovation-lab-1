import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Icon from "@/components/ui/icon"

const rows = [
  { criteria: "Ранг в мире (объём)", bybit: "#2", binance: "#1 — лидер с 2017", winner: "binance" },
  { criteria: "Суточный объём торгов", bybit: "$12-18 млрд", binance: "$30-60 млрд", winner: "binance" },
  { criteria: "Кол-во торговых пар (Spot)", bybit: "~1 200", binance: "~2 400", winner: "binance" },
  { criteria: "Глубина стакана (BTC)", bybit: "Высокая", binance: "Максимальная — лучшие цены", winner: "binance" },
  { criteria: "Спред на ликвидных парах", bybit: "0.01-0.02%", binance: "0.001-0.01% — уже", winner: "binance" },
  { criteria: "Комиссия maker / taker", bybit: "0.1% / 0.1%", binance: "0.1% / 0.1% (до 0.012% c VIP)", winner: "tie" },
  { criteria: "Скидка за нативный токен", bybit: "Нет (BIT удалили)", binance: "25% за BNB", winner: "binance" },
  { criteria: "API rate limits", bybit: "120 req/sec", binance: "1 200 req/sec — в 10 раз больше", winner: "binance" },
  { criteria: "WebSocket стабильность", bybit: "Хорошая, иногда лаги", binance: "Эталонная — реже всех падает", winner: "binance" },
  { criteria: "Доступность из РФ", bybit: "✓ Работает через web/app", binance: "⚠️ Закрыта для россиян (с 2023)", winner: "bybit" },
  { criteria: "P2P для RUB/USDT", bybit: "✓ Активный", binance: "❌ Закрыто для РФ", winner: "bybit" },
  { criteria: "Простота UI / онбординг", bybit: "Чище, проще для новичков", binance: "Сложнее — больше функций", winner: "bybit" },
  { criteria: "Встроенные боты (бесплатно)", bybit: "Spot Grid, DCA, Futures Grid", binance: "Spot Grid, DCA, Arbitrage, Algo", winner: "binance" },
  { criteria: "Лаунчпад / IEO", bybit: "Bybit Launchpad", binance: "Binance Launchpad (топовые проекты)", winner: "binance" },
  { criteria: "Стейкинг APY", bybit: "До 12% APR", binance: "До 15% (Earn, Dual Investment)", winner: "binance" },
  { criteria: "NFT-маркетплейс", bybit: "Есть", binance: "Закрыт в 2024", winner: "bybit" },
  { criteria: "Документация API", bybit: "Чистая, на GitHub", binance: "Огромная, много примеров на всех языках", winner: "binance" },
  { criteria: "Готовые Python SDK", bybit: "pybit (официальный)", binance: "python-binance + 50 community-либ", winner: "binance" },
  { criteria: "Маркетинг для новичков", bybit: "Кэшбэк, бонусы за регистрацию", binance: "Меньше акций (зрелый продукт)", winner: "bybit" },
  { criteria: "Регуляция / надёжность", bybit: "VARA Dubai (с 2024)", binance: "Регуляция в США, ЕС, Японии", winner: "binance" },
]

const verdicts = [
  {
    title: "💼 Из России / СНГ",
    winner: "bybit",
    text: "Binance официально закрыта для россиян с 2023. Bybit работает напрямую, есть P2P для RUB. Выбор очевиден.",
    cta: "Подключить Bybit",
    href: "https://www.bybit.com/",
    external: true,
  },
  {
    title: "🌍 Из любой другой страны",
    winner: "binance",
    text: "Binance — лучше во всём: ликвидность, лимиты API, выбор пар, SDK. Для серьёзной автоматизации №1 в мире.",
    cta: "Открыть Binance",
    href: "https://www.binance.com/",
    external: true,
  },
  {
    title: "🤖 Кастомный бот через API",
    winner: "binance",
    text: "Binance даёт 1200 запросов/сек против 120 у Bybit. Для скальпинга и арбитража — критично. Python-libs больше.",
    cta: "Сравнить биржи целиком",
    href: "/platforms-compare",
  },
  {
    title: "🆕 Новичок без VPN",
    winner: "bybit",
    text: "Bybit чище UI, проще онбординг, активный кэшбэк. Boты встроены и работают без API. Идеально для старта.",
    cta: "Как настроить Bybit",
    href: "#api-setup",
  },
]

export function BybitVsBinance() {
  return (
    <section id="vs-binance" className="mb-16">
      <div className="text-center mb-8">
        <Badge className="mb-3 bg-blue-500/20 text-blue-400 border-blue-500/30">
          <Icon name="Crown" size={14} className="mr-1" />
          Есть ли биржа лучше Bybit?
        </Badge>
        <h2 className="font-orbitron text-3xl md:text-4xl font-bold text-white mb-2 flex items-center justify-center gap-3 flex-wrap">
          <span className="text-yellow-400">Bybit</span>
          <span className="text-gray-500">vs</span>
          <span className="text-orange-400">Binance</span>
        </h2>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Объективно — да, есть. <span className="text-orange-400 font-semibold">Binance</span> —
          мировой лидер №1 по объёмам и ликвидности. Но есть нюанс с доступом из РФ.
        </p>
      </div>

      {/* Дисклеймер про РФ */}
      <Card className="bg-red-950/30 border-red-500/40 border-2 mb-8">
        <CardContent className="p-5 flex items-start gap-4">
          <Icon name="AlertTriangle" className="text-red-400 flex-shrink-0 mt-1" size={28} />
          <div>
            <h3 className="font-orbitron text-lg font-bold text-white mb-1">Важно для пользователей из РФ</h3>
            <p className="text-gray-300 text-sm">
              <span className="text-orange-400 font-semibold">Binance официально закрыта для россиян с апреля 2023</span> —
              аккаунты с паспортом РФ блокируются, P2P для RUB отключён, нельзя пополнять с российских карт.
              Регистрация через VPN с паспортом другой страны нарушает ToS и грозит блокировкой средств.
              <br /><br />
              <span className="text-yellow-400 font-semibold">Bybit работает напрямую</span> — открытая регистрация,
              P2P для RUB/USDT активен, паспорт РФ принимается. Для пользователей из России это
              де-факто единственный реалистичный выбор из топ-3.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Таблица 20 критериев */}
      <Card className="bg-zinc-900/50 border-zinc-700 border mb-10 overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-black/60 border-b border-zinc-800">
                <tr>
                  <th className="text-left px-4 py-3 font-orbitron text-gray-400">Критерий</th>
                  <th className="text-left px-4 py-3 font-orbitron text-yellow-400">Bybit</th>
                  <th className="text-left px-4 py-3 font-orbitron text-orange-400">Binance</th>
                  <th className="text-center px-4 py-3 font-orbitron text-gray-400 w-24">Кто лучше</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr key={r.criteria} className={i % 2 === 0 ? "bg-zinc-900/30" : "bg-black/20"}>
                    <td className="px-4 py-3 text-gray-300 font-medium">{r.criteria}</td>
                    <td className="px-4 py-3 text-gray-400 text-xs">{r.bybit}</td>
                    <td className="px-4 py-3 text-gray-400 text-xs">{r.binance}</td>
                    <td className="px-4 py-3 text-center">
                      {r.winner === "binance" && (
                        <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30 text-[10px]">
                          Binance
                        </Badge>
                      )}
                      {r.winner === "bybit" && (
                        <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 text-[10px]">
                          Bybit
                        </Badge>
                      )}
                      {r.winner === "tie" && (
                        <Badge className="bg-zinc-700 text-gray-300 border-zinc-600 text-[10px]">
                          Ничья
                        </Badge>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-black/60 border-t-2 border-zinc-700">
                <tr>
                  <td className="px-4 py-3 font-orbitron text-white font-bold">ИТОГО</td>
                  <td className="px-4 py-3 text-yellow-400 font-mono text-xs">
                    5 побед · 14 поражений · 1 ничья
                  </td>
                  <td className="px-4 py-3 text-orange-400 font-mono text-xs">
                    14 побед · 5 поражений · 1 ничья
                  </td>
                  <td className="px-4 py-3 text-center">
                    <Badge className="bg-orange-500/30 text-orange-300 border-orange-500/50">
                      🏆 Binance
                    </Badge>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Вердикты */}
      <h3 className="font-orbitron text-2xl font-bold text-white mb-4 flex items-center gap-2">
        <Icon name="Target" className="text-blue-400" size={24} />
        Что выбрать под твою ситуацию
      </h3>
      <div className="grid md:grid-cols-2 gap-4 mb-10">
        {verdicts.map((v) => {
          const isBinance = v.winner === "binance"
          return (
            <Card
              key={v.title}
              className={`border-2 ${isBinance ? "bg-orange-950/20 border-orange-500/30" : "bg-yellow-950/20 border-yellow-500/30"}`}
            >
              <CardHeader>
                <CardTitle className={`font-orbitron ${isBinance ? "text-orange-400" : "text-yellow-400"}`}>
                  {v.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 text-sm mb-4">{v.text}</p>
                <Button
                  asChild
                  className={
                    isBinance
                      ? "bg-orange-500 hover:bg-orange-600 text-white"
                      : "bg-yellow-500 hover:bg-yellow-600 text-black"
                  }
                >
                  {v.external ? (
                    <a href={v.href} target="_blank" rel="noopener noreferrer">
                      <Icon name="ExternalLink" size={16} className="mr-2" />
                      {v.cta}
                    </a>
                  ) : (
                    <a href={v.href}>{v.cta} →</a>
                  )}
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Финальный итог */}
      <Card className="bg-gradient-to-br from-orange-950/30 via-zinc-900/60 to-black border-orange-500/40 border-2">
        <CardContent className="p-8 text-center">
          <Icon name="Trophy" className="text-orange-400 mx-auto mb-4" size={48} />
          <h3 className="font-orbitron text-2xl font-bold text-white mb-3">
            Кто чемпион мира среди криптобирж?
          </h3>
          <p className="text-gray-300 max-w-3xl mx-auto mb-4">
            Технически — <span className="text-orange-400 font-semibold">Binance</span>: больше ликвидности,
            в 10 раз выше лимиты API, шире выбор пар, лучше SDK для ботов. Это эталон индустрии.
          </p>
          <p className="text-gray-300 max-w-3xl mx-auto mb-6">
            Практически для пользователей из <span className="text-yellow-400 font-semibold">России</span> —
            это <span className="text-yellow-400 font-semibold">Bybit</span>, потому что Binance закрыта.
            Bybit на 90% догнал Binance по функционалу и единственный из топ-3 работает с РФ напрямую.
          </p>
          <p className="text-sm text-gray-500 italic">
            💡 Совет астронавта Юры: если ты не из РФ — иди на Binance. Если из РФ — Bybit, и не переживай, разница в основном на больших объёмах. 🛸
          </p>
        </CardContent>
      </Card>
    </section>
  )
}

export default BybitVsBinance
