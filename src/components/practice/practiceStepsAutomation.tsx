import type { PracticeStep } from "./practiceStepTypes"
import { SectionArchitecture } from "./practiceStepsAutomation/SectionArchitecture"
import { SectionSignalEngine, SectionDataFeed } from "./practiceStepsAutomation/SectionSignalEngine"
import { SectionRiskManager, SectionPocketOptionAPI } from "./practiceStepsAutomation/SectionRiskAndPocketOption"
import { SectionBacktest } from "./practiceStepsAutomation/SectionBacktest"
import { SectionThreeConfirmationsBot } from "./practiceStepsAutomation/SectionThreeConfirmationsBot"
import { SectionDeployAndMonitor } from "./practiceStepsAutomation/SectionDeployAndMonitor"

export const stepAutomation: PracticeStep = {
  id: "automation",
  badge: "Шаг 5",
  color: "purple",
  icon: "Code2",
  title: "Автоматизация: торговый бот для BTC/USDT на Pocket Option",
  summary: "Полный разбор: как написать торгового бота на Python, подключить его к Pocket Option через WebSocket и запустить стратегию EMA+RSI без ручного вмешательства.",
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
  ],
}