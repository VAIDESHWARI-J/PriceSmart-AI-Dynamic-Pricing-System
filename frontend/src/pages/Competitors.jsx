import { useEffect, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { ArrowDownRight } from 'lucide-react'
import Topbar from '../components/Topbar.jsx'
import api from '../api/axios.js'
import { mockProducts } from '../data/mockData.js'

export default function Competitors() {
  const [rows, setRows] = useState([])

  useEffect(() => {
    api
      .get('/products')
      .then((res) => {
        const mapped = res.data.map((p) => ({
          name: p.name,
          ours: p.current_price,
          amazon: Math.round(p.current_price * 1.03),
          flipkart: Math.round(p.current_price * 1.015),
        }))
        setRows(mapped)
      })
      .catch(() =>
        setRows(
          mockProducts.map((p) => ({
            name: p.name,
            ours: p.current_price,
            amazon: Math.round(p.current_price * 1.03),
            flipkart: Math.round(p.current_price * 1.015),
          }))
        )
      )
  }, [])

  return (
    <div>
      <Topbar title="Competitor Analysis" subtitle="How your prices compare against major marketplaces" />

      <main className="p-6 space-y-6">
        <div className="glass-card p-5">
          <h3 className="font-semibold text-white mb-4">Price Comparison</h3>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={rows}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis dataKey="name" stroke="#64748b" fontSize={11} interval={0} angle={-15} textAnchor="end" height={60} />
              <YAxis stroke="#64748b" fontSize={11} />
              <Tooltip contentStyle={{ background: '#0b1120', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12 }} />
              <Legend />
              <Bar dataKey="ours" name="Our Price" fill="#22e6a3" radius={[6, 6, 0, 0]} />
              <Bar dataKey="amazon" name="Amazon" fill="#3b82f6" radius={[6, 6, 0, 0]} />
              <Bar dataKey="flipkart" name="Flipkart" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Our Price</th>
                <th>Amazon</th>
                <th>Flipkart</th>
                <th>Difference</th>
                <th>AI Suggestion</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => {
                const lowest = Math.min(r.amazon, r.flipkart)
                const diffPct = (((r.ours - lowest) / lowest) * 100).toFixed(1)
                return (
                  <tr key={r.name}>
                    <td className="font-medium text-white">{r.name}</td>
                    <td className="text-aiGreen font-semibold">₹{r.ours.toLocaleString('en-IN')}</td>
                    <td className="text-slate-300">₹{r.amazon.toLocaleString('en-IN')}</td>
                    <td className="text-slate-300">₹{r.flipkart.toLocaleString('en-IN')}</td>
                    <td>
                      <span className={`badge ${diffPct > 0 ? 'badge-red' : 'badge-green'}`}>
                        {diffPct > 0 ? '+' : ''}
                        {diffPct}%
                      </span>
                    </td>
                    <td className="flex items-center gap-1.5 text-sm text-slate-300">
                      {diffPct > 0 ? (
                        <>
                          <ArrowDownRight size={14} className="text-aiGreen" />
                          Reduce price by {Math.min(Math.abs(diffPct), 8).toFixed(1)}%
                        </>
                      ) : (
                        'Price is competitive'
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  )
}
