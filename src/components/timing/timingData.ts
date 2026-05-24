export const sessions = [
  {
    name: "Азиатская сессия",
    time: "03:00 – 11:00 МСК",
    icon: "Sunrise",
    color: "border-yellow-500/30",
    accent: "text-yellow-400",
    pairs: ["USD/JPY", "AUD/USD", "EUR/USD OTC"],
    desc: "Низкая волатильность по EUR/USD, но OTC-версия пары на Pocket Option торгуется активно. Цена ходит в узких диапазонах — идеально для скальпа.",
    tips: "BTC/USD в этот период двигается за новостями из Азии (Япония, Китай).",
  },
  {
    name: "Европейская сессия",
    time: "10:00 – 19:00 МСК",
    icon: "Building2",
    color: "border-blue-500/30",
    accent: "text-blue-400",
    pairs: ["EUR/USD", "GBP/USD", "EUR/GBP"],
    desc: "Главный «золотой час» для EUR/USD. Высокая ликвидность, чистые тренды, отработка технических уровней. На открытии Лондона (10:00 МСК) часто формируется направление дня.",
    tips: "BTC/USD в это время реагирует на европейские новости и движения фондовых рынков.",
  },
  {
    name: "Американская сессия",
    time: "15:30 – 24:00 МСК",
    icon: "Sun",
    color: "border-red-500/30",
    accent: "text-red-400",
    pairs: ["EUR/USD", "BTC/USD", "USD/CAD"],
    desc: "Перекрытие с европейской сессией (15:30–19:00) — пик волатильности. Все важные новости по USD выходят в 15:30 и 17:00 МСК. BTC/USD оживает на американских объёмах.",
    tips: "EUR/USD OTC на выходных копирует поведение пары пятницы.",
  },
  {
    name: "Тихая ночь (OTC-режим)",
    time: "00:00 – 03:00 МСК",
    icon: "Moon",
    color: "border-purple-500/30",
    accent: "text-purple-400",
    pairs: ["EUR/USD OTC", "BTC/USD"],
    desc: "Forex закрыт — только OTC-инструменты и крипта. EUR/USD OTC движется по алгоритму брокера: предсказуемые откаты, чёткие уровни.",
    tips: "BTC/USD ночью часто пампят азиатские маркетмейкеры — следи за объёмами.",
  },
]

export const eurUsdSchedule = [
  { time: "00:00 – 03:00", vol: "OTC", color: "bg-purple-500", note: "EUR/USD OTC — гладкие движения, хорошо для скальпа 1м" },
  { time: "03:00 – 08:00", vol: "Низкая", color: "bg-gray-500", note: "Азия. Боковик, ловить отбои от границ канала" },
  { time: "08:00 – 10:00", vol: "Средняя", color: "bg-yellow-500", note: "Подготовка к Лондону, формирование тренда" },
  { time: "10:00 – 12:00", vol: "ВЫСОКАЯ", color: "bg-green-500", note: "🔥 Открытие Лондона — лучшее время для тренда" },
  { time: "12:00 – 15:30", vol: "Средняя", color: "bg-yellow-500", note: "Затишье перед США. Торгуй уровни" },
  { time: "15:30 – 18:00", vol: "ЭКСТРА", color: "bg-red-500", note: "🔥🔥 Открытие США + новости. Самая жара" },
  { time: "18:00 – 21:00", vol: "Высокая", color: "bg-green-500", note: "Тренд дня продолжается" },
  { time: "21:00 – 24:00", vol: "Падающая", color: "bg-yellow-500", note: "Закрытие США, фиксация прибыли" },
]

