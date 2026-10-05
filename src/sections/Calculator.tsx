"use client";

import { SalaryQuote } from "@/components/SalaryQuote";
import { Section } from "@/components/ui/Layout";

/** Unused on the live home experience; kept as an alias of the simplified quote. */
export function Calculator() {
  return (
    <Section id="calculator" className="bg-paper">
      <SalaryQuote variant="desktop" />
    </Section>
  );
}
