import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import { getCategories, saveCustomEventRequest } from "../lib/store";
import { usStates } from "../data/usStates";
import type { CustomEventRequest } from "../types";

export default function RequestEvent() {
  const [params] = useSearchParams();
  const prefillName = params.get("eventName") ?? "";
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    getCategories()
      .then(setCategories)
      .catch(() => setCategories([]));
  }, []);

  const [submitted, setSubmitted] = useState<CustomEventRequest | null>(null);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const [eventName, setEventName] = useState(prefillName);
  const [artist, setArtist] = useState("");
  const [category, setCategory] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [venue, setVenue] = useState("");

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

  function validate() {
    const next: Record<string, string> = {};
    if (!firstName.trim()) next.firstName = "Enter your first name.";
    if (!lastName.trim()) next.lastName = "Enter your last name.";
    if (!/^\S+@\S+\.\S+$/.test(email)) next.email = "Enter a valid email address.";
    if (!phone.trim()) next.phone = "Enter a phone number.";
    if (!eventName.trim()) next.eventName = "Tell us the name of the event.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    setSubmitError("");
    try {
      const record = await saveCustomEventRequest({
        firstName,
        lastName,
        email,
        phone,
        eventName,
        artist,
        category,
        eventDate,
        city: state ? `${city}, ${state}` : city,
        venue,
        ticketQuantity,
        seatPreference,
        budget,
        flexibility,
        notes,
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
          We've got your request
        </h1>
        <p className="mt-3 leading-relaxed text-ink-soft">
          We couldn't find that event in our current listings, but our team will search
          for available tickets on your behalf. We'll contact you using the information
          you provided.
        </p>
        <div className="mt-6 rounded-lg bg-paper-stub/60 px-5 py-3">
          <p className="text-xs uppercase text-ink-soft/70">Request reference</p>
          <p className="font-display text-lg font-semibold text-ink">{submitted.id}</p>
        </div>
        <Link
          to="/search"
          className="mt-8 rounded-full bg-marquee px-7 py-3.5 text-sm font-semibold text-paper hover:bg-marquee-light"
        >
          Browse other events
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-paper">
      <div className="bg-marquee py-14 text-center text-paper">
        <div className="mx-auto max-w-2xl px-5">
          <h1 className="font-display text-4xl font-bold sm:text-5xl">
            Request an event
          </h1>
          <p className="mt-3 text-paper/75">
            Don't see your event listed? Tell us what you're looking for and our team
            will help you find it.
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        noValidate
        className="mx-auto max-w-2xl space-y-10 px-5 py-12 md:px-8"
      >
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

        <FormSection title="Event information">
          <Field
            label="Event name"
            value={eventName}
            onChange={setEventName}
            error={errors.eventName}
            required
          />
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Artist / team / performer" value={artist} onChange={setArtist} />
            <div>
              <label className="text-sm font-medium text-ink">Event category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="mt-2 w-full rounded-lg border border-paper-line px-3 py-2 text-sm focus:border-gold focus:outline-none"
              >
                <option value="">Select a category</option>
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Event date" type="date" value={eventDate} onChange={setEventDate} />
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
            We currently source tickets for events within the United States only.
          </p>
          <div className="mt-4">
            <Field label="Venue (if known)" value={venue} onChange={setVenue} />
          </div>
        </FormSection>

        <FormSection title="Ticket requirements">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="qty" className="text-sm font-medium text-ink">
                Number of tickets
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
              label="Preferred seating"
              value={seatPreference}
              onChange={setSeatPreference}
              placeholder="e.g. Floor, lower bowl, aisle"
            />
          </div>
          <div className="mt-4">
            <Field
              label="Maximum budget per ticket"
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
              placeholder="Tell us anything else that would help us find the right tickets for you."
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
          {submitting ? "Submitting…" : "Submit Event Request"}
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
