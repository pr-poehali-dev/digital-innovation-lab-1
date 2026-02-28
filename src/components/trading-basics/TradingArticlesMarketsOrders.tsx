import React from "react"
import {
  OrderBookChart,
  RiskCalcTable,
  RRTable,
  MarketComparisonTable,
  OrderTypesTable,
} from "./TradingCharts"
import type { Article } from "./TradingArticleTypes"

export const articleMarkets: Article = {
  id: "markets",
  badge: "Глава 1",
  title: "Что такое финансовые рынки",
  summary: "Финансовые рынки — это площадки, где покупатели и продавцы обменивают активы: акции, валюту, криптовалюту, товары. Понимание структуры рынка — фундамент любой торговли.",
  sections: [
    {
      title: "Основные типы рынков и их сравнение",
      content: (
        <div className="space-y-3">
          <p className="text-gray-300 leading-relaxed">Выбор рынка определяет весь стиль торговли. Каждый рынок имеет свой характер волатильности, ликвидности и часов работы.</p>
          <MarketComparisonTable />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-3">
              <div className="text-yellow-400 font-orbitron text-xs font-bold mb-2">Что такое ликвидность?</div>
              <p className="text-zinc-400 text-xs leading-relaxed">Ликвидность — насколько легко купить или продать актив без существенного изменения его цены. Высокая ликвидность = узкий спред, быстрое исполнение. Низкая = широкий спред, проскальзывание.</p>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-3">
              <div className="text-red-400 font-orbitron text-xs font-bold mb-2">Что такое волатильность?</div>
              <p className="text-zinc-400 text-xs leading-relaxed">Волатильность — амплитуда колебаний цены. BTC может за день изменить цену на 5–15%. Акции SBER — на 1–3%. Высокая волатильность = больше возможностей и рисков одновременно.</p>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Участники рынка и их роли",
      content: (
        <div className="space-y-3">
          <p className="text-gray-300 leading-relaxed">Рынок — это экосистема с разными игроками. Понимание мотивов каждого помогает читать движения цены.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { title: "Маркет-мейкеры", color: "border-blue-500/40 bg-blue-500/5", tc: "text-blue-400", desc: "Крупные банки и брокеры, которые постоянно выставляют заявки на покупку и продажу. Обеспечивают ликвидность. Зарабатывают на спреде. Без них рынок не работает." },
              { title: "Институционалы", color: "border-purple-500/40 bg-purple-500/5", tc: "text-purple-400", desc: "Хедж-фонды, банки, пенсионные фонды. Торгуют миллиардами — их сделки буквально двигают рынок. Часто используют алгоритмы и ИИ." },
              { title: "Розничные трейдеры", color: "border-yellow-500/40 bg-yellow-500/5", tc: "text-yellow-400", desc: "Частные лица с небольшим капиталом. Это мы с вами. Составляем меньшую часть объёма, но в сумме влияем на настроения рынка." },
              { title: "Алгоритмы (HFT)", color: "border-red-500/40 bg-red-500/5", tc: "text-red-400", desc: "Высокочастотные торговые боты. Совершают тысячи сделок в секунду. Обеспечивают около 70% объёма на американских биржах. Конкурировать с ними в скорости невозможно." },
            ].map((p, i) => (
              <div key={i} className={`border rounded-lg p-3 ${p.color}`}>
                <div className={`font-orbitron text-xs font-bold mb-1 ${p.tc}`}>{p.title}</div>
                <p className="text-zinc-400 text-xs leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )
    },
    {
      title: "Стакан ордеров (Order Book) — как читать",
      content: (
        <div className="space-y-3">
          <p className="text-gray-300 leading-relaxed">Order Book — главный инструмент понимания текущего баланса спроса и предложения. Именно здесь видно, где стоят крупные игроки.</p>
          <OrderBookChart />
          <div className="space-y-2 text-sm text-zinc-300 leading-relaxed">
            <div className="flex gap-2"><span className="text-green-400 font-bold">Биды (зелёные)</span><span>— заявки на покупку. Чем выше цена — тем меньше желающих покупать.</span></div>
            <div className="flex gap-2"><span className="text-red-400 font-bold">Аски (красные)</span><span>— заявки на продажу. Стена продаж выше рынка тормозит рост цены.</span></div>
            <div className="flex gap-2"><span className="text-yellow-400 font-bold">Спред</span><span>— разница между лучшим аском и лучшим бидом. Это «стоимость» мгновенной сделки.</span></div>
            <div className="bg-zinc-900 border border-zinc-700 rounded-lg p-3 text-xs text-zinc-400 mt-2">
              <span className="text-white font-semibold">Совет:</span> Большой объём на уровне поддержки в стакане — не гарантия. Крупные игроки могут снять свои заявки прямо перед достижением цены (манипуляция «стеной»). Анализируйте стакан в динамике.
            </div>
          </div>
        </div>
      )
    },
    {
      title: "▲ Продвинутый уровень: Smart Money и структура рынка (ICT)",
      content: (
        <div className="space-y-4">
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 flex gap-2 items-center">
            <span className="text-red-400 text-lg">⚠</span>
            <p className="text-red-300 text-xs font-space-mono">Этот раздел для продвинутых трейдеров. Концепции основаны на методологии ICT (Inner Circle Trader) и SMC (Smart Money Concepts).</p>
          </div>
          <p className="text-gray-300 leading-relaxed">Smart Money — это крупные институциональные игроки (банки, фонды), которые двигают рынок. Их задача: набрать позицию по лучшей цене, не показывая намерений. Для этого они создают ловушки для розничных трейдеров.</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { title: "Stop Hunt (Охота за стопами)", color: "border-red-500/40 bg-red-500/5", tc: "text-red-400", desc: "Цена намеренно пробивает очевидные уровни поддержки/сопротивления, выбивает стоп-лоссы большинства розничных трейдеров — и разворачивается. Это не случайность, это ликвидность для Smart Money." },
              { title: "Fair Value Gap (FVG)", color: "border-blue-500/40 bg-blue-500/5", tc: "text-blue-400", desc: "Разрыв в ценовом диапазоне из трёх свечей, где не было двустороннего обмена. Рынок часто возвращается заполнить FVG перед продолжением тренда. Мощная зона для входа." },
              { title: "Order Block (OB)", color: "border-purple-500/40 bg-purple-500/5", tc: "text-purple-400", desc: "Последняя бычья/медвежья свеча перед импульсным движением. Место накопления позиций Smart Money. Цена часто возвращается к OB для добора позиции." },
            ].map((item, i) => (
              <div key={i} className={`border rounded-xl p-3 ${item.color}`}>
                <div className={`font-orbitron text-xs font-bold mb-2 ${item.tc}`}>{item.title}</div>
                <p className="text-zinc-400 text-xs leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4">
            <div className="text-white font-orbitron text-xs font-bold mb-3">Структура рынка (Market Structure)</div>
            <svg viewBox="0 0 360 120" className="w-full h-28">
              <polyline points="20,100 60,80 80,90 120,55 140,70 190,30 210,45 250,20 280,35 320,15" fill="none" stroke="#e5e7eb" strokeWidth="1.5" />
              {[[120,55],[190,30],[250,20]].map(([x,y],i) => (
                <g key={i}>
                  <circle cx={x} cy={y} r="4" fill="#22c55e" />
                  <text x={x} y={y-8} fontSize="7" fill="#22c55e" textAnchor="middle" fontFamily="monospace">HH</text>
                </g>
              ))}
              {[[80,90],[140,70],[210,45]].map(([x,y],i) => (
                <g key={i}>
                  <circle cx={x} cy={y} r="4" fill="#60a5fa" />
                  <text x={x} y={y+14} fontSize="7" fill="#60a5fa" textAnchor="middle" fontFamily="monospace">HL</text>
                </g>
              ))}
              <text x="180" y="115" fontSize="8" fill="#52525b" textAnchor="middle" fontFamily="monospace">Бычий тренд: HH (Higher High) + HL (Higher Low)</text>
            </svg>
            <div className="grid grid-cols-2 gap-3 mt-3">
              <div className="bg-zinc-900 rounded-lg p-3">
                <div className="text-green-400 font-orbitron text-xs font-bold mb-1">Бычья структура</div>
                <p className="text-zinc-400 text-xs font-space-mono">HH + HL — каждый максимум и минимум выше предыдущего. Торгуем только лонги на HL.</p>
              </div>
              <div className="bg-zinc-900 rounded-lg p-3">
                <div className="text-red-400 font-orbitron text-xs font-bold mb-1">Медвежья структура</div>
                <p className="text-zinc-400 text-xs font-space-mono">LH + LL — каждый максимум и минимум ниже предыдущего. Торгуем только шорты на LH.</p>
              </div>
            </div>
          </div>
          <div className="bg-zinc-900 border border-yellow-500/20 rounded-xl p-4">
            <div className="text-yellow-400 font-orbitron text-xs font-bold mb-2">Смена структуры (BOS / CHoCH)</div>
            <div className="space-y-2 text-xs font-space-mono text-zinc-400">
              <div className="flex gap-2 items-start"><span className="text-blue-400 font-bold shrink-0">BOS</span><span>(Break of Structure) — пробой предыдущего HH или LL. Подтверждает продолжение тренда. Используется для входа в направлении доминирующей структуры.</span></div>
              <div className="flex gap-2 items-start"><span className="text-orange-400 font-bold shrink-0">CHoCH</span><span>(Change of Character) — первый признак смены тренда. Цена впервые пробивает структуру против тренда. Сигнал к переходу к нейтралитету или развороту.</span></div>
            </div>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
            <div className="text-white font-orbitron text-xs font-bold mb-2">Манипуляция перед движением: схема Wyckoff</div>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-xs font-space-mono">
              {[
                { n: "1. Накопление", c: "text-blue-400", d: "Smart Money накапливают позицию в боковике. Объём растёт, цена не двигается. Большинство думает «ничего не происходит»." },
                { n: "2. Разметка (Markup)", c: "text-green-400", d: "Импульсный рост после накопления. FOMO-трейдеры входят на хаях. Smart Money продолжают добирать." },
                { n: "3. Распределение", c: "text-yellow-400", d: "Боковик на вершине. Smart Money тихо выходят из позиций, перекладывая их на розничных покупателей." },
                { n: "4. Уценка (Markdown)", c: "text-red-400", d: "Резкое падение. Розничные трейдеры держат убытки. Smart Money откупают внизу — цикл повторяется." },
              ].map((s, i) => (
                <div key={i} className="bg-zinc-950 rounded-lg p-2">
                  <div className={`font-bold mb-1 ${s.c}`}>{s.n}</div>
                  <p className="text-zinc-500 leading-relaxed">{s.d}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )
    },
  ]
}

export const articleOrders: Article = {
  id: "orders",
  badge: "Глава 2",
  title: "Типы ордеров и исполнение сделок",
  summary: "Правильный выбор типа ордера влияет на цену входа, исполнение и итоговый результат. Разберём все основные типы и когда их применять.",
  sections: [
    {
      title: "Полная таблица типов ордеров",
      content: (
        <div className="space-y-3">
          <p className="text-gray-300 leading-relaxed">Каждый тип ордера решает конкретную задачу. Ошибка в выборе типа ордера может стоить процентов прибыли или части капитала.</p>
          <OrderTypesTable />
        </div>
      )
    },
    {
      title: "Рыночный vs Лимитный: что выбрать",
      content: (
        <div className="space-y-3">
          <p className="text-gray-300 leading-relaxed">Главный выбор каждого трейдера при входе в сделку — скорость или точность цены.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-zinc-900 border border-red-500/30 rounded-xl p-4">
              <div className="text-red-400 font-orbitron font-bold mb-2">Market Order</div>
              <div className="space-y-1 text-xs text-zinc-400 font-space-mono">
                <div>✓ Мгновенное исполнение</div>
                <div>✓ 100% вероятность сделки</div>
                <div>✗ Проскальзывание в неликвиде</div>
                <div>✗ Нет контроля цены</div>
              </div>
              <div className="mt-3 bg-zinc-950 rounded p-2 text-xs text-zinc-500">
                <span className="text-white">Используйте:</span> При срочном закрытии позиции, торговле топ-ликвидными активами (BTC, SBER, AAPL)
              </div>
            </div>
            <div className="bg-zinc-900 border border-green-500/30 rounded-xl p-4">
              <div className="text-green-400 font-orbitron font-bold mb-2">Limit Order</div>
              <div className="space-y-1 text-xs text-zinc-400 font-space-mono">
                <div>✓ Точная цена входа</div>
                <div>✓ Нет проскальзывания</div>
                <div>✓ Maker-скидка на комиссию</div>
                <div>✗ Может не исполниться</div>
              </div>
              <div className="mt-3 bg-zinc-950 rounded p-2 text-xs text-zinc-500">
                <span className="text-white">Используйте:</span> Вход на откате, выход на TP, любая работа «по уровням»
              </div>
            </div>
          </div>
          <div className="bg-zinc-900 border border-yellow-500/20 rounded-xl p-4 mt-2">
            <div className="text-yellow-400 font-orbitron text-xs font-bold mb-2">Пример расчёта проскальзывания</div>
            <p className="text-zinc-400 text-xs font-space-mono leading-relaxed">
              Хотите купить 1 BTC по цене $42,850 рыночным ордером. Стакан: лучший аск $42,900 (0.3 BTC) + $42,950 (0.7 BTC). Итог: покупаете по средней ~$42,930. Проскальзывание = $80 (0.19%). На маленьких объёмах незначительно, на крупных — существенно.
            </p>
          </div>
        </div>
      )
    },
    {
      title: "Стоп-ордера: защита капитала",
      content: (
        <div className="space-y-3">
          <p className="text-gray-300 leading-relaxed">Стоп-ордера — это ваша страховка. Профессионалы всегда ставят стопы до входа в сделку, а не после.</p>
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4">
            <svg viewBox="0 0 360 120" className="w-full h-28">
              <polyline points="20,80 80,75 120,60 160,55 200,65 240,50 270,40 290,30" fill="none" stroke="#e5e7eb" strokeWidth="2" />
              <circle cx="120" cy="60" r="4" fill="#60a5fa" />
              <text x="125" y="55" fontSize="8" fill="#60a5fa" fontFamily="monospace">ВХОД $100</text>
              <line x1="20" y1="90" x2="340" y2="90" stroke="#ef4444" strokeWidth="1" strokeDasharray="5,3" />
              <text x="250" y="87" fontSize="8" fill="#ef4444" fontFamily="monospace">STOP-LOSS $93 (-7%)</text>
              <line x1="20" y1="20" x2="340" y2="20" stroke="#22c55e" strokeWidth="1" strokeDasharray="5,3" />
              <text x="245" y="17" fontSize="8" fill="#22c55e" fontFamily="monospace">TAKE-PROFIT $121 (+21%)</text>
              <line x1="350" y1="20" x2="350" y2="90" stroke="#a78bfa" strokeWidth="1" />
              <text x="310" y="58" fontSize="8" fill="#a78bfa" fontFamily="monospace">R:R = 1:3</text>
            </svg>
          </div>
          <div className="space-y-2 text-sm">
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-3">
              <div className="text-red-400 font-orbitron text-xs font-bold mb-1">Где ставить Stop-Loss?</div>
              <p className="text-zinc-400 text-xs font-space-mono leading-relaxed">За последний значимый уровень поддержки/сопротивления, за тень последней свечи, или фиксированный % от входа. Не ставьте стоп «на круглых числах» — там его часто выбивают намеренно.</p>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-3">
              <div className="text-yellow-400 font-orbitron text-xs font-bold mb-1">Трейлинг-стоп: автоматическое сохранение прибыли</div>
              <p className="text-zinc-400 text-xs font-space-mono leading-relaxed">Трейлинг-стоп следует за ценой на фиксированном расстоянии. Если BTC вырос с $42к до $48к, а трейлинг-стоп стоит на 5% ниже — он передвинется до $45,600. При откате закроет позицию, зафиксировав прибыль.</p>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "▲ Продвинутый уровень: OCO, фьючерсы и продвинутые типы ордеров",
      content: (
        <div className="space-y-4">
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 flex gap-2 items-center">
            <span className="text-red-400 text-lg">⚠</span>
            <p className="text-red-300 text-xs font-space-mono">Продвинутый раздел. Требует понимания базовых типов ордеров и принципов маржинальной торговли.</p>
          </div>
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4">
            <div className="text-white font-orbitron text-xs font-bold mb-3">OCO (One Cancels the Other)</div>
            <p className="text-gray-300 text-sm leading-relaxed mb-3">Пара ордеров: при исполнении одного второй автоматически отменяется. Позволяет одновременно зафиксировать прибыль или ограничить убыток без ручного контроля.</p>
            <div className="bg-zinc-900 rounded-xl p-3">
              <svg viewBox="0 0 360 100" className="w-full h-24">
                <line x1="30" y1="50" x2="330" y2="50" stroke="#e5e7eb" strokeWidth="1.5" />
                <circle cx="180" cy="50" r="5" fill="#60a5fa" />
                <text x="180" y="42" fontSize="8" fill="#60a5fa" textAnchor="middle" fontFamily="monospace">ПОЗИЦИЯ $100</text>
                <line x1="30" y1="25" x2="330" y2="25" stroke="#22c55e" strokeWidth="1" strokeDasharray="5,3" />
                <text x="60" y="20" fontSize="8" fill="#22c55e" fontFamily="monospace">TP: $115 (+15%)</text>
                <line x1="30" y1="78" x2="330" y2="78" stroke="#ef4444" strokeWidth="1" strokeDasharray="5,3" />
                <text x="60" y="92" fontSize="8" fill="#ef4444" fontFamily="monospace">SL: $93 (-7%)</text>
                <text x="280" y="52" fontSize="8" fill="#a78bfa" fontFamily="monospace">OCO</text>
                <line x1="320" y1="25" x2="320" y2="78" stroke="#a78bfa" strokeWidth="1" />
                <text x="270" y="90" fontSize="7" fill="#52525b" fontFamily="monospace">Сработает одно — другое отменится</text>
              </svg>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
              <div className="bg-zinc-900 rounded-lg p-3">
                <div className="text-green-400 font-orbitron text-xs font-bold mb-1">Применение</div>
                <p className="text-zinc-400 text-xs font-space-mono leading-relaxed">Входите в сделку и сразу выставляете OCO: если цена достигает TP — позиция закрывается с прибылью, SL-ордер отменяется. Если цена падает до SL — убыток зафиксирован, TP отменён.</p>
              </div>
              <div className="bg-zinc-900 rounded-lg p-3">
                <div className="text-blue-400 font-orbitron text-xs font-bold mb-1">Где доступно</div>
                <p className="text-zinc-400 text-xs font-space-mono leading-relaxed">Bybit, Binance Futures, OKX — все крупные биржи поддерживают OCO. На споте — иногда ограничено. Всегда проверяйте исполнение в тестовой сети перед реальными деньгами.</p>
              </div>
            </div>
          </div>
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4">
            <div className="text-white font-orbitron text-xs font-bold mb-3">Фьючерсы: лонг, шорт и ликвидация</div>
            <p className="text-gray-300 text-sm leading-relaxed mb-3">Фьючерсные контракты позволяют торговать с кредитным плечом и открывать позиции на падение (шорт) без владения активом. Высокий потенциал прибыли = высокий риск ликвидации.</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { title: "Плечо (Leverage)", color: "text-yellow-400", bc: "border-yellow-500/30 bg-yellow-500/5", desc: "10x плечо: 1000$ управляет позицией 10 000$. Прибыль и убыток умножаются на 10. Движение против вас на 10% = потеря всего депозита (ликвидация)." },
                { title: "Шорт (Short)", color: "text-red-400", bc: "border-red-500/30 bg-red-500/5", desc: "Продаёте актив, которого у вас нет (берёте в долг у биржи). Зарабатываете на падении цены. При росте — убыток. Риск шорта теоретически неограничен." },
                { title: "Ликвидация", color: "text-orange-400", bc: "border-orange-500/30 bg-orange-500/5", desc: "Биржа принудительно закрывает позицию при достижении уровня ликвидации. Вы теряете весь маржинальный залог. Никогда не торгуйте без стопа на фьючерсах." },
              ].map((item, i) => (
                <div key={i} className={`border rounded-xl p-3 ${item.bc}`}>
                  <div className={`font-orbitron text-xs font-bold mb-1 ${item.color}`}>{item.title}</div>
                  <p className="text-zinc-400 text-xs font-space-mono leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
            <div className="bg-zinc-900 border border-red-500/20 rounded-xl p-3 mt-3">
              <div className="text-red-400 font-orbitron text-xs font-bold mb-1">Формула цены ликвидации (лонг):</div>
              <code className="text-green-400 font-space-mono text-xs block bg-zinc-950 rounded p-2 mt-1">
                Цена ликвидации = Цена входа × (1 - 1/Плечо + Ставка обслуживания)
              </code>
              <p className="text-zinc-500 text-xs font-space-mono mt-2">Пример: Лонг BTC по $50,000 с плечом 10x → ликвидация ≈ $45,500 (падение ~9%)</p>
            </div>
          </div>
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4">
            <div className="text-white font-orbitron text-xs font-bold mb-3">Алгоритм выставления ордеров: профессиональный чеклист</div>
            <div className="space-y-2">
              {[
                { n: "1", text: "Определяю направление на D1/H4 (только по тренду или чёткая зона разворота)", color: "text-blue-400" },
                { n: "2", text: "Нахожу точку входа на H1/M15 — ближе к уровню или OB, не в середине движения", color: "text-blue-400" },
                { n: "3", text: "Ставлю лимитный ордер на уровень, а не рыночный — экономлю на комиссии и цене", color: "text-green-400" },
                { n: "4", text: "Сразу выставляю SL за ближайшую структуру (не в процентах вслепую)", color: "text-red-400" },
                { n: "5", text: "Рассчитываю размер позиции: риск 1% депо / размер стопа в $ = количество единиц", color: "text-yellow-400" },
                { n: "6", text: "Выставляю TP или переношу в OCO. Ухожу от экрана. Не слежу каждую минуту.", color: "text-purple-400" },
              ].map((step, i) => (
                <div key={i} className="flex items-start gap-3 bg-zinc-900 rounded-lg px-3 py-2">
                  <span className={`font-orbitron font-bold text-sm shrink-0 ${step.color}`}>{step.n}</span>
                  <span className="text-zinc-300 text-xs font-space-mono leading-relaxed">{step.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )
    },
  ]
}

export const articlesMarketsOrders: Article[] = [articleMarkets, articleOrders]
