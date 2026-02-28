import type { PracticeStep } from "./practiceStepTypes"

export const stepFullChecklist: PracticeStep = {
  id: "full-checklist",
  badge: "Итог",
  color: "green",
  icon: "CheckCircle",
  title: "Полный чеклист: от анализа до прибыли",
  summary: "Объединяем всё в единый алгоритм действий. Следуйте ему каждый раз перед открытием сделки.",
  sections: [
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
                desc: "Этот раздел: как использовать всё вместе на реальном примере BTC / Pocket Option",
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
    }
  ]
}
