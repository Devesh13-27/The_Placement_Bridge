"use client";

import { useTransition } from "react";
import { updatePostingStatus } from "@/app/company/actions";
import type { PostingStatus } from "@/lib/types";
import { STATUS_LABEL } from "@/lib/statusStyles";

export default function StatusSelect({
  postingId,
  status,
}: {
  postingId: string;
  status: PostingStatus;
}) {
  const [isPending, startTransition] = useTransition();

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const next = e.target.value as PostingStatus;
    startTransition(() => { void updatePostingStatus(postingId, next); });
  }

  return (
    <select
      key={status}
      defaultValue={status}
      onChange={handleChange}
      disabled={isPending}
      className="input-field w-auto shrink-0 py-1.5 font-medium"
    >
      {Object.entries(STATUS_LABEL).map(([value, label]) => (
        <option key={value} value={value}>
          {label}
        </option>
      ))}
    </select>
  );
}
