import React from "react"
import type { Chapter } from "@/components/bots-guide/BotsChapterTypes"

/**
 * 🤖 РРТБ — Развитие Рынка Торговых Ботов.
 * 5 глав в формате аккордеона (тот же тип Chapter что и в /bots-guide).
 * Фокус: крипта и розница (Pocket Option, Bybit, розничные боты).
 */

const Era = ({ year, children }: { year: string; children: React.ReactNode }) => (
  <span className="inline-block bg-red-500/20 text-red-300 font-orbitron text-[11px] font-bold px-2 py-0.5 rounded mr-2">
    {year}
  </span>
)

export const rrtbChapters: Chapter[] = [
  // ─────────────────────────────────────────────────────────────
  {
    id: "rrtb-origins",
    badge: "Глава 1",
    title: "Истоки: первый торговый бот",
    summary:
      "До крипты и Pocket Option автоматизацию придумали на классических биржах. Понять, откуда всё пошло — значит понять, почему сегодняшние боты устроены именно так.",
    relevance2026: {
      score: 60,
      label: "Исторический фундамент",
      aiImpact: 30,
      botImpact: 80,
      aiNote: "ИИ здесь ещё не было — первые боты работали по жёстким правилам «если цена X → сделай Y».",
      botNote: "Базовая идея «робот исполняет сделки за человека» с тех пор не изменилась — поменялись только скорость и сложность логики.",
    },
    sections: [
      {
        title: "Кто и когда запустил первую автоматическую торговлю",
        content: (
          <div className="space-y-3">
            <p className="text-gray-300 leading-relaxed">
              <Era year="1949" />Ричард Дончиан создаёт первый управляемый по правилам фонд: сделки совершаются
              не по интуиции, а по чёткому набору условий (пробой ценового канала). Компьютеров ещё нет —
              «алгоритм» исполняется людьми вручную, но сама идея механической торговли рождается именно здесь.
            </p>
            <p className="text-gray-300 leading-relaxed">
              <Era year="1980-е" />С приходом электронных бирж появляется program trading — программы, которые
              автоматически выставляют крупные блоки заявок. Именно их потом обвинят в «Чёрном понедельнике» 1987 года,
              когда автоматические продажи усилили обвал.
            </p>
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
              <div className="text-red-400 font-orbitron text-xs font-bold mb-2">Почему это важно для тебя сегодня</div>
              <p className="text-zinc-400 text-xs font-space-mono leading-relaxed">
                Твой Bybit- или Pocket Option-бот — прямой потомок этих систем. Принцип «робот видит сигнал → открывает
                сделку без эмоций» родился ещё до того, как появились персональные компьютеры. Меняется обёртка —
                суть та же.
              </p>
            </div>
          </div>
        ),
      },
      {
        title: "От залов биржи к серверам",
        content: (
          <div className="space-y-3">
            <p className="text-gray-300 leading-relaxed">
              <Era year="1998" />Комиссия по ценным бумагам США (SEC) разрешает электронные торговые площадки.
              Это поворотный момент: торговля перестаёт быть привязана к физическому залу — теперь сделку может
              отправить любая программа с доступом к бирже.
            </p>
            <p className="text-gray-300 leading-relaxed">
              <Era year="2000-е" />Расцвет высокочастотной торговли (HFT). Боты соревнуются в миллисекундах,
              крупные фонды ставят серверы прямо рядом с биржей, чтобы выиграть доли секунды. Розничному
              трейдеру сюда хода нет — но технологии постепенно дешевеют.
            </p>
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-3">
              <div className="text-blue-400 font-orbitron text-xs font-bold mb-2">Вывод эпохи</div>
              <p className="text-zinc-400 text-xs font-space-mono leading-relaxed">
                До 2010-х автоматическая торговля была доступна только институтам. Чтобы боты пришли к обычным
                людям, нужны были две вещи: дешёвые API и платформы-посредники. Об этом — следующая глава.
              </p>
            </div>
          </div>
        ),
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  {
    id: "rrtb-commercial",
    badge: "Глава 2",
    title: "Коммерческий этап: боты как продукт",
    summary:
      "Момент, когда торговых ботов начали продавать массам. MetaTrader, советники, сигнальные сервисы и первые маркетплейсы стратегий — именно тут автоматизация стала бизнесом.",
    relevance2026: {
      score: 85,
      label: "Рождение индустрии",
      aiImpact: 40,
      botImpact: 95,
      aiNote: "Большинство «коммерческих» ботов того времени — без ИИ, чистые правила и индикаторы.",
      botNote: "Модель «продай бота / продай сигнал» жива до сих пор и приносит миллиарды — со всеми её плюсами и мошенничеством.",
    },
    sections: [
      {
        title: "MetaTrader и эпоха советников (Forex)",
        content: (
          <div className="space-y-3">
            <p className="text-gray-300 leading-relaxed">
              <Era year="2005" />Выходит MetaTrader 4 — платформа, которая на годы определит розничный Forex.
              Её ключевая фишка — язык MQL, на котором каждый может написать «эксперта» (Expert Advisor, EA) —
              торгового робота. Впервые автоматизация попадает в руки обычного трейдера.
            </p>
            <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
              <div className="text-green-400 font-orbitron text-xs font-bold mb-2">Что это дало рынку</div>
              <p className="text-zinc-400 text-xs font-space-mono leading-relaxed">
                Появился целый рынок: одни писали советников, другие их покупали. Форумы вроде MQL5 Market
                наполнились тысячами роботов — от честных до откровенно «нарисованных» под красивый бэктест.
                Тут же родилась и главная проблема индустрии — продажа ботов с фальшивой доходностью.
              </p>
            </div>
          </div>
        ),
      },
      {
        title: "Сигнальные сервисы и подписки",
        content: (
          <div className="space-y-3">
            <p className="text-gray-300 leading-relaxed">
              Параллельно с продажей самих ботов выросла модель сигналов: ты платишь подписку, а сервис
              присылает готовые точки входа/выхода — вручную или через автокопирование прямо в терминал.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-3">
                <div className="text-emerald-400 font-orbitron text-xs font-bold mb-2">✅ Плюсы модели</div>
                <ul className="text-zinc-400 text-xs font-space-mono space-y-1">
                  <li>→ Не нужно уметь программировать</li>
                  <li>→ Порог входа — минимальный</li>
                  <li>→ Автоисполнение сделок</li>
                </ul>
              </div>
              <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-3">
                <div className="text-red-400 font-orbitron text-xs font-bold mb-2">⚠️ Минусы и риски</div>
                <ul className="text-zinc-400 text-xs font-space-mono space-y-1">
                  <li>→ Прошлая доходность ≠ будущая</li>
                  <li>→ Много скама и «гуру»</li>
                  <li>→ Ты не контролируешь логику</li>
                </ul>
              </div>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-3">
              <div className="text-yellow-400 font-orbitron text-xs font-bold mb-2">Главный урок этапа</div>
              <p className="text-zinc-400 text-xs font-space-mono leading-relaxed">
                Коммерциализация дала доступность, но и научила рынок главному правилу: красивый бэктест в
                рекламе ничего не стоит, пока ты сам не проверил стратегию на демо/тестнете. Поэтому в
                TradeBase встроены бэктест и тестовая сеть — чтобы ты не верил на слово, а проверял.
              </p>
            </div>
          </div>
        ),
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  {
    id: "rrtb-crypto",
    badge: "Глава 3",
    title: "Криптобум и розничные боты",
    summary:
      "Криптобиржи раздали открытые API всем подряд — и автоматизация наконец стала по-настоящему массовой. Грид, DCA, 3Commas, Cryptohopper, Pionex — эра, в которой мы живём.",
    relevance2026: {
      score: 95,
      label: "Текущая массовая эпоха",
      aiImpact: 55,
      botImpact: 100,
      aiNote: "ИИ-помощники подбирают параметры грида/DCA, но ядро этих ботов — простые понятные правила.",
      botNote: "Грид и DCA остаются самыми популярными розничными ботами 2025-2026 именно из-за простоты и прозрачности.",
    },
    sections: [
      {
        title: "Открытые API — революция доступа",
        content: (
          <div className="space-y-3">
            <p className="text-gray-300 leading-relaxed">
              <Era year="2017" />Криптобиржи (Binance, позже Bybit, OKX) раздают бесплатные REST и WebSocket API
              буквально каждому. Чтобы подключить бота, больше не нужен дорогой брокерский доступ — достаточно
              сгенерировать API-ключ за пару минут. Именно это ты делаешь в нашем конструкторе Bybit.
            </p>
            <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
              <div className="text-green-400 font-orbitron text-xs font-bold mb-2">Почему крипта взорвала рынок ботов</div>
              <p className="text-zinc-400 text-xs font-space-mono leading-relaxed">
                Рынок 24/7, высокая волатильность, бесплатные API и отсутствие посредников. Человеку физически
                невозможно торговать круглосуточно — а боту всё равно. Поэтому именно в крипте автоматизация
                стала нормой, а не экзотикой.
              </p>
            </div>
          </div>
        ),
      },
      {
        title: "Платформы-конструкторы для всех",
        content: (
          <div className="space-y-3">
            <p className="text-gray-300 leading-relaxed">
              <Era year="2017-2020" />Появляются 3Commas, Cryptohopper, Pionex — сервисы, где бота можно
              собрать мышкой, без единой строки кода. Они популяризировали два самых понятных типа:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-3">
                <div className="text-blue-400 font-orbitron text-xs font-bold mb-2">📊 Grid-бот (сетка)</div>
                <p className="text-zinc-400 text-xs font-space-mono leading-relaxed">
                  Ставит лесенку ордеров на покупку ниже цены и продажу выше. Зарабатывает на колебаниях в
                  боковике. Прост и нагляден — потому и популярен.
                </p>
              </div>
              <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-3">
                <div className="text-purple-400 font-orbitron text-xs font-bold mb-2">📉 DCA-бот (усреднение)</div>
                <p className="text-zinc-400 text-xs font-space-mono leading-relaxed">
                  Докупает актив по мере падения, снижая среднюю цену входа. Любимый инструмент тех, кто верит
                  в долгий рост монеты.
                </p>
              </div>
            </div>
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
              <div className="text-red-400 font-orbitron text-xs font-bold mb-2">Обратная сторона доступности</div>
              <p className="text-zinc-400 text-xs font-space-mono leading-relaxed">
                Лёгкость запуска создала иллюзию «бесплатных денег». Тысячи новичков запускали гриды без стоп-лосса —
                и в обвалах 2022 года (Luna, FTX) теряли депозиты, потому что бот тупо «покупал дно» до нуля.
                Доступность без понимания риска — опасна. Поэтому мы и делаем образовательный раздел.
              </p>
            </div>
          </div>
        ),
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  {
    id: "rrtb-binary",
    badge: "Глава 4",
    title: "Бинарные опционы и копитрейдинг",
    summary:
      "Параллельная ветка розницы: предельно простой интерфейс «вверх/вниз», социальная торговля и автокопирование. Сюда пришли миллионы новичков — и тут же столкнулись с главными рисками.",
    relevance2026: {
      score: 80,
      label: "Массовая розница",
      aiImpact: 45,
      botImpact: 90,
      aiNote: "ИИ в бинарных опционах чаще маркетинговая обёртка, чем реальное преимущество — будь осторожен с обещаниями.",
      botNote: "Боты для бинарных опционов реальны и работают, но рынок OTC и короткие экспирации требуют строгого риск-менеджмента.",
    },
    sections: [
      {
        title: "Почему бинарные опционы стали входной точкой",
        content: (
          <div className="space-y-3">
            <p className="text-gray-300 leading-relaxed">
              <Era year="2010-е" />Платформы вроде Pocket Option упростили торговлю до предела: выбираешь актив,
              сумму, время — и жмёшь «вверх» или «вниз». Никаких стоп-лоссов, плеч и стаканов. Для новичка это
              самый низкий порог входа из всех возможных.
            </p>
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
              <div className="text-red-400 font-orbitron text-xs font-bold mb-2">Простота — это и плюс, и ловушка</div>
              <p className="text-zinc-400 text-xs font-space-mono leading-relaxed">
                Фиксированный риск на сделку — удобно. Но фиксированная выплата (часто меньше 100%) означает,
                что даже при 50% угадываний ты в минусе. Поэтому бот для бинарных опционов имеет смысл только
                со стратегией, дающей win-rate стабильно выше точки безубытка. Это мы и считаем в нашем
                конструкторе и бэктесте.
              </p>
            </div>
          </div>
        ),
      },
      {
        title: "Копитрейдинг: повторяй за профи",
        content: (
          <div className="space-y-3">
            <p className="text-gray-300 leading-relaxed">
              <Era year="2010" />eToro популяризирует социальную торговлю: вместо написания бота ты просто
              «подписываешься» на трейдера, и его сделки автоматически копируются на твой счёт. По сути — это
              бот, чья «стратегия» — другой человек.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-3">
                <div className="text-emerald-400 font-orbitron text-xs font-bold mb-2">✅ Чем хорош копитрейдинг</div>
                <ul className="text-zinc-400 text-xs font-space-mono space-y-1">
                  <li>→ Не нужны знания и код</li>
                  <li>→ Видно историю трейдера</li>
                  <li>→ Можно отписаться в любой момент</li>
                </ul>
              </div>
              <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-3">
                <div className="text-red-400 font-orbitron text-xs font-bold mb-2">⚠️ О чём забывают</div>
                <ul className="text-zinc-400 text-xs font-space-mono space-y-1">
                  <li>→ «Звезда» может слить депозит</li>
                  <li>→ Запоздалое копирование = хуже цена</li>
                  <li>→ Чужой риск ≠ твой комфорт</li>
                </ul>
              </div>
            </div>
          </div>
        ),
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  {
    id: "rrtb-ai-now",
    badge: "Глава 5",
    title: "AI, нейросети и что мы имеем сейчас",
    summary:
      "Где рынок торговых ботов находится в 2024-2026. ML-стратегии, GPT-помощники, no-code конструкторы — и почему понятная логика всё ещё побеждает «чёрный ящик».",
    relevance2026: {
      score: 99,
      label: "Сегодняшний день",
      aiImpact: 90,
      botImpact: 100,
      aiNote: "ИИ реально помогает: подбирает параметры, анализирует отчёты, объясняет стратегии простым языком.",
      botNote: "Несмотря на хайп вокруг ИИ, большинство стабильно прибыльных розничных ботов 2026 — это понятные правила + дисциплина, а не магия нейросети.",
    },
    aibotInsight: {
      aiExamples: [
        {
          label: "GPT-ассистенты в конструкторах",
          text: "Современные платформы (включая TradeBase) используют ИИ, чтобы объяснить стратегию простым языком, проанализировать отчёт бота и предложить улучшения параметров. ИИ — это помощник-аналитик, а не «кнопка денег».",
        },
        {
          label: "ML-предсказание движения",
          text: "Фонды применяют машинное обучение для прогноза цен на коротких горизонтах. Но для розницы такие модели часто переобучаются на истории и проваливаются на живом рынке — поэтому к ним относятся осторожно.",
        },
      ],
      botExamples: [
        {
          label: "No-code = норма",
          text: "В 2024-2026 собрать бота без кода — стандарт. Конструкторы генерируют готовый Python/скрипт, который ты просто запускаешь. Порог входа упал почти до нуля — как раз то, что делает TradeBase.",
        },
        {
          label: "Прозрачность побеждает",
          text: "После громких провалов «ИИ-ботов с гарантией 300%» рынок поумнел: ценится бот, чью логику можно прочитать и проверить на бэктесте. Понятный RSI+EMA с дисциплиной обгоняет непрозрачный «нейро-ящик».",
        },
      ],
    },
    sections: [
      {
        title: "Что реально изменилось с приходом ИИ",
        content: (
          <div className="space-y-3">
            <p className="text-gray-300 leading-relaxed">
              <Era year="2023-2026" />Большие языковые модели и доступный ML изменили не столько сами стратегии,
              сколько процесс работы с ботом. ИИ берёт на себя рутину: объясняет, что делает стратегия, читает
              логи, подсказывает, где параметры слишком рискованные.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-3">
                <div className="text-blue-400 font-orbitron text-xs font-bold mb-2">Подбор параметров</div>
                <p className="text-zinc-400 text-xs font-space-mono leading-relaxed">
                  ИИ прогоняет варианты TP/SL и индикаторов, подсказывает лучшую связку — как наш автоподбор в бэктесте.
                </p>
              </div>
              <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-3">
                <div className="text-purple-400 font-orbitron text-xs font-bold mb-2">Анализ отчётов</div>
                <p className="text-zinc-400 text-xs font-space-mono leading-relaxed">
                  Загружаешь журнал сделок — ИИ находит слабые места: где просадка, в какие часы убыток.
                </p>
              </div>
              <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-3">
                <div className="text-emerald-400 font-orbitron text-xs font-bold mb-2">Объяснение логики</div>
                <p className="text-zinc-400 text-xs font-space-mono leading-relaxed">
                  Любую стратегию ИИ переведёт с «трейдерского» на человеческий — без терминов и тумана.
                </p>
              </div>
            </div>
          </div>
        ),
      },
      {
        title: "Что имеем сейчас и куда всё движется",
        content: (
          <div className="space-y-3">
            <p className="text-gray-300 leading-relaxed">
              Итог развития: торговый бот из инструмента элитных фондов превратился в продукт, который любой
              может собрать за вечер. Открытые API, no-code конструкторы, бэктест в браузере и ИИ-помощник —
              всё это сошлось воедино именно сейчас.
            </p>
            <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
              <div className="text-green-400 font-orbitron text-xs font-bold mb-2">Главный вывод раздела</div>
              <p className="text-zinc-400 text-xs font-space-mono leading-relaxed">
                История рынка ботов — это история снижения порога входа. Но ни доступность, ни ИИ не отменяют
                одного: прежде чем рисковать деньгами, стратегию нужно проверить. Поэтому в TradeBase есть
                конструктор, бэктест и тестовая сеть — чтобы ты вошёл в этот рынок подготовленным, а не на эмоциях.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <a
                href="/bot-builder"
                className="inline-flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white font-orbitron text-sm px-5 py-2.5 rounded-md transition-colors"
              >
                🛠 Собрать своего бота
              </a>
              <a
                href="/bots-guide"
                className="inline-flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-white font-orbitron text-sm px-5 py-2.5 rounded-md transition-colors border border-zinc-700"
              >
                📚 Гайд по ботам
              </a>
            </div>
          </div>
        ),
      },
    ],
  },
]