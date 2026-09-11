"use client";

import { useState, useTransition } from "react";
import type { Profile } from "@/lib/types";
import { decideProfile } from "./actions";

export default function ApprovalRow({
  profile,
  orgTable,
  orgName,
  orgDomain,
  orgId,
}: {
  profile: Profile;
  orgTable: "companies" | "colleges";
  orgName: string;
  orgDomain: string;
  orgId: string;
}) {
  const [isPending, startTransition] = useTransition();
  const [done, setDone] = useState<"verified" | "rejected" | null>(null);
  const [showRejectConfirmation, setShowRejectConfirmation] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function decide(decision: "verified" | "rejected") {
    setError(null);

    startTransition(async () => {
      try {
        const result = await decideProfile(profile.id, orgTable, orgId, decision);

        if (!result.success) {
          setError(result.error);
          return;
        }

        setDone(decision);
        setShowRejectConfirmation(false);
      } catch {
        setError(
          decision === "rejected"
            ? "Unable to reject this request. Please try again."
            : "Unable to approve this request. Please try again.",
        );
      }
    });
  }

  return (
    <div className="card flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <p className="font-medium text-slate-900">
          {profile.full_name}{" "}
          <span className="ml-1 rounded bg-slate-100 px-1.5 py-0.5 text-xs font-medium uppercase text-slate-500">
            {profile.role}
          </span>
        </p>

        <p className="text-sm text-slate-500">{profile.email}</p>

        <p className="text-sm text-slate-500">
          {orgName} · {orgDomain}
        </p>
      </div>

      {done ? (
        <span
          className={`text-sm font-medium ${
            done === "verified" ? "text-green-600" : "text-red-600"
          }`}
          role="status"
          aria-live="polite"
        >
          {done === "verified" ? "Approved" : "Rejected"}
        </span>
      ) : (
        <div className="flex shrink-0 flex-col gap-2 sm:items-end">
          <div className="flex w-full gap-2 sm:w-auto">
            <button
              type="button"
              disabled={isPending}
              onClick={() => {
                setError(null);
                setShowRejectConfirmation(true);
              }}
              className="btn-secondary min-h-10 flex-1 text-red-600 hover:bg-red-50 hover:text-red-700 sm:flex-initial"
            >
              Reject
            </button>

            <button
              type="button"
              disabled={isPending}
              onClick={() => decide("verified")}
              className="btn-primary min-h-10 flex-1 sm:flex-initial"
            >
              {isPending ? "Working…" : "Approve"}
            </button>
          </div>

          {showRejectConfirmation && (
            <div
              role="alertdialog"
              aria-modal="true"
              aria-labelledby={`reject-title-${profile.id}`}
              aria-describedby={`reject-description-${profile.id}`}
              className="w-full rounded-lg border border-red-200 bg-red-50 p-3 sm:w-80"
            >
              <p
                id={`reject-title-${profile.id}`}
                className="text-sm font-semibold text-red-900"
              >
                Reject this request?
              </p>

              <p
                id={`reject-description-${profile.id}`}
                className="mt-1 text-xs leading-5 text-red-800"
              >
                This will mark {profile.full_name}&apos;s verification request
                as rejected.
              </p>

              <div className="mt-3 flex gap-2">
                <button
                  type="button"
                  disabled={isPending}
                  onClick={() => {
                    setShowRejectConfirmation(false);
                    setError(null);
                  }}
                  className="btn-secondary min-h-9 flex-1"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  disabled={isPending}
                  onClick={() => decide("rejected")}
                  className="min-h-9 flex-1 rounded-lg bg-red-600 px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isPending ? "Rejecting…" : "Yes, reject"}
                </button>
              </div>
            </div>
          )}

          {error && (
            <p
              role="alert"
              aria-live="assertive"
              className="w-full rounded-md bg-red-50 px-3 py-2 text-xs text-red-700 sm:w-80"
            >
              {error}
            </p>
          )}
        </div>
      )}
    </div>
  );
}