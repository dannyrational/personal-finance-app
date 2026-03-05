import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { Pot } from '../types'
import * as api from '../api/financeMutations'

export function useCreatePot() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: api.createPot,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['financeData'] })
    },
  })
}

export function useUpdatePot() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ name, updates }: { name: string; updates: Partial<Pot> }) => api.updatePot(name, updates),
    onMutate: async ({ name, updates }) => {
      await queryClient.cancelQueries({ queryKey: ['financeData'] })
      const previousData = queryClient.getQueryData(['financeData'])

      queryClient.setQueryData(['financeData'], (old: any) => {
        if (!old) return old
        return {
          ...old,
          pots: old.pots.map((pot: Pot) => (pot.name === name ? { ...pot, ...updates } : pot)),
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

export function useDeletePot() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: api.deletePot,
    onMutate: async (name) => {
      await queryClient.cancelQueries({ queryKey: ['financeData'] })
      const previousData = queryClient.getQueryData(['financeData'])

      queryClient.setQueryData(['financeData'], (old: any) => {
        if (!old) return old
        const deletedPot = old.pots.find((pot: Pot) => pot.name === name)
        return {
          ...old,
          pots: old.pots.filter((pot: Pot) => pot.name !== name),
          // Optimistically update balance (returned to current balance)
          balance: deletedPot ? { ...old.balance, current: old.balance.current + deletedPot.total } : old.balance,
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

export function useAddMoneyToPot() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ name, amount }: { name: string; amount: number }) => api.addMoneyToPot(name, amount),
    onMutate: async ({ name, amount }) => {
      await queryClient.cancelQueries({ queryKey: ['financeData'] })
      const previousData = queryClient.getQueryData(['financeData'])

      queryClient.setQueryData(['financeData'], (old: any) => {
        if (!old) return old
        return {
          ...old,
          pots: old.pots.map((pot: Pot) => (pot.name === name ? { ...pot, total: pot.total + amount } : pot)),
          balance: { ...old.balance, current: old.balance.current - amount },
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

export function useWithdrawMoneyFromPot() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ name, amount }: { name: string; amount: number }) => api.withdrawMoneyFromPot(name, amount),
    onMutate: async ({ name, amount }) => {
      await queryClient.cancelQueries({ queryKey: ['financeData'] })
      const previousData = queryClient.getQueryData(['financeData'])

      queryClient.setQueryData(['financeData'], (old: any) => {
        if (!old) return old
        return {
          ...old,
          pots: old.pots.map((pot: Pot) => (pot.name === name ? { ...pot, total: pot.total - amount } : pot)),
          balance: { ...old.balance, current: old.balance.current + amount },
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
