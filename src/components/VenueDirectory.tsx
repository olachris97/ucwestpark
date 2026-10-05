import { useEffect, useMemo, useState } from "react";
import { ArrowRight, MapPin, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { venueLocations as fallbackLocations } from "../data/venues";
import { getCategories, getLocations } from "../lib/store";
import type { LocationItem } from "../types";

const fallbackRegions = ["South", "Northeast", "Canada", "Midwest", "West"];
const INITIAL_VISIBLE = 12;
const LOAD_MORE_COUNT = 4;

export default function VenueDirectory() {
  const [region, setRegion] = useState("All");
  const [regions, setRegions] = useState<string[]>(fallbackRegions);
  const [query, setQuery] = useState("");
  const [locations, setLocations] = useState<LocationItem[]>(fallbackLocations.map((v, i) => ({ ...v, id: `fallback-${i}` })));
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE);

  useEffect(() => {
    let active = true;
    Promise.all([getLocations(), getCategories()])
      .then(([items, categories]) => {
        if (!active) return;
        if (items.length) setLocations(items);
        if (categories.length) setRegions(categories);
      })
      .catch(() => {});
    return () => { active = false; };
  }, []);

  const filteredLocations = useMemo(() => {
    const q = query.trim().toLowerCase();
    return locations.filter((location) => {
      const matchesRegion = region === "All" || location.region === region;
      const matchesQuery = !q || [location.venue, location.city, location.state, location.region].some((value) => value.toLowerCase().includes(q));
      return matchesRegion && matchesQuery;
    });
  }, [locations, region, query]);

  useEffect(() => { setVisibleCount(INITIAL_VISIBLE); }, [region, query]);

  const visibleLocations = filteredLocations.slice(0, visibleCount);
  const hasMore = visibleCount < filteredLocations.length;

  return (
    <section className="border-y border-black/5 bg-[#F7F9FC] py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-gold-dark">Parking locations</p>
            <h2 className="mt-2 font-display text-3xl font-bold text-ink sm:text-4xl">Where are you going?</h2>
            <p className="mt-3 max-w-2xl text-ink-soft">Choose your venue to request parking. Select a location and tell us what you need.</p>
          </div>
          <div className="relative w-full lg:max-w-sm">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-soft" size={18} />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search venues or cities" className="input pl-10" aria-label="Search venues or cities" />
          </div>
        </div>

        <div className="mt-7 flex flex-wrap gap-2" role="tablist" aria-label="Venue regions">
          {["All", ...regions].map((item) => (
            <button key={item} type="button" onClick={() => setRegion(item)} className={`rounded-full border px-4 py-2 text-sm font-semibold transition-all ${region === item ? "border-marquee bg-marquee text-paper shadow-sm" : "border-black/10 bg-white text-ink-soft hover:border-gold hover:text-ink"}`} role="tab" aria-selected={region === item}>{item}</button>
          ))}
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {visibleLocations.map((location) => {
            const params = new URLSearchParams({ venue: location.venue, city: location.city, state: location.state, region: location.region, locationId: location.id });
            return (
              <Link key={location.id} to={`/request-event?${params.toString()}`} className="group overflow-hidden rounded-2xl border border-black/8 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-gold/60 hover:shadow-xl">
                <div className="relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-marquee to-[#163A63]">
                  {location.image ? <img src={location.image} alt={`${location.venue} in ${location.city}, ${location.state}`} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" /> : <div className="flex h-full flex-col items-center justify-center px-6 text-center text-paper"><MapPin size={25} /><span className="mt-2 text-xs font-semibold uppercase tracking-[0.18em] text-gold-light">Venue parking</span></div>}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-4 pb-3 pt-10"><span className="text-xs font-semibold uppercase tracking-[0.14em] text-white/80">{location.region}</span></div>
                </div>
                <div className="p-4">
                  <h3 className="font-display text-base font-bold leading-tight text-ink group-hover:text-gold-dark">{location.venue}</h3>
                  <p className="mt-1 flex items-center gap-1.5 text-sm text-ink-soft"><MapPin size={14} />{location.city}, {location.state}</p>
                  <div className="mt-4 flex items-center justify-between border-t border-black/5 pt-3"><span className="text-xs font-semibold text-ink-soft">Request parking</span><span className="flex items-center gap-1 text-xs font-bold text-gold-dark">Get started <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" /></span></div>
                </div>
              </Link>
            );
          })}
        </div>

        {filteredLocations.length === 0 && <div className="mt-8 rounded-2xl border border-dashed border-black/15 bg-white px-6 py-12 text-center"><MapPin className="mx-auto text-ink-soft" size={28} /><h3 className="mt-3 font-display text-xl font-bold text-ink">No location found</h3><p className="mt-1 text-sm text-ink-soft">Try another venue name, city, or region.</p></div>}
        {hasMore && <div className="mt-10 flex justify-center"><button type="button" onClick={() => setVisibleCount((count) => count + LOAD_MORE_COUNT)} className="rounded-full border border-black bg-white px-7 py-3 text-sm font-semibold text-black transition-colors hover:bg-black hover:text-white">Load more locations</button></div>}
      </div>
    </section>
  );
}
