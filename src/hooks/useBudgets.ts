import type { Budget, BudgetWithSpending } from '../types'
import { isAugust2024 } from '../utils/dataHelpers'
import { useFinanceQuery } from './useFinanceQuery'

export function useBudgets() {
  const { data } = useFinanceQuery()
  const budgets = data?.budgets ?? []
  const transactions = data?.transactions ?? []

  const getBudgetWithSpending = (budget: Budget): BudgetWithSpending => {
    const categoryTransactions = transactions.filter((transaction) => transaction.category === budget.category)

    const augustExpenses = categoryTransactions.filter(
      (transaction) => isAugust2024(transaction.date) && transaction.amount < 0,
    )

    const spent = Math.abs(augustExpenses.reduce((sum, transaction) => sum + transaction.amount, 0))

    const latestTransactions = [...categoryTransactions]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 3)

    return {
      ...budget,
      spent,
      remaining: budget.maximum - spent,
      latestTransactions,
    }
  }

  return {
    budgets,
    getBudgetWithSpending,
  }
}
