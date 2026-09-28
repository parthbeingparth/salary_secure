import Link from "next/link";
import { brand } from "@/lib/brand";
import { Section } from "@/components/ui/Layout";

const footerLinks = [
  { href: "/methodology", label: "Methodology" },
  { href: "/methodology#sources", label: "Sources" },
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
  { href: "/contact", label: "Contact" },
];

const trustStrip = [
  "Source-backed data",
  "Transparent methodology",
  "No payment required",
  "Privacy-first",
];

export function Footer() {
  return (
    <Section as="footer" className="border-t border-border !pt-8 !pb-28 md:!pb-10">
      <ul className="mb-8 flex flex-wrap gap-x-5 gap-y-2 text-[12px] text-slate">
        {trustStrip.map((item) => (
          <li
            key={item}
            className="after:ml-5 after:text-border after:content-['·'] last:after:content-none"
          >
            {item}
          </li>
        ))}
      </ul>

      <div className="flex flex-col gap-6 md:flex-row md:justify-between">
        <div className="max-w-md">
          <p className="text-[12px] font-semibold tracking-[0.18em] text-graphite leading-tight">
            <span className="block">{brand.nameLines[0]}</span>
            <span className="block text-navy-light">{brand.nameLines[1]}</span>
          </p>
          <p className="mt-2 text-sm text-slate">{brand.descriptor}</p>
        </div>
        <nav
          className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted"
          aria-label="Footer"
        >
          {footerLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
      <p className="mt-6 max-w-3xl text-xs leading-relaxed text-muted">
        {brand.marketValidationDisclaimer} {brand.regulatoryDisclaimer}
      </p>
    </Section>
  );
}
