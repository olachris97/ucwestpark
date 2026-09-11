import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Hero from "../components/Hero";
import CategoryGrid from "../components/CategoryGrid";
import FeaturedEvents from "../components/FeaturedEvents";
import EventGrid from "../components/EventGrid";
import HowItWorks from "../components/HowItWorks";
import WhyChooseUs from "../components/WhyChooseUs";
import CantFindSection from "../components/CantFindSection";
import Reveal from "../components/Reveal";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";
import { getEvents } from "../lib/store";
import type { EventItem } from "../types";

export default function Home() {
  const [events, setEvents] = useState<EventItem[] | null>(null);
  const [error, setError] = useState("");

  function load() {
    setError("");
    setEvents(null);
    getEvents()
      .then(setEvents)
      .catch((err) => setError(err.message || "Couldn't load events."));
  }

  useEffect(load, []);

  return (
    <div>
      <Hero />

      <section className="mx-auto max-w-7xl px-5 py-16 md:px-8">
        <Reveal>
          <h2 className="font-display text-3xl font-bold text-ink sm:text-4xl">
            Find parking by event type
          </h2>
        </Reveal>
        <div className="mt-8">
          <CategoryGrid />
        </div>
      </section>

      {error ? (
        <ErrorState message={error} onRetry={load} />
      ) : !events ? (
        <LoadingState label="Loading events…" />
      ) : (
        <>
          <FeaturedEvents events={events.filter((e) => e.featured)} />

          <section className="mx-auto max-w-7xl px-5 pb-20 md:px-8">
            <Reveal className="mb-10 flex items-end justify-between">
              <h2 className="font-display text-3xl font-bold text-ink sm:text-4xl">
                Upcoming event parking
              </h2>
              <Link
                to="/search"
                className="hidden text-sm font-semibold text-gold-dark hover:text-gold sm:block"
              >
                View all parking
              </Link>
            </Reveal>
            <EventGrid events={events.slice(0, 8)} />
          </section>
        </>
      )}

      <HowItWorks />
      <WhyChooseUs />
      <CantFindSection />
    </div>
  );
}
