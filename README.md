# Personal Expense Tracker & Money Manager

A production-ready React + Vite + Tailwind CSS + Supabase personal finance PWA.

## Setup

1. Create a Supabase project.
2. Run `supabase/schema.sql` in the Supabase SQL editor.
3. Copy `.env.example` to `.env` and set your Supabase URL and anon key.
4. Install and run:

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Features

- Email signup/login with Supabase Auth and persisted sessions.
- Dashboard totals, recent transactions, budget status, and charts.
- Expense and income CRUD.
- Savings goals with progress.
- Transaction search, filters, date range, and latest-first sorting.
- Dark mode, CSV export, account deletion.
- Installable PWA with offline app-shell caching.
