import { Link } from "react-router-dom";
import { SearchX } from "lucide-react";

export default function EmptyState({ query }: { query: string }) {
  const requestHref = query
    ? `/request-event?eventName=${encodeURIComponent(query)}`
    : "/request-event";

  return (
    <div className="mx-auto flex max-w-md flex-col items-center rounded-2xl border border-dashed border-paper-line bg-white px-8 py-16 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-paper-stub text-gold-dark">
        <SearchX size={26} />
      </span>
      <h3 className="mt-5 font-display text-2xl font-semibold text-ink">
        We couldn't find parking for that event
      </h3>
      <p className="mt-2 text-sm text-ink-soft">
        {query ? (
          <>
            Nothing matched &ldquo;{query}&rdquo; in our current parking listings — but don't
            worry, we may still be able to help you find a nearby option.
          </>
        ) : (
          <>No parking options match your filters right now — but we may still be able to help.</>
        )}
      </p>
      <Link
        to={requestHref}
        className="mt-6 rounded-full bg-marquee px-6 py-3 text-sm font-semibold text-paper hover:bg-marquee-light"
      >
        Request Parking
      </Link>
    </div>
  );
}
