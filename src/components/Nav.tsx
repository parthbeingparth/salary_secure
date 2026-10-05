"use client";

import { useEffect, useState } from "react";
import { brand } from "@/lib/brand";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Layout";
import { useApp } from "@/components/AppProviders";

const desktopLinks = [
  { href: "why-salary-secure", label: "Why Salary Secure" },
  { href: "calculator", label: "Estimate" },
  { href: "how-it-works", label: "How It Works" },
  { href: "faq", label: "FAQ" },
];

const mobileLinks = [
  { href: "why-salary-secure", label: "Why Salary Secure" },
  { href: "how-it-works", label: "How It Works" },
  { href: "calculator", label: "Estimate" },
  { href: "waitlist", label: "Early Access" },
];

export function Nav() {
  const { scrollTo } = useApp();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        scrolled
          ? "border-b border-border/80 bg-paper/85 backdrop-blur-md shadow-[0_1px_0_rgba(7,29,43,0.04)]"
          : "border-b border-transparent bg-ivory/80 backdrop-blur-sm"
      }`}
    >
      <Container className="flex h-14 items-center justify-between gap-4 md:h-[4.25rem]">
        <a
          href="#top"
          className="group flex flex-col leading-tight"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        >
          <span className="text-[12px] font-semibold tracking-[0.2em] text-graphite sm:text-[13px]">
            {brand.nameLines[0]}
          </span>
          <span className="text-[12px] font-semibold tracking-[0.2em] text-navy-light sm:text-[13px]">
            {brand.nameLines[1]}
          </span>
          <span className="mt-0.5 hidden text-[9px] font-medium tracking-[0.16em] text-slate md:block">
            SALARY INSURANCE
          </span>
        </a>

        <nav className="hidden items-center gap-7 lg:flex" aria-label="Primary">
          {desktopLinks.map((link) => (
            <a
              key={link.href}
              href={`#${link.href}`}
              className="text-[13px] text-slate transition hover:text-graphite"
              onClick={(e) => {
                e.preventDefault();
                scrollTo(link.href);
              }}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button
            className="hidden sm:inline-flex"
            onClick={() => scrollTo("waitlist")}
          >
            Get Early Access
          </Button>
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border lg:hidden"
            aria-expanded={open}
            aria-label="Toggle menu"
            onClick={() => setOpen((v) => !v)}
          >
            <span aria-hidden className="text-lg leading-none">
              {open ? "×" : "☰"}
            </span>
          </button>
        </div>
      </Container>

      {open ? (
        <div className="border-t border-border bg-paper lg:hidden">
          <Container className="flex flex-col gap-1 py-3">
            {mobileLinks.map((link) => (
              <a
                key={link.href}
                href={`#${link.href}`}
                className="rounded-lg px-3 py-3 text-sm text-foreground hover:bg-black/[0.03]"
                onClick={(e) => {
                  e.preventDefault();
                  setOpen(false);
                  scrollTo(link.href);
                }}
              >
                {link.label}
              </a>
            ))}
            <Button
              className="mt-2 w-full"
              onClick={() => {
                setOpen(false);
                scrollTo("waitlist");
              }}
            >
              Get Early Access
            </Button>
          </Container>
        </div>
      ) : null}
    </header>
  );
}
