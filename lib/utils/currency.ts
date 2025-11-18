// Currency conversion utilities for EUR (base) and USD
// EUR is the base currency for European market expansion

const EXCHANGE_RATES = {
  EUR_TO_USD: 1.10, // Approximate rate, should be updated from API in production
  USD_TO_EUR: 0.91,
}

export type Currency = 'EUR' | 'USD'

export const CURRENCY_SYMBOLS = {
  EUR: '€',
  USD: '$',
} as const

export const CURRENCY_LABELS = {
  EUR: 'EUR (€)',
  USD: 'USD ($)',
} as const

/**
 * Convert amount from one currency to another
 */
export function convertCurrency(
  amount: number,
  fromCurrency: Currency,
  toCurrency: Currency
): number {
  if (fromCurrency === toCurrency) return amount
  
  if (fromCurrency === 'EUR' && toCurrency === 'USD') {
    return amount * EXCHANGE_RATES.EUR_TO_USD
  }
  
  if (fromCurrency === 'USD' && toCurrency === 'EUR') {
    return amount * EXCHANGE_RATES.USD_TO_EUR
  }
  
  return amount
}

/**
 * Format price with currency symbol and proper formatting
 */
export function formatPrice(
  amount: number,
  currency: Currency = 'EUR',
  options: { showSymbol?: boolean; decimals?: number } = {}
): string {
  const { showSymbol = true, decimals = 2 } = options
  
  const formatted = amount.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })
  
  if (!showSymbol) return formatted
  
  const symbol = CURRENCY_SYMBOLS[currency]
  
  // EUR uses symbol after number with space in European format
  if (currency === 'EUR') {
    return `${formatted} ${symbol}`
  }
  
  // USD uses symbol before number
  return `${symbol}${formatted}`
}

/**
 * Get converted price with formatting
 */
export function getConvertedPrice(
  amount: number,
  fromCurrency: Currency,
  toCurrency: Currency
): string {
  const converted = convertCurrency(amount, fromCurrency, toCurrency)
  return formatPrice(converted, toCurrency)
}

/**
 * Display price in both currencies
 */
export function formatPriceWithConversion(
  amount: number,
  baseCurrency: Currency,
  showBoth: boolean = false
): string {
  const basePrice = formatPrice(amount, baseCurrency)
  
  if (!showBoth) return basePrice
  
  const otherCurrency: Currency = baseCurrency === 'EUR' ? 'USD' : 'EUR'
  const converted = convertCurrency(amount, baseCurrency, otherCurrency)
  const convertedPrice = formatPrice(converted, otherCurrency)
  
  return `${basePrice} (≈ ${convertedPrice})`
}
