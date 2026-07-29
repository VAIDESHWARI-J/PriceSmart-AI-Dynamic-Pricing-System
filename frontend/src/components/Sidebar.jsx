import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Package,
  Sparkles,
  Scale,
  BarChart3,
  Boxes,
  FileText,
  Brain,
} from 'lucide-react'

const links = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/products', label: 'Products', icon: Package },
  { to: '/recommendations', label: 'AI Recommendations', icon: Sparkles },
  { to: '/competitors', label: 'Competitor Analysis', icon: Scale },
  { to: '/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/inventory', label: 'Inventory', icon: Boxes },
  { to: '/reports', label: 'Reports', icon: FileText },
]

export default function Sidebar() {
  return (
    <aside className="hidden lg:flex flex-col w-64 shrink-0 h-screen sticky top-0 bg-navy-900/80 border-r border-white/5 backdrop-blur-xl">
      <div className="flex items-center gap-2 px-6 py-6">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-aiGreen to-aiPurple flex items-center justify-center">
          <Brain size={20} className="text-navy-950" />
        </div>
        <div>
          <p className="font-bold text-white leading-tight">PriceSmart AI</p>
          <p className="text-xs text-slate-400">Dynamic Pricing</p>
        </div>
      </div>

      <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
        {links.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`
            }
          >
            <Icon size={18} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 m-3 rounded-xl bg-gradient-to-br from-aiGreen/10 to-aiPurple/10 border border-white/10">
        <p className="text-xs text-slate-300">
          AI Engine Status
        </p>
        <div className="flex items-center gap-2 mt-1">
          <span className="w-2 h-2 rounded-full bg-aiGreen animate-pulse" />
          <span className="text-sm font-medium text-white">Model Active</span>
        </div>
      </div>
    </aside>
  )
}
