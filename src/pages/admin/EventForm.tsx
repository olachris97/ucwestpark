import { useEffect, useState } from "react";
import type { FormEvent, ChangeEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { UploadCloud, X, Loader2 } from "lucide-react";
import { getEvents, getCategories, addEvent, updateEvent, uploadEventImage } from "../../lib/store";
import { usStates } from "../../data/usStates";
import LoadingState from "../../components/LoadingState";
import ErrorState from "../../components/ErrorState";
import type { EventItem } from "../../types";

const emptyForm = {
  name: "",
  description: "",
  longDescription: "",
  category: "",
  image: "",
  date: "",
  time: "",
  venue: "",
  address: "",
  latitude: "",
  longitude: "",
  cityName: "",
  state: "",
  startingPrice: "",
  requestPricingOnly: false,
  ticketsAvailable: "0",
  status: "on-sale" as EventItem["status"],
  featured: false,
};

type FormState = typeof emptyForm;

function toFormState(existing: EventItem): FormState {
  const [cityName = "", state = ""] = existing.city.split(",").map((s) => s.trim());
  return {
    name: existing.name,
    description: existing.description,
    longDescription: existing.longDescription,
    category: existing.category,
    image: existing.image,
    date: existing.date,
    time: existing.time,
    venue: existing.venue,
    address: existing.address,
    latitude: existing.latitude != null ? String(existing.latitude) : "",
    longitude: existing.longitude != null ? String(existing.longitude) : "",
    cityName,
    state,
    startingPrice: existing.startingPrice ? String(existing.startingPrice) : "",
    requestPricingOnly: existing.startingPrice === null,
    ticketsAvailable: String(existing.ticketsAvailable),
    status: existing.status,
    featured: existing.featured,
  };
}

export default function EventForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [categories, setCategories] = useState<string[] | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [loadError, setLoadError] = useState("");
  const [notFound, setNotFound] = useState(false);

  function load() {
    setLoadError("");
    setCategories(null);
    setNotFound(false);

    const categoriesPromise = getCategories();
    const eventPromise = isEdit ? getEvents() : Promise.resolve([]);

    Promise.all([categoriesPromise, eventPromise])
      .then(([cats, events]) => {
        setCategories(cats);
        if (isEdit) {
          const existing = events.find((e) => e.id === id);
          if (!existing) {
            setNotFound(true);
          } else {
            setForm(toFormState(existing));
          }
        }
      })
      .catch((err) => setLoadError(err.message || "Couldn't load this page."));
  }

  useEffect(load, [id]);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  async function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setUploadError("Please choose an image file.");
      return;
    }
    setUploading(true);
    setUploadError("");
    try {
      const url = await uploadEventImage(file);
      set("image", url);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Couldn't upload that image.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function validate() {
    const next: Record<string, string> = {};
    if (!form.name.trim()) next.name = "Event name is required.";
    if (!form.category) next.category = "Choose a category.";
    if (!form.date) next.date = "Choose a date.";
    if (!form.venue.trim()) next.venue = "Venue is required.";
    if (!form.cityName.trim()) next.cityName = "City is required.";
    if (!form.state) next.state = "State is required.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      name: form.name,
      description: form.description,
      longDescription: form.longDescription || form.description,
      category: form.category,
      image: form.image,
      date: form.date,
      time: form.time,
      venue: form.venue,
      address: form.address,
      latitude: form.latitude === "" ? null : Number(form.latitude),
      longitude: form.longitude === "" ? null : Number(form.longitude),
      city: `${form.cityName}, ${form.state}`,
      country: "USA",
      startingPrice: form.requestPricingOnly ? null : Number(form.startingPrice) || null,
      ticketsAvailable: Number(form.ticketsAvailable) || 0,
      status: form.status,
      featured: form.featured,
    };

    setSubmitting(true);
    setSubmitError("");
    try {
      if (isEdit && id) {
        await updateEvent(id, payload);
      } else {
        await addEvent(payload);
      }
      navigate("/admin/events");
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : "Couldn't save this event. Please try again."
      );
      setSubmitting(false);
    }
  }

  if (loadError) return <ErrorState message={loadError} onRetry={load} />;
  if (notFound) return <ErrorState message="That event couldn't be found." />;
  if (!categories) return <LoadingState label="Loading…" />;

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-black sm:text-3xl">
        {isEdit ? "Edit event" : "Add event"}
      </h1>
      <p className="mt-1 text-sm text-ink-soft">
        {isEdit
          ? "Update this event's details — changes appear on the site immediately."
          : "New events are published to the site as soon as you save."}
      </p>

      <form onSubmit={handleSubmit} noValidate className="mt-6 max-w-2xl space-y-6">
        <Field label="Event name" required error={errors.name}>
          <input
            type="text"
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            className={inputClass(errors.name)}
          />
        </Field>

        <Field label="Short description">
          <input
            type="text"
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
            placeholder="One line shown on event cards"
            className={inputClass()}
          />
        </Field>

        <Field label="Full description">
          <textarea
            value={form.longDescription}
            onChange={(e) => set("longDescription", e.target.value)}
            rows={4}
            placeholder="Shown on the event details page"
            className={inputClass()}
          />
        </Field>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Category" required error={errors.category}>
            <select
              value={form.category}
              onChange={(e) => set("category", e.target.value)}
              className={inputClass(errors.category)}
            >
              <option value="">Select a category</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <Link to="/admin/categories" className="mt-1 inline-block text-xs text-gold-dark hover:text-gold">
              Manage categories
            </Link>
          </Field>
        </div>

        <Field label="Event photo">
          <div className="mt-2 flex flex-col gap-4 sm:flex-row">
            <div className="relative h-32 w-full shrink-0 overflow-hidden rounded-lg border border-paper-line bg-paper-stub sm:w-48">
              {form.image ? (
                <>
                  <img src={form.image} alt="" className="h-full w-full object-cover" />
                  <button
                    type="button"
                    onClick={() => set("image", "")}
                    className="absolute right-1.5 top-1.5 rounded-full bg-black/70 p-1 text-white hover:bg-black"
                    aria-label="Remove image"
                  >
                    <X size={13} />
                  </button>
                </>
              ) : (
                <div className="flex h-full w-full items-center justify-center text-xs text-ink-soft/60">
                  No photo yet
                </div>
              )}
              {uploading && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/80">
                  <Loader2 size={20} className="animate-spin text-gold-dark" />
                </div>
              )}
            </div>

            <div className="flex-1 space-y-3">
              <label className="flex w-fit cursor-pointer items-center gap-2 rounded-lg border border-dashed border-paper-line px-4 py-2.5 text-sm font-medium text-ink-soft hover:border-gold hover:text-gold-dark">
                <UploadCloud size={16} />
                Upload a photo
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
              {uploadError && <p className="text-xs text-red-500">{uploadError}</p>}

              <div>
                <label className="text-xs text-ink-soft">Or paste an image URL</label>
                <input
                  type="text"
                  value={form.image}
                  onChange={(e) => set("image", e.target.value)}
                  placeholder="https://..."
                  className={inputClass()}
                />
              </div>
            </div>
          </div>
        </Field>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Date" required error={errors.date}>
            <input
              type="date"
              value={form.date}
              onChange={(e) => set("date", e.target.value)}
              className={inputClass(errors.date)}
            />
          </Field>
          <Field label="Time">
            <input
              type="text"
              value={form.time}
              onChange={(e) => set("time", e.target.value)}
              placeholder="e.g. 7:30 PM"
              className={inputClass()}
            />
          </Field>
        </div>

        <Field label="Venue" required error={errors.venue}>
          <input
            type="text"
            value={form.venue}
            onChange={(e) => set("venue", e.target.value)}
            className={inputClass(errors.venue)}
          />
        </Field>

        <Field label="Street address">
          <input
            type="text"
            value={form.address}
            onChange={(e) => set("address", e.target.value)}
            className={inputClass()}
          />
        </Field>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Latitude">
            <input
              type="number"
              step="any"
              value={form.latitude}
              onChange={(e) => set("latitude", e.target.value)}
              placeholder="e.g. 40.7505"
              className={inputClass()}
            />
          </Field>
          <Field label="Longitude">
            <input
              type="number"
              step="any"
              value={form.longitude}
              onChange={(e) => set("longitude", e.target.value)}
              placeholder="e.g. -73.9934"
              className={inputClass()}
            />
          </Field>
        </div>
        <p className="-mt-3 text-xs text-ink-soft">Coordinates identify the event venue on a map and can be used later to calculate nearby parking distance.</p>

        <div className="grid grid-cols-[1fr_120px] gap-4">
          <Field label="City" required error={errors.cityName}>
            <input
              type="text"
              value={form.cityName}
              onChange={(e) => set("cityName", e.target.value)}
              className={inputClass(errors.cityName)}
            />
          </Field>
          <Field label="State" required error={errors.state}>
            <select
              value={form.state}
              onChange={(e) => set("state", e.target.value)}
              className={inputClass(errors.state)}
            >
              <option value="">—</option>
              {usStates.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </Field>
        </div>
        <p className="-mt-4 text-xs text-ink-soft">Country is fixed to United States.</p>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Starting parking price">
            <div className="flex items-center rounded-lg border border-paper-line px-3">
              <span className="text-ink-soft">$</span>
              <input
                type="number"
                min={0}
                value={form.startingPrice}
                disabled={form.requestPricingOnly}
                onChange={(e) => set("startingPrice", e.target.value)}
                className="w-full bg-transparent py-2 pl-1 text-sm focus:outline-none disabled:text-ink-soft/40"
              />
            </div>
            <label className="mt-2 flex items-center gap-2 text-xs text-ink-soft">
              <input
                type="checkbox"
                checked={form.requestPricingOnly}
                onChange={(e) => set("requestPricingOnly", e.target.checked)}
              />
              Show "Request Pricing" instead of a price
            </label>
          </Field>
          <Field label="Parking passes available">
            <input
              type="number"
              min={0}
              value={form.ticketsAvailable}
              onChange={(e) => set("ticketsAvailable", e.target.value)}
              className={inputClass()}
            />
          </Field>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Availability status">
            <select
              value={form.status}
              onChange={(e) => set("status", e.target.value as EventItem["status"])}
              className={inputClass()}
            >
              <option value="on-sale">On sale</option>
              <option value="limited">Limited</option>
              <option value="request">Request only</option>
            </select>
          </Field>
          <Field label="Homepage placement">
            <label className="mt-2.5 flex items-center gap-2 text-sm text-ink-soft">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => set("featured", e.target.checked)}
              />
              Feature this event on the homepage
            </label>
          </Field>
        </div>

        {submitError && <p className="text-sm text-red-500">{submitError}</p>}

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={uploading || submitting}
            className="rounded-full bg-gold px-7 py-3 text-sm font-semibold text-black hover:bg-gold-light disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? "Saving…" : isEdit ? "Save changes" : "Publish event"}
          </button>
          <Link
            to="/admin/events"
            className="rounded-full border border-paper-line px-7 py-3 text-sm font-semibold text-ink-soft hover:border-black hover:text-black"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}

function inputClass(error?: string) {
  return `mt-2 w-full rounded-lg border px-3 py-2 text-sm focus:outline-none ${
    error ? "border-red-400" : "border-paper-line focus:border-gold"
  }`;
}

function Field({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="text-sm font-medium text-black">
        {label} {required && <span className="text-gold-dark">*</span>}
      </label>
      {children}
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}
