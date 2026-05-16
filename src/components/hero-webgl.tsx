import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Icon from "@/components/ui/icon"
import { Link } from "react-router-dom"

export function Hero3DWebGL() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-background via-background to-background/80 py-24 md:py-32">
      <div className="pointer-events-none absolute inset-0 opacity-30">
        <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-blue-500/20 blur-3xl" />
        <div className="absolute top-20 right-0 h-96 w-96 rounded-full bg-purple-500/20 blur-3xl" />
        <div className="absolute -bottom-40 left-1/3 h-96 w-96 rounded-full bg-red-500/20 blur-3xl" />
      </div>

      <div className="container relative z-10 mx-auto px-4">
        <div className="mx-auto max-w-4xl text-center">
          <Badge
            variant="outline"
            className="mb-6 border-blue-500/30 text-blue-400"
          >
            Образовательный проект 2026
          </Badge>

          <h1 className="mb-6 text-4xl font-bold leading-tight tracking-tight md:text-6xl lg:text-7xl">
            Учись{" "}
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-red-400 bg-clip-text text-transparent">
              трейдингу
            </span>{" "}
            и алгоритмам
          </h1>

          <p className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground md:text-xl">
            От основ рынка до создания собственных торговых ботов. Технический
            анализ, бэктестинг и реальная практика — всё в одном месте.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button asChild size="lg" className="gap-2">
              <Link to="/trading-basics">
                <Icon name="Rocket" size={18} />
                Начать обучение
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="gap-2">
              <Link to="/bots-guide">
                <Icon name="Bot" size={18} />
                Гид по ботам
              </Link>
            </Button>
          </div>

          <div className="mt-16 grid grid-cols-2 gap-6 md:grid-cols-4">
            {[
              { value: "50+", label: "Уроков", color: "text-blue-400" },
              { value: "12", label: "Стратегий", color: "text-yellow-400" },
              { value: "8", label: "Шаблонов ботов", color: "text-red-400" },
              { value: "24/7", label: "Практика", color: "text-purple-400" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className={`text-3xl font-bold md:text-4xl ${stat.color}`}>
                  {stat.value}
                </div>
                <div className="mt-1 text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero3DWebGL
