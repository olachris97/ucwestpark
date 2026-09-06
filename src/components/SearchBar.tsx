import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";

const quickCategories = [
  "Concerts",
  "Sports",
  "Festivals",
  "Theatre",
  "Comedy",
  "Family",
  "Other Events",
];

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
    const params = new URLSearchParams();
    if (value.trim()) params.set("q", value.trim());
    navigate(`/search?${params.toString()}`);
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
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Search concerts, sports, festivals, shows..."
            className="w-full bg-transparent py-2 text-base text-ink placeholder:text-ink-soft/50 focus:outline-none"
            aria-label="Search events"
          />
        </div>
        <button
          type="submit"
          className="rounded-xl bg-marquee px-6 py-3 text-sm font-semibold text-paper transition-colors hover:bg-marquee-light"
        >
          Search Events
        </button>
      </form>

      <div className="mt-4 flex flex-wrap gap-2">
        {quickCategories.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => navigate(`/search?category=${encodeURIComponent(c)}`)}
            className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors hover:border-gold hover:text-gold-dark ${
              dark
                ? "border-paper/30 text-paper/90 hover:text-gold-light"
                : "border-black/20 text-black/70"
            }`}
          >
            {c}
          </button>
        ))}
      </div>
    </div>
  );
}
