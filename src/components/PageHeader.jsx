export default function PageHeader({ title, subtitle, action }) {
  return (
    <header className="flex flex-col gap-4 border-b border-slate-200 bg-white px-4 py-5 dark:border-slate-800 dark:bg-slate-900 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-950 dark:text-white">{title}</h1>
        {subtitle ? <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{subtitle}</p> : null}
      </div>
      {action}
    </header>
  );
}
