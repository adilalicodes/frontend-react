// Only areas the backend supports are listed. Currently the backend has no
// file endpoints, so there is a single "Files" view.
const NAV = [{ id: 'files', label: 'Files' }];

export default function Sidebar({ open, onClose }) {
  return (
    <>
      {open && (
        <div className="fixed inset-0 z-20 bg-slate-900/40 md:hidden" onClick={onClose} />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-30 w-60 transform border-r border-slate-200 bg-white p-4 transition-transform md:static md:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="mb-6 text-lg font-semibold text-slate-900">myStorage</div>
        <nav className="space-y-1">
          {NAV.map((item) => (
            <a
              key={item.id}
              href="#files"
              onClick={onClose}
              aria-current="page"
              className="block rounded-md bg-slate-100 px-3 py-2 text-sm font-medium text-slate-900"
            >
              {item.label}
            </a>
          ))}
        </nav>
      </aside>
    </>
  );
}
