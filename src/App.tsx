import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import HomePage from "@/pages/HomePage";
import { tokenStorage } from "@/services/api";

const AdminLogin = lazy(() => import("@/pages/AdminLogin"));
const AdminPanel = lazy(() => import("@/pages/AdminPanel"));

function ProtectedPanel() {
  return tokenStorage.get() ? <AdminPanel /> : <Navigate to="/admin" replace />;
}

function App() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-ink-950" />}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/panel" element={<ProtectedPanel />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}

export default App;
