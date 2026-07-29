import { motion } from "framer-motion";

/**
 * KPI summary card used across the Dashboard.
 *
 * @param {string} label - metric name, e.g. "Total Revenue"
 * @param {string} value - formatted metric value, e.g. "₹4.2L"
 * @param {string} [change] - formatted delta, e.g. "+12.4%"
 * @param {"up"|"down"|"flat"} [trend] - direction of the delta
 * @param {React.ElementType} icon - lucide-style icon component
 */
export default function KpiCard({ label, value, change, trend = "flat", icon: Icon }) {
  const trendColor =
    trend === "up"
      ? "text-emerald-400"
      : trend === "down"
      ? "text-rose-400"
      : "text-slate-400";

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="card flex flex-col gap-4 p-5"
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-slate-400">{label}</span>
        {Icon && (
          <span className="rounded-lg bg-primary-600/15 p-2 text-primary-300">
            <Icon size={18} />
          </span>
        )}
      </div>
      <div className="flex items-end justify-between">
        <span className="text-2xl font-bold text-white">{value}</span>
        {change && (
          <span className={`text-xs font-semibold ${trendColor}`}>{change}</span>
        )}
      </div>
    </motion.div>
  );
}
