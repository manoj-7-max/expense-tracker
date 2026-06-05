import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { BarChart3, LogOut, PiggyBank, ReceiptText, Settings, WalletCards, LayoutDashboard, Wallet, Sparkles, CreditCard, Tags, Search, Moon, Bell, Crown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext.jsx';
import ChatWidget from './AIChat/ChatWidget.jsx';

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/transactions', label: 'Transactions', icon: ReceiptText },
  { to: '/budgets', label: 'Budgets', icon: Wallet },
  { to: '#ai-advisor', label: 'AI Advisor', icon: Sparkles, badge: 'NEW', action: 'toggleAI' },
  { to: '/reports', label: 'Reports', icon: BarChart3 },
  { to: '/goals', label: 'Goals', icon: PiggyBank },
  { to: '/accounts', label: 'Accounts', icon: CreditCard },
  { to: '/categories', label: 'Categories', icon: Tags },
  { to: '/settings', label: 'Settings', icon: Settings },
];

export default function Layout() {
  const { user, signOut } = useAuth();
  const location = useLocation();

  return (
    <div className="min-h-screen bg-navy-950 text-slate-100 font-sans selection:bg-neon-cyan/30 flex">
      {/* Background glow effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-neon-cyan/5 blur-[120px]"></div>
        <div className="absolute top-[60%] -right-[10%] w-[40%] h-[40%] rounded-full bg-neon-cyan/5 blur-[100px]"></div>
      </div>

      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-64 glass-panel border-r border-white/5 flex-col lg:flex">
        <div className="flex items-center px-6 py-8 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-neon-cyan/10 border border-neon-cyan/30 text-neon-cyan shadow-glow-sm">
              <WalletCards size={24} />
            </div>
            <div>
              <h1 className="text-lg font-display font-bold text-white tracking-wide">Kaasu Kanakku</h1>
              <p className="text-[10px] font-semibold text-neon-cyan tracking-[0.2em]">TRACK • ANALYZE • SAVE</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-1 custom-scrollbar">
          {navItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.to}
              end={item.to === '/'}
              onClick={(e) => {
                if (item.action === 'toggleAI') {
                  e.preventDefault();
                  // Trigger global event or context to open AI Chat
                  window.dispatchEvent(new CustomEvent('toggle-ai-chat'));
                }
              }}
              className={({ isActive }) =>
                `group relative flex items-center justify-between rounded-xl px-3 py-3 text-sm font-medium transition-all duration-300 ${
                  isActive && item.to !== '#ai-advisor'
                    ? 'text-neon-cyan bg-neon-cyan/10'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-white/5'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className="flex items-center gap-3 relative z-10">
                    <item.icon size={18} className={`transition-all duration-300 ${isActive && item.to !== '#ai-advisor' ? 'drop-shadow-[0_0_8px_rgba(0,245,255,0.8)]' : 'group-hover:scale-110 group-hover:text-neon-cyan'}`} />
                    <span className="tracking-wide">{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="relative z-10 rounded-md bg-neon-cyan/20 px-2 py-0.5 text-[10px] font-bold text-neon-cyan border border-neon-cyan/30 shadow-glow-sm">
                      {item.badge}
                    </span>
                  )}
                  {isActive && item.to !== '#ai-advisor' && (
                    <motion.div
                      layoutId="active-nav"
                      className="absolute inset-0 bg-neon-cyan/10 rounded-xl border border-neon-cyan/20 shadow-[inset_0_0_15px_rgba(0,245,255,0.1)]"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Premium Upgrade Card */}
        <div className="p-4 mt-auto border-t border-white/5">
          <div className="relative overflow-hidden rounded-xl bg-navy-900 border border-neon-cyan/30 p-4 shadow-glow-sm group transition-all hover:shadow-glow">
            <div className="absolute -right-4 -top-4 h-16 w-16 rounded-full bg-neon-cyan/10 blur-xl"></div>
            <div className="flex items-center gap-3 mb-2 relative z-10">
              <div className="p-2 rounded-lg bg-neon-cyan/20 text-neon-cyan">
                <Crown size={18} />
              </div>
              <h3 className="text-sm font-bold text-white">Go Premium</h3>
            </div>
            <p className="text-xs text-slate-400 mb-3 relative z-10">Unlock advanced analytics and unlimited AI advice.</p>
            <button className="w-full rounded-lg bg-neon-cyan py-2 text-xs font-bold text-navy-950 transition-all hover:bg-white hover:shadow-glow relative z-10">
              Upgrade Now
            </button>
          </div>
          
          <div className="mt-4 flex items-center justify-between px-2">
            <div className="flex items-center gap-2 truncate">
              <div className="h-8 w-8 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-300 border border-white/10 shrink-0">
                {user?.email?.charAt(0).toUpperCase() || 'U'}
              </div>
              <p className="text-xs text-slate-400 truncate">{user?.email}</p>
            </div>
            <button type="button" className="text-slate-500 hover:text-rose-400 transition-colors p-1" onClick={signOut} title="Logout">
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen relative z-10 lg:ml-64 w-full">
        {/* Top Navbar (Desktop) */}
        <header className="hidden lg:flex items-center justify-between h-20 px-8 glass-panel border-b border-white/5 sticky top-0 z-30">
          <div className="relative w-96">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
            <input 
              type="text" 
              placeholder="Search transactions, accounts..." 
              className="w-full bg-navy-900/50 border border-white/10 rounded-full py-2.5 pl-11 pr-4 text-sm text-slate-200 focus:outline-none focus:border-neon-cyan focus:shadow-glow-sm transition-all placeholder:text-slate-500"
            />
          </div>

          <div className="flex items-center gap-6">
            <button className="text-slate-400 hover:text-neon-cyan transition-colors">
              <Moon size={20} />
            </button>
            <button className="relative text-slate-400 hover:text-neon-cyan transition-colors">
              <Bell size={20} />
              <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-neon-cyan border-2 border-navy-900"></span>
            </button>
            
            <div className="h-6 w-px bg-white/10"></div>
            
            <div className="flex items-center gap-3 cursor-pointer group">
              <div className="text-right">
                <p className="text-sm font-semibold text-slate-200 group-hover:text-white transition-colors">Karthik</p>
                <div className="flex items-center gap-1">
                  <Crown size={10} className="text-amber-400" />
                  <span className="text-[10px] font-medium text-amber-400">Premium</span>
                </div>
              </div>
              <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-neon-cyan to-blue-500 p-[2px]">
                <div className="h-full w-full rounded-full border-2 border-navy-900 bg-slate-800 overflow-hidden">
                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=Karthik`} alt="Avatar" className="h-full w-full object-cover" />
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Mobile Header */}
        <header className="flex items-center justify-between glass-panel border-b border-white/5 px-4 py-4 lg:hidden sticky top-0 z-30">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-neon-cyan/10 border border-neon-cyan/30 text-neon-cyan">
              <WalletCards size={18} />
            </div>
            <h1 className="text-sm font-display font-bold text-white tracking-wide">Kaasu Kanakku</h1>
          </div>
          <div className="flex h-8 w-8 rounded-full bg-gradient-to-tr from-neon-cyan to-blue-500 p-[2px]">
            <div className="h-full w-full rounded-full border border-navy-900 bg-slate-800 overflow-hidden">
              <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=Karthik`} alt="Avatar" className="h-full w-full object-cover" />
            </div>
          </div>
        </header>

        <main className="flex-1 w-full pb-24 lg:pb-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed inset-x-4 bottom-4 z-40 flex justify-between rounded-2xl glass-panel px-2 py-2 lg:hidden border border-neon-cyan/20 shadow-glow-sm bg-navy-900/90 backdrop-blur-xl">
        {navItems.slice(0, 5).map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            onClick={(e) => {
              if (item.action === 'toggleAI') {
                e.preventDefault();
                window.dispatchEvent(new CustomEvent('toggle-ai-chat'));
              }
            }}
            className={({ isActive }) =>
              `relative flex min-w-[56px] flex-col items-center gap-1 rounded-xl px-2 py-2 text-[10px] font-medium transition-all ${
                isActive && item.to !== '#ai-advisor' ? 'text-neon-cyan' : 'text-slate-400'
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && item.to !== '#ai-advisor' && (
                  <motion.div
                    layoutId="mobile-active"
                    className="absolute inset-0 bg-neon-cyan/10 rounded-xl border border-neon-cyan/20"
                    transition={{ duration: 0.2 }}
                  />
                )}
                <item.icon size={20} className={`relative z-10 ${isActive && item.to !== '#ai-advisor' ? 'drop-shadow-[0_0_8px_rgba(0,245,255,0.8)] scale-110' : ''}`} />
                <span className="relative z-10 w-full truncate text-center mt-1">{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <ChatWidget />
    </div>
  );
}
