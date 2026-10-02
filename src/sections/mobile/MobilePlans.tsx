"use client";

import { useMemo, useState } from "react";
import {
  coverageTiers,
  eligibleMonthlyProtection,
  type CoverageTierId,
} from "@/data/plans";
import { formatINR } from "@/lib/format";
import { track } from "@/lib/analytics";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Layout";
import { useApp } from "@/components/AppProviders";

const EXAMPLE_SALARY = 180000;

export function MobilePlans() {
  const { selectedTier, setSelectedTier, scrollTo, setWaitlistChannel } =
    useApp();
  const [expanded, setExpanded] = useState<CoverageTierId | null>("secure_100");

  const active = useMemo(
    () => coverageTiers.find((t) => t.id === selectedTier)!,
    [selectedTier],
  );

  const monthly = eligibleMonthlyProtection(EXAMPLE_SALARY, active);
  const total = monthly * active.durationMonths;

  function select(id: CoverageTierId) {
    setSelectedTier(id);
    setExpanded(id);
    track("coverage_selected", { tier: id, surface: "mobile_plans" });
  }

  return (
    <section id="plans" className="bg-paper py-12">
      <Container>
        <h2 className="headline-lg text-graphite">
          What could salary insurance look like?
        </h2>
        <p className="mt-2 text-[15px] text-slate">
          Choose how much of your salary you&apos;d want covered.
        </p>

        <div
          className="mt-5 flex gap-2"
          role="tablist"
          aria-label="Protection percentage"
        >
          {coverageTiers.map((tier) => {
            const selected = selectedTier === tier.id;
            return (
              <button
                key={tier.id}
                type="button"
                role="tab"
                aria-selected={selected}
                className={`min-h-11 flex-1 rounded-lg border text-sm font-semibold tracking-[0.04em] transition ${
                  selected
                    ? "border-navy bg-navy text-paper"
                    : "border-border bg-paper text-slate"
                }`}
                onClick={() => select(tier.id)}
              >
                {tier.salaryPercent}%
              </button>
            );
          })}
        </div>

        <div className="mt-5 -mx-1 flex snap-x-mandatory gap-3 overflow-x-auto px-1 pb-2 scrollbar-none">
          {coverageTiers.map((tier) => {
            const flagship = Boolean(tier.flagship);
            const selected = selectedTier === tier.id;
            return (
              <button
                key={tier.id}
                type="button"
                className={`snap-start w-[82%] shrink-0 rounded-xl border p-4 text-left transition ${
                  flagship
                    ? "border-navy/40 bg-navy text-paper"
                    : selected
                      ? "border-navy/30 bg-ivory"
                      : "border-border bg-paper"
                }`}
                onClick={() => select(tier.id)}
              >
                {flagship ? (
                  <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-teal-soft">
                    Full salary protection concept
                  </p>
                ) : null}
                <p
                  className={`text-[12px] font-semibold tracking-[0.12em] ${
                    flagship ? "text-paper" : "text-graphite"
                  }`}
                >
                  {tier.name}
                </p>
                <p
                  className={`mt-2 text-sm ${
                    flagship ? "text-paper/70" : "text-slate"
                  }`}
                >
                  Up to {tier.salaryPercent}% salary
                </p>
                <p
                  className={`display-num mt-1 text-xl font-semibold ${
                    flagship ? "text-paper" : "text-graphite"
                  }`}
                >
                  Max {formatINR(tier.monthlyCap, true)}
                  <span className="text-sm font-normal opacity-70">/month</span>
                </p>
                {expanded === tier.id ? (
                  <div
                    className={`mt-3 border-t pt-3 text-xs leading-relaxed ${
                      flagship
                        ? "border-white/15 text-paper/65"
                        : "border-border text-slate"
                    }`}
                  >
                    <p>Coverage period: up to {tier.durationMonths} months</p>
                    <p className="mt-1">
                      Max potential:{" "}
                      {formatINR(tier.monthlyCap * tier.durationMonths)}
                    </p>
                    <p className="mt-2">
                      Proposed coverage · Subject to eligibility &amp; insurer
                      approval
                    </p>
                  </div>
                ) : null}
              </button>
            );
          })}
        </div>
        <p className="mt-1 text-[11px] text-slate">Swipe to compare →</p>

        <div className="mt-6 rounded-xl border border-border bg-ivory/70 p-4">
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate">
            Example · {formatINR(EXAMPLE_SALARY)} take-home
          </p>
          <dl className="mt-3 space-y-2 text-sm">
            <div className="flex justify-between gap-3">
              <dt className="text-slate">Selected</dt>
              <dd className="font-medium text-graphite">{active.name}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-slate">Monthly protection</dt>
              <dd className="display-num font-semibold text-navy">
                {formatINR(monthly)}
              </dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-slate">
                {active.durationMonths}-month protection
              </dt>
              <dd className="display-num font-semibold text-graphite">
                {formatINR(total)}
              </dd>
            </div>
          </dl>
        </div>

        <Button
          className="mt-6 w-full"
          onClick={() => {
            setWaitlistChannel(null);
            track("waitlist_started", { source: "mobile_plans_wtp" });
            scrollTo("waitlist");
          }}
        >
          Tell Us What You&apos;d Pay
        </Button>
      </Container>
    </section>
  );
}
