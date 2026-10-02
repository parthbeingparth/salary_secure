"use client";

import { brand } from "@/lib/brand";
import { formatINR } from "@/lib/format";
import { HERO_EXAMPLE_SALARY } from "@/data/plans";
import { track } from "@/lib/analytics";
import { Button } from "@/components/ui/Button";
import { Section } from "@/components/ui/Layout";
import { useApp } from "@/components/AppProviders";

const EXAMPLE_CURRENT = 2.8;
const EXAMPLE_WITH = 5.8;
const EXAMPLE_MONTHLY = HERO_EXAMPLE_SALARY;
const EXAMPLE_PERIOD = 3;
const EXAMPLE_TOTAL = EXAMPLE_MONTHLY * EXAMPLE_PERIOD;

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
              Up to ₹2.5 lakh/month · Up to 3 months after an eligible layoff
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
                {formatINR(EXAMPLE_MONTHLY)}
              </dd>
            </div>
            <div className="flex items-baseline justify-between gap-4 border-b border-border pb-3">
              <dt className="text-sm text-slate">Proposed monthly protection</dt>
              <dd className="display-num text-lg font-semibold text-navy">
                {formatINR(EXAMPLE_MONTHLY)}
                <span className="text-sm font-normal text-slate"> / month</span>
              </dd>
            </div>
            <div className="flex items-baseline justify-between gap-4 border-b border-border pb-3">
              <dt className="text-sm text-slate">Coverage period</dt>
              <dd className="display-num text-lg font-semibold text-graphite">
                {EXAMPLE_PERIOD} months
              </dd>
            </div>
            <div className="flex items-baseline justify-between gap-4">
              <dt className="text-sm text-slate">Potential total protection</dt>
              <dd className="display-num text-xl font-semibold text-graphite">
                {formatINR(EXAMPLE_TOTAL)}
              </dd>
            </div>
          </dl>

          <div className="mt-8 space-y-4 rounded-xl bg-ivory/80 p-4">
            <RunwayBar
              label="Current financial runway"
              months={EXAMPLE_CURRENT}
              max={6}
              tone="muted"
            />
            <RunwayBar
              label="With Salary Secure"
              months={EXAMPLE_WITH}
              max={6}
              tone="accent"
            />
          </div>

          <p className="mt-4 text-center text-[11px] text-slate">
            Illustrative example only.
          </p>
        </div>
      </div>
    </Section>
  );
}

function RunwayBar({
  label,
  months,
  max,
  tone,
}: {
  label: string;
  months: number;
  max: number;
  tone: "muted" | "accent";
}) {
  const pct = Math.min(100, (months / max) * 100);
  return (
    <div>
      <div className="flex items-baseline justify-between text-xs">
        <span className="uppercase tracking-[0.12em] text-slate">{label}</span>
        <span className="display-num font-semibold text-graphite">
          {months} months
        </span>
      </div>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-border">
        <div
          className={`h-full rounded-full transition-all duration-700 ${
            tone === "accent" ? "bg-navy" : "bg-slate/40"
          }`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
