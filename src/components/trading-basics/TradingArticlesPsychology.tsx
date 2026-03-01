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
  relevance2026: {
    score: 88,
    label: "Уникальное преимущество",
    aiImpact: 60,
    botImpact: 85,
    aiNote: "ИИ не имеет эмоций — и это его главное преимущество над человеком. Но именно поэтому психология становится ключевым конкурентным преимуществом живого трейдера.",
    botNote: "Боты убирают FOMO и панические выходы — но только если трейдер психологически готов не вмешиваться в их работу. Большинство убытков от ботов — результат эмоционального отключения бота.",
  },
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