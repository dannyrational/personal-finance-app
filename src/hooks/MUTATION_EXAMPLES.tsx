/**
 * MUTATION HOOKS - Usage Examples
 * 
 * These hooks are ready to use but won't work until you build the backend API.
 * When you create your Node/Express backend, implement the endpoints in:
 * src/api/financeMutations.ts
 * 
 * The hooks below handle:
 * - Optimistic updates (immediate UI feedback)
 * - Automatic cache invalidation
 * - Error rollback
 * - Loading states
 */

// ============================================================================
// BUDGETS - Create, Update, Delete
// ============================================================================

import { useCreateBudget, useUpdateBudget, useDeleteBudget } from './useBudgetMutations'

function BudgetExample() {
  const createBudget = useCreateBudget()
  const updateBudget = useUpdateBudget()
  const deleteBudget = useDeleteBudget()

  const handleCreate = () => {
    createBudget.mutate(
      {
        category: 'Entertainment',
        maximum: 50,
        theme: '#277C78',
      },
      {
        onSuccess: () => console.log('Budget created!'),
        onError: (error) => console.error('Failed:', error),
      }
    )
  }

  const handleUpdate = () => {
    updateBudget.mutate({
      category: 'Entertainment',
      updates: { maximum: 75 },
    })
  }

  const handleDelete = () => {
    deleteBudget.mutate('Entertainment')
  }

  return (
    <div>
      <button onClick={handleCreate} disabled={createBudget.isPending}>
        {createBudget.isPending ? 'Creating...' : 'Create Budget'}
      </button>
      {createBudget.isError && <p>Error: {createBudget.error.message}</p>}
    </div>
  )
}

// ============================================================================
// POTS - Create, Update, Delete, Add Money, Withdraw Money
// ============================================================================

import {
  useCreatePot,
  useUpdatePot,
  useDeletePot,
  useAddMoneyToPot,
  useWithdrawMoneyFromPot,
} from './usePotMutations'

function PotExample() {
  const createPot = useCreatePot()
  const addMoney = useAddMoneyToPot()
  const withdrawMoney = useWithdrawMoneyFromPot()
  const deletePot = useDeletePot()

  const handleCreatePot = () => {
    createPot.mutate({
      name: 'Vacation',
      target: 2000,
      theme: '#277C78',
    })
  }

  const handleAddMoney = () => {
    addMoney.mutate({
      name: 'Vacation',
      amount: 100,
    })
  }

  const handleWithdraw = () => {
    withdrawMoney.mutate({
      name: 'Vacation',
      amount: 50,
    })
  }

  const handleDelete = () => {
    // Deleting a pot returns money to current balance
    deletePot.mutate('Vacation')
  }

  return (
    <div>
      <button onClick={handleAddMoney} disabled={addMoney.isPending}>
        Add $100
      </button>
    </div>
  )
}

// ============================================================================
// BACKEND API CONTRACT (for Node/Express)
// ============================================================================

/**
 * When you build your Express backend, implement these endpoints:
 * 
 * BUDGETS
 * POST   /api/budgets              - Create budget
 * PUT    /api/budgets/:category    - Update budget
 * DELETE /api/budgets/:category    - Delete budget
 * 
 * POTS
 * POST   /api/pots                 - Create pot
 * PUT    /api/pots/:name           - Update pot
 * DELETE /api/pots/:name           - Delete pot (returns total to balance)
 * POST   /api/pots/:name/add       - Add money to pot
 * POST   /api/pots/:name/withdraw  - Withdraw money from pot
 * 
 * TRANSACTIONS
 * POST   /api/transactions         - Create transaction
 * DELETE /api/transactions/:id     - Delete transaction
 * 
 * All responses should return the updated resource or confirmation.
 * Pot add/withdraw should return: { pot: Pot, newBalance: number }
 */

export {}
