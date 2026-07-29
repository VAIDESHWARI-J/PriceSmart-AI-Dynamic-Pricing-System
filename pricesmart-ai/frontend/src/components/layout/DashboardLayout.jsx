import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Sidebar from "./Sidebar.jsx";
import Navbar from "./Navbar.jsx";

const ROUTE_TITLES = [
  { match: /^\/$/, title: "Dashboard" },
  { match: /^\/products$/, title: "Product Management" },
  { match: /^\/products\/[^/]+$/, title: "Product Details" },
  { match: /recommendation$/, title: "AI Price Recommendation" },
  { match: /forecast$/, title: "Demand Forecasting" },
  { match: /competitors$/, title: "Competitor Analysis" },
  { match: /^\/analytics$/, title: "Analytics" },
  { match: /^\/reports$/, title: "Reports" },
  { match: /^\/settings$/, title: "Settings" },
];

function resolveTitle(pathname) {
  const found = ROUTE_TITLES.find((r) => r.match.test(pathname));
  return found ? found.title : "PriceSmart AI";
}

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const title = resolveTitle(location.pathname);

  return (
    <div className="flex min-h-screen bg-surface">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex min-h-screen flex-1 flex-col lg:pl-0">
        <Navbar onMenuClick={() => setSidebarOpen((v) => !v)} title={title} />

        <main className="flex-1 px-4 py-6 lg:px-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
