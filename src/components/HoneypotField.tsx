/**
 * An invisible field that real visitors never see or fill in. Simple
 * spam bots that auto-fill every input on a form end up filling this
 * one too, which the backend uses to silently discard the submission.
 *
 * Positioned off-screen (not display:none) since some bots specifically
 * skip hidden/display:none fields — this still "looks" fillable to a
 * naive scraper while being invisible and unreachable for a real user
 * tabbing through the form.
 */
export default function HoneypotField({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div
      aria-hidden="true"
      style={{ position: "absolute", left: "-9999px", top: "-9999px" }}
    >
      <label htmlFor="website">Leave this field empty</label>
      <input
        id="website"
        name="website"
        type="text"
        tabIndex={-1}
        autoComplete="off"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
