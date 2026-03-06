import { useEffect, useMemo, useState } from 'react'
import TransactionItem from '../components/TransactionItem'
import { useFinanceData } from '../context/FinanceDataContext'
import { useCreateTransaction, useDeleteTransaction } from '../hooks/useTransactionMutations'
import type { SortOption, Transaction, TransactionCategory } from '../types'

const ITEMS_PER_PAGE = 10

type TransactionFilterCategory = TransactionCategory | 'All Transactions'

const sortOptions: Array<{ value: SortOption; label: string }> = [
  { value: 'latest', label: 'Latest' },
  { value: 'oldest', label: 'Oldest' },
  { value: 'a-to-z', label: 'A to Z' },
  { value: 'z-to-a', label: 'Z to A' },
  { value: 'highest', label: 'Highest' },
  { value: 'lowest', label: 'Lowest' },
]

function getSortedTransactions(transactions: Transaction[], sortBy: SortOption): Transaction[] {
  return [...transactions].sort((a, b) => {
    switch (sortBy) {
      case 'latest':
        return new Date(b.date).getTime() - new Date(a.date).getTime()
      case 'oldest':
        return new Date(a.date).getTime() - new Date(b.date).getTime()
      case 'a-to-z':
        return a.name.localeCompare(b.name)
      case 'z-to-a':
        return b.name.localeCompare(a.name)
      case 'highest':
        return b.amount - a.amount
      case 'lowest':
        return a.amount - b.amount
      default:
        return 0
    }
  })
}

