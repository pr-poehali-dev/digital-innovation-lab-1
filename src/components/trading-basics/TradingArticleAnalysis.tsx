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
  sections: [
    { title: "Тайм-фреймы и стили торговли", content: <SectionTimeframes /> },
    { title: "Японские свечи: паттерны разворота", content: <SectionCandles /> },
    { title: "Уровни поддержки и сопротивления", content: <SectionLevels /> },
    { title: "▲ Продвинутый уровень: VSA, ложные пробои и объёмный анализ", content: <SectionAdvancedVSA /> },
  ],
}
