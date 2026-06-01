import { useState } from 'react';
import { Eye, EyeOff, WalletCards } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

export default function Login() {
  const { signIn, signUp, configured, signInWithGoogle, resetPassword } = useAuth();
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage('');
    let error = null;

    if (mode === 'login') {
      const res = await signIn(email, password);
      error = res?.error;
    } else if (mode === 'signup') {
      const res = await signUp(email, password);
      error = res?.error;
    } else if (mode === 'reset') {
      const res = await resetPassword(email);
      error = res?.error;
    }

    setLoading(false);
    if (error) setMessage(error.message);
    else if (mode === 'signup') setMessage('Account created. Check your email if confirmations are enabled.');
    else if (mode === 'reset') setMessage('Password reset link sent to your email.');
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
          
          {mode !== 'reset' && (
            <div>
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold">Password</label>
                {mode === 'login' && (
                  <button type="button" onClick={() => setMode('reset')} className="text-sm font-semibold text-teal-700 hover:underline dark:text-teal-300">
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative mt-2">
                <input className="input pr-10" type={showPassword ? 'text' : 'password'} minLength="6" required value={password} onChange={(e) => setPassword(e.target.value)} />
                <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
          )}
          
          {message ? <p className="rounded-lg bg-slate-100 p-3 text-sm text-slate-700 dark:bg-slate-800 dark:text-slate-200">{message}</p> : null}
          <button className="btn-primary w-full" disabled={!configured || loading} type="submit">
            {mode === 'login' ? 'Login' : mode === 'signup' ? 'Create account' : 'Send Reset Link'}
          </button>
        </form>

        {mode !== 'reset' && (
          <>
            <div className="my-5 flex items-center gap-3 before:h-px before:flex-1 before:bg-slate-200 after:h-px after:flex-1 after:bg-slate-200 dark:before:bg-slate-800 dark:after:bg-slate-800">
              <span className="text-xs font-medium uppercase text-slate-500 dark:text-slate-400">Or</span>
            </div>
            <button className="btn-secondary mb-5 w-full justify-center" type="button" disabled={!configured || loading} onClick={signInWithGoogle}>
              <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Continue with Google
            </button>
          </>
        )}

        <button className="mt-2 w-full text-sm font-semibold text-teal-700 dark:text-teal-300" type="button" onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setMessage(''); }}>
          {mode === 'login' ? 'Need an account? Sign up' : mode === 'signup' ? 'Already have an account? Login' : 'Back to Login'}
        </button>
      </section>
    </main>
  );
}
