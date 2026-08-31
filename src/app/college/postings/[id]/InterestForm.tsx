"use client";

import { useState, useTransition } from "react";
import { upsertInterest } from "@/app/college/actions";
import type { InterestReport } from "@/lib/types";

export default function InterestForm({
  postingId,
  existing,
}: {
  postingId: string;
  existing: InterestReport | null;
}) {
  const [interested, setInterested] = useState(existing?.interested_count ?? 0);
  const [eligible, setEligible] = useState(existing?.eligible_count ?? 0);
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaved(false);
    startTransition(async () => {
      await upsertInterest(postingId, interested, eligible);
      setSaved(true);
    });
  }

  return (
    <form onSubmit={handleSubmit} className="card space-y-3 p-4">
      <label className="block text-sm">
        <span className="field-label">Eligible students</span>
        <input
          type="number"
          min={0}
          value={eligible}
          onChange={(e) => setEligible(Number(e.target.value))}
          className="input-field"
        />
      </label>
      <label className="block text-sm">
        <span className="field-label">Interested students</span>
        <input
          type="number"
          min={0}
          value={interested}
          onChange={(e) => setInterested(Number(e.target.value))}
          className="input-field"
        />
      </label>
      <button type="submit" disabled={isPending} className="btn-primary w-full">
        {isPending ? "Saving…" : existing ? "Update count" : "Log interest"}
      </button>
      {saved && !isPending && (
        <p className="text-center text-sm font-medium text-green-600">✓ Saved</p>
      )}
    </form>
  );
}
