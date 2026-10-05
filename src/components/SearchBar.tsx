import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Search, MapPin } from "lucide-react";
import { venueLocations } from "../data/venues";

export default function SearchBar({
  initialValue = "",
  large = false,
  dark = true,
}: {
  initialValue?: string;
  large?: boolean;
  dark?: boolean;
}) {
  const [value, setValue] = useState(initialValue);
  const navigate = useNavigate();

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    const q = value.trim();

    navigate(q ? `/search?q=${encodeURIComponent(q)}` : "/search");
  }

  return (
    <div className="w-full">
      <form
        onSubmit={handleSubmit}
        className={`flex flex-col gap-3 rounded-2xl bg-paper p-3 shadow-xl shadow-black/20 sm:flex-row sm:items-center ${
          large ? "sm:p-3" : ""
        }`}
      >
        <div className="flex flex-1 items-center gap-3 rounded-xl px-3 py-2">
          <Search className="shrink-0 text-ink-soft" size={20} />

          <input
            list="ucwestpark-venues"
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Search a venue or city..."
            className="w-full bg-transparent py-2 text-base text-ink placeholder:text-ink-soft/50 focus:outline-none"
            aria-label="Search for parking by venue or city"
          />

          <datalist id="ucwestpark-venues">
            {venueLocations.map((location) => (
              <option
                key={`${location.venue}-${location.city}`}
                value={location.venue}
              >
                {location.city}, {location.state}
              </option>
            ))}
          </datalist>
        </div>

        <button
          type="submit"
          className="rounded-xl bg-marquee px-6 py-3 text-sm font-semibold text-paper transition-colors hover:bg-marquee-light"
        >
          Find Parking
        </button>
      </form>

      <div
        className={`mt-4 flex items-center gap-2 text-xs font-medium ${
          dark ? "text-paper/70" : "text-black/60"
        }`}
      >
        <MapPin size={14} />

        <span>
          Try a venue:{" "}
          {venueLocations
            .slice(0, 4)
            .map((location) => location.venue)
            .join(" · ")}
        </span>
      </div>
    </div>
  );
}
