import React from "react"
import {
  CandlestickChart,
  SupportResistanceChart,
  TimeframeTable,
  CandlePatternCards,
} from "./TradingCharts"
import type { Article } from "./TradingArticleTypes"

export const articleAnalysis: Article = {
  id: "analysis",
  badge: "Глава 3",
  title: "Технический анализ: основы чтения графиков",
  summary: "Технический анализ — изучение исторических данных о цене и объёме для прогнозирования будущих движений. Используется большинством трейдеров во всех рынках.",
  sections: [
    {
      title: "Тайм-фреймы и стили торговли",
      content: (
        <div className="space-y-3">
          <p className="text-gray-300 leading-relaxed">Выбор тайм-фрейма определяет вашу жизнь как трейдера: сколько времени тратить, какой стресс испытывать, какой капитал нужен.</p>
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
            <div className="text-yellow-400 font-orbitron text-xs font-bold mb-2">Реальный пример: один актив, два тайм-фрейма — два разных взгляда</div>
            <p className="text-zinc-400 text-xs font-space-mono leading-relaxed">2 ноября 2023. На M15 ETH выглядит медвежьим: несколько красных свечей, RSI в зоне 35. На D1 — явный бычий тренд, ETH отбивается от поддержки $1,820 четвёртый раз. Трейдер, смотревший только M15, зашортил. Трейдер, работавший по D1+H4, купил. Через 3 дня ETH вырос до $2,050. Вывод: <span className="text-white">старший ТФ определяет направление, младший — точку входа.</span></p>
          </div>
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
            <div className="text-blue-400 font-orbitron text-xs font-bold mb-2">Из жизни профессионалов: Александр Элдер и «тройной экран»</div>
            <p className="text-zinc-300 text-xs font-space-mono leading-relaxed">
              Александр Элдер — психиатр, ставший трейдером, автор книги «Как играть и выигрывать на бирже» —
              разработал систему «Тройной экран»: три тайм-фрейма для одной сделки.
              Недельный график определяет направление, дневной — момент входа, часовой — точную цену.
              Он описывал это так: «Никогда не торгуй в направлении, противоположном недельному тренду — это как плыть против течения реки».
              Его метод стал стандартом для мультитаймфреймного анализа у тысяч профессионалов.
            </p>
          </div>
          <TimeframeTable />
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
            <div className="text-white font-orbitron text-xs font-bold mb-2">Принцип «сверху вниз» (Top-Down Analysis)</div>
            <div className="flex items-center gap-2 text-xs font-space-mono text-zinc-400">
              <div className="bg-blue-500/20 border border-blue-500/30 rounded px-2 py-1 text-blue-300">W1: Тренд</div>
              <span className="text-zinc-600">→</span>
              <div className="bg-purple-500/20 border border-purple-500/30 rounded px-2 py-1 text-purple-300">D1: Контекст</div>
              <span className="text-zinc-600">→</span>
              <div className="bg-yellow-500/20 border border-yellow-500/30 rounded px-2 py-1 text-yellow-300">H4: Зона входа</div>
              <span className="text-zinc-600">→</span>
              <div className="bg-green-500/20 border border-green-500/30 rounded px-2 py-1 text-green-300">H1: Точный вход</div>
            </div>
            <p className="text-zinc-500 text-xs mt-2">Никогда не торгуйте «против» старшего тайм-фрейма — это один из главных принципов технического анализа.</p>
          </div>
        </div>
      )
    },
    {
      title: "Японские свечи: паттерны разворота",
      content: (
        <div className="space-y-3">
          <p className="text-gray-300 leading-relaxed">Японские свечи придумали рисовые трейдеры в Японии XVII века. Сегодня это стандарт во всём мире. Каждая свеча рассказывает о борьбе быков и медведей за период.</p>
          <CandlestickChart />
          <CandlePatternCards />
          <div className="bg-zinc-900 border border-yellow-500/20 rounded-xl p-4">
            <div className="text-yellow-400 font-orbitron text-xs font-bold mb-2">Важное правило</div>
            <p className="text-zinc-400 text-xs font-space-mono leading-relaxed">Паттерн свечи — это предположение, а не гарантия. Всегда ждите подтверждения: следующая свеча должна подтвердить разворот, а объём должен быть выше среднего. Без подтверждения — это просто красивая картинка.</p>
          </div>
          <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
            <div className="text-green-400 font-orbitron text-xs font-bold mb-2">Реальный кейс: Молот на поддержке SOL, октябрь 2023</div>
            <p className="text-zinc-400 text-xs font-space-mono leading-relaxed">SOL торговался в нисходящем тренде, достиг зоны поддержки $17.80. На D1 появился классический Молот: тело наверху, длинная нижняя тень вдвое длиннее тела, объём в 2.3x выше среднего. Следующая свеча — уверенный бычий бар. Трейдеры, дождавшиеся подтверждения, вошли по $19.50. Через 6 недель SOL торговался по $58. Без подтверждения — часть зашла на первой свече и вышла в безубыток при первом откате.</p>
          </div>
          <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4">
            <div className="text-purple-400 font-orbitron text-xs font-bold mb-2">Из жизни профессионалов: Стив Нисон и возрождение свечного анализа</div>
            <p className="text-zinc-300 text-xs font-space-mono leading-relaxed">
              Стив Нисон — американский аналитик, который в 1991 году познакомил западных трейдеров с японскими свечами через книгу «Japanese Candlestick Charting Techniques» —
              рассказывал, что японские рисовые торговцы использовали свечные паттерны ещё в XVIII веке.
              Мунэхиса Хомма, легендарный японский трейдер, сколотил огромное состояние на рисовой бирже именно благодаря психологическому анализу паттернов.
              Нисон предупреждал: «Японцы никогда не использовали свечи изолированно — всегда в контексте уровней и тренда».
            </p>
          </div>
        </div>
      )
    },
    {
      title: "Уровни поддержки и сопротивления",
      content: (
        <div className="space-y-3">
          <p className="text-gray-300 leading-relaxed">Уровни — основа технического анализа. Цена «помнит» исторические уровни и часто возвращается к ним снова и снова.</p>
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
            <div className="text-blue-400 font-orbitron text-xs font-bold mb-2">Реальный пример: $30,000 как ключевой уровень BTC</div>
            <p className="text-zinc-400 text-xs font-space-mono leading-relaxed">Уровень $30,000 для Bitcoin держался как поддержка в июле 2021, был пробит в июне 2022 (стал сопротивлением), снова стал поддержкой в марте–июне 2023 (четыре отбоя от него за 3 месяца). Трейдеры, знавшие об этом уровне, имели чёткие зоны покупки и продажи вместо «торговли наугад».</p>
          </div>
          <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-4">
            <div className="text-orange-400 font-orbitron text-xs font-bold mb-2">Из жизни профессионалов: Виктор Сперандео и уровни поддержки</div>
            <p className="text-zinc-300 text-xs font-space-mono leading-relaxed">
              Виктор Сперандео («Трейдер Вик») — управляющий, показавший 70.7% среднегодовой доходности за 18 лет без убыточного года —
              строил всю свою торговлю вокруг ключевых уровней и линий тренда.
              Его книга «Trader Vic: Methods of a Wall Street Master» описывает метод «1-2-3»: уровень пробивается, цена возвращается к нему (тест), и только потом начинается настоящее движение.
              «Самые надёжные уровни — те, которые рынок проверял много раз», — утверждал он.
            </p>
          </div>
          <SupportResistanceChart />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-3">
              <div className="text-green-400 font-orbitron text-xs font-bold mb-1">Поддержка</div>
              <p className="text-zinc-400 text-xs">Уровень, где покупатели «защищают» цену. Много раз останавливал падение. Хорошее место для покупки.</p>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-3">
              <div className="text-red-400 font-orbitron text-xs font-bold mb-1">Сопротивление</div>
              <p className="text-zinc-400 text-xs">Уровень, где продавцы «давят» цену вниз. Много раз тормозил рост. Хорошее место для продажи.</p>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-3">
              <div className="text-yellow-400 font-orbitron text-xs font-bold mb-1">Смена ролей</div>
              <p className="text-zinc-400 text-xs">После пробоя поддержка становится сопротивлением и наоборот. Это одна из самых надёжных закономерностей в ТА.</p>
            </div>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
            <div className="text-white font-orbitron text-xs font-bold mb-2">Как определять сильные уровни</div>
            <ul className="text-zinc-400 text-xs font-space-mono space-y-1 list-none">
              <li>→ Минимум 2–3 касания — слабый уровень, 4+ — сильный</li>
              <li>→ Много объёма при формировании уровня — он значимее</li>
              <li>→ Психологические числа: $40,000, $50,000, $100 — работают как магниты</li>
              <li>→ Уровни на D1 и W1 сильнее, чем на M15 или H1</li>
              <li>→ Недельные и месячные закрытия цены — особенно важные уровни</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      title: "▲ Продвинутый уровень: VSA, ложные пробои и объёмный анализ",
      content: (
        <div className="space-y-4">
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 flex gap-2 items-center">
            <span className="text-red-400 text-lg">⚠</span>
            <p className="text-red-300 text-xs font-space-mono">Продвинутый раздел. Требует знания основ теханализа, японских свечей и уровней поддержки/сопротивления.</p>
          </div>
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4">
            <div className="text-white font-orbitron text-xs font-bold mb-3">VSA (Volume Spread Analysis) — анализ объёма и спреда</div>
            <p className="text-gray-300 text-sm leading-relaxed mb-3">VSA — методология чтения рынка через соотношение объёма торгов и диапазона (спреда) свечи. Позволяет понять, что делают «умные деньги», ещё до движения цены.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { title: "Ап-бар с высоким объёмом", color: "text-green-400", bc: "border-green-500/20 bg-green-500/5", desc: "Большая бычья свеча + высокий объём. Сила покупателей подтверждена. Признак продолжения или начала роста. Если появляется на уровне поддержки — очень сильный сигнал." },
                { title: "Даун-бар с низким объёмом", color: "text-blue-400", bc: "border-blue-500/20 bg-blue-500/5", desc: "Падение на низком объёме = нет давления продавцов. Вероятный разворот или коррекция. Рынок просто «сползает» без участия крупных игроков — слабость." },
                { title: "No Demand (нет спроса)", color: "text-yellow-400", bc: "border-yellow-500/20 bg-yellow-500/5", desc: "Бычья свеча с узким спредом и низким объёмом на вершине тренда. Покупатели иссякли. Медведи скоро возьмут контроль. Сигнал к выходу из лонга." },
                { title: "No Supply (нет предложения)", color: "text-purple-400", bc: "border-purple-500/20 bg-purple-500/5", desc: "Медвежья свеча с узким спредом и низким объёмом на дне. Продавцы закончились. Сигнал к потенциальному развороту вверх. Ищем подтверждение бычьим баром." },
              ].map((item, i) => (
                <div key={i} className={`border rounded-xl p-3 ${item.bc}`}>
                  <div className={`font-orbitron text-xs font-bold mb-1 ${item.color}`}>{item.title}</div>
                  <p className="text-zinc-400 text-xs font-space-mono leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4">
            <div className="text-white font-orbitron text-xs font-bold mb-3">Ложные пробои (Fakeout / Stop Hunt)</div>
            <p className="text-gray-300 text-sm leading-relaxed mb-3">Ложный пробой — одна из самых частых ловушек для розничных трейдеров. Цена пробивает уровень, провоцируя вход, а затем разворачивается. Научитесь их распознавать — и не попадать в них.</p>
            <svg viewBox="0 0 360 140" className="w-full h-36">
              <line x1="30" y1="60" x2="330" y2="60" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="6,3" />
              <text x="332" y="64" fontSize="8" fill="#ef4444" fontFamily="monospace">Сопр.</text>
              <polyline points="30,120 70,100 110,80 150,65 180,45 185,55 190,62 200,68 230,55 270,38 310,25" fill="none" stroke="#e5e7eb" strokeWidth="2" />
              <circle cx="180" cy="45" r="5" fill="#ef4444" />
              <text x="140" y="40" fontSize="7" fill="#ef4444" fontFamily="monospace">Ложный пробой</text>
              <circle cx="200" cy="68" r="4" fill="#22c55e" />
              <text x="205" y="72" fontSize="7" fill="#22c55e" fontFamily="monospace">Реальное движение</text>
              <text x="90" y="135" fontSize="7" fill="#52525b" fontFamily="monospace">Цена пробила уровень, выбила стопы и пошла вверх</text>
            </svg>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3">
              {[
                { title: "Признаки ложного пробоя", color: "text-red-400", items: ["Закрытие свечи обратно за уровень", "Низкий объём при пробое", "Длинная тень свечи за уровнем", "Быстрый разворот за 1–2 свечи"] },
                { title: "Как не попасться", color: "text-yellow-400", items: ["Ждать закрытие свечи за уровнем", "Проверять объём при пробое", "Не входить сразу — ждать ретест", "Стоп ставить за тень пробойной свечи"] },
                { title: "Торговля ложных пробоев", color: "text-green-400", items: ["Вход при возврате обратно за уровень", "Стоп за хай/лой ложного пробоя", "TP на ближайшем противоположном уровне", "Один из лучших паттернов для трейдинга"] },
              ].map((col, i) => (
                <div key={i} className="bg-zinc-900 rounded-xl p-3">
                  <div className={`font-orbitron text-xs font-bold mb-2 ${col.color}`}>{col.title}</div>
                  <ul className="space-y-1">
                    {col.items.map((item, j) => (
                      <li key={j} className="text-zinc-400 text-xs font-space-mono flex gap-1.5"><span className={col.color}>→</span>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
            <div className="text-green-400 font-orbitron text-xs font-bold mb-2">Из жизни профессионалов: Дэн Зангер и объём как опережающий сигнал</div>
            <p className="text-zinc-300 text-xs font-space-mono leading-relaxed">
              Дэн Зангер — трейдер, превративший $10,775 в $18 млн за 18 месяцев (1998–2000) — строил всю торговлю вокруг объёма.
              Он покупал акции, только когда объём превышал среднедневной в 3–5 раз на пробое ключевого уровня.
              «Если объём не подтверждает движение — это не движение, это ловушка».
              Тот же принцип No Demand / No Supply (VSA) Зангер применял интуитивно: без объёма ни один сигнал не считался действительным.
            </p>
          </div>
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
            <div className="text-red-400 font-orbitron text-xs font-bold mb-2">Из жизни профессионалов: Джо Диназале и торговля ложных пробоев</div>
            <p className="text-zinc-300 text-xs font-space-mono leading-relaxed">
              Джо Диназале — управляющий и преподаватель трейдинга, специализирующийся на Price Action —
              называет ложные пробои (fakeout) «самым честным паттерном на рынке».
              «Рынок всегда делает то, что ломает ожидания большинства. Ложный пробой — это буквальное воплощение этого принципа».
              Его стратегия входа при возврате цены за уровень после fakeout давала win rate 65–70% при правильном контексте — одни из лучших показателей в Price Action трейдинге.
            </p>
          </div>
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4">
            <div className="text-white font-orbitron text-xs font-bold mb-3">Продвинутые паттерны: Голова и плечи, Двойное дно/вершина</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div className="text-red-400 font-orbitron text-xs font-bold mb-2">Голова и плечи (H&S)</div>
                <svg viewBox="0 0 180 100" className="w-full h-24">
                  <line x1="10" y1="75" x2="170" y2="75" stroke="#52525b" strokeWidth="1" strokeDasharray="3,2" />
                  <text x="155" y="73" fontSize="6" fill="#52525b" fontFamily="monospace">Шея</text>
                  <polyline points="10,75 30,60 50,75 80,35 110,75 130,55 150,75" fill="none" stroke="#e5e7eb" strokeWidth="1.5" />
                  <text x="72" y="28" fontSize="7" fill="#ef4444" fontFamily="monospace">Голова</text>
                  <text x="20" y="55" fontSize="6" fill="#a78bfa" fontFamily="monospace">Пл.</text>
                  <text x="125" y="50" fontSize="6" fill="#a78bfa" fontFamily="monospace">Пл.</text>
                  <polyline points="150,75 165,95" fill="none" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="3,2" />
                  <text x="150" y="100" fontSize="6" fill="#ef4444" fontFamily="monospace">Цель</text>
                </svg>
                <p className="text-zinc-400 text-xs font-space-mono mt-2 leading-relaxed">Паттерн разворота на вершине тренда. Вход при пробое линии шеи. Цель = расстояние от головы до шеи, отложенное вниз.</p>
              </div>
              <div>
                <div className="text-green-400 font-orbitron text-xs font-bold mb-2">Двойное дно (Double Bottom)</div>
                <svg viewBox="0 0 180 100" className="w-full h-24">
                  <line x1="10" y1="30" x2="170" y2="30" stroke="#52525b" strokeWidth="1" strokeDasharray="3,2" />
                  <text x="155" y="28" fontSize="6" fill="#52525b" fontFamily="monospace">Шея</text>
                  <polyline points="10,30 30,65 50,30 100,30 130,65 150,30" fill="none" stroke="#e5e7eb" strokeWidth="1.5" />
                  <text x="22" y="78" fontSize="6" fill="#22c55e" fontFamily="monospace">Дно 1</text>
                  <text x="122" y="78" fontSize="6" fill="#22c55e" fontFamily="monospace">Дно 2</text>
                  <polyline points="150,30 165,10" fill="none" stroke="#22c55e" strokeWidth="1.5" strokeDasharray="3,2" />
                  <text x="150" y="8" fontSize="6" fill="#22c55e" fontFamily="monospace">Цель</text>
                </svg>
                <p className="text-zinc-400 text-xs font-space-mono mt-2 leading-relaxed">Паттерн разворота на дне. Два равных дна + пробой шеи = сильный сигнал. Второе дно часто на меньшем объёме — признак слабости продавцов.</p>
              </div>
            </div>
          </div>
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
            <div className="text-yellow-400 font-orbitron text-xs font-bold mb-2">Из жизни профессионалов: Ричард Шабакер и «Голова и плечи» как рыночная истина</div>
            <p className="text-zinc-300 text-xs font-space-mono leading-relaxed">
              Ричард Шабакер — финансовый редактор Forbes в 1920–30-х годах — первым систематизировал паттерн «Голова и плечи» в книге «Stock Market Theory and Practice» (1930).
              Он описал его как отражение психологии трёх волн: первый максимум (энтузиазм), второй — выше (эйфория), третий — ниже (слабость быков).
              Столетие спустя паттерн работает на всех рынках — от акций до BTC — потому что психология толпы не меняется.
              Чарльз Доу, создатель Dow Theory, описывал ту же трёхволновую структуру ещё в конце XIX века.
            </p>
          </div>
        </div>
      )
    },
  ]
}
