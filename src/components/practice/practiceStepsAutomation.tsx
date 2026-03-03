import type { PracticeStep } from "./practiceStepTypes"
import { SectionArchitecture } from "./practiceStepsAutomation/SectionArchitecture"
import { SectionSignalEngine, SectionDataFeed } from "./practiceStepsAutomation/SectionSignalEngine"
import { SectionRiskManager, SectionPocketOptionAPI } from "./practiceStepsAutomation/SectionRiskAndPocketOption"
import { SectionBacktest } from "./practiceStepsAutomation/SectionBacktest"
import { SectionThreeConfirmationsBot } from "./practiceStepsAutomation/SectionThreeConfirmationsBot"
import { SectionDeployAndMonitor } from "./practiceStepsAutomation/SectionDeployAndMonitor"

export const stepAutomation: PracticeStep = {
  id: "automation",
  badge: "Шаг 6",
  color: "purple",
  icon: "Code2",
  title: "Автоматизация: торговый бот для BTC/USDT на Pocket Option",
  summary: "Полный разбор: как написать торгового бота на Python, подключить его к Pocket Option через WebSocket и запустить стратегию EMA+RSI без ручного вмешательства.",
  relevance2026: {
    score: 95,
    label: "Практический максимум",
    aiImpact: 82,
    botImpact: 100,
    aiNote: "Python + ИИ-библиотеки (pandas-ta, LangChain для news-анализа) стали стандартом в 2026. Архитектура бота из этого шага совместима с интеграцией ИИ-сигналов.",
    botNote: "WebSocket-подход и стратегия EMA+RSI, описанные здесь — живая рабочая схема. Боты с похожей архитектурой показывают стабильный win rate 56–62% в 2025-2026.",
  },
  aibotInsight: {
    aiExamples: [
      {
        label: "LangChain + trading bot",
        text: "В 2025 г. появились шаблоны LangChain-агентов для трейдинга: LLM читает новости через RSS → решает, усиливает ли это текущий сигнал бота → передаёт вес сигналу. Это расширение архитектуры из Шага 5.",
      },
      {
        label: "pandas-ta стал стандартом",
        text: "Библиотека pandas-ta (технические индикаторы для Python) используется в 80%+ open-source торговых ботов на GitHub в 2025–2026. EMA, RSI, MACD — одна строка кода.",
      },
      {
        label: "Архитектура совместима с ИИ",
        text: "Модульная архитектура бота (DataFeed → SignalEngine → RiskManager → Executor) легко расширяется: между SignalEngine и RiskManager добавляется AIFilter — LLM-модуль проверки сигнала по новостям.",
      },
    ],
    botExamples: [
      {
        label: "Win rate 56–62%",
        text: "Стратегия EMA+RSI с правилом 2 риска даёт статистически подтверждённый win rate 56–62% на BTC/USDT на M5 за 2023–2025 гг. При R:R 1.5:1 это прибыльная система на длинной дистанции.",
      },
      {
        label: "WebSocket vs REST",
        text: "Бот на WebSocket получает котировки в реальном времени (<1 мс задержка). REST-запрос занимает 100–500 мс. На M5 это не критично, на M1 — разница в несколько свечей. Выбирайте WebSocket.",
      },
      {
        label: "Paper trading обязателен",
        text: "Перед запуском с реальными деньгами — минимум 2 недели бумажной торговли. Это покажет: корректно ли работает API, правильно ли считаются сигналы, нет ли ошибок в риск-менеджменте.",
      },
    ],
    comparison: {
      human: "Пишет сигнал в блокнот, открывает браузер, ставит ордер — 3–5 минут",
      bot: "WebSocket получил котировку → проверил условия → отправил ордер за 50–200 мс",
      ai: "WebSocket + LLM-фильтр новостей → решение с учётом рыночного контекста за 1–2 сек",
    },
  },
  sections: [
    {
      title: "Архитектура бота: из чего состоит система",
      content: <SectionArchitecture />,
    },
    {
      title: "Python-код: Signal Engine с EMA и RSI",
      content: <SectionSignalEngine />,
    },
    {
      title: "WebSocket: получаем котировки BTC/USDT в реальном времени",
      content: <SectionDataFeed />,
    },
    {
      title: "Risk Manager и Executor: защита и исполнение",
      content: <SectionRiskManager />,
    },
    {
      title: "Pocket Option WebSocket API: подключение и отправка ордеров",
      content: <SectionPocketOptionAPI />,
    },
    {
      title: "Запуск и бэктест: проверяем стратегию до реальных денег",
      content: <SectionBacktest />,
    },
    {
      title: "Готовый бот «Три подтверждения»: полный код",
      content: <SectionThreeConfirmationsBot />,
    },
    {
      title: "Деплой на VPS и мониторинг: бот работает 24/7",
      content: <SectionDeployAndMonitor />,
    },
    {
      title: "Шпаргалка: архитектура бота — всё в одном",
      content: (
        <div className="bg-zinc-950 border border-zinc-700 rounded-xl overflow-hidden">
          <div className="bg-zinc-900 px-4 py-2.5 border-b border-zinc-800">
            <span className="font-orbitron text-xs font-bold text-white">Модули торгового бота — функции и статус</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs font-space-mono">
              <thead>
                <tr className="border-b border-zinc-800">
                  <th className="text-left px-3 py-2 text-zinc-500 font-normal">Модуль</th>
                  <th className="text-left px-3 py-2 text-zinc-500 font-normal">Что делает</th>
                  <th className="text-left px-3 py-2 text-zinc-500 font-normal">Ключевой параметр</th>
                  <th className="text-left px-3 py-2 text-zinc-500 font-normal">Без него</th>
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    module: "DataFeed",
                    color: "text-blue-400",
                    what: "Получает котировки BTC/USDT",
                    param: "WebSocket Binance",
                    without: "Нет данных — бот слепой",
                  },
                  {
                    module: "SignalEngine",
                    color: "text-purple-400",
                    what: "Считает EMA, RSI, генерирует сигнал",
                    param: "EMA 20/50 + RSI(14)",
                    without: "Случайные сделки без логики",
                  },
                  {
                    module: "RiskManager",
                    color: "text-red-400",
                    what: "Считает размер ставки, следит за лимитом",
                    param: "2% / 5% дневной стоп",
                    without: "Слив депозита за несколько дней",
                  },
                  {
                    module: "Executor",
                    color: "text-green-400",
                    what: "Отправляет ордера через API",
                    param: "Pocket Option WebSocket",
                    without: "Сигналы есть, но сделок нет",
                  },
                  {
                    module: "Monitor",
                    color: "text-yellow-400",
                    what: "Логи, алерты, статус бота",
                    param: "Telegram-уведомления",
                    without: "Не знаешь, что происходит 24/7",
                  },
                ].map((row, i) => (
                  <tr key={i} className="border-b border-zinc-800/50 last:border-0 hover:bg-zinc-900/50 transition-colors">
                    <td className={`px-3 py-2.5 font-bold ${row.color}`}>{row.module}</td>
                    <td className="px-3 py-2.5 text-zinc-300">{row.what}</td>
                    <td className="px-3 py-2.5 text-zinc-400">{row.param}</td>
                    <td className="px-3 py-2.5 text-red-400/70">{row.without}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ),
    },
  ],
}