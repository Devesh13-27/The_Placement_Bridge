export function SkeletonBar({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded bg-slate-200 ${className}`} />;
}

export function SkeletonCard() {
  return (
    <div className="card flex items-center justify-between p-4">
      <div className="space-y-2">
        <SkeletonBar className="h-4 w-48" />
        <SkeletonBar className="h-3 w-72" />
      </div>
      <SkeletonBar className="h-6 w-20 rounded-full" />
    </div>
  );
}

export function SkeletonPage({ rows = 4 }: { rows?: number }) {
  return (
    <div>
      <div className="h-[57px] border-b border-slate-200 bg-white" />
      <div className="mx-auto max-w-5xl px-6 py-8">
        <SkeletonBar className="mb-6 h-6 w-56" />
        <div className="space-y-3">
          {Array.from({ length: rows }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
