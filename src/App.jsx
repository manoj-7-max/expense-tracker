import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';
import Layout from './components/Layout.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Goals from './pages/Goals.jsx';
import Login from './pages/Login.jsx';
import UpdatePassword from './pages/UpdatePassword.jsx';
import Reports from './pages/Reports.jsx';
import Settings from './pages/Settings.jsx';
import Transactions from './pages/Transactions.jsx';

function ProtectedRoute({ children }) {
  const { session, loading } = useAuth();

  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center bg-slate-50 text-slate-700 dark:bg-slate-950 dark:text-slate-200">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-teal-200 border-t-teal-600" />
      </div>
    );
  }

  return session ? children : <Navigate to="/login" replace />;
}

export default function App() {
  const { session } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={session ? <Navigate to="/" replace /> : <Login />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="transactions" element={<Transactions />} />
        <Route path="goals" element={<Goals />} />
        <Route path="reports" element={<Reports />} />
        <Route path="settings" element={<Settings />} />
      </Route>
      <Route path="/update-password" element={<ProtectedRoute><UpdatePassword /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
