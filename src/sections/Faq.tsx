"use client";

import { useState } from "react";
import { faqItems } from "@/data/faq";
import { Section } from "@/components/ui/Layout";

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <Section id="faq" className="bg-paper">
      <div className="mx-auto max-w-2xl">
        <h2 className="headline-lg text-center text-graphite">FAQ</h2>
        <div className="mt-10 divide-y divide-border border-y border-border">
          {faqItems.map((item, i) => {
            const isOpen = open === i;
            const panelId = `faq-panel-${i}`;
            const buttonId = `faq-button-${i}`;
            return (
              <div key={item.question}>
                <h3>
                  <button
                    id={buttonId}
                    type="button"
                    className="flex w-full cursor-pointer items-start justify-between gap-4 py-5 text-left hover:text-navy"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpen(isOpen ? null : i)}
                  >
                    <span className="text-[15px] font-medium text-graphite md:text-base">
                      {item.question}
                    </span>
                    <span className="text-slate" aria-hidden>
                      {isOpen ? "−" : "+"}
                    </span>
                  </button>
                </h3>
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  hidden={!isOpen}
                  className={isOpen ? "block" : "hidden"}
                >
                  <p className="pb-5 text-sm leading-relaxed text-slate">
                    {item.answer}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Section>
  );
}
