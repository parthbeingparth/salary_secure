import {
  potentialEligibility,
  proposedCoveredEvents,
  proposedExclusions,
  TERMS_SUBJECT_TO_APPROVAL,
} from "@/data/eligibility";
import { Section } from "@/components/ui/Layout";

export function CoverageRules() {
  return (
    <Section id="coverage" className="bg-paper">
      <div className="mx-auto max-w-2xl text-center">
        <p className="eyebrow">Eligibility being explored</p>
        <h2 className="headline-lg mt-3 text-graphite">
          Clear rules.
          <br />
          No ambiguity theatre.
        </h2>
        <p className="mt-3 text-sm text-slate">{TERMS_SUBJECT_TO_APPROVAL}</p>
      </div>

      <div className="mt-12 grid gap-8 md:grid-cols-2 md:gap-12">
        <div>
          <h3 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-teal">
            Proposed eligible events
          </h3>
          <ul className="mt-5 space-y-3">
            {proposedCoveredEvents.map((item) => (
              <li
                key={item}
                className="border-b border-border pb-3 text-sm text-graphite last:border-0"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate">
            Proposed exclusions
          </h3>
          <ul className="mt-5 space-y-3">
            {proposedExclusions.map((item) => (
              <li
                key={item}
                className="border-b border-border pb-3 text-sm text-graphite last:border-0"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mx-auto mt-10 max-w-2xl border border-border bg-ivory/50 p-5 md:p-6">
        <h3 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-navy-light">
          Potential eligibility
        </h3>
        <ul className="mt-4 grid gap-2 text-sm text-graphite sm:grid-cols-2">
          {potentialEligibility.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <p className="mt-4 text-xs text-slate">{TERMS_SUBJECT_TO_APPROVAL}</p>
      </div>
    </Section>
  );
}
