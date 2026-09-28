import { Section } from "@/components/ui/Layout";

export function PremiumCoverage() {
  return (
    <Section dark className="!py-20 md:!py-28" id="premium-coverage">
      <div className="mx-auto max-w-3xl text-center">
        <p className="eyebrow">Proposed maximum coverage</p>
        <p className="serif-accent mt-6 text-[clamp(3.5rem,12vw,7rem)] leading-[0.9] text-paper">
          100%
        </p>
        <p className="mt-2 text-2xl font-medium tracking-tight text-paper/85 md:text-3xl">
          of your salary
        </p>
        <p className="mt-8 text-xl text-paper/75 md:text-2xl">
          up to ₹2.5L per month
        </p>
        <p className="mt-3 text-lg text-paper/60">for up to 3 months</p>
        <p className="mt-8 text-lg text-paper/70">
          Up to ₹7.5 lakh of potential income protection.
        </p>
        <p className="mt-10 text-sm font-medium tracking-wide text-teal-soft">
          Never more than eligible monthly take-home salary.
        </p>
        <p className="mx-auto mt-8 max-w-xl text-xs leading-relaxed text-paper/40">
          Illustrative proposed coverage. Final limits, pricing, exclusions and
          eligibility subject to insurer and regulatory approval.
        </p>
      </div>
    </Section>
  );
}
