import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Pencil, Trash2, Plus } from "lucide-react";
import { getEvents, deleteEvent } from "../../lib/store";
import LoadingState from "../../components/LoadingState";
import ErrorState from "../../components/ErrorState";
import type { EventItem } from "../../types";

function formatDate(iso: string) {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function Events() {
  const [events, setEvents] = useState<EventItem[] | null>(null);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  function load() {
    setError("");
    setEvents(null);
    getEvents()
      .then(setEvents)
      .catch((err) => setError(err.message || "Couldn't load events."));
  }

  useEffect(load, []);

  async function handleDelete(event: EventItem) {
    const ok = window.confirm(`Remove "${event.name}" from the site? This can't be undone.`);
    if (!ok) return;
    setDeletingId(event.id);
    try {
      await deleteEvent(event.id);
      setEvents((prev) => prev && prev.filter((e) => e.id !== event.id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't delete that event.");
    } finally {
      setDeletingId(null);
    }
  }

  if (error && !events) return <ErrorState message={error} onRetry={load} />;
  if (!events) return <LoadingState label="Loading events…" />;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold text-black sm:text-3xl">
            Events
          </h1>
          <p className="mt-1 text-sm text-ink-soft">
            Add, edit, or remove events. Changes appear on the site immediately.
          </p>
        </div>
        <Link
          to="/admin/events/new"
          className="flex items-center gap-2 rounded-full bg-gold px-5 py-2.5 text-sm font-semibold text-black hover:bg-gold-light"
        >
          <Plus size={16} /> Add event
        </Link>
      </div>
      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}

      <div className="mt-6 overflow-x-auto rounded-xl border border-paper-line bg-white">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="text-xs uppercase text-ink-soft/70">
              <th className="px-5 py-3 font-medium">Photo</th>
              <th className="px-5 py-3 font-medium">Event</th>
              <th className="px-5 py-3 font-medium">Category</th>
              <th className="px-5 py-3 font-medium">Date</th>
              <th className="px-5 py-3 font-medium">City</th>
              <th className="px-5 py-3 font-medium">Tickets</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium">Featured</th>
              <th className="px-5 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {events.map((e) => (
              <tr key={e.id} className="border-t border-paper-line">
                <td className="px-5 py-3">
                  <div className="h-11 w-14 overflow-hidden rounded-md bg-paper-stub">
                    {e.image && (
                      <img
                        src={e.image}
                        alt=""
                        className="h-full w-full object-cover"
                        onError={(ev) => {
                          (ev.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                    )}
                  </div>
                </td>
                <td className="max-w-[220px] truncate px-5 py-3 font-medium text-black">
                  {e.name}
                </td>
                <td className="px-5 py-3 text-ink-soft">{e.category}</td>
                <td className="px-5 py-3 text-ink-soft">{formatDate(e.date)}</td>
                <td className="px-5 py-3 text-ink-soft">{e.city}</td>
                <td className="px-5 py-3 text-ink-soft">{e.ticketsAvailable}</td>
                <td className="px-5 py-3 text-ink-soft capitalize">{e.status.replace("-", " ")}</td>
                <td className="px-5 py-3 text-ink-soft">{e.featured ? "Yes" : "—"}</td>
                <td className="px-5 py-3">
                  <div className="flex justify-end gap-2">
                    <Link
                      to={`/admin/events/${e.id}/edit`}
                      className="rounded-lg border border-paper-line p-2 text-ink-soft hover:border-gold hover:text-gold-dark"
                      aria-label={`Edit ${e.name}`}
                    >
                      <Pencil size={15} />
                    </Link>
                    <button
                      onClick={() => handleDelete(e)}
                      disabled={deletingId === e.id}
                      className="rounded-lg border border-paper-line p-2 text-ink-soft hover:border-red-400 hover:text-red-500 disabled:opacity-50"
                      aria-label={`Delete ${e.name}`}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {events.length === 0 && (
          <p className="px-5 py-10 text-center text-sm text-ink-soft">
            No events yet. Add your first event to get started.
          </p>
        )}
      </div>
    </div>
  );
}
