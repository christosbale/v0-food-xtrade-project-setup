/**
 * Utility functions for handling fresh produce seasonality
 */

export interface SeasonalProduct {
  harvest_start_month?: number | null
  harvest_end_month?: number | null
  category?: string
}

const MONTH_NAMES = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
]

/**
 * Check if a product is currently in season
 * @param product - Product with harvest_start_month and harvest_end_month
 * @param currentMonth - Current month (1-12), defaults to current date
 * @returns true if product is in season
 */
export function isInSeason(product: SeasonalProduct, currentMonth?: number): boolean {
  const { harvest_start_month, harvest_end_month } = product
  
  // If no seasonality data, return false
  if (!harvest_start_month || !harvest_end_month) {
    return false
  }

  const month = currentMonth ?? new Date().getMonth() + 1 // getMonth() returns 0-11

  // Handle same-year harvest season (e.g., Apr-Sep)
  if (harvest_start_month <= harvest_end_month) {
    return month >= harvest_start_month && month <= harvest_end_month
  }
  
  // Handle cross-year harvest season (e.g., Oct-Feb wraps around year end)
  return month >= harvest_start_month || month <= harvest_end_month
}

/**
 * Get a formatted season range string
 * @param startMonth - Start month (1-12)
 * @param endMonth - End month (1-12)
 * @returns Formatted string like "Oct – Feb" or "Apr – Sep"
 */
export function getSeasonRangeLabel(startMonth?: number | null, endMonth?: number | null): string {
  if (!startMonth || !endMonth) {
    return ''
  }
  
  const start = MONTH_NAMES[startMonth - 1]
  const end = MONTH_NAMES[endMonth - 1]
  
  return `${start} – ${end}`
}

/**
 * Get month name from month number
 * @param month - Month number (1-12)
 * @returns Month name (e.g., "Jan", "Feb")
 */
export function getMonthName(month: number): string {
  return MONTH_NAMES[month - 1] || ''
}

/**
 * Get all month options for select dropdowns
 * @returns Array of {value: number, label: string}
 */
export function getMonthOptions() {
  return MONTH_NAMES.map((name, index) => ({
    value: index + 1,
    label: name
  }))
}
