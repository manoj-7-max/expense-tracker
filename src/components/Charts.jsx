import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { categorySeries, monthlySeries } from '../lib/finance.js';

const tooltipStyle = {
  borderRadius: 12,
  border: '1px solid rgba(0, 245, 255, 0.2)',
  backgroundColor: '#0B1220',
  color: '#f8fafc',
  fontSize: 13,
  boxShadow: '0 0 15px rgba(0, 245, 255, 0.15)',
};

export function IncomeExpenseChart({ transactions }) {
  const data = monthlySeries(transactions);

  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#00FFCC" stopOpacity={0.3}/>
            <stop offset="95%" stopColor="#00FFCC" stopOpacity={0}/>
          </linearGradient>
          <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#FF3366" stopOpacity={0.3}/>
            <stop offset="95%" stopColor="#FF3366" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
        <XAxis dataKey="month" tick={{ fill: '#94a3b8', fontSize: 12 }} stroke="rgba(255,255,255,0.1)" />
        <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} stroke="rgba(255,255,255,0.1)" />
        <Tooltip contentStyle={tooltipStyle} itemStyle={{ fontWeight: 600 }} />
        <Legend wrapperStyle={{ paddingTop: '10px' }} />
        <Area type="monotone" dataKey="income" stroke="#00FFCC" strokeWidth={2} fillOpacity={1} fill="url(#colorIncome)" />
        <Area type="monotone" dataKey="expense" stroke="#FF3366" strokeWidth={2} fillOpacity={1} fill="url(#colorExpense)" />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function CategoryChart({ transactions }) {
  const data = categorySeries(transactions);

  return (
    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="name" innerRadius={60} outerRadius={85} paddingAngle={4} stroke="rgba(0,0,0,0)">
          {data.map((entry) => (
            <Cell key={entry.name} fill={entry.fill} style={{ filter: `drop-shadow(0px 0px 4px ${entry.fill}80)` }} />
          ))}
        </Pie>
        <Tooltip contentStyle={tooltipStyle} itemStyle={{ fontWeight: 600, color: '#fff' }} />
        <Legend wrapperStyle={{ paddingTop: '10px' }} />
      </PieChart>
    </ResponsiveContainer>
  );
}

export function SavingsGrowthChart({ transactions }) {
  const data = monthlySeries(transactions).map(item => ({
    month: item.month,
    savings: item.income - item.expense
  }));

  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
        <XAxis dataKey="month" tick={{ fill: '#94a3b8', fontSize: 12 }} stroke="rgba(255,255,255,0.1)" />
        <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} stroke="rgba(255,255,255,0.1)" />
        <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'rgba(255,255,255,0.02)' }} />
        <Bar dataKey="savings" fill="#00F5FF" radius={[4, 4, 0, 0]} style={{ filter: `drop-shadow(0px 0px 8px rgba(0,245,255,0.4))` }} />
      </BarChart>
    </ResponsiveContainer>
  );
}
