"use client";

import { useState, useTransition } from "react";
import { sendMessageAsHr, proposeCamp } from "@/app/company/actions";
import { CAMP_STATUS_LABEL } from "@/lib/statusStyles";
import type { Message, CampVisit } from "@/lib/types";

export default function ThreadPanel({
  postingId,
  companyId,
  collegeId,
  collegeName,
  initialMessages,
  camp,
}: {
  postingId: string;
  companyId: string;
  collegeId: string;
  collegeName: string;
  initialMessages: Message[];
  camp: CampVisit | null;
}) {
  const [messages, setMessages] = useState(initialMessages);
  const [text, setText] = useState("");
  const [isPending, startTransition] = useTransition();
  const [showCampForm, setShowCampForm] = useState(false);

  function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;
    const body = text;
    setText("");
    startTransition(async () => {
      await sendMessageAsHr(postingId, companyId, collegeId, body);
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          posting_id: postingId,
          college_id: collegeId,
          company_id: companyId,
          sender_id: "me",
          sender_role: "hr",
          body,
          created_at: new Date().toISOString(),
        },
      ]);
    });
  }

  function handleProposeCamp(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const type = formData.get("type") as "camp" | "visit";
    const date = formData.get("date") as string;
    startTransition(async () => {
      await proposeCamp(postingId, companyId, collegeId, type, date);
      setShowCampForm(false);
    });
  }

  return (
    <div className="card flex h-full min-h-[500px] flex-col overflow-hidden">
      <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50/50 p-3">
        <h3 className="font-medium text-slate-900">{collegeName}</h3>
        <button onClick={() => setShowCampForm((v) => !v)} className="btn-ghost text-xs">
          Propose camp / visit
        </button>
      </div>

      {camp && (
        <div className="border-b border-slate-200 bg-blue-50 px-3 py-2 text-sm text-blue-800">
          {camp.type === "camp" ? "Recruitment camp" : "Industry visit"} on{" "}
          {camp.scheduled_date} — {CAMP_STATUS_LABEL[camp.status]}
        </div>
      )}

      {showCampForm && (
        <form
          onSubmit={handleProposeCamp}
          className="flex flex-col gap-2 border-b border-slate-200 p-3 sm:flex-row sm:items-end"
        >
          <select name="type" className="input-field py-1.5 sm:w-auto">
            <option value="camp">Recruitment camp</option>
            <option value="visit">Industry visit</option>
          </select>
          <input name="date" type="date" required className="input-field py-1.5 sm:w-auto" />
          <button type="submit" disabled={isPending} className="btn-primary py-1.5">
            Propose
          </button>
        </form>
      )}

      <div className="flex-1 space-y-3 overflow-y-auto p-4">
        {!messages.length && (
          <p className="text-sm text-slate-400">No messages yet — say hello.</p>
        )}
        {messages.map((m) => (
          <div
            key={m.id}
            className={`max-w-[75%] rounded-lg px-3 py-2 text-sm ${
              m.sender_role === "hr"
                ? "ml-auto bg-blue-600 text-white"
                : "bg-slate-100 text-slate-800"
            }`}
          >
            {m.body}
          </div>
        ))}
      </div>

      <form onSubmit={handleSend} className="flex gap-2 border-t border-slate-200 p-3">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Message the T&P officer…"
          className="input-field flex-1"
        />
        <button type="submit" disabled={isPending} className="btn-primary">
          Send
        </button>
      </form>
    </div>
  );
}
