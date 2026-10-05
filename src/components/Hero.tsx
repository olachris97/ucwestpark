import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import SearchBar from "./SearchBar";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
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
    <section className="relative overflow-hidden border-b border-black/5 bg-[#F3F7FC] text-black">
      <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-5 py-16 md:px-8 md:py-24 lg:grid-cols-[0.9fr_1.1fr]">
        <motion.div variants={container} initial="hidden" animate="show">
          <motion.p
            variants={item}
            className="font-display text-sm font-semibold uppercase tracking-wide text-gold-dark"
          >
            UCwestpark
          </motion.p>
          <motion.h1
            variants={item}
            className="mt-3 max-w-xl font-display text-4xl font-bold leading-[1.08] sm:text-5xl"
          >
            Find parking close to your venue.
          </motion.h1>
          <motion.p variants={item} className="mt-5 max-w-lg text-lg text-black/70">
            Tell us where you’re going, how many parking spaces you need, and what works for your arrival plans. We’ll help you find parking close to the venue.
          </motion.p>

          <motion.div variants={item} className="mt-8 flex flex-wrap gap-4">
            <Link
              to="/request-parking"
              className="rounded-full bg-gold px-7 py-3.5 text-sm font-semibold text-black transition-colors hover:bg-gold-light"
            >
              Request Parking
            </Link>
            <Link
              to="/how-it-works"
              className="rounded-full border border-black/20 px-7 py-3.5 text-sm font-semibold text-black transition-colors hover:border-gold hover:text-gold-dark"
            >
              How It Works
            </Link>
          </motion.div>

          <motion.div variants={item} className="mt-10 max-w-xl">
            <p className="mb-3 font-display text-lg font-semibold text-black/90">
              Where is your event?
            </p>
            <SearchBar large dark={false} />
          </motion.div>
        </motion.div>

        <motion.div
          className="relative hidden lg:block lg:-mr-8 xl:-mr-14"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="absolute -inset-5 rounded-[2.25rem] border border-gold/40" aria-hidden="true" />
          <img
            src="/venues/mercedes-benz-stadium.jpg"
            alt="Mercedes-Benz Stadium in Atlanta"
            className="h-[520px] w-full rounded-[2rem] bg-marquee-light object-cover object-center shadow-2xl shadow-black/20 ring-1 ring-black/10"
          />
        </motion.div>
      </div>
    </section>
  );
}

