import { SkeletonBar } from "./Skeleton";

export default function PostingDetailSkeleton() {
  return (
    <div>
      <div className="h-[57px] border-b border-slate-200 bg-white" />
      <div className="mx-auto max-w-5xl px-6 py-8">
        <SkeletonBar className="h-4 w-24" />
        <div className="card mt-3 space-y-2 p-6">
          <SkeletonBar className="h-5 w-64" />
          <SkeletonBar className="h-4 w-96" />
        </div>
        <div className="mt-8 grid grid-cols-5 gap-6">
          <div className="col-span-2 space-y-2">
            <SkeletonBar className="h-4 w-40" />
            <SkeletonBar className="h-20 w-full rounded-xl" />
            <SkeletonBar className="h-20 w-full rounded-xl" />
          </div>
          <div className="col-span-3">
            <SkeletonBar className="h-[500px] w-full rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
