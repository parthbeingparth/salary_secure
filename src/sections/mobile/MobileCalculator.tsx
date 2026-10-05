"use client";

import { SalaryQuote } from "@/components/SalaryQuote";
import { Container } from "@/components/ui/Layout";
import { ChapterLabel } from "./MobileUi";

export function MobileCalculator() {
  return (
    <section id="calculator" className="bg-paper py-12 pb-32">
      <Container>
        <ChapterLabel n="02" label="SALARY INSURANCE" />
        <SalaryQuote variant="mobile" />
      </Container>
    </section>
  );
}
