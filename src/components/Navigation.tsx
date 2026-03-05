import { Link, useLocation } from 'react-router-dom'

export default function Navigation() {
  const location = useLocation()

  const navItems = [
    { path: '/', label: 'Overview', icon: 'icon-nav-overview.svg' },
    { path: '/transactions', label: 'Transactions', icon: 'icon-nav-transactions.svg' },
    { path: '/budgets', label: 'Budgets', icon: 'icon-nav-budgets.svg' },
    { path: '/pots', label: 'Pots', icon: 'icon-nav-pots.svg' },
    { path: '/recurring-bills', label: 'Recurring Bills', icon: 'icon-nav-recurring-bills.svg' },
  ]

  return (
    <nav className="navigation">
      <div className="nav-header">
        <img src="/assets/images/logo-large.svg" alt="Finance App Logo" className="nav-logo" />
      </div>
      
      <ul className="nav-list">
        {navItems.map((item) => (
          <li key={item.path}>
            <Link
              to={item.path}
              className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
            >
              <img src={`/assets/images/${item.icon}`} alt="" className="nav-icon" />
              <span>{item.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
