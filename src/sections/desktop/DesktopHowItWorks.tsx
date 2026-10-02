"use client";

import { useState } from "react";
import { brand } from "@/lib/brand";
import {
  potentialEligibility,
  proposedCoveredEvents,
  TERMS_SUBJECT_TO_APPROVAL,
} from "@/data/eligibility";
import { Section } from "@/components/ui/Layout";

const steps = [
  {
    n: "01",
    title: "Join while employed",
    body: "Enroll before a layoff is known or expected.",
  },
  {
    n: "02",
    title: "Choose protection",
    body: "Select how much income you want protected.",
  },
  {
    n: "03",
    title: "Eligible layoff",
    body: "Employment and circumstances are verified.",
  },
  {
    n: "04",
    title: "Backup starts",
    body: "Receive eligible monthly protection.",
  },
] as const;

type Tab = "covered" | "excluded" | "eligibility";

/** How it works + eligibility — one timeline, one qualify card. */
export function DesktopHowItWorks() {
  const [tab, setTab] = useState<Tab>("covered");

  const lists: Record<Tab, readonly string[]> = {
    covered: proposedCoveredEvents.slice(0, 5),
    excluded: [
      "Voluntary resignation",
      "Misconduct",
      "Performance termination",
      "Contract expiry",
      "Known upcoming termination",
    ],
    eligibility: potentialEligibility,
  };

  return (
    <Section id="how-it-works" dark className="!py-12 md:!py-16">
      <div className="mx-auto max-w-[1200px]">
        <div className="grid items-stretch gap-8 lg:grid-cols-[minmax(0,0.42fr)_minmax(0,0.58fr)] lg:gap-10">
          {/* LEFT — timeline */}
          <div className="flex flex-col">
            <p className="eyebrow">How it works</p>
            <h2 className="headline-lg mt-2 text-paper">
              Simple when it matters.
            </h2>
            <p className="mt-2.5 max-w-md text-[16px] leading-relaxed text-paper/70">
              {brand.shortName} is exploring salary insurance — proposed income
              protection after an eligible involuntary layoff.
            </p>

            <ol className="mt-6 space-y-0">
              {steps.map((step, i) => (
                <li key={step.n} className="relative flex gap-4 pb-5 last:pb-0">
                  {i < steps.length - 1 ? (
                    <span
                      className="absolute left-[15px] top-8 h-[calc(100%-1.25rem)] w-px bg-white/15"
                      aria-hidden
                    />
                  ) : null}
                  <span className="display-num relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/20 bg-navy text-[11px] font-semibold text-paper">
                    {step.n}
                  </span>
                  <div className="pt-0.5">
                    <h3 className="text-[13px] font-semibold uppercase tracking-[0.08em] text-paper">
                      {step.title}
                    </h3>
                    <p className="mt-1 text-[15px] leading-snug text-paper/60">
                      {step.body}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
            <p className="mt-auto pt-5 text-xs text-paper/35">
              Proposed product flow. Final terms subject to insurer approval.
            </p>
          </div>

          {/* RIGHT — one qualify card */}
          <div
            id="coverage"
            className="flex flex-col rounded-[var(--radius)] border border-white/12 bg-white/[0.04] p-5 md:p-6 lg:min-h-full"
          >
            <h3 className="text-lg font-semibold text-paper">
              Would I qualify?
            </h3>
            <p className="mt-1.5 text-[15px] text-paper/60">
              Explore the proposed rules.
            </p>

            <div
              className="mt-5 flex gap-1 rounded-lg border border-white/12 p-1"
              role="tablist"
              aria-label="Coverage rules"
            >
              {(
                [
                  ["covered", "Covered"],
                  ["excluded", "Not Covered"],
                  ["eligibility", "Eligibility"],
                ] as const
              ).map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  role="tab"
                  aria-selected={tab === id}
                  className={`min-h-9 flex-1 rounded-md px-2 text-xs font-medium transition sm:text-sm ${
                    tab === id
                      ? "bg-paper text-navy"
                      : "text-paper/60 hover:text-paper"
                  }`}
                  onClick={() => setTab(id)}
                >
                  {label}
                </button>
              ))}
            </div>

            <ul className="mt-5 flex-1 space-y-0" role="tabpanel">
              {lists[tab].map((item) => (
                <li
                  key={item}
                  className="flex gap-3 border-b border-white/10 py-3 text-[15px] text-paper/85 last:border-0"
                >
                  <span
                    className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#9ED4CC]"
                    aria-hidden
                  />
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-5 text-xs text-paper/40">{TERMS_SUBJECT_TO_APPROVAL}</p>
          </div>
        </div>

        <p className="mx-auto mt-10 max-w-2xl text-center text-[17px] font-medium leading-relaxed text-paper/80 md:mt-12 md:text-lg">
          Three months of protection could mean three months to find the right
          job — not just the next one.
        </p>
      </div>
    </Section>
  );
}
