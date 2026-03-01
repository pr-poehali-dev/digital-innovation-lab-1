import type { Article } from "./TradingArticleTypes"
import { SectionTimeframes } from "./TradingArticleAnalysis/SectionTimeframes"
import { SectionCandles } from "./TradingArticleAnalysis/SectionCandles"
import { SectionLevels } from "./TradingArticleAnalysis/SectionLevels"
import { SectionAdvancedVSA } from "./TradingArticleAnalysis/SectionAdvancedVSA"

export const articleAnalysis: Article = {
  id: "analysis",
  badge: "Глава 3",
  title: "Технический анализ: основы чтения графиков",
  summary: "Технический анализ — изучение исторических данных о цене и объёме для прогнозирования будущих движений. Используется большинством трейдеров во всех рынках.",
  relevance2026: {
    score: 75,
    label: "Под давлением ИИ",
    aiImpact: 72,
    botImpact: 58,
    aiNote: "GPT-модели и ML-алгоритмы распознают паттерны быстрее людей, что частично снизило эффективность классического ТА. Однако понимание графиков необходимо для контроля ботов.",
    botNote: "Большинство торговых ботов построены на ТА-индикаторах. Рост автоматизации означает, что одни паттерны исчезают, другие — усиливаются (ложные пробои).",
  },
  sections: [
    { title: "Тайм-фреймы и стили торговли", content: <SectionTimeframes /> },
    { title: "Японские свечи: паттерны разворота", content: <SectionCandles /> },
    { title: "Уровни поддержки и сопротивления", content: <SectionLevels /> },
    { title: "▲ Продвинутый уровень: VSA, ложные пробои и объёмный анализ", content: <SectionAdvancedVSA /> },
  ],
}