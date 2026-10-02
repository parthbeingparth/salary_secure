"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  coverageTiers,
  isAtMonthlyCap,
  type CoverageTierId,
} from "@/data/plans";
import {
  EMPLOYER_STABILITY_DISCLAIMER,
} from "@/data/employerRiskConfig";
import {
  EXTENDED_DURATION_DISCLAIMER,
  PRICE_DISCLAIMER_FULL,
  PRICE_DISCLAIMER_SHORT,
  PROTECTION_DURATIONS,
  computeProtectionEstimate,
  estimateAnalyticsProps,
  formatApproxINR,
  researchPricingRates,
  roundAnnualCost,
  type ProtectionDurationMonths,
} from "@/data/pricingConfig";
import {
  formatRiskAdjustment,
  type EmployerRiskResult,
} from "@/lib/employerRisk";
import { formatINR } from "@/lib/format";
import { track } from "@/lib/analytics";
import { Button } from "@/components/ui/Button";
import { EmployerRiskInputs } from "@/components/EmployerRiskInputs";
import { Section } from "@/components/ui/Layout";
import { useApp } from "@/components/AppProviders";

type Fields = {
  salary: string;
  commitments: string;
  savings: string;
  emis: string;
  housing: string;
  essentials: string;
  severance: string;
};

function toNum(v: string) {
  const n = Number(String(v).replace(/,/g, ""));
  return Number.isFinite(n) ? n : 0;
}

