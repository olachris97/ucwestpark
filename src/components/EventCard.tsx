import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CalendarDays, MapPin } from "lucide-react";
import type { EventItem } from "../types";

const MotionLink = motion.create(Link);

function formatDate(iso: string) {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function EventCard({ event, index = 0 }: { event: EventItem; index?: number }) {
  return (
    <MotionLink
      to={`/events/${event.slug}`}
      className="group relative flex flex-col overflow-hidden rounded-lg border border-paper-line bg-white shadow-sm"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.45, delay: Math.min(index, 6) * 0.06, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -6, boxShadow: "0 20px 35px -15px rgba(0,0,0,0.25)" }}
    >
      <div className="relative h-44 w-full overflow-hidden bg-marquee-deep">
        <img
          src={event.image}
          alt={event.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = "none";
          }}
        />
        <span className="absolute left-3 top-3 rounded-full bg-marquee/90 px-3 py-1 text-xs font-semibold text-gold-light">
          {event.category}
        </span>
        {event.status === "limited" && (
          <span className="absolute right-3 top-3 rounded-full bg-gold px-3 py-1 text-xs font-semibold text-marquee">
            Filling Fast
          </span>
        )}
      </div>

      <div className="relative flex flex-1 flex-col px-5 pb-5 pt-4">
        <span
          className="ticket-notch-left ticket-notch-right absolute -left-px -right-px top-0 h-px"
          aria-hidden="true"
        />
        <h3 className="font-display text-xl font-semibold leading-tight text-ink">
          {event.name}
        </h3>

        <div className="mt-2 space-y-1 text-sm text-ink-soft">
          <div className="flex items-center gap-1.5">
            <CalendarDays size={14} className="shrink-0 text-gold-dark" />
            <span>
              {formatDate(event.date)} &middot; {event.time}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin size={14} className="shrink-0 text-gold-dark" />
            <span>
              {event.venue}, {event.city}
            </span>
          </div>
        </div>

        <div className="my-4 border-t border-dashed border-paper-line" />

        <div className="mt-auto flex items-center justify-between">
          <div>
            <p className="text-xs uppercase text-ink-soft/70">
              {event.startingPrice ? "Parking from" : "Parking"}
            </p>
            <p className="font-display text-lg font-semibold text-ink">
              {event.startingPrice ? `$${event.startingPrice}` : "Request Parking"}
            </p>
          </div>
          <span className="rounded-full bg-marquee px-4 py-2 text-sm font-semibold text-paper transition-colors group-hover:bg-gold group-hover:text-marquee">
            Find Parking
          </span>
        </div>
      </div>
    </MotionLink>
  );
}
