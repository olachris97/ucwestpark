import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Music, LandPlot, Drama, Tent, Mic2, Users, Sparkles } from "lucide-react";
import { categoryIcons } from "../data/events";
import { getCategories } from "../lib/store";

const MotionLink = motion.create(Link);

const iconMap: Record<string, React.ReactNode> = {
  music: <Music size={22} />,
  stadium: <LandPlot size={22} />,
  masks: <Drama size={22} />,
  tent: <Tent size={22} />,
  mic: <Mic2 size={22} />,
  family: <Users size={22} />,
  star: <Sparkles size={22} />,
};

export default function CategoryGrid() {
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    getCategories()
      .then(setCategories)
      .catch(() => setCategories([]));
  }, []);

  if (categories.length === 0) return null;

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7">
      {categories.map((name, i) => (
        <MotionLink
          key={name}
          to={`/search?category=${encodeURIComponent(name)}`}
          className="group flex flex-col items-center gap-3 rounded-xl border border-paper-line bg-white px-4 py-6 text-center transition-colors hover:border-gold"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.4, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
          whileHover={{ y: -4 }}
        >
          <motion.span
            whileHover={{ scale: 1.08, rotate: 3 }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-paper-stub text-gold-dark transition-colors group-hover:bg-gold group-hover:text-black"
          >
            {iconMap[categoryIcons[name]] ?? <Sparkles size={22} />}
          </motion.span>
          <span className="text-sm font-medium text-ink">{name}</span>
        </MotionLink>
      ))}
    </div>
  );
}
