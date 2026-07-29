import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import KpiCard from "../../components/common/KpiCard.jsx";
import {
  IconPriceTag,
  IconTrendUp,
  IconProducts,
  IconCompetitor,
} from "../../components/common/Icons.jsx";

// Mock data — replaced by live API data once the backend + AI service
// integration lands in later phases.
const priceTrendData = [
  { day: "Mon", avgPrice: 412, competitorAvg: 425 },
  { day: "Tue", avgPrice: 418, competitorAvg: 422 },
  { day: "Wed", avgPrice: 405, competitorAvg: 419 },
  { day: "Thu", avgPrice: 421, competitorAvg: 415 },
  { day: "Fri", avgPrice: 430, competitorAvg: 428 },
  { day: "Sat", avgPrice: 438, competitorAvg: 433 },
  { day: "Sun", avgPrice: 445, competitorAvg: 440 },
];

const demandData = [
  { day: "Mon", demand: 220 },
  { day: "Tue", demand: 260 },
  { day: "Wed", demand: 240 },
  { day: "Thu", demand: 310 },
  { day: "Fri", demand: 350 },
  { day: "Sat", demand: 410 },
  { day: "Sun", demand: 380 },
];

const recentChanges = [
  { product: "Wireless Earbuds X200", old: 1899, next: 1749, reason: "AI Recommendation", time: "2h ago" },
  { product: "Smart Fitness Band", old: 2499, next: 2299, reason: "Competitor Adjustment", time: "5h ago" },
  { product: "4K Action Camera", old: 8999, next: 9499, reason: "Manual", time: "1d ago" },
  { product: "Gaming Mechanical Keyboard", old: 3299, next: 3099, reason: "AI Recommendation", time: "1d ago" },
];

function reasonBadge(reason) {
  const map = {
    "AI Recommendation": "bg-primary-600/15 text-primary-300",
    "Competitor Adjustment": "bg-amber-500/15 text-amber-300",
    Manual: "bg-slate-500/15 text-slate-300",
  };
  return map[reason] || "bg-slate-500/15 text-slate-300";
}

export default function Dashboard() {
  return (
    <div className="flex flex-col gap-6">
      {/* KPI Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          label="Total Products"
          value="128"
          change="+6 this week"
          trend="up"
          icon={IconProducts}
        />
        <KpiCard
          label="Avg. Margin"
          value="24.8%"
          change="+1.2%"
          trend="up"
          icon={IconPriceTag}
        />
        <KpiCard
          label="Revenue (30d)"
          value="₹18.4L"
          change="+9.6%"
          trend="up"
          icon={IconTrendUp}
        />
        <KpiCard
          label="Active AI Recommendations"
          value="17"
          change="4 pending review"
          trend="flat"
          icon={IconCompetitor}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <div className="card col-span-1 p-5 xl:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-white">Price Trend — You vs Competitors</h3>
              <p className="text-xs text-slate-500">Last 7 days, average across all products</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={priceTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
              <XAxis dataKey="day" stroke="#64748b" fontSize={12} tickLine={false} />
              <YAxis stroke="#64748b" fontSize={12} tickLine={false} />
              <Tooltip
                contentStyle={{
                  background: "#1c1f34",
                  border: "1px solid #ffffff1a",
                  borderRadius: 12,
                  fontSize: 12,
                }}
              />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Line
                type="monotone"
                dataKey="avgPrice"
                name="Your Avg. Price"
                stroke="#6366f1"
                strokeWidth={2.5}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="competitorAvg"
                name="Competitor Avg."
                stroke="#f59e0b"
                strokeWidth={2.5}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="card col-span-1 p-5">
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-white">Demand — Last 7 Days</h3>
            <p className="text-xs text-slate-500">Units forecasted across catalog</p>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={demandData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
              <XAxis dataKey="day" stroke="#64748b" fontSize={12} tickLine={false} />
              <YAxis stroke="#64748b" fontSize={12} tickLine={false} />
              <Tooltip
                contentStyle={{
                  background: "#1c1f34",
                  border: "1px solid #ffffff1a",
                  borderRadius: 12,
                  fontSize: 12,
                }}
              />
              <Bar dataKey="demand" name="Predicted Demand" fill="#6366f1" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Price Changes */}
      <div className="card p-5">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-white">Recent Price Changes</h3>
          <button type="button" className="text-xs font-medium text-primary-400 hover:text-primary-300">
            View all
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-white/5 text-xs uppercase tracking-wide text-slate-500">
                <th className="pb-3 font-medium">Product</th>
                <th className="pb-3 font-medium">Old Price</th>
                <th className="pb-3 font-medium">New Price</th>
                <th className="pb-3 font-medium">Reason</th>
                <th className="pb-3 font-medium text-right">Changed</th>
              </tr>
            </thead>
            <tbody>
              {recentChanges.map((row) => (
                <tr key={row.product} className="border-b border-white/5 last:border-0">
                  <td className="py-3 font-medium text-slate-200">{row.product}</td>
                  <td className="py-3 text-slate-400">₹{row.old.toLocaleString("en-IN")}</td>
                  <td className="py-3 font-semibold text-white">
                    ₹{row.next.toLocaleString("en-IN")}
                  </td>
                  <td className="py-3">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${reasonBadge(row.reason)}`}>
                      {row.reason}
                    </span>
                  </td>
                  <td className="py-3 text-right text-slate-500">{row.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
