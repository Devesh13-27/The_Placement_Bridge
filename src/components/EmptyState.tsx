import type { ReactNode } from "react";

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}

export default function EmptyState({
  icon,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div
      className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center sm:py-14"
      role="status"
    >
      <div
        aria-hidden="true"
        className="mb-4 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600"
      >
        {icon}
      </div>

      <h3 className="text-sm font-semibold text-slate-900 sm:text-base">
        {title}
      </h3>

      {description && (
        <p className="mt-1.5 max-w-md text-sm leading-6 text-slate-500">
          {description}
        </p>
      )}

      {action && (
        <div className="mt-5 flex w-full flex-col items-center gap-2 sm:w-auto">
          {action}
        </div>
      )}
    </div>
  );
}