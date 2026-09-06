import { motion } from "framer-motion";
import Reveal from "./Reveal";

const steps = [
  {
    n: "01",
    title: "Find your event",
    body: "Search our listings by event, artist, team, or venue, and browse what's coming up near you.",
  },
  {
    n: "02",
    title: "Request your tickets",
    body: "Tell us how many tickets you need, your seating preference, and your budget.",
  },
  {
    n: "03",
    title: "We handle the rest",
    body: "Our team searches for available options and follows up with pricing and next steps.",
  },
];

export default function HowItWorks() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-20 md:px-8">
      <Reveal className="max-w-xl">
        <h2 className="font-display text-3xl font-bold text-ink sm:text-4xl">
          How it works
        </h2>
        <p className="mt-3 text-ink-soft">
          From search to seat, here's what happens after you find an event you want to
          attend.
        </p>
      </Reveal>

      <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
        {steps.map((s, i) => (
          <motion.div
            key={s.n}
            className="relative pl-2"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.45, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="font-display text-5xl font-bold text-paper-line">{s.n}</span>
            <h3 className="mt-3 font-display text-xl font-semibold text-ink">
              {s.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">{s.body}</p>
            {i < steps.length - 1 && (
              <div className="mt-8 hidden h-px w-full perforated-h md:block" aria-hidden="true" />
            )}
          </motion.div>
        ))}
      </div>
    </section>
  );
}
