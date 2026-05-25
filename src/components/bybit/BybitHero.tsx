import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Icon from "@/components/ui/icon"

export function BybitHero() {
  return (
    <section className="text-center mb-16">
      <Badge className="mb-4 bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
        <Icon name="Zap" size={14} className="mr-1" />
        Новый раздел · Май 2026
      </Badge>
      <h1 className="font-orbitron text-4xl md:text-6xl font-bold text-white mb-4">
        Bybit для <span className="text-yellow-400">торговых ботов</span>
      </h1>
      <p className="text-gray-400 text-lg max-w-3xl mx-auto mb-8">
        Криптобиржа №2 в мире по объёмам. Официальный REST API, встроенные боты,
        плечо до 100x. Полный гайд по подключению и сравнение с{" "}
        <span className="text-red-400 font-semibold">Pocket Option</span>.
      </p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-8">
        <div className="bg-zinc-900/60 border border-yellow-500/20 rounded-lg p-4">
          <div className="text-2xl font-orbitron font-bold text-yellow-400">99.9%</div>
          <div className="text-xs text-gray-400 mt-1">Аптайм API</div>
        </div>
        <div className="bg-zinc-900/60 border border-yellow-500/20 rounded-lg p-4">
          <div className="text-2xl font-orbitron font-bold text-yellow-400">$1</div>
          <div className="text-xs text-gray-400 mt-1">Минимальный депозит</div>
        </div>
        <div className="bg-zinc-900/60 border border-yellow-500/20 rounded-lg p-4">
          <div className="text-2xl font-orbitron font-bold text-yellow-400">100x</div>
          <div className="text-xs text-gray-400 mt-1">Макс. плечо (фьючи)</div>
        </div>
        <div className="bg-zinc-900/60 border border-yellow-500/20 rounded-lg p-4">
          <div className="text-2xl font-orbitron font-bold text-green-400">✓</div>
          <div className="text-xs text-gray-400 mt-1">Боты разрешены</div>
        </div>
      </div>

      <div className="flex items-center justify-center gap-3 flex-wrap">
        <Button
          asChild
          size="lg"
          className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black font-semibold"
        >
          <a href="https://www.bybit.com/" target="_blank" rel="noopener noreferrer">
            <Icon name="ExternalLink" size={18} className="mr-2" />
            Открыть Bybit
          </a>
        </Button>
        <Button
          asChild
          size="lg"
          variant="outline"
          className="border-2 border-yellow-500/50 text-yellow-400 hover:bg-yellow-500/10"
        >
          <a href="#api-setup">
            <Icon name="Key" size={18} className="mr-2" />
            Как получить API-ключ
          </a>
        </Button>
        <Button
          asChild
          size="lg"
          variant="outline"
          className="border-2 border-zinc-700 text-white hover:bg-zinc-800"
        >
          <a href="#comparison">vs Pocket Option</a>
        </Button>
        <Button
          asChild
          size="lg"
          variant="outline"
          className="border-2 border-orange-500/50 text-orange-400 hover:bg-orange-500/10"
        >
          <a href="#vs-binance">
            <Icon name="Crown" size={18} className="mr-2" />
            vs Binance (есть ли лучше?)
          </a>
        </Button>
      </div>
    </section>
  )
}

export default BybitHero