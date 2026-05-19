import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Icon from "@/components/ui/icon"
import { LiveSessionClock } from "@/components/LiveSessionClock"
import { TrendPairScanner } from "@/components/TrendPairScanner"
import { PairDeepDive } from "@/components/PairDeepDive"

const sessions = [
  {
    name: "Азиатская сессия",
    time: "03:00 – 11:00 МСК",
    icon: "Sunrise",
    color: "border-yellow-500/30",
    accent: "text-yellow-400",
    pairs: ["USD/JPY", "AUD/USD", "EUR/USD OTC"],
    desc: "Низкая волатильность по EUR/USD, но OTC-версия пары на Pocket Option торгуется активно. Цена ходит в узких диапазонах — идеально для скальпа.",
    tips: "BTC/USD в этот период двигается за новостями из Азии (Япония, Китай).",
  },
  {
    name: "Европейская сессия",
    time: "10:00 – 19:00 МСК",
    icon: "Building2",
    color: "border-blue-500/30",
    accent: "text-blue-400",
    pairs: ["EUR/USD", "GBP/USD", "EUR/GBP"],
    desc: "Главный «золотой час» для EUR/USD. Высокая ликвидность, чистые тренды, отработка технических уровней. На открытии Лондона (10:00 МСК) часто формируется направление дня.",
    tips: "BTC/USD в это время реагирует на европейские новости и движения фондовых рынков.",
  },
  {
    name: "Американская сессия",
    time: "15:30 – 24:00 МСК",
    icon: "Sun",
    color: "border-red-500/30",
    accent: "text-red-400",
    pairs: ["EUR/USD", "BTC/USD", "USD/CAD"],
    desc: "Перекрытие с европейской сессией (15:30–19:00) — пик волатильности. Все важные новости по USD выходят в 15:30 и 17:00 МСК. BTC/USD оживает на американских объёмах.",
    tips: "EUR/USD OTC на выходных копирует поведение пары пятницы.",
  },
  {
    name: "Тихая ночь (OTC-режим)",
    time: "00:00 – 03:00 МСК",
    icon: "Moon",
    color: "border-purple-500/30",
    accent: "text-purple-400",
    pairs: ["EUR/USD OTC", "BTC/USD"],
    desc: "Forex закрыт — только OTC-инструменты и крипта. EUR/USD OTC движется по алгоритму брокера: предсказуемые откаты, чёткие уровни.",
    tips: "BTC/USD ночью часто пампят азиатские маркетмейкеры — следи за объёмами.",
  },
]

const eurUsdSchedule = [
  { time: "00:00 – 03:00", vol: "OTC", color: "bg-purple-500", note: "EUR/USD OTC — гладкие движения, хорошо для скальпа 1м" },
  { time: "03:00 – 08:00", vol: "Низкая", color: "bg-gray-500", note: "Азия. Боковик, ловить отбои от границ канала" },
  { time: "08:00 – 10:00", vol: "Средняя", color: "bg-yellow-500", note: "Подготовка к Лондону, формирование тренда" },
  { time: "10:00 – 12:00", vol: "ВЫСОКАЯ", color: "bg-green-500", note: "🔥 Открытие Лондона — лучшее время для тренда" },
  { time: "12:00 – 15:30", vol: "Средняя", color: "bg-yellow-500", note: "Затишье перед США. Торгуй уровни" },
  { time: "15:30 – 18:00", vol: "ЭКСТРА", color: "bg-red-500", note: "🔥🔥 Открытие США + новости. Самая жара" },
  { time: "18:00 – 21:00", vol: "Высокая", color: "bg-green-500", note: "Тренд дня продолжается" },
  { time: "21:00 – 24:00", vol: "Падающая", color: "bg-yellow-500", note: "Закрытие США, фиксация прибыли" },
]

