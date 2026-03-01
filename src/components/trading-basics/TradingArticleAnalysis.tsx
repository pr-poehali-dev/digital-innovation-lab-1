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
            <p className="text-zinc-400 text-xs font-space-mono leading-relaxed mb-3">2 ноября 2023. На M15 ETH выглядит медвежьим: несколько красных свечей, RSI в зоне 35. На D1 — явный бычий тренд, ETH отбивается от поддержки $1,820 четвёртый раз. Трейдер, смотревший только M15, зашортил. Трейдер, работавший по D1+H4, купил. Через 3 дня ETH вырос до $2,050. Вывод: <span className="text-white">старший ТФ определяет направление, младший — точку входа.</span></p>

            {/* Визуал: один актив, два тайм-фрейма */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* M15 — медвежий взгляд */}
              <div className="bg-zinc-950 border border-red-500/20 rounded-xl p-3">
                <div className="text-red-400 font-orbitron text-[10px] font-bold mb-1">ETH / M15 — «медвежий»</div>
                <svg viewBox="0 0 160 80" className="w-full h-20">
                  {/* Сетка */}
                  {[20, 40, 60].map(y => <line key={y} x1="10" y1={y} x2="155" y2={y} stroke="#27272a" strokeWidth="0.8"/>)}
                  {/* Свечи: падающий локальный тренд */}
                  {[
                    { x: 20, o: 22, c: 35, h: 38, l: 20, bull: false },
                    { x: 35, o: 20, c: 30, h: 32, l: 18, bull: false },
                    { x: 50, o: 18, c: 28, h: 30, l: 16, bull: false },
                    { x: 65, o: 16, c: 26, h: 28, l: 14, bull: false },
                    { x: 80, o: 14, c: 22, h: 25, l: 12, bull: false },
                    { x: 95, o: 13, c: 20, h: 23, l: 11, bull: false },
                  ].map((c, i) => (
                    <g key={i}>
                      <line x1={c.x} y1={c.h} x2={c.x} y2={c.l} stroke="#ef4444" strokeWidth="1"/>
                      <rect x={c.x - 5} y={Math.min(c.o, c.c)} width="10" height={Math.max(Math.abs(c.o - c.c), 2)} fill="#ef4444" rx="1"/>
                    </g>
                  ))}
                  {/* RSI низкий */}
                  <text x="110" y="28" fontSize="7" fill="#ef4444" fontFamily="monospace">RSI: 35</text>
                  <text x="110" y="40" fontSize="7" fill="#ef4444" fontFamily="monospace">↓ шорт?</text>
                  {/* Метка */}
                  <text x="10" y="76" fontSize="6" fill="#52525b" fontFamily="monospace">Локальный даунтренд → трейдер зашортил</text>
                </svg>
              </div>

              {/* D1 — бычий тренд */}
              <div className="bg-zinc-950 border border-green-500/20 rounded-xl p-3">
                <div className="text-green-400 font-orbitron text-[10px] font-bold mb-1">ETH / D1 — «бычий»</div>
                <svg viewBox="0 0 160 80" className="w-full h-20">
                  {[20, 40, 60].map(y => <line key={y} x1="10" y1={y} x2="155" y2={y} stroke="#27272a" strokeWidth="0.8"/>)}
                  {/* Поддержка */}
                  <line x1="10" y1="58" x2="155" y2="58" stroke="#22c55e" strokeWidth="1" strokeDasharray="4,2"/>
                  <text x="120" y="56" fontSize="6" fill="#22c55e" fontFamily="monospace">$1,820</text>
                  {/* Свечи: восходящий тренд, 4 отбоя от поддержки */}
                  {[
                    { x: 20, o: 58, c: 48, h: 60, l: 57, bull: true },
                    { x: 38, o: 48, c: 38, h: 50, l: 46, bull: true },
                    { x: 56, o: 58, c: 44, h: 60, l: 57, bull: true },
                    { x: 74, o: 44, c: 32, h: 46, l: 43, bull: true },
                    { x: 92, o: 58, c: 40, h: 60, l: 57, bull: true },
                    { x: 110, o: 40, c: 22, h: 42, l: 38, bull: true },
                  ].map((c, i) => (
                    <g key={i}>
                      <line x1={c.x} y1={c.h} x2={c.x} y2={c.l} stroke="#22c55e" strokeWidth="1"/>
                      <rect x={c.x - 5} y={Math.min(c.o, c.c)} width="10" height={Math.max(Math.abs(c.o - c.c), 2)} fill="#22c55e" rx="1"/>
                    </g>
                  ))}
                  <text x="10" y="76" fontSize="6" fill="#52525b" fontFamily="monospace">4 отбоя от поддержки → трейдер купил</text>
                </svg>
              </div>
            </div>
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
            <div className="text-white font-orbitron text-xs font-bold mb-3">Принцип «сверху вниз» (Top-Down Analysis)</div>
            <svg viewBox="0 0 360 160" className="w-full h-40">
              {/* W1 — самый широкий */}
              <rect x="40" y="8" width="280" height="28" rx="6" fill="#1e3a5f" stroke="#3b82f6" strokeWidth="1.2"/>
              <text x="180" y="19" fontSize="9" fill="#93c5fd" fontFamily="monospace" textAnchor="middle" fontWeight="bold">W1 — Недельный: определяем тренд</text>
              <text x="180" y="30" fontSize="7" fill="#60a5fa" fontFamily="monospace" textAnchor="middle">Бычий / Медвежий / Боковик</text>

              {/* Стрелка вниз */}
              <line x1="180" y1="36" x2="180" y2="46" stroke="#52525b" strokeWidth="1.5"/>
              <polygon points="175,44 185,44 180,50" fill="#52525b"/>

              {/* D1 */}
              <rect x="60" y="50" width="240" height="26" rx="6" fill="#2d1b69" stroke="#8b5cf6" strokeWidth="1.2"/>
              <text x="180" y="61" fontSize="9" fill="#c4b5fd" fontFamily="monospace" textAnchor="middle" fontWeight="bold">D1 — Дневной: контекст и зоны</text>
              <text x="180" y="71" fontSize="7" fill="#a78bfa" fontFamily="monospace" textAnchor="middle">Ключевые уровни поддержки / сопротивления</text>

              {/* Стрелка */}
              <line x1="180" y1="76" x2="180" y2="86" stroke="#52525b" strokeWidth="1.5"/>
              <polygon points="175,84 185,84 180,90" fill="#52525b"/>

              {/* H4 */}
              <rect x="80" y="90" width="200" height="26" rx="6" fill="#3b2c00" stroke="#eab308" strokeWidth="1.2"/>
              <text x="180" y="101" fontSize="9" fill="#fde68a" fontFamily="monospace" textAnchor="middle" fontWeight="bold">H4 — 4 часа: зона входа</text>
              <text x="180" y="111" fontSize="7" fill="#fbbf24" fontFamily="monospace" textAnchor="middle">Паттерн + объём + подтверждение</text>

              {/* Стрелка */}
              <line x1="180" y1="116" x2="180" y2="126" stroke="#52525b" strokeWidth="1.5"/>
              <polygon points="175,124 185,124 180,130" fill="#52525b"/>

              {/* H1 — самый узкий */}
              <rect x="100" y="130" width="160" height="24" rx="6" fill="#052e16" stroke="#22c55e" strokeWidth="1.5"/>
              <text x="180" y="141" fontSize="9" fill="#86efac" fontFamily="monospace" textAnchor="middle" fontWeight="bold">H1 — 1 час: точный вход</text>
              <text x="180" y="151" fontSize="7" fill="#4ade80" fontFamily="monospace" textAnchor="middle">Стоп / Тейк / Размер позиции</text>
            </svg>
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

              {/* Ап-бар с высоким объёмом */}
              <div className="border rounded-xl p-3 border-green-500/20 bg-green-500/5">
                <div className="font-orbitron text-xs font-bold mb-2 text-green-400">Ап-бар с высоким объёмом</div>
                <svg viewBox="0 0 120 90" className="w-full h-24 mb-2">
                  {/* Предыдущие свечи (контекст) */}
                  <line x1="18" y1="28" x2="18" y2="20" stroke="#6b7280" strokeWidth="1"/>
                  <rect x="14" y="28" width="8" height="14" fill="#22c55e" opacity="0.4"/>
                  <line x1="18" y1="42" x2="18" y2="48" stroke="#6b7280" strokeWidth="1"/>

                  <line x1="34" y1="25" x2="34" y2="18" stroke="#6b7280" strokeWidth="1"/>
                  <rect x="30" y="25" width="8" height="10" fill="#22c55e" opacity="0.4"/>
                  <line x1="34" y1="35" x2="34" y2="42" stroke="#6b7280" strokeWidth="1"/>

                  {/* Главная свеча — ап-бар с высоким объёмом */}
                  <line x1="54" y1="10" x2="54" y2="15" stroke="#22c55e" strokeWidth="1.5"/>
                  <rect x="49" y="15" width="10" height="40" fill="#22c55e" rx="1"/>
                  <line x1="54" y1="55" x2="54" y2="60" stroke="#22c55e" strokeWidth="1.5"/>
                  <text x="46" y="8" fontSize="7" fill="#22c55e" fontFamily="monospace">↑ БАР</text>

                  {/* Метка объёма */}
                  <text x="66" y="35" fontSize="7" fill="#22c55e" fontFamily="monospace">VOL</text>
                  <text x="66" y="44" fontSize="7" fill="#22c55e" fontFamily="monospace">HIGH</text>

                  {/* Объём — столбики снизу */}
                  <rect x="10" y="74" width="8" height="8" fill="#22c55e" opacity="0.3" rx="1"/>
                  <rect x="26" y="72" width="8" height="10" fill="#22c55e" opacity="0.3" rx="1"/>
                  <rect x="46" y="62" width="14" height="20" fill="#22c55e" opacity="0.8" rx="1"/>
                  <text x="2" y="88" fontSize="6" fill="#52525b" fontFamily="monospace">Объём</text>
                </svg>
                <p className="text-zinc-400 text-xs font-space-mono leading-relaxed">Большая бычья свеча + высокий объём = сила покупателей подтверждена. На уровне поддержки — очень сильный сигнал роста.</p>
              </div>

              {/* Даун-бар с низким объёмом */}
              <div className="border rounded-xl p-3 border-blue-500/20 bg-blue-500/5">
                <div className="font-orbitron text-xs font-bold mb-2 text-blue-400">Даун-бар с низким объёмом</div>
                <svg viewBox="0 0 120 90" className="w-full h-24 mb-2">
                  {/* Предыдущие свечи (нисходящий тренд) */}
                  <line x1="18" y1="15" x2="18" y2="20" stroke="#6b7280" strokeWidth="1"/>
                  <rect x="14" y="20" width="8" height="14" fill="#ef4444" opacity="0.5"/>
                  <line x1="18" y1="34" x2="18" y2="40" stroke="#6b7280" strokeWidth="1"/>

                  <line x1="34" y1="25" x2="34" y2="30" stroke="#6b7280" strokeWidth="1"/>
                  <rect x="30" y="30" width="8" height="14" fill="#ef4444" opacity="0.5"/>
                  <line x1="34" y1="44" x2="34" y2="50" stroke="#6b7280" strokeWidth="1"/>

                  {/* Главная свеча — даун-бар с НИЗКИМ объёмом */}
                  <line x1="54" y1="32" x2="54" y2="36" stroke="#60a5fa" strokeWidth="1.5"/>
                  <rect x="49" y="36" width="10" height="14" fill="#60a5fa" rx="1" opacity="0.7"/>
                  <line x1="54" y1="50" x2="54" y2="54" stroke="#60a5fa" strokeWidth="1.5"/>
                  <text x="45" y="30" fontSize="7" fill="#60a5fa" fontFamily="monospace">↓ бар</text>

                  {/* Метка объёма */}
                  <text x="66" y="44" fontSize="7" fill="#60a5fa" fontFamily="monospace">VOL</text>
                  <text x="66" y="53" fontSize="7" fill="#60a5fa" fontFamily="monospace">LOW</text>

                  {/* Объём — маленькие столбики */}
                  <rect x="10" y="76" width="8" height="6" fill="#ef4444" opacity="0.4" rx="1"/>
                  <rect x="26" y="74" width="8" height="8" fill="#ef4444" opacity="0.4" rx="1"/>
                  <rect x="46" y="78" width="14" height="4" fill="#60a5fa" opacity="0.7" rx="1"/>
                  <text x="2" y="88" fontSize="6" fill="#52525b" fontFamily="monospace">Объём</text>
                </svg>
                <p className="text-zinc-400 text-xs font-space-mono leading-relaxed">Падение на низком объёме = продавцов нет. Рынок «сползает» без давления. Вероятный разворот вверх — слабость медведей.</p>
              </div>

              {/* No Demand — бычья свеча узкая на вершине */}
              <div className="border rounded-xl p-3 border-yellow-500/20 bg-yellow-500/5">
                <div className="font-orbitron text-xs font-bold mb-2 text-yellow-400">No Demand — бычья свеча</div>
                <svg viewBox="0 0 120 90" className="w-full h-24 mb-2">
                  {/* Растущий тренд */}
                  <line x1="18" y1="50" x2="18" y2="44" stroke="#6b7280" strokeWidth="1"/>
                  <rect x="14" y="36" width="8" height="14" fill="#22c55e" opacity="0.4"/>
                  <line x1="18" y1="36" x2="18" y2="32" stroke="#6b7280" strokeWidth="1"/>

                  <line x1="34" y1="34" x2="34" y2="28" stroke="#6b7280" strokeWidth="1"/>
                  <rect x="30" y="22" width="8" height="12" fill="#22c55e" opacity="0.4"/>
                  <line x1="34" y1="22" x2="34" y2="18" stroke="#6b7280" strokeWidth="1"/>

                  {/* Главная свеча — No Demand: узкая бычья с низким объёмом */}
                  <line x1="54" y1="14" x2="54" y2="17" stroke="#eab308" strokeWidth="1.5"/>
                  <rect x="49" y="17" width="10" height="5" fill="#eab308" rx="1" opacity="0.8"/>
                  <line x1="54" y1="22" x2="54" y2="25" stroke="#eab308" strokeWidth="1.5"/>

                  {/* Стрелка вниз — предупреждение */}
                  <text x="67" y="20" fontSize="8" fill="#eab308" fontFamily="monospace">← узко</text>
                  <text x="40" y="10" fontSize="7" fill="#eab308" fontFamily="monospace">No Demand</text>

                  {/* Объём низкий */}
                  <rect x="10" y="70" width="8" height="12" fill="#22c55e" opacity="0.4" rx="1"/>
                  <rect x="26" y="68" width="8" height="14" fill="#22c55e" opacity="0.4" rx="1"/>
                  <rect x="46" y="76" width="14" height="6" fill="#eab308" opacity="0.7" rx="1"/>
                  <text x="2" y="88" fontSize="6" fill="#52525b" fontFamily="monospace">Объём</text>
                  <text x="72" y="60" fontSize="6" fill="#ef4444" fontFamily="monospace">↓ скоро</text>
                  <text x="72" y="68" fontSize="6" fill="#ef4444" fontFamily="monospace">  разворот</text>
                </svg>
                <p className="text-zinc-400 text-xs font-space-mono leading-relaxed">Узкая бычья свеча + низкий объём на вершине. Покупатели иссякли. Медведи берут контроль — сигнал выхода из лонга.</p>
              </div>

              {/* No Supply — медвежья свеча узкая на дне */}
              <div className="border rounded-xl p-3 border-purple-500/20 bg-purple-500/5">
                <div className="font-orbitron text-xs font-bold mb-2 text-purple-400">No Supply — медвежья свеча</div>
                <svg viewBox="0 0 120 90" className="w-full h-24 mb-2">
                  {/* Нисходящий тренд */}
                  <line x1="18" y1="18" x2="18" y2="24" stroke="#6b7280" strokeWidth="1"/>
                  <rect x="14" y="24" width="8" height="14" fill="#ef4444" opacity="0.4"/>
                  <line x1="18" y1="38" x2="18" y2="44" stroke="#6b7280" strokeWidth="1"/>

                  <line x1="34" y1="30" x2="34" y2="36" stroke="#6b7280" strokeWidth="1"/>
                  <rect x="30" y="36" width="8" height="12" fill="#ef4444" opacity="0.4"/>
                  <line x1="34" y1="48" x2="34" y2="54" stroke="#6b7280" strokeWidth="1"/>

                  {/* Главная свеча — No Supply: узкая медвежья с низким объёмом */}
                  <line x1="54" y1="50" x2="54" y2="53" stroke="#a855f7" strokeWidth="1.5"/>
                  <rect x="49" y="53" width="10" height="5" fill="#a855f7" rx="1" opacity="0.8"/>
                  <line x1="54" y1="58" x2="54" y2="61" stroke="#a855f7" strokeWidth="1.5"/>

                  <text x="67" y="56" fontSize="8" fill="#a855f7" fontFamily="monospace">← узко</text>
                  <text x="37" y="46" fontSize="7" fill="#a855f7" fontFamily="monospace">No Supply</text>

                  {/* Объём низкий */}
                  <rect x="10" y="70" width="8" height="12" fill="#ef4444" opacity="0.4" rx="1"/>
                  <rect x="26" y="72" width="8" height="10" fill="#ef4444" opacity="0.4" rx="1"/>
                  <rect x="46" y="76" width="14" height="6" fill="#a855f7" opacity="0.7" rx="1"/>
                  <text x="2" y="88" fontSize="6" fill="#52525b" fontFamily="monospace">Объём</text>
                  <text x="72" y="60" fontSize="6" fill="#22c55e" fontFamily="monospace">↑ скоро</text>
                  <text x="72" y="68" fontSize="6" fill="#22c55e" fontFamily="monospace">  разворот</text>
                </svg>
                <p className="text-zinc-400 text-xs font-space-mono leading-relaxed">Узкая медвежья свеча + низкий объём на дне. Продавцы закончились. Сигнал потенциального разворота вверх.</p>
              </div>

            </div>
          </div>
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4">
            <div className="text-white font-orbitron text-xs font-bold mb-3">Ложные пробои (Fakeout / Stop Hunt)</div>
            <p className="text-gray-300 text-sm leading-relaxed mb-3">Ложный пробой — одна из самых частых ловушек для розничных трейдеров. Цена пробивает уровень, провоцируя вход, а затем разворачивается. Научитесь их распознавать — и не попадать в них.</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
              {/* Бычий ложный пробой сопротивления */}
              <div className="bg-zinc-900 border border-red-500/20 rounded-xl p-3">
                <div className="text-red-400 font-orbitron text-xs font-bold mb-2">Ложный пробой сопротивления</div>
                <svg viewBox="0 0 180 130" className="w-full h-32">
                  {/* Линия сопротивления */}
                  <line x1="10" y1="45" x2="170" y2="45" stroke="#ef4444" strokeWidth="1.2" strokeDasharray="5,3"/>
                  <text x="118" y="41" fontSize="6" fill="#ef4444" fontFamily="monospace">Сопротивление</text>

                  {/* Подход к уровню — свечи роста */}
                  <line x1="20" y1="90" x2="20" y2="85" stroke="#9ca3af" strokeWidth="1"/>
                  <rect x="16" y="75" width="8" height="15" fill="#22c55e" opacity="0.5" rx="1"/>
                  <line x1="20" y1="75" x2="20" y2="68" stroke="#9ca3af" strokeWidth="1"/>

                  <line x1="38" y1="75" x2="38" y2="70" stroke="#9ca3af" strokeWidth="1"/>
                  <rect x="34" y="60" width="8" height="15" fill="#22c55e" opacity="0.5" rx="1"/>
                  <line x1="38" y1="60" x2="38" y2="52" stroke="#9ca3af" strokeWidth="1"/>

                  {/* Свеча ложного пробоя — длинная тень выше уровня */}
                  <line x1="58" y1="60" x2="58" y2="50" stroke="#9ca3af" strokeWidth="1"/>
                  <rect x="54" y="50" width="8" height="8" fill="#ef4444" opacity="0.8" rx="1"/>
                  {/* тень вверх — пробивает сопротивление */}
                  <line x1="58" y1="50" x2="58" y2="30" stroke="#ef4444" strokeWidth="1.5"/>
                  <circle cx="58" cy="30" r="3" fill="#ef4444" opacity="0.8"/>
                  <text x="64" y="28" fontSize="6" fill="#ef4444" fontFamily="monospace">Пробой!</text>
                  <text x="64" y="36" fontSize="6" fill="#ef4444" fontFamily="monospace">Тени нет</text>
                  <line x1="58" y1="58" x2="58" y2="63" stroke="#9ca3af" strokeWidth="1"/>

                  {/* Свеча разворота и падение */}
                  <line x1="76" y1="48" x2="76" y2="52" stroke="#9ca3af" strokeWidth="1"/>
                  <rect x="72" y="52" width="8" height="16" fill="#ef4444" opacity="0.7" rx="1"/>
                  <line x1="76" y1="68" x2="76" y2="74" stroke="#9ca3af" strokeWidth="1"/>

                  <line x1="94" y1="58" x2="94" y2="63" stroke="#9ca3af" strokeWidth="1"/>
                  <rect x="90" y="63" width="8" height="18" fill="#ef4444" opacity="0.7" rx="1"/>
                  <line x1="94" y1="81" x2="94" y2="87" stroke="#9ca3af" strokeWidth="1"/>

                  {/* Вход на реальное движение вниз */}
                  <circle cx="76" cy="50" r="3" fill="#22c55e"/>
                  <text x="102" y="65" fontSize="6" fill="#22c55e" fontFamily="monospace">← Вход</text>
                  <text x="102" y="73" fontSize="6" fill="#22c55e" fontFamily="monospace">  (Short)</text>

                  {/* Стрелка вниз */}
                  <polyline points="112,78 112,105 118,98" fill="none" stroke="#22c55e" strokeWidth="1.2" strokeDasharray="3,2"/>
                  <text x="100" y="115" fontSize="6" fill="#22c55e" fontFamily="monospace">Реальное движение ↓</text>
                </svg>
              </div>

              {/* Медвежий ложный пробой поддержки */}
              <div className="bg-zinc-900 border border-green-500/20 rounded-xl p-3">
                <div className="text-green-400 font-orbitron text-xs font-bold mb-2">Ложный пробой поддержки</div>
                <svg viewBox="0 0 180 130" className="w-full h-32">
                  {/* Линия поддержки */}
                  <line x1="10" y1="80" x2="170" y2="80" stroke="#22c55e" strokeWidth="1.2" strokeDasharray="5,3"/>
                  <text x="122" y="76" fontSize="6" fill="#22c55e" fontFamily="monospace">Поддержка</text>

                  {/* Подход к уровню — свечи падения */}
                  <line x1="20" y1="38" x2="20" y2="42" stroke="#9ca3af" strokeWidth="1"/>
                  <rect x="16" y="42" width="8" height="16" fill="#ef4444" opacity="0.5" rx="1"/>
                  <line x1="20" y1="58" x2="20" y2="64" stroke="#9ca3af" strokeWidth="1"/>

                  <line x1="38" y1="50" x2="38" y2="55" stroke="#9ca3af" strokeWidth="1"/>
                  <rect x="34" y="55" width="8" height="16" fill="#ef4444" opacity="0.5" rx="1"/>
                  <line x1="38" y1="71" x2="38" y2="76" stroke="#9ca3af" strokeWidth="1"/>

                  {/* Свеча ложного пробоя — тень ниже поддержки */}
                  <line x1="58" y1="65" x2="58" y2="70" stroke="#9ca3af" strokeWidth="1"/>
                  <rect x="54" y="70" width="8" height="8" fill="#22c55e" opacity="0.8" rx="1"/>
                  {/* тень вниз — пробивает поддержку */}
                  <line x1="58" y1="78" x2="58" y2="100" stroke="#ef4444" strokeWidth="1.5"/>
                  <circle cx="58" cy="100" r="3" fill="#ef4444" opacity="0.8"/>
                  <text x="64" y="104" fontSize="6" fill="#ef4444" fontFamily="monospace">Пробой!</text>
                  <line x1="58" y1="70" x2="58" y2="65" stroke="#9ca3af" strokeWidth="1"/>

                  {/* Свеча разворота и рост */}
                  <line x1="76" y1="72" x2="76" y2="68" stroke="#9ca3af" strokeWidth="1"/>
                  <rect x="72" y="54" width="8" height="18" fill="#22c55e" opacity="0.7" rx="1"/>
                  <line x1="76" y1="54" x2="76" y2="48" stroke="#9ca3af" strokeWidth="1"/>

                  <line x1="94" y1="55" x2="94" y2="50" stroke="#9ca3af" strokeWidth="1"/>
                  <rect x="90" y="38" width="8" height="17" fill="#22c55e" opacity="0.7" rx="1"/>
                  <line x1="94" y1="38" x2="94" y2="33" stroke="#9ca3af" strokeWidth="1"/>

                  {/* Вход */}
                  <circle cx="76" cy="74" r="3" fill="#22c55e"/>
                  <text x="102" y="72" fontSize="6" fill="#22c55e" fontFamily="monospace">← Вход</text>
                  <text x="102" y="80" fontSize="6" fill="#22c55e" fontFamily="monospace">  (Long)</text>

                  {/* Стрелка вверх */}
                  <polyline points="112,45 112,20 118,28" fill="none" stroke="#22c55e" strokeWidth="1.2" strokeDasharray="3,2"/>
                  <text x="100" y="15" fontSize="6" fill="#22c55e" fontFamily="monospace">Реальное движение ↑</text>
                </svg>
              </div>
            </div>
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