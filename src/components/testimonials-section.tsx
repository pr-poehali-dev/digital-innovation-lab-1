import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const testimonials = [
  {
    name: "Алексей Морозов",
    role: "Трейдер на фондовом рынке, 7 лет опыта",
    avatar: "/professional-woman-scientist.png",
    content:
      "Наконец-то нашёл структурированную базу, где всё по делу. Раздел по риск-менеджменту кардинально изменил мой подход к торговле.",
  },
  {
    name: "Дмитрий Савельев",
    role: "Разработчик торговых ботов",
    avatar: "/cybersecurity-expert-man.jpg",
    content:
      "Лучший ресурс по алгоритмической торговле на русском языке. Материалы по API и бэктестингу написаны именно для практиков.",
  },
  {
    name: "Ирина Воронова",
    role: "Начинающий инвестор и крипто-трейдер",
    avatar: "/asian-woman-tech-developer.jpg",
    content:
      "Начала с нуля — база знаний помогла разобраться в основах без лишней воды. Теперь торгую осознанно, а не наугад.",
  },
]

export function TestimonialsSection() {
  return (
    <section className="py-24 px-6 bg-card">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-card-foreground mb-4 font-sans">Что говорят трейдеры</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Реальные отзывы трейдеров, которые уже используют нашу базу знаний
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="glow-border slide-up" style={{ animationDelay: `${index * 0.15}s` }}>
              <CardContent className="p-6">
                <p className="text-card-foreground mb-6 leading-relaxed italic">"{testimonial.content}"</p>
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src={testimonial.avatar || "/placeholder.svg"} alt={testimonial.name} />
                    <AvatarFallback>
                      {testimonial.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-primary">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}