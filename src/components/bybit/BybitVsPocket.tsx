import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Icon from "@/components/ui/icon"

const rows = [
  { criteria: "Тип торговли", po: "Бинарные опционы (CALL/PUT)", bybit: "Спот + Фьючерсы + Опционы", winner: "bybit" },
  { criteria: "Подключение бота", po: "Session ID из cookies (серая зона)", bybit: "Официальный REST API + WebSocket", winner: "bybit" },
  { criteria: "Срок жизни ключа", po: "Часы / дни (до разлогина)", bybit: "Месяцы (до отзыва)", winner: "bybit" },
  { criteria: "IP-whitelist", po: "Нет", bybit: "✅ Есть", winner: "bybit" },
  { criteria: "Можно ограничить вывод", po: "❌ Полный доступ", bybit: "✅ Только trading", winner: "bybit" },
  { criteria: "Stop Loss", po: "Только по таймеру (экспирация)", bybit: "Биржевой стоп-ордер с гарантией", winner: "bybit" },
  { criteria: "Take Profit", po: "Фиксированная выплата 70-95%", bybit: "Любая цена, любой % прибыли", winner: "bybit" },
  { criteria: "Плечо", po: "Нет", bybit: "До 100x на фьючерсах", winner: "bybit" },
  { criteria: "Минимальный депозит", po: "$10", bybit: "$1", winner: "bybit" },
  { criteria: "Минимальная ставка", po: "$1", bybit: "$0.10 (спот)", winner: "bybit" },
  { criteria: "Комиссия за сделку", po: "0% (заложена в выплату)", bybit: "0.1% maker / 0.1% taker", winner: "po" },
  { criteria: "Простота входа", po: "5 минут, без KYC", bybit: "30 минут, KYC обязателен", winner: "po" },
  { criteria: "Скорость старта бота", po: "Скопировал SSID — поехал", bybit: "Создать ключ + IP + код", winner: "po" },
  { criteria: "Готовые встроенные боты", po: "Нет", bybit: "Spot Grid, DCA, Futures Grid (бесплатно)", winner: "bybit" },
  { criteria: "Документация API", po: "Неофициальная, реверс-инжиниринг", bybit: "Официальная (bybit-exchange.github.io)", winner: "bybit" },
  { criteria: "Тестнет / демо", po: "Демо-счёт $10к", bybit: "Полноценный testnet.bybit.com", winner: "tie" },
  { criteria: "Риск блокировки за бота", po: "Высокий — могут забанить", bybit: "Нулевой — поощряются", winner: "bybit" },
  { criteria: "Доступ из РФ", po: "Нужен VPN", bybit: "Работает через web (могут быть ограничения)", winner: "tie" },
  { criteria: "Поддержка ботов в TradeBase", po: "✅ Полный конструктор", bybit: "⚠️ Скоро (пока в выпадающем списке)", winner: "po" },
  { criteria: "Долгосрочная прибыль", po: "Сложно — математика против", bybit: "Реально при дисциплине", winner: "bybit" },
]

const verdicts = [
  {
    title: "🆕 Новичок с $10-50",
    winner: "po",
    text: "Начни с Pocket Option. Низкий порог входа, не нужен KYC, демо $10к. Изучишь поведение цены, психологию.",
    cta: "Конструктор PO",
    href: "/bot-builder",
  },
  {
    title: "💼 У тебя $200-1000",
    winner: "bybit",
    text: "Переходи на Bybit. Встроенный Grid Bot бесплатно, реальные стопы, можно ограничить риски. Профит реальнее долгосрочно.",
    cta: "Открыть Bybit",
    href: "https://www.bybit.com/",
    external: true,
  },
  {
    title: "💰 Депозит $1000+",
    winner: "bybit",
    text: "Только Bybit + кастомный бот через API. Фьючерсы, арбитраж, AI-сигналы. Pocket Option не подойдёт по лимитам.",
    cta: "Гайд по API",
    href: "#api-setup",
  },
  {
    title: "🎯 Хочешь автоматизацию",
    winner: "bybit",
    text: "Bybit — Python скрипт через pybit/ccxt работает 24/7 без VPN-проблем. PO-боты часто падают из-за reconnect.",
    cta: "Сравнение бирж",
    href: "/platforms-compare",
  },
]

