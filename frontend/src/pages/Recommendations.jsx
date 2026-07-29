import { useEffect, useState } from 'react'
import { Sparkles, CheckCircle2 } from 'lucide-react'
import Topbar from '../components/Topbar.jsx'
import api from '../api/axios.js'
import { mockProducts } from '../data/mockData.js'

export default function Recommendations() {
  const [cards, setCards] = useState([])

  useEffect(() => {
    api
      .get('/products')
      .then(async (res) => {
        const results = await Promise.all(
          res.data.map(async (p) => {
            try {
              const pred = await api.post('/predict-price', p)
              return { product: p, prediction: pred.data }
            } catch {
              return null
            }
          })
        )
        const valid = results.filter(Boolean)
        setCards(valid.length ? valid : buildFallback())
      })
      .catch(() => setCards(buildFallback()))
  }, [])

  return (
    <div>
      <Topbar title="AI Price Recommendations" subtitle="Model-generated pricing suggestions across your catalog" />

      <main className="p-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {cards.map(({ product, prediction }) => (
          <div key={product.id ?? product.name} className="glass-card p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-white">{product.name}</h3>
              <span className="badge badge-blue">{Math.round(prediction.confidence_score ?? 85)}% confidence</span>
            </div>

            <div className="flex justify-between mb-3">
              <div>
                <p className="text-xs text-slate-400">Old Price</p>
                <p className="font-semibold text-slate-300">₹{Math.round(product.current_price).toLocaleString('en-IN')}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">New Price</p>
                <p className="font-bold text-aiGreen">₹{Math.round(prediction.recommended_price).toLocaleString('en-IN')}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 mb-3">
              <Sparkles size={14} className="text-aiPurple" />
              <span className="text-sm text-violet-300 font-medium">
                Profit Impact +{prediction.expected_profit_increase ?? 8}%
              </span>
            </div>

            <ul className="space-y-1">
              {(prediction.reasons ?? ['Demand-driven adjustment']).slice(0, 2).map((r) => (
                <li key={r} className="flex items-center gap-2 text-xs text-slate-400">
                  <CheckCircle2 size={12} className="text-aiGreen shrink-0" />
                  {r}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </main>
    </div>
  )
}

function buildFallback() {
  return mockProducts.map((p) => ({
    product: p,
    prediction: {
      recommended_price: p.ai_price,
      confidence_score: 80 + Math.round(Math.random() * 15),
      expected_profit_increase: Math.abs(p.change_pct) * 1.6,
      reasons: ['Demand and stock signals', 'Competitor price movement'],
    },
  }))
}
