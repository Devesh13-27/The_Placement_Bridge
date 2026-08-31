"use client";

import { useTransition } from "react";
import { confirmCamp } from "@/app/college/actions";

export default function ConfirmButton({ campId }: { campId: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      onClick={() => startTransition(() => confirmCamp(campId))}
      disabled={isPending}
      className="rounded-md bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700 disabled:opacity-50"
    >
      Confirm
    </button>
  );
}
