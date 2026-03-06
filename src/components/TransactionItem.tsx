import type { Transaction } from '../types'
import { formatCurrency, formatDate } from '../utils/dataHelpers'

interface TransactionItemProps {
  transaction: Transaction
  variant?: 'overview' | 'transactions'
  onDelete?: (id: string | undefined) => void
}

export default function TransactionItem({ transaction, variant = 'overview', onDelete }: TransactionItemProps) {
  const isIncome = transaction.amount > 0
  const amount = `${isIncome ? '+' : '-'}${formatCurrency(Math.abs(transaction.amount))}`
  const avatarSrc = transaction.avatar.replace('./', '/')

  if (variant === 'transactions') {
    return (
      <li className="transaction-item transaction-item--transactions">
        <div className="transaction-item__name-wrap">
          <p className="transaction-item__name">{transaction.name}</p>
          <p className="transaction-item__category-mobile">{transaction.category}</p>
        </div>

        <p className="transaction-item__category">{transaction.category}</p>

        <p className={`transaction-item__amount ${isIncome ? 'is-income' : 'is-expense'}`}>{amount}</p>

        <p className="transaction-item__date transaction-item__date--desktop">{formatDate(transaction.date)}</p>

        {transaction.id && onDelete && (
          <button
            type="button"
            className="transaction-item__delete"
            onClick={() => onDelete(transaction.id)}
            aria-label={`Delete ${transaction.name}`}
          >
            ×
          </button>
        )}
      </li>
    )
  }

  return (
    <li className="transaction-item transaction-item--overview">
      <div className="transaction-item__left">
        <p className="transaction-item__name">{transaction.name}</p>
      </div>

      <div className="transaction-item__right">
        <p className={`transaction-item__amount ${isIncome ? 'is-income' : 'is-expense'}`}>{amount}</p>
        <p className="transaction-item__date">{formatDate(transaction.date)}</p>
      </div>
    </li>
  )
}