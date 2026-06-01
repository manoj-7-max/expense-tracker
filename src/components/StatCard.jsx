export default function StatCard({ title, value, icon: Icon, tone = 'teal' }) {
  const tones = {
    teal: 'bg-teal-50 text-teal-700 dark:bg-teal-950 dark:text-teal-300',
    sky: 'bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-300',
    rose: 'bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300',
    amber: 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300',
  };

  return (
    <section className="card p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
        {Icon ? (
          <div className={`grid h-10 w-10 place-items-center rounded-lg ${tones[tone]}`}>
            <Icon size={20} />
          </div>
        ) : null}
      </div>
      <p className="mt-4 text-2xl font-bold tracking-tight">{value}</p>
    </section>
  );
}
