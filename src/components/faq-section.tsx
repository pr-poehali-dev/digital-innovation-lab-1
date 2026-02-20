import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export function FAQSection() {
  const faqs = [
    {
      question: "Для кого предназначена эта база знаний?",
      answer:
        "База подойдёт как новичкам, только начинающим изучать трейдинг, так и опытным трейдерам, желающим систематизировать знания или освоить алгоритмическую торговлю. Материалы структурированы по уровням сложности.",
    },
    {
      question: "Нужно ли уметь программировать для работы с торговыми ботами?",
      answer:
        "Не обязательно. В базе есть материалы как для программистов, так и для тех, кто хочет использовать готовые решения без кода. Мы рассматриваем no-code платформы и конструкторы ботов.",
    },
    {
      question: "Какие рынки охватывает база знаний?",
      answer:
        "База охватывает криптовалютный рынок, фондовый рынок и форекс. Принципы трейдинга и алгоритмической торговли универсальны, а конкретные примеры приводятся для каждого рынка.",
    },
    {
      question: "Как часто обновляется контент?",
      answer:
        "Материалы регулярно пополняются и обновляются. Мы отслеживаем изменения на рынках, появление новых инструментов и платформ, добавляем актуальные кейсы и разборы стратегий.",
    },
    {
      question: "Есть ли готовые стратегии для торговых ботов?",
      answer:
        "Да, в базе представлены описания популярных алгоритмических стратегий: скальпинг, grid-trading, арбитраж, следование тренду и другие. Для каждой — объяснение логики, плюсы, минусы и условия применения.",
    },
    {
      question: "С чего начать, если я полный новичок?",
      answer:
        "Рекомендуем начать с раздела «Основы трейдинга» — он написан простым языком и закладывает необходимый фундамент. После этого выбирайте направление: ручная торговля или боты.",
    },
  ]

  return (
    <section className="py-24 bg-black">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 font-orbitron">Частые вопросы</h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto font-space-mono">
            Ответы на популярные вопросы о базе знаний, её содержании и о том, как начать торговать.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border-red-500/20 mb-4">
                <AccordionTrigger className="text-left text-lg font-semibold text-white hover:text-red-400 font-orbitron px-6 py-4">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-300 leading-relaxed px-6 pb-4 font-space-mono">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  )
}