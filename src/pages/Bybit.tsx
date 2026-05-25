import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { BybitHero } from "@/components/bybit/BybitHero"
import { BybitBotTypes } from "@/components/bybit/BybitBotTypes"
import { BybitApiSetup } from "@/components/bybit/BybitApiSetup"
import { BybitVsPocket } from "@/components/bybit/BybitVsPocket"

export default function Bybit() {
  return (
    <div className="dark min-h-screen bg-black">
      <Navbar />
      <main className="pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero: 4 цифры + кнопки */}
          <BybitHero />

          {/* 6 типов ботов на Bybit (Grid, DCA, Futures, Martingale, Arbitrage, AI) */}
          <BybitBotTypes />

          {/* 6 шагов получения API-ключа + правила безопасности */}
          <BybitApiSetup />

          {/* Большая таблица сравнения (20 критериев) + вердикты + финальный итог */}
          <BybitVsPocket />
        </div>
      </main>
      <Footer />
    </div>
  )
}
