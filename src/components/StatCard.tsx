import type { ReactNode } from "react";

export default function StatCard({
  label,
  value,
  icon,
  tone = "slate",
}: {
  label: string;
  value: string | number;
  icon: ReactNode;
  tone?: "slate" | "green" | "blue";
}) {
  const toneStyles = {
    slate: { value: "text-slate-900", iconBg: "bg-slate-100 text-slate-600" },
    green: { value: "text-green-600", iconBg: "bg-green-100 text-green-600" },
    blue: { value: "text-blue-600", iconBg: "bg-blue-100 text-blue-600" },
  }[tone];

  return (
    <div className="card-interactive flex items-center gap-3 p-3 sm:p-4">
      <div
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-base sm:h-10 sm:w-10 ${toneStyles.iconBg}`}
      >
        {icon}
      </div>
      <div className="min-w-0">
        <p className={`text-xl font-semibold sm:text-2xl ${toneStyles.value}`}>{value}</p>
        <p className="truncate text-xs text-slate-500 sm:text-sm">{label}</p>
      </div>
    </div>
  );
}
