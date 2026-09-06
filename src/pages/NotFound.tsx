import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-5 text-center">
      <h1 className="font-display text-5xl font-bold text-ink">404</h1>
      <p className="mt-3 text-ink-soft">We couldn't find that page.</p>
      <Link
        to="/"
        className="mt-6 rounded-full bg-marquee px-6 py-3 text-sm font-semibold text-paper hover:bg-marquee-light"
      >
        Back to home
      </Link>
    </div>
  );
}
