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
