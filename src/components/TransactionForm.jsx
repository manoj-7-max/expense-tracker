import { useEffect, useState } from 'react';
import { Save } from 'lucide-react';
import { expenseCategories } from '../lib/constants.js';

const initialForm = {
  type: 'expense',
  amount: '',
  category: 'Food',
  note: '',
  date: new Date().toISOString().slice(0, 10),
};

export default function TransactionForm({ transaction, onSubmit, onCancel }) {
  const [form, setForm] = useState(initialForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setForm(transaction ? { ...transaction, amount: String(transaction.amount) } : initialForm);
  }, [transaction]);

  const update = (field, value) => {
    setForm((current) => ({
      ...current,
      [field]: value,
      ...(field === 'type' && value === 'income' ? { category: 'Income' } : {}),
      ...(field === 'type' && value === 'expense' ? { category: 'Food' } : {}),
    }));
  };

  const submit = async (event) => {
    event.preventDefault();
    setSaving(true);
    await onSubmit(form, transaction?.id);
    setSaving(false);
  };

  return (
    <form className="space-y-4" onSubmit={submit}>
      <div className="grid grid-cols-2 gap-2 rounded-lg bg-slate-100 p-1 dark:bg-slate-800">
        {['expense', 'income'].map((type) => (
          <button
            key={type}
            type="button"
            className={`rounded-md px-3 py-2 text-sm font-semibold capitalize ${
              form.type === type ? 'bg-white text-teal-700 shadow-sm dark:bg-slate-950 dark:text-teal-300' : 'text-slate-600 dark:text-slate-300'
            }`}
            onClick={() => update('type', type)}
          >
            {type}
          </button>
        ))}
      </div>

      <label className="block text-sm font-semibold">
        Amount
        <input className="input mt-2" required min="1" step="0.01" type="number" value={form.amount} onChange={(e) => update('amount', e.target.value)} />
      </label>

      {form.type === 'expense' ? (
        <label className="block text-sm font-semibold">
          Category
          <select className="input mt-2" value={form.category} onChange={(e) => update('category', e.target.value)}>
            {expenseCategories.map((category) => (
              <option key={category}>{category}</option>
            ))}
          </select>
        </label>
      ) : (
        <label className="block text-sm font-semibold">
          Income source
          <input className="input mt-2" required value={form.category === 'Income' ? '' : form.category} onChange={(e) => update('category', e.target.value)} placeholder="Salary, freelance, bonus" />
        </label>
      )}

      <label className="block text-sm font-semibold">
        Notes
        <textarea className="input mt-2 min-h-24 resize-y" value={form.note || ''} onChange={(e) => update('note', e.target.value)} placeholder="Optional details" />
      </label>

      <label className="block text-sm font-semibold">
        Date
        <input className="input mt-2" required type="date" value={form.date} onChange={(e) => update('date', e.target.value)} />
      </label>

      <div className="flex gap-3">
        <button className="btn-primary flex-1" disabled={saving} type="submit">
          <Save size={18} />
          Save
        </button>
        <button className="btn-secondary" type="button" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
}
