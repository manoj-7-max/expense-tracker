import { CategoryChart, IncomeExpenseChart, MonthlyExpenseChart } from '../components/Charts.jsx';
import PageHeader from '../components/PageHeader.jsx';
import { useFinance } from '../context/FinanceContext.jsx';

export default function Reports() {
  const { transactions } = useFinance();

  return (
    <>
      <PageHeader title="Reports" subtitle="Monthly spend, categories, and income trends." />
      <div className="grid gap-6 p-4 sm:p-6 lg:p-8 xl:grid-cols-2">
        <section className="card p-4">
          <h2 className="mb-4 text-lg font-bold">Monthly Expenses</h2>
          <MonthlyExpenseChart transactions={transactions} />
        </section>
        <section className="card p-4">
          <h2 className="mb-4 text-lg font-bold">Category-wise Expenses</h2>
          <CategoryChart transactions={transactions} />
        </section>
        <section className="card p-4 xl:col-span-2">
          <h2 className="mb-4 text-lg font-bold">Income vs Expense</h2>
          <IncomeExpenseChart transactions={transactions} />
        </section>
      </div>
    </>
  );
}
