import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Reveal from "./Reveal";

const MotionLink = motion.create(Link);

export default function CantFindSection() {
  return (
    <section className="mx-auto max-w-7xl px-5 pb-20 md:px-8">
      <Reveal>
        <div className="rounded-2xl border border-gold/30 bg-marquee px-8 py-14 text-center text-paper sm:px-16">
          <h2 className="font-display text-3xl font-bold sm:text-4xl">
            Can't find the event you're looking for?
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-paper/75">
            No problem. Tell us what you're looking for and our team will help you find
            it — even if it isn't listed here yet.
          </p>
          <MotionLink
            to="/request-event"
            className="mt-7 inline-block rounded-full bg-gold px-8 py-3.5 text-sm font-semibold text-black"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.98 }}
          >
            Request an Event
          </MotionLink>
        </div>
      </Reveal>
    </section>
  );
}
