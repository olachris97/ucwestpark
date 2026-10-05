import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { SlidersHorizontal, MapPin } from "lucide-react";
import SearchBar from "../components/SearchBar";
import EventGrid from "../components/EventGrid";
import EmptyState from "../components/EmptyState";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";
import { getEvents } from "../lib/store";
import { venueLocations } from "../data/venues";
import type { EventItem } from "../types";

type SortOption = "date-asc" | "price-asc" | "price-desc";

export default function SearchResults() {
  const [params] = useSearchParams();
  const q = params.get("q") ?? "";
  const matchedVenue = venueLocations.find((venue) => venue.venue.toLowerCase() === q.trim().toLowerCase());

  const [events, setEvents] = useState<EventItem[] | null>(null);
  const [error, setError] = useState("");

  const [maxPrice, setMaxPrice] = useState<number>(100);
  const [sort, setSort] = useState<SortOption>("date-asc");
  const [showFilters, setShowFilters] = useState(false);

  function load() {
    setError("");
    setEvents(null);
    getEvents()
      .then((e) => {
        setEvents(e);
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
      const matchesPrice = e.startingPrice ? e.startingPrice <= maxPrice : true;
      return matchesQuery && matchesPrice;
    });

    list = [...list].sort((a, b) => {
      if (sort === "date-asc") return a.date.localeCompare(b.date);
      if (sort === "price-asc") return (a.startingPrice ?? 9999) - (b.startingPrice ?? 9999);
      return (b.startingPrice ?? 0) - (a.startingPrice ?? 0);
    });

    return list;
  }, [events, q, maxPrice, sort]);

  return (
    <div className="bg-paper">
      <div className="bg-marquee py-10">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <h1 className="font-display text-3xl font-bold text-paper sm:text-4xl">
            {q ? `Parking near ${q}` : "Find parking close to your event venue"}
          </h1>
          <div className="mt-6">
            <SearchBar initialValue={q} />
          </div>
          {matchedVenue && (
            <div className="mt-6 overflow-hidden rounded-2xl border border-white/15 bg-white/10 backdrop-blur-sm sm:flex sm:items-stretch">
              {matchedVenue.image ? (
                <img
                  src={matchedVenue.image}
                  alt={`${matchedVenue.venue} in ${matchedVenue.city}, ${matchedVenue.state}`}
                  className="h-40 w-full object-cover sm:h-auto sm:w-56"
                />
              ) : (
                <div className="flex h-40 w-full items-center justify-center bg-gold/20 text-gold-light sm:h-auto sm:w-56">
                  <MapPin size={30} />
                </div>
              )}
              <div className="flex flex-1 flex-col justify-center px-5 py-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gold-light">Venue destination</p>
                <h2 className="mt-1 font-display text-xl font-bold text-paper">{matchedVenue.venue}</h2>
                <p className="mt-1 text-sm text-paper/70">{matchedVenue.city}, {matchedVenue.state} · {matchedVenue.region}</p>
                <p className="mt-3 text-sm text-paper/85">Browse parking options close to this venue.</p>
              </div>
            </div>
          )}
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
                <h3 className="text-sm font-semibold text-ink">Max parking price</h3>
                <input
                  type="range"
                  min={5}
                  max={100}
                  step={10}
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="mt-3 w-full accent-gold"
                />
                <p className="mt-1 text-xs text-ink-soft">Up to ${maxPrice} per parking pass</p>
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
                aria-label="Sort parking options"
              >
                <option value="date-asc">Event date: soonest</option>
                <option value="price-asc">Parking price: low to high</option>
                <option value="price-desc">Parking price: high to low</option>
              </select>
            </div>

            {error ? (
              <ErrorState message={error} onRetry={load} />
            ) : !events ? (
              <LoadingState label="Loading parking options…" />
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
