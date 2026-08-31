import { SkeletonBar, SkeletonCard } from "@/components/Skeleton";

export default function Loading() {
  return (
    <div>
      <div className="h-[57px] border-b border-slate-200 bg-white" />
      <div className="mx-auto max-w-3xl px-6 py-10">
        <SkeletonBar className="mb-8 h-6 w-48" />
        <div className="space-y-3">
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </div>
    </div>
  );
}
