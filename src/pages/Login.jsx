import { useState } from 'react';
import { WalletCards } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

export default function Login() {
  const { signIn, signUp, configured } = useAuth();
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage('');
    const { error } = mode === 'login' ? await signIn(email, password) : await signUp(email, password);
    setLoading(false);
    if (error) setMessage(error.message);
    else if (mode === 'signup') setMessage('Account created. Check your email if confirmations are enabled.');
  };

  return (
    <main className="grid min-h-screen place-items-center bg-slate-50 px-4 py-8 text-slate-950 dark:bg-slate-950 dark:text-slate-100">
      <section className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-8 flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-lg bg-teal-700 text-white">
            <WalletCards size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Money Manager</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">Track, budget, save, repeat.</p>
          </div>
        </div>

        {!configured ? (
          <div className="rounded-lg bg-amber-50 p-4 text-sm text-amber-800 dark:bg-amber-950 dark:text-amber-100">
            Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` to `.env` to enable authentication.
          </div>
        ) : null}

        <form className="mt-6 space-y-4" onSubmit={submit}>
          <label className="block text-sm font-semibold">
            Email
            <input className="input mt-2" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </label>
          <label className="block text-sm font-semibold">
            Password
            <input className="input mt-2" type="password" minLength="6" required value={password} onChange={(e) => setPassword(e.target.value)} />
          </label>
          {message ? <p className="rounded-lg bg-slate-100 p-3 text-sm text-slate-700 dark:bg-slate-800 dark:text-slate-200">{message}</p> : null}
          <button className="btn-primary w-full" disabled={!configured || loading} type="submit">
            {mode === 'login' ? 'Login' : 'Create account'}
          </button>
        </form>

        <button className="mt-5 w-full text-sm font-semibold text-teal-700 dark:text-teal-300" type="button" onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}>
          {mode === 'login' ? 'Need an account? Sign up' : 'Already have an account? Login'}
        </button>
      </section>
    </main>
  );
}
