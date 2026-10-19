import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider, useAuth } from './lib/AuthContext.jsx';
import AuthPage from './pages/AuthPage.jsx';
import Dashboard from './pages/Dashboard.jsx';

function Protected({ children }) {
  const { status, retry } = useAuth();
  if (status === 'loading') {
    return (
      <div role="status" className="flex min-h-screen items-center justify-center text-sm text-slate-500">
        Loading…
      </div>
    );
  }
  if (status === 'error') {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 px-4 text-center">
        <p className="font-medium text-slate-900">Can’t reach the API</p>
        <p className="text-sm text-slate-500">Check that the backend is running and VITE_API_BASE_URL is correct.</p>
        <button onClick={retry} className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700">
          Retry
        </button>
      </div>
    );
  }
  return status === 'authenticated' ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <AuthProvider>
      {/* HashRouter: works on a Render Static Site without SPA rewrite rules. */}
      <HashRouter>
        <Routes>
          <Route path="/login" element={<AuthPage mode="login" />} />
          <Route path="/signup" element={<AuthPage mode="signup" />} />
          <Route path="/" element={<Protected><Dashboard /></Protected>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </HashRouter>
    </AuthProvider>
  );
}
