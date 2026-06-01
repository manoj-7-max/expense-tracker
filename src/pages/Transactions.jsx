import { useMemo, useState } from 'react';
import { Plus, Search } from 'lucide-react';
import Modal from '../components/Modal.jsx';
import PageHeader from '../components/PageHeader.jsx';
import TransactionForm from '../components/TransactionForm.jsx';
import TransactionList from '../components/TransactionList.jsx';
import { useFinance } from '../context/FinanceContext.jsx';
import { expenseCategories } from '../lib/constants.js';

export default function Transactions() {
  const { transactions, saveTransaction, deleteTransaction } = useFinance();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');

  const filtered = useMemo(() => {
    return transactions
      .filter((item) => {
        const text = `${item.category} ${item.note}`.toLowerCase();
        const matchesSearch = text.includes(search.toLowerCase());
        const matchesCategory = category === 'All' || item.category === category;
        const matchesFrom = !from || item.date >= from;
        const matchesTo = !to || item.date <= to;
        return matchesSearch && matchesCategory && matchesFrom && matchesTo;
      })
      .sort((a, b) => `${b.date}${b.created_at}`.localeCompare(`${a.date}${a.created_at}`));
  }, [category, from, search, to, transactions]);

  const close = () => {
    setOpen(false);
    setEditing(null);
  };

  return (
    <>
      <PageHeader
        title="Transactions"
        subtitle="Search, filter, edit, and delete records."
        action={
          <button className="btn-primary" type="button" onClick={() => setOpen(true)}>
            <Plus size={18} />
            Add
          </button>
        }
      />
      <div className="space-y-5 p-4 sm:p-6 lg:p-8">
        <section className="card grid gap-3 p-4 md:grid-cols-[1.2fr_0.8fr_0.8fr_0.8fr]">
          <label className="relative block">
            <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={17} />
            <input className="input pl-10" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search notes or source" />
          </label>
          <select className="input" value={category} onChange={(e) => setCategory(e.target.value)}>
            <option>All</option>
            <option>Income</option>
            {expenseCategories.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
          <input className="input" type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
          <input className="input" type="date" value={to} onChange={(e) => setTo(e.target.value)} />
        </section>

        <section className="card p-4">
          <TransactionList
            transactions={filtered}
            onEdit={(item) => {
              setEditing(item);
              setOpen(true);
            }}
            onDelete={deleteTransaction}
          />
        </section>
      </div>

      <Modal title={editing ? 'Edit Transaction' : 'Add Transaction'} open={open} onClose={close}>
        <TransactionForm
          transaction={editing}
          onSubmit={async (form, id) => {
            await saveTransaction(form, id);
            close();
          }}
          onCancel={close}
        />
      </Modal>
    </>
  );
}
