import { motion } from "framer-motion";

/**
 * Temporary placeholder for pages that will be built in later phases
 * (Products, Analytics, Reports, etc). Keeps routing fully functional
 * end-to-end while those pages are still pending.
 */
export default function PlaceholderPage({ title, description }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="card flex min-h-[60vh] flex-col items-center justify-center gap-3 p-10 text-center"
    >
      <span className="rounded-full bg-primary-600/15 px-3 py-1 text-xs font-semibold text-primary-300">
        Coming in a later phase
      </span>
      <h2 className="text-2xl font-bold text-white">{title}</h2>
      <p className="max-w-md text-sm text-slate-400">{description}</p>
    </motion.div>
  );
}
