import { useState } from 'react';
import Sidebar from '../components/Sidebar.jsx';
import StatusBadge from '../components/StatusBadge.jsx';
import FileList from '../components/FileList.jsx';
import { useApiStatus } from '../lib/useApiStatus.js';
import { useAuth } from '../lib/AuthContext.jsx';

export default function Dashboard() {
  const [navOpen, setNavOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const [logoutError, setLogoutError] = useState('');
  const { status, error, retry } = useApiStatus();
  const { user, signOut } = useAuth();

  async function onLogout() {
    setSigningOut(true);
    setLogoutError('');
    try {
      await signOut();
    } catch (err) {
      setLogoutError(err.message);
      setSigningOut(false);
    }
  }

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-800">
      <Sidebar open={navOpen} onClose={() => setNavOpen(false)} />
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex flex-wrap items-center gap-3 border-b border-slate-200 bg-white px-4 py-3">
          <button
            onClick={() => setNavOpen(true)}
            aria-label="Open navigation"
            className="rounded-md border border-slate-200 px-2 py-1 text-sm md:hidden"
          >
            ☰
          </button>
          <h1 className="text-lg font-semibold text-slate-900">myStorage</h1>
          <input
            type="search"
            disabled
            placeholder="Search (needs a file-list endpoint)"
            aria-label="Search files"
            className="order-last w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm disabled:cursor-not-allowed md:order-none md:ml-4 md:w-80"
          />
          <div className="ml-auto flex items-center gap-3">
            <StatusBadge status={status} error={error} />
            <span className="hidden text-sm text-slate-600 sm:inline">{user.email}</span>
            <button
              onClick={onLogout}
              disabled={signingOut}
              className="rounded-md border border-slate-300 px-3 py-1 text-sm font-medium hover:bg-slate-100 disabled:opacity-60"
            >
              {signingOut ? 'Signing out…' : 'Log out'}
            </button>
          </div>
        </header>
        {logoutError && (
          <div role="alert" className="border-b border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
            Could not log out: {logoutError}
          </div>
        )}
        <main className="flex-1 p-4 md:p-6">
          <h2 className="mb-4 text-base font-semibold text-slate-900">Files</h2>
          <FileList apiStatus={status} onRetry={retry} />
        </main>
      </div>
    </div>
  );
}
