"use client";

import { brand } from "@/lib/brand";
import { coverageTiers, HERO_EXAMPLE_SALARY } from "@/data/plans";
import { computeProtectionEstimate, formatApproxINR } from "@/data/pricingConfig";
import { formatINR } from "@/lib/format";
import { track } from "@/lib/analytics";
import { Button } from "@/components/ui/Button";
import { Section } from "@/components/ui/Layout";
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

export function Hero() {
  const { scrollTo } = useApp();

  return (
    <Section className="!pt-10 md:!pt-12 !pb-8 md:!pb-12 bg-paper">
      <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
        <div>
          <p className="eyebrow">{brand.eyebrow}</p>
          <h1 className="headline-xl mt-4 text-graphite">
            Your salary stops.
            <br />
            Your backup starts.
          </h1>
          <p className="mt-5 max-w-lg text-[17px] leading-relaxed text-slate md:text-[18px]">
            {brand.supportingProposition}
          </p>

          <div className="mt-8 border-l-2 border-navy/20 pl-4">
            <p className="text-base font-semibold text-graphite md:text-lg">
              Salary insurance covering up to 100% of your take-home pay
            </p>
            <p className="mt-1 text-sm text-slate">
              Choose 3 or 6 months after an eligible layoff
            </p>
            <p className="mt-2 text-xs text-slate">
              Proposed coverage · Subject to eligibility and insurer approval
            </p>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button
              onClick={() => {
                track("hero_cta_clicked", { cta: "check_my_protection" });
                scrollTo("calculator");
              }}
            >
              Estimate My Salary Insurance
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                track("hero_cta_clicked", { cta: "get_early_access" });
                scrollTo("waitlist");
              }}
            >
              Get Early Access
            </Button>
          </div>

          <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-xs text-slate">
            <li>No payment required</li>
            <li className="hidden sm:list-item text-border">·</li>
            <li>Privacy-first</li>
            <li className="hidden sm:list-item text-border">·</li>
            <li>Built for salaried tech professionals</li>
          </ul>
        </div>

        <div className="card border-border/80 bg-paper p-5 shadow-[0_12px_40px_rgba(7,26,43,0.06)] md:p-7">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-semibold tracking-[0.16em] text-slate">
              SALARY INSURANCE
            </p>
            <p className="text-[10px] uppercase tracking-[0.12em] text-teal">
              Illustrative
            </p>
          </div>

          <dl className="mt-6 space-y-4">
            <div className="flex items-baseline justify-between gap-4 border-b border-border pb-3">
              <dt className="text-sm text-slate">Monthly take-home</dt>
              <dd className="display-num text-lg font-semibold text-graphite">
                {formatINR(EXAMPLE_SALARY)}
              </dd>
            </div>
            <div className="flex items-baseline justify-between gap-4 border-b border-border pb-3">
              <dt className="text-sm text-slate">Cover</dt>
              <dd className="text-lg font-semibold text-graphite">
                100% · {EXAMPLE_PERIOD} months
              </dd>
            </div>
            <div className="flex items-baseline justify-between gap-4">
              <dt className="text-sm text-slate">You pay annually</dt>
              <dd className="display-num text-xl font-semibold text-navy">
                {formatApproxINR(exampleEstimate.estimatedAnnualCost)}
              </dd>
            </div>
          </dl>

          <p className="mt-6 text-center text-[11px] text-slate">
            Slide your salary below to see your number.
          </p>
        </div>
      </div>
    </Section>
  );
}
