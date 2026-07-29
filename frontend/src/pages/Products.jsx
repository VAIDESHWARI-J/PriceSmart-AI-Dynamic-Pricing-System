import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import Topbar from '../components/Topbar.jsx'
import api from '../api/axios.js'
import { mockProducts } from '../data/mockData.js'

function demandBadge(level) {
  if (level === 'High') return 'badge-green'
  if (level === 'Medium') return 'badge-blue'
  return 'badge-purple'
}

export default function Products() {
  const [products, setProducts] = useState(mockProducts)
  const navigate = useNavigate()

  useEffect(() => {
    api
      .get('/products')
      .then((res) => {
        const mapped = res.data.map((p) => {
          const change = ((p.competitor_price - p.current_price) / p.current_price) * 100
          return {
            ...p,
            ai_price: Math.round(p.current_price * (1 + change / 200)),
            change_pct: Math.round(change / 2 * 10) / 10,
            demand_level: p.demand_score >= 65 ? 'High' : p.demand_score >= 40 ? 'Medium' : 'Low',
          }
        })
        setProducts(mapped)
      })
      .catch(() => setProducts(mockProducts))
  }, [])

  return (
    <div>
      <Topbar title="Product Management" subtitle="All tracked products and AI price recommendations" />

      <main className="p-6">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Current Price</th>
                <th>AI Recommended</th>
                <th>Change</th>
                <th>Demand</th>
                <th>Stock</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="cursor-pointer" onClick={() => navigate(`/products/${p.id}`)}>
                  <td>
                    <div className="flex items-center gap-3">
                      <img src={p.image} alt={p.name} className="w-10 h-10 rounded-lg object-cover border border-white/10" />
                      <span className="font-medium text-white">{p.name}</span>
                    </div>
                  </td>
                  <td className="text-slate-400">{p.category}</td>
                  <td className="text-slate-300">₹{p.current_price.toLocaleString('en-IN')}</td>
                  <td className="text-aiGreen font-semibold">₹{Math.round(p.ai_price).toLocaleString('en-IN')}</td>
                  <td>
                    <span className={`badge ${p.change_pct < 0 ? 'badge-red' : 'badge-green'}`}>
                      {p.change_pct > 0 ? '+' : ''}
                      {p.change_pct}%
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${demandBadge(p.demand_level)}`}>{p.demand_level}</span>
                  </td>
                  <td className="text-slate-400">{p.stock_quantity}</td>
                  <td>
                    <button className="p-2 rounded-lg hover:bg-white/10 text-slate-400">
                      <ChevronRight size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  )
}
