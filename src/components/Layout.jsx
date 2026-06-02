import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { BarChart3, Home, LogOut, PiggyBank, ReceiptText, Settings, WalletCards } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
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
  const location = useLocation();

  return (
    <div className="min-h-screen bg-navy-900 text-slate-100 font-sans selection:bg-neon-cyan/30">
      {/* Background glow effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-neon-cyan/5 blur-[120px]"></div>
        <div className="absolute top-[60%] -right-[10%] w-[40%] h-[40%] rounded-full bg-neon-mint/5 blur-[100px]"></div>
      </div>

      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-72 glass-panel border-r border-white/5 px-5 py-6 lg:flex lg:flex-col">
        <div className="flex items-center justify-center py-4">
          <div className="relative w-full flex justify-center">
            {/* Logo Image */}
            <img src="/logo.jpg" alt="Kaasu Kanakku" className="h-32 w-auto object-contain drop-shadow-[0_0_15px_rgba(0,240,255,0.4)] scale-110" onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'grid';
            }} />
            {/* Fallback Icon if logo.jpg doesn't exist */}
            <div className="hidden h-16 w-16 place-items-center rounded-xl bg-neon-cyan/10 border border-neon-cyan/30 text-neon-cyan shadow-glow" style={{ display: 'none' }}>
              <WalletCards size={32} />
            </div>
          </div>
        </div>

        <nav className="mt-10 flex-1 space-y-2">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `group relative flex items-center gap-4 rounded-xl px-4 py-3.5 text-sm font-semibold transition-all duration-300 ${
                  isActive
                    ? 'text-neon-cyan bg-neon-cyan/10'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-white/5'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <motion.div
                      layoutId="active-nav"
                      className="absolute left-0 w-1 h-full bg-neon-cyan rounded-r-full shadow-[0_0_10px_rgba(0,240,255,0.8)]"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  )}
                  <Icon size={20} className={`transition-all duration-300 ${isActive ? 'drop-shadow-[0_0_8px_rgba(0,240,255,0.8)]' : 'group-hover:scale-110'}`} />
                  <span className="tracking-wide">{label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto pt-6 border-t border-white/10">
          <div className="mb-4 px-2">
            <p className="text-xs text-slate-500 truncate">{user?.email}</p>
          </div>
          <button type="button" className="btn-secondary w-full justify-start text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 hover:border-rose-500/30" onClick={signOut}>
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile Top Header */}
      <header className="sticky top-0 z-30 flex items-center justify-center glass-panel border-b border-white/5 px-4 py-3 lg:hidden">
        <div className="relative">
          <img src="/logo.jpg" alt="Kaasu Kanakku" className="h-20 w-auto object-contain drop-shadow-[0_0_10px_rgba(0,240,255,0.4)] scale-110" onError={(e) => {
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'grid';
          }} />
          <div className="hidden h-12 w-12 place-items-center rounded-xl bg-neon-cyan/10 border border-neon-cyan/30 text-neon-cyan shadow-glow" style={{ display: 'none' }}>
            <WalletCards size={24} />
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 pb-24 lg:ml-72 lg:pb-0 min-h-screen flex flex-col">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="flex-1 flex flex-col"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed inset-x-4 bottom-4 z-40 flex justify-between rounded-2xl glass-panel px-2 py-2 lg:hidden border border-neon-cyan/20 shadow-glow-sm">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `relative flex min-w-[64px] flex-col items-center gap-1 rounded-xl px-2 py-2 text-[10px] font-medium transition-all ${
                isActive ? 'text-neon-cyan' : 'text-slate-400'
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.div
                    layoutId="mobile-active"
                    className="absolute inset-0 bg-neon-cyan/10 rounded-xl"
                    transition={{ duration: 0.2 }}
                  />
                )}
                <Icon size={22} className={`relative z-10 ${isActive ? 'drop-shadow-[0_0_8px_rgba(0,240,255,0.8)] scale-110' : ''}`} />
                <span className="relative z-10 w-full truncate text-center mt-1">{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <ChatWidget />
    </div>
  );
}
