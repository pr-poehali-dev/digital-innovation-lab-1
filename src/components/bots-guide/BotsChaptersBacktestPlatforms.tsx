import React from "react"
import { Badge } from "@/components/ui/badge"
import {
  BacktestMetricsTable,
  PlatformsComparisonTable,
  OverfittingChart,
  BacktestingCodeExample,
} from "./BotsCharts"
import type { Chapter } from "./BotsChapterTypes"

export const chapterBacktesting: Chapter = {
  id: "backtesting",
  badge: "Глава 3",
  title: "Бэктестинг: проверка стратегии на истории",
  summary: "Прежде чем запускать бота с реальными деньгами, нужно проверить стратегию на исторических данных. Это называется бэктестинг.",
  relevance2026: {
    score: 85,
    label: "Обязательный этап",
    aiImpact: 65,
    botImpact: 80,
    aiNote: "ИИ-инструменты (ChatGPT + Python, QuantConnect AI) ускорили процесс бэктестинга в 5-10 раз. Но логика интерпретации результатов по-прежнему требует понимания человеком.",
    botNote: "Ни одна серьёзная платформа не позволяет запустить бота без бэктеста. В 2026 г. большинство платформ встроили авто-бэктест как обязательный шаг перед live-торговлей.",
  },
  sections: [
    {
      title: "Ключевые метрики бэктестинга",
      content: (
        <div className="space-y-3">
          <p className="text-gray-300 leading-relaxed">Результат бэктестинга — не просто «+50% за год». Это целый набор метрик, который показывает надёжность и устойчивость стратегии.</p>
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
            <div className="text-red-400 font-orbitron text-xs font-bold mb-2">Реальный кейс: «+340% в бэктесте, -62% в реале»</div>
            <p className="text-zinc-400 text-xs font-space-mono leading-relaxed">Павел протестировал свою стратегию: Total Return +340%, Win Rate 89%. Запустил с $20,000. Через 4 месяца — $7,600 (-62%). Разбор: бэктест был только на 2020–2021 (исключительно бычий рынок), Max Drawdown не проверялся, Sharpe Ratio 0.8 (слабо). Он видел только «доходность» и проигнорировал остальные метрики. <span className="text-white">Хороший бэктест — это когда все шесть метрик выглядят разумно, а не только прибыль.</span></p>
          </div>
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
          <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-4">
            <div className="text-orange-400 font-orbitron text-xs font-bold mb-2">Пример overfitting из реальной торговли</div>
            <p className="text-zinc-400 text-xs font-space-mono leading-relaxed">Стратегия EMA(7)/EMA(14)/RSI(9) показала Win Rate 91% на BTC за 2020–2021. Параметры подобраны идеально под этот отрезок. Тест на 2018–2019: Win Rate 38%. Тест на 2022: Win Rate 29%. Стратегия «запомнила» конкретный бычий рынок и не умеет работать в других условиях. <span className="text-white">Золотое правило: если стратегия работает на 1–2 периодах, она переобучена.</span></p>
          </div>
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
          <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
            <div className="text-green-400 font-orbitron text-xs font-bold mb-2">Пример: путь от TradingView до Freqtrade</div>
            <p className="text-zinc-400 text-xs font-space-mono leading-relaxed">Роман начал с Pine Script на TradingView — запустил простую стратегию EMA Cross за вечер. Убедился, что идея работает. Затем переписал на Python+Backtesting.py для точного учёта комиссий и проскальзывания (TradingView их занижает). Финально перенёс в Freqtrade для бумажной торговли. Весь путь занял 3 недели. <span className="text-white">Начинайте просто — усложняйте только там, где это нужно.</span></p>
          </div>
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
}

export const chapterPlatforms: Chapter = {
  id: "platforms",
  badge: "Глава 4",
  title: "Платформы для создания ботов без кода",
  summary: "Не умеете программировать? Это не проблема. Существуют no-code платформы, позволяющие создавать ботов через визуальный интерфейс.",
  relevance2026: {
    score: 96,
    label: "Бум no-code ботов",
    aiImpact: 85,
    botImpact: 100,
    aiNote: "ИИ-ассистенты внутри платформ (Pionex AI, 3Commas Copilot) теперь сами предлагают настройки бота на основе текущего рынка. Порог входа упал до нуля.",
    botNote: "Рынок no-code платформ вырос втрое за 2024-2026 гг. Сравнение платформ — ключевой выбор перед стартом любого проекта с ботом.",
  },
  sections: [
    {
      title: "Полное сравнение платформ 2024",
      content: (
        <div className="space-y-3">
          <p className="text-gray-300 leading-relaxed">Рынок no-code платформ для ботов активно развивается. Выбор зависит от ваших задач, бюджета и биржи.</p>
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
            <div className="text-blue-400 font-orbitron text-xs font-bold mb-2">Как выбрать: история трёх трейдеров</div>
            <div className="space-y-2 text-xs font-space-mono text-zinc-400">
              <div className="border-l-2 border-green-500 pl-3"><span className="text-green-400 font-bold">Алексей (новичок)</span> — запустил Grid на Pionex за 15 минут без регистрации API. Комиссия 0.05%. Идеально для старта.</div>
              <div className="border-l-2 border-yellow-500 pl-3"><span className="text-yellow-400 font-bold">Светлана (средний)</span> — подключила 3Commas к Bybit, настроила DCA-бот с маркетплейса. Платит $29/мес, но экономит часы ручной торговли.</div>
              <div className="border-l-2 border-purple-500 pl-3"><span className="text-purple-400 font-bold">Константин (продвинутый)</span> — Freqtrade на VPS $5/мес. Написал стратегию на Python, полный контроль, нет ежемесячных платежей. Потратил 2 недели на настройку.</div>
            </div>
          </div>
          <PlatformsComparisonTable />
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
            <div className="text-white font-orbitron text-xs font-bold mb-3">Как выбрать платформу</div>
            <div className="space-y-2 text-xs font-space-mono text-zinc-400">
              <div className="flex gap-2"><span className="text-white flex-shrink-0">Новичок:</span><span>Pionex или Bybit Bot — бесплатно, встроено в биржу, нет проблем с API</span></div>
              <div className="flex gap-2"><span className="text-white flex-shrink-0">Средний:</span><span>3Commas или Cryptohopper — DCA + Grid + marketplace стратегий</span></div>
              <div className="flex gap-2"><span className="text-white flex-shrink-0">Продвинутый:</span><span>Freqtrade на своём сервере — полный контроль, Python, без ежемесячной платы</span></div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "3Commas и Pionex: детальный разбор",
      content: (
        <div className="space-y-3">
          <p className="text-gray-300 leading-relaxed">Рассмотрим две самые популярные платформы — платную с маркетплейсом и бесплатную встроенную в биржу.</p>
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
}

export const chaptersBacktestPlatforms: Chapter[] = [chapterBacktesting, chapterPlatforms]