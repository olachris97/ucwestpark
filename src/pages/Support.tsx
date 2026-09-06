import { useState } from "react";
import type { FormEvent, ReactNode } from "react";
import { Link } from "react-router-dom";
import { Mail, MessageCircle, Phone } from "lucide-react";
import { saveContactMessage } from "../lib/store";
import HoneypotField from "../components/HoneypotField";

const faqs = [
  {
    q: "Am I buying tickets directly through this site?",
    a: "No. You're submitting a request. Our team searches available inventory that matches your quantity, seating, and budget, then follows up with pricing and next steps before anything is booked.",
  },
  {
    q: "Is there a fee to submit a request?",
    a: "Submitting a ticket request or event request is free. Any pricing you're quoted will be shared clearly before you commit to anything.",
  },
  {
    q: "What if my event isn't listed?",
    a: "Use the \"Request an Event\" form. Tell us the event, date, and city if you know them, and our team will look into availability on your behalf.",
  },
  {
    q: "How long does it take to hear back?",
    a: "Most requests are followed up within one business day. High-demand events may take a little longer while we confirm availability.",
  },
  {
    q: "Can I change my request after submitting it?",
    a: "Yes — reply to the confirmation email or contact our support line and reference your request number.",
  },
];

const initialForm = { firstName: "", lastName: "", email: "", phone: "", subject: "", message: "", website: "" };

export default function Support() {
  const [form, setForm] = useState(initialForm);
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  function update(field: keyof typeof initialForm, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function submit(e: FormEvent) {
    e.preventDefault();
    setSuccess("");
    setError("");
    setSending(true);
    try {
      await saveContactMessage(form);
      setForm(initialForm);
      setSuccess("Thanks — your message has been received. Our team will get back to you within one business day.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "We couldn't send your message. Please try again.");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="bg-paper">
      <div className="bg-marquee py-14 text-center text-paper">
        <div className="mx-auto max-w-2xl px-5">
          <h1 className="font-display text-4xl font-bold sm:text-5xl">Contact & Support</h1>
          <p className="mt-3 text-paper/75">
            Have a question about a request, an event, or anything else? We're here to help.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-5 py-14 md:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <h2 className="font-display text-2xl font-semibold text-ink">Get in touch</h2>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-ink-soft">
              Send us a message and a member of the UCwestpark team will follow up with you.
              For ticket requests, include your event and reference number if you have one.
            </p>

            <div className="mt-7 space-y-3">
              <div className="rounded-xl border border-paper-line bg-white p-5">
                <div className="flex items-start gap-3">
                  <Phone size={19} className="mt-0.5 text-gold-dark" />
                  <div>
                    <h3 className="font-display text-sm font-semibold text-ink">Call us</h3>
                    <a href="tel:+16105550148" className="mt-1 block text-sm text-ink-soft hover:text-ink">
                      +1 (610) 555-0148
                    </a>
                    <p className="mt-0.5 text-xs text-ink-soft/70">Mon–Sat, 9am–8pm ET</p>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-paper-line bg-white p-5">
                <div className="flex items-start gap-3">
                  <Mail size={19} className="mt-0.5 text-gold-dark" />
                  <div>
                    <h3 className="font-display text-sm font-semibold text-ink">Email us</h3>
                    <a href="mailto:support@ucwestpark.com" className="mt-1 block text-sm text-ink-soft hover:text-ink">
                      support@ucwestpark.com
                    </a>
                    <p className="mt-0.5 text-xs text-ink-soft/70">We reply within one business day</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-7 rounded-xl border border-gold/30 bg-gold/10 p-5">
              <div className="flex gap-3">
                <MessageCircle size={19} className="mt-0.5 text-gold-dark" />
                <p className="text-sm leading-relaxed text-ink-soft">
                  Looking for tickets to an event that isn't listed? Use our{" "}
                  <Link to="/request-event" className="font-semibold text-ink underline underline-offset-2">
                    Request an Event
                  </Link>{" "}
                  form so we can search for it on your behalf.
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={submit} className="rounded-2xl border border-paper-line bg-white p-6 shadow-sm md:p-8">
            <HoneypotField value={form.website} onChange={(v) => update("website", v)} />
            <h2 className="font-display text-2xl font-semibold text-ink">Send us a message</h2>
            <p className="mt-2 text-sm text-ink-soft">Fields marked with * are required.</p>

            {success && <div className="mt-5 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">{success}</div>}
            {error && <div className="mt-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="First name *">
                <input required maxLength={100} value={form.firstName} onChange={(e) => update("firstName", e.target.value)} className="input" />
              </Field>
              <Field label="Last name *">
                <input required maxLength={100} value={form.lastName} onChange={(e) => update("lastName", e.target.value)} className="input" />
              </Field>
              <Field label="Email *">
                <input required type="email" maxLength={200} value={form.email} onChange={(e) => update("email", e.target.value)} className="input" />
              </Field>
              <Field label="Phone">
                <input type="tel" maxLength={50} value={form.phone} onChange={(e) => update("phone", e.target.value)} className="input" />
              </Field>
            </div>

            <Field label="Subject *" className="mt-4">
              <input required maxLength={200} value={form.subject} onChange={(e) => update("subject", e.target.value)} className="input" />
            </Field>

            <Field label="Message *" className="mt-4">
              <textarea required minLength={10} maxLength={4000} rows={7} value={form.message} onChange={(e) => update("message", e.target.value)} className="input resize-y" placeholder="How can we help?" />
            </Field>

            <button type="submit" disabled={sending} className="mt-6 w-full rounded-full bg-gold px-6 py-3 text-sm font-semibold text-black transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-60">
              {sending ? "Sending…" : "Send Message"}
            </button>
          </form>
        </div>

        <section className="mt-16">
          <h2 className="font-display text-2xl font-semibold text-ink">Frequently asked questions</h2>
          <div className="mt-6 divide-y divide-paper-line rounded-xl border border-paper-line bg-white">
            {faqs.map((f) => (
              <details key={f.q} className="group px-6 py-5">
                <summary className="cursor-pointer list-none font-medium text-ink marker:content-none">{f.q}</summary>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">{f.a}</p>
              </details>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function Field({ label, children, className = "" }: { label: string; children: ReactNode; className?: string }) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1.5 block text-sm font-medium text-ink">{label}</span>
      {children}
    </label>
  );
}
