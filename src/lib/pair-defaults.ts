/**
 * Дефолтные «якорные» цены и маппинг API-символов на ключи пресетов
 * во всех местах (PairDeepDive, TrendPairScanner, PocketOptionBotForm).
 *
 * Используется кнопкой "Обновить уровни сейчас" в src/pages/Timing.tsx:
 *  - если live-API вернул цену для символа → используем её
 *  - иначе берём дефолт отсюда (актуальный на май 2026)
 */

export interface PairDefault {
  /** ключи пресетов, которым присвоить эти уровни (в т.ч. (OTC)-варианты) */
  keys: string[]
  /** опорная цена */
  price: number
  /** API-символ Yahoo/Binance (если есть) */
  apiSymbol?: string
}

export const PAIR_DEFAULTS: PairDefault[] = [
  // Forex мажоры
  { keys: ["EUR/USD", "EUR/USD (OTC)", "EUR/USD OTC"], price: 1.0865, apiSymbol: "EURUSD" },
  { keys: ["GBP/USD", "GBP/USD (OTC)", "GBP/USD OTC"], price: 1.288, apiSymbol: "GBPUSD" },
  { keys: ["USD/JPY", "USD/JPY (OTC)", "USD/JPY OTC"], price: 154.0, apiSymbol: "USDJPY" },
  { keys: ["USD/CHF", "USD/CHF (OTC)"], price: 0.885, apiSymbol: "USDCHF" },
  { keys: ["USD/CAD", "USD/CAD (OTC)"], price: 1.37, apiSymbol: "USDCAD" },
  { keys: ["AUD/USD", "AUD/USD (OTC)"], price: 0.665, apiSymbol: "AUDUSD" },
  { keys: ["NZD/USD", "NZD/USD (OTC)"], price: 0.605, apiSymbol: "NZDUSD" },
  // Forex кросс
  { keys: ["EUR/GBP (OTC)"], price: 0.85, apiSymbol: "EURGBP" },
  { keys: ["EUR/JPY (OTC)", "EUR/JPY OTC"], price: 167.0, apiSymbol: "EURJPY" },
  { keys: ["EUR/CHF (OTC)"], price: 0.955 },
  { keys: ["GBP/JPY (OTC)"], price: 194.0 },
  { keys: ["GBP/CHF (OTC)"], price: 1.15 },
  { keys: ["AUD/JPY (OTC)"], price: 100.0 },
  { keys: ["AUD/CAD (OTC)", "AUD/CAD OTC"], price: 0.9215, apiSymbol: "AUDCAD" },
  { keys: ["CAD/JPY (OTC)"], price: 112.0 },
  { keys: ["CHF/JPY (OTC)"], price: 172.0 },
  { keys: ["NZD/JPY (OTC)"], price: 93.0 },
  // Крипто
  { keys: ["BTC/USD", "BTC/USD (OTC)"], price: 94850, apiSymbol: "BTCUSDT" },
  { keys: ["ETH/USD", "ETH/USD (OTC)"], price: 3700, apiSymbol: "ETHUSDT" },
  { keys: ["LTC/USD (OTC)"], price: 120 },
  { keys: ["DOT/USD (OTC)"], price: 9 },
  { keys: ["LINK/USD (OTC)"], price: 20 },
  { keys: ["DASH/USD"], price: 35 },
  // Товары
  { keys: ["Gold", "Gold (OTC)", "XAU/USD (Gold)"], price: 3150 },
  { keys: ["Silver", "Silver (OTC)"], price: 34 },
  { keys: ["Brent Oil", "Brent Oil (OTC)"], price: 80 },
  { keys: ["WTI Oil", "WTI Oil (OTC)"], price: 76 },
  { keys: ["Natural Gas", "Natural Gas (OTC)"], price: 3.5 },
  { keys: ["Platinum (OTC)"], price: 1050 },
  { keys: ["Palladium (OTC)"], price: 1100 },
  // Индексы
  { keys: ["S&P 500", "S&P 500 (OTC)"], price: 5800 },
  { keys: ["NASDAQ", "NASDAQ (OTC)"], price: 21000 },
  { keys: ["Dow Jones", "Dow Jones (OTC)"], price: 43500 },
  { keys: ["Nikkei 225", "Nikkei 225 (OTC)"], price: 40000 },
  { keys: ["DAX", "DAX (OTC)"], price: 20500 },
  { keys: ["FTSE 100", "FTSE 100 (OTC)"], price: 8300 },
  { keys: ["CAC 40", "CAC 40 (OTC)"], price: 7800 },
  { keys: ["AUS 200 (OTC)"], price: 8100 },
  { keys: ["EURO STOXX 50 (OTC)"], price: 5200 },
]

/** Получить дефолт по любому ключу пары. */
export function findDefaultByKey(key: string): PairDefault | undefined {
  return PAIR_DEFAULTS.find((p) => p.keys.includes(key))
}
