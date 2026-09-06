import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Trash2, Plus } from "lucide-react";
import { getCategories, addCategory, deleteCategory, getEvents } from "../../lib/store";
import LoadingState from "../../components/LoadingState";
import ErrorState from "../../components/ErrorState";
import type { EventItem } from "../../types";

export default function Categories() {
  const [categories, setCategories] = useState<string[] | null>(null);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [error, setError] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [adding, setAdding] = useState(false);
  const [deletingName, setDeletingName] = useState<string | null>(null);

  function load() {
    setError("");
    setCategories(null);
    Promise.all([getCategories(), getEvents()])
      .then(([c, e]) => {
        setCategories(c);
        setEvents(e);
      })
      .catch((err) => setError(err.message || "Couldn't load categories."));
  }

  useEffect(load, []);

  async function handleAdd(e: FormEvent) {
    e.preventDefault();
    const name = newCategory.trim();
    if (!name) return;
    setAdding(true);
    setError("");
    try {
      await addCategory(name);
      setCategories((prev) => (prev ? [...prev, name] : [name]));
      setNewCategory("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't add that category.");
    } finally {
      setAdding(false);
    }
  }

  async function handleDelete(name: string) {
    const inUse = events.filter((e) => e.category === name).length;
    const message = inUse
      ? `${inUse} event${inUse === 1 ? "" : "s"} currently use "${name}". Remove the category anyway?`
      : `Remove the "${name}" category?`;
    if (!window.confirm(message)) return;

    setDeletingName(name);
    setError("");
    try {
      await deleteCategory(name);
      setCategories((prev) => prev && prev.filter((c) => c !== name));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't delete that category.");
    } finally {
      setDeletingName(null);
    }
  }

  if (error && !categories) return <ErrorState message={error} onRetry={load} />;
  if (!categories) return <LoadingState label="Loading categories…" />;

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-black sm:text-3xl">
        Categories
      </h1>
      <p className="mt-1 text-sm text-ink-soft">
        Categories power the homepage browse grid and event filters.
      </p>
      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}

      <form onSubmit={handleAdd} className="mt-6 flex max-w-md gap-2">
        <input
          type="text"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          placeholder="e.g. Esports"
          className="flex-1 rounded-lg border border-paper-line bg-white px-3 py-2 text-sm focus:border-gold focus:outline-none"
        />
        <button
          type="submit"
          disabled={adding}
          className="flex items-center gap-1.5 rounded-lg bg-gold px-4 py-2 text-sm font-semibold text-black hover:bg-gold-light disabled:opacity-60"
        >
          <Plus size={16} /> Add
        </button>
      </form>

      <div className="mt-6 max-w-md overflow-hidden rounded-xl border border-paper-line bg-white">
        {categories.map((c) => {
          const count = events.filter((e) => e.category === c).length;
          return (
            <div
              key={c}
              className="flex items-center justify-between border-b border-paper-line px-5 py-3 last:border-b-0"
            >
              <div>
                <p className="text-sm font-medium text-black">{c}</p>
                <p className="text-xs text-ink-soft">
                  {count} event{count === 1 ? "" : "s"}
                </p>
              </div>
              <button
                onClick={() => handleDelete(c)}
                disabled={deletingName === c}
                className="rounded-lg border border-paper-line p-2 text-ink-soft hover:border-red-400 hover:text-red-500 disabled:opacity-50"
                aria-label={`Delete ${c}`}
              >
                <Trash2 size={15} />
              </button>
            </div>
          );
        })}
        {categories.length === 0 && (
          <p className="px-5 py-10 text-center text-sm text-ink-soft">
            No categories yet.
          </p>
        )}
      </div>
    </div>
  );
}
