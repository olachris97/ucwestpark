import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { getAllRequests, getEvents } from "../../lib/store";
import StatusBadge from "./StatusBadge";
import LoadingState from "../../components/LoadingState";
import ErrorState from "../../components/ErrorState";
import type { AnyRequest, EventItem } from "../../types";

export default function Dashboard() {
  const [requests, setRequests] = useState<AnyRequest[] | null>(null);
  const [events, setEvents] = useState<EventItem[] | null>(null);
  const [error, setError] = useState("");

  function load() {
    setError("");
    setRequests(null);
    setEvents(null);
    Promise.all([getAllRequests(), getEvents()])
      .then(([r, e]) => {
        setRequests(r);
        setEvents(e);
      })
      .catch((err) => setError(err.message || "Couldn't load the dashboard."));
  }

  useEffect(load, []);

  if (error) return <ErrorState message={error} onRetry={load} />;
  if (!requests || !events) return <LoadingState label="Loading dashboard…" />;

  const counts = {
    Pending: requests.filter((r) => r.status === "Pending").length,
    Contacted: requests.filter((r) => r.status === "Contacted").length,
    Confirmed: requests.filter((r) => r.status === "Confirmed").length,
    Closed: requests.filter((r) => r.status === "Closed").length,
  };

  const recent = requests.slice(0, 6);

  function kindLabel(kind: AnyRequest["kind"]) {
    if (kind === "ticket") return "Ticket request";
    if (kind === "custom-event") return "Custom event";
    return "Contact message";
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-black sm:text-3xl">
        Dashboard
      </h1>
      <p className="mt-1 text-sm text-ink-soft">
        A snapshot of incoming ticket and event requests.
      </p>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        <StatCard label="Total requests" value={requests.length} index={0} />
        <StatCard label="Pending" value={counts.Pending} accent index={1} />
        <StatCard label="Contacted" value={counts.Contacted} index={2} />
        <StatCard label="Confirmed" value={counts.Confirmed} index={3} />
        <StatCard label="Closed" value={counts.Closed} index={4} />
        <StatCard label="Live events" value={events.length} index={5} />
      </div>

      <div className="mt-10 rounded-xl border border-paper-line bg-white">
        <div className="flex items-center justify-between border-b border-paper-line px-5 py-4">
          <h2 className="font-display text-lg font-semibold text-black">
            Recent requests
          </h2>
          <Link to="/admin/requests" className="text-sm font-semibold text-gold-dark hover:text-gold">
            View all
          </Link>
        </div>

        {recent.length === 0 ? (
          <p className="px-5 py-10 text-center text-sm text-ink-soft">
            No requests have come in yet.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="text-xs uppercase text-ink-soft/70">
                  <th className="px-5 py-3 font-medium">Name</th>
                  <th className="px-5 py-3 font-medium">Event</th>
                  <th className="px-5 py-3 font-medium">Type</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((r) => (
                  <tr key={r.id} className="border-t border-paper-line">
                    <td className="px-5 py-3">
                      {r.firstName} {r.lastName}
                    </td>
                    <td className="px-5 py-3">{r.kind === "contact" ? r.subject : r.eventName}</td>
                    <td className="px-5 py-3 text-ink-soft">{kindLabel(r.kind)}</td>
                    <td className="px-5 py-3">
                      <StatusBadge status={r.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  accent,
  index = 0,
}: {
  label: string;
  value: number;
  accent?: boolean;
  index?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -3 }}
      className={`rounded-xl border p-4 ${
        accent ? "border-gold bg-gold/10" : "border-paper-line bg-white"
      }`}
    >
      <p className="font-display text-2xl font-semibold text-black">{value}</p>
      <p className="mt-1 text-xs text-ink-soft">{label}</p>
    </motion.div>
  );
}
