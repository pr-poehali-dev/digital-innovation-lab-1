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
  aibotInsight: {
    aiExamples: [
      {
        label: "Flash-crash риск",
        text: "В 2024–2025 гг. участились флэш-крэши на 10–20% за секунды из-за каскадных ликвидаций ИИ-алгоритмов. Стоп-лосс в $1000 от цены — уже не «далеко».",
      },
      {
        label: "Алго-охота на стопы",
        text: "ИИ маркетмейкеров анализирует скопление стоп-ордеров и двигает цену к ним. Правило: стоп должен стоять за структурным уровнем, а не на психологической дистанции.",
      },
      {
        label: "Динамический риск",
        text: "Передовые ИИ-системы (Renaissance Technologies, Two Sigma) автоматически уменьшают размер позиций при росте волатильности (VIX). Это «умный» риск-менеджмент в реальном времени.",
      },
    ],
    botExamples: [
      {
        label: "Лимит дневных потерь",
        text: "Профессиональный бот имеет параметр max_daily_loss = 3%. При достижении — бот останавливается до следующего дня. Это самый важный параметр, который большинство пропускает.",
      },
      {
        label: "Размер позиции в боте",
        text: "В коде бота: position_size = balance * 0.02 / (entry - stop_loss). Это автоматический расчёт лота по правилу 2% — бот никогда не ставит «на глаз».",
      },
      {
        label: "Реальный кейс 2025",
        text: "Популярный Grid-бот на Binance потерял 40% депозита за 6 часов во время флэш-краша LUNA 2.0 — не было лимита дневных потерь. Один параметр мог спасти капитал.",
      },
    ],
    codeSnippet: {
      title: "Пример: автоматический расчёт размера позиции по правилу 2%",
      code: `def calc_position_size(balance, risk_pct, entry_price, stop_price):
    """
    balance    — текущий депозит в USDT
    risk_pct   — риск на сделку (например 0.02 = 2%)
    entry_price — цена входа
    stop_price  — цена стоп-лосса
    """
    risk_amount = balance * risk_pct          # сколько USDT рискуем
    stop_distance = abs(entry_price - stop_price)
    position_size = risk_amount / stop_distance  # объём в BTC/ETH

    return round(position_size, 6)

# Пример:
size = calc_position_size(
    balance=10000,       # депозит 10 000 USDT
    risk_pct=0.02,       # риск 2%
    entry_price=65000,   # вход по BTC
    stop_price=63500     # стоп -1500 USDT
)
print(f"Размер позиции: {size} BTC")  # → 0.133333 BTC`,
    },
    comparison: {
      human: "Выставляет лот «на глаз», забывает про стоп в азарте",
      bot: "Автоматически считает размер позиции по формуле перед каждой сделкой",
      ai: "Динамически меняет риск на сделку в зависимости от волатильности рынка",
    },
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