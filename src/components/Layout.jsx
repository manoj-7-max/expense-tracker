import { NavLink, Outlet } from 'react-router-dom';
import { BarChart3, Home, LogOut, PiggyBank, ReceiptText, Settings, WalletCards } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import ChatWidget from './AIChat/ChatWidget.jsx';

const navItems = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/transactions', label: 'Transactions', icon: ReceiptText },
  { to: '/goals', label: 'Goals', icon: PiggyBank },
  { to: '/reports', label: 'Reports', icon: BarChart3 },
  { to: '/settings', label: 'Settings', icon: Settings },
];

export default function Layout() {
  const { user, signOut } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950 dark:bg-slate-950 dark:text-slate-100">
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-72 border-r border-slate-200 bg-white px-5 py-6 dark:border-slate-800 dark:bg-slate-900 lg:block">
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-lg bg-teal-700 text-white">
            <WalletCards size={22} />
          </div>
          <div>
            <p className="text-lg font-bold">Money Manager</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">{user?.email}</p>
          </div>
        </div>

        <nav className="mt-8 space-y-2">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-semibold transition ${
                  isActive
                    ? 'bg-teal-50 text-teal-800 dark:bg-teal-950 dark:text-teal-200'
                    : 'text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800'
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>

        <button type="button" className="btn-secondary mt-8 w-full" onClick={signOut}>
          <LogOut size={18} />
          Logout
        </button>
      </aside>

      <main className="pb-24 lg:ml-72 lg:pb-0">
        <Outlet />
      </main>

      <nav className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-5 border-t border-slate-200 bg-white/95 px-2 py-2 backdrop-blur dark:border-slate-800 dark:bg-slate-900/95 lg:hidden">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex min-w-0 flex-col items-center gap-1 rounded-lg px-1 py-2 text-[11px] font-semibold ${
                isActive ? 'text-teal-700 dark:text-teal-300' : 'text-slate-500 dark:text-slate-400'
              }`
            }
          >
            <Icon size={20} />
            <span className="w-full truncate text-center">{label}</span>
          </NavLink>
        ))}
      </nav>

      <ChatWidget />
    </div>
  );
}
