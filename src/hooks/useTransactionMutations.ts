import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { Transaction } from '../types'
import * as api from '../api/financeMutations'

export function useCreateTransaction() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: api.createTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['financeData'] })
    },
  })
}

export function useDeleteTransaction() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: api.deleteTransaction,
    onMutate: async (transactionId) => {
      await queryClient.cancelQueries({ queryKey: ['financeData'] })
      const previousData = queryClient.getQueryData(['financeData'])

      queryClient.setQueryData(['financeData'], (old: any) => {
        if (!old) return old
        return {
          ...old,
          transactions: old.transactions.filter((transaction: Transaction) => transaction.id !== transactionId),
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
