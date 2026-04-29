import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Icon from "@/components/ui/icon"

const strategies = [
  {
    id: 1,
    name: "Пин-бар + уровни поддержки",
    tag: "Разворот",
    tagColor: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    difficulty: "Средняя",
    winrate: "68–74%",
    timeframe: "5 мин / 15 мин",
    payout: "от 80%",
    icon: "CandlestickChart",
    color: "border-yellow-500/30",
    accent: "text-yellow-400",
    description:
      "Торгуем разворот цены на сильном уровне поддержки или сопротивления. Пин-бар — свеча с длинной тенью и маленьким телом — сигнализирует об отбое.",
    conditions: [
      "Цена подходит к явному уровню поддержки/сопротивления",
      "Формируется пин-бар (тень в 2–3 раза длиннее тела)",
      "Следующая свеча закрывается в сторону отбоя",
    ],
    entry: "CALL — пин-бар с нижней тенью на поддержке. PUT — пин-бар с верхней тенью на сопротивлении.",
    expiry: "1–3 свечи от таймфрейма",
    tips: "Работает лучше на EUR/USD, GBP/USD в европейскую сессию (10:00–14:00 МСК).",
  },
  {
    id: 2,
    name: "Стратегия «Три свечи»",
    tag: "Тренд",
    tagColor: "bg-green-500/20 text-green-400 border-green-500/30",
    difficulty: "Лёгкая",
    winrate: "62–70%",
    timeframe: "1 мин / 5 мин",
    payout: "от 75%",
    icon: "TrendingUp",
    color: "border-green-500/30",
    accent: "text-green-400",
    description:
      "Одна из самых простых стратегий. Три подряд идущих свечи одного цвета формируют сильный тренд — входим в его продолжение.",
    conditions: [
      "Три свечи одного цвета подряд (три зелёных или три красных)",
      "Свечи примерно одного размера (не слишком маленькие)",
      "Нет сильных новостей в ближайшие 15 минут",
    ],
    entry: "CALL — после трёх зелёных свечей. PUT — после трёх красных свечей.",
    expiry: "1 свеча от таймфрейма",
    tips: "На 1-минутном таймфрейме — экспирация 1 минута. На 5-минутном — 5 минут. Не торговать в момент выхода новостей.",
  },
  {
    id: 3,
    name: "RSI + Bollinger Bands",
    tag: "Перекупленность",
    tagColor: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    difficulty: "Средняя",
    winrate: "65–72%",
    timeframe: "5 мин / 15 мин",
    payout: "от 80%",
    icon: "Activity",
    color: "border-blue-500/30",
    accent: "text-blue-400",
    description:
      "Комбинация двух индикаторов: RSI показывает перекупленность/перепроданность, Bollinger Bands — выход цены за границы нормального движения.",
    conditions: [
      "Цена касается или пробивает верхнюю/нижнюю полосу Bollinger",
      "RSI выше 70 (перекупленность) или ниже 30 (перепроданность)",
      "Свеча закрывается обратно внутри полос",
    ],
    entry: "PUT — цена на верхней полосе + RSI > 70. CALL — цена на нижней полосе + RSI < 30.",
    expiry: "2–3 свечи от таймфрейма",
    tips: "Настройки по умолчанию: RSI(14), BB(20, 2). Лучший результат на флетовых активах: EUR/JPY, AUD/USD.",
  },
  {
    id: 4,
    name: "Пробой уровня + ретест",
    tag: "Пробой",
    tagColor: "bg-purple-500/20 text-purple-400 border-purple-500/30",
    difficulty: "Высокая",
    winrate: "70–78%",
    timeframe: "15 мин / 30 мин",
    payout: "от 85%",
    icon: "Zap",
    color: "border-purple-500/30",
    accent: "text-purple-400",
    description:
      "Ждём пробой сильного горизонтального уровня, затем — ретест (цена возвращается к уровню для его проверки) и входим в продолжение движения.",
    conditions: [
      "Явный горизонтальный уровень (минимум 2–3 касания)",
      "Свеча закрывается выше/ниже уровня с объёмом",
      "Цена возвращается к уровню (ретест) и отбивается",
    ],
    entry: "CALL — ретест пробитого уровня сверху. PUT — ретест пробитого уровня снизу.",
    expiry: "3–5 свечей от таймфрейма",
    tips: "Самая точная стратегия, но требует терпения — ретест бывает не всегда. Работает на всех парах в лондонскую и американскую сессии.",
  },
  {
    id: 5,
    name: "EMA 5/13 пересечение",
    tag: "Индикатор",
    tagColor: "bg-red-500/20 text-red-400 border-red-500/30",
    difficulty: "Лёгкая",
    winrate: "60–67%",
    timeframe: "5 мин / 15 мин",
    payout: "от 75%",
    icon: "GitMerge",
    color: "border-red-500/30",
    accent: "text-red-400",
    description:
      "Классическая стратегия на пересечении двух скользящих средних. EMA 5 (быстрая) пересекает EMA 13 (медленную) — сигнал к входу.",
    conditions: [
      "EMA 5 пересекает EMA 13 снизу вверх (золотой крест)",
      "EMA 5 пересекает EMA 13 сверху вниз (мёртвый крест)",
      "Свеча закрытия после пересечения подтверждает направление",
    ],
    entry: "CALL — золотой крест (EMA 5 пересекает EMA 13 снизу). PUT — мёртвый крест (EMA 5 пересекает EMA 13 сверху).",
    expiry: "2–4 свечи от таймфрейма",
    tips: "Добавь фильтр по тренду (EMA 50): торгуй только пересечения в сторону основного тренда. Это поднимет винрейт до 70%+.",
  },
  {
    id: 6,
    name: "Стратегия «Молот» (Hammer)",
    tag: "Разворот",
    tagColor: "bg-orange-500/20 text-orange-400 border-orange-500/30",
    difficulty: "Средняя",
    winrate: "66–73%",
    timeframe: "5 мин / 15 мин",
    payout: "от 80%",
    icon: "Hammer",
    color: "border-orange-500/30",
    accent: "text-orange-400",
    description:
      "Свечной паттерн «Молот» — сильный сигнал разворота вниз. Свеча с маленьким телом наверху и длинной нижней тенью после нисходящего движения.",
    conditions: [
      "Предшествует нисходящий тренд (минимум 3–5 свечей вниз)",
      "Свеча: маленькое тело в верхней части, длинная нижняя тень (2х тела)",
      "Следующая свеча закрывается выше тела молота",
    ],
    entry: "CALL — после подтверждающей свечи выше тела молота.",
    expiry: "2–3 свечи от таймфрейма",
    tips: "Перевёрнутый молот ('Звезда') работает симметрично для PUT. Усиливается на уровнях поддержки и при RSI < 35.",
  },
]

