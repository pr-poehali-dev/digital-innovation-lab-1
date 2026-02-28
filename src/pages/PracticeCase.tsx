import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Badge } from "@/components/ui/badge"
import { steps } from "@/components/practice/practiceSteps"
import PracticeProgressBar from "@/components/practice/PracticeProgressBar"
import PracticeStepCard from "@/components/practice/PracticeStepCard"

export default function PracticeCase() {
  const [open, setOpen] = useState<string[]>([])

  return (
    <div className="dark min-h-screen bg-black">
      <Navbar />
      <main className="pt-24 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30 mb-4">Практический кейс</Badge>
            <h1 className="font-orbitron text-4xl md:text-5xl font-bold text-white mb-6">
              BTC на Pocket Option:<br className="hidden sm:block"/> реальный разбор
            </h1>
            <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
              Применяем всё с сайта на практике: анализ рынка → сигнал → риск-менеджмент → автоматизация.
              Шаг за шагом, как это делают реальные трейдеры.
            </p>
          </div>

          <PracticeProgressBar steps={steps} />

          <div className="space-y-10">
            {steps.map((step) => (
              <PracticeStepCard
                key={step.id}
                step={step}
                open={open}
                onOpenChange={setOpen}
              />
            ))}
          </div>

          <div className="mt-16 text-center">
            <p className="text-gray-400 mb-4 font-space-mono">Готов автоматизировать стратегию?</p>
            <a
              href="/bot-builder"
              className="inline-block bg-green-500 hover:bg-green-600 text-black font-orbitron font-bold px-8 py-3 rounded-md transition-colors"
            >
              Создать бота в конструкторе →
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
