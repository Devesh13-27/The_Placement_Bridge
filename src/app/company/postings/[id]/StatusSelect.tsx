"use client";

import { useRef, useState, useTransition } from "react";
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
  const [feedback, setFeedback] = useState<"saved" | "error" | null>(null);
  const selectRef = useRef<HTMLSelectElement>(null);

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const next = e.target.value as PostingStatus;

    setFeedback(null);

    startTransition(async () => {
      try {
        await updatePostingStatus(postingId, next);
        setFeedback("saved");
      } catch {
        if (selectRef.current) {
          selectRef.current.value = status;
        }

        setFeedback("error");
      }
    });
  }

  return (
    <div className="flex min-w-0 flex-col items-stretch gap-1.5 sm:items-end">
      <select
        key={status}
        ref={selectRef}
        defaultValue={status}
        onChange={handleChange}
        disabled={isPending}
        aria-label="Posting status"
        aria-busy={isPending}
        className="input-field w-auto shrink-0 py-1.5 font-medium"
      >
        {Object.entries(STATUS_LABEL).map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>

      <div
        role="status"
        aria-live="polite"
        className={`text-xs ${
          feedback === "saved"
            ? "text-green-600"
            : feedback === "error"
              ? "text-red-600"
              : "text-transparent"
        }`}
      >
        {feedback === "saved"
          ? "✓ Status updated"
          : feedback === "error"
            ? "Couldn't update status. Please try again."
            : " "}
      </div>
    </div>
  );
}