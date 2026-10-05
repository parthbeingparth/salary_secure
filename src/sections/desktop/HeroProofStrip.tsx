"use client";

import Link from "next/link";
import { emiBurdenStat, globalTechLayoffs2026 } from "@/data/marketStats";
import { track } from "@/lib/analytics";
import { Container } from "@/components/ui/Layout";

const proofs = [
  {
    value: "128K+",
    label: "reported global tech layoffs in 2026",
    source: globalTechLayoffs2026.sourceName,
    url: globalTechLayoffs2026.sourceUrl,
  },
  {
    value: emiBurdenStat.displayValue,
    label: "income toward EMIs in referenced study",
    source: emiBurdenStat.sourceName,
    url: emiBurdenStat.sourceUrl,
  },
  {
    value: "₹2.5L",
    label: "maximum proposed monthly protection",
  },
  {
    value: "3 or 6 months",
    label: "proposed protection period",
  },
] as const;

/** Compact horizontal proof band under the hero — not a full section. */
export function HeroProofStrip() {
  return (
    <div className="border-y border-border bg-ivory/70">
      <Container className="py-6 md:py-7">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {proofs.map((item) => (
            <div key={item.label} className="min-w-0">
              <p className="display-num text-2xl font-semibold text-navy md:text-[1.65rem]">
                {item.value}
              </p>
              <p className="mt-1 text-[13px] leading-snug text-slate">
                {item.label}
              </p>
              {"url" in item && item.url ? (
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 inline-block text-[11px] text-navy-light underline-offset-2 hover:underline"
                  onClick={() =>
                    track("source_clicked", { source: item.source })
                  }
                >
                  {item.source}
                </a>
              ) : null}
            </div>
          ))}
        </div>
        <p className="mt-4 text-right text-[12px]">
          <Link
            href="/methodology"
            className="text-slate underline-offset-2 hover:text-graphite hover:underline"
          >
            Sources &amp; methodology →
          </Link>
        </p>
      </Container>
    </div>
  );
}