const btcUsdSchedule = [
  { time: "00:00 – 06:00", vol: "Средняя", color: "bg-yellow-500", note: "Азиатские объёмы, иногда резкие движения" },
  { time: "06:00 – 12:00", vol: "Низкая", color: "bg-gray-500", note: "Затишье, флэт, скучно" },
  { time: "12:00 – 15:30", vol: "Средняя", color: "bg-yellow-500", note: "Просыпается Европа, тренд возможен" },
  { time: "15:30 – 19:00", vol: "ВЫСОКАЯ", color: "bg-green-500", note: "🔥 Открытие США — фонда тянет крипту" },
  { time: "19:00 – 22:00", vol: "ЭКСТРА", color: "bg-red-500", note: "🔥🔥 Пик ликвидности и волы" },
  { time: "22:00 – 02:00", vol: "Высокая", color: "bg-green-500", note: "Закрытие фонды + ночные памп/дамп" },
]

const correlations = [
  { pair1: "EUR/USD", pair2: "GBP/USD", value: "+0.85", type: "Прямая", desc: "Двигаются почти синхронно. Сигнал на EUR/USD = подтверждение для GBP/USD." },
  { pair1: "EUR/USD", pair2: "USD/CHF", value: "−0.95", type: "Обратная", desc: "Зеркало. Если EUR/USD растёт — USD/CHF падает. Используй для подтверждения." },
  { pair1: "BTC/USD", pair2: "ETH/USD", value: "+0.92", type: "Прямая", desc: "Эфир ходит за битком. Можно ловить тот же тренд на ETH с большей волой." },
  { pair1: "BTC/USD", pair2: "NASDAQ (US100)", value: "+0.65", type: "Прямая", desc: "Криптой управляет настроение на фонде. Растёт NASDAQ — растёт BTC." },
  { pair1: "EUR/USD", pair2: "BTC/USD", value: "+0.30", type: "Слабая", desc: "Связи почти нет. Это плюс — можно диверсифицировать." },
  { pair1: "EUR/USD OTC", pair2: "EUR/USD (Forex)", value: "+0.70", type: "Прямая (с задержкой)", desc: "OTC копирует Forex с лагом ~30 сек. На выходных идёт по алгоритму." },
]

const dayStrategies = [
  {
    time: "Утро (08:00 – 11:00)",
    icon: "Coffee",
    color: "border-orange-500/30",
    accent: "text-orange-400",
    strategy: "Скальп от уровней",
    pair: "EUR/USD",
    desc: "Цена накапливается перед Лондоном. Ловим отбои от ключевых уровней дня. Экспирация 1–3 минуты.",
    indicators: ["Уровни поддержки/сопротивления", "RSI < 30 или > 70", "Пин-бары на M5"],
  },
  {
    time: "День (11:00 – 15:00)",
    icon: "Zap",
    color: "border-green-500/30",
    accent: "text-green-400",
    strategy: "Тренд-следование",
    pair: "EUR/USD, GBP/USD",
    desc: "Лондон задал направление — едем по тренду. Входы на откатах к EMA-21. Экспирация 5–15 минут.",
    indicators: ["EMA-9, EMA-21", "MACD выше нуля", "Объёмы растут"],
  },
  {
    time: "Вечер (15:30 – 21:00)",
    icon: "Flame",
    color: "border-red-500/30",
    accent: "text-red-400",
    strategy: "Новостной импульс",
    pair: "EUR/USD, BTC/USD",
    desc: "Открытие США + новости. Большие свечи, чёткие пробои. Опасно для скальпа — лучше тренд 5м+.",
    indicators: ["Календарь новостей", "Пробой консолидации", "Bollinger Bands растягиваются"],
  },
  {
    time: "Ночь (22:00 – 03:00)",
    icon: "Moon",
    color: "border-purple-500/30",
    accent: "text-purple-400",
    strategy: "OTC + крипта",
    pair: "EUR/USD OTC, BTC/USD",
    desc: "Forex закрыт. EUR/USD OTC ходит по алгоритму — ловим отбои от границ канала. BTC живёт своей жизнью.",
    indicators: ["Bollinger Bands", "Stochastic", "Уровни круглых чисел"],
  },
]

