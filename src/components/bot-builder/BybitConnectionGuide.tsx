import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Icon from "@/components/ui/icon"

/**
 * 🟠 BybitConnectionGuide — пошаговый мастер подключения бота к Bybit.
 *
 * 6 шагов с раскрывающимся содержимым и отметками «прочитано».
 * Прогресс сохраняется в localStorage.
 */

interface Step {
  id: string
  title: string
  duration: string
  content: React.ReactNode
}

const STORAGE_KEY = "bybit_guide_progress"

export default function BybitConnectionGuide() {
  const [done, setDone] = useState<Set<string>>(() => {
    try {
      return new Set<string>(JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"))
    } catch {
      return new Set<string>()
    }
  })
  const [openId, setOpenId] = useState<string | null>("step-1")

  const toggle = (id: string) => setOpenId(openId === id ? null : id)
  const markDone = (id: string) => {
    setDone((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...next]))
      return next
    })
  }

  const Code = ({ children }: { children: string }) => (
    <pre className="bg-black/60 border border-zinc-800 rounded-lg p-3 text-xs text-green-400 font-space-mono overflow-x-auto whitespace-pre-wrap break-all my-2">
      {children}
    </pre>
  )

  const Link = ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a href={href} target="_blank" rel="noreferrer" className="text-orange-400 underline hover:text-orange-300">
      {children}
    </a>
  )

  const steps: Step[] = [
    {
      id: "step-1",
      title: "Зарегистрироваться на Bybit",
      duration: "~3 мин",
      content: (
        <div className="space-y-3 text-sm text-zinc-300">
          <p>
            Перейди на сайт <Link href="https://www.bybit.com/register">bybit.com/register</Link>, заполни email
            и пароль. Подтверди почту — ссылка придёт сразу.
          </p>
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3">
            <p className="text-amber-300 font-orbitron text-xs font-bold mb-1">
              <Icon name="AlertTriangle" size={12} className="inline mr-1" />
              Важно
            </p>
            <p className="text-amber-400/80 font-space-mono text-xs">
              Российские карты Bybit не принимает напрямую — для пополнения используй P2P (USDT через
              Сбер/Тинькофф) или криптокошелёк. Без денег бот может работать только на TESTNET.
            </p>
          </div>
          <p className="text-zinc-500 text-xs font-space-mono">
            🎁 По реферальной программе новички получают до $30 бонуса — но это не обязательно.
          </p>
        </div>
      ),
    },
    {
      id: "step-2",
      title: "Включить TESTNET для безопасных тестов",
      duration: "~2 мин",
      content: (
        <div className="space-y-3 text-sm text-zinc-300">
          <p>
            Для первого запуска <b className="text-orange-300">обязательно</b> используй тестовую сеть —
            виртуальные деньги, всё бесплатно.
          </p>
          <ol className="list-decimal list-inside space-y-2 text-zinc-400">
            <li>
              Открой <Link href="https://testnet.bybit.com">testnet.bybit.com</Link> — это отдельный сайт
            </li>
            <li>Зарегистрируйся отдельно (testnet-аккаунт не связан с основным)</li>
            <li>В кошельке получи бесплатные тестовые USDT (кнопка «Request Test Coins»)</li>
          </ol>
          <p className="text-emerald-300 font-space-mono text-xs">
            ✅ Когда бот покажет стабильный плюс на тестнете 50+ сделок — переключай на mainnet.
          </p>
        </div>
      ),
    },
    {
      id: "step-3",
      title: "Создать API-ключ",
      duration: "~5 мин",
      content: (
        <div className="space-y-3 text-sm text-zinc-300">
          <ol className="list-decimal list-inside space-y-2 text-zinc-400">
            <li>
              На Bybit (или testnet) нажми на иконку профиля справа → <b className="text-white">Account & Security</b> → <b className="text-white">API</b>
            </li>
            <li>
              Кнопка <b className="text-orange-300">Create New Key</b> → выбери <b className="text-white">System-generated API Keys</b>
            </li>
            <li>
              Дай ключу название (например, <code className="text-orange-300">TradeBaseBot</code>)
            </li>
            <li>
              <b className="text-white">Permissions</b> — поставь галочки:
              <div className="bg-zinc-800/60 border border-zinc-700 rounded p-2 mt-2 space-y-1 text-xs font-space-mono">
                <p>☑ <span className="text-emerald-400">Contract — Orders & Positions</span> (для фьючерсов)</p>
                <p>☑ <span className="text-emerald-400">Spot — Trade</span> (для спота)</p>
                <p>☐ <span className="text-zinc-500">Withdraw</span> — НЕ ВКЛЮЧАЙ! (бот не должен выводить)</p>
              </div>
            </li>
            <li>
              <b className="text-white">IP Restriction</b> — рекомендуется указать твой IP (узнать на <Link href="https://2ip.ru">2ip.ru</Link>),
              но можно оставить пустым для теста
            </li>
            <li>Подтверди по SMS/email/2FA</li>
            <li>
              Скопируй и <b className="text-red-300">сохрани в надёжном месте</b>:
              <Code>{`API Key:    XXXXXXXXXXXXXXXXXX
API Secret: YYYYYYYYYYYYYYYYYYYYYYYYYY`}</Code>
            </li>
          </ol>
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
            <p className="text-red-300 font-orbitron text-xs font-bold mb-1">
              <Icon name="ShieldAlert" size={12} className="inline mr-1" />
              API Secret показывается только один раз!
            </p>
            <p className="text-red-400/80 font-space-mono text-xs">
              Если потеряешь — придётся удалить ключ и создавать заново. Никогда не публикуй его в чатах/коде.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "step-4",
      title: "Установить Python и зависимости",
      duration: "~5 мин",
      content: (
        <div className="space-y-3 text-sm text-zinc-300">
          <p>
            Если Python ещё не установлен — скачай с <Link href="https://www.python.org/downloads/">python.org/downloads</Link>{" "}
            (версия 3.10+). При установке отметь <b className="text-orange-300">«Add Python to PATH»</b>.
          </p>
          <p>Открой терминал (PowerShell на Windows, Terminal на Mac) и установи библиотеки:</p>
          <Code>{`pip install pybit python-dotenv`}</Code>
          <p className="text-zinc-500 text-xs font-space-mono">
            📦 <span className="text-orange-300">pybit</span> — официальная библиотека Bybit для Python.
            <br />
            📦 <span className="text-orange-300">python-dotenv</span> — для безопасного хранения ключей в .env файле.
          </p>
          <div className="bg-zinc-800/60 border border-zinc-700 rounded-lg p-3">
            <p className="text-zinc-300 font-orbitron text-xs mb-1">Проверь установку:</p>
            <Code>{`python -c "from pybit.unified_trading import HTTP; print('OK')"`}</Code>
            <p className="text-emerald-400 text-xs font-space-mono">→ Должно вывести <code>OK</code></p>
          </div>
        </div>
      ),
    },
    {
      id: "step-5",
      title: "Создать .env и положить ключи",
      duration: "~2 мин",
      content: (
        <div className="space-y-3 text-sm text-zinc-300">
          <p>
            Рядом со сгенерированным <code className="text-orange-300">bot.py</code> создай файл{" "}
            <code className="text-orange-300">.env</code> (точка обязательна, расширения нет):
          </p>
          <Code>{`BYBIT_API_KEY=XXXXXXXXXXXXXXXXXX
BYBIT_API_SECRET=YYYYYYYYYYYYYYYYYYYYYYYYYY

# Опционально — для Telegram-уведомлений
TG_TOKEN=1234567890:ABC...
TG_CHAT_ID=987654321`}</Code>
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3">
            <p className="text-amber-300 font-orbitron text-xs font-bold mb-1">
              <Icon name="Eye" size={12} className="inline mr-1" />
              На Windows показать скрытые файлы
            </p>
            <p className="text-amber-400/80 font-space-mono text-xs">
              Проводник → Вид → ☑ Скрытые элементы. Иначе .env будет невидим.
            </p>
          </div>
          <p className="text-zinc-500 text-xs font-space-mono">
            💡 Никогда не коммить .env в git — добавь его в <code className="text-orange-300">.gitignore</code>.
          </p>
        </div>
      ),
    },
    {
      id: "step-6",
      title: "Запустить бота",
      duration: "~1 мин",
      content: (
        <div className="space-y-3 text-sm text-zinc-300">
          <p>В терминале, в папке с ботом:</p>
          <Code>{`python bot.py`}</Code>
          <p>Должен появиться лог типа:</p>
          <Code>{`[14:23:01] 🚀 Запуск 'BTCUSDT' | SPOT | TESTNET
[14:23:02] ⏳ Ожидание сигнала...
[14:23:12] ⏳ Ожидание сигнала...
[14:23:25] 📈 Открытие Buy | BTCUSDT | qty=0.0024 @ 42150.20`}</Code>
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 space-y-2">
            <p className="text-red-300 font-orbitron text-xs font-bold mb-1">❓ Если бот ругается:</p>
            <div className="space-y-2 text-xs font-space-mono">
              <div className="bg-black/40 rounded p-2">
                <p className="text-zinc-300 font-bold">«ErrCode: 10003 — API key is invalid»</p>
                <p className="text-zinc-500">Проверь что ключ скопирован без пробелов. Testnet и mainnet-ключи разные!</p>
              </div>
              <div className="bg-black/40 rounded p-2">
                <p className="text-zinc-300 font-bold">«ErrCode: 10005 — Permission denied»</p>
                <p className="text-zinc-500">У ключа нет прав. Вернись к шагу 3 и включи Spot Trade / Contract Trade.</p>
              </div>
              <div className="bg-black/40 rounded p-2">
                <p className="text-zinc-300 font-bold">«ErrCode: 10006 — IP not allowed»</p>
                <p className="text-zinc-500">У ключа стоит ограничение IP — добавь свой текущий или сними его.</p>
              </div>
              <div className="bg-black/40 rounded p-2">
                <p className="text-zinc-300 font-bold">«ModuleNotFoundError: pybit»</p>
                <p className="text-zinc-500">Зависимость не установилась — повтори шаг 4: <code className="text-emerald-400">pip install pybit</code></p>
              </div>
            </div>
          </div>
          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-3">
            <p className="text-emerald-300 font-orbitron text-xs font-bold mb-1">
              <Icon name="ShieldCheck" size={12} className="inline mr-1" />
              Чеклист перед mainnet
            </p>
            <ul className="text-emerald-400/80 text-xs font-space-mono space-y-1">
              <li>☑ Бот работает на testnet 50+ сделок без ошибок</li>
              <li>☑ WR (win-rate) выше 50%</li>
              <li>☑ TP/SL срабатывают корректно</li>
              <li>☑ Telegram-уведомления приходят</li>
              <li>☑ В коде <code className="text-white">TESTNET = False</code></li>
              <li>☑ Создан новый API-ключ на mainnet (testnet-ключи не работают на проде)</li>
            </ul>
          </div>
        </div>
      ),
    },
  ]

  const doneCount = steps.filter((s) => done.has(s.id)).length
  const progress = (doneCount / steps.length) * 100

  return (
    <Card className="bg-zinc-900 border-orange-500/30">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div>
            <CardTitle className="font-orbitron text-white text-lg flex items-center gap-2">
              <Icon name="ListChecks" size={20} className="text-orange-400" />
              Как подключить бота к Bybit
            </CardTitle>
            <p className="text-zinc-500 font-space-mono text-xs mt-1">
              Пошаговая инструкция — от регистрации до первой сделки. ~15 мин с нуля.
            </p>
          </div>
          <Badge className="bg-orange-500/20 border-orange-500/40 text-orange-300">
            {doneCount}/{steps.length} шагов
          </Badge>
        </div>
        {/* Прогресс-бар */}
        <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden mt-3">
          <div
            className="h-full bg-gradient-to-r from-orange-500 to-amber-400 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {steps.map((step, idx) => {
          const isDone = done.has(step.id)
          const isOpen = openId === step.id
          return (
            <div
              key={step.id}
              className={`rounded-lg border transition-all ${
                isDone
                  ? "bg-emerald-500/5 border-emerald-500/30"
                  : isOpen
                  ? "bg-zinc-800/60 border-orange-500/40"
                  : "bg-zinc-800/30 border-zinc-700"
              }`}
            >
              <button
                onClick={() => toggle(step.id)}
                className="w-full flex items-center gap-3 p-3 text-left hover:bg-zinc-800/40 transition-colors rounded-lg"
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 font-orbitron font-bold text-sm ${
                    isDone
                      ? "bg-emerald-500 text-black"
                      : isOpen
                      ? "bg-orange-500 text-black"
                      : "bg-zinc-700 text-zinc-300"
                  }`}
                >
                  {isDone ? <Icon name="Check" size={16} /> : idx + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`font-orbitron text-sm font-bold ${isDone ? "text-emerald-300 line-through" : "text-white"}`}>
                    {step.title}
                  </p>
                  <p className="text-zinc-500 font-space-mono text-[10px]">{step.duration}</p>
                </div>
                <Icon
                  name={isOpen ? "ChevronUp" : "ChevronDown"}
                  size={16}
                  className="text-zinc-500 flex-shrink-0"
                />
              </button>
              {isOpen && (
                <div className="px-3 pb-3 pt-1 border-t border-zinc-800/60">
                  <div className="pl-11">{step.content}</div>
                  <div className="pl-11 mt-3">
                    <button
                      onClick={() => markDone(step.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-orbitron font-bold transition-all ${
                        isDone
                          ? "bg-emerald-500/20 border border-emerald-500/40 text-emerald-300"
                          : "bg-orange-500 hover:bg-orange-400 text-black"
                      }`}
                    >
                      {isDone ? "✓ Шаг выполнен" : "Отметить как выполненное"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )
        })}

        {doneCount === steps.length && (
          <div className="mt-4 bg-gradient-to-r from-emerald-500/20 to-orange-500/20 border border-emerald-500/40 rounded-lg p-4 text-center">
            <Icon name="Trophy" size={32} className="text-emerald-400 mx-auto mb-2" />
            <p className="font-orbitron text-emerald-300 font-bold text-base">Все шаги пройдены!</p>
            <p className="text-emerald-400/80 font-space-mono text-xs mt-1">
              Теперь настрой стратегию ниже и нажми «Сгенерировать код бота» 🚀
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
