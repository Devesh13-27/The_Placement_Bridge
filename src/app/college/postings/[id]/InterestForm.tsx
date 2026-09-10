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

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (isPending) return;

    setSaved(false);
    setError(null);

    if (interested > eligible) {
      setError("Interested count cannot exceed eligible count.");
      return;
    }

    if (interested < 0 || eligible < 0) {
      setError("Student counts cannot be negative.");
      return;
    }

    startTransition(async () => {
      try {
        const result = await upsertInterest(postingId, interested, eligible);

        if (!result.success) {
          setError(result.error);
          return;
        }

        setSaved(true);
      } catch {
        setError("Unable to save the interest count. Please try again.");
      }
    });
  }

  function handleEligibleChange(value: string) {
    const nextValue = Number(value);

    setEligible(Number.isNaN(nextValue) ? 0 : Math.max(0, nextValue));
    setSaved(false);
    setError(null);
  }

  function handleInterestedChange(value: string) {
    const nextValue = Number(value);

    setInterested(Number.isNaN(nextValue) ? 0 : Math.max(0, nextValue));
    setSaved(false);
    setError(null);
  }

  const invalid = interested > eligible;

  return (
    <form
      onSubmit={handleSubmit}
      className="card space-y-4 p-4 sm:p-5"
      aria-busy={isPending}
    >
      <div>
        <h2 className="text-sm font-semibold text-slate-900">
          Student interest
        </h2>
        <p className="mt-0.5 text-xs leading-5 text-slate-500">
          Record how many students are eligible and interested in this posting.
        </p>
      </div>

      <label className="block text-sm">
        <span className="field-label">Eligible students</span>
        <input
          type="number"
          min={0}
          step={1}
          inputMode="numeric"
          value={eligible}
          onChange={(e) => handleEligibleChange(e.target.value)}
          disabled={isPending}
          aria-invalid={invalid}
          className="input-field"
        />
      </label>

      <label className="block text-sm">
        <span className="field-label">Interested students</span>
        <input
          type="number"
          min={0}
          max={eligible}
          step={1}
          inputMode="numeric"
          value={interested}
          onChange={(e) => handleInterestedChange(e.target.value)}
          disabled={isPending}
          aria-invalid={invalid}
          className="input-field"
        />
      </label>

      {invalid && (
        <p
          role="alert"
          className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2.5 text-sm leading-5 text-amber-700"
        >
          Interested count cannot exceed eligible count.
        </p>
      )}

      {error && (
        <p
          role="alert"
          aria-live="assertive"
          className="rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm leading-5 text-red-700"
        >
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending || invalid}
        className="btn-primary min-h-10 w-full"
      >
        {isPending ? "Saving…" : existing ? "Update count" : "Log interest"}
      </button>

      <div
        role="status"
        aria-live="polite"
        className={`min-h-5 text-center text-sm font-medium ${
          saved ? "text-green-600" : "text-transparent"
        }`}
      >
        {saved ? "✓ Interest count saved successfully" : " "}
      </div>
    </form>
  );
}