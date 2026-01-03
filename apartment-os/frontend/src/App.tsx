import { lazy, Suspense } from "react";
import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import { Spin } from "antd";
import "antd/dist/reset.css";
import { useAuthStore } from "../store/authStore";
import "./App.css";

// Layout
const MainLayout = lazy(() =>
  import("@/layouts/DashboardLayout").then((module) => ({
    default: module.DashboardLayout,
  }))
);

// Auth Pages
const Login = lazy(() =>
  import("@/pages/auth/LoginPage").then((module) => ({
    default: module.default,
  }))
);

const Register = lazy(() =>
  import("@/pages/auth/RegisterPage").then((module) => ({
    default: module.default,
  }))
);

// Dashboard Pages
const Dashboard = lazy(() =>
  import("@/pages/dashboard/index").then((module) => ({
    default: module.Dashboard,
  }))
);

function App() {
  return (
    <Suspense
      fallback={
        <div className="suspense-container">
          <Spin size="large" tip="Yükleniyor..." />
        </div>
      }
    >
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route element={<RequireAuth />}>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Dashboard />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}

// --- Route Guards ---
const RequireAuth = () => {
  const token = useAuthStore((state) => state.token);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default App;
