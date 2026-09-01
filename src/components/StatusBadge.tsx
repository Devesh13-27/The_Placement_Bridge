import { STATUS_LABEL, STATUS_COLOR } from "@/lib/statusStyles";

export default function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_COLOR[status as keyof typeof STATUS_COLOR]}`}
    >
      {status === "open" && <span className="status-dot text-green-600" />}
      {STATUS_LABEL[status as keyof typeof STATUS_LABEL]}
    </span>
  );
}
