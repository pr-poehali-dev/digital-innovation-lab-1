import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { LiveSessionClock } from "@/components/LiveSessionClock"
import { TrendPairScanner } from "@/components/TrendPairScanner"
import { PairDeepDive } from "@/components/PairDeepDive"
import { RefreshControls } from "@/components/timing/RefreshControls"
import { SessionsAndSchedules } from "@/components/timing/SessionsAndSchedules"
import { CorrelationsAndStrategies } from "@/components/timing/CorrelationsAndStrategies"

export default function Timing() {
  return (
    <div className="dark min-h-screen bg-black">
      <Navbar />
      <main className="pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero + кнопки обновления + панель отладки */}
          <RefreshControls />

          {/* Живые часы и активная сессия */}
          <LiveSessionClock />

          {/* Сканер трендовых пар */}
          <TrendPairScanner />

          {/* Глубокий разбор пар */}
          <PairDeepDive />

          {/* Торговые сессии + расписания EUR/USD OTC и BTC/USD */}
          <SessionsAndSchedules />

          {/* Корреляции пар + стратегии по времени дня + финальный блок */}
          <CorrelationsAndStrategies />
        </div>
      </main>
      <Footer />
    </div>
  )
}
