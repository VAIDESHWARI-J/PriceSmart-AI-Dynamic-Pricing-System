import { useEffect, useState } from 'react'
import { AlertTriangle, Flame, Boxes } from 'lucide-react'
import Topbar from '../components/Topbar.jsx'
import StatCard from '../components/StatCard.jsx'
import api from '../api/axios.js'
import { mockProducts } from '../data/mockData.js'

export default function Inventory() {
  const [products, setProducts] = useState(mockProducts)

  useEffect(() => {
    api
      .get('/products')
      .then((res) =>
        setProducts(
          res.data.map((p) => ({
            ...p,
            demand_level: p.demand_score >= 65 ? 'High' : p.demand_score >= 40 ? 'Medium' : 'Low',
          }))
        )
      )
      .catch(() => setProducts(mockProducts))
  }, [])

  const lowStock = products.filter((p) => p.stock_quantity < 60)
  const highDemand = products.filter((p) => (p.demand_level ?? p.demand_level) === 'High')
  const totalStock = products.reduce((sum, p) => sum + p.stock_quantity, 0)

  return (
    <div>
      <Topbar title="Inventory" subtitle="Stock levels, alerts and high-demand products" />

      <main className="p-6 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard icon={Boxes} label="Available Stock (units)" value={totalStock.toLocaleString('en-IN')} accent="green" />
          <StatCard icon={AlertTriangle} label="Low Stock Products" value={lowStock.length} accent="purple" />
          <StatCard icon={Flame} label="High Demand Products" value={highDemand.length} accent="blue" />
        </div>

        <div className="glass-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle size={18} className="text-rose-400" />
            <h3 className="font-semibold text-white">Stock Alerts</h3>
          </div>
          <div className="space-y-2">
            {lowStock.length === 0 && <p className="text-sm text-slate-400">No low-stock alerts right now.</p>}
            {lowStock.map((p) => (
              <div key={p.id} className="flex items-center justify-between px-4 py-3 rounded-xl bg-rose-500/10 border border-rose-500/20">
                <span className="text-sm text-slate-200">{p.name}</span>
                <span className="badge badge-red">{p.stock_quantity} units left</span>
              </div>
            ))}
          </div>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Stock</th>
                <th>Demand</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id}>
                  <td className="font-medium text-white">{p.name}</td>
                  <td className="text-slate-400">{p.category}</td>
                  <td className="text-slate-300">{p.stock_quantity}</td>
                  <td>
                    <span className={`badge ${p.demand_level === 'High' ? 'badge-green' : p.demand_level === 'Medium' ? 'badge-blue' : 'badge-purple'}`}>
                      {p.demand_level}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${p.stock_quantity < 60 ? 'badge-red' : 'badge-green'}`}>
                      {p.stock_quantity < 60 ? 'Low Stock' : 'In Stock'}
                    </span>
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
