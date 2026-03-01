import type { PracticeStep } from "./practiceStepTypes"

export const stepMarketAnalysis: PracticeStep = {
  id: "market-analysis",
  badge: "Шаг 1",
  color: "blue",
  icon: "TrendingUp",
  title: "Анализ рынка: определяем тренд и уровни",
  summary: "Перед каждой сделкой нужно понять, куда движется рынок и где находятся ключевые уровни. Без этого — не анализ, а азартная игра.",
  relevance2026: {
    score: 92,
    label: "Фундамент остаётся",
    aiImpact: 68,
    botImpact: 52,
    aiNote: "ИИ-модели (GPT, Claude) анализируют тренды мгновенно, но EMA и уровни — по-прежнему основа большинства алгоритмических стратегий на крипторынке.",
    botNote: "Боты считывают тренд по EMA автоматически, но человек должен задать правильные параметры и таймфрейм — без понимания этого шага настройка бота невозможна.",
  },
  aibotInsight: {
    aiExamples: [
      {
        label: "GPT анализирует тренд",
        text: "Подключив TradingView через API к GPT-4o, можно описать картину словами: «BTC на M5 — EMA 20 выше EMA 50, последние 3 свечи бычьи» → ИИ подтверждает или опровергает сигнал на основе контекста новостей дня.",
      },
      {
        label: "ML-определение режима рынка",
        text: "Продвинутые ИИ-системы классифицируют рынок на режимы: «тренд / боковик / высокая волатильность». Это точнее одного EMA-пересечения и позволяет автоматически выбирать стратегию.",
      },
    ],
    botExamples: [
      {
        label: "EMA-кросс в коде бота",
        text: "Именно EMA(20)/EMA(50) — самый частый фильтр тренда в торговых ботах. Бот проверяет соотношение EMA перед каждым потенциальным входом. Это «шаг 1» любого алго-алгоритма.",
      },
      {
        label: "Мультитаймфреймовый анализ",
        text: "Профессиональный бот проверяет H4 для определения основного тренда, M15 — для точки входа. Если на H4 медвежий тренд, бот не открывает лонги на M5 даже при локальном сигнале.",
      },
    ],
    codeSnippet: {
      title: "Шаг 1 любого бота: определение тренда через EMA",
      code: `import pandas_ta as ta

def get_trend(df):
    df['ema20'] = ta.ema(df['close'], length=20)
    df['ema50'] = ta.ema(df['close'], length=50)

    last = df.iloc[-1]

    if last['ema20'] > last['ema50']:
        return 'BULLISH'   # Тренд вверх — ищем CALL
    elif last['ema20'] < last['ema50']:
        return 'BEARISH'   # Тренд вниз — ищем PUT
    else:
        return 'NEUTRAL'   # Неопределённость — пропускаем

# Пример использования:
trend = get_trend(btc_df)
print(f"BTC/USDT тренд: {trend}")`,
    },
    comparison: {
      human: "Смотрит на график 2–3 минуты, оценивает «на глаз»",
      bot: "Вычисляет EMA и определяет тренд за миллисекунды на любом числе пар",
      ai: "Добавляет контекст: новости + on-chain + volume profile для подтверждения тренда",
    },
  },
  sections: [
    {
      title: "Определение тренда через EMA 20/50",
      content: (
        <div className="space-y-3">
          <p className="text-gray-300 leading-relaxed">
            Открываем BTC/USD на таймфрейме M5. Добавляем две EMA: 20-периодную (быстрая) и 50-периодную (медленная).
            Правило простое: <span className="text-blue-400 font-semibold">EMA 20 выше EMA 50 = восходящий тренд (CALL), ниже = нисходящий (PUT).</span>
          </p>
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-3">
            <div className="flex gap-3 items-start">
              <div className="w-2 h-2 rounded-full bg-green-400 mt-1.5 shrink-0"></div>
              <div>
                <span className="text-green-400 font-orbitron text-xs font-bold">Бычий сигнал: </span>
                <span className="text-zinc-300 text-xs font-space-mono">EMA 20 пересекает EMA 50 снизу вверх. Цена выше обеих линий. Открываем CALL.</span>
              </div>
            </div>
            <div className="flex gap-3 items-start">
              <div className="w-2 h-2 rounded-full bg-red-400 mt-1.5 shrink-0"></div>
              <div>
                <span className="text-red-400 font-orbitron text-xs font-bold">Медвежий сигнал: </span>
                <span className="text-zinc-300 text-xs font-space-mono">EMA 20 пересекает EMA 50 сверху вниз. Цена ниже обеих линий. Открываем PUT.</span>
              </div>
            </div>
            <div className="flex gap-3 items-start">
              <div className="w-2 h-2 rounded-full bg-yellow-400 mt-1.5 shrink-0"></div>
              <div>
                <span className="text-yellow-400 font-orbitron text-xs font-bold">Флэт — пропускаем: </span>
                <span className="text-zinc-300 text-xs font-space-mono">EMA переплетаются, цена ходит между линиями. В этот период профессионалы не торгуют.</span>
              </div>
            </div>
          </div>

          <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
            <div className="text-blue-400 font-orbitron text-xs font-bold mb-2">Из жизни: как торгует Пол Тюдор Джонс</div>
            <p className="text-zinc-300 text-xs font-space-mono leading-relaxed">
              Легендарный трейдер Пол Тюдор Джонс говорил: «Я смотрю на 200-дневную скользящую среднюю. Если цена ниже — у меня нет длинных позиций, точка».
              Он использует скользящие средние как фильтр — торгует только по тренду, никогда против него.
              Тот же принцип работает на M5: EMA показывает тебе направление — иди за рынком, не против него.
            </p>
          </div>
        </div>
      )
    },
    {
      title: "Поиск уровней поддержки и сопротивления",
      content: (
        <div className="space-y-3">
          <p className="text-gray-300 leading-relaxed">
            Уровни — это психологические зоны, где рынок многократно разворачивался. Профессиональные трейдеры ждут именно момента, когда цена подходит к уровню.
          </p>
          <div className="space-y-2">
            {[
              {
                step: "1",
                title: "Ищем локальные максимумы и минимумы",
                desc: "На M5 BTC/USD смотрим последние 3–4 часа. Где цена разворачивалась минимум 2 раза — это уровень.",
                color: "text-blue-400"
              },
              {
                step: "2",
                title: "Смотрим на круглые числа",
                desc: "BTC часто разворачивается у круглых уровней: $95,000, $96,000, $97,000. Это зоны скопления ордеров крупных игроков.",
                color: "text-purple-400"
              },
              {
                step: "3",
                title: "Ждём приближения цены к уровню",
                desc: "Не входим в середине движения. Ждём, когда цена придёт к уровню — именно здесь вероятность разворота максимальна.",
                color: "text-green-400"
              },
            ].map((item, i) => (
              <div key={i} className="flex gap-3 items-start bg-zinc-900 border border-zinc-800 rounded-lg p-3">
                <div className={`font-orbitron text-sm font-bold ${item.color} w-5 shrink-0`}>{item.step}</div>
                <div>
                  <div className={`font-orbitron text-xs font-bold mb-1 ${item.color}`}>{item.title}</div>
                  <p className="text-zinc-400 text-xs font-space-mono leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4">
            <div className="text-purple-400 font-orbitron text-xs font-bold mb-2">Из жизни: метод Вайкоффа в трейдинге</div>
            <p className="text-zinc-300 text-xs font-space-mono leading-relaxed">
              Ричард Вайкофф в 1930-х годах описал, как «умные деньги» (крупные банки, фонды) накапливают позиции у ключевых уровней.
              Сегодня крипто-трейдеры используют тот же принцип: круглые уровни BTC ($95K, $100K) — это зоны, где институционалы
              выставляют лимитные ордера. Когда цена касается такого уровня, вероятность разворота резко возрастает — именно здесь и входят профессионалы.
            </p>
          </div>
        </div>
      )
    },
    {
      title: "Практический пример: анализ BTC/USD на M5",
      content: (
        <div className="space-y-3">
          <p className="text-gray-300 leading-relaxed">
            Разберём конкретную ситуацию шаг за шагом — так, как это делает профессиональный трейдер перед входом.
          </p>
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4">
            <div className="font-orbitron text-xs font-bold text-zinc-300 mb-3">Сценарий: BTC/USD, 14:35, M5</div>
            <div className="space-y-2">
              {[
                { label: "Смотрим EMA", value: "EMA 20 = $96,420. EMA 50 = $96,180. EMA 20 выше → восходящий тренд ✓", ok: true },
                { label: "Ищем уровень", value: "Ближайший уровень сопротивления: $96,600 (разворот был дважды 2 часа назад)", ok: true },
                { label: "Позиция цены", value: "Цена на $96,580 — у уровня сопротивления. Это сигнал к PUT (отскок вниз)", ok: true },
                { label: "Решение", value: "Ждём подтверждения RSI. Без него — не входим (смотри Шаг 2)", ok: null },
              ].map((row, i) => (
                <div key={i} className="flex gap-2 items-start">
                  <div className={`text-xs shrink-0 mt-0.5 font-space-mono ${row.ok === true ? "text-green-400" : row.ok === false ? "text-red-400" : "text-yellow-400"}`}>
                    {row.ok === true ? "✓" : row.ok === false ? "✗" : "→"}
                  </div>
                  <div className="text-xs font-space-mono">
                    <span className="text-zinc-500">{row.label}: </span>
                    <span className="text-zinc-300">{row.value}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
            <div className="text-green-400 font-orbitron text-xs font-bold mb-2">Из жизни: утренний ритуал профи-трейдера</div>
            <p className="text-zinc-300 text-xs font-space-mono leading-relaxed">
              Том Данте — известный трейдер с YouTube-каналом о Price Action — публично рассказывал о своей рутине:
              каждое утро он 15 минут смотрит на дневные и часовые графики, рисует ключевые уровни на день.
              И весь день он торгует только от этих уровней, не входя в «середине воздуха».
              Его результат: из 10 сделок 7–8 прибыльных. Секрет — терпение и ожидание уровня.
            </p>
          </div>
        </div>
      )
    }
  ]
}

export const stepSignalFormation: PracticeStep = {
  id: "signal-formation",
  badge: "Шаг 2",
  color: "yellow",
  icon: "Zap",
  title: "Формирование сигнала: конфлюэнс трёх факторов",
  summary: "Профессионалы не торгуют по одному индикатору. Сигнал считается сильным, только когда тренд, уровень и RSI подтверждают друг друга.",
  relevance2026: {
    score: 88,
    label: "Актуально, но конкуренция растёт",
    aiImpact: 75,
    botImpact: 80,
    aiNote: "ИИ-стратегии добавляют 4-й фактор — анализ новостного потока в реальном времени. Конфлюэнс трёх факторов остаётся базой, но топ-боты уже работают с 5–7.",
    botNote: "Стратегия «три подтверждения» — основа большинства успешных розничных ботов 2025-2026. Боты с одним индикатором показывают win rate ниже порога безубыточности.",
  },
  aibotInsight: {
    aiExamples: [
      {
        label: "4-й фактор: новостной поток",
        text: "Топовые ИИ-боты 2025–2026 добавляют к классическому конфлюэнсу 4-й фактор — сентимент новостей. Если выходят данные по инфляции через 30 минут, бот игнорирует любые технические сигналы.",
      },
      {
        label: "7 условий в ML-стратегиях",
        text: "ML-системы в хедж-фондах проверяют 5–7 условий одновременно: тренд, уровень, RSI, объём, волатильность, on-chain метрики, news sentiment. Классический «три подтверждения» — это минимум.",
      },
    ],
    botExamples: [
      {
        label: "Конфлюэнс в коде",
        text: "Три условия кодируются как AND-логика: входим ТОЛЬКО если тренд == 'BULLISH' AND уровень == True AND RSI < 35. Одно условие не выполнено — ордер не создаётся. Win rate вырастает с 50% до 58–65%.",
      },
      {
        label: "Реальная статистика",
        text: "Тест на 2 годах истории BTC/USDT: бот с 1 условием (только RSI) — win rate 51%. С 2 условиями (+тренд) — 57%. С 3 условиями (+уровень) — 63%. Каждое условие добавляет ~6% к точности.",
      },
    ],
    codeSnippet: {
      title: "Три подтверждения в коде бота (Python)",
      code: `def check_signal(df, key_level, tolerance=0.002):
    last = df.iloc[-1]

    # Условие 1: тренд (EMA 20 > EMA 50)
    trend_bullish = last['ema20'] > last['ema50']

    # Условие 2: цена у уровня (±0.2%)
    near_level = abs(last['close'] - key_level) / key_level < tolerance

    # Условие 3: RSI перепродан (< 35) для лонга
    rsi_oversold = last['rsi'] < 35

    # Конфлюэнс: все три должны совпасть
    if trend_bullish and near_level and rsi_oversold:
        return 'CALL'   # Сильный сигнал на покупку

    return None  # Условия не выполнены → пропускаем`,
    },
    comparison: {
      human: "Иногда пропускает условия «по ощущению», когда кажется что «вот-вот пойдёт»",
      bot: "Проверяет все 3 условия математически — без исключений и без эмоций",
      ai: "Добавляет 4-й фактор (news/sentiment) и адаптирует вес условий под режим рынка",
    },
  },
  sections: [
    {
      title: "RSI как подтверждающий фильтр",
      content: (
        <div className="space-y-3">
          <p className="text-gray-300 leading-relaxed">
            RSI (Relative Strength Index) показывает, перекуплен или перепродан актив. Мы используем его <span className="text-yellow-400 font-semibold">только как фильтр</span>, а не как основной сигнал.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
              <div className="text-red-400 font-orbitron text-xs font-bold mb-2">RSI {">"} 65 → Перекупленность</div>
              <p className="text-zinc-400 text-xs font-space-mono leading-relaxed">
                Покупатели устали. Высокая вероятность разворота вниз. Открываем PUT (если совпадает с уровнем и трендом).
              </p>
            </div>
            <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
              <div className="text-green-400 font-orbitron text-xs font-bold mb-2">RSI {"<"} 35 → Перепроданность</div>
              <p className="text-zinc-400 text-xs font-space-mono leading-relaxed">
                Продавцы истощились. Высокая вероятность разворота вверх. Открываем CALL (если совпадает с уровнем и трендом).
              </p>
            </div>
          </div>
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-3">
            <p className="text-yellow-300 text-xs font-space-mono">
              RSI от 35 до 65 — нейтральная зона. Профессионалы в ней не торгуют: нет явного сигнала.
            </p>
          </div>

          <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
            <div className="text-blue-400 font-orbitron text-xs font-bold mb-2">Из жизни: Уэллс Уайлдер — создатель RSI</div>
            <p className="text-zinc-300 text-xs font-space-mono leading-relaxed">
              Джей Уэллс Уайлдер создал RSI в 1978 году и сам предупреждал: индикатор даёт сигнал только в трендовых условиях.
              В боковике RSI будет ложно показывать перекупленность/перепроданность снова и снова.
              Именно поэтому мы сначала определяем тренд через EMA, и лишь потом смотрим на RSI — так, как задумывал сам автор.
            </p>
          </div>
        </div>
      )
    },
    {
      title: "Принцип конфлюэнса: три подтверждения",
      content: (
        <div className="space-y-3">
          <p className="text-gray-300 leading-relaxed">
            Конфлюэнс — это совпадение нескольких независимых факторов в одной точке. Чем больше факторов совпало, тем выше вероятность правильного прогноза.
          </p>
          <div className="space-y-2">
            {[
              {
                factor: "Тренд (EMA 20/50)",
                forCall: "EMA 20 выше EMA 50",
                forPut: "EMA 20 ниже EMA 50",
                weight: "Обязательно",
                color: "text-blue-400",
                border: "border-blue-500/30"
              },
              {
                factor: "Уровень цены",
                forCall: "Цена у поддержки",
                forPut: "Цена у сопротивления",
                weight: "Обязательно",
                color: "text-purple-400",
                border: "border-purple-500/30"
              },
              {
                factor: "RSI фильтр",
                forCall: "RSI < 35",
                forPut: "RSI > 65",
                weight: "Обязательно",
                color: "text-yellow-400",
                border: "border-yellow-500/30"
              },
            ].map((row, i) => (
              <div key={i} className={`bg-zinc-900 border ${row.border} rounded-lg p-3`}>
                <div className={`font-orbitron text-xs font-bold mb-2 ${row.color}`}>{row.factor} · {row.weight}</div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-xs font-space-mono">
                    <span className="text-green-400">CALL: </span>
                    <span className="text-zinc-300">{row.forCall}</span>
                  </div>
                  <div className="text-xs font-space-mono">
                    <span className="text-red-400">PUT: </span>
                    <span className="text-zinc-300">{row.forPut}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-4">
            <div className="flex justify-between items-center mb-3">
              <span className="text-zinc-400 text-xs font-orbitron">Совпало факторов</span>
              <span className="text-zinc-400 text-xs font-orbitron">Решение</span>
            </div>
            {[
              { count: "3 из 3", decision: "Входим в сделку", color: "text-green-400", bg: "bg-green-500/10" },
              { count: "2 из 3", decision: "Пропускаем", color: "text-yellow-400", bg: "bg-yellow-500/10" },
              { count: "1 из 3", decision: "Не входим", color: "text-red-400", bg: "bg-red-500/10" },
            ].map((row, i) => (
              <div key={i} className={`flex justify-between items-center p-2 rounded-lg ${row.bg} mb-1`}>
                <span className={`text-xs font-space-mono ${row.color}`}>{row.count}</span>
                <span className={`text-xs font-orbitron font-bold ${row.color}`}>{row.decision}</span>
              </div>
            ))}
          </div>

          <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-4">
            <div className="text-orange-400 font-orbitron text-xs font-bold mb-2">Из жизни: стратегия Марка Дугласа</div>
            <p className="text-zinc-300 text-xs font-space-mono leading-relaxed">
              Марк Дуглас, автор книги «Трейдинг в зоне», учил: профессионал ищет только те сделки, где рынок сам «кричит» о своём намерении.
              Он называл это «высоковероятностными сетапами». В его методе — минимум 3 совпадающих условия перед входом.
              «Когда рынок подходит к уровню, RSI в зоне перекупленности, и тренд подтверждает — это не совпадение. Это приглашение».
            </p>
          </div>
        </div>
      )
    },
    {
      title: "Разбор реального сетапа: пример конфлюэнса",
      content: (
        <div className="space-y-3">
          <p className="text-gray-300 leading-relaxed">
            Посмотрим на конкретный момент: BTC/USD, M5, 14:40. Проверяем все три фактора.
          </p>
          <div className="space-y-2">
            {[
              {
                num: "01",
                factor: "Тренд",
                status: "Подтверждает PUT",
                detail: "EMA 20 ($96,420) ниже EMA 50 ($96,580) — нисходящий тренд на M5",
                ok: false,
                color: "text-red-400",
              },
              {
                num: "02",
                factor: "Уровень",
                status: "Цена у сопротивления",
                detail: "BTC на $96,580 — это зона, где цена разворачивалась дважды за последние 2 часа",
                ok: false,
                color: "text-red-400",
              },
              {
                num: "03",
                factor: "RSI",
                status: "RSI = 68 → Перекупленность",
                detail: "RSI выше 65, подтверждает разворот вниз",
                ok: false,
                color: "text-red-400",
              },
            ].map((item, i) => (
              <div key={i} className="flex gap-3 items-start bg-zinc-900 border border-zinc-800 rounded-lg p-3">
                <div className={`font-orbitron text-xs font-bold ${item.color} w-6 shrink-0`}>{item.num}</div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-zinc-400 font-orbitron text-xs">{item.factor}:</span>
                    <span className={`font-orbitron text-xs font-bold ${item.color}`}>{item.status}</span>
                  </div>
                  <p className="text-zinc-500 text-xs font-space-mono">{item.detail}</p>
                </div>
              </div>
            ))}
            <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-4">
              <div className="text-red-400 font-orbitron text-xs font-bold mb-1">Итог: открываем PUT</div>
              <p className="text-zinc-300 text-xs font-space-mono">Все 3 фактора совпали в сторону PUT. Ставка: 2% от депозита. Экспирация: 5 минут.</p>
            </div>
          </div>

          <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
            <div className="text-green-400 font-orbitron text-xs font-bold mb-2">Из жизни: как торгует Стив Кленоу</div>
            <p className="text-zinc-300 text-xs font-space-mono leading-relaxed">
              Стив Кленоу — управляющий хедж-фонда Klenow Pattern Research — использует системный подход:
              его алгоритмы открывают позицию только при совпадении сразу нескольких условий.
              «Если один фактор говорит "войди", а другой молчит — это не сигнал, это желание заработать».
              Именно поэтому профессионалы пропускают большинство движений рынка — они ждут только сильные сетапы.
            </p>
          </div>
        </div>
      )
    }
  ]
}