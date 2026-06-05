import { motion } from 'framer-motion';
import { LineChart, Line, ResponsiveContainer, YAxis } from 'recharts';

export default function StatCard({ title, value, icon: Icon, tone = 'cyan', trend, data = [] }) {
  const tones = {
    cyan: {
      bg: 'bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/30 shadow-[0_0_10px_rgba(0,245,255,0.2)]',
      color: '#00F5FF',
      trendBg: 'bg-neon-cyan/20 text-neon-cyan'
    },
    mint: {
      bg: 'bg-neon-mint/10 text-neon-mint border border-neon-mint/30 shadow-[0_0_10px_rgba(0,255,204,0.2)]',
      color: '#00FFCC',
      trendBg: 'bg-neon-mint/20 text-neon-mint'
    },
    rose: {
      bg: 'bg-neon-red/10 text-neon-red border border-neon-red/30 shadow-[0_0_10px_rgba(255,51,102,0.2)]',
      color: '#FF3366',
      trendBg: 'bg-neon-red/20 text-neon-red'
    },
    amber: {
      bg: 'bg-amber-400/10 text-amber-400 border border-amber-400/30 shadow-[0_0_10px_rgba(251,191,36,0.2)]',
      color: '#FBBF24',
      trendBg: 'bg-amber-400/20 text-amber-400'
    },
  };

  const chartData = data.map((val, i) => ({ value: val, index: i }));

  return (
    <motion.section 
      whileHover={{ y: -5, scale: 1.02 }}
      className="card p-5 group cursor-pointer border-t border-white/5 relative overflow-hidden"
    >
      <div className="flex items-center justify-between gap-3 relative z-10">
        <div>
          <p className="text-sm font-medium text-slate-400 group-hover:text-slate-300 transition-colors">{title}</p>
          <p className="mt-2 text-2xl lg:text-3xl font-display font-bold tracking-tight text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">{value}</p>
        </div>
        {Icon && (
          <div className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl transition-all duration-300 group-hover:shadow-glow ${tones[tone].bg}`}>
            <Icon size={22} className="drop-shadow-[0_0_8px_currentColor]" />
          </div>
        )}
      </div>

      <div className="mt-4 flex items-end justify-between relative z-10">
        {trend && (
          <div className={`px-2 py-1 rounded-md text-xs font-bold ${tones[tone].trendBg} border border-current/20`}>
            {trend}
          </div>
        )}
        
        {data.length > 0 && (
          <div className="h-10 w-24 opacity-60 group-hover:opacity-100 transition-opacity">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <YAxis domain={['dataMin', 'dataMax']} hide />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke={tones[tone].color} 
                  strokeWidth={2} 
                  dot={false}
                  style={{ filter: `drop-shadow(0px 0px 4px ${tones[tone].color}80)` }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Decorative Glow Line */}
      <div className={`absolute bottom-0 left-0 h-1 w-0 transition-all duration-500 group-hover:w-full ${tones[tone].bg.split(' ')[0]}`}></div>
    </motion.section>
  );
}
