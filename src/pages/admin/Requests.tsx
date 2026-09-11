import { useEffect, useMemo, useState } from "react";
import { getAllRequests, updateRequestStatus } from "../../lib/store";
import type { AnyRequest, RequestStatus } from "../../types";
import StatusBadge from "./StatusBadge";
import LoadingState from "../../components/LoadingState";
import ErrorState from "../../components/ErrorState";

const statuses: RequestStatus[] = ["Pending", "Contacted", "Confirmed", "Closed", "Cancelled"];

export default function Requests() {
  const [requests, setRequests] = useState<AnyRequest[] | null>(null);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState<RequestStatus | "">("");
  const [kindFilter, setKindFilter] = useState<"" | "ticket" | "custom-event" | "contact">("");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  function load() {
    setError("");
    setRequests(null);
    getAllRequests()
      .then(setRequests)
      .catch((err) => setError(err.message || "Couldn't load requests."));
  }

  useEffect(load, []);

  const filtered = useMemo(() => {
    if (!requests) return [];
    return requests.filter((r) => {
      const matchesStatus = statusFilter ? r.status === statusFilter : true;
      const matchesKind = kindFilter ? r.kind === kindFilter : true;
      return matchesStatus && matchesKind;
    });
  }, [requests, statusFilter, kindFilter]);

  async function handleStatusChange(r: AnyRequest, status: RequestStatus) {
    if (r.kind === "contact") return;

    setUpdatingId(r.id);
    setError("");
    try {
      await updateRequestStatus(r.kind, r.id, status);
      setRequests((prev) => prev && prev.map((x) => (x.id === r.id ? { ...x, status } : x)));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't update that request.");
    } finally {
      setUpdatingId(null);
    }
  }

  if (error && !requests) return <ErrorState message={error} onRetry={load} />;
  if (!requests) return <LoadingState label="Loading requests…" />;

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-black sm:text-3xl">
        Requests
      </h1>
      <p className="mt-1 text-sm text-ink-soft">
        Parking requests, custom event requests, and contact messages submitted through the site.
      </p>
      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}

      <div className="mt-6 flex flex-wrap gap-3">
        <select
          value={kindFilter}
          onChange={(e) => setKindFilter(e.target.value as typeof kindFilter)}
          className="rounded-lg border border-paper-line bg-white px-3 py-2 text-sm"
        >
          <option value="">All types</option>
          <option value="ticket">Parking requests</option>
          <option value="custom-event">Custom event requests</option>
          <option value="contact">Contact messages</option>
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as RequestStatus | "")}
          className="rounded-lg border border-paper-line bg-white px-3 py-2 text-sm"
        >
          <option value="">All statuses</option>
          {statuses.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <p className="ml-auto self-center text-sm text-ink-soft">
          {filtered.length} of {requests.length} requests
        </p>
      </div>

      <div className="mt-6 overflow-hidden rounded-xl border border-paper-line bg-white">
        {filtered.length === 0 ? (
          <p className="px-5 py-10 text-center text-sm text-ink-soft">
            No requests match these filters.
          </p>
        ) : (
          <div className="divide-y divide-paper-line">
            {filtered.map((r) => (
              <div key={r.id} className="px-5 py-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <button
                      onClick={() => setExpanded(expanded === r.id ? null : r.id)}
                      className="text-left"
                    >
                      <p className="font-semibold text-black">
                        {r.firstName} {r.lastName}{" "}
                        <span className="font-normal text-ink-soft">
                          — {r.kind === "contact" ? r.subject : r.eventName}
                        </span>
                      </p>
                      <p className="text-xs text-ink-soft">
                        {r.kind === "ticket"
                          ? "Parking request"
                          : r.kind === "custom-event"
                            ? "Custom event request"
                            : "Contact message"}{" "}
                        · {r.id} · {new Date(r.createdAt).toLocaleString()}
                      </p>
                    </button>
                  </div>

                  <div className="flex items-center gap-3">
                    <StatusBadge status={r.status} />
                    <select
                      value={r.status}
                      disabled={updatingId === r.id || r.kind === "contact"}
                      onChange={(e) =>
                        handleStatusChange(r, e.target.value as RequestStatus)
                      }
                      className="rounded-lg border border-paper-line bg-white px-2 py-1.5 text-xs font-medium disabled:opacity-50"
                      aria-label={`Update status for ${r.firstName} ${r.lastName}`}
                    >
                      {statuses.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {expanded === r.id && (
                  <div className="mt-4 grid grid-cols-1 gap-x-8 gap-y-2 rounded-lg bg-paper-stub/60 p-4 text-sm sm:grid-cols-2">
                    <Detail label="Email" value={r.email} />
                    <Detail label="Phone" value={r.phone || "—"} />
                    {r.kind !== "contact" && (
                      <>
                        <Detail label="Parking passes requested" value={String(r.ticketQuantity)} />
                        <Detail label="Budget" value={r.budget || "—"} />
                        <Detail label="Parking preference" value={String(r.seatPreference) || "—"} />
                      </>
                    )}
                    {r.kind === "custom-event" && (
                      <>
                        <Detail label="Artist / team" value={r.artist || "—"} />
                        <Detail label="Category" value={r.category || "—"} />
                        <Detail label="City" value={r.city || "—"} />
                        <Detail label="Venue" value={r.venue || "—"} />
                        <Detail label="Flexibility" value={r.flexibility} />
                        <div className="sm:col-span-2">
                          <Detail label="Notes" value={r.notes || "—"} />
                        </div>
                      </>
                    )}
                    {r.kind === "ticket" && (
                      <>
                        <Detail label="Location" value={r.location} />
                        <div className="sm:col-span-2">
                          <Detail label="Notes" value={r.notes || "—"} />
                        </div>
                      </>
                    )}
                    {r.kind === "contact" && (
                      <>
                        <Detail label="Subject" value={r.subject} />
                        <div className="sm:col-span-2">
                          <Detail label="Message" value={r.message} />
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <p>
      <span className="text-ink-soft">{label}: </span>
      <span className="text-black">{value}</span>
    </p>
  );
}
