import React from "react"
import {
  LaunchChecklist,
  MonitoringDashboard,
  RiskCalculator,
} from "./BotsCharts"
import type { Chapter } from "./BotsChapterTypes"

export const chapterLaunch: Chapter = {
  id: "launch",
  badge: "Глава 5",
  title: "Запуск бота: чеклист перед стартом",
  summary: "Перед запуском бота с реальными деньгами пройдите этот чеклист. Пропуск любого пункта может стоить части депозита.",
  relevance2026: {
    score: 97,
    label: "Критический этап",
    aiImpact: 50,
    botImpact: 100,
    aiNote: "ИИ-чеклисты (встроенные в платформы) автоматически проверяют часть пунктов, но финальное решение о запуске остаётся за трейдером.",
    botNote: "В 2025-2026 гг. участились случаи потерь при запуске ботов без проверки API-лимитов и риск-параметров. Чеклист — не формальность, а страховка.",
  },
  sections: [
    {
      title: "Полный чеклист запуска по 4 категориям",
      content: (
        <div className="space-y-3">
          <p className="text-gray-300 leading-relaxed">Этот чеклист составлен на основе опыта сотен трейдеров. Каждый пункт — результат чьей-то дорогостоящей ошибки.</p>
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
            <div className="text-red-400 font-orbitron text-xs font-bold mb-2">Реальная история: пропущенный пункт = $8,000 потерь</div>
            <p className="text-zinc-400 text-xs font-space-mono leading-relaxed">Денис запустил Grid-бот на BTC, не выставив Daily Stop Loss. В день обвала FTX (ноябрь 2022) BTC упал на 27% за 6 часов — бот продолжал «покупать дно» на каждом уровне сетки. Депозит $30,000 превратился в $22,000 за один день. С Daily Stop Loss 5% бот остановился бы при потере $1,500. <span className="text-white">Чеклист — не формальность, это защита капитала.</span></p>
          </div>
          <LaunchChecklist />
        </div>
      )
    },
    {
      title: "Мониторинг и ежедневное обслуживание",
      content: (
        <div className="space-y-3">
          <p className="text-gray-300 leading-relaxed">Запустить бота — это 20% работы. Остальные 80% — мониторинг и своевременные корректировки.</p>
          <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
            <div className="text-green-400 font-orbitron text-xs font-bold mb-2">Кейс: мониторинг спас 40% капитала</div>
            <p className="text-zinc-400 text-xs font-space-mono leading-relaxed">Сергей настроил Telegram-уведомления от Freqtrade. В понедельник утром пришёл алерт: «Win Rate за неделю 18%, Profit Factor 0.41». Это был сигнал — рынок перешёл из тренда в боковик, стратегия генерировала убытки. Сергей приостановил бота, пересмотрел параметры. Без мониторинга — бот продолжал бы торговать ещё месяц, съев весь профит за прошлые 3 месяца. <span className="text-white">Еженедельная проверка метрик — обязательная рутина.</span></p>
          </div>
          <MonitoringDashboard />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-3">
              <div className="text-blue-400 font-orbitron text-xs font-bold mb-2">Ежедневно</div>
              <ul className="text-zinc-400 text-xs font-space-mono space-y-1">
                <li>→ P&L за день</li>
                <li>→ Количество сделок</li>
                <li>→ Открытые позиции</li>
                <li>→ Ошибки в логах</li>
              </ul>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-3">
              <div className="text-purple-400 font-orbitron text-xs font-bold mb-2">Еженедельно</div>
              <ul className="text-zinc-400 text-xs font-space-mono space-y-1">
                <li>→ Win Rate за неделю</li>
                <li>→ Сравнение с бэктестом</li>
                <li>→ Состояние рынка (тренд/флэт)</li>
                <li>→ Актуальность параметров</li>
              </ul>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-3">
              <div className="text-yellow-400 font-orbitron text-xs font-bold mb-2">Ежемесячно</div>
              <ul className="text-zinc-400 text-xs font-space-mono space-y-1">
                <li>→ Переоптимизация параметров</li>
                <li>→ Анализ просадок</li>
                <li>→ Обновление стратегии</li>
                <li>→ Смена ключей API</li>
              </ul>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Риск-менеджмент для бота: защита капитала",
      content: (
        <div className="space-y-3">
          <p className="text-gray-300 leading-relaxed">Риск-менеджмент бота — это те же правила, что и для ручной торговли, только автоматизированные.</p>
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
            <div className="text-yellow-400 font-orbitron text-xs font-bold mb-2">Реальный пример: «10% сначала» работает</div>
            <p className="text-zinc-400 text-xs font-space-mono leading-relaxed">Татьяна планировала запустить бота с $50,000. По совету запустила с $5,000 (10%). За первые 3 недели обнаружила баг в логике: бот открывал дублирующиеся позиции при определённых условиях. Потеря составила $340 (6.8% от $5,000). Если бы запустила с полным капиталом — потеря была бы $3,400. <span className="text-white">Тестовый запуск с 10% — обязательный этап, который окупается всегда.</span></p>
          </div>
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4">
            <svg viewBox="0 0 360 140" className="w-full h-36">
              <rect x="20" y="20" width="320" height="100" rx="8" fill="#ef444408" stroke="#ef444430" strokeWidth="1" />
              <rect x="35" y="32" width="290" height="77" rx="6" fill="#f59e0b08" stroke="#f59e0b30" strokeWidth="1" />
              <rect x="50" y="44" width="260" height="54" rx="5" fill="#22c55e08" stroke="#22c55e30" strokeWidth="1" />
              <rect x="65" y="56" width="230" height="32" rx="4" fill="#3b82f608" stroke="#3b82f630" strokeWidth="1" />
              <text x="185" y="76" fontSize="11" fill="#93c5fd" textAnchor="middle" fontFamily="monospace" fontWeight="bold">КАПИТАЛ БОТА</text>
              <text x="185" y="90" fontSize="8" fill="#60a5fa" textAnchor="middle" fontFamily="monospace">$1,000 (10% от общего)</text>
              <text x="30" y="84" fontSize="8" fill="#86efac" fontFamily="monospace" transform="rotate(-90, 30, 84)">Daily SL</text>
              <text x="15" y="73" fontSize="8" fill="#fcd34d" fontFamily="monospace" transform="rotate(-90, 15, 73)">Global SL</text>
              <text x="185" y="130" fontSize="8" fill="#52525b" textAnchor="middle" fontFamily="monospace">Слои защиты капитала: начинайте с 10% депозита → расширяйте после 30 дней прибыли</text>
            </svg>
          </div>
          <div className="space-y-2">
            {[
              { title: "Daily Stop Loss (Дневной лимит потерь)", desc: "Установите максимальный убыток за день — например 3%. При достижении бот прекращает торговать до следующего дня. Это защищает от лавинных потерь при аномальной волатильности.", color: "text-red-400" },
              { title: "Лимит размера позиции", desc: "Каждая позиция бота не должна занимать более 10–15% от капитала бота. Если бот торгует несколько пар — диверсификация снижает риск одного плохого актива.", color: "text-yellow-400" },
              { title: "Глобальный Stop Loss", desc: "Если бот потерял 15–20% от стартового капитала — автоматически останавливается и требует ручного перезапуска. Это сигнал пересмотреть стратегию, а не продолжать торговать.", color: "text-orange-400" },
              { title: "Минимальный стартовый капитал", desc: "Запускайте с 10–20% от планируемого капитала. Дайте боту поработать 2–4 недели — сравните результаты с бэктестом. Только после подтверждения добавляйте полный капитал.", color: "text-green-400" },
            ].map((rule, i) => (
              <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-lg p-3">
                <div className={`font-orbitron text-xs font-bold mb-1 ${rule.color}`}>{rule.title}</div>
                <p className="text-zinc-400 text-xs font-space-mono leading-relaxed">{rule.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-2">
            <p className="text-zinc-500 text-xs font-space-mono mb-3">Рассчитайте параметры для своего депозита:</p>
            <RiskCalculator />
          </div>
        </div>
      )
    },
  ]
}

export const chaptersLaunch: Chapter[] = [chapterLaunch]