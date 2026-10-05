"use client";

import { coverageTiers } from "@/data/plans";
import { track } from "@/lib/analytics";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Layout";
import { useApp } from "@/components/AppProviders";

export function MobilePlans() {
  const { scrollTo } = useApp();

  return (
    <section id="plans" className="bg-paper py-12">
      <Container>
        <h2 className="headline-lg text-graphite">
          What could salary insurance look like?
        </h2>
        <p className="mt-2 text-[15px] text-slate">
          Start at 100% of salary for 3 months. Switch to 50%, 75%, or 6 months
          if you want.
        </p>

        <ul className="mt-5 space-y-3">
          {coverageTiers.map((tier) => (
            <li
              key={tier.id}
              className={`rounded-xl border p-4 ${
                tier.flagship
                  ? "border-navy/30 bg-navy text-paper"
                  : "border-border bg-paper"
              }`}
            >
              <p
                className={`text-[12px] font-semibold tracking-[0.12em] ${
                  tier.flagship ? "text-paper" : "text-graphite"
                }`}
              >
                {tier.name}
              </p>
              <p
                className={`mt-1 text-sm ${
                  tier.flagship ? "text-paper/70" : "text-slate"
                }`}
              >
                {tier.salaryPercent}% of take-home · 3 or 6 months
              </p>
            </li>
          ))}
        </ul>

        <Button
          className="mt-6 w-full"
          onClick={() => {
            track("waitlist_started", { source: "mobile_plans" });
            scrollTo("calculator");
          }}
        >
          See my annual price
        </Button>
      </Container>
    </section>
  );
}
