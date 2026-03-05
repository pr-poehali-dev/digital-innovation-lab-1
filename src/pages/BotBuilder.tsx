import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BotConfig, DEFAULT_CONFIG, generateCode } from "@/components/bot-builder/BotBuilderTypes"
import BotBuilderForm from "@/components/bot-builder/BotBuilderForm"
import { POBotConfig, PO_DEFAULT_CONFIG, generatePOCode } from "@/components/bot-builder/PocketOptionBotTypes"
import PocketOptionBotForm from "@/components/bot-builder/PocketOptionBotForm"

type Tab = "pocket_option" | "crypto"

export default function BotBuilder() {
  const [tab, setTab] = useState<Tab>("pocket_option")

  // Pocket Option state
  const [poConfig, setPoConfig] = useState<POBotConfig>(PO_DEFAULT_CONFIG)
  const [poCode, setPoCode] = useState("")
  const [poGenerated, setPoGenerated] = useState(false)
  const [poCopied, setPoCopied] = useState(false)

  // Crypto (original) state
  const [config, setConfig] = useState<BotConfig>(DEFAULT_CONFIG)
  const [code, setCode] = useState("")
  const [generated, setGenerated] = useState(false)
  const [copied, setCopied] = useState(false)

  const handlePOGenerate = () => {
    setPoCode(generatePOCode(poConfig))
    setPoGenerated(true)
  }

  const handlePOCopy = () => {
    navigator.clipboard.writeText(poCode)
    setPoCopied(true)
    setTimeout(() => setPoCopied(false), 2000)
  }

  const handleGenerate = () => {
    setCode(generateCode(config))
    setGenerated(true)
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="dark min-h-screen bg-black">
      <Navbar />
      <main className="pt-24 pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Header */}
          <div className="text-center mb-10">
            <Badge className="bg-red-500/20 text-red-400 border-red-500/30 mb-4">Конструктор ботов</Badge>
            <h1 className="font-orbitron text-4xl md:text-5xl font-bold text-white mb-4">
              Конструктор торговых ботов
            </h1>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto leading-relaxed">
              Настройте параметры и получите готовый Python-код. Без программирования.
            </p>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-8 bg-zinc-900 border border-zinc-800 rounded-xl p-1 max-w-md mx-auto">
            <button
              onClick={() => setTab("pocket_option")}
              className={`flex-1 py-2.5 px-4 rounded-lg font-orbitron text-sm font-bold transition-all duration-200 ${
                tab === "pocket_option"
                  ? "bg-red-600 text-white shadow-lg shadow-red-500/20"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              Pocket Option
            </button>
            <button
              onClick={() => setTab("crypto")}
              className={`flex-1 py-2.5 px-4 rounded-lg font-orbitron text-sm font-bold transition-all duration-200 ${
                tab === "crypto"
                  ? "bg-zinc-700 text-white"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              Крипто / Спот
            </button>
          </div>

          {/* Pocket Option Tab */}
          {tab === "pocket_option" && (
            <>
              {/* Info banner */}
              <div className="mb-6 bg-gradient-to-r from-red-950/60 to-zinc-900/60 border border-red-500/30 rounded-xl p-4 flex flex-wrap gap-4 items-center justify-between">
                <div>
                  <p className="text-red-400 font-orbitron font-bold text-sm mb-1">Бинарные опционы — Pocket Option</p>
                  <p className="text-zinc-400 font-space-mono text-xs">Стратегии для OTC-рынка: RSI, EMA, паттерны свечей, мартингейл</p>
                </div>
                <div className="flex gap-4 text-xs font-space-mono">
                  <div className="text-center">
                    <p className="text-green-400 font-bold text-lg">5</p>
                    <p className="text-zinc-500">стратегий</p>
                  </div>
                  <div className="text-center">
                    <p className="text-blue-400 font-bold text-lg">OTC</p>
                    <p className="text-zinc-500">активы</p>
                  </div>
                  <div className="text-center">
                    <p className="text-yellow-400 font-bold text-lg">1-15</p>
                    <p className="text-zinc-500">мин экспир.</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Form */}
                <PocketOptionBotForm
                  config={poConfig}
                  onChange={setPoConfig}
                  onGenerate={handlePOGenerate}
                />

                {/* Code output */}
                <div className="space-y-4">
                  <Card className="bg-zinc-900 border-red-500/20 h-full">
                    <CardHeader className="flex flex-row items-center justify-between">
                      <CardTitle className="font-orbitron text-white text-lg">Python-код бота</CardTitle>
                      {poGenerated && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handlePOCopy}
                          className="border-red-500/40 text-red-400 hover:bg-red-500/10 font-space-mono text-xs"
                        >
                          {poCopied ? "Скопировано ✓" : "Копировать"}
                        </Button>
                      )}
                    </CardHeader>
                    <CardContent>
                      {poGenerated ? (
                        <pre className="bg-black rounded-lg p-4 text-xs text-green-400 font-space-mono overflow-auto max-h-[700px] whitespace-pre-wrap leading-relaxed border border-zinc-800">
                          {poCode}
                        </pre>
                      ) : (
                        <div className="bg-black rounded-lg p-8 border border-zinc-800 text-center min-h-[400px] flex flex-col items-center justify-center">
                          <div className="text-6xl mb-4">🎯</div>
                          <p className="text-zinc-400 font-space-mono text-sm mb-2">Код появится здесь</p>
                          <p className="text-zinc-600 font-space-mono text-xs">Настройте параметры и нажмите «Сгенерировать»</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {poGenerated && (
                    <div className="space-y-3">
                      <Card className="bg-zinc-900 border-yellow-500/20">
                        <CardContent className="pt-4">
                          <div className="flex gap-3">
                            <span className="text-yellow-400 text-xl">⚠️</span>
                            <div>
                              <p className="text-yellow-400 font-orbitron text-sm font-semibold mb-1">Перед запуском</p>
                              <ul className="text-zinc-400 font-space-mono text-xs space-y-1">
                                <li>• Сохраните Session ID из браузера в переменную окружения <span className="text-red-400">PO_SESSION_ID</span></li>
                                <li>• Сначала протестируйте на демо-счёте Pocket Option</li>
                                <li>• Не запускайте с реальным депозитом без проверки</li>
                                <li>• Установите зависимости: <span className="text-green-400">pip install requests</span></li>
                              </ul>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="bg-zinc-900 border-zinc-700">
                        <CardContent className="pt-4">
                          <p className="text-zinc-400 font-orbitron text-xs font-semibold mb-2">Запуск бота</p>
                          <pre className="bg-black rounded-lg p-3 text-xs text-green-400 font-space-mono border border-zinc-800">
{`# Установка зависимостей
pip install requests

# Запуск
PO_SESSION_ID="ваш_session_id" python bot.py`}
                          </pre>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {/* Crypto Tab */}
          {tab === "crypto" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <BotBuilderForm
                config={config}
                onChange={setConfig}
                onGenerate={handleGenerate}
              />

              <div className="space-y-4">
                <Card className="bg-zinc-900 border-red-500/20 h-full">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="font-orbitron text-white text-lg">Python-код бота</CardTitle>
                    {generated && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleCopy}
                        className="border-red-500/40 text-red-400 hover:bg-red-500/10 font-space-mono text-xs"
                      >
                        {copied ? "Скопировано ✓" : "Копировать"}
                      </Button>
                    )}
                  </CardHeader>
                  <CardContent>
                    {generated ? (
                      <pre className="bg-black rounded-lg p-4 text-xs text-green-400 font-space-mono overflow-auto max-h-[700px] whitespace-pre-wrap leading-relaxed border border-zinc-800">
                        {code}
                      </pre>
                    ) : (
                      <div className="bg-black rounded-lg p-8 border border-zinc-800 text-center min-h-[400px] flex flex-col items-center justify-center">
                        <div className="text-6xl mb-4">🤖</div>
                        <p className="text-zinc-400 font-space-mono text-sm mb-2">Код появится здесь</p>
                        <p className="text-zinc-600 font-space-mono text-xs">Настройте параметры и нажмите «Сгенерировать»</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {generated && (
                  <Card className="bg-zinc-900 border-yellow-500/20">
                    <CardContent className="pt-4">
                      <div className="flex gap-3">
                        <span className="text-yellow-400 text-xl">⚠️</span>
                        <div>
                          <p className="text-yellow-400 font-orbitron text-sm font-semibold mb-1">Важно перед запуском</p>
                          <ul className="text-zinc-400 font-space-mono text-xs space-y-1">
                            <li>• Сначала протестируйте на Paper Trading</li>
                            <li>• Не храните API ключи в коде — используйте переменные окружения</li>
                            <li>• Начинайте с минимального депозита</li>
                            <li>• Изучите <a href="/bots-guide" className="text-red-400 underline">гайд по ботам</a> перед стартом</li>
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          )}

        </div>
      </main>
      <Footer />
    </div>
  )
}
