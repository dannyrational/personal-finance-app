import type { Budget, Pot, Transaction, TransactionCategory } from '../types'

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || ''

// Budget mutations
export async function createBudget(budget: Omit<Budget, 'category'> & { category: TransactionCategory }): Promise<Budget> {
  const response = await fetch(`${apiBaseUrl}/api/budgets`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(budget),
  })
  if (!response.ok) throw new Error('Failed to create budget')
  return response.json()
}

export async function updateBudget(category: TransactionCategory, updates: Partial<Budget>): Promise<Budget> {
  const response = await fetch(`${apiBaseUrl}/api/budgets/${category}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  })
  if (!response.ok) throw new Error('Failed to update budget')
  return response.json()
}

export async function deleteBudget(category: TransactionCategory): Promise<void> {
  const response = await fetch(`${apiBaseUrl}/api/budgets/${category}`, {
    method: 'DELETE',
  })
  if (!response.ok) throw new Error('Failed to delete budget')
}

// Pot mutations
export async function createPot(pot: Omit<Pot, 'total'>): Promise<Pot> {
  const response = await fetch(`${apiBaseUrl}/api/pots`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...pot, total: 0 }),
  })
  if (!response.ok) throw new Error('Failed to create pot')
  return response.json()
}

export async function updatePot(name: string, updates: Partial<Pot>): Promise<Pot> {
  const response = await fetch(`${apiBaseUrl}/api/pots/${encodeURIComponent(name)}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  })
  if (!response.ok) throw new Error('Failed to update pot')
  return response.json()
}

export async function deletePot(name: string): Promise<{ returnedAmount: number }> {
  const response = await fetch(`${apiBaseUrl}/api/pots/${encodeURIComponent(name)}`, {
    method: 'DELETE',
  })
  if (!response.ok) throw new Error('Failed to delete pot')
  return response.json()
}

export async function addMoneyToPot(name: string, amount: number): Promise<{ pot: Pot; newBalance: number }> {
  const response = await fetch(`${apiBaseUrl}/api/pots/${encodeURIComponent(name)}/add`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount }),
  })
  if (!response.ok) throw new Error('Failed to add money to pot')
  return response.json()
}

export async function withdrawMoneyFromPot(name: string, amount: number): Promise<{ pot: Pot; newBalance: number }> {
  const response = await fetch(`${apiBaseUrl}/api/pots/${encodeURIComponent(name)}/withdraw`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount }),
  })
  if (!response.ok) throw new Error('Failed to withdraw money from pot')
  return response.json()
}

// Transaction mutations (localStorage-based until backend is ready)
export async function createTransaction(transaction: Omit<Transaction, 'id' | 'date'>): Promise<Transaction> {
  if (apiBaseUrl) {
    const response = await fetch(`${apiBaseUrl}/api/transactions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(transaction),
    })
    if (!response.ok) throw new Error('Failed to create transaction')
    return response.json()
  }

  // localStorage fallback
  const newTransaction: Transaction = {
    ...transaction,
    id: crypto.randomUUID(),
    date: new Date().toISOString(),
  }

  const stored = localStorage.getItem('userTransactions')
  const userTransactions: Transaction[] = stored ? JSON.parse(stored) : []
  userTransactions.unshift(newTransaction)
  localStorage.setItem('userTransactions', JSON.stringify(userTransactions))

  return newTransaction
}

export async function deleteTransaction(transactionId: string): Promise<void> {
  if (apiBaseUrl) {
    const response = await fetch(`${apiBaseUrl}/api/transactions/${transactionId}`, {
      method: 'DELETE',
    })
    if (!response.ok) throw new Error('Failed to delete transaction')
    return
  }

  // localStorage fallback
  const stored = localStorage.getItem('userTransactions')
  const userTransactions: Transaction[] = stored ? JSON.parse(stored) : []
  const filtered = userTransactions.filter((t) => t.id !== transactionId)
  localStorage.setItem('userTransactions', JSON.stringify(filtered))
}
