import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import Icon from "@/components/ui/icon"
import type { POBotConfig } from "./PocketOptionBotTypes"

interface Props {
  config: POBotConfig
  set: (patch: Partial<POBotConfig>) => void
}

/**
 * Две связанные карточки:
 *  - Мартингейл (включение, множитель, шаги, превью)
 *  - Защита баланса (макс. ставка %, мин. резерв %)
 *
 * Декомпозированы из PocketOptionBotForm.tsx (этап 2).
 */
export function MartingaleAndSafetyCards({ config, set }: Props) {
  return (
    <>
      {/* Martingale */}
      <Card className={`border transition-all duration-200 ${config.martingaleEnabled ? "bg-red-950/30 border-red-500/40" : "bg-zinc-900 border-zinc-700"}`}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="font-orbitron text-white text-base">
              Мартингейл
              {config.martingaleEnabled && <Badge className="ml-2 bg-red-500/20 text-red-400 border-red-500/30 text-xs">Включён</Badge>}
            </CardTitle>
            <Switch checked={config.martingaleEnabled} onCheckedChange={(v) => set({ martingaleEnabled: v })} />
          </div>
        </CardHeader>
        {config.martingaleEnabled && (
          <CardContent className="space-y-4">
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
              <p className="text-red-400 text-xs font-space-mono leading-relaxed">
                ⚠️ Мартингейл увеличивает ставку после каждого проигрыша. Высокий риск потери депозита при серии убытков.
              </p>
            </div>
            <div>
              <Label className="text-zinc-400 font-space-mono text-xs mb-1.5 block">Множитель: ×{config.martingaleMultiplier}</Label>
              <Slider min={1.5} max={4} step={0.1} value={[config.martingaleMultiplier]} onValueChange={([v]) => set({ martingaleMultiplier: Math.round(v * 10) / 10 })} />
              <div className="flex justify-between text-zinc-600 text-xs font-space-mono mt-1">
                <span>×1.5 (консерв.)</span><span>×4.0 (агресс.)</span>
              </div>
            </div>
            <div>
              <Label className="text-zinc-400 font-space-mono text-xs mb-1.5 block">Макс. шагов: {config.martingaleSteps}</Label>
              <Slider min={1} max={7} step={1} value={[config.martingaleSteps]} onValueChange={([v]) => set({ martingaleSteps: v })} />
            </div>
            <div className="bg-zinc-800 rounded-lg p-3 font-space-mono text-xs space-y-1">
              <p className="text-zinc-400">Пример с базовой ставкой {config.betAmount}₽:</p>
              {Array.from({ length: config.martingaleSteps }, (_, i) => {
                const bet = (config.betAmount * Math.pow(config.martingaleMultiplier, i)).toFixed(2)
                return (
                  <p key={i} className={i === 0 ? "text-green-400" : i < 3 ? "text-yellow-400" : "text-red-400"}>
                    Шаг {i + 1}: {bet}₽
                  </p>
                )
              })}
            </div>
          </CardContent>
        )}
      </Card>

      {/* Защита баланса */}
      <Card className="bg-emerald-950/30 border border-emerald-500/40">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="font-orbitron text-white text-base flex items-center gap-2">
              <Icon name="Shield" size={16} className="text-emerald-400" />
              Защита баланса
              <Badge className="ml-1 bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-xs">Активна</Badge>
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-3">
            <p className="text-emerald-300 text-xs font-space-mono leading-relaxed">
              🛡️ Бот не поставит ставку, превышающую заданный % от баланса. Также блокирует сделки если на счёте недостаточно денег. Ставки меньше базовой проходят всегда.
            </p>
          </div>
          <div>
            <Label className="text-zinc-400 font-space-mono text-xs mb-1.5 block">
              Макс. ставка от баланса: <span className="text-emerald-400 font-bold">{config.safetyMaxBetPercent ?? 30}%</span>
            </Label>
            <Slider
              min={5}
              max={95}
              step={5}
              value={[config.safetyMaxBetPercent ?? 30]}
              onValueChange={([v]) => set({ safetyMaxBetPercent: v })}
            />
            <div className="flex justify-between text-zinc-600 text-xs font-space-mono mt-1">
              <span>5% (макс. защита)</span><span>95% (мин. защита)</span>
            </div>
          </div>
          <div>
            <Label className="text-zinc-400 font-space-mono text-xs mb-1.5 block">
              Мин. резерв на счёте: <span className="text-emerald-400 font-bold">{config.safetyMinReservePercent ?? 30}%</span>
              {(config.safetyMinReservePercent ?? 30) === 0 && <span className="text-zinc-500 ml-2">(отключено)</span>}
            </Label>
            <Slider
              min={0}
              max={80}
              step={5}
              value={[config.safetyMinReservePercent ?? 30]}
              onValueChange={([v]) => set({ safetyMinReservePercent: v })}
            />
            <div className="flex justify-between text-zinc-600 text-xs font-space-mono mt-1">
              <span>0% (выкл)</span><span>80% (макс. резерв)</span>
            </div>
          </div>
          <div className="bg-zinc-800 rounded-lg p-3 font-space-mono text-xs space-y-1">
            <p className="text-zinc-400">Пример: баланс 1000₽, лимит ставки {config.safetyMaxBetPercent ?? 30}%, резерв {config.safetyMinReservePercent ?? 30}%:</p>
            <p className="text-emerald-400">✅ Макс. ставка по %: {Math.round(1000 * (config.safetyMaxBetPercent ?? 30) / 100)}₽</p>
            <p className="text-cyan-400">💰 Резерв (не трогаем): {Math.round(1000 * (config.safetyMinReservePercent ?? 30) / 100)}₽ → доступно: {1000 - Math.round(1000 * (config.safetyMinReservePercent ?? 30) / 100)}₽</p>
            <p className="text-purple-400">🧠 Итог ставки = МИНИМУМ из всех лимитов</p>
            <p className="text-yellow-400">💡 Ставки меньше базовой ({config.betAmount}₽) — всегда проходят</p>
          </div>
        </CardContent>
      </Card>
    </>
  )
}

export default MartingaleAndSafetyCards
