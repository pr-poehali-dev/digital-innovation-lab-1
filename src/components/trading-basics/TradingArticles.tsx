export type { Section, Article } from "./TradingArticleTypes"
export { articlesMarketsOrders } from "./TradingArticlesMarketsOrders"
export { articlesAnalysisIndicators } from "./TradingArticlesAnalysisIndicators"
export { articlesRisk } from "./TradingArticlesRisk"

import { articlesMarketsOrders } from "./TradingArticlesMarketsOrders"
import { articlesAnalysisIndicators } from "./TradingArticlesAnalysisIndicators"
import { articlesRisk } from "./TradingArticlesRisk"

export const articles = [
  ...articlesMarketsOrders,
  ...articlesAnalysisIndicators,
  ...articlesRisk,
]
