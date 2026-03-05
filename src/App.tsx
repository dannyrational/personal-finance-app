import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { FinanceDataProvider } from './context/FinanceDataContext'
import Navigation from './components/Navigation'
import Overview from './pages/Overview'
import Transactions from './pages/Transactions'
import Budgets from './pages/Budgets'
import Pots from './pages/Pots'
import RecurringBills from './pages/RecurringBills'

function App() {
  return (
    <FinanceDataProvider>
      <Router>
        <div className="app-layout">
          <Navigation />
          <main className="app-content">
            <Routes>
              <Route path="/" element={<Overview />} />
              <Route path="/transactions" element={<Transactions />} />
              <Route path="/budgets" element={<Budgets />} />
              <Route path="/pots" element={<Pots />} />
              <Route path="/recurring-bills" element={<RecurringBills />} />
            </Routes>
          </main>
        </div>
      </Router>
    </FinanceDataProvider>
  )
}

export default App
