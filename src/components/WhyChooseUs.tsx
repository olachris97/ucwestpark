import { motion } from "framer-motion";
import { LayoutGrid, HeartHandshake, PenLine, HeadphonesIcon, MessageSquare } from "lucide-react";
import Reveal from "./Reveal";

const benefits = [
  {
    icon: <LayoutGrid size={20} />,
    title: "Parking near major events",
    body: "Find parking around concerts, sports, festivals, theatre, comedy, and more in one place.",
  },
  {
    icon: <HeartHandshake size={20} />,
    title: "Options that fit your plans",
    body: "Need parking closer to the venue or a specific entrance? Tell us what works for you.",
  },
  {
    icon: <PenLine size={20} />,
    title: "A simple parking request",
    body: "Tell us how many spots you need, how close you want to be, and your budget.",
  },
  {
    icon: <HeadphonesIcon size={20} />,
    title: "Real help when you need it",
    body: "Get help while you compare parking options or wait for a requested spot.",
  },
  {
    icon: <MessageSquare size={20} />,
    title: "Clear availability and pricing",
    body: "See clear updates on location, availability, and pricing before you book.",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="bg-paper-stub/60 py-20">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <Reveal className="max-w-xl">
          <h2 className="font-display text-3xl font-bold text-ink sm:text-4xl">
            Why people find parking through us
          </h2>
        </Reveal>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map((b, i) => (
            <motion.div
              key={b.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.45, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -5, boxShadow: "0 16px 30px -16px rgba(0,0,0,0.18)" }}
              className="rounded-xl bg-white p-6"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-marquee text-gold-light">
                {b.icon}
              </span>
              <h3 className="mt-4 font-display text-lg font-semibold text-ink">
                {b.title}
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{b.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
