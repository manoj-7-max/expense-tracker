import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Modal({ title, open, onClose, children }) {
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 grid place-items-end bg-navy-900/80 backdrop-blur-sm p-0 sm:place-items-center sm:p-4">
          <motion.section 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="max-h-[92vh] w-full overflow-auto rounded-t-2xl sm:rounded-2xl bg-navy-800 border border-neon-cyan/20 p-5 sm:p-7 shadow-[0_0_30px_rgba(0,240,255,0.1)] sm:max-w-xl"
          >
            <div className="mb-6 flex items-center justify-between gap-4 border-b border-white/10 pb-4">
              <h2 className="text-xl font-display font-bold text-white tracking-wide">{title}</h2>
              <button type="button" className="icon-btn hover:text-rose-400 hover:border-rose-400/30" onClick={onClose} aria-label="Close">
                <X size={20} />
              </button>
            </div>
            {children}
          </motion.section>
        </div>
      )}
    </AnimatePresence>
  );
}
