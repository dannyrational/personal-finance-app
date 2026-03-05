import type { Transaction } from '../types'

/**
 * Reference date: August 19, 2024 (latest transaction in the app)
 * This is the "current date" for all calculations
 */
export const APP_REFERENCE_DATE = new Date('2024-08-19T14:23:11Z')

/**
 * Format a number as currency (USD)
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(amount)
}

/**
 * Format a date string to readable format
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date)
}

/**
 * Check if a transaction is in August 2024
 */
export function isAugust2024(dateString: string): boolean {
  const date = new Date(dateString)
  return date.getFullYear() === 2024 && date.getMonth() === 7
}

/**
 * Check if a date is within N days of the reference date
 */
export function isWithinDays(dateString: string, days: number, referenceDate: Date = APP_REFERENCE_DATE): boolean {
  const date = new Date(dateString)
  const diffTime = date.getTime() - referenceDate.getTime()
  const diffDays = diffTime / (1000 * 60 * 60 * 24)
  return diffDays >= 0 && diffDays <= days
}

/**
 * Sort transactions by date (newest first)
 */
export function sortTransactionsByDate(transactions: Transaction[], order: 'desc' | 'asc' = 'desc'): Transaction[] {
  return [...transactions].sort((a, b) => {
    const dateA = new Date(a.date).getTime()
    const dateB = new Date(b.date).getTime()
    return order === 'desc' ? dateB - dateA : dateA - dateB
  })
}

/**
 * Calculate the total of transaction amounts
 */
export function calculateTransactionTotal(transactions: Transaction[]): number {
  return transactions.reduce((sum, t) => sum + t.amount, 0)
}
