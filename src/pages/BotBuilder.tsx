import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BotConfig, DEFAULT_CONFIG, generateCode } from "@/components/bot-builder/BotBuilderTypes"
import BotBuilderForm from "@/components/bot-builder/BotBuilderForm"

export default function BotBuilder() {
  const [config, setConfig] = useState<BotConfig>(DEFAULT_CONFIG)
  const [copied, setCopied] = useState(false)
  const [generated, setGenerated] = useState(false)
  const [code, setCode] = useState("")

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
          <div className="text-center mb-12">
            <Badge className="bg-red-500/20 text-red-400 border-red-500/30 mb-4">Конструктор ботов</Badge>
            <h1 className="font-orbitron text-4xl md:text-5xl font-bold text-white mb-6">
              Конструктор торговых ботов
            </h1>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto leading-relaxed">
              Настройте параметры и получите готовый Python-код торгового бота. Без программирования.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left: Settings */}
            <BotBuilderForm
              config={config}
              onChange={setConfig}
              onGenerate={handleGenerate}
            />

            {/* Right: Code output */}
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
        </div>
      </main>
      <Footer />
    </div>
  )
}
