import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { POBotConfig } from "./PocketOptionBotTypes"

interface Props {
  config: POBotConfig
  set: (patch: Partial<POBotConfig>) => void
}

/**
 * Карточка-фильтр направления сделок (CALL / PUT / Все).
 * Декомпозирована из PocketOptionBotForm.tsx (этап 1).
 */
export function TradeDirectionCard({ config, set }: Props) {
  return (
    <Card className="bg-zinc-900 border-zinc-700">
      <CardHeader className="pb-2 pt-4 px-4 cursor-pointer" onClick={() => {}}>
        <CardTitle className="text-sm font-space-mono text-zinc-200 flex items-center gap-2">
          <span>🚦</span> Пропускать сделки
          <span className="ml-auto text-[10px] font-normal text-red-400 bg-red-400/10 border border-red-400/20 rounded px-1.5 py-0.5">ЖЁСТКИЙ ФИЛЬТР</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 pb-4 space-y-2">
        <p className="text-zinc-500 text-xs font-space-mono">Бот будет исполнять только выбранный тип сделок, остальные — игнорировать</p>
        <div className="grid grid-cols-3 gap-2">
          {([
            { value: "all", label: "📊 Все", desc: "CALL и PUT" },
            { value: "call_only", label: "📈 Только CALL", desc: "Только рост" },
            { value: "put_only", label: "📉 Только PUT", desc: "Только падение" },
          ] as const).map((opt) => (
            <button
              key={opt.value}
              onClick={() => set({ tradeDirection: opt.value })}
              className={`rounded-lg px-2 py-2.5 text-xs font-space-mono border transition-all text-center ${(config.tradeDirection ?? "all") === opt.value ? "bg-red-600/20 border-red-500/50 text-red-300" : "bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-zinc-500"}`}
            >
              <div className="font-bold mb-0.5">{opt.label}</div>
              <div className="text-zinc-500 text-[10px]">{opt.desc}</div>
            </button>
          ))}
        </div>
        {(config.tradeDirection ?? "all") !== "all" && (
          <div className="flex items-center gap-2 bg-red-950/40 border border-red-500/30 rounded-lg px-2.5 py-2">
            <span className="text-red-400 text-xs">⚠️</span>
            <span className="text-red-400 text-xs font-space-mono">
              Бот будет пропускать {(config.tradeDirection ?? "all") === "call_only" ? "PUT" : "CALL"}-сигналы — это снизит количество сделок
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default TradeDirectionCard
