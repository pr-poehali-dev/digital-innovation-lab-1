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
import Icon from "@/components/ui/icon"

type Tab = "pocket_option" | "crypto"

export default function BotBuilder() {
  const [tab, setTab] = useState<Tab>("pocket_option")
  const [sessionGuideOpen, setSessionGuideOpen] = useState(false)
  const [strategyGuideOpen, setStrategyGuideOpen] = useState(false)

  // Pocket Option state
  const [poConfig, setPoConfig] = useState<POBotConfig>(PO_DEFAULT_CONFIG)
  const [poCode, setPoCode] = useState("")
  const [poGenerated, setPoGenerated] = useState(false)
  const [poCopied, setPoCopied] = useState(false)
  const poCodeRef = useRef<HTMLDivElement>(null)
  const cryptoCodeRef = useRef<HTMLDivElement>(null)

  // Crypto (original) state
  const [config, setConfig] = useState<BotConfig>(DEFAULT_CONFIG)
  const [code, setCode] = useState("")
  const [generated, setGenerated] = useState(false)
  const [copied, setCopied] = useState(false)

  const handlePOGenerate = () => {
    const code = poConfig.comboMode ? generatePOComboCode(poConfig) : generatePOCode(poConfig)
    setPoCode(code)
    setPoGenerated(true)
    setTimeout(() => {
      poCodeRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
    }, 100)
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
    const filename = `pocket_option_bot_${poConfig.strategy}.py`
    const blob = new Blob([poCode], { type: "text/x-python" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename
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
                            desc: "Перейдите на сайт pocketoption.com и войдите в свой аккаунт.",
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
                            icon: "📂",
                            title: "Перейдите во вкладку «Application»",
                            desc: 'В верхней панели DevTools найдите вкладку "Application" (Приложение). Если не видно — нажмите на стрелку ">>" в правой части панели.',
                            color: "border-zinc-600 bg-zinc-800/40",
                          },
                          {
                            step: "4",
                            icon: "🍪",
                            title: "Найдите Cookies",
                            desc: 'В левом меню разверните раздел "Cookies" → кликните на "https://pocketoption.com".',
                            color: "border-zinc-600 bg-zinc-800/40",
                          },
                          {
                            step: "5",
                            icon: "🔍",
                            title: "Найдите ci_session",
                            desc: 'В таблице найдите строку с именем "ci_session". Скопируйте значение из колонки "Value" — это и есть ваш Session ID.',
                            color: "border-green-500/40 bg-green-500/5",
                          },
                          {
                            step: "6",
                            icon: "💻",
                            title: "Передайте Session ID боту",
                            desc: "Сохраните значение в переменную окружения перед запуском бота.",
                            color: "border-red-500/40 bg-red-500/5",
                            code: "export PO_SESSION_ID=\"вставьте_значение_ci_session_сюда\"\npython bot.py",
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

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Form */}
                <PocketOptionBotForm
                  config={poConfig}
                  onChange={setPoConfig}
                  onGenerate={handlePOGenerate}
                />

                {/* Code output */}
                <div className="space-y-4" ref={poCodeRef}>
                  <Card className="bg-zinc-900 border-red-500/20 h-full">
                    <CardHeader className="flex flex-row items-center justify-between gap-2">
                      <CardTitle className="font-orbitron text-white text-lg">Python-код бота</CardTitle>
                      {poGenerated && (
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handlePOCopy}
                            className="border-red-500/40 text-red-400 hover:bg-red-500/10 font-space-mono text-xs"
                          >
                            <Icon name="Copy" size={12} className="mr-1" />
                            {poCopied ? "Скопировано ✓" : "Копировать"}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handlePODownload}
                            className="border-green-500/40 text-green-400 hover:bg-green-500/10 font-space-mono text-xs"
                          >
                            <Icon name="Download" size={12} className="mr-1" />
                            .py
                          </Button>
                        </div>
                      )}
                    </CardHeader>
                    <CardContent className="space-y-4">
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
                      {poGenerated && (
                        <div className="space-y-3 border-t border-zinc-800 pt-4">
                          <p className="text-white font-orbitron text-sm font-semibold">Как запустить бота</p>

                          {/* Step 1 */}
                          <div className="rounded-lg border border-zinc-700 bg-zinc-800/40 p-3 space-y-1">
                            <p className="text-red-400 font-orbitron text-xs font-semibold">Шаг 1 — Скачайте файл</p>
                            <p className="text-zinc-400 font-space-mono text-xs">Нажмите кнопку <span className="text-green-400">.py</span> выше — файл <span className="text-white">bot.py</span> сохранится на ваш компьютер.</p>
                          </div>

                          {/* Step 2 */}
                          <div className="rounded-lg border border-zinc-700 bg-zinc-800/40 p-3 space-y-2">
                            <p className="text-red-400 font-orbitron text-xs font-semibold">Шаг 2 — Установите Python</p>
                            <p className="text-zinc-400 font-space-mono text-xs">Если Python не установлен — скачайте с <a href="https://python.org/downloads" target="_blank" rel="noreferrer" className="text-blue-400 underline">python.org</a> (версия 3.10+). При установке отметьте галочку <span className="text-white">«Add to PATH»</span>.</p>
                          </div>

                          {/* Step 3 */}
                          <div className="rounded-lg border border-zinc-700 bg-zinc-800/40 p-3 space-y-2">
                            <p className="text-red-400 font-orbitron text-xs font-semibold">Шаг 3 — Установите зависимости</p>
                            <p className="text-zinc-400 font-space-mono text-xs mb-1">Откройте терминал (cmd / PowerShell / Terminal) в папке с файлом и выполните:</p>
                            <pre className="bg-black rounded p-2 text-xs text-green-400 font-space-mono border border-zinc-800 overflow-x-auto whitespace-pre-wrap break-all">{`pip install requests`}</pre>
                          </div>

                          {/* Step 4 */}
                          <div className="rounded-lg border border-zinc-700 bg-zinc-800/40 p-3 space-y-2">
                            <p className="text-red-400 font-orbitron text-xs font-semibold">Шаг 4 — Получите Session ID</p>
                            <p className="text-zinc-400 font-space-mono text-xs">Войдите в <a href="https://pocketoption.com" target="_blank" rel="noreferrer" className="text-blue-400 underline">pocketoption.com</a> в браузере. Откройте DevTools:</p>
                            <ul className="text-zinc-400 font-space-mono text-xs space-y-0.5 ml-2">
                              <li>• <span className="text-white">Chrome/Edge:</span> F12 → Application → Cookies → найдите <span className="text-red-400">ci_session</span></li>
                              <li>• <span className="text-white">Firefox:</span> F12 → Storage → Cookies → <span className="text-red-400">ci_session</span></li>
                            </ul>
                            <p className="text-zinc-500 font-space-mono text-xs">Скопируйте значение — это и есть ваш Session ID.</p>
                          </div>

                          {/* Step 5 */}
                          <div className="rounded-lg border border-zinc-700 bg-zinc-800/40 p-3 space-y-2">
                            <p className="text-red-400 font-orbitron text-xs font-semibold">Шаг 5 — Запустите бота</p>
                            <p className="text-zinc-400 font-space-mono text-xs mb-1">В терминале выполните (вставьте свой Session ID):</p>
                            <pre className="bg-black rounded p-2 text-xs text-green-400 font-space-mono border border-zinc-800 overflow-x-auto whitespace-pre-wrap break-all">{`# Windows (PowerShell)
$env:PO_SESSION_ID="ваш_session_id"; python bot.py

# Mac / Linux
PO_SESSION_ID="ваш_session_id" python bot.py`}</pre>
                          </div>

                          {/* Step 6 */}
                          <div className="rounded-lg border border-zinc-700 bg-zinc-800/40 p-3 space-y-1">
                            <p className="text-red-400 font-orbitron text-xs font-semibold">Шаг 6 — Сначала демо-счёт</p>
                            <p className="text-zinc-400 font-space-mono text-xs">Обязательно протестируйте бота на <span className="text-white">демо-счёте</span> Pocket Option минимум 1–2 дня перед запуском на реальные деньги. Убедитесь что бот ведёт себя как ожидается.</p>
                          </div>

                          {/* Warning */}
                          <div className="flex gap-2 bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-3">
                            <span className="text-yellow-400 text-base shrink-0">⚠️</span>
                            <p className="text-yellow-400/80 font-space-mono text-xs">Session ID действует до выхода из аккаунта. Не передавайте его третьим лицам — это полный доступ к вашему счёту.</p>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>

                {/* Trade Journal — 3rd column */}
                <TradeJournal
                  defaultAsset={poConfig.asset}
                  defaultBet={poConfig.betAmount}
                />
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
                          <p className="text-zinc-400 font-space-mono text-xs mb-1">Откройте терминал в папке с файлом и выполните:</p>
                          <pre className="bg-black rounded p-2 text-xs text-green-400 font-space-mono border border-zinc-800 overflow-x-auto whitespace-pre-wrap break-all">{`pip install requests ccxt`}</pre>
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
      </main>
      <Footer />
    </div>
  )
}