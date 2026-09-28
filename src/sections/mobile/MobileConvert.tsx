"use client";

import { useState } from "react";
import { faqItems } from "@/data/faq";
import { brand } from "@/lib/brand";
import { Container } from "@/components/ui/Layout";
import { EarlyAccessCard } from "@/sections/desktop/EarlyAccessCard";
import { AccordionItem, ChapterLabel } from "./MobileUi";

const PRIMARY_FAQS = [
  "What is Salary Secure?",
  "Is Salary Secure an insurance policy?",
  "What counts as a layoff?",
  "What does 100% salary protection mean?",
];

export function MobileConvert() {
  const [showAll, setShowAll] = useState(false);
  const primaryFaqs = faqItems.filter((f) => PRIMARY_FAQS.includes(f.question));
  const faqs = showAll ? faqItems : primaryFaqs;

  return (
    <section id="waitlist" className="bg-ivory py-12 pb-28">
      <Container>
        <ChapterLabel n="04" label="EARLY ACCESS" />
        <h2 className="headline-lg text-graphite">
          Help shape {brand.shortName}.
        </h2>
        <p className="mt-2 text-[15px] leading-relaxed text-slate">
          We&apos;re validating what meaningful income protection should look
          like before taking the product to insurers.
        </p>
        <ul className="mt-4 flex flex-wrap gap-x-3 gap-y-1 text-[12px] text-slate">
          <li>No payment required</li>
          <li className="text-border" aria-hidden>
            ·
          </li>
          <li>No financial documents</li>
          <li className="text-border" aria-hidden>
            ·
          </li>
          <li>Privacy-first</li>
        </ul>

        <div className="mt-6">
          <EarlyAccessCard />
        </div>

        <div className="mt-10 border-t border-border pt-2">
          <p className="py-3 text-sm font-semibold text-graphite">Questions?</p>
          {faqs.map((item) => (
            <AccordionItem key={item.question} title={item.question}>
              <p className="text-sm leading-relaxed text-slate">{item.answer}</p>
            </AccordionItem>
          ))}
          {!showAll ? (
            <button
              type="button"
              className="mt-3 text-sm text-navy-light underline-offset-2 hover:underline"
              onClick={() => setShowAll(true)}
            >
              View all FAQs →
            </button>
          ) : null}
        </div>

        <p className="mt-6 text-[11px] leading-relaxed text-slate">
          {brand.marketValidationDisclaimer}
        </p>
      </Container>
    </section>
  );
}