/** Runway calculator with duration + indicative research pricing. */
export function DesktopProductStudio() {
  const {
    setCalculatorCompleted,
    selectedTier,
    setSelectedTier,
    durationMonths,
    setDurationMonths,
    setLastEstimate,
    scrollTo,
  } = useApp();
  const [started, setStarted] = useState(false);
  const [refined, setRefined] = useState(false);
  const [compareOpen, setCompareOpen] = useState(false);
  const [employerRisk, setEmployerRisk] = useState<EmployerRiskResult | null>(
    null,
  );
  const completedTracked = useRef(false);
  const lastPriceKey = useRef<string | null>(null);
  const [fields, setFields] = useState<Fields>({
    salary: "180000",
    commitments: "105000",
    savings: "280000",
    emis: "",
    housing: "",
    essentials: "",
    severance: "",
  });

  const onEmployerRiskChange = useCallback((result: EmployerRiskResult) => {
    setEmployerRisk(result);
  }, []);

  const obligations = useMemo(() => {
    if (refined) {
      const sum =
        toNum(fields.emis) + toNum(fields.housing) + toNum(fields.essentials);
      return sum > 0 ? sum : toNum(fields.commitments);
    }
    return toNum(fields.commitments);
  }, [refined, fields]);

  const runwayMonths = useMemo(() => {
    if (obligations <= 0) return null;
    return (toNum(fields.savings) + toNum(fields.severance)) / obligations;
  }, [fields.savings, fields.severance, obligations]);

  const tier = coverageTiers.find((t) => t.id === selectedTier)!;
  const salary = toNum(fields.salary);
  const riskMultiplier = employerRisk?.riskMultiplier ?? 1;
  const quoteDisabled = employerRisk?.quoteDisabled ?? false;

  const estimate = useMemo(
    () =>
      computeProtectionEstimate({
        monthlyTakeHome: salary,
        monthlyCommittedExpenses: obligations,
        liquidSavings: toNum(fields.savings),
        severance: toNum(fields.severance),
        salaryPercent: tier.salaryPercent,
        monthlyCap: tier.monthlyCap,
        tierId: tier.id,
        durationMonths,
        employerRiskMultiplier: riskMultiplier,
        quoteDisabled,
        employerCompanyName: employerRisk?.companyName || null,
        employerStabilityScore: employerRisk?.stabilityScore ?? null,
        employerRiskLabel: employerRisk?.riskLabel ?? null,
      }),
    [
      salary,
      obligations,
      fields.savings,
      fields.severance,
      tier,
      durationMonths,
      riskMultiplier,
      quoteDisabled,
      employerRisk,
    ],
  );

  const withRunway = estimate.protectedRunwayMonths;
  const capped = isAtMonthlyCap(salary, tier);
  const delta =
    runwayMonths != null && withRunway != null
      ? Math.round((withRunway - runwayMonths) * 10) / 10
      : null;

  const todayPct =
    runwayMonths == null ? 0 : Math.min(100, (runwayMonths / 12) * 100);
  const withPct =
    withRunway == null ? 0 : Math.min(100, (withRunway / 12) * 100);

  function update(key: keyof Fields, value: string) {
    if (!started) {
      setStarted(true);
      track("runway_calculator_started");
    }
    setFields((f) => ({ ...f, [key]: value }));
  }

  useEffect(() => {
    setLastEstimate(estimate);
  }, [estimate, setLastEstimate]);

  useEffect(() => {
    if (!started) return;
    if (obligations <= 0 || runwayMonths == null) return;
    setCalculatorCompleted(true);
    if (!completedTracked.current) {
      completedTracked.current = true;
      track("runway_calculator_completed", {
        runway_months: Math.round(runwayMonths * 10) / 10,
        obligations,
        ...estimateAnalyticsProps(estimate, {
          plan: selectedTier,
          coverage_percentage: tier.salaryPercent,
          salary,
          duration_months: durationMonths,
        }),
      });
    }
  }, [
    started,
    obligations,
    runwayMonths,
    setCalculatorCompleted,
    estimate,
    selectedTier,
    tier.salaryPercent,
    salary,
    durationMonths,
  ]);

  useEffect(() => {
    if (estimate.estimatedAnnualCost <= 0) return;
    const key = `${selectedTier}:${durationMonths}:${estimate.estimatedAnnualCost}:${estimate.employerRiskMultiplier}`;
    if (lastPriceKey.current === key) return;
    lastPriceKey.current = key;
    const props = {
      ...estimateAnalyticsProps(estimate, {
        plan: selectedTier,
        coverage_percentage: tier.salaryPercent,
        salary,
        duration_months: durationMonths,
      }),
      company_name: employerRisk?.companyName || null,
      stability_score: employerRisk?.stabilityScore,
      risk_label: employerRisk?.riskLabel,
    };
    track("estimated_price_displayed", props);
    track("risk_adjusted_price_displayed", props);
  }, [
    estimate,
    selectedTier,
    durationMonths,
    tier.salaryPercent,
    salary,
    employerRisk,
  ]);

  return (
    <Section id="calculator" className="bg-ivory !py-12 md:!py-16">
      <div className="mx-auto max-w-[1200px]">
        <div className="max-w-xl">
          <h2 className="headline-lg text-graphite">
            Estimate your salary insurance
          </h2>
          <p className="mt-2 text-[16px] text-slate">
            See what proposed layoff salary insurance could cost and cover if
            your pay stopped tomorrow.
          </p>
        </div>

        <div className="mt-8 grid items-start gap-8 lg:grid-cols-2 lg:gap-10">
          <div className="space-y-4">
            <EmployerRiskInputs onRiskChange={onEmployerRiskChange} />

            <div className="border-t border-border pt-4 space-y-4">
              <Field
                label="Monthly take-home"
                value={fields.salary}
                onChange={(v) => update("salary", v)}
              />
              <Field
                label="Monthly committed expenses"
                value={fields.commitments}
                onChange={(v) => update("commitments", v)}
              />
              <Field
                label="Liquid savings"
                value={fields.savings}
                onChange={(v) => update("savings", v)}
              />

              <button
                type="button"
                className="text-sm text-navy-light underline-offset-2 hover:underline"
                aria-expanded={refined}
                onClick={() => setRefined((v) => !v)}
              >
                {refined ? "− Hide refined inputs" : "+ Refine calculation"}
              </button>

              {refined ? (
                <div className="space-y-3 border-t border-border pt-4">
                  <Field
                    label="Monthly EMIs"
                    value={fields.emis}
                    onChange={(v) => update("emis", v)}
                  />
                  <Field
                    label="Housing"
                    value={fields.housing}
                    onChange={(v) => update("housing", v)}
                  />
                  <Field
                    label="Essential expenses"
                    value={fields.essentials}
                    onChange={(v) => update("essentials", v)}
                  />
                  <Field
                    label="Expected severance (optional)"
                    value={fields.severance}
                    onChange={(v) => update("severance", v)}
                  />
                </div>
              ) : null}
            </div>
          </div>

          <div className="rounded-[var(--radius)] bg-navy p-6 text-[#FCFBF7] md:p-7 lg:sticky lg:top-24">
            {/* 1. Employer */}
            {employerRisk &&
            (employerRisk.companyName || employerRisk.source !== "none") ? (
              <div className="mb-7">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/50">
                  Your employer
                </p>
                <div className="mt-3 flex items-end justify-between gap-3">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.12em] text-white/40">
                      Employer stability
                    </p>
                    <p className="display-num mt-1 text-4xl leading-none text-white">
                      {employerRisk.stabilityScore}
                      <span className="text-base font-normal text-white/45">
                        {" "}
                        / 100
                      </span>
                    </p>
                  </div>
                  <p className="text-sm font-medium text-[#9ED4CC]">
                    {employerRisk.riskLabel}
                  </p>
                </div>
                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/15">
                  <div
                    className="h-full rounded-full bg-[#9ED4CC] transition-all duration-300"
                    style={{ width: `${employerRisk.stabilityScore}%` }}
                  />
                </div>
                <p className="mt-2 text-[11px] leading-relaxed text-white/40">
                  Based on employer size, funding visibility, layoff history and
                  business stability.
                </p>
              </div>
            ) : null}

            {/* 2. Runway */}
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/50">
              Your financial runway
            </p>

            <div className="mt-5 flex items-end gap-4">
              <div>
                <p className="text-[10px] uppercase tracking-[0.14em] text-white/45">
                  Today
                </p>
                <p className="serif-accent display-num mt-1 text-5xl leading-none text-white transition-all">
                  {runwayMonths == null
                    ? "—"
                    : (Math.round(runwayMonths * 10) / 10).toFixed(1)}
                </p>
                <p className="mt-1 text-xs text-white/50">months</p>
              </div>
              <span className="mb-6 text-2xl text-white/35" aria-hidden>
                →
              </span>
              <div>
                <p className="text-[10px] uppercase tracking-[0.14em] text-white/45">
                  With Salary Secure
                </p>
                <p className="serif-accent display-num mt-1 text-5xl leading-none text-[#9ED4CC] transition-all">
                  {withRunway == null
                    ? "—"
                    : (Math.round(withRunway * 10) / 10).toFixed(1)}
                </p>
                <p className="mt-1 text-xs text-white/50">
                  estimated financial runway
                </p>
              </div>
            </div>

            <div className="mt-5 space-y-2.5">
              <Bar label="Today" pct={todayPct} muted />
              <Bar label="With Salary Secure" pct={withPct} />
            </div>

            {delta != null && delta > 0 ? (
              <p className="mt-4 text-sm font-medium text-[#9ED4CC]">
                +{delta.toFixed(1)} months estimated additional runway
              </p>
            ) : null}

            {/* B. Protection */}
            <div className="mt-7 border-t border-white/15 pt-6">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/50">
                Your salary insurance
              </p>
              <div className="mt-3 flex rounded-lg border border-white/15 p-1">
                {coverageTiers.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    className={`min-h-9 flex-1 rounded-md text-xs font-semibold tracking-[0.06em] transition ${
                      selectedTier === t.id
                        ? "bg-paper text-navy"
                        : "text-white/65 hover:text-white"
                    }`}
                    onClick={() => setSelectedTier(t.id as CoverageTierId)}
                  >
                    {t.salaryPercent}%
                  </button>
                ))}
              </div>
              <p className="mt-2 text-center text-[11px] text-white/45">
                {tier.name} · {tier.salaryPercent}% salary protection concept
              </p>

              <p className="mt-5 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/50">
                Protection period
              </p>
              <div className="mt-2 flex rounded-lg border border-white/15 p-1">
                {PROTECTION_DURATIONS.map((d) => (
                  <button
                    key={d.months}
                    type="button"
                    className={`min-h-10 flex-1 rounded-md px-2 text-xs font-semibold transition ${
                      durationMonths === d.months
                        ? "bg-paper text-navy"
                        : "text-white/65 hover:text-white"
                    }`}
                    onClick={() =>
                      setDurationMonths(d.months as ProtectionDurationMonths)
                    }
                  >
                    <span className="block">{d.label}</span>
                    <span className="mt-0.5 block text-[10px] font-normal opacity-70">
                      {d.descriptor}
                    </span>
                  </button>
                ))}
              </div>
              <p className="mt-2 text-[11px] text-white/40">
                {durationMonths === 3
                  ? "Lower estimated cost · Short-term financial bridge"
                  : "Higher estimated cost · Longer financial runway"}
              </p>

              <dl className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <dt className="text-[10px] uppercase tracking-[0.12em] text-white/40">
                    Monthly protection
                  </dt>
                  <dd className="display-num mt-1 text-lg text-white">
                    {formatINR(estimate.monthlyProtection)}
                  </dd>
                </div>
                <div>
                  <dt className="text-[10px] uppercase tracking-[0.12em] text-white/40">
                    Max proposed benefit
                  </dt>
                  <dd className="display-num mt-1 text-lg text-white">
                    {formatINR(estimate.maximumBenefit)}
                  </dd>
                </div>
              </dl>
              <p className="mt-2 text-[11px] text-white/35">
                Cap {formatINR(tier.monthlyCap)}/month
                {capped ? " · Cap reached" : ""}
              </p>
            </div>

            {/* 4. Risk-adjusted cost + 5. Affordability */}
            <div className="mt-7 border-t border-white/15 pt-6">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/50">
                Estimated salary insurance cost
              </p>

              {estimate.quoteDisabled ? (
                <p className="mt-3 text-sm leading-relaxed text-white/70">
                  Coverage may be unavailable for this estimated employer risk
                  profile. Indicative pricing is hidden in research mode when
                  quoting is disabled.
                </p>
              ) : (
                <>
                  <div className="mt-3 space-y-2 text-sm">
                    <div className="flex items-baseline justify-between gap-3">
                      <span className="text-white/45">Base estimate</span>
                      <span className="display-num text-white/80">
                        {formatApproxINR(estimate.baseAnnualCost, true)}/year
                      </span>
                    </div>
                    <div className="flex items-baseline justify-between gap-3">
                      <span className="text-white/45">
                        Employer-risk adjustment
                      </span>
                      <span className="display-num text-[#9ED4CC]">
                        {formatRiskAdjustment(estimate.employerRiskMultiplier)}
                      </span>
                    </div>
                  </div>

                  <p className="display-num mt-4 text-[1.75rem] font-semibold leading-none tracking-tight text-white transition-all sm:text-3xl">
                    {formatApproxINR(estimate.annualLow, true)} –{" "}
                    {formatApproxINR(estimate.annualHigh, true)}
                    <span className="ml-1.5 text-sm font-normal text-white/50">
                      / year
                    </span>
                  </p>
                  <p className="mt-1 text-[11px] text-white/45">
                    Risk-adjusted salary insurance estimate
                  </p>
                  <p className="mt-2 text-sm text-white/60">
                    Monthly equivalent{" "}
                    <span className="display-num text-white/85">
                      {formatApproxINR(estimate.monthlyLow)} –{" "}
                      {formatApproxINR(estimate.monthlyHigh)}
                    </span>
                  </p>

                  <div className="mt-5 grid grid-cols-2 gap-3">
                    <div className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-3">
                      <p className="text-[10px] uppercase tracking-[0.12em] text-white/40">
                        Potential max benefit
                      </p>
                      <p className="display-num mt-1.5 text-xl text-white">
                        {formatApproxINR(estimate.maximumBenefit, true)}
                      </p>
                    </div>
                    <div className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-3">
                      <p className="text-[10px] uppercase tracking-[0.12em] text-white/40">
                        Risk-adjusted annual
                      </p>
                      <p className="display-num mt-1.5 text-xl text-white">
                        {formatApproxINR(estimate.estimatedAnnualCost, true)}
                      </p>
                    </div>
                  </div>

                  {estimate.priceAsSalaryPct != null ? (
                    <div className="mt-5 rounded-xl bg-[#E8F3F0] px-4 py-4 text-navy sm:px-5 sm:py-5">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-navy/55">
                        Affordability
                      </p>
                      <p className="serif-accent display-num mt-1 text-5xl leading-none tracking-tight text-navy sm:text-[3.25rem]">
                        {estimate.priceAsSalaryPct}%
                      </p>
                      <p className="mt-2 text-sm font-medium text-navy/80">
                        of your monthly salary
                      </p>
                      <p className="mt-1.5 text-xs leading-relaxed text-navy/55">
                        Estimated monthly cost{" "}
                        {formatApproxINR(estimate.monthlyEquivalent)} ·{" "}
                        {tier.name} · {durationMonths} months
                      </p>
                    </div>
                  ) : null}
                </>
              )}

              {durationMonths === 6 ? (
                <p className="mt-3 text-[11px] leading-relaxed text-white/35">
                  {EXTENDED_DURATION_DISCLAIMER}
                </p>
              ) : null}
            </div>

            {/* CTA */}
            <div className="mt-6">
              <Button
                variant="onDark"
                className="w-full"
                onClick={() => {
                  track("early_access_clicked", {
                    ...estimateAnalyticsProps(estimate, {
                      plan: selectedTier,
                      coverage_percentage: tier.salaryPercent,
                      salary,
                      duration_months: durationMonths,
                    }),
                  });
                  scrollTo("waitlist");
                }}
              >
                Get Early Access
              </Button>
              <button
                type="button"
                className="mt-3 w-full text-center text-sm text-white/45 underline-offset-2 hover:text-white/70 hover:underline"
                onClick={() => setCompareOpen(true)}
              >
                Compare plans
              </button>
            </div>

            <p className="mt-5 text-[10px] leading-relaxed text-white/28">
              {EMPLOYER_STABILITY_DISCLAIMER}
            </p>
            <p className="mt-2 text-[10px] leading-relaxed text-white/28">
              {PRICE_DISCLAIMER_SHORT} {PRICE_DISCLAIMER_FULL}
            </p>
          </div>
        </div>
      </div>

      {compareOpen ? (
        <PlanCompareModal
          onClose={() => setCompareOpen(false)}
          durationMonths={durationMonths}
          riskMultiplier={riskMultiplier}
        />
      ) : null}
      <div id="plans" className="sr-only" aria-hidden />
    </Section>
  );
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="block">
      <span className="text-[13px] font-medium text-graphite">{label}</span>
      <div className="mt-1.5 flex items-center rounded-lg border border-border bg-paper focus-within:ring-2 focus-within:ring-navy/25">
        <span className="pl-3 text-sm text-slate">₹</span>
        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          className="display-num min-h-11 w-full bg-transparent px-2 py-2 text-base outline-none"
          value={value}
          onChange={(e) => onChange(e.target.value.replace(/[^\d]/g, ""))}
          placeholder="0"
        />
      </div>
    </label>
  );
}

