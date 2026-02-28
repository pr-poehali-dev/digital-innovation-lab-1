import type { PracticeStep } from "./practiceStepTypes"

export const stepRiskManagement: PracticeStep = {
  id: "risk-management",
  badge: "Шаг 3",
  color: "red",
  icon: "Shield",
  title: "Риск-менеджмент: сколько ставить на сделку",
  summary: "Правила управления капиталом на Pocket Option. Без этого даже 70% правильных сигналов превращаются в слив депозита.",
  sections: [
    {
      title: "Правило 2% на Pocket Option",
      content: (
        <div className="space-y-3">
          <p className="text-gray-300 leading-relaxed">
            На бинарных опционах риск на сделку = размер ставки (при проигрыше теряем всю ставку).
            Поэтому <span className="text-red-400 font-semibold">правило 1–2% критично</span> как нигде.
          </p>
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4">
            <div className="space-y-3">
              {[
                { deposit: "$1,000", pct: "2%", stake: "$20", label: "Рекомендуемый старт" },
                { deposit: "$1,000", pct: "5%", stake: "$50", label: "Агрессивно — риск слива" },
                { deposit: "$1,000", pct: "10%", stake: "$100", label: "Слив за 10 проигрышей" },
              ].map((row, i) => (
                <div key={i} className={`flex items-center gap-3 p-2 rounded-lg border ${i === 0 ? "bg-green-500/10 border-green-500/30" : i === 1 ? "bg-yellow-500/10 border-yellow-500/30" : "bg-red-500/10 border-red-500/30"}`}>
                  <div className={`text-xs font-space-mono w-4 ${i === 0 ? "text-green-400" : i === 1 ? "text-yellow-400" : "text-red-400"}`}>
                    {i === 0 ? "✓" : "✗"}
                  </div>
                  <div className="flex-1 text-xs font-space-mono text-zinc-300">
                    Депозит {row.deposit} × {row.pct} = <span className="font-bold text-white">{row.stake}</span> ставка
                  </div>
                  <div className={`text-xs font-orbitron ${i === 0 ? "text-green-400" : i === 1 ? "text-yellow-400" : "text-red-400"}`}>{row.label}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
            <div className="text-red-400 font-orbitron text-xs font-bold mb-2">Математика выживания на Pocket Option</div>
            <p className="text-zinc-400 text-xs font-space-mono leading-relaxed">
              При 2% ставке: 10 проигрышей подряд = -18.3% депозита. Можно восстановиться.<br/>
              При 10% ставке: 10 проигрышей подряд = -65.1% депозита. Восстановиться крайне сложно.<br/>
              <span className="text-white">Серия из 10 проигрышей при 55% Win Rate встречается в 0.25% случаев — это реально.</span>
            </p>
          </div>

          <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
            <div className="text-blue-400 font-orbitron text-xs font-bold mb-2">Из жизни: правило 2% от Эда Сейкоты</div>
            <p className="text-zinc-300 text-xs font-space-mono leading-relaxed">
              Эд Сейкота — трейдер-легенда, превративший $5,000 в $15 млн за 12 лет — публично говорил,
              что управление риском важнее любой стратегии входа: «Долгосрочное выживание полностью зависит от размера позиции».
              Он никогда не рисковал более чем 2–3% на одну сделку, даже в периоды максимальной уверенности.
              Именно это позволило ему пережить десятки кризисов без серьёзных потерь капитала.
            </p>
          </div>
        </div>
      )
    },
    {
      title: "Дневной лимит: когда останавливаться",
      content: (
        <div className="space-y-3">
          <p className="text-gray-300 leading-relaxed">
            Даже с правильной стратегией бывают плохие дни. <span className="text-yellow-400 font-semibold">Дневной стоп-лосс</span> защищает от эмоциональных решений.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-zinc-900 border border-red-500/30 rounded-xl p-4">
              <div className="text-red-400 font-orbitron text-xs font-bold mb-3">Дневной Stop Loss</div>
              <div className="text-3xl font-orbitron font-bold text-red-400 mb-2">-6%</div>
              <p className="text-zinc-400 text-xs font-space-mono leading-relaxed">
                Потеряли 3 ставки по 2% → стоп. Закрываем платформу до следующего дня. Без исключений.
              </p>
            </div>
            <div className="bg-zinc-900 border border-green-500/30 rounded-xl p-4">
              <div className="text-green-400 font-orbitron text-xs font-bold mb-3">Дневной Take Profit</div>
              <div className="text-3xl font-orbitron font-bold text-green-400 mb-2">+10%</div>
              <p className="text-zinc-400 text-xs font-space-mono leading-relaxed">
                Заработали 10% за день → тоже стоп. Жадность убивает прибыль. Фиксируем и уходим.
              </p>
            </div>
          </div>

          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
            <div className="text-yellow-400 font-orbitron text-xs font-bold mb-2">Из жизни: правило Джорджа Сороса о потерях</div>
            <p className="text-zinc-300 text-xs font-space-mono leading-relaxed">
              Джордж Сорос — один из самых богатых трейдеров в истории — имел жёсткое правило:
              если он чувствовал, что «не в форме» или рынок ведёт себя непредсказуемо, он просто переставал торговать.
              «Не важно, правы вы или нет. Важно, сколько вы зарабатываете, когда правы, и сколько теряете, когда ошибаетесь».
              Дневной лимит — это формализация того же принципа: плохой день заканчиваем заранее.
            </p>
          </div>
        </div>
      )
    },
    {
      title: "Журнал трейдера: как его вести",
      content: (
        <div className="space-y-3">
          <p className="text-gray-300 leading-relaxed">
            Журнал сделок — инструмент №1 для роста. Без него невозможно понять, что работает, а что нет.
          </p>
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4">
            <div className="font-orbitron text-xs font-bold text-zinc-400 mb-3">Минимальная запись после каждой сделки</div>
            <div className="space-y-2">
              {[
                { field: "Дата/время", example: "28.02.2026, 14:40", color: "text-blue-400" },
                { field: "Инструмент", example: "BTC/USD, M5", color: "text-purple-400" },
                { field: "Направление", example: "PUT", color: "text-red-400" },
                { field: "Сигналы", example: "EMA нисход. + сопротивление $96,580 + RSI 68", color: "text-yellow-400" },
                { field: "Ставка", example: "$20 (2% от $1,000)", color: "text-green-400" },
                { field: "Результат", example: "Выигрыш / Проигрыш / сумма", color: "text-zinc-400" },
              ].map((row, i) => (
                <div key={i} className="flex gap-2 items-center">
                  <span className={`text-xs font-orbitron w-28 shrink-0 ${row.color}`}>{row.field}:</span>
                  <span className="text-xs font-space-mono text-zinc-400">{row.example}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4">
            <div className="text-purple-400 font-orbitron text-xs font-bold mb-2">Из жизни: журнал Ливермора и Далио</div>
            <p className="text-zinc-300 text-xs font-space-mono leading-relaxed">
              Джесси Ливермор — трейдер начала XX века, сделавший состояние на «чёрный четверг» 1929 года — вёл детальные дневники каждой сделки.
              Рэй Далио, основатель Bridgewater Associates (крупнейший хедж-фонд в мире), до сих пор фиксирует гипотезы и их результаты.
              Он называет это «петлёй обратной связи»: без записей ты не можешь учиться, потому что память субъективна — мозг «забывает» ошибки.
              Ведение журнала — это то, что отличает профессионала от любителя на любом рынке.
            </p>
          </div>
        </div>
      )
    }
  ]
}

export const stepBotAutomation: PracticeStep = {
  id: "bot-automation",
  badge: "Шаг 4",
  color: "purple",
  icon: "Bot",
  title: "Автоматизация: когда нужен торговый бот",
  summary: "Боты убирают эмоции из торговли и работают 24/7. Но они решают только часть задач — понимание рынка остаётся за человеком.",
  sections: [
    {
      title: "Бот vs ручная торговля: что выбрать",
      content: (
        <div className="space-y-3">
          <p className="text-gray-300 leading-relaxed">
            Бот — это инструмент, а не волшебная кнопка. Он хорош там, где нужна дисциплина и скорость реакции.
            Плох там, где нужно принимать нестандартные решения.
          </p>
          <div className="space-y-2">
            {[
              {
                aspect: "Эмоции",
                bot: "Торгует по правилам без страха и жадности",
                human: "Может нарушить правила под давлением рынка",
                winner: "bot",
              },
              {
                aspect: "Скорость",
                bot: "Реагирует за миллисекунды",
                human: "Анализирует 5–30 секунд перед входом",
                winner: "bot",
              },
              {
                aspect: "Адаптация",
                bot: "Не видит смену рыночного режима",
                human: "Может подстроиться под новые условия",
                winner: "human",
              },
              {
                aspect: "Режим 24/7",
                bot: "Работает постоянно без перерывов",
                human: "Устаёт, теряет концентрацию",
                winner: "bot",
              },
            ].map((row, i) => (
              <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-lg p-3">
                <div className="text-zinc-400 font-orbitron text-xs mb-2">{row.aspect}</div>
                <div className="grid grid-cols-2 gap-2">
                  <div className={`text-xs font-space-mono p-2 rounded ${row.winner === "bot" ? "bg-purple-500/20 text-purple-300" : "bg-zinc-800 text-zinc-400"}`}>
                    <span className="font-bold">Бот: </span>{row.bot}
                  </div>
                  <div className={`text-xs font-space-mono p-2 rounded ${row.winner === "human" ? "bg-blue-500/20 text-blue-300" : "bg-zinc-800 text-zinc-400"}`}>
                    <span className="font-bold">Человек: </span>{row.human}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4">
            <div className="text-purple-400 font-orbitron text-xs font-bold mb-2">Из жизни: как работает Renaissance Technologies</div>
            <p className="text-zinc-300 text-xs font-space-mono leading-relaxed">
              Medallion Fund от Renaissance Technologies — самый успешный хедж-фонд в истории (+66% годовых в среднем за 30 лет).
              Он полностью алгоритмический: там работают математики и физики, а не традиционные трейдеры.
              Но даже они постоянно вмешиваются вручную при смене рыночного режима. Чистая автоматизация работает лишь в стабильных условиях —
              именно поэтому понимание рынка важнее любого алгоритма.
            </p>
          </div>
        </div>
      )
    },
    {
      title: "DCA-бот: стратегия для крипто-рынка",
      content: (
        <div className="space-y-3">
          <p className="text-gray-300 leading-relaxed">
            Dollar Cost Averaging (DCA) — покупка фиксированной суммы актива через равные интервалы времени.
            Не нужно угадывать «дно» — стратегия усредняет цену автоматически.
          </p>
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4">
            <div className="font-orbitron text-xs font-bold text-zinc-400 mb-3">Пример DCA на BTC за 4 недели</div>
            <div className="space-y-2">
              {[
                { week: "Неделя 1", price: "$94,000", amount: "$100", btc: "0.00106 BTC" },
                { week: "Неделя 2", price: "$91,000", amount: "$100", btc: "0.00110 BTC" },
                { week: "Неделя 3", price: "$96,500", amount: "$100", btc: "0.00104 BTC" },
                { week: "Неделя 4", price: "$98,000", amount: "$100", btc: "0.00102 BTC" },
              ].map((row, i) => (
                <div key={i} className="flex items-center gap-2 text-xs font-space-mono">
                  <span className="text-zinc-500 w-20">{row.week}</span>
                  <span className="text-zinc-400 w-20">{row.price}</span>
                  <span className="text-white w-14">{row.amount}</span>
                  <span className="text-green-400">{row.btc}</span>
                </div>
              ))}
              <div className="border-t border-zinc-800 pt-2 flex items-center gap-2 text-xs font-space-mono">
                <span className="text-zinc-500 w-20">Итого</span>
                <span className="text-yellow-400 w-20">Ср. $94,875</span>
                <span className="text-white w-14">$400</span>
                <span className="text-green-400 font-bold">0.00422 BTC</span>
              </div>
            </div>
          </div>

          <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
            <div className="text-green-400 font-orbitron text-xs font-bold mb-2">Из жизни: как инвестирует Майкл Сэйлор</div>
            <p className="text-zinc-300 text-xs font-space-mono leading-relaxed">
              Майкл Сэйлор, CEO MicroStrategy, публично применяет принцип DCA для корпоративных покупок биткоина.
              Компания покупает BTC каждый квартал на фиксированную сумму — независимо от цены.
              К 2024 году MicroStrategy накопила более 190,000 BTC со средней ценой покупки около $31,224.
              При цене BTC выше $95K — это многократный рост. Систематичность важнее попытки поймать «идеальный момент».
            </p>
          </div>
        </div>
      )
    },
    {
      title: "Grid-бот: заработок на волатильности",
      content: (
        <div className="space-y-3">
          <p className="text-gray-300 leading-relaxed">
            Grid-бот выставляет сетку ордеров на покупку и продажу. Каждое колебание цены внутри диапазона приносит прибыль.
            Идеален для боковых рынков, которые составляют 70% времени.
          </p>
          <div className="space-y-2">
            {[
              {
                param: "Диапазон",
                value: "$93,000 — $99,000",
                desc: "Зона, где BTC торгуется в боковике",
                color: "text-blue-400"
              },
              {
                param: "Шаг сетки",
                value: "$500 (12 уровней)",
                desc: "Каждые $500 — ордер на покупку и продажу",
                color: "text-purple-400"
              },
              {
                param: "Прибыль с шага",
                value: "0.5% за движение",
                desc: "Бот зарабатывает на каждом полном качании цены",
                color: "text-green-400"
              },
              {
                param: "Риск",
                value: "Выход из диапазона",
                desc: "Если BTC уходит ниже $93K или выше $99K — бот останавливается",
                color: "text-red-400"
              },
            ].map((row, i) => (
              <div key={i} className="flex gap-3 items-start bg-zinc-900 border border-zinc-800 rounded-lg p-3">
                <div className={`font-orbitron text-xs font-bold ${row.color} w-20 shrink-0`}>{row.param}</div>
                <div>
                  <div className="text-white text-xs font-space-mono font-bold mb-0.5">{row.value}</div>
                  <p className="text-zinc-500 text-xs font-space-mono">{row.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
            <div className="text-blue-400 font-orbitron text-xs font-bold mb-2">Из жизни: алгоритмы маркет-мейкеров</div>
            <p className="text-zinc-300 text-xs font-space-mono leading-relaxed">
              Крупные маркет-мейкеры (Citadel Securities, Virtu Financial) зарабатывают именно на сетке ордеров — выставляя bid и ask одновременно.
              Они не угадывают направление: они зарабатывают на спреде и объёме.
              Grid-бот — это доступная версия той же стратегии для розничного трейдера.
              По данным Virtu Financial, компания была прибыльна в 1,237 из 1,238 торговых дней — именно благодаря этому подходу.
            </p>
          </div>
        </div>
      )
    }
  ]
}
