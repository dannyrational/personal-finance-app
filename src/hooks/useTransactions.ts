import type { Transaction, TransactionCategory } from '../types'
import { useFinanceQuery } from './useFinanceQuery'

export function useTransactions() {
  const { data } = useFinanceQuery()
  const transactions = data?.transactions ?? []

  const getTransactionsByCategory = (category: TransactionCategory): Transaction[] => {
    return transactions.filter((transaction) => transaction.category === category)
  }

  const getRecurringTransactions = (): Transaction[] => {
    return transactions.filter((transaction) => transaction.recurring)
  }

  return {
    transactions,
    getTransactionsByCategory,
    getRecurringTransactions,
  }
}
