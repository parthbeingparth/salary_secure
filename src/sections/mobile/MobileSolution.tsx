"use client";

import { useState } from "react";
import { brand } from "@/lib/brand";
import {
  potentialEligibility,
  proposedCoveredEvents,
  TERMS_SUBJECT_TO_APPROVAL,
} from "@/data/eligibility";
import { Container } from "@/components/ui/Layout";
import { ChapterLabel } from "./MobileUi";

const steps = [
  {
    n: "01",
    title: "Join while employed",
    body: "Enroll before a layoff is known or expected.",
  },
  {
    n: "02",
    title: "Choose protection",
    body: "Select 50%, 75%, or 100% of salary for 3 or 6 months.",
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

export function MobileSolution() {
  const [tab, setTab] = useState<"covered" | "excluded" | "eligibility">(
    "covered",
  );

  const lists = {
    covered: proposedCoveredEvents.slice(0, 5),
    excluded: [
      "Voluntary resignation",
      "Misconduct",
      "Performance termination",
      "Contract expiry",
      "Known upcoming termination",
    ],
    eligibility: potentialEligibility,
  } as const;

  return (
    <section id="how-it-works" className="section-dark !py-12">
      <Container>
        <ChapterLabel n="03" label="HOW IT WORKS" dark />
        <h2 className="headline-lg text-paper">Simple when it matters.</h2>
        <p className="mt-2 text-[15px] text-paper/65">
          {brand.shortName} is exploring salary insurance — proposed income
          protection after an eligible involuntary layoff.
        </p>

        <ol className="mt-8 space-y-0">
          {steps.map((step, i) => (
            <li key={step.n} className="relative flex gap-4 pb-6 last:pb-0">
              {i < steps.length - 1 ? (
                <span
                  className="absolute left-[15px] top-8 h-[calc(100%-1rem)] w-px bg-white/15"
                  aria-hidden
                />
              ) : null}
              <span className="display-num relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/20 text-[11px] font-semibold text-paper">
                {step.n}
              </span>
              <div>
                <h3 className="text-[13px] font-semibold uppercase tracking-[0.06em] text-paper">
                  {step.title}
                </h3>
                <p className="mt-1 text-sm text-paper/55">{step.body}</p>
              </div>
            </li>
          ))}
        </ol>

        <div id="coverage" className="mt-8 rounded-xl border border-white/12 bg-white/[0.04] p-4">
          <h3 className="font-semibold text-paper">Would I qualify?</h3>
          <div className="mt-3 flex gap-1 rounded-lg border border-white/12 p-1">
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
                className={`min-h-8 flex-1 rounded-md px-1 text-[11px] font-medium ${
                  tab === id ? "bg-paper text-navy" : "text-paper/60"
                }`}
                onClick={() => setTab(id)}
              >
                {label}
              </button>
            ))}
          </div>
          <ul className="mt-3 space-y-2">
            {lists[tab].map((item) => (
              <li key={item} className="text-sm text-paper/80">
                {item}
              </li>
            ))}
          </ul>
          <p className="mt-3 text-[11px] text-paper/40">
            {TERMS_SUBJECT_TO_APPROVAL}
          </p>
        </div>

        <p className="mt-8 text-center text-[15px] font-medium leading-relaxed text-paper/75">
          A few months of salary insurance could mean time to find the right
          job — not just the next one.
        </p>
      </Container>
    </section>
  );
}
