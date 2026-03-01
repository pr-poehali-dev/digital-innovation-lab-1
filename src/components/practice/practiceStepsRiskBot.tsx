import type { PracticeStep } from "./practiceStepTypes"
import { SectionRiskRule2, SectionDailyLimit, SectionTraderJournal } from "./practiceStepsRiskBot/SectionRiskRule2"
import { SectionBotVsHuman } from "./practiceStepsRiskBot/SectionBotVsHuman"
import { SectionDcaBot, SectionGridBot } from "./practiceStepsRiskBot/SectionDcaAndGrid"
import { SectionStrategiesOverview } from "./practiceStepsRiskBot/SectionStrategiesOverview"
import { SectionPocketOption } from "./practiceStepsRiskBot/SectionPocketOption"
import { SectionPlatformsComparison } from "./practiceStepsRiskBot/SectionPlatformsComparison"

export const stepRiskManagement: PracticeStep = {
  id: "risk-management",
  badge: "Шаг 3",
  color: "red",
  icon: "Shield",
  title: "Риск-менеджмент: сколько ставить на сделку",
  summary: "Правила управления капиталом на Pocket Option. Без этого даже 70% правильных сигналов превращаются в слив депозита.",
  relevance2026: {
    score: 99,
    label: "Вечная необходимость",
    aiImpact: 38,
    botImpact: 70,
    aiNote: "ИИ не устраняет риск — он лишь быстрее его считает. Правило 2% и ограничение дневных потерь актуальны независимо от уровня автоматизации.",
    botNote: "Большинство публичных кейсов слива ботов в 2025-2026 — это отсутствие лимита дневных потерь. Шаг 3 — первое, что нужно прошить в код любого бота.",
  },
  aibotInsight: {
    aiExamples: [
      {
        label: "ИИ не отменяет риск",
        text: "Даже самые продвинутые ИИ-системы (Renaissance Technologies, Two Sigma) имеют жёсткий риск-менеджмент. Лимит потерь — первое, что настраивается, последнее, что снимается.",
      },
      {
        label: "Динамический риск",
        text: "Передовые ИИ-фонды автоматически снижают размер позиции при росте VIX (индекса страха). Логика: чем выше волатильность, тем меньше ставка. Это противоположно тому, как действует большинство трейдеров.",
      },
    ],
    botExamples: [
      {
        label: "Daily Stop Loss в коде",
        text: "MAX_DAILY_LOSS = 0.05 (5%). После каждой сделки бот проверяет: если sum(дневные убытки) >= MAX_DAILY_LOSS → останавливается до 00:00 UTC. Один параметр, который спас тысячи депозитов.",
      },
      {
        label: "Правило 2% автоматически",
        text: "Бот не спрашивает «сколько поставить?». Он считает: position_size = balance × 0.02. Если баланс $500 → размер сделки всегда $10, независимо от «уверенности» в сигнале.",
      },
    ],
    codeSnippet: {
      title: "Risk Manager: лимит потерь за день в коде бота",
      code: `class RiskManager:
    def __init__(self, balance, risk_pct=0.02, daily_limit_pct=0.05):
        self.balance = balance
        self.risk_pct = risk_pct
        self.daily_limit_pct = daily_limit_pct
        self.daily_loss = 0

    def can_trade(self):
        """Проверяет, можно ли открывать новые сделки"""
        if self.daily_loss >= self.balance * self.daily_limit_pct:
            print(f"⛔ Дневной лимит достигнут: -{self.daily_loss:.2f} USDT. Торговля остановлена.")
            return False
        return True

    def get_position_size(self):
        """Возвращает размер позиции по правилу 2%"""
        return round(self.balance * self.risk_pct, 2)

    def record_loss(self, amount):
        self.daily_loss += amount`,
    },
    comparison: {
      human: "Ставит «чуть больше» когда кажется что сигнал надёжный, забывает про дневной стоп",
      bot: "Автоматически считает 2% от баланса и останавливается при достижении дневного лимита",
      ai: "Снижает риск при росте волатильности рынка, увеличивает при благоприятных условиях",
    },
  },
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
  relevance2026: {
    score: 97,
    label: "Тема №1 в крипте",
    aiImpact: 88,
    botImpact: 100,
    aiNote: "ИИ-агенты (LLM + автоматизация) стали новым видом ботов: они не только исполняют, но и интерпретируют рынок. Это меняет само понятие «торговый бот».",
    botNote: "В 2026 г. более 60% розничных криптотрейдеров используют хотя бы одного бота. Понимание того, «когда бот помогает, а когда мешает» — ключевой навык.",
  },
  aibotInsight: {
    aiExamples: [
      {
        label: "ИИ-агент = новый бот",
        text: "В 2025–2026 гг. появились агенты на базе LLM (GPT-4o, Gemini), которые сами читают рынок, новости и соцсети, принимают решения и исполняют ордера без заранее прописанных правил. Это «бот нового поколения».",
      },
      {
        label: "60%+ трейдеров — с ботами",
        text: "По опросу CryptoCompare (2025): 62% активных крипто-трейдеров используют хотя бы одного бота. Из них 71% — no-code платформы (Pionex, 3Commas). Бот перестал быть чем-то сложным.",
      },
    ],
    botExamples: [
      {
        label: "Когда бот НЕ нужен",
        text: "Важное: бот не поможет на событийных рынках (выход NFP, решение ФРС, хак биржи). В такие моменты лучше остановить бота вручную — резкие движения «выносят» сетки и DCA-стратегии.",
      },
      {
        label: "Когда бот необходим",
        text: "Бот незаменим на стабильном боковом рынке: Grid-бот зарабатывает на каждом колебании внутри диапазона, пока человек занят другими делами. Это типичный «пассивный доход» от трейдинга.",
      },
    ],
    comparison: {
      human: "Решает вручную: торговать сегодня или нет, сколько ставить, когда выходить",
      bot: "Автоматически решает всё — по заранее прописанным правилам, без эмоций",
      ai: "Адаптирует решения на основе текущего контекста рынка и новостного фона",
    },
  },
  sections: [
    { title: "Обзор стратегий: Pocket Option и BTC/USDT", content: <SectionStrategiesOverview /> },
    { title: "Бот vs ручная торговля: что выбрать", content: <SectionBotVsHuman /> },
    { title: "DCA-бот: стратегия для крипто-рынка", content: <SectionDcaBot /> },
    { title: "Grid-бот: заработок на волатильности", content: <SectionGridBot /> },
    { title: "Pocket Option: лучшая идея для бота «Три подтверждения»", content: <SectionPocketOption /> },
    { title: "Сравнение платформ: Pocket Option vs 3Commas vs Pionex", content: <SectionPlatformsComparison /> },
  ],
}