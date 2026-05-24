import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import Icon from "@/components/ui/icon"
import type { POBotConfig } from "./PocketOptionBotTypes"

const TG_SEND_URL = "https://functions.poehali.dev/fb70e0a6-b6c1-49e2-b148-c37dab50f024"

interface Props {
  config: POBotConfig
  set: (patch: Partial<POBotConfig>) => void
}

/**
 * Карточка настроек Telegram-уведомлений для PocketOption бота.
 * Декомпозирована из PocketOptionBotForm.tsx (этап 1).
 * Содержит: токен, chat ID, режим уведомлений, транспорт, кнопку проверки связи.
 */
export function TelegramNotifyCard({ config, set }: Props) {
  const [tgTestState, setTgTestState] = useState<"idle" | "loading" | "ok" | "error">("idle")
  const [tgTestVia, setTgTestVia] = useState<"" | "proxy" | "direct">("")

  const sendViaProxy = async (text: string): Promise<boolean> => {
    const res = await fetch(TG_SEND_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: config.tgToken, chat_id: config.tgChatId, text }),
    })
    if (!res.ok) throw new Error(`proxy HTTP ${res.status}`)
    const data = await res.json()
    return Boolean(data?.ok)
  }

  const sendViaDirect = async (text: string): Promise<boolean> => {
    const url = `https://api.telegram.org/bot${config.tgToken}/sendMessage`
    const body = new URLSearchParams({ chat_id: config.tgChatId, text, parse_mode: "HTML" })
    const res = await fetch(url, { method: "POST", body })
    if (!res.ok) throw new Error(`direct HTTP ${res.status}`)
    const data = await res.json()
    return Boolean(data?.ok)
  }

  const testTgConnection = async () => {
    setTgTestState("loading")
    setTgTestVia("")
    const transport = config.tgTransport ?? "auto"
    const text = `✅ <b>Проверка связи</b>\nРежим отправки: <code>${transport}</code>\nЕсли видишь это сообщение — настройки рабочие!`
    try {
      if (transport === "direct") {
        const ok = await sendViaDirect(text)
        setTgTestVia("direct")
        setTgTestState(ok ? "ok" : "error")
      } else if (transport === "proxy") {
        const ok = await sendViaProxy(text)
        setTgTestVia("proxy")
        setTgTestState(ok ? "ok" : "error")
      } else {
        // auto: сначала прокси, при ошибке (например 402) — fallback на direct
        try {
          const ok = await sendViaProxy(text)
          setTgTestVia("proxy")
          setTgTestState(ok ? "ok" : "error")
        } catch {
          const ok = await sendViaDirect(text)
          setTgTestVia("direct")
          setTgTestState(ok ? "ok" : "error")
        }
      }
    } catch {
      setTgTestState("error")
    }
    setTimeout(() => { setTgTestState("idle"); setTgTestVia("") }, 6000)
  }

  return (
    <Card className="bg-zinc-900 border-zinc-700">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="font-orbitron text-white text-sm flex items-center gap-2">
            <Icon name="Send" size={16} className="text-blue-400" />
            Telegram уведомления
          </CardTitle>
          <div className="flex items-center gap-2">
            <span className={`text-xs font-space-mono ${!config.tgEnabled ? "text-zinc-400" : "text-zinc-600"}`}>Выкл</span>
            <Switch checked={config.tgEnabled} onCheckedChange={(v) => set({ tgEnabled: v })} />
            <span className={`text-xs font-space-mono ${config.tgEnabled ? "text-green-400" : "text-zinc-600"}`}>Вкл</span>
          </div>
        </div>
      </CardHeader>
      {config.tgEnabled && (
        <CardContent className="space-y-3">
          <div>
            <Label className="text-zinc-400 font-space-mono text-xs mb-1.5 block">Bot Token</Label>
            <Input
              type="password"
              value={config.tgToken}
              onChange={(e) => set({ tgToken: e.target.value })}
              placeholder="123456:ABCdef..."
              className="bg-zinc-800 border-zinc-700 text-white font-space-mono text-sm"
            />
            <p className="text-zinc-600 font-space-mono text-xs mt-1">Получи у @BotFather в Telegram</p>
          </div>
          <div>
            <Label className="text-zinc-400 font-space-mono text-xs mb-1.5 block">Chat ID</Label>
            <Input
              type="text"
              value={config.tgChatId}
              onChange={(e) => set({ tgChatId: e.target.value })}
              placeholder="123456789"
              className="bg-zinc-800 border-zinc-700 text-white font-space-mono text-sm"
            />
            <p className="text-zinc-600 font-space-mono text-xs mt-1">Узнай у @userinfobot</p>
          </div>

          <div>
            <Label className="text-zinc-400 font-space-mono text-xs mb-2 block">Какие уведомления получать</Label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => set({ tgNotifyMode: "all" })}
                className={`rounded-lg px-3 py-2 text-xs font-space-mono border transition-all text-left ${(config.tgNotifyMode ?? "all") === "all" ? "bg-blue-600/20 border-blue-500/50 text-blue-300" : "bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-zinc-500"}`}
              >
                <div className="font-bold mb-0.5">📡 Все события</div>
                <div className="text-zinc-500 text-[10px]">Запуск, тренды, ставки, реконнект</div>
              </button>
              <button
                type="button"
                onClick={() => set({ tgNotifyMode: "bets_only" })}
                className={`rounded-lg px-3 py-2 text-xs font-space-mono border transition-all text-left ${(config.tgNotifyMode ?? "all") === "bets_only" ? "bg-blue-600/20 border-blue-500/50 text-blue-300" : "bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-zinc-500"}`}
              >
                <div className="font-bold mb-0.5">🎯 Только ставки</div>
                <div className="text-zinc-500 text-[10px]">TP/SL + результат каждой сделки</div>
              </button>
            </div>
          </div>

          <div>
            <Label className="text-zinc-400 font-space-mono text-xs mb-2 block">Как бот отправляет в Telegram</Label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => set({ tgTransport: "auto" })}
                className={`rounded-lg px-2.5 py-2 text-xs font-space-mono border transition-all text-left ${(config.tgTransport ?? "auto") === "auto" ? "bg-green-600/20 border-green-500/50 text-green-300" : "bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-zinc-500"}`}
              >
                <div className="font-bold mb-0.5">🔁 Авто</div>
                <div className="text-zinc-500 text-[10px]">Прокси + fallback на прямой API при 402</div>
              </button>
              <button
                type="button"
                onClick={() => set({ tgTransport: "direct" })}
                className={`rounded-lg px-2.5 py-2 text-xs font-space-mono border transition-all text-left ${config.tgTransport === "direct" ? "bg-blue-600/20 border-blue-500/50 text-blue-300" : "bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-zinc-500"}`}
              >
                <div className="font-bold mb-0.5">📡 Прямой</div>
                <div className="text-zinc-500 text-[10px]">api.telegram.org — нужен VPN если РКН</div>
              </button>
              <button
                type="button"
                onClick={() => set({ tgTransport: "proxy" })}
                className={`rounded-lg px-2.5 py-2 text-xs font-space-mono border transition-all text-left ${config.tgTransport === "proxy" ? "bg-purple-600/20 border-purple-500/50 text-purple-300" : "bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-zinc-500"}`}
              >
                <div className="font-bold mb-0.5">🌐 Прокси</div>
                <div className="text-zinc-500 text-[10px]">Только poehali tg-send (без VPN)</div>
              </button>
            </div>
            <p className="text-zinc-600 font-space-mono text-[10px] mt-1.5 leading-relaxed">
              Если в логах часто <code className="text-yellow-400">HTTP 402 Payment Required</code> — лимит прокси. Авто-режим сам переключится на прямой.
            </p>
          </div>

          {config.tgToken && config.tgChatId && (
            <div className="space-y-2">
              <button
                type="button"
                onClick={testTgConnection}
                disabled={tgTestState === "loading"}
                className="w-full flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs font-space-mono border transition-all bg-zinc-800 border-zinc-600 text-zinc-300 hover:border-blue-500/50 hover:text-blue-300 disabled:opacity-50"
              >
                <Icon name={tgTestState === "loading" ? "Loader" : "Send"} size={13} className={tgTestState === "loading" ? "animate-spin" : ""} />
                {tgTestState === "loading" ? "Отправляю..." : "Проверить подключение к TG"}
              </button>
              {tgTestState === "ok" && (
                <div className="flex items-center gap-2 bg-green-950/40 border border-green-500/30 rounded-lg px-2.5 py-2">
                  <Icon name="CheckCircle" size={14} className="text-green-400" />
                  <span className="text-green-400 text-xs font-space-mono">
                    Сообщение отправлено — проверь Telegram!
                    {tgTestVia && (
                      <span className="ml-1 text-green-300/80">
                        ({tgTestVia === "proxy" ? "🌐 через прокси" : "📡 напрямую"})
                      </span>
                    )}
                  </span>
                </div>
              )}
              {tgTestState === "error" && (
                <div className="flex items-center gap-2 bg-red-950/40 border border-red-500/30 rounded-lg px-2.5 py-2">
                  <Icon name="XCircle" size={14} className="text-red-400" />
                  <span className="text-red-400 text-xs font-space-mono">
                    Ошибка отправки
                    {config.tgTransport === "proxy" && " через прокси — попробуй режим «Авто» или «Прямой»"}
                    {config.tgTransport === "direct" && " напрямую — может нужен VPN, попробуй «Авто»"}
                    {(!config.tgTransport || config.tgTransport === "auto") && " — проверь токен и Chat ID"}
                  </span>
                </div>
              )}
            </div>
          )}
          {config.tgEnabled && (!config.tgToken || !config.tgChatId) && (
            <div className="flex items-center gap-2 bg-yellow-950/40 border border-yellow-500/30 rounded-lg px-2.5 py-2">
              <Icon name="AlertTriangle" size={14} className="text-yellow-400" />
              <span className="text-yellow-400 text-xs font-space-mono">Заполни Token и Chat ID</span>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  )
}

export default TelegramNotifyCard
