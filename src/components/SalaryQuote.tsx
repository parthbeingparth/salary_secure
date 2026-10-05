"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  coverageTiers,
  MAX_MONTHLY_PROTECTION,
  SALARY_SLIDER,
  type CoverageTierId,
} from "@/data/plans";
import {
  PRICE_DISCLAIMER_SHORT,
  PROTECTION_DURATIONS,
  computeProtectionEstimate,
  estimateAnalyticsProps,
  formatApproxINR,
  type ProtectionDurationMonths,
} from "@/data/pricingConfig";
import { formatINR } from "@/lib/format";
import { track } from "@/lib/analytics";
import { Button } from "@/components/ui/Button";
import { useApp } from "@/components/AppProviders";

type Props = {
  variant?: "desktop" | "mobile";
};

export function SalaryQuote({ variant = "desktop" }: Props) {
  const {
    setCalculatorCompleted,
    selectedTier,
    setSelectedTier,
    durationMonths,
    setDurationMonths,
    setLastEstimate,
    scrollTo,
  } = useApp();

  const [salary, setSalary] = useState<number>(SALARY_SLIDER.defaultValue);
  const startedRef = useRef(false);
  const completedTracked = useRef(false);
  const lastPriceKey = useRef<string | null>(null);

  const tier = coverageTiers.find((t) => t.id === selectedTier)!;

  const estimate = useMemo(
    () =>
      computeProtectionEstimate({
        monthlyTakeHome: salary,
        salaryPercent: tier.salaryPercent,
        monthlyCap: tier.monthlyCap,
        tierId: tier.id,
        durationMonths,
      }),
    [salary, tier, durationMonths],
  );

  function markStarted() {
    if (startedRef.current) return;
    startedRef.current = true;
    track("runway_calculator_started", { surface: variant });
  }

  function onSalaryChange(value: number) {
    markStarted();
    setSalary(value);
  }

  useEffect(() => {
    setLastEstimate(estimate);
  }, [estimate, setLastEstimate]);

  useEffect(() => {
    if (!startedRef.current) return;
    setCalculatorCompleted(true);
    if (completedTracked.current) return;
    completedTracked.current = true;
    track("runway_calculator_completed", {
      surface: variant,
      ...estimateAnalyticsProps(estimate, {
        plan: selectedTier,
        coverage_percentage: tier.salaryPercent,
        salary,
        duration_months: durationMonths,
      }),
    });
  }, [
    estimate,
    selectedTier,
    tier.salaryPercent,
    salary,
    durationMonths,
    setCalculatorCompleted,
    variant,
  ]);

  useEffect(() => {
    if (estimate.estimatedAnnualCost <= 0) return;
    const key = `${selectedTier}:${durationMonths}:${estimate.estimatedAnnualCost}:${salary}`;
    if (lastPriceKey.current === key) return;
    lastPriceKey.current = key;
    track("estimated_price_displayed", {
      surface: variant,
      ...estimateAnalyticsProps(estimate, {
        plan: selectedTier,
        coverage_percentage: tier.salaryPercent,
        salary,
        duration_months: durationMonths,
      }),
    });
  }, [
    estimate,
    selectedTier,
    durationMonths,
    tier.salaryPercent,
    salary,
    variant,
  ]);

  const fillPct =
    ((salary - SALARY_SLIDER.min) /
      (SALARY_SLIDER.max - SALARY_SLIDER.min)) *
    100;
  const capMarkerPct =
    ((MAX_MONTHLY_PROTECTION - SALARY_SLIDER.min) /
      (SALARY_SLIDER.max - SALARY_SLIDER.min)) *
    100;
  const coverAtCap = estimate.monthlyProtection >= MAX_MONTHLY_PROTECTION;
  const salaryPastCap = salary > MAX_MONTHLY_PROTECTION;

  const controls = (
    <div className="space-y-7">
      <div>
        <div className="flex items-end justify-between gap-3">
          <label htmlFor="salary-slider" className="text-[13px] font-medium text-graphite">
            Monthly take-home
          </label>
          <p className="display-num text-xl font-semibold text-navy">
            {formatINR(salary)}
          </p>
        </div>
        <div className="relative mt-4">
          <input
            id="salary-slider"
            type="range"
            min={SALARY_SLIDER.min}
            max={SALARY_SLIDER.max}
            step={SALARY_SLIDER.step}
            value={salary}
            aria-valuemin={SALARY_SLIDER.min}
            aria-valuemax={SALARY_SLIDER.max}
            aria-valuenow={salary}
            aria-valuetext={formatINR(salary)}
            className="salary-slider w-full"
            style={{
              background: `linear-gradient(to right, var(--navy) ${fillPct}%, var(--border) ${fillPct}%)`,
            }}
            onChange={(e) => onSalaryChange(Number(e.target.value))}
          />
          <div
            className="pointer-events-none absolute top-full mt-1 -translate-x-1/2"
            style={{ left: `${capMarkerPct}%` }}
          >
            <span className="block h-1.5 w-px bg-slate/50 mx-auto" aria-hidden />
            <span className="mt-0.5 block whitespace-nowrap text-[10px] font-medium text-slate">
              ₹2.5L
            </span>
          </div>
        </div>
        <div className="mt-5 flex justify-between text-[11px] text-slate">
          <span>{formatINR(SALARY_SLIDER.min, true)}</span>
          <span>{formatINR(SALARY_SLIDER.max, true)}</span>
        </div>
        {salaryPastCap || coverAtCap ? (
          <p className="mt-2 text-[12px] leading-relaxed text-navy/80">
            You can slide higher — proposed cover still tops out at{" "}
            <span className="font-semibold">₹2.5L/month</span>
            {tier.salaryPercent < 100
              ? ` (${tier.salaryPercent}% of take-home, up to that limit)`
              : ""}
            .
          </p>
        ) : (
          <p className="mt-2 text-[12px] text-slate">
            Proposed cover is up to ₹2.5L/month.
          </p>
        )}
      </div>

      <div>
        <p className="text-[13px] font-medium text-graphite">
          How much of your salary?
        </p>
        <div className="mt-2 flex rounded-lg border border-border p-1">
          {coverageTiers.map((t) => (
            <button
              key={t.id}
              type="button"
              className={`min-h-11 flex-1 rounded-md px-2 text-sm font-semibold transition ${
                selectedTier === t.id
                  ? "bg-navy text-paper"
                  : "text-slate hover:text-graphite"
              }`}
              onClick={() => {
                markStarted();
                setSelectedTier(t.id as CoverageTierId);
              }}
            >
              {t.salaryPercent}%
            </button>
          ))}
        </div>
        <p className="mt-2 text-[12px] text-slate">
          {tier.name} · {tier.salaryPercent}% of take-home
        </p>
      </div>

      <div>
        <p className="text-[13px] font-medium text-graphite">For how long?</p>
        <div className="mt-2 flex rounded-lg border border-border p-1">
          {PROTECTION_DURATIONS.map((d) => (
            <button
              key={d.months}
              type="button"
              className={`min-h-11 flex-1 rounded-md px-2 text-sm font-semibold transition ${
                durationMonths === d.months
                  ? "bg-navy text-paper"
                  : "text-slate hover:text-graphite"
              }`}
              onClick={() => {
                markStarted();
                setDurationMonths(d.months as ProtectionDurationMonths);
              }}
            >
              {d.label}
            </button>
          ))}
        </div>
        <p className="mt-2 text-[12px] text-slate">
          {durationMonths} months of salary insurance after an eligible layoff
        </p>
      </div>
    </div>
  );

  const result = (
    <div
      className={`rounded-[var(--radius)] bg-navy p-6 text-[#FCFBF7] md:p-8 ${
        variant === "desktop" ? "lg:sticky lg:top-24" : "mb-8"
      }`}
    >
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/50">
        You pay annually
      </p>
      <p className="display-num mt-4 text-[2.4rem] font-semibold leading-none tracking-tight text-white sm:text-5xl">
        {formatApproxINR(estimate.estimatedAnnualCost)}
      </p>
      <p className="mt-2 text-sm text-white/60">
        for {tier.salaryPercent}% salary cover · {durationMonths} months
        {coverAtCap ? " · max ₹2.5L/mo" : ""}
      </p>
      <p className="mt-5 text-[12px] leading-relaxed text-white/40">
        {PRICE_DISCLAIMER_SHORT}
      </p>
      <Button
        variant="onDark"
        className="mt-6 w-full"
        onClick={() => {
          track("early_access_clicked", {
            surface: variant,
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
    </div>
  );

  return (
    <div>
      <div className="max-w-xl">
        <h2 className="headline-lg text-graphite">
          Estimate your salary insurance
        </h2>
        <p className="mt-2 text-[16px] text-slate">
          Slide your salary. Keep 100% for 3 months, or switch to 50%, 75%, or 6
          months. We&apos;ll show the annual amount you&apos;d pay.
        </p>
      </div>

      {variant === "desktop" ? (
        <div className="mt-8 grid items-start gap-8 lg:grid-cols-2 lg:gap-10">
          {controls}
          {result}
        </div>
      ) : (
        <div className="mt-6 space-y-6">
          {controls}
          {result}
        </div>
      )}
    </div>
  );
}
