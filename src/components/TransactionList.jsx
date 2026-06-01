import { format, parseISO } from 'date-fns';
import { Edit2, Trash2 } from 'lucide-react';
import { money } from '../lib/finance.js';

export default function TransactionList({ transactions, onEdit, onDelete, compact = false }) {
  if (!transactions.length) {
    return <p className="rounded-lg border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">No transactions yet.</p>;
  }

  return (
    <div className="divide-y divide-slate-100 dark:divide-slate-800">
      {transactions.map((item) => (
        <article key={item.id} className="flex items-center gap-3 py-3">
          <div className={`grid h-11 w-11 shrink-0 place-items-center rounded-lg text-sm font-bold ${item.type === 'income' ? 'bg-teal-50 text-teal-700 dark:bg-teal-950 dark:text-teal-300' : 'bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300'}`}>
            {item.type === 'income' ? '+' : '-'}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">{item.category || item.type}</p>
            <p className="truncate text-xs text-slate-500 dark:text-slate-400">
              {format(parseISO(item.date), 'dd MMM yyyy')}
              {item.note ? ` · ${item.note}` : ''}
            </p>
          </div>
          <p className={`text-sm font-bold ${item.type === 'income' ? 'text-teal-700 dark:text-teal-300' : 'text-rose-700 dark:text-rose-300'}`}>
            {item.type === 'income' ? '+' : '-'}
            {money(item.amount)}
          </p>
          {!compact ? (
            <div className="flex gap-2">
              <button type="button" className="icon-btn" onClick={() => onEdit(item)} aria-label="Edit transaction">
                <Edit2 size={16} />
              </button>
              <button type="button" className="icon-btn" onClick={() => onDelete(item.id)} aria-label="Delete transaction">
                <Trash2 size={16} />
              </button>
            </div>
          ) : null}
        </article>
      ))}
    </div>
  );
}
