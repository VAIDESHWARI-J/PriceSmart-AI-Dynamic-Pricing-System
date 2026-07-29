import { useEffect, useState } from 'react'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts'
import { IndianRupee, TrendingUp, Sparkles, Package, CheckCircle2 } from 'lucide-react'
import Topbar from '../components/Topbar.jsx'
import StatCard from '../components/StatCard.jsx'
import api from '../api/axios.js'
import { revenueTrend, priceChangeOverview } from '../data/mockData.js'

const AI_PRODUCT = {
  name: 'MacBook Air M2',
  category: 'Electronics',
  current_price: 104990,
  competitor_price: 109990,
  demand_score: 85,
  stock_quantity: 18,
  sales_history: 210,
  customer_visits: 9800,
  season_factor: 1.2,
}

export default function Dashboard() {
  const [recommendation, setRecommendation] = useState(null)

  useEffect(() => {
    api
      .post('/predict-price', AI_PRODUCT)
      .then((res) => setRecommendation(res.data))
      .catch(() => {
        // Fallback demo values if backend isn't running
        setRecommendation({
          recommended_price: 97490,
          price_change_pct: -7.14,
          expected_profit_increase: 12.6,
          expected_revenue_increase: 8.3,
          reasons: [
            'High demand this week',
            'Low stock availability',
            'Competitor price changed',
            'Festival season',
          ],
        })
      })
  }, [])

  return (
    <div>
      <Topbar title="AI Pricing Control Center" subtitle="Real-time overview of your dynamic pricing engine" />

      <main className="p-6 space-y-6">
        {/* Top stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <StatCard icon={IndianRupee} label="Total Revenue" value="₹28,45,320" delta="+8.3%" accent="green" />
          <StatCard icon={TrendingUp} label="Total Profit" value="₹7,32,850" delta="+12.6%" accent="purple" />
          <StatCard icon={Sparkles} label="AI Price Updates" value="152" delta="+21" accent="blue" />
          <StatCard icon={Package} label="Products Tracked" value="312" delta="+6" accent="green" />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          <div className="glass-card p-5 xl:col-span-2">
            <h3 className="font-semibold text-white mb-4">Revenue &amp; Profit Trend</h3>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={revenueTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} tickFormatter={(v) => `₹${(v / 100000).toFixed(0)}L`} />
                <Tooltip
                  contentStyle={{ background: '#0b1120', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12 }}
                  formatter={(value) => `₹${value.toLocaleString('en-IN')}`}
                />
                <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2.5} dot={false} name="Revenue" />
                <Line type="monotone" dataKey="profit" stroke="#22e6a3" strokeWidth={2.5} dot={false} name="Profit" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="glass-card p-5">
            <h3 className="font-semibold text-white mb-4">Price Change Overview</h3>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={priceChangeOverview}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={3}
                >
                  {priceChangeOverview.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: '#0b1120', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12 }} />
                <Legend
                  verticalAlign="bottom"
                  formatter={(value) => <span className="text-slate-300 text-xs">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI recommendation */}
        <div className="glass-card p-6">
          <div className="flex items-center gap-2 mb-5">
            <Sparkles size={18} className="text-aiGreen" />
            <h3 className="font-semibold text-white">AI Recommendation</h3>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">Product</p>
              <p className="text-lg font-bold text-white">{AI_PRODUCT.name}</p>

              <div className="flex gap-6 mt-4">
                <div>
                  <p className="text-xs text-slate-400">Current Price</p>
                  <p className="text-lg font-semibold text-slate-200">
                    ₹{AI_PRODUCT.current_price.toLocaleString('en-IN')}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">AI Recommended Price</p>
                  <p className="text-lg font-bold text-aiGreen">
                    ₹{recommendation ? Math.round(recommendation.recommended_price).toLocaleString('en-IN') : '—'}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wide mb-2">Expected Impact</p>
              <div className="space-y-2">
                <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-white/5">
                  <span className="text-sm text-slate-300">Profit Increase</span>
                  <span className="badge badge-green">
                    +{recommendation?.expected_profit_increase ?? 12.6}%
                  </span>
                </div>
                <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-white/5">
                  <span className="text-sm text-slate-300">Revenue Increase</span>
                  <span className="badge badge-blue">
                    +{recommendation?.expected_revenue_increase ?? 8.3}%
                  </span>
                </div>
              </div>
            </div>

            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wide mb-2">Reason</p>
              <ul className="space-y-1.5">
                {(recommendation?.reasons ?? []).map((reason) => (
                  <li key={reason} className="flex items-center gap-2 text-sm text-slate-300">
                    <CheckCircle2 size={15} className="text-aiGreen shrink-0" />
                    {reason}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
