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
          <div className="bg-zinc-900 border border-green-500/20 rounded-xl p-4">
            <div className="text-green-400 font-orbitron text-xs font-bold mb-2">Инструменты для ведения журнала</div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-space-mono">
              {["Notion", "Google Sheets", "Tradervue", "Edgewonk"].map(t => (
                <div key={t} className="bg-zinc-950 rounded px-3 py-2 text-center text-zinc-300">{t}</div>
              ))}
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
          </div>
        </div>
      )
    },
  ]
}

export const articlesRisk: Article[] = [articleRisk]
