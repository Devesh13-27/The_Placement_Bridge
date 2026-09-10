"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import StatusBadge from "@/components/StatusBadge";
import { formatMonthYear } from "@/lib/utils";
import type { Posting } from "@/lib/types";

type PostingWithCompany = Posting & { companies: { name: string } | null };

export default function ExpandablePostingCard({
  posting: p,
  mine,
}: {
  posting: PostingWithCompany;
  mine?: { interested_count: number; eligible_count: number };
}) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      layout
      className="card-interactive overflow-hidden"
      whileHover={open ? undefined : { scale: 1.01 }}
      transition={{ type: "spring", stiffness: 350, damping: 32 }}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full flex-col gap-2 p-4 text-left sm:flex-row sm:items-center sm:justify-between"
      >
        <div className="min-w-0">
          <p className="font-medium text-slate-900">
            {p.role_title}{" "}
            <span className="font-normal text-slate-500">· {p.companies?.name}</span>
          </p>
          <p className="text-sm text-slate-500">
            {p.branches.join(", ")} · {p.num_openings} openings · {formatMonthYear(p.target_start)} → {formatMonthYear(p.target_end)}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          {mine ? (
            <span className="text-sm text-slate-500">
              You reported: {mine.interested_count} interested
            </span>
          ) : (
            <span className="text-sm font-medium text-amber-600">Log your interest →</span>
          )}
          <StatusBadge status={p.status} />
          <motion.span
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="text-slate-400"
          >
            ▾
          </motion.span>
        </div>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden border-t border-slate-100"
          >
            <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                {p.description ? (
                  <p className="max-w-xl text-sm text-slate-600">{p.description}</p>
                ) : (
                  <p className="text-sm text-slate-400">No description provided.</p>
                )}
                {mine && (
                  <p className="mt-2 text-sm text-slate-500">
                    Reported: {mine.interested_count} interested · {mine.eligible_count} eligible
                  </p>
                )}
              </div>
              <Link href={`/college/postings/${p.id}`} className="btn-primary shrink-0">
                {mine ? "Update interest / message HR →" : "Log interest / message HR →"}
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
