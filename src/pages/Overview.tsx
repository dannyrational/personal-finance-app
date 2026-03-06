import { useFinanceData } from '../context/FinanceDataContext'
import { Link } from 'react-router-dom'
import TransactionItem from '../components/TransactionItem'
import { formatCurrency, sortTransactionsByDate } from '../utils/dataHelpers'

export default function Overview() {
  const { data, loading, error } = useFinanceData()

  if (loading) {
    return (
      <div className="page-overview">
        <h1>Overview</h1>
        <p>Loading your financial data...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="page-overview">
        <h1>Overview</h1>
        <p className="error">Error loading data: {error}</p>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="page-overview">
        <h1>Overview</h1>
        <p>No data available</p>
      </div>
    )
  }

  const latestTransactions = sortTransactionsByDate(data.transactions).slice(0, 5)

  return (
    <div className="page-overview">
      <h1>Overview</h1>
      
      {/* Balance Summary */}
      <section className="balance-summary">
        <div className="balance-card balance-card--primary">
          <h2>Current Balance</h2>
          <p className="balance-amount">{formatCurrency(data.balance.current)}</p>
        </div>
        <div className="balance-card">
          <h2>Income</h2>
          <p className="balance-amount">{formatCurrency(data.balance.income)}</p>
        </div>
        <div className="balance-card">
          <h2>Expenses</h2>
          <p className="balance-amount">{formatCurrency(data.balance.expenses)}</p>
        </div>
      </section>

      <div className="overview-grid">
        <section className="overview-panel overview-transactions" aria-labelledby="overview-transactions-title">
          <header className="overview-panel__header">
            <h2 id="overview-transactions-title">Transactions</h2>
            <Link to="/transactions" className="overview-panel__link">
              View All <span aria-hidden="true">›</span>
            </Link>
          </header>

          <ul className="transaction-list">
            {latestTransactions.map((transaction) => (
              <TransactionItem
                key={`${transaction.name}-${transaction.date}-${transaction.amount}`}
                transaction={transaction}
              />
            ))}
          </ul>
        </section>
      </div>
    </div>
  )
}
