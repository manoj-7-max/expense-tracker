import { X } from 'lucide-react';

export default function Modal({ title, open, onClose, children }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-end bg-slate-950/50 p-0 sm:place-items-center sm:p-4">
      <section className="max-h-[92vh] w-full overflow-auto rounded-t-lg bg-white p-4 shadow-2xl dark:bg-slate-900 sm:max-w-xl sm:rounded-lg sm:p-6">
        <div className="mb-5 flex items-center justify-between gap-4">
          <h2 className="text-lg font-bold">{title}</h2>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>
        {children}
      </section>
    </div>
  );
}