export default function Transactions() {
  const { data, loading, error } = useFinanceData()
  const createTransaction = useCreateTransaction()
  const deleteTransaction = useDeleteTransaction()

  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState<SortOption>('latest')
  const [selectedCategory, setSelectedCategory] = useState<TransactionFilterCategory>('All Transactions')
  const [currentPage, setCurrentPage] = useState(1)

  // Form state
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    category: 'General' as TransactionCategory,
    amount: '',
    recurring: false,
  })

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()

    const amount = parseFloat(formData.amount)
    if (isNaN(amount) || amount === 0) {
      alert('Please enter a valid amount')
      return
    }

    createTransaction.mutate(
      {
        name: formData.name,
        category: formData.category,
        amount,
        recurring: formData.recurring,
        avatar: '/assets/images/avatars/emma-richardson.jpg', // Default avatar
      },
      {
        onSuccess: () => {
          setFormData({
            name: '',
            category: 'General',
            amount: '',
            recurring: false,
          })
          setShowForm(false)
        },
      }
    )
  }

  const handleDelete = (transactionId: string | undefined) => {
    if (!transactionId) {
      alert('Cannot delete transactions from the seed data')
      return
    }

    if (confirm('Are you sure you want to delete this transaction?')) {
      deleteTransaction.mutate(transactionId)
    }
  }

  const availableCategories = useMemo<TransactionFilterCategory[]>(() => {
    if (!data) return ['All Transactions']

    const categories = Array.from(new Set(data.transactions.map((transaction) => transaction.category)))
    return ['All Transactions', ...categories]
  }, [data])

  const filteredAndSortedTransactions = useMemo(() => {
    if (!data) return []

    const lowerSearch = searchTerm.trim().toLowerCase()

    const filtered = data.transactions.filter((transaction) => {
      const matchesSearch = transaction.name.toLowerCase().includes(lowerSearch)
      const matchesCategory =
        selectedCategory === 'All Transactions' || transaction.category === selectedCategory

      return matchesSearch && matchesCategory
    })

    return getSortedTransactions(filtered, sortBy)
  }, [data, searchTerm, selectedCategory, sortBy])

  const totalPages = Math.max(1, Math.ceil(filteredAndSortedTransactions.length / ITEMS_PER_PAGE))

  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, selectedCategory, sortBy])

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages)
    }
  }, [currentPage, totalPages])

  const paginatedTransactions = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    return filteredAndSortedTransactions.slice(startIndex, startIndex + ITEMS_PER_PAGE)
  }, [currentPage, filteredAndSortedTransactions])

  const currentSortLabel = sortOptions.find((option) => option.value === sortBy)?.label ?? 'Latest'

  if (loading) {
    return (
      <div className="page-transactions">
        <h1>Transactions</h1>
        <p>Loading transactions...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="page-transactions">
        <h1>Transactions</h1>
        <p className="error">Error loading transactions: {error}</p>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="page-transactions">
        <h1>Transactions</h1>
        <p>No transaction data available</p>
      </div>
    )
  }

  return (
    <div className="page-transactions">
      <div className="transactions-header">
        <h1>Transactions</h1>
        <button type="button" className="btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ Add Transaction'}
        </button>
      </div>

      {showForm && (
        <form className="transaction-form" onSubmit={handleSubmit}>
          <h2>New Transaction</h2>

          <div className="form-row">
            <label htmlFor="transaction-name">
              Name
              <input
                id="transaction-name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Coffee Shop"
                required
              />
            </label>

            <label htmlFor="transaction-category">
              Category
              <select
                id="transaction-category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as TransactionCategory })}
              >
                <option value="General">General</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Bills">Bills</option>
                <option value="Groceries">Groceries</option>
                <option value="Dining Out">Dining Out</option>
                <option value="Transportation">Transportation</option>
                <option value="Personal Care">Personal Care</option>
                <option value="Education">Education</option>
                <option value="Lifestyle">Lifestyle</option>
                <option value="Shopping">Shopping</option>
              </select>
            </label>
          </div>

          <div className="form-row">
            <label htmlFor="transaction-amount">
              Amount (negative for expense, positive for income)
              <input
                id="transaction-amount"
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                placeholder="e.g., -25.50 or 100.00"
                required
              />
            </label>

            <label htmlFor="transaction-recurring" className="checkbox-label">
              <input
                id="transaction-recurring"
                type="checkbox"
                checked={formData.recurring}
                onChange={(e) => setFormData({ ...formData, recurring: e.target.checked })}
              />
              Recurring transaction
            </label>
          </div>

          <button type="submit" className="btn-submit" disabled={createTransaction.isPending}>
            {createTransaction.isPending ? 'Adding...' : 'Add Transaction'}
          </button>
        </form>
      )}

      <section className="transactions-panel" aria-labelledby="transactions-list-title">
        <h2 id="transactions-list-title" className="sr-only">
          Transactions list
        </h2>

        <div className="transactions-controls">
          <label className="transactions-search" htmlFor="transactions-search-input">
            <input
              id="transactions-search-input"
              type="search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search transaction"
            />
            <img src="/assets/images/icon-search.svg" alt="" aria-hidden="true" />
          </label>

          <div className="transactions-control-selects">
            <label>
              <span>Sort by</span>
              <select value={sortBy} onChange={(event) => setSortBy(event.target.value as SortOption)}>
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <label>
              <span>Category</span>
              <select
                value={selectedCategory}
                onChange={(event) => setSelectedCategory(event.target.value as TransactionFilterCategory)}
              >
                {availableCategories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="transactions-control-mobile">
            <button
              type="button"
              className="icon-button"
              onClick={() => {
                const currentIndex = sortOptions.findIndex((option) => option.value === sortBy)
                const nextIndex = (currentIndex + 1) % sortOptions.length
                setSortBy(sortOptions[nextIndex].value)
              }}
              aria-label={`Sort transactions. Current: ${currentSortLabel}`}
            >
              <img src="/assets/images/icon-sort-mobile.svg" alt="" aria-hidden="true" />
            </button>

            <button
              type="button"
              className="icon-button"
              onClick={() => {
                const currentIndex = availableCategories.findIndex((category) => category === selectedCategory)
                const nextIndex = (currentIndex + 1) % availableCategories.length
                setSelectedCategory(availableCategories[nextIndex])
              }}
              aria-label={`Filter category. Current: ${selectedCategory}`}
            >
              <img src="/assets/images/icon-filter-mobile.svg" alt="" aria-hidden="true" />
            </button>
          </div>
        </div>

        <div className="transactions-table-head" aria-hidden="true">
          <p>Name</p>
          <p>Category</p>
          <p>Transaction Date</p>
          <p>Amount</p>
          <p>Actions</p>
        </div>

        <ul className="transactions-list">
          {paginatedTransactions.map((transaction) => (
            <TransactionItem
              key={`${transaction.name}-${transaction.date}-${transaction.amount}`}
              transaction={transaction}
              variant="transactions"
              onDelete={handleDelete}
            />
          ))}
        </ul>

        <nav className="transactions-pagination" aria-label="Transactions pagination">
          <button
            type="button"
            className="pagination-button"
            onClick={() => setCurrentPage((previous) => Math.max(1, previous - 1))}
            disabled={currentPage === 1}
          >
            <img src="/assets/images/icon-caret-left.svg" alt="" aria-hidden="true" />
            Prev
          </button>

          <div className="pagination-pages pagination-pages--desktop">
            {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
              <button
                key={page}
                type="button"
                className={`pagination-page ${page === currentPage ? 'is-active' : ''}`}
                onClick={() => setCurrentPage(page)}
                aria-current={page === currentPage ? 'page' : undefined}
              >
                {page}
              </button>
            ))}
          </div>

          <div className="pagination-pages pagination-pages--mobile">
            <button
              type="button"
              className={`pagination-page ${currentPage === 1 ? 'is-active' : ''}`}
              onClick={() => setCurrentPage(1)}
              aria-current={currentPage === 1 ? 'page' : undefined}
            >
              1
            </button>

            {currentPage > 2 && totalPages > 3 ? <span className="pagination-ellipsis">...</span> : null}

            {currentPage > 1 && currentPage < totalPages ? (
              <button type="button" className="pagination-page is-active" aria-current="page">
                {currentPage}
              </button>
            ) : null}

            {currentPage < totalPages - 1 && totalPages > 3 ? (
              <span className="pagination-ellipsis">...</span>
            ) : null}

            {totalPages > 1 ? (
              <button
                type="button"
                className={`pagination-page ${currentPage === totalPages ? 'is-active' : ''}`}
                onClick={() => setCurrentPage(totalPages)}
                aria-current={currentPage === totalPages ? 'page' : undefined}
              >
                {totalPages}
              </button>
            ) : null}
          </div>

          <button
            type="button"
            className="pagination-button"
            onClick={() => setCurrentPage((previous) => Math.min(totalPages, previous + 1))}
            disabled={currentPage === totalPages}
          >
            Next
            <img src="/assets/images/icon-caret-right.svg" alt="" aria-hidden="true" />
          </button>
        </nav>
      </section>
    </div>
  )
}
