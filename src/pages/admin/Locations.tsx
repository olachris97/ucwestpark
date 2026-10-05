import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Pencil, Trash2, Plus, MapPin } from "lucide-react";
import { getLocations, deleteLocation } from "../../lib/store";
import LoadingState from "../../components/LoadingState";
import ErrorState from "../../components/ErrorState";
import type { LocationItem } from "../../types";

export default function Locations() {
  const [locations, setLocations] = useState<LocationItem[] | null>(null);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  function load() { setError(""); setLocations(null); getLocations().then(setLocations).catch((err) => setError(err.message || "Couldn't load locations.")); }
  useEffect(load, []);
  async function handleDelete(location: LocationItem) {
    if (!window.confirm(`Remove "${location.venue}" from the site? This can't be undone.`)) return;
    setDeletingId(location.id);
    try { await deleteLocation(location.id); setLocations((prev) => prev && prev.filter((item) => item.id !== location.id)); }
    catch (err) { setError(err instanceof Error ? err.message : "Couldn't delete that location."); }
    finally { setDeletingId(null); }
  }
  if (error && !locations) return <ErrorState message={error} onRetry={load} />;
  if (!locations) return <LoadingState label="Loading locations…" />;
  return <div>
    <div className="flex flex-wrap items-center justify-between gap-3"><div><h1 className="font-display text-2xl font-semibold text-black sm:text-3xl">Locations</h1><p className="mt-1 text-sm text-ink-soft">Add, edit, or remove parking venues shown on the website.</p></div><Link to="/admin/locations/new" className="flex items-center gap-2 rounded-full bg-gold px-5 py-2.5 text-sm font-semibold text-black hover:bg-gold-light"><Plus size={16} /> Add location</Link></div>
    {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
    <div className="mt-6 overflow-x-auto rounded-xl border border-paper-line bg-white"><table className="w-full text-left text-sm"><thead><tr className="text-xs uppercase text-ink-soft/70"><th className="px-5 py-3 font-medium">Photo</th><th className="px-5 py-3 font-medium">Venue</th><th className="px-5 py-3 font-medium">Region</th><th className="px-5 py-3 font-medium">City</th><th className="px-5 py-3 font-medium">State</th><th className="px-5 py-3 font-medium text-right">Actions</th></tr></thead><tbody>{locations.map((location) => <tr key={location.id} className="border-t border-paper-line"><td className="px-5 py-3"><div className="h-11 w-14 overflow-hidden rounded-md bg-paper-stub">{location.image ? <img src={location.image} alt="" className="h-full w-full object-cover" /> : <MapPin className="m-3 text-ink-soft" size={18} />}</div></td><td className="max-w-[240px] truncate px-5 py-3 font-medium text-black">{location.venue}</td><td className="px-5 py-3 text-ink-soft">{location.region}</td><td className="px-5 py-3 text-ink-soft">{location.city}</td><td className="px-5 py-3 text-ink-soft">{location.state}</td><td className="px-5 py-3"><div className="flex justify-end gap-2"><Link to={`/admin/locations/${location.id}/edit`} className="rounded-lg border border-paper-line p-2 text-ink-soft hover:border-gold hover:text-gold-dark" aria-label={`Edit ${location.venue}`}><Pencil size={15} /></Link><button onClick={() => handleDelete(location)} disabled={deletingId === location.id} className="rounded-lg border border-paper-line p-2 text-ink-soft hover:border-red-400 hover:text-red-500 disabled:opacity-50" aria-label={`Delete ${location.venue}`}><Trash2 size={15} /></button></div></td></tr>)}</tbody></table>{locations.length === 0 && <p className="px-5 py-10 text-center text-sm text-ink-soft">No locations yet. Add your first parking venue to get started.</p>}</div>
  </div>;
}
