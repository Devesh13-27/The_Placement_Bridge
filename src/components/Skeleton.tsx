export function SkeletonBar({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`animate-pulse rounded-md bg-slate-200/80 ${className}`}
    />
  );
}

export function SkeletonCard() {
  return (
    <div className="card p-4 sm:p-5">
      <div className="flex items-start gap-4">
        <SkeletonBar className="h-10 w-10 shrink-0 rounded-lg" />

        <div className="min-w-0 flex-1 space-y-2.5">
          <SkeletonBar className="h-4 w-2/3 max-w-64" />
          <SkeletonBar className="h-3 w-full max-w-md" />
          <SkeletonBar className="h-3 w-1/2 max-w-48" />
        </div>

        <SkeletonBar className="hidden h-6 w-20 shrink-0 rounded-full sm:block" />
      </div>
    </div>
  );
}

export function SkeletonStatCard() {
  return (
    <div className="card p-4 sm:p-5">
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-2">
          <SkeletonBar className="h-3 w-20" />
          <SkeletonBar className="h-7 w-16" />
        </div>

        <SkeletonBar className="h-10 w-10 rounded-lg" />
      </div>
    </div>
  );
}

export function SkeletonPage({ rows = 4 }: { rows?: number }) {
  return (
    <div className="min-h-screen">
      <div className="h-14 border-b border-slate-200 bg-white" />

      <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
        <div className="mb-6 space-y-2">
          <SkeletonBar className="h-7 w-48 sm:h-8" />
          <SkeletonBar className="h-4 w-full max-w-md" />
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonStatCard key={i} />
          ))}
        </div>

        <div className="mt-6 space-y-3">
          {Array.from({ length: rows }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </main>
    </div>
  );
}