export function BybitVsPocket() {
  return (
    <section id="comparison" className="mb-16">
      <h2 className="font-orbitron text-3xl font-bold text-white mb-2 flex items-center gap-3">
        <Icon name="GitCompare" className="text-yellow-400" /> Bybit vs Pocket Option
      </h2>
      <p className="text-gray-400 mb-8">
        20 критериев. Где Bybit лучше, где Pocket Option, где ничья.
      </p>

      <Card className="bg-zinc-900/50 border-zinc-700 border mb-10 overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-black/60 border-b border-zinc-800">
                <tr>
                  <th className="text-left px-4 py-3 font-orbitron text-gray-400">Критерий</th>
                  <th className="text-left px-4 py-3 font-orbitron text-red-400">Pocket Option</th>
                  <th className="text-left px-4 py-3 font-orbitron text-yellow-400">Bybit</th>
                  <th className="text-center px-4 py-3 font-orbitron text-gray-400 w-24">Кто лучше</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr key={r.criteria} className={i % 2 === 0 ? "bg-zinc-900/30" : "bg-black/20"}>
                    <td className="px-4 py-3 text-gray-300 font-medium">{r.criteria}</td>
                    <td className="px-4 py-3 text-gray-400 text-xs">{r.po}</td>
                    <td className="px-4 py-3 text-gray-400 text-xs">{r.bybit}</td>
                    <td className="px-4 py-3 text-center">
                      {r.winner === "bybit" && (
                        <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 text-[10px]">
                          Bybit
                        </Badge>
                      )}
                      {r.winner === "po" && (
                        <Badge className="bg-red-500/20 text-red-400 border-red-500/30 text-[10px]">
                          PO
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
                  <td className="px-4 py-3 text-red-400 font-mono text-xs">
                    3 победы · 16 поражений · 2 ничьи
                  </td>
                  <td className="px-4 py-3 text-yellow-400 font-mono text-xs">
                    15 побед · 3 поражения · 2 ничьи
                  </td>
                  <td className="px-4 py-3 text-center">
                    <Badge className="bg-yellow-500/30 text-yellow-300 border-yellow-500/50">
                      🏆 Bybit
                    </Badge>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Вердикты под разные ситуации */}
      <h3 className="font-orbitron text-2xl font-bold text-white mb-4 flex items-center gap-2">
        <Icon name="Target" className="text-yellow-400" size={24} />
        Что выбрать под твою ситуацию
      </h3>
      <div className="grid md:grid-cols-2 gap-4 mb-10">
        {verdicts.map((v) => {
          const isBybit = v.winner === "bybit"
          return (
            <Card
              key={v.title}
              className={`border-2 ${isBybit ? "bg-yellow-950/20 border-yellow-500/30" : "bg-red-950/20 border-red-500/30"}`}
            >
              <CardHeader>
                <CardTitle className={`font-orbitron ${isBybit ? "text-yellow-400" : "text-red-400"}`}>
                  {v.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 text-sm mb-4">{v.text}</p>
                <Button
                  asChild
                  className={
                    isBybit
                      ? "bg-yellow-500 hover:bg-yellow-600 text-black"
                      : "bg-red-500 hover:bg-red-600 text-white"
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
      <Card className="bg-gradient-to-br from-yellow-950/30 via-zinc-900/60 to-black border-yellow-500/40 border-2">
        <CardContent className="p-8 text-center">
          <Icon name="Trophy" className="text-yellow-400 mx-auto mb-4" size={48} />
          <h3 className="font-orbitron text-2xl font-bold text-white mb-3">
            Имеет ли смысл Pocket Option в 2026?
          </h3>
          <p className="text-gray-300 max-w-3xl mx-auto mb-4">
            <span className="text-red-400 font-semibold">Pocket Option</span> остаётся актуальным
            только для <span className="text-white font-semibold">новичков с депозитом до $100</span> —
            быстрый старт, низкий порог, демо для тестов. Дальше — это «костыли»: серый API,
            фиксированные выплаты, нет реальных стопов.
          </p>
          <p className="text-gray-300 max-w-3xl mx-auto mb-6">
            <span className="text-yellow-400 font-semibold">Bybit</span> — выбор для всех остальных:
            официальный API, плечо, спот+фьючерсы, встроенные боты бесплатно, гарантированные стопы.
            Долгосрочно прибыльнее в разы.
          </p>
          <p className="text-sm text-gray-500 italic">
            💡 Совет астронавта Юры: учись на Pocket Option (демо!), зарабатывай на Bybit. 🛸
          </p>
        </CardContent>
      </Card>
    </section>
  )
}

export default BybitVsPocket