export default function Strategies() {
  return (
    <div className="dark min-h-screen bg-black">
      <Navbar />
      <main className="pt-24 pb-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Header */}
          <div className="mb-12 text-center">
            <Badge className="mb-4 bg-red-500/10 text-red-400 border border-red-500/30 font-geist">
              Pocket Option 2026
            </Badge>
            <h1 className="font-orbitron text-3xl sm:text-4xl font-bold text-white mb-4">
              Рабочие стратегии
            </h1>
            <p className="font-geist text-gray-400 max-w-2xl mx-auto text-lg">
              Проверенные стратегии с реальным винрейтом. Каждая протестирована на исторических данных и актуальна для Pocket Option в 2026 году.
            </p>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-4 mb-12">
            {[
              { label: "Стратегий", value: "6", icon: "BookOpen" },
              { label: "Средний винрейт", value: "67%", icon: "Target" },
              { label: "Протестировано", value: "2026", icon: "CheckCircle" },
            ].map((s) => (
              <div key={s.label} className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                <Icon name={s.icon as "BookOpen"} size={20} className="mx-auto mb-2 text-red-400" />
                <div className="font-orbitron text-2xl font-bold text-white">{s.value}</div>
                <div className="font-geist text-xs text-gray-400 mt-1">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Strategies */}
          <div className="space-y-6">
            {strategies.map((s) => (
              <Card key={s.id} className={`bg-white/5 border ${s.color} rounded-2xl overflow-hidden`}>
                <CardHeader className="pb-3">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0">
                        <Icon name={s.icon as "Zap"} size={20} className={s.accent} />
                      </div>
                      <div>
                        <CardTitle className={`font-orbitron text-lg text-white`}>
                          {s.name}
                        </CardTitle>
                        <div className="flex flex-wrap gap-2 mt-1">
                          <Badge className={`text-xs border ${s.tagColor}`}>{s.tag}</Badge>
                          <Badge className="text-xs bg-white/5 text-gray-400 border border-white/10">
                            {s.difficulty}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-4 text-right">
                      <div>
                        <div className={`font-orbitron text-xl font-bold ${s.accent}`}>{s.winrate}</div>
                        <div className="font-geist text-xs text-gray-500">Винрейт</div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="font-geist text-gray-300 text-sm leading-relaxed">{s.description}</p>

                  {/* Meta row */}
                  <div className="flex flex-wrap gap-4">
                    {[
                      { label: "Таймфрейм", value: s.timeframe, icon: "Clock" },
                      { label: "Выплата", value: s.payout, icon: "DollarSign" },
                      { label: "Экспирация", value: s.expiry, icon: "Timer" },
                    ].map((m) => (
                      <div key={m.label} className="flex items-center gap-2 bg-white/5 rounded-lg px-3 py-2">
                        <Icon name={m.icon as "Clock"} size={14} className="text-gray-400" />
                        <span className="font-geist text-xs text-gray-400">{m.label}:</span>
                        <span className="font-geist text-xs text-white font-medium">{m.value}</span>
                      </div>
                    ))}
                  </div>

                  {/* Conditions */}
                  <div>
                    <div className="font-geist text-xs text-gray-500 uppercase tracking-wide mb-2">Условия входа</div>
                    <ul className="space-y-1">
                      {s.conditions.map((c, i) => (
                        <li key={i} className="flex items-start gap-2 font-geist text-sm text-gray-300">
                          <span className={`mt-1 w-1.5 h-1.5 rounded-full flex-shrink-0 ${s.accent.replace("text-", "bg-")}`} />
                          {c}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Entry */}
                  <div className={`bg-white/5 border ${s.color} rounded-xl p-4`}>
                    <div className="font-geist text-xs text-gray-500 uppercase tracking-wide mb-1">Сигнал</div>
                    <p className="font-geist text-sm text-white">{s.entry}</p>
                  </div>

                  {/* Tips */}
                  <div className="flex items-start gap-2 bg-yellow-500/5 border border-yellow-500/20 rounded-xl p-3">
                    <Icon name="Lightbulb" size={16} className="text-yellow-400 flex-shrink-0 mt-0.5" />
                    <p className="font-geist text-sm text-yellow-200/80">{s.tips}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-14 text-center bg-gradient-to-br from-red-500/10 to-transparent border border-red-500/20 rounded-2xl p-8">
            <Icon name="Bot" size={32} className="mx-auto mb-4 text-red-400" />
            <h2 className="font-orbitron text-xl font-bold text-white mb-2">Автоматизируй стратегию</h2>
            <p className="font-geist text-gray-400 mb-6 max-w-md mx-auto">
              Настрой бота под любую из этих стратегий — он будет торговать сам, 24/7, без ошибок и эмоций.
            </p>
            <a
              href="/bot-builder"
              className="inline-block bg-red-500 hover:bg-red-600 transition-colors text-white font-geist font-semibold px-6 py-3 rounded-xl"
            >
              Открыть конструктор бота →
            </a>
          </div>

        </div>
      </main>
      <Footer />
    </div>
  )
}
