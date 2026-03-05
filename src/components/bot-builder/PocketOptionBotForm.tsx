import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import {
  POBotConfig,
  POStrategy,
  POExpiry,
  PO_STRATEGIES,
  PO_ASSETS,
  PO_EXPIRY_LABELS,
} from "./PocketOptionBotTypes"

interface Props {
  config: POBotConfig
  onChange: (config: POBotConfig) => void
  onGenerate: () => void
}

const RISK_COLORS: Record<string, string> = {
  "Низкий": "bg-green-500/20 text-green-400 border-green-500/30",
  "Средний": "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  "Высокий": "bg-red-500/20 text-red-400 border-red-500/30",
}

export default function PocketOptionBotForm({ config, onChange, onGenerate }: Props) {
  const set = (patch: Partial<POBotConfig>) => onChange({ ...config, ...patch })

  return (
    <div className="space-y-5">

      {/* Strategy */}
      <Card className="bg-zinc-900 border-red-500/20">
        <CardHeader className="pb-3">
          <CardTitle className="font-orbitron text-white text-base">Стратегия</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 gap-2">
            {(Object.keys(PO_STRATEGIES) as POStrategy[]).map((key) => {
              const s = PO_STRATEGIES[key]
              const active = config.strategy === key
              return (
                <button
                  key={key}
                  onClick={() => set({ strategy: key })}
                  className={`flex items-start gap-3 p-3 rounded-lg border text-left transition-all duration-150
                    ${active
                      ? "border-red-500/60 bg-red-500/10"
                      : "border-zinc-700 bg-zinc-800/40 hover:border-zinc-500"
                    }`}
                >
                  <div className={`w-3 h-3 rounded-full mt-1 flex-shrink-0 border-2 ${active ? "border-red-400 bg-red-400" : "border-zinc-500"}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`font-orbitron text-sm font-semibold ${active ? "text-white" : "text-zinc-300"}`}>{s.label}</span>
                      <Badge className={`text-xs ${RISK_COLORS[s.risk]}`}>{s.risk} риск</Badge>
                    </div>
                    <p className="text-zinc-500 text-xs mt-0.5 leading-snug">{s.description}</p>
                  </div>
                </button>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Asset & Expiry */}
      <Card className="bg-zinc-900 border-red-500/20">
        <CardHeader className="pb-3">
          <CardTitle className="font-orbitron text-white text-base">Актив и экспирация</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-zinc-400 font-space-mono text-xs mb-1.5 block">Торговый актив</Label>
            <Select value={config.asset} onValueChange={(v) => set({ asset: v })}>
              <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white font-space-mono text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-zinc-800 border-zinc-700 max-h-64">
                {PO_ASSETS.map((a) => (
                  <SelectItem key={a} value={a} className="text-white font-space-mono text-xs hover:bg-zinc-700">
                    {a}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-zinc-400 font-space-mono text-xs mb-1.5 block">Экспирация опциона</Label>
            <div className="grid grid-cols-5 gap-1.5">
              {(["1", "2", "3", "5", "15"] as POExpiry[]).map((exp) => (
                <button
                  key={exp}
                  onClick={() => set({ expiry: exp })}
                  className={`py-2 rounded-lg text-xs font-orbitron font-bold border transition-all
                    ${config.expiry === exp
                      ? "bg-red-500 border-red-500 text-white"
                      : "bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-zinc-500"
                    }`}
                >
                  {exp}м
                </button>
              ))}
            </div>
            <p className="text-zinc-600 text-xs font-space-mono mt-1">{PO_EXPIRY_LABELS[config.expiry]}</p>
          </div>
        </CardContent>
      </Card>

      {/* Bet settings */}
      <Card className="bg-zinc-900 border-red-500/20">
        <CardHeader className="pb-3">
          <CardTitle className="font-orbitron text-white text-base">Управление ставкой</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-zinc-300 text-sm">Ставка в % от баланса</Label>
              <p className="text-zinc-500 text-xs font-space-mono">Иначе — фиксированная сумма в USD</p>
            </div>
            <Switch
              checked={config.betPercent}
              onCheckedChange={(v) => set({ betPercent: v })}
            />
          </div>

          <div>
            <Label className="text-zinc-400 font-space-mono text-xs mb-1.5 block">
              {config.betPercent ? "Ставка (% от баланса)" : "Ставка (USD)"}
            </Label>
            <div className="flex items-center gap-3">
              <Slider
                min={config.betPercent ? 1 : 1}
                max={config.betPercent ? 50 : 200}
                step={config.betPercent ? 1 : 1}
                value={[config.betAmount]}
                onValueChange={([v]) => set({ betAmount: v })}
                className="flex-1"
              />
              <span className="text-red-400 font-orbitron font-bold text-sm w-16 text-right">
                {config.betAmount}{config.betPercent ? "%" : "$"}
              </span>
            </div>
          </div>

          {/* TP / SL */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-zinc-400 font-space-mono text-xs mb-1.5 block">Take Profit (USD)</Label>
              <Input
                type="number"
                value={config.takeProfitUsd}
                onChange={(e) => set({ takeProfitUsd: Number(e.target.value) })}
                className="bg-zinc-800 border-zinc-700 text-green-400 font-space-mono text-sm"
              />
            </div>
            <div>
              <Label className="text-zinc-400 font-space-mono text-xs mb-1.5 block">Stop Loss (USD)</Label>
              <Input
                type="number"
                value={config.stopLossUsd}
                onChange={(e) => set({ stopLossUsd: Number(e.target.value) })}
                className="bg-zinc-800 border-zinc-700 text-red-400 font-space-mono text-sm"
              />
            </div>
          </div>

          <div>
            <Label className="text-zinc-400 font-space-mono text-xs mb-1.5 block">Макс. сделок в день: {config.dailyLimit}</Label>
            <Slider
              min={1}
              max={100}
              step={1}
              value={[config.dailyLimit]}
              onValueChange={([v]) => set({ dailyLimit: v })}
            />
          </div>

          <div className="flex items-center justify-between pt-1">
            <div>
              <Label className="text-zinc-300 text-sm">Авто-перезапуск</Label>
              <p className="text-zinc-500 text-xs font-space-mono">Продолжать после TP/SL</p>
            </div>
            <Switch
              checked={config.autoRestart}
              onCheckedChange={(v) => set({ autoRestart: v })}
            />
          </div>
        </CardContent>
      </Card>

      {/* Martingale */}
      <Card className={`border transition-all duration-200 ${config.martingaleEnabled ? "bg-red-950/30 border-red-500/40" : "bg-zinc-900 border-zinc-700"}`}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="font-orbitron text-white text-base">
              Мартингейл
              {config.martingaleEnabled && <Badge className="ml-2 bg-red-500/20 text-red-400 border-red-500/30 text-xs">Включён</Badge>}
            </CardTitle>
            <Switch
              checked={config.martingaleEnabled}
              onCheckedChange={(v) => set({ martingaleEnabled: v })}
            />
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
              <Label className="text-zinc-400 font-space-mono text-xs mb-1.5 block">
                Множитель: ×{config.martingaleMultiplier}
              </Label>
              <Slider
                min={1.5}
                max={4}
                step={0.1}
                value={[config.martingaleMultiplier]}
                onValueChange={([v]) => set({ martingaleMultiplier: Math.round(v * 10) / 10 })}
              />
              <div className="flex justify-between text-zinc-600 text-xs font-space-mono mt-1">
                <span>×1.5 (консерв.)</span>
                <span>×4.0 (агресс.)</span>
              </div>
            </div>
            <div>
              <Label className="text-zinc-400 font-space-mono text-xs mb-1.5 block">
                Макс. шагов подряд: {config.martingaleSteps}
              </Label>
              <Slider
                min={1}
                max={7}
                step={1}
                value={[config.martingaleSteps]}
                onValueChange={([v]) => set({ martingaleSteps: v })}
              />
            </div>
            <div className="bg-zinc-800 rounded-lg p-3 font-space-mono text-xs space-y-1">
              <p className="text-zinc-400">Пример с базовой ставкой ${config.betAmount}:</p>
              {Array.from({ length: config.martingaleSteps }, (_, i) => {
                const bet = (config.betAmount * Math.pow(config.martingaleMultiplier, i)).toFixed(2)
                return (
                  <p key={i} className={i === 0 ? "text-green-400" : i < 3 ? "text-yellow-400" : "text-red-400"}>
                    Шаг {i + 1}: ${bet}
                  </p>
                )
              })}
            </div>
          </CardContent>
        )}
      </Card>

      {/* Strategy-specific settings */}
      {(config.strategy === "rsi_reversal") && (
        <Card className="bg-zinc-900 border-blue-500/20">
          <CardHeader className="pb-3">
            <CardTitle className="font-orbitron text-white text-base">Настройки RSI</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-zinc-400 font-space-mono text-xs mb-1.5 block">Период RSI: {config.rsiPeriod}</Label>
              <Slider min={7} max={21} step={1} value={[config.rsiPeriod]} onValueChange={([v]) => set({ rsiPeriod: v })} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-zinc-400 font-space-mono text-xs mb-1.5 block">Перекупленность</Label>
                <Input
                  type="number"
                  value={config.rsiOverbought}
                  onChange={(e) => set({ rsiOverbought: Number(e.target.value) })}
                  className="bg-zinc-800 border-zinc-700 text-red-400 font-space-mono text-sm"
                />
              </div>
              <div>
                <Label className="text-zinc-400 font-space-mono text-xs mb-1.5 block">Перепроданность</Label>
                <Input
                  type="number"
                  value={config.rsiOversold}
                  onChange={(e) => set({ rsiOversold: Number(e.target.value) })}
                  className="bg-zinc-800 border-zinc-700 text-green-400 font-space-mono text-sm"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {(config.strategy === "ema_cross") && (
        <Card className="bg-zinc-900 border-green-500/20">
          <CardHeader className="pb-3">
            <CardTitle className="font-orbitron text-white text-base">Настройки EMA</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-zinc-400 font-space-mono text-xs mb-1.5 block">Быстрая EMA</Label>
                <Input
                  type="number"
                  value={config.emaFast}
                  onChange={(e) => set({ emaFast: Number(e.target.value) })}
                  className="bg-zinc-800 border-zinc-700 text-green-400 font-space-mono text-sm"
                />
              </div>
              <div>
                <Label className="text-zinc-400 font-space-mono text-xs mb-1.5 block">Медленная EMA</Label>
                <Input
                  type="number"
                  value={config.emaSlow}
                  onChange={(e) => set({ emaSlow: Number(e.target.value) })}
                  className="bg-zinc-800 border-zinc-700 text-blue-400 font-space-mono text-sm"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Generate button */}
      <Button
        onClick={onGenerate}
        className="w-full bg-red-600 hover:bg-red-500 text-white font-orbitron font-bold py-4 text-base rounded-xl transition-all duration-200 shadow-lg shadow-red-500/20"
      >
        Сгенерировать код бота
      </Button>
    </div>
  )
}