function Bar({
  label,
  pct,
  muted,
}: {
  label: string;
  pct: number;
  muted?: boolean;
}) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-[0.12em] text-white/45">
        {label}
      </p>
      <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-white/10">
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            muted ? "bg-white/35" : "bg-[#9ED4CC]"
          }`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function indicativeAnnualAtCap(
  tierId: CoverageTierId,
  monthlyCap: number,
  months: ProtectionDurationMonths,
  riskMultiplier: number,
): number {
  const maxBenefit = monthlyCap * months;
  const rate = researchPricingRates[tierId][months];
  return roundAnnualCost(maxBenefit * rate * riskMultiplier);
}

function PlanCompareModal({
  onClose,
  durationMonths,
  riskMultiplier,
}: {
  onClose: () => void;
  durationMonths: ProtectionDurationMonths;
  riskMultiplier: number;
}) {
  const { selectedTier, setSelectedTier, setDurationMonths } = useApp();
  const durations: ProtectionDurationMonths[] = [3, 6];

  function selectPlan(tierId: CoverageTierId, months: ProtectionDurationMonths) {
    setSelectedTier(tierId);
    setDurationMonths(months);
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-navy/40 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="plan-compare-title"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-4xl overflow-auto rounded-xl border border-border bg-paper p-5 shadow-xl md:p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3
              id="plan-compare-title"
              className="text-lg font-semibold text-graphite"
            >
              Compare all plans
            </h3>
            <p className="mt-1 text-xs text-slate">
              3-month and 6-month options · Indicative annual cost at each
              plan&apos;s monthly maximum
              {riskMultiplier !== 1
                ? ` · Includes your employer-risk adjustment (${formatRiskAdjustment(riskMultiplier)})`
                : ""}
            </p>
          </div>
          <button
            type="button"
            className="text-slate hover:text-graphite"
            onClick={onClose}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="mt-5 space-y-7">
          {durations.map((months) => (
            <div key={months}>
              <div className="mb-3 flex items-baseline justify-between gap-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate">
                  {months} months ·{" "}
                  {months === 3 ? "Standard protection" : "Extended protection"}
                </p>
                {durationMonths === months ? (
                  <span className="text-[11px] font-medium text-teal">
                    Current selection
                  </span>
                ) : null}
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[640px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-border text-[11px] uppercase tracking-[0.12em] text-slate">
                      <th className="pb-3 font-semibold">Plan</th>
                      <th className="pb-3 font-semibold">Salary %</th>
                      <th className="pb-3 font-semibold">Max / month</th>
                      <th className="pb-3 font-semibold">Max total</th>
                      <th className="pb-3 font-semibold">
                        Est. annual cost
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {coverageTiers.map((tier) => {
                      const annual = indicativeAnnualAtCap(
                        tier.id,
                        tier.monthlyCap,
                        months,
                        riskMultiplier,
                      );
                      const active =
                        selectedTier === tier.id && durationMonths === months;
                      return (
                        <tr
                          key={`${tier.id}-${months}`}
                          className={`border-b border-border/70 ${
                            active ? "bg-ivory/80" : ""
                          }`}
                        >
                          <td className="py-3">
                            <button
                              type="button"
                              className="font-semibold text-graphite hover:text-navy"
                              onClick={() =>
                                selectPlan(tier.id as CoverageTierId, months)
                              }
                            >
                              {tier.name}
                            </button>
                          </td>
                          <td className="py-3 text-slate">
                            {tier.salaryPercent}%
                          </td>
                          <td className="py-3 display-num text-graphite">
                            {formatINR(tier.monthlyCap, true)}
                          </td>
                          <td className="py-3 display-num text-graphite">
                            {formatINR(tier.monthlyCap * months, true)}
                          </td>
                          <td className="py-3 display-num font-medium text-graphite">
                            {formatApproxINR(annual, true)}
                            <span className="mt-0.5 block text-[11px] font-normal text-slate">
                              / year
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>

        <p className="mt-5 text-xs leading-relaxed text-slate">
          Proposed coverage · Indicative research pricing only · Not an
          insurance quote or premium. Annual figures use each plan&apos;s
          maximum monthly protection × selected duration × research rate
          {riskMultiplier !== 1 ? " × your employer-risk multiplier" : ""}.
          Your calculator estimate may be lower if salary is below the plan
          cap.
        </p>
      </div>
    </div>
  );
}
