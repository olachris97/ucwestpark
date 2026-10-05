import type { RequestStatus } from "../../types";

const styles: Record<RequestStatus, string> = {
  Pending: "bg-gold/15 text-gold-dark",
  Contacted: "bg-blue-50 text-blue-700",
  Confirmed: "bg-green-50 text-green-700",
  Closed: "bg-black/5 text-ink-soft",
  Cancelled: "bg-red-50 text-red-600",
};

export default function StatusBadge({ status }: { status: RequestStatus }) {
  return (
    <span
      className={`inline-block rounded-full px-2.5 py-1 text-xs font-semibold ${styles[status]}`}
    >
      {status}
    </span>
  );
}
