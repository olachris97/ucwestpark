import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import SearchBar from "./SearchBar";

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.09, delayChildren: 0.05 },
  },
};

const item = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export default function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-black/5 bg-[#F3F0E9] text-black">
      <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-5 py-16 md:px-8 md:py-24 lg:grid-cols-[1.1fr_0.9fr]">
        <motion.div variants={container} initial="hidden" animate="show">
          <motion.p
            variants={item}
            className="font-display text-sm font-semibold uppercase tracking-wide text-gold-dark"
          >
            UCwestpark
          </motion.p>
          <motion.h1
            variants={item}
            className="mt-3 max-w-xl font-display text-5xl font-bold leading-[1.05] sm:text-6xl"
          >
            Find tickets to the events that matter.
          </motion.h1>
          <motion.p variants={item} className="mt-5 max-w-lg text-lg text-black/70">
            Search upcoming events across the United States, request tickets, and let
            our team help you secure your place — even if the event isn't listed yet.
          </motion.p>

          <motion.div variants={item} className="mt-8 flex flex-wrap gap-4">
            <Link
              to="/search"
              className="rounded-full bg-gold px-7 py-3.5 text-sm font-semibold text-black transition-colors hover:bg-gold-light"
            >
              Find Tickets
            </Link>
            <Link
              to="/request-event"
              className="rounded-full border border-black/20 px-7 py-3.5 text-sm font-semibold text-black transition-colors hover:border-gold hover:text-gold-dark"
            >
              Request an Event
            </Link>
          </motion.div>

          <motion.div variants={item} className="mt-10 max-w-xl">
            <p className="mb-3 font-display text-lg font-semibold text-black/90">
              What event are you looking for?
            </p>
            <SearchBar large dark={false} />
          </motion.div>
        </motion.div>

        <motion.div
          className="relative hidden lg:block"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="absolute -inset-4 rounded-3xl border border-gold/30" aria-hidden="true" />
          <img
            src="https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=1000&q=80&auto=format&fit=crop"
            alt="Crowd at a live concert"
            className="h-[520px] w-full rounded-2xl bg-marquee-light object-cover shadow-2xl shadow-black/20"
            onError={(e) => {
              (e.target as HTMLImageElement).style.opacity = "0";
            }}
          />
        </motion.div>
      </div>
    </section>
  );
}
