import type { ReactNode } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import Icon from "@/components/ui/icon"
import type { POBotConfig } from "./PocketOptionBotTypes"

interface Props {
  config: POBotConfig
  set: (patch: Partial<POBotConfig>) => void
  /** Готовый AI-комментарий (вычисляется в родителе из betComment+AIComment). */
  aiCommentSlot?: ReactNode
}

/**
 * Раздел "Управление ставкой" — реорганизован в 3 карточки:
 *   📊 Размер ставки         — сколько ставим за сделку (%, валюта, выплата)
 *   🛑 Дневные лимиты и стопы — TP, SL, лимит сделок, пауза после проигрышей
 *   🎚 Режим запуска          — разогрев, сильный тренд, демо/реал, авто-рестарт
 *
 * Раньше это была одна гигантская карточка с 15+ полями вперемешку.
 * Раздробление: проще читать, проще понимать что от чего зависит.
 */
export function BetManagementCard({ config, set, aiCommentSlot }: Props) {
  return (
    <>
      {/* ═══════ Карточка 1: Размер ставки ═══════ */}
      <Card className="bg-zinc-900 border-red-500/20">
        <CardHeader className="pb-3">
          <CardTitle className="font-orbitron text-white text-base flex items-center gap-2">
            <Icon name="Coins" size={18} className="text-red-400" />
            Размер ставки
          </CardTitle>
          <p className="text-zinc-500 font-space-mono text-[11px] mt-1">
            Сколько денег бот ставит на одну сделку
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-zinc-300 text-sm">Ставка в % от баланса</Label>
              <p className="text-zinc-500 text-xs font-space-mono">Иначе — фиксированная сумма в валюте счёта</p>
            </div>
            <Switch checked={config.betPercent} onCheckedChange={(v) => set({ betPercent: v })} />
          </div>

          <div>
            <Label className="text-zinc-400 font-space-mono text-xs mb-1.5 block">
              {config.betPercent ? "Ставка (% от баланса)" : `Ставка (${config.currency})`}
            </Label>
            <div className="flex items-center gap-3">
              <Slider
                min={config.betPercent ? 1 : (config.currency === "RUB" ? 50 : config.currency === "INR" ? 50 : 1)}
                max={config.betPercent ? 50 : (config.currency === "RUB" ? 10000 : config.currency === "INR" ? 5000 : config.currency === "BRL" ? 500 : 200)}
                step={config.betPercent ? 1 : (config.currency === "RUB" ? 50 : config.currency === "INR" ? 50 : 1)}
                value={[config.betAmount]}
                onValueChange={([v]) => set({ betAmount: v })}
                className="flex-1"
              />
              <span className="text-red-400 font-orbitron font-bold text-sm w-16 text-right">
                {config.betAmount}{config.betPercent ? "%" : ` ${config.currency}`}
              </span>
            </div>
          </div>

          <div>
            <Label className="text-zinc-400 font-space-mono text-xs mb-1.5 block">Валюта счёта</Label>
            <Select value={config.currency} onValueChange={(v) => {
              const defaults: Record<string, { betAmount: number; takeProfitRub: number; stopLossRub: number }> = {
                RUB: { betAmount: 100, takeProfitRub: 3000, stopLossRub: 1500 },
                USD: { betAmount: 5,   takeProfitRub: 30,   stopLossRub: 15   },
                EUR: { betAmount: 5,   takeProfitRub: 30,   stopLossRub: 15   },
                BRL: { betAmount: 25,  takeProfitRub: 150,  stopLossRub: 75   },
                INR: { betAmount: 400, takeProfitRub: 2500, stopLossRub: 1000 },
              }
              set({ currency: v, ...(defaults[v] ?? {}) })
            }}>
              <SelectTrigger className="bg-zinc-800 border-zinc-700 text-zinc-100 font-space-mono text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="RUB">RUB — Рубли ₽</SelectItem>
                <SelectItem value="USD">USD — Доллары $</SelectItem>
                <SelectItem value="EUR">EUR — Евро €</SelectItem>
                <SelectItem value="BRL">BRL — Реалы R$</SelectItem>
                <SelectItem value="INR">INR — Рупии ₹</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-zinc-400 font-space-mono text-xs mb-1.5 block">
              💰 Выплата брокера: <span className="text-white font-bold">{config.payoutRate}%</span>
            </Label>
            <Slider min={50} max={99} step={1} value={[config.payoutRate]} onValueChange={([v]) => set({ payoutRate: v })} />
            <p className="text-zinc-600 font-space-mono text-xs mt-1.5">
              {config.payoutRate >= 90
                ? "🔥 Высокая выплата — ищи активы с таким %"
                : config.payoutRate >= 75
                ? "⚖️ Средняя выплата — стандарт для большинства"
                : "⚠️ Низкая выплата — сложнее выйти в плюс"}
            </p>
          </div>

          {aiCommentSlot}
        </CardContent>
      </Card>

      {/* ═══════ Карточка 2: Дневные лимиты и стопы ═══════ */}
      <Card className="bg-zinc-900 border-amber-500/20">
        <CardHeader className="pb-3">
          <CardTitle className="font-orbitron text-white text-base flex items-center gap-2">
            <Icon name="ShieldAlert" size={18} className="text-amber-400" />
            Дневные лимиты и стопы
          </CardTitle>
          <p className="text-zinc-500 font-space-mono text-[11px] mt-1">
            Когда бот сам остановится — защита от слива депозита
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-zinc-400 font-space-mono text-xs mb-1.5 block">
                🎯 Take Profit ({config.currency})
              </Label>
              <Input
                type="number"
                value={config.takeProfitRub}
                onChange={(e) => set({ takeProfitRub: Number(e.target.value) })}
                className="bg-zinc-800 border-zinc-700 text-green-400 font-space-mono text-sm"
              />
              <p className="text-zinc-600 font-space-mono text-[10px] mt-1">Заработали — стоп на сегодня</p>
            </div>
            <div>
              <Label className="text-zinc-400 font-space-mono text-xs mb-1.5 block">
                🛑 Stop Loss ({config.currency})
              </Label>
              <Input
                type="number"
                value={config.stopLossRub}
                onChange={(e) => set({ stopLossRub: Number(e.target.value) })}
                className="bg-zinc-800 border-zinc-700 text-red-400 font-space-mono text-sm"
              />
              <p className="text-zinc-600 font-space-mono text-[10px] mt-1">Потеряли — стоп на сегодня</p>
            </div>
          </div>

          <div>
            <Label className="text-zinc-400 font-space-mono text-xs mb-1.5 block">
              📅 Макс. сделок в день: <span className="text-white font-bold">{config.dailyLimit}</span>
            </Label>
            <Slider min={1} max={100} step={1} value={[config.dailyLimit]} onValueChange={([v]) => set({ dailyLimit: v })} />
            <p className="text-zinc-600 font-space-mono text-xs mt-1.5">
              {config.dailyLimit <= 10
                ? "🐢 Очень осторожно — мало сделок, низкий риск"
                : config.dailyLimit <= 30
                ? "⚖️ Оптимально — хороший баланс активности и контроля"
                : config.dailyLimit <= 60
                ? "⚡ Активно — много сделок, нужен фильтр сильного тренда"
                : "🚨 Очень много — риск overtrading, проверь стратегию"}
            </p>
          </div>

          <div className="flex items-center justify-between pt-1 border-t border-zinc-800">
            <div>
              <Label className="text-zinc-300 text-sm">⏸ Пауза после серии проигрышей</Label>
              <p className="text-zinc-500 text-xs font-space-mono">
                После N проигрышей подряд бот делает перерыв — защита от «разноса» депозита
              </p>
            </div>
            <Switch
              checked={config.pauseAfterLossesEnabled ?? true}
              onCheckedChange={(v) => set({ pauseAfterLossesEnabled: v })}
            />
          </div>

          {(config.pauseAfterLossesEnabled ?? true) && (
            <div className="space-y-3 pl-4 border-l-2 border-amber-500/30">
              <div>
                <Label className="text-zinc-400 font-space-mono text-xs mb-1.5 block">
                  Пауза после <span className="text-white font-bold">{config.pauseAfterLossesCount ?? 3} проигрышей</span> подряд
                </Label>
                <Slider
                  min={2}
                  max={7}
                  step={1}
                  value={[config.pauseAfterLossesCount ?? 3]}
                  onValueChange={([v]) => set({ pauseAfterLossesCount: v })}
                />
                <p className="text-zinc-600 font-space-mono text-xs mt-1.5">
                  {(config.pauseAfterLossesCount ?? 3) === 2
                    ? "⚡ Чувствительно — пауза уже после 2 проигрышей"
                    : (config.pauseAfterLossesCount ?? 3) === 3
                    ? "⚖️ Оптимально — после 3 проигрышей подряд (рекомендуется)"
                    : (config.pauseAfterLossesCount ?? 3) <= 5
                    ? "🟢 Лояльно — даём боту шанс отыграться"
                    : "🐢 Очень терпеливо — пауза только при разносе"}
                </p>
              </div>

              <div>
                <Label className="text-zinc-400 font-space-mono text-xs mb-1.5 block">
                  Длительность паузы: <span className="text-white font-bold">{config.pauseAfterLossesMinutes ?? 10} мин</span>
                </Label>
                <Slider
                  min={1}
                  max={60}
                  step={1}
                  value={[config.pauseAfterLossesMinutes ?? 10]}
                  onValueChange={([v]) => set({ pauseAfterLossesMinutes: v })}
                />
                <p className="text-zinc-600 font-space-mono text-xs mt-1.5">
                  {(config.pauseAfterLossesMinutes ?? 10) <= 5
                    ? "⚡ Короткая пауза — рынок не успеет сильно поменяться"
                    : (config.pauseAfterLossesMinutes ?? 10) <= 15
                    ? "⚖️ Оптимально — рынок успеет «остыть»"
                    : (config.pauseAfterLossesMinutes ?? 10) <= 30
                    ? "🟢 Долго — пропустим много сигналов, но войдём свежо"
                    : "🐢 Очень долго — пауза почти час"}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ═══════ Карточка 3: Режим запуска ═══════ */}
      <Card className="bg-zinc-900 border-purple-500/20">
        <CardHeader className="pb-3">
          <CardTitle className="font-orbitron text-white text-base flex items-center gap-2">
            <Icon name="Play" size={18} className="text-purple-400" />
            Режим запуска
          </CardTitle>
          <p className="text-zinc-500 font-space-mono text-[11px] mt-1">
            Как бот стартует: с разогревом или сразу, на демо или реале
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-zinc-400 font-space-mono text-xs mb-1.5 block">
              🔥 Разогрев — ждать закрытия{" "}
              <span className="text-white font-bold">
                {config.warmupCandles ?? 2} {((config.warmupCandles ?? 2) === 1) ? "свечи" : "свечей"}
              </span>{" "}
              перед первой сделкой
            </Label>
            <Slider
              min={0}
              max={10}
              step={1}
              value={[config.warmupCandles ?? 2]}
              onValueChange={([v]) => set({ warmupCandles: v })}
            />
            <p className="text-zinc-600 font-space-mono text-xs mt-1.5">
              {(config.warmupCandles ?? 2) === 0
                ? "⚠️ Без разогрева — бот может ставить на «грязных» данных при старте"
                : (config.warmupCandles ?? 2) <= 2
                ? "⚖️ Оптимально — бот накопит свежие данные за ~" + ((config.warmupCandles ?? 2) * 60) + " сек, тренд определится точно"
                : (config.warmupCandles ?? 2) <= 5
                ? "🟢 Аккуратно — бот ждёт ~" + ((config.warmupCandles ?? 2) * 60) + " сек, минимум ложных сигналов"
                : "🐢 Долгое ожидание — ~" + ((config.warmupCandles ?? 2) * 60) + " сек до первой сделки"}
            </p>
          </div>

          <div className="flex items-center justify-between pt-1 border-t border-zinc-800">
            <div>
              <Label className="text-zinc-300 text-sm">🎯 Ждать сильный тренд для первой сделки</Label>
              <p className="text-zinc-500 text-xs font-space-mono">
                После разогрева бот не сразу торгует, а ждёт N свечей одного цвета подряд
              </p>
            </div>
            <Switch
              checked={config.requireStrongTrendOnStart ?? false}
              onCheckedChange={(v) => set({ requireStrongTrendOnStart: v })}
            />
          </div>

          {(config.requireStrongTrendOnStart ?? false) && (
            <div className="space-y-3 pl-4 border-l-2 border-purple-500/30">
              <div>
                <Label className="text-zinc-400 font-space-mono text-xs mb-1.5 block">
                  Сильный тренд = <span className="text-white font-bold">{config.strongTrendCandles ?? 3} свечей</span> одного цвета подряд
                </Label>
                <Slider
                  min={2}
                  max={6}
                  step={1}
                  value={[config.strongTrendCandles ?? 3]}
                  onValueChange={([v]) => set({ strongTrendCandles: v })}
                />
                <p className="text-zinc-600 font-space-mono text-xs mt-1.5">
                  {(config.strongTrendCandles ?? 3) === 2
                    ? "⚡ Слабое требование — 2 свечи (часто срабатывает, мало пропусков)"
                    : (config.strongTrendCandles ?? 3) === 3
                    ? "⚖️ Оптимально — 3 свечи 🟢🟢🟢/🔴🔴🔴 даёт уверенный тренд"
                    : (config.strongTrendCandles ?? 3) <= 4
                    ? "🟢 Строго — 4 свечи подряд, очень уверенный сигнал"
                    : "🐢 Очень строго — 5-6 свечей, редкие но качественные входы"}
                </p>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-zinc-300 text-sm">🔄 Перезапуск ожидания после проигрыша</Label>
                  <p className="text-zinc-500 text-xs font-space-mono">
                    После проигранной сделки бот снова ждёт сильный тренд
                  </p>
                </div>
                <Switch
                  checked={config.resetTrendAfterLoss ?? true}
                  onCheckedChange={(v) => set({ resetTrendAfterLoss: v })}
                />
              </div>
            </div>
          )}

          <div className="flex items-center justify-between pt-1 border-t border-zinc-800">
            <div>
              <Label className="text-zinc-300 text-sm">Режим счёта</Label>
              <p className="text-zinc-500 text-xs font-space-mono">Демо или реальный счёт</p>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-xs font-space-mono ${config.isDemo ? "text-green-400" : "text-zinc-500"}`}>Демо</span>
              <Switch checked={!config.isDemo} onCheckedChange={(v) => set({ isDemo: !v })} />
              <span className={`text-xs font-space-mono ${!config.isDemo ? "text-red-400" : "text-zinc-500"}`}>Реальный</span>
            </div>
          </div>
          {!config.isDemo && (
            <div className="flex items-center gap-2 bg-red-950/40 border border-red-500/30 rounded-lg px-3 py-2">
              <Icon name="AlertTriangle" size={14} className="text-red-400 flex-shrink-0" />
              <span className="text-red-400 text-xs font-space-mono">
                Реальный счёт — бот будет торговать настоящими деньгами!
              </span>
            </div>
          )}

          <div className="flex items-center justify-between pt-1">
            <div>
              <Label className="text-zinc-300 text-sm">🔁 Авто-перезапуск</Label>
              <p className="text-zinc-500 text-xs font-space-mono">Продолжать торговлю после достижения TP/SL</p>
            </div>
            <Switch checked={config.autoRestart} onCheckedChange={(v) => set({ autoRestart: v })} />
          </div>
        </CardContent>
      </Card>
    </>
  )
}

export default BetManagementCard
