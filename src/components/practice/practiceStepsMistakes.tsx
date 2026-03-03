import type { PracticeStep } from "./practiceStepTypes"

// ─── Секция 1: 10 типичных ошибок ────────────────────────────────────────────
const SectionTopMistakes = () => (
  <div className="space-y-4">
    <p className="text-gray-300 leading-relaxed">
      Анализ 500+ сливов депозита показывает: 90% потерь вызваны одними и теми же 10 ошибками.
      Ни одна из них не связана с незнанием индикаторов — все они поведенческие.
    </p>

    <div className="space-y-2">
      {[
        {
          num: "01",
          title: "Вход без системы — «по ощущению»",
          problem: "Кажется, что цена точно пойдёт вверх — открываем без проверки сигналов.",
          fix: "Входить только при полном совпадении всех 3 условий конфлюэнса. Нет 3 — нет сделки.",
          cost: "−15–20% депо за неделю",
          color: "border-red-500/30",
          num_color: "text-red-400",
        },
        {
          num: "02",
          title: "Мартингейл — удвоение ставки после проигрыша",
          problem: "«Следующая точно выиграет» — удваиваем ставку, чтобы отыграться.",
          fix: "Фиксированные 2% на каждую сделку, независимо от результата предыдущей.",
          cost: "Слив за 5–7 сделок при серии проигрышей",
          color: "border-orange-500/30",
          num_color: "text-orange-400",
        },
        {
          num: "03",
          title: "Игнорирование дневного стоп-лосса",
          problem: "−6% за день — продолжаем торговать, чтобы вернуть потери.",
          fix: "Достигли −6% — платформа закрыта до следующего дня. Без исключений.",
          cost: "Дополнительный −10–15% за одну сессию",
          color: "border-yellow-500/30",
          num_color: "text-yellow-400",
        },
        {
          num: "04",
          title: "Торговля в новостные часы",
          problem: "Открываем сделку за 5 минут до выхода NFP или заседания ФРС.",
          fix: "Запрет торговли за 30 минут до и после крупных новостей. Список на Investing.com.",
          cost: "Резкий выброс цены уничтожает стратегию",
          color: "border-purple-500/30",
          num_color: "text-purple-400",
        },
        {
          num: "05",
          title: "Слишком большой стейк на «очевидный» сигнал",
          problem: "«Сигнал идеальный» — ставим 20% вместо 2%.",
          fix: "Размер ставки никогда не зависит от уверенности. Всегда 2%.",
          cost: "Один убыток = потеря 20% депозита",
          color: "border-blue-500/30",
          num_color: "text-blue-400",
        },
        {
          num: "06",
          title: "Отсутствие журнала сделок",
          problem: "Не записываем сделки — не видим паттерны своих ошибок.",
          fix: "CSV или таблица: дата, актив, сигнал, ставка, результат, причина входа.",
          cost: "Повторяем одни и те же ошибки бесконечно",
          color: "border-cyan-500/30",
          num_color: "text-cyan-400",
        },
        {
          num: "07",
          title: "Торговля при плохом психологическом состоянии",
          problem: "Поссорились, устали, выпили — открываем сделки.",
          fix: "Торговать можно только в ресурсном состоянии. Эмоции = ошибки = деньги.",
          cost: "−5–10% за сессию при нарушенной дисциплине",
          color: "border-pink-500/30",
          num_color: "text-pink-400",
        },
        {
          num: "08",
          title: "Смена стратегии после 3 проигрышей",
          problem: "«Стратегия не работает» — переходим на другую. Потом ещё на одну.",
          fix: "Оценивать стратегию минимум по 50 сделкам. 3 проигрыша — статистический шум.",
          cost: "Никогда не накапливается реальная статистика",
          color: "border-green-500/30",
          num_color: "text-green-400",
        },
        {
          num: "09",
          title: "Торговля на несколько активов одновременно",
          problem: "Открываем BTC, EURUSD и AAPL в одно время — не успеваем следить.",
          fix: "Один актив, один таймфрейм, одна стратегия. Масштабироваться после 3 месяцев плюса.",
          cost: "Пропускаем сигналы, входим в хаосе",
          color: "border-zinc-500/30",
          num_color: "text-zinc-400",
        },
        {
          num: "10",
          title: "Переход на реальные деньги без демо-статистики",
          problem: "«Зачем демо — деньги же не реальные» — сразу торгуем на живые.",
          fix: "Минимум 50 сделок на демо с win rate ≥54% до первого реального депозита.",
          cost: "Сливаем первый депозит на обучение стратегии",
          color: "border-amber-500/30",
          num_color: "text-amber-400",
        },
      ].map(({ num, title, problem, fix, cost, color, num_color }) => (
        <div key={num} className={`bg-zinc-900 border ${color} rounded-xl p-4`}>
          <div className="flex gap-3 items-start">
            <div className={`font-orbitron text-sm font-bold ${num_color} shrink-0 w-7`}>{num}</div>
            <div className="flex-1 space-y-2">
              <div className={`font-orbitron text-xs font-bold ${num_color}`}>{title}</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <div className="text-red-400 text-[10px] font-space-mono font-bold mb-0.5">Ошибка:</div>
                  <div className="text-zinc-400 text-[10px] font-space-mono leading-relaxed">{problem}</div>
                </div>
                <div>
                  <div className="text-green-400 text-[10px] font-space-mono font-bold mb-0.5">Решение:</div>
                  <div className="text-zinc-300 text-[10px] font-space-mono leading-relaxed">{fix}</div>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[9px] font-space-mono text-zinc-600">Цена ошибки:</span>
                <span className={`text-[9px] font-space-mono font-bold ${num_color}`}>{cost}</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
)

// ─── Секция 2: Психология — враг внутри ──────────────────────────────────────
const SectionPsychology = () => (
  <div className="space-y-4">
    <p className="text-gray-300 leading-relaxed">
      Технический анализ можно освоить за месяц. Психологию трейдинга — годами.
      Именно она определяет разницу между теми, кто зарабатывает, и теми, кто сливает.
    </p>

    {/* 4 психологические ловушки */}
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {[
        {
          trap: "FOMO — страх пропустить",
          desc: "«Цена уже летит вверх, нужно запрыгнуть!» — входим на самом верху.",
          solution: "Если пропустил сигнал — следующего ждать, а не догонять.",
          icon: "🚀",
          color: "border-yellow-500/30 text-yellow-400",
        },
        {
          trap: "Избегание потерь",
          desc: "«Не закрою сделку — вдруг ещё отыграется» — убыток растёт.",
          solution: "Бот не имеет эмоций — это главное преимущество автоматизации.",
          icon: "🙈",
          color: "border-red-500/30 text-red-400",
        },
        {
          trap: "Излишняя самоуверенность",
          desc: "«Серия побед — я понял рынок» — увеличиваем ставки, рискуем.",
          solution: "Стейк фиксирован. Серия побед — случайность, не мастерство.",
          icon: "💪",
          color: "border-orange-500/30 text-orange-400",
        },
        {
          trap: "Подтверждение своего мнения",
          desc: "Ищем только те сигналы, которые подтверждают нашу позицию.",
          solution: "Алгоритм и чеклист — единственный судья. Мнение не считается.",
          icon: "🔍",
          color: "border-purple-500/30 text-purple-400",
        },
      ].map(({ trap, desc, solution, icon, color }) => (
        <div key={trap} className={`bg-zinc-900 border ${color.split(" ")[0]} rounded-xl p-4 space-y-2`}>
          <div className="flex items-center gap-2">
            <span className="text-lg">{icon}</span>
            <div className={`font-orbitron text-xs font-bold ${color.split(" ")[1]}`}>{trap}</div>
          </div>
          <div className="text-zinc-500 text-[10px] font-space-mono leading-relaxed">{desc}</div>
          <div className={`text-[10px] font-space-mono font-bold ${color.split(" ")[1]}`}>→ {solution}</div>
        </div>
      ))}
    </div>

    {/* Правило "Контрольной паузы" */}
    <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4">
      <div className="font-orbitron text-xs font-bold text-zinc-400 mb-3">Правило «Контрольной паузы»</div>
      <div className="flex flex-col sm:flex-row gap-4 items-start">
        <div className="flex-1 space-y-2">
          {[
            "Перед каждой сделкой — 30 секунд паузы",
            "Задать себе: «Я открываю сделку по алгоритму или по эмоции?»",
            "Если ответ «по ощущению» — не открывать",
            "Если ответ «по алгоритму» — проверить чеклист и войти",
          ].map((item, i) => (
            <div key={i} className="flex gap-2 items-start">
              <span className="text-blue-400 font-space-mono text-xs shrink-0">{i + 1}.</span>
              <span className="text-zinc-300 text-xs font-space-mono leading-relaxed">{item}</span>
            </div>
          ))}
        </div>
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-3 sm:w-44 shrink-0">
          <div className="text-blue-400 font-orbitron text-[10px] font-bold mb-1">Из жизни</div>
          <p className="text-zinc-400 text-[10px] font-space-mono leading-relaxed">
            Пол Тюдор Джонс вешал над монитором табличку: «Losers average losers» —
            проигравшие усредняют убытки. Пауза перед входом — его обязательный ритуал.
          </p>
        </div>
      </div>
    </div>

    {/* Как автоматизация решает проблему */}
    <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
      <div className="text-green-400 font-orbitron text-xs font-bold mb-2">Почему бот лучше человека в дисциплине</div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {[
          ["Бот не паникует при серии убытков", "Строго соблюдает правило 2% и дневной стоп"],
          ["Бот не испытывает FOMO", "Входит только при совпадении всех условий"],
          ["Бот не торгует в новости", "Запрет прописан кодом, а не волей"],
          ["Бот не меняет стратегию после 3 потерь", "Параметры меняются только после 50+ сделок"],
        ].map(([human, bot], i) => (
          <div key={i} className="bg-zinc-900 rounded-xl p-3">
            <div className="text-red-400 text-[10px] font-space-mono mb-1">✗ Человек: {human}</div>
            <div className="text-green-400 text-[10px] font-space-mono">✓ Бот: {bot}</div>
          </div>
        ))}
      </div>
    </div>
  </div>
)

// ─── Секция 3: Ошибки в автоматизации ────────────────────────────────────────
const SectionBotMistakes = () => (
  <div className="space-y-4">
    <p className="text-gray-300 leading-relaxed">
      Боты тоже совершают ошибки — но по другим причинам. Это не эмоции, а ошибки в коде,
      настройках или логике стратегии. Вот самые распространённые.
    </p>

    <div className="space-y-3">
      {[
        {
          title: "Оптимизация под прошлое (overfitting)",
          problem: "Настроили EMA и RSI так, чтобы бэктест показал 80% win rate — но на реальном рынке 40%.",
          fix: "Тестировать на данных, которые НЕ использовались при настройке. Минимум 3 месяца out-of-sample.",
          icon: "📈",
          color: "text-red-400 border-red-500/30",
        },
        {
          title: "Бэктест без учёта комиссий и спреда",
          problem: "Стратегия даёт +18% в бэктесте, но после вычета комиссий Pocket Option (18%) — в минусе.",
          fix: "В backtest.py учитывать payout = 0.82 (а не 1.0) и реалистичный win rate.",
          icon: "💸",
          color: "text-orange-400 border-orange-500/30",
        },
        {
          title: "Бот не обрабатывает потерю соединения",
          problem: "WS-соединение упало в момент открытой сделки — бот не знает, чем она завершилась.",
          fix: "Добавить обработку reconnect и проверку результата сделки после переподключения.",
          icon: "🔌",
          color: "text-yellow-400 border-yellow-500/30",
        },
        {
          title: "Нет защиты от дублирования ордеров",
          problem: "При переподключении бот отправляет ордер дважды — удваивается ставка.",
          fix: "Хранить order_id, проверять уникальность перед отправкой нового ордера.",
          icon: "🔁",
          color: "text-purple-400 border-purple-500/30",
        },
        {
          title: "Торговля в флэте без адаптации",
          problem: "EMA+RSI — трендовая стратегия. На боковом рынке генерирует ложные сигналы.",
          fix: "Добавить фильтр флэта: если EMA20 и EMA50 ближе 0.1% — сигнал WAIT.",
          icon: "↔️",
          color: "text-blue-400 border-blue-500/30",
        },
        {
          title: "Запуск без алертов о критических событиях",
          problem: "Бот упал ночью, торгует в убыток 6 часов — узнали утром.",
          fix: "Telegram-бот для алертов: при ошибке, при дневном стопе, при win rate < 50%.",
          icon: "🔔",
          color: "text-cyan-400 border-cyan-500/30",
        },
      ].map(({ title, problem, fix, icon, color }) => (
        <div key={title} className={`bg-zinc-900 border ${color.split(" ")[1]} rounded-xl p-4`}>
          <div className="flex gap-3 items-start">
            <span className="text-2xl shrink-0">{icon}</span>
            <div className="flex-1 space-y-2">
              <div className={`font-orbitron text-xs font-bold ${color.split(" ")[0]}`}>{title}</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <div className="text-red-400 text-[10px] font-space-mono font-bold mb-0.5">Проблема:</div>
                  <div className="text-zinc-400 text-[10px] font-space-mono leading-relaxed">{problem}</div>
                </div>
                <div>
                  <div className="text-green-400 text-[10px] font-space-mono font-bold mb-0.5">Решение:</div>
                  <div className="text-zinc-300 text-[10px] font-space-mono leading-relaxed">{fix}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>

    {/* Telegram-алерт */}
    <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4">
      <div className="font-orbitron text-xs font-bold text-zinc-400 mb-2">Добавляем Telegram-алерты в бота (10 строк)</div>
      <pre className="text-green-400 text-[10px] font-space-mono whitespace-pre-wrap leading-relaxed overflow-x-auto">{`import requests

TELEGRAM_TOKEN = os.getenv("TELEGRAM_TOKEN")
TELEGRAM_CHAT  = os.getenv("TELEGRAM_CHAT_ID")

def send_alert(text):
    if not TELEGRAM_TOKEN:
        return
    url = f"https://api.telegram.org/bot{TELEGRAM_TOKEN}/sendMessage"
    requests.post(url, json={"chat_id": TELEGRAM_CHAT, "text": text})

# Использование в боте:
# send_alert(f"✅ WIN +{pnl:.2f}$ | Win Rate: {wr:.1f}%")
# send_alert(f"❌ Дневной стоп. Итог: {daily_pnl:+.2f}$")
# send_alert(f"🔴 Ошибка подключения: {str(e)}")`}</pre>
    </div>

    <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-3">
      <p className="text-blue-300 text-xs font-space-mono leading-relaxed">
        <span className="font-bold">Как создать Telegram-бота:</span> напишите @BotFather → /newbot → получите TOKEN.
        Затем напишите своему боту любое сообщение и получите CHAT_ID через
        <code className="bg-zinc-800 px-1 mx-1 rounded">api.telegram.org/bot&#123;TOKEN&#125;/getUpdates</code>.
      </p>
    </div>
  </div>
)

// ─── Секция 4: Самодиагностика трейдера ──────────────────────────────────────
const SectionSelfDiagnosis = () => (
  <div className="space-y-4">
    <p className="text-gray-300 leading-relaxed">
      Еженедельный самоаудит — 15 минут в воскресенье — позволяет выявить ошибки до того,
      как они превратятся в серьёзные потери.
    </p>

    {/* Чеклист недельного аудита */}
    <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4">
      <div className="font-orbitron text-xs font-bold text-zinc-400 mb-3">Еженедельный чеклист самоаудита</div>
      <div className="space-y-2">
        {[
          { q: "Win Rate за неделю ≥ 54%?", yes: "Продолжаем", no: "Анализируем последние 20 сделок", color: "text-green-400" },
          { q: "Все сделки открыты по алгоритму (не по ощущению)?", yes: "Отлично, продолжаем", no: "Выявить причины нарушений", color: "text-blue-400" },
          { q: "Ни разу не нарушили дневной стоп-лосс?", yes: "Дисциплина на уровне", no: "Зафиксировать случай, понять триггер", color: "text-yellow-400" },
          { q: "Журнал сделок заполнен полностью?", yes: "Есть аналитика для решений", no: "Завести привычку — записывать сразу", color: "text-purple-400" },
          { q: "Бот работал без сбоев всю неделю?", yes: "Система стабильна", no: "Проверить логи, добавить reconnect", color: "text-cyan-400" },
          { q: "Максимальный стейк не превысил 2%?", yes: "Риск-менеджмент соблюдён", no: "Жёстко зафиксировать в коде/правилах", color: "text-red-400" },
        ].map(({ q, yes, no, color }) => (
          <div key={q} className="bg-zinc-900 rounded-xl p-3">
            <div className={`font-space-mono text-xs font-bold ${color} mb-1`}>? {q}</div>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="flex-1 bg-green-500/5 border border-green-500/20 rounded-lg px-2 py-1">
                <span className="text-green-400 text-[10px] font-space-mono font-bold">Да → </span>
                <span className="text-zinc-400 text-[10px] font-space-mono">{yes}</span>
              </div>
              <div className="flex-1 bg-red-500/5 border border-red-500/20 rounded-lg px-2 py-1">
                <span className="text-red-400 text-[10px] font-space-mono font-bold">Нет → </span>
                <span className="text-zinc-400 text-[10px] font-space-mono">{no}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Метрики для оценки стратегии */}
    <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4">
      <div className="font-orbitron text-xs font-bold text-zinc-400 mb-3">3 ключевые метрики оценки результата</div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          {
            metric: "Win Rate",
            formula: "Wins / Total × 100",
            threshold: "≥ 54%",
            note: "Минимум для прибыли при payout 82%",
            color: "text-green-400 border-green-500/30",
          },
          {
            metric: "Profit Factor",
            formula: "Сумма побед / Сумма поражений",
            threshold: "≥ 1.3",
            note: "Ниже 1.0 = стратегия убыточная",
            color: "text-blue-400 border-blue-500/30",
          },
          {
            metric: "Max Drawdown",
            formula: "Макс. падение от пика",
            threshold: "≤ 15%",
            note: "Выше 20% = пересмотр риск-менеджмента",
            color: "text-yellow-400 border-yellow-500/30",
          },
        ].map(({ metric, formula, threshold, note, color }) => (
          <div key={metric} className={`bg-zinc-900 border ${color.split(" ")[1]} rounded-xl p-3`}>
            <div className={`font-orbitron text-xs font-bold ${color.split(" ")[0]} mb-1`}>{metric}</div>
            <div className="text-zinc-500 text-[10px] font-space-mono mb-2">{formula}</div>
            <div className={`font-orbitron text-sm font-bold ${color.split(" ")[0]}`}>{threshold}</div>
            <div className="text-zinc-600 text-[9px] font-space-mono mt-1">{note}</div>
          </div>
        ))}
      </div>
    </div>

    {/* Итог шага */}
    <div className="bg-gradient-to-r from-zinc-900 to-zinc-950 border border-zinc-700 rounded-xl p-5">
      <div className="font-orbitron text-xs font-bold text-white mb-3">Ключевой вывод Шага 6</div>
      <p className="text-zinc-300 text-xs font-space-mono leading-relaxed mb-3">
        Успех в трейдинге — это не про то, как угадать движение рынка. Это про то,
        как не мешать правильной стратегии работать. Большинство ошибок совершаются не от незнания, 
        а от нарушения известных правил.
      </p>
      <div className="space-y-1.5">
        {[
          "Автоматизация убирает эмоциональные ошибки (1–4, 7 из списка 10)",
          "Дисциплина убирает системные ошибки (5, 6, 8–10 из списка 10)",
          "Еженедельный аудит позволяет поймать ошибки до их накопления",
          "Оценивайте стратегию по 3 метрикам: win rate, profit factor, max drawdown",
        ].map((item, i) => (
          <div key={i} className="flex gap-2 items-start">
            <span className="text-green-400 text-xs shrink-0">✓</span>
            <span className="text-zinc-400 text-xs font-space-mono">{item}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
)

// ─── Экспорт шага ─────────────────────────────────────────────────────────────
export const stepMistakes: PracticeStep = {
  id: "mistakes",
  badge: "Шаг 7",
  color: "red",
  icon: "AlertTriangle",
  title: "Типичные ошибки: почему 80% трейдеров сливают депозит",
  summary: "10 поведенческих ошибок, которые уничтожают любую стратегию. Разбираем каждую и показываем, как автоматизация помогает их устранить.",
  relevance2026: {
    score: 96,
    label: "Актуальнее с каждым годом",
    aiImpact: 55,
    botImpact: 85,
    aiNote: "ИИ-боты не совершают эмоциональных ошибок 1–7, но добавляют новые технические: overfitting, ложные сигналы от зашумлённых данных, сбои API. Картина сложнее.",
    botNote: "Автоматизация устраняет большинство ошибок из топ-10, но создаёт свои. Знание обеих групп — человеческих и бот-ошибок — критично в 2026.",
  },
  aibotInsight: {
    aiExamples: [
      {
        label: "Ошибки ИИ-ботов",
        text: "Боты на ML совершают принципиально другие ошибки: переобучение на исторических данных (работало в 2022, не работает в 2024), ложные сигналы при аномальных новостях, зависание при перегрузке API.",
      },
      {
        label: "Overfitting — главная ловушка",
        text: "ИИ-модель, обученная на 2022–2023 гг., «запомнила» паттерны медвежьего рынка. В бычьем 2024–2025 она ошибается на 40% чаще. Это не «плохой ИИ» — это переобучение, которого не избежать без правильной валидации.",
      },
      {
        label: "Эмоциональное отключение бота",
        text: "Самая частая «человеческая» ошибка с ботами: трейдер видит просадку 15%, паникует и отключает бота в нижней точке. Следующие 48 часов бот бы заработал +18%. Эмоции убивают алго-стратегии.",
      },
    ],
    botExamples: [
      {
        label: "Бот устраняет ошибки 1–7",
        text: "Классический бот полностью устраняет: вход без системы, мартингейл, игнорирование стопа, FOMO, месть рынку, торговлю в усталости, нарушение тайм-фрейма. Это 7 из 10 типичных ошибок.",
      },
      {
        label: "Но добавляет ошибки 11–15",
        text: "Бот создаёт новые риски: некорректный API-ключ (ордера не исполняются), ошибка в коде риска (торгует больше допустимого), потеря соединения в момент открытой позиции, неверный тайм-зон сервера.",
      },
    ],
    comparison: {
      human: "Совершает 8–10 типичных ошибок регулярно, теряет 20–40% депо на психологии",
      bot: "Устраняет 7 ошибок, но добавляет 4–5 технических — нужно знать обе группы",
      ai: "Меньше эмоциональных ошибок, но риск overfitting и ложных сигналов выше",
    },
  },
  sections: [
    {
      title: "10 типичных ошибок трейдера: причины и решения",
      content: <SectionTopMistakes />,
    },
    {
      title: "Психология: FOMO, избегание потерь и самоуверенность",
      content: <SectionPsychology />,
    },
    {
      title: "Ошибки в автоматизации: типичные баги торговых ботов",
      content: <SectionBotMistakes />,
    },
    {
      title: "Самодиагностика: еженедельный аудит трейдера",
      content: <SectionSelfDiagnosis />,
    },
  ],
}