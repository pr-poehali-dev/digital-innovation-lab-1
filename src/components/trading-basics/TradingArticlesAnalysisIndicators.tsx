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
  relevance2026: {
    score: 70,
    label: "Трансформируется",
    aiImpact: 80,
    botImpact: 75,
    aiNote: "ИИ-модели (LSTM, трансформеры) вытесняют классические индикаторы в алго-торговле. Но RSI, EMA, MACD остаются базой для понимания сигналов и настройки ботов.",
    botNote: "Большинство популярных ботов (3Commas, Pionex) используют именно эти индикаторы как входные параметры. Знание их логики обязательно для кастомизации.",
  },
  sections: [
    sectionIndicatorsOverview,
    sectionMA,
    sectionRSI,
    sectionMACD,
    sectionIndicatorsAdvanced,
  ]
}

export const articlesAnalysisIndicators: Article[] = [articleAnalysis, articleIndicators]