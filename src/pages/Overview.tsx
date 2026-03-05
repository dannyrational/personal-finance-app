import { useFinanceData } from '../context/FinanceDataContext'
import { formatCurrency } from '../utils/dataHelpers'

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

      {/* Debug info - remove once components are built */}
      <section className="debug-info">
        <p>✓ Data loaded successfully</p>
        <p>• {data.transactions.length} transactions</p>
        <p>• {data.budgets.length} budgets</p>
        <p>• {data.pots.length} pots</p>
      </section>
    </div>
  )
}
