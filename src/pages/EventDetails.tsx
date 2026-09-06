import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { CalendarDays, Clock, MapPin, Minus, Plus, CheckCircle2 } from "lucide-react";
import { getEventBySlug, saveTicketRequest } from "../lib/store";
import type { TicketRequest, EventItem } from "../types";
import LoadingState from "../components/LoadingState";
import HoneypotField from "../components/HoneypotField";

function formatDate(iso: string) {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
}

export default function EventDetails() {
  const { slug } = useParams();
  const [event, setEvent] = useState<EventItem | null | undefined>(undefined);

  useEffect(() => {
    if (!slug) return;
    setEvent(undefined);
    getEventBySlug(slug).then((e) => setEvent(e ?? null));
  }, [slug]);

  if (event === undefined) {
    return <LoadingState label="Loading event…" />;
  }

  if (event === null) {
    return <Navigate to="/search" replace />;
  }

  return (
    <div className="bg-paper">
      <div className="relative h-72 w-full overflow-hidden bg-marquee-deep sm:h-96">
        <img
          src={event.image}
          alt={event.name}
          className="h-full w-full bg-marquee-light object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).style.opacity = "0";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-marquee-deep/90 via-marquee-deep/20 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 mx-auto max-w-7xl px-5 pb-8 md:px-8">
          <span className="rounded-full bg-gold px-3 py-1 text-xs font-semibold text-marquee">
            {event.category}
          </span>
          <h1 className="mt-3 font-display text-4xl font-bold text-paper sm:text-5xl">
            {event.name}
          </h1>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-5 py-10 md:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_380px]">
          <div>
            <div className="flex flex-wrap gap-x-8 gap-y-3 border-b border-paper-line pb-6 text-sm text-ink-soft">
              <span className="flex items-center gap-2">
                <CalendarDays size={16} className="text-gold-dark" /> {formatDate(event.date)}
              </span>
              <span className="flex items-center gap-2">
                <Clock size={16} className="text-gold-dark" /> {event.time}
              </span>
              <span className="flex items-center gap-2">
                <MapPin size={16} className="text-gold-dark" />
                {event.venue}, {event.address}, {event.city}
              </span>
            </div>

            <h2 className="mt-8 font-display text-2xl font-semibold text-ink">
              About this event
            </h2>
            <p className="mt-3 max-w-2xl leading-relaxed text-ink-soft">
              {event.longDescription}
            </p>

            <div className="mt-10 rounded-xl border border-paper-line bg-paper-stub/40 p-6">
              <h3 className="font-display text-lg font-semibold text-ink">
                How ticket requests work
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                Submitting a request does not charge you. Our team reviews available
                options that match your quantity, seating, and budget, then follows up
                by phone or email with pricing before anything is booked.
              </p>
            </div>
          </div>

          <TicketRequestPanel event={event} />
        </div>
      </div>
    </div>
  );
}

