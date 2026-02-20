import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const features = [
  {
    title: "Основы трейдинга",
    description: "Фундаментальные знания о рынках: типы ордеров, стакан, ликвидность, тайм-фреймы и базовые стратегии.",
    icon: "brain",
    badge: "Начало",
  },
  {
    title: "Технический анализ",
    description: "Индикаторы, паттерны свечей, уровни поддержки и сопротивления, сигналы для входа и выхода.",
    icon: "zap",
    badge: "Анализ",
  },
  {
    title: "Торговые боты",
    description: "Принципы работы алгоритмической торговли: стратегии, бэктестинг, подключение к биржам через API.",
    icon: "globe",
    badge: "Боты",
  },
  {
    title: "Управление рисками",
    description: "Размер позиции, стоп-лосс, соотношение риск/прибыль, диверсификация и защита депозита.",
    icon: "lock",
    badge: "Риски",
  },
  {
    title: "Психология трейдера",
    description: "Торговая дисциплина, работа с эмоциями, ведение торгового журнала и анализ ошибок.",
    icon: "link",
    badge: "Mindset",
  },
  {
    title: "Инструменты и платформы",
    description: "Обзор торговых терминалов, бирж, скринеров и сервисов для автоматизации торговли.",
    icon: "target",
    badge: "Инструменты",
  },
]

export function FeaturesSection() {
  return (
    <section className="py-24 px-6 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4 font-sans">Что вы найдёте в базе знаний</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Структурированные материалы от основ до продвинутых стратегий — для трейдеров любого уровня
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="glow-border hover:shadow-lg transition-all duration-300 slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-3xl">
                    {feature.icon === "brain" && "&#129504;"}
                    {feature.icon === "lock" && "&#128274;"}
                    {feature.icon === "globe" && "&#127760;"}
                    {feature.icon === "zap" && "&#9889;"}
                    {feature.icon === "link" && "&#128279;"}
                    {feature.icon === "target" && "&#127919;"}
                  </span>
                  <Badge variant="secondary" className="bg-accent text-accent-foreground">
                    {feature.badge}
                  </Badge>
                </div>
                <CardTitle className="text-xl font-bold text-card-foreground">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}