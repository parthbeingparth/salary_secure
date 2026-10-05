"use client";

import { brand } from "@/lib/brand";
import { coverageTiers, HERO_EXAMPLE_SALARY } from "@/data/plans";
import { computeProtectionEstimate, formatApproxINR } from "@/data/pricingConfig";
import { formatINR } from "@/lib/format";
import { track } from "@/lib/analytics";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Layout";
import { useApp } from "@/components/AppProviders";

const EXAMPLE_SALARY = HERO_EXAMPLE_SALARY;
const EXAMPLE_PERIOD = 3;
const exampleTier = coverageTiers.find((t) => t.id === "secure_100")!;
const exampleEstimate = computeProtectionEstimate({
  monthlyTakeHome: EXAMPLE_SALARY,
  salaryPercent: exampleTier.salaryPercent,
  monthlyCap: exampleTier.monthlyCap,
  tierId: exampleTier.id,
  durationMonths: EXAMPLE_PERIOD,
});

export function MobileHero() {
  const { scrollTo } = useApp();

  return (
    <section className="bg-paper pb-10 pt-6">
      <Container>
        <p className="text-[11px] font-semibold tracking-[0.2em] text-graphite">
          <span className="text-slate">{brand.nameLines[0]}</span>{" "}
          <span className="text-navy-light">{brand.nameLines[1]}</span>
        </p>

        <h1 className="headline-xl mt-4 text-graphite">
          Your salary stops.
          <br />
          Your backup starts.
        </h1>

        <p className="mt-4 max-w-sm text-[16px] leading-relaxed text-slate">
          Salary insurance being designed for India&apos;s tech workforce.
        </p>

        <ul className="mt-5 flex flex-wrap gap-x-3 gap-y-1 text-[13px] text-graphite">
          <li>Up to 100% of salary</li>
          <li className="text-border" aria-hidden>
            ·
          </li>
          <li>3 or 6 months</li>
        </ul>

        <div className="mt-6">
          <Button
            className="w-full"
            onClick={() => {
              track("hero_cta_clicked", {
                cta: "check_my_protection",
                surface: "mobile",
              });
              scrollTo("calculator");
            }}
          >
            Estimate My Salary Insurance
          </Button>
          <button
            type="button"
            className="mt-3 w-full py-2 text-center text-sm text-navy-light underline-offset-2 hover:underline"
            onClick={() => scrollTo("how-it-works")}
          >
            How does this work?
          </button>
        </div>

        <div className="mt-6 rounded-xl border border-border bg-ivory/80 px-4 py-4">
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate">
            Example · {formatINR(EXAMPLE_SALARY, true)} take-home
          </p>
          <p className="mt-2 text-sm text-graphite">
            100% cover for {EXAMPLE_PERIOD} months
          </p>
          <p className="display-num mt-1 text-xl font-semibold text-navy">
            {formatApproxINR(exampleEstimate.estimatedAnnualCost)}
            <span className="ml-1 text-sm font-normal text-slate">/ year</span>
          </p>
          <p className="mt-2 text-[11px] text-slate">
            Indicative research price · Not a live premium
          </p>
        </div>
      </Container>
    </section>
  );
}
