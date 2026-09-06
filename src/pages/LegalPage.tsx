interface LegalSection {
  heading?: string;
  body: string;
}

export default function LegalPage({
  title,
  lastUpdated,
  intro,
  sections,
}: {
  title: string;
  lastUpdated?: string;
  intro?: string;
  sections: LegalSection[];
}) {
  return (
    <div className="bg-paper">
      <div className="bg-marquee py-14 text-center text-paper">
        <h1 className="font-display text-4xl font-bold sm:text-5xl">{title}</h1>
        {lastUpdated && <p className="mt-2 text-sm text-paper/60">Last updated: {lastUpdated}</p>}
      </div>
      <div className="mx-auto max-w-2xl px-5 py-14 md:px-8">
        {intro && (
          <p className="mb-8 rounded-lg border border-gold/30 bg-gold/10 p-4 text-sm leading-relaxed text-ink-soft">
            {intro}
          </p>
        )}
        <div className="space-y-8 text-sm leading-relaxed text-ink-soft">
          {sections.map((s, i) => (
            <div key={i}>
              {s.heading && (
                <h2 className="mb-2 font-display text-lg font-semibold text-ink">{s.heading}</h2>
              )}
              <p style={{ whiteSpace: "pre-line" }}>{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
