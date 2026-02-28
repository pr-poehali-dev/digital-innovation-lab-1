import React from "react"
import { Badge } from "@/components/ui/badge"
import {
  BotWorkflowDiagram,
  GridBotChart,
  DCAChart,
  BacktestMetricsTable,
  PlatformsComparisonTable,
  StrategyComparisonTable,
  OverfittingChart,
  LaunchChecklist,
  APIKeysGuide,
  MonitoringDashboard,
  BacktestingCodeExample,
} from "./BotsCharts"

export type Section = { title: string; content: React.ReactNode }
export type Chapter = { id: string; badge: string; title: string; summary: string; sections: Section[] }

export const chapters: Chapter[] = [
  {
    id: "what-is-bot",
    badge: "Глава 1",
    title: "Что такое торговый бот и как он работает",
    summary: "Торговый бот — программа, которая автоматически исполняет сделки по заранее заданной логике. Он не спит, не устаёт и не поддаётся эмоциям.",
    sections: [
      {
        title: "Цикл работы бота: от сигнала до сделки",
        content: (
          <div className="space-y-3">
            <p className="text-gray-300 leading-relaxed">Торговый бот — это просто программа, которая повторяет те же действия, что делает трейдер вручную — только быстрее и без эмоций.</p>
            <BotWorkflowDiagram />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-center">
                <div className="text-3xl mb-2">⚡</div>
                <div className="text-white font-orbitron text-xs font-bold mb-1">Скорость</div>
                <p className="text-zinc-400 text-xs">50–500 мс vs 2–5 секунд вручную. Критично для скальпинга и арбитража.</p>
              </div>
              <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-center">
                <div className="text-3xl mb-2">🧘</div>
                <div className="text-white font-orbitron text-xs font-bold mb-1">Без эмоций</div>
                <p className="text-zinc-400 text-xs">Страх и жадность — главные враги трейдера. Бот исполняет стратегию без отклонений.</p>
              </div>
              <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-center">
                <div className="text-3xl mb-2">🕐</div>
                <div className="text-white font-orbitron text-xs font-bold mb-1">24/7</div>
                <p className="text-zinc-400 text-xs">Криптовалютный рынок не закрывается. Бот торгует пока вы спите.</p>
              </div>
            </div>
          </div>
        )
      },
      {
        title: "API-ключи: как безопасно подключить бота",
        content: (
          <div className="space-y-3">
            <p className="text-gray-300 leading-relaxed">API (Application Programming Interface) — мост между вашим ботом и биржей. Понимание безопасности API критично: ошибка здесь = потеря всего счёта.</p>
            <APIKeysGuide />
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
              <div className="text-white font-orbitron text-xs font-bold mb-2">Что бот может делать через API</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-space-mono">
                <div>
                  <div className="text-green-400 mb-2">Разрешённые действия:</div>
                  <ul className="text-zinc-400 space-y-1">
                    <li>✓ Получать котировки и данные</li>
                    <li>✓ Видеть баланс счёта</li>
                    <li>✓ Открывать ордера</li>
                    <li>✓ Закрывать позиции</li>
                    <li>✓ Читать историю сделок</li>
                  </ul>
                </div>
                <div>
                  <div className="text-red-400 mb-2">Отключите вывод средств:</div>
                  <ul className="text-zinc-400 space-y-1">
                    <li>✗ Вывод на внешний кошелёк</li>
                    <li>✗ Перевод между аккаунтами</li>
                    <li>✗ Изменение настроек аккаунта</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )
      },
      {
        title: "Преимущества и ограничения: что бот не умеет",
        content: (
          <div className="space-y-3">
            <p className="text-gray-300 leading-relaxed">Боты — мощный инструмент, но не волшебная палочка. Понимание их ограничений спасёт от разочарований и потерь.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div className="text-green-400 font-orbitron text-xs font-bold mb-2">Что бот делает лучше человека</div>
                <ul className="space-y-2">
                  {[
                    "Работает 24/7 без перерывов",
                    "Исполняет стратегию без эмоций",
                    "Реагирует за миллисекунды",
                    "Тестирует стратегии на годах данных",
                    "Одновременно ведёт 10+ пар",
                    "Не паникует при -20% за день",
                  ].map((t, i) => (
                    <li key={i} className="flex gap-2 text-xs font-space-mono text-zinc-400">
                      <span className="text-green-400 flex-shrink-0">✓</span>{t}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <div className="text-red-400 font-orbitron text-xs font-bold mb-2">Что бот не умеет</div>
                <ul className="space-y-2">
                  {[
                    "Понимать новости и события (FOMC, твиты Маска)",
                    "Адаптироваться к изменению режима рынка",
                    "Предсказывать black swan события",
                    "Читать \"психологию\" рынка",
                    "Работать при технических сбоях биржи",
                    "Гарантировать прибыль при плохой стратегии",
                  ].map((t, i) => (
                    <li key={i} className="flex gap-2 text-xs font-space-mono text-zinc-400">
                      <span className="text-red-400 flex-shrink-0">✗</span>{t}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="bg-zinc-900 border border-yellow-500/20 rounded-xl p-4">
              <div className="text-yellow-400 font-orbitron text-xs font-bold mb-1">Главный принцип</div>
              <p className="text-zinc-400 text-xs font-space-mono">Бот усиливает вашу стратегию, а не создаёт её. Плохая стратегия + бот = быстрый слив (бот торгует хуже, но быстрее). Хорошая стратегия + бот = масштабирование прибыли.</p>
            </div>
          </div>
        )
      },
    ]
  },
  {
    id: "strategies",
    badge: "Глава 2",
    title: "Популярные стратегии для ботов",
    summary: "Стратегия — сердце любого бота. Рассмотрим самые распространённые алгоритмические стратегии с их логикой, плюсами и минусами.",
    sections: [
      {
        title: "Обзор и сравнение всех стратегий",
        content: (
          <div className="space-y-3">
            <p className="text-gray-300 leading-relaxed">Выбор стратегии зависит от вашего капитала, технических знаний и текущего состояния рынка. Не существует «лучшей» стратегии — только подходящая для конкретного рынка.</p>
            <StrategyComparisonTable />
            <div className="bg-zinc-900 border border-red-500/20 rounded-xl p-4">
              <div className="text-red-400 font-orbitron text-xs font-bold mb-1">Мартингейл — почему не рекомендуется</div>
              <p className="text-zinc-400 text-xs font-space-mono">Мартингейл удваивает размер позиции после каждого убытка. Математически это работает — до первой длинной серии потерь. Серия из 8 потерь при начальном лоте $100 → убыток $25,600. Один рыночный обвал уничтожает весь депозит.</p>
            </div>
          </div>
        )
      },
      {
        title: "Grid-бот: зарабатывай на боковике",
        content: (
          <div className="space-y-3">
            <p className="text-gray-300 leading-relaxed">Grid-бот идеален когда рынок «ходит» в диапазоне без чёткого тренда. Именно в такие периоды ручная торговля особенно сложна, а бот зарабатывает стабильно.</p>
            <GridBotChart />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-3">
                <div className="text-white font-orbitron text-xs font-bold mb-2">Как настроить Grid-бот</div>
                <ul className="text-zinc-400 text-xs font-space-mono space-y-1">
                  <li>→ Выберите диапазон цены (макс. и мин.)</li>
                  <li>→ Задайте количество уровней (5–50)</li>
                  <li>→ Чем больше уровней → меньше прибыль с каждого, но чаще срабатывают</li>
                  <li>→ Оставьте 20–30% капитала резервом</li>
                </ul>
              </div>
              <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-3">
                <div className="text-white font-orbitron text-xs font-bold mb-2">Пример расчёта прибыли</div>
                <div className="text-zinc-400 text-xs font-space-mono space-y-1">
                  <div>Диапазон: $40k–$50k</div>
                  <div>Уровней: 10 (через $1k)</div>
                  <div>Прибыль с уровня: ~2%</div>
                  <div>Капитал: $1000</div>
                  <div className="text-green-400 pt-1">→ При 3 срабатываниях/день: ~$6/день (0.6%)</div>
                </div>
              </div>
            </div>
          </div>
        )
      },
      {
        title: "DCA-бот и трендовые стратегии",
        content: (
          <div className="space-y-3">
            <p className="text-gray-300 leading-relaxed">DCA (Dollar Cost Averaging) — самая безопасная стратегия для новичков. Трендовые стратегии — для тех, кто хочет следовать рынку автоматически.</p>
            <DCAChart />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
              <div className="bg-zinc-900 border border-blue-500/20 rounded-xl p-4">
                <div className="text-blue-400 font-orbitron text-xs font-bold mb-2">DCA-стратегия</div>
                <div className="text-zinc-400 text-xs font-space-mono space-y-2">
                  <div><span className="text-white">Для кого:</span> долгосрочные инвесторы в BTC/ETH</div>
                  <div><span className="text-white">Логика:</span> покупать фиксированную сумму каждую неделю или при падении на X%</div>
                  <div><span className="text-white">Плюс:</span> не нужно угадывать дно рынка</div>
                  <div><span className="text-white">Минус:</span> при медвежьем рынке замораживает капитал на месяцы</div>
                </div>
              </div>
              <div className="bg-zinc-900 border border-yellow-500/20 rounded-xl p-4">
                <div className="text-yellow-400 font-orbitron text-xs font-bold mb-2">Трендовый бот (EMA/MACD)</div>
                <div className="text-zinc-400 text-xs font-space-mono space-y-2">
                  <div><span className="text-white">Для кого:</span> свинг-трейдеры, H1–H4</div>
                  <div><span className="text-white">Логика:</span> вход по Golden Cross EMA, выход по Death Cross</div>
                  <div><span className="text-white">Плюс:</span> хорошо работает на сильных трендах (BTC 2020–2021)</div>
                  <div><span className="text-white">Минус:</span> боковик генерирует много убыточных сделок</div>
                </div>
              </div>
            </div>
          </div>
        )
      },
    ]
  },
  {
    id: "backtesting",
    badge: "Глава 3",
    title: "Бэктестинг: проверка стратегии на истории",
    summary: "Прежде чем запускать бота с реальными деньгами, нужно проверить стратегию на исторических данных. Это называется бэктестинг.",
    sections: [
      {
        title: "Ключевые метрики бэктестинга",
        content: (
          <div className="space-y-3">
            <p className="text-gray-300 leading-relaxed">Результат бэктестинга — не просто «+50% за год». Это целый набор метрик, который показывает надёжность и устойчивость стратегии.</p>
            <BacktestMetricsTable />
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
              <div className="text-white font-orbitron text-xs font-bold mb-2">Пример интерпретации результатов</div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs font-space-mono">
                {[
                  { metric: "Total Return", val: "+87%", color: "text-green-400" },
                  { metric: "Max Drawdown", val: "-18%", color: "text-yellow-400" },
                  { metric: "Sharpe Ratio", val: "1.8", color: "text-green-400" },
                  { metric: "Win Rate", val: "52%", color: "text-blue-400" },
                  { metric: "Profit Factor", val: "1.65", color: "text-green-400" },
                  { metric: "Trades", val: "247", color: "text-purple-400" },
                ].map((m, i) => (
                  <div key={i} className="bg-zinc-950 rounded-lg p-2 text-center">
                    <div className="text-zinc-500 text-xs mb-1">{m.metric}</div>
                    <div className={`font-bold text-base ${m.color}`}>{m.val}</div>
                  </div>
                ))}
              </div>
              <p className="text-zinc-500 text-xs mt-2 font-space-mono">Эти результаты выглядят реалистично и заслуживают доверия — можно переходить к paper trading.</p>
            </div>
          </div>
        )
      },
      {
        title: "Overfitting: главная ловушка бэктестинга",
        content: (
          <div className="space-y-3">
            <p className="text-gray-300 leading-relaxed">Overfitting (переобучение) — самая частая причина провала ботов в реальной торговле. Стратегия «слишком хорошо» адаптирована под исторические данные и не работает в будущем.</p>
            <OverfittingChart />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="bg-zinc-900 border border-red-500/20 rounded-lg p-3">
                <div className="text-red-400 font-orbitron text-xs font-bold mb-2">Признаки overfitting</div>
                <ul className="text-zinc-400 text-xs font-space-mono space-y-1">
                  <li>✗ Доходность &gt;300% в год</li>
                  <li>✗ Win Rate &gt;85%</li>
                  <li>✗ Работает только на 1 активе</li>
                  <li>✗ Работает только за 1 год</li>
                  <li>✗ Очень много параметров (20+)</li>
                  <li>✗ Max Drawdown &lt;3%</li>
                </ul>
              </div>
              <div className="bg-zinc-900 border border-green-500/20 rounded-lg p-3">
                <div className="text-green-400 font-orbitron text-xs font-bold mb-2">Как избежать overfitting</div>
                <ul className="text-zinc-400 text-xs font-space-mono space-y-1">
                  <li>✓ Тест на 3+ разных периодах</li>
                  <li>✓ Out-of-sample тест (отдельный период)</li>
                  <li>✓ Тест на 3+ активах</li>
                  <li>✓ Минимальное число параметров</li>
                  <li>✓ Walk-forward оптимизация</li>
                  <li>✓ Paper trading перед реальным</li>
                </ul>
              </div>
            </div>
          </div>
        )
      },
      {
        title: "Инструменты для бэктестинга: от простых к мощным",
        content: (
          <div className="space-y-3">
            <p className="text-gray-300 leading-relaxed">Начните с простого инструмента — TradingView. Когда почувствуете потребность в большем контроле — переходите на Python.</p>
            <BacktestingCodeExample />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { name: "TradingView Pine Script", level: "Начинающий", desc: "Встроенный бэктестер прямо на графике. Не нужно устанавливать ничего. Ограничен данными и возможностями.", link: "tradingview.com", color: "text-blue-400" },
                { name: "Python + Backtesting.py", level: "Средний", desc: "Простая библиотека, 50 строк кода для полноценного бэктеста. Установка: pip install backtesting", link: "kernc.github.io/backtesting.py", color: "text-yellow-400" },
                { name: "Freqtrade", level: "Продвинутый", desc: "Полноценный фреймворк для крипто-ботов. Встроенный бэктестинг, оптимизация, Telegram, Docker.", link: "freqtrade.io", color: "text-green-400" },
                { name: "Backtrader", level: "Продвинутый", desc: "Мощная Python-библиотека для любых рынков (акции, фьючерсы, форекс). Поддерживает любые данные.", link: "backtrader.com", color: "text-purple-400" },
              ].map((t, i) => (
                <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-1">
                    <div className={`font-orbitron text-xs font-bold ${t.color}`}>{t.name}</div>
                    <Badge className="bg-zinc-800 text-zinc-400 border-0 text-xs">{t.level}</Badge>
                  </div>
                  <p className="text-zinc-400 text-xs font-space-mono leading-relaxed">{t.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )
      },
    ]
  },
  {
    id: "platforms",
    badge: "Глава 4",
    title: "Платформы для создания ботов без кода",
    summary: "Не умеете программировать? Это не проблема. Существуют no-code платформы, позволяющие создавать ботов через визуальный интерфейс.",
    sections: [
      {
        title: "Полное сравнение платформ 2024",
        content: (
          <div className="space-y-3">
            <p className="text-gray-300 leading-relaxed">Рынок no-code платформ для ботов активно развивается. Выбор зависит от ваших задач, бюджета и биржи.</p>
            <PlatformsComparisonTable />
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
              <div className="text-white font-orbitron text-xs font-bold mb-3">Как выбрать платформу</div>
              <div className="space-y-2 text-xs font-space-mono text-zinc-400">
                <div className="flex gap-2"><span className="text-white flex-shrink-0">Новичок:</span><span>Pionex или Bybit Bot — бесплатно, встроено в биржу, нет проблем с API</span></div>
                <div className="flex gap-2"><span className="text-white flex-shrink-0">Средний уровень:</span><span>3Commas или Cryptohopper — больше типов ботов, маркетплейс стратегий</span></div>
                <div className="flex gap-2"><span className="text-white flex-shrink-0">Серьёзный трейдер:</span><span>Freqtrade — бесплатно, полный контроль, свой сервер, все биржи через CCXT</span></div>
              </div>
            </div>
          </div>
        )
      },
      {
        title: "3Commas и Pionex: детальный разбор",
        content: (
          <div className="space-y-3">
            <p className="text-gray-300 leading-relaxed">Это два самых популярных варианта для старта. Разберём их детально.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="text-2xl">🟢</div>
                  <div className="text-white font-orbitron font-bold">3Commas</div>
                </div>
                <div className="space-y-2 text-xs font-space-mono">
                  <div className="grid grid-cols-2 gap-1">
                    <div className="text-zinc-500">Биржи:</div><div className="text-zinc-300">Binance, Bybit, OKX, +17</div>
                    <div className="text-zinc-500">Боты:</div><div className="text-zinc-300">DCA, Grid, Options, Composite</div>
                    <div className="text-zinc-500">Цена:</div><div className="text-yellow-400">$29 / $49 / $99 в мес.</div>
                    <div className="text-zinc-500">Маркетплейс:</div><div className="text-green-400">Да (копируй чужих ботов)</div>
                    <div className="text-zinc-500">Мобил. приложение:</div><div className="text-green-400">iOS + Android</div>
                  </div>
                  <div className="border-t border-zinc-800 pt-2">
                    <div className="text-red-400">⚠️ Риск:</div>
                    <p className="text-zinc-500">Сторонний сервис хранит ваши API-ключи. В 2019 году был взлом похожей платформы.</p>
                  </div>
                </div>
              </div>
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="text-2xl">🔵</div>
                  <div className="text-white font-orbitron font-bold">Pionex</div>
                </div>
                <div className="space-y-2 text-xs font-space-mono">
                  <div className="grid grid-cols-2 gap-1">
                    <div className="text-zinc-500">Тип:</div><div className="text-zinc-300">Биржа со встроенными ботами</div>
                    <div className="text-zinc-500">Боты:</div><div className="text-zinc-300">16 типов (Grid, DCA, TWAP...)</div>
                    <div className="text-zinc-500">Цена:</div><div className="text-green-400">Бесплатно</div>
                    <div className="text-zinc-500">Комиссия:</div><div className="text-yellow-400">0.05% (очень низкая)</div>
                    <div className="text-zinc-500">API-ключи:</div><div className="text-green-400">Не нужны</div>
                  </div>
                  <div className="border-t border-zinc-800 pt-2">
                    <div className="text-yellow-400">⚠️ Ограничение:</div>
                    <p className="text-zinc-500">Только их торговые пары. Нельзя использовать свою биржу.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      },
      {
        title: "Freqtrade: для тех, кто хочет полный контроль",
        content: (
          <div className="space-y-3">
            <p className="text-gray-300 leading-relaxed">Freqtrade — открытый исходный код, ваш сервер, ваша стратегия. Требует базовых знаний Python и командной строки, но даёт неограниченные возможности.</p>
            <div className="bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-2 border-b border-zinc-800 bg-zinc-900">
                <div className="w-2 h-2 rounded-full bg-red-500" />
                <div className="w-2 h-2 rounded-full bg-yellow-500" />
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span className="text-zinc-500 text-xs font-space-mono ml-2">terminal</span>
              </div>
              <pre className="p-4 text-xs font-space-mono text-zinc-300 leading-relaxed overflow-x-auto">
{`# Установка Freqtrade через Docker (рекомендуется)
curl -sSL https://raw.githubusercontent.com/freqtrade/freqtrade/stable/setup.sh | bash

# Создать новый проект
freqtrade create-userdir --userdir user_data

# Запустить бэктестинг стратегии
freqtrade backtesting --strategy SampleStrategy \\
  --timerange 20230101-20231231 \\
  --pairs BTC/USDT ETH/USDT

# Запустить в режиме paper trading (без реальных денег)
freqtrade trade --strategy SampleStrategy --dry-run`}
              </pre>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-space-mono">
              {[
                { title: "Поддержка бирж", value: "100+ (через CCXT)", color: "text-green-400" },
                { title: "Встроенный бэктест", value: "Да, с подробной статистикой", color: "text-blue-400" },
                { title: "Telegram-интеграция", value: "Управление ботом из Telegram", color: "text-purple-400" },
              ].map((f, i) => (
                <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-lg p-3">
                  <div className="text-zinc-500 mb-1">{f.title}</div>
                  <div className={`font-semibold ${f.color}`}>{f.value}</div>
                </div>
              ))}
            </div>
          </div>
        )
      },
    ]
  },
  {
    id: "launch",
    badge: "Глава 5",
    title: "Запуск бота: чеклист перед стартом",
    summary: "Перед запуском бота с реальными деньгами пройдите этот чеклист. Пропуск любого пункта может стоить части депозита.",
    sections: [
      {
        title: "Полный чеклист запуска по 4 категориям",
        content: (
          <div className="space-y-3">
            <p className="text-gray-300 leading-relaxed">Этот чеклист составлен на основе опыта сотен трейдеров. Каждый пункт — результат чьей-то дорогостоящей ошибки.</p>
            <LaunchChecklist />
          </div>
        )
      },
      {
        title: "Мониторинг и ежедневное обслуживание",
        content: (
          <div className="space-y-3">
            <p className="text-gray-300 leading-relaxed">Запустить бота — это 20% работы. Остальные 80% — мониторинг и своевременные корректировки.</p>
            <MonitoringDashboard />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-3">
                <div className="text-blue-400 font-orbitron text-xs font-bold mb-2">Ежедневно</div>
                <ul className="text-zinc-400 text-xs font-space-mono space-y-1">
                  <li>→ P&L за день</li>
                  <li>→ Количество сделок</li>
                  <li>→ Открытые позиции</li>
                  <li>→ Ошибки в логах</li>
                </ul>
              </div>
              <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-3">
                <div className="text-purple-400 font-orbitron text-xs font-bold mb-2">Еженедельно</div>
                <ul className="text-zinc-400 text-xs font-space-mono space-y-1">
                  <li>→ Win Rate за неделю</li>
                  <li>→ Сравнение с бэктестом</li>
                  <li>→ Состояние рынка (тренд/флэт)</li>
                  <li>→ Актуальность параметров</li>
                </ul>
              </div>
              <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-3">
                <div className="text-yellow-400 font-orbitron text-xs font-bold mb-2">Ежемесячно</div>
                <ul className="text-zinc-400 text-xs font-space-mono space-y-1">
                  <li>→ Переоптимизация параметров</li>
                  <li>→ Анализ просадок</li>
                  <li>→ Обновление стратегии</li>
                  <li>→ Смена ключей API</li>
                </ul>
              </div>
            </div>
          </div>
        )
      },
      {
        title: "Риск-менеджмент для бота: защита капитала",
        content: (
          <div className="space-y-3">
            <p className="text-gray-300 leading-relaxed">Риск-менеджмент бота — это те же правила, что и для ручной торговли, только автоматизированные.</p>
            <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4">
              <svg viewBox="0 0 360 140" className="w-full h-36">
                <rect x="20" y="20" width="320" height="100" rx="8" fill="#ef444408" stroke="#ef444430" strokeWidth="1" />
                <rect x="35" y="32" width="290" height="77" rx="6" fill="#f59e0b08" stroke="#f59e0b30" strokeWidth="1" />
                <rect x="50" y="44" width="260" height="54" rx="5" fill="#22c55e08" stroke="#22c55e30" strokeWidth="1" />
                <rect x="65" y="56" width="230" height="32" rx="4" fill="#3b82f608" stroke="#3b82f630" strokeWidth="1" />
                <text x="185" y="76" fontSize="11" fill="#93c5fd" textAnchor="middle" fontFamily="monospace" fontWeight="bold">КАПИТАЛ БОТА</text>
                <text x="185" y="90" fontSize="8" fill="#60a5fa" textAnchor="middle" fontFamily="monospace">$1,000 (10% от общего)</text>
                <text x="30" y="84" fontSize="8" fill="#86efac" fontFamily="monospace" transform="rotate(-90, 30, 84)">Daily SL</text>
                <text x="15" y="73" fontSize="8" fill="#fcd34d" fontFamily="monospace" transform="rotate(-90, 15, 73)">Global SL</text>
                <text x="185" y="130" fontSize="8" fill="#52525b" textAnchor="middle" fontFamily="monospace">Слои защиты капитала: начинайте с 10% депозита → расширяйте после 30 дней прибыли</text>
              </svg>
            </div>
            <div className="space-y-2">
              {[
                { title: "Daily Stop Loss (Дневной лимит потерь)", desc: "Установите максимальный убыток за день — например 3%. При достижении бот прекращает торговать до следующего дня. Это защищает от лавинных потерь при аномальной волатильности.", color: "text-red-400" },
                { title: "Лимит размера позиции", desc: "Каждая позиция бота не должна занимать более 10–15% от капитала бота. Если бот торгует несколько пар — диверсификация снижает риск одного плохого актива.", color: "text-yellow-400" },
                { title: "Глобальный Stop Loss", desc: "Если бот потерял 15–20% от стартового капитала — автоматически останавливается и требует ручного перезапуска. Это сигнал пересмотреть стратегию, а не продолжать торговать.", color: "text-orange-400" },
                { title: "Минимальный стартовый капитал", desc: "Запускайте с 10–20% от планируемого капитала. Дайте боту поработать 2–4 недели — сравните результаты с бэктестом. Только после подтверждения добавляйте полный капитал.", color: "text-green-400" },
              ].map((rule, i) => (
                <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-lg p-3">
                  <div className={`font-orbitron text-xs font-bold mb-1 ${rule.color}`}>{rule.title}</div>
                  <p className="text-zinc-400 text-xs font-space-mono leading-relaxed">{rule.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )
      },
    ]
  },
]
