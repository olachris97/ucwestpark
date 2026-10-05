import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import logo from "../assets/logo.png";

const links = [
  { to: "/about", label: "About Us" },
  { to: "/how-it-works", label: "How It Works" },
  { to: "/support", label: "Support" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-paper-line bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3 md:px-8">
        <Link to="/" className="flex items-center" onClick={() => setOpen(false)}>
          <img src={logo} alt="UCwestpark" className="h-10 w-auto" />
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <NavLink
              key={l.label}
              to={l.to}
              className={({ isActive }) =>
                `text-sm font-medium transition-colors hover:text-gold-dark ${
                  isActive ? "text-gold-dark" : "text-black/80"
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <Link
          to="/request-parking"
          onClick={() => setOpen(false)}
          className="hidden rounded-full border border-black bg-white px-5 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-black hover:text-white md:inline-flex"
        >
          Request Parking
        </Link>

        <button
          className="p-2 text-black md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-t border-paper-line bg-white md:hidden"
          >
            <nav className="flex flex-col gap-1 px-5 pb-6 pt-2">
              {links.map((l) => (
                <NavLink
                  key={l.label}
                  to={l.to}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `rounded-lg px-3 py-3 text-base font-medium hover:bg-paper-stub ${
                      isActive ? "text-gold-dark" : "text-black/90"
                    }`
                  }
                >
                  {l.label}
                </NavLink>
              ))}
              <Link to="/request-parking" onClick={() => setOpen(false)} className="mt-2 rounded-full bg-gold px-4 py-3 text-center text-sm font-semibold text-marquee">Request Parking</Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

