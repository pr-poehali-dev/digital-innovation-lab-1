import React from "react"
import type { Article } from "./TradingArticleTypes"
import { SectionFearGreed } from "./TradingArticlesPsychology/SectionFearGreed"
import { SectionFOMO } from "./TradingArticlesPsychology/SectionFOMO"
import { SectionTradingPlan } from "./TradingArticlesPsychology/SectionTradingPlan"
import { SectionNeuroscience } from "./TradingArticlesPsychology/SectionNeuroscience"

export const articlePsychology: Article = {
  id: "psychology",
  badge: "Глава 6",
  title: "Психология трейдинга: как не мешать самому себе",
  summary: "Стратегия определяет, есть ли у вас преимущество. Психология определяет, сможете ли вы им воспользоваться. Большинство трейдеров проигрывают не рынку — они проигрывают себе.",
  sections: [
    {
      title: "Два врага трейдера: страх и жадность",
      content: <SectionFearGreed />,
    },
    {
      title: "FOMO и торговля «на эмоциях»: как распознать и остановить",
      content: <SectionFOMO />,
    },
    {
      title: "Торговый план: как создать и почему он работает",
      content: <SectionTradingPlan />,
    },
    {
      title: "▲ Продвинутый уровень: нейронаука трейдинга и состояние потока",
      content: <SectionNeuroscience />,
    },
  ],
}

export const articlesPsychology: Article[] = [articlePsychology]
