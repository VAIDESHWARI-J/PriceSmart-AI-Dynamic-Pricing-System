import { Routes, Route } from "react-router-dom";
import DashboardLayout from "../components/layout/DashboardLayout.jsx";
import PlaceholderPage from "../components/common/PlaceholderPage.jsx";
import Dashboard from "../pages/Dashboard/Dashboard.jsx";

export default function AppRouter() {
  return (
    <Routes>
      <Route element={<DashboardLayout />}>
        <Route path="/" element={<Dashboard />} />

        <Route
          path="/products"
          element={
            <PlaceholderPage
              title="Product Management"
              description="Full product table, filters, and add/edit flows land in Phase 3."
            />
          }
        />
        <Route
          path="/products/:id"
          element={
            <PlaceholderPage
              title="Product Details"
              description="Per-product overview and price history chart land in Phase 3."
            />
          }
        />
        <Route
          path="/products/:id/recommendation"
          element={
            <PlaceholderPage
              title="AI Price Recommendation"
              description="Live recommendation calls into the AI service land in Phase 4."
            />
          }
        />
        <Route
          path="/products/:id/forecast"
          element={
            <PlaceholderPage
              title="Demand Forecasting"
              description="Forecast charts powered by the AI service land in Phase 4."
            />
          }
        />
        <Route
          path="/products/:id/competitors"
          element={
            <PlaceholderPage
              title="Competitor Analysis"
              description="Competitor price tracking and positioning land in Phase 3."
            />
          }
        />
        <Route
          path="/analytics"
          element={
            <PlaceholderPage
              title="Analytics"
              description="Cross-product KPI and trend views land in a later phase."
            />
          }
        />
        <Route
          path="/reports"
          element={
            <PlaceholderPage
              title="Reports"
              description="Report generation and export land in a later phase."
            />
          }
        />
        <Route
          path="/settings"
          element={
            <PlaceholderPage
              title="Settings"
              description="Currency, margin, and notification preferences land in a later phase."
            />
          }
        />
      </Route>

      <Route
        path="*"
        element={
          <PlaceholderPage
            title="404 — Page Not Found"
            description="The page you're looking for doesn't exist."
          />
        }
      />
    </Routes>
  );
}
