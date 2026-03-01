import type { Article } from "./TradingArticleTypes"
import { SectionRisk1Percent } from "./TradingArticlesRisk/SectionRisk1Percent"
import { SectionRiskRR } from "./TradingArticlesRisk/SectionRiskRR"
import { SectionRiskJournal } from "./TradingArticlesRisk/SectionRiskJournal"
import { SectionRiskAdvanced } from "./TradingArticlesRisk/SectionRiskAdvanced"

export const articleRisk: Article = {
  id: "riskmanagement",
  badge: "Глава 5",
  title: "Риск-менеджмент: как не слить депозит",
  summary: "Риск-менеджмент важнее любой стратегии. Даже прибыльная система не спасёт, если неправильно управлять размером позиций.",
  relevance2026: {
    score: 99,
    label: "Критичнее, чем когда-либо",
    aiImpact: 40,
    botImpact: 55,
    aiNote: "ИИ-трейдеры действуют с долями секунды — рынок стал волатильнее. Правила 1-2% и R:R стали ещё важнее для защиты от алго-манипуляций.",
    botNote: "Боты без риск-менеджмента сливают депозиты за часы. В 2025-2026 гг. выросло число случаев ликвидации из-за неправильно настроенного стопа в ботах.",
  },
  sections: [
    {
      title: "Правило 1–2% на сделку: математика выживания",
      content: <SectionRisk1Percent />,
    },
    {
      title: "Соотношение риск/прибыль (R:R): математика прибыльности",
      content: <SectionRiskRR />,
    },
    {
      title: "Торговый журнал и анализ своих сделок",
      content: <SectionRiskJournal />,
    },
    {
      title: "▲ Продвинутый уровень: формула Келли, Drawdown-анализ и портфельный риск",
      content: <SectionRiskAdvanced />,
    },
  ],
}

export const articlesRisk: Article[] = [articleRisk]