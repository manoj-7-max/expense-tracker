import { useState } from 'react';
import { CreditCard, Plus, TrendingDown, TrendingUp, Wallet } from 'lucide-react';
import { motion } from 'framer-motion';
import BudgetCard from '../components/BudgetCard.jsx';
import { CategoryChart, IncomeExpenseChart, SavingsGrowthChart } from '../components/Charts.jsx';
import Modal from '../components/Modal.jsx';
import PageHeader from '../components/PageHeader.jsx';
import StatCard from '../components/StatCard.jsx';
import TransactionForm from '../components/TransactionForm.jsx';
import TransactionList from '../components/TransactionList.jsx';
import { useFinance } from '../context/FinanceContext.jsx';
import { getSummary, money } from '../lib/finance.js';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

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
        title="Welcome back, Karthik! 👋"
        subtitle="Here's what's happening with your finances today."
        action={
          <button className="btn-primary" type="button" onClick={() => setTransactionModal(true)}>
            <Plus size={18} />
            Add Record
          </button>
        }
      />
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="space-y-6 p-4 sm:p-6 lg:p-8"
      >
        <motion.section variants={item} className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard title="Total Balance" value="₹145,680.50" icon={Wallet} tone="cyan" trend="+8.5%" data={[120, 125, 122, 135, 140, 145]} />
          <StatCard title="Monthly Income" value="₹89,250.00" icon={TrendingUp} tone="mint" trend="+12.4%" data={[40, 50, 45, 65, 80, 89]} />
          <StatCard title="Monthly Expenses" value="₹45,680.00" icon={TrendingDown} tone="rose" trend="-5.3%" data={[60, 55, 48, 52, 47, 45]} />
          <StatCard title="Total Savings" value="₹43,570.00" icon={CreditCard} tone="amber" trend="+18.7%" data={[20, 25, 23, 35, 38, 43]} />
        </motion.section>

        <motion.div variants={item} className="grid gap-6 xl:grid-cols-3">
          <section className="card p-6 border-t border-white/5 xl:col-span-2">
            <h2 className="mb-6 text-xl font-display font-bold text-white tracking-wide">Monthly Trend</h2>
            <IncomeExpenseChart transactions={transactions} />
          </section>
          <section className="card p-6 border-t border-white/5">
            <h2 className="mb-6 text-xl font-display font-bold text-white tracking-wide">Expense Breakdown</h2>
            <CategoryChart transactions={transactions} />
          </section>
        </motion.div>

        <motion.div variants={item} className="grid gap-6 xl:grid-cols-[1fr_1.5fr]">
          <section className="card p-6 border-t border-white/5">
            <h2 className="mb-6 text-xl font-display font-bold text-white tracking-wide">Savings Growth</h2>
            <SavingsGrowthChart transactions={transactions} />
          </section>
          <section className="card p-6 border-t border-white/5 flex flex-col h-[400px]">
            <h2 className="mb-4 text-xl font-display font-bold text-white tracking-wide">Recent Transactions</h2>
            <div className="flex-1 overflow-y-auto custom-scrollbar -mx-2 px-2">
              <TransactionList transactions={transactions} compact showFilters />
            </div>
          </section>
        </motion.div>
      </motion.div>

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
        <form className="space-y-6" onSubmit={saveBudgetValue}>
          <label className="block text-sm font-semibold text-slate-300">
            Monthly Limit
            <div className="relative mt-2">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">₹</span>
              <input className="input pl-8" min="0" step="0.01" type="number" value={budgetValue} onChange={(e) => setBudgetValue(e.target.value)} />
            </div>
          </label>
          <button className="btn-primary w-full" type="submit">
            Save Budget Limits
          </button>
        </form>
      </Modal>
    </>
  );
}
