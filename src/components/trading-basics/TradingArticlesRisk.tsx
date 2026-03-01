import React from "react"
import {
  RiskCalcTable,
  RRTable,
  TradingJournalTemplate,
} from "./TradingCharts"
import type { Article } from "./TradingArticleTypes"

export const articleRisk: Article = {
  id: "riskmanagement",
  badge: "Глава 5",
  title: "Риск-менеджмент: как не слить депозит",
  summary: "Риск-менеджмент важнее любой стратегии. Даже прибыльная система не спасёт, если неправильно управлять размером позиций.",
  sections: [
    {
      title: "Правило 1–2% на сделку: математика выживания",
      content: (
        <div className="space-y-3">
          <p className="text-gray-300 leading-relaxed">Главное правило трейдинга: сначала думай о том, сколько можешь потерять — и только потом о том, сколько заработаешь.</p>
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
            <div className="text-red-400 font-orbitron text-xs font-bold mb-2">Реальная история: $50,000 за 3 недели</div>
            <p className="text-zinc-400 text-xs font-space-mono leading-relaxed">Андрей начал с депозитом $50,000. Видя, как все вокруг зарабатывают на крипте в 2021, рисковал 15–25% на каждую сделку. После 7 убыточных сделок подряд (обычная серия даже для профи) у него осталось $11,800. Чтобы вернуться к $50,000 — нужно было заработать +323%. Он увеличил размер ставок, чтобы «отыграться» — и потерял всё. <span className="text-white">При риске 2% та же серия из 7 потерь оставила бы $43,200.</span></p>
          </div>
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
            <div className="text-blue-400 font-orbitron text-xs font-bold mb-2">Из жизни профессионалов: Уоррен Баффетт и правило №1</div>
            <p className="text-zinc-300 text-xs font-space-mono leading-relaxed">
              Уоррен Баффетт сформулировал свои правила инвестирования предельно просто:
              «Правило №1: никогда не теряй деньги. Правило №2: никогда не забывай правило №1».
              Баффетт никогда не вкладывает в то, что может привести к катастрофическим потерям.
              В трейдинге это прямо соответствует риску 1–2%: даже при плохой серии сделок капитал остаётся достаточным, чтобы продолжать.
              Выживаемость важнее доходности — это принцип всех успешных управляющих капиталом.
            </p>
          </div>
          <RiskCalcTable />
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4">
            <svg viewBox="0 0 360 120" className="w-full h-28">
              {[
                { label: "10% риска", values: [100, 90, 81, 73, 66, 59, 53, 48, 43, 39], color: "#ef4444" },
                { label: "2% риска", values: [100, 98, 96.1, 94.2, 92.3, 90.5, 88.7, 86.9, 85.2, 83.5], color: "#eab308" },
                { label: "0.5% риска", values: [100, 99.5, 99, 98.5, 98, 97.5, 97, 96.5, 96, 95.5], color: "#22c55e" },
              ].map((line, li) => {
                const maxV = 100, minV = 35, w2 = 320, h = 90, pad2 = 20
                const px2 = (i: number) => pad2 + (i / (line.values.length - 1)) * (w2 - pad2)
                const py2 = (v: number) => h - ((v - minV) / (maxV - minV)) * (h - 15) - 5
                const path = line.values.map((v, i) => `${i === 0 ? "M" : "L"} ${px2(i)} ${py2(v)}`).join(" ")
                return <path key={li} d={path} stroke={line.color} strokeWidth="2" fill="none" />
              })}
              <text x="180" y="115" fontSize="8" fill="#52525b" textAnchor="middle" fontFamily="monospace">10 последовательных убыточных сделок</text>
              <text x="20" y="12" fontSize="7" fill="#fca5a5" fontFamily="monospace">-10%/сд: капитал $39</text>
              <text x="20" y="52" fontSize="7" fill="#fde68a" fontFamily="monospace">-2%/сд: капитал $83.5</text>
              <text x="20" y="72" fontSize="7" fill="#86efac" fontFamily="monospace">-0.5%/сд: капитал $95.5</text>
            </svg>
          </div>
          <div className="bg-zinc-900 border border-red-500/20 rounded-xl p-4">
            <div className="text-red-400 font-orbitron text-xs font-bold mb-2">Математика ловушки</div>
            <p className="text-zinc-400 text-xs font-space-mono leading-relaxed">Потеряли 50% — нужно заработать 100% чтобы вернуться. Потеряли 25% — нужно 33%. Именно поэтому главное правило — не потерять много, а не заработать много.</p>
          </div>
        </div>
      )
    },
    {
      title: "Соотношение риск/прибыль (R:R): математика прибыльности",
      content: (
        <div className="space-y-3">
          <p className="text-gray-300 leading-relaxed">R:R позволяет быть прибыльным даже с низким процентом выигрышей. Это контр-интуитивно, но математически верно.</p>
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
            <div className="text-yellow-400 font-orbitron text-xs font-bold mb-2">Реальный пример: 35% побед — и плюс</div>
            <p className="text-zinc-400 text-xs font-space-mono leading-relaxed">Профессиональный трейдер Иван публично ведёт статистику: win rate 35%, но средний R:R 1:3.8. За 100 сделок: 35 прибыльных × 3.8R = +133R. 65 убыточных × 1R = -65R. Итого: <span className="text-white">+68R чистой прибыли</span>. Большинство новичков смотрят на win rate как на главный показатель — это грубая ошибка. Важна математика на длинной дистанции.</p>
          </div>
          <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4">
            <div className="text-purple-400 font-orbitron text-xs font-bold mb-2">Из жизни профессионалов: Питер Брандт и R:R как основа системы</div>
            <p className="text-zinc-300 text-xs font-space-mono leading-relaxed">
              Питер Брандт — ветеран трейдинга с 1975 года, публично ведёт статистику своих сделок в Twitter/X —
              регулярно демонстрирует win rate около 40–45%, при этом показывая устойчивую прибыль за десятилетия.
              Его секрет: средний R:R около 1:2.5–3. «Я проигрываю больше сделок, чем выигрываю. Но математика на моей стороне».
              Это лучшее доказательство того, что win rate — второстепенный показатель. R:R и дисциплина — вот что определяет результат.
            </p>
          </div>
          <RRTable />
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
            <div className="text-white font-orbitron text-xs font-bold mb-3">Пример расчёта прибыльности за 100 сделок</div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-space-mono">
              {[
                { rr: "1:1", win: 60, lose: 40, profit: "+20R", color: "text-yellow-400" },
                { rr: "1:2", win: 40, lose: 60, profit: "+20R", color: "text-green-400" },
                { rr: "1:3", win: 30, lose: 70, profit: "+20R", color: "text-emerald-400" },
              ].map((ex, i) => (
                <div key={i} className="bg-zinc-950 rounded-lg p-3">
                  <div className={`font-bold text-base mb-2 ${ex.color}`}>R:R = {ex.rr}</div>
                  <div className="text-green-400">{ex.win} побед × {ex.rr.split(":")[1]}R = +{ex.win * parseInt(ex.rr.split(":")[1])}R</div>
                  <div className="text-red-400">{ex.lose} потерь × 1R = -{ex.lose}R</div>
                  <div className="border-t border-zinc-800 mt-2 pt-2 text-white font-bold">Итого: {ex.profit}</div>
                </div>
              ))}
            </div>
            <p className="text-zinc-500 text-xs mt-3">При R:R 1:2 — выигрывайте только 40% сделок и всё равно будете в прибыли.</p>
          </div>
        </div>
      )
    },
    {
      title: "Торговый журнал и анализ своих сделок",
      content: (
        <div className="space-y-3">
          <p className="text-gray-300 leading-relaxed">Журнал — единственный способ расти как трейдер. Без данных нет анализа, без анализа нет роста.</p>
          <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
            <div className="text-green-400 font-orbitron text-xs font-bold mb-2">Реальный кейс: журнал изменил результат за 60 дней</div>
            <p className="text-zinc-400 text-xs font-space-mono leading-relaxed">Мария вела журнал 60 дней (82 сделки). Анализ выявил неожиданное: win rate в понедельник — 68%, в пятницу — 31% (торговала нервно перед выходными). На M15 — минус, на H1 — плюс. После 15:00 по МСК — только убытки. Она просто убрала торговлю по пятницам и после 15:00. <span className="text-white">Следующие 60 дней: win rate вырос с 44% до 58%</span> без изменения стратегии.</p>
          </div>
          <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-4">
            <div className="text-orange-400 font-orbitron text-xs font-bold mb-2">Из жизни профессионалов: Рэй Далио и «петля обратной связи»</div>
            <p className="text-zinc-300 text-xs font-space-mono leading-relaxed">
              Рэй Далио, основатель Bridgewater Associates (крупнейший хедж-фонд в мире с активами $150+ млрд),
              построил всю культуру компании вокруг записи, анализа и обсуждения ошибок.
              Каждое совещание в Bridgewater записывается, каждое решение фиксируется.
              В книге «Принципы» он писал: «Боль + Размышление = Прогресс».
              Для трейдера журнал — это и есть «размышление». Без записи ошибок нет роста: мозг избирательно «забывает» проигрыши, оставляя иллюзию компетентности.
            </p>
          </div>
          <TradingJournalTemplate />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-3">
              <div className="text-white font-orbitron text-xs font-bold mb-2">Что анализировать через 50 сделок</div>
              <ul className="text-zinc-400 text-xs font-space-mono space-y-1">
                <li>→ Win Rate по каждому активу</li>
                <li>→ Средний R:R реально vs планируемый</li>
                <li>→ Лучшее время суток для торговли</li>
                <li>→ Какой тайм-фрейм даёт лучший результат</li>
                <li>→ Повторяющиеся ошибки</li>
              </ul>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-3">
              <div className="text-white font-orbitron text-xs font-bold mb-2">Психологические ошибки в журнале</div>
              <ul className="text-zinc-400 text-xs font-space-mono space-y-1">
                <li>→ Ранний выход из прибыльных сделок</li>
                <li>→ Сдвиг Stop-Loss в убыток («чуть подождать»)</li>
                <li>→ Месть рынку после серии потерь</li>
                <li>→ Слишком ранний вход без подтверждения</li>
                <li>→ Игнорирование собственного плана</li>
              </ul>
            </div>
          </div>
          <div className="bg-zinc-950 border border-green-500/20 rounded-xl p-4 space-y-4">
            <div>
              <div className="text-green-400 font-orbitron text-xs font-bold mb-2">Инструменты для ведения журнала</div>
              <p className="text-gray-300 text-sm leading-relaxed">Журнал сделок — главный инструмент роста трейдера. Без него невозможно понять, что работает, а что нет. Вот четыре подхода — от простого к профессиональному.</p>
            </div>

            {/* Google Sheets */}
            <div className="border border-zinc-700 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="text-white font-orbitron text-xs font-bold">Google Sheets / Excel</div>
                <span className="text-xs font-space-mono bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full">Бесплатно</span>
              </div>
              <p className="text-zinc-400 text-xs font-space-mono leading-relaxed">Самый доступный вариант. Гибко настраивается под любой стиль торговли. Подходит для старта — можно сделать всё самому.</p>
              <div className="bg-zinc-900 rounded-lg p-3 overflow-x-auto">
                <div className="text-zinc-500 text-xs font-space-mono mb-2">Минимальный набор колонок:</div>
                <table className="w-full text-xs font-space-mono min-w-[480px]">
                  <thead>
                    <tr className="border-b border-zinc-800">
                      {["Дата", "Актив", "Вход", "Стоп", "Тейк", "Результат", "Причина входа", "Ошибки"].map(h => (
                        <th key={h} className="text-left px-2 py-1 text-zinc-500 whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ["12.03", "BTC", "$82,400", "$80,900", "$85,000", "+$310", "Бычья дивергенция D1", "—"],
                      ["13.03", "ETH", "$2,180", "$2,050", "$2,400", "−$130", "Уровень поддержки", "Вошёл без объёма"],
                    ].map((row, i) => (
                      <tr key={i} className="border-b border-zinc-800/50">
                        {row.map((cell, j) => (
                          <td key={j} className={`px-2 py-1.5 whitespace-nowrap ${cell.startsWith("+") ? "text-green-400" : cell.startsWith("−") ? "text-red-400" : "text-zinc-300"}`}>{cell}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <a
                href="https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgVE2upms/copy"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-green-500/10 border border-green-500/30 hover:bg-green-500/20 transition-colors rounded-lg px-4 py-2.5 w-fit"
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-green-400 shrink-0">
                  <path d="M19 3H5C3.9 3 3 3.9 3 5v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14l-5-5 1.41-1.41L12 14.17l7.59-7.59L21 8l-9 9z"/>
                </svg>
                <span className="text-green-400 font-space-mono text-xs font-bold">Скопировать шаблон журнала в Google Sheets →</span>
              </a>
              <div className="flex gap-4 text-xs font-space-mono">
                <span className="text-green-400">✓ Полный контроль структуры</span>
                <span className="text-green-400">✓ Бесплатно</span>
                <span className="text-red-400">✗ Нет автоматики и графиков</span>
              </div>
            </div>

            {/* Notion */}
            <div className="border border-zinc-700 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="text-white font-orbitron text-xs font-bold">Notion</div>
                <span className="text-xs font-space-mono bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full">Бесплатно / от $10/мес</span>
              </div>
              <p className="text-zinc-400 text-xs font-space-mono leading-relaxed">Идеально для тех, кто хочет вести не только таблицу сделок, но и торговый план, разбор ошибок и заметки по рынку — всё в одном месте.</p>
              <div className="bg-zinc-900 rounded-lg p-3 space-y-2">
                <div className="text-zinc-500 text-xs font-space-mono mb-1">Что добавить в Notion сверх таблицы:</div>
                {[
                  ["Торговый план", "Правила входа, запрещённые ситуации, цели на неделю"],
                  ["Разбор ошибок", "Что пошло не так — скрин + текст + эмоции в момент"],
                  ["Недельный отчёт", "Win rate, средний RR, сколько сделок по плану"],
                  ["Психологический дневник", "Настроение перед торговлей, причины импульсивных входов"],
                ].map(([title, desc]) => (
                  <div key={title} className="flex gap-2 items-start">
                    <span className="text-blue-400 font-space-mono text-xs shrink-0">→</span>
                    <span className="text-zinc-300 text-xs font-space-mono"><span className="text-white font-bold">{title}:</span> {desc}</span>
                  </div>
                ))}
              </div>
              <div className="flex gap-4 text-xs font-space-mono">
                <span className="text-green-400">✓ Гибкость и визуальность</span>
                <span className="text-green-400">✓ Всё в одном</span>
                <span className="text-red-400">✗ Нет аналитики по сделкам</span>
              </div>
            </div>

            {/* Tradervue */}
            <div className="border border-zinc-700 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="text-white font-orbitron text-xs font-bold">Tradervue</div>
                <span className="text-xs font-space-mono bg-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded-full">от $29/мес</span>
              </div>
              <p className="text-zinc-400 text-xs font-space-mono leading-relaxed">Специализированный журнал трейдера с автоимпортом сделок из большинства брокеров. Строит статистику автоматически — без ручного ввода.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[
                  { label: "Автоимпорт", desc: "Загружает историю сделок из брокера одним файлом" },
                  { label: "Статистика по времени", desc: "В какое время суток вы торгуете лучше всего" },
                  { label: "Статистика по активам", desc: "Какие инструменты приносят прибыль, а какие — убыток" },
                  { label: "Анализ ошибок", desc: "Паттерны убыточных сделок: что их объединяет" },
                ].map(({ label, desc }) => (
                  <div key={label} className="bg-zinc-900 rounded-lg p-2">
                    <div className="text-yellow-400 text-xs font-space-mono font-bold mb-1">{label}</div>
                    <div className="text-zinc-400 text-xs font-space-mono">{desc}</div>
                  </div>
                ))}
              </div>
              <div className="flex gap-4 text-xs font-space-mono">
                <span className="text-green-400">✓ Автоматическая статистика</span>
                <span className="text-green-400">✓ Импорт из брокера</span>
                <span className="text-red-400">✗ Платный, нет крипто-брокеров</span>
              </div>
            </div>

            {/* Edgewonk */}
            <div className="border border-zinc-700 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="text-white font-orbitron text-xs font-bold">Edgewonk</div>
                <span className="text-xs font-space-mono bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded-full">€169 раз и навсегда</span>
              </div>
              <p className="text-zinc-400 text-xs font-space-mono leading-relaxed">Самый глубокий аналитический журнал для серьёзных трейдеров. Акцент не просто на записи сделок, а на поиске вашего реального «эджа» — статистического преимущества.</p>
              <div className="bg-zinc-900 rounded-lg p-3 space-y-2">
                <div className="text-zinc-500 text-xs font-space-mono mb-1">Уникальные функции Edgewonk:</div>
                {[
                  ["Tilt Meter", "Определяет момент, когда вы начинаете торговать эмоционально — по паттернам поведения"],
                  ["Trade Management Simulation", "Симулирует «что было бы», если бы вы двигали стоп иначе"],
                  ["Custom Setups", "Статистика отдельно по каждому вашему паттерну входа"],
                  ["R-Multiple анализ", "Гистограмма распределения соотношения прибыль/риск по всем сделкам"],
                ].map(([title, desc]) => (
                  <div key={title} className="flex gap-2 items-start">
                    <span className="text-purple-400 font-space-mono text-xs shrink-0">→</span>
                    <span className="text-zinc-300 text-xs font-space-mono"><span className="text-white font-bold">{title}:</span> {desc}</span>
                  </div>
                ))}
              </div>
              <div className="flex gap-4 text-xs font-space-mono">
                <span className="text-green-400">✓ Самая глубокая аналитика</span>
                <span className="text-green-400">✓ Разовая оплата</span>
                <span className="text-red-400">✗ Требует времени на освоение</span>
              </div>
            </div>

            {/* Сравнение */}
            <div className="bg-zinc-900 rounded-xl p-3 overflow-x-auto">
              <div className="text-zinc-400 font-orbitron text-xs font-bold mb-2">Что выбрать?</div>
              <table className="w-full text-xs font-space-mono min-w-[380px]">
                <thead>
                  <tr className="border-b border-zinc-800">
                    {["Инструмент", "Для кого", "Главный плюс"].map(h => (
                      <th key={h} className="text-left px-2 py-2 text-zinc-500">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800">
                  {[
                    ["Google Sheets", "Новичок, который только начинает", "Бесплатно, полный контроль"],
                    ["Notion", "Тот, кто хочет структурировать всё мышление", "Торговый план + журнал + разбор"],
                    ["Tradervue", "Акции/фьючерсы, нужна автоматика", "Импорт из брокера, готовые отчёты"],
                    ["Edgewonk", "Серьёзный трейдер, ищет своё преимущество", "Психология + глубокая статистика"],
                  ].map(([tool, who, plus]) => (
                    <tr key={tool} className="hover:bg-zinc-800/50">
                      <td className="px-2 py-2 text-white font-bold">{tool}</td>
                      <td className="px-2 py-2 text-zinc-400">{who}</td>
                      <td className="px-2 py-2 text-zinc-300">{plus}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "▲ Продвинутый уровень: формула Келли, Drawdown-анализ и портфельный риск",
      content: (
        <div className="space-y-4">
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 flex gap-2 items-center">
            <span className="text-red-400 text-lg">⚠</span>
            <p className="text-red-300 text-xs font-space-mono">Продвинутый раздел. Математика управления капиталом для опытных трейдеров с реальной статистикой сделок.</p>
          </div>
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4">
            <div className="text-white font-orbitron text-xs font-bold mb-3">Критерий Келли: оптимальный размер позиции</div>
            <p className="text-gray-300 text-sm leading-relaxed mb-3">Формула Келли рассчитывает оптимальный % капитала для каждой сделки, максимизируя рост с учётом вашей win rate и R:R. Используется хедж-фондами и профессиональными трейдерами.</p>
            <div className="bg-zinc-900 rounded-xl p-4 mb-3">
              <div className="text-purple-400 font-orbitron text-xs font-bold mb-2">Формула Келли:</div>
              <code className="block bg-zinc-950 rounded p-3 font-space-mono text-sm text-green-400 mb-2">
                K% = W - (1 - W) / R
              </code>
              <div className="text-xs font-space-mono text-zinc-400 space-y-1">
                <div><span className="text-blue-400">W</span> — Win Rate (доля прибыльных сделок, от 0 до 1)</div>
                <div><span className="text-blue-400">R</span> — отношение средней прибыли к среднему убытку (avg win / avg loss)</div>
                <div><span className="text-blue-400">K%</span> — % капитала на одну сделку</div>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-space-mono">
              {[
                { wr: "55%", r: "1.5", k: "21.7%", rec: "10.8%", color: "text-yellow-400" },
                { wr: "45%", r: "2.0", k: "17.5%", rec: "8.7%", color: "text-green-400" },
                { wr: "40%", r: "2.5", k: "16%", rec: "8%", color: "text-emerald-400" },
              ].map((ex, i) => (
                <div key={i} className="bg-zinc-900 rounded-xl p-3">
                  <div className={`font-bold mb-2 ${ex.color}`}>WR={ex.wr}, R={ex.r}</div>
                  <div className="text-zinc-300">Формула: {ex.k}</div>
                  <div className="text-zinc-500 mt-1">Рекомендую: {ex.rec}</div>
                  <div className="text-zinc-600 text-xs mt-1">(половина Келли)</div>
                </div>
              ))}
            </div>
            <div className="bg-zinc-900 border border-yellow-500/20 rounded-xl p-3 mt-3">
              <div className="text-yellow-400 font-orbitron text-xs font-bold mb-1">Важно: половина Келли</div>
              <p className="text-zinc-400 text-xs font-space-mono leading-relaxed">На практике используют половину от полного Келли (Fractional Kelly). Это снижает волатильность капитала на 50%, теряя лишь незначительную часть прироста. Полный Келли — слишком агрессивен даже для профессионалов.</p>
            </div>
            <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4 mt-3">
              <div className="text-purple-400 font-orbitron text-xs font-bold mb-2">Из жизни профессионалов: Эдвард Торп и происхождение формулы Келли</div>
              <p className="text-zinc-300 text-xs font-space-mono leading-relaxed">
                Эдвард Торп — математик, создавший первую систему счёта карт в блэкджеке и впоследствии основавший один из первых квантовых хедж-фондов Princeton/Newport Partners.
                Он первым применил критерий Келли к финансовым рынкам, показав в книге «Beat the Market» (1967), что оптимальный размер ставки математически вычислим.
                Его фонд показывал 19% годовых на протяжении 20+ лет с минимальными просадками — именно благодаря строгому соблюдению дробного критерия Келли.
                «Размер позиции — это единственное, что вы полностью контролируете», — говорил Торп.
              </p>
            </div>
          </div>
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4">
            <div className="text-white font-orbitron text-xs font-bold mb-3">Drawdown-анализ: когда остановиться</div>
            <p className="text-gray-300 text-sm leading-relaxed mb-3">Drawdown (просадка) — снижение капитала от пиковой отметки. Понимание просадок — ключ к психологической устойчивости и защите депозита.</p>
            <div className="bg-zinc-900 rounded-xl p-3 mb-3">
              <svg viewBox="0 0 360 120" className="w-full h-28">
                <polyline points="20,90 50,80 80,65 110,55 130,70 155,85 170,95 185,90 210,75 240,60 270,45 310,30 340,20" fill="none" stroke="#e5e7eb" strokeWidth="1.5" />
                <circle cx="110" cy="55" r="3" fill="#22c55e" />
                <line x1="110" y1="55" x2="110" y2="110" stroke="#22c55e" strokeWidth="0.8" strokeDasharray="3,2" />
                <text x="112" y="50" fontSize="7" fill="#22c55e" fontFamily="monospace">Пик</text>
                <circle cx="170" cy="95" r="3" fill="#ef4444" />
                <line x1="170" y1="95" x2="170" y2="110" stroke="#ef4444" strokeWidth="0.8" strokeDasharray="3,2" />
                <text x="172" y="104" fontSize="7" fill="#ef4444" fontFamily="monospace">Дно</text>
                <line x1="110" y1="55" x2="170" y2="55" stroke="#a78bfa" strokeWidth="0.8" />
                <line x1="170" y1="55" x2="170" y2="95" stroke="#a78bfa" strokeWidth="1" />
                <text x="175" y="78" fontSize="7" fill="#a78bfa" fontFamily="monospace">DD</text>
                <line x1="170" y1="55" x2="240" y2="55" stroke="#fbbf24" strokeWidth="0.8" strokeDasharray="3,2" />
                <text x="195" y="50" fontSize="7" fill="#fbbf24" fontFamily="monospace">Восстановление</text>
                <text x="100" y="118" fontSize="7" fill="#52525b" textAnchor="middle" fontFamily="monospace">Время</text>
              </svg>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs font-space-mono">
                <thead>
                  <tr className="border-b border-zinc-800">
                    {["Просадка", "Нужно заработать", "Сигнал", "Действие"].map(h => (
                      <th key={h} className="text-left px-3 py-2 text-zinc-500 whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    { dd: "5%", need: "5.3%", signal: "Норма", action: "Продолжаем торговать", color: "text-green-400" },
                    { dd: "10%", need: "11.1%", signal: "Обратить внимание", action: "Снизить объёмы на 50%", color: "text-yellow-400" },
                    { dd: "20%", need: "25%", signal: "Стоп-день/неделя", action: "Пауза, анализ ошибок", color: "text-orange-400" },
                    { dd: "30%", need: "42.8%", signal: "Критическая просадка", action: "Пауза 2+ недели, пересмотр системы", color: "text-red-400" },
                    { dd: "50%", need: "100%", signal: "Катастрофа", action: "Полная остановка, работа с психологом", color: "text-red-600" },
                  ].map((row, i) => (
                    <tr key={i} className="border-b border-zinc-900 hover:bg-zinc-900/40">
                      <td className={`px-3 py-2 font-bold ${row.color}`}>{row.dd}</td>
                      <td className="px-3 py-2 text-zinc-300">{row.need}</td>
                      <td className={`px-3 py-2 ${row.color}`}>{row.signal}</td>
                      <td className="px-3 py-2 text-zinc-400">{row.action}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4">
            <div className="text-white font-orbitron text-xs font-bold mb-3">Портфельный риск: торговля несколькими позициями</div>
            <p className="text-gray-300 text-sm leading-relaxed mb-3">При открытии нескольких позиций одновременно риски складываются. Коррелированные активы увеличивают общий портфельный риск, даже если каждая позиция маленькая.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="text-red-400 font-orbitron text-xs font-bold mb-2">Опасная ситуация</div>
                {[
                  { pos: "BTC/USDT Long", risk: "2%" },
                  { pos: "ETH/USDT Long", risk: "2%" },
                  { pos: "SOL/USDT Long", risk: "2%" },
                ].map((p, i) => (
                  <div key={i} className="flex justify-between bg-zinc-900 rounded-lg px-3 py-2 text-xs font-space-mono">
                    <span className="text-zinc-300">{p.pos}</span>
                    <span className="text-red-400">{p.risk}</span>
                  </div>
                ))}
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-2 text-xs font-space-mono text-red-300">
                  Реальный риск ≈ 6% (все упадут вместе при крипто-распродаже)
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-green-400 font-orbitron text-xs font-bold mb-2">Правильная диверсификация</div>
                {[
                  { pos: "BTC/USDT Long", risk: "2%" },
                  { pos: "GOLD/USD Long", risk: "1%" },
                  { pos: "USD/JPY Short", risk: "1%" },
                ].map((p, i) => (
                  <div key={i} className="flex justify-between bg-zinc-900 rounded-lg px-3 py-2 text-xs font-space-mono">
                    <span className="text-zinc-300">{p.pos}</span>
                    <span className="text-green-400">{p.risk}</span>
                  </div>
                ))}
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-2 text-xs font-space-mono text-green-300">
                  Реальный риск ≈ 2–3% (активы слабо коррелированы)
                </div>
              </div>
            </div>
            <div className="bg-zinc-900 border border-blue-500/20 rounded-xl p-3 mt-4">
              <div className="text-blue-400 font-orbitron text-xs font-bold mb-1">Правило максимального портфельного риска</div>
              <p className="text-zinc-400 text-xs font-space-mono leading-relaxed">Суммарный риск всех открытых позиций не должен превышать 5–6% депозита одновременно. Это защищает от «чёрных лебедей» — непредвиденных рыночных событий, которые двигают все активы сразу.</p>
            </div>
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mt-4">
              <div className="text-red-400 font-orbitron text-xs font-bold mb-2">Из жизни профессионалов: LTCM и провал портфельного риска</div>
              <p className="text-zinc-300 text-xs font-space-mono leading-relaxed">
                Long-Term Capital Management (LTCM) — хедж-фонд с двумя нобелевскими лауреатами в совете директоров — в 1998 году потерял $4.6 млрд за несколько недель.
                Причина: все позиции были коррелированы. Когда российский дефолт ударил по рынкам, упало всё сразу — акции, облигации, деривативы.
                Суммарное плечо достигало 25:1. Не хватило простого правила: «суммарный портфельный риск не должен превышать 5–6%».
                Этот случай стал учебником о том, почему диверсификация по некоррелированным активам — не теория, а вопрос выживания.
              </p>
            </div>
          </div>
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4">
            <div className="text-white font-orbitron text-xs font-bold mb-3">Ключевые метрики оценки торговой системы</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-space-mono">
              {[
                { name: "Expectancy (Матожидание)", formula: "E = (WR × avg_win) - (LR × avg_loss)", color: "text-green-400", desc: "Сколько R в среднем приносит одна сделка. Должно быть > 0. Цель: 0.3R и выше." },
                { name: "Profit Factor (PF)", formula: "PF = Gross Profit / Gross Loss", color: "text-blue-400", desc: "Отношение всей прибыли к всем убыткам. PF > 1.5 — хорошая система. PF > 2 — отличная." },
                { name: "Sharpe Ratio", formula: "SR = (Доходность - Rf) / Волатильность", color: "text-purple-400", desc: "Доходность относительно риска. SR > 1 — приемлемо. SR > 2 — профессиональный уровень." },
                { name: "Max Drawdown (MDD)", formula: "MDD = (Пик - Дно) / Пик × 100%", color: "text-red-400", desc: "Максимальная просадка за всю историю. Должна быть < 20% для комфортной торговли." },
              ].map((m, i) => (
                <div key={i} className="bg-zinc-900 rounded-xl p-3">
                  <div className={`font-bold mb-1 ${m.color}`}>{m.name}</div>
                  <code className="block bg-zinc-950 rounded px-2 py-1 text-zinc-400 mb-2 text-xs">{m.formula}</code>
                  <p className="text-zinc-500 leading-relaxed">{m.desc}</p>
                </div>
              ))}
            </div>
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 mt-4">
              <div className="text-blue-400 font-orbitron text-xs font-bold mb-2">Из жизни профессионалов: Бернард Мэдофф и фальшивый Sharpe Ratio</div>
              <p className="text-zinc-300 text-xs font-space-mono leading-relaxed">
                Мошенник Берни Мэдофф привлекал инвесторов именно фантастическими метриками: стабильные 10–12% годовых, минимальная просадка, Sharpe Ratio выше 3.
                Настоящие профессионалы — Гарри Маркополос и команда аналитиков Bear Stearns — подозревали обман именно потому, что «слишком хорошие» метрики в реальных рыночных условиях невозможны.
                Урок: понимание нормальных значений Sharpe Ratio и MDD защищает не только от собственных ошибок, но и от чужого мошенничества.
                Реальный Medallion Fund (Renaissance) показывает SR ≈ 2.5. Это считается выдающимся результатом.
              </p>
            </div>
          </div>
        </div>
      )
    },
  ]
}

export const articlesRisk: Article[] = [articleRisk]