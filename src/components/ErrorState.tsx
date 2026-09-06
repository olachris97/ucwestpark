import { AlertTriangle } from "lucide-react";

export default function ErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-3 px-5 py-24 text-center">
      <AlertTriangle size={26} className="text-red-500" />
      <p className="text-sm text-ink-soft">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-2 rounded-full bg-marquee px-5 py-2.5 text-sm font-semibold text-paper hover:bg-marquee-light"
        >
          Try again
        </button>
      )}
    </div>
  );
}
