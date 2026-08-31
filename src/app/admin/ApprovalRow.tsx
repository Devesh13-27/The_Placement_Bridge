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

  function decide(decision: "verified" | "rejected") {
    startTransition(async () => {
      await decideProfile(profile.id, orgTable, orgId, decision);
      setDone(decision);
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
        >
          {done === "verified" ? "Approved" : "Rejected"}
        </span>
      ) : (
        <div className="flex shrink-0 gap-2">
          <button disabled={isPending} onClick={() => decide("rejected")} className="btn-secondary flex-1 sm:flex-initial">
            Reject
          </button>
          <button disabled={isPending} onClick={() => decide("verified")} className="btn-primary flex-1 sm:flex-initial">
            Approve
          </button>
        </div>
      )}
    </div>
  );
}
