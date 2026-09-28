import { Section } from "@/components/ui/Layout";

const withoutProtection = [
  { month: "Month 1", note: "Savings" },
  { month: "Month 2", note: "Savings" },
  { month: "Month 3", note: "Pressure increases" },
  { month: "Month 4", note: "Decisions become financial" },
];

const withProtection = [
  { month: "Month 1", note: "Savings + protection" },
  { month: "Month 2", note: "Protection" },
  { month: "Month 3", note: "Protection" },
];

export function BreathingRoom() {
  return (
    <Section dark className="!py-16 md:!py-20">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="headline-lg text-paper">
          How much breathing room would change your job search?
        </h2>
        <p className="mt-4 text-paper/65">
          Imagine being laid off tomorrow.
        </p>
      </div>

      <div className="mt-12 grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5 md:p-6">
          <h3 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-paper/45">
            Without protection
          </h3>
          <ol className="mt-5 space-y-3">
            {withoutProtection.map((row) => (
              <li
                key={row.month}
                className="flex items-baseline justify-between gap-4 border-b border-white/10 pb-3 text-sm last:border-0"
              >
                <span className="text-paper/80">{row.month}</span>
                <span className="text-paper/50">{row.note}</span>
              </li>
            ))}
          </ol>
        </div>

        <div className="rounded-xl border border-teal/30 bg-white/[0.05] p-5 md:p-6">
          <h3 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-teal-soft">
            With proposed Salary Secure
          </h3>
          <ol className="mt-5 space-y-3">
            {withProtection.map((row) => (
              <li
                key={row.month}
                className="flex items-baseline justify-between gap-4 border-b border-white/10 pb-3 text-sm last:border-0"
              >
                <span className="text-paper/90">{row.month}</span>
                <span className="text-teal-soft">{row.note}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>

      <p className="mx-auto mt-12 max-w-lg text-center text-lg font-medium leading-relaxed text-paper">
        Give yourself time to find the right job — not just the next one.
      </p>
    </Section>
  );
}
