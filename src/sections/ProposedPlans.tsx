"use client";

import {
  coverageTiers,
  eligibleMonthlyProtection,
  type CoverageTierId,
} from "@/data/plans";
import { formatINR } from "@/lib/format";
import { Button } from "@/components/ui/Button";
import { Card, Section } from "@/components/ui/Layout";
import { useApp } from "@/components/AppProviders";
import type { WillingToPay } from "@/types";

const PLAN_ILLUSTRATIVE_SALARY = 200000;

export function ProposedPlans() {
  const {
    researchPrice,
    scrollTo,
    willingToPay,
    setWillingToPay,
    selectedTier,
    setSelectedTier,
  } = useApp();

  const activeTier = coverageTiers.find((t) => t.id === selectedTier)!;
  const illustrated = eligibleMonthlyProtection(
    PLAN_ILLUSTRATIVE_SALARY,
    activeTier,
  );

  function onWtp(value: WillingToPay) {
    setWillingToPay(value);
  }

  return (
    <Section id="plans" className="bg-ivory">
      <div className="mx-auto max-w-2xl text-center">
        <p className="eyebrow">Salary insurance concepts</p>
        <h2 className="headline-lg mt-3 text-graphite">
          Three proposed salary insurance tiers
        </h2>
        <p className="mt-3 text-slate">
          Pricing being validated — not displayed as premiums. Tell us what
          you&apos;d pay.
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
              {tier.flagship ? (
                <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-teal">
                  Maximum proposed coverage
                </p>
              ) : null}
              <h3 className="text-[13px] font-semibold tracking-[0.14em] text-graphite">
                {tier.name}
              </h3>
              <p className="mt-2 text-sm text-slate">{tier.tagline}</p>
              <p className="mt-5 text-sm text-slate">
                Up to {tier.salaryPercent}% of monthly take-home
              </p>
              <p className="display-num mt-1 text-2xl font-semibold text-graphite">
                Max {formatINR(tier.monthlyCap, true)}
                <span className="text-sm font-normal text-slate">/month</span>
              </p>
              <p className="mt-1 text-xs text-slate">Maximum monthly protection</p>
              <p className="mt-3 text-sm text-slate">
                Coverage period: up to {tier.durationMonths} months
              </p>
              <p className="mt-1 text-sm text-graphite">
                Maximum potential protection:{" "}
                <strong>
                  {formatINR(tier.monthlyCap * tier.durationMonths)}
                </strong>
              </p>
              <p className="mt-5 text-xs text-slate">
                Pricing being validated · Not an insurance quote
              </p>
            </button>
          );
        })}
      </div>

      <Card className="mx-auto mt-8 max-w-2xl bg-paper">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate">
          Willingness-to-pay research · {activeTier.name}
        </p>
        <p className="mt-3 text-base font-medium text-graphite">
          If Salary Secure like this were available at ₹
          {researchPrice.toLocaleString("en-IN")}/month, would you seriously
          consider purchasing it?
        </p>
        <p className="mt-2 text-sm text-slate">
          Example at ₹{PLAN_ILLUSTRATIVE_SALARY.toLocaleString("en-IN")}{" "}
          take-home: about {formatINR(illustrated)}/month proposed protection for up
          to {activeTier.durationMonths} months. Research price only — not a
          premium.
        </p>
        <div className="mt-5 flex flex-col gap-2 sm:flex-row">
          {(
            [
              ["yes", "Yes"],
              ["maybe", "Maybe"],
              ["no", "No"],
            ] as const
          ).map(([value, label]) => (
            <Button
              key={value}
              variant={willingToPay === value ? "primary" : "outline"}
              className="flex-1"
              onClick={() => onWtp(value)}
            >
              {label}
            </Button>
          ))}
        </div>
        <div className="mt-5">
          <Button onClick={() => scrollTo("waitlist")}>
            Tell us what you&apos;d pay
          </Button>
        </div>
      </Card>
    </Section>
  );
}
