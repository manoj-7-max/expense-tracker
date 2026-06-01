import { useEffect, useState } from 'react';
import { Save } from 'lucide-react';

const initialForm = { title: '', target_amount: '', saved_amount: '0' };

export default function GoalForm({ goal, onSubmit, onCancel }) {
  const [form, setForm] = useState(initialForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setForm(goal ? { ...goal, target_amount: String(goal.target_amount), saved_amount: String(goal.saved_amount) } : initialForm);
  }, [goal]);

  const submit = async (event) => {
    event.preventDefault();
    setSaving(true);
    await onSubmit(form, goal?.id);
    setSaving(false);
  };

  return (
    <form className="space-y-4" onSubmit={submit}>
      <label className="block text-sm font-semibold">
        Goal title
        <input className="input mt-2" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Emergency fund" />
      </label>
      <label className="block text-sm font-semibold">
        Target amount
        <input className="input mt-2" required min="1" step="0.01" type="number" value={form.target_amount} onChange={(e) => setForm({ ...form, target_amount: e.target.value })} />
      </label>
      <label className="block text-sm font-semibold">
        Current saved amount
        <input className="input mt-2" required min="0" step="0.01" type="number" value={form.saved_amount} onChange={(e) => setForm({ ...form, saved_amount: e.target.value })} />
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
