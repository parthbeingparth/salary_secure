"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  coverageTiers,
  type CoverageTierId,
} from "@/data/plans";
import { EMPLOYER_STABILITY_DISCLAIMER } from "@/data/employerRiskConfig";
import {
  EXTENDED_DURATION_DISCLAIMER,
  PRICE_DISCLAIMER_FULL,
  PRICE_DISCLAIMER_SHORT,
  PROTECTION_DURATIONS,
  computeProtectionEstimate,
  estimateAnalyticsProps,
  formatApproxINR,
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
import { Container } from "@/components/ui/Layout";
import { useApp } from "@/components/AppProviders";
import { ChapterLabel } from "./MobileUi";

function toNum(v: string) {
  const n = Number(String(v).replace(/,/g, ""));
  return Number.isFinite(n) ? n : 0;
}

export function MobileCalculator() {
  const {
    setCalculatorCompleted,
    scrollTo,
    selectedTier,
    setSelectedTier,
    durationMonths,
    setDurationMonths,
    setLastEstimate,
  } = useApp();
  const [salary, setSalary] = useState("180000");
  const [commitments, setCommitments] = useState("105000");
  const [savings, setSavings] = useState("280000");
  const [detailed, setDetailed] = useState(false);
  const [emis, setEmis] = useState("");
  const [housing, setHousing] = useState("");
  const [essentials, setEssentials] = useState("");
  const [severance, setSeverance] = useState("");
  const [employerRisk, setEmployerRisk] = useState<EmployerRiskResult | null>(
    null,
  );
  const startedRef = useRef(false);
  const completedTracked = useRef(false);
  const lastPriceKey = useRef<string | null>(null);

  const onEmployerRiskChange = useCallback((result: EmployerRiskResult) => {
    setEmployerRisk(result);
  }, []);

  const obligations = useMemo(() => {
    if (detailed) {
      const sum = toNum(emis) + toNum(housing) + toNum(essentials);
      return sum > 0 ? sum : toNum(commitments);
    }
    return toNum(commitments);
  }, [detailed, emis, housing, essentials, commitments]);

  const runwayMonths = useMemo(() => {
    if (obligations <= 0) return null;
    return (toNum(savings) + toNum(severance)) / obligations;
  }, [savings, severance, obligations]);

  const tier = coverageTiers.find((t) => t.id === selectedTier)!;
  const salaryNum = toNum(salary);
  const riskMultiplier = employerRisk?.riskMultiplier ?? 1;
  const quoteDisabled = employerRisk?.quoteDisabled ?? false;

  const estimate = useMemo(
    () =>
      computeProtectionEstimate({
        monthlyTakeHome: salaryNum,
        monthlyCommittedExpenses: obligations,
        liquidSavings: toNum(savings),
        severance: toNum(severance),
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
      salaryNum,
      obligations,
      savings,
      severance,
      tier,
      durationMonths,
      riskMultiplier,
      quoteDisabled,
      employerRisk,
    ],
  );

  const withRunway = estimate.protectedRunwayMonths;
  const hasResult = runwayMonths != null && Number.isFinite(runwayMonths);
  const delta =
    hasResult && withRunway != null
      ? Math.round((withRunway - runwayMonths!) * 10) / 10
      : null;

  function markStarted() {
    if (!startedRef.current) {
      startedRef.current = true;
      track("runway_calculator_started", { surface: "mobile" });
    }
  }

  useEffect(() => {
    setLastEstimate(estimate);
  }, [estimate, setLastEstimate]);

  useEffect(() => {
    if (!startedRef.current || runwayMonths == null) return;
    setCalculatorCompleted(true);
    if (!completedTracked.current) {
      completedTracked.current = true;
      track("runway_calculator_completed", {
        runway_months: Math.round(runwayMonths * 10) / 10,
        surface: "mobile",
        ...estimateAnalyticsProps(estimate, {
          plan: selectedTier,
          coverage_percentage: tier.salaryPercent,
          salary: salaryNum,
          duration_months: durationMonths,
        }),
      });
    }
  }, [
    runwayMonths,
    setCalculatorCompleted,
    estimate,
    selectedTier,
    tier.salaryPercent,
    salaryNum,
    durationMonths,
  ]);

  useEffect(() => {
    if (estimate.estimatedAnnualCost <= 0) return;
    const key = `${selectedTier}:${durationMonths}:${estimate.estimatedAnnualCost}:${estimate.employerRiskMultiplier}`;
    if (lastPriceKey.current === key) return;
    lastPriceKey.current = key;
    const props = {
      surface: "mobile" as const,
      ...estimateAnalyticsProps(estimate, {
        plan: selectedTier,
        coverage_percentage: tier.salaryPercent,
        salary: salaryNum,
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
    salaryNum,
    employerRisk,
  ]);

  return (
    <section id="calculator" className="bg-paper py-12">
      <Container>
        <ChapterLabel n="02" label="SALARY INSURANCE" />
        <h2 className="headline-lg text-graphite">
          Estimate your salary insurance
        </h2>
        <p className="mt-2 text-[15px] text-slate">
          Proposed layoff salary insurance, priced around your salary and
          employer stability.
        </p>

        <div className="mt-6 space-y-3.5">
          <EmployerRiskInputs
            variant="mobile"
            onRiskChange={(r) => {
              markStarted();
              onEmployerRiskChange(r);
            }}
          />

          <div className="border-t border-border pt-3.5 space-y-3.5">
            <Field
              label="Monthly take-home"
              value={salary}
              onChange={(v) => {
                markStarted();
                setSalary(v);
              }}
            />
            <Field
              label="Monthly committed expenses"
              value={commitments}
              onChange={(v) => {
                markStarted();
                setCommitments(v);
              }}
            />
            <Field
              label="Liquid savings"
              value={savings}
              onChange={(v) => {
                markStarted();
                setSavings(v);
              }}
            />
            <button
              type="button"
              className="text-sm text-navy-light underline-offset-2 hover:underline"
              onClick={() => setDetailed((v) => !v)}
              aria-expanded={detailed}
            >
              {detailed ? "− Hide refined inputs" : "+ Refine calculation"}
            </button>
            {detailed ? (
              <div className="space-y-3 border-t border-border pt-3">
                <Field
                  label="Monthly EMIs"
                  value={emis}
                  onChange={(v) => {
                    markStarted();
                    setEmis(v);
                  }}
                />
                <Field
                  label="Housing"
                  value={housing}
                  onChange={(v) => {
                    markStarted();
                    setHousing(v);
                  }}
                />
                <Field
                  label="Essential expenses"
                  value={essentials}
                  onChange={(v) => {
                    markStarted();
                    setEssentials(v);
                  }}
                />
                <Field
                  label="Expected severance (optional)"
                  value={severance}
                  onChange={(v) => {
                    markStarted();
                    setSeverance(v);
                  }}
                />
              </div>
            ) : null}
          </div>
        </div>

        {hasResult ? (
          <div className="mt-8 space-y-4">
            {employerRisk &&
            (employerRisk.companyName || employerRisk.source !== "none") ? (
              <div className="rounded-xl border border-border bg-ivory/60 p-4">
                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate">
                  Employer stability
                </p>
                <div className="mt-2 flex items-end justify-between">
                  <p className="display-num text-3xl font-semibold text-navy">
                    {employerRisk.stabilityScore}
                    <span className="text-sm font-normal text-slate">
                      {" "}
                      / 100
                    </span>
                  </p>
                  <p className="text-sm font-medium text-teal">
                    {employerRisk.riskLabel}
                  </p>
                </div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-border">
                  <div
                    className="h-full rounded-full bg-teal transition-all"
                    style={{ width: `${employerRisk.stabilityScore}%` }}
                  />
                </div>
              </div>
            ) : null}

            <div className="rounded-xl bg-navy p-5 text-[#FCFBF7]">
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-white/50">
                Your financial runway
              </p>
              <div className="mt-4 flex items-end gap-3">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.12em] text-white/45">
                    Today
                  </p>
                  <p className="serif-accent display-num text-4xl text-white">
                    {(Math.round(runwayMonths! * 10) / 10).toFixed(1)}
                  </p>
                </div>
                <span className="mb-2 text-xl text-white/35" aria-hidden>
                  →
                </span>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.12em] text-white/45">
                    With Salary Secure
                  </p>
                  <p className="serif-accent display-num text-4xl text-[#9ED4CC]">
                    {withRunway == null
                      ? "—"
                      : (Math.round(withRunway * 10) / 10).toFixed(1)}
                  </p>
                </div>
              </div>
              {delta != null && delta > 0 ? (
                <p className="mt-3 text-sm text-[#9ED4CC]">
                  +{delta.toFixed(1)} months estimated additional runway
                </p>
              ) : null}
            </div>

            <div className="rounded-xl border border-border bg-paper p-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate">
                Choose Secure plan
              </p>
              <div className="mt-2 flex rounded-lg border border-border p-1">
                {coverageTiers.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    className={`min-h-9 flex-1 rounded-md text-xs font-semibold ${
                      selectedTier === t.id
                        ? "bg-navy text-paper"
                        : "text-slate"
                    }`}
                    onClick={() => setSelectedTier(t.id as CoverageTierId)}
                  >
                    {t.salaryPercent}%
                  </button>
                ))}
              </div>

              <p className="mt-4 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate">
                Protection period
              </p>
              <div className="mt-2 flex rounded-lg border border-border p-1">
                {PROTECTION_DURATIONS.map((d) => (
                  <button
                    key={d.months}
                    type="button"
                    className={`min-h-10 flex-1 rounded-md px-1 text-xs font-semibold ${
                      durationMonths === d.months
                        ? "bg-navy text-paper"
                        : "text-slate"
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

              <p className="mt-4 text-sm text-graphite">
                {formatINR(estimate.monthlyProtection)}/mo · {durationMonths}{" "}
                months · {formatINR(estimate.maximumBenefit)} max proposed
                benefit
              </p>

              <div className="mt-4 border-t border-border pt-4">
                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate">
                  Risk-adjusted salary insurance estimate
                </p>
                {estimate.quoteDisabled ? (
                  <p className="mt-2 text-sm text-slate">
                    Coverage may be unavailable for this estimated employer risk
                    profile.
                  </p>
                ) : (
                  <>
                    <div className="mt-2 space-y-1 text-sm text-slate">
                      <p className="flex justify-between gap-2">
                        <span>Base estimate</span>
                        <span className="display-num text-graphite">
                          {formatApproxINR(estimate.baseAnnualCost, true)}/year
                        </span>
                      </p>
                      <p className="flex justify-between gap-2">
                        <span>Employer-risk adjustment</span>
                        <span className="display-num text-teal">
                          {formatRiskAdjustment(
                            estimate.employerRiskMultiplier,
                          )}
                        </span>
                      </p>
                    </div>
                    <p className="display-num mt-3 text-2xl font-semibold text-navy">
                      {formatApproxINR(estimate.annualLow, true)} –{" "}
                      {formatApproxINR(estimate.annualHigh, true)}
                      <span className="text-sm font-normal text-slate">
                        {" "}
                        / year
                      </span>
                    </p>
                    <p className="mt-1 text-sm text-slate">
                      approx. {formatApproxINR(estimate.monthlyLow)} –{" "}
                      {formatApproxINR(estimate.monthlyHigh)} / month
                    </p>
                    {estimate.priceAsSalaryPct != null ? (
                      <div className="mt-3 rounded-lg bg-teal-soft px-3 py-3">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-navy/55">
                          Affordability
                        </p>
                        <p className="display-num mt-0.5 text-3xl font-semibold text-navy">
                          {estimate.priceAsSalaryPct}%
                        </p>
                        <p className="text-xs text-navy/70">
                          of your monthly salary
                        </p>
                      </div>
                    ) : null}
                  </>
                )}
                <p className="mt-2 text-[11px] text-slate">
                  {PRICE_DISCLAIMER_SHORT}
                </p>
                {durationMonths === 6 ? (
                  <p className="mt-2 text-[11px] text-slate">
                    {EXTENDED_DURATION_DISCLAIMER}
                  </p>
                ) : null}
                <p className="mt-2 text-[10px] leading-relaxed text-slate/80">
                  {EMPLOYER_STABILITY_DISCLAIMER}
                </p>
                <p className="mt-1 text-[10px] leading-relaxed text-slate/80">
                  {PRICE_DISCLAIMER_FULL}
                </p>
              </div>

              <Button
                className="mt-5 w-full"
                onClick={() => {
                  track("early_access_clicked", {
                    surface: "mobile",
                    ...estimateAnalyticsProps(estimate, {
                      plan: selectedTier,
                      coverage_percentage: tier.salaryPercent,
                      salary: salaryNum,
                      duration_months: durationMonths,
                    }),
                  });
                  scrollTo("waitlist");
                }}
              >
                Get Early Access
              </Button>
            </div>
          </div>
        ) : null}
      </Container>
    </section>
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
      <div className="mt-1.5 flex items-center rounded-lg border border-border bg-paper focus-within:ring-2 focus-within:ring-navy/30">
        <span className="pl-3 text-sm text-slate">₹</span>
        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          className="display-num min-h-11 w-full bg-transparent px-2 py-2.5 text-base outline-none"
          value={value}
          onChange={(e) => onChange(e.target.value.replace(/[^\d]/g, ""))}
          placeholder="0"
        />
      </div>
    </label>
  );
}
