import { useState } from "react"
import { Button } from "@/components/ui/button"
import Icon from "@/components/ui/icon"
import { dives, useLiveQuote, type DeepDive } from "./pair-deep-dive/data"
import { PairHeader } from "./pair-deep-dive/PairHeader"
import { LevelsBlock } from "./pair-deep-dive/LevelsBlock"
import { NewsBlock, ScenariosBlock } from "./pair-deep-dive/AnalysisBlocks"

export function PairDeepDive() {
  const [active, setActive] = useState<DeepDive["key"]>("eurusd-otc")
  const dive = dives.find((d) => d.key === active)!
  const { live, loading, lastUpdate } = useLiveQuote(active)

  return (
    <section className="mb-20">
      <h2 className="font-orbitron text-3xl font-bold text-white mb-2 flex items-center gap-3">
        <Icon name="Microscope" className="text-red-500" /> Разбор пар: EUR/USD OTC и BTC/USD
      </h2>
      <p className="text-gray-400 mb-6">
        Уровни поддержки и сопротивления, свежие новости и сценарии работы. Обновлено по последним торговым дням.
      </p>

      {/* Переключатель пар */}
      <div className="flex gap-2 mb-6">
        {dives.map((d) => (
          <Button
            key={d.key}
            onClick={() => setActive(d.key)}
            className={
              active === d.key
                ? "bg-red-500 hover:bg-red-600 text-white"
                : "bg-zinc-800 hover:bg-zinc-700 text-gray-300 border border-zinc-700"
            }
          >
            <span className="mr-2">{d.emoji}</span>
            {d.symbol}
          </Button>
        ))}
      </div>

      <PairHeader dive={dive} active={active} live={live} loading={loading} lastUpdate={lastUpdate} />
      <LevelsBlock dive={dive} />
      <NewsBlock dive={dive} />
      <ScenariosBlock dive={dive} />
    </section>
  )
}
