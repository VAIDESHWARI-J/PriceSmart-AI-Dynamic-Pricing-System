import { IconMenu, IconSearch, IconBell, IconChevronDown } from "../common/Icons.jsx";

export default function Navbar({ onMenuClick, title = "Dashboard" }) {
  return (
    <header className="sticky top-0 z-20 flex items-center justify-between gap-4 border-b border-white/5 bg-surface/80 px-4 py-3 backdrop-blur lg:px-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="rounded-lg p-2 text-slate-300 hover:bg-white/5 lg:hidden"
          aria-label="Toggle sidebar"
        >
          <IconMenu size={20} />
        </button>
        <div>
          <h1 className="text-lg font-bold text-white">{title}</h1>
          <p className="hidden text-xs text-slate-500 sm:block">
            Welcome back — here's what's happening with your pricing today.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden items-center gap-2 rounded-xl border border-white/10 bg-surface-light px-3 py-2 md:flex">
          <IconSearch size={16} className="text-slate-500" />
          <input
            type="text"
            placeholder="Search products..."
            className="w-48 bg-transparent text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none"
          />
        </div>

        <button
          type="button"
          className="relative rounded-lg p-2 text-slate-300 hover:bg-white/5"
          aria-label="Notifications"
        >
          <IconBell size={20} />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-primary-500" />
        </button>

        <button
          type="button"
          className="flex items-center gap-2 rounded-xl border border-white/10 bg-surface-light px-2 py-1.5 pr-3"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-600 text-sm font-semibold text-white">
            A
          </div>
          <div className="hidden text-left leading-tight sm:block">
            <p className="text-xs font-semibold text-white">Admin User</p>
            <p className="text-[11px] text-slate-500">admin@pricesmart.ai</p>
          </div>
          <IconChevronDown size={16} className="hidden text-slate-500 sm:block" />
        </button>
      </div>
    </header>
  );
}
