import { Link } from "react-router-dom";
import logo from "../assets/logo.png";

export default function Footer() {
  return (
    <footer className="bg-marquee-deep text-paper/80">
      <div className="mx-auto max-w-7xl px-5 py-14 md:px-8">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-4">
          <div className="col-span-2">
            <div className="inline-block rounded-md bg-white px-3 py-2">
              <img src={logo} alt="UCwestpark" className="h-8 w-auto" />
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-paper/60">
              UCwestpark helps drivers find parking close to event venues in the cities we serve. Choose your venue, request parking, and let our team help with the rest.
            </p>
          </div>

          <FooterColumn
            title="Company"
            links={[
              { label: "About Us", to: "/about" },
              { label: "How It Works", to: "/how-it-works" },
              { label: "Support", to: "/support" },
            ]}
          />
          <FooterColumn
            title="Parking"
            links={[
              { label: "Request Parking", to: "/request-parking" },
              { label: "Privacy Policy", to: "/privacy-policy" },
              { label: "Terms of Service", to: "/terms" },
              { label: "Contact Us", to: "/support" },
            ]}
          />
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-white/10 pt-6 text-xs text-paper/40 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} UCwestpark. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <p>Find parking close to the venues hosting the events you plan to attend.</p>
            <Link to="/admin" className="text-paper/30 hover:text-gold">Staff login</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }: { title: string; links: { label: string; to: string }[] }) {
  return (
    <div>
      <h3 className="font-body text-sm font-semibold text-paper">{title}</h3>
      <ul className="mt-4 space-y-2.5">
        {links.map((l) => (
          <li key={l.label}>
            <Link to={l.to} className="text-sm text-paper/60 hover:text-gold">{l.label}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

