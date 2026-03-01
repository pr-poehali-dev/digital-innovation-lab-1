import type { PracticeStep } from "./practiceStepTypes"
import { SectionRiskRule2, SectionDailyLimit, SectionTraderJournal } from "./practiceStepsRiskBot/SectionRiskRule2"
import { SectionBotVsHuman } from "./practiceStepsRiskBot/SectionBotVsHuman"
import { SectionDcaBot, SectionGridBot } from "./practiceStepsRiskBot/SectionDcaAndGrid"

export const stepRiskManagement: PracticeStep = {
  id: "risk-management",
  badge: "Шаг 3",
  color: "red",
  icon: "Shield",
  title: "Риск-менеджмент: сколько ставить на сделку",
  summary: "Правила управления капиталом на Pocket Option. Без этого даже 70% правильных сигналов превращаются в слив депозита.",
  sections: [
    { title: "Правило 2% на Pocket Option", content: <SectionRiskRule2 /> },
    { title: "Дневной лимит: когда останавливаться", content: <SectionDailyLimit /> },
    { title: "Журнал трейдера: как его вести", content: <SectionTraderJournal /> },
  ],
}

export const stepBotAutomation: PracticeStep = {
  id: "bot-automation",
  badge: "Шаг 4",
  color: "purple",
  icon: "Bot",
  title: "Автоматизация: когда нужен торговый бот",
  summary: "Боты убирают эмоции из торговли и работают 24/7. Но они решают только часть задач — понимание рынка остаётся за человеком.",
  sections: [
    { title: "Бот vs ручная торговля: что выбрать", content: <SectionBotVsHuman /> },
    { title: "DCA-бот: стратегия для крипто-рынка", content: <SectionDcaBot /> },
    { title: "Grid-бот: заработок на волатильности", content: <SectionGridBot /> },
  ],
}
