import React from "react"
import type { Article } from "./TradingArticleTypes"
import { SectionMarketTypes } from "./TradingArticlesMarketsOrders/SectionMarketTypes"
import { SectionMarketParticipants } from "./TradingArticlesMarketsOrders/SectionMarketParticipants"
import { SectionSmartMoney } from "./TradingArticlesMarketsOrders/SectionSmartMoney"
import { SectionOrderTypes } from "./TradingArticlesMarketsOrders/SectionOrderTypes"
import { SectionMarketVsLimit } from "./TradingArticlesMarketsOrders/SectionMarketVsLimit"
import { SectionStopOrders } from "./TradingArticlesMarketsOrders/SectionStopOrders"
import { SectionAdvancedOrders } from "./TradingArticlesMarketsOrders/SectionAdvancedOrders"

export const articleMarkets: Article = {
  id: "markets",
  badge: "Глава 1",
  title: "Что такое финансовые рынки",
  summary: "Финансовые рынки — это площадки, где покупатели и продавцы обменивают активы: акции, валюту, криптовалюту, товары. Понимание структуры рынка — фундамент любой торговли.",
  relevance2026: {
    score: 95,
    label: "Фундамент — вечен",
    aiImpact: 45,
    botImpact: 30,
    aiNote: "ИИ изменил скорость анализа данных и появление новых инструментов (токенизированные активы, AI-ETF), но базовая структура рынков не изменилась.",
    botNote: "Боты занимают ~70% объёма на крипторынках, создавая специфические паттерны ликвидности. Понимание их поведения стало частью базовой грамотности.",
  },
  sections: [
    {
      title: "Основные типы рынков и их сравнение",
      content: <SectionMarketTypes />,
    },
    {
      title: "Участники рынка и их роли",
      content: <SectionMarketParticipants />,
    },
    {
      title: "▲ Продвинутый уровень: Smart Money и структура рынка (ICT)",
      content: <SectionSmartMoney />,
    },
  ],
}

export const articleOrders: Article = {
  id: "orders",
  badge: "Глава 2",
  title: "Типы ордеров и исполнение сделок",
  summary: "Правильный выбор типа ордера влияет на цену входа, исполнение и итоговый результат. Разберём все основные типы и когда их применять.",
  relevance2026: {
    score: 90,
    label: "Актуально полностью",
    aiImpact: 35,
    botImpact: 65,
    aiNote: "ИИ-алгоритмы маркетмейкеров всё чаще «охотятся» на стоп-лоссы — понимание ордеров помогает размещать их правильно.",
    botNote: "90% исполнения ордеров в крипте — алгоритмическое. Знание типов ордеров критично для настройки любого бота.",
  },
  sections: [
    {
      title: "Полная таблица типов ордеров",
      content: <SectionOrderTypes />,
    },
    {
      title: "Рыночный vs Лимитный: что выбрать",
      content: <SectionMarketVsLimit />,
    },
    {
      title: "Стоп-ордера: защита капитала",
      content: <SectionStopOrders />,
    },
    {
      title: "▲ Продвинутый уровень: OCO, фьючерсы и продвинутые типы ордеров",
      content: <SectionAdvancedOrders />,
    },
  ],
}

export const articlesMarketsOrders: Article[] = [articleMarkets, articleOrders]