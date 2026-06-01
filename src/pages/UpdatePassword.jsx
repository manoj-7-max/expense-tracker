import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { KeyRound, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

export default function UpdatePassword() {
  const { updatePassword } = useAuth();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage('');
    
    const { error } = await updatePassword(password);
    
    setLoading(false);
    if (error) {
      setMessage(error.message);
    } else {
      navigate('/');
    }
  };

  return (
    <main className="grid min-h-screen place-items-center bg-slate-50 px-4 py-8 text-slate-950 dark:bg-slate-950 dark:text-slate-100">
      <section className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-8 flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-lg bg-teal-700 text-white">
            <KeyRound size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Update Password</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">Enter your new secure password.</p>
          </div>
        </div>

        <form className="mt-6 space-y-4" onSubmit={submit}>
          <div>
            <label className="text-sm font-semibold">New Password</label>
            <div className="relative mt-2">
              <input className="input pr-10" type={showPassword ? 'text' : 'password'} minLength="6" required value={password} onChange={(e) => setPassword(e.target.value)} />
              <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          {message ? <p className="rounded-lg bg-slate-100 p-3 text-sm text-slate-700 dark:bg-slate-800 dark:text-slate-200">{message}</p> : null}
          <button className="btn-primary w-full" disabled={loading} type="submit">
            Save Password
          </button>
        </form>
      </section>
    </main>
  );
}
