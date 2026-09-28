"use client";

import { emiBurdenStat, obligatorySpendStat } from "@/data/marketStats";
import { formatINR } from "@/lib/format";
import { track } from "@/lib/analytics";
import { Card, Section } from "@/components/ui/Layout";

const ILLUSTRATIVE_SALARY = 200000;
const ILLUSTRATIVE_LINES = [
  { label: "Home EMI", amount: 55000 },
  { label: "Car EMI", amount: 22000 },
  { label: "Rent / Maintenance", amount: 15000 },
  { label: "Family", amount: 20000 },
  { label: "Living expenses", amount: 40000 },
  { label: "Investments / Insurance", amount: 20000 },
] as const;

const ILLUSTRATIVE_TOTAL = ILLUSTRATIVE_LINES.reduce(
  (sum, row) => sum + row.amount,
  0,
);

export function FinancialReality() {
  return (
    <Section className="bg-ivory">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="headline-lg text-graphite">
          A layoff stops your salary.
          <br />
          Your obligations don&apos;t.
        </h2>
      </div>

      <div className="mx-auto mt-12 max-w-2xl text-center">
        <p className="serif-accent display-num text-[clamp(3.5rem,10vw,6rem)] leading-none text-navy">
          {emiBurdenStat.displayValue}
        </p>
        <p className="mx-auto mt-4 max-w-xl text-[17px] leading-relaxed text-slate">
          of monthly income goes toward loan EMIs among earning individuals in
          the referenced PwC India + Perfios study.
        </p>
        <p className="mt-3 text-sm text-slate">
          <a
            href={emiBurdenStat.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-navy-light underline-offset-2 hover:underline"
            onClick={() =>
              track("source_clicked", { source: emiBurdenStat.sourceName })
            }
          >
            Source: {emiBurdenStat.sourceName}
          </a>
          {" · "}
          Obligatory spending {obligatorySpendStat.displayValue} in the same
          study.
        </p>
      </div>

      <Card className="mx-auto mt-14 max-w-lg bg-paper">
        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate">
          Monthly take-home
        </p>
        <p className="display-num mt-2 text-3xl font-semibold text-graphite">
          {formatINR(ILLUSTRATIVE_SALARY)}
        </p>

        <div className="my-5 flex justify-center text-slate/40" aria-hidden>
          ↓
        </div>

        <ul className="space-y-3">
          {ILLUSTRATIVE_LINES.map((row) => (
            <li
              key={row.label}
              className="flex items-baseline justify-between gap-4 border-b border-border/70 pb-2 text-sm last:border-0"
            >
              <span className="text-slate">{row.label}</span>
              <span className="display-num font-medium text-graphite">
                {formatINR(row.amount)}
              </span>
            </li>
          ))}
        </ul>

        <div className="my-5 flex justify-center text-slate/40" aria-hidden>
          ↓
        </div>

        <div className="rounded-lg bg-navy px-4 py-4 text-paper">
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-paper/55">
            Monthly committed cash flow
          </p>
          <p className="display-num mt-1 text-2xl font-semibold">
            {formatINR(ILLUSTRATIVE_TOTAL)}
          </p>
        </div>

        <p className="mt-6 text-center text-base font-medium text-graphite">
          One salary.
          <br />A lot depending on it.
        </p>
        <p className="mt-4 text-center text-sm text-slate">
          Salary Secure is designed to protect the income that keeps those
          obligations moving.
        </p>
        <p className="mt-3 text-center text-xs text-slate">
          Illustrative household example — not an average. Proposed product
          language — not an offer.
        </p>
      </Card>
    </Section>
  );
}
