"use client";

import { useState } from "react";
import { faqItems } from "@/data/faq";
import { brand } from "@/lib/brand";
import { Section } from "@/components/ui/Layout";
import { EarlyAccessCard } from "./EarlyAccessCard";

const PRIMARY_FAQS = [
  "What is Salary Secure?",
  "Is Salary Secure an insurance policy?",
  "What counts as a layoff?",
  "What does 100% salary protection mean?",
];

/** Early access (one conversion) + secondary FAQ. */
export function DesktopAccess() {
  const [faqOpen, setFaqOpen] = useState(false);
  const [openQ, setOpenQ] = useState<number | null>(null);

  const primaryFaqs = faqItems.filter((f) => PRIMARY_FAQS.includes(f.question));

  return (
    <>
      <Section id="waitlist" className="bg-paper !py-12 md:!py-16">
        <div className="mx-auto max-w-[1200px]">
          <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,0.45fr)_minmax(0,0.55fr)] lg:gap-12">
            <div>
              <p className="eyebrow">Early access</p>
              <h2 className="headline-lg mt-2 text-graphite">
                Help shape {brand.shortName}.
              </h2>
              <p className="mt-3 max-w-md text-[16px] leading-relaxed text-slate">
                We&apos;re validating what meaningful salary insurance should
                look like before taking the product to insurers.
              </p>
              <ul className="mt-6 space-y-2 text-sm text-slate">
                <li>No payment required</li>
                <li>No financial documents</li>
                <li>Privacy-first</li>
              </ul>
            </div>
            <EarlyAccessCard />
          </div>
        </div>
      </Section>

      <Section id="faq" className="bg-ivory !py-10 md:!py-12">
        <div className="mx-auto max-w-xl">
          <h2 className="text-lg font-semibold tracking-tight text-graphite">
            Questions?
          </h2>
          <div className="mt-4 divide-y divide-border border-y border-border">
            {primaryFaqs.map((item, i) => {
              const isOpen = openQ === i;
              return (
                <div key={item.question}>
                  <button
                    type="button"
                    className="flex w-full items-start justify-between gap-4 py-3.5 text-left"
                    aria-expanded={isOpen}
                    onClick={() => setOpenQ(isOpen ? null : i)}
                  >
                    <span className="text-sm font-medium text-graphite">
                      {item.question}
                    </span>
                    <span className="text-slate" aria-hidden>
                      {isOpen ? "−" : "+"}
                    </span>
                  </button>
                  {isOpen ? (
                    <p className="pb-3.5 text-sm leading-relaxed text-slate">
                      {item.answer}
                    </p>
                  ) : null}
                </div>
              );
            })}
          </div>
          <button
            type="button"
            className="mt-4 text-sm text-navy-light underline-offset-2 hover:underline"
            onClick={() => setFaqOpen(true)}
          >
            View all FAQs →
          </button>
        </div>
      </Section>

      {faqOpen ? <FaqModal onClose={() => setFaqOpen(false)} /> : null}
    </>
  );
}

function FaqModal({ onClose }: { onClose: () => void }) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-navy/40 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="all-faq-title"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-2xl overflow-auto rounded-xl border border-border bg-paper p-5 shadow-xl md:p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <h3
            id="all-faq-title"
            className="text-lg font-semibold text-graphite"
          >
            All FAQs
          </h3>
          <button
            type="button"
            className="text-slate hover:text-graphite"
            onClick={onClose}
            aria-label="Close"
          >
            ✕
          </button>
        </div>
        <div className="mt-4 divide-y divide-border">
          {faqItems.map((item, i) => {
            const isOpen = open === i;
            return (
              <div key={item.question}>
                <button
                  type="button"
                  className="flex w-full items-start justify-between gap-4 py-3.5 text-left"
                  aria-expanded={isOpen}
                  onClick={() => setOpen(isOpen ? null : i)}
                >
                  <span className="text-sm font-medium text-graphite">
                    {item.question}
                  </span>
                  <span className="text-slate" aria-hidden>
                    {isOpen ? "−" : "+"}
                  </span>
                </button>
                {isOpen ? (
                  <p className="pb-3.5 text-sm leading-relaxed text-slate">
                    {item.answer}
                  </p>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
