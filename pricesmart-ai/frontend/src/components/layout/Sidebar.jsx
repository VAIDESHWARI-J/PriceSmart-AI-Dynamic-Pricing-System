import { NavLink } from "react-router-dom";
import {
  IconDashboard,
  IconProducts,
  IconPriceTag,
  IconTrendUp,
  IconCompetitor,
  IconAnalytics,
  IconReports,
  IconSettings,
} from "../common/Icons.jsx";

const NAV_ITEMS = [
  { to: "/", label: "Dashboard", icon: IconDashboard, end: true },
  { to: "/products", label: "Products", icon: IconProducts },
  { to: "/products/demo/recommendation", label: "AI Recommendation", icon: IconPriceTag },
  { to: "/products/demo/forecast", label: "Demand Forecasting", icon: IconTrendUp },
  { to: "/products/demo/competitors", label: "Competitor Analysis", icon: IconCompetitor },
  { to: "/analytics", label: "Analytics", icon: IconAnalytics },
  { to: "/reports", label: "Reports", icon: IconReports },
  { to: "/settings", label: "Settings", icon: IconSettings },
];

export default function Sidebar({ open = true, onClose }) {
  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-white/5
          bg-surface-light px-4 py-6 transition-transform duration-200 lg:static lg:translate-x-0
          ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="mb-8 flex items-center gap-2 px-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-600 font-bold text-white">
            P
          </div>
          <div className="leading-tight">
            <p className="text-sm font-bold text-white">PriceSmart AI</p>
            <p className="text-[11px] text-slate-500">Dynamic Pricing</p>
          </div>
        </div>

        <nav className="flex flex-1 flex-col gap-1">
          {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={onClose}
              className={({ isActive }) =>
                `nav-link ${isActive ? "nav-link-active" : ""}`
              }
            >
              <Icon size={18} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="mt-6 rounded-xl bg-white/5 p-4">
          <p className="text-xs font-semibold text-white">AI Engine Status</p>
          <p className="mt-1 flex items-center gap-1.5 text-xs text-emerald-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Online — v1.0
          </p>
        </div>
      </aside>
    </>
  );
}
