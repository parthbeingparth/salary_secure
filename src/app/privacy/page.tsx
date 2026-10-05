import type { Metadata } from "next";
import Link from "next/link";
import { brand } from "@/lib/brand";
import { Container } from "@/components/ui/Layout";

export const metadata: Metadata = {
  title: `Privacy — ${brand.shortName}`,
  description: `How ${brand.shortName} handles waitlist data during market validation.`,
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen pb-16">
      <header className="border-b border-border bg-background">
        <Container className="flex h-14 items-center justify-between">
          <Link
            href="/"
            className="text-sm font-semibold tracking-[0.14em]"
          >
            {brand.name}
          </Link>
          <Link href="/" className="text-sm text-muted hover:text-foreground">
            ← Back
          </Link>
        </Container>
      </header>

      <Container className="max-w-3xl py-12 prose-like">
        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
          Privacy
        </h1>
        <p className="mt-4 text-sm text-muted">
          Last updated: September 28, 2026 · Contact:{" "}
          <a
            href={`mailto:${brand.contactEmail}`}
            className="text-accent underline-offset-2 hover:underline"
          >
            {brand.contactEmail}
          </a>
        </p>

        <div className="mt-8 space-y-6 text-sm leading-relaxed text-muted">
          <section>
            <h2 className="text-lg font-semibold text-foreground">
              What this site is
            </h2>
            <p className="mt-2">
              {brand.shortName} is a market-validation initiative exploring
              demand for proposed layoff income protection for India&apos;s tech
              workforce. We do not presently offer an insurance policy.{" "}
              {brand.regulatoryDisclaimer}
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">
              What we collect
            </h2>
            <p className="mt-2">
              If you join early access or send a contact note, we may collect:
              name; email; optional WhatsApp number and consent (only if you
              choose to share it); calculator/research metadata such as monthly
              take-home, selected plan, protection duration, and estimated
              annual cost; referral and UTM parameters; and free-text messages
              you send via the contact form.
            </p>
            <p className="mt-2">
              Name and email are required for early access. WhatsApp is optional
              and never pre-checked.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">
              What we do not collect during validation
            </h2>
            <p className="mt-2">
              We do not collect Aadhaar, PAN, bank account details, salary slips,
              EPFO data, or other financial documents on this site.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">
              Why we collect it
            </h2>
            <p className="mt-2">
              To validate whether Indian technology professionals want this
              product, understand coverage and pricing preferences, and send
              launch updates you consent to.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">
              Storage & security
            </h2>
            <p className="mt-2">
              Early-access and contact submissions are stored via our hosting
              provider&apos;s form service (Netlify Forms). Credentials and
              private API keys are never exposed to the browser. We use a
              honeypot field, basic validation, and provider spam filtering.
              A lightweight math check may appear before submit as extra UX
              friction — it is not the primary security control.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">
              Sharing
            </h2>
            <p className="mt-2">
              We do not sell your information. We may use service providers
              (hosting, form storage, email notifications, analytics) solely to
              operate this validation site.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">Contact</h2>
            <p className="mt-2">
              Questions:{" "}
              <a
                href={`mailto:${brand.contactEmail}`}
                className="text-accent underline-offset-2 hover:underline"
              >
                {brand.contactEmail}
              </a>
            </p>
          </section>
        </div>
      </Container>
    </main>
  );
}
