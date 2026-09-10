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
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaved(false);
    setError(null);

    if (interested > eligible) {
      setError("Interested count cannot exceed eligible count.");
      return;
    }

    startTransition(async () => {
      const result = await upsertInterest(postingId, interested, eligible);
      if (!result.success) {
        setError(result.error);
      } else {
        setSaved(true);
      }
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
          onChange={(e) => { setEligible(Number(e.target.value)); setSaved(false); }}
          className="input-field"
        />
      </label>
      <label className="block text-sm">
        <span className="field-label">Interested students</span>
        <input
          type="number"
          min={0}
          max={eligible}
          value={interested}
          onChange={(e) => { setInterested(Number(e.target.value)); setSaved(false); }}
          className="input-field"
        />
      </label>
      {interested > eligible && (
        <p role="alert" className="rounded-md bg-amber-50 px-3 py-2 text-sm text-amber-700">
          Interested cannot exceed eligible students.
        </p>
      )}
      {error && (
        <p role="alert" className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}
      <button
        type="submit"
        disabled={isPending || interested > eligible}
        className="btn-primary w-full"
      >
        {isPending ? "Saving…" : existing ? "Update count" : "Log interest"}
      </button>
      {saved && !isPending && (
        <p className="text-center text-sm font-medium text-green-600">✓ Saved</p>
      )}
    </form>
  );
}
