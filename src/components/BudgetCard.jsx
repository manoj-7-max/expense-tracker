import { AlertTriangle } from 'lucide-react';
import { getSummary, money } from '../lib/finance.js';

export default function BudgetCard({ transactions, budget, onEdit }) {
  const summary = getSummary(transactions, budget);
  const limit = Number(budget?.monthly_limit || 0);
  const used = limit ? Math.min((summary.monthlySpent / limit) * 100, 100) : 0;
  const danger = limit > 0 && used >= 90;

  return (
    <section className="card p-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold">Monthly Budget</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">{money(summary.remainingBudget)} remaining</p>
        </div>
        <button className="btn-secondary" type="button" onClick={onEdit}>
          Edit
        </button>
      </div>
      <div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
        <div className={`h-full rounded-full ${danger ? 'bg-rose-600' : 'bg-teal-600'}`} style={{ width: `${used}%` }} />
      </div>
      <div className="mt-3 flex justify-between text-sm text-slate-500 dark:text-slate-400">
        <span>{money(summary.monthlySpent)} spent</span>
        <span>{money(limit)} limit</span>
      </div>
      {danger ? (
        <p className="mt-4 flex items-center gap-2 rounded-lg bg-rose-50 p-3 text-sm font-semibold text-rose-700 dark:bg-rose-950 dark:text-rose-200">
          <AlertTriangle size={17} />
          Budget alert: spending is above 90% of your monthly limit.
        </p>
      ) : null}
    </section>
  );
}
