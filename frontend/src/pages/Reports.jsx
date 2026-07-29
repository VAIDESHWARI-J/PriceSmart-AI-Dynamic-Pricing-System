import { FileText, Download } from 'lucide-react'
import Topbar from '../components/Topbar.jsx'

const reports = [
  {
    title: 'Monthly Pricing Report',
    description: 'Summary of all AI-driven price changes and rationale for July 2026.',
    date: 'Jul 2026',
  },
  {
    title: 'Revenue Report',
    description: 'Revenue and profit breakdown by category and channel.',
    date: 'Jul 2026',
  },
  {
    title: 'AI Decision Report',
    description: 'Full audit log of AI pricing decisions with confidence scores.',
    date: 'Jul 2026',
  },
  {
    title: 'Competitor Benchmark Report',
    description: 'Price positioning versus Amazon and Flipkart across the catalog.',
    date: 'Jun 2026',
  },
]

export default function Reports() {
  return (
    <div>
      <Topbar title="Reports" subtitle="Generate and download pricing, revenue and AI decision reports" />

      <main className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        {reports.map((r) => (
          <div key={r.title} className="glass-card p-5 flex items-start gap-4">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-aiBlue/20 to-aiPurple/10 flex items-center justify-center shrink-0">
              <FileText size={20} className="text-sky-300" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-white">{r.title}</h3>
                <span className="text-xs text-slate-500">{r.date}</span>
              </div>
              <p className="text-sm text-slate-400 mt-1 mb-3">{r.description}</p>
              <button className="btn-secondary text-sm">
                <Download size={14} /> Download PDF
              </button>
            </div>
          </div>
        ))}
      </main>
    </div>
  )
}
