import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { Budget, TransactionCategory } from '../types'
import * as api from '../api/financeMutations'

export function useCreateBudget() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: api.createBudget,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['financeData'] })
    },
  })
}

export function useUpdateBudget() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ category, updates }: { category: TransactionCategory; updates: Partial<Budget> }) =>
      api.updateBudget(category, updates),
    onMutate: async ({ category, updates }) => {
      await queryClient.cancelQueries({ queryKey: ['financeData'] })
      const previousData = queryClient.getQueryData(['financeData'])

      queryClient.setQueryData(['financeData'], (old: any) => {
        if (!old) return old
        return {
          ...old,
          budgets: old.budgets.map((budget: Budget) =>
            budget.category === category ? { ...budget, ...updates } : budget
          ),
        }
      })

      return { previousData }
    },
    onError: (_err, _variables, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(['financeData'], context.previousData)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['financeData'] })
    },
  })
}

export function useDeleteBudget() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: api.deleteBudget,
    onMutate: async (category) => {
      await queryClient.cancelQueries({ queryKey: ['financeData'] })
      const previousData = queryClient.getQueryData(['financeData'])

      queryClient.setQueryData(['financeData'], (old: any) => {
        if (!old) return old
        return {
          ...old,
          budgets: old.budgets.filter((budget: Budget) => budget.category !== category),
        }
      })

      return { previousData }
    },
    onError: (_err, _variables, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(['financeData'], context.previousData)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['financeData'] })
    },
  })
}
