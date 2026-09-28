import { brand } from "@/lib/brand";
import { Section } from "@/components/ui/Layout";

const steps = [
  {
    n: "01",
    title: "You're employed",
    body: "Salary Secure is intended to be taken before a layoff is known or expected.",
  },
  {
    n: "02",
    title: "Choose your protection",
    body: "Select how much of your monthly take-home income you would want protected.",
  },
  {
    n: "03",
    title: "Eligible layoff",
    body: "After verification and applicable waiting/severance conditions, an eligible involuntary layoff may trigger the benefit.",
  },
  {
    n: "04",
    title: "Your backup starts",
    body: "Receive the eligible monthly protection benefit while you navigate what comes next.",
  },
];

export function ProductConcept() {
  return (
    <Section id="how-it-works" dark className="!py-16 md:!py-24">
      <div className="mx-auto max-w-2xl text-center">
        <p className="eyebrow">How it works</p>
        <h2 className="headline-lg mt-3 text-paper">
          Meet {brand.shortName}.
        </h2>
        <p className="mt-3 text-lg text-paper/70">{brand.secondaryLine}</p>
        <p className="mt-2 text-sm text-paper/50">{brand.contextualLine}</p>
      </div>

      <ol className="relative mx-auto mt-14 max-w-2xl space-y-0">
        {steps.map((step, i) => (
          <li
            key={step.n}
            className="relative flex gap-5 pb-10 last:pb-0 md:gap-8"
          >
            {i < steps.length - 1 ? (
              <span
                className="absolute left-[18px] top-10 h-[calc(100%-1.5rem)] w-px bg-white/15 md:left-[22px]"
                aria-hidden
              />
            ) : null}
            <span className="display-num relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/5 text-xs font-semibold text-paper md:h-11 md:w-11 md:text-sm">
              {step.n}
            </span>
            <div className="pt-1">
              <h3 className="text-base font-semibold tracking-tight text-paper md:text-lg">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-paper/65 md:text-[15px]">
                {step.body}
              </p>
            </div>
          </li>
        ))}
      </ol>

      <div className="mx-auto mt-10 max-w-2xl rounded-xl border border-white/10 bg-white/[0.04] px-5 py-4 text-sm leading-relaxed text-paper/80">
        <p className="font-medium text-paper">
          Proposed product flow. Final terms subject to insurer approval.
        </p>
        <p className="mt-2 text-paper/50">{brand.regulatoryDisclaimer}</p>
      </div>
    </Section>
  );
}
