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
