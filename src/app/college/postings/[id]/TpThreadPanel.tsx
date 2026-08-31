"use client";

import { useState, useTransition } from "react";
import { sendMessageAsTp, confirmCamp } from "@/app/college/actions";
import { CAMP_STATUS_LABEL } from "@/lib/statusStyles";
import type { Message, CampVisit } from "@/lib/types";

export default function TpThreadPanel({
  postingId,
  companyId,
  initialMessages,
  camp,
}: {
  postingId: string;
  companyId: string;
  initialMessages: Message[];
  camp: CampVisit | null;
}) {
  const [messages, setMessages] = useState(initialMessages);
  const [text, setText] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;
    const body = text;
    setText("");
    startTransition(async () => {
      await sendMessageAsTp(postingId, companyId, body);
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          posting_id: postingId,
          college_id: "",
          company_id: companyId,
          sender_id: "me",
          sender_role: "tp",
          body,
          created_at: new Date().toISOString(),
        },
      ]);
    });
  }

  function handleConfirm() {
    if (!camp) return;
    startTransition(() => confirmCamp(camp.id));
  }

  return (
    <div className="card flex h-full min-h-[500px] flex-col overflow-hidden">
      <div className="border-b border-slate-200 bg-slate-50/50 p-3">
        <h3 className="font-medium text-slate-900">Message HR</h3>
      </div>

      {camp && (
        <div className="flex flex-col gap-2 border-b border-slate-200 bg-blue-50 px-3 py-2 text-sm text-blue-800 sm:flex-row sm:items-center sm:justify-between">
          <span>
            {camp.type === "camp" ? "Recruitment camp" : "Industry visit"} proposed for{" "}
            {camp.scheduled_date} — {CAMP_STATUS_LABEL[camp.status]}
          </span>
          {camp.status === "proposed" && (
            <button
              onClick={handleConfirm}
              disabled={isPending}
              className="self-start rounded-md bg-blue-600 px-3 py-1 text-xs font-medium text-white hover:bg-blue-700 sm:self-auto"
            >
              Confirm
            </button>
          )}
        </div>
      )}

      <div className="flex-1 space-y-3 overflow-y-auto p-4">
        {!messages.length && (
          <p className="text-sm text-slate-400">No messages yet — say hello.</p>
        )}
        {messages.map((m) => (
          <div
            key={m.id}
            className={`max-w-[75%] rounded-lg px-3 py-2 text-sm ${
              m.sender_role === "tp"
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
          placeholder="Message the HR contact…"
          className="input-field flex-1"
        />
        <button type="submit" disabled={isPending} className="btn-primary">
          Send
        </button>
      </form>
    </div>
  );
}
