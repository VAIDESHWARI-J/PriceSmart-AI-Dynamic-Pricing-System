import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Sparkles, CheckCircle2 } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'
import Topbar from '../components/Topbar.jsx'
import api from '../api/axios.js'
import { mockProducts } from '../data/mockData.js'

const FALLBACK_HISTORY = Array.from({ length: 14 }).map((_, i) => ({
  date: `Day ${i + 1}`,
  price: 100000 + Math.round(Math.sin(i / 2) * 4000 + i * 300),
}))

const FALLBACK_SALES = Array.from({ length: 6 }).map((_, i) => ({
  month: ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'][i],
  units: 30 + Math.round(Math.random() * 60),
}))

export default function ProductDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [data, setData] = useState(null)
  const [prediction, setPrediction] = useState(null)
  const [applying, setApplying] = useState(false)
  const [applied, setApplied] = useState(false)

  useEffect(() => {
    api
      .get(`/product/${id}`)
      .then((res) => setData(res.data))
      .catch(() => {
        const fallback = mockProducts.find((p) => p.id === Number(id)) || mockProducts[0]
        setData({
          product: {
            ...fallback,
            competitor_price: Math.round(fallback.current_price * 1.03),
            demand_score: 72,
            sales_history: 210,
            customer_visits: 5400,
            season_factor: 1.05,
          },
          price_history: FALLBACK_HISTORY,
          competitor: { amazon: Math.round(fallback.current_price * 1.02), flipkart: Math.round(fallback.current_price * 1.01) },
        })
      })
  }, [id])

  useEffect(() => {
    if (!data) return
    const p = data.product
    api
      .post('/predict-price', {
        product_id: p.id,
        category: p.category,
        current_price: p.current_price,
        competitor_price: p.competitor_price,
        demand_score: p.demand_score,
        stock_quantity: p.stock_quantity,
        sales_history: p.sales_history,
        customer_visits: p.customer_visits,
        season_factor: p.season_factor,
      })
      .then((res) => setPrediction(res.data))
      .catch(() =>
        setPrediction({
          recommended_price: Math.round(p.current_price * 0.96),
          confidence_score: 87,
          reasons: [
            `Demand increased for ${p.category} category`,
            'Limited stock remaining',
            'Competitors pricing higher',
          ],
        })
      )
  }, [data])

  if (!data) {
    return (
      <div>
        <Topbar title="Product Details" />
        <main className="p-6 text-slate-400">Loading...</main>
      </div>
    )
  }

  const { product, price_history, competitor } = data

  const handleApply = async () => {
    setApplying(true)
    try {
      await api.put('/update-price', {
        product_id: product.id,
        new_price: prediction?.recommended_price ?? product.current_price,
      })
    } catch {
      // demo mode: no backend, just simulate success
    }
    setApplying(false)
    setApplied(true)
  }

  return (
    <div>
      <Topbar title={product.name} subtitle={product.category} />

      <main className="p-6 space-y-6">
        <button onClick={() => navigate(-1)} className="btn-secondary text-sm">
          <ArrowLeft size={15} /> Back to products
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Product summary card */}
          <div className="glass-card p-6 flex flex-col items-center text-center">
            <img
              src={product.image}
              alt={product.name}
              className="w-32 h-32 rounded-2xl object-cover border border-white/10 mb-4"
            />
            <h2 className="text-lg font-bold text-white">{product.name}</h2>
            <p className="text-sm text-slate-400 mb-4">{product.category}</p>

            <div className="w-full flex justify-between px-2">
              <div>
                <p className="text-xs text-slate-400">Current Price</p>
                <p className="text-lg font-semibold text-slate-200">
                  ₹{product.current_price.toLocaleString('en-IN')}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-400">AI Predicted</p>
                <p className="text-lg font-bold text-aiGreen">
                  ₹{prediction ? Math.round(prediction.recommended_price).toLocaleString('en-IN') : '—'}
                </p>
              </div>
            </div>

            <button
              onClick={handleApply}
              disabled={applying}
              className="btn-primary w-full mt-6"
            >
              {applied ? <CheckCircle2 size={16} /> : <Sparkles size={16} />}
              {applied ? 'Price Applied' : applying ? 'Applying...' : 'Apply Recommended Price'}
            </button>
          </div>

          {/* AI Analysis */}
          <div className="glass-card p-6 lg:col-span-2">
            <div className="flex items-center gap-2 mb-5">
              <Sparkles size={18} className="text-aiGreen" />
              <h3 className="font-semibold text-white">AI Analysis</h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-5">
              <div className="p-3 rounded-xl bg-white/5">
                <p className="text-xs text-slate-400">Demand Score</p>
                <p className="text-lg font-bold text-white">{product.demand_score}%</p>
              </div>
              <div className="p-3 rounded-xl bg-white/5">
                <p className="text-xs text-slate-400">Competition</p>
                <p className="text-lg font-bold text-white">
                  {product.competitor_price > product.current_price ? 'Medium' : 'High'}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-white/5">
                <p className="text-xs text-slate-400">Inventory</p>
                <p className="text-lg font-bold text-white">
                  {product.stock_quantity < 50 ? 'Low' : product.stock_quantity < 200 ? 'Medium' : 'High'}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-white/5">
                <p className="text-xs text-slate-400">Season Impact</p>
                <p className="text-lg font-bold text-white">
                  {product.season_factor >= 1.1 ? 'High' : product.season_factor >= 0.95 ? 'Medium' : 'Low'}
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-400 uppercase tracking-wide mb-2">Pricing Explanation</p>
            <p className="text-sm text-slate-300 leading-relaxed mb-3">
              AI {prediction && prediction.recommended_price < product.current_price ? 'decreased' : 'increased'} the
              price based on current demand, stock levels, and competitor pricing signals for this product.
            </p>
            <ul className="space-y-1.5">
              {(prediction?.reasons ?? []).map((reason) => (
                <li key={reason} className="flex items-center gap-2 text-sm text-slate-300">
                  <CheckCircle2 size={14} className="text-aiGreen shrink-0" />
                  {reason}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="glass-card p-5">
            <h3 className="font-semibold text-white mb-4">Price History</h3>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={price_history?.length ? price_history : FALLBACK_HISTORY}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="date" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip contentStyle={{ background: '#0b1120', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12 }} />
                <Line type="monotone" dataKey="price" stroke="#3b82f6" strokeWidth={2.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="glass-card p-5">
            <h3 className="font-semibold text-white mb-4">Sales History</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={FALLBACK_SALES}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="month" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip contentStyle={{ background: '#0b1120', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12 }} />
                <Bar dataKey="units" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card p-5">
          <h3 className="font-semibold text-white mb-4">Competitor Comparison</h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-4 rounded-xl bg-aiGreen/10 border border-aiGreen/20">
              <p className="text-xs text-slate-400">Our Price</p>
              <p className="text-lg font-bold text-aiGreen">₹{product.current_price.toLocaleString('en-IN')}</p>
            </div>
            <div className="p-4 rounded-xl bg-white/5">
              <p className="text-xs text-slate-400">Amazon</p>
              <p className="text-lg font-bold text-white">₹{(competitor?.amazon ?? 0).toLocaleString('en-IN')}</p>
            </div>
            <div className="p-4 rounded-xl bg-white/5">
              <p className="text-xs text-slate-400">Flipkart</p>
              <p className="text-lg font-bold text-white">₹{(competitor?.flipkart ?? 0).toLocaleString('en-IN')}</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
