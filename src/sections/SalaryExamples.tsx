"use client";

import { useState } from "react";
import {
  coverageTiers,
  eligibleMonthlyProtection,
  isAtMonthlyCap,
  salaryExampleOptions,
} from "@/data/plans";
import { formatINR } from "@/lib/format";
import { Card, Section } from "@/components/ui/Layout";

export function SalaryExamples() {
  const [salary, setSalary] = useState(150000);

  return (
    <Section className="bg-ivory">
      <div className="mx-auto max-w-2xl text-center">
        <p className="eyebrow">Interactive examples</p>
        <h2 className="headline-lg mt-3 text-graphite">
          What could Salary Secure look like for you?
        </h2>
        <p className="mt-3 text-slate">
          Proposed amounts based on monthly take-home salary — subject to
          eligibility and plan caps.
        </p>
      </div>

      <div className="mt-8 flex flex-wrap justify-center gap-2">
        {salaryExampleOptions.map((opt) => (
          <button
            key={opt}
            type="button"
            className={`min-h-11 rounded-lg border px-3.5 py-2 text-sm font-medium transition ${
              salary === opt
                ? "border-navy bg-navy text-paper"
                : "border-border bg-paper text-slate hover:border-navy/30"
            }`}
            onClick={() => setSalary(opt)}
          >
            {opt >= 300000 ? "₹3L+" : formatINR(opt, true)}
          </button>
        ))}
      </div>

      <div className="mt-8 grid gap-3 md:grid-cols-3">
        {coverageTiers.map((tier) => {
          const amount = eligibleMonthlyProtection(salary, tier);
          const capped = isAtMonthlyCap(salary, tier);
          return (
            <Card
              key={tier.id}
              className={
                tier.flagship
                  ? "ring-1 ring-navy/25 bg-paper"
                  : "bg-paper"
              }
            >
              <p className="text-[11px] font-semibold tracking-[0.14em] text-slate">
                {tier.name}
              </p>
              <p className="display-num mt-3 text-2xl font-semibold text-graphite md:text-3xl">
                {formatINR(amount, true)}
                <span className="text-sm font-normal text-slate">/month</span>
              </p>
              <p className="mt-2 text-xs text-slate">
                Up to {tier.salaryPercent}% of take-home
                {capped ? " · Maximum monthly cap reached" : ""}
              </p>
            </Card>
          );
        })}
      </div>
      <p className="mt-4 text-center text-xs text-slate">
        Illustrative proposed coverage. Final limits subject to insurer approval.
      </p>
    </Section>
  );
}
