import { useQuery } from '@tanstack/react-query'
import { fetchFinanceData } from '../api/financeApi'

export function useFinanceQuery() {
  return useQuery({
    queryKey: ['financeData'],
    queryFn: fetchFinanceData,
  })
}
