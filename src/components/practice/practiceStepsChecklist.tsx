import type { PracticeStep } from "./practiceStepTypes"

export const stepFullChecklist: PracticeStep = {
  id: "full-checklist",
  badge: "Итог",
  color: "green",
  icon: "CheckCircle",
  title: "Итог: полная система от анализа до автоматизации",
  summary: "Сводка всех 6 шагов курса. Единый алгоритм действий, карта прогресса трейдера и следующие шаги для роста.",
  sections: [
    {
      title: "Сводка курса: 6 шагов к системной торговле",
      content: (
        <div className="space-y-4">
          <p className="text-gray-300 leading-relaxed">
            Вы прошли полный путь: от понимания рынка до работающего бота с риск-менеджментом.
            Вот всё, что разобрали в курсе — в одном месте.
          </p>

          <div className="space-y-2">
            {[
              {
                step: "Шаг 1", title: "Анализ рынка",
                items: ["Тренд через EMA 20/50", "Уровни поддержки и сопротивления", "Таймфрейм M5 для BTC/USDT"],
                color: "text-blue-400", border: "border-blue-500/30", bg: "bg-blue-500/5",
              },
              {
                step: "Шаг 2", title: "Формирование сигнала",
                items: ["RSI-фильтр (< 35 CALL, > 65 PUT)", "Свечной паттерн как третье подтверждение", "Конфлюэнс: только 3 из 3"],
                color: "text-yellow-400", border: "border-yellow-500/30", bg: "bg-yellow-500/5",
              },
              {
                step: "Шаг 3", title: "Риск-менеджмент",
                items: ["2% депозита на сделку", "Дневной стоп-лосс −6%", "Журнал каждой сделки"],
                color: "text-red-400", border: "border-red-500/30", bg: "bg-red-500/5",
              },
              {
                step: "Шаг 4", title: "Выбор платформы и стратегии",
                items: ["Pocket Option, 3Commas, Pionex — сравнение", "DCA-бот и Grid-бот: когда применять", "Матрица выбора под задачу"],
                color: "text-purple-400", border: "border-purple-500/30", bg: "bg-purple-500/5",
              },
              {
                step: "Шаг 5", title: "Автоматизация на Python",
                items: ["Готовый бот «Три подтверждения» (~200 строк)", "Деплой на VPS 24/7 + supervisor", "Telegram-алерты и мониторинг"],
                color: "text-indigo-400", border: "border-indigo-500/30", bg: "bg-indigo-500/5",
              },
              {
                step: "Шаг 6", title: "Устранение ошибок",
                items: ["10 поведенческих ошибок и как их избежать", "Психологические ловушки: FOMO, мартингейл", "Еженедельный аудит: win rate, profit factor"],
                color: "text-orange-400", border: "border-orange-500/30", bg: "bg-orange-500/5",
              },
            ].map(({ step, title, items, color, border, bg }) => (
              <div key={step} className={`${bg} border ${border} rounded-xl p-4`}>
                <div className="flex items-center gap-3 mb-2">
                  <span className={`font-orbitron text-xs font-bold ${color}`}>{step}</span>
                  <span className={`font-orbitron text-xs font-bold text-white`}>{title}</span>
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-0.5">
                  {items.map((item) => (
                    <div key={item} className="flex gap-1.5 items-center">
                      <span className={`text-[9px] ${color}`}>✓</span>
                      <span className="text-zinc-400 text-[10px] font-space-mono">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="bg-gradient-to-r from-green-500/10 to-zinc-950 border border-green-500/30 rounded-xl p-5">
            <div className="text-green-400 font-orbitron text-xs font-bold mb-2">Главный вывод курса</div>
            <p className="text-zinc-300 text-xs font-space-mono leading-relaxed">
              Прибыльная торговля — это не про угадывание рынка. Это про систему, которая повторяется:
              один и тот же анализ, одни и те же правила входа, один и тот же риск-менеджмент.
              Автоматизация убирает эмоции. Дисциплина убирает ошибки. Аудит убирает слепые пятна.
            </p>
          </div>
        </div>
      )
    },
    {
      title: "Алгоритм принятия решения за 5 минут",
      content: (
        <div className="space-y-3">
          <p className="text-gray-300 leading-relaxed">
            Этот алгоритм объединяет всё — анализ рынка, подтверждения, риск-менеджмент. Занимает 5 минут.
            Если хотя бы один пункт не выполнен — сделку не открываем.
          </p>
          <div className="space-y-2">
            {[
              { step: "01", category: "Рынок", text: "Открыл M5 BTC/USD. Определил направление тренда через EMA 20/50", color: "text-blue-400" },
              { step: "02", category: "Уровни", text: "Нашёл ближайшие уровни поддержки/сопротивления. Цена у уровня? Да/Нет", color: "text-yellow-400" },
              { step: "03", category: "RSI", text: "Проверил RSI: при PUT — выше 65, при CALL — ниже 35. Подтверждает?", color: "text-purple-400" },
              { step: "04", category: "Конфлюэнс", text: "Все 3 сигнала совпадают? Если только 2 — пропускаем сделку", color: "text-orange-400" },
              { step: "05", category: "Риск", text: "Считаю ставку: 2% от депозита. Проверяю: не превышен ли дневной лимит (-6%)?", color: "text-red-400" },
              { step: "06", category: "Вход", text: "Устанавливаю ставку, выбираю экспирацию 3–5 мин. Открываю сделку.", color: "text-green-400" },
              { step: "07", category: "Журнал", text: "Записываю: дата, сигнал, ставка, причины входа, результат", color: "text-zinc-400" },
            ].map((item, i) => (
              <div key={i} className="flex gap-3 items-start bg-zinc-900 border border-zinc-800 rounded-lg p-3">
                <div className={`font-orbitron text-xs font-bold ${item.color} w-6 shrink-0 mt-0.5`}>{item.step}</div>
                <div>
                  <span className={`font-orbitron text-xs font-bold ${item.color}`}>{item.category}: </span>
                  <span className="text-zinc-300 text-xs font-space-mono">{item.text}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
            <div className="text-green-400 font-orbitron text-xs font-bold mb-2">Из жизни: предторговый ритуал Брюса Ковнера</div>
            <p className="text-zinc-300 text-xs font-space-mono leading-relaxed">
              Брюс Ковнер — один из самых успешных макро-трейдеров мира, управлявший $14 млрд в Caxton Associates —
              каждое утро проходил один и тот же ритуал: проверял новости, ключевые уровни, позиции крупных игроков.
              Только после этого он принимал решения. «Хорошая торговля — это скучно», — говорил он.
              Профессионалы не ищут адреналин. Они ищут повторяемость: один и тот же процесс, снова и снова.
            </p>
          </div>
        </div>
      )
    },
    {
      title: "Главная ошибка новичков: торговля без системы",
      content: (
        <div className="space-y-3">
          <p className="text-gray-300 leading-relaxed">
            80% начинающих трейдеров сливают депозит не потому, что не понимают анализ. А потому что торгуют хаотично — без правил, без плана, на эмоциях.
          </p>
          <div className="space-y-2">
            {[
              {
                mistake: "Вход «по ощущению»",
                fix: "Входить только при совпадении всех 3 факторов конфлюэнса",
                color: "text-red-400",
                border: "border-red-500/30",
              },
              {
                mistake: "Удвоение ставки после проигрыша",
                fix: "Фиксированная ставка 2% — всегда, независимо от предыдущего результата",
                color: "text-orange-400",
                border: "border-orange-500/30",
              },
              {
                mistake: "Торговля в нервном состоянии",
                fix: "Если устал или расстроен — платформа закрыта. Эмоции = убытки",
                color: "text-yellow-400",
                border: "border-yellow-500/30",
              },
              {
                mistake: "Игнорирование дневного стоп-лосса",
                fix: "3 проигрыша подряд = стоп на сегодня. Завтра рынок никуда не уйдёт",
                color: "text-purple-400",
                border: "border-purple-500/30",
              },
            ].map((item, i) => (
              <div key={i} className={`bg-zinc-900 border ${item.border} rounded-lg p-3`}>
                <div className={`font-orbitron text-xs font-bold mb-1 ${item.color}`}>✗ {item.mistake}</div>
                <div className="text-zinc-300 text-xs font-space-mono">→ {item.fix}</div>
              </div>
            ))}
          </div>

          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
            <div className="text-yellow-400 font-orbitron text-xs font-bold mb-2">Из жизни: история Джесси Ливермора</div>
            <p className="text-zinc-300 text-xs font-space-mono leading-relaxed">
              Джесси Ливермор трижды зарабатывал и трижды терял многомиллионные состояния.
              Причина потерь каждый раз одна — он нарушал собственные правила: торговал на слухи, увеличивал позиции без оснований, игнорировал сигналы рынка.
              В своей книге «Воспоминания биржевого спекулянта» он признаёт: «Мои ошибки никогда не были ошибками анализа.
              Это были ошибки дисциплины». Самая дорогая наука в трейдинге — следовать своим же правилам.
            </p>
          </div>
        </div>
      )
    },
    {
      title: "Связь разделов сайта: как всё работает вместе",
      content: (
        <div className="space-y-3">
          <p className="text-gray-300 leading-relaxed">
            Каждый раздел TradeBase решает конкретную задачу. Вот как они связаны в реальной торговле:
          </p>
          <div className="space-y-2">
            {[
              {
                section: "Основы трейдинга",
                href: "/trading-basics",
                role: "Фундамент",
                desc: "Тренд, уровни, RSI, свечи — всё для анализа сигнала перед входом в сделку",
                color: "text-red-400",
                border: "border-red-500/30",
                bg: "bg-red-500/5",
              },
              {
                section: "Гайд по ботам",
                href: "/bots-guide",
                role: "Автоматизация",
                desc: "Grid, DCA, бэктест, платформы, риск-менеджмент бота — для автоматической торговли",
                color: "text-blue-400",
                border: "border-blue-500/30",
                bg: "bg-blue-500/5",
              },
              {
                section: "Конструктор ботов",
                href: "/bot-builder",
                role: "Инструмент",
                desc: "Генерирует готовый Python-код стратегии под ваши параметры — без программирования",
                color: "text-purple-400",
                border: "border-purple-500/30",
                bg: "bg-purple-500/5",
              },
              {
                section: "Практический кейс",
                href: "/practice",
                role: "Применение",
                desc: "6 шагов: анализ → сигнал → риск → платформа → Python-бот → устранение ошибок",
                color: "text-green-400",
                border: "border-green-500/30",
                bg: "bg-green-500/5",
              },
            ].map((item, i) => (
              <a key={i} href={item.href} className={`flex gap-3 items-start ${item.bg} border ${item.border} rounded-lg p-3 hover:opacity-80 transition-opacity`}>
                <div className={`font-orbitron text-xs font-bold ${item.color} shrink-0 mt-0.5 w-20`}>{item.role}</div>
                <div>
                  <div className={`font-orbitron text-xs font-bold mb-0.5 ${item.color}`}>{item.section}</div>
                  <p className="text-zinc-400 text-xs font-space-mono">{item.desc}</p>
                </div>
              </a>
            ))}
          </div>

          <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
            <div className="text-green-400 font-orbitron text-xs font-bold mb-2">Из жизни: «торговая система» Ричарда Денниса</div>
            <p className="text-zinc-300 text-xs font-space-mono leading-relaxed">
              В 1983 году Ричард Деннис поспорил: можно ли научить случайных людей торговать системно?
              Он набрал 13 человек без опыта — «черепах» — и за 2 недели обучил их конкретной системе правил.
              Результат: за 5 лет «черепахи» заработали суммарно $175 млн.
              Вывод прост: система важнее опыта. Правильные правила + дисциплина = результат.
              Именно это и даёт TradeBase — структурированный путь от анализа до автоматизации.
            </p>
          </div>
        </div>
      )
    },
    {
      title: "Ваш следующий шаг: карта роста трейдера",
      content: (
        <div className="space-y-4">
          <p className="text-gray-300 leading-relaxed">
            Прохождение курса — это старт, не финиш. Вот конкретный план действий после завершения всех 6 шагов.
          </p>

          {/* Дорожная карта */}
          <div className="space-y-2">
            {[
              {
                phase: "Неделя 1–2",
                label: "Демо-режим",
                tasks: [
                  "50 сделок на демо-счёте Pocket Option строго по алгоритму",
                  "Заполнять журнал сделок после каждого входа",
                  "Цель: win rate ≥ 54% на 50 сделках",
                ],
                color: "text-blue-400", border: "border-blue-500/30", bg: "bg-blue-500/5",
              },
              {
                phase: "Неделя 3–4",
                label: "Бэктест бота",
                tasks: [
                  "Запустить backtest.py на 500+ свечах M5",
                  "Убедиться: win rate ≥ 54%, max drawdown ≤ 15%",
                  "Настроить Telegram-алерты",
                ],
                color: "text-yellow-400", border: "border-yellow-500/30", bg: "bg-yellow-500/5",
              },
              {
                phase: "Месяц 2",
                label: "Реальный счёт (мин. депозит)",
                tasks: [
                  "Пополнить счёт от $50–100, не больше",
                  "Запустить бота на VPS в демо-режиме ещё 2 недели",
                  "Переключить DEMO_MODE=false только при стабильном плюсе",
                ],
                color: "text-orange-400", border: "border-orange-500/30", bg: "bg-orange-500/5",
              },
              {
                phase: "Месяц 3+",
                label: "Масштабирование",
                tasks: [
                  "Еженедельный аудит по чеклисту Шага 6",
                  "Добавить второй актив только после 3 прибыльных месяцев",
                  "Изучить Grid-бот на Pionex для BTC/USDT как параллельную стратегию",
                ],
                color: "text-green-400", border: "border-green-500/30", bg: "bg-green-500/5",
              },
            ].map(({ phase, label, tasks, color, border, bg }) => (
              <div key={phase} className={`${bg} border ${border} rounded-xl p-4`}>
                <div className="flex items-center gap-3 mb-2">
                  <span className={`font-orbitron text-[10px] font-bold ${color} bg-black/30 px-2 py-0.5 rounded-full shrink-0`}>{phase}</span>
                  <span className={`font-orbitron text-xs font-bold ${color}`}>{label}</span>
                </div>
                <div className="space-y-1">
                  {tasks.map((t) => (
                    <div key={t} className="flex gap-2 items-start">
                      <span className={`text-[10px] ${color} shrink-0 mt-0.5`}>→</span>
                      <span className="text-zinc-400 text-[10px] font-space-mono leading-relaxed">{t}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Ссылки на разделы */}
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4">
            <div className="font-orbitron text-xs font-bold text-zinc-400 mb-3">Полезные разделы для продолжения</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[
                { label: "Основы трейдинга", href: "/trading-basics", desc: "Тренд, уровни, RSI — фундамент анализа", color: "text-red-400" },
                { label: "Гайд по ботам", href: "/bots-guide", desc: "Grid, DCA, сравнение платформ", color: "text-blue-400" },
                { label: "Конструктор ботов", href: "/bot-builder", desc: "Python-код под вашу стратегию", color: "text-purple-400" },
                { label: "Шаг 6: ошибки", href: "/practice", desc: "Психология, аудит, метрики результата", color: "text-orange-400" },
              ].map(({ label, href, desc, color }) => (
                <a key={label} href={href}
                  className="flex gap-2 items-start bg-zinc-900 border border-zinc-800 rounded-xl p-3 hover:border-zinc-600 transition-colors">
                  <div>
                    <div className={`font-orbitron text-xs font-bold ${color}`}>{label}</div>
                    <div className="text-zinc-500 text-[10px] font-space-mono mt-0.5">{desc}</div>
                  </div>
                </a>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/20 rounded-xl p-5 text-center">
            <div className="font-orbitron text-sm font-bold text-white mb-2">Вы прошли полный курс</div>
            <p className="text-zinc-400 text-xs font-space-mono leading-relaxed max-w-md mx-auto">
              6 шагов · 20+ секций · готовый Python-бот · система риск-менеджмента · еженедельный аудит.
              Теперь у вас есть всё для системной торговли. Следующий шаг — первые 50 сделок на демо.
            </p>
          </div>
        </div>
      )
    },
  ]
}