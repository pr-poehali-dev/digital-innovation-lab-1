import React from "react"
import type { Article } from "./TradingArticleTypes"

export const articlePsychology: Article = {
  id: "psychology",
  badge: "Глава 6",
  title: "Психология трейдинга: как не мешать самому себе",
  summary: "Стратегия определяет, есть ли у вас преимущество. Психология определяет, сможете ли вы им воспользоваться. Большинство трейдеров проигрывают не рынку — они проигрывают себе.",
  sections: [
    {
      title: "Два врага трейдера: страх и жадность",
      content: (
        <div className="space-y-3">
          <p className="text-gray-300 leading-relaxed">
            Уоррен Баффетт сформулировал главный принцип поведения на рынке лаконично: «Бойтесь, когда другие жадны, и будьте жадны, когда другие боятся».
            Звучит просто. Выполнять — крайне сложно, потому что наш мозг устроен ровно наоборот.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
              <div className="text-red-400 font-orbitron text-xs font-bold mb-2">Страх — враг №1</div>
              <div className="space-y-2 text-xs font-space-mono text-zinc-400">
                <div className="flex gap-2"><span className="text-red-400">→</span><span>Выход из прибыльной сделки слишком рано («а вдруг развернётся»)</span></div>
                <div className="flex gap-2"><span className="text-red-400">→</span><span>Пропуск хороших сетапов («боюсь ошибиться»)</span></div>
                <div className="flex gap-2"><span className="text-red-400">→</span><span>Сдвиг стоп-лосса в убыток («не хочу фиксировать потерю»)</span></div>
                <div className="flex gap-2"><span className="text-red-400">→</span><span>Паника и закрытие позиций на дне</span></div>
              </div>
            </div>
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
              <div className="text-yellow-400 font-orbitron text-xs font-bold mb-2">Жадность — враг №2</div>
              <div className="space-y-2 text-xs font-space-mono text-zinc-400">
                <div className="flex gap-2"><span className="text-yellow-400">→</span><span>Увеличение ставки после серии побед («я поймал волну»)</span></div>
                <div className="flex gap-2"><span className="text-yellow-400">→</span><span>Вход без сигнала («надо же что-то делать»)</span></div>
                <div className="flex gap-2"><span className="text-yellow-400">→</span><span>Удержание убыточной позиции («должно отрасти»)</span></div>
                <div className="flex gap-2"><span className="text-yellow-400">→</span><span>FOMO — вход на хаях из-за страха пропустить движение</span></div>
              </div>
            </div>
          </div>
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
            <div className="text-blue-400 font-orbitron text-xs font-bold mb-2">Из жизни профессионалов: Джесси Ливермор и «рынок мести»</div>
            <p className="text-zinc-300 text-xs font-space-mono leading-relaxed">
              Джесси Ливермор трижды терял многомиллионные состояния — и каждый раз по одной причине: «торговля мести».
              После убыточной позиции он нарушал собственные правила, увеличивал размер, торговал чаще — пытаясь «отыграться» у рынка.
              «Рынок никому не должен. Мстить ему так же бессмысленно, как мстить океану за шторм», — написал он в мемуарах.
              Осознание страха и жадности как физиологических реакций мозга — первый шаг к профессиональной торговле.
            </p>
          </div>
          <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4">
            <div className="text-purple-400 font-orbitron text-xs font-bold mb-2">Из жизни профессионалов: Дэниел Канеман и «система 1 vs система 2»</div>
            <p className="text-zinc-300 text-xs font-space-mono leading-relaxed">
              Нобелевский лауреат по экономике Дэниел Канеман описал два режима мышления человека.
              «Система 1» — быстрая, интуитивная, эмоциональная: именно она кричит «покупай!» на хаях и «продавай!» на паниках.
              «Система 2» — медленная, аналитическая, логическая: она следует правилам и чеклистам.
              Профессиональный трейдер — это человек, научившийся в критические моменты переключаться на Систему 2.
              Торговый план и чеклист — это буквально инструмент принудительного включения Системы 2.
            </p>
          </div>
        </div>
      )
    },
    {
      title: "FOMO и торговля «на эмоциях»: как распознать и остановить",
      content: (
        <div className="space-y-3">
          <p className="text-gray-300 leading-relaxed">
            FOMO (Fear Of Missing Out) — страх пропустить движение. Один из самых дорогих эмоциональных паттернов в трейдинге.
            Он заставляет входить поздно, без сигнала, с завышенным риском.
          </p>
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4">
            <div className="text-white font-orbitron text-xs font-bold mb-3">Симптомы FOMO-входа</div>
            <div className="space-y-2">
              {[
                { sign: "Цена уже выросла на 10–15%", risk: "Вы покупаете у тех, кто продаёт с прибылью", color: "text-red-400" },
                { sign: "Вход без чёткого сигнала", risk: "«Все покупают» — не является торговым сигналом", color: "text-orange-400" },
                { sign: "Размер ставки выше обычного", risk: "Жадность отключила риск-менеджмент", color: "text-yellow-400" },
                { sign: "Нет плана выхода", risk: "Вы не знаете, где стоп и где тейк", color: "text-red-400" },
              ].map((item, i) => (
                <div key={i} className="flex gap-3 items-start bg-zinc-900 border border-zinc-800 rounded-lg p-3">
                  <div className={`text-xs font-space-mono ${item.color} shrink-0 mt-0.5`}>✗</div>
                  <div>
                    <div className={`font-orbitron text-xs font-bold mb-0.5 ${item.color}`}>{item.sign}</div>
                    <p className="text-zinc-500 text-xs font-space-mono">{item.risk}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-zinc-900 border border-green-500/20 rounded-xl p-4">
            <div className="text-green-400 font-orbitron text-xs font-bold mb-2">Правило «5-минутной паузы»</div>
            <p className="text-zinc-400 text-xs font-space-mono leading-relaxed">
              Почувствовали FOMO — обязательно подождите 5 минут. Встаньте, выйдите из комнаты, сделайте чай.
              Если через 5 минут всё ещё есть чёткий сетап по вашим правилам — можно рассматривать вход.
              Если нет — значит, это было FOMO, а не сигнал. Рынок даст следующую возможность.
            </p>
          </div>
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
            <div className="text-yellow-400 font-orbitron text-xs font-bold mb-2">Из жизни профессионалов: Джордж Сорос и умение «ничего не делать»</div>
            <p className="text-zinc-300 text-xs font-space-mono leading-relaxed">
              Джордж Сорос в своей книге «Алхимия финансов» описывал периоды, когда лучшая сделка — никакой сделки.
              «Я заработал деньги на нескольких крупных ставках. Остальное время я просто ждал».
              Он открыто говорил, что умение сидеть в кэше и ничего не делать — один из самых сложных и прибыльных навыков.
              По его оценке, более 70% его времени занимало именно ожидание — наблюдение и подготовка, а не активная торговля.
            </p>
          </div>
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
            <div className="text-blue-400 font-orbitron text-xs font-bold mb-2">Из жизни профессионалов: Марк Дуглас и «вероятностное мышление»</div>
            <p className="text-zinc-300 text-xs font-space-mono leading-relaxed">
              Марк Дуглас в «Трейдинге в зоне» объяснял: FOMO возникает из убеждения, что «эта сделка — особенная, и её нельзя пропустить».
              Профессионал думает иначе: «Это просто одна из следующих 100 сделок. Если я пропущу её — ничего не изменится».
              Именно это «вероятностное мышление» убивает FOMO: любая конкретная сделка перестаёт казаться уникальной возможностью.
              Рынок работает каждый день. Возможности будут всегда.
            </p>
          </div>
        </div>
      )
    },
    {
      title: "Торговый план: как создать и почему он работает",
      content: (
        <div className="space-y-3">
          <p className="text-gray-300 leading-relaxed">
            Торговый план — это ваша конституция. Написан заранее, в спокойном состоянии. Во время торговли вы не принимаете решений — вы только следуете плану.
          </p>
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4">
            <div className="text-white font-orbitron text-xs font-bold mb-3">Структура торгового плана</div>
            <div className="space-y-2">
              {[
                { n: "01", title: "Рынок и инструмент", desc: "Какой актив торгую, в какое время (сессии), какой тайм-фрейм", color: "text-blue-400" },
                { n: "02", title: "Условия входа", desc: "Точный набор условий: тренд + уровень + индикатор. Если не все — не вхожу", color: "text-purple-400" },
                { n: "03", title: "Размер позиции", desc: "Риск 1–2% на сделку. Формула расчёта. Максимальный дневной убыток", color: "text-red-400" },
                { n: "04", title: "Место стоп-лосса", desc: "Где стоп — за уровень, за структуру, фиксированный %", color: "text-orange-400" },
                { n: "05", title: "Цель (Take Profit)", desc: "Минимальный R:R 1:2. Частичная фиксация или полный выход", color: "text-green-400" },
                { n: "06", title: "Правила остановки", desc: "3 убытка подряд = стоп на день. -6% от депо = стоп на день", color: "text-yellow-400" },
                { n: "07", title: "Запрещённые действия", desc: "Торговля без сигнала, сдвиг стопа, увеличение после убытка", color: "text-zinc-400" },
              ].map((item, i) => (
                <div key={i} className="flex gap-3 items-start bg-zinc-900 border border-zinc-800 rounded-lg p-3">
                  <div className={`font-orbitron text-xs font-bold ${item.color} w-6 shrink-0`}>{item.n}</div>
                  <div>
                    <div className={`font-orbitron text-xs font-bold mb-0.5 ${item.color}`}>{item.title}</div>
                    <p className="text-zinc-500 text-xs font-space-mono">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
            <div className="text-green-400 font-orbitron text-xs font-bold mb-2">Из жизни профессионалов: Рэй Далио и «принципы» как торговый план</div>
            <p className="text-zinc-300 text-xs font-space-mono leading-relaxed">
              Рэй Далио потратил 30 лет на создание своих «Принципов» — детальных правил принятия решений в любой ситуации.
              Его подход: задокументировать каждое правило, которое привело к успеху, и следовать ему автоматически.
              «Когда ты принимаешь решение в момент стресса — ты принимаешь плохое решение. Хорошие решения принимаются заранее».
              Именно поэтому Bridgewater Associates превратила торговые правила в алгоритмы: чтобы исключить человеческие эмоции из процесса.
            </p>
          </div>
          <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-4">
            <div className="text-orange-400 font-orbitron text-xs font-bold mb-2">Из жизни профессионалов: Ричард Деннис и «Черепахи» — система вместо интуиции</div>
            <p className="text-zinc-300 text-xs font-space-mono leading-relaxed">
              В 1983 году Ричард Деннис поспорил, что можно научить любого человека торговать прибыльно — если дать ему чёткий план.
              Он взял 13 человек без опыта, за 2 недели передал им торговый план («Систему Черепах») и дал реальные деньги.
              За 5 лет они заработали суммарно $175 млн. Большинство следовало плану без исключений.
              Те, кто отступал от правил «по интуиции», — теряли деньги. Это доказательство: план важнее интуиции.
            </p>
          </div>
        </div>
      )
    },
    {
      title: "Серии проигрышей: как пережить и не сломаться",
      content: (
        <div className="space-y-3">
          <p className="text-gray-300 leading-relaxed">
            Серии убытков — нормальная часть любой торговой системы. Даже при win rate 60% возможны серии из 8–10 проигрышей подряд.
            Как вы реагируете на просадку — определяет долгосрочный результат.
          </p>
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4">
            <div className="text-white font-orbitron text-xs font-bold mb-3">Вероятность серий проигрышей при разном Win Rate</div>
            <div className="space-y-2">
              {[
                { wr: "60%", streak5: "1.02%", streak8: "0.17%", streak10: "0.04%" },
                { wr: "55%", streak5: "1.84%", streak8: "0.42%", streak10: "0.12%" },
                { wr: "50%", streak5: "3.13%", streak8: "0.78%", streak10: "0.25%" },
              ].map((row, i) => (
                <div key={i} className="flex items-center gap-2 text-xs font-space-mono">
                  <span className="text-purple-400 font-bold w-12 shrink-0">WR {row.wr}</span>
                  <div className="flex-1 grid grid-cols-3 gap-2">
                    <div className="bg-zinc-900 rounded p-1.5 text-center">
                      <div className="text-zinc-500 text-xs">5 подряд</div>
                      <div className="text-yellow-400 font-bold">{row.streak5}</div>
                    </div>
                    <div className="bg-zinc-900 rounded p-1.5 text-center">
                      <div className="text-zinc-500 text-xs">8 подряд</div>
                      <div className="text-orange-400 font-bold">{row.streak8}</div>
                    </div>
                    <div className="bg-zinc-900 rounded p-1.5 text-center">
                      <div className="text-zinc-500 text-xs">10 подряд</div>
                      <div className="text-red-400 font-bold">{row.streak10}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-zinc-500 text-xs font-space-mono mt-3">При 1000 сделках с WR 55% серия из 8 убытков случится ~4 раза. Это норма, не катастрофа.</p>
          </div>
          <div className="space-y-2">
            {[
              {
                step: "1",
                title: "Снизьте размер позиции вдвое",
                desc: "При серии из 3+ убытков — уменьшите ставку до 1%. Это сохранит капитал и снизит эмоциональный стресс.",
                color: "text-blue-400",
                border: "border-blue-500/30"
              },
              {
                step: "2",
                title: "Сделайте паузу и проверьте систему",
                desc: "Проанализируйте последние сделки: вы нарушали правила? Изменился рынок? Система сломана или просто полоса?",
                color: "text-yellow-400",
                border: "border-yellow-500/30"
              },
              {
                step: "3",
                title: "Не меняйте систему в просадке",
                desc: "Самая частая ошибка — менять стратегию в момент убытков. Это гарантированный способ потерять ещё больше.",
                color: "text-red-400",
                border: "border-red-500/30"
              },
              {
                step: "4",
                title: "Возвращайтесь постепенно",
                desc: "После паузы — сначала торгуйте минимальным лотом. Восстановите уверенность на малых ставках, потом возвращайтесь к обычному размеру.",
                color: "text-green-400",
                border: "border-green-500/30"
              },
            ].map((item, i) => (
              <div key={i} className={`flex gap-3 items-start bg-zinc-900 border ${item.border} rounded-lg p-3`}>
                <div className={`font-orbitron text-sm font-bold ${item.color} shrink-0 w-5`}>{item.step}</div>
                <div>
                  <div className={`font-orbitron text-xs font-bold mb-1 ${item.color}`}>{item.title}</div>
                  <p className="text-zinc-400 text-xs font-space-mono leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4">
            <div className="text-purple-400 font-orbitron text-xs font-bold mb-2">Из жизни профессионалов: Брюс Ковнер — «я просто жду»</div>
            <p className="text-zinc-300 text-xs font-space-mono leading-relaxed">
              Брюс Ковнер — управляющий Caxton Associates ($14 млрд), один из самых прибыльных макро-трейдеров мира —
              рассказывал, что в периоды убытков он не торговал активнее, а, наоборот, полностью останавливался.
              «Когда у меня просадка 10% — я закрываю все позиции и просто смотрю. Жду, пока не почувствую ясность».
              За 28 лет управления Caxton он не показал ни одного убыточного года. Умение остановиться — часть этого результата.
            </p>
          </div>
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
            <div className="text-red-400 font-orbitron text-xs font-bold mb-2">Из жизни профессионалов: Пол Тюдор Джонс — правило «5%»</div>
            <p className="text-zinc-300 text-xs font-space-mono leading-relaxed">
              Пол Тюдор Джонс публично говорил о своём железном правиле: если за день потеряно 5% капитала — торговля на сегодня закончена.
              «Я не торгую, когда я в минусе на 5%. Потому что знаю: в таком состоянии я приму плохие решения».
              Он также снижал размер позиций после каждого убыточного периода — автоматически, без дискуссий.
              Это позволяло ему «пережить» плохие полосы с минимальными потерями и вернуться в игру свежим.
            </p>
          </div>
        </div>
      )
    },
    {
      title: "▲ Продвинутый уровень: нейронаука трейдинга и состояние потока",
      content: (
        <div className="space-y-4">
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 flex gap-2 items-center">
            <span className="text-red-400 text-lg">⚠</span>
            <p className="text-red-300 text-xs font-space-mono">Продвинутый раздел. Нейробиология принятия решений и техники достижения пикового состояния в трейдинге.</p>
          </div>
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4">
            <div className="text-white font-orbitron text-xs font-bold mb-3">Нейробиология убытков: почему потери больнее побед</div>
            <p className="text-gray-300 text-sm leading-relaxed mb-3">
              Исследования нобелевских лауреатов Канемана и Тверски показали: потеря $100 вызывает в 2–2.5 раза более сильную эмоциональную реакцию, чем выигрыш $100.
              Это «Loss Aversion» (неприятие потерь) — эволюционный механизм, который спасал людей тысячи лет, но в трейдинге убивает результаты.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { title: "Loss Aversion в трейдинге", color: "text-red-400", bc: "border-red-500/20 bg-red-500/5", desc: "Трейдер держит убыточную позицию слишком долго (не хочет фиксировать потерю), но слишком рано выходит из прибыльной (боится «отдать» прибыль). Результат: маленькие победы, большие поражения." },
                { title: "Дофамин и азарт", color: "text-yellow-400", bc: "border-yellow-500/20 bg-yellow-500/5", desc: "Победная сделка выбрасывает дофамин. Мозг хочет повторения. Следующая сделка открывается быстрее, с большим риском. Именно так работает игровая зависимость — и именно так проигрываются депозиты." },
                { title: "Кортизол и страх", color: "text-blue-400", bc: "border-blue-500/20 bg-blue-500/5", desc: "В период убытков кортизол (гормон стресса) нарушает работу префронтальной коры — части мозга, отвечающей за рациональное мышление. Буквально: стресс делает вас глупее. Пауза — это нейробиологическая необходимость." },
              ].map((item, i) => (
                <div key={i} className={`border rounded-xl p-3 ${item.bc}`}>
                  <div className={`font-orbitron text-xs font-bold mb-2 ${item.color}`}>{item.title}</div>
                  <p className="text-zinc-400 text-xs font-space-mono leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 mt-3">
              <div className="text-blue-400 font-orbitron text-xs font-bold mb-2">Из жизни профессионалов: Дэниел Канеман и поведенческая экономика рынков</div>
              <p className="text-zinc-300 text-xs font-space-mono leading-relaxed">
                Дэниел Канеман получил Нобелевскую премию по экономике в 2002 году именно за открытие Loss Aversion и систематических ошибок мышления в финансовых решениях.
                Он показал, что люди принимают иррациональные финансовые решения предсказуемо и повторяемо — не случайно.
                «Мы не рациональны. Мы рационализируем», — говорил Канеман.
                Понимание своих когнитивных ошибок не устраняет их полностью, но позволяет создавать системы защиты от них — торговый план, чеклисты, дневник.
              </p>
            </div>
          </div>
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4">
            <div className="text-white font-orbitron text-xs font-bold mb-3">Состояние потока в трейдинге: как его достичь</div>
            <p className="text-gray-300 text-sm leading-relaxed mb-3">
              Состояние потока (Flow State) — термин психолога Михая Чиксентмихайи. Полное погружение в задачу, отсутствие эмоционального шума, решения принимаются легко и правильно.
              Лучшие трейдеры описывают его так: «Я просто следовал правилам, не думая. Всё шло само».
            </p>
            <div className="space-y-2">
              {[
                { cond: "Физическое состояние", detail: "Сон 7–8 часов. Нет кофеинового перевозбуждения. Лёгкая физическая активность до сессии", color: "text-green-400" },
                { cond: "Ментальная подготовка", detail: "5–10 минут медитации или тихого анализа перед торговлей. Чёткий план на день", color: "text-blue-400" },
                { cond: "Чистое рабочее место", detail: "Закрытые соцсети, телеграм-каналы, новости. Только графики и план", color: "text-purple-400" },
                { cond: "Правильный масштаб", detail: "Торгуйте суммой, потеря которой не вызывает паники. Если сумма слишком большая — вы торгуете страхом", color: "text-yellow-400" },
                { cond: "После торговли", detail: "Записать результат в журнал. Оценить: следовал ли плану? Отметить эмоциональные отклонения", color: "text-orange-400" },
              ].map((item, i) => (
                <div key={i} className="flex gap-3 items-start bg-zinc-900 border border-zinc-800 rounded-lg p-3">
                  <div className={`font-orbitron text-xs font-bold ${item.color} shrink-0 w-32`}>{item.cond}</div>
                  <p className="text-zinc-400 text-xs font-space-mono leading-relaxed">{item.detail}</p>
                </div>
              ))}
            </div>
            <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 mt-3">
              <div className="text-green-400 font-orbitron text-xs font-bold mb-2">Из жизни профессионалов: Стив Коэн и «психология как конкурентное преимущество»</div>
              <p className="text-zinc-300 text-xs font-space-mono leading-relaxed">
                Стив Коэн — основатель SAC Capital (впоследствии Point72), один из самых результативных трейдеров Уолл-стрит —
                нанял штатного психолога для всех трейдеров фонда. Это было неслыханно в 1990-х.
                «Разница между хорошим и выдающимся трейдером — не в стратегии. Она в голове».
                Работа с психологом помогала трейдерам SAC быстрее выходить из состояния стресса после убытков и поддерживать стабильность принятия решений.
                Сегодня психологическая подготовка — стандарт во всех топовых хедж-фондах.
              </p>
            </div>
          </div>
        </div>
      )
    }
  ]
}

export const articlesPsychology: Article[] = [articlePsychology]
