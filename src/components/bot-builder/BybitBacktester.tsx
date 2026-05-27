import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Icon from "@/components/ui/icon"
import type { BybitBotConfig } from "./BybitBotTypes"
import { fetchBybitHistory, runBacktest, type BacktestResult } from "./bybitBacktest"

interface Props {
  config: BybitBotConfig
}

type Period = 7 | 14 | 30 | 90

/**
 * 🟠 BybitBacktester — кнопка «Прогнать стратегию по истории».
 *
 * Что делает:
 *   1. Тянет N дней свечей с public Bybit API (без ключей, без бэкенда)
 *   2. Прогоняет те же индикаторы что и сгенерированный Python-бот
 *   3. Симулирует TP/SL, мартингейл, паузу, комиссии
 *   4. Показывает WR / P/L / просадку / список сделок
 *
 * Это первичный фильтр ДО запуска на тестнете. Не учитывает проскальзывание и спред.
 */
export default function BybitBacktester({ config }: Props) {
  const [period, setPeriod] = useState<Period>(30)
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [result, setResult] = useState<BacktestResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [showTrades, setShowTrades] = useState(false)

  // Сколько свечей нужно для выбранного периода
  const candleCount = Math.ceil((period * 24 * 60) / config.bybitTimeframeMin)

  const run = async () => {
    setLoading(true)
    setError(null)
    setResult(null)
    setProgress(0)
    try {
      const category = config.bybitMode === "futures" ? "linear" : "spot"
      const candles = await fetchBybitHistory(
        config.asset,
        category,
        config.bybitTimeframeMin,
        candleCount,
        (loaded, total) => setProgress(Math.min(100, (loaded / total) * 100)),
      )
      if (candles.length < 100) {
        throw new Error(`Получено только ${candles.length} свечей — мало для теста`)
      }
      // Передаём кофиг с гарантированным comboMode (для одиночных стратегий)
      const effectiveCfg: BybitBotConfig = config.comboMode
        ? config
        : { ...config, comboMode: true, comboStrategies: [config.strategy], comboLogic: "OR" }
      const res = runBacktest(candles, effectiveCfg)
      setResult(res)
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    } finally {
      setLoading(false)
    }
  }

  const profit = result ? result.totalPnl : 0
  const isProfit = profit > 0
  const roi = result ? (profit / result.startBalance) * 100 : 0
  const ddPct = result ? (result.maxDrawdown / result.startBalance) * 100 : 0

  const verdict = (() => {
    if (!result) return null
    const wr = result.winRate
    const pf = result.profitFactor
    if (result.trades.length < 10) return { color: "amber", text: "🤔 Мало сделок — нужен длиннее период", grade: "?" }
    if (pf >= 1.5 && wr >= 55) return { color: "emerald", text: "🔥 Хороший результат — можно тестировать на testnet", grade: "A" }
    if (pf >= 1.2 && wr >= 50) return { color: "emerald", text: "✅ Прибыльно, но без рекордов — пробуй на testnet", grade: "B" }
    if (pf >= 0.95 && wr >= 45) return { color: "amber", text: "⚖️ На грани — поэкспериментируй с TP/SL", grade: "C" }
    return { color: "red", text: "❌ Убыточно — пересмотри стратегию или таймфрейм", grade: "D" }
  })()

  return (
    <Card className="bg-zinc-900 border-purple-500/30">
      <CardHeader className="pb-3">
        <CardTitle className="font-orbitron text-white text-base flex items-center gap-2">
          <Icon name="Activity" size={18} className="text-purple-400" />
          Бэктест стратегии
        </CardTitle>
        <p className="text-zinc-500 font-space-mono text-[11px] mt-1">
          Прогон на реальной истории Bybit. Без ключей, в браузере. Покажет WR / P/L до запуска.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Выбор периода */}
        <div>
          <label className="text-zinc-400 font-space-mono text-xs mb-1.5 block">Период истории</label>
          <div className="grid grid-cols-4 gap-1.5">
            {([7, 14, 30, 90] as Period[]).map((d) => (
              <button
                key={d}
                onClick={() => setPeriod(d)}
                disabled={loading}
                className={`py-2 rounded-lg text-xs font-orbitron font-bold border transition-all ${
                  period === d
                    ? "bg-purple-500 border-purple-500 text-white"
                    : "bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-zinc-500"
                }`}
              >
                {d} дн
              </button>
            ))}
          </div>
          <p className="text-zinc-600 font-space-mono text-[10px] mt-1.5">
            ~{candleCount.toLocaleString()} свечей по {config.bybitTimeframeMin}мин на {config.asset}
          </p>
        </div>

        {/* Кнопка запуска */}
        <button
          onClick={run}
          disabled={loading}
          className="w-full bg-purple-500 hover:bg-purple-400 disabled:bg-zinc-700 disabled:text-zinc-500 text-white font-orbitron font-bold py-3 rounded-xl transition-all shadow-lg shadow-purple-500/20 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Icon name="Loader2" size={16} className="animate-spin" />
              Загрузка истории... {progress.toFixed(0)}%
            </>
          ) : (
            <>
              <Icon name="Play" size={16} />
              Прогнать за {period} дней
            </>
          )}
        </button>

        {loading && (
          <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-pink-400 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
            <p className="text-red-300 font-orbitron text-xs font-bold mb-1">❌ Ошибка</p>
            <p className="text-red-400 font-space-mono text-xs">{error}</p>
            <p className="text-zinc-500 font-space-mono text-[10px] mt-2">
              Возможно, Bybit недоступен из твоей сети — попробуй включить VPN или другую пару.
            </p>
          </div>
        )}

        {result && (
          <div className="space-y-4">
            {/* Вердикт */}
            {verdict && (
              <div
                className={`rounded-lg p-3 border flex items-center justify-between gap-3 ${
                  verdict.color === "emerald"
                    ? "bg-emerald-500/10 border-emerald-500/30"
                    : verdict.color === "amber"
                    ? "bg-amber-500/10 border-amber-500/30"
                    : "bg-red-500/10 border-red-500/30"
                }`}
              >
                <p
                  className={`font-orbitron text-xs font-bold ${
                    verdict.color === "emerald" ? "text-emerald-300" : verdict.color === "amber" ? "text-amber-300" : "text-red-300"
                  }`}
                >
                  {verdict.text}
                </p>
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-orbitron font-bold text-lg flex-shrink-0 ${
                    verdict.color === "emerald"
                      ? "bg-emerald-500 text-black"
                      : verdict.color === "amber"
                      ? "bg-amber-500 text-black"
                      : "bg-red-500 text-white"
                  }`}
                >
                  {verdict.grade}
                </div>
              </div>
            )}

            {/* Главные метрики */}
            <div className="grid grid-cols-3 gap-2">
              <div className={`rounded-lg p-3 border ${isProfit ? "bg-emerald-500/10 border-emerald-500/30" : "bg-red-500/10 border-red-500/30"}`}>
                <p className="text-zinc-500 font-space-mono text-[10px]">P/L</p>
                <p className={`font-orbitron font-bold text-lg ${isProfit ? "text-emerald-400" : "text-red-400"}`}>
                  {isProfit ? "+" : ""}{profit.toFixed(2)}
                </p>
                <p className="text-zinc-500 font-space-mono text-[10px]">USDT ({roi.toFixed(1)}%)</p>
              </div>
              <div className="rounded-lg p-3 border bg-zinc-800/60 border-zinc-700">
                <p className="text-zinc-500 font-space-mono text-[10px]">Win Rate</p>
                <p className={`font-orbitron font-bold text-lg ${result.winRate >= 55 ? "text-emerald-400" : result.winRate >= 45 ? "text-amber-400" : "text-red-400"}`}>
                  {result.winRate.toFixed(1)}%
                </p>
                <p className="text-zinc-500 font-space-mono text-[10px]">{result.wins}W / {result.losses}L</p>
              </div>
              <div className="rounded-lg p-3 border bg-zinc-800/60 border-zinc-700">
                <p className="text-zinc-500 font-space-mono text-[10px]">Просадка</p>
                <p className={`font-orbitron font-bold text-lg ${ddPct < 10 ? "text-emerald-400" : ddPct < 20 ? "text-amber-400" : "text-red-400"}`}>
                  -{result.maxDrawdown.toFixed(2)}
                </p>
                <p className="text-zinc-500 font-space-mono text-[10px]">USDT ({ddPct.toFixed(1)}%)</p>
              </div>
            </div>

            {/* Доп. метрики */}
            <div className="grid grid-cols-2 gap-2 text-xs font-space-mono">
              <div className="bg-zinc-800/40 rounded p-2 flex justify-between">
                <span className="text-zinc-500">Сделок:</span>
                <span className="text-white font-bold">{result.trades.length}</span>
              </div>
              <div className="bg-zinc-800/40 rounded p-2 flex justify-between">
                <span className="text-zinc-500">Profit Factor:</span>
                <span className={`font-bold ${result.profitFactor >= 1.5 ? "text-emerald-400" : result.profitFactor >= 1 ? "text-amber-400" : "text-red-400"}`}>
                  {result.profitFactor.toFixed(2)}
                </span>
              </div>
              <div className="bg-zinc-800/40 rounded p-2 flex justify-between">
                <span className="text-zinc-500">Средний WIN:</span>
                <span className="text-emerald-400">+{result.avgWin.toFixed(2)}</span>
              </div>
              <div className="bg-zinc-800/40 rounded p-2 flex justify-between">
                <span className="text-zinc-500">Средний LOSS:</span>
                <span className="text-red-400">{result.avgLoss.toFixed(2)}</span>
              </div>
              <div className="bg-zinc-800/40 rounded p-2 flex justify-between">
                <span className="text-zinc-500">Лучшая:</span>
                <span className="text-emerald-400">+{result.bestTrade.toFixed(2)}</span>
              </div>
              <div className="bg-zinc-800/40 rounded p-2 flex justify-between">
                <span className="text-zinc-500">Худшая:</span>
                <span className="text-red-400">{result.worstTrade.toFixed(2)}</span>
              </div>
              <div className="bg-zinc-800/40 rounded p-2 flex justify-between col-span-2">
                <span className="text-zinc-500">Период:</span>
                <span className="text-white">
                  {result.durationDays.toFixed(1)} дн ({result.candles.toLocaleString()} свечей)
                </span>
              </div>
            </div>

            {/* Журнал сделок */}
            {result.trades.length > 0 && (
              <div>
                <button
                  onClick={() => setShowTrades(!showTrades)}
                  className="w-full flex items-center justify-between bg-zinc-800/60 hover:bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-xs font-orbitron font-bold text-zinc-300 transition-all"
                >
                  <span>📋 Журнал сделок ({result.trades.length})</span>
                  <Icon name={showTrades ? "ChevronUp" : "ChevronDown"} size={14} />
                </button>
                {showTrades && (
                  <div className="mt-2 max-h-80 overflow-y-auto border border-zinc-800 rounded-lg">
                    <table className="w-full text-[10px] font-space-mono">
                      <thead className="bg-zinc-800/60 text-zinc-400 sticky top-0">
                        <tr>
                          <th className="text-left px-2 py-1.5">#</th>
                          <th className="text-left px-2 py-1.5">Дата</th>
                          <th className="text-left px-2 py-1.5">Сторона</th>
                          <th className="text-right px-2 py-1.5">Вход</th>
                          <th className="text-right px-2 py-1.5">Выход</th>
                          <th className="text-right px-2 py-1.5">P/L</th>
                        </tr>
                      </thead>
                      <tbody>
                        {result.trades.map((t, idx) => (
                          <tr
                            key={idx}
                            className={`border-t border-zinc-800/60 ${t.result === "WIN" ? "hover:bg-emerald-500/5" : "hover:bg-red-500/5"}`}
                          >
                            <td className="px-2 py-1 text-zinc-500">{idx + 1}</td>
                            <td className="px-2 py-1 text-zinc-400">
                              {new Date(t.ts).toLocaleDateString("ru-RU", { day: "2-digit", month: "2-digit" })}{" "}
                              {new Date(t.ts).toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" })}
                            </td>
                            <td className={`px-2 py-1 ${t.side === "BUY" ? "text-emerald-400" : "text-red-400"}`}>{t.side}</td>
                            <td className="px-2 py-1 text-right text-zinc-300">{t.entry.toFixed(4)}</td>
                            <td className="px-2 py-1 text-right text-zinc-300">{t.exit.toFixed(4)}</td>
                            <td className={`px-2 py-1 text-right font-bold ${t.pnlUsdt > 0 ? "text-emerald-400" : "text-red-400"}`}>
                              {t.pnlUsdt > 0 ? "+" : ""}{t.pnlUsdt.toFixed(2)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            <div className="bg-zinc-800/60 border border-zinc-700 rounded-lg p-2 text-[10px] font-space-mono text-zinc-500">
              ℹ️ Бэктест НЕ учитывает: проскальзывание, спред, задержки сети, изменение комиссий.
              Реальный результат может отличаться на ±20%. Всегда подтверждай на testnet.
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
