import { motion } from 'framer-motion';

export default function StatCard({ title, value, icon: Icon, tone = 'cyan' }) {
  const tones = {
    cyan: 'bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/30 shadow-[0_0_10px_rgba(0,240,255,0.2)]',
    mint: 'bg-neon-mint/10 text-neon-mint border border-neon-mint/30 shadow-[0_0_10px_rgba(0,255,204,0.2)]',
    rose: 'bg-neon-red/10 text-neon-red border border-neon-red/30 shadow-[0_0_10px_rgba(255,51,102,0.2)]',
    amber: 'bg-amber-400/10 text-amber-400 border border-amber-400/30 shadow-[0_0_10px_rgba(251,191,36,0.2)]',
  };

  return (
    <motion.section 
      whileHover={{ y: -5, scale: 1.02 }}
      className="card p-5 group cursor-pointer border-t border-white/10"
    >
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-slate-400 group-hover:text-slate-300 transition-colors">{title}</p>
        {Icon ? (
          <div className={`grid h-12 w-12 place-items-center rounded-xl transition-all duration-300 group-hover:shadow-glow ${tones[tone]}`}>
            <Icon size={22} className="drop-shadow-[0_0_8px_currentColor]" />
          </div>
        ) : null}
      </div>
      <p className="mt-4 text-3xl font-display font-bold tracking-tight text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">{value}</p>
      
      {/* Decorative Glow Line */}
      <div className={`absolute bottom-0 left-0 h-1 w-0 transition-all duration-500 group-hover:w-full ${tones[tone].split(' ')[1].replace('text-', 'bg-')}`}></div>
    </motion.section>
  );
}
