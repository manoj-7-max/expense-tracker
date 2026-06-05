import { CategoryChart, IncomeExpenseChart, SavingsGrowthChart } from '../components/Charts.jsx';
import PageHeader from '../components/PageHeader.jsx';
import { useFinance } from '../context/FinanceContext.jsx';

export default function Reports() {
  const { transactions } = useFinance();

  return (
    <>
      <PageHeader title="Reports" subtitle="Monthly spend, categories, and income trends." />
      <div className="grid gap-6 p-4 sm:p-6 lg:p-8 xl:grid-cols-2">
        <section className="card p-4">
          <h2 className="mb-4 text-lg font-display font-bold tracking-wide">Savings Growth</h2>
          <SavingsGrowthChart transactions={transactions} />
        </section>
        <section className="card p-4">
          <h2 className="mb-4 text-lg font-display font-bold tracking-wide">Category-wise Expenses</h2>
          <CategoryChart transactions={transactions} />
        </section>
        <section className="card p-4 xl:col-span-2">
          <h2 className="mb-4 text-lg font-display font-bold tracking-wide">Income vs Expense</h2>
          <IncomeExpenseChart transactions={transactions} />
        </section>
      </div>
    </>
  );
}
