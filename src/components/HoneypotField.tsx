type Props = {
  value: string;
  onChange: (v: string) => void;
};

/**
 * Netlify honeypot — visually hidden without display:none so bots still fill it.
 * Field name must remain `bot-field` (data-netlify-honeypot).
 */
export function HoneypotField({ value, onChange }: Props) {
  return (
    <p className="hp-field" aria-hidden="true">
      <label>
        Don&apos;t fill this out if you&apos;re human:
        <input
          type="text"
          name="bot-field"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          tabIndex={-1}
          autoComplete="off"
        />
      </label>
    </p>
  );
}
