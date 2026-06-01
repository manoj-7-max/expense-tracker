import { useState } from 'react';
import { CreditCard, Plus, TrendingDown, TrendingUp, Wallet } from 'lucide-react';
import BudgetCard from '../components/BudgetCard.jsx';
import { CategoryChart, IncomeExpenseChart } from '../components/Charts.jsx';
import Modal from '../components/Modal.jsx';
import PageHeader from '../components/PageHeader.jsx';
import StatCard from '../components/StatCard.jsx';
import TransactionForm from '../components/TransactionForm.jsx';
import TransactionList from '../components/TransactionList.jsx';
import { useFinance } from '../context/FinanceContext.jsx';
import { getSummary, money } from '../lib/finance.js';

export default function Dashboard() {
  const { transactions, budget, saveBudget, saveTransaction } = useFinance();
  const [transactionModal, setTransactionModal] = useState(false);
  const [budgetModal, setBudgetModal] = useState(false);
  const [budgetValue, setBudgetValue] = useState('');
  const summary = getSummary(transactions, budget);

  const saveBudgetValue = async (event) => {
    event.preventDefault();
    await saveBudget(budgetValue);
    setBudgetModal(false);
  };

  return (
    <>
      <PageHeader
        title="Dashboard"
        subtitle="Your financial pulse at a glance."
        action={
          <button className="btn-primary" type="button" onClick={() => setTransactionModal(true)}>
            <Plus size={18} />
            Add
          </button>
        }
      />
      <div className="space-y-6 p-4 sm:p-6 lg:p-8">
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard title="Total Balance" value={money(summary.balance)} icon={Wallet} tone="teal" />
          <StatCard title="Total Income" value={money(summary.income)} icon={TrendingUp} tone="sky" />
          <StatCard title="Total Expenses" value={money(summary.expenses)} icon={TrendingDown} tone="rose" />
          <StatCard title="Monthly Savings" value={money(summary.savings)} icon={CreditCard} tone="amber" />
        </section>

        <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
          <section className="card p-4">
            <h2 className="mb-4 text-lg font-bold">Income vs Expense</h2>
            <IncomeExpenseChart transactions={transactions} />
          </section>
          <BudgetCard
            transactions={transactions}
            budget={budget}
            onEdit={() => {
              setBudgetValue(budget?.monthly_limit || '');
              setBudgetModal(true);
            }}
          />
        </div>

        <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
          <section className="card p-4">
            <h2 className="mb-4 text-lg font-bold">Expense Categories</h2>
            <CategoryChart transactions={transactions} />
          </section>
          <section className="card p-4">
            <h2 className="mb-2 text-lg font-bold">Recent Transactions</h2>
            <TransactionList transactions={transactions.slice(0, 6)} compact />
          </section>
        </div>
      </div>

      <Modal title="Add Transaction" open={transactionModal} onClose={() => setTransactionModal(false)}>
        <TransactionForm
          onSubmit={async (form) => {
            await saveTransaction(form);
            setTransactionModal(false);
          }}
          onCancel={() => setTransactionModal(false)}
        />
      </Modal>

      <Modal title="Monthly Budget" open={budgetModal} onClose={() => setBudgetModal(false)}>
        <form className="space-y-4" onSubmit={saveBudgetValue}>
          <label className="block text-sm font-semibold">
            Monthly limit
            <input className="input mt-2" min="0" step="0.01" type="number" value={budgetValue} onChange={(e) => setBudgetValue(e.target.value)} />
          </label>
          <button className="btn-primary w-full" type="submit">
            Save Budget
          </button>
        </form>
      </Modal>
    </>
  );
}
