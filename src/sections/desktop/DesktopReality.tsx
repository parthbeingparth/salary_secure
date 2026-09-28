"use client";

import { brand } from "@/lib/brand";
import { emiBurdenStat } from "@/data/marketStats";
import { formatINR } from "@/lib/format";
import { track } from "@/lib/analytics";
import { Section } from "@/components/ui/Layout";

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

/** Chapter 2: problem + financial reality + compact Salary Secure reveal. */
export function DesktopReality() {
  return (
    <Section id="why-salary-secure" className="bg-paper !py-14 md:!py-16">
      <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-14">
        <div>
          <h2 className="headline-lg text-graphite">
            A layoff stops your salary.
            <br />
            Your obligations don&apos;t.
          </h2>
          <p className="serif-accent display-num mt-8 text-[clamp(3rem,8vw,4.5rem)] leading-none text-navy">
            {emiBurdenStat.displayValue}
          </p>
          <p className="mt-3 max-w-md text-[15px] leading-relaxed text-slate">
            of monthly income goes toward loan EMIs among earning individuals in
            the referenced study.
          </p>
          <p className="mt-2 text-sm text-slate">
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
          </p>
          <p className="mt-8 text-lg font-medium leading-snug text-graphite">
            Rent. EMI. Family. Bills.
            <br />
            They don&apos;t wait for your next job.
          </p>
        </div>

        <div className="card bg-ivory/50 p-5 md:p-6">
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate">
            Monthly take-home
          </p>
          <p className="display-num mt-2 text-3xl font-semibold text-graphite">
            {formatINR(ILLUSTRATIVE_SALARY)}
          </p>
          <ul className="mt-5 space-y-2.5">
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
          <div className="mt-5 rounded-lg bg-navy px-4 py-3.5 text-[#FCFBF7]">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-white/55">
              Monthly committed cash flow
            </p>
            <p className="display-num mt-1 text-2xl font-semibold">
              {formatINR(ILLUSTRATIVE_TOTAL)}
            </p>
          </div>
          <p className="mt-4 text-center text-sm font-medium text-graphite">
            One salary. A lot depending on it.
          </p>
        </div>
      </div>

      <div className="mt-10 flex flex-col items-start justify-between gap-4 border-t border-border pt-8 sm:flex-row sm:items-center">
        <p className="max-w-xl text-[15px] leading-relaxed text-slate">
          You back up your files, phone, internet and power.
          <span className="mt-1 block font-medium text-graphite">
            What about your salary?
          </span>
        </p>
        <p className="text-[12px] font-semibold tracking-[0.2em] text-graphite">
          <span className="text-slate">{brand.nameLines[0]}</span>{" "}
          <span className="text-navy-light">{brand.nameLines[1]}</span>
        </p>
      </div>
    </Section>
  );
}
