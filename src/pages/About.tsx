import { Link } from "react-router-dom";

export default function About() {
  return (
    <div className="bg-paper">
      <section className="bg-marquee py-16 text-paper md:py-24">
        <div className="mx-auto max-w-4xl px-5 md:px-8">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-gold-light">About UCwestpark</p>
          <h1 className="mt-3 font-display text-4xl font-bold sm:text-5xl">Parking should be easier to plan.</h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-paper/75">
            UCwestpark helps drivers find parking close to the venues they are visiting. Instead of spending event day searching for a convenient spot, you can tell us where you are going and what you need in advance.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-5 py-16 md:px-8 md:py-20">
        <div className="grid gap-10 md:grid-cols-2">
          <div>
            <h2 className="font-display text-2xl font-bold text-ink">What we do</h2>
            <p className="mt-3 leading-relaxed text-ink-soft">
              We help customers request and source parking around major event venues across the cities we serve. You provide the venue, event details, number of spaces, and preferences; our team helps identify an option that fits.
            </p>
          </div>
          <div>
            <h2 className="font-display text-2xl font-bold text-ink">Our approach</h2>
            <p className="mt-3 leading-relaxed text-ink-soft">
              We keep the process simple: choose your venue, submit a parking request, and let our team follow up with availability and pricing. No complicated marketplace to navigate.
            </p>
          </div>
        </div>

        <div className="mt-12 rounded-2xl border border-gold/30 bg-white p-8 shadow-sm">
          <h2 className="font-display text-2xl font-bold text-ink">Ready to find parking?</h2>
          <p className="mt-2 max-w-xl text-ink-soft">Choose your venue and tell us what you need.</p>
          <Link to="/request-parking" className="mt-6 inline-block rounded-full bg-gold px-7 py-3.5 text-sm font-semibold text-black hover:bg-gold-light">
            Request Parking
          </Link>
        </div>
      </section>
    </div>
  );
}

