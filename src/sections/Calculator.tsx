"use client";

import { useMemo, useRef, useState } from "react";
import {
  coverageTiers,
  eligibleMonthlyProtection,
  type CoverageTierId,
} from "@/data/plans";
import { formatINR } from "@/lib/format";
import { track } from "@/lib/analytics";
import { Button } from "@/components/ui/Button";
import { Card, Section } from "@/components/ui/Layout";
import { useApp } from "@/components/AppProviders";

type Fields = {
  salary: string;
  emis: string;
  housing: string;
  essentials: string;
  savings: string;
  severance: string;
};

function toNum(v: string) {
  const n = Number(String(v).replace(/,/g, ""));
  return Number.isFinite(n) ? n : 0;
}

export function Calculator() {
  const {
    setCalculatorCompleted,
    scrollTo,
    selectedTier,
    setSelectedTier,
  } = useApp();
  const [started, setStarted] = useState(false);
  const completedTracked = useRef(false);
  const [fields, setFields] = useState<Fields>({
    salary: "180000",
    emis: "45000",
    housing: "25000",
    essentials: "35000",
    savings: "280000",
    severance: "",
  });

  const obligations = useMemo(
    () =>
      toNum(fields.emis) + toNum(fields.housing) + toNum(fields.essentials),
    [fields],
  );

  const runwayMonths = useMemo(() => {
    if (obligations <= 0) return null;
    return (toNum(fields.savings) + toNum(fields.severance)) / obligations;
  }, [fields, obligations]);

  const tier = coverageTiers.find((t) => t.id === selectedTier)!;
  const salary = toNum(fields.salary);
  const monthlyProtection = eligibleMonthlyProtection(salary, tier);
  const bufferedMonths =
    obligations > 0 ? monthlyProtection / obligations : 0;
  const withRunway =
    runwayMonths == null ? null : runwayMonths + bufferedMonths;
  const totalBuffer = monthlyProtection * tier.durationMonths;

  function markCompletedIfReady(nextFields: Fields) {
    const nextObligations =
      toNum(nextFields.emis) +
      toNum(nextFields.housing) +
      toNum(nextFields.essentials);
    if (nextObligations <= 0) return;
    const months =
      (toNum(nextFields.savings) + toNum(nextFields.severance)) /
      nextObligations;
    if (!Number.isFinite(months)) return;
    setCalculatorCompleted(true);
    if (!completedTracked.current) {
      completedTracked.current = true;
      track("runway_calculator_completed", {
        runway_months: Math.round(months * 10) / 10,
        obligations: nextObligations,
      });
    }
  }

  function update(key: keyof Fields, value: string) {
    if (!started) {
      setStarted(true);
      track("runway_calculator_started");
    }
    const next = { ...fields, [key]: value };
    setFields(next);
    markCompletedIfReady(next);
  }

  const inputs: { key: keyof Fields; label: string; optional?: boolean }[] = [
    { key: "salary", label: "Monthly take-home" },
    { key: "emis", label: "Monthly EMIs" },
    { key: "housing", label: "Housing" },
    { key: "essentials", label: "Essential expenses" },
    { key: "savings", label: "Liquid savings" },
    { key: "severance", label: "Expected severance", optional: true },
  ];

  return (
    <Section id="calculator" className="bg-paper">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="headline-lg text-graphite">
          How secure is your financial runway?
        </h2>
        <p className="mt-3 text-[17px] text-slate">
          If your next salary didn&apos;t arrive, how long could your current
          savings support your essential expenses?
        </p>
      </div>

      <div className="mt-12 grid gap-6 lg:grid-cols-2">
        <Card className="bg-ivory/40">
          <div className="space-y-4">
            {inputs.map((input) => (
              <label key={input.key} className="block">
                <span className="text-[13px] font-medium text-graphite">
                  {input.label}
                  {input.optional ? (
                    <span className="font-normal text-slate"> (optional)</span>
                  ) : null}
                </span>
                <div className="mt-1.5 flex items-center rounded-lg border border-border bg-paper focus-within:ring-2 focus-within:ring-navy/30">
                  <span className="pl-3 text-sm text-slate">₹</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    className="display-num min-h-11 w-full bg-transparent px-2 py-2 text-base outline-none"
                    value={fields[input.key]}
                    onChange={(e) =>
                      update(input.key, e.target.value.replace(/[^\d]/g, ""))
                    }
                    placeholder="0"
                  />
                </div>
              </label>
            ))}
          </div>

          <div className="mt-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate">
              Proposed protection concept
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {coverageTiers.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  className={`min-h-10 rounded-lg border px-3 py-2 text-xs font-semibold tracking-[0.08em] transition ${
                    selectedTier === t.id
                      ? "border-navy bg-navy text-paper"
                      : "border-border bg-paper text-slate hover:border-navy/30"
                  }`}
                  onClick={() => setSelectedTier(t.id as CoverageTierId)}
                >
                  {t.name}
                </button>
              ))}
            </div>
          </div>
        </Card>

        <div className="space-y-4">
          <div className="rounded-[var(--radius)] border border-navy bg-navy p-4 text-[#FCFBF7] shadow-[0_1px_1px_rgba(7,26,43,0.03)] md:p-6">
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/55">
              Your current runway
            </p>
            <p className="serif-accent display-num mt-2 text-6xl leading-none text-white">
              {runwayMonths == null
                ? "—"
                : (Math.round(runwayMonths * 10) / 10).toFixed(1)}
            </p>
            <p className="mt-2 text-sm uppercase tracking-[0.14em] text-white/60">
              Months
            </p>

            <div className="mt-8 border-t border-white/15 pt-6">
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/55">
                With Salary Secure
              </p>
              <p className="serif-accent display-num mt-2 text-5xl leading-none text-[#9ED4CC]">
                {withRunway == null
                  ? "—"
                  : (Math.round(withRunway * 10) / 10).toFixed(1)}
              </p>
              <p className="mt-2 text-sm uppercase tracking-[0.14em] text-white/60">
                Months runway
              </p>
            </div>

            <div className="mt-6 h-2 overflow-hidden rounded-full bg-white/15">
              <div
                className="h-full rounded-full bg-white/85 transition-all duration-500"
                style={{
                  width:
                    withRunway == null
                      ? "0%"
                      : `${Math.min(100, (withRunway / 12) * 100)}%`,
                }}
              />
            </div>
          </div>

          <Card>
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate">
              Potential monthly protection
            </p>
            <p className="display-num mt-2 text-xl font-semibold text-graphite">
              {formatINR(monthlyProtection)}
              <span className="text-sm font-normal text-slate">/month</span>
            </p>
            <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate">
              Protection period
            </p>
            <p className="mt-1 text-sm text-graphite">
              {tier.durationMonths} months · {tier.name}
            </p>
            <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate">
              Potential total protection
            </p>
            <p className="display-num mt-1 text-3xl font-semibold text-navy">
              {formatINR(totalBuffer)}
            </p>
            <p className="mt-2 text-xs text-slate">
              Proposed coverage · Subject to eligibility and insurer approval.
              Never more than eligible monthly take-home within plan caps.
            </p>
            <Button className="mt-5 w-full sm:w-auto" onClick={() => scrollTo("plans")}>
              See My Protection Options
            </Button>
          </Card>
        </div>
      </div>
    </Section>
  );
}
