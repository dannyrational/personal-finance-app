import type { FinanceData, Transaction } from '../types'

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL

function getFinanceEndpoint(): string {
  if (apiBaseUrl) {
    return `${apiBaseUrl.replace(/\/$/, '')}/finance`
  }

  return '/data.json'
}

export async function fetchFinanceData(): Promise<FinanceData> {
  const response = await fetch(getFinanceEndpoint())

  if (!response.ok) {
    throw new Error('Failed to load finance data')
  }

  const data: FinanceData = await response.json()

  // Merge with user-created transactions from localStorage
  const stored = localStorage.getItem('userTransactions')
  const userTransactions: Transaction[] = stored ? JSON.parse(stored) : []

  return {
    ...data,
    transactions: [...userTransactions, ...data.transactions],
  }
}
