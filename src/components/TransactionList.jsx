import { format, parseISO } from 'date-fns';
import { Edit2, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { money } from '../lib/finance.js';
import { categoryColors } from '../lib/constants.js';

export default function TransactionList({ transactions, onEdit, onDelete, compact = false }) {
  if (!transactions.length) {
    return <p className="rounded-2xl border border-dashed border-white/20 p-8 text-center text-sm text-slate-400 glass-panel">No transactions yet.</p>;
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };
  
  const itemAnim = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0 }
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-3">
      {transactions.map((item) => {
        const isIncome = item.type === 'income';
        const color = isIncome ? '#00FFCC' : (categoryColors[item.category] || '#FF3366');
        
        return (
          <motion.article 
            variants={itemAnim}
            whileHover={{ scale: 1.01, x: 5 }}
            key={item.id} 
            className="group flex items-center gap-4 py-3 px-4 rounded-xl transition-all duration-300 hover:bg-white/5 border border-transparent hover:border-white/10"
          >
            <div 
              className="grid h-12 w-12 shrink-0 place-items-center rounded-xl text-lg font-bold shadow-glow-sm"
              style={{ backgroundColor: `${color}15`, color: color, borderColor: `${color}30`, borderWidth: 1 }}
            >
              {isIncome ? '+' : '-'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-base font-semibold text-slate-200">{item.category || item.type}</p>
              <p className="truncate text-xs font-medium text-slate-500 mt-0.5">
                {format(parseISO(item.date), 'dd MMM yyyy')}
                {item.note ? <span className="text-slate-400"> · {item.note}</span> : ''}
              </p>
            </div>
            <p className="text-base font-display font-bold tracking-wide" style={{ color: color, textShadow: `0 0 10px ${color}40` }}>
              {isIncome ? '+' : '-'}
              {money(item.amount)}
            </p>
            {!compact ? (
              <div className="flex gap-2 ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button type="button" className="icon-btn hover:text-neon-cyan hover:border-neon-cyan/50" onClick={() => onEdit(item)} aria-label="Edit transaction">
                  <Edit2 size={16} />
                </button>
                <button type="button" className="icon-btn hover:text-rose-400 hover:border-rose-400/50" onClick={() => onDelete(item.id)} aria-label="Delete transaction">
                  <Trash2 size={16} />
                </button>
              </div>
            ) : null}
          </motion.article>
        );
      })}
    </motion.div>
  );
}
