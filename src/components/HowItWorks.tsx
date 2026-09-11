import { motion } from "framer-motion";
import Reveal from "./Reveal";

const steps = [
  {
    n: "01",
    title: "Find your event",
    body: "Search by event, venue, artist, team, or city to see parking options near the action.",
  },
  {
    n: "02",
    title: "Choose your parking",
    body: "Choose the number of parking passes you need, your preferred distance, and your budget.",
  },
  {
    n: "03",
    title: "Park with confidence",
    body: "We help surface available parking close to the venue and follow up with pricing and next steps.",
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
          From finding the event to finding your spot, here's how UCwestpark helps you park closer to the action.
        </p>
      </Reveal>

      <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
        {steps.map((s, i) => (
          <motion.div
            key={s.n}
            className="rounded-2xl border border-paper-line bg-white p-7 shadow-sm transition-shadow hover:shadow-md"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.45, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="font-display text-4xl font-bold text-marquee/20">{s.n}</span>
            <h3 className="mt-3 font-display text-xl font-semibold text-ink">
              {s.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">{s.body}</p>

          </motion.div>
        ))}
      </div>
    </section>
  );
}
