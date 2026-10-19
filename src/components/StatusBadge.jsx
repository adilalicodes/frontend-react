const STYLES = {
  loading: { dot: 'bg-amber-400 animate-pulse', text: 'Connecting…' },
  connected: { dot: 'bg-emerald-500', text: 'API connected' },
  unavailable: { dot: 'bg-red-500', text: 'API unavailable' },
};

export default function StatusBadge({ status, error }) {
  const s = STYLES[status];
  return (
    <span
      title={error || s.text}
      className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-700"
    >
      <span className={`h-2 w-2 rounded-full ${s.dot}`} />
      {s.text}
    </span>
  );
}
