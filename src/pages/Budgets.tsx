import { useFinanceData } from '../context/FinanceDataContext'
import { formatCurrency } from '../utils/dataHelpers'

export default function Budgets() {
  const { data, loading, getBudgetWithSpending } = useFinanceData()

  if (loading) return <div className="page-budgets"><h1>Budgets</h1><p>Loading...</p></div>
  if (!data) return <div className="page-budgets"><h1>Budgets</h1><p>No data</p></div>

  return (
    <div className="page-budgets">
      <h1>Budgets</h1>
      <p>Create, read, update, delete budgets with spending tracking.</p>
      
      {/* Example: Using the helper method */}
      <section className="budgets-list">
        {data.budgets.map((budget) => {
          const budgetData = getBudgetWithSpending(budget)
          return (
            <div key={budget.category} className="budget-item">
              <h3>{budget.category}</h3>
              <p>Maximum: {formatCurrency(budgetData.maximum)}</p>
              <p>Spent (Aug 2024): {formatCurrency(budgetData.spent)}</p>
              <p>Remaining: {formatCurrency(budgetData.remaining)}</p>
              <p>Latest transactions: {budgetData.latestTransactions.length}</p>
            </div>
          )
        })}
      </section>
    </div>
  )
}
