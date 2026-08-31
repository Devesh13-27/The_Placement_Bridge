export default function StatCard({
  label,
  value,
  accent = "text-slate-900",
}: {
  label: string;
  value: string | number;
  accent?: string;
}) {
  return (
    <div className="card p-3 sm:p-4">
      <p className={`text-xl font-semibold sm:text-2xl ${accent}`}>{value}</p>
      <p className="mt-1 text-xs text-slate-500 sm:text-sm">{label}</p>
    </div>
  );
}
