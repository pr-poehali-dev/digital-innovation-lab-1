import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Icon from "@/components/ui/icon"

const steps = [
  {
    num: 1,
    title: "Войди в аккаунт Bybit",
    desc: "Зарегистрируйся если нет аккаунта. Пройди KYC уровень 1 (паспорт) — иначе будут лимиты на вывод.",
    detail: "Меню справа вверху → Профиль → API Management",
    icon: "LogIn",
    color: "border-blue-500/30",
    accent: "text-blue-400",
  },
  {
    num: 2,
    title: "Создай API-ключ",
    desc: "Нажми 'Create New Key'. Выбери тип System-generated (рекомендуется), назови ключ (например, 'TradeBase-Bot-1').",
    detail: "⚠️ ВАЖНО: ключ покажется ТОЛЬКО ОДИН РАЗ — сохрани в менеджер паролей",
    icon: "Key",
    color: "border-yellow-500/30",
    accent: "text-yellow-400",
    code: "Bybit → API → Create New Key → System-generated",
  },
  {
    num: 3,
    title: "Настрой права (Permissions)",
    desc: "Только нужные: ✅ Read-Write для Spot/Derivatives Trade. ❌ ВЫКЛЮЧИ 'Withdraw' (вывод средств)!",
    detail: "Это защитит депозит даже если ключ утечёт — украсть не смогут, только торговать",
    icon: "Shield",
    color: "border-green-500/30",
    accent: "text-green-400",
    code: "Permissions:\n✅ Contract → Orders & Positions\n✅ Spot → Trade\n❌ Wallet → Withdraw (НИКОГДА!)",
  },
  {
    num: 4,
    title: "IP-Whitelist (обязательно!)",
    desc: "Укажи IP своего VPS / сервера где будет крутиться бот. Без этого ключ может использовать кто угодно.",
    detail: "Если торгуешь с домашнего ПК с динамическим IP — используй VPS за $5/мес (DigitalOcean, Vultr)",
    icon: "Lock",
    color: "border-red-500/30",
    accent: "text-red-400",
    code: "IP Whitelist: 123.45.67.89 (твой VPS)",
  },
  {
    num: 5,
    title: "Скопируй API Key + Secret",
    desc: "Ключ (API Key) — можно показывать, как логин. Секрет (API Secret) — как пароль, никому не давай!",
    detail: "В TradeBase конструкторе: вкладка 'Bybit' → вставь оба поля → выбери пару и стратегию",
    icon: "Copy",
    color: "border-purple-500/30",
    accent: "text-purple-400",
    code: "API Key:    AAA1234567890abcd\nAPI Secret: ************************ (скрыт)",
  },
  {
    num: 6,
    title: "Тест на тестнете",
    desc: "У Bybit есть testnet.bybit.com — отдельная биржа с фейковыми деньгами. Прогони бота сутки там, проверь логи.",
    detail: "Если бот месяц на тесте показывает плюс — переноси на основной аккаунт с малой ставкой",
    icon: "FlaskConical",
    color: "border-cyan-500/30",
    accent: "text-cyan-400",
    code: "testnet.bybit.com → отдельный API ключ → BYBIT_TESTNET=True",
  },
]

export function BybitApiSetup() {
  return (
    <section id="api-setup" className="mb-20">
      <h2 className="font-orbitron text-3xl font-bold text-white mb-2 flex items-center gap-3">
        <Icon name="Key" className="text-yellow-400" /> Как получить API-ключ Bybit
      </h2>
      <p className="text-gray-400 mb-8">
        6 шагов от регистрации до запуска бота. Время — 15 минут.
      </p>

      <div className="space-y-4">
        {steps.map((s) => (
          <Card key={s.num} className={`bg-zinc-900/50 ${s.color} border-2`}>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-full bg-zinc-900 border-2 ${s.color} flex items-center justify-center flex-shrink-0`}>
                  <span className={`font-orbitron text-xl font-bold ${s.accent}`}>{s.num}</span>
                </div>
                <div className="flex-1">
                  <CardTitle className={`font-orbitron text-xl ${s.accent} flex items-center gap-2`}>
                    <Icon name={s.icon} size={20} />
                    {s.title}
                  </CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 mb-3">{s.desc}</p>
              <div className="text-sm text-gray-400 bg-black/40 border border-zinc-800 rounded p-3 mb-3">
                <Icon name="Lightbulb" size={14} className="inline mr-2 text-yellow-400" />
                {s.detail}
              </div>
              {s.code && (
                <pre className="text-xs font-mono bg-black/70 border border-zinc-800 rounded p-3 text-green-400 overflow-x-auto whitespace-pre-wrap">
                  {s.code}
                </pre>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mt-6 bg-gradient-to-br from-red-950/40 via-zinc-900/60 to-black border-red-500/30 border-2">
        <CardContent className="p-6 flex items-start gap-4">
          <Icon name="AlertTriangle" className="text-red-400 flex-shrink-0 mt-1" size={32} />
          <div>
            <h3 className="font-orbitron text-lg font-bold text-white mb-2">
              Чего НИКОГДА не делать с API-ключом
            </h3>
            <ul className="text-gray-300 text-sm space-y-1">
              <li>❌ Не давай право на вывод (Withdraw) — критично!</li>
              <li>❌ Не храни Secret в коде или GitHub-репозитории — используй .env / secrets</li>
              <li>❌ Не передавай ключ "технической поддержке" — они их не просят</li>
              <li>❌ Не используй один ключ для нескольких ботов — каждому свой</li>
              <li>✅ Если потерял / утёк — сразу удали в Bybit и создай новый</li>
            </ul>
            <p className="mt-3 text-xs text-gray-500">
              При краже ключа с правом Withdraw — биржа НЕ возвращает средства.
            </p>
          </div>
        </CardContent>
      </Card>
    </section>
  )
}

export default BybitApiSetup
