# Personal Finance App

A modern personal finance management application built with React, TypeScript, and SCSS.

## Features

- **Dashboard Overview** - At-a-glance view of balance, income, expenses, budgets, pots, and transactions
- **Transaction Management** - Search, filter, and sort transactions with pagination
- **Budget Tracking** - Create and monitor spending budgets by category with visual progress indicators
- **Savings Pots** - Set savings goals and track progress toward financial targets
- **Recurring Bills** - Monitor recurring expenses and payment status
- **Full CRUD Operations** - Create, read, update, and delete budgets and pots
- **Responsive Design** - Optimized layouts for mobile, tablet, and desktop

## Tech Stack

**Frontend**
- React 18 with TypeScript
- React Router for navigation
- React Query (TanStack Query) for server state management
- SCSS for styling with organized component structure

**Backend Ready**
- API client layer with mutation hooks
- Optimistic updates for instant UI feedback
- Automatic cache invalidation
- Ready for Node/Express backend integration

## Project Structure

```
src/
├── api/              # API client and mutations
├── components/       # Reusable UI components
├── context/          # React Query provider
├── hooks/            # Custom hooks (queries, mutations, domain logic)
├── pages/            # Route pages
├── styles/           # SCSS modules with design system
├── types.ts          # TypeScript type definitions
└── utils/            # Helper functions
```

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Development

The app runs on `http://localhost:5173/` with hot module replacement enabled.

## Architecture Highlights

- **Separation of Concerns** - API layer, business logic, and UI are cleanly separated
- **Type Safety** - Full TypeScript coverage with strict mode enabled
- **Scalable State Management** - React Query handles caching, refetching, and mutations
- **Optimistic Updates** - UI updates immediately while server confirms changes
- **Clean Code** - ESLint configured with React best practices

## Future Enhancements

- [ ] Backend API implementation (Node.js/Express)
- [ ] User authentication and authorization
- [ ] Data persistence with database
- [ ] Advanced data visualizations
- [ ] Export transactions to CSV
- [ ] Dark/light theme toggle

## License

MIT

---

**Note**: This is a portfolio project demonstrating modern React patterns and full-stack architecture design.
