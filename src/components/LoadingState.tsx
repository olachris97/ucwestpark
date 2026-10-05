import { Loader2 } from "lucide-react";

export default function LoadingState({ label = "Loading…" }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 px-5 py-24 text-ink-soft">
      <Loader2 size={28} className="animate-spin text-gold-dark" />
      <p className="text-sm">{label}</p>
    </div>
  );
}