export const btcUsdSchedule = [
  { time: "00:00 – 06:00", vol: "Средняя", color: "bg-yellow-500", note: "Азиатские объёмы, иногда резкие движения" },
  { time: "06:00 – 12:00", vol: "Низкая", color: "bg-gray-500", note: "Затишье, флэт, скучно" },
  { time: "12:00 – 15:30", vol: "Средняя", color: "bg-yellow-500", note: "Просыпается Европа, тренд возможен" },
  { time: "15:30 – 19:00", vol: "ВЫСОКАЯ", color: "bg-green-500", note: "🔥 Открытие США — фонда тянет крипту" },
  { time: "19:00 – 22:00", vol: "ЭКСТРА", color: "bg-red-500", note: "🔥🔥 Пик ликвидности и волы" },
  { time: "22:00 – 02:00", vol: "Высокая", color: "bg-green-500", note: "Закрытие фонды + ночные памп/дамп" },
]

export const correlations = [
  { pair1: "EUR/USD", pair2: "GBP/USD", value: "+0.87", type: "Прямая", desc: "Двигаются почти синхронно (май 2026). Сигнал на EUR/USD = подтверждение для GBP/USD." },
  { pair1: "EUR/USD", pair2: "USD/CHF", value: "−0.94", type: "Обратная", desc: "Зеркало. Если EUR/USD растёт — USD/CHF падает. Используй для подтверждения." },
  { pair1: "BTC/USD", pair2: "ETH/USD", value: "+0.91", type: "Прямая", desc: "Эфир ходит за битком. Можно ловить тот же тренд на ETH с большей волой." },
  { pair1: "BTC/USD", pair2: "NASDAQ (US100)", value: "+0.72", type: "Прямая", desc: "Связь усилилась с приходом ETF. Растёт NASDAQ — растёт BTC, особенно в часы открытия США." },
  { pair1: "XAU/USD", pair2: "DXY (доллар)", value: "−0.82", type: "Обратная", desc: "Золото зеркалит доллар. Слабый DXY — растущее золото. Подтверждение трендов." },
  { pair1: "EUR/USD OTC", pair2: "EUR/USD (Forex)", value: "+0.72", type: "Прямая (с задержкой)", desc: "OTC копирует Forex с лагом ~30-40 сек. На выходных идёт по алгоритму брокера." },
]

export const dayStrategies = [
  {
    time: "Утро (08:00 – 11:00)",
    icon: "Coffee",
    color: "border-orange-500/30",
    accent: "text-orange-400",
    strategy: "Скальп от уровней",
    pair: "EUR/USD",
    desc: "Цена накапливается перед Лондоном. Ловим отбои от ключевых уровней дня. Экспирация 1–3 минуты.",
    indicators: ["Уровни поддержки/сопротивления", "RSI < 30 или > 70", "Пин-бары на M5"],
  },
  {
    time: "День (11:00 – 15:00)",
    icon: "Zap",
    color: "border-green-500/30",
    accent: "text-green-400",
    strategy: "Тренд-следование",
    pair: "EUR/USD, GBP/USD",
    desc: "Лондон задал направление — едем по тренду. Входы на откатах к EMA-21. Экспирация 5–15 минут.",
    indicators: ["EMA-9, EMA-21", "MACD выше нуля", "Объёмы растут"],
  },
  {
    time: "Вечер (15:30 – 21:00)",
    icon: "Flame",
    color: "border-red-500/30",
    accent: "text-red-400",
    strategy: "Новостной импульс",
    pair: "EUR/USD, BTC/USD",
    desc: "Открытие США + новости. Большие свечи, чёткие пробои. Опасно для скальпа — лучше тренд 5м+.",
    indicators: ["Календарь новостей", "Пробой консолидации", "Bollinger Bands растягиваются"],
  },
  {
    time: "Ночь (22:00 – 03:00)",
    icon: "Moon",
    color: "border-purple-500/30",
    accent: "text-purple-400",
    strategy: "OTC + крипта",
    pair: "EUR/USD OTC, BTC/USD",
    desc: "Forex закрыт. EUR/USD OTC ходит по алгоритму — ловим отбои от границ канала. BTC живёт своей жизнью.",
    indicators: ["Bollinger Bands", "Stochastic", "Уровни круглых чисел"],
  },
]

export const AUTO_REFRESH_MS = 5 * 60 * 1000 // 5 минут

export type DebugStep = {
  ts: number
  level: "info" | "ok" | "warn" | "err"
  msg: string
}
