"use client";

import { brand } from "@/lib/brand";
import { formatINR } from "@/lib/format";
import { HERO_EXAMPLE_SALARY } from "@/data/plans";
import { track } from "@/lib/analytics";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Layout";
import { useApp } from "@/components/AppProviders";

const EXAMPLE_MONTHLY = HERO_EXAMPLE_SALARY;
const EXAMPLE_PERIOD = 3;
const EXAMPLE_TOTAL = EXAMPLE_MONTHLY * EXAMPLE_PERIOD;

export function MobileHero() {
  const { scrollTo } = useApp();

  return (
    <section className="bg-paper pb-10 pt-6">
      <Container>
        <p className="text-[11px] font-semibold tracking-[0.2em] text-graphite">
          <span className="text-slate">{brand.nameLines[0]}</span>{" "}
          <span className="text-navy-light">{brand.nameLines[1]}</span>
        </p>

        <h1 className="headline-xl mt-4 text-graphite">
          Your salary stops.
          <br />
          Your backup starts.
        </h1>

        <p className="mt-4 max-w-sm text-[16px] leading-relaxed text-slate">
          Income protection being designed for India&apos;s tech workforce.
        </p>

        <ul className="mt-5 flex flex-wrap gap-x-3 gap-y-1 text-[13px] text-graphite">
          <li>Up to 100% of salary</li>
          <li className="text-border" aria-hidden>
            ·
          </li>
          <li>Up to ₹2.5L/month</li>
          <li className="text-border" aria-hidden>
            ·
          </li>
          <li>Up to 3 months</li>
        </ul>

        <div className="mt-6">
          <Button
            className="w-full"
            onClick={() => {
              track("hero_cta_clicked", {
                cta: "check_my_protection",
                surface: "mobile",
              });
              scrollTo("calculator");
            }}
          >
            Check My Protection
          </Button>
          <button
            type="button"
            className="mt-3 w-full py-2 text-center text-sm text-navy-light underline-offset-2 hover:underline"
            onClick={() => scrollTo("how-it-works")}
          >
            How does this work?
          </button>
        </div>

        <div className="mt-6 rounded-xl border border-border bg-ivory/80 px-4 py-4">
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate">
            Illustrative example
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-graphite">
            <span className="display-num font-semibold">
              {formatINR(EXAMPLE_MONTHLY, true)} salary
            </span>
            <span className="text-slate/50" aria-hidden>
              →
            </span>
            <span className="display-num font-semibold text-navy">
              {formatINR(EXAMPLE_MONTHLY, true)}/mo
            </span>
            <span className="text-slate/50" aria-hidden>
              →
            </span>
            <span className="display-num font-medium">{EXAMPLE_PERIOD} months</span>
            <span className="text-slate/50" aria-hidden>
              →
            </span>
            <span className="display-num font-semibold">
              {formatINR(EXAMPLE_TOTAL, true)} total
            </span>
          </div>
          <p className="mt-2 text-[11px] text-slate">
            Proposed coverage · Not a quote
          </p>
        </div>
      </Container>
    </section>
  );
}
