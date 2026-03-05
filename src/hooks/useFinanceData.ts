import type { Budget, BudgetWithSpending, FinanceData, Transaction, TransactionCategory } from '../types'
import { useBudgets } from './useBudgets'
import { useFinanceQuery } from './useFinanceQuery'
import { useTransactions } from './useTransactions'

export interface FinanceDataState {
  data: FinanceData | null
  loading: boolean
  error: string | null
  getTransactionsByCategory: (category: TransactionCategory) => Transaction[]
  getBudgetWithSpending: (budget: Budget) => BudgetWithSpending
  getRecurringTransactions: () => Transaction[]
}

export function useFinanceData(): FinanceDataState {
  const { data, isLoading, error } = useFinanceQuery()
  const { getTransactionsByCategory, getRecurringTransactions } = useTransactions()
  const { getBudgetWithSpending } = useBudgets()

  return {
    data: data ?? null,
    loading: isLoading,
    error: error instanceof Error ? error.message : null,
    getTransactionsByCategory,
    getBudgetWithSpending,
    getRecurringTransactions,
  }
}
