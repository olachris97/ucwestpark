export default function LegalPage({
  title,
  paragraphs,
}: {
  title: string;
  paragraphs: string[];
}) {
  return (
    <div className="bg-paper">
      <div className="bg-marquee py-14 text-center text-paper">
        <h1 className="font-display text-4xl font-bold sm:text-5xl">{title}</h1>
      </div>
      <div className="mx-auto max-w-2xl space-y-4 px-5 py-14 text-sm leading-relaxed text-ink-soft md:px-8">
        {paragraphs.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>
    </div>
  );
}
