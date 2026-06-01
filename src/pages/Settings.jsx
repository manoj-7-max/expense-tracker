import { useEffect, useState } from 'react';
import { Download, Moon, Sun, Trash2 } from 'lucide-react';
import PageHeader from '../components/PageHeader.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useFinance } from '../context/FinanceContext.jsx';
import { exportTransactionsCsv } from '../lib/csv.js';

export default function Settings() {
  const { deleteAccount, user } = useAuth();
  const { transactions } = useFinance();
  const [dark, setDark] = useState(() => localStorage.getItem('theme') === 'dark');

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  }, [dark]);

  const removeAccount = async () => {
    if (window.confirm('Delete this account and all finance data?')) {
      await deleteAccount();
    }
  };

  return (
    <>
      <PageHeader title="Settings" subtitle={user?.email} />
      <div className="space-y-4 p-4 sm:p-6 lg:p-8">
        <section className="card flex items-center justify-between gap-4 p-4">
          <div>
            <h2 className="font-bold">Dark Mode</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Switch the app theme.</p>
          </div>
          <button className="icon-btn" type="button" onClick={() => setDark((value) => !value)} aria-label="Toggle dark mode">
            {dark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </section>

        <section className="card flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-bold">Export Data</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Download transaction history as CSV.</p>
          </div>
          <button className="btn-secondary" type="button" onClick={() => exportTransactionsCsv(transactions)}>
            <Download size={18} />
            Export CSV
          </button>
        </section>

        <section className="card flex flex-col gap-4 border-rose-200 p-4 dark:border-rose-900 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-bold text-rose-700 dark:text-rose-300">Delete Account</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Removes profile, transactions, goals, and budget rows.</p>
          </div>
          <button className="btn-secondary border-rose-200 text-rose-700 hover:bg-rose-50 dark:border-rose-900 dark:text-rose-300 dark:hover:bg-rose-950" type="button" onClick={removeAccount}>
            <Trash2 size={18} />
            Delete
          </button>
        </section>
      </div>
    </>
  );
}