function TicketRequestPanel({
  event,
}: {
  event: EventItem;
}) {
  const [submitted, setSubmitted] = useState<TicketRequest | null>(null);
  const [quantity, setQuantity] = useState(2);
  const [preference, setPreference] = useState<"any" | "best" | "specific">("best");
  const [seatDetails, setSeatDetails] = useState("");
  const [budget, setBudget] = useState("");
  const [notes, setNotes] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [website, setWebsite] = useState("");

  function validate() {
    const next: Record<string, string> = {};
    if (!firstName.trim()) next.firstName = "Enter your first name.";
    if (!lastName.trim()) next.lastName = "Enter your last name.";
    if (!/^\S+@\S+\.\S+$/.test(email)) next.email = "Enter a valid email address.";
    if (!phone.trim()) next.phone = "Enter a phone number.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    setSubmitError("");
    try {
      const record = await saveTicketRequest({
        firstName,
        lastName,
        email,
        phone,
        eventId: event.id,
        eventName: event.name,
        eventDate: event.date,
        location: `${event.venue}, ${event.city}`,
        ticketQuantity: quantity,
        seatPreference: preference,
        seatDetails: preference === "specific" ? seatDetails : undefined,
        budget,
        notes,
        website,
      });
      setSubmitted(record);
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : "Couldn't submit your request. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <aside className="h-fit rounded-2xl border border-paper-line bg-white p-7 lg:sticky lg:top-24">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-paper-stub text-gold-dark">
          <CheckCircle2 size={24} />
        </span>
        <h3 className="mt-4 font-display text-2xl font-semibold text-ink">
          Request received
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-ink-soft">
          Thank you! We've received your ticket request for{" "}
          <strong className="text-ink">{event.name}</strong>. Our team will review it
          and contact you shortly with available options and pricing.
        </p>
        <div className="mt-5 rounded-lg bg-paper-stub/60 px-4 py-3">
          <p className="text-xs uppercase text-ink-soft/70">Request reference</p>
          <p className="font-display text-lg font-semibold text-ink">{submitted.id}</p>
        </div>
        <Link
          to="/search"
          className="mt-6 block rounded-full bg-marquee px-6 py-3 text-center text-sm font-semibold text-paper hover:bg-marquee-light"
        >
          Return to events
        </Link>
      </aside>
    );
  }

  return (
    <aside className="h-fit rounded-2xl border border-paper-line bg-white p-7 lg:sticky lg:top-24">
      <h3 className="font-display text-2xl font-semibold text-ink">Request tickets</h3>
      <p className="mt-1 text-sm text-ink-soft">
        {event.startingPrice ? `From $${event.startingPrice} per ticket` : "Pricing available on request"}
      </p>
      <p className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-paper-stub px-3 py-1 text-xs font-semibold text-black">
        {event.ticketsAvailable > 0
          ? `${event.ticketsAvailable} tickets available`
          : "Currently sourcing availability"}
      </p>

      <form className="mt-6 space-y-5" onSubmit={handleSubmit} noValidate>
        <HoneypotField value={website} onChange={setWebsite} />
        <div>
          <label className="text-sm font-medium text-ink">Number of tickets</label>
          <div className="mt-2 flex w-fit items-center gap-4 rounded-full border border-paper-line px-2 py-1.5">
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-paper-stub text-ink hover:bg-gold hover:text-marquee"
              aria-label="Decrease ticket quantity"
            >
              <Minus size={14} />
            </button>
            <span className="w-5 text-center font-semibold text-ink">{quantity}</span>
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.min(10, q + 1))}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-paper-stub text-ink hover:bg-gold hover:text-marquee"
              aria-label="Increase ticket quantity"
            >
              <Plus size={14} />
            </button>
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-ink">Ticket preference</label>
          <div className="mt-2 space-y-2">
            {[
              { v: "any", l: "Any available" },
              { v: "best", l: "Best available" },
              { v: "specific", l: "Specific section" },
            ].map((opt) => (
              <label key={opt.v} className="flex items-center gap-2 text-sm text-ink-soft">
                <input
                  type="radio"
                  name="preference"
                  checked={preference === opt.v}
                  onChange={() => setPreference(opt.v as typeof preference)}
                />
                {opt.l}
              </label>
            ))}
          </div>
          {preference === "specific" && (
            <input
              type="text"
              value={seatDetails}
              onChange={(e) => setSeatDetails(e.target.value)}
              placeholder="e.g. Floor, Section 112, aisle seats"
              className="mt-2 w-full rounded-lg border border-paper-line px-3 py-2 text-sm focus:border-gold focus:outline-none"
            />
          )}
        </div>

        <div>
          <label htmlFor="budget" className="text-sm font-medium text-ink">
            Budget per ticket
          </label>
          <div className="mt-2 flex items-center rounded-lg border border-paper-line px-3">
            <span className="text-ink-soft">$</span>
            <input
              id="budget"
              type="text"
              inputMode="numeric"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              placeholder="Optional"
              className="w-full bg-transparent py-2 pl-1 text-sm focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Field
            label="First name"
            value={firstName}
            onChange={setFirstName}
            error={errors.firstName}
          />
          <Field
            label="Last name"
            value={lastName}
            onChange={setLastName}
            error={errors.lastName}
          />
        </div>
        <Field
          label="Email"
          type="email"
          value={email}
          onChange={setEmail}
          error={errors.email}
        />
        <Field label="Phone" type="tel" value={phone} onChange={setPhone} error={errors.phone} />

        <div>
          <label htmlFor="notes" className="text-sm font-medium text-ink">
            Additional notes
          </label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            placeholder="Anything else we should know?"
            className="mt-2 w-full rounded-lg border border-paper-line px-3 py-2 text-sm focus:border-gold focus:outline-none"
          />
        </div>

        {submitError && <p className="text-sm text-red-500">{submitError}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-full bg-gold px-6 py-3.5 text-sm font-semibold text-marquee hover:bg-gold-light disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? "Submitting…" : "Request Tickets"}
        </button>
      </form>
    </aside>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  error,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  error?: string;
}) {
  const id = label.toLowerCase().replace(/\s+/g, "-");
  return (
    <div>
      <label htmlFor={id} className="text-sm font-medium text-ink">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`mt-2 w-full rounded-lg border px-3 py-2 text-sm focus:outline-none ${
          error ? "border-red-400" : "border-paper-line focus:border-gold"
        }`}
        aria-invalid={!!error}
      />
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}
