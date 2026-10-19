const COLUMNS = ['Name', 'Type', 'Size', 'Uploaded', 'Actions'];

// The backend has no file-listing endpoint yet, so there is never data to
// show. Rows will be rendered here once GET /files exists.
export default function FileList({ apiStatus, onRetry }) {
  let body;
  if (apiStatus === 'loading') {
    body = (
      <div className="space-y-3 p-6" aria-busy="true">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-8 animate-pulse rounded bg-slate-100" />
        ))}
      </div>
    );
  } else if (apiStatus === 'unavailable') {
    body = (
      <div className="p-10 text-center">
        <p className="font-medium text-slate-900">Can’t reach the API</p>
        <p className="mt-1 text-sm text-slate-500">
          Check that the backend is running and VITE_API_BASE_URL is correct.
        </p>
        <button
          onClick={onRetry}
          className="mt-4 rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
        >
          Retry
        </button>
      </div>
    );
  } else {
    body = (
      <div className="p-10 text-center">
        <p className="font-medium text-slate-900">File storage isn’t available yet</p>
        <p className="mt-1 text-sm text-slate-500">
          The API is connected, but it has no endpoints for listing or uploading files.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
      <div className="hidden grid-cols-[1fr_8rem_6rem_9rem_6rem] gap-4 border-b border-slate-200 bg-slate-50 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-slate-500 sm:grid">
        {COLUMNS.map((c) => (
          <div key={c}>{c}</div>
        ))}
      </div>
      {body}
    </div>
  );
}
