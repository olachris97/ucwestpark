import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import { saveTicketRequest } from "../lib/store";
import { usStates } from "../data/usStates";
import HoneypotField from "../components/HoneypotField";
import type { TicketRequest } from "../types";

export default function RequestEvent() {
  const [params] = useSearchParams();
  const prefillName = params.get("venue") ?? params.get("eventName") ?? "";
  const prefillVenue = params.get("venue") ?? "";
  const prefillCity = params.get("city") ?? "";
  const prefillState = params.get("state") ?? "";

  const [submitted, setSubmitted] = useState<TicketRequest | null>(null);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const [eventName, setEventName] = useState(prefillName);
  const [eventDate, setEventDate] = useState("");
  const [city, setCity] = useState(prefillCity);
  const [state, setState] = useState(prefillState);
  const [venue, setVenue] = useState(prefillVenue);

  const [ticketQuantity, setTicketQuantity] = useState(2);
  const [seatPreference, setSeatPreference] = useState("");
  const [budget, setBudget] = useState("");
  const [flexibility, setFlexibility] = useState<"flexible" | "somewhat" | "specific">(
    "flexible"
  );
  const [notes, setNotes] = useState("");

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
    if (!eventName.trim()) next.eventName = "Select a parking location.";
    if (!venue.trim()) next.venue = "Select or enter the venue.";
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
        eventId: `venue-${venue || eventName}`.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        eventName: eventName || venue,
        eventDate,
        location: venue ? `${venue}${city ? `, ${city}` : ""}${state ? `, ${state}` : ""}` : (city || state),
        ticketQuantity,
        seatPreference: flexibility === "specific" ? "specific" : flexibility === "somewhat" ? "best" : "any",
        seatDetails: seatPreference,
        budget,
        ticketType: "Parking pass",
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
      <div className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-5 py-20 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-paper-stub text-gold-dark">
          <CheckCircle2 size={26} />
        </span>
        <h1 className="mt-5 font-display text-3xl font-bold text-ink sm:text-4xl">
          Parking request received
        </h1>
        <p className="mt-3 leading-relaxed text-ink-soft">
          Your parking request has been received. Our team will search for an available option near your selected venue and contact you using the information you provided.
        </p>
        <div className="mt-6 rounded-lg bg-paper-stub/60 px-5 py-3">
          <p className="text-xs uppercase text-ink-soft/70">Request reference</p>
          <p className="font-display text-lg font-semibold text-ink">{submitted.id}</p>
        </div>
        <Link
          to="/"
          className="mt-8 rounded-full bg-marquee px-7 py-3.5 text-sm font-semibold text-paper hover:bg-marquee-light"
        >
          Back to venues
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-paper">
      <div className="bg-marquee py-14 text-center text-paper">
        <div className="mx-auto max-w-2xl px-5">
          <h1 className="font-display text-4xl font-bold sm:text-5xl">
            Request parking
          </h1>
          <p className="mt-3 text-paper/75">
            Tell us where you are going and what kind of parking you need. Our team will help source an option near the venue.
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        noValidate
        className="mx-auto max-w-2xl space-y-10 px-5 py-12 md:px-8"
      >
        <HoneypotField value={website} onChange={setWebsite} />
        <FormSection title="Your information">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="First name" value={firstName} onChange={setFirstName} error={errors.firstName} />
            <Field label="Last name" value={lastName} onChange={setLastName} error={errors.lastName} />
          </div>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Email" type="email" value={email} onChange={setEmail} error={errors.email} />
            <Field label="Phone number" type="tel" value={phone} onChange={setPhone} error={errors.phone} />
          </div>
        </FormSection>

        <FormSection title="Parking location">
          <Field
            label="Venue / location"
            value={eventName}
            onChange={setEventName}
            error={errors.eventName}
            required
          />
          <div className="mt-4">
            <Field label="Venue / location" value={venue} onChange={setVenue} error={errors.venue} required />
          </div>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Parking date" type="date" value={eventDate} onChange={setEventDate} />
            <div className="grid grid-cols-[1fr_100px] gap-2">
              <div>
                <label className="text-sm font-medium text-ink">Preferred city</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="mt-2 w-full rounded-lg border border-paper-line px-3 py-2 text-sm focus:border-gold focus:outline-none"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-ink">State</label>
                <select
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="mt-2 w-full rounded-lg border border-paper-line px-2 py-2 text-sm focus:border-gold focus:outline-none"
                >
                  <option value="">—</option>
                  {usStates.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          <p className="mt-2 text-xs text-ink-soft">
            We currently help source parking near major venues across the United States.
          </p>

        </FormSection>

        <FormSection title="Parking requirements">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="qty" className="text-sm font-medium text-ink">
                Number of parking passes
              </label>
              <input
                id="qty"
                type="number"
                min={1}
                max={10}
                value={ticketQuantity}
                onChange={(e) => setTicketQuantity(Number(e.target.value))}
                className="mt-2 w-full rounded-lg border border-paper-line px-3 py-2 text-sm focus:border-gold focus:outline-none"
              />
            </div>
            <Field
              label="Preferred parking location"
              value={seatPreference}
              onChange={setSeatPreference}
              placeholder="e.g. Near Gate 2, closest available, easy exit"
            />
          </div>
          <div className="mt-4">
            <Field
              label="Maximum budget per parking pass"
              value={budget}
              onChange={setBudget}
              placeholder="Optional"
            />
          </div>

          <div className="mt-4">
            <label className="text-sm font-medium text-ink">How flexible are you?</label>
            <div className="mt-2 flex flex-wrap gap-2">
              {[
                { v: "flexible", l: "Flexible" },
                { v: "somewhat", l: "Somewhat flexible" },
                { v: "specific", l: "Very specific" },
              ].map((opt) => (
                <button
                  type="button"
                  key={opt.v}
                  onClick={() => setFlexibility(opt.v as typeof flexibility)}
                  className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                    flexibility === opt.v
                      ? "border-gold bg-gold text-marquee"
                      : "border-paper-line text-ink-soft hover:border-gold"
                  }`}
                >
                  {opt.l}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4">
            <label htmlFor="notes" className="text-sm font-medium text-ink">
              Additional information
            </label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              placeholder="Tell us anything else that would help us find the right parking for you."
              className="mt-2 w-full rounded-lg border border-paper-line px-3 py-2 text-sm focus:border-gold focus:outline-none"
            />
          </div>
        </FormSection>

        {submitError && <p className="text-sm text-red-500">{submitError}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-full bg-gold px-6 py-4 text-sm font-semibold text-marquee hover:bg-gold-light disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:px-10"
        >
          {submitting ? "Submitting…" : "Submit Parking Request"}
        </button>
      </form>
    </div>
  );
}

function FormSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="font-display text-xl font-semibold text-ink">{title}</h2>
      <div className="mt-4">{children}</div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  error,
  required,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  error?: string;
  required?: boolean;
  placeholder?: string;
}) {
  const id = label.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  return (
    <div>
      <label htmlFor={id} className="text-sm font-medium text-ink">
        {label} {required && <span className="text-gold-dark">*</span>}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`mt-2 w-full rounded-lg border px-3 py-2 text-sm focus:outline-none ${
          error ? "border-red-400" : "border-paper-line focus:border-gold"
        }`}
        aria-invalid={!!error}
      />
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}
