import { Bell, Search, LogOut } from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'

export default function Topbar({ title, subtitle }) {
  const { user, logout } = useAuth()

  return (
    <header className="flex items-center justify-between gap-4 px-6 py-5 sticky top-0 z-10 bg-navy-950/60 backdrop-blur-xl border-b border-white/5">
      <div>
        <h1 className="text-xl font-bold text-white">{title}</h1>
        {subtitle && <p className="text-sm text-slate-400">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden md:flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-slate-400">
          <Search size={16} />
          <input
            placeholder="Search products..."
            className="bg-transparent outline-none text-sm text-slate-200 placeholder-slate-500 w-40"
          />
        </div>

        <button className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-white transition-colors relative">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-aiGreen" />
        </button>

        <div className="flex items-center gap-2 pl-2">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-aiPurple to-aiBlue flex items-center justify-center text-sm font-semibold">
            {user?.name?.[0] || 'A'}
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-medium text-white leading-tight">{user?.name || 'Admin User'}</p>
            <p className="text-xs text-slate-400 leading-tight">{user?.role || 'admin'}</p>
          </div>
          <button
            onClick={logout}
            title="Logout"
            className="ml-2 p-2 rounded-xl hover:bg-white/5 text-slate-400 hover:text-rose-400 transition-colors"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </header>
  )
}
