// Transaction categories used across the app
export type TransactionCategory =
  | 'Entertainment'
  | 'Bills'
  | 'Groceries'
  | 'Dining Out'
  | 'Transportation'
  | 'Personal Care'
  | 'Education'
  | 'Lifestyle'
  | 'Shopping'
  | 'General'

export type SortOption = 'latest' | 'oldest' | 'a-to-z' | 'z-to-a' | 'highest' | 'lowest'

// Main data structures
export interface Balance {
  current: number
  income: number
  expenses: number
}

export interface Transaction {
  avatar: string
  name: string
  category: TransactionCategory
  date: string // ISO 8601 format
  amount: number // positive = income, negative = expense
  recurring: boolean
}

export interface Budget {
  category: TransactionCategory
  maximum: number
  theme: string // hex color
}

export interface Pot {
  name: string
  target: number
  total: number
  theme: string // hex color
}

// API Response type (structure of data.json)
export interface FinanceData {
  balance: Balance
  transactions: Transaction[]
  budgets: Budget[]
  pots: Pot[]
}

// Derived types for UI state
export interface BudgetWithSpending extends Budget {
  spent: number
  remaining: number
  latestTransactions: Transaction[]
}

export interface RecurringBill {
  name: string
  avatar: string
  amount: number
  date: string
  isPaid: boolean
  isDueSoon: boolean
}
