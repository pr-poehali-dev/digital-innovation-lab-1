import { useState, useEffect, useRef } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BotConfig, DEFAULT_CONFIG, generateCode } from "@/components/bot-builder/BotBuilderTypes"
import BotBuilderForm from "@/components/bot-builder/BotBuilderForm"
import { POBotConfig, PO_DEFAULT_CONFIG, generatePOCode, generatePOComboCode } from "@/components/bot-builder/PocketOptionBotTypes"
import PocketOptionBotForm from "@/components/bot-builder/PocketOptionBotForm"
import TradeJournal from "@/components/bot-builder/TradeJournal"
import BotHistory, { saveBotToHistory } from "@/components/bot-builder/BotHistory"
import Icon from "@/components/ui/icon"

type Tab = "pocket_option" | "crypto"

export default function BotBuilder() {
  const [tab, setTab] = useState<Tab>("pocket_option")
  const [tgBlockOpen, setTgBlockOpen] = useState(false)
  const [sessionGuideOpen, setSessionGuideOpen] = useState(false)
  const [strategyGuideOpen, setStrategyGuideOpen] = useState(false)
  const [tgGuideOpen, setTgGuideOpen] = useState(false)
  const [tgTestStatus, setTgTestStatus] = useState<"idle" | "sending" | "ok" | "error">("idle")
  const [restoreToast, setRestoreToast] = useState(false)

  const sendTgTest = async () => {
    if (!poConfig.tgToken || !poConfig.tgChatId) return
    setTgTestStatus("sending")
    try {
      const text = encodeURIComponent("🤖 Тест TradeBase Bot\n\nПодключение работает! Уведомления о торгах будут приходить сюда.\n\n✅ ВЫИГРЫШ +2.5 USD\n❌ ПРОИГРЫШ -1.0 USD\n🛑 Stop Loss достигнут\n✅ Take Profit достигнут")
      const res = await fetch(`https://api.telegram.org/bot${poConfig.tgToken}/sendMessage?chat_id=${poConfig.tgChatId}&text=${text}&parse_mode=HTML`)
      const data = await res.json()
      setTgTestStatus(data.ok ? "ok" : "error")
    } catch {
      setTgTestStatus("error")
    }
    setTimeout(() => setTgTestStatus("idle"), 4000)
  }

  // Telegram settings — сохраняются в localStorage
  const savedTg = (() => {
    try { return JSON.parse(localStorage.getItem("tg_settings") || "{}") } catch { return {} }
  })()
  const saveTgSettings = (token: string, chatId: string) => {
    localStorage.setItem("tg_settings", JSON.stringify({ tgToken: token, tgChatId: chatId }))
  }
  const clearTgSettings = () => {
    localStorage.removeItem("tg_settings")
    setPoConfig((p) => ({ ...p, tgToken: "", tgChatId: "" }))
  }

  // Pocket Option state — Bot 1
  const [poConfig, setPoConfig] = useState<POBotConfig>({
    ...PO_DEFAULT_CONFIG,
    tgToken: savedTg.tgToken || "",
    tgChatId: savedTg.tgChatId || "",
  })
  const [poCode, setPoCode] = useState("")
  const [poGenerated, setPoGenerated] = useState(false)
  const [poCopied, setPoCopied] = useState(false)
  const poCodeRef = useRef<HTMLDivElement>(null)
  const cryptoCodeRef = useRef<HTMLDivElement>(null)

  // Session ID input
  const [sessionId, setSessionId] = useState("")
  const [sessionIdVisible, setSessionIdVisible] = useState(false)
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null)

  const copyCmd = (text: string, key: string) => {
    navigator.clipboard.writeText(text)
    setCopiedCmd(key)
    setTimeout(() => setCopiedCmd(null), 2000)
  }

  // Pocket Option state — Bot 2
  const [dualMode, setDualMode] = useState(false)
  const [poConfig2, setPoConfig2] = useState<POBotConfig>({ ...PO_DEFAULT_CONFIG, botName: "Бот 2", strategy: "ema_cross", betAmount: 1, tgToken: savedTg.tgToken || "", tgChatId: savedTg.tgChatId || "" })

  // Автосохранение TG настроек при изменении + синхронизация валюты и TG с Bot2
  useEffect(() => {
    saveTgSettings(poConfig.tgToken, poConfig.tgChatId)
    setPoConfig2(p => ({ ...p, tgToken: poConfig.tgToken, tgChatId: poConfig.tgChatId, tgEnabled: poConfig.tgEnabled, tgProxy: poConfig.tgProxy, tgNotifyMode: poConfig.tgNotifyMode }))
  }, [poConfig.tgToken, poConfig.tgChatId, poConfig.tgEnabled, poConfig.tgProxy, poConfig.tgNotifyMode])

  useEffect(() => {
    setPoConfig2(p => ({ ...p, currency: poConfig.currency, isDemo: poConfig.isDemo }))
  }, [poConfig.currency, poConfig.isDemo])
  const [poCode2, setPoCode2] = useState("")
  const [dualDownloaded, setDualDownloaded] = useState(false)

  // Crypto (original) state
  const [config, setConfig] = useState<BotConfig>(DEFAULT_CONFIG)
  const [code, setCode] = useState("")
  const [generated, setGenerated] = useState(false)
  const [copied, setCopied] = useState(false)

  const handlePOGenerate = () => {
    const code = poConfig.comboMode ? generatePOComboCode(poConfig) : generatePOCode(poConfig)
    setPoCode(code)
    if (dualMode) {
      const code2 = poConfig2.comboMode ? generatePOComboCode(poConfig2) : generatePOCode(poConfig2)
      setPoCode2(code2)
    }
    setPoGenerated(true)
    setTimeout(() => {
      poCodeRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
    }, 100)
  }

  const handleDualDownload = () => {
    const download = (content: string, filename: string) => {
      const blob = new Blob([content], { type: "text/x-python" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = filename
      a.click()
      URL.revokeObjectURL(url)
    }
    download(poCode, `bot1.py`)
    setTimeout(() => download(poCode2, `bot2.py`), 300)
    setDualDownloaded(true)
    saveBotToHistory(poConfig)
    saveBotToHistory(poConfig2)
  }

  const handlePOCopy = () => {
    navigator.clipboard.writeText(poCode)
    setPoCopied(true)
    setTimeout(() => setPoCopied(false), 2000)
  }

  const handleGenerate = () => {
    setCode(generateCode(config))
    setGenerated(true)
    setTimeout(() => {
      cryptoCodeRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
    }, 100)
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Download .py file
  const handlePODownload = () => {
    const filename = `bot.py`
    const blob = new Blob([poCode], { type: "text/x-python" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
    saveBotToHistory(poConfig)
  }

  const handleEnvDownload = () => {
    const sessionVal = sessionId || "ВСТАВЬТЕ_SESSION_ID_СЮДА"
    const content = `# Файл .env для Pocket Option Bot\n# Положите этот файл рядом с bot.py\nPO_SESSION_ID=${sessionVal}\n`
    const blob = new Blob([content], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = ".env"
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleCryptoDownload = () => {
    const filename = `crypto_bot_${config.type}.py`
    const blob = new Blob([code], { type: "text/x-python" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
  }

  // Share config via URL
  const [shareCopied, setShareCopied] = useState(false)

  const handleShare = () => {
    const params = new URLSearchParams()
    Object.entries(poConfig).forEach(([k, v]) => params.set(k, String(v)))
    const url = `${window.location.origin}/bot-builder?${params.toString()}`
    navigator.clipboard.writeText(url)
    setShareCopied(true)
    setTimeout(() => setShareCopied(false), 2500)
  }

  // Load config from URL on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (!params.has("strategy")) return
    setPoConfig((prev) => ({
      ...prev,
      strategy: (params.get("strategy") as POBotConfig["strategy"]) ?? prev.strategy,
      asset: params.get("asset") ?? prev.asset,
      expiry: (params.get("expiry") as POBotConfig["expiry"]) ?? prev.expiry,
      betAmount: Number(params.get("betAmount") ?? prev.betAmount),
      betPercent: params.get("betPercent") === "true",
      martingaleEnabled: params.get("martingaleEnabled") === "true",
      martingaleMultiplier: Number(params.get("martingaleMultiplier") ?? prev.martingaleMultiplier),
      martingaleSteps: Number(params.get("martingaleSteps") ?? prev.martingaleSteps),
      takeProfitUsd: Number(params.get("takeProfitUsd") ?? prev.takeProfitUsd),
      stopLossUsd: Number(params.get("stopLossUsd") ?? prev.stopLossUsd),
      dailyLimit: Number(params.get("dailyLimit") ?? prev.dailyLimit),
      rsiPeriod: Number(params.get("rsiPeriod") ?? prev.rsiPeriod),
      rsiOverbought: Number(params.get("rsiOverbought") ?? prev.rsiOverbought),
      rsiOversold: Number(params.get("rsiOversold") ?? prev.rsiOversold),
      emaFast: Number(params.get("emaFast") ?? prev.emaFast),
      emaSlow: Number(params.get("emaSlow") ?? prev.emaSlow),
      useOTC: params.get("useOTC") === "true",
      autoRestart: params.get("autoRestart") === "true",
    }))
    setTab("pocket_option")
  }, [])

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
                <div className="flex items-center gap-4">
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
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleShare}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg border font-orbitron text-xs font-bold transition-all duration-200
                        ${shareCopied
                          ? "bg-green-500/20 border-green-500/40 text-green-400"
                          : "bg-zinc-800 border-zinc-600 text-zinc-300 hover:border-zinc-400 hover:text-white"
                        }`}
                    >
                      <Icon name={shareCopied ? "Check" : "Share2"} size={13} />
                      {shareCopied ? "Скопировано!" : "Поделиться"}
                    </button>
                    <a
                      href="/bot-landing"
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2 px-4 py-2 rounded-lg border font-orbitron text-xs font-bold transition-all duration-200 bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20"
                    >
                      <Icon name="ExternalLink" size={13} />
                      Лендинг
                    </a>
                  </div>
                </div>
              </div>

              {/* Session ID + Telegram Input */}
              <div className="mb-6 bg-zinc-900 border border-zinc-700 rounded-xl p-4 space-y-4">

                {/* Session ID */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-green-400">🔑</span>
                    <p className="text-white font-orbitron text-sm font-semibold">Session ID</p>
                    <span className="text-zinc-500 font-space-mono text-xs">— команды запуска сгенерируются автоматически</span>
                  </div>
                  <div className="relative">
                    <input
                      type={sessionIdVisible ? "text" : "password"}
                      value={sessionId}
                      onChange={(e) => setSessionId(e.target.value)}
                      placeholder='42["auth",{"session":"...","isDemo":1,"uid":...,"platform":2}]'
                      className="w-full bg-black border border-zinc-700 focus:border-green-500/60 rounded-lg px-4 py-3 text-green-400 font-space-mono text-xs outline-none transition-colors placeholder:text-zinc-600 pr-20"
                    />
                    <button
                      onClick={() => setSessionIdVisible((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 font-space-mono text-xs transition-colors"
                    >
                      {sessionIdVisible ? "скрыть" : "показать"}
                    </button>
                  </div>
                  {sessionId
                    ? <div className="flex items-center gap-2 text-green-400 font-space-mono text-xs"><Icon name="CheckCircle" size={13} />Session ID сохранён</div>
                    : <p className="text-zinc-600 font-space-mono text-xs">DevTools (F12) → Network → WS → Messages → сообщение <span className="text-zinc-400">42["auth",...]</span></p>
                  }
                </div>



              </div>

              {/* Session ID Guide */}
              <div className="mb-6">
                <button
                  onClick={() => setSessionGuideOpen((v) => !v)}
                  className="w-full flex items-center justify-between bg-zinc-900 border border-zinc-700 hover:border-zinc-500 rounded-xl px-5 py-3.5 transition-all duration-200 group"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-blue-400 text-lg">🔑</span>
                    <div className="text-left">
                      <p className="text-white font-orbitron text-sm font-semibold">Как получить Session ID из Pocket Option?</p>
                      <p className="text-zinc-500 font-space-mono text-xs">Пошаговая инструкция — займёт 1 минуту</p>
                    </div>
                  </div>
                  <Icon
                    name={sessionGuideOpen ? "ChevronUp" : "ChevronDown"}
                    size={18}
                    className="text-zinc-400 group-hover:text-zinc-200 transition-colors flex-shrink-0"
                  />
                </button>

                {sessionGuideOpen && (
                  <div className="mt-2 bg-zinc-900 border border-zinc-700 rounded-xl overflow-hidden">
                    <div className="p-5 space-y-5">

                      {/* Intro */}
                      <p className="text-zinc-400 font-space-mono text-xs leading-relaxed">
                        Session ID — это ключ вашей сессии в Pocket Option. Бот использует его, чтобы открывать сделки от вашего имени. Вот как его найти:
                      </p>

                      {/* Steps */}
                      <div className="space-y-3">
                        {[
                          {
                            step: "1",
                            icon: "🌐",
                            title: "Откройте Pocket Option в браузере",
                            desc: "Перейдите на сайт po-fcm.com/ru и войдите в свой аккаунт.",
                            color: "border-blue-500/40 bg-blue-500/5",
                          },
                          {
                            step: "2",
                            icon: "🛠️",
                            title: "Откройте DevTools",
                            desc: "Нажмите F12 (или Ctrl+Shift+I на Windows / Cmd+Option+I на Mac). Откроется панель разработчика.",
                            color: "border-zinc-600 bg-zinc-800/40",
                          },
                          {
                            step: "3",
                            icon: "📡",
                            title: "Перейдите во вкладку «Network» → «WS»",
                            desc: 'В верхней панели DevTools нажмите "Network" (Сеть). В строке фильтра выберите "WS" (WebSocket).',
                            color: "border-zinc-600 bg-zinc-800/40",
                          },
                          {
                            step: "4",
                            icon: "🔄",
                            title: "Обновите страницу F5",
                            desc: "Нажмите F5 — страница перезагрузится и в списке появятся WebSocket-соединения.",
                            color: "border-zinc-600 bg-zinc-800/40",
                          },
                          {
                            step: "5",
                            icon: "🔍",
                            title: "Найдите сообщение 42[\"auth\",...]",
                            desc: 'Кликните на соединение в списке → вкладка "Messages". Найдите сообщение начинающееся с 42["auth", — скопируйте его целиком.',
                            color: "border-green-500/40 bg-green-500/5",
                          },
                          {
                            step: "6",
                            icon: "💻",
                            title: "Запустите бота в PowerShell",
                            desc: 'Скопируйте сообщение 42["auth",...] целиком из DevTools и вставьте вместо ТВОЁ_СООБЩЕНИЕ_42auth_ЦЕЛИКОМ:',
                            color: "border-red-500/40 bg-red-500/5",
                            code: `$env:PO_SESSION_ID='ТВОЁ_СООБЩЕНИЕ_42auth_ЦЕЛИКОМ'; python bot.py`,
                          },
                        ].map(({ step, icon, title, desc, color, code }) => (
                          <div key={step} className={`flex gap-4 p-4 rounded-xl border ${color}`}>
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center font-orbitron font-bold text-xs text-zinc-300">
                              {step}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span>{icon}</span>
                                <p className="text-white font-orbitron text-sm font-semibold">{title}</p>
                              </div>
                              <p className="text-zinc-400 font-space-mono text-xs leading-relaxed">{desc}</p>
                              {code && (
                                <pre className="mt-2 bg-black rounded-lg p-3 text-xs text-green-400 font-space-mono border border-zinc-800 overflow-auto whitespace-pre-wrap">
                                  {code}
                                </pre>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Warning */}
                      <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4">
                        <div className="flex gap-3">
                          <span className="text-yellow-400 text-lg flex-shrink-0">⚠️</span>
                          <div className="space-y-1">
                            <p className="text-yellow-400 font-orbitron text-xs font-semibold">Важно о безопасности</p>
                            <ul className="text-zinc-400 font-space-mono text-xs space-y-1">
                              <li>• Session ID — как пароль. Никому его не передавайте</li>
                              <li>• Сессия истекает через некоторое время — нужно будет получить новую</li>
                              <li>• Не записывайте Session ID в файл бота — используйте только переменные окружения</li>
                              <li>• При смене пароля или выходе из аккаунта Session ID станет недействительным</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Strategy Guide */}
              <div className="mb-6">
                <button
                  onClick={() => setStrategyGuideOpen((v) => !v)}
                  className="w-full flex items-center justify-between bg-zinc-900 border border-zinc-700 hover:border-zinc-500 rounded-xl px-5 py-3.5 transition-all duration-200 group"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-yellow-400 text-lg">🧭</span>
                    <div className="text-left">
                      <p className="text-white font-orbitron text-sm font-semibold">Какую стратегию выбрать?</p>
                      <p className="text-zinc-500 font-space-mono text-xs">Сравнение стратегий и советы для новичков</p>
                    </div>
                  </div>
                  <Icon
                    name={strategyGuideOpen ? "ChevronUp" : "ChevronDown"}
                    size={18}
                    className="text-zinc-400 group-hover:text-zinc-200 transition-colors flex-shrink-0"
                  />
                </button>

                {strategyGuideOpen && (
                  <div className="mt-2 bg-zinc-900 border border-zinc-700 rounded-xl overflow-hidden">
                    <div className="p-5 space-y-5">

                      {/* Recommendation for beginners */}
                      <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
                        <div className="flex gap-3">
                          <span className="text-2xl flex-shrink-0">👶</span>
                          <div>
                            <p className="text-green-400 font-orbitron text-sm font-semibold mb-1">Новичку — начинать отсюда</p>
                            <p className="text-zinc-300 font-space-mono text-xs leading-relaxed">
                              Если вы только начинаете — выбирайте <span className="text-green-400 font-bold">EMA Пересечение</span>. 
                              Это самая понятная и предсказуемая стратегия с минимальным риском. 
                              Она даёт чёткий сигнал и не требует сложных настроек.
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Strategy comparison cards */}
                      <div className="space-y-3">

                        {/* EMA Cross */}
                        <div className="border border-green-500/30 bg-green-500/5 rounded-xl p-4">
                          <div className="flex items-start justify-between gap-3 mb-2">
                            <div className="flex items-center gap-2">
                              <span className="text-green-400 font-orbitron font-bold text-sm">EMA Пересечение</span>
                              <span className="text-xs bg-green-500/20 text-green-400 border border-green-500/30 px-2 py-0.5 rounded-full font-space-mono">Новичкам</span>
                            </div>
                            <div className="flex gap-1">
                              {["🟢","🟢","⚫","⚫","⚫"].map((d,i) => <span key={i} className="text-xs">{d}</span>)}
                            </div>
                          </div>
                          <p className="text-zinc-400 font-space-mono text-xs leading-relaxed mb-3">
                            Бот ждёт, когда быстрая линия EMA пересечёт медленную. Пересечение снизу вверх — покупаем CALL (ждём рост). Сверху вниз — PUT (ждём падение). Сигналов немного, но они надёжные.
                          </p>
                          <div className="grid grid-cols-3 gap-2 text-xs font-space-mono">
                            <div className="bg-zinc-800 rounded-lg p-2 text-center">
                              <p className="text-zinc-500 mb-0.5">Сигналов/день</p>
                              <p className="text-white font-bold">5–15</p>
                            </div>
                            <div className="bg-zinc-800 rounded-lg p-2 text-center">
                              <p className="text-zinc-500 mb-0.5">Winrate (прим.)</p>
                              <p className="text-green-400 font-bold">55–65%</p>
                            </div>
                            <div className="bg-zinc-800 rounded-lg p-2 text-center">
                              <p className="text-zinc-500 mb-0.5">Риск</p>
                              <p className="text-green-400 font-bold">Низкий</p>
                            </div>
                          </div>
                        </div>

                        {/* RSI */}
                        <div className="border border-blue-500/30 bg-blue-500/5 rounded-xl p-4">
                          <div className="flex items-start justify-between gap-3 mb-2">
                            <div className="flex items-center gap-2">
                              <span className="text-blue-400 font-orbitron font-bold text-sm">RSI Разворот</span>
                              <span className="text-xs bg-zinc-700 text-zinc-300 border border-zinc-600 px-2 py-0.5 rounded-full font-space-mono">Универсальная</span>
                            </div>
                            <div className="flex gap-1">
                              {["🟡","🟡","🟡","⚫","⚫"].map((d,i) => <span key={i} className="text-xs">{d}</span>)}
                            </div>
                          </div>
                          <p className="text-zinc-400 font-space-mono text-xs leading-relaxed mb-3">
                            RSI измеряет «усталость» рынка. Когда рынок сильно вырос — RSI выше 70 (перекупленность), ждём разворот вниз → PUT. Упал ниже 30 (перепроданность) → CALL. Хорошо работает на флете и OTC-парах.
                          </p>
                          <div className="grid grid-cols-3 gap-2 text-xs font-space-mono">
                            <div className="bg-zinc-800 rounded-lg p-2 text-center">
                              <p className="text-zinc-500 mb-0.5">Сигналов/день</p>
                              <p className="text-white font-bold">10–25</p>
                            </div>
                            <div className="bg-zinc-800 rounded-lg p-2 text-center">
                              <p className="text-zinc-500 mb-0.5">Winrate (прим.)</p>
                              <p className="text-yellow-400 font-bold">52–60%</p>
                            </div>
                            <div className="bg-zinc-800 rounded-lg p-2 text-center">
                              <p className="text-zinc-500 mb-0.5">Риск</p>
                              <p className="text-yellow-400 font-bold">Средний</p>
                            </div>
                          </div>
                        </div>

                        {/* Candle patterns */}
                        <div className="border border-yellow-500/30 bg-yellow-500/5 rounded-xl p-4">
                          <div className="flex items-start justify-between gap-3 mb-2">
                            <div className="flex items-center gap-2">
                              <span className="text-yellow-400 font-orbitron font-bold text-sm">Паттерны свечей</span>
                              <span className="text-xs bg-zinc-700 text-zinc-300 border border-zinc-600 px-2 py-0.5 rounded-full font-space-mono">Опытным</span>
                            </div>
                            <div className="flex gap-1">
                              {["🟡","🟡","🟡","⚫","⚫"].map((d,i) => <span key={i} className="text-xs">{d}</span>)}
                            </div>
                          </div>
                          <p className="text-zinc-400 font-space-mono text-xs leading-relaxed mb-3">
                            Бот ищет японские паттерны: молот, поглощение, доджи. Когда находит разворотную фигуру — открывает опцион. Сигналов меньше, но они бывают очень точными. Лучше работает на таймфрейме 5 минут.
                          </p>
                          <div className="grid grid-cols-3 gap-2 text-xs font-space-mono">
                            <div className="bg-zinc-800 rounded-lg p-2 text-center">
                              <p className="text-zinc-500 mb-0.5">Сигналов/день</p>
                              <p className="text-white font-bold">3–10</p>
                            </div>
                            <div className="bg-zinc-800 rounded-lg p-2 text-center">
                              <p className="text-zinc-500 mb-0.5">Winrate (прим.)</p>
                              <p className="text-yellow-400 font-bold">55–68%</p>
                            </div>
                            <div className="bg-zinc-800 rounded-lg p-2 text-center">
                              <p className="text-zinc-500 mb-0.5">Риск</p>
                              <p className="text-yellow-400 font-bold">Средний</p>
                            </div>
                          </div>
                        </div>

                        {/* Support/Resistance */}
                        <div className="border border-purple-500/30 bg-purple-500/5 rounded-xl p-4">
                          <div className="flex items-start justify-between gap-3 mb-2">
                            <div className="flex items-center gap-2">
                              <span className="text-purple-400 font-orbitron font-bold text-sm">Поддержка / Сопротивление</span>
                              <span className="text-xs bg-zinc-700 text-zinc-300 border border-zinc-600 px-2 py-0.5 rounded-full font-space-mono">Опытным</span>
                            </div>
                            <div className="flex gap-1">
                              {["🟡","🟡","🟡","🟡","⚫"].map((d,i) => <span key={i} className="text-xs">{d}</span>)}
                            </div>
                          </div>
                          <p className="text-zinc-400 font-space-mono text-xs leading-relaxed mb-3">
                            Бот находит ключевые ценовые уровни — «потолки» и «полы» рынка. Когда цена подходит к уровню, открывает опцион в сторону отбоя. Требует достаточно данных (минимум 30 свечей) для точного определения уровней.
                          </p>
                          <div className="grid grid-cols-3 gap-2 text-xs font-space-mono">
                            <div className="bg-zinc-800 rounded-lg p-2 text-center">
                              <p className="text-zinc-500 mb-0.5">Сигналов/день</p>
                              <p className="text-white font-bold">2–8</p>
                            </div>
                            <div className="bg-zinc-800 rounded-lg p-2 text-center">
                              <p className="text-zinc-500 mb-0.5">Winrate (прим.)</p>
                              <p className="text-purple-400 font-bold">58–70%</p>
                            </div>
                            <div className="bg-zinc-800 rounded-lg p-2 text-center">
                              <p className="text-zinc-500 mb-0.5">Риск</p>
                              <p className="text-yellow-400 font-bold">Средний</p>
                            </div>
                          </div>
                        </div>

                        {/* Martingale */}
                        <div className="border border-red-500/40 bg-red-500/5 rounded-xl p-4">
                          <div className="flex items-start justify-between gap-3 mb-2">
                            <div className="flex items-center gap-2">
                              <span className="text-red-400 font-orbitron font-bold text-sm">Мартингейл</span>
                              <span className="text-xs bg-red-500/20 text-red-400 border border-red-500/30 px-2 py-0.5 rounded-full font-space-mono">⚠️ Опасно</span>
                            </div>
                            <div className="flex gap-1">
                              {["🔴","🔴","🔴","🔴","🔴"].map((d,i) => <span key={i} className="text-xs">{d}</span>)}
                            </div>
                          </div>
                          <p className="text-zinc-400 font-space-mono text-xs leading-relaxed mb-3">
                            После каждого проигрыша ставка умножается на заданный коэффициент. Идея: рано или поздно выигрыш окупит все потери. На практике — серия из 5–7 убытков подряд может уничтожить весь депозит. Не рекомендуем новичкам.
                          </p>
                          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                            <p className="text-red-400 font-space-mono text-xs">
                              Пример: ставка $10 с множителем ×2.1 за 6 шагов вырастет до <span className="font-bold text-red-300">$96</span>. При 7-м проигрыше подряд — $202. При нулевом балансе бот остановится.
                            </p>
                          </div>
                        </div>

                      </div>

                      {/* Tips */}
                      <div className="bg-zinc-800 rounded-xl p-4 space-y-2">
                        <p className="text-white font-orbitron text-xs font-semibold mb-2">💡 Советы по выбору</p>
                        <ul className="text-zinc-400 font-space-mono text-xs space-y-1.5">
                          <li>• Начинайте с <span className="text-green-400">EMA Пересечение</span> на EUR/USD OTC — самый стабильный старт</li>
                          <li>• Для OTC-пар лучше работают RSI и EMA — рынок менее волатильный</li>
                          <li>• Экспирация 1–3 минуты подходит для скальпинговых стратегий</li>
                          <li>• Экспирация 5–15 минут — для паттернов свечей и уровней</li>
                          <li>• Всегда тестируйте на демо-счёте минимум 50 сделок перед реальными деньгами</li>
                          <li>• Мартингейл можно добавить к любой стратегии, но делайте это осторожно</li>
                        </ul>
                      </div>

                    </div>
                  </div>
                )}
              </div>

              {/* Dual mode toggle */}
              <div className="mb-6">
                <button
                  onClick={() => setDualMode((v) => !v)}
                  className={`w-full flex items-center justify-between rounded-xl px-5 py-3.5 transition-all duration-200 border group ${
                    dualMode
                      ? "bg-purple-500/10 border-purple-500/40 hover:border-purple-400"
                      : "bg-zinc-900 border-zinc-700 hover:border-zinc-500"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">⚡</span>
                    <div className="text-left">
                      <p className={`font-orbitron text-sm font-semibold ${dualMode ? "text-purple-300" : "text-white"}`}>
                        Режим двух ботов {dualMode ? "— включён" : ""}
                      </p>
                      <p className="text-zinc-500 font-space-mono text-xs">Настройте 2 разные стратегии и скачайте оба файла сразу</p>
                    </div>
                  </div>
                  <div className={`w-10 h-5 rounded-full transition-all duration-200 flex items-center px-0.5 ${dualMode ? "bg-purple-500" : "bg-zinc-700"}`}>
                    <div className={`w-4 h-4 rounded-full bg-white transition-all duration-200 ${dualMode ? "translate-x-5" : "translate-x-0"}`} />
                  </div>
                </button>
              </div>



              <div className={`grid gap-8 ${dualMode ? "grid-cols-1 lg:grid-cols-2" : "grid-cols-1 lg:grid-cols-3"}`}>
                {/* Bot 1 Form */}
                <div className={dualMode ? "" : "lg:col-span-1"}>
                  {dualMode && <p className="text-purple-400 font-orbitron text-xs font-bold mb-3 uppercase tracking-wider">🤖 Бот 1</p>}
                  <PocketOptionBotForm
                    config={poConfig}
                    onChange={setPoConfig}
                    onGenerate={handlePOGenerate}
                  />
                </div>

                {/* Bot 2 Form (dual mode only) */}
                {dualMode && (
                  <div className="space-y-4">
                    <p className="text-blue-400 font-orbitron text-xs font-bold uppercase tracking-wider">🤖 Бот 2</p>
                    <PocketOptionBotForm
                      config={poConfig2}
                      onChange={setPoConfig2}
                      onGenerate={handlePOGenerate}
                      botIndex={2}
                    />
                  </div>
                )}

                {!dualMode && (
                  <>
                    <div className="space-y-4" ref={poCodeRef}>
                      <Card className="bg-zinc-900 border-red-500/20 h-full">
                        <CardHeader className="flex flex-row items-center justify-between gap-2">
                          <CardTitle className="font-orbitron text-white text-lg">Python-код бота</CardTitle>
                          {poGenerated && (
                            <div className="flex items-center gap-2">
                              <Button variant="outline" size="sm" onClick={handlePOCopy} className="border-red-500/40 text-red-400 hover:bg-red-500/10 font-space-mono text-xs">
                                <Icon name="Copy" size={12} className="mr-1" />{poCopied ? "Скопировано ✓" : "Копировать"}
                              </Button>
                              <Button variant="outline" size="sm" onClick={handlePODownload} className="border-green-500/40 text-green-400 hover:bg-green-500/10 font-space-mono text-xs">
                                <Icon name="Download" size={12} className="mr-1" />.py
                              </Button>
                              <Button variant="outline" size="sm" onClick={handleEnvDownload} className="border-yellow-500/40 text-yellow-400 hover:bg-yellow-500/10 font-space-mono text-xs">
                                <Icon name="Download" size={12} className="mr-1" />.env
                              </Button>
                              <Button variant="outline" size="sm" onClick={() => copyCmd(`$env:PO_SESSION_ID='${sessionId || "ВСТАВЬТЕ_SESSION_ID"}'; python bot.py`, "header")} className="border-blue-500/40 text-blue-400 hover:bg-blue-500/10 font-space-mono text-xs">
                                <Icon name={copiedCmd === "header" ? "Check" : "Terminal"} size={12} className="mr-1" />{copiedCmd === "header" ? "Скопировано ✓" : "Команда запуска"}
                              </Button>
                            </div>
                          )}
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {poGenerated ? (
                            <pre className="bg-black rounded-lg p-4 text-xs text-green-400 font-space-mono overflow-auto max-h-[700px] whitespace-pre-wrap leading-relaxed border border-zinc-800">{poCode}</pre>
                          ) : (
                            <div className="bg-black rounded-lg p-8 border border-zinc-800 text-center min-h-[400px] flex flex-col items-center justify-center">
                              <div className="text-6xl mb-4">🎯</div>
                              <p className="text-zinc-400 font-space-mono text-sm mb-2">Код появится здесь</p>
                              <p className="text-zinc-600 font-space-mono text-xs">Настройте параметры и нажмите «Сгенерировать»</p>
                            </div>
                          )}
                          {poGenerated && (
                            <div className="space-y-3 border-t border-zinc-800 pt-4">
                              <p className="text-white font-orbitron text-sm font-semibold">Как запустить бота</p>
                              <div className="rounded-lg border border-zinc-700 bg-zinc-800/40 p-3 space-y-1">
                                <p className="text-red-400 font-orbitron text-xs font-semibold">Шаг 1 — Скачайте файл</p>
                                <p className="text-zinc-400 font-space-mono text-xs">Нажмите кнопку <span className="text-green-400">.py</span> выше — файл сохранится на ваш компьютер.</p>
                                <p className="text-zinc-400 font-space-mono text-xs">Переименуйте скачанный файл в <span className="text-white">bot.py</span>.</p>
                              </div>
                              <div className="rounded-lg border border-zinc-700 bg-zinc-800/40 p-3 space-y-2">
                                <p className="text-red-400 font-orbitron text-xs font-semibold">Шаг 2 — Установите Python</p>
                                <p className="text-zinc-400 font-space-mono text-xs">Скачайте <a href="https://www.python.org/downloads/release/python-3119/" target="_blank" rel="noreferrer" className="text-blue-400 underline">Python 3.11</a>. При установке отметьте <span className="text-white">«Add to PATH»</span>.</p>
                                <div className="bg-yellow-500/5 border border-yellow-500/20 rounded p-2"><p className="text-yellow-400/80 font-space-mono text-xs">⚠️ Python 3.11 — версии 3.12+ не совместимы с библиотекой Pocket Option.</p></div>
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </div>
                    <TradeJournal defaultAsset={poConfig.asset} defaultBet={poConfig.betAmount} />
                  </>
                )}
              </div>

              {/* ===== ЕДИНЫЙ БЛОК: Имена ботов + Telegram — всегда в самом низу ===== */}
              <Card className="bg-zinc-900 border-blue-500/20 mt-2">
                <CardHeader
                  className="pb-3 cursor-pointer select-none"
                  onClick={() => setTgBlockOpen((v) => !v)}
                >
                  <div className="flex items-center justify-between">
                    <CardTitle className="font-orbitron text-white text-sm flex items-center gap-2">
                      <Icon name="Send" size={16} className="text-blue-400" />
                      Имена ботов и Telegram уведомления
                      {poConfig.tgToken && poConfig.tgChatId && (
                        <span className="text-[10px] font-space-mono font-normal bg-green-500/20 border border-green-500/30 text-green-400 rounded px-1.5 py-0.5">настроено</span>
                      )}
                    </CardTitle>
                    <Icon name={tgBlockOpen ? "ChevronUp" : "ChevronDown"} size={16} className="text-zinc-500" />
                  </div>
                </CardHeader>
                {tgBlockOpen && (
                  <CardContent className="space-y-5">
                    {/* Имена ботов */}
                    <div className={`grid gap-3 ${dualMode ? "grid-cols-2" : "grid-cols-1"}`}>
                      <div>
                        <label className="text-zinc-400 font-space-mono text-xs mb-1.5 block">Имя Бота 1</label>
                        <input
                          type="text"
                          value={poConfig.botName ?? "Бот 1"}
                          onChange={(e) => setPoConfig(p => ({ ...p, botName: e.target.value }))}
                          placeholder="Бот 1"
                          className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white font-space-mono text-sm outline-none focus:border-purple-500/60 transition-colors"
                        />
                      </div>
                      {dualMode && (
                        <div>
                          <label className="text-zinc-400 font-space-mono text-xs mb-1.5 block">Имя Бота 2</label>
                          <input
                            type="text"
                            value={poConfig2.botName ?? "Бот 2"}
                            onChange={(e) => setPoConfig2(p => ({ ...p, botName: e.target.value }))}
                            placeholder="Бот 2"
                            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white font-space-mono text-sm outline-none focus:border-blue-500/60 transition-colors"
                          />
                        </div>
                      )}
                    </div>
                    {dualMode && (
                      <p className="text-zinc-500 font-space-mono text-xs -mt-1">⚠️ Задай разные имена. Управление: <span className="text-purple-400">/stop {poConfig.botName ?? "Бот 1"}</span>, <span className="text-blue-400">/stop {poConfig2.botName ?? "Бот 2"}</span> или <span className="text-zinc-400">/stop all</span></p>
                    )}

                    <div className="border-t border-zinc-700/60 pt-4 space-y-3">
                      {/* TG включить/выключить */}
                      <div className="flex items-center justify-between">
                        <p className="text-zinc-300 font-space-mono text-xs font-semibold">Telegram уведомления</p>
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-space-mono ${!poConfig.tgEnabled ? "text-zinc-400" : "text-zinc-600"}`}>Выкл</span>
                          <button
                            onClick={() => setPoConfig(p => ({ ...p, tgEnabled: !p.tgEnabled }))}
                            className={`relative w-10 h-5 rounded-full transition-colors ${poConfig.tgEnabled ? "bg-green-500" : "bg-zinc-600"}`}
                          >
                            <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${poConfig.tgEnabled ? "translate-x-5" : "translate-x-0.5"}`} />
                          </button>
                          <span className={`text-xs font-space-mono ${poConfig.tgEnabled ? "text-green-400" : "text-zinc-600"}`}>Вкл</span>
                        </div>
                      </div>
                      {/* Bot Token */}
                      <div>
                        <label className="text-zinc-400 font-space-mono text-xs mb-1.5 block">Bot Token</label>
                        <input
                          type="password"
                          value={poConfig.tgToken}
                          onChange={(e) => setPoConfig(p => ({ ...p, tgToken: e.target.value }))}
                          placeholder="123456:ABCdef..."
                          className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white font-space-mono text-sm outline-none focus:border-blue-500/60 transition-colors"
                        />
                        <p className="text-zinc-600 font-space-mono text-xs mt-1">Получи у @BotFather в Telegram{dualMode ? " — один токен для обоих ботов" : ""}</p>
                      </div>
                      {/* Chat ID */}
                      <div>
                        <label className="text-zinc-400 font-space-mono text-xs mb-1.5 block">Chat ID</label>
                        <input
                          type="text"
                          value={poConfig.tgChatId}
                          onChange={(e) => setPoConfig(p => ({ ...p, tgChatId: e.target.value }))}
                          placeholder="123456789"
                          className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white font-space-mono text-sm outline-none focus:border-blue-500/60 transition-colors"
                        />
                        <p className="text-zinc-600 font-space-mono text-xs mt-1">Узнай у @userinfobot</p>
                      </div>
                      {/* Прокси */}
                      <div>
                        <label className="text-zinc-400 font-space-mono text-xs mb-1.5 block">SOCKS5 прокси (если Telegram заблокирован)</label>
                        <input
                          type="text"
                          value={poConfig.tgProxy}
                          onChange={(e) => setPoConfig(p => ({ ...p, tgProxy: e.target.value }))}
                          placeholder="socks5://user:pass@host:1080"
                          className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white font-space-mono text-sm outline-none focus:border-blue-500/60 transition-colors"
                        />
                        <p className="text-zinc-600 font-space-mono text-xs mt-1">Оставь пустым если Telegram работает</p>
                      </div>
                      {/* Режим уведомлений */}
                      <div>
                        <label className="text-zinc-400 font-space-mono text-xs mb-2 block">Какие уведомления получать</label>
                        <div className="grid grid-cols-2 gap-2">
                          {([
                            { value: "all", icon: "📡", title: "Все события", desc: "Запуск, тренды, ставки, реконнект" },
                            { value: "bets_only", icon: "🎯", title: "Только ставки", desc: "TP/SL + результат каждой сделки" },
                          ] as const).map((opt) => (
                            <button
                              key={opt.value}
                              type="button"
                              onClick={() => setPoConfig(p => ({ ...p, tgNotifyMode: opt.value }))}
                              className={`rounded-lg px-3 py-2 text-xs font-space-mono border transition-all text-left ${(poConfig.tgNotifyMode ?? "all") === opt.value ? "bg-blue-600/20 border-blue-500/50 text-blue-300" : "bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-zinc-500"}`}
                            >
                              <div className="font-bold mb-0.5">{opt.icon} {opt.title}</div>
                              <div className="text-zinc-500 text-[10px]">{opt.desc}</div>
                            </button>
                          ))}
                        </div>
                      </div>
                      {/* Статус + тест */}
                      {poConfig.tgToken && poConfig.tgChatId ? (
                        <div className="space-y-2">
                          <div className="flex items-center gap-3 flex-wrap">
                            <div className="flex items-center gap-2 text-green-400 font-space-mono text-xs">
                              <Icon name="CheckCircle" size={13} className="text-green-400" />
                              Telegram подключён{dualMode ? " — один чат для обоих ботов" : ""}
                            </div>
                            <button
                              onClick={sendTgTest}
                              disabled={tgTestStatus === "sending"}
                              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-space-mono font-bold border transition-all ${
                                tgTestStatus === "ok" ? "bg-green-500/20 border-green-500/40 text-green-400" :
                                tgTestStatus === "error" ? "bg-red-500/20 border-red-500/40 text-red-400" :
                                tgTestStatus === "sending" ? "bg-zinc-700 border-zinc-600 text-zinc-400" :
                                "bg-blue-500/10 border-blue-500/30 text-blue-400 hover:bg-blue-500/20"
                              }`}
                            >
                              <Icon name={tgTestStatus === "ok" ? "Check" : tgTestStatus === "error" ? "X" : "Send"} size={11} />
                              {tgTestStatus === "sending" ? "Отправка..." : tgTestStatus === "ok" ? "Пришло!" : tgTestStatus === "error" ? "Ошибка — проверьте токен" : "Отправить тест"}
                            </button>
                            <button onClick={clearTgSettings} className="flex items-center gap-1 text-zinc-600 hover:text-red-400 transition-colors text-xs font-space-mono">
                              <Icon name="X" size={10} />очистить
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {poConfig.tgEnabled && (
                            <div className="flex items-center gap-2 bg-yellow-950/40 border border-yellow-500/30 rounded-lg px-2.5 py-2">
                              <Icon name="AlertTriangle" size={14} className="text-yellow-400" />
                              <span className="text-yellow-400 text-xs font-space-mono">Заполни Token и Chat ID</span>
                            </div>
                          )}
                          <button
                            onClick={() => setTgGuideOpen((v) => !v)}
                            className="flex items-center gap-1.5 text-blue-400 hover:text-blue-300 font-space-mono text-xs transition-colors"
                          >
                            <Icon name={tgGuideOpen ? "ChevronUp" : "ChevronDown"} size={12} />
                            Как создать Telegram бота за 1 минуту?
                          </button>
                          {tgGuideOpen && (
                            <div className="bg-zinc-800/60 border border-zinc-700 rounded-xl p-4 space-y-3">
                              <p className="text-zinc-400 font-space-mono text-xs">Нужен Telegram — всё делается прямо в нём:</p>
                              <div className="space-y-2">
                                {[
                                  { step: "1", icon: "🤖", color: "border-blue-500/30 bg-blue-500/5", title: "Откройте @BotFather", desc: "Перейдите в Telegram и найдите бота", link: { href: "https://t.me/BotFather", label: "@BotFather" } },
                                  { step: "2", icon: "💬", color: "border-zinc-600 bg-zinc-800/40", title: "Отправьте команду /newbot", desc: "BotFather спросит имя — введите любое, например: MyTradeBot" },
                                  { step: "3", icon: "🔑", color: "border-green-500/30 bg-green-500/5", title: "Скопируйте Token", desc: "BotFather пришлёт токен вида 1234567890:AAF... — вставьте его в поле Bot Token выше" },
                                  { step: "4", icon: "🆔", color: "border-zinc-600 bg-zinc-800/40", title: "Получите ваш Chat ID", desc: "Откройте", link: { href: "https://t.me/userinfobot", label: "@userinfobot" }, descAfter: "— он пришлёт ваш ID. Вставьте в поле Chat ID выше" },
                                  { step: "5", icon: "✅", color: "border-purple-500/30 bg-purple-500/5", title: "Напишите своему боту /start", desc: "Найдите своего нового бота в Telegram и нажмите Start — без этого уведомления не придут!" },
                                ].map(({ step, icon, color, title, desc, link, descAfter }) => (
                                  <div key={step} className={`flex gap-3 p-3 rounded-lg border ${color}`}>
                                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center font-orbitron font-bold text-xs text-zinc-300">{step}</div>
                                    <div>
                                      <p className="text-white font-orbitron text-xs font-semibold mb-0.5">{icon} {title}</p>
                                      <p className="text-zinc-400 font-space-mono text-xs">
                                        {desc}{" "}
                                        {link && <a href={link.href} target="_blank" rel="noreferrer" className="text-blue-400 underline">{link.label}</a>}
                                        {descAfter && ` ${descAfter}`}
                                      </p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                              <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-3">
                                <p className="text-yellow-400/80 font-space-mono text-xs">💡 Один и тот же бот и chat ID можно использовать для обоих ботов</p>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </CardContent>
                )}
              </Card>

              {/* Dual mode: аналитика + кнопка генерации */}
              {dualMode && (() => {
                const totalSL = poConfig.stopLossRub + poConfig2.stopLossRub
                const totalTP = poConfig.takeProfitRub + poConfig2.takeProfitRub
                const totalBet = poConfig.betAmount + poConfig2.betAmount
                const tpSlRatio = totalSL > 0 ? totalTP / totalSL : 0
                const tpSlGood = tpSlRatio >= 1.5
                const cur = poConfig.currency || "$"
                const maxLosses1 = poConfig.betAmount > 0 ? Math.floor(poConfig.stopLossRub / poConfig.betAmount) : 0
                const maxLosses2 = poConfig2.betAmount > 0 ? Math.floor(poConfig2.stopLossRub / poConfig2.betAmount) : 0
                const dailyTrades = poConfig.dailyLimit + poConfig2.dailyLimit
                const estWins = Math.round(dailyTrades * 0.6)
                const estLosses = dailyTrades - estWins
                const payout = ((poConfig.payoutRate + poConfig2.payoutRate) / 2) / 100
                const estDayProfit = estWins * (totalBet / 2) * payout - estLosses * (totalBet / 2)
                return (
                  <div className="mt-4 space-y-3">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div className="rounded-xl border border-red-500/30 bg-red-500/5 p-3">
                        <p className="text-zinc-500 font-space-mono text-xs mb-1">Суммарный стоп-лосс</p>
                        <p className="font-orbitron font-bold text-xl text-red-400">{cur}{totalSL}</p>
                        <p className="text-zinc-600 font-space-mono text-xs mt-0.5">Бот 1: {cur}{poConfig.stopLossRub} + Бот 2: {cur}{poConfig2.stopLossRub}</p>
                      </div>
                      <div className="rounded-xl border border-green-500/30 bg-green-500/5 p-3">
                        <p className="text-zinc-500 font-space-mono text-xs mb-1">Суммарный тейк-профит</p>
                        <p className="font-orbitron font-bold text-xl text-green-400">{cur}{totalTP}</p>
                        <p className="text-zinc-600 font-space-mono text-xs mt-0.5">Бот 1: {cur}{poConfig.takeProfitRub} + Бот 2: {cur}{poConfig2.takeProfitRub}</p>
                      </div>
                      <div className="rounded-xl border border-yellow-500/30 bg-yellow-500/5 p-3">
                        <p className="text-zinc-500 font-space-mono text-xs mb-1">Суммарная ставка</p>
                        <p className="font-orbitron font-bold text-xl text-yellow-400">{cur}{totalBet}</p>
                        <p className="text-zinc-600 font-space-mono text-xs mt-0.5">Бот 1: {cur}{poConfig.betAmount} + Бот 2: {cur}{poConfig2.betAmount}</p>
                      </div>
                      <div className={`rounded-xl border p-3 ${tpSlGood ? "border-blue-500/30 bg-blue-500/5" : "border-orange-500/30 bg-orange-500/5"}`}>
                        <p className="text-zinc-500 font-space-mono text-xs mb-1">Соотношение TP/SL</p>
                        <p className={`font-orbitron font-bold text-xl ${tpSlGood ? "text-blue-400" : "text-orange-400"}`}>{totalSL > 0 ? `${tpSlRatio.toFixed(1)}x` : "—"}</p>
                        <p className="text-zinc-600 font-space-mono text-xs mt-0.5">{tpSlGood ? "Хорошее соотношение" : "SL превышает TP"}</p>
                      </div>
                    </div>
                    <div className="rounded-xl border border-purple-500/20 bg-purple-500/5 px-4 py-3 space-y-2 font-space-mono text-xs">
                      <p className="text-purple-300 font-semibold mb-1">⚡ Аналитика режима двух ботов</p>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-1.5">
                        <div><span className="text-zinc-500">Сделок/день (сумм.): </span><span className="text-white">{dailyTrades}</span></div>
                        <div><span className="text-zinc-500">Выплата (ср.): </span><span className="text-white">{((poConfig.payoutRate + poConfig2.payoutRate) / 2).toFixed(0)}%</span></div>
                        <div><span className="text-zinc-500">Проигрышей до SL Б1: </span><span className={maxLosses1 < 5 ? "text-orange-400" : "text-green-400"}>{maxLosses1} подряд</span></div>
                        <div><span className="text-zinc-500">Проигрышей до SL Б2: </span><span className={maxLosses2 < 5 ? "text-orange-400" : "text-green-400"}>{maxLosses2} подряд</span></div>
                        <div><span className="text-zinc-500">Прогноз/день (WR60%): </span><span className={estDayProfit >= 0 ? "text-green-400" : "text-red-400"}>{estDayProfit >= 0 ? "+" : ""}{cur}{estDayProfit.toFixed(0)}</span></div>
                        <div><span className="text-zinc-500">Риск на одну свечу: </span><span className="text-white">{cur}{totalBet}</span></div>
                      </div>
                      {totalSL < totalBet * 3 && <p className="text-orange-400 mt-1">⚠️ SL покрывает менее 3 проигрышей подряд — рекомендуем увеличить</p>}
                      {tpSlRatio > 0 && tpSlRatio < 1 && <p className="text-red-400 mt-1">🔴 TP меньше SL — при нейтральном WR будете в убытке</p>}
                      {tpSlGood && totalSL >= totalBet * 5 && <p className="text-green-400 mt-1">✅ Хорошая конфигурация — запас прочности достаточный</p>}
                    </div>
                    <Button
                      onClick={handlePOGenerate}
                      className="w-full bg-red-600 hover:bg-red-500 text-white font-orbitron font-bold py-4 text-base rounded-xl transition-all duration-200 shadow-lg shadow-red-500/20"
                    >
                      🔀 Сгенерировать код для обоих ботов
                    </Button>
                  </div>
                )
              })()}

              {/* Dual mode: code output + download both */}
                {dualMode && poGenerated && (
                  <div className="lg:col-span-2 space-y-4" ref={poCodeRef}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card className="bg-zinc-900 border-purple-500/20">
                        <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
                          <CardTitle className="font-orbitron text-white text-sm">🤖 Бот 1 — {poConfig.strategy}</CardTitle>
                          <Button variant="outline" size="sm" onClick={handlePOCopy} className="border-zinc-600 text-zinc-300 hover:bg-zinc-800 font-space-mono text-xs">
                            <Icon name="Copy" size={12} className="mr-1" />
                            {poCopied ? "✓" : "Копировать"}
                          </Button>
                        </CardHeader>
                        <CardContent>
                          <pre className="bg-black rounded-lg p-3 text-xs text-green-400 font-space-mono overflow-auto max-h-80 whitespace-pre-wrap border border-zinc-800">{poCode}</pre>
                        </CardContent>
                      </Card>
                      <Card className="bg-zinc-900 border-blue-500/20">
                        <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
                          <CardTitle className="font-orbitron text-white text-sm">🤖 Бот 2 — {poConfig2.strategy}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <pre className="bg-black rounded-lg p-3 text-xs text-blue-300 font-space-mono overflow-auto max-h-80 whitespace-pre-wrap border border-zinc-800">{poCode2}</pre>
                        </CardContent>
                      </Card>
                    </div>
                    <Button
                      onClick={handleDualDownload}
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white font-orbitron font-bold py-3"
                    >
                      <Icon name={dualDownloaded ? "Check" : "Download"} size={16} className="mr-2" />
                      {dualDownloaded ? "Скачано! Открой 2 окна PowerShell" : "Скачать оба файла (bot1.py + bot2.py)"}
                    </Button>
                    {dualDownloaded && (
                      <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4 space-y-2">
                        <p className="text-purple-300 font-orbitron text-sm font-semibold">Как запустить оба бота одновременно:</p>
                        {!sessionId && (
                          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded p-2 mb-2">
                            <p className="text-yellow-400 font-space-mono text-xs">⚠️ Вставьте Session ID в поле <span className="text-white">🔑 выше</span> — команды сгенерируются автоматически</p>
                          </div>
                        )}
                        {sessionId && (
                          <div className="flex items-center gap-2 text-green-400 font-space-mono text-xs mb-2">
                            <Icon name="CheckCircle" size={12} />
                            Session ID подставлен — скопируйте команды и запустите в двух окнах PowerShell
                          </div>
                        )}
                        <div className="space-y-3">
                          <div className="bg-black/60 border border-green-500/20 rounded-lg p-3">
                            <div className="flex items-center justify-between mb-2">
                              <p className="text-green-400 font-orbitron text-xs font-bold">📋 Окно PowerShell 1 (Бот 1)</p>
                              <button
                                onClick={() => copyCmd(`$env:PO_SESSION_ID='${sessionId || "ВСТАВЬТЕ_SESSION_ID_В_ПОЛЕ_ВЫШЕ"}'; python bot1.py`, "dual1")}
                                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-space-mono font-bold transition-all ${copiedCmd === "dual1" ? "bg-green-500 text-white" : "bg-green-600 hover:bg-green-500 text-white"}`}
                              >
                                {copiedCmd === "dual1" ? "✓ Скопировано!" : "📋 Копировать"}
                              </button>
                            </div>
                            <pre className="text-green-300 font-space-mono text-xs whitespace-pre-wrap break-all bg-black/40 rounded p-2 select-all">{`$env:PO_SESSION_ID='${sessionId || "ВСТАВЬТЕ_SESSION_ID_В_ПОЛЕ_ВЫШЕ"}'; python bot1.py`}</pre>
                          </div>
                          <div className="bg-black/60 border border-blue-500/20 rounded-lg p-3">
                            <div className="flex items-center justify-between mb-2">
                              <p className="text-blue-400 font-orbitron text-xs font-bold">📋 Окно PowerShell 2 (Бот 2)</p>
                              <button
                                onClick={() => copyCmd(`$env:PO_SESSION_ID='${sessionId || "ВСТАВЬТЕ_SESSION_ID_В_ПОЛЕ_ВЫШЕ"}'; python bot2.py`, "dual2")}
                                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-space-mono font-bold transition-all ${copiedCmd === "dual2" ? "bg-blue-500 text-white" : "bg-blue-600 hover:bg-blue-500 text-white"}`}
                              >
                                {copiedCmd === "dual2" ? "✓ Скопировано!" : "📋 Копировать"}
                              </button>
                            </div>
                            <pre className="text-blue-300 font-space-mono text-xs whitespace-pre-wrap break-all bg-black/40 rounded p-2 select-all">{`$env:PO_SESSION_ID='${sessionId || "ВСТАВЬТЕ_SESSION_ID_В_ПОЛЕ_ВЫШЕ"}'; python bot2.py`}</pre>
                          </div>
                        </div>
                        <p className="text-zinc-500 font-space-mono text-xs">⚡ Нажмите кнопку «Копировать» — не выделяйте текст вручную. Оба бота торгуют параллельно.</p>
                      </div>
                    )}
                  </div>
                )}
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

              <div className="space-y-4" ref={cryptoCodeRef}>
                <Card className="bg-zinc-900 border-red-500/20 h-full">
                  <CardHeader className="flex flex-row items-center justify-between gap-2">
                    <CardTitle className="font-orbitron text-white text-lg">Python-код бота</CardTitle>
                    {generated && (
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleCopy}
                          className="border-red-500/40 text-red-400 hover:bg-red-500/10 font-space-mono text-xs"
                        >
                          <Icon name="Copy" size={12} className="mr-1" />
                          {copied ? "Скопировано ✓" : "Копировать"}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleCryptoDownload}
                          className="border-green-500/40 text-green-400 hover:bg-green-500/10 font-space-mono text-xs"
                        >
                          <Icon name="Download" size={12} className="mr-1" />
                          .py
                        </Button>
                      </div>
                    )}
                  </CardHeader>
                  <CardContent className="space-y-4">
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
                    {generated && (
                      <div className="space-y-3 border-t border-zinc-800 pt-4">
                        <p className="text-white font-orbitron text-sm font-semibold">Как запустить бота</p>

                        <div className="rounded-lg border border-zinc-700 bg-zinc-800/40 p-3 space-y-1">
                          <p className="text-red-400 font-orbitron text-xs font-semibold">Шаг 1 — Скачайте файл</p>
                          <p className="text-zinc-400 font-space-mono text-xs">Нажмите кнопку <span className="text-green-400">.py</span> выше — файл <span className="text-white">bot.py</span> сохранится на ваш компьютер.</p>
                        </div>

                        <div className="rounded-lg border border-zinc-700 bg-zinc-800/40 p-3 space-y-2">
                          <p className="text-red-400 font-orbitron text-xs font-semibold">Шаг 2 — Установите Python</p>
                          <p className="text-zinc-400 font-space-mono text-xs">Если Python не установлен — скачайте с <a href="https://python.org/downloads" target="_blank" rel="noreferrer" className="text-blue-400 underline">python.org</a> (версия 3.10+). При установке отметьте <span className="text-white">«Add to PATH»</span>.</p>
                        </div>

                        <div className="rounded-lg border border-zinc-700 bg-zinc-800/40 p-3 space-y-2">
                          <p className="text-red-400 font-orbitron text-xs font-semibold">Шаг 3 — Установите зависимости</p>
                          <p className="text-zinc-400 font-space-mono text-xs font-semibold text-white mb-1">Как открыть терминал в папке с файлом (Windows):</p>
                          <ol className="text-zinc-400 font-space-mono text-xs space-y-1 ml-2 list-decimal list-inside">
                            <li>Откройте папку <span className="text-white">Загрузки</span> в Проводнике (где лежит bot.py)</li>
                            <li>Зажмите <span className="text-white">Shift</span> и кликните <span className="text-white">правой кнопкой мыши</span> на пустом месте в папке</li>
                            <li>Выберите <span className="text-green-400">«Открыть окно PowerShell здесь»</span> (или «Открыть в терминале»)</li>
                            <li>В открывшемся окне вставьте команду и нажмите <span className="text-white">Enter</span>:</li>
                          </ol>
                          <pre className="bg-black rounded p-2 text-xs text-green-400 font-space-mono border border-zinc-800 overflow-x-auto whitespace-pre-wrap break-all">{`pip install requests ccxt`}</pre>
                          <p className="text-zinc-500 font-space-mono text-xs">Увидите <span className="text-green-400">Successfully installed</span> — готово, переходите к шагу 4.</p>
                          <div className="bg-yellow-500/5 border border-yellow-500/20 rounded p-2">
                            <p className="text-yellow-400/80 font-space-mono text-xs">Видите сообщение <span className="text-white">«new version of pip available»</span>? Это не ошибка — просто pip предлагает обновить себя. Можно проигнорировать и идти дальше.</p>
                          </div>
                        </div>

                        <div className="rounded-lg border border-zinc-700 bg-zinc-800/40 p-3 space-y-2">
                          <p className="text-red-400 font-orbitron text-xs font-semibold">Шаг 4 — Получите API-ключи биржи</p>
                          <p className="text-zinc-400 font-space-mono text-xs">Зайдите в личный кабинет вашей биржи (Binance, Bybit и др.) → раздел <span className="text-white">API Management</span> → создайте ключ с правами на торговлю. Скопируйте <span className="text-red-400">API Key</span> и <span className="text-red-400">Secret Key</span>.</p>
                        </div>

                        <div className="rounded-lg border border-zinc-700 bg-zinc-800/40 p-3 space-y-2">
                          <p className="text-red-400 font-orbitron text-xs font-semibold">Шаг 5 — Запустите бота</p>
                          <p className="text-zinc-400 font-space-mono text-xs mb-1">Передайте ключи через переменные окружения:</p>
                          <pre className="bg-black rounded p-2 text-xs text-green-400 font-space-mono border border-zinc-800 overflow-x-auto whitespace-pre-wrap break-all">{`# Windows (PowerShell)
$env:API_KEY="ваш_api_key"
$env:API_SECRET="ваш_secret"
python bot.py

# Mac / Linux
API_KEY="ваш_api_key" API_SECRET="ваш_secret" python bot.py`}</pre>
                        </div>

                        {/* Errors */}
                        <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-3 space-y-2">
                          <p className="text-red-400 font-orbitron text-xs font-semibold">❓ Бот выдал ошибку — что делать</p>
                          <div className="space-y-2">
                            <div className="bg-black/40 rounded p-2">
                              <p className="text-zinc-300 font-space-mono text-xs font-semibold mb-0.5">«python не является внутренней командой»</p>
                              <p className="text-zinc-500 font-space-mono text-xs">Python не установлен или не добавлен в PATH. Переустановите с <a href="https://python.org/downloads" target="_blank" rel="noreferrer" className="text-blue-400 underline">python.org</a> и отметьте <span className="text-white">«Add to PATH»</span>.</p>
                            </div>
                            <div className="bg-black/40 rounded p-2">
                              <p className="text-zinc-300 font-space-mono text-xs font-semibold mb-0.5">«No module named 'ccxt'» или «No module named 'requests'»</p>
                              <p className="text-zinc-500 font-space-mono text-xs">Зависимости не установились. Вернитесь к шагу 3 и выполните <span className="text-green-400">pip install requests ccxt</span> заново.</p>
                            </div>
                            <div className="bg-black/40 rounded p-2">
                              <p className="text-zinc-300 font-space-mono text-xs font-semibold mb-0.5">«Invalid API key» или «AuthenticationError»</p>
                              <p className="text-zinc-500 font-space-mono text-xs">API-ключ скопирован неверно или у него нет прав на торговлю. Проверьте ключ в личном кабинете биржи и убедитесь что включены права <span className="text-white">Spot Trading</span>.</p>
                            </div>
                            <div className="bg-black/40 rounded p-2">
                              <p className="text-zinc-300 font-space-mono text-xs font-semibold mb-0.5">Терминал сразу закрылся</p>
                              <p className="text-zinc-500 font-space-mono text-xs">Запустите через PowerShell (не двойным кликом по файлу) — так увидите текст ошибки.</p>
                            </div>
                          </div>
                        </div>

                        <div className="rounded-lg border border-zinc-700 bg-zinc-800/40 p-3 space-y-1">
                          <p className="text-red-400 font-orbitron text-xs font-semibold">Шаг 6 — Сначала тестовая сеть</p>
                          <p className="text-zinc-400 font-space-mono text-xs">Большинство бирж предоставляют <span className="text-white">Testnet / Paper Trading</span> — используйте его минимум 1–2 дня. Убедитесь что стратегия работает корректно до пополнения реального счёта.</p>
                        </div>

                        <div className="flex gap-2 bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-3">
                          <span className="text-yellow-400 text-base shrink-0">⚠️</span>
                          <p className="text-yellow-400/80 font-space-mono text-xs">Никогда не храните API-ключи в коде. Не давайте ключам права на вывод средств — только торговля. Начинайте с минимального депозита.</p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

        </div>

        {tab === "pocket_option" && (
          <div className="max-w-7xl mx-auto px-4 pb-8">
            <BotHistory
              onRestore={(cfg) => {
                setPoConfig(cfg)
                setRestoreToast(true)
                setTimeout(() => setRestoreToast(false), 3000)
                window.scrollTo({ top: 0, behavior: "smooth" })
              }}
            />
          </div>
        )}
      </main>

      {restoreToast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 bg-zinc-900 border border-green-500/40 text-green-400 text-sm font-space-mono px-5 py-3 rounded-xl shadow-xl animate-in fade-in slide-in-from-bottom-2 duration-300">
          <Icon name="CheckCircle" size={16} />
          Настройки загружены — можно генерировать!
        </div>
      )}

      <Footer />
    </div>
  )
}