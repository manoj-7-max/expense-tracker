import { motion } from 'framer-motion';

export default function PageHeader({ title, subtitle, action }) {
  return (
    <motion.header 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-4 px-4 py-6 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8 mt-4"
    >
      <div>
        <h1 className="text-3xl font-display font-bold tracking-tight text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-neon-cyan/80 font-medium tracking-wide">{subtitle}</p>}
      </div>
      {action && (
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          {action}
        </motion.div>
      )}
    </motion.header>
  );
}
