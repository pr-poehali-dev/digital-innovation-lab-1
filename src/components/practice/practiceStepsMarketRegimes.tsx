import type { PracticeStep } from "./practiceStepTypes"

export const stepMarketRegimes: PracticeStep = {
  id: "market-regimes",
  badge: "Шаг 2",
  color: "purple",
  icon: "Layers",
  title: "Режимы рынка: в каком состоянии BTC прямо сейчас?",
  summary: "Одна и та же стратегия приносит прибыль в тренде и убытки в боковике. Перед любым входом нужно определить режим рынка — это меняет всё: инструменты, стратегию, размер ставки.",
  relevance2026: {
    score: 95,
    label: "Ключевой навык",
    aiImpact: 82,
    botImpact: 75,
    aiNote: "ИИ-системы классифицируют режим рынка в реальном времени, совмещая ATR, ADX, объёмы и новостной фон. Это один из самых ценных применений ML в трейдинге.",
    botNote: "Профессиональные боты автоматически переключаются между стратегиями в зависимости от определённого режима — это и есть их главное преимущество над человеком.",
  },
  aibotInsight: {
    aiExamples: [
      {
        label: "ML-классификатор режима рынка",
        text: "Hedge-фонды используют градиентный бустинг (XGBoost) для классификации режимов на основе 50+ фич: ADX, ATR, корреляция с индексами, объёмный профиль, funding rate. Точность — до 78% на крипте.",
      },
      {
        label: "Адаптивный ИИ-агент",
        text: "GPT-4o в связке с TradingView API может ежечасно пересматривать режим рынка и давать рекомендацию: «Сейчас флэт — переключись на сетку» или «Волатильность высокая — уменьши размер сделки вдвое».",
      },
    ],
    botExamples: [
      {
        label: "Переключение стратегий по ADX",
        text: "Бот проверяет ADX каждую свечу: если ADX > 25 — включает трендовую стратегию (EMA-кросс), если ADX < 20 — переключается на сеточную торговлю. Это и есть адаптивный алгоритм.",
      },
      {
        label: "Фильтр по ATR перед входом",
        text: "Перед каждой сделкой бот считает ATR(14). Если текущая свеча > 1.5×ATR — рынок в режиме высокой волатильности, бот уменьшает размер позиции или пропускает вход.",
      },
    ],
    codeSnippet: {
      title: "Определение режима рынка: ADX + ATR",
      code: `import pandas_ta as ta

def get_market_regime(df):
    df['adx'] = ta.adx(df['high'], df['low'], df['close'])['ADX_14']
    df['atr'] = ta.atr(df['high'], df['low'], df['close'], length=14)
    atr_mean = df['atr'].rolling(50).mean()

    last = df.iloc[-1]
    adx = last['adx']
    atr_ratio = last['atr'] / atr_mean.iloc[-1]

    if adx > 25 and atr_ratio < 1.5:
        return 'TREND'        # Чёткий тренд — работаем по тренду
    elif adx < 20:
        return 'FLAT'         # Боковик — сетка или пропуск
    elif atr_ratio > 1.5:
        return 'VOLATILE'     # Высокая волатильность — осторожно
    else:
        return 'TRANSITION'   # Переходный режим — ждём

regime = get_market_regime(btc_df)
print(f"Режим BTC: {regime}")`,
    },
    comparison: {
      human: "Определяет режим «на глаз» — часто ошибается в переходных зонах",
      bot: "Считает ADX + ATR за миллисекунды, автоматически меняет стратегию",
      ai: "Учитывает корреляции, объёмы, funding rate и новости для точной классификации",
    },
  },
  sections: [
    {
      title: "4 режима рынка: как называть и как узнать",
      content: (
        <div className="space-y-3">
          <p className="text-gray-300 leading-relaxed">
            Рынок постоянно меняет поведение. Профессионалы выделяют <span className="text-purple-400 font-semibold">4 режима</span> — у каждого своя логика и своя стратегия.
          </p>
          <div className="space-y-2">
            {[
              {
                name: "Тренд",
                emoji: "📈",
                color: "text-green-400",
                border: "border-green-500/30",
                bg: "bg-green-500/5",
                signal: "ADX > 25, EMA 20 далеко от EMA 50",
                desc: "Рынок уверенно движется в одну сторону. Самый прибыльный режим — работай по направлению тренда.",
                strategy: "Стратегия: трендовые сигналы по EMA, MACD, пробои уровней",
                risk: "Риск: обычный (1–2% депозита на сделку)",
              },
              {
                name: "Боковик (флэт)",
                emoji: "↔️",
                color: "text-blue-400",
                border: "border-blue-500/30",
                bg: "bg-blue-500/5",
                signal: "ADX < 20, EMA переплетены, цена ходит в канале",
                desc: "Рынок движется горизонтально между уровнями. Трендовые стратегии дают ложные сигналы — нужна другая тактика.",
                strategy: "Стратегия: отскоки от уровней, сеточная торговля, RSI-перекупленность/перепроданность",
                risk: "Риск: уменьшенный (0.5–1%) — много ложных пробоев",
              },
              {
                name: "Высокая волатильность",
                emoji: "⚡",
                color: "text-yellow-400",
                border: "border-yellow-500/30",
                bg: "bg-yellow-500/5",
                signal: "ATR > 1.5× среднего за 50 свечей, резкие движения",
                desc: "Рынок двигается быстро и непредсказуемо — часто после новостей, ликвидаций китов, регуляторных событий.",
                strategy: "Стратегия: пропуск или минимальные ставки, ожидание стабилизации",
                risk: "Риск: минимальный (0.25–0.5%) или полный пропуск",
              },
              {
                name: "Переход",
                emoji: "🔄",
                color: "text-zinc-400",
                border: "border-zinc-500/30",
                bg: "bg-zinc-500/5",
                signal: "ADX между 20–25, EMA сближаются, объём падает",
                desc: "Рынок меняет режим — тренд заканчивается или боковик собирается взорваться. Самое неопределённое состояние.",
                strategy: "Стратегия: ждать. Не торговать в неопределённости.",
                risk: "Риск: пропуск — профессионалы пропускают этот режим",
              },
            ].map((r, i) => (
              <div key={i} className={`border ${r.border} ${r.bg} rounded-xl p-4`}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">{r.emoji}</span>
                  <span className={`font-orbitron text-sm font-bold ${r.color}`}>{r.name}</span>
                  <span className="text-zinc-500 text-xs font-space-mono ml-auto">{r.signal}</span>
                </div>
                <p className="text-zinc-300 text-xs font-space-mono leading-relaxed mb-2">{r.desc}</p>
                <div className="flex flex-col gap-1">
                  <div className="flex gap-2 items-start">
                    <span className="text-zinc-500 text-xs shrink-0">→</span>
                    <span className={`text-xs font-space-mono ${r.color}`}>{r.strategy}</span>
                  </div>
                  <div className="flex gap-2 items-start">
                    <span className="text-zinc-500 text-xs shrink-0">⚠</span>
                    <span className="text-zinc-400 text-xs font-space-mono">{r.risk}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      title: "Как определить режим за 30 секунд",
      content: (
        <div className="space-y-3">
          <p className="text-gray-300 leading-relaxed">
            Два индикатора дают полную картину режима рынка. Добавь их на график один раз — и пользуйся постоянно.
          </p>
          <div className="space-y-3">
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
              <div className="text-purple-400 font-orbitron text-xs font-bold mb-2">ADX (Average Directional Index)</div>
              <p className="text-zinc-300 text-xs font-space-mono leading-relaxed mb-3">
                Показывает <span className="text-white">силу тренда</span> — не направление, а именно силу. Значение от 0 до 100.
              </p>
              <div className="space-y-1.5">
                {[
                  { val: "ADX < 20", label: "Боковик или переход", color: "text-blue-400" },
                  { val: "ADX 20–25", label: "Переходный режим — ждём", color: "text-zinc-400" },
                  { val: "ADX 25–40", label: "Умеренный тренд — можно торговать", color: "text-green-400" },
                  { val: "ADX > 40", label: "Сильный тренд или высокая волатильность", color: "text-yellow-400" },
                ].map((row, i) => (
                  <div key={i} className="flex gap-3 items-center">
                    <span className={`font-orbitron text-xs font-bold w-24 shrink-0 ${row.color}`}>{row.val}</span>
                    <span className="text-zinc-400 text-xs font-space-mono">{row.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
              <div className="text-yellow-400 font-orbitron text-xs font-bold mb-2">ATR (Average True Range)</div>
              <p className="text-zinc-300 text-xs font-space-mono leading-relaxed">
                Показывает <span className="text-white">волатильность</span> — насколько большие свечи прямо сейчас по сравнению с нормой.
                Сравни текущий ATR со средним за 50 свечей: если текущий больше в 1.5 раза — режим высокой волатильности.
              </p>
            </div>
          </div>

          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4">
            <div className="font-orbitron text-xs font-bold text-zinc-300 mb-3">Алгоритм определения режима (30 секунд)</div>
            <div className="space-y-2">
              {[
                { step: "1", text: "Открываем график BTC/USD M5, добавляем ADX(14) и ATR(14)", color: "text-blue-400" },
                { step: "2", text: "Смотрим ADX: ниже 20 → боковик; выше 25 → потенциальный тренд", color: "text-purple-400" },
                { step: "3", text: "Смотрим ATR: больше нормы в 1.5× → высокая волатильность, независимо от ADX", color: "text-yellow-400" },
                { step: "4", text: "Выбираем стратегию под режим → переходим к Шагу 1 (EMA + уровни)", color: "text-green-400" },
              ].map((item, i) => (
                <div key={i} className="flex gap-3 items-start">
                  <div className={`font-orbitron text-sm font-bold ${item.color} w-4 shrink-0`}>{item.step}</div>
                  <p className="text-zinc-300 text-xs font-space-mono leading-relaxed">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Какую стратегию выбрать в каждом режиме",
      content: (
        <div className="space-y-3">
          <p className="text-gray-300 leading-relaxed">
            Режим рынка определяет весь план торговли. Вот конкретные инструменты под каждый режим.
          </p>
          <div className="space-y-2">
            {[
              {
                regime: "Тренд",
                color: "text-green-400",
                border: "border-green-500/30",
                tools: ["EMA-пересечения (20/50)", "Пробой уровней с подтверждением", "MACD для направления", "Вход на откатах к EMA"],
                avoid: "Не торговать против тренда, не входить на пике свечи",
                example: "BTC пробил $97,000 вверх, EMA 20 выше EMA 50, ADX = 32 → ищем только CALL на откатах",
              },
              {
                regime: "Боковик",
                color: "text-blue-400",
                border: "border-blue-500/30",
                tools: ["RSI перекупленность (>70) и перепроданность (<30)", "Отскоки от чётких уровней", "Bollinger Bands (отскок от краёв)", "Сеточный бот"],
                avoid: "Не торговать пробои — 80% из них ложные в боковике",
                example: "BTC ходит между $95,000 и $97,000 третий час, ADX = 15 → ждём касания границ канала",
              },
              {
                regime: "Высокая волатильность",
                color: "text-yellow-400",
                border: "border-yellow-500/30",
                tools: ["Пропуск большинства сигналов", "Торговля только по чётким новостным движениям", "Уменьшение размера ставки в 2–4 раза"],
                avoid: "Не держать открытые позиции — рынок может развернуться на 3–5% за минуты",
                example: "Вышли данные CPI — BTC прыгнул на 3% за 10 минут, ATR × 2.5 → ждём стабилизации 15–30 минут",
              },
              {
                regime: "Переход",
                color: "text-zinc-400",
                border: "border-zinc-500/30",
                tools: ["Ожидание", "Наблюдение за объёмом", "Установка алертов на пробой уровня"],
                avoid: "Не торговать — в переходный период убытки максимальны, сигналы ложные",
                example: "ADX = 22, EMA сближаются, объём снизился → сидим в сайдлайне, ждём прорыва",
              },
            ].map((item, i) => (
              <div key={i} className={`border ${item.border} rounded-xl p-4 space-y-2`}>
                <div className={`font-orbitron text-sm font-bold ${item.color}`}>{item.regime}</div>
                <div className="flex flex-wrap gap-1">
                  {item.tools.map((t, j) => (
                    <span key={j} className="bg-zinc-800 text-zinc-300 text-xs font-space-mono px-2 py-0.5 rounded-md">{t}</span>
                  ))}
                </div>
                <div className="flex gap-2 items-start">
                  <span className="text-red-400 text-xs shrink-0">✗</span>
                  <span className="text-zinc-400 text-xs font-space-mono">{item.avoid}</span>
                </div>
                <div className="bg-zinc-900 rounded-lg p-3">
                  <span className="text-zinc-500 text-xs font-space-mono">Пример: </span>
                  <span className="text-zinc-300 text-xs font-space-mono">{item.example}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4">
            <div className="text-purple-400 font-orbitron text-xs font-bold mb-2">Из жизни: как думает Рэй Далио</div>
            <p className="text-zinc-300 text-xs font-space-mono leading-relaxed">
              Bridgewater Associates — крупнейший хедж-фонд мира. Их подход «All Weather» строится на одной идее:
              рынок проходит через разные режимы, и одна стратегия не работает всегда. Они держат разные инструменты
              под каждый режим. Для трейдера BTC логика та же: не одна стратегия навсегда, а адаптация под то,
              что происходит прямо сейчас.
            </p>
          </div>
        </div>
      ),
    },
  ],
}
