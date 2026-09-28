"use client";

import Link from "next/link";
import {
  globalTechLayoffs2026,
  indiaTechLayoffs2026,
  reportedLayoffsPerDay,
} from "@/data/marketStats";
import { formatAsOfDate } from "@/lib/format";
import { track } from "@/lib/analytics";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { InfoTooltip } from "@/components/ui/InfoTooltip";
import { Section } from "@/components/ui/Layout";

export function LayoffPulse() {
  const perDay = reportedLayoffsPerDay(globalTechLayoffs2026);

  return (
    <Section id="why-salary-secure" dark className="!py-16 md:!py-24">
      <p className="eyebrow text-center">The new employment reality</p>
      <h2 className="headline-lg mx-auto mt-4 max-w-3xl text-center text-paper">
        Tech careers move fast.
        <br />
        Financial obligations don&apos;t.
      </h2>

      <div className="mx-auto mt-12 max-w-3xl text-center">
        <p className="serif-accent display-num text-[clamp(3.5rem,12vw,7rem)] leading-none text-paper">
          <AnimatedCounter value={globalTechLayoffs2026.value} />
        </p>
        <p className="mt-4 text-base text-paper/70 md:text-lg">
          {globalTechLayoffs2026.label}
        </p>
        <p className="mt-3 text-sm text-paper/50">
          As of {formatAsOfDate(globalTechLayoffs2026.asOfDate)} · Source:{" "}
          <a
            href={globalTechLayoffs2026.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-paper/80 underline-offset-2 hover:underline"
            onClick={() =>
              track("source_clicked", {
                source: globalTechLayoffs2026.sourceName,
              })
            }
          >
            {globalTechLayoffs2026.sourceName}
          </a>
        </p>
        <p className="mt-4 inline-flex items-center justify-center gap-1 text-xs text-paper/45">
          Estimated YTD pace — not a real-time layoff feed.
          <InfoTooltip label="How pace is calculated">
            Calculated as reported YTD layoffs divided by elapsed days in the
            dataset window. Not a live feed.
          </InfoTooltip>
        </p>
      </div>

      <div className="mt-12 grid gap-3 md:grid-cols-3">
        <DataCard
          label="Reported tech layoffs"
          value={globalTechLayoffs2026.displayValue}
        />
        <DataCard
          label="Average reported pace"
          value={`~${perDay.toLocaleString("en-IN")} / day`}
        />
        <DataCard
          label="India tech layoff events"
          value="25 tracked*"
          footnote={`*${indiaTechLayoffs2026.displayValue} people across events via ${indiaTechLayoffs2026.sourceName}, as of ${formatAsOfDate(indiaTechLayoffs2026.asOfDate)}. Trackers may not capture every job loss.`}
          sourceUrl={indiaTechLayoffs2026.sourceUrl}
          sourceName={indiaTechLayoffs2026.sourceName}
        />
      </div>

      <p className="mt-8 text-center text-sm">
        <Link
          href="/methodology"
          className="text-paper/60 underline-offset-4 hover:text-paper hover:underline"
        >
          View methodology →
        </Link>
      </p>
    </Section>
  );
}

function DataCard({
  label,
  value,
  footnote,
  sourceUrl,
  sourceName,
}: {
  label: string;
  value: string;
  footnote?: string;
  sourceUrl?: string;
  sourceName?: string;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.04] p-5">
      <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-paper/45">
        {label}
      </p>
      <p className="display-num mt-3 text-2xl font-semibold text-paper md:text-3xl">
        {value}
      </p>
      {footnote ? (
        <p className="mt-3 text-[11px] leading-relaxed text-paper/40">
          {footnote}{" "}
          {sourceUrl ? (
            <a
              href={sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="underline-offset-2 hover:underline"
              onClick={() =>
                track("source_clicked", { source: sourceName ?? "source" })
              }
            >
              Source
            </a>
          ) : null}
        </p>
      ) : null}
    </div>
  );
}
