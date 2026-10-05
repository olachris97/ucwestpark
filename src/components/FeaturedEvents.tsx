import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CalendarDays, MapPin } from "lucide-react";
import type { EventItem } from "../types";
import Reveal from "./Reveal";

const MotionLink = motion.create(Link);

function formatDate(iso: string) {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

export default function FeaturedEvents({ events }: { events: EventItem[] }) {
  const [main, ...rest] = events;
  if (!main) return null;

  return (
    <section className="mx-auto max-w-7xl px-5 py-20 md:px-8">
      <Reveal className="mb-10 flex items-end justify-between">
        <div>
          <h2 className="font-display text-3xl font-bold text-ink sm:text-4xl">
            Popular event parking
          </h2>
          <p className="mt-2 text-ink-soft">Major events where finding parking early can make the night easier.</p>
        </div>
        <Link
          to="/search"
          className="hidden text-sm font-semibold text-gold-dark hover:text-gold sm:block"
        >
          View all events
        </Link>
      </Reveal>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <MotionLink
          to={`/events/${main.slug}`}
          className="group relative flex min-h-[420px] flex-col justify-end overflow-hidden rounded-2xl"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          whileHover={{ y: -4 }}
        >
          <img
            src={main.image}
            alt={main.name}
            className="absolute inset-0 h-full w-full bg-marquee-light object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(e) => {
              (e.target as HTMLImageElement).style.opacity = "0";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-marquee-deep via-marquee-deep/40 to-transparent" />
          <div className="relative p-8 text-paper">
            <span className="rounded-full bg-gold px-3 py-1 text-xs font-semibold text-marquee">
              {main.category}
            </span>
            <h3 className="mt-4 font-display text-4xl font-bold leading-tight">
              {main.name}
            </h3>
            <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm text-paper/80">
              <span className="flex items-center gap-1.5">
                <CalendarDays size={14} /> {formatDate(main.date)}
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin size={14} /> {main.city}
              </span>
            </div>
            <span className="mt-6 inline-block rounded-full bg-paper px-6 py-3 text-sm font-semibold text-marquee">
              {main.startingPrice ? "Find Parking" : "Find Parking"}
            </span>
          </div>
        </MotionLink>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-1">
          {rest.slice(0, 3).map((event, i) => (
            <MotionLink
              key={event.id}
              to={`/events/${event.slug}`}
              className="group flex items-center gap-4 rounded-xl border border-paper-line bg-white p-3"
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.45, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -3, boxShadow: "0 12px 24px -12px rgba(0,0,0,0.2)" }}
            >
              <img
                src={event.image}
                alt={event.name}
                className="h-20 w-24 shrink-0 rounded-lg bg-paper-stub object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.visibility = "hidden";
                }}
              />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-gold-dark">{event.category}</p>
                <h4 className="truncate font-display text-lg font-semibold text-ink">
                  {event.name}
                </h4>
                <p className="truncate text-xs text-ink-soft">
                  {formatDate(event.date)} &middot; {event.city}
                </p>
              </div>
            </MotionLink>
          ))}
        </div>
      </div>
    </section>
  );
}
