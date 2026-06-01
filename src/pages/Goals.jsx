import { useState } from 'react';
import { Edit2, Plus, Trash2 } from 'lucide-react';
import GoalForm from '../components/GoalForm.jsx';
import Modal from '../components/Modal.jsx';
import PageHeader from '../components/PageHeader.jsx';
import { useFinance } from '../context/FinanceContext.jsx';
import { money } from '../lib/finance.js';

export default function Goals() {
  const { goals, saveGoal, deleteGoal } = useFinance();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const close = () => {
    setOpen(false);
    setEditing(null);
  };

  return (
    <>
      <PageHeader
        title="Savings Goals"
        subtitle="Track progress toward the things that matter."
        action={
          <button className="btn-primary" type="button" onClick={() => setOpen(true)}>
            <Plus size={18} />
            Goal
          </button>
        }
      />
      <div className="grid gap-4 p-4 sm:p-6 md:grid-cols-2 lg:p-8 xl:grid-cols-3">
        {goals.map((goal) => {
          const percent = Math.min((Number(goal.saved_amount) / Number(goal.target_amount)) * 100, 100);
          return (
            <article key={goal.id} className="card p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-bold">{goal.title}</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {money(goal.saved_amount)} of {money(goal.target_amount)}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button className="icon-btn" type="button" onClick={() => { setEditing(goal); setOpen(true); }} aria-label="Edit goal">
                    <Edit2 size={16} />
                  </button>
                  <button className="icon-btn" type="button" onClick={() => deleteGoal(goal.id)} aria-label="Delete goal">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                <div className="h-full rounded-full bg-teal-600" style={{ width: `${percent}%` }} />
              </div>
              <p className="mt-3 text-sm font-semibold text-teal-700 dark:text-teal-300">{percent.toFixed(0)}% complete</p>
            </article>
          );
        })}
        {!goals.length ? <p className="card p-6 text-center text-sm text-slate-500 dark:text-slate-400 md:col-span-2 xl:col-span-3">No savings goals yet.</p> : null}
      </div>
      <Modal title={editing ? 'Edit Goal' : 'Create Goal'} open={open} onClose={close}>
        <GoalForm
          goal={editing}
          onSubmit={async (form, id) => {
            await saveGoal(form, id);
            close();
          }}
          onCancel={close}
        />
      </Modal>
    </>
  );
}
