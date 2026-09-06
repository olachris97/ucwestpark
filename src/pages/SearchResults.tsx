import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { SlidersHorizontal } from "lucide-react";
import SearchBar from "../components/SearchBar";
import EventGrid from "../components/EventGrid";
import EmptyState from "../components/EmptyState";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";
import { getEvents, getCategories } from "../lib/store";
import type { EventCategory, EventItem } from "../types";

type SortOption = "date-asc" | "price-asc" | "price-desc";

export default function SearchResults() {
  const [params] = useSearchParams();
  const q = params.get("q") ?? "";
  const initialCategory = (params.get("category") as EventCategory | null) ?? "";

  const [events, setEvents] = useState<EventItem[] | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [error, setError] = useState("");

  const [category, setCategory] = useState<string>(initialCategory);
  const [maxPrice, setMaxPrice] = useState<number>(600);
  const [sort, setSort] = useState<SortOption>("date-asc");
  const [showFilters, setShowFilters] = useState(false);

  function load() {
    setError("");
    setEvents(null);
    Promise.all([getEvents(), getCategories()])
      .then(([e, c]) => {
        setEvents(e);
        setCategories(c);
      })
      .catch((err) => setError(err.message || "Couldn't load events."));
  }

  useEffect(load, []);

  const results = useMemo(() => {
    if (!events) return [];
    let list = events.filter((e) => {
      const matchesQuery = q
        ? [e.name, e.venue, e.city, e.category].some((f) =>
            f.toLowerCase().includes(q.toLowerCase())
          )
        : true;
      const matchesCategory = category ? e.category === category : true;
      const matchesPrice = e.startingPrice ? e.startingPrice <= maxPrice : true;
      return matchesQuery && matchesCategory && matchesPrice;
    });

    list = [...list].sort((a, b) => {
      if (sort === "date-asc") return a.date.localeCompare(b.date);
      if (sort === "price-asc") return (a.startingPrice ?? 9999) - (b.startingPrice ?? 9999);
      return (b.startingPrice ?? 0) - (a.startingPrice ?? 0);
    });

    return list;
  }, [events, q, category, maxPrice, sort]);

  return (
    <div className="bg-paper">
      <div className="bg-marquee py-10">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <h1 className="font-display text-3xl font-bold text-paper sm:text-4xl">
            {q ? `Results for "${q}"` : "Browse events"}
          </h1>
          <div className="mt-6">
            <SearchBar initialValue={q} />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-5 py-10 md:px-8">
        <div className="flex flex-col gap-8 lg:flex-row">
          <aside className="lg:w-64 lg:shrink-0">
            <button
              className="mb-4 flex w-full items-center justify-between rounded-lg border border-paper-line bg-white px-4 py-3 text-sm font-semibold text-ink lg:hidden"
              onClick={() => setShowFilters((v) => !v)}
            >
              <span className="flex items-center gap-2">
                <SlidersHorizontal size={16} /> Filters
              </span>
              <span>{showFilters ? "Hide" : "Show"}</span>
            </button>

            <div className={`${showFilters ? "block" : "hidden"} space-y-6 lg:block`}>
              <div>
                <h3 className="text-sm font-semibold text-ink">Category</h3>
                <div className="mt-3 space-y-2">
                  <label className="flex items-center gap-2 text-sm text-ink-soft">
                    <input
                      type="radio"
                      name="category"
                      checked={category === ""}
                      onChange={() => setCategory("")}
                    />
                    All categories
                  </label>
                  {categories.map((c) => (
                    <label
                      key={c}
                      className="flex items-center gap-2 text-sm text-ink-soft"
                    >
                      <input
                        type="radio"
                        name="category"
                        checked={category === c}
                        onChange={() => setCategory(c as EventCategory)}
                      />
                      {c}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-ink">Max price</h3>
                <input
                  type="range"
                  min={20}
                  max={600}
                  step={10}
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="mt-3 w-full accent-gold"
                />
                <p className="mt-1 text-xs text-ink-soft">Up to ${maxPrice}</p>
              </div>
            </div>
          </aside>

          <div className="flex-1">
            <div className="mb-6 flex items-center justify-between">
              <p className="text-sm text-ink-soft">
                {events && `${results.length} ${results.length === 1 ? "result" : "results"}`}
              </p>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortOption)}
                className="rounded-lg border border-paper-line bg-white px-3 py-2 text-sm text-ink"
                aria-label="Sort events"
              >
                <option value="date-asc">Date: soonest</option>
                <option value="price-asc">Price: low to high</option>
                <option value="price-desc">Price: high to low</option>
              </select>
            </div>

            {error ? (
              <ErrorState message={error} onRetry={load} />
            ) : !events ? (
              <LoadingState label="Loading events…" />
            ) : results.length > 0 ? (
              <EventGrid events={results} />
            ) : (
              <EmptyState query={q} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