export default function Timing() {
  return (
    <div className="dark min-h-screen bg-black">
      <Navbar />
      <main className="pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero */}
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-red-500/20 text-red-400 border-red-500/30">
              <Icon name="Clock" size={14} className="mr-1" />
              Тайминг и пары
            </Badge>
            <h1 className="font-orbitron text-4xl md:text-6xl font-bold text-white mb-4">
              Когда торговать <span className="text-red-500">какую пару</span>
            </h1>
            <p className="text-gray-400 text-lg max-w-3xl mx-auto">
              Сессии, корреляции, расписание по часам и стратегии под каждое время дня.
              Главный упор — на <span className="text-red-400 font-semibold">EUR/USD OTC</span> и{" "}
              <span className="text-yellow-400 font-semibold">BTC/USD</span>.
            </p>
          </div>

          {/* Живые часы и активная сессия */}
          <LiveSessionClock />

          {/* Сканер трендовых пар */}
          <TrendPairScanner />

          {/* Глубокий разбор пар */}
          <PairDeepDive />

          {/* Торговые сессии */}
          <section className="mb-20">
            <h2 className="font-orbitron text-3xl font-bold text-white mb-2 flex items-center gap-3">
              <Icon name="Globe" className="text-red-500" /> Торговые сессии
            </h2>
            <p className="text-gray-400 mb-8">Мир торгует круглосуточно — но не вся ликвидность одинаковая.</p>
            <div className="grid md:grid-cols-2 gap-6">
              {sessions.map((s) => (
                <Card key={s.name} className={`bg-zinc-900/50 ${s.color} border-2`}>
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <Icon name={s.icon} className={s.accent} size={28} />
                      <Badge className="bg-zinc-800 text-gray-300 border-zinc-700">{s.time}</Badge>
                    </div>
                    <CardTitle className={`font-orbitron ${s.accent}`}>{s.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-300 mb-4">{s.desc}</p>
                    <div className="mb-3">
                      <div className="text-xs text-gray-500 mb-1">Активные пары:</div>
                      <div className="flex flex-wrap gap-2">
                        {s.pairs.map((p) => (
                          <Badge key={p} className="bg-zinc-800 text-gray-300 border-zinc-700">
                            {p}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="text-sm text-gray-400 bg-black/40 border border-zinc-800 rounded p-3">
                      <Icon name="Lightbulb" size={14} className="inline mr-1 text-yellow-400" />
                      {s.tips}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Расписание EUR/USD OTC */}
          <section className="mb-20">
            <h2 className="font-orbitron text-3xl font-bold text-white mb-2 flex items-center gap-3">
              <Icon name="TrendingUp" className="text-red-500" />
              Расписание EUR/USD <span className="text-red-400">OTC</span>
            </h2>
            <p className="text-gray-400 mb-8">Время МСК. Главная пара для бинарных опционов.</p>
            <Card className="bg-zinc-900/50 border-red-500/30 border-2">
              <CardContent className="p-6">
                <div className="space-y-3">
                  {eurUsdSchedule.map((row) => (
                    <div
                      key={row.time}
                      className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center p-3 rounded bg-black/40 border border-zinc-800"
                    >
                      <div className="md:col-span-3 font-mono text-white font-bold">{row.time}</div>
                      <div className="md:col-span-2">
                        <Badge className={`${row.color} text-white border-0 font-semibold`}>{row.vol}</Badge>
                      </div>
                      <div className="md:col-span-7 text-gray-300 text-sm">{row.note}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Расписание BTC/USD */}
          <section className="mb-20">
            <h2 className="font-orbitron text-3xl font-bold text-white mb-2 flex items-center gap-3">
              <Icon name="Bitcoin" className="text-yellow-400" />
              Расписание <span className="text-yellow-400">BTC/USD</span>
            </h2>
            <p className="text-gray-400 mb-8">Крипта торгуется 24/7, но реальные движения — в часы американской сессии.</p>
            <Card className="bg-zinc-900/50 border-yellow-500/30 border-2">
              <CardContent className="p-6">
                <div className="space-y-3">
                  {btcUsdSchedule.map((row) => (
                    <div
                      key={row.time}
                      className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center p-3 rounded bg-black/40 border border-zinc-800"
                    >
                      <div className="md:col-span-3 font-mono text-white font-bold">{row.time}</div>
                      <div className="md:col-span-2">
                        <Badge className={`${row.color} text-white border-0 font-semibold`}>{row.vol}</Badge>
                      </div>
                      <div className="md:col-span-7 text-gray-300 text-sm">{row.note}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Корреляция пар */}
          <section className="mb-20">
            <h2 className="font-orbitron text-3xl font-bold text-white mb-2 flex items-center gap-3">
              <Icon name="GitMerge" className="text-red-500" /> Корреляция пар
            </h2>
            <p className="text-gray-400 mb-8">
              Какие пары двигаются вместе, а какие зеркально. Используй для подтверждения сигналов.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              {correlations.map((c) => (
                <Card key={c.pair1 + c.pair2} className="bg-zinc-900/50 border-zinc-700 border">
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-white font-bold">{c.pair1}</span>
                        <Icon
                          name={c.type.startsWith("Обратная") ? "ArrowLeftRight" : "ArrowRight"}
                          size={16}
                          className="text-gray-500"
                        />
                        <span className="font-mono text-white font-bold">{c.pair2}</span>
                      </div>
                      <Badge
                        className={
                          c.value.startsWith("+")
                            ? "bg-green-500/20 text-green-400 border-green-500/30"
                            : c.value.startsWith("−")
                            ? "bg-red-500/20 text-red-400 border-red-500/30"
                            : "bg-zinc-700 text-gray-300"
                        }
                      >
                        {c.value}
                      </Badge>
                    </div>
                    <div className="text-xs text-gray-500 mb-2">{c.type}</div>
                    <p className="text-gray-300 text-sm">{c.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Стратегии по времени дня */}
          <section className="mb-12">
            <h2 className="font-orbitron text-3xl font-bold text-white mb-2 flex items-center gap-3">
              <Icon name="Target" className="text-red-500" /> Стратегии по времени дня
            </h2>
            <p className="text-gray-400 mb-8">Утром скальп, днём тренд, вечером новости, ночью OTC.</p>
            <div className="grid md:grid-cols-2 gap-6">
              {dayStrategies.map((s) => (
                <Card key={s.time} className={`bg-zinc-900/50 ${s.color} border-2`}>
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <Icon name={s.icon} className={s.accent} size={28} />
                      <Badge className="bg-zinc-800 text-gray-300 border-zinc-700">{s.time}</Badge>
                    </div>
                    <CardTitle className={`font-orbitron ${s.accent}`}>{s.strategy}</CardTitle>
                    <div className="text-sm text-gray-500 font-mono">{s.pair}</div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-300 mb-4">{s.desc}</p>
                    <div className="text-xs text-gray-500 mb-2">Индикаторы и условия:</div>
                    <ul className="space-y-1">
                      {s.indicators.map((i) => (
                        <li key={i} className="text-sm text-gray-300 flex items-start gap-2">
                          <Icon name="Check" size={14} className={`${s.accent} mt-0.5 flex-shrink-0`} />
                          <span>{i}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Финальный блок */}
          <Card className="bg-gradient-to-br from-red-950/40 via-zinc-900/60 to-black border-red-500/30 border-2">
            <CardContent className="p-8 text-center">
              <Icon name="AlertTriangle" className="text-yellow-400 mx-auto mb-4" size={40} />
              <h3 className="font-orbitron text-2xl font-bold text-white mb-3">Главное правило тайминга</h3>
              <p className="text-gray-300 max-w-2xl mx-auto">
                Не торгуй за 30 минут до и 15 минут после важных новостей по USD (15:30 и 17:00 МСК) —
                волатильность ломает любую стратегию. Используй экономический календарь.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  )
}