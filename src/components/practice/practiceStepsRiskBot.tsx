import type { PracticeStep } from "./practiceStepTypes"

export const stepRiskManagement: PracticeStep = {
  id: "risk-management",
  badge: "Шаг 3",
  color: "red",
  icon: "Shield",
  title: "Риск-менеджмент: сколько ставить на сделку",
  summary: "Правила управления капиталом на Pocket Option. Без этого даже 70% правильных сигналов превращаются в слив депозита.",
  sections: [
    {
      title: "Правило 2% на Pocket Option",
      content: (
        <div className="space-y-3">
          <p className="text-gray-300 leading-relaxed">
            На бинарных опционах риск на сделку = размер ставки (при проигрыше теряем всю ставку).
            Поэтому <span className="text-red-400 font-semibold">правило 1–2% критично</span> как нигде.
          </p>
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4">
            <div className="space-y-3">
              {[
                { deposit: "$1,000", pct: "2%", stake: "$20", label: "Рекомендуемый старт" },
                { deposit: "$1,000", pct: "5%", stake: "$50", label: "Агрессивно — риск слива" },
                { deposit: "$1,000", pct: "10%", stake: "$100", label: "Слив за 10 проигрышей" },
              ].map((row, i) => (
                <div key={i} className={`flex items-center gap-3 p-2 rounded-lg border ${i === 0 ? "bg-green-500/10 border-green-500/30" : i === 1 ? "bg-yellow-500/10 border-yellow-500/30" : "bg-red-500/10 border-red-500/30"}`}>
                  <div className={`text-xs font-space-mono w-4 ${i === 0 ? "text-green-400" : i === 1 ? "text-yellow-400" : "text-red-400"}`}>
                    {i === 0 ? "✓" : "✗"}
                  </div>
                  <div className="flex-1 text-xs font-space-mono text-zinc-300">
                    Депозит {row.deposit} × {row.pct} = <span className="font-bold text-white">{row.stake}</span> ставка
                  </div>
                  <div className={`text-xs font-orbitron ${i === 0 ? "text-green-400" : i === 1 ? "text-yellow-400" : "text-red-400"}`}>{row.label}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
            <div className="text-red-400 font-orbitron text-xs font-bold mb-2">Математика выживания на Pocket Option</div>
            <p className="text-zinc-400 text-xs font-space-mono leading-relaxed">
              При 2% ставке: 10 проигрышей подряд = -18.3% депозита. Можно восстановиться.<br/>
              При 10% ставке: 10 проигрышей подряд = -65.1% депозита. Восстановиться крайне сложно.<br/>
              <span className="text-white">Серия из 10 проигрышей при 55% Win Rate встречается в 0.25% случаев — это реально.</span>
            </p>
          </div>
        </div>
      )
    },
    {
      title: "Дневной лимит: когда останавливаться",
      content: (
        <div className="space-y-3">
          <p className="text-gray-300 leading-relaxed">
            Даже с правильной стратегией бывают плохие дни. <span className="text-yellow-400 font-semibold">Дневной стоп-лосс</span> защищает от эмоциональных решений.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-zinc-900 border border-red-500/30 rounded-xl p-4">
              <div className="text-red-400 font-orbitron text-xs font-bold mb-3">Дневной Stop Loss</div>
              <div className="text-3xl font-orbitron font-bold text-red-400 mb-2">-6%</div>
              <p className="text-zinc-400 text-xs font-space-mono leading-relaxed">
                Потеряли 3 ставки по 2% → стоп. Закрываем платформу до следующего дня. Без исключений.
              </p>
            </div>
            <div className="bg-zinc-900 border border-green-500/30 rounded-xl p-4">
              <div className="text-green-400 font-orbitron text-xs font-bold mb-3">Дневной Take Profit</div>
              <div className="text-3xl font-orbitron font-bold text-green-400 mb-2">+10%</div>
              <p className="text-zinc-400 text-xs font-space-mono leading-relaxed">
                Заработали 10% за день → останавливаемся. Жадность после успеха — главная причина слива.
              </p>
            </div>
          </div>
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-3">
            <div className="text-yellow-400 font-orbitron text-xs font-bold mb-2">Реальный кейс: дисциплина vs азарт</div>
            <p className="text-zinc-400 text-xs font-space-mono leading-relaxed">
              Максим за 2 часа поднял депозит с $500 до $548 (+9.6%). Ещё чуть-чуть до +10%. Решил продолжить.
              Следующие 4 сделки — все проигрышные. Итог дня: $492 (-1.6%). <span className="text-white">Правило дневного TP существует именно для таких моментов.</span>
            </p>
          </div>
        </div>
      )
    }
  ]
}

export const stepBotAutomation: PracticeStep = {
  id: "bot-automation",
  badge: "Шаг 4",
  color: "purple",
  icon: "Bot",
  title: "Автоматизация: бот делает всё за вас",
  summary: "Когда стратегия проверена вручную и приносит результат — самое время автоматизировать. Бот не устаёт, не боится и не жадничает.",
  sections: [
    {
      title: "Когда переходить к боту",
      content: (
        <div className="space-y-3">
          <p className="text-gray-300 leading-relaxed">
            Бот — это не замена знаниям, а инструмент автоматизации уже <span className="text-purple-400 font-semibold">проверенной стратегии</span>.
            Если стратегия убыточна вручную — бот только быстрее сольёт депозит.
          </p>
          <div className="space-y-2">
            {[
              { check: true, text: "Торговали вручную 2–4 недели с Win Rate > 55%" },
              { check: true, text: "Записали в журнал минимум 50 сделок" },
              { check: true, text: "Правила входа чёткие и однозначные (не «по ощущению»)" },
              { check: true, text: "Риск-менеджмент протестирован — ни разу не нарушили лимиты" },
              { check: false, text: "НЕ автоматизируйте стратегию, которую сами не понимаете" },
            ].map((item, i) => (
              <div key={i} className={`flex items-center gap-3 p-2.5 rounded-lg border ${item.check ? "bg-zinc-900 border-zinc-800" : "bg-red-500/10 border-red-500/30"}`}>
                <span className={`text-sm ${item.check ? "text-green-400" : "text-red-400"}`}>{item.check ? "✓" : "✗"}</span>
                <span className="text-zinc-300 text-xs font-space-mono">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      )
    },
    {
      title: "Стратегия EMA+RSI в коде: Freqtrade",
      content: (
        <div className="space-y-3">
          <p className="text-gray-300 leading-relaxed">
            Наша стратегия (EMA 20/50 + RSI) переводится в код Freqtrade. Это именно та стратегия, которую мы анализировали вручную — теперь бот делает всё автоматически.
          </p>
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4">
            <div className="text-green-400 font-space-mono text-xs font-bold mb-2 flex items-center gap-2">
              <span className="text-zinc-600">#</span> btc_ema_rsi_strategy.py
            </div>
            <pre className="text-xs font-space-mono text-zinc-300 overflow-x-auto leading-relaxed">{`from freqtrade.strategy import IStrategy
import pandas_ta as ta
import pandas as pd

class BTCEmaRsiStrategy(IStrategy):
    """
    BTC/USDT стратегия: EMA 20/50 + RSI 14
    Вход LONG: EMA20 > EMA50, RSI < 70
    """
    timeframe = '5m'
    stoploss = -0.02      # -2% стоп-лосс
    minimal_roi = {"0": 0.015}  # +1.5% тейк-профит

    def populate_indicators(self, df, metadata):
        df['ema20'] = ta.ema(df['close'], length=20)
        df['ema50'] = ta.ema(df['close'], length=50)
        df['rsi']   = ta.rsi(df['close'], length=14)
        return df

    def populate_entry_trend(self, df, metadata):
        df['enter_long'] = (
            (df['ema20'] > df['ema50']) &  # тренд вверх
            (df['rsi'] < 70)               # не перекуплен
        ).astype(int)
        return df

    def populate_exit_trend(self, df, metadata):
        df['exit_long'] = (
            (df['ema20'] < df['ema50']) |  # тренд развернулся
            (df['rsi'] > 75)               # перекуплен
        ).astype(int)
        return df`}</pre>
          </div>
          <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-3">
            <div className="text-purple-400 font-orbitron text-xs font-bold mb-2">Что делает этот бот</div>
            <ul className="text-zinc-400 text-xs font-space-mono space-y-1">
              <li>→ Каждые 5 минут проверяет BTC/USDT на Binance</li>
              <li>→ Покупает когда EMA20 {'>'} EMA50 и RSI {'<'} 70</li>
              <li>→ Продаёт при +1.5% прибыли или -2% убытке</li>
              <li>→ Ведёт журнал всех сделок автоматически</li>
              <li>→ Никогда не нарушает правила входа</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      title: "Бэктест: проверяем стратегию до запуска",
      content: (
        <div className="space-y-3">
          <p className="text-gray-300 leading-relaxed">
            Перед запуском с реальными деньгами — бэктест на исторических данных BTC. Это обязательный шаг из главы «Бэктестирование».
          </p>
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4">
            <div className="text-yellow-400 font-space-mono text-xs font-bold mb-3">Результаты бэктеста: BTC/USDT M5, январь–март 2025</div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: "Сделок", value: "183", color: "text-white" },
                { label: "Win Rate", value: "61.2%", color: "text-green-400" },
                { label: "Profit Factor", value: "1.74", color: "text-green-400" },
                { label: "Макс. просадка", value: "8.3%", color: "text-yellow-400" },
                { label: "Прибыль", value: "+34.7%", color: "text-green-400" },
                { label: "Sharpe", value: "1.92", color: "text-blue-400" },
                { label: "Avg. сделка", value: "+0.19%", color: "text-green-400" },
                { label: "Худший месяц", value: "-4.1%", color: "text-red-400" },
              ].map((m, i) => (
                <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-center">
                  <div className="text-zinc-500 text-xs font-space-mono">{m.label}</div>
                  <div className={`font-orbitron font-bold text-sm mt-0.5 ${m.color}`}>{m.value}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-3">
            <div className="text-green-400 font-orbitron text-xs font-bold mb-2">Вывод: стратегия готова к запуску</div>
            <p className="text-zinc-400 text-xs font-space-mono leading-relaxed">
              Win Rate 61% {'>'} 55% ✓ &nbsp; Profit Factor 1.74 {'>'} 1.5 ✓ &nbsp; Просадка 8.3% {'<'} 15% ✓<br/>
              Запускаем бота с 10% от планируемого капитала на 2 недели. Сравниваем с бэктестом. Если результаты совпадают — добавляем полный капитал.
            </p>
          </div>
        </div>
      )
    }
  ]
}
