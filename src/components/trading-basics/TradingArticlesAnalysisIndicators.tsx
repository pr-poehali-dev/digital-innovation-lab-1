import type { Article } from "./TradingArticleTypes"
import { articleAnalysis } from "./TradingArticleAnalysis"
import {
  sectionIndicatorsOverview,
  sectionMA,
  sectionRSI,
  sectionMACD,
} from "./TradingArticleIndicatorsBasic"
import { sectionIndicatorsAdvanced } from "./TradingArticleIndicatorsAdvanced"

export { articleAnalysis }

export const articleIndicators: Article = {
  id: "indicators",
  badge: "Глава 4",
  title: "Индикаторы: как использовать без перегрузки",
  summary: "Индикаторы помогают подтверждать сигналы, но не заменяют понимание рынка. Важно использовать минимальный набор и понимать логику каждого.",
  sections: [
    sectionIndicatorsOverview,
    sectionMA,
    sectionRSI,
    sectionMACD,
    sectionIndicatorsAdvanced,
  ]
}

export const articlesAnalysisIndicators: Article[] = [articleAnalysis, articleIndicators]
