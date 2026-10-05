"use client";

import { SalaryQuote } from "@/components/SalaryQuote";
import { Section } from "@/components/ui/Layout";

export function DesktopProductStudio() {
  return (
    <Section id="calculator" className="bg-ivory !py-12 md:!py-16">
      <div className="mx-auto max-w-[1200px]">
        <SalaryQuote variant="desktop" />
      </div>
      <div id="plans" className="sr-only" aria-hidden />
    </Section>
  );
}
