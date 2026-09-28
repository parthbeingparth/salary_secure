import type { Metadata } from "next";
import Link from "next/link";
import { brand } from "@/lib/brand";
import { Container } from "@/components/ui/Layout";
import { ContactForm } from "@/components/ContactForm";

export const metadata: Metadata = {
  title: `Contact — ${brand.shortName}`,
  description: `Contact the ${brand.shortName} team about the market-validation concept.`,
};

export default function ContactPage() {
  return (
    <main className="min-h-screen pb-16">
      <header className="border-b border-border bg-background">
        <Container className="flex h-14 items-center justify-between">
          <Link
            href="/"
            className="text-sm font-semibold tracking-[0.14em] text-foreground"
          >
            {brand.name}
          </Link>
          <Link href="/" className="text-sm text-muted hover:text-foreground">
            ← Back
          </Link>
        </Container>
      </header>

      <Container className="max-w-xl py-12">
        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
          Contact
        </h1>
        <p className="mt-3 text-muted leading-relaxed">
          Questions about Salary Secure, the waitlist, or our research? Send us
          a note.
        </p>

        <div className="mt-8">
          <ContactForm />
        </div>

        <p className="mt-8 text-xs leading-relaxed text-muted">
          {brand.marketValidationDisclaimer}
        </p>
      </Container>
    </main>
  );
}
