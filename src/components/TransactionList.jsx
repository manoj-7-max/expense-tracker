import { useState } from 'react';
import { format, parseISO } from 'date-fns';
import { Edit2, Search, Trash2, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { money } from '../lib/finance.js';
import { categoryColors } from '../lib/constants.js';

export default function TransactionList({ transactions, onEdit, onDelete, compact = false, showFilters = false }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  
  const filteredTransactions = transactions.filter(item => {
    const matchesSearch = (item.category || item.type).toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (item.note || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'All' || item.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['All', ...new Set(transactions.map(t => t.category).filter(Boolean))];

  return (
    <div className="flex flex-col h-full">
      {showFilters && (
        <div className="mb-4 flex flex-col sm:flex-row gap-3 relative z-20">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input 
              type="text" 
              placeholder="Search..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-navy-900/50 border border-white/10 rounded-xl py-2 pl-9 pr-3 text-sm text-slate-200 focus:outline-none focus:border-neon-cyan focus:shadow-glow-sm transition-all placeholder:text-slate-500"
            />
          </div>
          <div className="relative">
            <Filter size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
            <select 
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full sm:w-auto bg-navy-900/50 border border-white/10 rounded-xl py-2 pl-9 pr-8 text-sm text-slate-200 focus:outline-none focus:border-neon-cyan focus:shadow-glow-sm transition-all appearance-none cursor-pointer"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            {/* Custom chevron */}
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none border-[5px] border-transparent border-t-slate-500 mt-1"></div>
          </div>
        </div>
      )}

      {filteredTransactions.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-white/20 p-8 text-center text-sm text-slate-400 glass-panel mt-2">No transactions found.</p>
      ) : (
        <motion.div 
          variants={{
            hidden: { opacity: 0 },
            show: { opacity: 1, transition: { staggerChildren: 0.05 } }
          }} 
          initial="hidden" 
          animate="show" 
          className="space-y-3"
        >
          <AnimatePresence>
            {filteredTransactions.map((item) => {
              const isIncome = item.type === 'income';
              const color = isIncome ? '#00FFCC' : (categoryColors[item.category] || '#FF3366');
              
              return (
                <motion.article 
                  variants={{
                    hidden: { opacity: 0, x: -20 },
                    show: { opacity: 1, x: 0 }
                  }}
                  whileHover={{ scale: 1.01, x: 5 }}
                  exit={{ opacity: 0, x: 20 }}
                  key={item.id} 
                  className="group flex items-center gap-4 py-3 px-4 rounded-xl transition-all duration-300 hover:bg-white/5 border border-transparent hover:border-white/10 relative overflow-hidden"
                >
                  <div className={`absolute left-0 top-0 bottom-0 w-1 opacity-0 group-hover:opacity-100 transition-opacity`} style={{ backgroundColor: color, boxShadow: `0 0 10px ${color}` }}></div>
                  <div 
                    className="grid h-10 w-10 sm:h-12 sm:w-12 shrink-0 place-items-center rounded-xl text-lg font-bold shadow-glow-sm relative z-10"
                    style={{ backgroundColor: `${color}15`, color: color, borderColor: `${color}30`, borderWidth: 1 }}
                  >
                    {isIncome ? '+' : '-'}
                  </div>
                  <div className="min-w-0 flex-1 relative z-10">
                    <p className="truncate text-sm sm:text-base font-semibold text-slate-200">{item.note || item.category || item.type}</p>
                    <p className="truncate text-[10px] sm:text-xs font-medium text-slate-500 mt-0.5">
                      {item.category && item.note ? <span className="text-slate-400 font-semibold">{item.category} · </span> : ''}
                      {format(parseISO(item.date), 'dd MMM yyyy')}
                    </p>
                  </div>
                  <p className="text-sm sm:text-base font-display font-bold tracking-wide relative z-10" style={{ color: color, textShadow: `0 0 10px ${color}40` }}>
                    {isIncome ? '+' : '-'}
                    {money(item.amount)}
                  </p>
                  {!compact ? (
                    <div className="flex gap-2 ml-2 opacity-0 group-hover:opacity-100 transition-opacity relative z-10">
                      <button type="button" className="icon-btn h-8 w-8 hover:text-neon-cyan hover:border-neon-cyan/50" onClick={() => onEdit(item)} aria-label="Edit transaction">
                        <Edit2 size={14} />
                      </button>
                      <button type="button" className="icon-btn h-8 w-8 hover:text-rose-400 hover:border-rose-400/50" onClick={() => onDelete(item.id)} aria-label="Delete transaction">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ) : null}
                </motion.article>
              );
            })}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
