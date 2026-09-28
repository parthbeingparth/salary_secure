"use client";

import Link from "next/link";
import { emiBurdenStat } from "@/data/marketStats";
import { track } from "@/lib/analytics";
import { Container } from "@/components/ui/Layout";
import { ChapterLabel } from "./MobileUi";

export function MobileProblem() {
  return (
    <section id="why-salary-secure" className="section-dark !py-12">
      <Container>
        <ChapterLabel n="01" label="WHY" dark />
        <h2 className="headline-lg text-paper">
          A layoff stops your salary.
          <br />
          Your obligations don&apos;t.
        </h2>

        <div className="mt-8 -mx-1 flex snap-x-mandatory gap-3 overflow-x-auto px-1 pb-2 scrollbar-none">
          <article className="snap-start w-[78%] shrink-0 rounded-xl border border-white/10 bg-white/[0.05] p-4">
            <p className="serif-accent display-num text-4xl text-paper">
              128K+
            </p>
            <p className="mt-2 text-sm leading-snug text-paper/65">
              reported global tech layoffs in 2026
            </p>
          </article>
          <article className="snap-start w-[78%] shrink-0 rounded-xl border border-white/10 bg-white/[0.05] p-4">
            <p className="serif-accent display-num text-4xl text-paper">
              {emiBurdenStat.displayValue}
            </p>
            <p className="mt-2 text-sm leading-snug text-paper/65">
              of monthly income goes toward EMIs among earning individuals in
              the referenced study
            </p>
          </article>
        </div>
        <p className="mt-2 text-[11px] text-paper/40">Swipe for more →</p>

        <p className="mt-8 text-lg font-medium leading-snug text-paper">
          Rent. EMIs. Family. Bills.
          <br />
          They don&apos;t wait for your next job.
        </p>

        <p className="mt-6 text-sm">
          <Link
            href="/methodology"
            className="text-paper/55 underline-offset-2 hover:text-paper hover:underline"
            onClick={() =>
              track("source_clicked", { source: "methodology_mobile" })
            }
          >
            View sources &amp; methodology →
          </Link>
        </p>
      </Container>
    </section>
  );
}
