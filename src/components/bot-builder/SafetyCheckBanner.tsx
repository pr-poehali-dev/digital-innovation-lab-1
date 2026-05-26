import { useMemo } from "react"
import Icon from "@/components/ui/icon"
import type { POBotConfig } from "./PocketOptionBotTypes"

interface Props {
  config: POBotConfig
}

interface Warning {
  level: "critical" | "warn" | "info"
  title: string
  text: string
}

/**
 * 🛡 Проверка безопасности конфига бота.
 *
 * Появилась после реальной сессии с минусом -1447 USD на двух ботах за час
 * (WR=17%, OR-комбо, ставка 5% баланса, каскад ×5, TP/SL 13× от баланса).
 *
 * Анализирует config и выводит красные/жёлтые баннеры о рисках ДО запуска.
 */
export function SafetyCheckBanner({ config }: Props) {
  const warnings = useMemo<Warning[]>(() => {
    const list: Warning[] = []

    // Предположение о типичном депозите: TP+SL примерно = депозит, либо берём SL × 5
    // (чтобы оценить % от депозита). Лучше бы знать реальный баланс, но его в конфиге нет.
    // Для оценки берём наибольшее из: SL × 5, TP × 2 — это даёт грубую "норму" депозита.
    const estimatedDeposit = Math.max(config.stopLossRub * 5, config.takeProfitRub * 2, 1000)

    // 1️⃣ Ставка от депозита
    const betPct = (config.betAmount / estimatedDeposit) * 100
    if (betPct >= 5) {
      list.push({
        level: "critical",
        title: "Ставка слишком большая",
        text: `${config.betAmount} ${config.currency || "USD"} ≈ ${betPct.toFixed(1)}% от депозита. Серия из 4 проигрышей = −${(config.betAmount * 4).toFixed(0)}. Рекомендуем ≤2%.`,
      })
    } else if (betPct >= 2) {
      list.push({
        level: "warn",
        title: "Ставка выше рекомендуемого",
        text: `${betPct.toFixed(1)}% от депозита. Безопасный диапазон — 1-2%.`,
      })
    }

    // 2️⃣ TP/SL соотношение
    const tpSlRatio = config.takeProfitRub / Math.max(config.stopLossRub, 1)
    if (tpSlRatio < 1.5) {
      list.push({
        level: "warn",
        title: "TP меньше 1.5×SL",
        text: `Take Profit ${config.takeProfitRub} / Stop Loss ${config.stopLossRub} = ×${tpSlRatio.toFixed(2)}. Норма ≥1.5× — иначе серия мелких профитов съедается одним стопом.`,
      })
    }

    // 3️⃣ Каскадный хедж + Мартингейл одновременно — суперопасно
    if (config.hedgeCascadeEnabled && config.martingaleEnabled) {
      const cascadeMult = 1 + config.hedgeCascadeM1 + config.hedgeCascadeM2 + config.hedgeCascadeM3
      const martingaleLast = Math.pow(config.martingaleMultiplier, config.martingaleSteps - 1)
      const worstCase = config.betAmount * cascadeMult * martingaleLast
      list.push({
        level: "critical",
        title: "Каскад + Мартингейл одновременно",
        text: `Худший случай: ставка ${config.betAmount} × каскад ${cascadeMult.toFixed(1)} × мартин-последний-шаг ${martingaleLast.toFixed(1)} = ${worstCase.toFixed(0)} ${config.currency || "USD"} на один сигнал. Это самоубийство — оставь что-то одно.`,
      })
    }

    // 4️⃣ Каскадный хедж умножитель × ставка относительно SL
    if (config.hedgeCascadeEnabled) {
      const cascadeMult = 1 + config.hedgeCascadeM1 + config.hedgeCascadeM2 + config.hedgeCascadeM3
      const maxCascadeAmount = config.betAmount * cascadeMult
      if (maxCascadeAmount > config.stopLossRub * 0.5) {
        list.push({
          level: "warn",
          title: "Каскад больше 50% от Stop Loss",
          text: `Макс сумма каскада ${maxCascadeAmount.toFixed(0)} ${config.currency || "USD"} (×${cascadeMult.toFixed(1)} ставки). При SL ${config.stopLossRub} один проигранный каскад почти выбьет дневной стоп.`,
        })
      }
    }

    // 5️⃣ Каскадный хедж + экспирация 1 мин — H2/H3 не успевают сработать
    if (config.hedgeCascadeEnabled && config.expiry === "1") {
      list.push({
        level: "warn",
        title: "Каскад на 1-минутной экспирации",
        text: "На 1 мин у каскада нет времени отрабатывать H2/H3 (порог отката 5 пип не успевает срабатывать). Рекомендуем экспирацию ≥2 мин.",
      })
    }

    // 6️⃣ OR-комбо с 3+ стратегиями — много ложных сигналов
    if (config.comboMode && config.comboLogic === "OR" && config.comboStrategies.length >= 3) {
      list.push({
        level: "warn",
        title: "OR-логика с 3+ стратегиями",
        text: `${config.comboStrategies.length} стратегии в OR-режиме = много "шумных" входов. На реальных сессиях даёт WR ~17-30%. Рекомендуем AND с 2 стратегиями.`,
      })
    }

    // 7️⃣ Высокий дневной лимит при отсутствии strong-trend фильтра
    if (config.dailyLimit > 50 && !config.requireStrongTrendOnStart) {
      list.push({
        level: "info",
        title: "Высокий дневной лимит без фильтра тренда",
        text: `${config.dailyLimit} сделок/день без "сильного тренда на старте" = риск overtrading. Включи фильтр или уменьши лимит до 20-30.`,
      })
    }

    // 8️⃣ Stop Loss выключен (=0)
    if (config.stopLossRub <= 0) {
      list.push({
        level: "critical",
        title: "Stop Loss выключен",
        text: "Без дневного стоп-лосса бот может слить весь депозит за одну плохую сессию. Установи SL = 5-10% от депозита.",
      })
    }

    // 9️⃣ Reverse + комбо OR — самая опасная комбинация
    if (config.trendFollow === "reverse" && config.comboMode && config.comboLogic === "OR") {
      list.push({
        level: "warn",
        title: "Против тренда + OR-логика",
        text: "Reverse-режим инвертирует сигналы, OR даёт частые входы. На трендовом рынке = постоянные убытки.",
      })
    }

    return list
  }, [config])

  if (warnings.length === 0) {
    return (
      <div className="rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-3 flex items-center gap-3">
        <Icon name="ShieldCheck" size={18} className="text-green-400 flex-shrink-0" />
        <div>
          <p className="text-green-300 font-orbitron text-sm font-bold">Проверка безопасности пройдена</p>
          <p className="text-green-400/70 font-space-mono text-xs">Конфиг выглядит безопасно. Удачной торговли!</p>
        </div>
      </div>
    )
  }

  const critical = warnings.filter((w) => w.level === "critical")
  const warns = warnings.filter((w) => w.level === "warn")
  const infos = warnings.filter((w) => w.level === "info")

  const styles: Record<Warning["level"], { box: string; title: string; text: string; icon: string; iconColor: string }> = {
    critical: {
      box: "border-red-500/50 bg-red-500/10",
      title: "text-red-300",
      text: "text-red-400/80",
      icon: "AlertOctagon",
      iconColor: "text-red-400",
    },
    warn: {
      box: "border-yellow-500/40 bg-yellow-500/10",
      title: "text-yellow-300",
      text: "text-yellow-400/80",
      icon: "AlertTriangle",
      iconColor: "text-yellow-400",
    },
    info: {
      box: "border-blue-500/40 bg-blue-500/10",
      title: "text-blue-300",
      text: "text-blue-400/80",
      icon: "Info",
      iconColor: "text-blue-400",
    },
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 px-1">
        <Icon name="ShieldAlert" size={16} className="text-orange-400" />
        <p className="font-orbitron text-sm text-orange-300 font-bold">
          Проверка безопасности — {warnings.length} {warnings.length === 1 ? "замечание" : warnings.length < 5 ? "замечания" : "замечаний"}
        </p>
      </div>
      {[...critical, ...warns, ...infos].map((w, i) => {
        const s = styles[w.level]
        return (
          <div key={i} className={`rounded-xl border ${s.box} px-3 py-2.5 flex items-start gap-2.5`}>
            <Icon name={s.icon} size={16} className={`${s.iconColor} flex-shrink-0 mt-0.5`} />
            <div className="flex-1 min-w-0">
              <p className={`${s.title} font-orbitron text-xs font-bold mb-0.5`}>{w.title}</p>
              <p className={`${s.text} font-space-mono text-[11px] leading-snug`}>{w.text}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default SafetyCheckBanner
