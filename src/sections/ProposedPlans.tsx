"use client";

import { coverageTiers, type CoverageTierId } from "@/data/plans";
import { Button } from "@/components/ui/Button";
import { Section } from "@/components/ui/Layout";
import { useApp } from "@/components/AppProviders";

export function ProposedPlans() {
  const { scrollTo, selectedTier, setSelectedTier } = useApp();

  return (
    <Section id="plans" className="bg-ivory">
      <div className="mx-auto max-w-2xl text-center">
        <p className="eyebrow">Salary insurance concepts</p>
        <h2 className="headline-lg mt-3 text-graphite">
          Three proposed salary insurance tiers
        </h2>
        <p className="mt-3 text-slate">
          Default is 100% of salary for 3 months. You can choose 50%, 75%, or 6
          months.
        </p>
      </div>

      <div className="mt-10 grid gap-4 lg:grid-cols-3">
        {coverageTiers.map((tier) => {
          const selected = selectedTier === tier.id;
          return (
            <button
              key={tier.id}
              type="button"
              onClick={() => setSelectedTier(tier.id as CoverageTierId)}
              className={`card card-hover p-5 text-left md:p-6 ${
                tier.flagship ? "ring-1 ring-navy/30" : ""
              } ${selected ? "border-navy/40 bg-paper" : "bg-paper"}`}
            >
              <h3 className="text-[13px] font-semibold tracking-[0.14em] text-graphite">
                {tier.name}
              </h3>
              <p className="mt-2 text-sm text-slate">{tier.tagline}</p>
              <p className="mt-5 text-sm text-graphite">
                {tier.salaryPercent}% of take-home · 3 or 6 months
              </p>
            </button>
          );
        })}
      </div>

      <div className="mt-8 text-center">
        <Button onClick={() => scrollTo("calculator")}>
          See my annual price
        </Button>
      </div>
    </Section>
  );
}
