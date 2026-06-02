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
    <form className="space-y-5" onSubmit={submit}>
      <div className="grid grid-cols-2 gap-2 rounded-xl bg-navy-900/50 p-1.5 border border-white/5">
        {['expense', 'income'].map((type) => (
          <button
            key={type}
            type="button"
            className={`rounded-lg px-3 py-2.5 text-sm font-semibold capitalize transition-all duration-300 ${
              form.type === type 
                ? (type === 'income' ? 'bg-neon-mint/20 text-neon-mint shadow-[0_0_10px_rgba(0,255,204,0.3)]' : 'bg-neon-red/20 text-neon-red shadow-[0_0_10px_rgba(255,51,102,0.3)]')
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
            }`}
            onClick={() => update('type', type)}
          >
            {type}
          </button>
        ))}
      </div>

      <label className="block text-sm font-semibold text-slate-300">
        Amount
        <div className="relative mt-2">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">₹</span>
          <input className="input pl-8" required min="1" step="0.01" type="number" value={form.amount} onChange={(e) => update('amount', e.target.value)} />
        </div>
      </label>

      {form.type === 'expense' ? (
        <label className="block text-sm font-semibold text-slate-300">
          Category
          <select className="input mt-2" value={form.category} onChange={(e) => update('category', e.target.value)}>
            {expenseCategories.map((category) => (
              <option key={category} value={category} className="bg-navy-800 text-white">{category}</option>
            ))}
          </select>
        </label>
      ) : (
        <label className="block text-sm font-semibold text-slate-300">
          Income Source
          <input className="input mt-2" required value={form.category === 'Income' ? '' : form.category} onChange={(e) => update('category', e.target.value)} placeholder="Salary, freelance, bonus" />
        </label>
      )}

      <label className="block text-sm font-semibold text-slate-300">
        Notes
        <textarea className="input mt-2 min-h-24 resize-y" value={form.note || ''} onChange={(e) => update('note', e.target.value)} placeholder="Optional details..." />
      </label>

      <label className="block text-sm font-semibold text-slate-300">
        Date
        <input className="input mt-2" required type="date" value={form.date} onChange={(e) => update('date', e.target.value)} />
      </label>

      <div className="flex gap-3 pt-2">
        <button className="btn-primary flex-1" disabled={saving} type="submit">
          <Save size={18} />
          {saving ? 'Saving...' : 'Save Record'}
        </button>
        <button className="btn-secondary" type="button" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
}
