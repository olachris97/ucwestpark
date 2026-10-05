import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { MapPin, Search } from "lucide-react";
import SearchBar from "../components/SearchBar";
import EmptyState from "../components/EmptyState";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";
import { getLocations } from "../lib/store";
import type { LocationItem } from "../types";

export default function SearchResults() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const q = params.get("q") ?? "";

  const [locations, setLocations] = useState<LocationItem[] | null>(null);
  const [error, setError] = useState("");

  async function load() {
    setError("");

    try {
      const data = await getLocations();
      setLocations(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Couldn't load parking locations."
      );
    }
  }

  useEffect(() => {
    load();
  }, []);

  const results = useMemo(() => {
    if (!locations) return [];

    const query = q.trim().toLowerCase();

    if (!query) return locations;

    return locations.filter((location) =>
      [
        location.venue,
        location.city,
        location.state,
        location.region,
        location.address ?? "",
      ].some((value) => value.toLowerCase().includes(query))
    );
  }, [locations, q]);

  return (
    <div className="bg-paper min-h-screen">
      <div className="bg-marquee py-10">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <h1 className="font-display text-3xl font-bold text-paper sm:text-4xl">
            {q
              ? `Parking near ${q}`
              : "Find parking close to your venue"}
          </h1>

          <div className="mt-6">
            <SearchBar initialValue={q} />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-5 py-10 md:px-8">
        {error ? (
          <ErrorState message={error} onRetry={load} />
        ) : !locations ? (
          <LoadingState label="Loading parking locations…" />
        ) : (
          <>
            <div className="mb-6">
              <p className="text-sm text-ink-soft">
                {results.length}{" "}
                {results.length === 1 ? "location" : "locations"} found
              </p>
            </div>

            {results.length === 0 ? (
              <EmptyState query={q} />
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {results.map((location) => (
                  <button
                    key={location.id}
                    type="button"
                    onClick={() =>
                      navigate(
                        `/request-parking?venue=${encodeURIComponent(
                          location.venue
                        )}&city=${encodeURIComponent(
                          location.city
                        )}&state=${encodeURIComponent(
                          location.state
                        )}`
                      )
                    }
                    className="group overflow-hidden rounded-2xl border border-paper-line bg-white text-left shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                  >
                    <div className="relative h-52 overflow-hidden bg-paper-stub">
                      {location.image ? (
                        <img
                          src={location.image}
                          alt={location.venue}
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <MapPin size={36} className="text-gold-dark" />
                        </div>
                      )}
                    </div>

                    <div className="p-5">
                      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-gold-dark">
                        {location.region}
                      </p>

                      <h2 className="mt-1 font-display text-xl font-bold text-ink">
                        {location.venue}
                      </h2>

                      <p className="mt-2 flex items-center gap-1.5 text-sm text-ink-soft">
                        <MapPin size={15} />
                        {location.city}, {location.state}
                      </p>

                      <span className="mt-5 inline-flex items-center gap-2 rounded-full bg-marquee px-4 py-2.5 text-sm font-semibold text-paper">
                        <Search size={15} />
                        Request Parking
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}